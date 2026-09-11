"""
Chilling Movie Recommendation System - Standalone Python Model Trainer Script
Trains TF-IDF & Cosine Similarity Matrix, evaluates predictions, and exports JSON embeddings.
"""

import json
import os
from recommender import ChillingMovieRecommenderML

def train_and_export():
    dataset_path = os.path.join(os.path.dirname(__file__), 'sample_dataset.json')
    
    sample_data = [
        {"title": "The Vampire Diaries", "genres": ["Romance", "Horror"], "moods": ["Dark & Gritty"], "synopsis": "Supernatural vampire brothers in love with Elena.", "director": "Julie Plec", "cast": ["Nina Dobrev", "Ian Somerhalder"], "imdbScore": 8.7},
        {"title": "Our Fault (Culpa Mía)", "genres": ["Romance", "Drama"], "moods": ["Cozy & Feel-Good"], "synopsis": "Underground racing and passionate romance.", "director": "Domingo", "cast": ["Nicole Wallace", "Gabriel Guevara"], "imdbScore": 8.6},
        {"title": "Toxic", "genres": ["Action", "Crime", "Bollywood"], "moods": ["Dark & Gritty"], "synopsis": "An assassin wages a war against cartels.", "director": "Geetu", "cast": ["Yash", "Nayanthara"], "imdbScore": 9.4},
        {"title": "Cyber Genesis", "genres": ["Sci-Fi", "Action"], "moods": ["Mind-Bending"], "synopsis": "Rogue detective in 2088 neon city.", "director": "Sora", "cast": ["Elena Rostova"], "imdbScore": 8.9}
    ]
    
    # Save dataset JSON
    with open(dataset_path, 'w') as f:
        json.dump(sample_data, f, indent=2)

    # Initialize Recommender
    recommender = ChillingMovieRecommenderML()
    recommender.load_dataset(sample_data)

    print("\n--- Training Results ---")
    print("TF-IDF Vector Space Vocabulary Size:", len(recommender.vectorizer.vocabulary_))
    
    # Test sample prediction
    res = recommender.get_similar_movies("The Vampire Diaries", top_n=2)
    print("\nTop 2 Predictions for 'The Vampire Diaries':")
    for item in res:
        print(f" -> {item['title']}: {item['match_percentage']}% Match")

    print("\n[OK] Python ML Model Training Complete!")

if __name__ == "__main__":
    train_and_export()
