// Viewing History Store
// Manages viewing history and continue-watching functionality using Zustand

import { create } from 'zustand';
import { MediaThumbnail } from '../../core/domain/types';
import { viewingHistoryService } from '../adapters/api';

interface ViewingHistoryState {
  // Continue watching state
  continueWatching: MediaThumbnail[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchContinueWatching: () => Promise<void>;
  createHistoryEntry: (mediaId: string, progress: number) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  clearError: () => void;
}

export const useViewingHistoryStore = create<ViewingHistoryState>((set, get) => ({
  // Initial state
  continueWatching: [],
  isLoading: false,
  error: null,

  // Fetch continue-watching list
  fetchContinueWatching: async () => {
    set({ isLoading: true, error: null });
    try {
      const continueWatching = await viewingHistoryService.getContinueWatching();
      set({
        continueWatching,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch continue-watching',
        isLoading: false,
      });
      throw error;
    }
  },

  // Create a new viewing history entry
  createHistoryEntry: async (mediaId: string, progress: number) => {
    try {
      await viewingHistoryService.createHistoryEntry({
        mediaId,
        progress,
      });

      // Refresh the continue-watching list
      await get().fetchContinueWatching();
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create history entry',
      });
      throw error;
    }
  },

  // Update viewing progress
  updateProgress: async (id: string, progress: number) => {
    try {
      await viewingHistoryService.updateProgress({
        id,
        progress,
      });

      // Update local state optimistically
      const currentList = get().continueWatching;
      set({
        continueWatching: currentList.map(item =>
          item.id === id ? { ...item, progress } : item
        ),
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update progress',
      });
      // Refresh to get correct state from server
      await get().fetchContinueWatching();
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
