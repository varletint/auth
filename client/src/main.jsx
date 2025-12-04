import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Store the event so it can be triggered later
  deferredPrompt = e;

  // Show your custom install button/banner
  showInstallBanner();
});

function showInstallBanner() {
  // Create install banner
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      color: #059669;
      padding: 12px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    "> 
    
      <span style=" white-space: nowrap;">Install Lookups for a better experience!</span>
      <div style="
        display: flex;
        gap: 10px;
      ">
      <button id="pwa-install-btn" style="
        background: #059669;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
      ">Install</button>
      <button id="pwa-dismiss-btn" style="
        background: transparent;
        color: #059669;
        border: 1px solid #059669;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
      ">✕</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Handle install button click
  document.getElementById('pwa-install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User choice:', outcome);
      deferredPrompt = null;
      banner.remove();
    }
  });

  // Handle dismiss button click
  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
    banner.remove();
  });
}

// Hide banner if app is already installed
window.addEventListener('appinstalled', () => {
  console.log('Lookups was installed!');
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.remove();
  deferredPrompt = null;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
