import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { extractFeatureVector, computeCosineSimilarity, computeDotProduct, computeMagnitude, FEATURE_DIMENSIONS } from '../utils/mlEngine';
import { X, Cpu, Sliders, BarChart3, Sparkles, Binary, CheckCircle2 } from 'lucide-react';

export default function MLInspectorModal({ isOpen, onClose }) {
  const { movies, likedMovies, mlWeights, setMlWeights, userTasteVector } = useMovie();

  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || 'vampire-diaries');

  if (!isOpen) return null;

  const targetMovie = movies.find(m => m.id === selectedMovieId) || movies[0];
  const targetVector = extractFeatureVector(targetMovie);
  const cosSim = computeCosineSimilarity(userTasteVector, targetVector);
  const dotProd = computeDotProduct(userTasteVector, targetVector);
  const magUser = computeMagnitude(userTasteVector);
  const magMovie = computeMagnitude(targetVector);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(20, 20, 20, 0.95) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E50914', marginBottom: '6px' }}>
            <Cpu size={26} />
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>Machine Learning Recommendation Inspector</h2>
          </div>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            Explore how Chilling uses Cosine Similarity Vector Space Models & Feature Embeddings to calculate personalized recommendation scores.
          </p>
        </div>

        {/* Modal Content Grid */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1: Mathematical Formula Card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#46d369', fontWeight: 700, fontSize: '15px', marginBottom: '10px' }}>
              <Binary size={18} />
              <span>Cosine Similarity Vector Formula:</span>
            </div>
            <div style={{
              background: '#000',
              padding: '14px 20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '15px',
              color: '#46d369',
              textAlign: 'center',
              border: '1px solid rgba(70, 211, 105, 0.3)',
              boxShadow: '0 0 15px rgba(70, 211, 105, 0.1)'
            }}>
              CosSim(U, M) = ( U • M ) / ( ||U|| × ||M|| ) = {(cosSim * 100).toFixed(1)}% Match
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '14px', fontSize: '12px', color: '#bbb' }}>
              <div style={{ background: '#181818', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#aaa', display: 'block' }}>Dot Product (U • M):</span>
                <strong style={{ color: '#fff', fontSize: '14px' }}>{dotProd.toFixed(3)}</strong>
              </div>
              <div style={{ background: '#181818', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#aaa', display: 'block' }}>User Mag (||U||):</span>
                <strong style={{ color: '#fff', fontSize: '14px' }}>{magUser.toFixed(3)}</strong>
              </div>
              <div style={{ background: '#181818', padding: '10px', borderRadius: '6px' }}>
                <span style={{ color: '#aaa', display: 'block' }}>Movie Mag (||M||):</span>
                <strong style={{ color: '#fff', fontSize: '14px' }}>{magMovie.toFixed(3)}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Hyperparameter Tuning Sliders */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff9900', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
              <Sliders size={18} />
              <span>Interactive ML Model Hyperparameter Weight Tuning:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {/* Alpha Weight Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>α (Cosine Vector Weight):</span>
                  <strong style={{ color: '#E50914' }}>{(mlWeights.alphaContent * 100).toFixed(0)}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={mlWeights.alphaContent}
                  onChange={e => setMlWeights(prev => ({ ...prev, alphaContent: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#E50914' }}
                />
              </div>

              {/* Beta Weight Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>β (IMDb Rating Weight):</span>
                  <strong style={{ color: '#ff9900' }}>{(mlWeights.betaRating * 100).toFixed(0)}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={mlWeights.betaRating}
                  onChange={e => setMlWeights(prev => ({ ...prev, betaRating: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#ff9900' }}
                />
              </div>

              {/* Gamma Weight Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>γ (User Taste Affinity Weight):</span>
                  <strong style={{ color: '#46d369' }}>{(mlWeights.gammaLikeBoost * 100).toFixed(0)}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={mlWeights.gammaLikeBoost}
                  onChange={e => setMlWeights(prev => ({ ...prev, gammaLikeBoost: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#46d369' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Feature Embedding Comparison Visualizer */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 700, fontSize: '15px' }}>
                <BarChart3 size={18} color="#E50914" />
                <span>Feature Vector Embedding Visualizer</span>
              </div>

              {/* Select target movie to compare */}
              <select
                value={selectedMovieId}
                onChange={e => setSelectedMovieId(e.target.value)}
                style={{
                  background: '#111',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            {/* Vector Dimensions Comparison Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FEATURE_DIMENSIONS.map(dim => {
                const uVal = userTasteVector[dim] || 0;
                const mVal = targetVector[dim] || 0;
                return (
                  <div key={dim} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', gap: '12px', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: '#aaa', fontWeight: 600 }}>{dim}</span>
                    
                    {/* User Vector Bar */}
                    <div style={{ background: '#222', height: '14px', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: `${uVal * 100}%`, height: '100%', background: '#E50914', borderRadius: '4px', transition: 'width 0.3s' }} />
                      <span style={{ position: 'absolute', right: 4, top: 0, fontSize: '9px', color: '#fff', fontWeight: 700 }}>
                        User: {(uVal).toFixed(2)}
                      </span>
                    </div>

                    {/* Movie Vector Bar */}
                    <div style={{ background: '#222', height: '14px', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: `${mVal * 100}%`, height: '100%', background: '#46d369', borderRadius: '4px', transition: 'width 0.3s' }} />
                      <span style={{ position: 'absolute', right: 4, top: 0, fontSize: '9px', color: '#fff', fontWeight: 700 }}>
                        Movie: {(mVal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
