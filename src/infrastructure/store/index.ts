// Store Index
// Central export point for all Zustand stores

export { useAuthStore } from "./authStore";
export { useCategoryStore } from "./categoryStore";
export { useFavoritesStore } from "./favoritesStore";
export { useFeaturedStore } from "./featuredStore";
export { useMediaStore } from "./mediaStore";
export { useSubscriptionStore } from "./subscriptionStore";
export { useViewingHistoryStore } from "./viewingHistoryStore";

// Re-export types for convenience
export type { default as AuthState } from "./authStore";
export type { default as CategoryState } from "./categoryStore";
export type { default as FavoritesState } from "./favoritesStore";
export type { default as FeaturedState } from "./featuredStore";
export type { default as MediaState } from "./mediaStore";
export type { default as SubscriptionState } from "./subscriptionStore";
export type { default as ViewingHistoryState } from "./viewingHistoryStore";
