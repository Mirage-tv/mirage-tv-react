// Custom Auth Hook
// Provides authentication operations and state management

import { useCallback } from 'react';
import { useAuthStore } from '../../infrastructure/store';
import { CreateUserReq, LoginReq } from '../domain/types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    login,
    logout,
    fetchUserProfile,
    clearError,
  } = useAuthStore();

  // Sign up with error handling
  const handleSignUp = useCallback(
    async (userData: CreateUserReq) => {
      try {
        await signUp(userData);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [signUp]
  );

  // Login with error handling
  const handleLogin = useCallback(
    async (credentials: LoginReq) => {
      try {
        await login(credentials);
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [login]
  );

  // Logout with error handling
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [logout]);

  // Fetch user profile with error handling
  const refreshProfile = useCallback(async () => {
    try {
      await fetchUserProfile();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
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
    userName: user?.name || '',
    userEmail: user?.mail || '',
  };
};
