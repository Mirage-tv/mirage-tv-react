// Favorites Store
// Manages user's favorite media list using Zustand

import { create } from 'zustand';
import { MediaThumbnail } from '../../core/domain/types';
import { favoritesService } from '../adapters/api';

interface FavoritesState {
  // Favorites state
  favorites: MediaThumbnail[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (mediaId: string) => Promise<boolean>;
  isFavorite: (mediaId: string) => boolean;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  // Initial state
  favorites: [],
  isLoading: false,
  error: null,

  // Fetch favorites list
  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const favorites = await favoritesService.getFavorites();
      set({
        favorites,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch favorites',
        isLoading: false,
      });
      throw error;
    }
  },

  // Toggle favorite state
  toggleFavorite: async (mediaId: string) => {
    try {
      const isFavorite = await favoritesService.toggleFavorite({ mediaId });

      // Update local state based on result
      const currentFavorites = get().favorites;

      if (isFavorite) {
        // Media was added to favorites - we'll need to fetch the updated list
        // to get the full MediaThumbnail data
        await get().fetchFavorites();
      } else {
        // Media was removed from favorites - remove from local state
        set({
          favorites: currentFavorites.filter(fav => fav.id !== mediaId),
        });
      }

      return isFavorite;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to toggle favorite',
      });
      throw error;
    }
  },

  // Check if media is in favorites
  isFavorite: (mediaId: string) => {
    return get().favorites.some(fav => fav.id === mediaId);
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
