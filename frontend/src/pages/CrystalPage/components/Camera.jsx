/* CrystalPage/components/Camera.jsx */

import React, { useRef, useContext } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RefsContext } from './Experience';

const CAMERA_OFFSET = new THREE.Vector3(0, 0.2, 0.6);
const LOOK_AT_OFFSET = new THREE.Vector3(0, 0.075, 0);
const POSITION_SMOOTH_SPEED = 5.0;
const ROTATION_SMOOTH_SPEED = 7.0;
const COLLISION_OFFSET = 0.035;
const VEC3_UP = new THREE.Vector3(0, 1, 0);

// Pre-allocating objects to reuse in the frame loop, preventing garbage collection stutters.
const _idealCameraPosition = new THREE.Vector3();
const _finalCameraPosition = new THREE.Vector3();
const _desiredLookAt = new THREE.Vector3();
const _cameraDirection = new THREE.Vector3();
const _targetMatrix = new THREE.Matrix4();
const _targetQuaternion = new THREE.Quaternion();

// **PERFORMANCE ENHANCEMENT**
// We will only run the expensive raycast operation every 3 frames.
let frameCounter = 0;
const RAYCAST_FREQUENCY = 3;

export const Camera = () => { 
  const { playerRef, characterRef, worldRef } = useContext(RefsContext);
  const { camera } = useThree();

  const playerPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());

  // Stores the last known good distance to prevent jarring camera jumps.
  const lastIntersectionDistance = useRef(null);

  useFrame((state, delta) => {
    if (!playerRef.current || !characterRef.current) return;
    
    frameCounter++;

    const playerTranslation = playerRef.current.translation();
    playerPosition.current.set(playerTranslation.x, playerTranslation.y, playerTranslation.z);
    
    const characterQuaternion = characterRef.current.quaternion;

    _idealCameraPosition.copy(CAMERA_OFFSET).applyQuaternion(characterQuaternion);
    _idealCameraPosition.add(playerPosition.current);

    _desiredLookAt.copy(playerPosition.current).add(LOOK_AT_OFFSET);
    lookAtTarget.current.lerp(_desiredLookAt, delta * POSITION_SMOOTH_SPEED);

    const cameraDistance = _idealCameraPosition.distanceTo(lookAtTarget.current);

    // **PERFORMANCE ENHANCEMENT**: Throttle the raycaster.
    if (worldRef.current && frameCounter % RAYCAST_FREQUENCY === 0) {
        _cameraDirection.copy(_idealCameraPosition).sub(lookAtTarget.current).normalize();
        
        raycaster.current.set(lookAtTarget.current, _cameraDirection);
        raycaster.current.far = cameraDistance;
        const intersects = raycaster.current.intersectObject(worldRef.current, true);

        if (intersects.length > 0) {
            // Store the new intersection distance.
            lastIntersectionDistance.current = intersects[0].distance;
        } else {
            // If no intersection, the camera can be at its ideal distance.
            lastIntersectionDistance.current = null;
        }
    }
    
    // Use the last known intersection distance to position the camera.
    if (lastIntersectionDistance.current !== null) {
        _finalCameraPosition.copy(lookAtTarget.current).add(_cameraDirection.multiplyScalar(lastIntersectionDistance.current - COLLISION_OFFSET));
    } else {
        _finalCameraPosition.copy(_idealCameraPosition);
    }

    camera.position.lerp(_finalCameraPosition, delta * POSITION_SMOOTH_SPEED);
    
    _targetMatrix.lookAt(camera.position, lookAtTarget.current, VEC3_UP);
    _targetQuaternion.setFromRotationMatrix(_targetMatrix);
    
    camera.quaternion.slerp(_targetQuaternion, delta * ROTATION_SMOOTH_SPEED);
  });

  return null;
};