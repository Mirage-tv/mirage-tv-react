// FAQ Service
// Handles FAQ-related API calls

import { API_ENDPOINTS } from '../../config/api.config';
import { httpClient } from '../http/HttpClient';

export interface FaqQuestion {
  id?: string;
  question: string;
  answers: string;
  updatedAt?: string;
}

export class FaqService {
  /**
   * Fetches all FAQ questions and answers
   * GET /api/v1/faq
   */
  async getFaq(): Promise<FaqQuestion[]> {
    return httpClient.get<FaqQuestion[]>(API_ENDPOINTS.FAQ.LIST);
  }
}

export const faqService = new FaqService();
