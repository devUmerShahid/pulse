// src/api/user.api.ts
import http from '../utils/http';
import type { Post } from './post.api';

export interface ProfileUser {
  id: string;
  username: string;
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  coverImage?: string | null;
  location?: string | null;
  website?: string | null;
  isPrivate?: boolean;
  createdAt?: string;
  email?: string;
  updatedAt?: string;
}

export interface ProfileCounts {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface ProfileResponse {
  user: ProfileUser;
  counts: ProfileCounts;
  isOwnProfile: boolean;
  isFollowing: boolean;
  canViewFull: boolean;
}

export interface ProfileListUser {
  id: string;
  username: string;
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  isFollowing: boolean;
  followedAt?: string;
}

export interface UpdateProfilePayload {
  name?: string | null;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  location?: string | null;
  website?: string | null;
  isPrivate?: boolean;
  username?: string;
  email?: string;
}

export const userAPI = {
  getMyProfile: async (): Promise<ProfileResponse> => {
    const response = await http.get('/users/me');
    return response.data;
  },

  getProfileByUsername: async (username: string): Promise<ProfileResponse> => {
    const response = await http.get(`/users/${username}`);
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const response = await http.patch('/users/me', payload);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await http.delete('/users/me');
    return response.data;
  },

  getUserPosts: async (
    username: string,
    page = 1,
    limit = 20
  ): Promise<{
    username: string;
    posts: Post[];
    page: number;
    totalPages: number;
    totalPosts: number;
  }> => {
    const response = await http.get(`/users/${username}/posts`, {
      params: { page, limit },
    });
    return response.data;
  },

  followUser: async (userId: string) => {
    const response = await http.post(`/users/${userId}/follow`);
    return response.data;
  },

  unfollowUser: async (userId: string) => {
    const response = await http.delete(`/users/${userId}/follow`);
    return response.data;
  },

  getFollowers: async (username: string, page = 1, limit = 20) => {
    const response = await http.get(`/users/${username}/followers`, {
      params: { page, limit },
    });
    return response.data as {
      username: string;
      users: ProfileListUser[];
      page: number;
      totalPages: number;
      total: number;
    };
  },

  getFollowing: async (username: string, page = 1, limit = 20) => {
    const response = await http.get(`/users/${username}/following`, {
      params: { page, limit },
    });
    return response.data as {
      username: string;
      users: ProfileListUser[];
      page: number;
      totalPages: number;
      total: number;
    };
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await http.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.imageUrl;
  },

  getSuggestedUsers: async (limit = 5): Promise<{ users: ProfileListUser[] }> => {
    const response = await http.get('/users/suggested/all', {
      params: { limit },
    });
    return response.data;
  },

  searchUsers: async (query: string, limit = 5): Promise<{ users: ProfileListUser[] }> => {
    const response = await http.get('/users/search/all', {
      params: { q: query, limit },
    });
    return response.data;
  },
};
