// src/pages/Bookmarks/index.tsx
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useBookmarks } from './hooks/useBookmarks';
import { formatRelativeTime } from '../../utils/time';
import PostContent from '../../components/PostContent';
import BookmarkButton from '../../components/BookmarkButton';
import LikeButton from '../../components/LikeButton';
import DeletePostButton from '../../components/DeletePostButton';
import PulseLoader from '../../components/PulseLoader';
import ShareDropdown from '../PostDetail/components/ShareDropdown';
import RightSidebar from '../../components/RightSidebar';

/**
 * Shows the current user's saved posts.
 * Un-saving a post from here invalidates the `['bookmarks']` query, so the
 * post disappears from the list immediately (no socket events — bookmarks are
 * personal data, not broadcast).
 */
const Bookmarks = () => {
  const navigate = useNavigate();
  const { posts, isLoading, error } = useBookmarks();

  const openPostDetail = (postId: string) => navigate(`/post/${postId}`);

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <PulseLoader size="lg" label="Loading bookmarks..." />
    </div>
  );
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">Failed to load bookmarks</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Center column */}
        <main className="flex-1 max-w-2xl mx-auto">
          <div className="bg-white">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center bg-white sticky top-14 z-10 md:top-0 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Bookmarks</h2>
            </div>

            {/* Posts list */}
            <div>
              {posts.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <div className="text-3xl mb-3">🔖</div>
                  <p className="font-medium text-gray-700">No bookmarks yet</p>
                  <p className="text-sm mt-1">Tap the bookmark icon on any post to save it here.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <article key={post.id} className="px-6 py-6 border-t-1 border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => openPostDetail(post.id)}>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                        {post.user.avatar ? (
                          <img src={post.user.avatar} alt={post.user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-600 font-bold text-lg">
                            {(post.user.name || post.user.username).charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{post.user.name || post.user.username}</div>
                            <div className="text-xs text-gray-500">@{post.user.username} · {formatRelativeTime(post.createdAt)}</div>
                          </div>
                          <DeletePostButton postId={post.id} postUserId={post.user.id} queryKey={['bookmarks']} />
                        </div>

                        <div className="mt-3 text-gray-800"><PostContent content={post.content} /></div>

                        {post.imageUrl && (
                          <div className="mt-4">
                            <img src={post.imageUrl} alt="Post" className="w-full rounded-xl object-cover border border-gray-200" />
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-500 text-sm">
                          <LikeButton postId={post.id} isLiked={post.isLiked} likeCount={post._count?.likes ?? 0} queryKey={['bookmarks']} className="hover:text-pink-500" />
                          <button onClick={(e) => { e.stopPropagation(); openPostDetail(post.id); }} className="flex items-center gap-2 hover:text-indigo-500 transition">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>{post._count?.comments ?? 0}</span>
                          </button>
                          <BookmarkButton postId={post.id} isBookmarked={post.isBookmarked} bookmarkCount={post._count?.bookmarks} queryKey={['bookmarks']} />
                          <div onClick={(e) => e.stopPropagation()}><ShareDropdown postId={post.id} postContent={post.content} postAuthor={post.user.username} /></div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Bookmarks;
