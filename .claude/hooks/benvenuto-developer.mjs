#!/usr/bin/env node
/**
 * HOOK SessionStart — orientamento all'apertura della sessione in app/.
 *
 * Chi apre Claude Code qui deve capire dove si trova senza chiedere a
 * nessuno. Meno di quindici righe: un muro di testo si smette di leggere
 * alla seconda volta, e questo hook parte a ogni sessione.
 *
 * Veloce per costruzione: nessun processo esterno, nessun npm, nessun test
 * eseguito. Lo stato dei test si legge da un file di esito, non ricalcolandolo.
 *
 * Non blocca mai l'avvio: qualunque errore proprio produce exit 0 e meno
 * output.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createConnection } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'app');
const ROOT = join(APP, '..');

const porta = (p) =>
  new Promise((r) => {
    const s = createConnection({ host: '127.0.0.1', port: p });
    const fine = (v) => {
      s.destroy();
      r(v);
    };
    s.setTimeout(400);
    s.once('connect', () => fine(true));
    s.once('timeout', () => fine(false));
    s.once('error', () => fine(false));
  });

try {
  const righe = [];
  const dirFeature = join(APP, 'docs', 'features');

  const spec = existsSync(dirFeature)
    ? readdirSync(dirFeature).filter((f) => /^\d\d-.+\.md$/.test(f))
    : [];
  const implementate = spec.filter((f) => {
    try {
      return !readFileSync(join(dirFeature, f), 'utf8').includes('Stato: **proposta**');
    } catch {
      return false;
    }
  });

  const congelati = existsSync(join(ROOT, '.contracts-frozen'));
  const attivo = await porta(5173);

  let test = 'non eseguiti in questa sessione';
  const cache = join(APP, 'node_modules', '.vitest');
  if (existsSync(cache)) {
    try {
      test = `ultima esecuzione: ${statSync(cache).mtime.toLocaleString('it-IT')}`;
    } catch {
      /* il dettaglio è un di più */
    }
  }

  // L'invito a /prepara compare SOLO se serve davvero: nominarla a ogni
  // avvio aggiungerebbe rumore a un output che deve restare leggibile.
  const moduli = existsSync(join(APP, 'node_modules'));
  const base =
    process.platform === 'win32'
      ? join(process.env.LOCALAPPDATA ?? '', 'ms-playwright')
      : join(process.env.HOME ?? '', '.cache', 'ms-playwright');
  let browser = false;
  try {
    browser = existsSync(base) && readdirSync(base).some((d) => d.startsWith('chromium'));
  } catch {
    /* assenza = non pronto */
  }

  righe.push('── Plainly · radice del product developer ──────────────────────');
  if (!moduli || !browser) {
    righe.push(
      `AMBIENTE NON PRONTO (${!moduli ? 'dipendenze mancanti' : 'browser Playwright mancante'}) → lancia /prepara`,
    );
  }
  righe.push('Ciclo:  /spec → conferma → /implementa → /verifica → commit');
  righe.push('');
  righe.push('  /prepara    porta l\'ambiente in uno stato eseguibile (una volta sola)');
  righe.push('  /spec       propone una funzionalità e la rifiuta se non è conforme');
  righe.push('  /implementa la realizza instradando gli agenti giusti');
  righe.push('  /verifica   il cancello prima di ogni commit e di ogni merge');
  righe.push('  /evidenza   registra il risultato di una funzionalità');
  righe.push('  /avvia      fa girare l\'app in background — mai `npm run dev` a mano');
  righe.push('  /guarda     cattura la schermata e gli errori di console');
  righe.push('  /diagnosi   trova la causa di un sintomo prima di correggere');
  righe.push('  /annulla    torna all\'ultimo stato verde');
  righe.push('  /promuovi   porta su master quello che è verde su develop');
  righe.push('  /pm · /task-cartella · /task-file   più funzionalità insieme');
  righe.push('');
  righe.push(
    `Stato:  ${spec.length} spec in docs/features/ (${implementate.length} implementate) · ` +
      `server ${attivo ? 'attivo su :5173' : 'non attivo'} · test ${test}`,
  );
  righe.push(
    congelati
      ? 'CONTRATTI CONGELATI: ogni scrittura sotto types/ è bloccata. Chiedi all\'architetto.'
      : 'Contratti non ancora congelati.',
  );
  righe.push('Guida operativa: COME-LAVORARE.md · modifiche su più file: pianifica prima (Shift+Tab).');
  righe.push('───────────────────────────────────────────────────────────────');

  console.log(righe.join('\n'));
  process.exit(0);
} catch {
  process.exit(0);
}
