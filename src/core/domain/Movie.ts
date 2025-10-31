/**
 * Domain Entity: Movie
 * Entité métier représentant un film
 */

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  duration: number;
  description?: string;
  releaseDate?: string;
  genres: string[];
  categoryId: string;
}
