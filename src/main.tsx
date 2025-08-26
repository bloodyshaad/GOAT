import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { preloadImages } from './utils/performance';

// Preload critical images for better performance
const criticalImages = [
  '/GOAT.jpg',
  '/GOAT-dark.png',
  // Add other critical images here
];

preloadImages(criticalImages).catch(console.error);

// Add performance observer for monitoring
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
      if (entry.entryType === 'first-input') {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
