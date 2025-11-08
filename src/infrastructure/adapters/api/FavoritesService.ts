// Favorites Service
// Handles favorite media management API operations

import {
    MediaThumbnail,
    ToggleFavoriteReq
} from '../../../core/domain/types';
import { API_ENDPOINTS } from '../../config/api.config';
import { httpClient } from '../http/HttpClient';

export class FavoritesService {
  /**
   * List favorite medias
   * GET /api/v1/favorites
   * Returns the authenticated viewer's saved titles for "My list" screen
   */
  async getFavorites(): Promise<MediaThumbnail[]> {
    return httpClient.get<MediaThumbnail[]>(API_ENDPOINTS.FAVORITES.LIST);
  }

  /**
   * Toggle favorite state
   * POST /api/v1/favorites/toggle
   * Adds or removes media from viewer's favorites based on current state
   *
   * @param data - mediaId to toggle
   * @returns true when media becomes favorite, false when removed
   */
  async toggleFavorite(data: ToggleFavoriteReq): Promise<boolean> {
    return httpClient.post<boolean>(API_ENDPOINTS.FAVORITES.TOGGLE, data);
  }
}

// Export singleton instance
export const favoritesService = new FavoritesService();
