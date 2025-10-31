/**
 * Zod Schemas - Watchlist API
 * Validation des réponses API pour la watchlist
 */

import { z } from 'zod';

// ==================== WATCHLIST RESPONSE ==================== //

export const WatchlistResponseSchema = z.object({
  movie_ids: z.array(z.string().uuid()),
});

export type WatchlistResponse = z.infer<typeof WatchlistResponseSchema>;

// ==================== WATCHLIST ACTION RESPONSE ==================== //

export const WatchlistActionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type WatchlistActionResponse = z.infer<typeof WatchlistActionResponseSchema>;
