import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Play, Plus, Check, ThumbsUp, ChevronDown, Sparkles } from 'lucide-react';

export default function MovieCard({ movie }) {
  const { 
    myList, 
    toggleMyList, 
    likedMovies, 
    toggleLike, 
    setActiveMovieModal,
    setActiveTrailerModal,
    getDynamicMatchScore 
  } = useMovie();

  const isInList = myList.includes(movie.id);
  const isLiked = likedMovies[movie.id];
  const matchScore = getDynamicMatchScore(movie);

  return (
    <div 
      className="movie-card"
      onClick={() => setActiveMovieModal(movie)}
    >
      <img 
        src={movie.poster} 
        alt={movie.title} 
        className="movie-card-img" 
        loading="lazy" 
      />

      <div className="movie-card-overlay">
        <div className="card-title">{movie.title}</div>
        
        <div className="card-meta">
          <span className="card-match">
            <Sparkles size={10} style={{ display: 'inline', marginRight: 2 }} />
            {matchScore}% Match
          </span>
          <span className="card-rating">{movie.rating}</span>
          <span>{movie.duration}</span>
        </div>

        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button 
            className="card-btn play"
            onClick={() => setActiveTrailerModal(movie)}
            title="Watch Trailer"
          >
            <Play size={14} fill="black" />
          </button>

          <button 
            className="card-btn"
            onClick={() => toggleMyList(movie.id)}
            title={isInList ? "Remove from List" : "Add to My List"}
          >
            {isInList ? <Check size={14} color="#46d369" /> : <Plus size={14} />}
          </button>

          <button 
            className="card-btn"
            onClick={() => toggleLike(movie.id)}
            title={isLiked ? "Unlike" : "Like to personalize recommendations"}
          >
            <ThumbsUp size={14} fill={isLiked ? "#E50914" : "none"} color={isLiked ? "#E50914" : "white"} />
          </button>

          <button 
            className="card-btn"
            style={{ marginLeft: 'auto' }}
            onClick={() => setActiveMovieModal(movie)}
            title="More Info"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
