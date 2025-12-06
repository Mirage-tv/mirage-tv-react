import "./WatchPage.css";
// Watch Page Component
// Video player with playback progress tracking and viewing history integration

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type VideoURLsDTO } from "../../../core/domain/types";
import { useAuth } from "../../../core/hooks";
import { useMediaStore } from "../../../infrastructure/store/mediaStore";
import { useViewingHistoryStore } from "../../../infrastructure/store/viewingHistoryStore";

export const WatchPage = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const [videoUrls, setVideoUrls] = useState<VideoURLsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyEntryId, setHistoryEntryId] = useState<string | null>(null);
  const [requiresSubscription, setRequiresSubscription] = useState(false);

  const { currentMedia, fetchMediaById } = useMediaStore();
  const { createHistoryEntry, updateProgress } = useViewingHistoryStore();

  // Check authentication only - subscription will be checked by the API
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load media details and video URLs
  useEffect(() => {
    if (!mediaId || !isAuthenticated || authLoading) return;

    const loadVideo = async () => {
      setIsLoading(true);
      setError(null);
      setRequiresSubscription(false);

      try {
        // Fetch media details - this includes videoURL for subscribers
        await fetchMediaById(mediaId);
      } catch (err) {
        console.error("Failed to load media:", err);

        // Check if this is a subscription-related error (401 or 403)
        const errorObj = err as { statusCode?: number; message?: string };
        if (errorObj.statusCode === 401 || errorObj.statusCode === 403) {
          setRequiresSubscription(true);
          setError("Un abonnement actif est requis pour regarder ce contenu.");
        } else {
          const errorMessage = err instanceof Error ? err.message : "Failed to load video. Please try again.";
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [mediaId, isAuthenticated, authLoading, fetchMediaById]);

  // Set video URLs from currentMedia once loaded
  useEffect(() => {
    if (currentMedia?.videoURL) {
      setVideoUrls(currentMedia.videoURL);

      // Create viewing history entry (non-blocking)
      if (mediaId) {
        createHistoryEntry(mediaId, 0.0)
          .then(() => setHistoryEntryId(mediaId))
          .catch((err) => {
            console.warn("Failed to create history entry:", err);
            setHistoryEntryId(mediaId);
          });
      }
    } else if (currentMedia && !currentMedia.videoURL) {
      // Media loaded but no videoURL - user is not a subscriber
      setRequiresSubscription(true);
      setError("Un abonnement actif est requis pour regarder ce contenu.");
    }
  }, [currentMedia, mediaId, createHistoryEntry]);

  // Setup video player and progress tracking
  useEffect(() => {
    if (!videoRef.current || !videoUrls || !historyEntryId) return;

    const video = videoRef.current;

    // Set initial progress if available
    if (currentMedia?.progress) {
      video.currentTime = video.duration * currentMedia.progress;
    }

    // Track progress every 5 seconds
    progressIntervalRef.current = window.setInterval(() => {
      if (video.paused || video.ended) return;

      const progress = video.currentTime / video.duration;
      if (!isNaN(progress) && isFinite(progress)) {
        updateProgress(historyEntryId, progress).catch(console.error);
      }
    }, 5000);

    // Update progress when video ends or user leaves
    const handleVideoEnd = () => {
      const progress = video.currentTime / video.duration;
      if (!isNaN(progress) && isFinite(progress)) {
        updateProgress(historyEntryId, progress).catch(console.error);
      }
    };

    const handleBeforeUnload = () => {
      handleVideoEnd();
    };

    video.addEventListener("ended", handleVideoEnd);
    video.addEventListener("pause", handleVideoEnd);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("pause", handleVideoEnd);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleVideoEnd();
    };
  }, [videoUrls, historyEntryId, updateProgress, currentMedia?.progress]);

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="watch-page__watch-page loading">
        <div className="watch-page__loading-spinner">
          <div className="watch-page__spinner"></div>
          <p>Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="watch-page__watch-page loading">
        <div className="watch-page__loading-spinner">
          <div className="watch-page__spinner"></div>
          <p>Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  // Show subscription required message with option to subscribe
  if (requiresSubscription) {
    return (
      <div className="watch-page__watch-page error">
        <div className="watch-page__error-container">
          <h2>Abonnement requis</h2>
          <p>{error}</p>
          <div className="watch-page__error-actions">
            <button onClick={handleBack} className="watch-page__btn-back">
              Retour
            </button>
            <button onClick={() => navigate("/subscribe")} className="watch-page__btn-subscribe">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-page__watch-page error">
        <div className="watch-page__error-container">
          <h2>Oops! Une erreur s'est produite</h2>
          <p>{error}</p>
          <div className="watch-page__error-actions">
            <button onClick={handleBack} className="watch-page__btn-back">
              Retour
            </button>
            <button onClick={() => window.location.reload()} className="watch-page__btn-retry">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!videoUrls) {
    return null;
  }

  return (
    <div className="watch-page__watch-page">
      <button className="watch-page__btn-back-overlay" onClick={handleBack}>
        ← Retour
      </button>

      <div className="watch-page__video-container">
        <video
          ref={videoRef}
          className="watch-page__video-player"
          controls
          autoPlay
          playsInline
          preload="metadata"
          controlsList="nodownload"
        >
          <source src={videoUrls.source} type="video/mp4" />
          {/* Subtitles */}
          {videoUrls.subtitles.map((subtitle, index) => (
            <track
              key={index}
              kind="subtitles"
              label={subtitle.language}
              srcLang={subtitle.language}
              src={subtitle.url}
              default={index === 0}
            />
          ))}
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>

      {currentMedia && (
        <div className="watch-page__video-info">
          <h1>{currentMedia.name}</h1>
          <div className="watch-page__video-meta">
            <span className="watch-page__age-rating">{currentMedia.ageRange}</span>
            <span className="watch-page__quality">{currentMedia.quality}</span>
            <span className="watch-page__duration">{currentMedia.duration}</span>
          </div>
          <p className="watch-page__video-synopsis">{currentMedia.synopsis}</p>

          {(videoUrls.trailerURL || videoUrls.trailer) && (
            <div className="watch-page__trailer-section">
              <h3>Bande-annonce</h3>
              <video className="watch-page__trailer-player" controls controlsList="nodownload">
                <source src={videoUrls.trailerURL || videoUrls.trailer || ""} type="video/mp4" />
              </video>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
