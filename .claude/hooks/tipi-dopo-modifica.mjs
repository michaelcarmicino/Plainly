#!/usr/bin/env node
/**
 * HOOK PostToolUse — `tsc --noEmit` dopo ogni modifica a un sorgente.
 * Attivo sulla radice del product developer (app/.claude/settings.json).
 *
 * Perché qui e non alla radice dell'architetto: chi scrive codice deve
 * scoprire un tipo rotto al salvataggio, non al commit. L'architetto tocca
 * soprattutto markdown e configurazione, per cui sarebbe solo lento.
 *
 * Regola di sicurezza: qualunque problema dello script stesso produce
 * exit 0. Un hook rotto non deve mai bloccare il lavoro.
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
  if (!/^app\/(src|tests|types)\/.+\.tsx?$/.test(rel)) process.exit(0);
  if (!existsSync(join(APP, 'node_modules'))) process.exit(0);

  const esito = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['tsc', '--noEmit'],
    { cwd: APP, encoding: 'utf8', timeout: 60_000, shell: process.platform === 'win32' },
  );

  if (esito.error || esito.status === null) process.exit(0);

  if (esito.status !== 0) {
    process.stderr.write(
      `TIPI NON VALIDI dopo la modifica a ${rel}\n\n` +
        `${(esito.stdout ?? '').slice(-2500)}\n\n` +
        `Regola: niente \`any\`, niente \`@ts-ignore\`. Se il tipo non torna, il\n` +
        `problema è il tipo. Vedi app/.claude/rules/standard-codice.md.\n`,
    );
    process.exit(2);
  }

  process.exit(0);
} catch {
  process.exit(0);
}
