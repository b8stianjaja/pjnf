import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { CartProvider } from './context/CartContext';
import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MusicProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </MusicProvider>
    </BrowserRouter>
  </React.StrictMode>
);