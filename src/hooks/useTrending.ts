import { useQuery } from '@tanstack/react-query';
import { trendAPI } from '../api/trends.api';

interface Hashtag {
  id: string;
  name: string;
  _count?: {
    posts: number;
  };
}

interface UseTrendingOptions {
  limit?: number;
  enabled?: boolean;
}

export const useTrending = (options: UseTrendingOptions = {}) => {
  const { limit = 10, enabled = true } = options;

  const query = useQuery({
    queryKey: ['trending', limit],
    queryFn: () => trendAPI.getTrendingHashtags(limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  return {
    trending: (query.data?.trending as Hashtag[]) || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
};
