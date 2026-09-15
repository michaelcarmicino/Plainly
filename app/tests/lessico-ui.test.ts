/**
 * IL TEST CHE ROMPE LA BUILD (slide 6 della presentazione).
 *
 * Scandisce TUTTE le stringhe rivolte all'utente:
 *   1. il registro app/src/ui/testi.ts
 *   2. le etichette e le spiegazioni nelle fixture (finiscono a schermo)
 *   3. i letterali di testo dentro app/src/ui/*.tsx (testo fuori registro)
 *   4. gli identificatori del codice sorgente
 * e FALLISCE se trova anche una sola formulazione prescrittiva.
 *
 * COME FARLO FALLIRE DI PROPOSITO, DAL VIVO:
 *   aggiungere in app/src/ui/testi.ts una riga come
 *     demoRotta: 'Ti consigliamo di scegliere il conto migliore.',
 *   poi `npm test`. L'hook PostToolUse lo esegue già da solo dopo l'Edit.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  verificaInsieme,
  verificaTestoUtente,
  formattaViolazioni,
  RADICI_VIETATE_NEGLI_IDENTIFICATORI,
} from '../src/guardrails/index.ts';
import { STRINGHE_UTENTE } from '../src/ui/testi.ts';

const APP = fileURLToPath(new URL('..', import.meta.url));

/** Il guardrail stesso e i suoi test contengono per forza le parole vietate. */
const ESCLUSI = [join('src', 'guardrails'), 'tests', 'node_modules', 'dist'];

function fileSorgente(dir: string, acc: string[] = []): string[] {
  for (const voce of readdirSync(dir)) {
    const p = join(dir, voce);
    const rel = relative(APP, p);
    if (ESCLUSI.some((e) => rel.startsWith(e))) continue;
    if (statSync(p).isDirectory()) fileSorgente(p, acc);
    else if (/\.(ts|tsx)$/.test(voce)) acc.push(p);
  }
  return acc;
}

describe('lessico nelle stringhe rivolte all\'utente', () => {
  it('il registro STRINGHE_UTENTE non contiene formulazioni prescrittive', () => {
    const fuori = verificaInsieme(STRINGHE_UTENTE);
    const report = fuori
      .map(({ chiave, esito }) => formattaViolazioni(chiave, esito))
      .join('\n');
    expect(
      fuori,
      `\nStringhe non conformi al vincolo di dominio ` +
        `(il prodotto spiega e calcola, non consiglia):\n${report}\n`,
    ).toHaveLength(0);
  });

  it('le fixture non contengono formulazioni prescrittive', () => {
    const dir = join(APP, 'fixtures');
    const problemi: string[] = [];
    for (const nome of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const testo = readFileSync(join(dir, nome), 'utf8');
      const esito = verificaTestoUtente(testo);
      if (!esito.conforme) problemi.push(formattaViolazioni(nome, esito));
    }
    expect(problemi, `\n${problemi.join('\n')}\n`).toHaveLength(0);
  });

  it('nessun testo prescrittivo nei letterali della UI', () => {
    const problemi: string[] = [];
    for (const f of fileSorgente(join(APP, 'src'))) {
      const sorgente = readFileSync(f, 'utf8');
      // letterali di stringa, testo JSX fra tag, e citazioni fra caporali
      // «...» — la virgoletta tipografica italiana, usata nei commenti
      // tanto quanto gli apici dritti: un letterale copiato lì dentro non
      // deve sfuggire alla scansione solo per come è stato citato.
      for (const m of sorgente.matchAll(
        /'([^'\n]{12,})'|"([^"\n]{12,})"|>([^<>{}\n]{12,})<|«([^»\n]{12,})»/g,
      )) {
        const testo = m[1] ?? m[2] ?? m[3] ?? m[4] ?? '';
        const esito = verificaTestoUtente(testo);
        if (!esito.conforme) {
          problemi.push(formattaViolazioni(relative(APP, f), esito));
        }
      }
    }
    expect(problemi, `\n${problemi.join('\n')}\n`).toHaveLength(0);
  });

  it('nessun identificatore prescrittivo nel codice sorgente', () => {
    const problemi: string[] = [];
    for (const f of fileSorgente(join(APP, 'src'))) {
      const sorgente = readFileSync(f, 'utf8').toLowerCase();
      for (const radice of RADICI_VIETATE_NEGLI_IDENTIFICATORI) {
        if (sorgente.includes(radice)) {
          problemi.push(`  ${relative(APP, f)}: contiene "${radice}"`);
        }
      }
    }
    expect(
      problemi,
      `\nIdentificatori vietati (niente suggerisci/consiglia/migliore/` +
        `raccomanda nei nomi):\n${problemi.join('\n')}\n`,
    ).toHaveLength(0);
  });
});
