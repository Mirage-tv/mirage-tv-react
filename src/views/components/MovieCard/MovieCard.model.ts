/**
 * MovieCard Types & Interfaces
 */
import type { MediaThumbnail } from "../../../core/domain/types";

export interface MovieCardProps {
  movie: MediaThumbnail;
  onClick?: () => void;
}
