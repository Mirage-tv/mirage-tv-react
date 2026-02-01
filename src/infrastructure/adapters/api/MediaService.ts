// Media Service
// Handles all media-related API operations (movies, shows, categories, voting, search)

import type { HTTPResponseStatus, MediaDTO, PageMediaThumbnail, PageSeriePreview, SerieDTO } from '../../../core/domain/types';
import { API_ENDPOINTS, PAGINATION } from '../../config/api.config';
import { httpClient } from '../http/HttpClient';

export interface PaginationParams {
  page?: number;
  per?: number;
}

export class MediaService {
  /**
   * Get media details by ID
   * GET /api/v1/media/{id}
   */
  async getMediaById(id: string): Promise<MediaDTO> {
    return httpClient.get<MediaDTO>(API_ENDPOINTS.MEDIA.GET_BY_ID(id));
  }

  /**
   * List available movies with pagination
   * GET /api/v1/media/movies
   */
  async getMovies(params: PaginationParams = {}): Promise<PageMediaThumbnail> {
    const { page = PAGINATION.DEFAULT_PAGE, per = PAGINATION.DEFAULT_PER_PAGE } = params;

    return httpClient.get<PageMediaThumbnail>(API_ENDPOINTS.MEDIA.MOVIES, {
      page,
      per: Math.min(per, PAGINATION.MAX_PER_PAGE)
    });
  }

  /**
   * List available shows with pagination
   * GET /api/v1/media/shows
   */
  async getShows(params: PaginationParams = {}): Promise<PageSeriePreview> {
    const { page = PAGINATION.DEFAULT_PAGE, per = PAGINATION.DEFAULT_PER_PAGE } = params;

    return httpClient.get<PageSeriePreview>(API_ENDPOINTS.MEDIA.SHOWS, {
      page,
      per: Math.min(per, PAGINATION.MAX_PER_PAGE)
    });
  }

  /**
   * Get show details with seasons and episodes
   * GET /api/v1/media/shows/{id}
   */
  async getShowById(id: string): Promise<SerieDTO> {
    return httpClient.get<SerieDTO>(API_ENDPOINTS.MEDIA.GET_SHOW_BY_ID(id));
  }

  /**
   * Browse media by category with pagination
   * GET /api/v1/media/category/{category}
   */
  async getMediaByCategory(category: string, params: PaginationParams = {}): Promise<PageMediaThumbnail> {
    const { page = PAGINATION.DEFAULT_PAGE, per = PAGINATION.DEFAULT_PER_PAGE } = params;

    return httpClient.get<PageMediaThumbnail>(API_ENDPOINTS.MEDIA.CATEGORY(category), {
      page,
      per: Math.min(per, PAGINATION.MAX_PER_PAGE)
    });
  }

  /**
   * Up-vote a media item
   * POST /api/v1/media/up-vote/{id}
   * Requires active subscription
   */
  async upVoteMedia(id: string): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(API_ENDPOINTS.MEDIA.UP_VOTE(id));
  }

  /**
   * Search media by query
   * GET /api/v1/media/search?q={query}
   * Returns movies and series matching the search query
   */
  async search(query: string, params: PaginationParams = {}): Promise<MediaSearchResponse> {
    const { page = PAGINATION.DEFAULT_PAGE, per = PAGINATION.DEFAULT_PER_PAGE } = params;

    return httpClient.get<MediaSearchResponse>(API_ENDPOINTS.MEDIA.SEARCH, {
      q: query,
      page,
      per: Math.min(per, PAGINATION.MAX_PER_PAGE)
    });
  }
}

// Export singleton instance
export const mediaService = new MediaService();
