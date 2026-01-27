import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../core/hooks";
import { useFavoritesStore } from "../../../infrastructure/store/favoritesStore";
import { useMediaStore } from "../../../infrastructure/store/mediaStore";
import { Carousel } from "../../components/Carousel/Carousel";
import "../../components/MediaCard/MediaCard.css";
import "./MediaDetailPage.css";

export const MediaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isSubscriber } = useAuth();

  const { currentMedia, isLoadingCurrentMedia, error, fetchMediaById, clearCurrentMedia, movies, fetchMovies } = useMediaStore();
  const { favorites, toggleFavorite, fetchFavorites, isFavorite } = useFavoritesStore();
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  const isCurrentFavorite = favorites.some((fav) => fav.id === id);

  useEffect(() => {
    if (id) {
      fetchMediaById(id);
    }
    // Charger les films similaires
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

  // Filtrer les films similaires (exclure le média actuel)
  const similarMedia = movies.filter((movie) => movie.id !== id).slice(0, 8);

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

  const handleViewDetail = (mediaId: string) => {
    navigate(`/media/${mediaId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDuration = (duration: string | undefined): string => {
    if (!duration) return "";
    return duration;
  };

  if (isLoadingCurrentMedia) {
    return (
      <div className="media-detail-page">
        <div className="media-detail-page__loading">
          <div className="media-detail-page__spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !currentMedia) {
    return (
      <div className="media-detail-page">
        <div className="media-detail-page__error">
          <div className="media-detail-page__error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2>Média introuvable</h2>
          <p>{error || "Ce contenu n'existe pas ou n'est plus disponible."}</p>
          <button className="media-detail-page__btn media-detail-page__btn--secondary" onClick={handleBack}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="media-detail-page">
      {/* Hero section with backdrop */}
      <div
        className="media-detail-page__hero"
        style={{
          backgroundImage: currentMedia.thunbailURL ? `url(${currentMedia.thunbailURL})` : undefined,
        }}
      >
        <div className="media-detail-page__hero-overlay">
          <button className="media-detail-page__btn-back" onClick={handleBack}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Retour
          </button>

          <div className="media-detail-page__hero-content">
            <h1 className="media-detail-page__title">{currentMedia.name}</h1>

            <div className="media-detail-page__meta">
              {currentMedia.ageRange && (
                <span className="media-detail-page__meta-item media-detail-page__age-rating">{currentMedia.ageRange}</span>
              )}
              {currentMedia.duration && <span className="media-detail-page__meta-item">{formatDuration(currentMedia.duration)}</span>}
              {currentMedia.quality && <span className="media-detail-page__meta-item">{currentMedia.quality.toUpperCase()}</span>}
            </div>

            <div className="media-detail-page__actions">
              <button className="media-detail-page__btn media-detail-page__btn--primary" onClick={handlePlay}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {currentMedia.progress && currentMedia.progress > 0 ? "Reprendre" : "Lecture"}
              </button>

              {isAuthenticated && (
                <button
                  className={`media-detail-page__btn media-detail-page__btn--icon ${isCurrentFavorite ? "media-detail-page__btn--favorite" : ""}`}
                  onClick={() => handleToggleFavorite()}
                  disabled={likeLoading === id}
                  title={isCurrentFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  {likeLoading === id ? (
                    "..."
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={isCurrentFavorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  )}
                </button>
              )}
            </div>

            {currentMedia.progress && currentMedia.progress > 0 && (
              <div className="media-detail-page__progress">
                <div className="media-detail-page__progress-bar">
                  <div className="media-detail-page__progress-fill" style={{ width: `${Math.min(currentMedia.progress * 100, 100)}%` }} />
                </div>
                <span className="media-detail-page__progress-text">{Math.round(currentMedia.progress * 100)}% regardé</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="media-detail-page__content">
        {currentMedia.synopsis && (
          <div className="media-detail-page__section">
            <h2 className="media-detail-page__section-title">Synopsis</h2>
            <p className="media-detail-page__synopsis">{currentMedia.synopsis}</p>
          </div>
        )}

        {/* Additional info */}
        <div className="media-detail-page__section">
          <h2 className="media-detail-page__section-title">Informations</h2>
          <div className="media-detail-page__info-grid">
            {currentMedia.duration && (
              <div className="media-detail-page__info-item">
                <span className="media-detail-page__info-label">Durée</span>
                <span className="media-detail-page__info-value">{currentMedia.duration}</span>
              </div>
            )}
            {currentMedia.quality && (
              <div className="media-detail-page__info-item">
                <span className="media-detail-page__info-label">Qualité</span>
                <span className="media-detail-page__info-value">{currentMedia.quality.toUpperCase()}</span>
              </div>
            )}
            {currentMedia.ageRange && (
              <div className="media-detail-page__info-item">
                <span className="media-detail-page__info-label">Classification</span>
                <span className="media-detail-page__info-value">{currentMedia.ageRange}</span>
              </div>
            )}
            {currentMedia.isFavorite !== undefined && (
              <div className="media-detail-page__info-item">
                <span className="media-detail-page__info-label">Favoris</span>
                <span className="media-detail-page__info-value">{currentMedia.isFavorite ? "Oui" : "Non"}</span>
              </div>
            )}
          </div>
        </div>

        {!isSubscriber && (
          <div className="media-detail-page__subscribe-cta">
            <p>Abonnez-vous pour accéder à ce contenu et à tout le catalogue Mirage.</p>
            <button className="media-detail-page__btn media-detail-page__btn--primary" onClick={() => navigate("/subscribe")}>
              S'abonner maintenant
            </button>
          </div>
        )}

        {/* Contenus similaires */}
        {similarMedia.length > 0 && (
          <div className="media-detail-page__section">
            <Carousel title="Contenus similaires">
              {similarMedia.map((media) => (
                <div key={media.id} className="media-card" onClick={() => handleViewDetail(media.id!)} style={{ cursor: "pointer" }}>
                  <img
                    src={media.thumbnailUrl || logo}
                    alt={media.name}
                    onError={(e) => {
                      e.currentTarget.src = logo;
                    }}
                  />
                  <div className="media-card__overlay">
                    <h3 className="media-card__title">{media.name}</h3>
                    <div className="media-card__actions">
                      <button
                        className="media-card__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAuthenticated && isSubscriber) {
                            navigate(`/watch/${media.id}`);
                          } else if (!isAuthenticated) {
                            navigate("/login");
                          } else {
                            navigate("/subscribe");
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <button
                        className="media-card__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(media.id!);
                        }}
                        disabled={likeLoading === media.id}
                      >
                        {likeLoading === media.id ? "..." : isFavorite(media.id!) ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};
