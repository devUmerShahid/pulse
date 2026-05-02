// src/api/comment.api.ts
import http from '../utils/http';

export interface CommentUser {
  id: string;
  username: string;
  name?: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  user: CommentUser;
  replies: Comment[];
  likes: any[];
}

export const commentAPI = {
  addComment: async (postId: string, content: string, parentId?: string) => {
    const response = await http.post(`/comments/${postId}`, { content, parentId });
    return response.data;
  },

  getComments: async (postId: string) => {
    const response = await http.get(`/comments/${postId}`);
    return response.data;
  },

  toggleCommentLike: async (commentId: string) => {
    const response = await http.post(`/comments/like/${commentId}`);
    return response.data;
  },
};