import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import "./MoviesPage.css";

interface MediaThumbnail {
  id: string;
  name: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  progress?: number;
}

interface PageMediaThumbnail {
  items: MediaThumbnail[];
  metadata: {
    page: number;
    per: number;
    total: number;
  };
}

export const MoviesPage = () => {
  const [movies, setMovies] = useState<MediaThumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [per] = useState(20);
  const [total, setTotal] = useState(0);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/media/movies?page=${page}&per=${per}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        const data: PageMediaThumbnail = await response.json();
        setMovies(data.items);
        setTotal(data.metadata.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue lors du chargement des films");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page, per]);

  const handleToggleFavorite = async (mediaId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setLikeLoading(mediaId);
    try {
      const response = await fetch("/api/v1/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erreur lors du like");
      }
      const isNowFavorite = await response.json();
      setMovies((prev) => prev.map((m) => (m.id === mediaId ? { ...m, isFavorite: isNowFavorite } : m)));
    } catch {
      // Optionnel : afficher une notification d'erreur
    } finally {
      setLikeLoading(null);
    }
  };

  const totalPages = Math.ceil(total / per);

  return (
    <div className="movies-page">
      <h1 className="movies-page__title">Tous les films</h1>
      {loading ? (
        <div className="movies-page__loading">Chargement des films...</div>
      ) : error ? (
        <div className="movies-page__error">{error}</div>
      ) : movies.length === 0 ? (
        <div className="movies-page__empty">Aucun film trouvé.</div>
      ) : (
        <>
          <div className="movies-page__grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movies-page__card"
                onClick={() => navigate(`/watch/${movie.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="movies-page__thumbnail">
                  <img src={movie.thumbnailUrl} alt={movie.name} />
                  {movie.progress !== undefined && (
                    <div className="movies-page__progress-bar">
                      <div className="movies-page__progress-fill" style={{ width: `${movie.progress * 100}%` }} />
                    </div>
                  )}
                </div>
                <div className="movies-page__info">
                  <h2 className="movies-page__name">{movie.name}</h2>
                  <button
                    className="movies-page__favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(movie.id);
                    }}
                    disabled={likeLoading === movie.id}
                    aria-label={movie.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {likeLoading === movie.id ? "..." : movie.isFavorite ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="movies-page__pagination">
              <button className="movies-page__pagination-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Précédent
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="movies-page__pagination-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
