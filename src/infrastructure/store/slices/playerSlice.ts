/**
 * Player Slice - Zustand
 */

import { StateCreator } from 'zustand';

export interface PlayerSliceState {
  currentMovieId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  quality: '720p' | '1080p' | '4k';
  isFullscreen: boolean;
}

export interface PlayerSliceActions {
  setCurrentMovie: (movieId: string, duration: number) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  setQuality: (quality: '720p' | '1080p' | '4k') => void;
  toggleFullscreen: () => void;
  resetPlayer: () => void;
}

export type PlayerSlice = PlayerSliceState & PlayerSliceActions;

const initialState: PlayerSliceState = {
  currentMovieId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  quality: '1080p',
  isFullscreen: false,
};

export const createPlayerSlice: StateCreator<PlayerSlice> = (set) => ({
  ...initialState,
  
  setCurrentMovie: (movieId, duration) =>
    set({
      currentMovieId: movieId,
      currentTime: 0,
      isPlaying: false,
      duration,
    }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setVolume: (volume) => set({ volume }),
  setQuality: (quality) => set({ quality }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  resetPlayer: () => set(initialState),
});
