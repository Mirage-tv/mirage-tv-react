import { LoaderProps } from './Loader.model';
import './Loader.css';

export const Loader = ({ size = 'base' }: LoaderProps) => {
  return (
    <div className="loader-container">
      <div className={`loader ${size !== 'base' ? `loader--${size}` : ''}`} />
    </div>
  );
};
