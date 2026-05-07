import { useQuery } from '@tanstack/react-query';
import { trendAPI } from '../api/trends.api';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export const useHashtagPosts = (hashtagName: string | undefined) => {
  const query = useQuery({
    queryKey: ['hashtag-posts', hashtagName],
    queryFn: () => {
      if (!hashtagName) throw new Error('Hashtag name is required');
      return trendAPI.getPostsByHashtag(hashtagName);
    },
    enabled: !!hashtagName,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
  });

  return {
    posts: (query.data?.posts as Post[]) || [],
    hashtag: query.data?.hashtag as string | undefined,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
};
