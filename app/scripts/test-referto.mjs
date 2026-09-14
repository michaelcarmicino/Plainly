#!/usr/bin/env node
/**
 * test:referto — genera app/docs/TEST.md dalle liste in docs/test/.
 *
 * GENERATO, MAI SCRITTO A MANO.
 *
 * I numeri che produce servono anche a raccontare il progetto: sono la prova
 * che la qualità è stata **misurata** e non affermata. La colonna «non
 * coperti» non è un imbarazzo da nascondere: è la fonte dei limiti dichiarati,
 * e un buco dichiarato vale più di un test finto che passa.
 *
 * Regge lo stato vuoto: zero liste produce un indice leggibile, non un errore.
 *
 * Agente proprietario: 11-tester.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(APP, 'docs', 'test');
const USCITA = join(APP, 'docs', 'TEST.md');

/** Un caso è una riga di tabella: | ID | ... | esito | */
const ESITI = {
  passato: /\bpassa(to)?\b|\bok\b|✓/i,
  fallito: /\bfallit[oa]\b|\bko\b|✗|×/i,
  'non coperto': /non\s+copert[oa]/i,
};

function classifica(riga) {
  if (ESITI['non coperto'].test(riga)) return 'non coperto';
  if (ESITI.fallito.test(riga)) return 'fallito';
  if (ESITI.passato.test(riga)) return 'passato';
  return 'da eseguire';
}

function leggiListe() {
  if (!existsSync(DIR)) return [];
  return readdirSync(DIR)
    .filter((f) => /^\d\d-.+\.md$/.test(f))
    .sort()
    .map((file) => {
      const testo = readFileSync(join(DIR, file), 'utf8').replace(/\r\n/g, '\n');
      const titolo = (testo.match(/^#\s+(.+)$/m) ?? [, file.replace(/\.md$/, '')])[1].trim();

      // I casi sono righe che cominciano con un identificativo tipo C-01.
      const righe = testo
        .split('\n')
        .filter((r) => /^\s*\|?\s*\*{0,2}(C-\d+|CL-\d+|E-\d+|CF-\d+)\b/i.test(r));

      const conta = { passato: 0, fallito: 0, 'non coperto': 0, 'da eseguire': 0 };
      for (const r of righe) conta[classifica(r)] += 1;

      const referto = /^##\s+Referto/m.test(testo);

      return { file, titolo, casi: righe.length, conta, referto };
    });
}

const liste = leggiListe();

const tot = liste.reduce(
  (a, l) => ({
    casi: a.casi + l.casi,
    passato: a.passato + l.conta.passato,
    fallito: a.fallito + l.conta.fallito,
    'non coperto': a['non coperto'] + l.conta['non coperto'],
    'da eseguire': a['da eseguire'] + l.conta['da eseguire'],
  }),
  { casi: 0, passato: 0, fallito: 0, 'non coperto': 0, 'da eseguire': 0 },
);

const righe = liste.length
  ? liste
      .map(
        (l) =>
          `| [${l.titolo}](test/${l.file}) | ${l.referto ? 'sì' : '**no**'} | ${l.casi} | ${l.conta.passato} | ${l.conta.fallito} | ${l.conta['non coperto']} | ${l.conta['da eseguire']} |`,
      )
      .join('\n')
  : '| *(nessuna lista di casi)* | — | 0 | 0 | 0 | 0 | 0 |';

mkdirSync(dirname(USCITA), { recursive: true });
writeFileSync(
  USCITA,
  `# Referto dei test

> **File generato.** Si rigenera con \`npm run test:referto\`. Le fonti sono i
> file in \`docs/test/\`, scritti dall'agente \`tester\`.
>
> Ultima generazione: ${new Date().toISOString()}

## Quadro d'insieme

| | |
| --- | --- |
| **Casi totali** | ${tot.casi} |
| **Passati** | ${tot.passato} |
| **Falliti** | ${tot.fallito} |
| **Non coperti** | ${tot['non coperto']} |
| **Da eseguire** | ${tot['da eseguire']} |

${
  tot.fallito > 0
    ? `> **${tot.fallito} casi falliti.** Il dettaglio, con l'input che li produce, è nei referti collegati qui sotto.\n`
    : ''
}${
    tot['non coperto'] > 0
      ? `> **${tot['non coperto']} casi non coperti**, dichiarati con il motivo. Sono le cose che sappiamo di non aver verificato, e alimentano i limiti dichiarati.\n`
      : ''
  }
## Per funzionalità

| Funzionalità | Referto | Casi | Passati | Falliti | Non coperti | Da eseguire |
| --- | --- | --- | --- | --- | --- | --- |
${righe}

${
  liste.length === 0
    ? `
## Nessuna lista ancora

La prima compare quando \`/spec\` viene confermata: l'agente \`tester\` scrive
\`docs/test/NN-nome.md\` in parallelo allo sviluppo, derivando i casi dalla
**specifica** e non dal codice.

Le funzionalità implementate **prima** che questo agente esistesse non hanno
una lista, e non è un errore: la copertura dichiarata vale in avanti.
`
    : ''
}
## Come si legge

- **Referto = no** significa che i casi sono stati scritti (fase 1) ma non
  ancora eseguiti (fase 2). È uno stato legittimo mentre si costruisce, non
  alla consegna.
- **Non coperto** è una scelta dichiarata con il motivo, non una dimenticanza.
  Un buco dichiarato vale più di un test finto che passa.
`,
  'utf8',
);

console.log(
  `test:referto → docs/TEST.md · ${liste.length} funzionalità · ` +
    `${tot.casi} casi (passati ${tot.passato}, falliti ${tot.fallito}, non coperti ${tot['non coperto']}, da eseguire ${tot['da eseguire']})`,
);

const senzaReferto = liste.filter((l) => !l.referto);
if (senzaReferto.length) {
  console.log(
    `  fase 2 non ancora eseguita per: ${senzaReferto.map((l) => l.file).join(', ')}`,
  );
}
