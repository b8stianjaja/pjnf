/* CrystalPage/components/Menu.jsx */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Menu.css';

// --- Icon Components ---
const FileIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>);
const MusicIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>);
const UserIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const ModelIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 7l10 4 10-4-10-4z"></path><path d="M2 17l10 4 10-4"></path><path d="M2 12l10 4 10-4"></path></svg>);
const ImageIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const UploadIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>);

// --- Child Components for Clarity ---
const ChatPanel = () => { /* This component remains unchanged */
    const [messages, setMessages] = useState([{ from: 'admin', text: 'Welcome! How can I assist you today?' }]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = React.useRef(null);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    const handleSendMessage = useCallback(() => {
        if (inputValue.trim() === '') return;
        setMessages(prev => [...prev, { from: 'user', text: inputValue }]);
        setInputValue('');
        setTimeout(() => setMessages(prev => [...prev, { from: 'admin', text: 'Thank you. I am looking into your request.' }]), 1200);
    }, [inputValue]);
    return (
        <div className="content-panel active" id="chat-panel">
            <div className="content-header"><h1>Admin Chat</h1><span className="status-indicator"></span></div>
            <div className="chat-window">
                {messages.map((msg, index) => <div key={index} className={`chat-message ${msg.from} animated`}><p>{msg.text}</p></div>)}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input-area">
                <input type="text" placeholder="Type a message..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                <button className="send-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

const FileItem = ({ file, isSelected, onSelect }) => { /* This component remains unchanged */
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const handleDownload = (e) => {
        e.stopPropagation();
        if (isDownloading) return;
        setIsDownloading(true);
        const interval = setInterval(() => setDownloadProgress(p => p >= 100 ? (clearInterval(interval), setIsDownloading(false), 100) : p + 2), 50);
    };
    const getFileIcon = (type) => ({ model: <ModelIcon />, image: <ImageIcon /> }[type] || <FileIcon />);
    return (
        <div className={`file-item ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
            <div className="file-icon-container">{getFileIcon(file.type)}</div>
            <div className="file-details"><span className="file-name">{file.name}</span><span className="file-meta">{file.size} MB</span></div>
            <div className="file-action">{isDownloading ? <div className="download-progress-container"><div className="download-progress-bar" style={{ width: `${downloadProgress}%` }}></div><span>{downloadProgress}%</span></div> : <button onClick={handleDownload}>Download</button>}</div>
        </div>
    );
};

const FilesPanel = ({ onFileUpload }) => { // This component has been enhanced
    const initialFiles = useMemo(() => [
        { name: 'worldT1.glb', type: 'model', size: 12.8, date: '2025-07-22' },
        { name: 'hdr.hdr', type: 'image', size: 5.1, date: '2025-07-21' },
        { name: 'character0.glb', type: 'model', size: 8.4, date: '2025-07-20' },
        { name: 'texture_map.png', type: 'image', size: 2.3, date: '2025-07-19' },
    ], []);
    const [files, setFiles] = useState(initialFiles);
    const [selectedFile, setSelectedFile] = useState(initialFiles[0]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (filter === 'all') {
            setFiles(initialFiles);
        } else {
            setFiles(initialFiles.filter(f => f.type === filter));
        }
    }, [filter, initialFiles]);

    const totalSize = useMemo(() => initialFiles.reduce((acc, f) => acc + f.size, 0).toFixed(1), [initialFiles]);
    const storagePercent = useMemo(() => (totalSize / 5000) * 100, [totalSize]);

    return (
        <div className="content-panel active" id="files-panel">
            <div className="files-main-area">
                <div className="files-left-column">
                    <div className="content-header"><h1>File Transfers</h1></div>
                    <div className="storage-overview"><div className="storage-bar"><div className="storage-used" style={{width: `${storagePercent}%`}}></div></div><div className="storage-text"><span>{totalSize} MB of 5 GB Used</span></div></div>
                    <div className="file-controls">
                        <div className="file-filters">
                            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                            <button className={filter === 'model' ? 'active' : ''} onClick={() => setFilter('model')}>Models</button>
                            <button className={filter === 'image' ? 'active' : ''} onClick={() => setFilter('image')}>Images</button>
                        </div>
                    </div>
                    <div className="file-list">{files.map((file, i) => <FileItem key={i} file={file} isSelected={selectedFile?.name === file.name} onSelect={() => setSelectedFile(file)} />)}</div>
                </div>
                {selectedFile && 
                    <div className="file-details-panel">
                        <div className="details-preview-icon">{selectedFile.type === 'model' ? <ModelIcon /> : <ImageIcon />}</div>
                        <h2>{selectedFile.name}</h2>
                        <div className="details-meta-grid">
                            <div className="meta-item"><span>Size</span><p>{selectedFile.size} MB</p></div>
                            <div className="meta-item"><span>Type</span><p>{selectedFile.type}</p></div>
                            <div className="meta-item"><span>Modified</span><p>{selectedFile.date}</p></div>
                        </div>
                        <button className="upload-button share-button" onClick={() => alert('Sharing options coming soon!')}>Share File</button>
                    </div>
                }
            </div>
             <div className="upload-area">
                <div className="dropzone">
                    <UploadIcon/>
                    <p>Drag & Drop files here or <span>Browse Files</span></p>
                    <input type="file" onChange={onFileUpload} />
                </div>
            </div>
        </div>
    );
};

const MusicPanel = () => { /* This component remains unchanged */
    const song = { title: 'Starlight Voyage', artist: 'Cosmic Echoes', duration: 212 };
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => setCurrentTime(t => t >= song.duration ? (setIsPlaying(false), 0) : t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, song.duration]);
    const formatTime = (time) => `${Math.floor(time/60)}:${Math.floor(time%60).toString().padStart(2,'0')}`;
    return (
        <div className="content-panel active" id="music-panel">
            <div className="content-header"><h1>Music Player</h1></div>
            <div className="music-player">
                <div className="album-art"></div><div className="song-info"><h2>{song.title}</h2><span>{song.artist}</span></div>
                <div className="progress-bar-container"><span>{formatTime(currentTime)}</span><div className="progress-bar"><div className="progress" style={{width: `${(currentTime/song.duration)*100}%`}}></div></div><span>{formatTime(song.duration)}</span></div>
                <div className="music-controls"><button>&#9664;&#9664;</button><button className="play-button" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? '❚❚' : '▶'}</button><button>&#9654;&#9654;</button></div>
            </div>
        </div>
    );
};

const Menu = ({ onFileUpload, onCloseMenu }) => { /* This component remains unchanged */
  const [activeTab, setActiveTab] = useState('chat');
  return (
    <div className="menu-overlay"><div className="menu-container">
        <div className="menu-sidebar">
          <div className="sidebar-header"><div className="sidebar-logo">C</div></div>
          <nav className="sidebar-nav">
            <button className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`} title="Chat" onClick={() => setActiveTab('chat')}><UserIcon /></button>
            <button className={`nav-button ${activeTab === 'files' ? 'active' : ''}`} title="File Transfers" onClick={() => setActiveTab('files')}><FileIcon /></button>
            <button className={`nav-button ${activeTab === 'music' ? 'active' : ''}`} title="Music Player" onClick={() => setActiveTab('music')}><MusicIcon /></button>
          </nav>
          <div className="sidebar-footer"><button className="close-button" onClick={onCloseMenu}>×</button></div>
        </div>
        <div className="menu-main-content">
          {activeTab === 'chat' && <ChatPanel />}
          {activeTab === 'files' && <FilesPanel onFileUpload={onFileUpload} />}
          {activeTab === 'music' && <MusicPanel />}
        </div>
    </div></div>
  );
};
export default Menu;