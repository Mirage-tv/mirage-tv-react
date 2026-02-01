import { create } from 'zustand';
import type { MediaSearchResponse, MediaThumbnail, SeriePreview } from '../../core/domain/types';
import { mediaService, type PaginationParams } from '../adapters/api';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return "Une erreur s'est produite";
};

interface SearchState {
  readonly query: string;
  readonly movies: readonly MediaThumbnail[];
  readonly series: readonly SeriePreview[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly hasSearched: boolean;

  setQuery: (query: string) => void;
  search: (query: string, params?: PaginationParams) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  movies: [],
  series: [],
  isLoading: false,
  error: null,
  hasSearched: false,

  setQuery: (query: string) => {
    set({ query });
  },

  search: async (query: string, params?: PaginationParams) => {
    if (!query.trim()) {
      set({ movies: [], series: [], hasSearched: false, error: null });
      return;
    }

    set({ isLoading: true, error: null, query });
    try {
      const response: MediaSearchResponse = await mediaService.search(query, params);
      set({
        movies: response.movies.items,
        series: response.series.items,
        isLoading: false,
        hasSearched: true
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage,
        isLoading: false,
        hasSearched: true
      });
    }
  },

  clearSearch: () => {
    set({
      query: '',
      movies: [],
      series: [],
      isLoading: false,
      error: null,
      hasSearched: false
    });
  }
}));
