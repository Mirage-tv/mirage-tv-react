import "./WatchPage.css";
// Watch Page Component
// Video player with playback progress tracking and viewing history integration

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type VideoURLsDTO } from "../../../core/domain/types";
import { useAuth } from "../../../core/hooks";
import { videoService } from "../../../infrastructure/adapters/api";
import { useMediaStore } from "../../../infrastructure/store/mediaStore";
import { useViewingHistoryStore } from "../../../infrastructure/store/viewingHistoryStore";

export const WatchPage = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isSubscriber } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const [videoUrls, setVideoUrls] = useState<VideoURLsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyEntryId, setHistoryEntryId] = useState<string | null>(null);

  const { currentMedia, fetchMediaById } = useMediaStore();
  const { createHistoryEntry, updateProgress } = useViewingHistoryStore();

  // Check authentication and subscription
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isSubscriber) {
      navigate("/subscribe");
      return;
    }
  }, [isAuthenticated, isSubscriber, navigate]);

  // Load media details and video URLs
  useEffect(() => {
    if (!mediaId || !isAuthenticated || !isSubscriber) return;

    const loadVideo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch media details
        await fetchMediaById(mediaId);

        // Fetch secure video URLs
        const urls = await videoService.getVideoUrls(mediaId);
        setVideoUrls(urls);

        // Create viewing history entry
        await createHistoryEntry(mediaId, 0.0);
        setHistoryEntryId(mediaId);
      } catch (err) {
        console.error("Failed to load video:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load video. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [mediaId, isAuthenticated, isSubscriber, fetchMediaById, createHistoryEntry]);

  // Setup video player and progress tracking
  useEffect(() => {
    if (!videoRef.current || !videoUrls || !historyEntryId) return;

    const video = videoRef.current;

    // Set initial progress if available
    if (currentMedia?.progress) {
      video.currentTime = video.duration * currentMedia.progress;
    }

    // Track progress every 5 seconds
    progressIntervalRef.current = setInterval(() => {
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

  if (isLoading) {
    return (
      <div className="watch-page__watch-page loading">
        <div className="watch-page__loading-spinner">
          <div className="watch-page__spinner"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-page__watch-page error">
        <div className="watch-page__error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <div className="watch-page__error-actions">
            <button onClick={handleBack} className="watch-page__btn-back">
              Go Back
            </button>
            <button onClick={() => window.location.reload()} className="watch-page__btn-retry">
              Try Again
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
        ← Back
      </button>

      <div className="watch-page__video-container">
        <video ref={videoRef} className="watch-page__video-player" controls autoPlay controlsList="nodownload">
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
          Your browser does not support the video tag.
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

          {videoUrls.trailerURL && (
            <div className="watch-page__trailer-section">
              <h3>Trailer</h3>
              <video className="watch-page__trailer-player" controls controlsList="nodownload">
                <source src={videoUrls.trailerURL} type="video/mp4" />
              </video>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
