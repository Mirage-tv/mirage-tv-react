import "./HomePage.css";
// Home Page Component
// Example implementation using the Mirage-TV API integration

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import { useFavoritesStore } from "../../../infrastructure/store/favoritesStore";
import { useFeaturedStore } from "../../../infrastructure/store/featuredStore";
import { useViewingHistoryStore } from "../../../infrastructure/store/viewingHistoryStore";

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSubscriber } = useAuth();

  // Featured content
  const { heroBanner, trendingMedia, fetchHeroBanner, fetchTrendingNow, isLoadingHero, isLoadingTrending, error } = useFeaturedStore();

  // Continue watching
  const { continueWatching, fetchContinueWatching, isLoading: isLoadingHistory } = useViewingHistoryStore();

  // Favorites
  const { favorites, fetchFavorites, toggleFavorite, isLoading: isLoadingFavorites } = useFavoritesStore();

  // Load featured content on mount
  useEffect(() => {
    fetchHeroBanner().catch(() => {
      // Erreur déjà gérée dans le store
    });
    fetchTrendingNow().catch(() => {
      // Erreur déjà gérée dans le store
    });
  }, [fetchHeroBanner, fetchTrendingNow]);

  // Load user-specific content if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchContinueWatching().catch(() => {
        // Erreur déjà gérée dans le store
      });
      fetchFavorites().catch(() => {
        // Erreur déjà gérée dans le store
      });
    }
  }, [isAuthenticated, fetchContinueWatching, fetchFavorites]);

  const handlePlayMedia = (mediaId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isSubscriber) {
      navigate("/subscribe");
      return;
    }

    navigate(`/watch/${mediaId}`);
  };

  const handleToggleFavorite = async (mediaId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await toggleFavorite(mediaId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="home-page__hero-section">
        {isLoadingHero ? (
          <div className="home-page__hero-loading">Chargement du contenu vedette...</div>
        ) : heroBanner ? (
          <div className="home-page__hero-banner">
            <div className="home-page__hero-content">
              {heroBanner.label && <span className="home-page__hero-label">{heroBanner.label}</span>}
              <h1 className="home-page__hero-title">{heroBanner.previewMedia.name}</h1>
              <p className="home-page__hero-synopsis">{heroBanner.previewMedia.synopsis}</p>

              <div className="home-page__hero-meta">
                <span className="home-page__age-rating">{heroBanner.previewMedia.ageRange}</span>
                <span className="home-page__quality">{heroBanner.previewMedia.quality}</span>
                <span className="home-page__duration">{heroBanner.previewMedia.duration}</span>
              </div>

              <div className="home-page__hero-actions">
                <button className="home-page__btn-play" onClick={() => handlePlayMedia(heroBanner.previewMedia.id!)}>
                  ▶️ Lecture
                </button>
                {heroBanner.previewMedia.videoURLs?.trailerURL && (
                  <button className="home-page__btn-trailer" onClick={() => navigate(`/trailer/${heroBanner.previewMedia.id}`)}>
                    🎬 Bande-annonce
                  </button>
                )}
                <button className="home-page__btn-info" onClick={() => navigate(`/media/${heroBanner.previewMedia.id}`)}>
                  ℹ️ Plus d'infos
                </button>
              </div>
            </div>

            {heroBanner.previewMedia.posterURL && (
              <div className="home-page__hero-poster">
                <img src={heroBanner.previewMedia.posterURL} alt={heroBanner.previewMedia.name} />
              </div>
            )}
          </div>
        ) : error ? (
          <div className="home-page__hero-loading">
            <p>⚠️ Erreur lors du chargement du contenu</p>
            <span className="home-page__hero-error">{error}</span>
          </div>
        ) : !isAuthenticated ? (
          <div className="home-page__welcome-hero">
            <div className="home-page__welcome-hero-content">
              <h1>Bienvenue sur Mirage-TV</h1>
              <p>Inscrivez-vous pour commencer à regarder du contenu incroyable</p>
              <div className="home-page__welcome-hero-actions">
                <button className="home-page__btn-signup" onClick={() => navigate("/signup")}>
                  S'inscrire
                </button>
                <button className="home-page__btn-login" onClick={() => navigate("/login")}>
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Continue Watching Section */}
      {isAuthenticated && continueWatching.length > 0 && (
        <section className="home-page__content-rail">
          <h2>Reprendre la lecture</h2>
          {isLoadingHistory ? (
            <div className="home-page__rail-loading">Chargement...</div>
          ) : (
            <div className="home-page__media-carousel">
              {continueWatching.map((media) => (
                <div key={media.id} className="home-page__media-card">
                  <div className="home-page__media-thumbnail">
                    <img src={media.thumbnailUrl} alt={media.name} />
                    {media.progress && (
                      <div className="home-page__progress-bar">
                        <div className="home-page__progress-fill" style={{ width: `${media.progress * 100}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="home-page__media-info">
                    <h3>{media.name}</h3>
                    <button className="home-page__btn-favorite" onClick={() => handleToggleFavorite(media.id!)}>
                      {media.isFavorite ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <button className="home-page__btn-play-overlay" onClick={() => handlePlayMedia(media.id!)}>
                    ▶️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trending Now Section */}
      <section className="home-page__content-rail">
        <h2>Tendances actuelles</h2>
        {isLoadingTrending ? (
          <div className="home-page__rail-loading">Chargement des tendances...</div>
        ) : trendingMedia && trendingMedia.length > 0 ? (
          <div className="home-page__media-carousel">
            {trendingMedia.map((media) => (
              <div key={media.id} className="home-page__media-card">
                <div className="home-page__media-thumbnail">
                  <img src={media.thumbnailUrl} alt={media.name} />
                  {media.progress && (
                    <div className="home-page__progress-bar">
                      <div className="home-page__progress-fill" style={{ width: `${media.progress * 100}%` }} />
                    </div>
                  )}
                </div>
                <div className="home-page__media-info">
                  <h3>{media.name}</h3>
                  <button className="home-page__btn-favorite" onClick={() => handleToggleFavorite(media.id!)}>
                    {media.isFavorite ? "❤️" : "🤍"}
                  </button>
                </div>
                <button className="home-page__btn-play-overlay" onClick={() => handlePlayMedia(media.id!)}>
                  ▶️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-page__rail-loading">
            <p>Aucun contenu tendance disponible</p>
          </div>
        )}
      </section>

      {/* My List Section */}
      {isAuthenticated && favorites.length > 0 && (
        <section className="home-page__content-rail">
          <h2>Ma Liste</h2>
          {isLoadingFavorites ? (
            <div className="home-page__rail-loading">Chargement de vos favoris...</div>
          ) : (
            <div className="home-page__media-carousel">
              {favorites.map((media) => (
                <div key={media.id} className="home-page__media-card">
                  <div className="home-page__media-thumbnail">
                    <img src={media.thumbnailUrl} alt={media.name} />
                    {media.progress && (
                      <div className="home-page__progress-bar">
                        <div className="home-page__progress-fill" style={{ width: `${media.progress * 100}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="home-page__media-info">
                    <h3>{media.name}</h3>
                    <button className="home-page__btn-favorite" onClick={() => handleToggleFavorite(media.id!)}>
                      ❤️
                    </button>
                  </div>
                  <button className="home-page__btn-play-overlay" onClick={() => handlePlayMedia(media.id!)}>
                    ▶️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* User Status Banner */}
      {isAuthenticated && !isSubscriber && (
        <section className="home-page__subscription-banner">
          <div className="home-page__banner-content">
            <h3>Abonnez-vous pour regarder du contenu illimité</h3>
            <p>Accédez à des milliers de films et séries TV</p>
            <button className="home-page__btn-subscribe" onClick={() => navigate("/subscribe")}>
              S'abonner maintenant
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
