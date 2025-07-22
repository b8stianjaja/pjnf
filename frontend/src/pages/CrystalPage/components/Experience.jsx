import React, { Suspense, useRef } from 'react';
import { Select } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'; 
import { Player } from './Player';
import { Camera } from './Camera';

export function Experience() {
  const playerRef = useRef();
  const characterRef = useRef();
  const roomRef = useRef();

  // --- FIX: Set this to true when you add your room.glb file ---
  const loadRoom = false;

  return (
    <>
      <Camera playerRef={playerRef} characterRef={characterRef} roomRef={roomRef} />
      
      <ambientLight intensity={0.1} />
      <directionalLight
        color="white"
        position={[-15, 25, 15]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <Suspense fallback={null}>
        {/* Conditionally render the visual room model */}
        {loadRoom && <Room ref={roomRef} />}

        <Physics>
          <Select>
            <Player ref={playerRef} characterRef={characterRef} />
          </Select>
          
          {/* Conditionally render the room's colliders */}
          {loadRoom && (
            <RigidBody type="fixed">
              <CuboidCollider args={[20, 0.1, 20]} position={[0, -0.1, 0]} />
              <CuboidCollider args={[20, 5, 0.1]} position={[0, 2.5, -10]} />
              <CuboidCollider args={[0.1, 5, 20]} position={[10, 2.5, 0]} />
            </RigidBody>
          )}

          {/* If not loading the room, render a simple floor for testing */}
          {!loadRoom && (
            <RigidBody type="fixed">
              <CuboidCollider args={[20, 0.1, 20]} position={[0, -0.1, 0]} />
            </RigidBody>
          )}

        </Physics>
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={2.0}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.2}
          height={400}
          selection
        />
      </EffectComposer>
    </>
  );
}