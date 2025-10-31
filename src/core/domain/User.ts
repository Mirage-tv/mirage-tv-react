/**
 * Domain Entity: User
 * Entité métier représentant un utilisateur
 */

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: "basic" | "premium";
  avatarUrl?: string;
  createdAt: string;
}
