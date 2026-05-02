// src/pages/PostDetail/index.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { usePostDetail } from './hooks/usePostDetail';
import { formatRelativeTime } from '../../utils/time';
import CommentItem from './components/CommentItem';
import ShareDropdown from './components/ShareDropdown';

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

  if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center gap-3"><div className="w-5 h-5 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />Loading post...</div>;
  if (error || !post) return (
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

      <div className="max-w-2xl mx-auto p-4">
        {/* Post Header */}
        <div className="flex gap-3 items-center cursor-pointer" onClick={() => navigate(`/profile/${post.user.id}`)}>
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shrink-0" />
          <div>
            <div className="font-bold hover:underline">{post.user.name || post.user.username}</div>
            <div className="text-zinc-500 text-sm">@{post.user.username}</div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-4 text-[17px] leading-relaxed">{post.content}</div>
        {post.imageUrl && <img src={post.imageUrl} alt="Post" className="mt-4 rounded-2xl w-full object-cover border border-zinc-800" />}
        <div className="text-zinc-500 text-sm mt-4">{formatRelativeTime(post.createdAt)}</div>

        {/* Action Bar */}
        <div className="flex gap-8 mt-6 text-zinc-500 border-t border-b border-zinc-800 py-4">
          <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer">❤️ {post._count.likes}</button>
          <button className="flex items-center gap-2 hover:text-blue-500 transition cursor-pointer">💬 {post._count.comments}</button>
          <ShareDropdown postId={postId!} postContent={post.content} postAuthor={post.user.username} />
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
            Comments <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-0.5 rounded-full">{post._count.comments}</span>
          </h3>

          {post.comments?.length > 0 ? (
            <div>
              {post.comments.map((comment: any) => (
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
  );
};

export default PostDetail;