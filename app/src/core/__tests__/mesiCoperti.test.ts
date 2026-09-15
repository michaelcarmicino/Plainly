/**
 * Test unitario della funzionalità 09 — agente core-engine.
 * Ogni valore atteso è calcolato a mano nel commento accanto all'asserzione:
 * un numero atteso che nessuno ha verificato documenta il difetto invece di
 * trovarlo. Niente snapshot.
 */

import { describe, expect, it } from 'vitest';
import type { Esito } from '../esito.ts';
import {
  GIORNI_PER_MESE,
  MOTIVI_RIFIUTO_MESI_COPERTI,
  RISPARMI_MAX_CENT,
  SPESE_MENSILI_MAX_CENT,
  SPESE_MENSILI_MIN_CENT,
  calcolaMesiCoperti,
  mesiCoperti,
  type IngressoMesiCoperti,
  type MotivoRifiutoMesiCoperti,
} from '../mesiCoperti.ts';

/** Scorciatoia: il ramo ok:false non ha `valore`, il compilatore lo impone. */
function valoreDi(esito: ReturnType<typeof mesiCoperti>) {
  if (!esito.ok) throw new Error(`atteso ok:true, ottenuto: ${esito.errore}`);
  return esito.valore;
}

describe('mesiCoperti — il caso di riferimento della specifica', () => {
  // 1.200,00 €/mese di spese, 3.100,00 € da parte.
  // giorniCoperti = floor(310.000 * 30 / 120.000) = floor(9.300.000/120.000) = floor(77,5) = 77
  // mesiInteri     = floor(77/30)                                                          =  2
  // giorniResidui  = 77 - 2*30                                                             = 17
  // residuo        = 310.000 - 2*120.000 = 70.000 cent (700,00 €)
  // controprova: floor(70.000*30/120.000) = floor(17,5) = 17 ✓
  const ingresso = { speseMensiliCent: 120_000, risparmiCent: 310_000 };
  const esito = mesiCoperti(ingresso);

  it('calcola i giorni coperti', () => {
    expect(valoreDi(esito).giorniCoperti).toBe(77);
  });

  it('calcola i mesi interi e i giorni residui', () => {
    const v = valoreDi(esito);
    expect([v.mesiInteri, v.giorniResidui]).toEqual([2, 17]);
  });

  it('calcola il residuo dell ultimo mese', () => {
    expect(valoreDi(esito).residuoUltimoMeseCent).toBe(70_000);
  });

  it('riporta i dati di ingresso nel risultato, senza alterarli', () => {
    const v = valoreDi(esito);
    expect([v.speseMensiliCent, v.risparmiCent]).toEqual([120_000, 310_000]);
  });

  it('la firma stretta resta assegnabile a Esito<T>, come prescrive lo standard', () => {
    const generico: Esito<ReturnType<typeof calcolaMesiCoperti>> = esito;
    expect(generico.ok).toBe(true);
  });

  it('è deterministico: stesso ingresso, stesso risultato', () => {
    expect(valoreDi(mesiCoperti({ ...ingresso }))).toEqual(valoreDi(esito));
  });
});

describe('coerenza fra residuo in centesimi e giorni residui, su un secondo caso', () => {
  // 450,00 €/mese, 2.010,00 € da parte — cifre non tonde, diverse in grandezza.
  // giorniCoperti = floor(201.000*30/45.000) = floor(6.030.000/45.000) = floor(134) = 134
  // mesiInteri     = floor(134/30)                                                  =   4
  // giorniResidui  = 134 - 4*30                                                     =  14
  // residuo        = 201.000 - 4*45.000 = 21.000 cent (210,00 €)
  // controprova: floor(21.000*30/45.000) = floor(14) = 14 ✓
  const v = valoreDi(mesiCoperti({ speseMensiliCent: 45_000, risparmiCent: 201_000 }));

  it('la formula generalizza, non è cucita sul solo caso di riferimento', () => {
    expect([v.mesiInteri, v.giorniResidui, v.residuoUltimoMeseCent]).toEqual([4, 14, 21_000]);
  });

  it('i numeri tornano fra loro esattamente', () => {
    expect(v.mesiInteri * v.speseMensiliCent + v.residuoUltimoMeseCent).toBe(v.risparmiCent);
    // residuo convertito in giorni: floor(21.000*30/45.000) = floor(14) = 14
    expect(Math.floor((v.residuoUltimoMeseCent * GIORNI_PER_MESE) / v.speseMensiliCent)).toBe(
      v.giorniResidui,
    );
  });
});

describe('i due casi limite che la specifica nomina', () => {
  it('risparmi a zero: zero giorni, un risultato valido e non un rifiuto', () => {
    const esito = mesiCoperti({ speseMensiliCent: 120_000, risparmiCent: 0 });
    expect(esito.ok).toBe(true);
    // giorniCoperti = floor(0*30/120.000) = 0 · mesiInteri 0 · giorniResidui 0 · residuo 0
    expect(valoreDi(esito)).toMatchObject({
      giorniCoperti: 0,
      mesiInteri: 0,
      giorniResidui: 0,
      residuoUltimoMeseCent: 0,
    });
  });

  it('meno di un mese: spese superiori ai risparmi', () => {
    // spese 120.000, risparmi 50.000 (500,00 €)
    // giorniCoperti = floor(1.500.000/120.000) = floor(12,5) = 12 · mesiInteri 0 · residuo 50.000
    const v = valoreDi(mesiCoperti({ speseMensiliCent: 120_000, risparmiCent: 50_000 }));
    expect([v.giorniCoperti, v.mesiInteri, v.giorniResidui, v.residuoUltimoMeseCent]).toEqual([
      12, 0, 12, 50_000,
    ]);
  });
});

describe('nessun doppio arrotondamento vicino a un confine', () => {
  it('2,99999 mesi resta 2, non 3, per scorciatoia diretta o per passi', () => {
    // spese 100.000, risparmi 299.999 (2.999,99 €)
    // giorniCoperti = floor(299.999*30/100.000) = floor(8.999.970/100.000) = floor(89,9997) = 89
    // mesiInteri     = floor(89/30) = 2, e coincide con floor(299.999/100.000) = floor(2,99999) = 2
    // giorniResidui  = 89 - 60 = 29 · residuo = 299.999 - 200.000 = 99.999
    const v = valoreDi(mesiCoperti({ speseMensiliCent: 100_000, risparmiCent: 299_999 }));
    expect(v.mesiInteri).toBe(Math.floor(299_999 / 100_000));
    expect([v.giorniCoperti, v.mesiInteri, v.giorniResidui, v.residuoUltimoMeseCent]).toEqual([
      89, 2, 29, 99_999,
    ]);
  });
});

describe('confine massimo dei risparmi, senza overflow', () => {
  it('regge RISPARMI_MAX_CENT senza superare Number.MAX_SAFE_INTEGER', () => {
    // giorniCoperti = floor(30.000.000.000/120.000) = 250.000 (esatto)
    // mesiInteri     = floor(250.000/30) = 8.333 · giorniResidui = 250.000 - 249.990 = 10
    // residuo        = 1.000.000.000 - 8.333*120.000 = 1.000.000.000 - 999.960.000 = 40.000
    const v = valoreDi(
      mesiCoperti({ speseMensiliCent: 120_000, risparmiCent: RISPARMI_MAX_CENT }),
    );
    expect([v.giorniCoperti, v.mesiInteri, v.giorniResidui, v.residuoUltimoMeseCent]).toEqual([
      250_000, 8_333, 10, 40_000,
    ]);
  });
});

describe('il ramo ok:false porta un codice, non una frase', () => {
  type Caso = readonly [string, IngressoMesiCoperti, MotivoRifiutoMesiCoperti];

  const casi: readonly Caso[] = [
    ['spese con più di due decimali', { speseMensiliCent: 120_000.5, risparmiCent: 310_000 }, 'spese-non-leggibili'],
    ['spese che non sono un numero', { speseMensiliCent: Number.NaN, risparmiCent: 310_000 }, 'spese-non-leggibili'],
    ['spese esattamente a zero', { speseMensiliCent: 0, risparmiCent: 310_000 }, 'spese-a-zero'],
    ['spese sotto zero', { speseMensiliCent: -120_000, risparmiCent: 310_000 }, 'spese-negative'],
    // 999 cent è un centesimo sotto SPESE_MENSILI_MIN_CENT (1.000).
    ['spese sotto la soglia minima', { speseMensiliCent: SPESE_MENSILI_MIN_CENT - 1, risparmiCent: 310_000 }, 'spese-sotto-soglia'],
    ['spese sopra la soglia massima', { speseMensiliCent: SPESE_MENSILI_MAX_CENT + 1, risparmiCent: 310_000 }, 'spese-sopra-soglia'],
    ['risparmi con più di due decimali', { speseMensiliCent: 120_000, risparmiCent: 310_000.5 }, 'risparmi-non-leggibili'],
    ['risparmi che non sono un numero', { speseMensiliCent: 120_000, risparmiCent: Number.NaN }, 'risparmi-non-leggibili'],
    ['risparmi sotto zero', { speseMensiliCent: 120_000, risparmiCent: -1 }, 'risparmi-negativi'],
    ['risparmi sopra il limite', { speseMensiliCent: 120_000, risparmiCent: RISPARMI_MAX_CENT + 1 }, 'risparmi-sopra-soglia'],
  ];

  for (const [nome, ingresso, atteso] of casi) {
    it(`${nome}: codice ${atteso}, nessuna eccezione`, () => {
      const esito = mesiCoperti(ingresso);
      expect(esito.ok).toBe(false);
      expect(esito.ok === false && esito.errore).toBe(atteso);
    });
  }

  it('ogni codice esportato è raggiungibile da un ingresso', () => {
    const raggiunti = new Set(casi.map(([, , codice]) => codice));
    expect([...MOTIVI_RIFIUTO_MESI_COPERTI].filter((c) => !raggiunti.has(c))).toEqual([]);
  });

  it('i due confini dei campi sono inclusi, non esclusi', () => {
    expect(mesiCoperti({ speseMensiliCent: SPESE_MENSILI_MIN_CENT, risparmiCent: 1 }).ok).toBe(true);
    expect(
      mesiCoperti({ speseMensiliCent: SPESE_MENSILI_MAX_CENT, risparmiCent: RISPARMI_MAX_CENT }).ok,
    ).toBe(true);
  });
});
