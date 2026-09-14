#!/usr/bin/env node
/**
 * docs:funzionali — genera app/docs/FUNZIONALITA.md dai file in docs/features/.
 *
 * GENERATO, MAI SCRITTO A MANO. Se qualcuno lo modifica, la modifica sparisce
 * alla prima rigenerazione: è voluto, perché l'indice deve riflettere i file
 * e non le intenzioni di chi lo aggiorna.
 *
 * Regge lo stato vuoto: zero funzionalità produce un indice vuoto e uno
 * scheletro leggibile, non un errore.
 *
 * Agente proprietario: 09-doc-funzionale.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const FEATURES = join(APP, 'docs', 'features');
const USCITA = join(APP, 'docs', 'FUNZIONALITA.md');

const STATI = {
  'in sviluppo': { etichetta: 'in sviluppo', simbolo: '◌' },
  implementato: { etichetta: 'implementato', simbolo: '●' },
  verificato: { etichetta: 'verificato', simbolo: '✓' },
};

/** Estrae il corpo di una sezione `### Titolo` fino alla successiva. */
function sezione(testo, titolo) {
  const re = new RegExp(`^###\\s+${titolo}\\s*$([\\s\\S]*?)(?=^###\\s|^##\\s|\\Z)`, 'mi');
  const m = testo.match(re);
  return m ? m[1].trim() : '';
}

function leggiFunzionalita() {
  if (!existsSync(FEATURES)) return [];
  return readdirSync(FEATURES)
    .filter((f) => /^\d\d-.+\.md$/.test(f))
    .sort()
    .map((file) => {
      const percorso = join(FEATURES, file);
      const testo = readFileSync(percorso, 'utf8').replace(/\r\n/g, '\n');
      const titolo = (testo.match(/^#\s+(.+)$/m) ?? [, file.replace(/\.md$/, '')])[1].trim();
      const stato = (testo.match(/Stato:\s*\*\*(.+?)\*\*/i) ?? [, 'in sviluppo'])[1]
        .trim()
        .toLowerCase();

      // Fase 2 riscrive al presente sotto «Verificato»; finché non esiste,
      // vale ciò che la fase 1 ha previsto.
      const verificato = /^##\s+Verificato\s*$/m.test(testo);
      const blocco = verificato
        ? testo.slice(testo.search(/^##\s+Verificato\s*$/m))
        : testo;

      return {
        file,
        titolo,
        stato: STATI[stato] ? stato : 'in sviluppo',
        verificato,
        cosaFa: sezione(blocco, 'Cosa fa') || sezione(testo, 'Cosa farà'),
        perChi: sezione(blocco, 'Per chi') || sezione(testo, 'Per chi'),
        comeSiProva: sezione(blocco, 'Come si prova') || sezione(testo, 'Come si proverà'),
        limiti: sezione(blocco, 'Limiti') || sezione(testo, 'Limiti previsti'),
        divergenze: sezione(testo, 'Divergenze'),
        modificato: statSync(percorso).mtime,
      };
    });
}

const funzionalita = leggiFunzionalita();
const conta = (s) => funzionalita.filter((f) => f.stato === s).length;

const intestazione = `# Funzionalità di Plainly

> **File generato.** Non modificarlo a mano: si rigenera con
> \`npm run docs:funzionali\` e ogni modifica manuale andrebbe persa.
> Le fonti sono i file in \`docs/features/\`, scritti dall'agente
> \`doc-funzionale\`.
>
> Ultima generazione: ${new Date().toISOString()}

**Come si legge il tempo verbale.** Ciò che è scritto al **futuro** è previsto
e non ancora verificato; ciò che è al **presente** è stato confermato leggendo
il codice e i test. Non è stile: è il modo per sapere in un secondo che cosa è
reale.

`;

let corpo;

if (funzionalita.length === 0) {
  corpo = `## Indice

Nessuna funzionalità documentata.

Il primo file compare qui quando \`/spec\` viene confermata: l'agente
\`doc-funzionale\` scrive \`docs/features/NN-nome.md\` in parallelo allo
sviluppo, e questo indice si rigenera da solo.

| | Stato | Funzionalità |
| --- | --- | --- |
| — | — | *(nessuna)* |

**Totali** — in sviluppo: 0 · implementate: 0 · verificate: 0
`;
} else {
  const righe = funzionalita
    .map((f) => {
      const s = STATI[f.stato];
      const ancora = f.titolo.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return `| ${s.simbolo} | ${s.etichetta} | [${f.titolo}](#${ancora}) |`;
    })
    .join('\n');

  const schede = funzionalita
    .map((f) => {
      const s = STATI[f.stato];
      const campo = (titolo, valore, vuoto) =>
        `### ${titolo}\n\n${valore || `*${vuoto}*`}\n`;

      return [
        `## ${f.titolo}`,
        '',
        `**Stato:** ${s.simbolo} ${s.etichetta}${f.verificato ? '' : ' — *non ancora riconciliato con il codice*'}  `,
        `**Origine:** [\`docs/features/${f.file}\`](features/${f.file})`,
        '',
        campo(f.verificato ? 'Cosa fa' : 'Cosa farà', f.cosaFa, 'non ancora descritto'),
        campo('Per chi', f.perChi, 'non ancora indicato'),
        campo(f.verificato ? 'Come si prova' : 'Come si proverà', f.comeSiProva, 'passi non ancora scritti'),
        campo('Limiti', f.limiti, 'nessun limite dichiarato'),
        f.divergenze ? campo('Divergenze fra previsto e realizzato', f.divergenze, '') : '',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n---\n\n');

  corpo = `## Indice

| | Stato | Funzionalità |
| --- | --- | --- |
${righe}

**Totali** — in sviluppo: ${conta('in sviluppo')} · implementate: ${conta('implementato')} · verificate: ${conta('verificato')}

---

${schede}
`;
}

mkdirSync(dirname(USCITA), { recursive: true });
writeFileSync(USCITA, `${intestazione}${corpo}`, 'utf8');

console.log(
  `docs:funzionali → docs/FUNZIONALITA.md · ${funzionalita.length} funzionalità ` +
    `(in sviluppo ${conta('in sviluppo')}, implementate ${conta('implementato')}, verificate ${conta('verificato')})`,
);

// Segnala la sola incoerenza che conta: l'indice più vecchio delle fonti.
const piuRecente = funzionalita.reduce((a, f) => (f.modificato > a ? f.modificato : a), new Date(0));
if (funzionalita.length && piuRecente > statSync(USCITA).mtime) {
  console.log('  ATTENZIONE: una fonte è più recente dell\'indice appena scritto.');
}
