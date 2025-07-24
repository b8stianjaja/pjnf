/* CrystalPage/hooks/useInput.js */

import { useEffect, useRef } from 'react';

export const useInput = () => {
  // Remove keyboard.current tracking here, as Player.jsx will handle keyboard directly.
  // We'll keep input.current to combine gamepad input.

  const input = useRef({ 
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  });

  // Remove the useEffect for keyboard event listeners from here.
  // That logic is now in Player.jsx

  const handleGamepad = () => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];
    
    let gamepadState = { forward: false, backward: false, left: false, right: false, action: false };

    if (gamepad) {
      const leftStickY = gamepad.axes[1];
      const leftStickX = gamepad.axes[0];
      const deadzone = 0.25;

      gamepadState.forward = leftStickY < -deadzone;
      gamepadState.backward = leftStickY > deadzone;
      gamepadState.left = leftStickX < -deadzone;
      gamepadState.right = leftStickX > deadzone;
      gamepadState.action = gamepad.buttons[0]?.pressed || false; 
    }

    // Now, input.current will reflect only gamepad state.
    // Player.jsx will combine this with its internal keyboard state.
    input.current.forward = gamepadState.forward;
    input.current.backward = gamepadState.backward;
    input.current.left = gamepadState.left;
    input.current.right = gamepadState.right;
    input.current.action = gamepadState.action;
  };

  return { input, handleGamepad };
};