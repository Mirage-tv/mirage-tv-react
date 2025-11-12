// Centralized HTTP client for Mirage-TV API
// Handles authentication via HTTP-only cookies, error handling, and request configuration

import { type APIError } from "../../../core/domain/types";

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = "") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, this.baseURL || window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Handle HTTP errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, use default error message
      }

      const error: APIError = {
        message: errorMessage,
        statusCode: response.status,
      };

      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null as T;
    }

    try {
      return await response.json();
    } catch {
      return null as T;
    }
  }

  /**
   * Generic request method
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = "GET", headers = {}, body, params } = config;

    const url = this.buildURL(endpoint, params);

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: "include", // Important: includes cookies in requests
    };

    if (body && method !== "GET") {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestConfig);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if ((error as APIError).statusCode) {
        throw error;
      }

      // Network or other errors
      const apiError: APIError = {
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        statusCode: 0,
      };
      throw apiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * Update base URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }
}

// Export singleton instance
export const httpClient = new HttpClient("/");
