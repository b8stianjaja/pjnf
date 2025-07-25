import React from 'react';
import './Menu.css';
import ChatPanel from './panels/ChatPanel';
import FilesPanel from './panels/FilesPanel';
import MusicPanel from './panels/MusicPanel';

const FileIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>);
const MusicIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>);
const UserIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);

const Menu = ({ onFileUpload, onCloseMenu, activeTab, onTabChange, autoFocusChatTrigger }) => {
  return (
    <div className="menu-overlay"><div className="menu-container">
        <div className="menu-sidebar">
          <div className="sidebar-header"><div className="sidebar-logo">C</div></div>
          <nav className="sidebar-nav">
            <button className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`} title="Chat" onClick={() => onTabChange('chat')}><UserIcon /></button>
            <button className={`nav-button ${activeTab === 'files' ? 'active' : ''}`} title="File Transfers" onClick={() => onTabChange('files')}><FileIcon /></button>
            <button className={`nav-button ${activeTab === 'music' ? 'active' : ''}`} title="Music Player" onClick={() => onTabChange('music')}><MusicIcon /></button>
          </nav>
          <div className="sidebar-footer"><button className="close-button" onClick={onCloseMenu}>×</button></div>
        </div>
        <div className="menu-main-content">
          {activeTab === 'chat' && <ChatPanel shouldFocusTrigger={autoFocusChatTrigger} />}
          {activeTab === 'files' && <FilesPanel onFileUpload={onFileUpload} />}
          {activeTab === 'music' && <MusicPanel />}
        </div>
    </div></div>
  );
};

export default Menu;