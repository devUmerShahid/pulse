// src/pages/CreatePost/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postAPI } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('content', content);

      if (image) {
        formData.append('image', image);
      }

      // Send as multipart/form-data
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
      navigate('/feed');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create post. Please try again.');
    },
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 bg-black z-50">
        <button 
          onClick={() => navigate('/feed')} 
          className="text-2xl hover:text-zinc-400"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Create Post</h1>
        <div className="w-8"></div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0" />

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is happening?!"
              className="w-full bg-transparent text-xl resize-none focus:outline-none min-h-[140px] placeholder-zinc-500"
              maxLength={500}
            />

            {preview && (
              <div className="mt-4 relative rounded-2xl overflow-hidden border border-zinc-700">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full max-h-96 object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white rounded-full p-2"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
              <label className="cursor-pointer text-blue-500 hover:text-blue-400 text-2xl transition">
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 px-8 py-2 rounded-full font-semibold text-lg transition"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded-2xl text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default CreatePost;










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