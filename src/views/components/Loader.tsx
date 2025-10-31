import type { ReactNode } from "react";
import "./Loader.css";

interface LoaderProps {
  readonly size?: "sm" | "base" | "lg";
}

export const Loader = ({ size = "base" }: LoaderProps): ReactNode => {
  const sizeClass = size !== "base" ? ` loader--${size}` : "";

  return (
    <div className="loader-container">
      <div className={`loader${sizeClass}`} />
    </div>
  );
};
