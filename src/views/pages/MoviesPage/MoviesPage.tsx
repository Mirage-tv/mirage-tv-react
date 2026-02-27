import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import { mediaService, favoritesService } from "../../../infrastructure/adapters/api";
import type { MediaThumbnail } from "../../../core/domain/types";
import "./MoviesPage.css";

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
        const data = await mediaService.getMovies({ page, per });
        setMovies([...data.items]);
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
      const isNowFavorite = await favoritesService.toggleFavorite({ mediaId });
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
                  {movie.progress != null && (
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
                      if (movie.id) handleToggleFavorite(movie.id);
                    }}
                    disabled={likeLoading === movie.id}
                    aria-label={movie.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {likeLoading === movie.id ? (
                      "..."
                    ) : movie.isFavorite ? (
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
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
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
