// src/pages/Notifications/components/FollowBackButton.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../../../api/user.api';

interface FollowBackButtonProps {
  userId: string;
  isFollowing: boolean;
}

/**
 * Toggle follow on a FOLLOW notification card. On success the notifications
 * list is re-fetched so the row's `isFollowing` reflects the new state.
 */
const FollowBackButton = ({ userId, isFollowing }: FollowBackButtonProps) => {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () =>
      isFollowing ? userAPI.unfollowUser(userId) : userAPI.followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] });
    },
  });

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleMutation.mutate();
      }}
      disabled={toggleMutation.isPending}
      className={`mt-3 rounded-full px-4 py-1.5 text-sm font-semibold transition cursor-pointer disabled:opacity-60 ${
        isFollowing
          ? 'border border-gray-300 text-gray-700 hover:bg-gray-100'
          : 'bg-[#5c5cff] text-white hover:bg-indigo-700'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow Back'}
    </button>
  );
};

export default FollowBackButton;
