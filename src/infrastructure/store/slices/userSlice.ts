/**
 * User Slice - Zustand
 */

import { StateCreator } from 'zustand';
import { User } from '../../../core/domain/User';

export interface UserSliceState {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  watchlist: string[];
  error: string | null;
}

export interface UserSliceActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setWatchlist: (watchlist: string[]) => void;
  addToWatchlist: (movieId: string) => void;
  removeFromWatchlist: (movieId: string) => void;
  setError: (error: string | null) => void;
}

export type UserSlice = UserSliceState & UserSliceActions;

const initialState: UserSliceState = {
  user: null,
  authenticated: false,
  loading: false,
  watchlist: [],
  error: null,
};

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  ...initialState,
  
  setUser: (user) => set({ user, authenticated: true, error: null }),
  clearUser: () => set(initialState),
  setLoading: (loading) => set({ loading }),
  setWatchlist: (watchlist) => set({ watchlist }),
  
  addToWatchlist: (movieId) =>
    set((state) => ({
      watchlist: [...state.watchlist, movieId],
    })),
  
  removeFromWatchlist: (movieId) =>
    set((state) => ({
      watchlist: state.watchlist.filter((id) => id !== movieId),
    })),
  
  setError: (error) => set({ error, loading: false }),
});
