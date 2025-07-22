// frontend/src/pages/CheckoutPage/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

// A component to create a "typing" effect for text
const Typewriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + text.charAt(i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // 'pending', 'processing', 'complete'
  const currentUserId = 'user1';

  const handleInitiateTransfer = () => {
    if (cartItems.length === 0) return;
    setStatus('processing');

    const purchasePromises = cartItems.map(item =>
      fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, beatId: item.id }),
      }).then(res => {
        if (!res.ok) return Promise.reject(`Failed for ${item.title}`);
        return res.json();
      })
    );

    Promise.all(purchasePromises)
      .then(() => {
        setTimeout(() => {
          setStatus('complete');
          clearCart();
        }, 2000); // Simulate processing time
      })
      .catch(error => {
        console.error("Transfer failed:", error);
        setStatus('error');
      });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="checkout-container">
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="t-btn red"></span>
            <span className="t-btn yellow"></span>
            <span className="t-btn green"></span>
          </div>
          <div className="terminal-title">neofantasia OS // Asset Acquisition</div>
        </div>
        <div className="terminal-body">
          <p className="terminal-line"><Typewriter text="> Establishing secure connection..." /></p>
          <p className="terminal-line"><Typewriter text="> Authenticating user: John Doe" /></p>
          <p className="terminal-line"><Typewriter text="> Awaiting asset transfer authorization..." /></p>
          <br />

          {cartItems.map(item => (
            <p key={item.id} className="terminal-line item">
              <Typewriter text={`- Target Asset: ${item.title} // Cost: $${item.price.toFixed(2)}`} />
            </p>
          ))}
          <br />
          <p className="terminal-line total"><Typewriter text={`> Total Transfer Cost: $${total.toFixed(2)}`} /></p>
          <br />
          
          {status === 'pending' && (
            <div className="terminal-action">
              <button onClick={handleInitiateTransfer} className="terminal-button">
                [ INITIATE TRANSFER ]
              </button>
              <span className="blinking-cursor">_</span>
            </div>
          )}

          {status === 'processing' && (
            <p className="terminal-line processing"><Typewriter text="> PROCESSING... Encrypting and transferring data packets..." /></p>
          )}

          {status === 'complete' && (
             <div className="transfer-complete">
                <p className="terminal-line success"><Typewriter text="> TRANSFER COMPLETE." /></p>
                <p className="terminal-line success"><Typewriter text="> Project data unlocked. Redirecting to Collaboration Hub..." onComplete={() => setTimeout(() => navigate('/hub'), 1000)}/></p>
             </div>
          )}

           {status === 'error' && (
             <p className="terminal-line error"><Typewriter text="> ERROR: Transfer failed. Connection timed out." /></p>
          )}

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;