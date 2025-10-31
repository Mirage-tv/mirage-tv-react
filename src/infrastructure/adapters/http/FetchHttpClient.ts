/**
 * HTTP Client avec gestion des sessions
 */

import { z } from "zod";
import type { HttpClient } from "../../../core/ports/services/HttpClient.interface";
import { HttpError, ValidationError } from "./HttpError";

export class FetchHttpClient implements HttpClient {
  readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  private async request<T extends z.ZodTypeAny>(endpoint: string, schema: T, options?: RequestInit): Promise<z.infer<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: this.getHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(response.status, errorData.message || `HTTP ${response.status}`, errorData);
      }

      const rawData = await response.json();
      const result = schema.safeParse(rawData);

      if (!result.success) {
        throw new ValidationError("Invalid API response format", result.error.issues);
      }

      return result.data;
    } catch (error) {
      if (error instanceof HttpError || error instanceof ValidationError) {
        throw error;
      }
      throw new Error("Network request failed");
    }
  }

  async get<T extends z.ZodTypeAny>(endpoint: string, schema: T): Promise<z.infer<T>> {
    return this.request(endpoint, schema, { method: "GET" });
  }

  async post<T extends z.ZodTypeAny>(endpoint: string, body: unknown, schema: T): Promise<z.infer<T>> {
    return this.request(endpoint, schema, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T extends z.ZodTypeAny>(endpoint: string, body: unknown, schema: T): Promise<z.infer<T>> {
    return this.request(endpoint, schema, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T extends z.ZodTypeAny>(endpoint: string, schema: T): Promise<z.infer<T>> {
    return this.request(endpoint, schema, { method: "DELETE" });
  }
}
