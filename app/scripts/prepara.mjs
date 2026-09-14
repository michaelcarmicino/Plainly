#!/usr/bin/env node
/**
 * prepara — porta l'ambiente locale in uno stato eseguibile.
 * Usato da /prepara e da `npm run prepara`.
 *
 * Idempotente: verifica prima, installa solo ciò che manca. Rilanciarlo su un
 * ambiente già pronto non rompe niente e finisce in pochi secondi.
 *
 * Distinzione importante: **l'installazione richiede rete, l'esecuzione del
 * prodotto no.** Sono due cose diverse. Se un passo fallisce per mancanza di
 * connessione lo script si ferma e dice cosa resta da fare a mano, senza
 * ritentare all'infinito.
 */

import { spawnSync } from 'node:child_process';
import { createConnection } from 'node:net';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const WIN = process.platform === 'win32';
const esiti = [];
let bloccato = null;

const passo = (nome, stato, nota = '') => esiti.push({ nome, stato, nota });

// Su Windows npm e npx sono script .cmd; `node` è un eseguibile vero e
// aggiungergli .cmd lo rende introvabile — un fallimento che sembra «il
// server non parte» e invece è il comando che non esiste.
const CMD_SHIM = new Set(['npm', 'npx']);

function esegui(cmd, args, opts = {}) {
  return spawnSync(WIN && CMD_SHIM.has(cmd) ? `${cmd}.cmd` : cmd, args, {
    cwd: APP,
    encoding: 'utf8',
    shell: WIN,
    timeout: opts.timeout ?? 300_000,
    ...opts,
  });
}

const senzaRete = (t = '') =>
  /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|network|getaddrinfo|socket hang up/i.test(t);

/* ---------------------------------------------------------------- 1. Node */

const richiesta = (() => {
  try {
    return JSON.parse(readFileSync(join(APP, 'package.json'), 'utf8')).engines?.node ?? '>=22.6.0';
  } catch {
    return '>=22.6.0';
  }
})();

const minimo = (richiesta.match(/(\d+)\.(\d+)/) ?? [, '22', '6']).slice(1).map(Number);
const attuale = process.versions.node.split('.').map(Number);
const nodeOk =
  attuale[0] > minimo[0] || (attuale[0] === minimo[0] && attuale[1] >= minimo[1]);

if (!nodeOk) {
  passo('Node', 'FALLITO', `v${process.versions.node}, richiesto ${richiesta}`);
  bloccato =
    `Node v${process.versions.node} non è compatibile (serve ${richiesta}).\n` +
    `  Installare le dipendenze su una versione sbagliata produce errori che\n` +
    `  sembrano di codice e non lo sono. Aggiorna Node, poi rilancia /prepara.`;
} else {
  passo('Node', 'già a posto', `v${process.versions.node}`);
}

/* -------------------------------------------------------- 2. dipendenze */

if (!bloccato) {
  const lock = existsSync(join(APP, 'package-lock.json'));
  const moduli = existsSync(join(APP, 'node_modules'));
  const marcatore = join(APP, 'node_modules', '.package-lock.json');

  if (moduli && existsSync(marcatore)) {
    passo('Dipendenze npm', 'già a posto', 'node_modules coerente con il lockfile');
  } else {
    const r = lock ? esegui('npm', ['ci', '--no-audit', '--no-fund'])
                   : esegui('npm', ['install', '--no-audit', '--no-fund']);
    const testo = `${r.stdout ?? ''}${r.stderr ?? ''}`;
    if (r.status === 0) {
      passo('Dipendenze npm', 'installato', lock ? 'npm ci' : 'npm install (lockfile creato)');
    } else {
      passo('Dipendenze npm', 'FALLITO', senzaRete(testo) ? 'nessuna connessione' : 'vedi output');
      bloccato = senzaRete(testo)
        ? 'Le dipendenze non si scaricano: manca la connessione.\n  Quando torna: `npm ci` dentro app/, poi rilancia /prepara.'
        : `npm ha fallito:\n${testo.slice(-1200)}`;
    }
  }
}

/* ------------------------------------------------- 3. browser Playwright */

function chromiumPresente() {
  const base = WIN
    ? join(homedir(), 'AppData', 'Local', 'ms-playwright')
    : process.platform === 'darwin'
      ? join(homedir(), 'Library', 'Caches', 'ms-playwright')
      : join(homedir(), '.cache', 'ms-playwright');
  if (!existsSync(base)) return false;
  try {
    return readdirSync(base).some((d) => d.startsWith('chromium'));
  } catch {
    return false;
  }
}

if (!bloccato) {
  if (chromiumPresente()) {
    passo('Browser Playwright', 'già a posto', 'chromium presente');
  } else {
    // È il passo dimenticato sempre: non è incluso in npm install, e senza
    // di lui /guarda fallisce più tardi con un errore che non dice cosa manca.
    const r = esegui('npx', ['playwright', 'install', 'chromium'], { timeout: 420_000 });
    const testo = `${r.stdout ?? ''}${r.stderr ?? ''}`;
    if (r.status === 0 && chromiumPresente()) {
      passo('Browser Playwright', 'installato', 'solo chromium, non l\'intera suite');
    } else {
      passo('Browser Playwright', 'FALLITO', senzaRete(testo) ? 'nessuna connessione' : 'vedi output');
      bloccato = senzaRete(testo)
        ? 'Il browser non si scarica: manca la connessione.\n  Quando torna: `npx playwright install chromium` dentro app/.\n  Senza, tutto funziona tranne /guarda.'
        : `playwright install ha fallito:\n${testo.slice(-800)}`;
    }
  }
}

/* ------------------------------------------ 4. directory e file di lavoro */

if (!bloccato) {
  const fatte = [];
  const shots = join(APP, '.screenshots');
  if (!existsSync(shots)) {
    mkdirSync(shots, { recursive: true });
    fatte.push('.screenshots/');
  }
  const gi = join(APP, '.gitignore');
  const voci = ['.dev-server.log', '.dev-server.pid', '.screenshots/'];
  let testo = existsSync(gi) ? readFileSync(gi, 'utf8') : '';
  const mancanti = voci.filter((v) => !testo.includes(v));
  if (mancanti.length) {
    writeFileSync(gi, `${testo.replace(/\s*$/, '')}\n${mancanti.join('\n')}\n`);
    fatte.push(`.gitignore (+${mancanti.length})`);
  }
  passo(
    'Directory di lavoro',
    fatte.length ? 'creato' : 'già a posto',
    fatte.join(', '),
  );
}

/* ------------------------------------------------- 5. controllo di salute */

if (!bloccato) {
  const tsc = esegui('npx', ['tsc', '--noEmit'], { timeout: 180_000 });
  if (tsc.status === 0) {
    passo('Tipi (tsc --noEmit)', 'già a posto');
  } else {
    passo('Tipi (tsc --noEmit)', 'FALLITO');
    bloccato = `I tipi non compilano:\n${(tsc.stdout ?? '').slice(-1500)}`;
  }
}

if (!bloccato) {
  const t = esegui('npm', ['test'], { timeout: 300_000 });
  const testo = `${t.stdout ?? ''}${t.stderr ?? ''}`.replace(/\x1b\[[0-9;]*m/g, '');
  const riga = testo.split('\n').find((r) => /Tests\s+\d|Tests\s+\d+ (passed|failed)/.test(r));
  if (t.status === 0) {
    passo('Test', 'già a posto', (riga ?? '').trim());
  } else {
    passo('Test', 'FALLITO', (riga ?? '').trim());
    bloccato = `La suite non passa:\n${testo.split('\n').slice(-25).join('\n')}`;
  }
}

/* --------------------------------------------------- 6. prova di avvio */

const inAscolto = (p) =>
  new Promise((r) => {
    const s = createConnection({ host: '127.0.0.1', port: p });
    const fine = (v) => {
      s.destroy();
      r(v);
    };
    s.setTimeout(600);
    s.once('connect', () => fine(true));
    s.once('timeout', () => fine(false));
    s.once('error', () => fine(false));
  });

if (!bloccato) {
  const giaAttivo = await inAscolto(5173);
  if (giaAttivo) {
    passo('Prova di avvio', 'già a posto', 'server già attivo, lasciato in esecuzione');
  } else {
    const s = esegui('node', ['scripts/dev-server.mjs', 'start'], { timeout: 90_000 });
    const partito = await inAscolto(5173);
    if (partito) {
      esegui('node', ['scripts/dev-server.mjs', 'stop'], { timeout: 30_000 });
      // È una verifica, non un'installazione: se passa, l'ambiente era già
      // a posto. Marcarla altrimenti impedirebbe al riepilogo di collassare
      // in una riga sola alla seconda esecuzione.
      passo('Prova di avvio', 'già a posto', 'parte e risponde; server poi fermato');
    } else {
      passo('Prova di avvio', 'FALLITO', 'la porta 5173 non risponde');
      bloccato = `Il server non parte:\n${(s.stdout ?? '').slice(-800)}`;
    }
  }
}

/* ------------------------------------------------------------- riepilogo */

const tuttoAPosto = esiti.every((e) => e.stato === 'già a posto') && !bloccato;

if (tuttoAPosto) {
  console.log('Ambiente già pronto. Niente da fare.');
  process.exit(0);
}

const largh = Math.max(...esiti.map((e) => e.nome.length));
for (const e of esiti) {
  console.log(`  ${e.nome.padEnd(largh)}  ${e.stato}${e.nota ? ` · ${e.nota}` : ''}`);
}
console.log('');

if (bloccato) {
  console.log(`AMBIENTE NON PRONTO.\n\n${bloccato}`);
  process.exit(1);
}

console.log('Ambiente pronto: `/avvia` per far girare l\'applicazione.');
process.exit(0);
