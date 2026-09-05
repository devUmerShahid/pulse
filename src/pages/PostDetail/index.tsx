// src/pages/PostDetail/index.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { usePostDetail } from './hooks/usePostDetail';
import { subscribeToEvent } from '../../services/socket';
import { formatRelativeTime } from '../../utils/time';
import CommentItem from './components/CommentItem';
import ShareDropdown from './components/ShareDropdown';
import PostContent from '../../components/PostContent';
import BookmarkButton from '../../components/BookmarkButton';
import LikeButton from '../../components/LikeButton';
import DeletePostButton from '../../components/DeletePostButton';
import PulseLoader from '../../components/PulseLoader';
import RightSidebar from '../../components/RightSidebar';
import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import type { Comment } from '../../api/comment.api';

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const {
    post, isLoading, error,
    commentText, setCommentText,
    replyToId, replyText, setReplyText,
    handleCommentSubmit,
    handleStartReply, handleCancelReply, handleSubmitReply,
  } = usePostDetail(postId);

  const [displayPost, setDisplayPost] = useState(post);
  const [displayComments, setDisplayComments] = useState<Comment[]>(post?.comments || []);

  // Update displayPost when post changes from API
  useEffect(() => {
    if (post) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        setDisplayComments((prevComments: any) => [...prevComments, eventData.comment]);
        
        // Update comment count
        if (setDisplayPost) {
          setDisplayPost((prev: any) => ({
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
          setDisplayPost((prev: any) => ({
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
        
        if (setDisplayPost) {
          setDisplayPost((prev: any) => ({
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
        if (setDisplayPost) {
          setDisplayPost((prev: any) => ({
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
  }, [postId]);

  // ✅ LISTEN TO POST DELETION — if this post is deleted (by anyone), leave the page
  useEffect(() => {
    if (!postId) return;

    const cleanup = subscribeToEvent('POST_DELETED', (eventData: { postId?: string }) => {
      if (eventData?.postId === postId) navigate('/feed');
    });

    return cleanup;
  }, [postId, navigate]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8f9fa] md:pl-64 flex items-center justify-center text-gray-900">
      <Sidebar />
      <PulseLoader size="lg" label="Loading Post..." />
    </div>
  );

  if (error || !displayPost) return (
    <div className="min-h-screen bg-[#f8f9fa] md:pl-64 flex items-center justify-center text-gray-900">
      <Sidebar />
      <div className="text-center">
        <p className="text-red-500 font-medium">Post not found</p>
        <button onClick={() => navigate('/feed')} className="mt-4 text-indigo-600 font-bold hover:underline cursor-pointer">
          ← Back to Feed
        </button>
      </div>
    </div>
  );

  // Format exact date like "10:42 AM · Oct 24, 2023"
  const exactDate = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(displayPost.createdAt));

  return (
    <div className="min-h-screen bg-white text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex gap-6">
        <div className="flex-1 max-w-2xl mx-auto border-x border-gray-100 min-h-screen">
          
          {/* Header */}
          <div className="px-6 flex items-center gap-6 sticky top-14 bg-white/95 backdrop-blur-md z-50 py-3 md:top-0">
            <button onClick={() => navigate(-1)} className="text-gray-900 hover:bg-gray-100 p-2 rounded-full transition cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <h1 className="text-[20px] font-bold">Post</h1>
            <DeletePostButton
              postId={displayPost.id}
              postUserId={displayPost.user.id}
              queryKey={['post', postId]}
              onDeleted={() => navigate('/feed')}
              className="ml-auto"
            />
          </div>

          <div className="px-6 pt-3 pb-6">
            {/* Post Header */}
            <div className="flex gap-3 items-center cursor-pointer mb-4" onClick={() => navigate(`/profile/${displayPost.user.username}`)}>
              <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden">
                {displayPost.user.avatar ? (
                  <img src={displayPost.user.avatar} alt={displayPost.user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-gray-500">{(displayPost.user.name || displayPost.user.username).charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[15px] hover:underline">{displayPost.user.name || displayPost.user.username}</span>
                  <svg className="w-4 h-4 text-[#5c5cff]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79-.45-.51-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68s-1.28.23-1.79.68c-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79.45.51.68 1.11.68 1.79s.23 1.28.68 1.79c-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79.51.45 1.11.68 1.79.68.68 0 1.28-.23 1.79-.68.51.45 1.11.68 1.79.68.68 0 1.28-.23 1.79-.68.51.45 1.11.68 1.79.68.68 0 1.28-.23 1.79-.68.51.45 1.11.68 1.79.68.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79zm-12.83 4.31L5.55 12.7l1.7-1.7 2.42 2.41 6.59-6.59 1.7 1.7-8.29 8.29z"/></svg>
                </div>
                <div className="text-gray-500 text-[15px]">
                  @{displayPost.user.username} · {formatRelativeTime(displayPost.createdAt)}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-[17px] leading-relaxed text-gray-900 mb-4">
              <PostContent content={displayPost.content} />
            </div>

            {/* Image */}
            {displayPost.imageUrl && (
              <img src={displayPost.imageUrl} alt="Post" className="rounded-2xl w-full object-cover border border-gray-100 max-h-[500px] mb-4" />
            )}

            {/* Date */}
            <div className="text-gray-500 text-[15px] mb-4 font-medium">
              <span>{exactDate.replace(',', ' ·')}</span>
            </div>

            {/* Stats Row */}
            <div className="border-y border-gray-200 py-3.5 flex gap-6 text-[15px]">
              <div>
                <span className="font-bold text-gray-900">{displayPost._count?.likes || 0}</span> <span className="text-gray-500">Likes</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">{displayPost._count?.bookmarks || 0}</span> <span className="text-gray-500">Bookmarks</span>
              </div>
            </div>

            {/* Action Icons Row */}
            <div className="flex justify-between items-center py-3.5 text-gray-500 border-b border-gray-200">
              <button onClick={() => document.getElementById('comment-input')?.focus()} className="p-2 hover:text-[#5c5cff] hover:bg-[#5c5cff]/10 rounded-full transition cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </button>
              <LikeButton
                postId={postId!}
                isLiked={displayPost.isLiked}
                likeCount={displayPost._count?.likes}
                queryKey={['post', postId]}
                showCount={false}
                size={20}
                className="p-2 hover:text-pink-500 hover:bg-pink-500/10 rounded-full"
              />
              <BookmarkButton
                postId={postId!}
                isBookmarked={displayPost.isBookmarked}
                bookmarkCount={displayPost._count?.bookmarks}
                queryKey={['post', postId]}
                showCount={false}
                size={20}
                className="p-2 hover:text-blue-500 hover:bg-blue-500/10 rounded-full"
              />
              <div onClick={(e) => e.stopPropagation()} className="p-2 hover:text-[#5c5cff] hover:bg-[#5c5cff]/10 rounded-full transition cursor-pointer">
                <ShareDropdown postId={postId!} postContent={displayPost.content} postAuthor={displayPost.user.username} />
              </div>
            </div>

            {/* Comment Input */}
            <div className="pt-6 pb-2">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden">
                  <span className="font-bold text-gray-500">U</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-[13px] text-gray-500 mb-1">
                    Replying to <span className="text-[#5c5cff] hover:underline cursor-pointer">@{displayPost.user.username}</span>
                  </div>
                  <input
                    id="comment-input"
                    type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Post your reply..."
                    className="w-full bg-transparent text-[17px] text-gray-900 outline-none placeholder-gray-400 py-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  />
                  
                  <div className="flex flex-wrap items-center justify-between mt-4">
                    <div className="flex gap-2 text-[#5c5cff]">
                      <button className="p-2 hover:bg-[#5c5cff]/10 rounded-full transition">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </button>
                      <button className="p-2 hover:bg-[#5c5cff]/10 rounded-full transition">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                      </button>
                      <button className="p-2 hover:bg-[#5c5cff]/10 rounded-full transition">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </button>
                      <button className="p-2 hover:bg-[#5c5cff]/10 rounded-full transition">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </button>
                    </div>
                    <button onClick={handleCommentSubmit} disabled={!commentText.trim()} className="bg-[#5c5cff] hover:bg-[#4a4ae6] text-white px-5 py-2 rounded-full text-[15px] font-bold disabled:opacity-50 transition cursor-pointer">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 mt-2 mb-2"></div>

            {/* Comments List */}
            <div>
              {displayComments?.length > 0 ? (
                <div>
                  {displayComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} depth={0}
                      activeReplyId={replyToId} replyText={replyText} onReplyTextChange={setReplyText}
                      onStartReply={handleStartReply} onCancelReply={handleCancelReply} onSubmitReply={handleSubmitReply}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Trending Sidebar */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-8">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostDetail;