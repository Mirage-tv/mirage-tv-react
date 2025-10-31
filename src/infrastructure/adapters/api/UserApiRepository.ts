/**
 * User API Repository
 */

import { z } from "zod";
import { type User } from "../../../core/domain/User";
import { type UserRepository } from "../../../core/ports/repositories/UserRepository.interface";
import { type HttpClient } from "../../../core/ports/services/HttpClient.interface";
import {
  AuthResponseSchema,
  EmptyResponseSchema,
  SigninRequestSchema,
  SignupRequestSchema,
  UpdateProfileRequestSchema,
  type UserModel,
  UserModelSchema,
} from "./schemas/AuthSchema";
import { WatchlistResponseSchema } from "./schemas/WatchlistSchema";

export class UserApiRepository implements UserRepository {
  readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async signin(email: string, password: string): Promise<User> {
    const response = await this.httpClient.post("/auth/signin", SigninRequestSchema.parse({ email, password }), AuthResponseSchema);
    return this.toEntity(response.user);
  }

  async signup(email: string, password: string, name: string): Promise<User> {
    const response = await this.httpClient.post("/auth/signup", SignupRequestSchema.parse({ email, password, name }), AuthResponseSchema);
    return this.toEntity(response.user);
  }

  async logout(): Promise<void> {
    await this.httpClient.post("/auth/logout", {}, EmptyResponseSchema);
  }

  async getCurrentUser(): Promise<User> {
    const user = await this.httpClient.get("/auth/me", UserModelSchema);
    return this.toEntity(user);
  }

  async refreshSession(): Promise<void> {
    await this.httpClient.post("/auth/refresh", {}, EmptyResponseSchema);
  }

  async getProfile(): Promise<User> {
    const user = await this.httpClient.get("/users/profile", UserModelSchema);
    return this.toEntity(user);
  }

  async updateProfile(name?: string, avatarUrl?: string): Promise<User> {
    const updatedUser = await this.httpClient.put(
      "/users/profile",
      UpdateProfileRequestSchema.parse({ name, avatar_url: avatarUrl }),
      UserModelSchema,
    );
    return this.toEntity(updatedUser);
  }

  async getWatchlist(): Promise<string[]> {
    const response = await this.httpClient.get("/users/watchlist", WatchlistResponseSchema);
    return response.movie_ids;
  }

  async addToWatchlist(movieId: string): Promise<void> {
    await this.httpClient.post(`/users/watchlist/${movieId}`, {}, z.object({ success: z.boolean() }));
  }

  async removeFromWatchlist(movieId: string): Promise<void> {
    await this.httpClient.delete(`/users/watchlist/${movieId}`, z.object({ success: z.boolean() }));
  }

  async getContinueWatching(): Promise<any[]> {
    return await this.httpClient.get("/users/continue-watching", z.array(z.any()));
  }

  private toEntity(model: UserModel): User {
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      subscription: model.subscription_type,
      avatarUrl: model.avatar_url,
      createdAt: model.created_at,
    };
  }
}
