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
 * L'impronta dichiarata (`directory:`) resta per cartella intera: cambiare
 * il formato del backlog per farla diventare per-file è un intervento
 * grosso, rinviato di proposito (docs/decisioni.md, D31). Quello che QUESTO
 * script affina è come una cartella dichiarata si traduce in collisione:
 * una cartella elencata in CARTELLE_A_FILE_ESCLUSIVI (sotto) non pesa sulla
 * collisione — perché una specifica **e** un test hanno già provato che ogni
 * task ci aggiunge solo file nuovi — tranne il suo punto di contatto
 * dichiarato, che il PM applica fuori dall'ondata, in un unico passaggio,
 * invece che dentro ogni task. Fuori da quella lista una cartella pesa per
 * intero, come sempre: **può sovrastimare i conflitti, non li sottostima
 * mai** — l'asimmetria è voluta, vedi D31.
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

/* ------------------------------------------- cartelle a file esclusivi */

/**
 * Una cartella qui dentro NON pesa sulla collisione quando un task la
 * dichiara così com'è: i file che ci aggiunge sono nuovi per convenzione, e
 * quella convenzione è **provata** — una specifica l'ha dichiarata e un
 * test la sorveglia — non solo osservata a occhio. Il criterio è alto di
 * proposito: sottostimare una collisione è il guasto silenzioso che questo
 * intero script esiste per impedire, ed è peggio di sovrastimarla. Vedi
 * docs/decisioni.md, D31, anche per i candidati scartati per ora
 * (`src/core/`, `tests/`) e per il motivo per cui restano fuori.
 *
 * `contatto` è il file condiviso che resta: non entra comunque in
 * collisione, perché il PM lo applica fuori dall'ondata, in un solo
 * passaggio dopo che l'ondata è finita — non dentro ogni task.
 */
const CARTELLE_A_FILE_ESCLUSIVI = [
  {
    prefisso: 'src/ui/',
    contatto: 'src/ui/testi.ts',
    fonte: 'docs/features/14-registro-delle-schermate.md, sezione 5; D31',
  },
];

/**
 * Separa l'impronta dichiarata in ciò che pesa sulla collisione
 * (`collisione`) e ciò che è un punto di contatto tollerato, applicato dal
 * PM fuori dall'ondata (`contattiFuoriOnda`). Non tocca `impronta`: quella
 * resta la dichiarazione per intero, per la colonna «Directory toccate» e
 * per il controllo «nessuna directory dichiarata».
 */
function raffinaImpronta(impronta) {
  const collisione = [];
  const contattiFuoriOnda = [];
  for (const voce of impronta) {
    const regola = CARTELLE_A_FILE_ESCLUSIVI.find((r) => r.prefisso === voce);
    if (regola) {
      contattiFuoriOnda.push(regola.contatto);
      continue;
    }
    collisione.push(voce);
  }
  return { collisione, contattiFuoriOnda };
}

const task = leggiTask().map((t) => ({ ...t, ...raffinaImpronta(t.impronta) }));
const perId = new Map(task.map((t) => [t.id, t]));
const fatti = new Set(task.filter((t) => t.stato === 'fatto').map((t) => t.id));

/* -------------------------------------------------------------- ondate */

const collide = (a, b) =>
  a.some((x) => b.some((y) => x.startsWith(y) || y.startsWith(x)));

/**
 * Per un'ondata (elenco di task già ammessi), i punti di contatto tollerati
 * che i suoi task condividono — anche uno solo: il PM deve comunque
 * applicarlo, fuori dall'ondata, in un passaggio unico per tutti quelli che
 * lo toccano insieme.
 */
function contattiCondivisi(ondata) {
  const per = new Map();
  for (const t of ondata) {
    for (const c of t.contattiFuoriOnda) {
      if (!per.has(c)) per.set(c, []);
      per.get(c).push(t.id);
    }
  }
  return [...per.entries()].map(([file, task]) => ({ file, task }));
}

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
    if (collide(t.collisione, occupate)) continue;
    ondata.push(t);
    occupate.push(...t.collisione);
  }

  ondate.push(ondata);
  for (const t of ondata) completati.add(t.id);
  residui = residui.filter((t) => !ondata.includes(t));
}

/* ------------------------------------------------------------- output */

const AVVERTENZA_LIMITE =
  'Il calcolo è per cartella dichiarata. È affinato solo dove una convenzione ' +
  'è stata provata con una specifica e un test (docs/decisioni.md, D31): oggi ' +
  'solo src/ui/. Altrove — src/core/, tests/, types/, fixtures/, ' +
  'src/guardrails/ — resta per cartella intera e può sovrastimare i ' +
  'conflitti reali. Non li sottostima mai: è la direzione sicura.';

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
    contattiFuoriOnda: contattiCondivisi(o),
  })),
  problemi,
  avvertenza: AVVERTENZA_LIMITE,
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
      .map((o, i) => {
        const contatti = contattiCondivisi(o);
        const righeContatti = contatti.length
          ? "\n\n  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: " +
            contatti
              .map((c) => `\`${c.file}\` (${c.task.map((id) => `\`${id}\``).join(', ')})`)
              .join('; ')
          : '';
        return (
          `### Ondata ${i + 1} — ${o.length} in parallelo\n\n` +
          o
            .map((t) => `- \`${t.id}\` ${t.titolo}\n  - tocca: ${t.impronta.map((d) => `\`${d}\``).join(', ')}`)
            .join('\n') +
          righeContatti
        );
      })
      .join('\n\n')
  : '*Nessun task da pianificare.*';

const righeCartelleAffinate = CARTELLE_A_FILE_ESCLUSIVI.length
  ? CARTELLE_A_FILE_ESCLUSIVI.map(
      (r) => `- \`${r.prefisso}\` — punto di contatto \`${r.contatto}\` (${r.fonte})`,
    ).join('\n')
  : '*Nessuna, oggi: ogni cartella dichiarata pesa per intero sulla collisione.*';

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

> Il calcolo è per cartella dichiarata. È affinato solo dove una convenzione
> è stata **provata** con una specifica e un test — oggi solo \`src/ui/\`
> (\`docs/decisioni.md\`, D31): il punto di contatto rimasto,
> \`src/ui/testi.ts\`, non forza l'ondata perché il PM lo applica fuori
> dall'ondata, in un passaggio unico. Altrove il calcolo resta per cartella
> intera e **può sovrastimare** i conflitti reali — non li sottostima mai.

**Cartelle affinate:**

${righeCartelleAffinate}

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
    for (const c of contattiCondivisi(o)) {
      console.log(
        `      contatto fuori onda: ${c.file} <- ${c.task.join(', ')} (lo applica il PM in un passaggio unico, non dentro l'ondata)`,
      );
    }
  }
  const seq = ondate.reduce((a, o) => a + o.length, 0);
  console.log(
    `\n  ${seq} task in ${ondate.length} ondate invece di ${seq} passaggi in fila.`,
  );
}

console.log(`\n  ${piano.avvertenza}`);

if (problemi.length) {
  console.log('\n  PROBLEMI:');
  for (const p of problemi) console.log(`    ${p}`);
  process.exit(1);
}
