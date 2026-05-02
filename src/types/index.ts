// src/types/index.ts
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: string;
}

export interface ApiError {
  error: string;
}