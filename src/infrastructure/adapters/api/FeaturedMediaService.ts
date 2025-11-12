// Featured Media Service
// Handles featured content API operations (hero banner, trending)

import type { FeaturedMediaDTO, MediaThumbnail } from "../../../core/domain/types";
import { API_ENDPOINTS } from "../../config/api.config";
import { httpClient } from "../http/HttpClient";

export class FeaturedMediaService {
  /**
   * Get hero banner featured media
   * GET /api/v1/featured-media/hero-banner
   * Returns the highlighted media for the home hero section
   */
  async getHeroBanner(): Promise<FeaturedMediaDTO> {
    return httpClient.get<FeaturedMediaDTO>(API_ENDPOINTS.FEATURED.HERO_BANNER);
  }

  /**
   * Get trending carousel content
   * GET /api/v1/featured-media/trending-now
   * Returns trending titles with favorites and videoURLs for subscribers
   */
  async getTrendingNow(): Promise<MediaThumbnail[]> {
    return httpClient.get<MediaThumbnail[]>(API_ENDPOINTS.FEATURED.TRENDING_NOW);
  }
}

// Export singleton instance
export const featuredMediaService = new FeaturedMediaService();
