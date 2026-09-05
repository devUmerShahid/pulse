import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postAPI, commentAPI } from '../../../api';

export const usePostDetail = (postId: string | undefined) => {
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postAPI.getPostById(postId!),
    enabled: !!postId,
  });

  const post = data?.post;

  const addCommentMutation = useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
      commentAPI.addComment(postId!, content, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      setCommentText('');
      setReplyToId(null);
      setReplyText('');
    },
  });

  const handleCommentSubmit = () => {
    if (!commentText.trim() || !postId) return;
    addCommentMutation.mutate({ content: commentText });
  };

  const handleStartReply = (commentId: string) => {
    setReplyToId(commentId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyToId(null);
    setReplyText('');
  };

  const handleSubmitReply = () => {
    if (!replyText.trim() || !replyToId || !postId) return;
    addCommentMutation.mutate({ content: replyText, parentId: replyToId });
  };

  return {
    post,
    isLoading,
    error,
    commentText,
    setCommentText,
    replyToId,
    replyText,
    setReplyText,
    handleCommentSubmit,
    handleStartReply,
    handleCancelReply,
    handleSubmitReply,
  };
};
