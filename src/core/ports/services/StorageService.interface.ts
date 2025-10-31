/**
 * Port: StorageService Interface
 * Contrat pour le stockage local (localStorage, sessionStorage, etc.)
 */

export interface StorageService {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}
