/**
 * Port: HttpClient Interface
 * Contrat pour les requêtes HTTP avec validation Zod
 */

import { z } from 'zod';

export interface HttpClient {
  get<T extends z.ZodTypeAny>(endpoint: string, schema: T): Promise<z.infer<T>>;
  post<T extends z.ZodTypeAny>(
    endpoint: string,
    body: unknown,
    schema: T
  ): Promise<z.infer<T>>;
  put<T extends z.ZodTypeAny>(
    endpoint: string,
    body: unknown,
    schema: T
  ): Promise<z.infer<T>>;
  delete<T extends z.ZodTypeAny>(endpoint: string, schema: T): Promise<z.infer<T>>;
}
