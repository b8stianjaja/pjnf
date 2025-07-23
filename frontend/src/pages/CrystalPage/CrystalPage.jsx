/* CrystalPage/CrystalPage.jsx */

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import './CrystalPage.css';

export default function CrystalPage() {
  return (
    <div className="crystal-page-container">
      <div className="crystal-canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 5, 15], fov: 10 }}
          // **PERFORMANCE ENHANCEMENT**: Clamp DPR to 1.
          dpr={[1, 1]}
          // **PERFORMANCE ENHANCEMENT**: Disable default MSAA.
          // We will use a faster post-processing AA effect instead.
          linear
          flat
          legacy
        >
          <color attach="background" args={['#101010']} />
          <Experience />
        </Canvas>
      </div>
    </div>
  );
}