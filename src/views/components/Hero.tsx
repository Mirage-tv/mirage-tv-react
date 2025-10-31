import { type Movie } from "../../core/domain/Movie";
import "./Hero.css";

interface HeroProps {
  movie: Movie;
  onPlayClick?: () => void;
  onInfoClick?: () => void;
}

export const Hero = ({ movie, onPlayClick, onInfoClick }: HeroProps) => {
  return (
    <section className="hero">
      <img src={movie.backdropUrl || movie.posterUrl} alt={movie.title} className="hero__backdrop" />
      <div className="hero__gradient" />
      <div className="container">
        <div className="hero__content">
          <h1 className="hero__title">{movie.title}</h1>
          <p className="hero__description">{movie.description || "Découvrez ce film exceptionnel."}</p>
          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" onClick={onPlayClick}>
              ▶ Regarder
            </button>
            <button className="btn btn--secondary btn--lg" onClick={onInfoClick}>
              ℹ Plus d'infos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
