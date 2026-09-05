// src/pages/CreatePost/index.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreatePostModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-create-post', handleOpen);
    window.addEventListener('close-create-post', handleClose);

    // Also check if the URL is exactly /create-post (legacy support)
    if (window.location.pathname === '/create-post') {
      setIsOpen(true);
      window.history.replaceState(null, '', '/feed'); // Redirect silently
    }

    return () => {
      window.removeEventListener('open-create-post', handleOpen);
      window.removeEventListener('close-create-post', handleClose);
    };
  }, []);

  const close = () => {
    setIsOpen(false);
    setContent('');
    setPreview(null);
    setImage(null);
    setError('');
    setLoading(false);
  }

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('content', content);

      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      close();
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create post. Please try again.');
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write something before posting');
      return;
    }
    setLoading(true);
    createPostMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-500/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create a Post</h2>
          <button 
            onClick={close} 
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 font-bold text-lg">
                {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900">{user?.name || user?.username}</div>
            <div className="text-sm font-mono text-gray-500">{user?.bio || 'Digital Explorer'}</div>
          </div>
        </div>

        {/* Textarea */}
        <div className="px-6 flex-1 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share what's on your mind..."
            className="w-full bg-transparent text-lg resize-none focus:outline-none min-h-[140px] placeholder-gray-400 text-gray-900"
            maxLength={280}
          />
          
          {preview && (
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-gray-200 mb-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full max-h-64 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white rounded-full p-2 transition"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Character count */}
          <div className="text-right text-xs font-mono text-gray-500 mb-2">
            {content.length}/280
          </div>
        </div>

        {/* Toolbar & Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 text-indigo-600">
            <label className="cursor-pointer p-2 hover:bg-indigo-50 rounded-full transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <button className="hidden sm:flex p-2 hover:bg-indigo-50 rounded-full transition" aria-label="Emoji">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </button>
            <button className="hidden sm:flex p-2 hover:bg-indigo-50 rounded-full transition" aria-label="Mention">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0-5.5 8.28"></path></svg>
            </button>
            <button className="hidden sm:flex p-2 hover:bg-indigo-50 rounded-full transition" aria-label="Location">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition">
              <span>🌎</span> Everyone <span className="ml-1 opacity-50">⌄</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-semibold transition"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded-2xl text-sm shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;










// // src/pages/CreatePost/index.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { postAPI } from '../../api';
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// const CreatePost = () => {
//   const [content, setContent] = useState('');
//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const createPostMutation = useMutation({
//     mutationFn: async () => {
//       let imageUrl: string | undefined = undefined;

//       if (image) {
//         const formData = new FormData();
//         formData.append('image', image);
//         const uploadRes = await fetch('http://localhost:4000/api/upload', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//           body: formData,
//         });
//         const uploadData = await uploadRes.json();
//         imageUrl = uploadData.imageUrl;
//       }

//       return postAPI.createPost(content, imageUrl);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['feed'] });
//       navigate('/feed');
//     },
//     onError: (err: any) => {
//       setError(err.response?.data?.error || 'Failed to create post');
//     },
//   });

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!content.trim()) {
//       setError('Post content cannot be empty');
//       return;
//     }
//     setLoading(true);
//     createPostMutation.mutate();
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Header */}
//       <div className="border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 bg-black z-50">
//         <button onClick={() => navigate('/feed')} className="text-xl">←</button>
//         <h1 className="text-xl font-bold">Create Post</h1>
//         <div></div>
//       </div>

//       <div className="max-w-2xl mx-auto p-4">
//         <div className="flex gap-4">
//           <div className="w-12 h-12 bg-zinc-700 rounded-full flex-shrink-0"></div>
//           <div className="flex-1">
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="What is happening?!"
//               className="w-full bg-transparent text-xl resize-none focus:outline-none min-h-[150px]"
//               maxLength={500}
//             />

//             {preview && (
//               <div className="mt-4 relative">
//                 <img src={preview} alt="Preview" className="rounded-2xl max-h-96 object-cover" />
//                 <button
//                   onClick={() => { setImage(null); setPreview(null); }}
//                   className="absolute top-2 right-2 bg-black/70 rounded-full p-1"
//                 >
//                   ✕
//                 </button>
//               </div>
//             )}

//             <div className="flex justify-between items-center mt-6 border-t border-zinc-800 pt-4">
//               <label className="cursor-pointer text-blue-500 hover:text-blue-400">
//                 📷
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </label>

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading || !content.trim()}
//                 className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 px-6 py-2 rounded-full font-semibold"
//               >
//                 {loading ? 'Posting...' : 'Post'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {error && <p className="text-red-500 text-center mt-4">{error}</p>}
//     </div>
//   );
// };

// export default CreatePost;