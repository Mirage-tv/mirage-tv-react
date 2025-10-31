/**
 * Zod Schemas - Movies API
 * Validation des réponses API pour les films
 */

import { z } from 'zod';

// ==================== MOVIE MODEL ==================== //

export const MovieModelSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  poster_url: z.string().url(),
  backdrop_url: z.string().url().optional(),
  rating: z.number().min(0).max(10),
  duration_minutes: z.number().int().positive(),
  description: z.string().optional(),
  release_date: z.string().optional(),
  genres: z.array(z.string()).default([]),
  category_id: z.string().uuid(),
});

export type MovieModel = z.infer<typeof MovieModelSchema>;

// ==================== MOVIES ARRAY ==================== //

export const MoviesArraySchema = z.array(MovieModelSchema);

// ==================== MOVIE DETAIL ==================== //

export const MovieDetailSchema = MovieModelSchema.extend({
  director: z.string().optional(),
  cast: z.array(z.string()).default([]),
  trailer_url: z.string().url().optional(),
  age_rating: z.string().optional(),
  production_year: z.number().int().optional(),
});

export type MovieDetail = z.infer<typeof MovieDetailSchema>;

// ==================== CONTINUE WATCHING ==================== //

export const ContinueWatchingSchema = z.object({
  movie_id: z.string().uuid(),
  movie: MovieModelSchema,
  progress_seconds: z.number().int().min(0),
  total_duration_seconds: z.number().int().positive(),
  progress_percentage: z.number().min(0).max(100),
  last_watched_at: z.string().datetime(),
});

export type ContinueWatching = z.infer<typeof ContinueWatchingSchema>;

export const ContinueWatchingArraySchema = z.array(ContinueWatchingSchema);

// ==================== MIRAGE ORIGINALS ==================== //

export const MirageOriginalSchema = MovieModelSchema.extend({
  is_original: z.literal(true),
  premiere_date: z.string().datetime().optional(),
  season_count: z.number().int().optional(),
  episode_count: z.number().int().optional(),
});

export type MirageOriginal = z.infer<typeof MirageOriginalSchema>;

export const MirageOriginalsArraySchema = z.array(MirageOriginalSchema);

// ==================== SEARCH RESPONSE ==================== //

export const MovieSearchResponseSchema = z.object({
  results: MoviesArraySchema,
  total: z.number().int(),
  page: z.number().int().positive(),
  page_size: z.number().int().positive(),
  total_pages: z.number().int(),
});

export type MovieSearchResponse = z.infer<typeof MovieSearchResponseSchema>;

// ==================== RECOMMENDATIONS ==================== //

export const RecommendationsResponseSchema = z.object({
  movie_id: z.string().uuid(),
  recommendations: MoviesArraySchema,
});

export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;
