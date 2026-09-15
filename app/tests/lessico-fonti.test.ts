/**
 * CONFORMITÀ SPECIFICA DELLA 13 — «da dove vengono i numeri» (rilettura T+2:00).
 * Agente: guardrail-officer, rilettura su docs/test/13-tabella-fonti-dati.md.
 *
 * Questa pagina esiste per DICHIARARE la provenienza di un numero, non per
 * VALUTARLA. La specifica lo scrive esplicitamente in «Cosa questa
 * funzionalità NON fa»: «Non giudica le fonti e non le mette in ordine di
 * affidabilità. Non dice quale sia più attendibile né a quale credere.»
 *
 * Nessuna voce del lessico generale (src/guardrails/lessico.ts) copre questo
 * rischio: quel lessico blocca raccomandazioni di investimento e consulenza
 * personalizzata — un asse diverso da un giudizio sulla qualità di una fonte
 * editoriale. Estendere il lessico sitewide con «affidabile»/«attendibile»
 * produrrebbe falsi positivi ovunque il sito descriva onestamente un ente
 * pubblico o un documento (uso comune, non prescrittivo). Il controllo resta
 * quindi scoped a STRINGHE_FONTI — stesso ragionamento già scelto dalla 07
 * per «conto»/«fondo»/«azione» in lessico-simulazione-risparmio.test.ts.
 *
 * Oggi nessuna stringa contiene questi termini: il test è una guardia per le
 * modifiche future a questo file, non la segnalazione di un difetto attuale.
 */

import { describe, expect, it } from 'vitest';
import { STRINGHE_FONTI } from '../src/ui/testiFonti.ts';

interface TermineScoped {
  readonly id: string;
  readonly radice: RegExp;
  readonly motivo: string;
}

/** Radice di parola, accent-safe. Niente 'g': qui basta un booleano per stringa. */
const confine = (pattern: string): RegExp =>
  new RegExp(`(?<![\\p{L}])(?:${pattern})(?![\\p{L}])`, 'iu');

// Un giudizio sulla qualità di una fonte: la pagina elenca la provenienza e
// si ferma lì, non stabilisce a quale fonte credere di più o in che ordine.
const GIUDIZIO_SU_FONTE: readonly TermineScoped[] = [
  { id: 'affidabile', radice: confine('affidabil\\p{L}*'), motivo: 'giudica la qualità di una fonte' },
  { id: 'attendibile', radice: confine('attendibil\\p{L}*'), motivo: 'giudica la qualità di una fonte' },
  { id: 'credibile', radice: confine('credibil\\p{L}*'), motivo: 'giudica la qualità di una fonte' },
  { id: 'autorevole', radice: confine('autorevol\\p{L}*'), motivo: 'stabilisce una gerarchia fra fonti' },
  { id: 'fidarsi', radice: confine('fidat\\p{L}*|fidars\\p{L}*'), motivo: "chiede di fidarsi invece di dichiarare i fatti" },
];

function violazioni(termini: readonly TermineScoped[]): string[] {
  const righe: string[] = [];
  for (const [chiave, testo] of Object.entries(STRINGHE_FONTI)) {
    for (const termine of termini) {
      if (termine.radice.test(testo)) {
        righe.push(`  ${chiave}: contiene «${termine.id}» (${termine.motivo}) — «${testo}»`);
      }
    }
  }
  return righe;
}

describe('conformità specifica della 13 — non giudica le fonti', () => {
  it("nessuna stringa valuta l'affidabilità o l'autorevolezza di una fonte", () => {
    const righe = violazioni(GIUDIZIO_SU_FONTE);
    expect(righe, `\n${righe.join('\n')}\n`).toHaveLength(0);
  });
});
