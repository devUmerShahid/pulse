// src/api/post.api.ts
import http from '../utils/http';

export interface Post {
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

export const postAPI = {
  createPost: async (content: string, imageUrl?: string) => {
    const response = await http.post('/posts', { content, imageUrl });
    return response.data;
  },

  getFeed: async (): Promise<{ posts: Post[] }> => {
    const response = await http.get('/posts');
    return response.data;
  },

  getPostById: async (postId: string) => {
    const response = await http.get(`/posts/${postId}`);
    return response.data;
  },
};