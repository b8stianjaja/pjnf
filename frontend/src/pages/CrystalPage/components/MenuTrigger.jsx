/* CrystalPage/components/MenuTrigger.jsx */

import React from 'react';
import { RigidBody, CuboidCollider } from "@react-three/rapier";

/**
 * A component that creates a physics sensor trigger zone.
 * When a dynamic rigidbody (like the player) enters or exits this zone,
 * it calls the onPlayerIntersect callback.
 * It includes a visible green plane for easy positioning and debugging.
 *
 * @param {function} onPlayerIntersect - Callback function, receives `true` on enter and `false` on exit.
 * @param {object} props - Standard props to position, rotate, and scale the trigger plane.
 */
export const MenuTrigger = ({ onPlayerIntersect, ...props }) => {
  return (
    // This RigidBody is set to 'fixed' so it doesn't move.
    // It's a sensor, so it won't physically collide, only detect intersections.
    <RigidBody
      type="fixed"
      colliders={false} // We define the collider manually below.
      {...props} // Apply position, scale, rotation from the parent.
      onIntersectionEnter={() => onPlayerIntersect(true)}
      onIntersectionExit={() => onPlayerIntersect(false)}
    >
      {/* This is the actual physics shape for the sensor.
          It's a thin cuboid. The size is [width/2, height/2, depth/2].
          We scale the parent RigidBody, so the base size can be simple. */}
      <CuboidCollider args={[0.5, 0.1, 0.5]} />

      {/* This is the visible green plane for debugging.
          It will be made invisible in the final version. */}
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="green" transparent opacity={0.5} />
      </mesh>
    </RigidBody>
  );
};