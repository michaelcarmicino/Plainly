/**
 * Test unitari — confrontoRateMutuo.ts. Agente core-engine. Funzionalità 10.
 * Valori attesi calcolati a mano nella specifica, riportati nel commento.
 */
import { describe, expect, it } from 'vitest';
import { calcolaConfrontoRateMutuo, confrontaRateMutuo } from '../confrontoRateMutuo.ts';

const INGRESSO_RIFERIMENTO = {
  capitaleCent: 15_000_000,
  anni: 25,
  tassoFissoAnnuoBp: 346,
  tassoVariabilePartenzaAnnuoBp: 280,
};

describe('calcolaConfrontoRateMutuo — caso di riferimento', () => {
  it('calcola le due rate e la differenza sulle rate arrotondate', () => {
    const r = calcolaConfrontoRateMutuo(INGRESSO_RIFERIMENTO);
    // 74.772 (fermo) e 69.581 (mobile oggi): dalla verifica a mano in rataMutuo.
    expect(r.rataFissaCent).toBe(74_772);
    expect(r.rataVariabileOggiCent).toBe(69_581);
    // 74.772 − 69.581 = 5.191 cent al mese = 51,91 €
    expect(r.differenzaMensileCent).toBe(5_191);
    // 5.191 × 12 = 62.292 cent su 12 mesi = 622,92 €
    expect(r.differenzaSu12MesiCent).toBe(62_292);
    expect(r.mesi).toBe(300);
  });
});

describe('confrontaRateMutuo — i limiti dei campi digitati', () => {
  it('accetta il caso di riferimento', () => {
    const esito = confrontaRateMutuo(INGRESSO_RIFERIMENTO);
    expect(esito.ok).toBe(true);
  });

  it('rifiuta un capitale a zero prima di guardare i tassi', () => {
    const esito = confrontaRateMutuo({ ...INGRESSO_RIFERIMENTO, capitaleCent: 0 });
    expect(esito).toEqual({ ok: false, errore: 'capitale-a-zero' });
  });

  it('rifiuta anni fuori intervallo', () => {
    const esito = confrontaRateMutuo({ ...INGRESSO_RIFERIMENTO, anni: 41 });
    expect(esito).toEqual({ ok: false, errore: 'anni-fuori-intervallo' });
  });

  it('rifiuta anni = 0 PRIMA di calcolare: mai un Infinity a schermo', () => {
    // Con n = 0 la formula pura darebbe Infinity (vedi rataMutuo.test.ts):
    // il confine sta qui, in motivoAnni, e va superato prima del calcolo.
    const esito = confrontaRateMutuo({ ...INGRESSO_RIFERIMENTO, anni: 0 });
    expect(esito).toEqual({ ok: false, errore: 'anni-fuori-intervallo' });
  });

  it('rifiuta un capitale negativo con lo stesso codice dello zero', () => {
    const esito = confrontaRateMutuo({ ...INGRESSO_RIFERIMENTO, capitaleCent: -15_000_000 });
    expect(esito).toEqual({ ok: false, errore: 'capitale-a-zero' });
  });

  it('rifiuta il tasso fermo troppo alto prima del tasso mobile', () => {
    const esito = confrontaRateMutuo({ ...INGRESSO_RIFERIMENTO, tassoFissoAnnuoBp: 2_001 });
    expect(esito).toEqual({ ok: false, errore: 'tasso-troppo-alto' });
  });

  it('rifiuta il tasso mobile sotto zero', () => {
    const esito = confrontaRateMutuo({
      ...INGRESSO_RIFERIMENTO,
      tassoVariabilePartenzaAnnuoBp: -1,
    });
    expect(esito).toEqual({ ok: false, errore: 'tasso-sotto-zero' });
  });
});
