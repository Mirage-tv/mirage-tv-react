// Category Store
// Manages content categories state using Zustand

import { create } from "zustand";
import type { AvailableCategories } from "../../core/domain/types";
import { categoryService } from "../adapters/api";

interface CategoryState {
  // Categories state
  categories: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,

  // Fetch available categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: AvailableCategories = await categoryService.getCategories();
      set({
        categories: response.list,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch categories",
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
