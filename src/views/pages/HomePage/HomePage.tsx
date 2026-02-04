import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../core/hooks";
import { useCategoryStore } from "../../../infrastructure/store/categoryStore";
import { useFavoritesStore } from "../../../infrastructure/store/favoritesStore";
import { useFeaturedStore } from "../../../infrastructure/store/featuredStore";
import { useViewingHistoryStore } from "../../../infrastructure/store/viewingHistoryStore";
import { Carousel } from "../../components/Carousel/Carousel";
import "../../components/MediaCard/MediaCard.css";
import { MirageOriginals } from "../../components/MirageOriginals/MirageOriginals";
import { PromoSection } from "../../components/PromoSection/PromoSection";
import "./HomePage.css";

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSubscriber } = useAuth();
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  // Featured content
  const { heroBanner, trendingMedia, fetchHeroBanner, fetchTrendingNow, isLoadingHero, error } = useFeaturedStore();

  // Categories
  const { categories, fetchCategories } = useCategoryStore();

  // Continue watching
  const { continueWatching, fetchContinueWatching } = useViewingHistoryStore();

  // Favorites
  const { favorites, fetchFavorites, toggleFavorite, isFavorite } = useFavoritesStore();

  // Load featured content and categories on mount
  useEffect(() => {
    fetchHeroBanner().catch(() => {
      // Erreur déjà gérée dans le store
    });
    fetchTrendingNow().catch(() => {
      // Erreur déjà gérée dans le store
    });
    fetchCategories().catch(() => {});
  }, [fetchHeroBanner, fetchTrendingNow, fetchCategories]);

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

  const handleViewDetail = (mediaId: string) => {
    navigate(`/media/${mediaId}`);
  };

  const handleToggleFavorite = async (mediaId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLikeLoading(mediaId);
    try {
      await toggleFavorite(mediaId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setLikeLoading(null);
    }
  };

  return (
    <div className="home-page">
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
        ) : (
          heroBanner && (
            <div className="hero__content">
              <div className="hero__brand">
                <img src={logo} alt="Mirage" />
                <span className="hero__brand-badge">ORIGINALS</span>
              </div>
              <h1 className="hero__title">{heroBanner.previewMedia.name}</h1>
              {heroBanner.label && <p className="hero__tagline">{heroBanner.label}</p>}
              <div className="hero__actions">
                <button className="hero__btn hero__btn--play" onClick={() => handlePlayMedia(heroBanner.previewMedia.id!)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Lecture</span>
                </button>
                <button className="hero__btn hero__btn--info" onClick={() => navigate(`/media/${heroBanner.previewMedia.id}`)}>
                  <span>Plus d'infos</span>
                </button>
              </div>
            </div>
          )
        )}
        {error && <div className="hero__error">Erreur de chargement: {error}</div>}
      </section>

      {/* Trending Now Section */}
      <Carousel title="Tendances actuelles">
        {trendingMedia?.map((media) => (
          <div key={media.id} className="media-card" onClick={() => handleViewDetail(media.id!)} style={{ cursor: "pointer" }}>
            <div className="media-card__image-container">
              <img
                className="media-card__img"
                src={media.thumbnailUrl || logo}
                alt={media.name}
                onError={(e) => {
                  e.currentTarget.src = logo;
                }}
              />
              <div className="media-card__actions">
                <button
                  className="media-card__action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayMedia(media.id!);
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
            <h3 className="media-card__title">{media.name}</h3>
          </div>
        ))}
      </Carousel>

      {/* Continue Watching Section */}
      {isAuthenticated && continueWatching.length > 0 && (
        <Carousel title="Reprendre la lecture">
          {continueWatching.map((media) => (
            <div key={media.id} className="media-card" onClick={() => handleViewDetail(media.id!)} style={{ cursor: "pointer" }}>
              <div className="media-card__image-container">
                <img
                  src={media.thumbnailUrl || logo}
                  alt={media.name}
                  onError={(e) => {
                    e.currentTarget.src = logo;
                  }}
                />
                {media.progress !== undefined && media.progress !== null && media.progress > 0 && (
                  <div className="media-card__progress-bar">
                    <div className="media-card__progress-fill" style={{ width: `${media.progress * 100}%` }}></div>
                  </div>
                )}
                <div className="media-card__actions">
                  <button
                    className="media-card__action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayMedia(media.id!);
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
              <h3 className="media-card__title">{media.name}</h3>
            </div>
          ))}
        </Carousel>
      )}

      {/* My List Section */}
      {isAuthenticated && favorites.length > 0 && (
        <Carousel title="Ma Liste">
          {favorites.map((media) => (
            <div key={media.id} className="media-card" onClick={() => handleViewDetail(media.id!)} style={{ cursor: "pointer" }}>
              <div className="media-card__image-container">
                <img
                  src={media.thumbnailUrl || logo}
                  alt={media.name}
                  onError={(e) => {
                    e.currentTarget.src = logo;
                  }}
                />
                <div className="media-card__actions">
                  <button
                    className="media-card__action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayMedia(media.id!);
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
              <h3 className="media-card__title">{media.name}</h3>
            </div>
          ))}
        </Carousel>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <h2 className="section-title">Parcourir par catégorie</h2>
          <div className="categories-list">
            {categories.map((category) => (
              <div key={category} className="category-chip" onClick={() => navigate(`/browse/${category}`)}>
                <span className="category-name">{category}</span>
                <span className="category-arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <PromoSection />
      <MirageOriginals />
    </div>
  );
};
