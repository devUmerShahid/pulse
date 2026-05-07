// src/api/trend.api.ts
import http from '../utils/http';

export interface Hashtag {
  id: string;
  name: string;
  _count?: {
    posts: number;
  };
}

export const trendAPI = {
  getTrendingHashtags: async (limit: number = 10) => {
    const response = await http.get(`/trends?limit=${limit}`);
    return response.data;
  },

  getPostsByHashtag: async (hashtagName: string) => {
    const response = await http.get(`/trends/${hashtagName}`);
    return response.data;
  },
};