// Video Service
// Handles video playback URL retrieval with signed URLs and subtitles

import { VideoURLsDTO } from '../../../core/domain/types';
import { API_ENDPOINTS } from '../../config/api.config';
import { httpClient } from '../http/HttpClient';

export class VideoService {
  /**
   * Get secure playback URLs for a media item
   * GET /api/v1/video-url?mediaID={mediaID}
   * Returns signed streaming URLs and subtitles for active subscribers
   *
   * @param mediaID - UUID of the media to get playback URLs for
   * @returns VideoURLsDTO with source, subtitles, and optional trailer
   */
  async getVideoUrls(mediaID: string): Promise<VideoURLsDTO> {
    return httpClient.get<VideoURLsDTO>(API_ENDPOINTS.VIDEO.GET_URL, {
      mediaID,
    });
  }
}

// Export singleton instance
export const videoService = new VideoService();
