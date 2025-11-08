// Subscription Store
// Manages subscription and billing state using Zustand

import { create } from 'zustand';
import { SubscriptionDTO } from '../../core/domain/types';
import { subscriptionService } from '../adapters/api';

interface SubscriptionState {
  // Subscription state
  subscription: SubscriptionDTO | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubscription: () => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  subscription: null,
  isLoading: false,
  error: null,

  // Fetch current subscription
  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const subscription = await subscriptionService.getSubscription();
      set({
        subscription,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      await subscriptionService.cancelSubscription({ id: subscriptionId });

      // Refresh subscription to reflect cancellation status
      await get().fetchSubscription();

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to cancel subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
