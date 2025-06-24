import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        {
            text: "Hi! I'm your vegan meal assistant. How can I help you today?",
            isBot: true
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            setMessages(prev => [...prev, { text: data.response, isBot: true }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                text: "Sorry, I had trouble responding. Please try again.",
                isBot: true,
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isMinimized) {
        return (
            <div className="chat-minimized">
                <button 
                    className="chat-toggle-button"
                    onClick={() => setIsMinimized(false)}
                >
                    <span>Chat with Vegan Assistant</span>
                </button>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Vegan Assistant</h3>
                <button 
                    className="close-button"
                    onClick={() => setIsMinimized(true)}
                >×</button>
            </div>
            
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.isBot ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}>
                        <div className="message-content">
                            {message.isBot && <span className="bot-icon">🥬</span>}
                            {message.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot">
                        <div className="message-content">
                            <span className="bot-icon">🥬</span>
                            <span className="typing-indicator">...</span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !inputMessage.trim()}>
                    <span className="send-icon">➤</span>
                </button>
            </form>
        </div>
    );
};

export default ChatBot; 