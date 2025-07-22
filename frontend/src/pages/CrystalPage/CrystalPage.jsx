import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
// Import the correct CSS file as requested
import './CrystalPage.css';

export default function CrystalPage() {
  return (
    // Restore the div structure to match the provided CSS
    <div className="crystal-page-container">
      <div className="crystal-canvas-container">
        <Canvas
          shadows
          // Set an initial camera position here to prevent the glitch at the start.
          camera={{ position: [0, 5, 15], fov: 10 }}
        >
          {/* The background color is handled by the CSS, but this is a good fallback */}
          <color attach="background" args={['#101010']} />
          <Experience />
        </Canvas>
      </div>
    </div>
  );
}
