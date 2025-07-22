import React, { useState } from 'react';
import './DedicatedProjectRoom.css';
import { Paperclip, Send, Trash2 } from 'lucide-react';

function DedicatedProjectRoom({ project, isDarkMode }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Finalize vocal recordings', completed: false },
    { id: 2, text: 'Mix and master the track', completed: false },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alice', text: 'Hey, how is the mix coming along?' },
    { id: 2, user: 'Bob', text: 'Almost done, just tweaking the reverb.' },
  ]);
  const [files, setFiles] = useState([
      { id: 1, name: 'Main Vocals.wav' },
      { id: 2, name: 'Drum Loop.mp3' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: Date.now(), user: 'You', text: newMessage }]);
      setNewMessage('');
    }
  };

  const handleFileUpload = (event) => {
      const newFiles = Array.from(event.target.files).map(file => ({
          id: Date.now() + Math.random(),
          name: file.name
      }));
      setFiles([...files, ...newFiles]);
  };

  if (!project) {
    return <p>Select a project to get started.</p>;
  }

  return (
    <div className={`dedicated-project-room ${isDarkMode ? 'dark' : ''}`}>
      <header className="project-header">
        <h1>{project.title}</h1>
        <p>Genre: {project.genre}</p>
      </header>
      <div className="project-body">
        <div className="project-section">
          <h2>Tasks</h2>
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
                <span>{task.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="project-section">
            <h2>Files</h2>
            <ul className="file-list">
                {files.map(file => (
                    <li key={file.id}>
                        <Paperclip size={16} />
                        <span>{file.name}</span>
                        <button className="delete-file-btn"><Trash2 size={14} /></button>
                    </li>
                ))}
            </ul>
            <div className="file-upload">
                <input type="file" id="file-upload" multiple onChange={handleFileUpload} />
                <label htmlFor="file-upload">Upload Files</label>
            </div>
        </div>


        <div className="project-section chat-section">
          <h2>Live Chat</h2>
          <div className="chat-box">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.user === 'You' ? 'sent' : 'received'}`}>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}><Send size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DedicatedProjectRoom;