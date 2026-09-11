import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryRow({ title, icon: Icon, movies = [] }) {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies.length) return null;

  return (
    <div className="category-row">
      <div className="row-header">
        <h2 className="row-title">
          {Icon && <Icon size={20} color="#E50914" />}
          <span>{title}</span>
          <span className="row-count-badge">{movies.length}</span>
        </h2>
      </div>

      <div className="row-slider-container">
        <button className="slider-arrow left" onClick={() => handleScroll('left')}>
          <ChevronLeft size={28} />
        </button>

        <div className="row-cards" ref={sliderRef}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button className="slider-arrow right" onClick={() => handleScroll('right')}>
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
