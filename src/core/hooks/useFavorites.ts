// Custom Favorites Hook
// Provides favorites management operations and state

import { useCallback } from 'react';
import { useFavoritesStore } from '../../infrastructure/store';

export const useFavorites = () => {
  const {
    favorites,
    isLoading,
    error,
    fetchFavorites,
    toggleFavorite,
    isFavorite,
    clearError,
  } = useFavoritesStore();

  // Load favorites list with error handling
  const loadFavorites = useCallback(async () => {
    try {
      await fetchFavorites();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [fetchFavorites]);

  // Toggle favorite state with error handling
  const handleToggleFavorite = useCallback(
    async (mediaId: string) => {
      try {
        const result = await toggleFavorite(mediaId);
        return { success: true, isFavorite: result };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [toggleFavorite]
  );

  // Check if media is favorited
  const checkIsFavorite = useCallback(
    (mediaId: string) => {
      return isFavorite(mediaId);
    },
    [isFavorite]
  );

  return {
    // State
    favorites,
    isLoading,
    error,

    // Actions
    loadFavorites,
    toggleFavorite: handleToggleFavorite,
    isFavorite: checkIsFavorite,
    clearError,

    // Computed
    hasFavorites: favorites.length > 0,
    favoritesCount: favorites.length,
  };
};
