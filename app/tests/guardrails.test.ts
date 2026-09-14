/**
 * Guardrail — test di unità del nucleo. Agente: guardrail-officer.
 * Questi test sono VERDI fin da T+0:15: il guardrail non è uno scheletro.
 */

import { describe, expect, it } from 'vitest';
import {
  verificaTestoUtente,
  verificaInsieme,
  LESSICO_PRESCRITTIVO,
} from '../src/guardrails/index.ts';

describe('verificaTestoUtente', () => {
  it('accetta una frase descrittiva', () => {
    const esito = verificaTestoUtente(
      'Questa voce pesa il 27,51% sul totale di 38,17 € del trimestre.',
    );
    expect(esito.conforme).toBe(true);
    expect(esito.violazioni).toHaveLength(0);
  });

  it('blocca una raccomandazione esplicita', () => {
    const esito = verificaTestoUtente('Ti consigliamo di cambiare conto corrente.');
    expect(esito.conforme).toBe(false);
    expect(esito.violazioni.map((v) => v.termineId)).toContain('consigliare');
  });

  it('blocca il comparativo di valore', () => {
    expect(verificaTestoUtente('Questa è la soluzione migliore per te.').conforme).toBe(
      false,
    );
  });

  it('blocca la consulenza personalizzata', () => {
    expect(verificaTestoUtente('Dovresti ridurre i prelievi allo sportello.').conforme)
      .toBe(false);
  });

  it('blocca le raccomandazioni di investimento', () => {
    expect(verificaTestoUtente('Investi la differenza in un fondo.').conforme).toBe(false);
  });

  it('non segnala falsi positivi su parole che contengono una radice vietata', () => {
    // "consiglio comunale", "scegliere" isolato in un contesto non finanziario
    // sono comunque bloccati per scelta: preferiamo il falso positivo al falso
    // negativo. Qui verifichiamo che NON scatti su parole solo simili.
    const esito = verificaTestoUtente('Il consolidamento dei conti e la miglia percorsa.');
    expect(esito.violazioni).toHaveLength(0);
  });

  it('riporta indice, motivo e riformulazione per ogni violazione', () => {
    const esito = verificaTestoUtente('Ti conviene scegliere un altro fornitore.');
    expect(esito.violazioni.length).toBeGreaterThan(0);
    for (const v of esito.violazioni) {
      expect(typeof v.indice).toBe('number');
      expect(v.motivo.length).toBeGreaterThan(0);
      expect(v.riformulazione.length).toBeGreaterThan(0);
    }
  });

  it('è idempotente: la stessa stringa dà lo stesso esito (regex globali)', () => {
    const frase = 'Ti consigliamo la soluzione migliore.';
    const a = verificaTestoUtente(frase);
    const b = verificaTestoUtente(frase);
    expect(a.violazioni.length).toBe(b.violazioni.length);
  });

  it('tollera stringa vuota e non-stringa', () => {
    expect(verificaTestoUtente('').conforme).toBe(true);
    expect(verificaTestoUtente(undefined as unknown as string).conforme).toBe(true);
  });
});

describe('lessico', () => {
  it('ha id univoci', () => {
    const ids = LESSICO_PRESCRITTIVO.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('verificaInsieme ritorna solo le chiavi non conformi', () => {
    const fuori = verificaInsieme({
      ok: 'Il totale del documento è 38,17 €.',
      ko: 'Ti raccomandiamo questa opzione.',
    });
    expect(fuori.map((f) => f.chiave)).toEqual(['ko']);
  });
});
