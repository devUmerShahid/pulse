// src/api/comment.api.ts
import http from '../utils/http';

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  replies?: Comment[];
}

export const commentAPI = {
  addComment: async (postId: string, content: string, parentId: string | undefined) => {
    const response = await http.post(`/comments/${postId}`, { content, parentId });
    return response.data;
  },

  getComments: async (postId: string) => {
    const response = await http.get(`/comments/${postId}`);
    return response.data;
  },
};