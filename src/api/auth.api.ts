// src/api/auth.api.ts
import http from '../utils/http';
import type { LoginResponse } from '../types';

export const authAPI = {
  register: async (payload: {
    email: string;
    username: string;
    name?: string;
    password: string;
  }) => {
    const response = await http.post('/auth/register', payload);
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await http.post('/auth/login', { email, password });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await http.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await http.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};