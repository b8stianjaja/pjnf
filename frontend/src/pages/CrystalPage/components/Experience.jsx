/* CrystalPage/components/Experience.jsx */

import React, { Suspense, useRef, createContext } from 'react';
import { Select, useGLTF, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';
import { Physics, RigidBody, TrimeshCollider } from '@react-three/rapier';
import { Player } from './Player';
import { Camera } from './Camera';
import { World } from './World';
import { Ocean } from './Water'; // Import the custom water component

// Create a context to share refs between components without prop drilling
export const RefsContext = createContext();

export function Experience() {
  // Refs for key objects in the scene
  const playerRef = useRef();
  const characterRef = useRef();
  const worldRef = useRef();

  // Load the 3D model for the world
  const { nodes, materials } = useGLTF('/worldT1.glb');
  
  // Extract the geometry for the ground and water from the loaded model
  const groundMesh = nodes['Landscape001_1'];
  const waterGeometry = nodes.Landscape001_2.geometry;

  return (
    <RefsContext.Provider value={{ playerRef, characterRef, worldRef }}>
      <Camera />
      
      {/* A directional light to cast shadows and provide main illumination */}
      <directionalLight
        color="white"
        position={[-15, 25, 15]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Suspense provides a fallback while async assets like models are loading */}
      <Suspense fallback={null}>
        {/* Environment provides realistic ambient lighting and reflections from an HDR image */}
        <Environment files="/hdr.hdr" background blur={0.5} />
        
        {/* This group ensures the water plane is positioned and scaled correctly */}
        <group position={[0, -0.01, 0]} scale={[1, 0.331, 1]}>
          <Ocean waterGeometry={waterGeometry} />
        </group>
        
        {/* The static world geometry (without the original water plane) */}
        <World ref={worldRef} nodes={nodes} materials={materials} />

        {/* The physics world provided by Rapier */}
        <Physics>
          {/* Select enables post-processing effects like bloom on its children */}
          <Select>
            <Player ref={playerRef} characterRef={characterRef} />
          </Select>
          
          {/* Create a static, non-moving collider for the ground */}
          {groundMesh && (
            <RigidBody type="fixed" colliders={false}>
              <TrimeshCollider
                args={[
                  groundMesh.geometry.attributes.position.array,
                  groundMesh.geometry.index.array,
                ]}
              />
            </RigidBody>
          )}
        </Physics>
      </Suspense>

      {/* Post-processing effects for a more cinematic look */}
      <EffectComposer>
        {/* Bloom adds a glow effect to bright parts of the scene (in this case, the selected Player) */}
        <Bloom
          selection
          intensity={2.0}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.2}
          height={400}
        />
        {/* SMAA is a high-performance anti-aliasing effect */}
        <SMAA />
      </EffectComposer>
    </RefsContext.Provider>
  );
}