import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../core/hooks";
import { mediaService } from "../../../infrastructure/adapters/api";
import { useFavoritesStore } from "../../../infrastructure/store/favoritesStore";
import { useMediaStore } from "../../../infrastructure/store/mediaStore";
import "./MediaDetailPage.css";

export const MediaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isSubscriber } = useAuth();

  const { currentMedia, isLoadingCurrentMedia, error, fetchMediaById, clearCurrentMedia, movies, fetchMovies } = useMediaStore();
  const { favorites, toggleFavorite, fetchFavorites } = useFavoritesStore();
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  const isCurrentFavorite = favorites.some((fav) => fav.id === id);

  useEffect(() => {
    if (id) {
      fetchMediaById(id);
    }
    fetchMovies({ per: 10 });

    return () => {
      clearCurrentMedia();
    };
  }, [id, fetchMediaById, clearCurrentMedia, fetchMovies]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  const similarMedia = movies.filter((movie) => movie.id !== id).slice(0, 6);

  const handlePlay = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isSubscriber) {
      navigate("/subscribe");
      return;
    }
    navigate(`/watch/${id}`);
  };

  const handleToggleFavorite = async (mediaId?: string) => {
    const targetId = mediaId || id;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (targetId) {
      setLikeLoading(targetId);
      try {
        await toggleFavorite(targetId);
      } finally {
        setLikeLoading(null);
      }
    }
  };

  const handleUpVote = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isSubscriber) {
      navigate("/subscribe");
      return;
    }
    if (id) {
      try {
        await mediaService.upVoteMedia(id);
      } catch (error) {
        console.error("Erreur lors du vote:", error);
      }
    }
  };

  const handleViewDetail = (mediaId: string) => {
    navigate(`/media/${mediaId}`);
  };

  if (isLoadingCurrentMedia) {
    return (
      <div className="media-detail">
        <div className="media-detail__loading">
          <div className="media-detail__spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !currentMedia) {
    return (
      <div className="media-detail">
        <div className="media-detail__error">
          <h2>Média introuvable</h2>
          <p>{error || "Ce contenu n'existe pas ou n'est plus disponible."}</p>
          <button className="media-detail__btn-back" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="media-detail">
      {/* Hero Section - Image en fond pleine largeur */}
      <section
        className="media-detail__hero"
        style={{
          backgroundImage: currentMedia.thunbailURL
            ? `linear-gradient(to top, rgba(18,18,18,1) 0%, rgba(18,18,18,0.2) 50%), url(${currentMedia.thunbailURL})`
            : "none",
        }}
      >
        <div className="media-detail__hero-content">
          <h1 className="media-detail__hero-title">{currentMedia.name}</h1>
          <div className="media-detail__hero-actions">
            <div className="media-detail__buttons-container">
              <button className="media-detail__play-btn" onClick={handlePlay}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>play</span>
              </button>
              <button
                className={`media-detail__icon-btn ${isCurrentFavorite ? "media-detail__icon-btn--active" : ""}`}
                onClick={() => handleToggleFavorite()}
                disabled={likeLoading === id}
                aria-label="Ajouter à ma liste"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button className="media-detail__icon-btn" onClick={handleUpVote} aria-label="J'aime">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Badge Mirage Originals */}
        <div className="media-detail__hero-brand">
          <img src={logo} alt="Mirage" className="media-detail__hero-logo" />
          <span className="media-detail__hero-brand-badge">ORIGINALS</span>
        </div>
      </section>

      {/* Info Section - 2 colonnes */}
      <section className="media-detail__info">
        <div className="media-detail__info-left">
          {(() => {
            const season = currentMedia.episodeInfo?.season as number | null | undefined;
            const episodeNbr = currentMedia.episodeInfo?.episodeNbr as number | null | undefined;
            if (season || episodeNbr) {
              return (
                <div className="media-detail__info-header">
                  {season && <span className="media-detail__year">Saison {season}</span>}
                  {episodeNbr && <span className="media-detail__episodes"> – {episodeNbr} épisodes</span>}
                </div>
              );
            }
            return null;
          })()}
          <h2 className="media-detail__info-title">{currentMedia.name}</h2>

          <div className="media-detail__badges">
            {currentMedia.duration && (
              <span className="media-detail__badge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {currentMedia.duration}
              </span>
            )}
            {currentMedia.quality && (
              <span className="media-detail__badge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                {currentMedia.quality.toUpperCase()} Quality
              </span>
            )}
            {currentMedia.ageRange && <span className="media-detail__badge">+{currentMedia.ageRange.replace("+", "")}</span>}
          </div>

          {currentMedia.synopsis && <p className="media-detail__synopsis">{currentMedia.synopsis}</p>}
        </div>
      </section>

      {/* Similar Content */}
      {similarMedia.length > 0 && (
        <section className="media-detail__similar">
          <h2 className="media-detail__similar-title">Contenus similaires</h2>
          <div className="media-detail__similar-grid">
            {similarMedia.map((media) => (
              <div key={media.id} className="media-detail__similar-card" onClick={() => handleViewDetail(media.id!)}>
                <div className="media-detail__similar-image">
                  <img
                    src={media.thumbnailUrl || logo}
                    alt={media.name}
                    onError={(e) => {
                      e.currentTarget.src = logo;
                    }}
                  />
                </div>
                <h3 className="media-detail__similar-name">{media.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subscribe CTA */}
      {!isSubscriber && (
        <section className="media-detail__subscribe">
          <p>Abonnez-vous pour accéder à ce contenu et à tout le catalogue Mirage.</p>
          <button className="media-detail__btn-play" onClick={() => navigate("/subscribe")}>
            S'abonner maintenant
          </button>
        </section>
      )}
    </div>
  );
};
