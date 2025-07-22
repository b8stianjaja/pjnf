import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import './InteractionScreen.css';

const animationImages = ['/menu/pab2.png', '/menu/pab3.png', '/menu/pab4.png'];
const sequence = [0, 1, 2, -1];

const InteractionScreen = () => {
  const { unlockAudio } = useMusic();
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const runAnimationStep = () => {
      const currentFrameValue = sequence[sequenceIndex];
      const delay = currentFrameValue === -1 ? 450 : 150;
      timeoutRef.current = setTimeout(() => {
        setSequenceIndex((prevIndex) => (prevIndex + 1) % sequence.length);
      }, delay);
    };
    runAnimationStep();
    return () => clearTimeout(timeoutRef.current);
  }, [sequenceIndex]);

  useEffect(() => {
    const handleInteraction = () => unlockAudio();
    const events = ['mousedown', 'keydown', 'scroll'];
    events.forEach((event) => document.addEventListener(event, handleInteraction, { once: true }));
    return () => {
      events.forEach((event) => document.removeEventListener(event, handleInteraction));
    };
  }, [unlockAudio]);

  const currentFrame = sequence[sequenceIndex];

  return (
    <div className="interaction-screen">
      <div className="interaction-content">
        {currentFrame !== -1 && (
          <img
            src={animationImages[currentFrame]}
            alt="Press any button to start"
            className="prompt-image"
          />
        )}
      </div>
    </div>
  );
};

export default InteractionScreen;