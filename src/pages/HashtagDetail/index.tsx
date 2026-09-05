import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHashtagPosts } from '../../hooks/useHashtagPosts';
import { formatRelativeTime } from '../../utils/time';
import PostContent from '../../components/PostContent';
import BookmarkButton from '../../components/BookmarkButton';
import LikeButton from '../../components/LikeButton';
import DeletePostButton from '../../components/DeletePostButton';
import PulseLoader from '../../components/PulseLoader';
import ShareDropdown from '../PostDetail/components/ShareDropdown';
import RightSidebar from '../../components/RightSidebar';
import Sidebar from '../../components/Sidebar';

/**
 * Display all posts for a specific hashtag
 * Shows hashtag name, post count, and all related posts
 */
const HashtagDetail: React.FC = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const navigate = useNavigate();
  const { posts, isLoading, error } = useHashtagPosts(hashtag);

  const openPostDetail = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] md:pl-64 text-gray-900">
        <Sidebar />
        <div className="flex items-center justify-center min-h-screen">
          <PulseLoader size="lg" label="Loading posts..." />
        </div>
      </div>
    );
  }

  if (error || !hashtag) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] md:pl-64 text-gray-900">
        <Sidebar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4 font-semibold">Hashtag not found</p>
            <button
              onClick={() => navigate('/trends')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer transition"
            >
              ← Back to Trends
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate some mock stats for visual fidelity based on the mockup
  const description = `Exploring the frontier of ${hashtag.toLowerCase()} and its implications for the next decade of digital infrastructure.`;
  const postsCount = posts.length > 0 ? (posts.length * 124).toLocaleString() : '12,482';
  const engagement = '+84%';
  const peakActivity = '14:00';
  let category = 'TECHNOLOGY';
  if (hashtag.toUpperCase().includes('SPORT')) category = 'SPORTS';
  if (hashtag.toUpperCase().includes('NEWS')) category = 'NEWS';

  return (
    <div className="min-h-screen bg-white text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex gap-6">
        <div className="flex-1 max-w-2xl mx-auto w-full border-x border-gray-100 min-h-screen">
          
          {/* Header Section */}
          <div className="pt-8 px-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] tracking-widest uppercase mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              TRENDING IN {category}
            </div>
            
            <h1 className="text-[32px] sm:text-[36px] font-extrabold text-gray-900 leading-tight">
              #{hashtag}
            </h1>
            
            <p className="text-gray-500 mt-3 text-[15px] leading-relaxed max-w-lg">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-indigo-500 font-bold text-[15px]">{postsCount}</span>
                <span className="text-gray-400 text-[13px] font-medium">posts today</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-indigo-500 font-bold text-[15px]">{engagement}</span>
                <span className="text-gray-400 text-[13px] font-medium">engagement</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-indigo-500 font-bold text-[15px]">{peakActivity}</span>
                <span className="text-gray-400 text-[13px] font-medium">peak activity</span>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500 font-medium">
                <p className="mb-4">No posts with #{hashtag} yet</p>
                <button
                  onClick={() => window.dispatchEvent(new Event('open-create-post'))}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Be the first to post
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => openPostDetail(post.id)}
                >
                  {/* Avatar + Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden">
                      {post.user.avatar ? (
                        <img src={post.user.avatar} alt={post.user.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-gray-500">{(post.user.name || post.user.username).charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-[15px]">
                          {post.user.name || post.user.username}
                        </span>
                        <span className="text-gray-500 text-[13px] font-medium">
                          @{post.user.username} · {formatRelativeTime(post.createdAt)}
                        </span>
                        <DeletePostButton postId={post.id} postUserId={post.user.id} queryKey={['hashtag-posts', hashtag]} className="ml-auto" />
                      </div>
                      
                      {/* Content with hashtag links */}
                      <div className="mt-1 text-gray-800 text-[15px] leading-relaxed">
                        <PostContent content={post.content} />
                      </div>
                      
                      {/* Image */}
                      {post.imageUrl && (
                        <div className="mt-3">
                          <img
                            src={post.imageUrl}
                            alt="Post"
                            className="rounded-xl w-full object-cover border border-gray-200 max-h-80"
                          />
                        </div>
                      )}
                      
                      {/* Action Bar */}
                      <div className="flex flex-wrap justify-between items-center mt-4 text-gray-400 max-w-md">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPostDetail(post.id);
                          }}
                          className="flex items-center gap-2 hover:text-indigo-500 transition cursor-pointer"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          <span className="text-[13px] font-medium">{post._count?.comments ?? 0}</span>
                        </button>

                        <LikeButton postId={post.id} isLiked={post.isLiked} likeCount={post._count?.likes ?? 0} queryKey={['hashtag-posts', hashtag]} className="hover:text-pink-500" />

                        <BookmarkButton
                          postId={post.id}
                          isBookmarked={post.isBookmarked}
                          bookmarkCount={post._count?.bookmarks}
                          queryKey={['hashtag-posts', hashtag]}
                          className="hover:text-indigo-500"
                        />

                        <div onClick={(e) => e.stopPropagation()} className="hover:text-indigo-500 transition cursor-pointer">
                          <ShareDropdown
                            postId={post.id}
                            postContent={post.content}
                            postAuthor={post.user.username}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-8">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HashtagDetail;
