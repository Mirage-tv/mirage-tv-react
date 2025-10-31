/**
 * MovieCard Component
 */

/**
 * MovieCard Component
 */
import "./MovieCard.css";
import type { MovieCardProps } from "./MovieCard.model";

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <div className="movie-card" onClick={onClick}>
      <img src={movie.posterUrl} alt={movie.title} className="movie-card__poster" />
      <div className="movie-card__overlay">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__info">
          <span className="movie-card__rating">⭐ {movie.rating.toFixed(1)}</span>
          <span className="movie-card__duration">{movie.duration} min</span>
        </div>
      </div>
    </div>
  );
};
