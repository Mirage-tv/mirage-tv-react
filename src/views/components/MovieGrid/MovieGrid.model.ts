import type { MediaThumbnail } from "../../../core/domain/types";

export interface MovieGridProps {
  movies: MediaThumbnail[];
  onMovieClick: (movie: MediaThumbnail) => void;
}
