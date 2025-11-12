import { create } from "zustand";
import type { FeaturedMediaDTO, MediaThumbnail } from "../../core/domain/types";
import { featuredMediaService } from "../adapters/api";

// Helper pour extraire le message d'erreur
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

interface FeaturedState {
  readonly heroBanner: FeaturedMediaDTO | null;
  readonly isLoadingHero: boolean;
  readonly trendingMedia: readonly MediaThumbnail[];
  readonly isLoadingTrending: boolean;
  readonly error: string | null;

  fetchHeroBanner: () => Promise<void>;
  fetchTrendingNow: () => Promise<void>;
  clearError: () => void;
}

export const useFeaturedStore = create<FeaturedState>((set) => ({
  heroBanner: null,
  isLoadingHero: false,
  trendingMedia: [],
  isLoadingTrending: false,
  error: null,

  fetchHeroBanner: async () => {
    set({ isLoadingHero: true, error: null });
    try {
      const heroBanner = await featuredMediaService.getHeroBanner();
      set({
        heroBanner,
        isLoadingHero: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch hero banner",
        isLoadingHero: false,
      });
      throw error;
    }
  },

  fetchTrendingNow: async () => {
    set({ isLoadingTrending: true, error: null });
    try {
      const trendingMedia = await featuredMediaService.getTrendingNow();
      set({
        trendingMedia,
        isLoadingTrending: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch trending media",
        isLoadingTrending: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
