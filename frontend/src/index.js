import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './components/styles.css';  // Ruta correcta si styles.css está en components

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
