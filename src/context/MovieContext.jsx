import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MOVIES_DATA, PROFILES } from '../data/moviesData';
import { buildUserTasteVector, calculateMLScore } from '../utils/mlEngine';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('chilling_user');
      return savedUser ? JSON.parse(savedUser) : {
        name: 'Movie Enthusiast',
        email: 'user@chilling.com',
        plan: 'Premium 4K'
      };
    } catch {
      return { name: 'Movie Enthusiast', email: 'user@chilling.com', plan: 'Premium 4K' };
    }
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Machine Learning Model Hyperparameters
  const [mlWeights, setMlWeights] = useState({
    alphaContent: 0.65, // Content Cosine Similarity Weight
    betaRating: 0.25,   // IMDb Quality Weight
    gammaLikeBoost: 0.10 // User Affinity Weight
  });

  const [isMLInspectorOpen, setIsMLInspectorOpen] = useState(false);

  // Saved Watchlist in LocalStorage
  const [myList, setMyList] = useState(() => {
    try {
      const saved = localStorage.getItem('chilling_my_list');
      return saved ? JSON.parse(saved) : ["vampire-diaries", "our-fault", "toxic-fairy-tale", "cyber-genesis"];
    } catch {
      return ["vampire-diaries", "our-fault", "toxic-fairy-tale"];
    }
  });

  // Liked movies map ID -> boolean
  const [likedMovies, setLikedMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('chilling_liked_movies');
      return saved ? JSON.parse(saved) : { "vampire-diaries": true, "toxic-fairy-tale": true };
    } catch {
      return { "vampire-diaries": true };
    }
  });

  // Disliked movies
  const [dislikedMovies, setDislikedMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('chilling_disliked_movies');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active user profile
  const [currentProfile, setCurrentProfile] = useState(PROFILES[0]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeTab, setActiveTab] = useState("home"); // home, recommendations, wizard, mylist

  // Modals
  const [activeMovieModal, setActiveMovieModal] = useState(null);
  const [activeTrailerModal, setActiveTrailerModal] = useState(null);

  // Compute Machine Learning User Taste Vector
  const userTasteVector = useMemo(() => {
    return buildUserTasteVector(likedMovies, MOVIES_DATA);
  }, [likedMovies]);

  // Sync state to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('chilling_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chilling_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chilling_my_list', JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    localStorage.setItem('chilling_liked_movies', JSON.stringify(likedMovies));
  }, [likedMovies]);

  // Auth actions
  const loginUser = (email, password) => {
    const username = email.split('@')[0] || 'User';
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
    const newUser = {
      name: formattedName,
      email: email,
      plan: 'Premium 4K + HDR'
    };
    setUser(newUser);
  };

  const signupUser = (name, email, password, plan = 'Premium 4K') => {
    const newUser = {
      name: name || 'User',
      email: email,
      plan: plan
    };
    setUser(newUser);
  };

  const logoutUser = () => {
    setUser(null);
    setAuthMode('login');
    setActiveTab('home');
  };

  // Movie actions
  const toggleMyList = (movieId) => {
    setMyList(prev => 
      prev.includes(movieId) 
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const toggleLike = (movieId) => {
    setLikedMovies(prev => {
      const next = { ...prev };
      if (next[movieId]) {
        delete next[movieId];
      } else {
        next[movieId] = true;
      }
      return next;
    });

    setDislikedMovies(prev => {
      const next = { ...prev };
      delete next[movieId];
      return next;
    });
  };

  const toggleDislike = (movieId) => {
    setDislikedMovies(prev => {
      const next = { ...prev };
      if (next[movieId]) {
        delete next[movieId];
      } else {
        next[movieId] = true;
      }
      return next;
    });

    setLikedMovies(prev => {
      const next = { ...prev };
      delete next[movieId];
      return next;
    });
  };

  // Dynamic Machine Learning Match Calculation
  const getDynamicMatchScore = (movie) => {
    const mlResult = calculateMLScore(movie, userTasteVector, mlWeights);
    let finalScore = mlResult.matchScore;

    if (likedMovies[movie.id]) finalScore = Math.min(99, finalScore + 4);
    if (dislikedMovies[movie.id]) finalScore = Math.max(50, finalScore - 25);

    return finalScore;
  };

  const filteredMovies = useMemo(() => {
    return MOVIES_DATA.filter(movie => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesGenre = movie.genres.some(g => g.toLowerCase().includes(query));
        const matchesCast = movie.cast.some(c => c.toLowerCase().includes(query));
        const matchesDirector = movie.director.toLowerCase().includes(query);
        if (!matchesTitle && !matchesGenre && !matchesCast && !matchesDirector) {
          return false;
        }
      }

      if (selectedGenre !== "All" && !movie.genres.includes(selectedGenre)) {
        return false;
      }

      if (selectedMood && !movie.moods.includes(selectedMood)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedGenre, selectedMood]);

  const aiRecommendedMovies = useMemo(() => {
    return [...MOVIES_DATA]
      .map(movie => ({
        ...movie,
        dynamicScore: getDynamicMatchScore(movie)
      }))
      .sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [likedMovies, dislikedMovies, userTasteVector, mlWeights]);

  return (
    <MovieContext.Provider
      value={{
        user,
        authMode,
        setAuthMode,
        loginUser,
        signupUser,
        logoutUser,
        mlWeights,
        setMlWeights,
        userTasteVector,
        isMLInspectorOpen,
        setIsMLInspectorOpen,
        movies: MOVIES_DATA,
        filteredMovies,
        aiRecommendedMovies,
        myList,
        likedMovies,
        dislikedMovies,
        currentProfile,
        setCurrentProfile,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        selectedMood,
        setSelectedMood,
        activeTab,
        setActiveTab,
        activeMovieModal,
        setActiveMovieModal,
        activeTrailerModal,
        setActiveTrailerModal,
        toggleMyList,
        toggleLike,
        toggleDislike,
        getDynamicMatchScore
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovie() {
  return useContext(MovieContext);
}
