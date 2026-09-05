// src/pages/Profile/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

export const useProfile = (username: string | undefined) => {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const resolvedUsername = username || authUser?.username;
  const isOwnProfile = !!authUser && resolvedUsername === authUser.username;

  const profileQuery = useQuery({
    queryKey: ['profile', resolvedUsername, isOwnProfile ? 'me' : 'public'],
    queryFn: () =>
      isOwnProfile && !username
        ? userAPI.getMyProfile()
        : userAPI.getProfileByUsername(resolvedUsername!),
    enabled: !!resolvedUsername,
  });

  const profile = profileQuery.data;
  const profileUsername = profile?.user.username;

  const postsQuery = useQuery({
    queryKey: ['profile-posts', profileUsername],
    queryFn: () => userAPI.getUserPosts(profileUsername!),
    enabled: !!profileUsername && !!profile?.canViewFull,
  });

  const followMutation = useMutation({
    mutationFn: (userId: string) => userAPI.followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', resolvedUsername] });
      queryClient.invalidateQueries({ queryKey: ['profile-posts', profileUsername] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (userId: string) => userAPI.unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', resolvedUsername] });
      queryClient.invalidateQueries({ queryKey: ['profile-posts', profileUsername] });
    },
  });

  const handleFollowToggle = () => {
    if (!profile?.user.id) return;

    if (profile.isFollowing) {
      unfollowMutation.mutate(profile.user.id);
    } else {
      followMutation.mutate(profile.user.id);
    }
  };

  return {
    profile,
    posts: postsQuery.data?.posts || [],
    isLoading: profileQuery.isLoading,
    isPostsLoading: postsQuery.isLoading,
    error: profileQuery.error,
    postsError: postsQuery.error,
    isOwnProfile: profile?.isOwnProfile ?? isOwnProfile,
    handleFollowToggle,
    isFollowLoading: followMutation.isPending || unfollowMutation.isPending,
    refetch: profileQuery.refetch,
  };
};
