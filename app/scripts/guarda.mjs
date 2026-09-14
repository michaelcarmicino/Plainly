#!/usr/bin/env node
/**
 * Cattura una schermata dell'applicazione e gli errori di console.
 * Usato da /guarda.
 *
 * Serve perché chi scrive il codice qui è un modello, e un modello non vede
 * l'interfaccia che sta costruendo. Senza questo passo, «funziona» significa
 * solo «i test passano».
 *
 *   node scripts/guarda.mjs [percorso] [--viewport mobile|proiettore|1440]
 *
 * Usa il browser di @playwright/test, che è già una dipendenza: nessuna
 * libreria nuova.
 */

import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assicuraServer } from './dev-server.mjs';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(APP, '.screenshots');
const PORTA = 5173;

const VIEWPORT = {
  mobile: { width: 390, height: 844, nome: 'mobile stretto (390px)' },
  proiettore: { width: 1920, height: 1080, nome: 'proiettore (1920px)' },
  1440: { width: 1440, height: 900, nome: 'desktop (1440px)' },
};

const argomenti = process.argv.slice(2);
const iVp = argomenti.indexOf('--viewport');
const chiaveVp = iVp !== -1 ? argomenti[iVp + 1] : '1440';
const vp = VIEWPORT[chiaveVp] ?? VIEWPORT['1440'];
const percorso = argomenti.find((a) => !a.startsWith('--') && a !== chiaveVp) ?? '/';

const pronto = await assicuraServer(PORTA);
if (!pronto) {
  console.log('Server non avviabile: vedi app/.dev-server.log. Niente da guardare.');
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import('@playwright/test'));
} catch {
  console.log('@playwright/test non installato: lancia `npm install`.');
  process.exit(1);
}

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  console.log('Browser non disponibile. Installalo una volta sola con:');
  console.log('  npx playwright install chromium');
  console.log(`\n(${String(e.message).split('\n')[0]})`);
  process.exit(1);
}

mkdirSync(DEST, { recursive: true });

const pagina = await browser.newPage({
  viewport: { width: vp.width, height: vp.height },
  deviceScaleFactor: 2,
});

const errori = [];
pagina.on('console', (m) => {
  if (m.type() === 'error') errori.push(`[console] ${m.text()}`);
});
pagina.on('pageerror', (e) => errori.push(`[eccezione] ${e.message}`));
pagina.on('requestfailed', (r) => {
  const url = r.url();
  if (!url.startsWith('http://127.0.0.1') && !url.startsWith('http://localhost')) {
    errori.push(`[RETE ESTERNA] richiesta fallita verso ${url} — il prodotto deve funzionare offline`);
  }
});

const url = `http://localhost:${PORTA}${percorso.startsWith('/') ? percorso : `/${percorso}`}`;
let esito = 0;

try {
  await pagina.goto(url, { waitUntil: 'networkidle', timeout: 20_000 });
} catch (e) {
  console.log(`Pagina non caricata: ${url}`);
  console.log(String(e.message).split('\n')[0]);
  esito = 1;
}

const nome = `${chiaveVp}-${percorso.replace(/[^\w]+/g, '_') || 'home'}.png`;
const file = join(DEST, nome);
await pagina.screenshot({ path: file, fullPage: true });
await browser.close();

console.log(`Schermata: ${url}`);
console.log(`  viewport:   ${vp.nome}`);
console.log(`  screenshot: app/.screenshots/${nome}`);
console.log(`  percorso assoluto da esaminare: ${file}`);

if (errori.length === 0) {
  console.log('  console:    nessun errore');
} else {
  console.log(`  console:    ${errori.length} errori\n`);
  for (const e of errori) console.log(`    ${e}`);
  esito = 1;
}

process.exit(esito);
