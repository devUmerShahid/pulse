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
    <div className={`relative ${depth > 0 ? 'pl-8 mt-2' : 'border-b border-gray-100 py-4'}`}>
      {/* Thread line */}
      {depth > 0 && (
        <div className="absolute left-4 top-10 bottom-0 w-[2px] bg-gray-200" />
      )}

      {/* Comment Body */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={`${depth > 0 ? 'w-8 h-8' : 'w-10 h-10'} rounded-full shrink-0 overflow-hidden bg-gray-200 flex items-center justify-center relative z-10`}>
          {comment.user.avatar ? (
            <img src={comment.user.avatar} alt={comment.user.username} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-gray-500 text-sm">{(comment.user.name || comment.user.username).charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[15px] text-gray-900 hover:underline cursor-pointer">{comment.user.name || comment.user.username}</span>
            <span className="text-[13px] text-gray-500 font-medium">@{comment.user.username}</span>
            <span className="text-[13px] text-gray-500 font-medium">·</span>
            <span className="text-[13px] text-gray-500 font-medium">{formatRelativeTime(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <p className="mt-1 text-[15px] text-gray-800 break-words leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-6 mt-3 text-gray-400">
            <button
              className="flex items-center gap-2 hover:text-[#5c5cff] transition cursor-pointer"
              onClick={() => onStartReply(comment.id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <span className="text-[13px] font-medium">{comment.replies?.length || 0}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-pink-500 transition cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span className="text-[13px] font-medium">{comment.id.length}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-[#5c5cff] transition cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>

            {hasReplies && (
              <button
                className="flex items-center gap-1.5 text-[13px] font-medium text-[#5c5cff] hover:underline transition cursor-pointer ml-auto"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide replies' : `Show ${comment.replies?.length ?? 0} replies`}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-4 animate-[fadeSlide_0.2s_ease]">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden">
                  <span className="font-bold text-gray-500">U</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="text-[13px] text-gray-500 mb-1">
                    Replying to <span className="text-[#5c5cff] hover:underline cursor-pointer">@{comment.user.username}</span>
                  </div>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => onReplyTextChange(e.target.value)}
                    placeholder={`Post your reply...`}
                    className="w-full bg-transparent text-[17px] text-gray-900 outline-none placeholder-gray-400 py-2"
                    onKeyDown={(e) => e.key === 'Enter' && onSubmitReply()}
                    autoFocus
                  />
                  
                  <div className="flex flex-wrap items-center justify-between mt-4">
                    <div className="flex gap-2 text-[#5c5cff]">
                      <button className="p-2 hover:bg-[#5c5cff]/10 rounded-full transition">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onCancelReply}
                        className="text-gray-500 hover:text-gray-900 text-[15px] font-medium px-3 py-2 cursor-pointer transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={onSubmitReply}
                        disabled={!replyText.trim()}
                        className="bg-[#5c5cff] hover:bg-[#4a4ae6] text-white px-5 py-2 rounded-full text-[15px] font-bold disabled:opacity-50 transition cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && showReplies && (
        <div className="animate-[fadeIn_0.2s_ease]">
          {(comment.replies ?? []).map((reply) => (
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
