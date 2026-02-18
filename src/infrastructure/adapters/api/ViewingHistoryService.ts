import type { CreateViewingHistoryRequest, HTTPResponseStatus, MediaThumbnail } from "../../../core/domain/types";
import { API_ENDPOINTS } from "../../config/api.config";
import { httpClient } from "../http/HttpClient";

export class ViewingHistoryService {
  async getContinueWatching(): Promise<MediaThumbnail[]> {
    return httpClient.get<MediaThumbnail[]>(API_ENDPOINTS.HISTORY.CONTINUE_WATCHING);
  }

  async createHistoryEntry(data: CreateViewingHistoryRequest): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(API_ENDPOINTS.HISTORY.CREATE, data);
  }

  async updateProgress(data: CreateViewingHistoryRequest): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(API_ENDPOINTS.HISTORY.UPDATE, data);
  }
}

export const viewingHistoryService = new ViewingHistoryService();
