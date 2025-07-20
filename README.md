NLP Chatbot Assistant
An intelligent web-based chatbot designed to provide information from a predefined knowledge base and leverage a powerful Large Language Model (LLM) for more dynamic and complex queries. This project showcases a hybrid approach to chatbot development, combining rule-based responses with advanced AI capabilities.

✨ Features
Intelligent Intent Recognition: Identifies the user's intent to provide accurate, predefined answers.

Rule-Based Responses: Efficiently answers common questions from a local knowledge base.

Gemini 2.0 Flash Integration: Seamlessly falls back to the powerful Gemini 2.0 Flash LLM for questions outside the knowledge base or for more general conversational queries.

User-Friendly Web Interface: A clean and interactive chat window for a smooth user experience.

Scalable Knowledge Base: Easily extendable JSON structure for adding more predefined questions and answers.

Responsive Design: Optimized for various screen sizes using Tailwind CSS.

🚀 Technologies Used
Backend:

Python 3

Flask (Web Framework)

Scikit-learn (for TF-IDF Vectorization and Cosine Similarity for NLP)

NumPy (for numerical operations)

Frontend:

HTML5

CSS3 (with Tailwind CSS for rapid styling)

JavaScript

AI Model:

Google Gemini 2.0 Flash API

🛠️ Setup and Installation
Follow these steps to get the NLP Chatbot up and running on your local machine.

Prerequisites
Python 3.8+ installed on your system.

pip (Python package installer)

Git (for cloning the repository)

Steps
Clone the Repository:
First, clone this GitHub repository to your local machine using Git:

git clone https://github.com/YOUR_USERNAME/NLP-Chatbot-Assistant.git
cd NLP-Chatbot-Assistant

(Replace YOUR_USERNAME with your actual GitHub username and NLP-Chatbot-Assistant with your repository name if different.)

Create a Virtual Environment:
It's highly recommended to use a virtual environment to manage project dependencies.

python -m venv venv

Activate the Virtual Environment:

On Windows:

.\venv\Scripts\activate

On macOS / Linux:

source venv/bin/activate

Install Dependencies:
With your virtual environment activated, install the required Python packages:

pip install -r requirements.txt

Troubleshooting scikit-learn / numpy installation on Windows:
If you encounter errors related to "Microsoft Visual C++ 14.0 or greater is required," you'll need to install the Microsoft C++ Build Tools. During installation, select the "Desktop development with C++" workload. After installation, restart your computer and try pip install -r requirements.txt again.

▶️ How to Run the Application
Once all dependencies are installed and your virtual environment is active:

Run the Flask Application:

flask run

Access the Chatbot:
Open your web browser and navigate to the URL displayed in your terminal (e.g., http://127.0.0.1:5000).

🤖 How to Use the Chatbot
The chatbot operates in two primary modes:

Knowledge Base Mode:

Ask questions related to the predefined data/knowledge_base.json.

Examples:

"Hello"

"Where is the university located?"

"How can I apply?"

"What courses do you offer?"

"Thank you"

LLM Fallback Mode:

If your question is not confidently matched within the knowledge base, the chatbot will automatically route your query to the Gemini 2.0 Flash LLM.

This allows it to answer general knowledge questions or engage in more open-ended conversation.

Examples:

"Tell me a fun fact about space."

"What is the capital of France?"

"Can you explain quantum physics simply?"

"Write a short poem about nature."

🧠 Hybrid NLP Approach Explained
This chatbot implements a practical hybrid approach:

Rule-Based (Knowledge Base): For frequently asked questions or specific domain-related queries, a pre-defined knowledge_base.json is used. This provides fast, consistent, and accurate answers for known intents. The app.py backend uses TF-IDF vectorization and cosine similarity to find the best match for user input against these patterns. This is efficient and ensures control over specific responses.

LLM Fallback (Gemini 2.0 Flash): When the user's query doesn't strongly match any predefined intent in the knowledge base (i.e., the similarity score is below a set threshold), the frontend (script.js) makes a direct call to the Google Gemini 2.0 Flash API. This allows the chatbot to handle a vast range of questions and engage in more complex conversations without needing to pre-program every possible response.

This architecture offers the best of both worlds: precision and control for common queries, and flexibility and intelligence for everything else.

🔮 Future Enhancements
Admin Interface: A web interface to easily add, edit, and delete entries in the knowledge_base.json without direct file manipulation.

Conversation History: Implement persistent storage (e.g., a simple database like SQLite) to remember past conversations.

More Sophisticated NLP: Explore more advanced NLP techniques for intent recognition (e.g., using pre-trained transformer models for better semantic understanding).

Error Handling & Logging: More robust error handling and logging for production environments.

Deployment: Deploy the Flask application to a cloud platform (e.g., Heroku, AWS, Google Cloud).

📄 License
This project is open-source and available under the MIT License.
