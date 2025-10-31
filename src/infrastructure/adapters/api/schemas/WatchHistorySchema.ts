/**
 * Zod Schemas - Watch History API
 * Validation des réponses API pour l'historique de visionnage
 */

import { z } from 'zod';

// ==================== WATCH HISTORY ITEM ==================== //

export const WatchHistoryItemSchema = z.object({
  id: z.string().uuid(),
  movie_id: z.string().uuid(),
  progress_seconds: z.number().int().min(0),
  watched_at: z.string().datetime(),
  completed: z.boolean(),
});

export type WatchHistoryItem = z.infer<typeof WatchHistoryItemSchema>;

// ==================== WATCH HISTORY ARRAY ==================== //

export const WatchHistoryArraySchema = z.array(WatchHistoryItemSchema);

// ==================== SAVE WATCH HISTORY REQUEST ==================== //

export const SaveWatchHistoryRequestSchema = z.object({
  movie_id: z.string().uuid(),
  progress_seconds: z.number().int().min(0),
  completed: z.boolean().default(false),
});

export type SaveWatchHistoryRequest = z.infer<typeof SaveWatchHistoryRequestSchema>;

// ==================== WATCH HISTORY RESPONSE ==================== //

export const WatchHistoryResponseSchema = z.object({
  success: z.boolean(),
  watch_history: WatchHistoryItemSchema,
});

export type WatchHistoryResponse = z.infer<typeof WatchHistoryResponseSchema>;
