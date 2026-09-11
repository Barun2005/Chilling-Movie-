import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Play, Info, Plus, Check, ThumbsUp, Sparkles, Award } from 'lucide-react';

export default function Hero() {
  const { 
    movies, 
    myList, 
    toggleMyList, 
    likedMovies, 
    toggleLike,
    setActiveMovieModal,
    setActiveTrailerModal,
    getDynamicMatchScore 
  } = useMovie();

  // Find hero movie or fallback to first
  const heroMovie = movies.find(m => m.hero) || movies[0];
  const isInList = myList.includes(heroMovie.id);
  const isLiked = likedMovies[heroMovie.id];
  const matchPercentage = getDynamicMatchScore(heroMovie);

  return (
    <section 
      className="hero-banner"
      style={{ backgroundImage: `url(${heroMovie.backdrop})` }}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        {/* Badges */}
        <div className="hero-badges">
          <span className="match-badge">
            <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
            {matchPercentage}% Match For You
          </span>
          {heroMovie.top10 && (
            <span className="top10-badge">
              <Award size={12} />
              #{heroMovie.top10} IN MOVIES TODAY
            </span>
          )}
          <span className="tag-badge">4K ULTRA HD</span>
          <span className="tag-badge">{heroMovie.rating}</span>
          <span className="tag-badge">{heroMovie.year}</span>
          <span className="tag-badge">{heroMovie.duration}</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="hero-title">{heroMovie.title}</h1>
        <p className="hero-tagline">"{heroMovie.tagline}"</p>
        <p className="hero-synopsis">{heroMovie.synopsis}</p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button 
            className="btn-primary"
            onClick={() => setActiveTrailerModal(heroMovie)}
          >
            <Play size={20} fill="black" />
            <span>Play Trailer</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={() => setActiveMovieModal(heroMovie)}
          >
            <Info size={20} />
            <span>More Info</span>
          </button>

          <button 
            className={`btn-icon-only ${isInList ? 'active' : ''}`}
            onClick={() => toggleMyList(heroMovie.id)}
            title={isInList ? "Remove from My List" : "Add to My List"}
          >
            {isInList ? <Check size={18} /> : <Plus size={18} />}
          </button>

          <button 
            className={`btn-icon-only ${isLiked ? 'active' : ''}`}
            onClick={() => toggleLike(heroMovie.id)}
            title={isLiked ? "Unlike" : "Like to improve recommendations"}
          >
            <ThumbsUp size={18} fill={isLiked ? "white" : "none"} />
          </button>
        </div>
      </div>
    </section>
  );
}
