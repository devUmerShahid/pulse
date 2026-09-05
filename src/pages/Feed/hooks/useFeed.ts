// src/pages/Feed/hooks/useFeed.ts
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postAPI, commentAPI } from '../../../api';

export const useFeed = () => {
  const queryClient = useQueryClient();

  // Fetch Feed
  const feedQuery = useQuery({
    queryKey: ['feed'],
    queryFn: postAPI.getFeed,
  });

  // Add Comment Mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      commentAPI.addComment(postId, content, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const handleAddComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    addCommentMutation.mutate({ postId, content: content.trim() });
  };

  // Memoize so the array reference is stable across renders
  // (prevents infinite re-render loops in consumers that use posts as a dependency)
  const posts = useMemo(() => feedQuery.data?.posts ?? [], [feedQuery.data]);

  return {
    posts,
    isLoading: feedQuery.isLoading,
    error: feedQuery.error,
    handleAddComment,
    refetch: feedQuery.refetch,
  };
};