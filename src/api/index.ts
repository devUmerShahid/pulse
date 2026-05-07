// src/api/index.ts
export * from './auth.api';
export * from './post.api';
export * from './like.api';
export * from './comment.api';
export * from './trends.api';

// Explicitly re-export the Post type
export type { Post } from './post.api';