import React from 'react';
import { MovieProvider, useMovie } from './context/MovieContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MoodSelector from './components/MoodSelector';
import Top10Row from './components/Top10Row';
import CategoryRow from './components/CategoryRow';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import RecommendationWizard from './components/RecommendationWizard';
import AuthScreen from './components/AuthScreen';
import MLInspectorModal from './components/MLInspectorModal';
import Footer from './components/Footer';

import { Sparkles, Flame, Film, Shield, Heart, Zap, Search, BookmarkCheck, Smile, Clapperboard, FlameKindling, Cpu } from 'lucide-react';

function AppContent() {
  const { 
    user,
    movies, 
    filteredMovies, 
    aiRecommendedMovies, 
    myList, 
    searchQuery, 
    selectedGenre, 
    selectedMood,
    activeTab,
    isMLInspectorOpen,
    setIsMLInspectorOpen 
  } = useMovie();

  // If user is not logged in, render Netflix Sign In / Sign Up Screen
  if (!user) {
    return <AuthScreen />;
  }

  // Curated collections
  const romanceMovies = movies.filter(m => m.genres.includes('Romance'));
  const bollywoodMovies = movies.filter(m => m.genres.includes('Bollywood'));
  const kidsMovies = movies.filter(m => m.genres.includes('Kids') || m.genres.includes('Animation'));
  const sciFiMovies = movies.filter(m => m.genres.includes('Sci-Fi'));
  const actionMovies = movies.filter(m => m.genres.includes('Action'));
  const myWatchlistMovies = movies.filter(m => myList.includes(m.id));

  // Determine if search or filters are active
  const isFiltering = searchQuery.trim() !== '' || selectedGenre !== 'All' || selectedMood !== null;

  return (
    <div className="app-container">
      <Navbar />

      {/* Main Content Router */}
      <main style={{ minHeight: '80vh' }}>
        {/* Active Tab: Interactive Recommendation Wizard */}
        {activeTab === 'wizard' ? (
          <RecommendationWizard />
        ) : activeTab === 'mylist' ? (
          /* Active Tab: My List / Watchlist */
          <div style={{ padding: '100px 4% 60px 4%' }}>
            <h1 className="row-title" style={{ fontSize: '2rem', marginBottom: '24px' }}>
              <BookmarkCheck size={28} color="#E50914" />
              <span>My Watchlist ({myWatchlistMovies.length})</span>
            </h1>

            {myWatchlistMovies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
                <Film size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
                <h3>Your watchlist is empty</h3>
                <p style={{ marginTop: 8 }}>Click the "+" button on any movie to save it for later.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {myWatchlistMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        ) : isFiltering ? (
          /* Search / Filter Results Grid */
          <div style={{ padding: '100px 4% 60px 4%' }}>
            <h2 className="row-title" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>
              <Search size={24} color="#E50914" />
              <span>
                {searchQuery ? `Search results for "${searchQuery}"` : `${selectedGenre} Movies`}
                {selectedMood ? ` • ${selectedMood}` : ''}
              </span>
              <span className="row-count-badge" style={{ fontSize: '14px' }}>{filteredMovies.length} found</span>
            </h2>

            {filteredMovies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
                <h3>No movies match your criteria</h3>
                <p style={{ marginTop: 8 }}>Try adjusting your search terms or resetting filters.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filteredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'recommendations' ? (
          /* Dedicated AI Personalized Recommendation Feed */
          <div style={{ padding: '100px 4% 60px 4%' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 className="row-title" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
                <Sparkles size={32} color="#E50914" />
                <span>Personalized Machine Learning Recommendation Feed</span>
              </h1>
              <p style={{ color: '#aaa', fontSize: '15px' }}>
                Engineered dynamically via Cosine Similarity vector space matching across feature embeddings.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
              {aiRecommendedMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          /* Default Home Layout */
          <>
            <Hero />
            
            <MoodSelector />

            <div className="rows-section">
              {/* Top 10 Numbered Row */}
              <Top10Row />

              {/* Romantic Dramas & Passionate Series */}
              <CategoryRow 
                title="Romantic & Supernatural Sensation Hits" 
                icon={Heart} 
                movies={romanceMovies} 
              />

              {/* Dark Crime & Mafia Action */}
              <CategoryRow 
                title="Dark Crime, Warlord & Action Thrillers" 
                icon={FlameKindling} 
                movies={actionMovies} 
              />

              {/* Bollywood Blockbusters Row */}
              <CategoryRow 
                title="Bollywood Blockbusters & Mass Hits" 
                icon={Clapperboard} 
                movies={bollywoodMovies} 
              />

              {/* Kids & Family Cartoon Row */}
              <CategoryRow 
                title="Kids & Family Animated Cartoons" 
                icon={Smile} 
                movies={kidsMovies} 
              />

              {/* Recommended For You Row */}
              <CategoryRow 
                title="Machine Learning Matches (Cosine Similarity)" 
                icon={Cpu} 
                movies={aiRecommendedMovies} 
              />

              {/* Sci-Fi Blockbusters */}
              <CategoryRow 
                title="Mind-Bending & Cyberpunk Sci-Fi" 
                icon={Zap} 
                movies={sciFiMovies} 
              />
            </div>
          </>
        )}
      </main>

      {/* Global Movie & Trailer Player Overlay Modal */}
      <MovieModal />

      {/* Machine Learning Inspector & Vector Visualizer Modal */}
      <MLInspectorModal 
        isOpen={isMLInspectorOpen} 
        onClose={() => setIsMLInspectorOpen(false)} 
      />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
}
