import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/scene/Experience';
import Menu from './components/menu/Menu';
import './CrystalPage.css';

export default function CrystalPage() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatFocusTrigger, setChatFocusTrigger] = useState(0);

  const handleToggleMenu = useCallback(() => {
    setMenuVisible((prev) => !prev);
  }, []);

  const handleOpenMenu = useCallback((tab) => {
    setActiveTab(tab);
    setMenuVisible(true);
    if (tab === 'chat') {
      setChatFocusTrigger(c => c + 1);
    }
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // If typing in any input, the global listener does nothing.
      if (document.activeElement?.tagName === 'INPUT') {
        return;
      }

      const keyLower = e.key.toLowerCase();

      // --- Spacebar Logic ---
      if (keyLower === ' ') {
        e.preventDefault();
        if (isMenuVisible) {
            // If menu is open, spacebar closes it (unless on chat tab).
            handleToggleMenu();
        } else {
            // If menu is closed, spacebar opens it directly to chat.
            handleOpenMenu('chat');
        }
      } 
      // --- Enter Key Logic ---
      else if (keyLower === 'enter') {
        e.preventDefault();
        if (isMenuVisible) {
          handleToggleMenu();
        } else {
          // Re-open to the last active tab.
          handleOpenMenu(activeTab);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isMenuVisible, activeTab, handleToggleMenu, handleOpenMenu]);

  return (
    <div className="crystal-page-container">
      <div className="crystal-canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 5, 15], fov: 10 }}
          dpr={[1, 1]}
          linear
          flat
          legacy
        >
          <color attach="background" args={['#101010']} />
          <Experience
            isMenuVisible={isMenuVisible}
            onToggleMenu={handleToggleMenu}
          />
        </Canvas>
      </div>

      {isMenuVisible && (
        <Menu 
          onFileUpload={() => alert('File upload functionality coming soon!')} 
          onCloseMenu={handleToggleMenu}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          autoFocusChatTrigger={chatFocusTrigger}
        />
      )}
    </div>
  );
}