import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import { mediaService, favoritesService } from "../../../infrastructure/adapters/api";
import "../MoviesPage/MoviesPage.css";

interface LocalMediaThumbnail {
  id: string;
  name: string;
  thumbnailUrl: string;
  isFavorite: boolean;
  progress?: number;
}

export const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [media, setMedia] = useState<LocalMediaThumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [per] = useState(20);
  const [total, setTotal] = useState(0);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  // Formater le nom de la catégorie pour l'affichage
  const formatCategoryName = (cat: string | undefined): string => {
    if (!cat) return "Catégorie";
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ");
  };

  useEffect(() => {
    const fetchMedia = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);
      try {
        const data = await mediaService.getMediaByCategory(category, { page, per });
        const validItems: LocalMediaThumbnail[] = data.items
          .filter((item) => item.id != null)
          .map((item) => ({
            id: item.id!,
            name: item.name ?? "Sans titre",
            thumbnailUrl: item.thumbnailUrl ?? "",
            isFavorite: item.isFavorite ?? false,
            progress: item.progress ?? undefined,
          }));
        setMedia(validItems);
        setTotal(data.metadata.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des médias");
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [category, page, per]);

  const handleToggleFavorite = async (mediaId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setLikeLoading(mediaId);
    try {
      const isNowFavorite = await favoritesService.toggleFavorite({ mediaId });
      setMedia((prev) => prev.map((m) => (m.id === mediaId ? { ...m, isFavorite: isNowFavorite } : m)));
    } catch {
      // Optionnel : afficher une notification d'erreur
    } finally {
      setLikeLoading(null);
    }
  };

  const totalPages = Math.ceil(total / per);

  return (
    <div className="movies-page">
      <h1 className="movies-page__title">{formatCategoryName(category)}</h1>
      {loading ? (
        <div className="movies-page__loading">Chargement...</div>
      ) : error ? (
        <div className="movies-page__error">{error}</div>
      ) : media.length === 0 ? (
        <div className="movies-page__empty">Aucun contenu trouvé dans cette catégorie.</div>
      ) : (
        <>
          <div className="movies-page__grid">
            {media.map((item) => (
              <div key={item.id} className="movies-page__card" onClick={() => navigate(`/watch/${item.id}`)} style={{ cursor: "pointer" }}>
                <div className="movies-page__thumbnail">
                  <img src={item.thumbnailUrl} alt={item.name} />
                  {item.progress !== undefined && (
                    <div className="movies-page__progress-bar">
                      <div className="movies-page__progress-fill" style={{ width: `${item.progress * 100}%` }} />
                    </div>
                  )}
                </div>
                <div className="movies-page__info">
                  <h2 className="movies-page__name">{item.name}</h2>
                  <button
                    className="movies-page__favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item.id);
                    }}
                    disabled={likeLoading === item.id}
                    aria-label={item.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {likeLoading === item.id ? "..." : item.isFavorite ? "❤️" : "🤍"}
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
