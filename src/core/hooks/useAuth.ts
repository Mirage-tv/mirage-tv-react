// Custom Auth Hook
// Provides authentication operations and state management

import { useCallback } from "react";
import { useAuthStore } from "../../infrastructure/store";
import type { CreateUserReq, LoginReq } from "../domain/types";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, signUp, login, logout, fetchUserProfile, clearError } = useAuthStore();

  // Sign up with error handling
  const handleSignUp = useCallback(
    async (userData: CreateUserReq) => {
      try {
        await signUp(userData);
        return { success: true };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Sign up failed";
        return { success: false, error: message };
      }
    },
    [signUp],
  );

  // Login with error handling
  const handleLogin = useCallback(
    async (credentials: LoginReq) => {
      try {
        await login(credentials);
        return { success: true };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Login failed";
        return { success: false, error: message };
      }
    },
    [login],
  );

  // Logout with error handling
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Logout failed";
      return { success: false, error: message };
    }
  }, [logout]);

  // Fetch user profile with error handling
  const refreshProfile = useCallback(async () => {
    try {
      await fetchUserProfile();
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch profile";
      return { success: false, error: message };
    }
  }, [fetchUserProfile]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    signUp: handleSignUp,
    login: handleLogin,
    logout: handleLogout,
    refreshProfile,
    clearError,

    // Computed
    isSubscriber: user?.planName !== null && user?.planName !== undefined,
    userName: user?.name || "",
    userEmail: user?.mail || "",
  };
};
