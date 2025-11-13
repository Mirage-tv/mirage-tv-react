import "./HomePage.css";
// Home Page Component
// Example implementation using the Mirage-TV API integration

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import { useFavoritesStore } from "../../../infrastructure/store/favoritesStore";
import { useFeaturedStore } from "../../../infrastructure/store/featuredStore";
import { useViewingHistoryStore } from "../../../infrastructure/store/viewingHistoryStore";
import { Carousel } from "../../components/Carousel/Carousel";
import { PromoSection } from "../../components/PromoSection/PromoSection";

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
      {/* =========================================================================
          Hero Section
          ========================================================================== */}
      <section
        className="hero"
        style={{
          backgroundImage: heroBanner
            ? `linear-gradient(to top, rgba(18,18,18,1) 0%, rgba(18,18,18,0.2) 50%), url(${heroBanner.previewMedia.posterURL})`
            : "none",
        }}
      >
        {isLoadingHero ? (
          <div className="hero__loading">
            <span>Chargement...</span>
          </div>
        ) : heroBanner ? (
          <div className="hero__content">
            {heroBanner.label && <span className="hero__label">{heroBanner.label}</span>}
            <h1 className="hero__title">{heroBanner.previewMedia.name}</h1>
            <div className="hero__meta">
              <span>{heroBanner.previewMedia.ageRange}</span>
              <span>{heroBanner.previewMedia.duration}</span>
              <span>{heroBanner.previewMedia.quality}</span>
            </div>
            <p className="hero__synopsis\">{heroBanner.previewMedia.synopsis}</p>
            <div className="hero__actions">
              <button className="hero__btn hero__btn--play" onClick={() => handlePlayMedia(heroBanner.previewMedia.id!)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play</span>
              </button>
              <button className="hero__btn hero__btn--info" onClick={() => navigate(`/media/${heroBanner.previewMedia.id}`)}>
                <span>More Info</span>
              </button>
            </div>
            <div className="hero__brand">
              <img src="/src/assets/logo.png" alt="Mirage Originals" />
              <span>Originals</span>
            </div>
          </div>
        ) : (
          !isAuthenticated && (
            <div className="hero__welcome">
              <h1 className="hero__welcome-title">Bienvenue sur Mirage-TV</h1>
              <p className="hero__welcome-subtitle">Inscrivez-vous pour commencer à regarder du contenu incroyable.</p>
              <div className="hero__welcome-actions">
                <button className="hero__btn hero__btn--play" onClick={() => navigate("/signup")}>
                  S'inscrire
                </button>
                <button className="hero__btn hero__btn--info" onClick={() => navigate("/login")}>
                  Se connecter
                </button>
              </div>
            </div>
          )
        )}
        {error && <div className="hero__error">Erreur de chargement: {error}</div>}
      </section>

      {/* Promo Section */}
      <PromoSection />

      {/* Continue Watching Section */}
      {isAuthenticated && continueWatching.length > 0 && (
        <Carousel title="Reprendre la lecture">
          {continueWatching.map((media) => (
            <div key={media.id} className="media-card">
              <img src={media.thumbnailUrl} alt={media.name} />
              {media.progress && (
                <div className="media-card__progress-bar">
                  <div className="media-card__progress-fill" style={{ width: `${media.progress * 100}%` }}></div>
                </div>
              )}
              <div className="media-card__overlay">
                <h3 className="media-card__title">{media.name}</h3>
                <div className="media-card__actions">
                  <button className="media-card__action-btn" onClick={() => handlePlayMedia(media.id!)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <button className="media-card__action-btn" onClick={() => handleToggleFavorite(media.id!)}>
                    {media.isFavorite ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}

      {/* Trending Now Section */}
      <Carousel title="Tendances actuelles">
        {trendingMedia?.map((media) => (
          <div key={media.id} className="media-card">
            <img src={media.thumbnailUrl} alt={media.name} />
            <div className="media-card__overlay">
              <h3 className="media-card__title">{media.name}</h3>
              <div className="media-card__actions">
                <button className="media-card__action-btn" onClick={() => handlePlayMedia(media.id!)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <button className="media-card__action-btn" onClick={() => handleToggleFavorite(media.id!)}>
                  {media.isFavorite ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* My List Section */}
      {isAuthenticated && favorites.length > 0 && (
        <Carousel title="Ma Liste">
          {favorites.map((media) => (
            <div key={media.id} className="media-card">
              <img src={media.thumbnailUrl} alt={media.name} />
              <div className="media-card__overlay">
                <h3 className="media-card__title">{media.name}</h3>
                <div className="media-card__actions">
                  <button className="media-card__action-btn" onClick={() => handlePlayMedia(media.id!)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <button className="media-card__action-btn" onClick={() => handleToggleFavorite(media.id!)}>
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
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
