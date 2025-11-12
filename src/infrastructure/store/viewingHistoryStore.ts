import { create } from "zustand";
import type { MediaThumbnail } from "../../core/domain/types";
import { viewingHistoryService } from "../adapters/api";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

interface ViewingHistoryState {
  readonly continueWatching: readonly MediaThumbnail[];
  readonly isLoading: boolean;
  readonly error: string | null;

  fetchContinueWatching: () => Promise<void>;
  createHistoryEntry: (mediaId: string, progress: number) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  clearError: () => void;
}

export const useViewingHistoryStore = create<ViewingHistoryState>((set, get) => ({
  continueWatching: [],
  isLoading: false,
  error: null,

  fetchContinueWatching: async () => {
    set({ isLoading: true, error: null });
    try {
      const continueWatching = await viewingHistoryService.getContinueWatching();
      set({
        continueWatching,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch continue-watching",
        isLoading: false,
      });
      throw error;
    }
  },

  createHistoryEntry: async (mediaId: string, progress: number) => {
    try {
      await viewingHistoryService.createHistoryEntry({
        mediaId,
        progress,
      });
      await get().fetchContinueWatching();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to create history entry",
      });
      throw error;
    }
  },

  updateProgress: async (id: string, progress: number) => {
    try {
      await viewingHistoryService.updateProgress({
        id,
        progress,
      });

      const currentList = get().continueWatching;
      set({
        continueWatching: currentList.map((item) => (item.id === id ? { ...item, progress } : item)),
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to update progress",
      });
      await get().fetchContinueWatching();
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
