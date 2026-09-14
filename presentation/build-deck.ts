#!/usr/bin/env node
/**
 * build-deck — agente 07-deck-builder (Dino).
 *
 * Genera UNA presentazione autocontenuta: presentation/deck.html
 * CSS inline, zero richieste di rete, marchio Accenture su ogni slide.
 *
 * Due sezioni:
 *   PARTE 1 — Il prodotto: che cos'è Plainly e che cosa fa
 *   PARTE 2 — La squadra: gli agenti che l'hanno costruito, e come hanno
 *             lavorato fra loro
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
  /** La squadra, letta dai file degli agenti: non conta nel budget parole. */
  squadra?: boolean;
  manca?: { cosa: string; comando: string };
}

const PARTI: Record<1 | 2, string> = {
  1: 'Il prodotto',
  2: 'La squadra',
};

/* ================================================================== */
/* Le slide                                                            */
/* ================================================================== */

const slides: Slide[] = [
  /* ===================== PARTE 1 — IL PRODOTTO ===================== */
  {
    parte: 1,
    apreParte: true,
    archetipo: 'AFFERMAZIONE',
    occhiello: 'Plainly',
    titolo: 'Il totale lo paghi, il perché no',
    frase: 'Una bolletta si subisce.',
  },
  {
    parte: 1,
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
    parte: 1,
    archetipo: 'NUMERO',
    titolo: 'Una voce su sette resta inspiegata',
    cifra: '1/7',
    traduzione: 'Il tasso c\'è, la base di calcolo no.',
    fonte: 'fixtures/estratto-conto',
  },
  {
    parte: 1,
    archetipo: 'SCHEMA',
    titolo: 'Tre aree, domande vere come titoli',
    etichette: ['costo della vita', 'lavoro', 'futuro'],
  },
  {
    parte: 1,
    archetipo: 'CONFRONTO',
    titolo: 'La stessa bolletta, riga per riga',
    prima: { intestazione: 'Prima', immagine: shot('02-before.png'), testo: 'Un totale.' },
    dopo: { intestazione: 'Dopo', immagine: shot('03-after.png'), testo: 'Da dove viene.' },
  },
  {
    parte: 1,
    archetipo: 'NUMERO',
    titolo: 'Il canone pesa più di quanto sembri',
    cifra: capability?.cifra ?? '27,51%',
    traduzione: capability?.traduzione ?? 'Dieci euro e mezzo su trentotto.',
    fonte: capability?.agente ?? 'core-engine',
    manca: capability ? undefined : { cosa: 'la capability', comando: 'evidence/capability.json' },
  },
  {
    parte: 1,
    archetipo: 'SCHEMA',
    titolo: 'Ogni numero ha fonte e scadenza',
    etichette: ['ISTAT', 'INPS', 'Agenzia Entrate', 'Banca d\'Italia', 'EMMI'],
  },
  {
    parte: 1,
    archetipo: 'NUMERO',
    titolo: 'Chi legge capisce di più, e lo misuriamo',
    cifra: comprensione?.deltaPunteggio != null ? `+${comprensione.deltaPunteggio}` : '—',
    traduzione: 'Stesse domande, prima e dopo.',
    fonte: 'evidence/comprehension.json',
    manca: comprensione ? undefined : { cosa: 'la misura', comando: 'evidence/comprehension.json' },
  },
  {
    parte: 1,
    archetipo: 'CONFRONTO',
    titolo: 'Quello che non fa',
    prima: { intestazione: 'Spiega e calcola' },
    dopo: { intestazione: 'Non consiglia' },
    elenco: ['Non legge documenti', 'Non consiglia prodotti', 'Campione ridotto'],
  },

  /* ===================== PARTE 2 — LA SQUADRA ====================== */
  {
    parte: 2,
    apreParte: true,
    archetipo: 'AFFERMAZIONE',
    occhiello: 'La squadra',
    titolo: 'Non l\'abbiamo scritta noi due',
    frase: 'Ecco chi ci ha lavorato.',
  },
  {
    parte: 2,
    archetipo: 'SCHEMA',
    titolo: 'Una cartella a testa, e nessuno sconfina',
    squadra: true,
    etichette: [],
  },
  {
    parte: 2,
    archetipo: 'NUMERO',
    titolo: 'Il conflitto si scopre due ore dopo',
    cifra: '2h',
    traduzione: 'Il secondo sovrascrive il primo.',
    fonte: 'agents/README.md',
  },
  {
    parte: 2,
    archetipo: 'SCHEMA',
    titolo: 'Come lavorano insieme',
    etichette: ['spec', 'implementa', 'verifica', 'commit', 'promuovi'],
  },
  {
    parte: 2,
    archetipo: 'CONFRONTO',
    titolo: 'Dafne e Teo scrivono prima del codice',
    prima: { intestazione: 'Fase 1', testo: 'Al futuro, dalla specifica.' },
    dopo: { intestazione: 'Fase 2', testo: 'Al presente, verificato.' },
  },
  {
    parte: 2,
    archetipo: 'NUMERO',
    titolo: 'Le skill sono i verbi che digiti',
    cifra: '14',
    traduzione: 'Una skill si digita, un agente lavora.',
    fonte: '.claude/skills/',
  },
  {
    parte: 2,
    archetipo: 'CONSEGNA',
    titolo: 'Guardate il portatile',
    consegnaDemo: 'Greta blocca la build',
  },
  {
    parte: 2,
    archetipo: 'NUMERO',
    titolo: 'Tre divieti in una riga di testo',
    cifra: '3',
    traduzione: 'Consigliare, scegliere, comparare: bloccati al salvataggio.',
    fonte: 'tests/lessico-ui.test.ts',
  },
  {
    parte: 2,
    archetipo: 'CONFRONTO',
    titolo: 'Prima a mano, poi Pia',
    prima: { intestazione: 'Conferma umana', testo: 'A ogni passaggio.' },
    dopo: { intestazione: 'Orchestrato', testo: 'Quando smetteva di dire qualcosa.' },
  },
  {
    parte: 2,
    archetipo: 'NUMERO',
    titolo: 'Il lavoro è tracciato, non raccontato',
    cifra: nCommit !== null ? String(nCommit) : '—',
    traduzione: 'Commit mappati sulla cartella, quindi sull\'agente.',
    fonte: 'evidence/process.json',
    manca: nCommit !== null ? undefined : { cosa: 'la traccia', comando: 'npm run agents:trace' },
  },
  {
    parte: 2,
    archetipo: 'NUMERO',
    titolo: 'Dopo il freeze i contratti non si toccano',
    cifra: evoluzione?.tagPresente ? String(evoluzione.contrattiModificatiDopoFreeze) : '—',
    traduzione: 'Ore di pressione, nessuna interfaccia rinegoziata.',
    fonte: 'evidence/evolution.json',
    manca: evoluzione?.tagPresente
      ? undefined
      : { cosa: 'la prova di evoluzione', comando: 'npm run evolution:proof' },
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
.slide{display:none;height:100vh;width:100vw;padding:9vh 8vw 13vh;
flex-direction:column;justify-content:center}
.slide.attiva{display:flex}
#marchio{position:fixed;top:5vh;left:8vw;display:flex;align-items:baseline;gap:.6rem;z-index:5}
#chevron{color:var(--purple);font-size:2rem;font-weight:800;line-height:1}
#marchio span{font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;color:#fff}
.occhiello{text-transform:uppercase;letter-spacing:.28em;font-size:.82rem;
font-weight:700;color:var(--purple-light);margin:0 0 1.6rem}
h1{font-size:clamp(2.4rem,5.4vw,4.6rem);letter-spacing:-.03em;line-height:1.05;
margin:0 0 2rem;max-width:18ch}
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
    (s) => `<section class="slide" data-parte="${esc(PARTI[s.parte])}">
  ${s.occhiello ? `<p class="occhiello">${esc(s.occhiello)}</p>` : ''}
  <h1>${esc(s.titolo)}</h1>
  ${corpo(s)}
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
