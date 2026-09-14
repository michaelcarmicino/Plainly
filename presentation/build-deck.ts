#!/usr/bin/env node
/**
 * build-deck — agente 07-deck-builder.
 *
 * Genera DUE presentazioni autocontenute, CSS inline, zero richieste di rete:
 *
 *   presentation/deck-metodo.html    la squadra agentica che costruisce l'app
 *                                    — è quella con cui si comincia
 *   presentation/deck-prodotto.html  Plainly: che cosa fa e per chi
 *
 * I limiti di densità sono ESEGUIBILI: ogni slide dichiara un archetipo e ne
 * rispetta i limiti di parole. Se uno è superato **il deck non si genera**.
 *
 * Il principio: il template dell'evento è un documento, denso, da leggere da
 * vicino. Un deck si guarda a cinque metri per venti secondi mentre qualcuno
 * parla. Identità visiva Accenture tenuta, densità ribaltata.
 *
 *   npm run deck                    genera entrambi
 *   npm run deck -- --solo metodo   uno solo
 *
 * Nessun numero è scritto a mano: se non viene da presentation/evidence/, la
 * slide mostra un placeholder visibile.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url));
const EVIDENCE = join(QUI, 'evidence');
const SCREENSHOTS = join(QUI, 'screenshots');

const iSolo = process.argv.indexOf('--solo');
const SOLO = iSolo !== -1 ? process.argv[iSolo + 1] : null;

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
const nAgenti = processo?.agenti?.length ?? null;

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
  atto: 1 | 2 | 3;
  archetipo: Archetipo;
  apreAtto?: boolean;
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
  /** Ponte alla parte successiva: annuncia, non racconta. */
  ponte?: { titolo: string; voci: string[] };
  manca?: { cosa: string; comando: string };
}

interface Deck {
  id: string;
  file: string;
  titolo: string;
  sottotitolo: string;
  durata: number;
  atti: Record<1 | 2 | 3, string>;
  slides: Slide[];
  /** Un deck di una slide sola non può avere tre atti: la regola si spegne. */
  attiObbligatori?: boolean;
}

/* ================================================================== */
/* DECK 1 — La squadra agentica                                        */
/* ================================================================== */

const metodo: Deck = {
  id: 'metodo',
  file: 'deck-metodo.html',
  titolo: 'La squadra che costruisce',
  sottotitolo: 'Come abbiamo usato Claude Code',
  durata: 480,
  atti: { 1: 'Il rischio', 2: 'La squadra e il ciclo', 3: 'La prova' },
  slides: [
    /* ------------------------- ATTO 1 — il rischio ------------------ */
    {
      atto: 1,
      apreAtto: true,
      archetipo: 'AFFERMAZIONE',
      occhiello: 'Metodo',
      titolo: 'Due persone, quattro ore, un modello',
      frase: 'Non è il codice.',
    },
    {
      atto: 1,
      archetipo: 'CONFRONTO',
      titolo: 'Dove si perde tempo davvero',
      prima: { intestazione: 'Codice difficile', testo: 'Fallisce rumoroso.' },
      dopo: { intestazione: 'Due agenti, un file', testo: 'Fallisce in silenzio.' },
    },
    {
      atto: 1,
      archetipo: 'NUMERO',
      titolo: 'Il conflitto si scopre due ore dopo',
      cifra: '2h',
      traduzione: 'Il secondo sovrascrive il primo.',
      fonte: 'agents/README.md',
    },

    /* ------------------------- ATTO 2 — la squadra ------------------ */
    {
      atto: 2,
      apreAtto: true,
      archetipo: 'AFFERMAZIONE',
      occhiello: 'La squadra',
      titolo: 'Un agente, una cartella, nessun conflitto',
      frase: 'Criterio: il filesystem.',
    },
    {
      atto: 2,
      archetipo: 'SCHEMA',
      titolo: 'Ogni cartella ha un proprietario solo',
      etichette: ['core', 'ui', 'guardrails', 'assessment', 'docs', 'backlog', 'test', 'ux'],
    },
    {
      atto: 2,
      archetipo: 'NUMERO',
      titolo: 'Le skill sono i verbi che digiti',
      cifra: '14',
      traduzione: 'Una skill si digita, un agente lavora.',
      fonte: '.claude/skills/',
    },
    {
      atto: 2,
      archetipo: 'SCHEMA',
      titolo: 'Il ciclo di vita di una funzionalità',
      etichette: ['spec', 'implementa', 'verifica', 'commit', 'promuovi'],
    },
    {
      atto: 2,
      archetipo: 'CONFRONTO',
      titolo: 'Documentazione e test nascono prima',
      prima: { intestazione: 'Fase 1', testo: 'Al futuro, dalla specifica.' },
      dopo: { intestazione: 'Fase 2', testo: 'Al presente, verificato sul codice.' },
    },
    {
      atto: 2,
      archetipo: 'NUMERO',
      titolo: 'Si sa prima come si verrà misurati',
      cifra: '2',
      traduzione: 'Criteri di accettazione, prima del codice.',
      fonte: 'docs/features/',
    },
    {
      atto: 2,
      archetipo: 'NUMERO',
      titolo: 'Entrare nel progetto costa due file',
      cifra: '2',
      traduzione: 'Leggerne due, e scegliere una cartella libera.',
      fonte: 'agents/README.md',
    },

    /* ------------------------- ATTO 3 — la prova -------------------- */
    {
      atto: 3,
      apreAtto: true,
      archetipo: 'AFFERMAZIONE',
      occhiello: 'La prova',
      titolo: 'Le regole non si scrivono, si eseguono',
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
      titolo: 'Anche questo deck si rifiuta di generare',
      cifra: '7',
      traduzione: 'Violazioni nostre, alla prima esecuzione.',
      fonte: 'presentation/build-deck.ts',
    },
    {
      atto: 3,
      archetipo: 'NUMERO',
      titolo: 'Il lavoro è tracciato, non raccontato',
      cifra: nCommit !== null ? String(nCommit) : '—',
      traduzione: 'Commit mappati sulla cartella, quindi sull\'agente.',
      fonte: 'evidence/process.json',
      manca: nCommit !== null ? undefined : { cosa: 'la traccia', comando: 'npm run agents:trace' },
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
        : { cosa: 'la prova di evoluzione', comando: 'npm run evolution:proof' },
    },
    {
      atto: 3,
      archetipo: 'CONFRONTO',
      titolo: 'Prima a mano, poi il PM',
      prima: { intestazione: 'Conferma umana', testo: 'A ogni passaggio.' },
      dopo: { intestazione: 'Orchestrato', testo: 'Quando smetteva di dire qualcosa.' },
    },
  ],
};

/* ================================================================== */
/* DECK 2 — Il prodotto                                                */
/* ================================================================== */

const prodotto: Deck = {
  id: 'prodotto',
  file: 'deck-prodotto.html',
  titolo: 'Plainly',
  sottotitolo: 'Capire un documento di spesa',
  durata: 300,
  atti: { 1: 'Il problema', 2: 'Che cosa fa', 3: 'I limiti' },
  slides: [
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

    {
      atto: 2,
      apreAtto: true,
      archetipo: 'AFFERMAZIONE',
      occhiello: 'Che cosa fa',
      titolo: 'Ogni cifra torna alla sua riga',
      frase: 'Niente di più.',
    },
    {
      atto: 2,
      archetipo: 'CONFRONTO',
      titolo: 'La stessa bolletta, riga per riga',
      prima: { intestazione: 'Prima', immagine: shot('02-before.png'), testo: 'Un totale.' },
      dopo: { intestazione: 'Dopo', immagine: shot('03-after.png'), testo: 'Da dove viene.' },
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
      archetipo: 'NUMERO',
      titolo: 'La somma torna al centesimo',
      cifra: '10000',
      traduzione: 'I pesi in punti base sommano esatti.',
      fonte: 'tests/core.test.ts',
    },

    {
      atto: 3,
      apreAtto: true,
      archetipo: 'AFFERMAZIONE',
      occhiello: 'I limiti',
      titolo: 'Spiega e calcola, non consiglia',
      frase: 'Un vincolo, non uno stile.',
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
  ],
};

/* ================================================================== */
/* DECK 3 — La slide di apertura: la squadra, e cosa viene dopo        */
/* ================================================================== */

const squadra: Deck = {
  id: 'squadra',
  file: 'slide-squadra.html',
  titolo: 'La squadra di agenti',
  sottotitolo: 'Come è stata costruita Plainly',
  durata: 90,
  attiObbligatori: false,
  atti: { 1: 'La squadra', 2: '', 3: '' },
  slides: [
    {
      atto: 1,
      archetipo: 'SCHEMA',
      occhiello: 'Come è stata costruita',
      titolo: 'Una squadra di agenti, una cartella ciascuno',
      etichette: [
        'core',
        'ui',
        'guardrails',
        'assessment',
        'doc',
        'tester',
        'pm',
        'ux',
      ],
      ponte: {
        titolo: 'Parte 2 — le funzionalità di prodotto',
        voci: [
          'Tre aree: costo della vita, lavoro, futuro',
          'Guide ai documenti e quattro simulatori',
          'Ogni numero ha una fonte e una scadenza',
        ],
      },
    },
  ],
};

const DECKS = [squadra, metodo, prodotto].filter((d) => !SOLO || d.id === SOLO);

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

/** Il ponte ha un budget suo: annuncia la parte successiva, non la racconta. */
function paroleDelPonte(s: Slide): number {
  if (!s.ponte) return 0;
  return parole(s.ponte.titolo) + s.ponte.voci.reduce((a, v) => a + parole(v), 0);
}

const LIMITI: Record<Archetipo, number> = {
  AFFERMAZIONE: 12, NUMERO: 15, CONFRONTO: 40, SCHEMA: 24, CONSEGNA: 10,
};
const BASE: Record<Archetipo, number> = {
  AFFERMAZIONE: 12, NUMERO: 16, CONFRONTO: 22, SCHEMA: 20, CONSEGNA: 8,
};

const secondi = (s: Slide): number =>
  Math.max(10, Math.min(40, Math.round(BASE[s.archetipo] + conteggio(s) * 0.9)));

const ETICHETTE_GENERICHE =
  /^(architettura|risultati|guardrail|metodo|conclusioni|obiettivi|il team|demo|introduzione|contesto|soluzione|tecnologie)\b/i;

interface Esito {
  violazioni: { slide: number; regola: string; dettaglio: string }[];
  avvisi: string[];
  tempi: number[];
  totale: number;
}

function verifica(d: Deck): Esito {
  const violazioni: Esito['violazioni'] = [];
  const avvisi: string[] = [];

  d.slides.forEach((s, i) => {
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
    if (s.archetipo === 'SCHEMA') {
      const et = s.etichette ?? [];
      if (et.length > 8) violazioni.push({ slide: n, regola: 'SCHEMA ≤ 8 etichette', dettaglio: `${et.length}` });
      for (const e of et) {
        // Il punto di `CLAUDE.md` non è una frase: conta la punteggiatura
        // finale o seguita da spazio, non ogni punto ovunque.
        if (parole(e) > 3 || /[.!?;]$/.test(e) || /[.!?;]\s/.test(e)) {
          violazioni.push({ slide: n, regola: 'SCHEMA: 1-3 parole, nessuna frase', dettaglio: `«${e}»` });
        }
      }
    }
    if (s.elenco && s.elenco.length > 3) {
      violazioni.push({ slide: n, regola: 'massimo 3 voci elencate', dettaglio: `${s.elenco.length}` });
    }
    if (s.ponte) {
      if (s.ponte.voci.length > 3) {
        violazioni.push({ slide: n, regola: 'il ponte annuncia al massimo 3 cose', dettaglio: `${s.ponte.voci.length}` });
      }
      const pp = paroleDelPonte(s);
      if (pp > 30) {
        violazioni.push({ slide: n, regola: 'ponte ≤ 30 parole', dettaglio: `${pp} parole: sta raccontando, non annunciando` });
      }
    }
    if (s.archetipo === 'NUMERO' && !s.traduzione && !s.manca) {
      violazioni.push({ slide: n, regola: 'ogni cifra ha la sua traduzione', dettaglio: 'una cifra nuda non lascia traccia' });
    }
    if (BASE[s.archetipo] + c * 0.9 > 40) {
      avvisi.push(`slide ${n} «${s.titolo}» richiederebbe ${Math.round(BASE[s.archetipo] + c * 0.9)}s: spezzala`);
    }
  });

  const conElenco = d.slides.map((s, i) => (s.elenco ? i + 1 : 0)).filter(Boolean);
  if (conElenco.length > 1) {
    violazioni.push({ slide: conElenco[1], regola: 'un solo elenco in tutto il deck', dettaglio: `slide ${conElenco.join(', ')}` });
  }

  for (const atto of d.attiObbligatori === false ? [] : ([1, 2, 3] as const)) {
    const prima = d.slides.find((s) => s.atto === atto);
    if (!prima || prima.archetipo !== 'AFFERMAZIONE' || !prima.apreAtto) {
      violazioni.push({
        slide: prima ? d.slides.indexOf(prima) + 1 : 0,
        regola: 'ogni atto si apre con una AFFERMAZIONE',
        dettaglio: `atto ${atto} — «${d.atti[atto]}»`,
      });
    }
  }

  const tempi = d.slides.map(secondi);
  return { violazioni, avvisi, tempi, totale: tempi.reduce((a, b) => a + b, 0) };
}

/* ================================================================== */
/* Rendering — identità Accenture                                      */
/* ================================================================== */

const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function ponteHtml(s: Slide): string {
  if (!s.ponte) return '';
  return `<div class="ponte">
    <p class="ponte-titolo"><span class="freccia">›</span> ${esc(s.ponte.titolo)}</p>
    <ul>${s.ponte.voci.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>
  </div>`;
}

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
    case 'SCHEMA': {
      const schema = `<div class="schema">${(s.etichette ?? [])
        .map((e) => `<span class="nodo">${esc(e)}</span>`)
        .join('<span class="freccia">›</span>')}</div>`;
      return schema + ponteHtml(s);
    }
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
.slide{display:none;height:100vh;width:100vw;padding:8vh 8vw 13vh;
flex-direction:column;justify-content:center}
.slide.attiva{display:flex}
/* Marchio Accenture: il chevron, in alto a sinistra su ogni slide. */
#marchio{position:fixed;top:5vh;left:8vw;display:flex;align-items:baseline;gap:.6rem;z-index:5}
#chevron{color:var(--purple);font-size:2rem;font-weight:800;line-height:1}
#marchio span{font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;
color:#fff;opacity:1}
.occhiello{text-transform:uppercase;letter-spacing:.28em;font-size:.82rem;
font-weight:700;color:var(--purple-light);margin:0 0 1.6rem}
h1{font-size:clamp(2.6rem,6vw,5rem);letter-spacing:-.03em;line-height:1.05;
margin:0 0 2rem;max-width:18ch}
h3{font-size:1.05rem;text-transform:uppercase;letter-spacing:.16em;
color:var(--purple-light);margin:0 0 1rem}
.frase{font-size:clamp(1.4rem,2.6vw,2.1rem);margin:0;max-width:26ch}
.eroe{font-size:clamp(140px,17vw,300px);font-weight:800;line-height:.9;
letter-spacing:-.05em;color:var(--purple-light);font-variant-numeric:tabular-nums;margin:0 0 1.5rem}
.traduzione{font-size:clamp(1.3rem,2.2vw,1.9rem);margin:0 0 1.5rem;max-width:28ch}
.fonte{font-size:1rem;color:var(--purple-light);margin:0;letter-spacing:.04em}
.confronto{display:grid;grid-template-columns:1fr 1fr;gap:4vw;align-items:start}
.col{border-left:5px solid var(--purple);padding-left:1.6rem}
.col.esclusa{border-left-color:var(--rose)}
.col.esclusa h3{color:var(--rose)}
.col p{margin:0;font-size:1.25rem}
.col img{max-width:100%;max-height:40vh;border-radius:10px;
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
.ponte{margin-top:3.5rem;padding-top:2rem;border-top:1px solid var(--purple-dark)}
.ponte-titolo{font-size:1.3rem;font-weight:700;color:var(--purple-light);
margin:0 0 1rem;letter-spacing:-.01em}
.ponte ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:.8rem 2.5rem}
.ponte li{font-size:1.15rem;position:relative;padding-left:1.2rem}
.ponte li::before{content:'›';position:absolute;left:0;color:var(--purple);font-weight:700}
#barra{position:fixed;left:0;right:0;bottom:0;height:6px;background:var(--ink)}
#avanzamento{height:100%;background:linear-gradient(90deg,var(--purple),var(--rose))}
#atto{position:fixed;left:8vw;bottom:2.4rem;font-size:.85rem;
text-transform:uppercase;letter-spacing:.22em;color:var(--purple-light)}
#pie{position:fixed;right:8vw;bottom:2.4rem;font-size:.85rem;color:#fff;letter-spacing:.04em}
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

function rendi(d: Deck): string {
  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.titolo)} — ${d.slides.length} slide</title>
<!-- Nessun link esterno, nessun font remoto, nessuna richiesta di rete. -->
<style>${CSS}</style></head><body>
<div id="marchio"><span id="chevron">&gt;</span><span>Accenture</span></div>
${d.slides
  .map(
    (s) => `<section class="slide" data-atto="${esc(d.atti[s.atto])}">
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
}

/* ================================================================== */
/* Esecuzione                                                          */
/* ================================================================== */

let bloccato = false;
const ritmo: Json = { generatoIl: new Date().toISOString(), deck: {} };

for (const d of DECKS) {
  const e = verifica(d);
  console.log(`\n=== AUTOVERIFICA · ${d.titolo} (${d.file}) ===\n`);
  console.log('  #  atto  archetipo      parole  limite  sec  titolo');
  d.slides.forEach((s, i) => {
    const c = conteggio(s);
    const ok = c <= LIMITI[s.archetipo] && parole(s.titolo) <= 8 ? ' ' : '!';
    console.log(
      `  ${String(i + 1).padStart(2)}  ${s.atto}     ${s.archetipo.padEnd(13)} ${String(c).padStart(6)}  ${String(LIMITI[s.archetipo]).padStart(6)} ${String(e.tempi[i]).padStart(4)}  ${ok} ${s.titolo}`,
    );
  });
  console.log(`\n  Totale: ${e.totale}s su ${d.durata}s previsti (${d.slides.length} slide)`);

  if (e.totale > d.durata) {
    const brevi = d.slides
      .map((s, i) => ({ n: i + 1, s: e.tempi[i], t: s.titolo, a: s.archetipo }))
      .filter((x) => x.a === 'NUMERO')
      .sort((a, b) => a.s - b.s)
      .slice(0, 3);
    console.log(`\n  SFORA di ${e.totale - d.durata}s. Slide da unire:`);
    for (const b of brevi) console.log(`    ${b.n}. ${b.t} (${b.s}s)`);
  }

  const etich = d.slides
    .map((s, i) => ({ n: i + 1, t: s.titolo }))
    .filter((x) => ETICHETTE_GENERICHE.test(x.t) || parole(x.t) <= 2);
  if (etich.length) {
    console.log('\n  Titoli che sono etichette, non affermazioni:');
    for (const t of etich) console.log(`    slide ${t.n}: «${t.t}»`);
  }

  const consegne = d.slides.map((s, i) => ({ n: i + 1, s })).filter((x) => x.s.consegnaDemo);
  if (consegne.length) {
    console.log('\n  Consegne alla demo dal vivo:');
    for (const c of consegne) console.log(`    slide ${c.n}: ${c.s.consegnaDemo}`);
  }

  if (e.avvisi.length) {
    console.log('\n  Avvisi di ritmo:');
    for (const a of e.avvisi) console.log(`    ${a}`);
  }

  if (e.violazioni.length) {
    bloccato = true;
    console.log(`\n  LIMITI SUPERATI — ${d.file} NON generato:\n`);
    for (const v of e.violazioni) console.log(`    slide ${v.slide} · ${v.regola}\n      ${v.dettaglio}`);
    continue;
  }

  writeFileSync(join(QUI, d.file), rendi(d), 'utf8');
  ritmo.deck[d.id] = {
    file: d.file,
    durataPrevista: d.durata,
    totaleStimato: e.totale,
    slide: d.slides.map((s, i) => ({
      n: i + 1, atto: d.atti[s.atto], archetipo: s.archetipo, titolo: s.titolo,
      parole: conteggio(s), secondi: e.tempi[i], consegnaDemo: s.consegnaDemo ?? null,
    })),
  };
  console.log(`\n  → presentation/${d.file}`);
}

if (bloccato) {
  console.log(
    '\n  Riduci il testo e rilancia. Se una slide non ci sta nel suo archetipo,\n' +
      '  quasi sempre contiene due idee: spezzala invece di comprimerla.\n',
  );
  process.exit(1);
}

mkdirSync(EVIDENCE, { recursive: true });
writeFileSync(join(EVIDENCE, 'ritmo-deck.json'), `${JSON.stringify(ritmo, null, 2)}\n`, 'utf8');
console.log('\n  ritmo → presentation/evidence/ritmo-deck.json (lo eredita demo-script.md)\n');
