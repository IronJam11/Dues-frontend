import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import { WebSocketProvider } from './contexts/WebSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <WebSocketProvider>
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
  </WebSocketProvider>

);
