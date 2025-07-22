import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [purchasedBeats, setPurchasedBeats] = useState([]);

    const addToCart = (beat) => {
        setCartItems(prevItems => [...prevItems, beat]);
    };

    const removeFromCart = (beatId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== beatId));
    };

    const addPurchasedBeats = (beats) => {
        setPurchasedBeats(prevBeats => [...prevBeats, ...beats]);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        purchasedBeats,
        addPurchasedBeats,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};