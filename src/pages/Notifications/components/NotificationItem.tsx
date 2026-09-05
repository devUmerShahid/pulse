// src/pages/Notifications/components/NotificationItem.tsx
import type { ReactNode } from 'react';
import type { AppNotification } from '../../../api/notification.api';
import { formatRelativeTime } from '../../../utils/time';
import FollowBackButton from './FollowBackButton';

interface NotificationItemProps {
  notification: AppNotification;
  onOpen: (notification: AppNotification) => void;
}

const ACTION_TEXT: Record<string, string> = {
  FOLLOW: 'followed you',
  LIKE: 'liked your post',
  COMMENT: 'commented on your post',
  MENTION: 'mentioned you',
};

/** Renders @mentions in preview text in the brand color, like hashtags in PostContent. */
function HighlightMentions({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const regex = /@(\w+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
    parts.push(
      <span key={`m-${parts.length}`} className="font-medium text-[#5c5cff]">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));

  return <>{parts}</>;
}

function TypeIcon({ type }: { type: string }) {
  const strokeProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;

  if (type === 'LIKE') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#FF6584]" fill="#FF6584">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }

  if (type === 'FOLLOW') {
    return (
      <svg {...strokeProps} className="h-5 w-5 text-[#5c5cff]">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  if (type === 'MENTION') {
    // @ symbol in a rounded square — matches the design's alternate_email icon
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 text-sm font-bold leading-none text-[#5c5cff]">
        @
      </span>
    );
  }

  // COMMENT
  return (
    <svg {...strokeProps} className="h-5 w-5 text-[#5c5cff]">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const NotificationItem = ({ notification, onOpen }: NotificationItemProps) => {
  const actorName = notification.actor?.name || notification.actor?.username || 'Someone';
  const previewText =
    notification.comment?.content || notification.post?.content || '';

  return (
    <article
      onClick={() => onOpen(notification)}
      className={`relative flex cursor-pointer items-start gap-3 px-4 py-4 transition hover:bg-gray-50 ${
        notification.read ? 'bg-white' : 'bg-[#f6f6fc]'
      }`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <span className="absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#5c5cff]" />
      )}

      {/* Type icon */}
      <div className="mt-0.5 w-6 shrink-0">
        <TypeIcon type={notification.type} />
      </div>

      {/* Avatar */}
      <div className="shrink-0">
        {notification.actor?.avatar ? (
          <img
            src={notification.actor.avatar}
            alt={actorName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c5cff] text-base font-semibold text-white">
            {actorName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] text-gray-800">
          <span className="font-bold text-gray-900">{actorName}</span>{' '}
          <span className="text-gray-700">
            {ACTION_TEXT[notification.type] || 'interacted with you'}
          </span>
          <span className="text-gray-400">
            {' · '}
            {formatRelativeTime(notification.createdAt)}
          </span>
        </p>

        {notification.type === 'FOLLOW' && notification.actor?.bio && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {notification.actor.bio}
          </p>
        )}

        {notification.type === 'FOLLOW' && notification.actor && (
          <FollowBackButton
            userId={notification.actor.id}
            isFollowing={Boolean(notification.isFollowing)}
          />
        )}

        {notification.type !== 'FOLLOW' && previewText && (
          <div className="mt-2 border-l-2 border-gray-200 py-0.5 pl-3">
            <p className="line-clamp-2 text-[15px] text-gray-500">
              <HighlightMentions text={previewText} />
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default NotificationItem;
