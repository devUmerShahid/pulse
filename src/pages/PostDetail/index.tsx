// src/pages/PostDetail/index.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { usePostDetail } from './hooks/usePostDetail';
import { subscribeToEvent } from '../../services/socket';
import { formatRelativeTime } from '../../utils/time';
import CommentItem from './components/CommentItem';
import ShareDropdown from './components/ShareDropdown';
import PostContent from '../../components/PostContent';
import TrendingBar from '../Trends/components/TrendingBar';
import { useEffect, useState } from 'react';

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const {
    post, isLoading, error,
    commentText, setCommentText,
    replyToId, replyText, setReplyText,
    handleLike, handleCommentSubmit,
    handleStartReply, handleCancelReply, handleSubmitReply,
  } = usePostDetail(postId);

  const [displayPost, setDisplayPost] = useState(post);
  const [displayComments, setDisplayComments] = useState(post?.comments || []);

  // Update displayPost when post changes from API
  useEffect(() => {
    if (post) {
      setDisplayPost(post);
      setDisplayComments(post.comments || []);
    }
  }, [post]);

  // ✅ LISTEN TO NEW COMMENTS (COMMENT_CREATED event from backend)
  useEffect(() => {
    if (!postId) return;

    const cleanup = subscribeToEvent('COMMENT_CREATED', (eventData) => {
      console.log('💬 New comment received');
      
      // Only update if comment is for THIS post
      if (eventData.postId === postId && eventData.comment) {
        setDisplayComments((prevComments) => [...prevComments, eventData.comment]);
        
        // Update comment count
        if (setDisplayPost) {
          setDisplayPost((prev) => ({
            ...prev,
            _count: {
              ...prev._count,
              comments: (prev._count.comments || 0) + 1,
            },
          }));
        }
      }
    });

    return cleanup;
  }, [postId]);

  // ✅ LISTEN TO DELETED COMMENTS (COMMENT_REMOVED event from backend)
  useEffect(() => {
    if (!postId) return;

    const cleanup = subscribeToEvent('COMMENT_REMOVED', (eventData) => {
      console.log('🗑️ Comment deleted');
      
      if (eventData.postId === postId && eventData.commentId) {
        // Remove deleted comment from list
        setDisplayComments((prevComments) =>
          prevComments.filter((c) => c.id !== eventData.commentId)
        );

        // Update comment count
        if (setDisplayPost) {
          setDisplayPost((prev) => ({
            ...prev,
            _count: {
              ...prev._count,
              comments: Math.max(0, (prev._count.comments || 1) - 1),
            },
          }));
        }
      }
    });

    return cleanup;
  }, [postId]);

  // ✅ LISTEN TO LIKE EVENTS
  useEffect(() => {
    if (!postId) return;

    const handlePostLiked = (eventData: any) => {
      if (eventData.postId === postId) {
        console.log('❤️ Post liked, new count:', eventData.newLikeCount);
        
        if (displayPost) {
          setDisplayPost((prev) => ({
            ...prev,
            _count: {
              ...prev._count,
              likes: eventData.newLikeCount,
            },
          }));
        }
      }
    };

    const handlePostUnliked = (eventData: any) => {
      if (eventData.postId === postId) {
        console.log('💔 Post unliked, new count:', eventData.newLikeCount);
        
        if (displayPost) {
          setDisplayPost((prev) => ({
            ...prev,
            _count: {
              ...prev._count,
              likes: eventData.newLikeCount,
            },
          }));
        }
      }
    };

    const cleanupLike = subscribeToEvent('POST_LIKED', handlePostLiked);
    const cleanupUnlike = subscribeToEvent('POST_UNLIKED', handlePostUnliked);

    return () => {
      cleanupLike();
      cleanupUnlike();
    };
  }, [postId, displayPost]);

  if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />Loading post...</div>;
  if (error || !displayPost) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500">Post not found</p>
        <button onClick={() => navigate('/feed')} className="mt-4 text-blue-500 underline cursor-pointer">
          ← Back to Feed
          </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4 flex items-center gap-4 sticky top-0 bg-black/85 backdrop-blur-md z-50">
        <button onClick={() => navigate('/feed')} className="text-xl hover:text-blue-500 transition cursor-pointer">←</button>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
      <div className="lg:col-span-2">
        <div className="max-w-2xl">
        {/* Post Header */}
        <div className="flex gap-3 items-center cursor-pointer" onClick={() => navigate(`/profile/${displayPost.user.id}`)}>
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shrink-0" />
          <div>
            <div className="font-bold hover:underline">{displayPost.user.name || displayPost.user.username}</div>
            <div className="text-zinc-500 text-sm">@{displayPost.user.username}</div>
          </div>
        </div>

        {/* Post Content */}
        <PostContent content={displayPost.content} className="mt-4" />
        {displayPost.imageUrl && <img src={displayPost.imageUrl} alt="Post" className="mt-4 rounded-2xl w-full object-cover border border-zinc-800" />}
        <div className="text-zinc-500 text-sm mt-4">{formatRelativeTime(displayPost.createdAt)}</div>

        {/* Action Bar */}
        <div className="flex gap-8 mt-6 text-zinc-500 border-t border-b border-zinc-800 py-4">
          <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer">❤️ {displayPost._count.likes}</button>
          <button className="flex items-center gap-2 hover:text-blue-500 transition cursor-pointer">💬 {displayPost._count.comments}</button>
          <ShareDropdown postId={postId!} postContent={displayPost.content} postAuthor={displayPost.user.username} />
        </div>

        {/* Comment Input */}
        <div className="mt-6 flex gap-3 items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shrink-0" />
          <input
            type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add your comment..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
          />
          <button onClick={handleCommentSubmit} disabled={!commentText.trim()} className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-full text-sm font-medium disabled:opacity-40 cursor-pointer transition whitespace-nowrap">
            Post
          </button>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            Comments <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-0.5 rounded-full">{displayPost._count.comments}</span>
          </h3>

          {displayComments?.length > 0 ? (
            <div>
              {displayComments.map((comment: Record<string, any>) => (
                <CommentItem key={comment.id} comment={comment} depth={0}
                  activeReplyId={replyToId} replyText={replyText} onReplyTextChange={setReplyText}
                  onStartReply={handleStartReply} onCancelReply={handleCancelReply} onSubmitReply={handleSubmitReply}
                />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-12">No comments yet. Be the first to comment!</p>
          )}
        </div>
        </div>
      </div>

      {/* Trending Sidebar - Desktop Only */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="sticky top-14">
          <TrendingBar />
        </div>
      </aside>
      </div>
    </div>
  );
};

export default PostDetail;