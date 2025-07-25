import React, { useState, useEffect, useCallback, useRef } from 'react';

const SendIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const ChatPanel = ({ shouldFocusTrigger }) => {
    const [messages, setMessages] = useState([{ from: 'admin', text: 'Welcome! How can I assist you today?' }]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // This effect runs only when the focus trigger from the parent changes.
    useEffect(() => {
        if (shouldFocusTrigger > 0) {
            inputRef.current?.focus();
        }
    }, [shouldFocusTrigger]);

    const handleSendMessage = useCallback(() => {
        if (inputValue.trim() === '') return;
        setMessages(prev => [...prev, { from: 'user', text: inputValue }]);
        setInputValue('');
        // This is key: after sending, the input loses focus.
        inputRef.current?.blur(); 
        
        setTimeout(() => {
            setMessages(prev => [...prev, { from: 'admin', text: 'Thank you. I am looking into your request.' }]);
        }, 1200);
    }, [inputValue]);

    return (
        <div className="content-panel active" id="chat-panel">
            <div className="content-header">
                <h1>♫ 𓂃 ☼ 𓂃 ♫</h1>
                <span className="status-indicator"></span>
            </div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.from}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input-area">
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Type a message..." 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()} 
                />
                <button className="send-button" onClick={handleSendMessage} aria-label="Send Message">
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;