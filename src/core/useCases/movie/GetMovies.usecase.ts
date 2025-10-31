/**
 * Use Case: Get Movies
 * Récupère les films en tendance
 */

import type { Movie } from "../../domain/Movie.ts";
import type { MovieRepository } from "../../ports/repositories/MovieRepository.interface.ts";

export class GetMoviesUseCase {
  readonly movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(): Promise<Movie[]> {
    return await this.movieRepository.getTrending();
  }
}
