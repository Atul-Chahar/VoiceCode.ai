
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill for environments where standard React JSX types might be missing or not loaded correctly.
// This ensures all standard HTML elements (div, p, span, etc.) are recognized.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);