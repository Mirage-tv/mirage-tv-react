/**
 * Use Case: Get Categories
 */

import { Category } from '../../domain/Category';
import { CategoryRepository } from '../../ports/repositories/CategoryRepository.interface';

export class GetCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return await this.categoryRepository.getAll();
  }
}
