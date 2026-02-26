import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/hooks';
import './MyListPage.css';

interface MediaThumbnail {
  id: string;
  name: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  progress?: number;
}

export const MyListPage = () => {
  const [favorites, setFavorites] = useState<MediaThumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/favorites', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        const data: MediaThumbnail[] = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue lors du chargement des favoris');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  const handleToggleFavorite = async (mediaId: string) => {
    setLikeLoading(mediaId);
    try {
      const response = await fetch('/api/v1/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Erreur lors du like');
      }
      const isNowFavorite = await response.json();
      setFavorites((prev) => (isNowFavorite ? prev : prev.filter((m) => m.id !== mediaId)));
    } catch {
      // Optionnel : afficher une notification d'erreur
    } finally {
      setLikeLoading(null);
    }
  };

  return (
    <div className="mylist-page">
      <h1 className="mylist-page__title">Ma Liste</h1>
      {loading ? (
        <div className="mylist-page__loading">Chargement de vos favoris...</div>
      ) : error ? (
        <div className="mylist-page__error">{error}</div>
      ) : favorites.length === 0 ? (
        <div className="mylist-page__empty">Vous n'avez pas encore ajouté de favoris.</div>
      ) : (
        <div className="mylist-page__grid">
          {favorites.map((media) => (
            <div key={media.id} className="mylist-page__card" onClick={() => navigate(`/media/${media.id}`)}>
              <div className="mylist-page__thumbnail">
                <img src={media.thumbnailUrl} alt={media.name} />
                {media.progress !== undefined && (
                  <div className="mylist-page__progress-bar">
                    <div className="mylist-page__progress-fill" style={{ width: `${media.progress * 100}%` }} />
                  </div>
                )}
              </div>
              <div className="mylist-page__info">
                <h2 className="mylist-page__name">{media.name}</h2>
                <button
                  className="mylist-page__favorite"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(media.id);
                  }}
                  disabled={likeLoading === media.id}
                  aria-label="Retirer des favoris"
                  title="Retirer des favoris"
                >
                  {likeLoading === media.id ? (
                    '...'
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
