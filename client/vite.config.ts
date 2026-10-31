import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173, proxy: { '/api': 'http://localhost:8787' } },
  preview: { port: 4317, proxy: { '/api': 'http://localhost:8787' } },
  build: {
    rollupOptions: {
      output: {
        // Libraries and the big art library get their own long-cached chunks, so an
        // app update only re-downloads app code. All libraries share ONE chunk on
        // purpose: splitting React from the libraries that use it let a chunk run
        // before React existed and crashed the built app (createContext of undefined).
        manualChunks: (id) => {
          if (id.includes('/src/art/')) return 'art';
          if (id.includes('node_modules/')) return 'vendor';
          return undefined;
        },
      },
    },
  },
});
