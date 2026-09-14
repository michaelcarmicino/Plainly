#!/usr/bin/env node
/**
 * Apre presentation/deck.html da file:// e cattura alcune slide, così chi
 * lo genera può **guardarlo** invece di immaginarlo.
 *
 *   node scripts/vedi-deck.mjs 1 5 17
 */

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const DECK = join(APP, '..', 'presentation', 'deck.html');
const DEST = join(APP, '.screenshots');

const numeri = process.argv.slice(2).map(Number).filter(Boolean);
const quali = numeri.length ? numeri : [1, 2, 5, 17];

const { chromium } = await import('@playwright/test');
const browser = await chromium.launch();
const pagina = await browser.newPage({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
});

mkdirSync(DEST, { recursive: true });

for (const n of quali) {
  // Ricarica ogni volta: cambiare solo l'hash non ricarica il documento, e
  // si finisce per fotografare sempre la stessa slide senza accorgersene.
  await pagina.goto('about:blank');
  await pagina.goto(`${pathToFileURL(DECK).href}#${n}`);
  await pagina.waitForTimeout(250);
  const file = join(DEST, `deck-${String(n).padStart(2, '0')}.png`);
  await pagina.screenshot({ path: file });
  console.log(file);
}

await browser.close();
