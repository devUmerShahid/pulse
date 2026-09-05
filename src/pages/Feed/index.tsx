/* eslint-disable @typescript-eslint/no-explicit-any */

// src/pages/Feed/index.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useFeed } from './hooks/useFeed';
import { subscribeToEvent } from '../../services/socket';
import { formatRelativeTime } from '../../utils/time';
import ShareDropdown from '../PostDetail/components/ShareDropdown';
import PostContent from '../../components/PostContent';
import BookmarkButton from '../../components/BookmarkButton';
import LikeButton from '../../components/LikeButton';
import DeletePostButton from '../../components/DeletePostButton';
import PulseLoader from '../../components/PulseLoader';
import RightSidebar from '../../components/RightSidebar';

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { posts, isLoading, error, handleAddComment } = useFeed();

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [displayPosts, setDisplayPosts] = useState(posts);

  // Sync displayPosts whenever the API query result (posts) changes
  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

  // displayPosts is initialized from `posts` state; updates via socket events

  useEffect(() => {
    const handlePostCreated = (eventData: unknown) => {
      const ev = eventData as any;
      if (!ev?.post) return;
      const newPost = {
        ...ev.post,
        _count: ev.post._count || { likes: 0, comments: 0 }
      };
      setDisplayPosts((prev) => [newPost, ...prev]);
    };
    const handlePostLiked = (eventData: unknown) => {
      const ev = eventData as any;
      const postId = ev?.postId;
      const likeCount = ev?.newLikeCount ?? ev?.likeCount;
      if (!postId || likeCount == null) return;
      setDisplayPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, _count: { ...p._count, likes: likeCount } } : p)));
    };
    const handlePostUnliked = (e: unknown) => handlePostLiked(e);
    const handleCommentCreated = (eventData: unknown) => {
      const ev = eventData as any;
      const postId = ev?.postId;
      if (!postId) return;
      setDisplayPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, _count: { ...p._count, comments: (p._count?.comments || 0) + 1 } } : p)));
    };
    const handleCommentRemoved = (eventData: unknown) => {
      const ev = eventData as any;
      const postId = ev?.postId;
      if (!postId) return;
      setDisplayPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, _count: { ...p._count, comments: Math.max(0, (p._count?.comments || 1) - 1) } } : p)));
    };
    const handlePostDeleted = (eventData: unknown) => {
      const ev = eventData as any;
      const postId = ev?.postId;
      if (!postId) return;
      setDisplayPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    if (displayPosts.length > 0 || posts.length > 0) {
      const a = subscribeToEvent('POST_CREATED', handlePostCreated);
      const b = subscribeToEvent('POST_LIKED', handlePostLiked);
      const c = subscribeToEvent('POST_UNLIKED', handlePostUnliked);
      const d = subscribeToEvent('COMMENT_CREATED', handleCommentCreated);
      const e = subscribeToEvent('COMMENT_REMOVED', handleCommentRemoved);
      const f = subscribeToEvent('POST_DELETED', handlePostDeleted);
      return () => {
        a(); b(); c(); d(); e(); f();
      };
    }
  }, [displayPosts.length, posts.length]);

  const handleCommentSubmit = (postId: string) => {
    if (!commentText.trim()) return;
    handleAddComment(postId, commentText);
    setCommentText('');
    setActiveCommentPostId(null);
  };

  const openPostDetail = (postId: string) => navigate(`/post/${postId}`);

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <PulseLoader size="lg" label="Loading Pulse..." />
    </div>
  );
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">Failed to load feed</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto  flex gap-6">
        {/* Center feed */}
        <main className="flex-1 max-w-2xl mx-auto">
          <div className="bg-white ">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center bg-white sticky top-14 z-10 md:top-0 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Home</h2>
              {/* <span className="text-indigo-600 text-xl cursor-pointer hover:bg-gray-100 p-2 rounded-full transition">✨</span> */}
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-around border-b border-gray-200 bg-white">
                <button className="flex-1 py-4 text-center font-bold text-gray-900 border-b-2 border-indigo-600 hover:bg-gray-50 transition relative">
                  For You
                  {/* The active blue bar can also be styled with an absolute div, but border-b-2 is fine */}
                </button>
                <button className="flex-1 py-4 text-center font-medium text-gray-500 hover:bg-gray-50 transition">
                  Following
                </button>
            </div>

            {/* Composer */}
            <div className="px-6 py-4 flex gap-4 border-b border-gray-200 bg-white">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-600 font-bold text-lg">
                    {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="What's happening?" 
                  className="w-full text-xl placeholder-gray-500 text-gray-900 bg-transparent outline-none py-2 mt-1 cursor-text"
                  onClick={() => window.dispatchEvent(new Event('open-create-post'))} 
                  readOnly
                />
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-4 text-indigo-500">
                    <button className="p-2 hover:bg-indigo-50 rounded-full transition cursor-pointer" aria-label="Image">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </button>
                    <button className="hidden sm:flex p-2 hover:bg-indigo-50 rounded-full transition cursor-pointer" aria-label="GIF">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9 11v2h2"></path><path d="M12 9v6"></path><path d="M16 9v6"></path><path d="M16 9h3"></path><path d="M16 12h2"></path><path d="M9 15c-1.5 0-2-1-2-3s.5-3 2-3 2 .5 2 1"></path></svg>
                    </button>
                    <button className="hidden sm:flex p-2 hover:bg-indigo-50 rounded-full transition cursor-pointer" aria-label="Poll">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    </button>
                    <button className="p-2 hover:bg-indigo-50 rounded-full transition cursor-pointer" aria-label="Emoji">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                    </button>
                    <button className="hidden sm:flex p-2 hover:bg-indigo-50 rounded-full transition cursor-pointer" aria-label="Schedule">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </button>
                  </div>
                  <button onClick={() => window.dispatchEvent(new Event('open-create-post'))} className="bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-1.5 rounded-full font-bold text-sm transition shadow-sm cursor-pointer">Pulse</button>
                </div>
              </div>
            </div>

            {/* Posts list */}
            <div>
              {displayPosts.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">No posts yet. Be the first to post!</div>
              ) : (
                displayPosts.map((post) => (
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
                          <DeletePostButton postId={post.id} postUserId={post.user.id} queryKey={['feed']} />
                        </div>

                        <div className="mt-3 text-gray-800"><PostContent content={post.content} /></div>

                        {post.imageUrl && (
                          <div className="mt-4">
                            <img src={post.imageUrl} alt="Post" className="w-full rounded-xl object-cover border border-gray-200" />
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-500 text-sm">
                          <LikeButton postId={post.id} isLiked={post.isLiked} likeCount={post._count?.likes ?? 0} queryKey={['feed']} className="hover:text-pink-500" />
                          <button onClick={(e) => { e.stopPropagation(); setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id); }} className="flex items-center gap-2 hover:text-indigo-500 transition">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>{post._count?.comments ?? 0}</span>
                          </button>
                          <BookmarkButton postId={post.id} isBookmarked={post.isBookmarked} bookmarkCount={post._count?.bookmarks} queryKey={['feed']} />
                          <div onClick={(e) => e.stopPropagation()}><ShareDropdown postId={post.id} postContent={post.content} postAuthor={post.user.username} /></div>
                        </div>

                        {activeCommentPostId === post.id && (
                          <div className="mt-4 flex gap-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add your comment..."
                              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
                              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                            />
                            <button onClick={() => handleCommentSubmit(post.id)} disabled={!commentText.trim()} className="bg-indigo-600 text-white px-4 py-2 rounded-full disabled:opacity-50">Post</button>
                          </div>
                        )}
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

export default Feed;