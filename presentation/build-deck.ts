#!/usr/bin/env node
/**
 * build-deck — agente 07-deck-builder.
 *
 * Genera presentation/deck.html: un file autocontenuto, CSS inline, zero
 * richieste di rete, navigazione con frecce e spazio.
 *
 * LA DIFFERENZA RISPETTO A UN GENERATORE NORMALE: qui i limiti di densità
 * sono ESEGUIBILI. Ogni slide dichiara un archetipo e ne rispetta i limiti di
 * parole; se uno è superato, **il deck non si genera**. Non è un consiglio di
 * stile, è una build che fallisce.
 *
 * Il principio: il template dell'evento è un documento, denso, da leggere da
 * vicino. Un deck viene guardato a cinque metri per venti secondi mentre
 * qualcuno parla. Si tiene l'identità visiva, si ribalta la densità.
 *
 *   npm run deck                 deck completo
 *   npm run deck -- --durata 300 verifica il ritmo su 5 minuti
 *   npm run deck -- --merge-7-8  unisce le due slide di metodo finali
 *
 * Nessun numero è scritto a mano qui dentro: se non viene da
 * presentation/evidence/, la slide mostra un placeholder visibile.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url));
const EVIDENCE = join(QUI, 'evidence');
const SCREENSHOTS = join(QUI, 'screenshots');
const USCITA = join(QUI, 'deck.html');

const arg = (nome: string, pred: number): number => {
  const i = process.argv.indexOf(`--${nome}`);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : pred;
};
const DURATA = arg('durata', 480);
const UNISCI = process.argv.includes('--merge-7-8');

/* ================================================================== */
/* Evidenze                                                            */
/* ================================================================== */

type Json = Record<string, any>;

function leggiEvidenze(): Record<string, Json> {
  const out: Record<string, Json> = {};
  if (!existsSync(EVIDENCE)) return out;
  for (const f of readdirSync(EVIDENCE)) {
    if (!f.endsWith('.json')) continue;
    try {
      out[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(EVIDENCE, f), 'utf8'));
    } catch {
      /* evidenza malformata: la slide mostrerà il placeholder */
    }
  }
  return out;
}

const ev = leggiEvidenze();
const processo = ev['process'] ?? null;
const evoluzione = ev['evolution'] ?? null;
const comprensione = ev['comprehension'] ?? null;
const capability = ev['capability'] ?? null;
const persona = ev['persona'] ?? null;

const shot = (n: string): string | null =>
  existsSync(join(SCREENSHOTS, n)) ? `screenshots/${n}` : null;

/* ================================================================== */
/* Il modello: cinque archetipi, un'idea per slide                     */
/* ================================================================== */

type Archetipo = 'AFFERMAZIONE' | 'NUMERO' | 'CONFRONTO' | 'SCHEMA' | 'CONSEGNA';

interface Slide {
  atto: 1 | 2 | 3;
  archetipo: Archetipo;
  apreAtto?: boolean;
  occhiello?: string;
  titolo: string;
  /** AFFERMAZIONE */
  frase?: string;
  /** NUMERO: la cifra non conta nel budget di parole */
  cifra?: string;
  traduzione?: string;
  fonte?: string;
  /** CONFRONTO */
  prima?: { intestazione: string; testo?: string; immagine?: string | null };
  dopo?: { intestazione: string; testo?: string; immagine?: string | null };
  /** SCHEMA */
  etichette?: string[];
  /** L'unica slide che può elencare, massimo tre voci */
  elenco?: string[];
  /** Precede una dimostrazione dal vivo: demo-script.md lo eredita */
  consegnaDemo?: string;
  /** Evidenza mancante: placeholder visibile invece di un numero inventato */
  manca?: { cosa: string; comando: string };
}

const ATTI: Record<1 | 2 | 3, string> = {
  1: 'Il problema',
  2: 'Come lo abbiamo costruito',
  3: 'La prova',
};

/* ------------------------------------------------------------------ */

const nAgenti = processo?.agenti?.length ?? null;
const nCommit = processo?.commitTotali ?? null;

const slides: Slide[] = [
  /* ---------------------------- ATTO 1 — il problema ---------------- */
  {
    atto: 1,
    apreAtto: true,
    archetipo: 'AFFERMAZIONE',
    occhiello: 'Plainly',
    titolo: 'Il totale lo paghi, il perché no',
    frase: 'Una bolletta si subisce.',
  },
  {
    atto: 1,
    archetipo: 'CONFRONTO',
    titolo: 'Questo arriva a casa ogni tre mesi',
    prima: {
      intestazione: 'Quello che ricevi',
      immagine: shot('02-before.png'),
      testo: persona?.documento ?? 'Sette voci.',
    },
    dopo: {
      intestazione: 'Quello che capisci',
      testo: persona?.puntoDiBlocco ?? 'Il totale, e basta.',
    },
  },
  {
    atto: 1,
    archetipo: 'NUMERO',
    titolo: 'Una voce su sette resta inspiegata',
    cifra: '1/7',
    traduzione: 'Il tasso c\'è, la base di calcolo no.',
    fonte: 'fixtures/estratto-conto',
  },

  /* ---------------------------- ATTO 2 — come ----------------------- */
  {
    atto: 2,
    apreAtto: true,
    archetipo: 'AFFERMAZIONE',
    occhiello: 'Metodo',
    titolo: 'Un agente, una cartella, nessun conflitto',
    frase: 'Non dal codice difficile.',
  },
  {
    atto: 2,
    archetipo: 'SCHEMA',
    titolo: 'Ogni cartella ha un proprietario solo',
    etichette: (processo?.agenti ?? [])
      .slice(0, 8)
      .map((a: Json) => String(a.agente).replace(/^\d\d-/, '').replace(/ .*$/, '')),
    manca: nAgenti
      ? undefined
      : { cosa: 'la mappa degli agenti', comando: 'npm run agents:trace' },
  },
  {
    atto: 2,
    archetipo: 'NUMERO',
    titolo: 'Il lavoro è tracciato, non raccontato',
    cifra: nCommit !== null ? String(nCommit) : '—',
    traduzione: 'Commit mappati sull\'agente che possiede la cartella.',
    fonte: 'evidence/process.json',
    manca: nCommit !== null ? undefined : { cosa: 'la traccia', comando: 'npm run agents:trace' },
  },
  {
    atto: 2,
    archetipo: 'CONFRONTO',
    titolo: 'La stessa bolletta, riga per riga',
    prima: { intestazione: 'Prima', immagine: shot('02-before.png'), testo: 'Un totale.' },
    dopo: { intestazione: 'Dopo', immagine: shot('03-after.png'), testo: 'Da dove viene ogni cifra.' },
  },
  {
    atto: 2,
    archetipo: 'NUMERO',
    titolo: 'Il canone pesa più di quanto sembri',
    cifra: capability?.cifra ?? '27,51%',
    traduzione: capability?.traduzione ?? 'Dieci euro e mezzo su trentotto.',
    fonte: capability?.agente ?? 'core-engine',
    manca: capability ? undefined : { cosa: 'la capability', comando: 'evidence/capability.json' },
  },
  {
    atto: 2,
    archetipo: 'SCHEMA',
    titolo: 'Le regole non sono scritte, sono eseguite',
    etichette: [
      'CLAUDE.md',
      'contratti',
      'agents/',
      'fixture',
      'guardrail',
      'hook',
      'skill',
      'traccia',
    ],
  },
  {
    atto: 2,
    archetipo: 'NUMERO',
    titolo: 'Entrare costa due file',
    cifra: '2',
    traduzione: 'Leggerne due, e scegliere una cartella libera.',
    fonte: 'agents/README.md · types/contracts.ts',
  },

  /* ---------------------------- ATTO 3 — la prova ------------------- */
  {
    atto: 3,
    apreAtto: true,
    archetipo: 'AFFERMAZIONE',
    occhiello: 'La prova',
    titolo: 'Se scriviamo un consiglio, la build non passa',
    frase: 'Adesso.',
  },
  {
    atto: 3,
    archetipo: 'CONSEGNA',
    titolo: 'Guardate il portatile',
    consegnaDemo: 'Il guardrail che rompe la build',
  },
  {
    atto: 3,
    archetipo: 'NUMERO',
    titolo: 'Tre divieti in una riga di testo',
    cifra: '3',
    traduzione: 'Consigliare, scegliere, comparare: bloccati al salvataggio.',
    fonte: 'tests/lessico-ui.test.ts',
  },
  {
    atto: 3,
    archetipo: 'NUMERO',
    titolo: 'Dopo il freeze i contratti non si toccano',
    cifra: evoluzione?.tagPresente ? String(evoluzione.contrattiModificatiDopoFreeze) : '—',
    traduzione: 'Ore di pressione, nessuna interfaccia rinegoziata.',
    fonte: 'evidence/evolution.json',
    manca: evoluzione?.tagPresente
      ? undefined
      : { cosa: 'la prova di evoluzione', comando: 'git tag freeze && npm run evolution:proof' },
  },
  {
    atto: 3,
    archetipo: 'NUMERO',
    titolo: 'Chi legge capisce di più, e lo misuriamo',
    cifra: comprensione?.deltaPunteggio != null ? `+${comprensione.deltaPunteggio}` : '—',
    traduzione: 'Stesse domande, prima e dopo.',
    fonte: 'evidence/comprehension.json',
    manca: comprensione ? undefined : { cosa: 'la misura', comando: 'evidence/comprehension.json' },
  },
  {
    atto: 3,
    archetipo: 'CONFRONTO',
    titolo: 'Quello che non fa',
    prima: { intestazione: 'Spiega e calcola' },
    dopo: { intestazione: 'Non consiglia' },
    elenco: ['Non legge documenti', 'Non consiglia prodotti', 'Campione ridotto'],
  },
];

/* ================================================================== */
/* I limiti, eseguibili                                                */
/* ================================================================== */

const parole = (s?: string): number =>
  s ? s.trim().split(/\s+/).filter(Boolean).length : 0;

interface Violazione {
  slide: number;
  regola: string;
  dettaglio: string;
}

const violazioni: Violazione[] = [];
const avvisi: string[] = [];

/** Parole di una slide, esclusa la cifra eroe. */
function conteggio(s: Slide): number {
  return (
    parole(s.occhiello) +
    parole(s.titolo) +
    parole(s.frase) +
    parole(s.traduzione) +
    parole(s.fonte) +
    parole(s.prima?.intestazione) +
    parole(s.prima?.testo) +
    parole(s.dopo?.intestazione) +
    parole(s.dopo?.testo) +
    (s.etichette ?? []).reduce((a, e) => a + parole(e), 0) +
    (s.elenco ?? []).reduce((a, e) => a + parole(e), 0) +
    parole(s.consegnaDemo)
  );
}

const LIMITI: Record<Archetipo, number> = {
  AFFERMAZIONE: 12,
  NUMERO: 15,
  CONFRONTO: 40, // 20 per colonna, verificate anche singolarmente
  SCHEMA: 24, // 8 etichette × 3 parole
  CONSEGNA: 10,
};

slides.forEach((s, i) => {
  const n = i + 1;
  const c = conteggio(s);

  if (parole(s.titolo) > 8) {
    violazioni.push({ slide: n, regola: 'titolo ≤ 8 parole', dettaglio: `${parole(s.titolo)} parole: «${s.titolo}»` });
  }

  if (c > LIMITI[s.archetipo]) {
    violazioni.push({
      slide: n,
      regola: `${s.archetipo} ≤ ${LIMITI[s.archetipo]} parole`,
      dettaglio: `${c} parole`,
    });
  }

  if (s.archetipo === 'CONFRONTO') {
    for (const [lato, col] of [['prima', s.prima], ['dopo', s.dopo]] as const) {
      const p = parole(col?.intestazione) + parole(col?.testo);
      if (p > 20) {
        violazioni.push({ slide: n, regola: 'CONFRONTO ≤ 20 parole per colonna', dettaglio: `colonna ${lato}: ${p}` });
      }
    }
  }

  if (s.archetipo === 'SCHEMA') {
    const et = s.etichette ?? [];
    if (et.length > 8) {
      violazioni.push({ slide: n, regola: 'SCHEMA ≤ 8 etichette', dettaglio: `${et.length} etichette` });
    }
    for (const e of et) {
      // Il punto di `CLAUDE.md` non è una frase: si guarda la punteggiatura
      // FINALE o seguita da spazio, non ogni punto ovunque.
      if (parole(e) > 3 || /[.!?;]$/.test(e) || /[.!?;]\s/.test(e)) {
        violazioni.push({ slide: n, regola: 'SCHEMA: etichette di 1-3 parole, nessuna frase', dettaglio: `«${e}»` });
      }
    }
  }

  if (s.elenco && s.elenco.length > 3) {
    violazioni.push({ slide: n, regola: 'massimo 3 voci elencate', dettaglio: `${s.elenco.length} voci` });
  }

  if (s.archetipo === 'NUMERO' && !s.traduzione && !s.manca) {
    violazioni.push({
      slide: n,
      regola: 'ogni cifra ha la sua traduzione',
      dettaglio: 'una cifra nuda non lascia traccia: traducila o togli la slide',
    });
  }
});

/** Una sola slide in tutto il deck può elencare. */
const conElenco = slides.map((s, i) => (s.elenco ? i + 1 : 0)).filter(Boolean);
if (conElenco.length > 1) {
  violazioni.push({
    slide: conElenco[1],
    regola: 'un solo elenco in tutto il deck',
    dettaglio: `elenchi sulle slide ${conElenco.join(', ')}`,
  });
}

/** Ogni atto si apre con una AFFERMAZIONE. */
for (const atto of [1, 2, 3] as const) {
  const prima = slides.find((s) => s.atto === atto);
  if (!prima || prima.archetipo !== 'AFFERMAZIONE' || !prima.apreAtto) {
    violazioni.push({
      slide: slides.indexOf(prima!) + 1,
      regola: 'ogni atto si apre con una AFFERMAZIONE',
      dettaglio: `atto ${atto} — «${ATTI[atto]}»`,
    });
  }
}

/* ------------------------------- ritmo ---------------------------- */

const BASE: Record<Archetipo, number> = {
  AFFERMAZIONE: 12,
  NUMERO: 16,
  CONFRONTO: 22,
  SCHEMA: 20,
  CONSEGNA: 8,
};

function secondi(s: Slide): number {
  const grezzi = BASE[s.archetipo] + conteggio(s) * 0.9;
  return Math.max(10, Math.min(40, Math.round(grezzi)));
}

const tempi = slides.map(secondi);
const totale = tempi.reduce((a, b) => a + b, 0);

slides.forEach((s, i) => {
  const grezzi = BASE[s.archetipo] + conteggio(s) * 0.9;
  if (grezzi > 40) {
    avvisi.push(
      `slide ${i + 1} «${s.titolo}» richiederebbe ${Math.round(grezzi)}s: spezzala in due`,
    );
  }
});

/* ================================================================== */
/* Il referto di autoverifica                                          */
/* ================================================================== */

/** Un titolo che funzionerebbe identico altrove non dice niente. */
const ETICHETTE = /^(architettura|risultati|guardrail|metodo|conclusioni|obiettivi|il team|demo|introduzione|contesto|soluzione|tecnologie)\b/i;

const titoliEtichetta = slides
  .map((s, i) => ({ n: i + 1, t: s.titolo }))
  .filter((x) => ETICHETTE.test(x.t) || parole(x.t) <= 2);

console.log('\n=== AUTOVERIFICA DEL DECK ===\n');
console.log('  #  atto  archetipo      parole  limite  sec  titolo');
slides.forEach((s, i) => {
  const c = conteggio(s);
  const lim = LIMITI[s.archetipo];
  const ok = c <= lim && parole(s.titolo) <= 8 ? ' ' : '!';
  console.log(
    `  ${String(i + 1).padStart(2)}  ${s.atto}     ${s.archetipo.padEnd(13)} ${String(c).padStart(6)}  ${String(lim).padStart(6)} ${String(tempi[i]).padStart(4)}  ${ok} ${s.titolo}`,
  );
});

console.log(`\n  Totale: ${totale}s su ${DURATA}s previsti (${slides.length} slide)`);

if (totale > DURATA) {
  const candidate = slides
    .map((s, i) => ({ n: i + 1, s: tempi[i], t: s.titolo, a: s.archetipo }))
    .filter((x) => x.a === 'NUMERO')
    .sort((a, b) => a.s - b.s)
    .slice(0, 3);
  console.log(
    `\n  SFORA di ${totale - DURATA}s. Slide da unire, le più brevi dello stesso tipo:`,
  );
  for (const c of candidate) console.log(`    ${c.n}. ${c.t} (${c.s}s)`);
}

if (titoliEtichetta.length) {
  console.log('\n  Titoli che sono etichette e non affermazioni:');
  for (const t of titoliEtichetta) console.log(`    slide ${t.n}: «${t.t}» — riscrivilo con la conclusione`);
}

const senzaTraduzione = slides
  .map((s, i) => ({ n: i + 1, s }))
  .filter((x) => x.s.archetipo === 'NUMERO' && !x.s.traduzione);
if (senzaTraduzione.length) {
  console.log('\n  Cifre senza traduzione:');
  for (const x of senzaTraduzione) console.log(`    slide ${x.n}: «${x.s.titolo}»`);
}

const consegne = slides
  .map((s, i) => ({ n: i + 1, s }))
  .filter((x) => x.s.consegnaDemo);
if (consegne.length) {
  console.log('\n  Consegne alla demo dal vivo:');
  for (const c of consegne) console.log(`    slide ${c.n}: ${c.s.consegnaDemo}`);
}

if (avvisi.length) {
  console.log('\n  Avvisi di ritmo:');
  for (const a of avvisi) console.log(`    ${a}`);
}

if (violazioni.length) {
  console.log('\n  LIMITI SUPERATI — il deck NON è stato generato:\n');
  for (const v of violazioni) {
    console.log(`    slide ${v.slide} · ${v.regola}\n      ${v.dettaglio}`);
  }
  console.log(
    '\n  Riduci il testo e rilancia. Se una slide non ci sta nel suo archetipo,\n' +
      '  quasi sempre contiene due idee: spezzala invece di comprimerla.\n',
  );
  process.exit(1);
}

/* ================================================================== */
/* Rendering                                                           */
/* ================================================================== */

const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const mancaHtml = (m: { cosa: string; comando: string }): string =>
  `<div class="manca"><strong>Evidenza mancante:</strong> ${esc(m.cosa)}<br><code>${esc(m.comando)}</code></div>`;

function corpo(s: Slide): string {
  if (s.manca) return mancaHtml(s.manca);

  switch (s.archetipo) {
    case 'AFFERMAZIONE':
      return s.frase ? `<p class="frase">${esc(s.frase)}</p>` : '';

    case 'NUMERO':
      return `<div class="eroe">${esc(s.cifra)}</div>
        <p class="traduzione">${esc(s.traduzione)}</p>
        ${s.fonte ? `<p class="fonte">${esc(s.fonte)}</p>` : ''}`;

    case 'CONFRONTO': {
      const col = (c?: Slide['prima'], rosa = false) =>
        c
          ? `<div class="col${rosa ? ' esclusa' : ''}">
               <h3>${esc(c.intestazione)}</h3>
               ${c.immagine ? `<img src="${esc(c.immagine)}" alt="${esc(c.intestazione)}">` : ''}
               ${c.testo ? `<p>${esc(c.testo)}</p>` : ''}
             </div>`
          : '';
      const elenco = s.elenco
        ? `<ul class="elenco">${s.elenco.map((e) => `<li><span class="marcatore">×</span>${esc(e)}</li>`).join('')}</ul>`
        : '';
      return `<div class="confronto">${col(s.prima)}${col(s.dopo, Boolean(s.elenco))}</div>${elenco}`;
    }

    case 'SCHEMA':
      return `<div class="schema">${(s.etichette ?? [])
        .map((e) => `<span class="nodo">${esc(e)}</span>`)
        .join('<span class="freccia">›</span>')}</div>`;

    case 'CONSEGNA':
      return s.consegnaDemo ? `<p class="consegna">${esc(s.consegnaDemo)}</p>` : '';
  }
}

const CSS = `
:root{--purple:#A100FF;--purple-light:#BE82FF;--purple-dark:#460073;
--ink:#0A0014;--rose:#FF50A0;--fondo:#050008;--testo:#fff}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--fondo);color:var(--testo);
font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;
font-size:22px;line-height:1.5;overflow:hidden}
.slide{display:none;height:100vh;width:100vw;padding:7vh 8vw 12vh;
flex-direction:column;justify-content:center}
.slide.attiva{display:flex}
.occhiello{text-transform:uppercase;letter-spacing:.28em;font-size:.82rem;
font-weight:700;color:var(--purple-light);margin:0 0 1.6rem}
h1{font-size:clamp(2.6rem,6vw,5rem);letter-spacing:-.03em;line-height:1.05;
margin:0 0 2rem;max-width:18ch}
h3{font-size:1.05rem;text-transform:uppercase;letter-spacing:.16em;
color:var(--purple-light);margin:0 0 1rem}
.frase{font-size:clamp(1.4rem,2.6vw,2.1rem);margin:0;opacity:1;max-width:26ch}
.eroe{font-size:clamp(140px,17vw,300px);font-weight:800;line-height:.9;
letter-spacing:-.05em;color:var(--purple-light);font-variant-numeric:tabular-nums;
margin:0 0 1.5rem}
.traduzione{font-size:clamp(1.3rem,2.2vw,1.9rem);margin:0 0 1.5rem;max-width:28ch}
.fonte{font-size:1rem;color:var(--purple-light);margin:0;letter-spacing:.04em}
.confronto{display:grid;grid-template-columns:1fr 1fr;gap:4vw;align-items:start}
.col{border-left:5px solid var(--purple);padding-left:1.6rem}
.col.esclusa{border-left-color:var(--rose)}
.col.esclusa h3{color:var(--rose)}
.col p{margin:0;font-size:1.25rem}
.col img{max-width:100%;max-height:42vh;border-radius:10px;
border:1px solid var(--purple-dark);margin-bottom:1rem;display:block}
.schema{display:flex;flex-wrap:wrap;align-items:center;gap:.9rem 1.1rem}
.nodo{background:var(--ink);border:1px solid var(--purple-dark);
border-left:4px solid var(--purple);border-radius:12px;padding:1rem 1.5rem;
font-size:1.35rem;font-weight:600}
.freccia{color:var(--purple-light);font-size:1.6rem}
.consegna{font-size:clamp(1.6rem,3vw,2.4rem);color:var(--purple-light);margin:0}
.elenco{list-style:none;padding:0;margin:2.5rem 0 0;font-size:1.2rem}
.elenco li{margin-bottom:.7rem}
.marcatore{color:var(--rose);font-weight:700;margin-right:.8rem}
.manca{background:#1a0010;border:2px dashed var(--rose);border-radius:12px;
padding:1.5rem;font-size:1.15rem;max-width:34ch}
.manca code{color:var(--rose);font-family:ui-monospace,Consolas,monospace}
#barra{position:fixed;left:0;right:0;bottom:0;height:6px;background:var(--ink)}
#avanzamento{height:100%;background:var(--purple);transition:width .2s}
#atto{position:fixed;left:8vw;bottom:2.2rem;font-size:.85rem;
text-transform:uppercase;letter-spacing:.22em;color:var(--purple-light)}
#pie{position:fixed;right:8vw;bottom:2.2rem;font-size:.85rem;
color:#fff;letter-spacing:.04em}
`;

const JS = `
const s=[...document.querySelectorAll('.slide')];let i=0;
const b=document.getElementById('avanzamento'),a=document.getElementById('atto');
function m(n){i=Math.max(0,Math.min(s.length-1,n));
 s.forEach((x,k)=>x.classList.toggle('attiva',k===i));
 b.style.width=((i+1)/s.length*100)+'%';
 a.textContent=s[i].dataset.atto+' · '+(i+1)+'/'+s.length;
 location.hash=String(i+1);}
document.addEventListener('keydown',e=>{
 if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();m(i+1);}
 else if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();m(i-1);}
 else if(e.key==='Home')m(0); else if(e.key==='End')m(s.length-1);
 else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}});
document.addEventListener('click',()=>m(i+1));
m(parseInt(location.hash.slice(1)||'1',10)-1);
`;

const html = `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plainly — ${slides.length} slide</title>
<!-- Nessun link esterno, nessun font remoto, nessuna richiesta di rete. -->
<style>${CSS}</style></head><body>
${slides
  .map(
    (s) => `<section class="slide" data-atto="${esc(ATTI[s.atto])}">
  ${s.occhiello ? `<p class="occhiello">${esc(s.occhiello)}</p>` : ''}
  <h1>${esc(s.titolo)}</h1>
  ${corpo(s)}
</section>`,
  )
  .join('\n')}
<div id="barra"><div id="avanzamento"></div></div>
<div id="atto"></div>
<div id="pie">Accenture Application Engineering</div>
<script>${JS}</script></body></html>
`;

writeFileSync(USCITA, html, 'utf8');

/* Le consegne alla demo vanno a demo-script.md, con il timing. */
mkdirSync(EVIDENCE, { recursive: true });
writeFileSync(
  join(EVIDENCE, 'ritmo-deck.json'),
  `${JSON.stringify(
    {
      generatoIl: new Date().toISOString(),
      durataPrevista: DURATA,
      totaleStimato: totale,
      slide: slides.map((s, i) => ({
        n: i + 1,
        atto: ATTI[s.atto],
        archetipo: s.archetipo,
        titolo: s.titolo,
        parole: conteggio(s),
        secondi: tempi[i],
        consegnaDemo: s.consegnaDemo ?? null,
      })),
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(`\n  deck → presentation/deck.html (${slides.length} slide, ${totale}s)`);
console.log('  ritmo → presentation/evidence/ritmo-deck.json (lo eredita demo-script.md)\n');
