// frontend/src/context/MusicContext.jsx

import React, { createContext, useContext, useState, useRef } from 'react';
import { Howl } from 'howler';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentBeat, setCurrentBeat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const soundRef = useRef(null);

  const playBeat = (beat) => {
    // Stop any currently playing sound before starting a new one
    if (soundRef.current) {
      soundRef.current.stop();
    }

    // --- THIS IS THE FIX ---
    // 1. Check if the beat object and its audioSrc property exist and are valid strings.
    if (beat && typeof beat.audioSrc === 'string') {
      const sound = new Howl({
        src: [beat.audioSrc], // Use the path directly as Vite serves from the public folder
        html5: true, // Often helps with compatibility
        onplay: () => {
          setIsPlaying(true);
          setCurrentBeat(beat);
        },
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
        onloaderror: (id, err) => {
          console.error('Howler load error:', id, err);
        },
        onplayerror: (id, err) => {
            console.error('Howler play error:', id, err);
            // Attempt to unlock audio context after a user gesture
            if (Howler.ctx && Howler.ctx.state !== 'running') {
                Howler.ctx.resume();
            }
        }
      });

      sound.play();
      soundRef.current = sound;
    } else {
      // 2. Log an error if the audio source is invalid. This helps in debugging.
      console.error('Invalid audio source provided to playBeat:', beat);
    }
  };

  const unlockAudio = () => {
    // This function is for interacting with the browser's autoplay policy
    if (Howler.ctx && Howler.ctx.state !== 'running') {
      Howler.ctx.resume().then(() => {
        setIsUnlocked(true);
      });
    } else {
      setIsUnlocked(true);
    }
  };

  const value = {
    currentBeat,
    isPlaying,
    isUnlocked,
    playBeat,
    unlockAudio
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};