#!/usr/bin/env node
/**
 * evolution:proof — MISURA l'evolvibilità invece di affermarla.
 *
 * Confronta il branch corrente con il tag `freeze` (creato a T+2:45) e
 * scrive presentation/evidence/evolution.json, consumato dalla slide 8.
 *
 * IL NUMERO CHE CONTA: `contrattiModificatiDopoFreeze`.
 * Se aggiungere una capability ha richiesto zero modifiche ai contratti,
 * la decomposizione regge; se ne ha richieste, lo diciamo lo stesso.
 *
 * Va eseguito sul branch `evolution-proof`, che non viene mai unito: la
 * build della demo non deve mai dipendere da questo esperimento.
 *
 * Non fallisce mai: senza tag scrive un JSON con tagPresente=false.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TAG = 'freeze';

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const prova = (args, fallback = null) => {
  try {
    return git(args);
  } catch {
    return fallback;
  }
};

const branch = prova(['rev-parse', '--abbrev-ref', 'HEAD'], '(sconosciuto)');
const tagPresente = prova(['rev-parse', '--verify', `${TAG}^{commit}`]) !== null;

let fileModificati = [];
let minutiTrascorsi = 0;
let note = '';

if (tagPresente) {
  const diff = prova(['diff', '--name-only', `${TAG}...HEAD`], '');
  fileModificati = diff.split('\n').map((s) => s.trim()).filter(Boolean);

  const dataTag = prova(['log', '-1', '--format=%aI', TAG]);
  if (dataTag) {
    minutiTrascorsi = Math.max(
      0,
      Math.round((Date.now() - new Date(dataTag).getTime()) / 60000),
    );
  }
  if (fileModificati.length === 0) {
    note = `Nessuna differenza rispetto al tag ${TAG}: l'esperimento di evoluzione non è ancora partito.`;
  }
  if (branch !== 'evolution-proof') {
    note += ` Attenzione: eseguito su branch "${branch}" invece che su "evolution-proof".`;
  }
} else {
  note =
    `Tag "${TAG}" non ancora creato. Si crea al feature freeze (T+2:45) con: ` +
    `git tag ${TAG}. Poi: git switch -c evolution-proof, si aggiunge la ` +
    `capability con un solo agente, e si rilancia npm run evolution:proof.`;
}

const norm = (p) => p.replace(/\\/g, '/');
const directoryToccate = [
  ...new Set(
    fileModificati.map((f) => {
      const p = norm(f);
      const i = p.lastIndexOf('/');
      return i === -1 ? '(root)' : p.slice(0, i);
    }),
  ),
].sort();

const contratti = fileModificati.filter((f) => norm(f).startsWith('app/types/'));

const evidenza = {
  generatoIl: new Date().toISOString(),
  branch,
  tagRiferimento: TAG,
  tagPresente,
  minutiTrascorsi,
  directoryToccate,
  numeroDirectoryToccate: directoryToccate.length,
  fileModificati,
  numeroFileModificati: fileModificati.length,
  contrattiModificatiDopoFreeze: contratti.length,
  contrattiModificati: contratti,
  note: note.trim(),
};

mkdirSync(join(ROOT, 'presentation', 'evidence'), { recursive: true });
writeFileSync(
  join(ROOT, 'presentation', 'evidence', 'evolution.json'),
  `${JSON.stringify(evidenza, null, 2)}\n`,
  'utf8',
);

console.log(
  `evolution:proof → presentation/evidence/evolution.json\n` +
    `  minuti: ${evidenza.minutiTrascorsi} · directory toccate: ${evidenza.numeroDirectoryToccate} · ` +
    `file: ${evidenza.numeroFileModificati} · CONTRATTI MODIFICATI DOPO IL FREEZE: ${evidenza.contrattiModificatiDopoFreeze}`,
);
