/**
 * Movie Slice - Zustand
 */

import { StateCreator } from 'zustand';
import { Movie } from '../../../core/domain/Movie';

export interface MovieSliceState {
  movies: Movie[];
  selectedMovie: Movie | null;
  mirageOriginals: Movie[];
  recommendations: Movie[];
  loading: boolean;
  error: string | null;
}

export interface MovieSliceActions {
  setMovies: (movies: Movie[]) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  setMirageOriginals: (movies: Movie[]) => void;
  setRecommendations: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMovies: () => void;
}

export type MovieSlice = MovieSliceState & MovieSliceActions;

const initialState: MovieSliceState = {
  movies: [],
  selectedMovie: null,
  mirageOriginals: [],
  recommendations: [],
  loading: false,
  error: null,
};

export const createMovieSlice: StateCreator<MovieSlice> = (set) => ({
  ...initialState,
  
  setMovies: (movies) => set({ movies, error: null }),
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setMirageOriginals: (movies) => set({ mirageOriginals: movies }),
  setRecommendations: (movies) => set({ recommendations: movies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clearMovies: () => set(initialState),
});
