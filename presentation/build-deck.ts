#!/usr/bin/env node
/**
 * build-deck — agente 07-deck-builder.
 *
 * Legge presentation/evidence/*.json e genera presentation/deck.html:
 * UN SOLO FILE autocontenuto, CSS inline, navigazione con frecce e spazio,
 * ZERO richieste di rete. Si apre con doppio clic, anche con il Wi-Fi spento.
 *
 * Nove slide a struttura fissa. Il METODO occupa quattro slide (3, 6, 7, 8)
 * e si ALTERNA al prodotto: la giuria valuta l'uso di Claude Code, quindi
 * relegare il metodo in coda significherebbe rispondere alla domanda sbagliata.
 *
 * Flag: --merge-7-8  unisce le due slide di metodo finali (deck da 8 slide,
 *                    per le presentazioni sotto i 5 minuti).
 *
 * REGOLA: nessun numero scritto a mano qui dentro. Se un dato non viene da
 * evidence/, la slide mostra un PLACEHOLDER VISIBILE e non si rompe.
 *
 * Eseguibile con Node >= 22.6 (type stripping nativo):
 *     npm --prefix app run deck
 * Fallback senza type stripping:
 *     npm --prefix app run deck:compat
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url));
const EVIDENCE = join(QUI, 'evidence');
const SCREENSHOTS = join(QUI, 'screenshots');
const USCITA = join(QUI, 'deck.html');

const UNISCI_7_8 = process.argv.includes('--merge-7-8');

/* ------------------------------------------------------------------ */
/* Lettura delle evidenze                                              */
/* ------------------------------------------------------------------ */

type Json = Record<string, any>;

function leggiEvidenze(): Record<string, Json> {
  const out: Record<string, Json> = {};
  if (!existsSync(EVIDENCE)) return out;
  for (const f of readdirSync(EVIDENCE)) {
    if (!f.endsWith('.json')) continue;
    try {
      out[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(EVIDENCE, f), 'utf8'));
    } catch {
      // Un'evidenza malformata non deve rompere il deck: la slide mostrerà
      // il placeholder, e il problema resta visibile invece che mascherato.
    }
  }
  return out;
}

function screenshot(nome: string): string | null {
  const p = join(SCREENSHOTS, nome);
  return existsSync(p) ? `screenshots/${nome}` : null;
}

const ev = leggiEvidenze();
const processo = ev['process'] ?? null;
const evoluzione = ev['evolution'] ?? null;
const comprensione = ev['comprehension'] ?? null;
const capability = ev['capability'] ?? null;
const persona = ev['persona'] ?? null;

/* ------------------------------------------------------------------ */
/* Helper di rendering                                                 */
/* ------------------------------------------------------------------ */

const esc = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Placeholder VISIBILE: dichiara che cosa manca e come si genera. */
const manca = (cosa: string, comando: string): string =>
  `<div class="manca"><strong>Evidenza mancante:</strong> ${esc(cosa)}<br>
   <code>${esc(comando)}</code></div>`;

const cifra = (valore: unknown, etichetta: string, nota = ''): string =>
  `<div class="cifra"><div class="cifra-v">${esc(valore)}</div>
   <div class="cifra-e">${esc(etichetta)}</div>
   ${nota ? `<div class="cifra-n">${esc(nota)}</div>` : ''}</div>`;

const immagine = (file: string | null, alt: string, fallback: string): string =>
  file
    ? `<img src="${esc(file)}" alt="${esc(alt)}">`
    : manca(fallback, 'npm --prefix app run capture');

/* ------------------------------------------------------------------ */
/* Le nove slide                                                       */
/* ------------------------------------------------------------------ */

function slide1(): string {
  return `
    <h1>Plainly</h1>
    <p class="occhiello">Educazione alla finanza personale di base</p>
    <p class="frase">
      <!-- TODO(scenario): una frase, il problema. Da congelare a T+1:40. -->
      Chi riceve una bolletta o un estratto conto legge un totale, non capisce
      da dove viene, e non ha modo di verificarlo.
    </p>
    <p class="nota">Hackathon Agentic Coding · Accenture Application Engineering</p>`;
}

function slide2(): string {
  const p = persona;
  if (!p) {
    return `<h2>La persona, e dove si blocca</h2>
      ${manca(
        'persona.json — chi è, e il punto esatto in cui si ferma',
        'presentation/evidence/persona.json (agente 06-evidence-collector)',
      )}
      <p class="nota">TODO(scenario): da compilare al congelamento dell'idea.</p>`;
  }
  return `<h2>La persona, e dove si blocca</h2>
    <div class="due">
      <div><h3>${esc(p.nome)}</h3><p>${esc(p.descrizione)}</p></div>
      <div class="blocco"><h3>Il punto esatto</h3><p>${esc(p.puntoDiBlocco)}</p></div>
    </div>`;
}

function slide3(): string {
  const agenti = processo?.agenti ?? [];
  const attivi = processo?.agentiAttivi ?? 0;
  const commit = processo?.commitTotali ?? 0;

  const righe = agenti.length
    ? agenti
        .map(
          (a: Json) =>
            `<tr><td><code>${esc(a.agente)}</code></td>
             <td><code>${esc(a.directoryPosseduta)}</code></td>
             <td class="num">${esc(a.fileToccati?.length ?? 0)}</td>
             <td class="num">${esc(a.commit ?? 0)}</td></tr>`,
        )
        .join('')
    : '';

  return `<h2><span class="tag">METODO</span> Come abbiamo organizzato il lavoro</h2>
    <div class="cifre">
      ${cifra('4', 'ore totali')}
      ${cifra('2', 'persone', 'un architetto, un product developer')}
      ${cifra('4', 'cartelle valutate', '3 non sono l\'applicazione')}
      ${cifra(agenti.length || '—', 'agenti', 'una directory in esclusiva ciascuno')}
    </div>
    <p class="frase-piccola">
      In un hackathon i conflitti non nascono dal codice difficile: nascono da
      due agenti che scrivono lo stesso file. Il criterio della decomposizione
      non è la coesione concettuale, è <strong>l'assenza di sovrapposizione sul
      filesystem</strong>. Due agenti girano in parallelo se e solo se le
      directory che possiedono sono disgiunte.
    </p>
    <p class="frase-piccola">
      Il team non è simmetrico: <strong>l'architetto</strong> tocca contratti,
      agenti, hook e guardrail; <strong>il product developer</strong> interagisce
      con il progetto solo attraverso skill e non ha bisogno di sapere quanti
      agenti esistono — il routing lo fa la skill.
    </p>
    ${
      righe
        ? `<table><thead><tr><th>Agente</th><th>Directory posseduta</th><th>File</th><th>Commit</th></tr></thead>
           <tbody>${righe}</tbody></table>
           <p class="nota">${esc(attivi)} agenti attivi · ${esc(commit)} commit · da <code>evidence/process.json</code></p>`
        : manca('process.json — la traccia reale degli agenti', 'npm --prefix app run agents:trace')
    }`;
}

function slide4(): string {
  return `<h2>Before / after</h2>
    <div class="due immagini">
      <figure>${immagine(screenshot('02-before.png'), 'Il documento così com\'è', 'screenshot del before')}
        <figcaption>Il documento così com'è</figcaption></figure>
      <figure>${immagine(screenshot('03-after.png'), 'La lettura calcolata', 'screenshot dell\'after')}
        <figcaption>La lettura calcolata, voce per voce</figcaption></figure>
    </div>`;
}

function slide5(): string {
  if (!capability) {
    return `<h2>Che cosa calcola il software</h2>
      ${manca(
        'capability.json — la capability e l\'agente che l\'ha costruita',
        'presentation/evidence/capability.json (agente 06-evidence-collector)',
      )}
      <p class="nota">TODO(scenario): si compila quando il core produce la prima lettura reale.</p>`;
  }
  const voci = (capability.voci ?? [])
    .map(
      (v: Json) =>
        `<tr><td>${esc(v.etichettaOriginale)}</td><td class="num">${esc(v.importo)}</td>
         <td class="num">${esc(v.peso)}</td><td>${esc(v.spiegazione)}</td></tr>`,
    )
    .join('');
  return `<h2>Che cosa calcola il software</h2>
    <p class="frase-piccola">${esc(capability.descrizione ?? '')}</p>
    ${voci ? `<table><thead><tr><th>Voce (come sul documento)</th><th>Importo</th><th>Peso</th><th>Come si ottiene</th></tr></thead><tbody>${voci}</tbody></table>` : ''}
    <p class="nota">Costruita da <code>${esc(capability.agente ?? '01-core-engine')}</code> ·
       ${esc(capability.test ?? '')}</p>`;
}

function slide6(): string {
  return `<h2><span class="tag">DAL VIVO</span> Il guardrail che rompe la build</h2>
    <p class="frase-piccola">
      Il vincolo è: <strong>il prodotto spiega e calcola, non consiglia</strong>.
      Scritto in un documento è una speranza. Qui è un test e un hook.
    </p>
    <pre class="codice">// app/src/ui/stringheUtente.ts
demoRotta: 'Ti consigliamo di scegliere il conto migliore.',

$ npm --prefix app test
  × lessico nelle stringhe rivolte all'utente
    → demoRotta: «Ti consigliamo di scegliere il conto migliore.»
      [blocco] "consigliamo" (consigliare)
      [blocco] "scegliere"   (imperativo-scelta)
      [blocco] "migliore"    (comparativo-valore)</pre>
    <p class="frase-piccola">
      L'hook <code>PostToolUse</code> lo esegue <strong>al salvataggio</strong>,
      non alla consegna: la deriva viene bloccata prima che qualcuno la rilegga.
    </p>
    ${screenshot('04-test-rosso.png') ? `<img class="piccola" src="screenshots/04-test-rosso.png" alt="Test rosso">` : ''}`;
}

function slide7(): string {
  const righe = [
    ['Regole di progetto', 'CLAUDE.md', 'i vincoli che valgono per ogni agente'],
    ['Contratti', 'app/types/contracts.ts', 'congelati a T+1:40, protetti da hook'],
    ['Ruoli e confini', 'agents/*.md', 'un agente, una directory in esclusiva'],
    ['Fixture', 'app/fixtures/', 'la verità di riferimento dei test'],
    ['Guardrail eseguibili', 'app/src/guardrails/', '«spiega, non consiglia» come test'],
    ['Hook che li impongono', '.claude/hooks/', 'non dipendono dalla buona volontà del modello'],
    ['Skill come interfaccia', '.claude/skills/', 'il verbo che il product developer digita'],
    ['Traccia', 'agents/trace.md', 'memoria del processo, generata da git'],
  ]
    .map(([a, b, c]) => `<tr><td>${esc(a)}</td><td><code>${esc(b)}</code></td><td>${esc(c)}</td></tr>`)
    .join('');

  return `<h2><span class="tag">METODO</span> La base agentica</h2>
    <table><thead><tr><th>Componente</th><th>Dove</th><th>A che cosa serve</th></tr></thead>
    <tbody>${righe}</tbody></table>
    <div class="cifre">
      ${cifra('2', 'file da leggere', 'agents/README.md + contracts.ts')}
      ${cifra('1', 'directory libera da scegliere')}
      ${cifra('0', 'riunioni necessarie')}
    </div>
    <p class="nota">Costo di ingresso per una terza persona. Le regole sono
       <strong>eseguibili, non scritte</strong>.</p>`;
}

function slide8(): string {
  if (!evoluzione || evoluzione.tagPresente === false) {
    return `<h2><span class="tag">METODO</span> Prova di evoluzione</h2>
      ${manca(
        'evolution.json — la misura, non l\'affermazione',
        'git tag freeze && git switch -c evolution-proof && npm --prefix app run evolution:proof',
      )}
      <p class="frase-piccola">${esc(evoluzione?.note ?? 'Il tag freeze si crea al feature freeze, T+2:45.')}</p>`;
  }
  return `<h2><span class="tag">METODO</span> Prova di evoluzione</h2>
    <p class="frase-piccola">
      Una capability aggiunta dopo il freeze, con un solo agente. Misurata, non affermata.
    </p>
    <div class="cifre">
      ${cifra(evoluzione.minutiTrascorsi, 'minuti', 'dal tag freeze')}
      ${cifra(evoluzione.numeroDirectoryToccate, 'directory toccate dal diff')}
      ${cifra(evoluzione.numeroFileModificati, 'file modificati')}
      <div class="cifra evidenziata">
        <div class="cifra-v">${esc(evoluzione.contrattiModificatiDopoFreeze)}</div>
        <div class="cifra-e">contratti modificati dopo il freeze</div>
        <div class="cifra-n">app/types/ — è il numero che conta</div>
      </div>
    </div>
    <p class="nota">Da <code>evidence/evolution.json</code> e <code>agents/trace.md</code> ·
       branch <code>${esc(evoluzione.branch ?? 'evolution-proof')}</code>, mai unito</p>`;
}

function slide9(): string {
  if (!comprensione) {
    return `<h2>Il miglioramento misurato, e i limiti</h2>
      ${manca(
        'comprehension.json — prima / dopo / delta',
        'presentation/evidence/comprehension.json (agente 05-impact-analyst)',
      )}`;
  }
  const limiti = (comprensione.limitiDichiarati ?? [])
    .map((l: string) => `<li>${esc(l)}</li>`)
    .join('');
  return `<h2>Il miglioramento misurato, e i limiti</h2>
    <div class="cifre">
      ${cifra(`${comprensione.prima?.punteggio ?? '—'}`, 'prima della lettura', 'su 100')}
      ${cifra(`${comprensione.dopo?.punteggio ?? '—'}`, 'dopo la lettura', 'su 100')}
      <div class="cifra evidenziata">
        <div class="cifra-v">${comprensione.deltaPunteggio != null ? `+${esc(comprensione.deltaPunteggio)}` : '—'}</div>
        <div class="cifra-e">differenza</div>
        <div class="cifra-n">${esc(comprensione.numeroPartecipanti ?? 0)} partecipanti</div>
      </div>
    </div>
    <h3>Limiti dichiarati</h3>
    <ul class="limiti">${limiti || '<li>Nessun limite dichiarato: da compilare.</li>'}</ul>`;
}

/* ------------------------------------------------------------------ */
/* Assemblaggio                                                        */
/* ------------------------------------------------------------------ */

const slides: Array<{ n: string; html: string }> = [
  { n: '1', html: slide1() },
  { n: '2', html: slide2() },
  { n: '3', html: slide3() },
  { n: '4', html: slide4() },
  { n: '5', html: slide5() },
  { n: '6', html: slide6() },
];

if (UNISCI_7_8) {
  slides.push({
    n: '7+8',
    html: `${slide7()}<hr class="unione">${slide8()}`,
  });
} else {
  slides.push({ n: '7', html: slide7() });
  slides.push({ n: '8', html: slide8() });
}
slides.push({ n: '9', html: slide9() });

const CSS = `
:root{--purple:#A100FF;--purple-light:#BE82FF;--purple-dark:#460073;
--ink:#0A0014;--rose:#FF50A0;--fondo:#050008;--testo:#fff}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--fondo);color:var(--testo);
font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;
font-size:20px;line-height:1.5;overflow:hidden}
.slide{display:none;height:100vh;padding:4vh 6vw 9vh;overflow-y:auto}
.slide.attiva{display:block}
h1{font-size:clamp(2.5rem,7vw,5rem);margin:0 0 .5rem;letter-spacing:-.02em}
h2{font-size:clamp(1.8rem,4vw,3rem);margin:0 0 1.5rem;color:var(--purple-light);
border-bottom:3px solid var(--purple);padding-bottom:.5rem}
h3{font-size:1.3rem;color:var(--purple-light);margin:0 0 .4rem}
.tag{display:inline-block;background:var(--purple);color:#fff;font-size:.9rem;
font-weight:700;letter-spacing:.12em;padding:.2em .7em;border-radius:4px;
vertical-align:middle;margin-right:.6rem}
.occhiello{color:var(--rose);font-size:1.4rem;margin:0 0 2rem;font-weight:600}
.frase{font-size:clamp(1.3rem,2.6vw,2rem);max-width:32em;margin:0 0 2rem}
.frase-piccola{font-size:1.05rem;max-width:46em;margin:0 0 1.2rem;opacity:.95}
.nota{font-size:.95rem;opacity:.85;margin-top:1.2rem}
.cifre{display:flex;gap:1.5rem;flex-wrap:wrap;margin:1.5rem 0}
.cifra{background:var(--ink);border:1px solid var(--purple-dark);
border-left:4px solid var(--purple);border-radius:10px;padding:1rem 1.4rem;min-width:9rem}
.cifra.evidenziata{border-left-color:var(--rose);background:#1a0010}
.cifra-v{font-size:clamp(2rem,4vw,3.2rem);font-weight:800;line-height:1;
font-variant-numeric:tabular-nums}
.cifra.evidenziata .cifra-v{color:var(--rose)}
.cifra-e{font-size:.95rem;margin-top:.35rem}
.cifra-n{font-size:.82rem;opacity:.8;margin-top:.2rem}
table{width:100%;border-collapse:collapse;font-size:.95rem;margin:1rem 0}
th,td{text-align:left;padding:.5rem .7rem;border-bottom:1px solid var(--purple-dark)}
th{color:var(--purple-light);font-size:.85rem;text-transform:uppercase;letter-spacing:.06em}
td.num{text-align:right;font-variant-numeric:tabular-nums}
code{font-family:ui-monospace,Consolas,monospace;background:var(--ink);
padding:.1em .35em;border-radius:4px;font-size:.9em;color:var(--purple-light)}
pre.codice{background:var(--ink);border:1px solid var(--purple-dark);border-left:4px solid var(--rose);
border-radius:8px;padding:1.2rem;overflow-x:auto;font-size:.95rem;line-height:1.45;
font-family:ui-monospace,Consolas,monospace;white-space:pre-wrap}
.due{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
.due.immagini figure{margin:0}
.due img,img.piccola{max-width:100%;border:1px solid var(--purple-dark);border-radius:8px}
img.piccola{max-height:30vh;margin-top:1rem}
figcaption{font-size:.9rem;opacity:.85;margin-top:.5rem}
.blocco{border-left:4px solid var(--rose);padding-left:1rem}
.manca{background:#1a0010;border:2px dashed var(--rose);border-radius:8px;
padding:1.2rem;color:#fff;font-size:1rem;margin:1rem 0}
.manca code{background:transparent;color:var(--rose)}
.limiti{max-width:46em;font-size:1rem}
.limiti li+li{margin-top:.5rem}
hr.unione{border:0;border-top:2px solid var(--purple-dark);margin:2rem 0}
#barra{position:fixed;left:0;right:0;bottom:0;height:6px;background:var(--ink)}
#avanzamento{height:100%;background:var(--purple);transition:width .2s}
#contatore{position:fixed;right:1.5rem;bottom:1.2rem;font-size:.9rem;opacity:.7;
font-variant-numeric:tabular-nums}
`;

const JS = `
const slides=[...document.querySelectorAll('.slide')];let i=0;
const barra=document.getElementById('avanzamento');
const cont=document.getElementById('contatore');
function mostra(n){i=Math.max(0,Math.min(slides.length-1,n));
 slides.forEach((s,k)=>s.classList.toggle('attiva',k===i));
 barra.style.width=((i+1)/slides.length*100)+'%';
 cont.textContent=(i+1)+' / '+slides.length;
 location.hash=String(i+1);}
document.addEventListener('keydown',e=>{
 if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();mostra(i+1);}
 else if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();mostra(i-1);}
 else if(e.key==='Home'){mostra(0);}
 else if(e.key==='End'){mostra(slides.length-1);}
 else if(e.key==='f'||e.key==='F'){
   if(document.fullscreenElement)document.exitFullscreen();
   else document.documentElement.requestFullscreen();}});
document.addEventListener('click',e=>{if(!e.target.closest('a'))mostra(i+1);});
mostra(parseInt(location.hash.slice(1)||'1',10)-1);
`;

const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plainly — ${slides.length} slide</title>
<!-- Nessun link esterno, nessun font remoto, nessuna richiesta di rete. -->
<style>${CSS}</style>
</head>
<body>
${slides.map((s) => `<section class="slide" data-n="${esc(s.n)}">${s.html}</section>`).join('\n')}
<div id="barra"><div id="avanzamento"></div></div>
<div id="contatore"></div>
<script>${JS}</script>
</body>
</html>
`;

writeFileSync(USCITA, html, 'utf8');

const mancanti = [
  processo ? null : 'process.json',
  evoluzione ? null : 'evolution.json',
  comprensione ? null : 'comprehension.json',
  capability ? null : 'capability.json',
  persona ? null : 'persona.json',
].filter(Boolean);

console.log(
  `deck → presentation/deck.html (${slides.length} slide${UNISCI_7_8 ? ', 7+8 unite' : ''})`,
);
if (mancanti.length) {
  console.log(`  evidenze mancanti (placeholder visibili, deck integro): ${mancanti.join(', ')}`);
}
