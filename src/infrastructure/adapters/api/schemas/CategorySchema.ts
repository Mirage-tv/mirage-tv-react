/**
 * Zod Schemas - Categories API
 * Validation des réponses API pour les catégories
 */

import { z } from 'zod';

// ==================== CATEGORY MODEL ==================== //

export const CategoryModelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  icon_url: z.string().url().optional(),
});

export type CategoryModel = z.infer<typeof CategoryModelSchema>;

// ==================== CATEGORIES ARRAY ==================== //

export const CategoriesArraySchema = z.array(CategoryModelSchema);
