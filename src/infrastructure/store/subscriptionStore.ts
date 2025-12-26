import { create } from "zustand";
import type { SubscriptionDTO } from "../../core/domain/types";
import { subscriptionService } from "../adapters/api";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

interface SubscriptionState {
  readonly subscription: SubscriptionDTO | null;
  readonly isLoading: boolean;
  readonly error: string | null;

  fetchSubscription: () => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  isLoading: false,
  error: null,

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const subscription = await subscriptionService.getSubscription();
      set({
        subscription,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to fetch subscription",
        isLoading: false,
      });
      throw error;
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      await subscriptionService.cancelSubscription();
      await get().fetchSubscription();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        error: errorMessage || "Failed to cancel subscription",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
