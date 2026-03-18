
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Initialize PWA Service Worker (only in production builds)
try {
  import('./pwa').then(({ registerPWA }) => registerPWA()).catch(() => {});
} catch {
  // PWA registration is optional in dev
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
