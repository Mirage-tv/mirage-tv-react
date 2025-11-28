import "./Hero.css";
import type { HeroProps } from "./Hero.model";

export const Hero = ({ movie, onPlayClick, onInfoClick }: HeroProps) => {
  return (
    <section className="hero">
      <img src={movie.thumbnailUrl} alt={movie.name} className="hero__backdrop" />
      <div className="hero__gradient" />
      <div className="container">
        <div className="hero__content">
          <h1 className="hero__title">{movie.name}</h1>
          <p className="hero__description">Découvrez ce contenu exceptionnel.</p>
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
