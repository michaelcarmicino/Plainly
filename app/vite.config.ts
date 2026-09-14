/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' => la build in app/dist è apribile con doppio clic da file://
// Nessun CDN, nessun font remoto, nessuna chiamata di rete a runtime.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 1024 * 1024, // inlinea gli asset: un file, zero fetch
    cssCodeSplit: false,
  },
  test: {
    environment: 'node',
    // I test unitari del core stanno accanto al codice (src/core/__tests__/),
    // come prescrive app/CLAUDE.md; quelli di accettazione restano in tests/.
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'src/**/__tests__/*.test.ts'],
    exclude: ['tests/e2e/**'],
  },
});
