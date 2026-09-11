# Chilling - Python Machine Learning Recommendation Microservice

This directory contains the **Python Machine Learning Backend** for the Chilling Movie Recommendation Platform.

---

## 🐍 Tech Stack & Algorithms
- **Language**: Python 3.9+
- **Libraries**: `scikit-learn`, `pandas`, `numpy`, `flask`, `flask-cors`
- **Machine Learning Algorithms**:
  - **TF-IDF (Term Frequency-Inverse Document Frequency) Vectorization**: Converts raw text metadata (genres, moods, synopses, directors, cast) into numerical feature matrices.
  - **Cosine Similarity Matrix**: Computes pairwise cosine similarity angles between movie vectors:
    $$\text{Cosine Similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}$$
  - **User Profile Vector Averaging**: Aggregates user liked item vectors to project a dynamic target recommendation vector.

---

## 🚀 How to Run the Python ML Backend

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the Model**:
   ```bash
   python train_recommendation_model.py
   ```

3. **Launch the Flask REST API**:
   ```bash
   python app.py
   ```
   The ML API will start live on `http://localhost:5000`.

---

## 📡 API Endpoints

- `GET /health`: Health check & loaded model info.
- `GET /api/recommend?title=The Vampire Diaries`: Computes top Cosine Similarity matches for a title.
- `POST /api/user-recommendations`: Computes top recommendations based on a list of user liked movie titles.
