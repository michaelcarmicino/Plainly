#!/usr/bin/env node
/**
 * pm:piano — calcola quali task possono girare IN PARALLELO e quali no.
 *
 * Il criterio non è «quanti ne reggiamo»: è **l'assenza di sovrapposizione
 * sul filesystem**. Due task che toccano la stessa directory non possono
 * girare insieme, perché il conflitto fra due agenti che scrivono lo stesso
 * file non dà errore — il secondo sovrascrive il primo, entrambi «hanno
 * finito», e il lavoro perso si scopre molto dopo.
 *
 * Legge app/docs/backlog/NN-*.md, ne ricava l'impronta di directory, e
 * compone delle ONDATE: dentro un'ondata le impronte sono disgiunte, quindi
 * i task si lanciano insieme; fra un'ondata e l'altra si aspetta.
 *
 *   node scripts/pm-piano.mjs                  stampa il piano e rigenera BACKLOG.md
 *   node scripts/pm-piano.mjs --json           il piano in forma strutturata
 *   node scripts/pm-piano.mjs --registra "…"   annota un evento nel registro
 *
 * Deterministico: nessuna euristica, nessun modello. Lo stesso backlog dà
 * sempre lo stesso piano, quindi il piano è verificabile.
 *
 * Agente proprietario: 10-pm.
 */

import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const BACKLOG = join(APP, 'docs', 'backlog');
const INDICE = join(APP, 'docs', 'BACKLOG.md');
const REGISTRO = join(BACKLOG, 'registro.md');

const STATI = ['da-fare', 'in-corso', 'fatto', 'bloccato'];

/* ------------------------------------------------------------ registro */

const iReg = process.argv.indexOf('--registra');
if (iReg !== -1) {
  const evento = process.argv[iReg + 1] ?? '';
  if (!evento) {
    console.log('Uso: --registra "<evento>"');
    process.exit(1);
  }
  mkdirSync(BACKLOG, { recursive: true });
  if (!existsSync(REGISTRO)) {
    writeFileSync(
      REGISTRO,
      '# Registro del PM\n\n' +
        '> Append-only. Ogni riga è un fatto avvenuto, non una previsione.\n' +
        '> Scritto da `/pm`, letto da chi vuole sapere che cosa è successo.\n\n' +
        '| Quando | Evento |\n| --- | --- |\n',
      'utf8',
    );
  }
  appendFileSync(REGISTRO, `| ${new Date().toISOString()} | ${evento.replace(/\|/g, '·')} |\n`, 'utf8');
  console.log(`registrato: ${evento}`);
  process.exit(0);
}

/* ------------------------------------------------------------- lettura */

function campo(testo, nome) {
  // [^\S\n]* e non \s*: \s include l'a capo, quindi un campo vuoto
  // ("dipende-da:" senza valore) si prenderebbe la riga successiva.
  const m = testo.match(new RegExp(`^${nome}:[^\\S\\n]*(.*)$`, 'mi'));
  return m ? m[1].trim() : '';
}

const lista = (v) =>
  v
    .split(/[,\s]+/)
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);

function leggiTask() {
  if (!existsSync(BACKLOG)) return [];
  return readdirSync(BACKLOG)
    .filter((f) => /^\d\d-.+\.md$/.test(f))
    .sort()
    .map((file) => {
      const testo = readFileSync(join(BACKLOG, file), 'utf8').replace(/\r\n/g, '\n');
      const stato = (campo(testo, 'stato') || 'da-fare').toLowerCase();
      return {
        id: campo(testo, 'id') || file.replace(/\.md$/, ''),
        file,
        titolo: (testo.match(/^#\s+(.+)$/m) ?? [, file])[1].trim(),
        stato: STATI.includes(stato) ? stato : 'da-fare',
        // L'impronta: le directory che il task dichiara di toccare.
        // Se manca, il task è NON PIANIFICABILE: senza impronta non si può
        // sapere con chi confligge, e indovinare è il modo di sbagliare.
        impronta: lista(campo(testo, 'directory')),
        dipendeDa: lista(campo(testo, 'dipende-da')),
        note: campo(testo, 'note'),
      };
    });
}

const task = leggiTask();
const perId = new Map(task.map((t) => [t.id, t]));
const fatti = new Set(task.filter((t) => t.stato === 'fatto').map((t) => t.id));

/* -------------------------------------------------------------- ondate */

const collide = (a, b) =>
  a.some((x) => b.some((y) => x.startsWith(y) || y.startsWith(x)));

const problemi = [];
const ondate = [];

let residui = task.filter((t) => t.stato === 'da-fare' || t.stato === 'in-corso');

for (const t of residui) {
  if (t.impronta.length === 0) {
    problemi.push(`${t.id}: nessuna directory dichiarata — non pianificabile`);
  }
  for (const d of t.dipendeDa) {
    if (!perId.has(d)) problemi.push(`${t.id}: dipende da "${d}", che non esiste`);
  }
}

residui = residui.filter((t) => t.impronta.length > 0);
const completati = new Set(fatti);
let guardia = 0;

while (residui.length > 0 && guardia++ < 50) {
  const pronti = residui.filter((t) => t.dipendeDa.every((d) => completati.has(d)));

  if (pronti.length === 0) {
    problemi.push(
      `Dipendenze circolari o irrisolvibili fra: ${residui.map((t) => t.id).join(', ')}`,
    );
    break;
  }

  // Greedy: prendo i pronti in ordine, scartando chi collide con qualcuno
  // già ammesso in questa ondata. Chi resta fuori va nell'ondata successiva.
  const ondata = [];
  const occupate = [];
  for (const t of pronti) {
    if (collide(t.impronta, occupate)) continue;
    ondata.push(t);
    occupate.push(...t.impronta);
  }

  ondate.push(ondata);
  for (const t of ondata) completati.add(t.id);
  residui = residui.filter((t) => !ondata.includes(t));
}

/* ------------------------------------------------------------- output */

const piano = {
  generatoIl: new Date().toISOString(),
  totali: {
    task: task.length,
    daFare: task.filter((t) => t.stato === 'da-fare').length,
    inCorso: task.filter((t) => t.stato === 'in-corso').length,
    fatti: fatti.size,
    bloccati: task.filter((t) => t.stato === 'bloccato').length,
  },
  ondate: ondate.map((o, i) => ({
    numero: i + 1,
    parallele: o.length,
    task: o.map((t) => ({ id: t.id, titolo: t.titolo, impronta: t.impronta })),
  })),
  problemi,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(piano, null, 2));
  process.exit(problemi.length ? 1 : 0);
}

/* --------------------------------------------------------- BACKLOG.md */

const righeStato = task.length
  ? task
      .map(
        (t) =>
          `| \`${t.id}\` | ${t.stato} | ${t.titolo} | ${t.impronta.map((d) => `\`${d}\``).join(', ') || '—'} | ${t.dipendeDa.join(', ') || '—'} |`,
      )
      .join('\n')
  : '| — | — | *(nessun task)* | — | — |';

const righeOndate = ondate.length
  ? ondate
      .map(
        (o, i) =>
          `### Ondata ${i + 1} — ${o.length} in parallelo\n\n` +
          o.map((t) => `- \`${t.id}\` ${t.titolo}\n  - tocca: ${t.impronta.map((d) => `\`${d}\``).join(', ')}`).join('\n'),
      )
      .join('\n\n')
  : '*Nessun task da pianificare.*';

mkdirSync(dirname(INDICE), { recursive: true });
writeFileSync(
  INDICE,
  `# Backlog

> **File generato.** Si rigenera con \`npm run pm:piano\`. Le fonti sono i
> file in \`docs/backlog/\`.
>
> Ultima generazione: ${piano.generatoIl}

## Stato

| Task | Stato | Titolo | Directory toccate | Dipende da |
| --- | --- | --- | --- | --- |
${righeStato}

**Totali** — da fare: ${piano.totali.daFare} · in corso: ${piano.totali.inCorso} · fatti: ${piano.totali.fatti} · bloccati: ${piano.totali.bloccati}

## Piano di esecuzione

Dentro un'ondata le directory sono **disgiunte**: i task si lanciano insieme.
Fra un'ondata e l'altra si aspetta, perché le impronte si sovrappongono.

${righeOndate}

${problemi.length ? `## Problemi\n\n${problemi.map((p) => `- ${p}`).join('\n')}\n` : ''}
Registro di ciò che è successo: [\`backlog/registro.md\`](backlog/registro.md)
`,
  'utf8',
);

console.log(`pm:piano → docs/BACKLOG.md\n`);
console.log(
  `  task: ${piano.totali.task} · da fare ${piano.totali.daFare} · in corso ${piano.totali.inCorso} · fatti ${piano.totali.fatti} · bloccati ${piano.totali.bloccati}`,
);
console.log('');

if (ondate.length === 0) {
  console.log('  Nessun task da pianificare.');
} else {
  for (const [i, o] of ondate.entries()) {
    console.log(`  Ondata ${i + 1} — ${o.length} in parallelo:`);
    for (const t of o) console.log(`    ${t.id.padEnd(20)} ${t.impronta.join(', ')}`);
  }
  const seq = ondate.reduce((a, o) => a + o.length, 0);
  console.log(
    `\n  ${seq} task in ${ondate.length} ondate invece di ${seq} passaggi in fila.`,
  );
}

if (problemi.length) {
  console.log('\n  PROBLEMI:');
  for (const p of problemi) console.log(`    ${p}`);
  process.exit(1);
}
