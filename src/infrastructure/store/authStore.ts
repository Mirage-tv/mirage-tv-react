// Authentication Store
// Manages authentication state and user session using Zustand

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateUserReq, LoginReq, UserDTO } from "../../core/domain/types";
import { authService, userService } from "../adapters/api";

interface AuthState {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signUp: (userData: CreateUserReq) => Promise<void>;
  login: (credentials: LoginReq) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserDTO | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Sign up action
      signUp: async (userData: CreateUserReq) => {
        set({ isLoading: true, error: null });
        try {
          await authService.signUp(userData);
          // After successful signup, fetch the user profile
          await get().fetchUserProfile();
          set({ isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Sign up failed",
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Login action
      login: async (credentials: LoginReq) => {
        set({ isLoading: true, error: null });
        try {
          await authService.login(credentials);
          // After successful login, fetch the user profile
          await get().fetchUserProfile();
          set({ isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || "Logout failed",
            isLoading: false,
          });
          // Clear state anyway even if API call fails
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      // Fetch user profile
      fetchUserProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await userService.getProfile();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch user profile",
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set user directly (useful for updates)
      setUser: (user: UserDTO | null) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
