import React, { useState, useEffect } from 'react';
import { useMovie } from '../context/MovieContext';
import { PROFILES, GENRE_CATEGORIES } from '../data/moviesData';
import { Search, Sparkles, Film, Heart, ChevronDown, User, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const {
    user,
    logoutUser,
    currentProfile,
    setCurrentProfile,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    activeTab,
    setActiveTab,
    myList
  } = useMovie();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <div 
          className="logo-brand" 
          onClick={() => {
            setActiveTab('home');
            setSelectedGenre('All');
            setSearchQuery('');
          }}
        >
          <span>CHILLING</span>
          <span className="brand-badge">MATCH AI</span>
        </div>

        <ul className="nav-links">
          <li>
            <button 
              className={`nav-link ${activeTab === 'home' && selectedGenre === 'All' ? 'active' : ''}`}
              onClick={() => { setActiveTab('home'); setSelectedGenre('All'); }}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              For You
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeTab === 'mylist' ? 'active' : ''}`}
              onClick={() => setActiveTab('mylist')}
            >
              My List ({myList.length})
            </button>
          </li>

          {/* Genre Quick Dropdown Selector */}
          <li style={{ position: 'relative' }}>
            <select 
              value={selectedGenre} 
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setActiveTab('home');
              }}
              style={{
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                padding: '4px 10px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <option value="All" style={{ background: '#141414' }}>All Genres</option>
              {GENRE_CATEGORIES.filter(g => g !== 'All').map(genre => (
                <option key={genre} value={genre} style={{ background: '#141414' }}>
                  {genre}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        {/* Recommendation Wizard AI Trigger Button */}
        <button 
          className="nav-link-sparkle"
          onClick={() => setActiveTab('wizard')}
          title="Interactive Recommendation Wizard"
        >
          <Sparkles size={16} />
          <span>Find My Vibe</span>
        </button>

        {/* Live Search */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Titles, genres, cast..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'home') setActiveTab('home');
            }}
          />
        </div>

        {/* Profile & Account Switcher */}
        <div className="profile-dropdown">
          <button 
            className="profile-avatar-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar-badge" style={{ background: currentProfile.avatarBg }}>
              {currentProfile.icon}
            </div>
            <ChevronDown size={14} />
          </button>

          {showProfileMenu && (
            <div className="profile-menu" style={{ width: '230px' }}>
              {/* Logged in User Card */}
              {user && (
                <div style={{
                  padding: '8px 12px 10px 12px',
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                  marginBottom: '4px'
                }}>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  <div style={{
                    marginTop: '4px',
                    fontSize: '10px',
                    background: 'rgba(229, 9, 20, 0.2)',
                    color: '#ff5555',
                    border: '1px solid #e50914',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    fontWeight: 700
                  }}>
                    {user.plan || 'Premium 4K'}
                  </div>
                </div>
              )}

              <div style={{ fontSize: '11px', color: '#888', padding: '4px 12px 4px 12px' }}>
                Switch Profile
              </div>

              {PROFILES.map(profile => (
                <button
                  key={profile.id}
                  className={`profile-item ${currentProfile.id === profile.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentProfile(profile);
                    setShowProfileMenu(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{profile.icon}</span>
                  <span>{profile.name}</span>
                </button>
              ))}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '6px', paddingTop: '4px' }}>
                <button
                  className="profile-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logoutUser();
                  }}
                  style={{ color: '#ff4d4d', fontWeight: 600 }}
                >
                  <LogOut size={16} />
                  <span>Log Out of Chilling</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
