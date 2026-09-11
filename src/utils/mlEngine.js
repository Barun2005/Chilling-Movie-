// Machine Learning Engine for Chilling Recommendation System
// Implements Cosine Similarity Vector Space Model & Content-Based / Collaborative Hybrid Filtering

export const FEATURE_DIMENSIONS = [
  'SciFi',
  'Action',
  'Romance',
  'Drama',
  'Comedy',
  'Horror',
  'Animation',
  'Bollywood',
  'DarkGritty',
  'MindBending',
  'Adrenaline',
  'Cozy',
  'Heartwarming'
];

// Map qualitative movie data into quantitative Machine Learning feature vectors [0.0 - 1.0]
export function extractFeatureVector(movie) {
  const vector = {};
  FEATURE_DIMENSIONS.forEach(dim => { vector[dim] = 0.05; });

  // Map genres
  if (movie.genres.includes('Sci-Fi')) vector['SciFi'] = 0.95;
  if (movie.genres.includes('Action')) vector['Action'] = 0.95;
  if (movie.genres.includes('Romance')) vector['Romance'] = 0.95;
  if (movie.genres.includes('Drama')) vector['Drama'] = 0.85;
  if (movie.genres.includes('Comedy')) vector['Comedy'] = 0.90;
  if (movie.genres.includes('Horror')) vector['Horror'] = 0.90;
  if (movie.genres.includes('Animation') || movie.genres.includes('Kids')) vector['Animation'] = 0.95;
  if (movie.genres.includes('Bollywood')) vector['Bollywood'] = 0.95;

  // Map mood vectors
  if (movie.moods.includes('Dark & Gritty')) vector['DarkGritty'] = 0.90;
  if (movie.moods.includes('Mind-Bending')) vector['MindBending'] = 0.95;
  if (movie.moods.includes('Adrenaline Rush')) vector['Adrenaline'] = 0.90;
  if (movie.moods.includes('Cozy & Feel-Good')) vector['Cozy'] = 0.90;
  if (movie.moods.includes('Heartwarming')) vector['Heartwarming'] = 0.85;
  if (movie.moods.includes('Bollywood Dhamaka')) vector['Bollywood'] = 0.95;

  return vector;
}

// Compute Dot Product: A • B = Σ (A_i * B_i)
export function computeDotProduct(vecA, vecB) {
  return FEATURE_DIMENSIONS.reduce((sum, dim) => {
    return sum + ((vecA[dim] || 0) * (vecB[dim] || 0));
  }, 0);
}

// Compute Vector Magnitude: ||A|| = √(Σ A_i²)
export function computeMagnitude(vec) {
  const sumSquares = FEATURE_DIMENSIONS.reduce((sum, dim) => {
    const val = vec[dim] || 0;
    return sum + (val * val);
  }, 0);
  return Math.sqrt(sumSquares);
}

// Compute Cosine Similarity Metric: CosSim(A, B) = (A • B) / (||A|| * ||B||)
export function computeCosineSimilarity(vecA, vecB) {
  const dot = computeDotProduct(vecA, vecB);
  const magA = computeMagnitude(vecA);
  const magB = computeMagnitude(vecB);

  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// Build dynamic User Taste Vector from watch history & liked movies
export function buildUserTasteVector(likedMovieIds, movies) {
  const userVec = {};
  FEATURE_DIMENSIONS.forEach(dim => { userVec[dim] = 0.1; });

  const likedList = movies.filter(m => likedMovieIds[m.id]);
  if (likedList.length === 0) {
    // Default balanced taste vector
    userVec['SciFi'] = 0.8;
    userVec['Action'] = 0.7;
    userVec['Romance'] = 0.6;
    userVec['Bollywood'] = 0.7;
    userVec['MindBending'] = 0.8;
    return userVec;
  }

  likedList.forEach(movie => {
    const mVec = extractFeatureVector(movie);
    FEATURE_DIMENSIONS.forEach(dim => {
      userVec[dim] += mVec[dim];
    });
  });

  // Normalize user taste vector by count
  FEATURE_DIMENSIONS.forEach(dim => {
    userVec[dim] = Math.min(1.0, userVec[dim] / likedList.length);
  });

  return userVec;
}

// Calculate Hybrid Machine Learning Score
export function calculateMLScore(movie, userTasteVector, weights = { alphaContent: 0.6, betaRating: 0.3, gammaLikeBoost: 0.1 }) {
  const movieVec = extractFeatureVector(movie);
  const cosSim = computeCosineSimilarity(userTasteVector, movieVec); // [0.0 - 1.0]
  
  const normalizedImdb = (movie.imdbScore || 8.0) / 10.0; // [0.0 - 1.0]

  // Hybrid formula: Score = α * CosineSim + β * IMDbScore + γ * BaseScore
  const rawScore = (weights.alphaContent * cosSim) + (weights.betaRating * normalizedImdb) + (weights.gammaLikeBoost * 0.95);
  
  // Convert to match percentage score [50% - 99%]
  const matchScore = Math.min(99, Math.max(55, Math.round(rawScore * 100)));

  return {
    matchScore,
    cosineSim: (cosSim * 100).toFixed(1),
    dotProduct: computeDotProduct(userTasteVector, movieVec).toFixed(3),
    movieVector: movieVec
  };
}
