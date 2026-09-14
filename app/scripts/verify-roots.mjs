#!/usr/bin/env node
/**
 * verify:roots — stato delle DUE radici Claude Code.
 * Eseguibile da entrambe le radici: i percorsi sono risolti dal file dello
 * script, non dalla working directory.
 *
 * Risponde a quattro domande:
 *   1. ogni destinazione derivata risolve, ed è allineata alla fonte?
 *   2. i due settings.json contengono entrambi i due hook?
 *   3. .contracts-frozen esiste?
 *   4. che cosa vede ciascuna radice?
 *
 * Esce con 1 se qualcosa non torna, così è usabile in uno script.
 */

import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), '..', '..'));
const problemi = [];
const avvisi = [];

const leggi = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const elenco = (d) => (existsSync(d) ? readdirSync(d).sort() : []);

function tipo(p) {
  if (!existsSync(p)) return 'ASSENTE';
  return lstatSync(p).isSymbolicLink() ? 'symlink' : 'copia';
}

console.log('=== 1. destinazioni derivate ===\n');

/** Confronta una destinazione con la sua fonte. */
function controlla(etichetta, fonte, destinazione) {
  const t = tipo(destinazione);
  if (t === 'ASSENTE') {
    problemi.push(`${etichetta}: destinazione assente (${destinazione})`);
    console.log(`  ASSENTE   ${etichetta}`);
    return;
  }
  if (!existsSync(fonte)) {
    problemi.push(`${etichetta}: fonte assente (${fonte})`);
    console.log(`  FONTE KO  ${etichetta}`);
    return;
  }
  if (t === 'symlink') {
    console.log(`  symlink   ${etichetta}`);
    return;
  }
  const divergente = leggi(fonte) !== leggi(destinazione);
  if (divergente) {
    problemi.push(`${etichetta}: COPIA DIVERGENTE dalla fonte — lancia \`npm run agents:sync\``);
    console.log(`  DIVERGE   ${etichetta}`);
  } else {
    console.log(`  copia ok  ${etichetta}`);
  }
}

// Si controlla ciò che è EFFETTIVAMENTE caricato in ciascuna radice, non
// l'intero catalogo: ogni agente sta in una radice sola, e cercarlo
// nell'altra produrrebbe un falso problema a ogni esecuzione.
for (const n of elenco(join(ROOT, '.claude', 'agents'))) {
  controlla(`.claude/agents/${n}`, join(ROOT, 'agents', n), join(ROOT, '.claude', 'agents', n));
}
for (const n of elenco(join(ROOT, 'app', '.claude', 'agents'))) {
  controlla(
    `app/.claude/agents/${n}`,
    join(ROOT, 'agents', n),
    join(ROOT, 'app', '.claude', 'agents', n),
  );
}
for (const n of elenco(join(ROOT, 'app', '.claude', 'rules'))) {
  controlla(
    `.claude/rules/${n}`,
    join(ROOT, 'app', '.claude', 'rules', n),
    join(ROOT, '.claude', 'rules', n),
  );
}
for (const s of elenco(join(ROOT, 'app', '.claude', 'skills'))) {
  controlla(
    `app/.claude/skills/${s}/SKILL.md`,
    join(ROOT, '.claude', 'skills', s, 'SKILL.md'),
    join(ROOT, 'app', '.claude', 'skills', s, 'SKILL.md'),
  );
}

console.log('\n=== 2. hook nei due settings.json ===\n');

for (const [etichetta, p] of [
  ['root      ', join(ROOT, '.claude', 'settings.json')],
  ['app/      ', join(ROOT, 'app', '.claude', 'settings.json')],
]) {
  if (!existsSync(p)) {
    problemi.push(`${etichetta.trim()}: settings.json assente`);
    console.log(`  ${etichetta} ASSENTE`);
    continue;
  }
  let cfg;
  try {
    cfg = JSON.parse(leggi(p));
  } catch (e) {
    problemi.push(`${etichetta.trim()}: settings.json non è JSON valido — ${e.message}`);
    console.log(`  ${etichetta} JSON NON VALIDO`);
    continue;
  }
  const pre = (cfg.hooks?.PreToolUse ?? []).length;
  const post = (cfg.hooks?.PostToolUse ?? []).length;
  if (pre === 0) problemi.push(`${etichetta.trim()}: manca l'hook PreToolUse`);
  if (post === 0) problemi.push(`${etichetta.trim()}: manca l'hook PostToolUse`);
  const comandi = [...(cfg.hooks?.PreToolUse ?? []), ...(cfg.hooks?.PostToolUse ?? [])]
    .flatMap((g) => g.hooks ?? [])
    .map((h) => h.command);
  for (const c of comandi) {
    const file = c.replace(/^node\s+/, '').trim();
    const assoluto = resolve(ROOT, file.replace(/^\.\.\//, ''));
    if (!existsSync(assoluto)) {
      problemi.push(`${etichetta.trim()}: hook che punta a un file inesistente — ${file}`);
    }
  }
  console.log(`  ${etichetta} PreToolUse: ${pre} · PostToolUse: ${post} · comandi: ${comandi.length}`);
}

console.log('\n=== 3. congelamento dei contratti ===\n');

const congelato = existsSync(join(ROOT, '.contracts-frozen'));
console.log(
  congelato
    ? `  .contracts-frozen ESISTE — le scritture su app/types/ sono bloccate`
    : `  .contracts-frozen non esiste — i contratti si possono ancora modificare`,
);

console.log('\n=== 4. che cosa vede ciascuna radice ===\n');

const skillRoot = elenco(join(ROOT, '.claude', 'skills'));
const skillApp = elenco(join(ROOT, 'app', '.claude', 'skills'));
const agentiRoot = elenco(join(ROOT, '.claude', 'agents'));
const agentiApp = elenco(join(ROOT, 'app', '.claude', 'agents'));

console.log(`  ARCHITETTO   (cd . && claude)`);
console.log(`    agenti: ${agentiRoot.length} — ${agentiRoot.join(', ') || '(nessuno)'}`);
console.log(`    skill:  ${skillRoot.length} — ${skillRoot.join(', ') || '(nessuna)'}`);
console.log(`\n  DEVELOPER    (cd app && claude)`);
console.log(`    agenti: ${agentiApp.length} — ${agentiApp.join(', ') || '(nessuno)'}`);
console.log(`    skill:  ${skillApp.length} — ${skillApp.join(', ') || '(nessuna)'}`);

if (skillApp.includes('nuovo-agente')) {
  problemi.push('app/: `nuovo-agente` è visibile dalla radice del developer, ma è riservata');
}
// L'elenco atteso è quello dichiarato in agents-sync, non un numero fisso:
// un numero scritto a mano qui diventa falso al primo agente aggiunto.
if (agentiApp.length === 0) {
  problemi.push('app/: nessun agente visibile dalla radice del developer');
}

console.log('\n=== esito ===\n');
for (const a of avvisi) console.log(`  avviso:   ${a}`);
for (const p of problemi) console.log(`  PROBLEMA: ${p}`);
if (problemi.length === 0) {
  console.log('  Le due radici sono allineate.');
}
process.exit(problemi.length === 0 ? 0 : 1);
