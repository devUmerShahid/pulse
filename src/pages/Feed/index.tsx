// src/pages/Feed/index.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFeed } from './hooks/useFeed';
import { subscribeToEvent } from '../../services/socket';
import { formatRelativeTime } from '../../utils/time';
import ShareDropdown from '../PostDetail/components/ShareDropdown';
import PostContent from '../../components/PostContent';
import TrendingBar from '../Trends/components/TrendingBar';

const Feed = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const { posts, isLoading, error, handleLike, handleAddComment } = useFeed();

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [displayPosts, setDisplayPosts] = useState(posts);

  // Update displayPosts when posts change from API
  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

  // ✅ LISTEN TO REAL-TIME FEED UPDATES
  useEffect(() => {
    const handlePostCreated = (eventData: any) => {
      if (!eventData?.post) return;
      console.log('✨ New post received:', eventData.post.content);
      setDisplayPosts((prevPosts) => [eventData.post, ...prevPosts]);
    };

    const handlePostLiked = (eventData: any) => {
      const postId = eventData?.postId;
      const likeCount = eventData?.newLikeCount ?? eventData?.likeCount;
      if (!postId || likeCount == null) return;

      setDisplayPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  likes: likeCount,
                },
              }
            : post
        )
      );
    };

    const handlePostUnliked = (eventData: any) => {
      handlePostLiked(eventData);
    };

    const handleCommentCreated = (eventData: any) => {
      const postId = eventData?.postId;
      if (!postId) return;
      setDisplayPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  comments: (post._count?.comments || 0) + 1,
                },
              }
            : post
        )
      );
    };

    const handleCommentRemoved = (eventData: any) => {
      const postId = eventData?.postId;
      if (!postId) return;
      setDisplayPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  comments: Math.max(0, (post._count?.comments || 1) - 1),
                },
              }
            : post
        )
      );
    };

    const cleanupPostCreated = subscribeToEvent('POST_CREATED', handlePostCreated);
    const cleanupPostLiked = subscribeToEvent('POST_LIKED', handlePostLiked);
    const cleanupPostUnliked = subscribeToEvent('POST_UNLIKED', handlePostUnliked);
    const cleanupCommentCreated = subscribeToEvent('COMMENT_CREATED', handleCommentCreated);
    const cleanupCommentRemoved = subscribeToEvent('COMMENT_REMOVED', handleCommentRemoved);

    return () => {
      cleanupPostCreated();
      cleanupPostLiked();
      cleanupPostUnliked();
      cleanupCommentCreated();
      cleanupCommentRemoved();
    };
  }, []);

  const handleCommentSubmit = (postId: string) => {
    if (!commentText.trim()) return;
    handleAddComment(postId, commentText);
    setCommentText('');
    setActiveCommentPostId(null);
  };

  const openPostDetail = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Pulse...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center"><span className="text-red-500">Failed to load feed</span></div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter">Pulse</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/trends')}
              className="px-4 py-2 text-sm border border-zinc-700 rounded-full hover:bg-zinc-900 hover:border-blue-500 cursor-pointer transition text-zinc-300 hover:text-blue-400"
            >
              🔍 Explore
            </button>
            <span className="text-sm text-zinc-400">@{user?.username}</span>
            <button onClick={logout} className="px-5 py-2 text-sm border border-zinc-700 rounded-full hover:bg-zinc-900 cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        {/* Create Post Button */}
        <div className="px-4 mb-6">
          <button
            onClick={() => navigate('/create-post')}
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-3xl font-semibold text-lg transition cursor-pointer"
          >
            What's happening?
          </button>
        </div>

        {displayPosts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No posts yet. Be the first to post!</div>
        ) : (
          displayPosts.map((post) => (
            <div
              key={post.id}
              className="border-b border-zinc-800 px-4 py-6 hover:bg-zinc-950/50 transition cursor-pointer"
              onClick={() => openPostDetail(post.id)}
            >
              {/* Avatar + Name + Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-white">{post.user.name || post.user.username}</div>
                  <div className="text-zinc-500 text-sm mt-0.5">
                    @{post.user.username} · {formatRelativeTime(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <PostContent content={post.content} className="text-white mt-3" />

              {/* Image */}
              {post.imageUrl && (
                <div className="mt-4">
                  <img src={post.imageUrl} alt="Post" className="rounded-2xl w-full object-cover border border-zinc-800" />
                </div>
              )}

              {/* Action Bar */}
              <div className="flex justify-between mt-5 text-zinc-500 text-sm max-w-md">
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                  className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer"
                >
                  ❤️ {post._count.likes}
                </button>
                
                
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id); }}
                  className="flex items-center gap-2 hover:text-blue-500 transition cursor-pointer"
                >
                  💬 {post._count.comments}
                </button>

                

                <div onClick={(e) => e.stopPropagation()}>
                  <ShareDropdown postId={post.id} postContent={post.content} postAuthor={post.user.username} />
                </div>
              </div>

              {/* Comment Input Box */}
              {activeCommentPostId === post.id && (
                <div className="mt-5 flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add your comment..."
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-sm text-white outline-none focus:border-blue-500 transition"
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!commentText.trim()}
                    className="bg-blue-600 px-6 rounded-full text-sm font-medium disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          ))
        )}
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

export default Feed;