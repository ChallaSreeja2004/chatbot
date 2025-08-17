// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { NhostProvider } from '@nhost/react';
import { nhost } from './nhost';
import App from './App'; // We will render App directly

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      {/* App is now the top-level component inside NhostProvider */}
      {/* It will handle ALL other logic, including theming and Apollo */}
      <App />
    </NhostProvider>
  </React.StrictMode>
);