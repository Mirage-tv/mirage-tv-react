import { useEffect, useState } from "react";
import "./ShowsPage.css";

interface SeriePreview {
  id: string;
  title: string;
  posterURL?: string | null;
  description?: string | null;
  totalSeasons: number;
  numberOfmedias: number;
}

interface PageSeriePreview {
  items: SeriePreview[];
  metadata: {
    page: number;
    per: number;
    total: number;
  };
}

export const ShowsPage = () => {
  const [shows, setShows] = useState<SeriePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [per] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/media/shows?page=${page}&per=${per}`);
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        const data: PageSeriePreview = await response.json();
        setShows(data.items);
        setTotal(data.metadata.total);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur inconnue lors du chargement des séries"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [page, per]);

  const totalPages = Math.ceil(total / per);

  return (
    <div className="shows-page">
      <h1 className="shows-page__title">Toutes les séries & originaux</h1>
      {loading ? (
        <div className="shows-page__loading">Chargement des séries...</div>
      ) : error ? (
        <div className="shows-page__error">{error}</div>
      ) : shows.length === 0 ? (
        <div className="shows-page__empty">Aucune série trouvée.</div>
      ) : (
        <>
          <div className="shows-page__grid">
            {shows.map((show) => (
              <div key={show.id} className="shows-page__card">
                <div className="shows-page__poster">
                  {show.posterURL ? (
                    <img src={show.posterURL} alt={show.title} />
                  ) : (
                    <div className="shows-page__poster-placeholder">Aucune image</div>
                  )}
                </div>
                <div className="shows-page__info">
                  <h2 className="shows-page__name">{show.title}</h2>
                  <div className="shows-page__meta">
                    <span>{show.totalSeasons} saison{show.totalSeasons > 1 ? "s" : ""}</span>
                    <span>{show.numberOfmedias} épisode{show.numberOfmedias > 1 ? "s" : ""}</span>
                  </div>
                  {show.description && (
                    <p className="shows-page__desc">{show.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="shows-page__pagination">
              <button
                className="shows-page__pagination-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="shows-page__pagination-btn"
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
