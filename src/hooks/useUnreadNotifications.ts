// src/hooks/useUnreadNotifications.ts
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../api/notification.api';
import { subscribeToEvent } from '../services/socket';

/**
 * Unread-notification count for the sidebar badge.
 *
 * This is the ONLY subscriber that bumps the unread query on
 * NOTIFICATION_CREATED — the Notifications page must not increment it too
 * (otherwise every new notification is counted twice).
 */
export const useUnreadNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationAPI.getUnreadCount,
    staleTime: 30 * 1000,
  });

  // New notification arrives in real time → re-fetch the badge count.
  useEffect(() => {
    const cleanup = subscribeToEvent('NOTIFICATION_CREATED', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    });
    return cleanup;
  }, [queryClient]);

  return {
    count: query.data?.count ?? 0,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
