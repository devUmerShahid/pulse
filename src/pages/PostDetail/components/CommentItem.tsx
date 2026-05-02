// src/pages/PostDetail/components/CommentItem.tsx
import { useState } from 'react';
import type { Comment } from '../../../api/comment.api';
import { formatRelativeTime } from '../../../utils/time';

interface CommentItemProps {
  comment: Comment;
  depth: number;
  activeReplyId: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onStartReply: (commentId: string) => void;
  onCancelReply: () => void;
  onSubmitReply: () => void;
}

const CommentItem = ({
  comment,
  depth,
  activeReplyId,
  replyText,
  onReplyTextChange,
  onStartReply,
  onCancelReply,
  onSubmitReply,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(depth < 2);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isReplying = activeReplyId === comment.id;

  return (
    <div className={`relative ${depth > 0 ? 'pl-5' : ''}`}>
      {/* Thread line */}
      {depth > 0 && (
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/30 to-purple-500/15 rounded-full" />
      )}

      {/* Comment Body */}
      <div className="flex gap-2.5 py-3">
        {/* Avatar */}
        <div className={`${depth > 0 ? 'w-7 h-7' : 'w-9 h-9'} rounded-full shrink-0 overflow-hidden`}>
          {comment.user.avatar ? (
            <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm text-white">{comment.user.name || comment.user.username}</span>
            <span className="text-xs text-zinc-500">@{comment.user.username}</span>
            <span className="text-xs text-zinc-500">·</span>
            <span className="text-xs text-zinc-500">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <p className="mt-1 text-sm text-zinc-300 break-words leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-1.5">
            <button
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-500 transition cursor-pointer"
              onClick={() => onStartReply(comment.id)}
            >
              💬 Reply
            </button>

            {hasReplies && (
              <button
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-purple-400 transition cursor-pointer"
                onClick={() => setShowReplies(!showReplies)}
              >
                <span className={`inline-block transition-transform duration-200 ${showReplies ? 'rotate-180' : ''}`}>▾</span>
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length}{' '}
                {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-2.5 animate-[fadeSlide_0.2s_ease]">
              <p className="text-xs text-zinc-500 mb-1.5">
                Replying to <span className="text-blue-500 font-medium">@{comment.user.username}</span>
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => onReplyTextChange(e.target.value)}
                  placeholder={`Reply to @${comment.user.username}...`}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-blue-500 transition"
                  onKeyDown={(e) => e.key === 'Enter' && onSubmitReply()}
                  autoFocus
                />
                <button
                  onClick={onSubmitReply}
                  disabled={!replyText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-medium disabled:opacity-40 cursor-pointer transition whitespace-nowrap"
                >
                  Reply
                </button>
                <button
                  onClick={onCancelReply}
                  className="text-zinc-500 hover:text-red-400 text-sm cursor-pointer transition"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && showReplies && (
        <div className="animate-[fadeIn_0.2s_ease]">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              activeReplyId={activeReplyId}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
