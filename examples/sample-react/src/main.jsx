import React from 'react';
import ReactDOM from 'react-dom/client';
import { connect } from 'renderflow-sdk';
import App from './App';

connect(8765);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
