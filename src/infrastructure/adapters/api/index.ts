// API Services Index
// Central export point for all API service adapters

export { authService, AuthService } from './AuthService';
export { categoryService, CategoryService } from './CategoryService';
export { favoritesService, FavoritesService } from './FavoritesService';
export { featuredMediaService, FeaturedMediaService } from './FeaturedMediaService';
export { mediaService, MediaService } from './MediaService';
export { subscriptionService, SubscriptionService } from './SubscriptionService';
export { userService, UserService } from './UserService';
export { videoService, VideoService } from './VideoService';
export { viewingHistoryService, ViewingHistoryService } from './ViewingHistoryService';

// Re-export types for convenience
export type { PaginationParams } from './MediaService';
