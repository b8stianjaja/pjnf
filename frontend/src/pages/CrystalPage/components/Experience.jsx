/* CrystalPage/components/Experience.jsx */

import React, { Suspense, useRef, createContext, useState } from 'react';
import { Select, useGLTF, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';
import { Physics, RigidBody, TrimeshCollider } from '@react-three/rapier';
import { Player } from './Player';
import { Camera } from './Camera';
import { World } from './World';
import { Ocean } from './Water';
import { MenuTrigger } from './MenuTrigger';

export const RefsContext = createContext();

export function Experience({ isMenuVisible, onToggleMenu, onFileUpload, onChat }) {
  const playerRef = useRef();
  const characterRef = useRef();
  const worldRef = useRef();

  const handlePlayerIntersection = (isIntersecting) => {
    if (isIntersecting && !isMenuVisible) {
      onToggleMenu();
    }
  };

  const { nodes, materials } = useGLTF('/worldT1.glb');
  const groundMesh = nodes['Landscape001_1'];
  const waterGeometry = nodes.Landscape001_2.geometry;

  return (
    <RefsContext.Provider value={{ playerRef, characterRef, worldRef }}>
      <Camera />
      <directionalLight
        color="white"
        position={[-15, 25, 15]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Suspense fallback={null}>
        <Environment files="/hdr.hdr" background blur={0.5} />
        <group position={[0, -0.01, 0]} scale={[1, 0.331, 1]}>
          <Ocean waterGeometry={waterGeometry} />
        </group>
        <World ref={worldRef} nodes={nodes} materials={materials} />
        <Physics>
          <Select>
            <Player
              ref={playerRef}
              characterRef={characterRef}
              onToggleMenu={onToggleMenu}
            />
          </Select>

          {groundMesh && (
            <RigidBody
              type="fixed"
              colliders={false}
              position={[0, -0.01, 0]}
              scale={[1, 0.331, 1]}
            >
              <TrimeshCollider
                args={[
                  groundMesh.geometry.attributes.position.array,
                  groundMesh.geometry.index.array,
                ]}
              />
            </RigidBody>
          )}

          <MenuTrigger
            onPlayerIntersect={handlePlayerIntersection}
            position={[-2, -0.45, -6.5]}
            rotation-x={-Math.PI / 2}
            scale={[15, 10, 1]}
          />
        </Physics>
      </Suspense>
      <EffectComposer>
        <Bloom
          selection
          intensity={2.0}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.2}
          height={400}
        />
        <SMAA />
      </EffectComposer>
    </RefsContext.Provider>
  );
}