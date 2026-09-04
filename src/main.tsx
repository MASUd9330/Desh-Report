// Window.fetch shim to prevent "Cannot set property fetch of #<Window> which has only a getter"
try {
  if (typeof window !== 'undefined') {
    const origFetch = window.fetch;
    let localFetch = origFetch;
    Object.defineProperty(window, 'fetch', {
      get: () => localFetch || origFetch,
      set: (fn) => {
        localFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (_) {}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
