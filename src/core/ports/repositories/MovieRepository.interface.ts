/**
 * Port: MovieRepository Interface
 * Contrat pour les opérations sur les films
 */

import type { Movie } from "../../domain/Movie";

export interface MovieRepository {
  getTrending(): Promise<Movie[]>;
  getById(id: string): Promise<Movie>;
  searchByTitle(query: string): Promise<Movie[]>;
  getByCategory(categoryId: string): Promise<Movie[]>;
  getRecommendations(movieId: string): Promise<Movie[]>;
}
