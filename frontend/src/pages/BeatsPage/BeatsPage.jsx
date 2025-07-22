// frontend/src/pages/BeatsPage/BeatsPage.jsx

import React, { useState, useEffect } from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import BeatListItem from '../../entities/beat/BeatListItem';
import './BeatsPage.css';

const Scene = ({ isLoaded, showArtwork }) => {
  const { currentBeat } = useMusic();
  return (
    <div className="scene-container">
      <div className={`sprite-layer ${isLoaded ? 'loaded' : ''}`}></div>
      {showArtwork && currentBeat && (
        <div className={`artwork-holder ${isLoaded ? 'loaded' : ''}`}>
          <img src={currentBeat.artwork} alt={currentBeat.title} className="artwork-image" />
        </div>
      )}
    </div>
  );
};

const DialogueBox = ({ beats, onBeatSelect, onAddToCart, isLoaded, cartItemCount, onManifestClick }) => {
  return (
    <div className={`dialogue-wrapper ${isLoaded ? 'loaded' : ''}`}>
      <div className="header-container">
        <div className="dialogue-header">✧✧✧✧✧✧✧✧✧✧</div>
        <div className={`manifest-tab ${cartItemCount > 0 ? 'glowing' : ''}`} onClick={onManifestClick}>
          Manifest ({cartItemCount})
        </div>
      </div>
      <div className="dialogue-container">
        <div className="dialogue-content-wrapper">
          <img src="/images/ornament.png" alt="dialogue ornament" className="dialogue-ornament" />
          <div className="dialogue-list">
            {beats.map(beat => (
              <BeatListItem
                key={beat.id}
                beat={beat}
                onPlay={() => onBeatSelect(beat)}
                onAddToCart={() => onAddToCart(beat)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


function BeatsPage() {
  const [beatData, setBeatData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { playBeat } = useMusic();
  const { cartItems, addToCart } = useCart();
  const [showArtwork, setShowArtwork] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/beats')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Backend responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setBeatData(data);
        const timer = setTimeout(() => {
          setIsLoaded(true);
        }, 50);
        return () => clearTimeout(timer);
      })
      .catch(error => {
        console.error("Critical error fetching beats:", error);
        setIsLoaded(true);
      });
  }, []);

  const handleBeatSelect = (beat) => {
    playBeat(beat);
  };

  const handleAddToCart = (beat) => {
    addToCart(beat);
    setFeedback(`Added "${beat.title}" to manifest!`);
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div className="beats-page-layout">
      {feedback && <div className="feedback-toast">{feedback}</div>}

      <Scene isLoaded={isLoaded} showArtwork={showArtwork} />
      <DialogueBox
        beats={beatData}
        onBeatSelect={handleBeatSelect}
        onAddToCart={handleAddToCart}
        isLoaded={isLoaded}
        cartItemCount={cartItems.length}
        // This is the updated line:
        onManifestClick={() => navigate('/crystal')}
      />
    </div>
  );
}

export default BeatsPage;