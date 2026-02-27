import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mediaService } from "../../../infrastructure/adapters/api";
import "./ShowDetailPage.css";

interface EpisodeMedia {
  id?: string | null;
  name?: string;
  synopsis?: string;
  duration?: string;
  thumbnailUrl?: string;
  thunbailURL?: string;
  season?: number;
  episode?: number;
  progress?: number;
}

interface ShowDetail {
  id?: string | null;
  title: string;
  description?: string | null;
  posterURL?: string | null;
  totalSeasons: number;
  medias: EpisodeMedia[];
}

export const ShowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  useEffect(() => {
    const fetchShowDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await mediaService.getShowById(id);
        setShow(data as unknown as ShowDetail);
      } catch (err) {
        console.error("Failed to fetch show details:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de la série");
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [id]);

  const handlePlayEpisode = (episodeId: string) => {
    // La vérification d'authentification et d'abonnement sera faite par WatchPage
    navigate(`/watch/${episodeId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Get unique seasons from episodes
  const seasons = show?.medias ? [...new Set(show.medias.map((m) => m.season || 1))].sort((a, b) => a - b) : [1];

  const episodesInSeason = show?.medias?.filter((m) => (m.season || 1) === selectedSeason) || [];

  if (loading) {
    return (
      <div className="show-detail-page">
        <div className="show-detail-page__loading">
          <div className="show-detail-page__spinner"></div>
          <p>Chargement de la série...</p>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="show-detail-page">
        <div className="show-detail-page__error">
          <h2>Erreur</h2>
          <p>{error || "Série introuvable"}</p>
          <button className="show-detail-page__btn-back" onClick={handleBack}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="show-detail-page">
      <button className="show-detail-page__btn-back" onClick={handleBack} aria-label="Retour">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="show-detail-page__header">
        <div className="show-detail-page__poster">
          {show.posterURL ? (
            <img src={show.posterURL} alt={show.title} />
          ) : (
            <div className="show-detail-page__poster-placeholder">Aucune image</div>
          )}
        </div>
        <div className="show-detail-page__info">
          <h1 className="show-detail-page__title">{show.title}</h1>
          <div className="show-detail-page__meta">
            <span>
              {show.totalSeasons} saison{show.totalSeasons > 1 ? "s" : ""}
            </span>
            <span>
              {show.medias?.length || 0} épisode{(show.medias?.length || 0) > 1 ? "s" : ""}
            </span>
          </div>
          {show.description && <p className="show-detail-page__description">{show.description}</p>}
        </div>
      </div>

      {/* Season selector */}
      {seasons.length > 1 && (
        <div className="show-detail-page__seasons">
          <label htmlFor="season-select">Saison :</label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="show-detail-page__season-select"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>
                Saison {season}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Episodes list */}
      <div className="show-detail-page__episodes">
        <h2 className="show-detail-page__episodes-title">Épisodes {seasons.length > 1 ? `- Saison ${selectedSeason}` : ""}</h2>
        {episodesInSeason.length === 0 ? (
          <p className="show-detail-page__no-episodes">Aucun épisode disponible pour cette saison.</p>
        ) : (
          <div className="show-detail-page__episodes-grid">
            {episodesInSeason.map((episode, index) => (
              <div
                key={episode.id || index}
                className="show-detail-page__episode-card"
                onClick={() => episode.id && handlePlayEpisode(episode.id)}
                style={{ cursor: episode.id ? "pointer" : "default" }}
              >
                <div className="show-detail-page__episode-thumbnail">
                  {episode.thumbnailUrl || episode.thunbailURL ? (
                    <img src={episode.thumbnailUrl || episode.thunbailURL} alt={episode.name || `Épisode ${index + 1}`} />
                  ) : (
                    <div className="show-detail-page__episode-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  {episode.progress !== undefined && episode.progress > 0 && (
                    <div className="show-detail-page__episode-progress">
                      <div className="show-detail-page__episode-progress-bar" style={{ width: `${episode.progress * 100}%` }} />
                    </div>
                  )}
                  <div className="show-detail-page__episode-play-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="show-detail-page__episode-info">
                  <h3 className="show-detail-page__episode-title">
                    {episode.episode !== undefined ? `Ép. ${episode.episode} - ` : ""}
                    {episode.name || `Épisode ${index + 1}`}
                  </h3>
                  {episode.duration && <span className="show-detail-page__episode-duration">{episode.duration}</span>}
                  {episode.synopsis && <p className="show-detail-page__episode-synopsis">{episode.synopsis}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
