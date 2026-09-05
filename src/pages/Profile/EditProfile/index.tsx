// src/pages/Profile/EditProfile/index.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditProfile } from './hooks/useEditProfile';
import Sidebar from '../../../components/Sidebar';
import RightSidebar from '../../../components/RightSidebar';
import PulseLoader from '../../../components/PulseLoader';

const EditProfile = () => {
  const navigate = useNavigate();
  const {
    name,
    setName,
    bio,
    setBio,
    location,
    setLocation,
    website,
    setWebsite,
    isPrivate,
    setIsPrivate,
    avatarPreview,
    coverPreview,
    handleAvatarChange,
    handleCoverChange,
    handleSubmit,
    isLoading,
    isSaving,
    saveSuccess,
    error,
    username,
  } = useEditProfile();

  useEffect(() => {
    if (saveSuccess && username) {
      navigate(`/profile/${username}`);
    }
  }, [saveSuccess, username, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] md:pl-64 text-gray-900">
        <Sidebar />
        <div className="flex items-center justify-center min-h-screen">
          <PulseLoader size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex gap-6">
        <div className="flex-1 max-w-2xl mx-auto border-x border-gray-100 bg-white min-h-screen">
          
          <div className="border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-14 bg-white/95 backdrop-blur-md z-50 md:top-0">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-900 hover:bg-gray-100 p-2 rounded-full transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h1 className="text-[20px] font-bold">Edit Profile</h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-[#5c5cff] hover:bg-[#4a4ae6] text-white px-5 py-1.5 rounded-full text-[15px] font-bold disabled:opacity-50 transition cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

          <div className="relative h-[200px] bg-[#5c5cff]">
            {coverPreview && (
              <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
            )}
            <label className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer group">
              <div className="bg-black/50 text-white p-3 rounded-full group-hover:bg-black/70 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="px-6 relative -mt-[4.5rem]">
            <div className="relative inline-block">
              <div className="w-[120px] h-[120px] rounded-full border-4 border-white bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center z-10 relative">
                {avatarPreview ? (
                  <img src={avatarPreview} className="w-full h-full object-cover" alt={username} />
                ) : (
                  <span className="text-4xl font-bold text-gray-500">{(name || username || '').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <label className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer group border-4 border-transparent z-20">
                <div className="bg-black/50 text-white p-2.5 rounded-full group-hover:bg-black/70 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="px-6 pt-4 pb-10 space-y-6">
            <div>
              <label className="text-gray-500 text-[13px] font-medium ml-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-[15px] text-gray-900 outline-none focus:border-[#5c5cff] focus:ring-1 focus:ring-[#5c5cff] transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-gray-500 text-[13px] font-medium ml-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full mt-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-[15px] text-gray-900 outline-none focus:border-[#5c5cff] focus:ring-1 focus:ring-[#5c5cff] transition resize-none"
                placeholder="Tell people about yourself"
              />
              <p className="text-gray-400 text-xs mt-1 text-right">{bio.length}/500</p>
            </div>

            <div>
              <label className="text-gray-500 text-[13px] font-medium ml-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-[15px] text-gray-900 outline-none focus:border-[#5c5cff] focus:ring-1 focus:ring-[#5c5cff] transition"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="text-gray-500 text-[13px] font-medium ml-1">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full mt-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-[15px] text-gray-900 outline-none focus:border-[#5c5cff] focus:ring-1 focus:ring-[#5c5cff] transition"
                placeholder="https://yoursite.com"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 accent-[#5c5cff] cursor-pointer"
              />
              <div>
                <div className="font-bold text-gray-900 text-[15px]">Private account</div>
                <div className="text-gray-500 text-[13px]">Only approved followers can see your posts.</div>
              </div>
            </label>
          </div>

        </div>

        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-8">
            <RightSidebar />
          </div>
        </aside>
      </div>

      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full text-[15px] font-medium shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default EditProfile;
