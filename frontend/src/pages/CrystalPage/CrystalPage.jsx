/* CrystalPage/CrystalPage.jsx */

import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import Menu from './components/Menu';
import './CrystalPage.css';

export default function CrystalPage() {
  const [isMenuVisible, setMenuVisible] = useState(false);

  // This callback is passed to components so they can close the menu.
  const handleToggleMenu = useCallback(() => {
    setMenuVisible((prev) => !prev);
  }, []);

  const handleFileUpload = useCallback(() => alert('File upload functionality coming soon!'), []);

  // This is the corrected keyboard listener.
  // It's a more robust pattern that directly updates the state.
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const keyLower = e.key.toLowerCase();
      // We only listen for 'Enter' and 'Space' to toggle the menu.
      if (keyLower === 'enter' || keyLower === ' ') {
        e.preventDefault();
        // This directly toggles the state, which is more reliable.
        setMenuVisible((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []); // This effect runs only once, with no dependencies.

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
            onFileUpload={handleFileUpload}
          />
        </Canvas>
      </div>

      {isMenuVisible && (
        <Menu onFileUpload={handleFileUpload} onCloseMenu={handleToggleMenu} />
      )}
    </div>
  );
}