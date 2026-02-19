import "./WatchPage.css";
// Watch Page Component
// Video player with playback progress tracking and viewing history integration
// Uses hybrid storage (localStorage + API) for optimal performance

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type VideoURLsDTO } from "../../../core/domain/types";
import { useAuth } from "../../../core/hooks";
import { PlaybackStatus, videoProgressService } from "../../../infrastructure/services/VideoProgressService";
import { useMediaStore } from "../../../infrastructure/store/mediaStore";
import { useViewingHistoryStore } from "../../../infrastructure/store/viewingHistoryStore";

// Constants
const LOCAL_UPDATE_INTERVAL_MS = 2000; // Update local storage every 2 seconds
const API_SYNC_INTERVAL_MS = 30000; // Sync to API every 30 seconds during playback

export const WatchPage = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const localProgressIntervalRef = useRef<number | null>(null);
  const apiSyncIntervalRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const lastMediaIdRef = useRef<string | null>(null);

  const [videoUrls, setVideoUrls] = useState<VideoURLsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyEntryId, setHistoryEntryId] = useState<string | null>(null);
  const [requiresSubscription, setRequiresSubscription] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>(PlaybackStatus.NotStarted);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const [subtitleCues, setSubtitleCues] = useState<Array<{ start: number; end: number; text: string }>>([]);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);

  const { currentMedia, fetchMediaById } = useMediaStore();
  const { createHistoryEntry } = useViewingHistoryStore();

  // ============================================================================
  // Progress Tracking Functions
  // ============================================================================

  const getVideoProgress = useCallback((): {
    progress: number;
    currentTime: number;
    duration: number;
  } | null => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return null;

    const progress = video.currentTime / video.duration;
    if (!isFinite(progress) || isNaN(progress)) return null;

    return {
      progress,
      currentTime: video.currentTime,
      duration: video.duration,
    };
  }, []);

  // Parse VTT timestamp to seconds
  const parseVttTime = useCallback((timeStr: string): number => {
    const parts = timeStr.split(":");
    if (parts.length === 3) {
      const [hours, minutes, secondsMs] = parts;
      const [seconds, ms] = secondsMs.split(".");
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms || "0") / 1000;
    } else if (parts.length === 2) {
      const [minutes, secondsMs] = parts;
      const [seconds, ms] = secondsMs.split(".");
      return parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms || "0") / 1000;
    }
    return 0;
  }, []);

  // Load and parse VTT file
  useEffect(() => {
    if (!videoUrls?.subtitles?.length) return;

    const loadSubtitles = async () => {
      try {
        const response = await fetch(videoUrls.subtitles[0].url);
        const vttText = await response.text();

        const cues: Array<{ start: number; end: number; text: string }> = [];
        const lines = vttText.split("\n");
        let i = 0;

        while (i < lines.length) {
          const line = lines[i].trim();
          // Look for timestamp line
          if (line.includes(" --> ")) {
            const [startStr, endStr] = line.split(" --> ");
            const start = parseVttTime(startStr.trim());
            const end = parseVttTime(endStr.trim().split(" ")[0]); // Handle position info

            // Collect text lines and strip tags
            const textLines: string[] = [];
            i++; // Move to line after timestamp

            while (i < lines.length) {
              const currentLine = lines[i].trim();

              // Safety: if we hit the next timestamp, stop immediately
              if (currentLine.includes(" --> ")) {
                i--; // Backtrack so outer loop processes this timestamp
                break;
              }

              // Handle empty lines
              if (currentLine === "") {
                // If we already have text, a blank line ends the cue
                if (textLines.length > 0) {
                  break;
                }
                // If no text yet, it's a leading blank line (quirk), skip it
                i++;
                continue;
              }

              // Process text line
              const cleanLine = currentLine.replace(/<[^>]*>/g, "");
              if (cleanLine) {
                textLines.push(cleanLine);
              }
              i++;
            }

            if (textLines.length > 0) {
              cues.push({ start, end, text: textLines.join(" ") });
            }
          }
          i++;
        }

        setSubtitleCues(cues);
      } catch (err) {
        console.error("Failed to load subtitles:", err);
      }
    };

    loadSubtitles();
  }, [videoUrls, parseVttTime]);

  // Sync subtitle with video time
  useEffect(() => {
    const video = videoRef.current;
    if (!video || subtitleCues.length === 0) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const activeCue = subtitleCues.find((cue) => currentTime >= cue.start && currentTime <= cue.end);
      setCurrentSubtitle(activeCue?.text || "");
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [subtitleCues]);

  // Désactiver les tracks natifs (on utilise uniquement les sous-titres custom)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const disableTracks = () => {
      const tracks = video.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = "disabled";
      }
    };

    disableTracks();
    video.addEventListener("loadedmetadata", disableTracks);

    return () => video.removeEventListener("loadedmetadata", disableTracks);
  }, []);

  const updateLocalProgress = useCallback(() => {
    if (!mediaId) return;

    const progressData = getVideoProgress();
    if (!progressData) return;

    // Update local storage
    videoProgressService.updateProgressLocal(mediaId, progressData.progress, progressData.currentTime, progressData.duration);

    // Update status display
    const newStatus = videoProgressService.getStatus(mediaId);
    if (newStatus !== playbackStatus) {
      setPlaybackStatus(newStatus);
    }
  }, [mediaId, getVideoProgress, playbackStatus]);

  const syncToApi = useCallback(async () => {
    if (!mediaId) return;
    await videoProgressService.syncToApi(mediaId);
  }, [mediaId]);

  const saveProgressAndSync = useCallback(async () => {
    if (!mediaId) return;

    const progressData = getVideoProgress();
    if (!progressData) return;

    try {
      await videoProgressService.saveProgress(mediaId, progressData.progress, progressData.currentTime, progressData.duration);
    } catch (error) {
      console.warn("Failed to save progress:", error);
    }
  }, [mediaId, getVideoProgress]);

  // ============================================================================
  // Video Event Handlers
  // ============================================================================

  // const handlePlayPause = useCallback(() => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   if (video.paused) {
  //     video.play().catch(console.error);
  //   } else {
  //     video.pause();
  //   }
  // }, []);

  const handlePlay = useCallback(() => {
    isPlayingRef.current = true;

    // Start local progress tracking
    if (!localProgressIntervalRef.current) {
      localProgressIntervalRef.current = window.setInterval(updateLocalProgress, LOCAL_UPDATE_INTERVAL_MS);
    }

    // Start API sync interval
    if (!apiSyncIntervalRef.current) {
      apiSyncIntervalRef.current = window.setInterval(syncToApi, API_SYNC_INTERVAL_MS);
    }
  }, [updateLocalProgress, syncToApi]);

  const handlePause = useCallback(() => {
    isPlayingRef.current = false;

    // Save progress immediately on pause
    saveProgressAndSync();

    // Clear intervals
    if (localProgressIntervalRef.current) {
      window.clearInterval(localProgressIntervalRef.current);
      localProgressIntervalRef.current = null;
    }
    if (apiSyncIntervalRef.current) {
      window.clearInterval(apiSyncIntervalRef.current);
      apiSyncIntervalRef.current = null;
    }
  }, [saveProgressAndSync]);

  const handleEnded = useCallback(() => {
    isPlayingRef.current = false;

    if (!mediaId) return;

    // Mark as finished (95%+ is considered finished)
    const progressData = getVideoProgress();
    if (progressData) {
      videoProgressService.saveProgress(mediaId, 1.0, progressData.duration, progressData.duration).catch(console.error);
    }

    setPlaybackStatus(PlaybackStatus.Finished);

    // Clear intervals
    if (localProgressIntervalRef.current) {
      window.clearInterval(localProgressIntervalRef.current);
      localProgressIntervalRef.current = null;
    }
    if (apiSyncIntervalRef.current) {
      window.clearInterval(apiSyncIntervalRef.current);
      apiSyncIntervalRef.current = null;
    }
  }, [mediaId, getVideoProgress]);

  const handleSeeked = useCallback(() => {
    // Save progress after seeking
    updateLocalProgress();
  }, [updateLocalProgress]);

  const handleFullscreenChange = useCallback(() => {
    // Sync to API when exiting fullscreen
    if (!document.fullscreenElement) {
      syncToApi();
    }
  }, [syncToApi]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden" && isPlayingRef.current) {
      // Save progress when user switches tabs/apps
      saveProgressAndSync();
    }
  }, [saveProgressAndSync]);

  const toggleFullscreen = useCallback(() => {
    setIsFakeFullscreen((prev) => !prev);
  }, []);

  // Handler touche Échap pour quitter le faux plein écran
  useEffect(() => {
    if (!isFakeFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFakeFullscreen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFakeFullscreen]);

  // Bloquer le scroll du body en faux plein écran
  useEffect(() => {
    if (isFakeFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFakeFullscreen]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (!mediaId || !isAuthenticated || authLoading) return;

    const loadVideo = async () => {
      setIsLoading(true);
      setError(null);
      setRequiresSubscription(false);

      try {
        await fetchMediaById(mediaId);
      } catch (err) {
        console.error("Failed to load media:", err);

        const errorObj = err as { statusCode?: number; message?: string };
        if (errorObj.statusCode === 401 || errorObj.statusCode === 403) {
          setRequiresSubscription(true);
          setError("Un abonnement actif est requis pour regarder ce contenu.");
        } else {
          const errorMessage = err instanceof Error ? err.message : "Impossible de charger la vidéo. Veuillez réessayer.";
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [mediaId, isAuthenticated, authLoading, fetchMediaById]);

  // ============================================================================
  // Initialize Playback
  // ============================================================================

  // Reset initialization when mediaId changes
  useEffect(() => {
    if (mediaId && mediaId !== lastMediaIdRef.current) {
      lastMediaIdRef.current = mediaId;
      hasInitializedRef.current = false;
    }
  }, [mediaId]);

  useEffect(() => {
    if (currentMedia?.videoURL) {
      // Proxy les URLs des sous-titres pour éviter les problèmes CORS
      const videoConfig = { ...currentMedia.videoURL };
      if (videoConfig.subtitles && videoConfig.subtitles.length > 0) {
        const newSubtitles = videoConfig.subtitles.map((sub) => {
          // Utilise le proxy VTT pour les URLs externes
          if (sub.url.startsWith("http")) {
            return { ...sub, url: `/proxy-vtt/${encodeURIComponent(sub.url)}` };
          }
          return sub;
        });
        videoConfig.subtitles = newSubtitles;
      }

      setVideoUrls(videoConfig);

      if (mediaId && !hasInitializedRef.current) {
        hasInitializedRef.current = true;

        // Start playback tracking and get best resume position
        videoProgressService
          .startPlayback(mediaId, currentMedia.progress ?? 0)
          .then(() => {
            setHistoryEntryId(mediaId);
            setPlaybackStatus(videoProgressService.getStatus(mediaId));
          })
          .catch((err) => {
            console.warn("Failed to start playback tracking:", err);
            // Still set historyEntryId to enable progress tracking
            setHistoryEntryId(mediaId);
          });

        // Also create history entry in case it doesn't exist
        createHistoryEntry(mediaId, currentMedia.progress ?? 0).catch(() => {
          // Entry might already exist, that's OK
        });
      }
    } else if (currentMedia && !currentMedia.videoURL) {
      setRequiresSubscription(true);
      setError("Un abonnement actif est requis pour regarder ce contenu.");
    }
  }, [currentMedia, mediaId, createHistoryEntry]);

  // ============================================================================
  // Set Initial Video Position
  // ============================================================================

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !historyEntryId || !mediaId) return;

    const applyResumeTime = () => {
      if (!video.duration || isNaN(video.duration)) return;

      // Get the best resume time (with 30s tolerance)
      const resumeTime = videoProgressService.getResumeTime(mediaId, video.duration, currentMedia?.progress ?? undefined);

      if (resumeTime > 0 && resumeTime < video.duration) {
        video.currentTime = resumeTime;
      }
    };

    const handleLoadedMetadata = () => {
      applyResumeTime();
    };

    // If metadata is already loaded
    if (video.readyState >= 1 && video.duration > 0) {
      applyResumeTime();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [historyEntryId, mediaId, currentMedia?.progress]);

  // ============================================================================
  // Video Event Listeners
  // ============================================================================

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !historyEntryId) return;

    // Add event listeners
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("seeked", handleSeeked);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("seeked", handleSeeked);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Clear intervals
      if (localProgressIntervalRef.current) {
        window.clearInterval(localProgressIntervalRef.current);
        localProgressIntervalRef.current = null;
      }
      if (apiSyncIntervalRef.current) {
        window.clearInterval(apiSyncIntervalRef.current);
        apiSyncIntervalRef.current = null;
      }

      // Final save on unmount
      if (mediaId && isPlayingRef.current) {
        const progressData = video.duration
          ? {
              progress: video.currentTime / video.duration,
              currentTime: video.currentTime,
              duration: video.duration,
            }
          : null;

        if (progressData && isFinite(progressData.progress)) {
          videoProgressService
            .saveProgress(mediaId, progressData.progress, progressData.currentTime, progressData.duration)
            .catch(console.error);
        }
      }
    };
  }, [historyEntryId, mediaId, handlePlay, handlePause, handleEnded, handleSeeked, handleFullscreenChange, handleVisibilityChange]);

  // ============================================================================
  // Navigation
  // ============================================================================

  const handleBack = useCallback(() => {
    // Save progress before leaving
    saveProgressAndSync();
    navigate(-1);
  }, [navigate, saveProgressAndSync]);

  // ============================================================================
  // Render
  // ============================================================================

  if (authLoading) {
    return (
      <div className="watch-page watch-page__loading">
        <div className="watch-page__loading-spinner">
          <div className="watch-page__spinner"></div>
          <p>Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="watch-page watch-page__loading">
        <div className="watch-page__loading-spinner">
          <div className="watch-page__spinner"></div>
          <p>Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (requiresSubscription) {
    return (
      <div className="watch-page watch-page__error">
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
      <div className="watch-page watch-page__error">
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
    <div className="watch-page">
      {!isFakeFullscreen && (
        <button className="watch-page__btn-back-overlay" onClick={handleBack}>
          ← Retour
        </button>
      )}

      <div
        className={`watch-page__video-container${isFakeFullscreen ? " watch-page__video-container--fake-fullscreen" : ""}`}
        ref={videoContainerRef}
      >
        <video
          ref={videoRef}
          className="watch-page__video-player"
          onDoubleClick={toggleFullscreen}
          onContextMenu={(e) => e.preventDefault()}
          autoPlay
          playsInline
          controls
          preload="metadata"
          controlsList="nodownload noplaybackrate nofullscreen"
          disablePictureInPicture
        >
          <source src={videoUrls.source} type="video/mp4" />
          {/* Track natif pour les sous-titres (nécessaire pour iOS fullscreen) */}
          {videoUrls.subtitles?.map((sub, index) => (
            <track
              key={index}
              kind="subtitles"
              src={sub.url}
              srcLang={sub.language === "Francais" ? "fr" : "en"}
              label={sub.language}
            />
          ))}
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>

        {/* Custom Video Controls Overlay */}
        <div className="watch-page__video-controls-overlay">
          {videoUrls.subtitles && videoUrls.subtitles.length > 0 && (
            <button
              className={`watch-page__btn-st ${showSubtitles ? "active" : ""}`}
              onClick={() => setShowSubtitles(!showSubtitles)}
              title={showSubtitles ? "Désactiver les sous-titres" : "Activer les sous-titres"}
            >
              ST
            </button>
          )}
          <button className="watch-page__btn-fullscreen" onClick={toggleFullscreen} title="Plein écran">
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
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>

        {/* Zone de sous-titres externe */}
        <div className="watch-page__subtitles">
          {showSubtitles && currentSubtitle && <p className="watch-page__subtitle-text">{currentSubtitle}</p>}
        </div>
      </div>

      {currentMedia && !isFakeFullscreen && (
        <div className="watch-page__video-info">
          <h1>{currentMedia.name}</h1>
          <div className="watch-page__video-meta">
            <span className="watch-page__age-rating">{currentMedia.ageRange}</span>
            <span className="watch-page__quality">{currentMedia.quality}</span>
            <span className="watch-page__duration">{currentMedia.duration}</span>
            {playbackStatus === PlaybackStatus.Finished && (
              <span className="watch-page__status watch-page__status--finished">✓ Terminé</span>
            )}
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
