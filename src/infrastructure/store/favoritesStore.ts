import { create } from "zustand";
import type { MediaThumbnail } from "../../core/domain/types";
import { favoritesService } from "../adapters/api";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

interface FavoritesState {
  readonly favorites: readonly MediaThumbnail[];
  readonly isLoading: boolean;
  readonly error: string | null;

  fetchFavorites: () => Promise<void>;
  toggleFavorite: (mediaId: string) => Promise<boolean>;
  isFavorite: (mediaId: string) => boolean;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const favorites = await favoritesService.getFavorites();
      set({
        favorites,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch favorites",
        isLoading: false,
      });
      throw error;
    }
  },

  toggleFavorite: async (mediaId: string) => {
    try {
      const isFavorite = await favoritesService.toggleFavorite({ mediaId });

      const currentFavorites = get().favorites;

      if (isFavorite) {
        await get().fetchFavorites();
      } else {
        set({
          favorites: currentFavorites.filter((fav) => fav.id !== mediaId),
        });
      }

      return isFavorite;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to toggle favorite",
      });
      throw error;
    }
  },

  isFavorite: (mediaId: string) => {
    return get().favorites.some((fav) => fav.id === mediaId);
  },

  clearError: () => {
    set({ error: null });
  },
}));
