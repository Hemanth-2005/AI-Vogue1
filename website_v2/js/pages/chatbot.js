/**
 * AI Vogue Fashion Assistant Chatbot
 * Handles skincare, outfit ideas, styling, and hair suggestions via Gemini API via Pipedream
 */

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const typingIndicator = document.getElementById('typingIndicator');

    if (!chatMessages || !userInput || !sendButton || !typingIndicator) {
        console.error('Required chat elements not found in the DOM');
        return;
    }

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    function handleUserInput() {
        const message = userInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        userInput.value = '';
        userInput.focus();
        showTypingIndicator();

        sendButton.disabled = true;
        sendButton.innerText = 'Sending...';

        processUserMessage(message)
            .then(({ suggestion, reason }) => {
                hideTypingIndicator();
                addAIMessage(suggestion || 'Hmm... I need more info to answer that.', reason || 'No specific reason provided.');
            })
            .catch((error) => {
                console.error('Error:', error);
                hideTypingIndicator();
                addAIMessage(
                    'Sorry, something went wrong.',
                    'It looks like the server couldn’t process your request. Please try again shortly.'
                );
            })
            .finally(() => {
                sendButton.disabled = false;
                sendButton.innerText = 'Send';
            });
    }

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-user';
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${escapeHTML(message)}</div>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function addAIMessage(suggestion, reason) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-ai';
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-header"><span>AI Fashion Assistant</span></div>
                <div class="message-text">
                    <div class="suggestion-title">AI Suggestion</div>
                    <p>${escapeHTML(suggestion)}</p>
                    <div class="reason-title">Reason Behind Suggestion</div>
                    <p>${escapeHTML(reason)}</p>
                </div>
                <div class="powered-by" style="position: absolute; bottom: 5px; right: 10px; font-size: 0.8rem; color: #666;">Powered by Gemini</div>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    function showTypingIndicator() {
        typingIndicator.classList.add('active');
    }

    function hideTypingIndicator() {
        typingIndicator.classList.remove('active');
    }

    async function processUserMessage(message) {
        const prompt = `
    You are an AI Fashion and Skincare Expert. Only answer queries related to:
    - Outfit and dressing suggestions
    - Skincare tips based on skin type or weather
    - Styling advice for different occasions
    - Haircut suggestions based on face shape
    - Sustainable fashion and wellness
    
    Always respond in this format:
    - Suggestion: A detailed recommendation
    - Reason: Why this suggestion suits the user’s context
    
    Do NOT respond to unrelated topics.
    
    Now answer this: "${message}"
        `.trim();
    
        try {
            const response = await fetch('https://eo1pbh4mi5dfhdl.m.pipedream.net', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt })
            });
    
            if (!response.ok) throw new Error('Pipedream Gemini API error');
    
            // Log response status and content type to inspect
            const contentType = response.headers.get('Content-Type');
            console.log('Response Content-Type:', contentType);
    
            const text = await response.text(); // Read the response as text first
            console.log('Response Text:', text); // Log raw response
    
            // Check if the response is JSON
            if (contentType && contentType.includes('application/json')) {
                try {
                    const data = JSON.parse(text); // Only parse if it's JSON
                    console.log("Received from Pipedream:", data);
                    
                    // Check if the structure matches expectations
                    if (data.suggestion && data.reason) {
                        return {
                            suggestion: data.suggestion,
                            reason: data.reason
                        };
                    } else {
                        throw new Error('Invalid response structure from Pipedream');
                    }
                } catch (parseError) {
                    console.error('Error parsing JSON from Pipedream:', parseError);
                    throw new Error('Invalid JSON format from Pipedream');
                }
            } else {
                throw new Error('Received non-JSON response from Pipedream');
            }
        } catch (error) {
            console.error('Error calling Gemini API via Pipedream:', error);
            throw error;
        }
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
