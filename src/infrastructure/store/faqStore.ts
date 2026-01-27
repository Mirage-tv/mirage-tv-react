// FAQ Store
// Manages FAQ state using Zustand

import { create } from 'zustand';
import { faqService, type FaqQuestion } from '../adapters/api/FaqService';

interface FaqState {
  questions: FaqQuestion[];
  isLoading: boolean;
  error: string | null;
  fetchFaq: () => Promise<void>;
  clearError: () => void;
}

export const useFaqStore = create<FaqState>((set) => ({
  questions: [],
  isLoading: false,
  error: null,

  fetchFaq: async () => {
    set({ isLoading: true, error: null });
    try {
      const questions = await faqService.getFaq();
      set({
        questions,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Impossible de charger la FAQ';
      set({
        error: errorMessage,
        isLoading: false
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));
