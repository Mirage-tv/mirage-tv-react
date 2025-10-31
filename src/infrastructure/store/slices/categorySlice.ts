/**
 * Category Slice - Zustand
 */

import { StateCreator } from 'zustand';
import { Category } from '../../../core/domain/Category';

export interface CategorySliceState {
  categories: Category[];
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
}

export interface CategorySliceActions {
  setCategories: (categories: Category[]) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type CategorySlice = CategorySliceState & CategorySliceActions;

const initialState: CategorySliceState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

export const createCategorySlice: StateCreator<CategorySlice> = (set) => ({
  ...initialState,
  
  setCategories: (categories) => set({ categories, error: null }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
});
