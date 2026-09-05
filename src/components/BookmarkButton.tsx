// src/components/BookmarkButton.tsx
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkAPI } from '../api';

interface BookmarkButtonProps {
  postId: string;
  /** Initial saved state (from the post payload). */
  isBookmarked?: boolean;
  /** Initial bookmark count (from `post._count.bookmarks`). */
  bookmarkCount?: number;
  /** Query key of the page this button appears on — invalidated after toggling. */
  queryKey: unknown[];
  /** Whether to render the count next to the icon. */
  showCount?: boolean;
  /** Extra classes merged onto the button (per-page hover/padding styles). */
  className?: string;
  /** Icon size in pixels. */
  size?: number;
}

/**
 * Toggle a post's saved (bookmark) state.
 * Self-contained: optimistic update, then syncs with the server and refreshes the
 * page's query + the `['bookmarks']` page so saved state stays truthful everywhere.
 * Always calls `stopPropagation` because parent post cards navigate on click.
 */
const BookmarkButton = ({
  postId,
  isBookmarked = false,
  bookmarkCount = 0,
  queryKey,
  showCount = true,
  className = '',
  size = 18,
}: BookmarkButtonProps) => {
  const queryClient = useQueryClient();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [count, setCount] = useState(bookmarkCount);

  const toggleMutation = useMutation({
    mutationFn: () => bookmarkAPI.toggleBookmark(postId),
    onSuccess: (data) => {
      setBookmarked(data.bookmarked);
      setCount(data.bookmarkCount);
      // Keep the page we're on (feed / profile / hashtag / post) and the
      // Bookmarks page in sync with the new saved state.
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: () => {
      // Revert the optimistic update
      setBookmarked(isBookmarked);
      setCount(bookmarkCount);
    },
  });

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // card click navigates to /post/:id
    const next = !bookmarked;
    setBookmarked(next);
    setCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
    toggleMutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
      aria-pressed={bookmarked}
      className={`flex items-center gap-2 transition cursor-pointer ${bookmarked ? 'text-indigo-600' : ''} ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      {showCount && <span className="text-[13px] font-medium">{count}</span>}
    </button>
  );
};

export default BookmarkButton;
