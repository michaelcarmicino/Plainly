/// <reference types="vitest" />
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite inserisce sempre `crossorigin` e `type="module"` sul tag <script> di
// ingresso, anche quando l'output di rollup è configurato come `iife` più
// sotto (vedi generateBundle in node_modules/vite/.../dep-*.js: `toScriptTag`
// scrive `type: "module"` e `crossorigin: true` senza condizionarli al
// formato — non esiste un'opzione di configurazione per questo). Sotto
// `file://` Chromium avvia comunque l'algoritmo di caricamento dei moduli per
// qualunque `<script type="module">`, verso un'origine opaca: la richiesta
// fallisce a prescindere dal contenuto del file o da `crossorigin`
// (verificato: con solo `crossorigin` rimosso la pagina resta bianca). Il
// bundle qui sotto è già un IIFE classico — nessun `import`/`export` — quindi
// è sicuro trattarlo come script normale togliendo anche `type="module"`.
// Un `<script type="module">` è *sempre* differito allo spec (eseguito dopo
// il parsing del documento): togliendo `type="module"` senza aggiungere
// `defer`, uno script nel <head> torna a eseguirsi subito, prima che
// `<div id="root">` esista — `#root` non trovato. `defer` ripristina lo
// stesso ordine di esecuzione di prima.
//
// Solo in build: in `npm run dev` l'HTML servito contiene i veri `import`
// del client HMR e del preambolo di react-refresh (ESM autentico, servito
// via HTTP, non un IIFE) — togliere `type="module"` lì rompe il dev server
// con "Cannot use import statement outside a module".
const rimuoviCrossoriginEModuleFileProtocol = (): Plugin => ({
  name: 'plainly-script-classico-per-file-protocol',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      return html
        .replace(/\s+crossorigin(="[^"]*")?/g, '')
        .replace(/<script type="module"/g, '<script defer');
    },
  },
});

// base: './' => la build in app/dist è apribile con doppio clic da file://
// Nessun CDN, nessun font remoto, nessuna chiamata di rete a runtime.
export default defineConfig({
  base: './',
  plugins: [react(), rimuoviCrossoriginEModuleFileProtocol()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 1024 * 1024, // inlinea gli asset: un file, zero fetch
    cssCodeSplit: false,
    // Disattiva il polyfill di modulepreload: sotto file:// non c'è nessun
    // preload da polyfillare, e il polyfill era l'unica `fetch(` nel bundle.
    modulePreload: false,
    rollupOptions: {
      output: {
        // Chromium blocca `<script type="module">` sotto file:// (origine
        // opaca, same-origin fallisce a prescindere da `crossorigin`).
        // L'app non ha `import()` dinamici (un solo chunk JS in output, già
        // verificato) quindi un bundle IIFE classico — nessun `type="module"`,
        // nessuna richiesta di rete per caricarlo — è equivalente e funziona
        // anche a doppio clic.
        format: 'iife',
      },
    },
  },
  test: {
    environment: 'node',
    // I test unitari del core stanno accanto al codice (src/core/__tests__/),
    // come prescrive app/CLAUDE.md; quelli di accettazione restano in tests/.
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'src/**/__tests__/*.test.ts'],
    exclude: ['tests/e2e/**'],
  },
});
