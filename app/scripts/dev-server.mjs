#!/usr/bin/env node
/**
 * Gestione del server di sviluppo, staccato dalla sessione.
 * Usato da /avvia e da /guarda.
 *
 * Il problema che risolve: `npm run dev` non termina mai. Lanciato in primo
 * piano dentro una sessione Claude Code, la sessione resta appesa e chi
 * lavora non capisce perché.
 *
 *   node scripts/dev-server.mjs start [--port 5173] [--attesa 40]
 *   node scripts/dev-server.mjs stop
 *   node scripts/dev-server.mjs status
 *
 * Stato su disco: .dev-server.pid e .dev-server.log (entrambi in .gitignore).
 */

import { spawn, spawnSync } from 'node:child_process';
import { createConnection } from 'node:net';
import { existsSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const PID_FILE = join(APP, '.dev-server.pid');
const LOG_FILE = join(APP, '.dev-server.log');
const WIN = process.platform === 'win32';

const arg = (nome, pred) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : pred;
};

const PORTA = arg('port', 5173);
const ATTESA_S = arg('attesa', 40);
const comando = process.argv[2] ?? 'status';

/** La porta risponde? Nessuna richiesta HTTP: basta il TCP. */
function inAscolto(porta, timeout = 700) {
  return new Promise((risolvi) => {
    const s = createConnection({ host: '127.0.0.1', port: porta });
    const chiudi = (esito) => {
      s.destroy();
      risolvi(esito);
    };
    s.setTimeout(timeout);
    s.once('connect', () => chiudi(true));
    s.once('timeout', () => chiudi(false));
    s.once('error', () => chiudi(false));
  });
}

const attendi = (ms) => new Promise((r) => setTimeout(r, ms));

function codaLog(righe = 25) {
  if (!existsSync(LOG_FILE)) return '(nessun log)';
  try {
    return readFileSync(LOG_FILE, 'utf8').split('\n').slice(-righe).join('\n').trim();
  } catch {
    return '(log illeggibile)';
  }
}

function pidSalvato() {
  if (!existsSync(PID_FILE)) return null;
  const n = Number(readFileSync(PID_FILE, 'utf8').trim());
  return Number.isInteger(n) && n > 0 ? n : null;
}

async function start() {
  if (await inAscolto(PORTA)) {
    console.log(`Il server è GIÀ attivo su http://localhost:${PORTA}`);
    console.log('Non ne è stato avviato un secondo.');
    return 0;
  }

  // Log azzerato a ogni avvio: interessa sempre l'ultimo tentativo.
  writeFileSync(LOG_FILE, '');
  const out = openSync(LOG_FILE, 'a');

  const figlio = spawn(
    WIN ? 'npm.cmd' : 'npm',
    ['run', 'dev', '--', '--port', String(PORTA), '--strictPort'],
    {
      cwd: APP,
      detached: true,
      stdio: ['ignore', out, out],
      shell: WIN,
      windowsHide: true,
    },
  );
  figlio.unref();
  writeFileSync(PID_FILE, String(figlio.pid));

  const scadenza = Date.now() + ATTESA_S * 1000;
  while (Date.now() < scadenza) {
    if (await inAscolto(PORTA)) {
      console.log(`Server avviato: http://localhost:${PORTA}`);
      console.log(`  pid ${figlio.pid} · log app/.dev-server.log`);
      console.log('  Gira in background: la sessione resta libera.');
      return 0;
    }
    await attendi(500);
  }

  console.log(`NON PARTITO entro ${ATTESA_S}s sulla porta ${PORTA}.`);
  console.log('Ultime righe di app/.dev-server.log:\n');
  console.log(codaLog());
  return 1;
}

function stop() {
  const pid = pidSalvato();
  if (pid === null) {
    console.log('Nessun pid salvato: il server non risulta avviato da /avvia.');
    return 0;
  }
  try {
    if (WIN) {
      // /T termina anche i figli: npm avvia vite come processo separato.
      spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      process.kill(-pid, 'SIGTERM');
    }
    console.log(`Server terminato (pid ${pid}).`);
  } catch (e) {
    console.log(`Il processo ${pid} non era più attivo (${e.code ?? 'già chiuso'}).`);
  }
  rmSync(PID_FILE, { force: true });
  return 0;
}

async function status() {
  const attivo = await inAscolto(PORTA);
  const pid = pidSalvato();
  console.log(
    attivo
      ? `attivo · http://localhost:${PORTA}${pid ? ` · pid ${pid}` : ''}`
      : `non attivo sulla porta ${PORTA}`,
  );
  return attivo ? 0 : 1;
}

/** Usata da /guarda: garantisce il server, senza rumore se c'è già. */
export async function assicuraServer(porta = PORTA) {
  if (await inAscolto(porta)) return true;
  return (await start()) === 0;
}

if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/') ||
    process.argv[1]?.endsWith('dev-server.mjs')) {
  const esiti = { start, stop, status };
  const f = esiti[comando];
  if (!f) {
    console.log('Uso: node scripts/dev-server.mjs start|stop|status [--port N]');
    process.exit(1);
  }
  process.exit((await f()) ?? 0);
}
