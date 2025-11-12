// Viewing History Service
// Handles viewing history and continue-watching API operations

import type {
  CreateViewingHistoryRequest,
  HTTPResponseStatus,
  MediaThumbnail,
  UpdateViewingHistoryRequest,
} from "../../../core/domain/types";
import { API_ENDPOINTS } from "../../config/api.config";
import { httpClient } from "../http/HttpClient";

export class ViewingHistoryService {
  /**
   * Get continue-watching rail
   * GET /api/v1/history/continue-watching
   * Returns the last 25 partially watched items for authenticated user
   */
  async getContinueWatching(): Promise<MediaThumbnail[]> {
    return httpClient.get<MediaThumbnail[]>(API_ENDPOINTS.HISTORY.CONTINUE_WATCHING);
  }

  /**
   * Create a viewing history entry
   * POST /api/v1/history
   * Seeds the continue-watching rail when playback starts
   *
   * @param data - mediaId and initial progress
   * @returns 201 Created status
   */
  async createHistoryEntry(data: CreateViewingHistoryRequest): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(API_ENDPOINTS.HISTORY.CREATE, data);
  }

  /**
   * Update viewing progress
   * POST /api/v1/history/update
   * Persists ongoing playback progress for an existing entry
   *
   * @param data - entry id and updated progress
   * @returns 204 No Content status
   */
  async updateProgress(data: UpdateViewingHistoryRequest): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(API_ENDPOINTS.HISTORY.UPDATE, data);
  }
}

// Export singleton instance
export const viewingHistoryService = new ViewingHistoryService();
