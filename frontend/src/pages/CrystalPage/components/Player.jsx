/* CrystalPage/components/Player.jsx */

import React, { useRef, useEffect, forwardRef, useCallback } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useInput } from '../hooks/useInput';

const MOVE_SPEED = 0.15;
const ROTATION_SPEED = 4;
const ANIMATION_SPEED_FACTOR = 0.8;
const SMOOTH_TIME = 0.1;
const CHARACTER_SCALE = 2;

export const Player = forwardRef(({ characterRef, onToggleMenu }, ref) => {
  const playerRef = ref;
  
  const { input: gamepadInput, handleGamepad } = useInput(); 

  const { scene, animations } = useGLTF('/character0.glb');
  const { actions } = useAnimations(animations, characterRef);
  const currentAnimation = useRef('Idle');
  
  const velocity = useRef(new THREE.Vector3());
  const rotationSpeed = useRef(0);

  const colliderRadius = 0.4 * CHARACTER_SCALE;
  const colliderHeight = 1.8 * CHARACTER_SCALE;

  const keyboardInput = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // RE-INTRODUCED: wasActionPressed for gamepad action button debounce
  const wasActionPressed = useRef(false); //


  const handleKeyDown = useCallback((e) => {
    const keyLower = e.key.toLowerCase();
    
    // Prevent default browser behavior for controlled MOVEMENT keys
    if (
      keyLower === 'w' || keyLower === 'arrowup' ||
      keyLower === 's' || keyLower === 'arrowdown' ||
      keyLower === 'a' || keyLower === 'arrowleft' ||
      keyLower === 'd' || keyLower === 'arrowright'
    ) {
      e.preventDefault(); 
    }

    switch (keyLower) {
      case 'w': case 'arrowup': keyboardInput.current.forward = true; break;
      case 's': case 'arrowdown': keyboardInput.current.backward = true; break;
      case 'a': case 'arrowleft': keyboardInput.current.left = true; break;
      case 'd': case 'arrowright': keyboardInput.current.right = true; break;
      default: break;
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    const keyLower = e.key.toLowerCase();
    switch (keyLower) {
      case 'w': case 'arrowup': keyboardInput.current.forward = false; break;
      case 's': case 'arrowdown': keyboardInput.current.backward = false; break;
      case 'a': case 'arrowleft': keyboardInput.current.left = false; break;
      case 'd': case 'arrowright': keyboardInput.current.right = false; break;
      default: break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

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

    const forward = keyboardInput.current.forward || gamepadInput.forward;
    const backward = keyboardInput.current.backward || gamepadInput.backward;
    const left = keyboardInput.current.left || gamepadInput.left;
    const right = keyboardInput.current.right || gamepadInput.right;
    
    // Get gamepad action state
    const action = gamepadInput.action; 

    // Check for gamepad action button press to toggle menu (if onToggleMenu is provided)
    if (onToggleMenu && action && !wasActionPressed.current) { //
        onToggleMenu(); 
    }
    wasActionPressed.current = action; //


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

    if (nextAnimation !== currentAnimation.current) {
      const oldAction = actions[currentAnimation.current];
      const newAction = actions[nextAnimation];
      oldAction?.fadeOut(0.2);
      newAction?.reset().fadeIn(0.2).play();
      currentAnimation.current = nextAnimation;
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