import React, { useRef } from "react";
import "./Carousel.css";

interface CarouselProps {
  title: string;
  children: React.ReactNode;
}

export const Carousel: React.FC<CarouselProps> = ({ title, children }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="carousel">
      <h2 className="carousel__title">{title}</h2>
      <div className="carousel__wrapper">
        <button
          className="carousel__btn carousel__btn--left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          &lt;
        </button>
        <div className="carousel__container" ref={carouselRef}>
          {children}
        </div>
        <button
          className="carousel__btn carousel__btn--right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
