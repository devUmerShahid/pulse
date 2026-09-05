// src/pages/Notifications/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppNotification } from '../../api/notification.api';
import Sidebar from '../../components/Sidebar';
import RightSidebar from '../../components/RightSidebar';
import PulseLoader from '../../components/PulseLoader';
import NotificationItem from './components/NotificationItem';
import { useNotifications } from './hooks/useNotifications';
import type { NotificationsTab } from './hooks/useNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<NotificationsTab>('all');

  const {
    displayNotifications,
    isLoading,
    error,
    markRead,
    markAllRead,
  } = useNotifications(tab);

  const hasUnread = displayNotifications.some((n) => !n.read);

  const handleOpen = (notification: AppNotification) => {
    if (!notification.read) markRead(notification.id);
    if (notification.type === 'FOLLOW') {
      navigate(`/profile/${notification.actor?.username}`);
    } else if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <PulseLoader size="lg" label="Loading notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-red-600">
        Failed to load notifications
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 md:pl-64">
      <Sidebar />
      <div className="mx-auto flex max-w-7xl gap-6">
        <main className="mx-auto flex-1 max-w-2xl">
          <div className="bg-white">
            {/* Header */}
            <div className="sticky top-14 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 md:top-0">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <button
                onClick={markAllRead}
                disabled={!hasUnread}
                className="text-sm font-medium text-[#5c5cff] transition hover:underline disabled:cursor-not-allowed disabled:text-gray-300"
              >
                Mark all read
              </button>
            </div>

            {/* All | Mentions tabs */}
            <div className="flex gap-2 border-b border-gray-100 px-4 py-3">
              {(['all', 'mentions'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition cursor-pointer ${
                    tab === t
                      ? 'bg-[#5c5cff]/10 text-[#5c5cff]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* List */}
            <div>
              {displayNotifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="mb-3 text-3xl">🔔</div>
                  <p className="font-medium text-gray-700">
                    {tab === 'mentions' ? 'No mentions yet' : 'No notifications yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {tab === 'mentions'
                      ? 'When someone mentions you in a post or comment, it will show up here.'
                      : 'When someone follows, likes, comments, or mentions you, it will show up here.'}
                  </p>
                </div>
              ) : (
                displayNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onOpen={handleOpen}
                  />
                ))
              )}
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
};

export default Notifications;
