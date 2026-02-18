// VideoProgressService
// Service de gestion de la progression vidéo avec approche hybride (localStorage + API)
// Optimisé pour économiser les ressources réseau

import { viewingHistoryService } from "../adapters/api";

// ============================================================================
// Types
// ============================================================================

export const PlaybackStatus = {
  NotStarted: "notStarted",
  InProgress: "inProgress",
  Finished: "finished",
} as const;
export type PlaybackStatus = (typeof PlaybackStatus)[keyof typeof PlaybackStatus];

export interface LocalProgressData {
  readonly mediaId: string;
  readonly progress: number; // 0.0 to 1.0
  readonly currentTime: number; // in seconds
  readonly duration: number; // in seconds
  readonly status: PlaybackStatus;
  readonly updatedAt: number; // timestamp
}

interface ProgressEntry {
  progress: number;
  currentTime: number;
  duration: number;
  status: PlaybackStatus;
  updatedAt: number;
  pendingSync: boolean; // Indicates if local progress needs to be synced to API
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "mirage_video_progress";
const FINISHED_THRESHOLD = 0.95; // 95% = finished
const MAX_RESUME_OFFSET_SECONDS = 30; // Tolérance de 30 secondes max
const DEBOUNCE_LOCAL_SAVE_MS = 1000; // Debounce pour sauvegarde locale
const MIN_PROGRESS_CHANGE_FOR_SYNC = 0.02; // 2% minimum change before API sync

// ============================================================================
// VideoProgressService
// ============================================================================

class VideoProgressService {
  private progressCache: Map<string, ProgressEntry> = new Map();
  private saveDebounceTimers: Map<string, number> = new Map();
  private lastSyncedProgress: Map<string, number> = new Map();

  constructor() {
    this.loadFromLocalStorage();
    this.setupVisibilityListener();
    this.setupBeforeUnloadListener();
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: Record<string, ProgressEntry> = JSON.parse(stored);
        Object.entries(data).forEach(([mediaId, entry]) => {
          this.progressCache.set(mediaId, entry);
        });
      }
    } catch (error) {
      console.warn("Failed to load progress from localStorage:", error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      const data: Record<string, ProgressEntry> = {};
      this.progressCache.forEach((entry, mediaId) => {
        data[mediaId] = entry;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save progress to localStorage:", error);
    }
  }

  // ============================================================================
  // Event Listeners for Auto-Save
  // ============================================================================

  private setupVisibilityListener(): void {
    // Save when user leaves the tab/window
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.syncAllPendingToApi();
      }
    });
  }

  private setupBeforeUnloadListener(): void {
    // Final save before page unload
    window.addEventListener("beforeunload", () => {
      this.saveToLocalStorage();
      // Note: API calls in beforeunload are unreliable,
      // but we try with sendBeacon if available
      this.syncAllPendingToApiSync();
    });
  }

  // ============================================================================
  // Public API - Progress Management
  // ============================================================================

  /**
   * Démarre le suivi de la lecture pour un média
   * Passe le status à "inProgress"
   */
  async startPlayback(mediaId: string, serverProgress?: number): Promise<number> {
    // Get local progress
    const localEntry = this.progressCache.get(mediaId);
    const localProgress = localEntry?.progress ?? 0;
    const localCurrentTime = localEntry?.currentTime ?? 0;

    // Determine the best starting point (most advanced between local and server)
    const apiProgress = serverProgress ?? 0;
    const bestProgress = Math.max(localProgress, apiProgress);

    // Update local cache with inProgress status
    const entry: ProgressEntry = {
      progress: bestProgress,
      currentTime: localEntry?.currentTime ?? 0,
      duration: localEntry?.duration ?? 0,
      status: PlaybackStatus.InProgress,
      updatedAt: Date.now(),
      pendingSync: true,
    };
    this.progressCache.set(mediaId, entry);
    this.saveToLocalStorage();

    // Create/update history entry in API (non-blocking)
    this.createOrUpdateApiEntry(mediaId, bestProgress).catch(console.error);

    // Return the current time to resume from (in seconds)
    // Use local currentTime if available, otherwise calculate from progress
    if (localCurrentTime > 0 && localProgress >= apiProgress) {
      return localCurrentTime;
    }
    return 0; // Will be calculated by the caller using progress * duration
  }

  /**
   * Met à jour la progression localement avec debounce
   * Appelé fréquemment pendant la lecture
   */
  updateProgressLocal(mediaId: string, progress: number, currentTime: number, duration: number): void {
    if (!this.isValidProgress(progress)) return;

    const status = this.determineStatus(progress);
    const entry: ProgressEntry = {
      progress,
      currentTime,
      duration,
      status,
      updatedAt: Date.now(),
      pendingSync: true,
    };

    this.progressCache.set(mediaId, entry);

    // Debounce local storage save
    this.debouncedSaveToLocalStorage(mediaId);
  }

  /**
   * Sauvegarde la progression vers l'API
   * Appelé aux moments clés uniquement
   */
  async syncToApi(mediaId: string): Promise<void> {
    const entry = this.progressCache.get(mediaId);
    if (!entry || !entry.pendingSync) return;

    const lastSynced = this.lastSyncedProgress.get(mediaId) ?? 0;
    const progressDiff = Math.abs(entry.progress - lastSynced);

    // Skip if progress hasn't changed enough (unless finished)
    if (progressDiff < MIN_PROGRESS_CHANGE_FOR_SYNC && entry.status !== PlaybackStatus.Finished) {
      return;
    }

    try {
      await viewingHistoryService.updateProgress({
        mediaId,
        progress: entry.progress,
      });

      // Mark as synced
      entry.pendingSync = false;
      this.lastSyncedProgress.set(mediaId, entry.progress);
      this.progressCache.set(mediaId, entry);
      this.saveToLocalStorage();
    } catch (error) {
      console.warn("Failed to sync progress to API:", error);
      // Keep pendingSync = true for retry later
    }
  }

  /**
   * Sauvegarde finale obligatoire (pause, sortie, fin)
   */
  async saveProgress(mediaId: string, progress: number, currentTime: number, duration: number): Promise<void> {
    if (!this.isValidProgress(progress)) return;

    const status = this.determineStatus(progress);
    const entry: ProgressEntry = {
      progress,
      currentTime,
      duration,
      status,
      updatedAt: Date.now(),
      pendingSync: false, // Will be synced immediately
    };

    this.progressCache.set(mediaId, entry);
    this.saveToLocalStorage();

    // Sync to API
    try {
      await viewingHistoryService.updateProgress({
        mediaId,
        progress,
      });
      this.lastSyncedProgress.set(mediaId, progress);
    } catch (error) {
      // Mark for later sync if failed
      entry.pendingSync = true;
      this.progressCache.set(mediaId, entry);
      this.saveToLocalStorage();
      throw error;
    }
  }

  /**
   * Récupère la progression la plus avancée (locale ou serveur)
   */
  getBestProgress(mediaId: string, serverProgress?: number): LocalProgressData | null {
    const localEntry = this.progressCache.get(mediaId);
    const apiProgress = serverProgress ?? 0;

    if (!localEntry && apiProgress === 0) {
      return null;
    }

    // Use the most advanced progress
    if (localEntry && localEntry.progress >= apiProgress) {
      return {
        mediaId,
        progress: localEntry.progress,
        currentTime: localEntry.currentTime,
        duration: localEntry.duration,
        status: localEntry.status,
        updatedAt: localEntry.updatedAt,
      };
    }

    // Server progress is more advanced
    return {
      mediaId,
      progress: apiProgress,
      currentTime: 0, // Unknown, will be calculated
      duration: 0,
      status: this.determineStatus(apiProgress),
      updatedAt: Date.now(),
    };
  }

  /**
   * Calcule le temps de reprise avec tolérance
   */
  getResumeTime(mediaId: string, duration: number, serverProgress?: number): number {
    const bestProgress = this.getBestProgress(mediaId, serverProgress);

    if (!bestProgress || bestProgress.status === PlaybackStatus.Finished) {
      return 0; // Start from beginning if finished or no progress
    }

    // Use local currentTime if available and valid
    if (bestProgress.currentTime > 0 && bestProgress.duration > 0) {
      // Apply tolerance: go back up to 30 seconds
      const resumeTime = Math.max(0, bestProgress.currentTime - MAX_RESUME_OFFSET_SECONDS);
      return resumeTime;
    }

    // Calculate from progress
    const calculatedTime = bestProgress.progress * duration;
    const resumeTime = Math.max(0, calculatedTime - MAX_RESUME_OFFSET_SECONDS);
    return resumeTime;
  }

  /**
   * Vérifie si le média est terminé
   */
  isFinished(mediaId: string): boolean {
    const entry = this.progressCache.get(mediaId);
    return entry?.status === PlaybackStatus.Finished;
  }

  /**
   * Récupère le statut de lecture
   */
  getStatus(mediaId: string): PlaybackStatus {
    const entry = this.progressCache.get(mediaId);
    return entry?.status ?? PlaybackStatus.NotStarted;
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  private isValidProgress(progress: number): boolean {
    return !isNaN(progress) && isFinite(progress) && progress >= 0 && progress <= 1;
  }

  private determineStatus(progress: number): PlaybackStatus {
    if (progress >= FINISHED_THRESHOLD) {
      return PlaybackStatus.Finished;
    }
    if (progress > 0) {
      return PlaybackStatus.InProgress;
    }
    return PlaybackStatus.NotStarted;
  }

  private debouncedSaveToLocalStorage(mediaId: string): void {
    // Clear existing timer
    const existingTimer = this.saveDebounceTimers.get(mediaId);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = window.setTimeout(() => {
      this.saveToLocalStorage();
      this.saveDebounceTimers.delete(mediaId);
    }, DEBOUNCE_LOCAL_SAVE_MS);

    this.saveDebounceTimers.set(mediaId, timer);
  }

  private async createOrUpdateApiEntry(mediaId: string, progress: number): Promise<void> {
    try {
      await viewingHistoryService.createHistoryEntry({
        mediaId,
        progress,
      });
      this.lastSyncedProgress.set(mediaId, progress);
    } catch {
      // Entry might already exist, try updating instead
      try {
        await viewingHistoryService.updateProgress({
          mediaId,
          progress,
        });
        this.lastSyncedProgress.set(mediaId, progress);
      } catch (updateError) {
        console.warn("Failed to create/update API history entry:", updateError);
      }
    }
  }

  private async syncAllPendingToApi(): Promise<void> {
    const promises: Promise<void>[] = [];

    this.progressCache.forEach((entry, mediaId) => {
      if (entry.pendingSync) {
        promises.push(this.syncToApi(mediaId));
      }
    });

    await Promise.allSettled(promises);
  }

  private syncAllPendingToApiSync(): void {
    // Use sendBeacon for reliable sync on page unload
    if (!navigator.sendBeacon) return;

    this.progressCache.forEach((entry, mediaId) => {
      if (entry.pendingSync) {
        const data = JSON.stringify({
          mediaId: mediaId,
          progress: entry.progress,
        });
        navigator.sendBeacon("/api/v1/history", data);
      }
    });
  }

  // ============================================================================
  // Cleanup
  // ============================================================================

  /**
   * Nettoie les anciennes entrées (plus de 30 jours)
   */
  cleanupOldEntries(): void {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    this.progressCache.forEach((entry, mediaId) => {
      if (entry.updatedAt < thirtyDaysAgo) {
        this.progressCache.delete(mediaId);
      }
    });

    this.saveToLocalStorage();
  }

  /**
   * Supprime une entrée spécifique
   */
  removeEntry(mediaId: string): void {
    this.progressCache.delete(mediaId);
    this.lastSyncedProgress.delete(mediaId);
    this.saveToLocalStorage();
  }

  /**
   * Réinitialise tout le cache local
   */
  clearAll(): void {
    this.progressCache.clear();
    this.lastSyncedProgress.clear();
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Export singleton instance
export const videoProgressService = new VideoProgressService();
