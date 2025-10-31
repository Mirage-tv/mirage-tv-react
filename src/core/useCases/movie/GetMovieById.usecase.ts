/**
 * Use Case: Get Movie By ID
 * Récupère un film par son identifiant
 */

import { type Movie } from "../../domain/Movie";
import { type MovieRepository } from "../../ports/repositories/MovieRepository.interface";

export class GetMovieByIdUseCase {
  readonly movieRepository: MovieRepository;

  constructor(movieRepository: MovieRepository) {
    this.movieRepository = movieRepository;
  }

  async execute(id: string): Promise<Movie> {
    return await this.movieRepository.getById(id);
  }
}
