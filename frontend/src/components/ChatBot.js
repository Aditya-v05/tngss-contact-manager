import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css'; // We'll create this next

// Pixelated Chat icon (as an SVG component)
const ChatIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 4H20V16H13.6L10.4 20.8L7.2 16H4V4ZM6 6V14H8V17.2L10.4 14H18V6H6Z" fill="#FFFF00"/>
  </svg>
);

const Chatbot = ({ allContacts }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Bit online! Ask me about your contacts or for advice.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // In frontend/src/components/Chatbot.js

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        const newMessages = [...messages, { role: 'user', content: userMessage }];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare data for the API
            const contactsJSON = JSON.stringify(allContacts);
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            }));

            // --- THIS IS THE NEW PART ---
            // Call our Vercel function as a standard API endpoint
            const response = await fetch('/api/askChatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    history: history,
                    userMessage: userMessage,
                    contactsJSON: contactsJSON
                }),
            });
            // --- END OF NEW PART ---

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const result = await response.json();

            // Add AI response
            setMessages([...newMessages, { role: 'model', content: result.text }]);
        } catch (error) {
            console.error("Error calling chatbot:", error);
            setMessages([...newMessages, { role: 'model', content: "Error: I cannot compute that request!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span className="chat-title">Chat With Bit</span>
                        <button onClick={() => setIsOpen(false)} className="chat-close-btn">X</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role}`}>
                                <p>{msg.content}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message model">
                                <p>Computing...</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className="chat-input-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about contacts..."
                            disabled={isLoading}
                            className="chat-input"
                        />
                        <button type="submit" disabled={isLoading} className="chat-send-btn">
                            Send
                        </button>
                    </form>
                </div>
            )}

            {/* Chat Bubble */}
            <button onClick={() => setIsOpen(true)} className="chat-bubble">
                <ChatIcon />
            </button>
        </div>
    );
};

export default Chatbot;