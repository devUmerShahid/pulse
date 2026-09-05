// src/pages/Profile/EditProfile/hooks/useEditProfile.ts
import { useState, useEffect, type ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../../../../api';
import { useAuth } from '../../../../context/AuthContext';
import type { UpdateProfilePayload } from '../../../../api/user.api';

export const useEditProfile = () => {
  const { user: authUser, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const profileQuery = useQuery({
    queryKey: ['profile', 'me', 'edit'],
    queryFn: userAPI.getMyProfile,
    enabled: !!authUser,
  });

  const profileUser = profileQuery.data?.user;

  useEffect(() => {
    if (profileUser) {
      setName(profileUser.name || '');
      setBio(profileUser.bio || '');
      setLocation(profileUser.location || '');
      setWebsite(profileUser.website || '');
      setIsPrivate(profileUser.isPrivate ?? false);
      setAvatarPreview(profileUser.avatar || null);
      setCoverPreview(profileUser.coverImage || null);
    }
  }, [profileUser]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload: UpdateProfilePayload = {
        name: name.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        website: website.trim() || null,
        isPrivate,
      };

      if (avatarFile) {
        payload.avatar = await userAPI.uploadImage(avatarFile);
      }

      if (coverFile) {
        payload.coverImage = await userAPI.uploadImage(coverFile);
      }

      return userAPI.updateProfile(payload);
    },
    onSuccess: (data) => {
      if (authUser && data.user) {
        updateUser({
          ...authUser,
          name: data.user.name,
          bio: data.user.bio,
          avatar: data.user.avatar,
          coverImage: data.user.coverImage,
          location: data.user.location,
          website: data.user.website,
          isPrivate: data.user.isPrivate,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message || 'Failed to update profile');
    },
  });

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = () => {
    if (bio.length > 500) {
      setError('Bio must be 500 characters or less');
      return;
    }
    setError('');
    updateMutation.mutate();
  };

  return {
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
    isLoading: profileQuery.isLoading,
    isSaving: updateMutation.isPending,
    saveSuccess: updateMutation.isSuccess,
    error,
    username: profileUser?.username || authUser?.username,
  };
};
