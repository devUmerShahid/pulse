// src/pages/Feed/hooks/useFeed.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postAPI,  likeAPI, commentAPI } from '../../../api';

export const useFeed = () => {
  const queryClient = useQueryClient();

  // Fetch Feed
  const feedQuery = useQuery({
    queryKey: ['feed'],
    queryFn: postAPI.getFeed,
  });

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: likeAPI.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  // Add Comment Mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      commentAPI.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleAddComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    addCommentMutation.mutate({ postId, content: content.trim() });
  };

  return {
    posts: feedQuery.data?.posts || [],
    isLoading: feedQuery.isLoading,
    error: feedQuery.error,
    handleLike,
    handleAddComment,
    refetch: feedQuery.refetch,
  };
};










// // src/pages/Feed/hooks/useFeed.ts
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { postAPI, Post, likeAPI, commentAPI } from '../../../api';

// export const useFeed = () => {
//   const queryClient = useQueryClient();

//   // Fetch Feed
//   const feedQuery = useQuery({
//     queryKey: ['feed'],
//     queryFn: postAPI.getFeed,
//   });

//   // Like Mutation
//   const likeMutation = useMutation({
//     mutationFn: likeAPI.toggleLike,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['feed'] });
//     },
//   });

//   // Add Comment Mutation
//   const addCommentMutation = useMutation({
//     mutationFn: ({ postId, content }: { postId: string; content: string }) =>
//       commentAPI.addComment(postId, content),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['feed'] });
//     },
//   });

//   const handleLike = (postId: string) => {
//     likeMutation.mutate(postId);
//   };

//   const handleAddComment = (postId: string, content: string) => {
//     if (!content.trim()) return;
//     addCommentMutation.mutate({ postId, content });
//   };

//   return {
//     posts: feedQuery.data?.posts || [],
//     isLoading: feedQuery.isLoading,
//     error: feedQuery.error,
//     handleLike,
//     handleAddComment,
//     refetch: feedQuery.refetch,
//   };
// };