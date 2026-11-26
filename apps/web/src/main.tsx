import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
// @ts-ignore - Vite handles CSS imports, and this project may not include CSS module declarations.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
