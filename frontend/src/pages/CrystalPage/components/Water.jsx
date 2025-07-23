/* CrystalPage/components/Water.jsx */

import React, { useRef, useMemo } from 'react';
import { extend, useThree, useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

extend({ Water });

export function Ocean({ waterGeometry, sunDirection }) { // Accept sunDirection as a prop
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpg');
  const { scene } = useThree();
  
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: sunDirection || new THREE.Vector3(), // Use the passed sunDirection
      sunColor: 0xffffff,
      waterColor: 0x006688, // A more realistic blue/cyan color
      distortionScale: 3.7,
      fog: scene.fog !== undefined, // Enable fog if it's present in the scene
      format: gl.encoding,
    }),
    [waterNormals, sunDirection, scene.fog, gl.encoding]
  );

  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta * 0.5));

  return <water ref={ref} args={[waterGeometry, config]} />;
}