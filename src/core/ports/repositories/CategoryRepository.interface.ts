/**
 * Port: CategoryRepository Interface
 * Contrat pour les opérations sur les catégories
 */

import type { Category } from "../../domain/Category";

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category>;
}
