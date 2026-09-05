// src/pages/Profile/index.tsx
import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api';
import { useProfile } from './hooks/useProfile';
import ProfileHeader from './components/ProfileHeader';
import ProfilePostList from './components/ProfilePostList';
import UserListModal from './components/UserListModal';
import RightSidebar from '../../components/RightSidebar';
import Sidebar from '../../components/Sidebar';
import PulseLoader from '../../components/PulseLoader';

type ListModal = 'followers' | 'following' | null;

const Profile = () => {
  const { username: routeUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [listModal, setListModal] = useState<ListModal>(null);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  const username = routeUsername || authUser.username;

  const {
    profile,
    posts,
    isLoading,
    isPostsLoading,
    error,
    isOwnProfile,
    handleFollowToggle,
    isFollowLoading,
  } = useProfile(routeUsername);

    // eslint-disable-next-line react-hooks/rules-of-hooks
  const followersQuery = useQuery({
    queryKey: ['followers', username],
    queryFn: () => userAPI.getFollowers(username),
    enabled: listModal === 'followers' && !!username,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const followingQuery = useQuery({
    queryKey: ['following', username],
    queryFn: () => userAPI.getFollowing(username),
    enabled: listModal === 'following' && !!username,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] md:pl-64 text-gray-900">
        <Sidebar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <PulseLoader size="lg" />
            <span className="text-gray-500 font-medium">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] md:pl-64 text-gray-900">
        <Sidebar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4 font-semibold">User not found</p>
            <button
              onClick={() => navigate('/feed')}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              ← Back to Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 md:pl-64">
      <Sidebar />
      <div className="max-w-7xl mx-auto flex gap-6">
        <div className="flex-1 max-w-2xl mx-auto w-full border-x border-gray-100 min-h-screen">
          
          {/* Top Sticky Header */}
          <div className="px-6 flex items-center gap-6 sticky top-14 bg-white/95 backdrop-blur-md z-50 py-3 md:top-0 border-b border-gray-100">
            <button onClick={() => navigate(-1)} className="text-gray-900 hover:bg-gray-100 p-2 rounded-full transition cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div>
              <h1 className="text-[20px] font-bold leading-tight">{profile.user.name || profile.user.username}</h1>
              <p className="text-gray-500 text-[13px] font-medium">{profile.counts.postsCount.toLocaleString()} Posts</p>
            </div>
          </div>

          <ProfileHeader
            user={profile.user}
            counts={profile.counts}
            isOwnProfile={isOwnProfile}
            isFollowing={profile.isFollowing}
            canViewFull={profile.canViewFull}
            isFollowLoading={isFollowLoading}
            onFollowToggle={handleFollowToggle}
            onShowFollowers={() => setListModal('followers')}
            onShowFollowing={() => setListModal('following')}
          />

          {/* Tabs */}
          {profile.canViewFull && (
            <div className="flex items-center justify-around border-b border-gray-100 mt-2">
              <button className="flex-1 py-4 text-[15px] font-bold text-gray-900 relative">
                Posts
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#5c5cff] rounded-t-full"></div>
              </button>
              <button className="flex-1 py-4 text-[15px] font-medium text-gray-500 hover:bg-gray-50 transition">Replies</button>
              <button className="flex-1 py-4 text-[15px] font-medium text-gray-500 hover:bg-gray-50 transition">Media</button>
              <button className="flex-1 py-4 text-[15px] font-medium text-gray-500 hover:bg-gray-50 transition">Likes</button>
            </div>
          )}

          {/* Content */}
          {profile.canViewFull ? (
            <ProfilePostList posts={posts} isLoading={isPostsLoading} queryKey={['profile-posts', profile.user.username]} />
          ) : (
            <div className="text-center py-16 px-4 text-gray-500">
              <p className="text-lg mb-2">🔒</p>
              <p className="font-medium">Follow this account to see their posts</p>
            </div>
          )}
        </div>

        {/* Trending Sidebar */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-8">
            <RightSidebar />
          </div>
        </aside>
      </div>

      {listModal === 'followers' && (
        <UserListModal
          title="Followers"
          users={followersQuery.data?.users || []}
          isLoading={followersQuery.isLoading}
          onClose={() => setListModal(null)}
        />
      )}

      {listModal === 'following' && (
        <UserListModal
          title="Following"
          users={followingQuery.data?.users || []}
          isLoading={followingQuery.isLoading}
          onClose={() => setListModal(null)}
        />
      )}
    </div>
  );
};

export default Profile;
