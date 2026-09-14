#!/usr/bin/env node
/**
 * build-deck — agente 07-deck-builder (Dino).
 *
 * Genera UNA presentazione autocontenuta: presentation/deck.html
 * CSS inline, zero richieste di rete, marchio Accenture su ogni slide.
 *
 * Due sezioni, entrambe sul prodotto:
 *   PARTE 1 — L'app: che cos'è Plainly e a che cosa serve
 *   PARTE 2 — Le funzionalità: che cosa fa, e che cosa è ancora previsto
 *
 * REGOLA CHE VALE PIÙ DI TUTTE: il deck non afferma cose che non esistono.
 * Una slide che descrive qualcosa di non ancora costruito porta il marcatore
 * `previsto`, visibile a schermo. Una cifra senza evidenza mostra un
 * placeholder con il comando che la produrrebbe, non un numero plausibile.
 *
 * I limiti di densità sono ESEGUIBILI: ogni slide dichiara un archetipo e ne
 * rispetta il budget di parole. Se uno è superato **il deck non si genera**.
 *
 * Il principio: il template dell'evento è un documento, denso, da leggere da
 * vicino. Un deck si guarda a cinque metri per venti secondi mentre qualcuno
 * parla. Identità visiva tenuta, densità ribaltata.
 *
 * Nessun numero è scritto a mano: se non viene da presentation/evidence/, la
 * slide mostra un placeholder visibile.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, '..');
const EVIDENCE = join(QUI, 'evidence');
const SCREENSHOTS = join(QUI, 'screenshots');
const USCITA = join(QUI, 'deck.html');

const arg = (nome: string, pred: number): number => {
  const i = process.argv.indexOf(`--${nome}`);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : pred;
};
const DURATA = arg('durata', 600);

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

const nCommit = processo?.commitTotali ?? null;

/**
 * La squadra si legge dai file degli agenti: nome proprio e ruolo stanno nel
 * frontmatter, quindi la slide che presenta il team non è scritta a mano e non
 * può divergere da chi esiste davvero.
 */
function leggiSquadra(): { persona: string; ruolo: string }[] {
  const dir = join(RADICE, 'agents');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d\d-.+\.md$/.test(f))
    .sort()
    .map((f) => {
      const t = readFileSync(join(dir, f), 'utf8');
      return {
        persona: (t.match(/^persona:\s*(.+)$/m) ?? [, ''])[1].trim(),
        ruolo: (t.match(/^name:\s*(.+)$/m) ?? [, f])[1].trim(),
      };
    })
    .filter((a) => a.persona && a.ruolo);
}

const SQUADRA = leggiSquadra();

/** Quante skill esistono davvero: contate, non affermate. */
const N_SKILL = existsSync(join(RADICE, '.claude', 'skills'))
  ? readdirSync(join(RADICE, '.claude', 'skills')).filter((d) =>
      existsSync(join(RADICE, '.claude', 'skills', d, 'SKILL.md')),
    ).length
  : 0;

/** Le schermate prima/dopo esistono? Se no, la slide lo dice. */
const SCHERMATE = Boolean(shot('02-before.png') && shot('03-after.png'));

/* ================================================================== */
/* Il modello: cinque archetipi, un'idea per slide                     */
/* ================================================================== */

type Archetipo = 'AFFERMAZIONE' | 'NUMERO' | 'CONFRONTO' | 'SCHEMA' | 'CONSEGNA';

interface Colonna {
  intestazione: string;
  testo?: string;
  immagine?: string | null;
}

interface Slide {
  parte: 1 | 2;
  archetipo: Archetipo;
  apreParte?: boolean;
  occhiello?: string;
  titolo: string;
  frase?: string;
  cifra?: string;
  traduzione?: string;
  fonte?: string;
  prima?: Colonna;
  dopo?: Colonna;
  etichette?: string[];
  elenco?: string[];
  consegnaDemo?: string;
  /** Descrive qualcosa che NON è ancora costruito: va marcato a schermo. */
  previsto?: boolean;
  /** La squadra, letta dai file degli agenti: non conta nel budget parole. */
  squadra?: boolean;
  manca?: { cosa: string; comando: string };
}

const PARTI: Record<1 | 2, string> = {
  1: 'L\'app',
  2: 'Le funzionalità',
};

/* ================================================================== */
/* Le slide                                                            */
/* ================================================================== */

const slides: Slide[] = [
  /* ===================== PARTE 1 — L'APP =========================== */
  {
    parte: 1,
    apreParte: true,
    archetipo: 'AFFERMAZIONE',
    occhiello: 'Plainly',
    titolo: 'Ti spiega il documento che hai in mano',
    frase: 'Riga per riga.',
  },
  {
    parte: 1,
    archetipo: 'CONFRONTO',
    titolo: 'Quello che arriva, e quello che resta',
    prima: { intestazione: 'Il documento', testo: 'Sette voci, un totale.' },
    dopo: { intestazione: 'Quello che capisci', testo: 'Il totale, e basta.' },
  },
  {
    parte: 1,
    archetipo: 'AFFERMAZIONE',
    titolo: 'Spiega e calcola. Non consiglia',
    frase: 'È un vincolo, non uno stile.',
  },

  /* ===================== PARTE 2 — LE FUNZIONALITÀ ================= */
  {
    parte: 2,
    apreParte: true,
    archetipo: 'AFFERMAZIONE',
    occhiello: 'Le funzionalità',
    titolo: 'Una domanda vera per ogni pagina',
    frase: 'Mai un termine solo.',
  },
  {
    parte: 2,
    archetipo: 'CONFRONTO',
    titolo: 'La stessa bolletta, riga per riga',
    prima: { intestazione: 'Prima', immagine: shot('02-before.png'), testo: 'Un totale.' },
    dopo: { intestazione: 'Dopo', immagine: shot('03-after.png'), testo: 'Da dove viene.' },
    manca: SCHERMATE
      ? undefined
      : { cosa: 'le schermate prima e dopo', comando: 'npm run capture' },
  },
  {
    parte: 2,
    archetipo: 'NUMERO',
    titolo: 'Il canone pesa più di quanto sembri',
    cifra: capability?.cifra ?? '—',
    traduzione: capability?.traduzione ?? 'Il peso di una voce sul totale.',
    fonte: 'evidence/capability.json',
    manca: capability
      ? undefined
      : { cosa: 'il calcolo reale', comando: 'il core non calcola ancora' },
  },
  {
    parte: 2,
    previsto: true,
    archetipo: 'SCHEMA',
    titolo: 'Tre aree, e le domande che le aprono',
    etichette: ['costo della vita', 'lavoro', 'futuro'],
  },
  {
    parte: 2,
    previsto: true,
    archetipo: 'SCHEMA',
    titolo: 'Guide ai documenti che ricevi davvero',
    etichette: ['busta paga', 'bolletta', '730'],
  },
  {
    parte: 2,
    previsto: true,
    archetipo: 'SCHEMA',
    titolo: 'Quattro simulatori, formule vere',
    etichette: ['inflazione', 'busta paga', 'emergenza', 'mutuo'],
  },
  {
    parte: 2,
    previsto: true,
    archetipo: 'SCHEMA',
    titolo: 'Ogni numero ha fonte e scadenza',
    etichette: ['ISTAT', 'INPS', 'Agenzia Entrate', 'Banca d\'Italia', 'EMMI'],
  },
  {
    parte: 2,
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

const parole = (s?: string): number => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

function conteggio(s: Slide): number {
  return (
    parole(s.occhiello) + parole(s.titolo) + parole(s.frase) + parole(s.traduzione) +
    parole(s.fonte) + parole(s.prima?.intestazione) + parole(s.prima?.testo) +
    parole(s.dopo?.intestazione) + parole(s.dopo?.testo) +
    (s.etichette ?? []).reduce((a, e) => a + parole(e), 0) +
    (s.elenco ?? []).reduce((a, e) => a + parole(e), 0) + parole(s.consegnaDemo)
  );
}

const LIMITI: Record<Archetipo, number> = {
  AFFERMAZIONE: 12, NUMERO: 15, CONFRONTO: 40, SCHEMA: 24, CONSEGNA: 10,
};
const BASE: Record<Archetipo, number> = {
  AFFERMAZIONE: 12, NUMERO: 16, CONFRONTO: 22, SCHEMA: 20, CONSEGNA: 8,
};

const secondi = (s: Slide): number =>
  Math.max(10, Math.min(40, Math.round(BASE[s.archetipo] + conteggio(s) * 0.9 + (s.squadra ? 14 : 0))));

const ETICHETTE_GENERICHE =
  /^(architettura|risultati|guardrail|metodo|conclusioni|obiettivi|il team|demo|introduzione|contesto|soluzione|tecnologie)\b/i;

const violazioni: { slide: number; regola: string; dettaglio: string }[] = [];
const avvisi: string[] = [];

slides.forEach((s, i) => {
  const n = i + 1;
  const c = conteggio(s);

  if (parole(s.titolo) > 8) {
    violazioni.push({ slide: n, regola: 'titolo ≤ 8 parole', dettaglio: `${parole(s.titolo)}: «${s.titolo}»` });
  }
  if (c > LIMITI[s.archetipo]) {
    violazioni.push({ slide: n, regola: `${s.archetipo} ≤ ${LIMITI[s.archetipo]} parole`, dettaglio: `${c} parole` });
  }
  if (s.archetipo === 'CONFRONTO') {
    for (const [lato, col] of [['prima', s.prima], ['dopo', s.dopo]] as const) {
      const p = parole(col?.intestazione) + parole(col?.testo);
      if (p > 20) violazioni.push({ slide: n, regola: 'CONFRONTO ≤ 20 parole per colonna', dettaglio: `${lato}: ${p}` });
    }
  }
  if (s.archetipo === 'SCHEMA' && !s.squadra) {
    const et = s.etichette ?? [];
    if (et.length > 8) violazioni.push({ slide: n, regola: 'SCHEMA ≤ 8 etichette', dettaglio: `${et.length}` });
    for (const e of et) {
      // Il punto di `CLAUDE.md` non è una frase: conta la punteggiatura finale
      // o seguita da spazio, non ogni punto ovunque.
      if (parole(e) > 3 || /[.!?;]$/.test(e) || /[.!?;]\s/.test(e)) {
        violazioni.push({ slide: n, regola: 'SCHEMA: 1-3 parole, nessuna frase', dettaglio: `«${e}»` });
      }
    }
  }
  if (s.elenco && s.elenco.length > 3) {
    violazioni.push({ slide: n, regola: 'massimo 3 voci elencate', dettaglio: `${s.elenco.length}` });
  }
  if (s.archetipo === 'NUMERO' && !s.traduzione && !s.manca) {
    violazioni.push({ slide: n, regola: 'ogni cifra ha la sua traduzione', dettaglio: 'una cifra nuda non lascia traccia' });
  }
  if (BASE[s.archetipo] + c * 0.9 > 40) {
    avvisi.push(`slide ${n} «${s.titolo}» richiederebbe ${Math.round(BASE[s.archetipo] + c * 0.9)}s: spezzala`);
  }
});

const conElenco = slides.map((s, i) => (s.elenco ? i + 1 : 0)).filter(Boolean);
if (conElenco.length > 1) {
  violazioni.push({ slide: conElenco[1], regola: 'un solo elenco in tutto il deck', dettaglio: `slide ${conElenco.join(', ')}` });
}

// Ogni parte si apre con una AFFERMAZIONE che la annuncia.
for (const parte of [...new Set(slides.map((s) => s.parte))].sort()) {
  const prima = slides.find((s) => s.parte === parte);
  if (!prima || prima.archetipo !== 'AFFERMAZIONE' || !prima.apreParte) {
    violazioni.push({
      slide: prima ? slides.indexOf(prima) + 1 : 0,
      regola: 'ogni parte si apre con una AFFERMAZIONE',
      dettaglio: `parte ${parte} — «${PARTI[parte]}»`,
    });
  }
}

if (slides.some((s) => s.squadra) && SQUADRA.length === 0) {
  violazioni.push({
    slide: slides.findIndex((s) => s.squadra) + 1,
    regola: 'la squadra si legge dai file degli agenti',
    dettaglio: 'nessun agente con `persona:` trovato in agents/',
  });
}

const tempi = slides.map(secondi);
const totale = tempi.reduce((a, b) => a + b, 0);

/* ================================================================== */
/* Autoverifica                                                        */
/* ================================================================== */

console.log('\n=== AUTOVERIFICA · Plainly (deck.html) ===\n');
console.log('  #  parte  archetipo      parole  limite  sec  titolo');
slides.forEach((s, i) => {
  const c = conteggio(s);
  const ok = c <= LIMITI[s.archetipo] && parole(s.titolo) <= 8 ? ' ' : '!';
  console.log(
    `  ${String(i + 1).padStart(2)}   ${s.parte}     ${s.archetipo.padEnd(13)} ${String(c).padStart(6)}  ${String(LIMITI[s.archetipo]).padStart(6)} ${String(tempi[i]).padStart(4)}  ${ok} ${s.titolo}`,
  );
});
console.log(`\n  Totale: ${totale}s su ${DURATA}s previsti (${slides.length} slide)`);
console.log(`  Parte 1 — ${PARTI[1]}: ${slides.filter((s) => s.parte === 1).length} slide`);
console.log(`  Parte 2 — ${PARTI[2]}: ${slides.filter((s) => s.parte === 2).length} slide`);
console.log(`  Squadra letta da agents/: ${SQUADRA.map((a) => a.persona).join(', ') || '(nessuna)'}`);

if (totale > DURATA) {
  const brevi = slides
    .map((s, i) => ({ n: i + 1, s: tempi[i], t: s.titolo, a: s.archetipo }))
    .filter((x) => x.a === 'NUMERO')
    .sort((a, b) => a.s - b.s)
    .slice(0, 3);
  console.log(`\n  SFORA di ${totale - DURATA}s. Slide da unire:`);
  for (const b of brevi) console.log(`    ${b.n}. ${b.t} (${b.s}s)`);
}

const etich = slides
  .map((s, i) => ({ n: i + 1, t: s.titolo }))
  .filter((x) => ETICHETTE_GENERICHE.test(x.t) || parole(x.t) <= 2);
if (etich.length) {
  console.log('\n  Titoli che sono etichette, non affermazioni:');
  for (const t of etich) console.log(`    slide ${t.n}: «${t.t}»`);
}

const consegne = slides.map((s, i) => ({ n: i + 1, s })).filter((x) => x.s.consegnaDemo);
if (consegne.length) {
  console.log('\n  Consegne alla demo dal vivo:');
  for (const c of consegne) console.log(`    slide ${c.n}: ${c.s.consegnaDemo}`);
}

if (avvisi.length) {
  console.log('\n  Avvisi di ritmo:');
  for (const a of avvisi) console.log(`    ${a}`);
}

if (violazioni.length) {
  console.log('\n  LIMITI SUPERATI — deck.html NON generato:\n');
  for (const v of violazioni) console.log(`    slide ${v.slide} · ${v.regola}\n      ${v.dettaglio}`);
  console.log(
    '\n  Riduci il testo e rilancia. Se una slide non ci sta nel suo archetipo,\n' +
      '  quasi sempre contiene due idee: spezzala invece di comprimerla.\n',
  );
  process.exit(1);
}

/* ================================================================== */
/* Rendering — identità Accenture                                      */
/* ================================================================== */

const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function corpo(s: Slide): string {
  if (s.manca) {
    return `<div class="manca"><strong>Evidenza mancante:</strong> ${esc(s.manca.cosa)}<br><code>${esc(s.manca.comando)}</code></div>`;
  }
  switch (s.archetipo) {
    case 'AFFERMAZIONE':
      return s.frase ? `<p class="frase">${esc(s.frase)}</p>` : '';
    case 'NUMERO':
      return `<div class="eroe">${esc(s.cifra)}</div><p class="traduzione">${esc(s.traduzione)}</p>${
        s.fonte ? `<p class="fonte">${esc(s.fonte)}</p>` : ''
      }`;
    case 'CONFRONTO': {
      const col = (c: Colonna | undefined, rosa = false) =>
        c
          ? `<div class="col${rosa ? ' esclusa' : ''}"><h3>${esc(c.intestazione)}</h3>${
              c.immagine ? `<img src="${esc(c.immagine)}" alt="${esc(c.intestazione)}">` : ''
            }${c.testo ? `<p>${esc(c.testo)}</p>` : ''}</div>`
          : '';
      const el = s.elenco
        ? `<ul class="elenco">${s.elenco.map((e) => `<li><span class="marcatore">×</span>${esc(e)}</li>`).join('')}</ul>`
        : '';
      return `<div class="confronto">${col(s.prima)}${col(s.dopo, Boolean(s.elenco))}</div>${el}`;
    }
    case 'SCHEMA':
      if (s.squadra) {
        return `<div class="squadra">${SQUADRA.map(
          (a) =>
            `<div class="membro"><span class="nome">${esc(a.persona)}</span><span class="ruolo">${esc(a.ruolo)}</span></div>`,
        ).join('')}</div>`;
      }
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
.slide{display:none;height:100vh;width:100vw;padding:14vh 7vw 14vh;position:relative}
.slide.attiva{display:flex;flex-direction:column;justify-content:center}
/* Le slide di contenuto usano DUE COLONNE: titolo a sinistra, contenuto a
   destra. A colonna singola metà schermo resta nera e la slide sembra non
   finita — che a cinque metri si legge come sciatteria, non come rigore. */
.slide.due-colonne.attiva{display:grid;grid-template-columns:1fr 1fr;
align-items:center;column-gap:5vw;align-content:center}
.slide.due-colonne .testa{align-self:center}
.slide.due-colonne h1{margin-bottom:0;max-width:none}
.corpo{min-width:0}
/* Le slide che aprono una parte hanno una massa di colore: senza, a cinque
   metri sono indistinguibili da tutte le altre e il cambio di sezione non
   si vede. Il chevron grande è il marchio, non una decorazione. */
.slide.apre::after{content:'>';position:absolute;right:4vw;bottom:6vh;
font-size:46vh;font-weight:800;line-height:.8;color:var(--purple);
opacity:.16;pointer-events:none;z-index:0}
.slide.apre::before{content:'';position:absolute;left:0;top:0;bottom:0;
width:1.2vw;background:linear-gradient(180deg,var(--purple),var(--rose))}
.slide.apre h1{font-size:clamp(3rem,7vw,6rem)}
.slide.apre .frase{font-size:clamp(1.7rem,3.2vw,2.6rem);color:var(--purple-light)}
.slide > *{position:relative;z-index:1}
#marchio{position:fixed;top:5vh;left:8vw;display:flex;align-items:baseline;gap:.6rem;z-index:5}
#chevron{color:var(--purple);font-size:2rem;font-weight:800;line-height:1}
#marchio span{font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;color:#fff}
.occhiello{text-transform:uppercase;letter-spacing:.28em;font-size:.9rem;
font-weight:700;color:var(--purple-light);margin:0 0 1.2rem;
padding-bottom:.9rem;border-bottom:2px solid var(--purple);display:inline-block}
h1{font-size:clamp(2.6rem,5.6vw,4.8rem);letter-spacing:-.03em;line-height:1.03;
margin:0 0 1.8rem;max-width:17ch;text-wrap:balance}
h3{font-size:1.05rem;text-transform:uppercase;letter-spacing:.16em;
color:var(--purple-light);margin:0 0 1rem}
.frase{font-size:clamp(1.4rem,2.6vw,2.1rem);margin:0;max-width:26ch}
.eroe{font-size:clamp(140px,16vw,280px);font-weight:800;line-height:.9;
letter-spacing:-.05em;color:var(--purple-light);font-variant-numeric:tabular-nums;margin:0 0 1.5rem}
.traduzione{font-size:clamp(1.3rem,2.2vw,1.9rem);margin:0 0 1.5rem;max-width:28ch}
.fonte{font-size:1rem;color:var(--purple-light);margin:0;letter-spacing:.04em}
.confronto{display:grid;grid-template-columns:1fr 1fr;gap:4vw;align-items:start}
.col{border-left:5px solid var(--purple);padding-left:1.6rem}
.col.esclusa{border-left-color:var(--rose)}
.col.esclusa h3{color:var(--rose)}
.col p{margin:0;font-size:1.25rem}
.col img{max-width:100%;max-height:38vh;border-radius:10px;
border:1px solid var(--purple-dark);margin-bottom:1rem;display:block}
.schema{display:flex;flex-wrap:wrap;align-items:center;gap:.9rem 1.1rem}
.nodo{background:var(--ink);border:1px solid var(--purple-dark);
border-left:4px solid var(--purple);border-radius:12px;padding:1rem 1.5rem;
font-size:1.35rem;font-weight:600}
.freccia{color:var(--purple-light);font-size:1.6rem}
.squadra{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem 1.6rem}
.membro{background:var(--ink);border:1px solid var(--purple-dark);
border-left:4px solid var(--purple);border-radius:12px;padding:.9rem 1.3rem;
display:flex;flex-direction:column;gap:.15rem}
.membro .nome{font-size:1.5rem;font-weight:800;letter-spacing:-.02em}
.membro .ruolo{font-size:.95rem;color:var(--purple-light)}
/* Marcatore di ciò che non è ancora costruito: rosa, come tutto
   ciò che è escluso o limitato. Deve vedersi a cinque metri. */
.previsto{display:inline-block;vertical-align:middle;margin-left:1rem;
background:var(--rose);color:var(--ink);font-size:.9rem;font-weight:800;
text-transform:uppercase;letter-spacing:.16em;padding:.3em .8em;border-radius:6px;
line-height:1}
.consegna{font-size:clamp(1.6rem,3vw,2.4rem);color:var(--purple-light);margin:0}
.elenco{list-style:none;padding:0;margin:2.5rem 0 0;font-size:1.2rem}
.elenco li{margin-bottom:.7rem}
.marcatore{color:var(--rose);font-weight:700;margin-right:.8rem}
.manca{background:#1a0010;border:2px dashed var(--rose);border-radius:12px;
padding:1.5rem;font-size:1.15rem;max-width:34ch}
.manca code{color:var(--rose);font-family:ui-monospace,Consolas,monospace}
#barra{position:fixed;left:0;right:0;bottom:0;height:6px;background:var(--ink)}
#avanzamento{height:100%;background:linear-gradient(90deg,var(--purple),var(--rose))}
#parte{position:fixed;left:8vw;bottom:2.4rem;font-size:.85rem;
text-transform:uppercase;letter-spacing:.22em;color:var(--purple-light)}
#pie{position:fixed;right:8vw;bottom:2.4rem;font-size:.85rem;color:#fff;letter-spacing:.04em}
`;

const JS = `
const s=[...document.querySelectorAll('.slide')];let i=0;
const b=document.getElementById('avanzamento'),p=document.getElementById('parte');
function m(n){i=Math.max(0,Math.min(s.length-1,n));
 s.forEach((x,k)=>x.classList.toggle('attiva',k===i));
 b.style.width=((i+1)/s.length*100)+'%';
 p.textContent=s[i].dataset.parte+' · '+(i+1)+'/'+s.length;
 location.hash=String(i+1);}
document.addEventListener('keydown',e=>{
 if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();m(i+1);}
 else if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();m(i-1);}
 else if(e.key==='Home')m(0); else if(e.key==='End')m(s.length-1);
 else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();}});
document.addEventListener('click',()=>m(i+1));
// Senza questo, aprire il deck su #5 dopo essere stati su #1 non fa niente:
// il documento non si ricarica e la slide resta quella di prima.
window.addEventListener('hashchange',()=>m(parseInt(location.hash.slice(1)||'1',10)-1));
m(parseInt(location.hash.slice(1)||'1',10)-1);
`;

const html = `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plainly — ${slides.length} slide</title>
<!-- Nessun link esterno, nessun font remoto, nessuna richiesta di rete. -->
<style>${CSS}</style></head><body>
<div id="marchio"><span id="chevron">&gt;</span><span>Accenture</span></div>
${slides
  .map(
    (s) => `<section class="slide${s.apreParte ? ' apre' : ' due-colonne'}" data-parte="${esc(PARTI[s.parte])}">
  <div class="testa">
    ${s.occhiello ? `<p class="occhiello">${esc(s.occhiello)}</p>` : ''}
    <h1>${esc(s.titolo)}${s.previsto ? '<span class="previsto">previsto</span>' : ''}</h1>
  </div>
  <div class="corpo">${corpo(s)}</div>
</section>`,
  )
  .join('\n')}
<div id="barra"><div id="avanzamento"></div></div>
<div id="parte"></div>
<div id="pie">Accenture Application Engineering</div>
<script>${JS}</script></body></html>
`;

writeFileSync(USCITA, html, 'utf8');

mkdirSync(EVIDENCE, { recursive: true });
writeFileSync(
  join(EVIDENCE, 'ritmo-deck.json'),
  `${JSON.stringify(
    {
      generatoIl: new Date().toISOString(),
      durataPrevista: DURATA,
      totaleStimato: totale,
      squadra: SQUADRA,
      slide: slides.map((s, i) => ({
        n: i + 1, parte: PARTI[s.parte], archetipo: s.archetipo, titolo: s.titolo,
        parole: conteggio(s), secondi: tempi[i], consegnaDemo: s.consegnaDemo ?? null,
      })),
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(`\n  → presentation/deck.html (${slides.length} slide, ${totale}s)`);
console.log('  ritmo → presentation/evidence/ritmo-deck.json (lo eredita demo-script.md)\n');
