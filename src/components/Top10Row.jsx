import React, { useRef } from 'react';
import { useMovie } from '../context/MovieContext';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';

export default function Top10Row() {
  const { movies, setActiveMovieModal } = useMovie();
  const sliderRef = useRef(null);

  // Filter movies with top10 rank
  const top10Movies = movies
    .filter(m => m.top10)
    .sort((a, b) => a.top10 - b.top10);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!top10Movies.length) return null;

  return (
    <div className="category-row">
      <div className="row-header">
        <h2 className="row-title">
          <Award size={22} color="#E50914" />
          <span>Top 10 Movies in India Today</span>
        </h2>
      </div>

      <div className="row-slider-container">
        <button className="slider-arrow left" onClick={() => handleScroll('left')}>
          <ChevronLeft size={28} />
        </button>

        <div className="row-cards" ref={sliderRef}>
          {top10Movies.map((movie) => (
            <div 
              key={movie.id} 
              className="top10-card"
              onClick={() => setActiveMovieModal(movie)}
            >
              <div className="top10-number">{movie.top10}</div>
              <div className="top10-poster-wrap">
                <img 
                  src={movie.poster} 
                  alt={movie.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="slider-arrow right" onClick={() => handleScroll('right')}>
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
