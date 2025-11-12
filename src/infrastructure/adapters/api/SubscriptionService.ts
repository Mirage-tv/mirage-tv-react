// Subscription Service
// Handles subscription and billing API operations

import type { CancelSubReq, HTTPResponseStatus, SubscriptionDTO } from "../../../core/domain/types";
import { API_ENDPOINTS } from "../../config/api.config";
import { httpClient } from "../http/HttpClient";

export class SubscriptionService {
  /**
   * Get current subscription
   * GET /api/v1/sub
   * Retrieves the authenticated viewer's subscription with plan metadata,
   * renewal date, and payment status for the billing screen
   */
  async getSubscription(): Promise<SubscriptionDTO> {
    return httpClient.get<SubscriptionDTO>(API_ENDPOINTS.SUBSCRIPTION.GET);
  }

  /**
   * Cancel subscription
   * POST /api/v1/sub/cancel
   * Schedules the viewer's subscription for cancellation at the end of the
   * current billing period
   *
   * @param data - Subscription ID to cancel
   * @returns 200 OK when cancellation is registered
   */
  async cancelSubscription(data: CancelSubReq): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(API_ENDPOINTS.SUBSCRIPTION.CANCEL, data);
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
