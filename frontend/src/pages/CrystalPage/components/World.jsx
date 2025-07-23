/* CrystalPage/components/World.jsx */

import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

export const World = forwardRef((props, ref) => {
  const { nodes, materials } = props;
  return (
    <group {...props} dispose={null} ref={ref}>
      <group position={[0, -0.01, 0]} scale={[1, 0.331, 1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Landscape001_1.geometry}
          material={materials['Material.005']}
        />
        {/* The original water mesh (Landscape001_2) is now removed from here. */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Landscape001_3.geometry}
          material={materials['Material.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Landscape001_4.geometry}
          material={materials['Material.004']}
        />
      </group>
    </group>
  );
});

useGLTF.preload('/worldT1.glb');