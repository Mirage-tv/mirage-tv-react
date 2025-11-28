/**
 * MovieCard Component
 */
import "./MovieCard.css";
import type { MovieCardProps } from "./MovieCard.model";

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <div className="movie-card" onClick={onClick}>
      <img src={movie.thumbnailUrl} alt={movie.name} className="movie-card__poster" />
      {movie.progress && movie.progress > 0 && (
        <div className="movie-card__progress">
          <div className="movie-card__progress-bar" style={{ width: `${movie.progress * 100}%` }} />
        </div>
      )}
      <div className="movie-card__overlay">
        <h3 className="movie-card__title">{movie.name}</h3>
        <div className="movie-card__info">{movie.isFavorite && <span className="movie-card__favorite">❤️</span>}</div>
      </div>
    </div>
  );
};
