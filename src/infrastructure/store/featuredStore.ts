// Featured Content Store
// Manages featured media state (hero banner, trending) using Zustand

import { create } from 'zustand';
import { FeaturedMediaDTO, MediaThumbnail } from '../../core/domain/types';
import { featuredMediaService } from '../adapters/api';

interface FeaturedState {
  // Hero banner state
  heroBanner: FeaturedMediaDTO | null;
  isLoadingHero: boolean;

  // Trending now state
  trendingMedia: MediaThumbnail[];
  isLoadingTrending: boolean;

  // Errors
  error: string | null;

  // Actions
  fetchHeroBanner: () => Promise<void>;
  fetchTrendingNow: () => Promise<void>;
  clearError: () => void;
}

export const useFeaturedStore = create<FeaturedState>((set) => ({
  // Initial state
  heroBanner: null,
  isLoadingHero: false,

  trendingMedia: [],
  isLoadingTrending: false,

  error: null,

  // Fetch hero banner
  fetchHeroBanner: async () => {
    set({ isLoadingHero: true, error: null });
    try {
      const heroBanner = await featuredMediaService.getHeroBanner();
      set({
        heroBanner,
        isLoadingHero: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch hero banner',
        isLoadingHero: false,
      });
      throw error;
    }
  },

  // Fetch trending now
  fetchTrendingNow: async () => {
    set({ isLoadingTrending: true, error: null });
    try {
      const trendingMedia = await featuredMediaService.getTrendingNow();
      set({
        trendingMedia,
        isLoadingTrending: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch trending media',
        isLoadingTrending: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
