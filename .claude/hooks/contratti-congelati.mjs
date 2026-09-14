#!/usr/bin/env node
/**
 * HOOK PreToolUse — CONGELAMENTO DEI CONTRATTI.
 *
 * Se nella root esiste `.contracts-frozen`, BLOCCA ogni scrittura sotto
 * app/types/. Il file non esiste a T+0:15: si crea a mano a T+1:40 con
 *     echo "congelati a T+1:40" > .contracts-frozen
 *
 * Perché un hook e non una regola scritta: dopo il congelamento, un
 * contratto che cambia invalida in silenzio il lavoro degli altri agenti e
 * le fixture. Una regola scritta in CLAUDE.md dipende dalla buona volontà
 * del modello; un hook no.
 *
 * Contratto con Claude Code: exit 0 = consenti, exit 2 = blocca e mostra
 * stderr al modello. Qualunque errore dello script stesso => exit 0: un
 * hook rotto non deve mai fermare il lavoro.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), '..', '..'));

async function leggiStdin() {
  const pezzi = [];
  for await (const c of process.stdin) pezzi.push(c);
  return Buffer.concat(pezzi).toString('utf8');
}

try {
  const grezzo = await leggiStdin();
  const evento = grezzo.trim() ? JSON.parse(grezzo) : {};
  const percorso =
    evento?.tool_input?.file_path ?? evento?.tool_input?.notebook_path ?? '';

  if (!percorso) process.exit(0);

  const rel = relative(ROOT, resolve(percorso)).replace(/\\/g, '/');
  const dentroContratti = rel.startsWith('app/types/');
  const congelatore = join(ROOT, '.contracts-frozen');

  if (dentroContratti && existsSync(congelatore)) {
    let quando = '';
    try {
      quando = readFileSync(congelatore, 'utf8').trim();
    } catch {
      /* il contenuto è un di più */
    }

    process.stderr.write(
      [
        'SCRITTURA BLOCCATA: i contratti sono congelati.',
        '',
        `File: ${rel}`,
        quando ? `Congelati: ${quando}` : '',
        '',
        'Perché: dopo il congelamento (T+1:40) tutti gli agenti — core-engine,',
        'ui-builder, impact-analyst — e le fixture in app/fixtures/ dipendono da',
        'queste firme. Cambiarle qui invaliderebbe in silenzio il lavoro degli',
        'altri, e a un hackathon non c\'è tempo per accorgersene.',
        '',
        'Che cosa fare invece:',
        '  1. estendere, non riscrivere: aggiungere un campo OPZIONALE o un',
        '     tipo nuovo in un file dell\'agente che ne ha bisogno;',
        '  2. se il contratto è davvero sbagliato, è una decisione di squadra:',
        '     rimuovere .contracts-frozen insieme, annotare il motivo in',
        '     app/docs/decisioni.md, poi ricongelare.',
        '',
        'Il numero "contratti modificati dopo il freeze" finisce in slide 8.',
      ]
        .filter((r) => r !== '')
        .join('\n') + '\n',
    );
    process.exit(2); // blocca
  }

  process.exit(0);
} catch {
  process.exit(0); // un hook rotto non blocca mai il lavoro
}
