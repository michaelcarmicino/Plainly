/**
 * CONFORMITÀ SPECIFICA DELLA 07 — «i risparmi fermi» (CF-03, CF-04).
 * Agente: guardrail-officer, rilettura di T+2:00 su docs/test/07-valore-dei-risparmi.md.
 *
 * Questa schermata parla di soldi fermi ed erosione: è il terreno in cui una
 * raccomandazione di investimento entra più facilmente che altrove. CF-03 e
 * CF-04 chiedono di escludere due cose che NESSUNA voce del lessico generale
 * copre oggi (src/guardrails/lessico.ts).
 *
 * Questi termini restano FUORI dal lessico sitewide di proposito: «conto»,
 * «fondo», «azione», «rendimento» sono vocabolario legittimo altrove nel
 * sito («conto corrente», «fondo pensione» — l'esempio canonico di
 * .claude/rules/scrittura-e-accessibilita.md — «impiegato» per l'area
 * lavoro). Bloccarli nel lessico generale produrrebbe falsi positivi
 * sistematici sulle aree «Il costo della vita» e «Il futuro». Il controllo
 * resta quindi scoped a STRINGHE_SIMULAZIONE, la schermata a cui CF-03/CF-04
 * si riferiscono.
 *
 * CF-04 definisce il proprio caso «quello che nessuna regex trova»: questo
 * test blocca le formulazioni concrete già individuate (spostare / impiegare
 * / muovere / costare applicati ai soldi fermi — il caso «tenerli fermi ti
 * costa X» che passerebbe il lessico generale parola per parola). Non
 * sostituisce la rilettura umana per formulazioni nuove che non useranno
 * queste stesse radici.
 */

import { describe, expect, it } from 'vitest';
import { STRINGHE_SIMULAZIONE } from '../src/ui/testiSimulazione.ts';

interface TermineScoped {
  readonly id: string;
  readonly radice: RegExp;
  readonly motivo: string;
}

/** Radice di parola, accent-safe. Niente 'g': qui basta un booleano per stringa. */
const confine = (pattern: string): RegExp =>
  new RegExp(`(?<![\\p{L}])(?:${pattern})(?![\\p{L}])`, 'iu');

// CF-03 — strumenti finanziari: la schermata descrive un'erosione, non
// nomina prodotti da scegliere o confrontare.
const STRUMENTI_FINANZIARI: readonly TermineScoped[] = [
  { id: 'conto', radice: confine('conti|conto'), motivo: "nomina un prodotto bancario" },
  { id: 'deposito', radice: confine('deposit\\p{L}*'), motivo: "nomina un prodotto bancario" },
  { id: 'fondo', radice: confine('fond[oi]'), motivo: "nomina uno strumento d'investimento" },
  { id: 'titolo', radice: confine('titol[oi]'), motivo: "nomina uno strumento d'investimento" },
  { id: 'obbligazione', radice: confine('obbligazion\\p{L}*'), motivo: "nomina uno strumento d'investimento" },
  { id: 'azione (finanziaria)', radice: confine('azion[ei]'), motivo: "nomina uno strumento d'investimento" },
  { id: 'polizza', radice: confine('polizz\\p{L}*'), motivo: 'nomina un prodotto assicurativo/finanziario' },
  { id: 'rendimento', radice: confine('rendiment\\p{L}*'), motivo: "confronta un guadagno atteso, non un'erosione" },
  { id: 'alternativa', radice: confine('alternativ\\p{L}*'), motivo: 'implica un confronto fra opzioni' },
];

// CF-04 — azioni sui soldi: «tenerli fermi ti costa X» passa il lessico
// generale parola per parola ed è comunque un giudizio su una scelta.
const AZIONI_SUI_SOLDI: readonly TermineScoped[] = [
  { id: 'spostare', radice: confine('sposta\\p{L}*'), motivo: "indica un'azione sulla somma" },
  { id: 'impiegare', radice: confine('impiega\\p{L}*'), motivo: "indica un'azione sulla somma" },
  { id: 'muovere', radice: confine('muov\\p{L}*'), motivo: "indica un'azione sulla somma" },
  { id: 'costare', radice: confine('cost\\p{L}*'), motivo: "trasforma l'erosione nel costo di una scelta" },
];

function violazioni(termini: readonly TermineScoped[]): string[] {
  const righe: string[] = [];
  for (const [chiave, testo] of Object.entries(STRINGHE_SIMULAZIONE)) {
    for (const termine of termini) {
      if (termine.radice.test(testo)) {
        righe.push(`  ${chiave}: contiene «${termine.id}» (${termine.motivo}) — «${testo}»`);
      }
    }
  }
  return righe;
}

describe('conformità specifica della 07 — soldi fermi (CF-03, CF-04)', () => {
  it('CF-03: nessuna stringa nomina uno strumento finanziario', () => {
    const righe = violazioni(STRUMENTI_FINANZIARI);
    expect(righe, `\n${righe.join('\n')}\n`).toHaveLength(0);
  });

  it("CF-04: nessuna stringa indica un'azione da compiere sui soldi fermi", () => {
    const righe = violazioni(AZIONI_SUI_SOLDI);
    expect(righe, `\n${righe.join('\n')}\n`).toHaveLength(0);
  });
});
