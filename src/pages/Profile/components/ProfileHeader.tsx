// src/pages/Profile/components/ProfileHeader.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import type { ProfileCounts, ProfileUser } from '../../../api/user.api';

interface ProfileHeaderProps {
  user: ProfileUser;
  counts: ProfileCounts;
  isOwnProfile: boolean;
  isFollowing: boolean;
  canViewFull: boolean;
  isFollowLoading: boolean;
  onFollowToggle: () => void;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
}

const ProfileHeader = ({
  user,
  counts,
  isOwnProfile,
  isFollowing,
  canViewFull,
  isFollowLoading,
  onFollowToggle,
  onShowFollowers,
  onShowFollowing,
}: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Mocks based on the design since the API might not provide them all yet
  const joinDate = 'Joined October 2018';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white">
      {/* Cover Image */}
      <div className="h-[200px] bg-[#5c5cff] relative">
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="px-6 pb-4">
        {/* Avatar and Edit Button Row */}
        <div className="flex justify-between items-start -mt-[4.5rem]">
          <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full border-4 border-white bg-gray-200 shrink-0 overflow-hidden z-10 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt={user.username} />
            ) : (
              <span className="text-4xl font-bold text-gray-500">{(user.name || user.username).charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="pt-20 flex flex-wrap items-center gap-2 justify-end">
            {isOwnProfile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="px-4 py-1.5 text-[14px] font-bold text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50 transition cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-[14px] font-bold text-gray-900 border border-gray-300 rounded-full hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={onFollowToggle}
                disabled={isFollowLoading}
                className={`px-5 py-2 text-[14px] font-bold rounded-full transition cursor-pointer disabled:opacity-50 ${
                  isFollowing
                    ? 'border border-gray-300 text-gray-900 hover:bg-red-50 hover:border-red-500 hover:text-red-500'
                    : 'bg-[#5c5cff] text-white hover:bg-[#4a4ae6]'
                }`}
              >
                {isFollowLoading
                  ? '...'
                  : isFollowing
                    ? 'Following'
                    : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[22px] font-extrabold text-gray-900 leading-tight">
              {user.name || user.username}
            </h1>
            <svg className="w-[18px] h-[18px] text-[#5c5cff]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 12.5c0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79-.45-.51-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.51-.45-1.11-.68-1.79-.68-.68 0-1.28.23-1.79.68-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79.45.51.68 1.11.68 1.79s.23 1.28.68 1.79c-.45.51-.68 1.11-.68 1.79 0 .68.23 1.28.68 1.79.51.45 1.11.68 1.79.68.68 0 1.28-.23 1.79-.68.51.45 1.11.68 1.79.68.68 0 1.28-.23 1.79-.68.51.45 1.11.68 1.79.68.45-.51.68-1.11.68-1.79 0-.68-.23-1.28-.68-1.79.45-.51.68-1.11.68-1.79zm-12.83 4.31L5.55 12.7l1.7-1.7 2.42 2.41 6.59-6.59 1.7 1.7-8.29 8.29z"/></svg>
          </div>
          <p className="text-[15px] text-gray-500 font-medium">@{user.username}</p>
        </div>

        {canViewFull && user.bio && (
          <p className="text-gray-800 mt-4 text-[15px] leading-relaxed whitespace-pre-wrap">{user.bio}</p>
        )}

        {canViewFull && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[13px] text-gray-500 font-medium">
            {user.location && (
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#5c5cff] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {joinDate}
            </span>
          </div>
        )}

        {!canViewFull && user.isPrivate && (
          <p className="text-gray-500 mt-4 text-[15px] font-medium">This account is private</p>
        )}

        <div className="flex gap-6 mt-4 text-[15px]">
          <button
            onClick={onShowFollowing}
            className="text-gray-500 hover:underline cursor-pointer"
          >
            <strong className="text-gray-900 font-bold">{counts.followingCount.toLocaleString()}</strong> Following
          </button>
          <button
            onClick={onShowFollowers}
            className="text-gray-500 hover:underline cursor-pointer"
          >
            <strong className="text-gray-900 font-bold">{counts.followersCount.toLocaleString()}</strong> Followers
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
