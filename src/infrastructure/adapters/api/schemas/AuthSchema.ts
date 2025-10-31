/**
 * Zod Schemas - Auth API
 * Validation avec authentification par session
 */

import { z } from 'zod';

// ==================== USER MODEL ==================== //

export const UserModelSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100),
  subscription_type: z.enum(['basic', 'premium']),
  avatar_url: z.string().url().optional(),
  created_at: z.string().datetime(),
});

export type UserModel = z.infer<typeof UserModelSchema>;

// ==================== AUTH REQUESTS ==================== //

export const SigninRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SigninRequest = z.infer<typeof SigninRequestSchema>;

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

// ==================== AUTH RESPONSES ==================== //

export const AuthResponseSchema = z.object({
  user: UserModelSchema,
  session_id: z.string(),
  expires_at: z.string().datetime(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ==================== PROFILE UPDATE ==================== //

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar_url: z.string().url().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

// ==================== EMPTY RESPONSE ==================== //

export const EmptyResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;
