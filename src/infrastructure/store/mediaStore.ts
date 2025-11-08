// Media Store
// Manages media content browsing state (movies, shows, categories) using Zustand

import { create } from 'zustand';
import {
    MediaDTO,
    MediaThumbnail,
    PageMediaThumbnail,
    PageSeriePreview,
    SerieDTO,
    SeriePreview,
} from '../../core/domain/types';
import { mediaService, PaginationParams } from '../adapters/api';

interface MediaState {
  // Movies state
  movies: MediaThumbnail[];
  moviesMetadata: { page: number; per: number; total: number } | null;
  isLoadingMovies: boolean;

  // Shows state
  shows: SeriePreview[];
  showsMetadata: { page: number; per: number; total: number } | null;
  isLoadingShows: boolean;

  // Current media detail
  currentMedia: MediaDTO | null;
  isLoadingCurrentMedia: boolean;

  // Current show detail
  currentShow: SerieDTO | null;
  isLoadingCurrentShow: boolean;

  // Category browsing
  categoryMedia: MediaThumbnail[];
  categoryMetadata: { page: number; per: number; total: number } | null;
  currentCategory: string | null;
  isLoadingCategory: boolean;

  // Errors
  error: string | null;

  // Actions
  fetchMovies: (params?: PaginationParams) => Promise<void>;
  fetchShows: (params?: PaginationParams) => Promise<void>;
  fetchMediaById: (id: string) => Promise<void>;
  fetchShowById: (id: string) => Promise<void>;
  fetchMediaByCategory: (category: string, params?: PaginationParams) => Promise<void>;
  upVoteMedia: (id: string) => Promise<void>;
  clearCurrentMedia: () => void;
  clearCurrentShow: () => void;
  clearError: () => void;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  // Initial state
  movies: [],
  moviesMetadata: null,
  isLoadingMovies: false,

  shows: [],
  showsMetadata: null,
  isLoadingShows: false,

  currentMedia: null,
  isLoadingCurrentMedia: false,

  currentShow: null,
  isLoadingCurrentShow: false,

  categoryMedia: [],
  categoryMetadata: null,
  currentCategory: null,
  isLoadingCategory: false,

  error: null,

  // Fetch movies with pagination
  fetchMovies: async (params?: PaginationParams) => {
    set({ isLoadingMovies: true, error: null });
    try {
      const response: PageMediaThumbnail = await mediaService.getMovies(params);
      set({
        movies: response.items,
        moviesMetadata: response.metadata,
        isLoadingMovies: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch movies',
        isLoadingMovies: false,
      });
      throw error;
    }
  },

  // Fetch shows with pagination
  fetchShows: async (params?: PaginationParams) => {
    set({ isLoadingShows: true, error: null });
    try {
      const response: PageSeriePreview = await mediaService.getShows(params);
      set({
        shows: response.items,
        showsMetadata: response.metadata,
        isLoadingShows: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch shows',
        isLoadingShows: false,
      });
      throw error;
    }
  },

  // Fetch media by ID
  fetchMediaById: async (id: string) => {
    set({ isLoadingCurrentMedia: true, error: null });
    try {
      const media = await mediaService.getMediaById(id);
      set({
        currentMedia: media,
        isLoadingCurrentMedia: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch media details',
        isLoadingCurrentMedia: false,
      });
      throw error;
    }
  },

  // Fetch show by ID
  fetchShowById: async (id: string) => {
    set({ isLoadingCurrentShow: true, error: null });
    try {
      const show = await mediaService.getShowById(id);
      set({
        currentShow: show,
        isLoadingCurrentShow: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch show details',
        isLoadingCurrentShow: false,
      });
      throw error;
    }
  },

  // Fetch media by category
  fetchMediaByCategory: async (category: string, params?: PaginationParams) => {
    set({ isLoadingCategory: true, error: null, currentCategory: category });
    try {
      const response: PageMediaThumbnail = await mediaService.getMediaByCategory(
        category,
        params
      );
      set({
        categoryMedia: response.items,
        categoryMetadata: response.metadata,
        isLoadingCategory: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch category media',
        isLoadingCategory: false,
      });
      throw error;
    }
  },

  // Up-vote media
  upVoteMedia: async (id: string) => {
    try {
      await mediaService.upVoteMedia(id);
      // Optionally refresh current media if it's the one being voted
      if (get().currentMedia?.id === id) {
        await get().fetchMediaById(id);
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to up-vote media',
      });
      throw error;
    }
  },

  // Clear current media
  clearCurrentMedia: () => {
    set({ currentMedia: null, isLoadingCurrentMedia: false });
  },

  // Clear current show
  clearCurrentShow: () => {
    set({ currentShow: null, isLoadingCurrentShow: false });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
