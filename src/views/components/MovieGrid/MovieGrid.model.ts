import { Movie } from '../../../core/domain/Movie';

export interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}
