import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// StrictMode is enabled for development checks (like double-mounting)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
