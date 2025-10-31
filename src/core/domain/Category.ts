/**
 * Domain Entity: Category
 * Entité métier représentant une catégorie de films
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
}
