import { useCallback } from "react";
import type { PaginationParams } from "../../infrastructure/adapters/api";
import { useMediaStore } from "../../infrastructure/store";

// Helper pour extraire le message d'erreur
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

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

  const loadMovies = useCallback(
    async (params?: PaginationParams) => {
      try {
        await fetchMovies(params);
        return { success: true as const };
      } catch (error) {
        return {
          success: false as const,
          error: getErrorMessage(error),
        };
      }
    },
    [fetchMovies],
  );

  const loadShows = useCallback(
    async (params?: PaginationParams) => {
      try {
        await fetchShows(params);
        return { success: true as const };
      } catch (error) {
        return {
          success: false as const,
          error: getErrorMessage(error),
        };
      }
    },
    [fetchShows],
  );

  const loadMediaById = useCallback(
    async (id: string) => {
      try {
        await fetchMediaById(id);
        return { success: true as const };
      } catch (error) {
        return {
          success: false as const,
          error: getErrorMessage(error),
        };
      }
    },
    [fetchMediaById],
  );

  const loadShowById = useCallback(
    async (id: string) => {
      try {
        await fetchShowById(id);
        return { success: true as const };
      } catch (error) {
        return {
          success: false as const,
          error: getErrorMessage(error),
        };
      }
    },
    [fetchShowById],
  );

  const loadMediaByCategory = useCallback(
    async (category: string, params?: PaginationParams) => {
      try {
        await fetchMediaByCategory(category, params);
        return { success: true as const };
      } catch (error) {
        return {
          success: false as const,
          error: getErrorMessage(error),
        };
      }
    },
    [fetchMediaByCategory],
  );

  const voteMedia = useCallback(
    async (id: string) => {
      try {
        await upVoteMedia(id);
        return { success: true as const };
      } catch (error) {
        return {
          success: false as const,
          error: getErrorMessage(error),
        };
      }
    },
    [upVoteMedia],
  );

  return {
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
    loadMovies,
    loadShows,
    loadMediaById,
    loadShowById,
    loadMediaByCategory,
    voteMedia,
    clearCurrentMedia,
    clearCurrentShow,
    clearError,
    hasMovies: movies.length > 0,
    hasShows: shows.length > 0,
    hasCategoryMedia: categoryMedia.length > 0,
    totalMovies: moviesMetadata?.total ?? 0,
    totalShows: showsMetadata?.total ?? 0,
    totalCategoryMedia: categoryMetadata?.total ?? 0,
  };
};
