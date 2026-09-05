// src/pages/Notifications/hooks/useNotifications.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../../../api/notification.api';
import type { AppNotification } from '../../../api/notification.api';
import { subscribeToEvent } from '../../../services/socket';

export type NotificationsTab = 'all' | 'mentions';

export const useNotifications = (tab: NotificationsTab) => {
  const queryClient = useQueryClient();
  const [displayNotifications, setDisplayNotifications] = useState<AppNotification[]>([]);

  const query = useQuery({
    queryKey: ['notifications', tab],
    queryFn: () =>
      notificationAPI.getNotifications({
        type: tab === 'mentions' ? 'MENTION' : undefined,
      }),
  });

  // useMemo keeps a stable reference so the sync effect only fires on real data
  // changes (a raw `?? []` would mint a new array every render).
  const notifications = useMemo(
    () => query.data?.notifications ?? [],
    [query.data]
  );

  // Opening the page marks existing notifications as read (clears the sidebar
  // badge). New real-time arrivals stay unread until clicked or "Mark all read".
  const didMarkAllReadOnMount = useRef(false);
  const markAllReadMutation = useMutation({
    mutationFn: notificationAPI.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.setQueryData(['notifications', 'unread'], { count: 0 });
    },
  });

  useEffect(() => {
    if (!didMarkAllReadOnMount.current && query.data) {
      didMarkAllReadOnMount.current = true;
      markAllReadMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  // Keep displayNotifications in sync with the query result
  useEffect(() => {
    setDisplayNotifications(notifications);
  }, [notifications]);

  // Real-time prepend. The server targets only this user's room, so subscribing
  // unconditionally is safe even when the list is currently empty.
  useEffect(() => {
    const handleNotificationCreated = (eventData: unknown) => {
      const ev = eventData as { notification?: AppNotification };
      const n = ev?.notification;
      if (!n?.actor) return;
      if (tab === 'mentions' && n.type !== 'MENTION') return;
      setDisplayNotifications((prev) => [n, ...prev]);
    };

    return subscribeToEvent('NOTIFICATION_CREATED', handleNotificationCreated);
  }, [tab]);

  const markReadMutation = useMutation({
    mutationFn: notificationAPI.markNotificationRead,
    onSuccess: (_data, id) => {
      setDisplayNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    },
  });

  return {
    displayNotifications,
    isLoading: query.isLoading,
    error: query.error,
    markRead: (id: string) => markReadMutation.mutate(id),
    markAllRead: () => markAllReadMutation.mutate(),
  };
};
