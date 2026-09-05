// src/pages/Settings/hooks/useSettings.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authAPI, userAPI } from '../../../api';

const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'response' in err
    ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || ''
    : '';

export const useSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateFieldMutation = useMutation({
    mutationFn: (payload: { username?: string; email?: string }) =>
      userAPI.updateProfile(payload),
    onSuccess: (data) => {
      if (user && data?.user) {
        updateUser({
          ...user,
          username: data.user.username ?? user.username,
          email: data.user.email ?? user.email,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authAPI.changePassword(currentPassword, newPassword),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: userAPI.deleteAccount,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
  });

  const saveField = (
    payload: { username?: string; email?: string },
    onSuccess?: () => void
  ) => updateFieldMutation.mutate(payload, { onSuccess });

  const changePassword = (
    currentPassword: string,
    newPassword: string,
    onSuccess?: () => void
  ) => changePasswordMutation.mutate({ currentPassword, newPassword }, { onSuccess });

  const deleteAccount = () => deleteAccountMutation.mutate();

  return {
    user,
    // Account field (username / email) updates
    saveField,
    isSavingField: updateFieldMutation.isPending,
    fieldError: getErrorMessage(updateFieldMutation.error),
    // Password
    changePassword,
    isChangingPassword: changePasswordMutation.isPending,
    passwordError: getErrorMessage(changePasswordMutation.error),
    // Account deletion
    deleteAccount,
    isDeleting: deleteAccountMutation.isPending,
    deleteError: getErrorMessage(deleteAccountMutation.error),
    // Auth
    logout,
  };
};
