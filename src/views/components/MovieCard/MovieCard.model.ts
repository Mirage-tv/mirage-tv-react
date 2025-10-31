/**
 * MovieCard Types & Interfaces
 */

/**
 * MovieCard Types & Interfaces
 */
import type { Movie } from "../../../core/domain/Movie";

export interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}
