import React from 'react';
import './Transition.css';

/**
 * A component that creates a full-screen fade transition.
 * @param {object} props - The component's props.
 * @param {boolean} props.isTransitioning - Controls the visibility of the transition overlay.
 */
const Transition = ({ isTransitioning }) => {
  return (
    <div
      className={`transition-overlay ${isTransitioning ? 'visible' : ''}`}
    />
  );
};

export default Transition;