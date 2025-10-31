/**
 * Zustand Store - Main
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createMovieSlice, MovieSlice } from './slices/movieSlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createCategorySlice, CategorySlice } from './slices/categorySlice';
import { createPlayerSlice, PlayerSlice } from './slices/playerSlice';

type StoreState = MovieSlice & UserSlice & CategorySlice & PlayerSlice;

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...args) => ({
        ...createMovieSlice(...args),
        ...createUserSlice(...args),
        ...createCategorySlice(...args),
        ...createPlayerSlice(...args),
      }),
      {
        name: 'mirage-store',
        partialize: (state) => ({
          user: state.user,
          authenticated: state.authenticated,
          volume: state.volume,
          quality: state.quality,
          watchlist: state.watchlist,
        }),
      }
    ),
    { name: 'Mirage Store' }
  )
);

export const useMovies = () =>
  useStore((state) => ({
    movies: state.movies,
    loading: state.loading,
    error: state.error,
  }));

export const useSelectedMovie = () =>
  useStore((state) => state.selectedMovie);

export const useMirageOriginals = () =>
  useStore((state) => state.mirageOriginals);

export const useUser = () =>
  useStore((state) => ({
    user: state.user,
    authenticated: state.authenticated,
    loading: state.loading,
  }));

export const useWatchlist = () =>
  useStore((state) => ({
    watchlist: state.watchlist,
    addToWatchlist: state.addToWatchlist,
    removeFromWatchlist: state.removeFromWatchlist,
  }));

export const useCategories = () =>
  useStore((state) => ({
    categories: state.categories,
    selectedCategory: state.selectedCategory,
  }));

export const usePlayer = () =>
  useStore((state) => ({
    currentMovieId: state.currentMovieId,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    volume: state.volume,
    quality: state.quality,
    duration: state.duration,
  }));
