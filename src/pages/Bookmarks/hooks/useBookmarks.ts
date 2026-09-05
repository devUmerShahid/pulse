// src/pages/Bookmarks/hooks/useBookmarks.ts
import { useQuery } from '@tanstack/react-query';
import { bookmarkAPI } from '../../../api';

export const useBookmarks = () => {
  const query = useQuery({
    queryKey: ['bookmarks'],
    queryFn: bookmarkAPI.getMyBookmarks,
  });

  return {
    posts: query.data?.posts || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
