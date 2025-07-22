import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { useMusic } from '../context/MusicContext';

// Import the new Transition component
import Transition from '../Transition/Transition';

import InteractionScreen from '../pages/InteractionScreen/InteractionScreen';
import HomePage from '../pages/HomePage/HomePage';
import BeatsPage from '../pages/BeatsPage/BeatsPage';
import CrystalPage from '../pages/CrystalPage/CrystalPage';
import CollaborationHub from '../pages/CollaborationHub/CollaborationHub';
import AdminPage from '../pages/AdminPage/AdminPage';

function App() {
  const { isUnlocked } = useMusic();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // This function will be passed to HomePage to trigger the transition
  const handleNavigate = (path) => {
    setIsTransitioning(true); // Start fade-out

    // Wait for the fade-out to finish before changing the page
    setTimeout(() => {
      navigate(path);
      // Briefly wait for the new page to render, then start fade-in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 1500); // This duration must match the CSS transition time
  };

  return (
    <>
      {!isUnlocked && <InteractionScreen />}
      {/* Render the Transition component here, so it's always available */}
      <Transition isTransitioning={isTransitioning} />
      <div
        className="app-container"
        style={{ visibility: isUnlocked ? 'visible' : 'hidden' }}
      >
        <Routes>
          {/* Pass the navigation handler to HomePage */}
          <Route
            path="/"
            element={<HomePage onNavigate={handleNavigate} />}
          />
          <Route path="/beats" element={<BeatsPage />} />
          <Route path="/crystal" element={<CrystalPage />} />
          <Route path="/hub" element={<CollaborationHub />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;