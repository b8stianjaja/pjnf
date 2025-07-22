import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CAMERA_OFFSET = new THREE.Vector3(0, 4, 12);
const LOOK_AT_OFFSET = new THREE.Vector3(0, 1.5, 0);
const POSITION_SMOOTH_SPEED = 5.0;
const ROTATION_SMOOTH_SPEED = 7.0;
const COLLISION_OFFSET = 0.7;
const VEC3_UP = new THREE.Vector3(0, 1, 0);

export const Camera = ({ playerRef, characterRef, roomRef }) => {
  const { camera } = useThree();

  const playerPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());

  useFrame((state, delta) => {
    if (!playerRef.current || !characterRef.current) return;

    const playerTranslation = playerRef.current.translation();
    playerPosition.current.set(playerTranslation.x, playerTranslation.y, playerTranslation.z);
    
    const characterQuaternion = characterRef.current.quaternion;

    const idealCameraPosition = CAMERA_OFFSET.clone().applyQuaternion(characterQuaternion);
    idealCameraPosition.add(playerPosition.current);

    const desiredLookAt = playerPosition.current.clone().add(LOOK_AT_OFFSET);
    lookAtTarget.current.lerp(desiredLookAt, delta * POSITION_SMOOTH_SPEED);

    let intersects = [];
    if (roomRef.current) {
        const cameraDirection = idealCameraPosition.clone().sub(lookAtTarget.current).normalize();
        const cameraDistance = idealCameraPosition.distanceTo(lookAtTarget.current);
        raycaster.current.set(lookAtTarget.current, cameraDirection);
        raycaster.current.far = cameraDistance;
        intersects = raycaster.current.intersectObject(roomRef.current, true);
    }
    
    const finalCameraPosition = intersects[0]
      ? lookAtTarget.current.clone().add(cameraDirection.multiplyScalar(intersects[0].distance - COLLISION_OFFSET))
      : idealCameraPosition;

    camera.position.lerp(finalCameraPosition, delta * POSITION_SMOOTH_SPEED);
    
    const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(camera.position, lookAtTarget.current, VEC3_UP)
    );
    camera.quaternion.slerp(targetQuaternion, delta * ROTATION_SMOOTH_SPEED);
  });

  return null;
};