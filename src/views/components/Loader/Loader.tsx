import "./Loader.css";
import type { LoaderProps } from "./Loader.model";

export const Loader = ({ size = "base" }: LoaderProps) => {
  return (
    <div className="loader-container">
      <div className={`loader ${size !== "base" ? `loader--${size}` : ""}`} />
    </div>
  );
};
