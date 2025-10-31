/**
 * Movie API Repository
 */

import { type Movie } from "../../../core/domain/Movie";
import { type MovieRepository } from "../../../core/ports/repositories/MovieRepository.interface";
import { type HttpClient } from "../../../core/ports/services/HttpClient.interface";
import {
  ContinueWatchingArraySchema,
  MirageOriginalsArraySchema,
  type MovieModel,
  MovieModelSchema,
  MoviesArraySchema,
} from "./schemas/MovieSchema";

export class MovieApiRepository implements MovieRepository {
  readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getTrending(): Promise<Movie[]> {
    const movies = await this.httpClient.get("/movies/trending", MoviesArraySchema);
    return movies.map(this.toEntity);
  }

  async getById(id: string): Promise<Movie> {
    const movie = await this.httpClient.get(`/movies/${id}`, MovieModelSchema);
    return this.toEntity(movie);
  }

  async searchByTitle(query: string): Promise<Movie[]> {
    const movies = await this.httpClient.get(`/movies/search?q=${encodeURIComponent(query)}`, MoviesArraySchema);
    return movies.map(this.toEntity);
  }

  async getByCategory(categoryId: string): Promise<Movie[]> {
    const movies = await this.httpClient.get(`/movies/category/${categoryId}`, MoviesArraySchema);
    return movies.map(this.toEntity);
  }

  async getRecommendations(movieId: string): Promise<Movie[]> {
    const movies = await this.httpClient.get(`/movies/${movieId}/recommendations`, MoviesArraySchema);
    return movies.map(this.toEntity);
  }

  async getContinueWatching(movieId: string): Promise<any> {
    return await this.httpClient.get(`/movies/${movieId}/continue-watching`, ContinueWatchingArraySchema);
  }

  async getMirageOriginals(): Promise<Movie[]> {
    const originals = await this.httpClient.get("/mirage-originals", MirageOriginalsArraySchema);
    return originals.map(this.toEntity);
  }

  private toEntity(model: MovieModel): Movie {
    return {
      id: model.id,
      title: model.title,
      posterUrl: model.poster_url,
      backdropUrl: model.backdrop_url,
      rating: model.rating,
      duration: model.duration_minutes,
      description: model.description,
      releaseDate: model.release_date,
      genres: model.genres,
      categoryId: model.category_id,
    };
  }
}
