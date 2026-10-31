import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queries';
import { primeAudioOnFirstTap } from '@/lib/sound';
import App from './App';
import './index.css';

primeAudioOnFirstTap();

// After a deploy, this tab's next page chunk may no longer exist (each build's files have
// new names). Reload once to pick up the new build instead of showing a broken screen.
// The timestamp stops a reload loop if the chunk is missing for some other reason.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'kk:reloaded-for-update';
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(KEY) ?? 0);
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // Storage blocked: still reload once; the browser keeps no loop state either way.
  }
  if (Date.now() - last < 30_000) return;
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
