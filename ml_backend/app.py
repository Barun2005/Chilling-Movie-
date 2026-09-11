"""
Chilling Movie Recommendation System - Flask REST API Backend
Exposes Python Machine Learning endpoints for Cosine Similarity Vector Matching
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import ChillingMovieRecommenderML

app = Flask(__name__)
CORS(app)

# Default dataset for Python ML Engine
DATASET = [
    {
        "title": "The Vampire Diaries",
        "genres": ["Romance", "Drama", "Fantasy", "Horror"],
        "moods": ["Tense Thriller", "Cozy & Feel-Good", "Dark & Gritty"],
        "synopsis": "In Mystic Falls, teenager Elena Gilbert falls in love with 162-year-old vampire Stefan Salvatore.",
        "director": "Julie Plec",
        "cast": ["Nina Dobrev", "Paul Wesley", "Ian Somerhalder"],
        "imdbScore": 8.7
    },
    {
        "title": "Our Fault (Culpa Mía)",
        "genres": ["Romance", "Drama", "Action"],
        "moods": ["Cozy & Feel-Good", "Heartwarming", "Adrenaline Rush"],
        "synopsis": "Noah and her stepbrother Nick navigate underground car racing and forbidden passion.",
        "director": "Domingo González",
        "cast": ["Nicole Wallace", "Gabriel Guevara"],
        "imdbScore": 8.6
    },
    {
        "title": "Toxic: A Fairy Tale for Grown-ups",
        "genres": ["Bollywood", "Action", "Crime", "Thriller"],
        "moods": ["Dark & Gritty", "Bollywood Dhamaka", "Adrenaline Rush"],
        "synopsis": "An assassin wages a one-man war against international drug cartel syndicates.",
        "director": "Geetu Mohandas",
        "cast": ["Yash", "Nayanthara", "Kiara Advani"],
        "imdbScore": 9.4
    },
    {
        "title": "Cyber Genesis",
        "genres": ["Sci-Fi", "Action", "Cyberpunk"],
        "moods": ["Mind-Bending", "Adrenaline Rush"],
        "synopsis": "A rogue cyber-detective uncovers a conspiracy that threatens human consciousness.",
        "director": "Sora Takahashi",
        "cast": ["Elena Rostova", "Kaelen Vance"],
        "imdbScore": 8.9
    },
    {
        "title": "Agni & Jal: Fire & Water",
        "genres": ["Bollywood", "Action", "Drama", "History"],
        "moods": ["Adrenaline Rush", "Bollywood Dhamaka"],
        "synopsis": "Two legendary warriors unite against a foreign governor in colonial India.",
        "director": "S.S. Rajamouli",
        "cast": ["Ram Charan", "Jr NTR"],
        "imdbScore": 9.3
    },
    {
        "title": "Dragon Academy: Magic Flight",
        "genres": ["Kids", "Animation", "Fantasy"],
        "moods": ["Kids & Family", "Cozy & Feel-Good"],
        "synopsis": "A brave girl and her baby dragon protect their island kingdom.",
        "director": "Pixar Style",
        "cast": ["Sparky", "Professor Ember"],
        "imdbScore": 9.0
    }
]

# Initialize and train ML Recommender Model
recommender = ChillingMovieRecommenderML()
recommender.load_dataset(DATASET)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "engine": "Chilling Python Scikit-Learn ML Backend",
        "model": "TF-IDF + Cosine Similarity Vector Matrix",
        "movies_loaded": len(DATASET)
    })

@app.route('/api/recommend', methods=['GET'])
def recommend():
    title = request.args.get('title', default='The Vampire Diaries', type=str)
    top_n = request.args.get('top_n', default=5, type=int)
    
    recommendations = recommender.get_similar_movies(title, top_n=top_n)
    return jsonify({
        "query_title": title,
        "algorithm": "Cosine Similarity Metric",
        "recommendations": recommendations
    })

@app.route('/api/user-recommendations', methods=['POST'])
def user_recommendations():
    data = request.get_json() or {}
    liked_titles = data.get('liked_titles', [])
    
    recommendations = recommender.predict_user_taste(liked_titles, top_n=5)
    return jsonify({
        "liked_input": liked_titles,
        "algorithm": "User Profile Feature Vector Averaging + Cosine Similarity",
        "recommendations": recommendations
    })

if __name__ == '__main__':
    print("🚀 Starting Chilling Python ML Server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
