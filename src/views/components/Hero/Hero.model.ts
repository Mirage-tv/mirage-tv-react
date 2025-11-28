import type { MediaThumbnail } from "../../../core/domain/types";

export interface HeroProps {
  movie: MediaThumbnail;
  onPlayClick?: () => void;
  onInfoClick?: () => void;
}
