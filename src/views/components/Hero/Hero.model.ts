import { Movie } from '../../../core/domain/Movie';

export interface HeroProps {
  movie: Movie;
  onPlayClick?: () => void;
  onInfoClick?: () => void;
}
