// src/api/like.api.ts
import http from '../utils/http';

export const likeAPI = {
  toggleLike: async (postId: string) => {
    const response = await http.post(`/likes/${postId}`);
    return response.data;
  },
};