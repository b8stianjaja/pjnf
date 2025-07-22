import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { useCart } from '../../context/CartContext';
import './BeatListItem.css';

const BeatListItem = ({ beat, onPlay, onAddToCart }) => {
  const { currentBeat, isPlaying } = useMusic();
  const { cartItems } = useCart();

  const isThisBeatActive = currentBeat?.id === beat.id;
  const isInCart = cartItems.some(item => item.id === beat.id);

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart();
  };

  const itemClasses = `dialogue-option ${isThisBeatActive ? 'selected' : ''} ${
    isThisBeatActive && isPlaying ? 'is-playing' : ''
  }`;

  return (
    <div className={itemClasses} onClick={onPlay}>
      <div className="play-indicator">
        {isThisBeatActive && isPlaying ? '★' : '☆'}
      </div>
      <span className="option-text">{beat.title} - by {beat.artist}</span>
      <span className="option-price">${beat.price.toFixed(2)}</span>
      <button
        className="option-get-btn"
        onClick={handleAddToCartClick}
        disabled={isInCart}
      >
        {isInCart ? '[OWNED]' : '[GET]'}
      </button>
    </div>
  );
};

export default BeatListItem;