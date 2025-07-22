import { useEffect, useRef } from 'react';

export const useInput = () => {
  // This ref is ONLY for the keyboard state.
  const keyboard = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  });

  // This ref is the final, COMBINED input that the player will use.
  const input = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  });

  // This useEffect now writes ONLY to the private keyboard ref.
  useEffect(() => {
    const handleKey = (e, value) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': keyboard.current.forward = value; break;
        case 's': case 'arrowdown': keyboard.current.backward = value; break;
        case 'a': case 'arrowleft': keyboard.current.left = value; break;
        case 'd': case 'arrowright': keyboard.current.right = value; break;
        case 'enter': case ' ': keyboard.current.action = value; break;
        default: break;
      }
    };

    const handleKeyDown = (e) => handleKey(e, true);
    const handleKeyUp = (e) => handleKey(e, false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // This function now merges the keyboard and gamepad states.
  const handleGamepad = () => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];
    
    // Default gamepad state is all false
    let gamepadState = { forward: false, backward: false, left: false, right: false, action: false };

    if (gamepad) {
      const leftStickY = gamepad.axes[1];
      const leftStickX = gamepad.axes[0];
      const deadzone = 0.25;

      gamepadState.forward = leftStickY < -deadzone;
      gamepadState.backward = leftStickY > deadzone;
      gamepadState.left = leftStickX < -deadzone;
      gamepadState.right = leftStickX > deadzone;
      gamepadState.action = gamepad.buttons[0].pressed;
    }

    // Merge the two input sources into the final input ref.
    // An action is true if EITHER the keyboard OR the gamepad wants it to be true.
    input.current.forward = keyboard.current.forward || gamepadState.forward;
    input.current.backward = keyboard.current.backward || gamepadState.backward;
    input.current.left = keyboard.current.left || gamepadState.left;
    input.current.right = keyboard.current.right || gamepadState.right;
    input.current.action = keyboard.current.action || gamepadState.action;
  };

  return { input, handleGamepad };
};