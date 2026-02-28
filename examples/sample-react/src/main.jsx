import React from 'react';
import ReactDOM from 'react-dom/client';
import { connect } from 'renderflow-sdk';
import App from './App';

try {
  connect(8765);
} catch {
  // SDK optional; app works without extension
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
