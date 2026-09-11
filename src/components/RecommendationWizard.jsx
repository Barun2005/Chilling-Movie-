import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Sparkles, Play, Plus, Check, RotateCcw, ArrowRight, Star } from 'lucide-react';

export default function RecommendationWizard() {
  const { movies, myList, toggleMyList, setActiveMovieModal, setActiveTrailerModal } = useMovie();

  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [durationPref, setDurationPref] = useState(null);
  const [audiencePref, setAudiencePref] = useState(null);

  const moodOptions = [
    { id: 'mind-bending', emoji: '🧠', title: 'Mind-Bending', desc: 'Complex plots, sci-fi twists, and philosophical thrillers.' },
    { id: 'adrenaline', emoji: '⚡', title: 'Adrenaline Rush', desc: 'High-speed action, explosive stunts, and intense chases.' },
    { id: 'cozy', emoji: '🍿', title: 'Cozy & Feel-Good', desc: 'Warm romantic comedy, baking showdowns, and family fun.' },
    { id: 'dark-gritty', emoji: '🌃', title: 'Dark & Gritty', desc: 'Crime noir, black ops espionage, and intense drama.' },
    { id: 'heartwarming', emoji: '💖', title: 'Heartwarming & Epic', desc: 'Cosmic space odysseys, anime journeys, and deep emotion.' }
  ];

  const durationOptions = [
    { id: 'short', emoji: '⚡', title: 'Under 2 Hours', desc: 'Quick punchy movie night.' },
    { id: 'long', emoji: '🎬', title: '2+ Hours Epic', desc: 'Deep immersive blockbuster experience.' },
    { id: 'any', emoji: '⏳', title: 'No Preference', desc: 'Surprise me with any length.' }
  ];

  const audienceOptions = [
    { id: 'solo', emoji: '👤', title: 'Solo Watching', desc: 'Tailored for focus & immersion.' },
    { id: 'date', emoji: '👩‍❤️‍👨', title: 'Date Night', desc: 'Great conversation starter & high entertainment.' },
    { id: 'group', emoji: '👥', title: 'Friends / Group', desc: 'Crowd pleaser with universal appeal.' }
  ];

  // Compute recommended movies based on answers
  const computeWizardMatches = () => {
    return movies
      .map(movie => {
        let score = movie.matchScore || 90;

        // Mood match
        if (selectedMood && movie.moods.some(m => m.toLowerCase().includes(selectedMood.title.toLowerCase().split(' ')[0]))) {
          score += 6;
        }

        // Duration match
        const durationMinutes = parseInt(movie.duration.split('h')[0]) * 60 + (parseInt(movie.duration.split('h')[1]) || 0);
        if (durationPref === 'short' && durationMinutes <= 120) score += 3;
        if (durationPref === 'long' && durationMinutes > 120) score += 3;

        return { ...movie, wizardScore: Math.min(99, score) };
      })
      .sort((a, b) => b.wizardScore - a.wizardScore)
      .slice(0, 3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedMood(null);
    setDurationPref(null);
    setAudiencePref(null);
  };

  const matches = computeWizardMatches();

  return (
    <section className="wizard-section">
      <div className="wizard-card">
        {step < 4 && (
          <div className="wizard-header">
            <h2 className="wizard-title">
              <Sparkles color="#E50914" />
              <span>Chilling Match AI Recommendation Engine</span>
            </h2>
            <p className="wizard-subtitle">
              Answer 3 quick questions to discover your perfect movie recommendation right now.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  style={{ 
                    width: 40, 
                    height: 4, 
                    borderRadius: 2, 
                    background: i <= step ? '#E50914' : 'rgba(255,255,255,0.1)' 
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Mood */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#fff', textAlign: 'center' }}>
              Step 1: What vibe are you craving tonight?
            </h3>
            <div className="wizard-options-grid">
              {moodOptions.map(option => (
                <button
                  key={option.id}
                  className={`wizard-option-btn ${selectedMood?.id === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(option)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-title">{option.title}</span>
                  <span className="option-desc">{option.desc}</span>
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button 
                className="btn-primary" 
                disabled={!selectedMood}
                style={{ opacity: selectedMood ? 1 : 0.4, cursor: selectedMood ? 'pointer' : 'not-allowed', marginLeft: 'auto' }}
                onClick={() => setStep(2)}
              >
                <span>Next Question</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Duration */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#fff', textAlign: 'center' }}>
              Step 2: How much time do you have?
            </h3>
            <div className="wizard-options-grid">
              {durationOptions.map(option => (
                <button
                  key={option.id}
                  className={`wizard-option-btn ${durationPref === option.id ? 'selected' : ''}`}
                  onClick={() => setDurationPref(option.id)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-title">{option.title}</span>
                  <span className="option-desc">{option.desc}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button 
                className="btn-primary"
                disabled={!durationPref}
                style={{ opacity: durationPref ? 1 : 0.4, cursor: durationPref ? 'pointer' : 'not-allowed' }}
                onClick={() => setStep(3)}
              >
                <span>Next Question</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Audience */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#fff', textAlign: 'center' }}>
              Step 3: Who is watching with you?
            </h3>
            <div className="wizard-options-grid">
              {audienceOptions.map(option => (
                <button
                  key={option.id}
                  className={`wizard-option-btn ${audiencePref === option.id ? 'selected' : ''}`}
                  onClick={() => setAudiencePref(option.id)}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-title">{option.title}</span>
                  <span className="option-desc">{option.desc}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button 
                className="btn-primary"
                disabled={!audiencePref}
                style={{ opacity: audiencePref ? 1 : 0.4, cursor: audiencePref ? 'pointer' : 'not-allowed' }}
                onClick={() => setStep(4)}
              >
                <Sparkles size={18} />
                <span>Generate Recommendations</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === 4 && (
          <div>
            <div className="wizard-header">
              <h2 className="wizard-title" style={{ color: '#46d369' }}>
                <Sparkles color="#46d369" />
                <span>Top 3 Matches Picked For You!</span>
              </h2>
              <p className="wizard-subtitle">
                Based on your craving for <strong>{selectedMood?.title}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
              {matches.map((movie, index) => {
                const isInList = myList.includes(movie.id);
                return (
                  <div 
                    key={movie.id}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: index === 0 ? '2px solid #E50914' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: '20px',
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: -12,
                        left: 20,
                        background: '#E50914',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '11px',
                        padding: '2px 10px',
                        borderRadius: '10px'
                      }}>
                        👑 #1 TOP AI MATCH
                      </div>
                    )}

                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} 
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{movie.title}</h4>
                        <span className="match-badge">{movie.wizardScore}% Match</span>
                        <span style={{ fontSize: '12px', color: '#f5c518', fontWeight: 700 }}>
                          <Star size={12} fill="#f5c518" style={{ display: 'inline', marginRight: 2 }} />
                          {movie.imdbScore}
                        </span>
                      </div>

                      <p style={{ fontSize: '13px', color: '#ccc', marginBottom: '12px', lineHeight: 1.4 }}>
                        {movie.synopsis}
                      </p>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                          onClick={() => setActiveTrailerModal(movie)}
                        >
                          <Play size={14} fill="black" />
                          <span>Watch Trailer</span>
                        </button>

                        <button 
                          className="btn-secondary" 
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                          onClick={() => setActiveMovieModal(movie)}
                        >
                          <span>Full Details</span>
                        </button>

                        <button 
                          className={`btn-icon-only ${isInList ? 'active' : ''}`}
                          style={{ width: '36px', height: '36px' }}
                          onClick={() => toggleMyList(movie.id)}
                        >
                          {isInList ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button className="btn-secondary" onClick={handleReset} style={{ margin: '0 auto' }}>
                <RotateCcw size={16} />
                <span>Start Over</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
