"""
Chilling Movie Recommendation System - Python Machine Learning Engine
Implements Content-Based Filtering & Cosine Similarity using Scikit-Learn and NumPy
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

class ChillingMovieRecommenderML:
    def __init__(self, movies_json_path=None):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.movies_df = None
        self.similarity_matrix = None
        self.feature_matrix = None
        
        if movies_json_path:
            self.load_dataset_from_json(movies_json_path)

    def load_dataset(self, movies_list):
        """Loads movie dataset into pandas DataFrame and computes feature embeddings."""
        self.movies_df = pd.DataFrame(movies_list)
        
        # Combine text features into a unified metadata string for TF-IDF Vectorization
        self.movies_df['combined_features'] = self.movies_df.apply(
            lambda row: f"{' '.join(row.get('genres', []))} {' '.join(row.get('moods', []))} "
                        f"{row.get('synopsis', '')} {row.get('director', '')} {' '.join(row.get('cast', []))}",
            axis=1
        )
        
        # Compute TF-IDF Feature Matrix
        self.feature_matrix = self.vectorizer.fit_transform(self.movies_df['combined_features'])
        
        # Compute Pairwise Cosine Similarity Matrix
        self.similarity_matrix = cosine_similarity(self.feature_matrix, self.feature_matrix)
        print(f"ML Model Trained: Feature Matrix Shape {self.feature_matrix.shape}")

    def get_similar_movies(self, title, top_n=5):
        """Returns top_n recommended movies for a given movie title based on Cosine Similarity."""
        if self.movies_df is None or self.similarity_matrix is None:
            raise ValueError("Model must be trained before predicting recommendations.")

        indices = self.movies_df[self.movies_df['title'].str.lower() == title.lower()].index
        if len(indices) == 0:
            return []
        
        idx = indices[0]
        similarity_scores = list(enumerate(self.similarity_matrix[idx]))
        
        # Sort movies by similarity score in descending order
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        
        # Filter out the movie itself and get top N matches
        recommended_indices = [i for i, score in similarity_scores if i != idx][:top_n]
        
        results = []
        for i in recommended_indices:
            movie = self.movies_df.iloc[i].to_dict()
            sim_score = float(self.similarity_matrix[idx][i])
            results.append({
                "title": movie["title"],
                "match_percentage": round(sim_score * 100, 1),
                "genres": movie.get("genres", []),
                "rating": movie.get("rating", "PG-13"),
                "imdb_score": movie.get("imdbScore", 8.0)
            })
            
        return results

    def predict_user_taste(self, liked_titles, top_n=5):
        """Computes a user profile vector from liked movies and ranks all dataset items."""
        if not liked_titles or self.movies_df is None:
            return []

        liked_indices = self.movies_df[self.movies_df['title'].isin(liked_titles)].index
        if len(liked_indices) == 0:
            return []

        # Average the feature vectors of liked items to form the User Profile Vector
        user_profile_vector = np.asarray(self.feature_matrix[liked_indices].mean(axis=0))
        
        # Compute Cosine Similarity between User Profile Vector and all Movie Vectors
        user_similarities = cosine_similarity(user_profile_vector, self.feature_matrix)[0]
        
        # Sort recommendations
        ranked_indices = np.argsort(user_similarities)[::-1]
        
        recommendations = []
        for idx in ranked_indices:
            movie = self.movies_df.iloc[idx].to_dict()
            if movie['title'] not in liked_titles:
                recommendations.append({
                    "title": movie["title"],
                    "match_score": round(float(user_similarities[idx]) * 100, 1),
                    "synopsis": movie.get("synopsis", "")
                })
                if len(recommendations) >= top_n:
                    break
                    
        return recommendations


if __name__ == "__main__":
    # Test script with sample data
    sample_movies = [
        {"title": "The Vampire Diaries", "genres": ["Romance", "Horror", "Drama"], "moods": ["Dark & Gritty"], "synopsis": "Vampire brothers fall in love with Elena.", "director": "Julie Plec", "cast": ["Nina Dobrev", "Ian Somerhalder"]},
        {"title": "Our Fault", "genres": ["Romance", "Drama", "Action"], "moods": ["Cozy & Feel-Good"], "synopsis": "Noah and Nick fall in love in high society.", "director": "Domingo", "cast": ["Nicole Wallace", "Gabriel Guevara"]},
        {"title": "Toxic", "genres": ["Action", "Crime", "Bollywood"], "moods": ["Dark & Gritty"], "synopsis": "An assassin wages war against cartels.", "director": "Geetu", "cast": ["Yash", "Nayanthara"]},
        {"title": "Cyber Genesis", "genres": ["Sci-Fi", "Action"], "moods": ["Mind-Bending"], "synopsis": "Rogue detective in 2088 neon city.", "director": "Sora", "cast": ["Elena Rostova"]}
    ]
    
    recommender = ChillingMovieRecommenderML()
    recommender.load_dataset(sample_movies)
    print("\n[ML Output] Recommendations for 'The Vampire Diaries':")
    print(json.dumps(recommender.get_similar_movies("The Vampire Diaries"), indent=2))
