// Custom Media Hook
// Provides media browsing operations and state management

import { useCallback } from 'react';
import { PaginationParams } from '../../infrastructure/adapters/api';
import { useMediaStore } from '../../infrastructure/store';

export const useMedia = () => {
  const {
    movies,
    moviesMetadata,
    isLoadingMovies,
    shows,
    showsMetadata,
    isLoadingShows,
    currentMedia,
    isLoadingCurrentMedia,
    currentShow,
    isLoadingCurrentShow,
    categoryMedia,
    categoryMetadata,
    currentCategory,
    isLoadingCategory,
    error,
    fetchMovies,
    fetchShows,
    fetchMediaById,
    fetchShowById,
    fetchMediaByCategory,
    upVoteMedia,
    clearCurrentMedia,
    clearCurrentShow,
    clearError,
  } = useMediaStore();

  // Fetch movies with error handling
  const loadMovies = useCallback(
    async (params?: PaginationParams) => {
      try {
        await fetchMovies(params);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [fetchMovies]
  );

  // Fetch shows with error handling
  const loadShows = useCallback(
    async (params?: PaginationParams) => {
      try {
        await fetchShows(params);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [fetchShows]
  );

  // Fetch media details with error handling
  const loadMediaById = useCallback(
    async (id: string) => {
      try {
        await fetchMediaById(id);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [fetchMediaById]
  );

  // Fetch show details with error handling
  const loadShowById = useCallback(
    async (id: string) => {
      try {
        await fetchShowById(id);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [fetchShowById]
  );

  // Fetch media by category with error handling
  const loadMediaByCategory = useCallback(
    async (category: string, params?: PaginationParams) => {
      try {
        await fetchMediaByCategory(category, params);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [fetchMediaByCategory]
  );

  // Up-vote media with error handling
  const voteMedia = useCallback(
    async (id: string) => {
      try {
        await upVoteMedia(id);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [upVoteMedia]
  );

  return {
    // Movies state
    movies,
    moviesMetadata,
    isLoadingMovies,

    // Shows state
    shows,
    showsMetadata,
    isLoadingShows,

    // Current media state
    currentMedia,
    isLoadingCurrentMedia,

    // Current show state
    currentShow,
    isLoadingCurrentShow,

    // Category state
    categoryMedia,
    categoryMetadata,
    currentCategory,
    isLoadingCategory,

    // Error state
    error,

    // Actions
    loadMovies,
    loadShows,
    loadMediaById,
    loadShowById,
    loadMediaByCategory,
    voteMedia,
    clearCurrentMedia,
    clearCurrentShow,
    clearError,

    // Computed
    hasMovies: movies.length > 0,
    hasShows: shows.length > 0,
    hasCategoryMedia: categoryMedia.length > 0,
    totalMovies: moviesMetadata?.total || 0,
    totalShows: showsMetadata?.total || 0,
    totalCategoryMedia: categoryMetadata?.total || 0,
  };
};
