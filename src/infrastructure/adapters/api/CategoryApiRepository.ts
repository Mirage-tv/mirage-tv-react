/**
 * Category API Repository
 */

import { type Category } from "../../../core/domain/Category";
import { type CategoryRepository } from "../../../core/ports/repositories/CategoryRepository.interface";
import { type HttpClient } from "../../../core/ports/services/HttpClient.interface";
import { CategoriesArraySchema, CategoryModelSchema, type CategoryModel } from "./schemas/CategorySchema";

export class CategoryApiRepository implements CategoryRepository {
  readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<Category[]> {
    const categories = await this.httpClient.get("/categories", CategoriesArraySchema);
    return categories.map(this.toEntity);
  }

  async getById(id: string): Promise<Category> {
    const category = await this.httpClient.get(`/categories/${id}`, CategoryModelSchema);
    return this.toEntity(category);
  }

  private toEntity(model: CategoryModel): Category {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      iconUrl: model.icon_url,
    };
  }
}
