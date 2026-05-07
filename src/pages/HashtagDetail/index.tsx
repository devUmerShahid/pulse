import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHashtagPosts } from '../../hooks/useHashtagPosts';
import { formatRelativeTime } from '../../utils/time';
import PostContent from '../../components/PostContent';
import ShareDropdown from '../PostDetail/components/ShareDropdown';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeAPI, commentAPI } from '../../api';

/**
 * Display all posts for a specific hashtag
 * Shows hashtag name, post count, and all related posts
 */
const HashtagDetail: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { posts, isLoading, error } = useHashtagPosts(hashtag);

  const likeMutation = useMutation({
    mutationFn: likeAPI.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hashtag-posts', hashtag] });
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const openPostDetail = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-zinc-400">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error || !hashtag) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Hashtag not found</p>
          <button
            onClick={() => navigate('/trends')}
            className="text-blue-500 hover:underline cursor-pointer transition"
          >
            ← Back to Trends
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/trends')}
            className="text-xl hover:text-blue-500 transition cursor-pointer"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold">#{hashtag}</h1>
            <div className="text-zinc-500 text-xs">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="mb-4">No posts with #{hashtag} yet</p>
            <button
              onClick={() => navigate('/create-post')}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Be the first to post
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border-b border-zinc-800 px-4 py-6 hover:bg-zinc-950/50 transition cursor-pointer"
              onClick={() => openPostDetail(post.id)}
            >
              {/* Avatar + Info */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {post.user.name || post.user.username}
                  </div>
                  <div className="text-zinc-500 text-sm">
                    @{post.user.username} · {formatRelativeTime(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Content with hashtag links */}
              <div className="mt-3">
                <PostContent content={post.content} />
              </div>

              {/* Image */}
              {post.imageUrl && (
                <div className="mt-4">
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="rounded-2xl w-full object-cover border border-zinc-800 max-h-80"
                  />
                </div>
              )}

              {/* Action Bar */}
              <div className="flex justify-between mt-5 text-zinc-500 text-sm max-w-md">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer"
                >
                  ❤️ {post._count.likes}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openPostDetail(post.id);
                  }}
                  className="flex items-center gap-2 hover:text-blue-500 transition cursor-pointer"
                >
                  💬 {post._count.comments}
                </button>
                <ShareDropdown
                  postId={post.id}
                  postContent={post.content}
                  postAuthor={post.user.username}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HashtagDetail;
