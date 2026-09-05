// src/components/LikeButton.tsx
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeAPI } from '../api';

interface LikeButtonProps {
  postId: string;
  /** Initial liked state (from the post payload). */
  isLiked?: boolean;
  /** Like count (from `post._count.likes`); the page keeps it live via socket events / refetch. */
  likeCount?: number;
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
 * Toggle a post's liked state with an optimistic red heart fill.
 * The count renders from `likeCount` so socket-driven updates from other users
 * still flow through the page's display state; the fill is local so it flips
 * instantly on click. Always calls `stopPropagation` because parent post cards
 * navigate on click.
 */
const LikeButton = ({
  postId,
  isLiked = false,
  likeCount = 0,
  queryKey,
  showCount = true,
  className = '',
  size = 18,
}: LikeButtonProps) => {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(isLiked);
  const [prevIsLiked, setPrevIsLiked] = useState(isLiked);

  // Resync with the server value when a fresh fetch arrives (e.g. PostDetail's
  // first paint from cache after the post was liked on another page). Done with
  // React's "adjust state when a prop changes" render pattern, not an effect.
  // `onSuccess` below still sets the authoritative value from the response, so
  // an in-flight toggle can't end up wrong.
  if (prevIsLiked !== isLiked) {
    setPrevIsLiked(isLiked);
    setLiked(isLiked);
  }

  const toggleMutation = useMutation({
    mutationFn: () => likeAPI.toggleLike(postId),
    onSuccess: (data) => {
      setLiked(data.liked);
      // Keep the page we're on (feed / profile / hashtag / post / bookmarks)
      // in sync with the new liked state.
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      // Revert the optimistic update
      setLiked(isLiked);
    },
  });

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // card click navigates to /post/:id
    setLiked((prev) => !prev);
    toggleMutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={liked ? 'Unlike post' : 'Like post'}
      aria-pressed={liked}
      className={`flex items-center gap-2 transition cursor-pointer ${liked ? 'text-red-500' : ''} ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      {showCount && <span className="text-[13px] font-medium">{likeCount}</span>}
    </button>
  );
};

export default LikeButton;
