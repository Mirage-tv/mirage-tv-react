// Category Service
// Handles category-related API operations for browse filters

import { type AvailableCategories } from "../../../core/domain/types";
import { API_ENDPOINTS } from "../../config/api.config";
import { httpClient } from "../http/HttpClient";

export class CategoryService {
  /**
   * List all available categories
   * GET /api/v1/categories
   * Returns category slugs for browse filters and linking
   */
  async getCategories(): Promise<AvailableCategories> {
    return httpClient.get<AvailableCategories>(API_ENDPOINTS.CATEGORIES.LIST);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
