/**
 * Use Case: Search Movies
 * Recherche des films par titre
 */

import { type Movie } from "../../domain/Movie.ts";
import { type MovieRepository } from "../../ports/repositories/MovieRepository.interface.ts";

export class SearchMoviesUseCase {
  readonly movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(query: string): Promise<Movie[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return await this.movieRepository.searchByTitle(query.trim());
  }
}
