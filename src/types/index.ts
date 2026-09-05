// src/types/index.ts
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  coverImage?: string | null;
  location?: string | null;
  website?: string | null;
  isPrivate?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: string;
}

export interface ApiError {
  error: string;
}