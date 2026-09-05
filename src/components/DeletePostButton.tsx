// src/components/DeletePostButton.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../api';

interface DeletePostButtonProps {
  postId: string;
  /** id of the user who authored the post — the button only renders for them. */
  postUserId: string;
  /** Query key(s) to invalidate after a successful delete (e.g. the page's posts query). */
  queryKey: unknown[];
  /** Extra callback after a successful delete (e.g. navigate away from the post detail page). */
  onDeleted?: () => void;
  className?: string;
  size?: number;
}

/**
 * Trash icon that only shows to the post's author. Clicking it opens a small
 * inline confirm popover; confirming deletes the post via the API and
 * invalidates the page's query so the post disappears from lists.
 */
const DeletePostButton = ({
  postId,
  postUserId,
  queryKey,
  onDeleted,
  className = '',
  size = 18,
}: DeletePostButtonProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => postAPI.deletePost(postId),
    onSuccess: () => {
      // Drop the post everywhere it might be listed (feed, profile, hashtag, bookmarks).
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['profile-posts'] });
      queryClient.invalidateQueries({ queryKey: ['hashtag-posts'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      setConfirming(false);
      onDeleted?.();
    },
  });

  // Only the author can delete their own post.
  if (!user || user.id !== postUserId) return null;

  return (
    <div className="relative inline-flex">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setConfirming((v) => !v);
        }}
        aria-label="Delete post"
        title="Delete post"
        className={`p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer ${className}`}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>

      {confirming && (
        <>
          {/* Backdrop to close the confirm popover on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(false);
            }}
          />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[190px] bg-zinc-900 border border-zinc-700/60 rounded-xl py-1.5 shadow-2xl shadow-black/60 animate-[dropdownIn_0.2s_ease]">
            <div className="px-4 pt-2 text-sm font-semibold text-white">Delete this post?</div>
            <div className="px-4 pb-2 text-xs text-zinc-400">This can't be undone.</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteMutation.mutate();
              }}
              disabled={deleteMutation.isPending}
              className="w-full px-4 py-2 text-sm font-semibold text-red-500 hover:bg-white/5 transition cursor-pointer disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirming(false);
              }}
              className="w-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeletePostButton;
