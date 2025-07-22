import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useInput } from '../hooks/useInput';

const MOVE_SPEED = 3;
const ROTATION_SPEED = 4;
const ANIMATION_SPEED_FACTOR = 0.8;
const SMOOTH_TIME = 0.1;
const CHARACTER_SCALE = 40;

export const Player = forwardRef(({ characterRef }, ref) => {
  const playerRef = ref;
  
  const { input, handleGamepad } = useInput();

  const { scene, animations } = useGLTF('/character0.glb');
  const { actions } = useAnimations(animations, characterRef);
  const [currentAnimation, setCurrentAnimation] = useState('Idle');
  
  const velocity = useRef(new THREE.Vector3());
  const rotationSpeed = useRef(0);

  const colliderRadius = 0.4 * CHARACTER_SCALE;
  const colliderHeight = 1.8 * CHARACTER_SCALE;

  useEffect(() => {
    const walkAction = actions['Walk'];
    const walkBackAction = actions['WalkBack'];
    if (walkAction) walkAction.timeScale = ANIMATION_SPEED_FACTOR;
    if (walkBackAction) walkBackAction.timeScale = ANIMATION_SPEED_FACTOR;
    
    actions['Idle']?.play();
    
    const glowColor = new THREE.Color('white');
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.material.emissive = glowColor;
        child.material.emissiveIntensity = 2.5;
        child.material.roughness = 0.4;
        child.material.metalness = 0.1;
      }
    });
  }, [actions, scene]);

  useFrame((state, delta) => {
    handleGamepad();
    
    const player = playerRef.current;
    if (!player) return;

    const { forward, backward, left, right } = input.current;

    let targetRotationSpeed = 0;
    if (left) targetRotationSpeed += ROTATION_SPEED;
    if (right) targetRotationSpeed -= ROTATION_SPEED;

    rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, targetRotationSpeed, delta / SMOOTH_TIME);
    characterRef.current.rotation.y += rotationSpeed.current * delta;

    const moveDirection = new THREE.Vector3();
    if (forward) moveDirection.z = -1;
    if (backward) moveDirection.z = 1;
    moveDirection.applyQuaternion(characterRef.current.quaternion);
    
    const targetVelocity = moveDirection.multiplyScalar(MOVE_SPEED);
    velocity.current.lerp(targetVelocity, delta / SMOOTH_TIME);

    const currentPos = player.translation();
    player.setNextKinematicTranslation({
      x: currentPos.x + velocity.current.x * delta,
      y: currentPos.y,
      z: currentPos.z + velocity.current.z * delta,
    });
    
    const isMoving = forward || backward;
    let nextAnimation = 'Idle';
    if (isMoving) {
        nextAnimation = forward ? 'Walk' : 'WalkBack';
    }

    if (nextAnimation !== currentAnimation) {
      const oldAction = actions[currentAnimation];
      const newAction = actions[nextAnimation];
      oldAction?.fadeOut(0.2);
      newAction?.reset().fadeIn(0.2).play();
      setCurrentAnimation(nextAnimation);
    }
  });

  return (
    <RigidBody ref={playerRef} type="kinematicPosition" colliders={false} mass={1} position={[0, 0, 0]}>
      <CapsuleCollider 
        args={[colliderRadius, colliderHeight]} 
        position={[0, colliderHeight / 2 + colliderRadius, 0]} 
      />
      <group ref={characterRef} position={[0, 0, 0]}>
        <group rotation={[0, Math.PI / 2, 0]}>
          <primitive object={scene} scale={CHARACTER_SCALE} />
        </group>
      </group>
    </RigidBody>
  );
});