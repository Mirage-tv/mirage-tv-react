/**
 * Port: UserRepository Interface
 * Contrat pour les opérations sur les utilisateurs
 */

import type { User } from "../../domain/User";

export interface UserRepository {
  signin(email: string, password: string): Promise<User>;
  signup(email: string, password: string, name: string): Promise<User>;
  getCurrentUser(): Promise<User>;
  updateProfile(user: Partial<User>): Promise<User>;
  logout(): Promise<void>;
  getWatchlist(): Promise<string[]>;
  addToWatchlist(movieId: string): Promise<void>;
  removeFromWatchlist(movieId: string): Promise<void>;
}
