#!/usr/bin/env node
/**
 * HOOK PostToolUse — IL GUARDRAIL NON DIPENDE DALLA BUONA VOLONTÀ.
 *
 * Dopo ogni Edit/Write su un sorgente di app/, esegue i test dei guardrail.
 * Se una formulazione prescrittiva è entrata nel codice, il modello lo
 * scopre subito invece che al momento della consegna.
 *
 * Rapido per costruzione: gira SOLO sui file sotto app/ (src, fixtures,
 * types, tests) e lancia solo i due test dei guardrail, non l'intera suite.
 *
 * Regola di sicurezza: qualunque problema dello script stesso — node_modules
 * assenti, git mancante, JSON malformato — produce exit 0. Un hook che si
 * rompe non deve mai bloccare il lavoro.
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), '..', '..'));
const APP = join(ROOT, 'app');

async function leggiStdin() {
  const pezzi = [];
  for await (const c of process.stdin) pezzi.push(c);
  return Buffer.concat(pezzi).toString('utf8');
}

try {
  const grezzo = await leggiStdin();
  const evento = grezzo.trim() ? JSON.parse(grezzo) : {};
  const percorso = evento?.tool_input?.file_path ?? '';
  if (!percorso) process.exit(0);

  const rel = relative(ROOT, resolve(percorso)).replace(/\\/g, '/');

  // Solo i file che possono contenere testo rivolto all'utente.
  const rilevante =
    /^app\/(src|fixtures|types)\/.+\.(ts|tsx|css|json)$/.test(rel);
  if (!rilevante) process.exit(0);

  // Senza dipendenze installate non c'è nulla da eseguire: usciamo bene.
  if (!existsSync(join(APP, 'node_modules'))) process.exit(0);

  const esito = spawnSync(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', '--silent', 'test:guardrails'],
    { cwd: APP, encoding: 'utf8', timeout: 75_000, shell: process.platform === 'win32' },
  );

  if (esito.error || esito.status === null) process.exit(0); // problema nostro

  if (esito.status !== 0) {
    process.stderr.write(
      [
        'GUARDRAIL FALLITO dopo la modifica a ' + rel,
        '',
        (esito.stdout ?? '').slice(-3000),
        (esito.stderr ?? '').slice(-1500),
        '',
        'Il prodotto spiega e calcola, non consiglia: riformulare il testo in',
        'modo descrittivo (che cosa dice il numero) invece che prescrittivo',
        '(che cosa fare). Le riformulazioni ammesse sono in',
        'app/src/guardrails/lessico.ts, accanto a ogni termine vietato.',
      ].join('\n') + '\n',
    );
    process.exit(2); // feedback bloccante al modello
  }

  process.exit(0);
} catch {
  process.exit(0);
}
