
import './index.css';
// DEBUG: Add a message to the DOM before React mounts
import { registerPWA } from './pwa';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
const debugDiv = document.createElement('div');
debugDiv.textContent = 'DEBUG: main.tsx loaded and mounting React app';
debugDiv.style.color = 'red';
debugDiv.style.background = 'black';
debugDiv.style.padding = '8px';
debugDiv.style.fontWeight = 'bold';
document.body.prepend(debugDiv);

// Initialize PWA Service Worker
registerPWA()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
