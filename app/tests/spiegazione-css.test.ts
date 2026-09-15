/**
 * INVARIANTI CSS DELLA «03 — PAGINA DI SPIEGAZIONE» — agente
 * guardrail-officer. Affiancato a tests/spiegazione.test.ts per restare
 * sotto le 150 righe (standard-codice.md): qui stanno i due vincoli che si
 * verificano sul FOGLIO DI STILE, non sul markup reso.
 *
 * 1. Nessun troncamento della domanda: la specifica vieta i puntini — una
 *    domanda tagliata è un'informazione diversa. Le classi che decidono
 *    l'aspetto del titolo (blocco 2, in stiliSpiegazione.css) e dell'ultimo
 *    gradino del percorso (in stiliNavigazione.css, condiviso da tutto il
 *    sito) non devono portare `text-overflow`, `white-space: nowrap` o
 *    `line-clamp` — stesso controllo già fatto altrove per un'altra pagina
 *    (tests/accettazione/02-catalogo-domande-limite.test.ts, CL-08).
 * 2. Il rosa #FF50A0 è il colore di ciò che il prodotto non fa: in
 *    stiliSpiegazione.css lo deve usare un solo selettore, quello del
 *    blocco 8 (.spiegazione-non-fa) — mai un titolo, un bordo o uno sfondo.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const APP = fileURLToPath(new URL('..', import.meta.url));

/** Selettore e corpo di ogni blocco CSS non annidato, commenti già rimossi:
 *  un commento fra due regole, lasciato dentro, finirebbe catturato come
 *  parte del "selettore" successivo (stesso helper già usato in
 *  tests/accettazione/02-catalogo-domande-accessibilita.test.ts e in
 *  13-tabella-fonti-dati-pagina.test.ts). */
function blocchiCss(percorsoRelativo: string): ReadonlyArray<readonly [string, string]> {
  const testo = readFileSync(join(APP, percorsoRelativo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...testo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2]] as const);
}

describe("nessun troncamento della domanda: né nel titolo né nell'ultimo gradino", () => {
  it('il blocco 2 (titolo) non ha regole di troncamento', () => {
    const titolo = blocchiCss('src/ui/stiliSpiegazione.css').find(([sel]) => sel === '.spiegazione-titolo');
    expect(titolo, 'selettore .spiegazione-titolo assente da stiliSpiegazione.css').toBeDefined();
    expect(titolo?.[1]).not.toMatch(/text-overflow|white-space:\s*nowrap|line-clamp/);
  });

  it("il percorso di navigazione (ultimo gradino) non ha regole di troncamento", () => {
    // Il testo del gradino corrente non ha una classe propria: vive dentro
    // <span aria-current> dentro <li> dentro .percorso, condiviso da ogni
    // pagina del sito (non solo dalla 03) — si controlla l'intero foglio.
    const css = readFileSync(join(APP, 'src/ui/stiliNavigazione.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    );
    expect(css).not.toMatch(/text-overflow|line-clamp/);
    const percorso = blocchiCss('src/ui/stiliNavigazione.css').find(([sel]) => sel === '.percorso');
    expect(percorso?.[1]).not.toMatch(/white-space:\s*nowrap/);
  });
});

describe('il rosa #FF50A0 è riservato al blocco 8', () => {
  it('in stiliSpiegazione.css lo usa un solo selettore: .spiegazione-non-fa', () => {
    const conRosa = blocchiCss('src/ui/stiliSpiegazione.css')
      .filter(([, corpo]) => /(#ff50a0|var\(--rose\))/i.test(corpo))
      .map(([selettore]) => selettore);
    expect(conRosa).toEqual(['.spiegazione-non-fa']);
  });
});
