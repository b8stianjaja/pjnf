import React, { useState, useEffect, useCallback, useRef } from 'react';

const ChatPanel = () => {
    const [messages, setMessages] = useState([{ from: 'admin', text: 'Welcome! How can I assist you today?' }]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = useCallback(() => {
        if (inputValue.trim() === '') return;
        setMessages(prev => [...prev, { from: 'user', text: inputValue }]);
        setInputValue('');
        setTimeout(() => {
            setMessages(prev => [...prev, { from: 'admin', text: 'Thank you for your message. I am looking into it.' }]);
        }, 1200);
    }, [inputValue]);

    return (
        <div className="content-panel active" id="chat-panel">
            <div className="content-header"><h1>Admin Chat</h1><span className="status-indicator"></span></div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.from} animated`}><p>{msg.text}</p></div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input-area">
                <input type="text" placeholder="Type a message..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                <button className="send-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatPanel;