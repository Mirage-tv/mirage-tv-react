import { MovieGridProps } from './MovieGrid.model';
import { MovieCard } from '../MovieCard';
import './MovieGrid.css';

export const MovieGrid = ({ movies, onMovieClick }: MovieGridProps) => {
  if (movies.length === 0) {
    return (
      <div className="movie-grid__empty">
        <p className="movie-grid__empty-text">Aucun film disponible</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick(movie)}
        />
      ))}
    </div>
  );
};
