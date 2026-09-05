// src/api/bookmark.api.ts
import http from '../utils/http';
import type { Post } from './post.api';

export const bookmarkAPI = {
  toggleBookmark: async (postId: string): Promise<{ bookmarked: boolean; bookmarkCount: number }> => {
    const response = await http.post(`/bookmarks/${postId}`);
    return response.data;
  },

  getMyBookmarks: async (): Promise<{ posts: Post[] }> => {
    const response = await http.get('/bookmarks');
    return response.data;
  },
};
