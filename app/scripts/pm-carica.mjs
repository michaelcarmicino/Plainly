#!/usr/bin/env node
/**
 * pm:carica — porta task grezzi nel formato del backlog.
 *
 * Il problema che risolve: i task arrivano come vengono — una lista incollata,
 * un appunto, un file buttato in una cartella. Chiederli già nel formato
 * giusto significa che non li scrive nessuno.
 *
 *   node scripts/pm-carica.mjs                     normalizza docs/backlog/_in-arrivo/
 *   node scripts/pm-carica.mjs --file a.md b.md    percorsi espliciti, ovunque siano
 *   node scripts/pm-carica.mjs --testo "a; b; c"   una riga per task, separati da ; o a capo
 *   node scripts/pm-carica.mjs --controlla         non scrive: dice solo cosa manca
 *
 * Fa SOLO la parte deterministica: numerazione progressiva, slug, scheletro,
 * spostamento dell'originale. **Non inventa l'impronta**: il campo `directory`
 * resta vuoto e viene segnalato, perché indovinare con chi un task confligge
 * è il modo di produrre esattamente il conflitto che il PM esiste per evitare.
 *
 * Agente proprietario: 10-pm.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const BACKLOG = join(APP, 'docs', 'backlog');
const ARRIVO = join(BACKLOG, '_in-arrivo');
const ARCHIVIO = join(ARRIVO, '_normalizzati');

const SOLO_CONTROLLO = process.argv.includes('--controlla');
const iTesto = process.argv.indexOf('--testo');
const TESTO = iTesto !== -1 ? (process.argv[iTesto + 1] ?? '') : '';

mkdirSync(ARRIVO, { recursive: true });

/** Aree note: un suggerimento, MAI una decisione automatica. */
const INDIZI = [
  { re: /calcol|somma|quadratur|percentual|peso|proiezion|arrotond|import/i, dir: 'src/core/' },
  { re: /schermat|interfacc|layout|grafic|tabell|colore|testo a schermo|mobile|responsive/i, dir: 'src/ui/' },
  { re: /lessic|prescritt|guardrail|consigli/i, dir: 'src/guardrails/' },
  { re: /comprension|questionar|punteggi|prima e dopo|misur/i, dir: 'src/assessment/' },
];

const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .slice(0, 5)
    .join('-') || 'task';

function prossimoNumero() {
  const esistenti = readdirSync(BACKLOG)
    .filter((f) => /^\d\d-.+\.md$/.test(f))
    .map((f) => Number(f.slice(0, 2)));
  return (esistenti.length ? Math.max(...esistenti) : 0) + 1;
}

/** Ogni riga non vuota e non di intestazione è un task. */
function daTesto(testo) {
  return testo
    .split(/[;\n]/)
    .map((r) => r.replace(/^\s*[-*\d.)\]]+\s*/, '').trim())
    .filter((r) => r.length > 2 && !r.startsWith('#'));
}

/* ------------------------------------------------------------ raccolta */

const grezzi = [];

if (TESTO) {
  for (const t of daTesto(TESTO)) grezzi.push({ titolo: t, origine: '--testo' });
}

/** Percorsi espliciti: --file a.md b.md … (fino al prossimo --opzione). */
const iFile = process.argv.indexOf('--file');
const PERCORSI = [];
if (iFile !== -1) {
  for (let k = iFile + 1; k < process.argv.length; k += 1) {
    if (process.argv[k].startsWith('--')) break;
    PERCORSI.push(process.argv[k]);
  }
}

for (const p of PERCORSI) {
  const assoluto = isAbsolute(p) ? p : join(APP, p);
  if (!existsSync(assoluto)) {
    console.log(`  non trovato, saltato: ${p}`);
    continue;
  }
  const testo = readFileSync(assoluto, 'utf8');
  const righe = daTesto(testo);
  if (righe.length === 0) continue;
  const titolo = (testo.match(/^#\s+(.+)$/m) ?? [])[1];
  if (titolo) grezzi.push({ titolo, corpo: testo, origine: p });
  else for (const r of righe) grezzi.push({ titolo: r, origine: p });
}

for (const f of readdirSync(ARRIVO).filter((x) => /\.(md|txt)$/i.test(x))) {
  const testo = readFileSync(join(ARRIVO, f), 'utf8');
  const righe = daTesto(testo);
  if (righe.length === 0) continue;
  // Un file con più righe = più task; con una riga sola = un task.
  const titolo = (testo.match(/^#\s+(.+)$/m) ?? [])[1];
  if (titolo && righe.length > 1) {
    grezzi.push({ titolo, corpo: testo, origine: f });
  } else {
    for (const r of righe) grezzi.push({ titolo: r, origine: f });
  }
}

if (grezzi.length === 0) {
  console.log('Nessun task da caricare.');
  console.log(`  Metti un file in docs/backlog/_in-arrivo/, oppure usa --testo "a; b; c".`);
  process.exit(0);
}

/* ---------------------------------------------------------- scrittura */

let n = prossimoNumero();
const creati = [];
const senzaImpronta = [];

for (const g of grezzi) {
  const id = `${String(n).padStart(2, '0')}-${slug(g.titolo)}`;
  const indizio = INDIZI.find((i) => i.re.test(g.titolo + ' ' + (g.corpo ?? '')));
  const dir = indizio ? indizio.dir : '';

  const contenuto = `id: ${id}
stato: da-fare
directory: ${dir}
dipende-da:
note: ${indizio ? 'impronta PROPOSTA da pm:carica, da confermare sulla specifica' : 'impronta da definire'}

# ${g.titolo}

## Obiettivo

${g.titolo}

## Specifica collegata

Da scrivere con \`/spec\`. L'impronta definitiva si ricava da lì.

## Note

Caricato da \`pm:carica\` (origine: ${g.origine}).
${
  indizio
    ? `L'impronta \`${dir}\` è **proposta**, non decisa: confermala sulla specifica prima di pianificare.`
    : `**Impronta mancante**: questo task non è pianificabile finché \`directory\` non è compilata.`
}
`;

  if (!SOLO_CONTROLLO) {
    writeFileSync(join(BACKLOG, `${id}.md`), contenuto, 'utf8');
  }
  creati.push({ id, titolo: g.titolo, dir, proposta: Boolean(indizio) });
  if (!indizio) senzaImpronta.push(id);
  n += 1;
}

/* ------------------------------------------- archivio degli originali */

if (!SOLO_CONTROLLO) {
  const daSpostare = readdirSync(ARRIVO).filter((x) => /\.(md|txt)$/i.test(x));
  if (daSpostare.length) {
    mkdirSync(ARCHIVIO, { recursive: true });
    for (const f of daSpostare) {
      renameSync(join(ARRIVO, f), join(ARCHIVIO, `${Date.now()}-${f}`));
    }
  }
}

/* -------------------------------------------------------------- esito */

console.log(
  SOLO_CONTROLLO
    ? `pm:carica --controlla · ${creati.length} task riconosciuti, nessuno scritto\n`
    : `pm:carica → ${creati.length} task in docs/backlog/\n`,
);

for (const c of creati) {
  const nota = c.dir
    ? `${c.dir}  (proposta, da confermare)`
    : 'IMPRONTA MANCANTE — non pianificabile';
  console.log(`  ${c.id.padEnd(26)} ${nota}`);
}

console.log('');

if (senzaImpronta.length) {
  console.log(
    `  ${senzaImpronta.length} task senza impronta. Non vengono indovinati: indovinare\n` +
      `  con chi un task confligge produce esattamente il conflitto che il PM\n` +
      `  esiste per evitare. Compila \`directory\`, o passa prima da /spec.\n`,
  );
}

console.log('  Poi:  npm run pm:piano');
process.exit(senzaImpronta.length ? 1 : 0);
