// Subscription Service
// Handles subscription and billing API operations

import type {
  CheckoutSessionReq,
  CheckoutSessionRes,
  ConfirmCheckoutReq,
  HTTPResponseStatus,
  PlanDTO,
  StripeConfigRes,
  SubscriptionDTO
} from "../../../core/domain/types";
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
   * List subscription plans
   * GET /api/v1/sub/plans
   * Returns the available subscription plans so the client can display
   * pricing options before checkout
   */
  async getPlans(): Promise<PlanDTO[]> {
    return httpClient.get<PlanDTO[]>(API_ENDPOINTS.SUBSCRIPTION.PLANS);
  }

  /**
   * Get Stripe publishable key
   * GET /api/v1/sub/config
   * Provides the Stripe publishable key so the React app can initialise
   * Stripe.js before redirecting to checkout
   */
  async getStripeConfig(): Promise<StripeConfigRes> {
    return httpClient.get<StripeConfigRes>(API_ENDPOINTS.SUBSCRIPTION.CONFIG);
  }

  /**
   * Create Stripe checkout session
   * POST /api/v1/sub/checkout
   * Initialises a Stripe Checkout session for the selected plan and
   * returns the redirect URL
   *
   * @param data - Plan ID to subscribe to
   * @returns Stripe session ID and URL to redirect the viewer to
   */
  async createCheckoutSession(data: CheckoutSessionReq): Promise<CheckoutSessionRes> {
    return httpClient.post<CheckoutSessionRes>(API_ENDPOINTS.SUBSCRIPTION.CHECKOUT, data);
  }

  /**
   * Confirm Stripe checkout
   * POST /api/v1/sub/confirm
   * Validates the Stripe Checkout session and activates the subscription
   * locally after payment is completed
   *
   * @param data - Stripe session ID to confirm
   * @returns The freshly activated subscription with invoices
   */
  async confirmCheckout(data: ConfirmCheckoutReq): Promise<SubscriptionDTO> {
    return httpClient.post<SubscriptionDTO>(API_ENDPOINTS.SUBSCRIPTION.CONFIRM, data);
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
  async cancelSubscription(): Promise<HTTPResponseStatus> {
    return httpClient.post<HTTPResponseStatus>(API_ENDPOINTS.SUBSCRIPTION.CANCEL);
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
