// src/api/notification.api.ts
import http from '../utils/http';

export type NotificationType = 'FOLLOW' | 'LIKE' | 'COMMENT' | 'MENTION';

export interface AppNotification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  postId?: string | null;
  commentId?: string | null;
  actor: {
    id: string;
    username: string;
    name?: string | null;
    avatar?: string | null;
    bio?: string | null;
  };
  post?: { id: string; content: string } | null;
  comment?: { id: string; content: string } | null;
  // Present on FOLLOW rows: does the viewer already follow the actor?
  isFollowing?: boolean;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
  page: number;
  totalPages: number;
  total: number;
}

export const notificationAPI = {
  getNotifications: async (
    params: { type?: NotificationType; page?: number; limit?: number } = {}
  ): Promise<NotificationsResponse> => {
    const response = await http.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await http.get('/notifications/unread-count');
    return response.data;
  },

  markNotificationRead: async (id: string) => {
    const response = await http.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async () => {
    const response = await http.patch('/notifications/read');
    return response.data;
  },
};
