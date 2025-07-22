// frontend/src/pages/CartPage/CartPage.jsx

import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const currentUserId = 'user1';

  const handleConfirmPurchase = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const purchasePromises = cartItems.map(item => {
      // Use the relative path for the Vite proxy
      return fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          beatId: item.id,
        }),
      }).then(res => {
        if (!res.ok) {
          return Promise.reject(`Failed to purchase ${item.title}`);
        }
        return res.json();
      });
    });

    Promise.all(purchasePromises)
      .then(() => {
        alert("Your purchase requests have been sent! An admin will approve them shortly.");
        clearCart();
        navigate('/hub');
      })
      .catch(error => {
        console.error("One or more purchase requests failed:", error);
        alert("There was an issue with your purchase. Please try again.");
      });
  };

  return (
    <div style={{ color: 'white', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>You have no items in your cart.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', padding: '10px 0' }}>
              <span>{item.title}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button onClick={handleConfirmPurchase} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Confirm Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;