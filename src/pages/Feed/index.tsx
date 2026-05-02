// src/pages/Feed/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFeed } from './hooks/useFeed';
import { formatRelativeTime } from '../../utils/time';

const Feed = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const { posts, isLoading, error, handleLike, handleAddComment } = useFeed();

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

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
    return <div className="min-h-screen bg-black text-white flex items-center justify-center text-red-500">Failed to load feed</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter">Pulse</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">@{user?.username}</span>
            <button onClick={logout} className="px-5 py-2 text-sm border border-zinc-700 rounded-full hover:bg-zinc-900">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto pt-4">
        {/* Create Post Button */}
        <div className="px-4 mb-6">
          <button
            onClick={() => navigate('/create-post')}
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-3xl font-semibold text-lg transition"
          >
            What's happening?
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No posts yet. Be the first to post!</div>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="border-b border-zinc-800 px-4 py-6 hover:bg-zinc-950/50 transition cursor-pointer"
              onClick={() => openPostDetail(post.id)}
            >
              {/* Avatar + Name + Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0" />
                
                <div className="flex-1">
                  <div className="font-semibold text-white">{post.user.name || post.user.username}</div>
                  <div className="text-zinc-500 text-sm mt-0.5">
                    @{post.user.username} · {formatRelativeTime(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mt-3 text-[17px] leading-relaxed text-white">
                {post.content}
              </div>

              {/* Image */}
              {post.imageUrl && (
                <div className="mt-4">
                  <img 
                    src={post.imageUrl} 
                    alt="Post" 
                    className="rounded-2xl w-full object-cover border border-zinc-800"
                  />
                </div>
              )}

              {/* Action Bar */}
              <div className="flex justify-between mt-5 text-zinc-500 text-sm max-w-md">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id); }}
                  className="flex items-center gap-2 hover:text-blue-500 transition"
                >
                  💬 {post._count.comments}
                </button>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                  className="flex items-center gap-2 hover:text-red-500 transition"
                >
                  ❤️ {post._count.likes}
                </button>

                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 hover:text-green-500 transition"
                >
                  🔁 Share
                </button>
              </div>

              {/* Comment Input Box */}
              {activeCommentPostId === post.id && (
                <div className="mt-5 flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add your comment..."
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-sm focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!commentText.trim()}
                    className="bg-blue-600 px-6 rounded-full text-sm font-medium disabled:opacity-50 whitespace-nowrap"
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;











// // src/pages/Feed/index.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useFeed } from './hooks/useFeed';
// import { formatRelativeTime } from '../../utils/time';

// const Feed = () => {
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();

//   const { posts, isLoading, error, handleLike, handleAddComment } = useFeed();

//   const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
//   const [commentText, setCommentText] = useState('');

//   const handleCommentSubmit = (postId: string) => {
//     handleAddComment(postId, commentText);
//     setCommentText('');
//     setActiveCommentPostId(null);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <p className="text-xl">Loading Pulse...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <p className="text-red-500">Failed to load feed. Please try again.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Navbar */}
//       <nav className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
//         <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
//           <h1 className="text-3xl font-bold tracking-tighter">Pulse</h1>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-zinc-400">@{user?.username}</span>
//             <button
//               onClick={logout}
//               className="px-5 py-2 text-sm border border-zinc-700 rounded-full hover:bg-zinc-900 transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-2xl mx-auto pt-4">
//         {/* Create Post Button */}
//         <div className="px-4 mb-6">
//           <button
//             onClick={() => navigate('/create-post')}
//             className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-3xl font-semibold text-lg transition"
//           >
//             What's happening?
//           </button>
//         </div>

//         {/* Posts Feed */}
//         {posts.length === 0 ? (
//           <div className="text-center py-20 text-zinc-500">
//             No posts yet. Be the first to post!
//           </div>
//         ) : (
//           posts.map((post) => (
//             <div key={post.id} className="border-b border-zinc-800 px-4 py-5 hover:bg-zinc-950/50 transition">
//               <div className="flex gap-4">
//                 {/* Avatar */}
//                 <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0" />

//                 <div className="flex-1">
//                   {/* Post Header */}
//                   <div className="flex items-center gap-2">
//                     <span className="font-bold">{post.user.name || post.user.username}</span>
//                     <span className="text-zinc-500">@{post.user.username}</span>
//                     <span className="text-zinc-500">·</span>
//                     <span className="text-zinc-500 text-sm">
//                       {formatRelativeTime(post.createdAt)}
//                     </span>
//                   </div>

//                   {/* Post Content */}
//                   <p className="mt-1 text-[17px] leading-relaxed break-words">{post.content}</p>

//                   {/* Image */}
//                   {post.imageUrl && (
//                     <div className="mt-3">
//                       <img 
//                         src={post.imageUrl} 
//                         alt="Post media" 
//                         className="rounded-2xl max-h-96 w-full object-cover border border-zinc-800"
//                       />
//                     </div>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex justify-between mt-4 text-zinc-500 max-w-md">
//                     <button 
//                       onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
//                       className="flex items-center gap-2 hover:text-blue-500 transition"
//                     >
//                       💬 {post._count.comments}
//                     </button>

//                     <button 
//                       onClick={() => handleLike(post.id)}
//                       className="flex items-center gap-2 hover:text-red-500 transition"
//                     >
//                       ❤️ {post._count.likes}
//                     </button>

//                     <button className="flex items-center gap-2 hover:text-green-500 transition">
//                       🔁
//                     </button>
//                   </div>

//                   {/* Comment Input Box */}
//                   {activeCommentPostId === post.id && (
//                     <div className="mt-4 flex gap-3">
//                       <input
//                         type="text"
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                         placeholder="Write a comment..."
//                         className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3 text-sm focus:outline-none"
//                         onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
//                       />
//                       <button
//                         onClick={() => handleCommentSubmit(post.id)}
//                         disabled={!commentText.trim()}
//                         className="bg-blue-600 px-6 rounded-full text-sm font-medium disabled:opacity-50"
//                       >
//                         Post
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Feed;