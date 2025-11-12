import { create } from "zustand";
import type { MediaDTO, MediaThumbnail, PageMediaThumbnail, PageSeriePreview, SerieDTO, SeriePreview } from "../../core/domain/types";
import { mediaService, type PaginationParams } from "../adapters/api";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

type Metadata = {
  readonly page: number;
  readonly per: number;
  readonly total: number;
};

interface MediaState {
  readonly movies: readonly MediaThumbnail[];
  readonly moviesMetadata: Metadata | null;
  readonly isLoadingMovies: boolean;
  readonly shows: readonly SeriePreview[];
  readonly showsMetadata: Metadata | null;
  readonly isLoadingShows: boolean;
  readonly currentMedia: MediaDTO | null;
  readonly isLoadingCurrentMedia: boolean;
  readonly currentShow: SerieDTO | null;
  readonly isLoadingCurrentShow: boolean;
  readonly categoryMedia: readonly MediaThumbnail[];
  readonly categoryMetadata: Metadata | null;
  readonly currentCategory: string | null;
  readonly isLoadingCategory: boolean;
  readonly error: string | null;

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

  fetchMovies: async (params?: PaginationParams) => {
    set({ isLoadingMovies: true, error: null });
    try {
      const response: PageMediaThumbnail = await mediaService.getMovies(params);
      set({
        movies: response.items,
        moviesMetadata: response.metadata,
        isLoadingMovies: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch movies",
        isLoadingMovies: false,
      });
      throw error;
    }
  },

  fetchShows: async (params?: PaginationParams) => {
    set({ isLoadingShows: true, error: null });
    try {
      const response: PageSeriePreview = await mediaService.getShows(params);
      set({
        shows: response.items,
        showsMetadata: response.metadata,
        isLoadingShows: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch shows",
        isLoadingShows: false,
      });
      throw error;
    }
  },

  fetchMediaById: async (id: string) => {
    set({ isLoadingCurrentMedia: true, error: null });
    try {
      const media = await mediaService.getMediaById(id);
      set({
        currentMedia: media,
        isLoadingCurrentMedia: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch media details",
        isLoadingCurrentMedia: false,
      });
      throw error;
    }
  },

  fetchShowById: async (id: string) => {
    set({ isLoadingCurrentShow: true, error: null });
    try {
      const show = await mediaService.getShowById(id);
      set({
        currentShow: show,
        isLoadingCurrentShow: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch show details",
        isLoadingCurrentShow: false,
      });
      throw error;
    }
  },

  fetchMediaByCategory: async (category: string, params?: PaginationParams) => {
    set({ isLoadingCategory: true, error: null, currentCategory: category });
    try {
      const response: PageMediaThumbnail = await mediaService.getMediaByCategory(category, params);
      set({
        categoryMedia: response.items,
        categoryMetadata: response.metadata,
        isLoadingCategory: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch category media",
        isLoadingCategory: false,
      });
      throw error;
    }
  },

  upVoteMedia: async (id: string) => {
    try {
      await mediaService.upVoteMedia(id);
      if (get().currentMedia?.id === id) {
        await get().fetchMediaById(id);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to up-vote media",
      });
      throw error;
    }
  },

  clearCurrentMedia: () => {
    set({ currentMedia: null, isLoadingCurrentMedia: false });
  },

  clearCurrentShow: () => {
    set({ currentShow: null, isLoadingCurrentShow: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));
