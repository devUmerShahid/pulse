// src/pages/PostDetail/index.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postAPI, commentAPI, likeAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/time';

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  // Fetch single post with comments
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postAPI.getPostById(postId!),
    enabled: !!postId,
  });

  const post = data?.post;

  // Like Post
  const likeMutation = useMutation({
    mutationFn: () => likeAPI.toggleLike(postId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post', postId] }),
  });

  // Add Comment / Reply
  const addCommentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
      commentAPI.addComment(postId!, content, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      setCommentText('');
      setReplyToId(null);
    },
  });

  const handleLike = () => likeMutation.mutate();

  const handleCommentSubmit = () => {
    if (!commentText.trim() || !postId) return;
    addCommentMutation.mutate({ 
      content: commentText, 
      parentId: replyToId || undefined 
    });
  };

  const startReply = (commentId: string) => {
    setReplyToId(commentId);
    // Optional: scroll to comment input
  };

  const cancelReply = () => {
    setReplyToId(null);
    setCommentText('');
  };

  if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading post...</div>;
  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Post not found</p>
          <button onClick={() => navigate('/feed')} className="mt-4 text-blue-500 underline">
            ← Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4 flex items-center gap-4 sticky top-0 bg-black z-50">
        <button onClick={() => navigate('/feed')} className="text-2xl">←</button>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Post Header */}
        <div 
          className="flex gap-4 cursor-pointer"
          onClick={() => navigate(`/profile/${post.user.id}`)}
        >
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0" />
          <div>
            <div className="font-bold hover:underline">{post.user.name || post.user.username}</div>
            <div className="text-zinc-500">@{post.user.username}</div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-4 text-[17px] leading-relaxed">
          {post.content}
        </div>

        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="mt-4 rounded-2xl w-full object-cover border border-zinc-800"
          />
        )}

        {/* Time */}
        <div className="text-zinc-500 text-sm mt-4">
          {formatRelativeTime(post.createdAt)}
        </div>

        {/* Action Bar */}
        <div className="flex gap-8 mt-6 text-zinc-500 border-t border-b border-zinc-800 py-4">
          <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500">
            ❤️ {post._count.likes}
          </button>
          
          <button className="flex items-center gap-2 hover:text-blue-500">
            💬 {post._count.comments}
          </button>
          
          <button className="flex items-center gap-2 hover:text-green-500">
            🔁 Share
          </button>
        </div>

        {/* Comment Input */}
        <div className="mt-8 flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyToId ? "Write a reply..." : "Add your comment..."}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-sm focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!commentText.trim()}
            className="bg-blue-600 px-6 rounded-full text-sm font-medium disabled:opacity-50"
          >
            {replyToId ? 'Reply' : 'Post'}
          </button>
          {replyToId && (
            <button onClick={cancelReply} className="text-zinc-500 text-sm">Cancel</button>
          )}
        </div>

        {/* Comments List */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-6">Comments ({post._count.comments})</h3>

          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-8">
              {post.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-9 h-9 bg-zinc-700 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.user.name || comment.user.username}</span>
                      <span className="text-zinc-500 text-sm">@{comment.user.username}</span>
                      <span className="text-zinc-500 text-sm">·</span>
                      <span className="text-zinc-500 text-sm">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-[15px] text-zinc-300">{comment.content}</p>

                    {/* Reply Button */}
                    <button 
                      onClick={() => setReplyToId(comment.id)}
                      className="text-blue-500 text-sm mt-2 hover:underline"
                    >
                      Reply
                    </button>

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-8 space-y-4 border-l border-zinc-700 pl-4">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-7 h-7 bg-zinc-600 rounded-full flex-shrink-0" />
                            <div>
                              <span className="font-medium text-sm">{reply.user.name || reply.user.username}</span>
                              <span className="text-zinc-500 text-xs ml-2">@{reply.user.username}</span>
                              <p className="text-sm text-zinc-300 mt-0.5">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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