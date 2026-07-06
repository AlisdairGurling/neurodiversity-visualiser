import { render } from 'solid-js/web';
import { App } from './App';
import './styles.css';

const root = document.getElementById('root');
if (root) render(() => <App />, root);

// Register the service worker in production builds only — in dev it would
// cache Vite's transient module URLs and cause confusing staleness.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Registration failure is non-fatal; the app works without it.
    });
  });
}
