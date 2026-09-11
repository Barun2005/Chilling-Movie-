import React from 'react';
import { useMovie } from '../context/MovieContext';
import { MOOD_CATEGORIES } from '../data/moviesData';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function MoodSelector() {
  const { selectedMood, setSelectedMood, setActiveTab } = useMovie();

  return (
    <div className="mood-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aaa', fontSize: '13px', fontWeight: 600 }}>
        <Sparkles size={14} color="#E50914" />
        <span>Select Your Vibe:</span>
      </div>

      <button
        className={`mood-pill ${selectedMood === null ? 'active' : ''}`}
        onClick={() => setSelectedMood(null)}
      >
        ✨ All Vibes
      </button>

      {MOOD_CATEGORIES.map(category => (
        <button
          key={category.id}
          className={`mood-pill ${selectedMood === category.mood ? 'active' : ''}`}
          onClick={() => {
            setSelectedMood(selectedMood === category.mood ? null : category.mood);
            setActiveTab('home');
          }}
        >
          {category.label}
        </button>
      ))}

      {selectedMood && (
        <button 
          className="mood-pill"
          onClick={() => setSelectedMood(null)}
          style={{ background: 'rgba(255,255,255,0.05)', color: '#ff5555' }}
        >
          <RefreshCw size={12} style={{ marginRight: 4 }} /> Reset
        </button>
      )}
    </div>
  );
}
