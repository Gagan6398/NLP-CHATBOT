document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Function to append a message to the chat window
    function appendMessage(sender, message, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`, 'mb-3', 'p-3', 'rounded-lg', 'max-w-xs');

        if (sender === 'user') {
            messageDiv.classList.add('self-end');
            messageDiv.textContent = message;
        } else {
            messageDiv.classList.add('self-start');
            if (isHtml) {
                messageDiv.innerHTML = message; // Use innerHTML for formatted content
            } else {
                messageDiv.textContent = message;
            }
        }
        chatWindow.appendChild(messageDiv);
        // Scroll to the bottom of the chat window
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Function to show/hide loading indicator
    let loadingIndicator = null;
    function showLoadingIndicator() {
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.classList.add('loading-indicator', 'bot-message', 'mb-3', 'p-3', 'rounded-lg', 'max-w-xs', 'self-start');
            loadingIndicator.textContent = 'Bot is typing';
            chatWindow.appendChild(loadingIndicator);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    function hideLoadingIndicator() {
        if (loadingIndicator) {
            loadingIndicator.remove();
            loadingIndicator = null;
        }
    }

    // Function to send message to Flask backend
    async function sendMessageToBackend(message) {
        try {
            showLoadingIndicator(); // Show loading indicator while waiting for backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            hideLoadingIndicator(); // Hide after receiving response from backend

            if (data.source === 'knowledge_base') {
                appendMessage('bot', data.response);
            } else if (data.source === 'llm_fallback_needed') {
                appendMessage('bot', data.response); // Display "Let me check with advanced AI" message
                await callGeminiAPI(message); // Then call Gemini API
            } else {
                appendMessage('bot', "An unexpected error occurred.");
            }
        } catch (error) {
            console.error('Error sending message to backend:', error);
            hideLoadingIndicator();
            appendMessage('bot', "Sorry, I'm having trouble connecting right now. Please try again later.");
        }
    }

    // Function to call Gemini 2.0 Flash API
    async function callGeminiAPI(prompt) {
        showLoadingIndicator(); // Show loading indicator while waiting for LLM
        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Leave this empty, Canvas will provide it at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            hideLoadingIndicator(); // Hide after receiving response from LLM

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                appendMessage('bot', text);
            } else {
                appendMessage('bot', "I'm sorry, I couldn't generate a response from the advanced AI. Please try rephrasing your question.");
                console.error("Unexpected LLM response structure:", result);
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            hideLoadingIndicator();
            appendMessage('bot', "I'm sorry, I encountered an error while trying to get a response from the advanced AI. Please try again.");
        }
    }

    // Event listener for send button click
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            appendMessage('user', message);
            sendMessageToBackend(message);
            userInput.value = ''; // Clear input field
        }
    });

    // Event listener for Enter key press in the input field
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click(); // Trigger send button click
        }
    });

    // Initial focus on the input field
    userInput.focus();
});
