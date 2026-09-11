import React from 'react';
import { useMovie } from '../context/MovieContext';
import { X, Play, Plus, Check, ThumbsUp, Sparkles, Star, Film, UserCheck } from 'lucide-react';

export default function MovieModal() {
  const { 
    activeMovieModal, 
    setActiveMovieModal,
    activeTrailerModal,
    setActiveTrailerModal,
    myList,
    toggleMyList,
    likedMovies,
    toggleLike,
    getDynamicMatchScore,
    movies
  } = useMovie();

  // If activeTrailerModal is set, show full video player modal
  if (activeTrailerModal) {
    return (
      <div className="modal-overlay" onClick={() => setActiveTrailerModal(null)}>
        <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
          <button 
            className="modal-close-btn"
            onClick={() => setActiveTrailerModal(null)}
          >
            <X size={20} />
          </button>
          
          <iframe 
            className="trailer-iframe"
            src={`${activeTrailerModal.trailerUrl}?autoplay=1`}
            title={`${activeTrailerModal.title} Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // If activeMovieModal is not set, return null
  if (!activeMovieModal) return null;

  const movie = activeMovieModal;
  const isInList = myList.includes(movie.id);
  const isLiked = likedMovies[movie.id];
  const matchScore = getDynamicMatchScore(movie);

  // Similar movies recommendation
  const similarMovies = movies.filter(m => 
    m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))
  ).slice(0, 4);

  return (
    <div className="modal-overlay" onClick={() => setActiveMovieModal(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button 
          className="modal-close-btn"
          onClick={() => setActiveMovieModal(null)}
        >
          <X size={20} />
        </button>

        {/* Hero Image Section */}
        <div 
          className="modal-hero"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        >
          <div className="modal-hero-overlay" />
          <div className="modal-hero-content">
            <h2 className="hero-title" style={{ fontSize: '2.5rem' }}>{movie.title}</h2>
            
            <div className="hero-actions" style={{ marginTop: '16px' }}>
              <button 
                className="btn-primary"
                onClick={() => {
                  setActiveMovieModal(null);
                  setActiveTrailerModal(movie);
                }}
              >
                <Play size={18} fill="black" />
                <span>Play Trailer</span>
              </button>

              <button 
                className={`btn-icon-only ${isInList ? 'active' : ''}`}
                onClick={() => toggleMyList(movie.id)}
              >
                {isInList ? <Check size={18} /> : <Plus size={18} />}
              </button>

              <button 
                className={`btn-icon-only ${isLiked ? 'active' : ''}`}
                onClick={() => toggleLike(movie.id)}
              >
                <ThumbsUp size={18} fill={isLiked ? "white" : "none"} />
              </button>
            </div>
          </div>
        </div>

        {/* Body Details */}
        <div className="modal-body">
          <div>
            <div className="hero-badges" style={{ marginBottom: '16px' }}>
              <span className="match-badge">
                <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                {matchScore}% Match
              </span>
              <span className="tag-badge">{movie.year}</span>
              <span className="tag-badge">{movie.rating}</span>
              <span className="tag-badge">{movie.duration}</span>
              <span className="tag-badge" style={{ borderColor: '#f5c518', color: '#f5c518' }}>
                <Star size={11} fill="#f5c518" style={{ display: 'inline', marginRight: 4 }} />
                IMDb {movie.imdbScore}
              </span>
            </div>

            <p className="modal-synopsis">{movie.synopsis}</p>

            {/* AI Recommendation Reason Breakdown */}
            {movie.matchReasons && (
              <div className="modal-reasons-list">
                <div className="modal-reasons-title">
                  <Sparkles size={14} />
                  <span>Why Chilling Match AI Recommends This:</span>
                </div>
                <ul style={{ paddingLeft: '20px', color: '#ccc', fontSize: '13px', lineHeight: 1.6 }}>
                  {movie.matchReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* More Like This */}
            {similarMovies.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>
                  More Like This
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                  {similarMovies.map(sim => (
                    <div 
                      key={sim.id}
                      style={{ 
                        background: '#222', 
                        borderRadius: '6px', 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        transition: 'transform 0.2s' 
                      }}
                      onClick={() => setActiveMovieModal(sim)}
                    >
                      <img src={sim.poster} alt={sim.title} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                      <div style={{ padding: '8px', fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                        {sim.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cast & Info Column */}
          <div className="modal-side-info">
            <div>
              <span className="info-label">Director:</span>
              <span className="info-value">{movie.director}</span>
            </div>

            <div>
              <span className="info-label">Cast:</span>
              <span className="info-value">{movie.cast.join(', ')}</span>
            </div>

            <div>
              <span className="info-label">Genres:</span>
              <span className="info-value">{movie.genres.join(', ')}</span>
            </div>

            <div>
              <span className="info-label">Mood Tags:</span>
              <span className="info-value">{movie.moods.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
