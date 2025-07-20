import json
import random
from flask import Flask, render_template, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

app = Flask(__name__)

# --- Configuration ---
# Set a threshold for intent matching. If similarity is below this, use LLM.
# Adjust this value based on how strict you want the intent matching to be.
INTENT_THRESHOLD = 0.65

# --- Load Knowledge Base ---
# Define the path to the knowledge base JSON file
KNOWLEDGE_BASE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'knowledge_base.json')

# Load the knowledge base from the JSON file
def load_knowledge_base(path):
    try:
        with open(path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: knowledge_base.json not found at {path}")
        return {"intents": []}
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {path}. Check file format.")
        return {"intents": []}

knowledge_base = load_knowledge_base(KNOWLEDGE_BASE_PATH)

# --- NLP Model Setup ---
# Prepare data for TF-IDF Vectorizer
patterns = []
tags = []
for intent in knowledge_base['intents']:
    for pattern in intent['patterns']:
        patterns.append(pattern)
        tags.append(intent['tag'])

# Initialize TF-IDF Vectorizer
# This converts text into numerical feature vectors
vectorizer = TfidfVectorizer(lowercase=True, stop_words='english')
# Fit the vectorizer on all patterns from the knowledge base
# This learns the vocabulary and IDF values
tfidf_matrix = vectorizer.fit_transform(patterns)

# --- Helper Functions ---

def get_response_from_knowledge_base(user_message):
    """
    Finds the best matching intent from the knowledge base and returns a response.
    """
    if not patterns: # Handle case where knowledge base is empty
        return None, 0.0

    # Transform the user's message into a TF-IDF vector using the fitted vectorizer
    user_tfidf = vectorizer.transform([user_message])

    # Calculate cosine similarity between the user's message and all patterns
    # Cosine similarity measures the cosine of the angle between two vectors,
    # indicating how similar they are.
    similarities = cosine_similarity(user_tfidf, tfidf_matrix)

    # Find the index of the pattern with the highest similarity
    best_match_index = np.argmax(similarities)
    # Get the highest similarity score
    highest_similarity = similarities[0, best_match_index]

    # If the highest similarity is below the threshold, consider it an unknown intent
    if highest_similarity < INTENT_THRESHOLD:
        return None, highest_similarity # No strong match found

    # Get the tag (intent) of the best matching pattern
    matched_tag = tags[best_match_index]

    # Find the corresponding intent in the knowledge base
    for intent in knowledge_base['intents']:
        if intent['tag'] == matched_tag:
            # Return a random response from the matched intent
            return random.choice(intent['responses']), highest_similarity
    return None, highest_similarity # Should not happen if logic is correct


# --- Flask Routes ---

@app.route('/')
def index():
    """
    Renders the main chat interface.
    """
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """
    API endpoint for handling chatbot queries.
    """
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"response": "Please provide a message."}), 400

    # Try to get a response from the knowledge base first
    response, similarity = get_response_from_knowledge_base(user_message)

    if response:
        # If a response is found in the knowledge base, return it
        return jsonify({"response": response, "source": "knowledge_base"})
    else:
        # If no strong match in knowledge base, indicate that LLM should be used
        # The frontend will then make the LLM call
        return jsonify({"response": "I didn't quite understand that. Let me check with a more advanced AI.", "source": "llm_fallback_needed"})

if __name__ == '__main__':
    # Run the Flask application
    # debug=True allows for automatic reloading on code changes and provides a debugger
    app.run(debug=True)
