#!/usr/bin/env node
/**
 * agents:sync — ricrea .claude/agents/ a partire da agents/.
 *
 * La fonte di verità resta SEMPRE agents/, perché è la cartella che la
 * giuria legge. .claude/agents/ è solo il modo in cui Claude Code la vede.
 *
 * Un symlink PER OGNI FILE, mai della cartella intera: agents/README.md e
 * agents/trace.md non hanno frontmatter e Claude Code li scarterebbe con
 * un errore ogni volta.
 *
 * Su Windows senza Developer Mode i symlink richiedono privilegi: in quel
 * caso copia i file e lo dichiara. Meglio una copia che una sincronia rotta.
 */

import { copyFileSync, mkdirSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SORGENTE = join(ROOT, 'agents');
const DEST = join(ROOT, '.claude', 'agents');

mkdirSync(DEST, { recursive: true });

const definizioni = readdirSync(SORGENTE)
  .filter((f) => /^\d\d-.+\.md$/.test(f)) // solo le definizioni numerate
  .sort();

let symlink = 0;
let copie = 0;

for (const nome of definizioni) {
  const dest = join(DEST, nome);
  rmSync(dest, { force: true });
  try {
    symlinkSync(join('..', '..', 'agents', nome), dest, 'file');
    symlink += 1;
  } catch {
    copyFileSync(join(SORGENTE, nome), dest);
    copie += 1;
  }
}

// Rimuove ciò che non corrisponde più a una definizione (agenti rinominati).
for (const nome of readdirSync(DEST)) {
  if (!definizioni.includes(nome)) rmSync(join(DEST, nome), { force: true });
}

console.log(
  `agents:sync → ${definizioni.length} definizioni in .claude/agents/ ` +
    `(${symlink} symlink, ${copie} copie di fallback)`,
);
if (copie > 0) {
  console.log(
    '  Nota: symlink non disponibili su questa macchina (Windows senza Developer Mode).\n' +
      '  I file sono stati COPIATI: rilanciare `npm run agents:sync` dopo ogni modifica ad agents/.',
  );
}
