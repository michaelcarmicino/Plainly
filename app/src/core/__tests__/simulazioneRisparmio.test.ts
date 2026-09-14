/**
 * Test unitario della funzionalità 07 — agente core-engine.
 * Ogni valore atteso è calcolato a mano nel commento accanto all'asserzione:
 * un numero atteso che nessuno ha verificato documenta il difetto invece di
 * trovarlo. Niente snapshot.
 */

import { describe, expect, it } from 'vitest';
import type { Esito } from '../esito.ts';
import type { RisultatoSimulazioneRisparmio } from '../simulazioneRisparmio.ts';
import {
  ANNI_MAX,
  MOTIVI_RIFIUTO_RISPARMIO,
  RISPARMIO_MAX_CENT,
  calcolaSimulazioneRisparmio,
  simulaRisparmio,
  type MotivoRifiutoRisparmio,
} from '../simulazioneRisparmio.ts';

/** Scorciatoia: il ramo ok:false non ha `valore`, il compilatore lo impone. */
function valoreDi(esito: ReturnType<typeof simulaRisparmio>) {
  if (!esito.ok) throw new Error(`atteso ok:true, ottenuto: ${esito.errore}`);
  return esito.valore;
}

describe('simulaRisparmio — il caso della specifica', () => {
  // 10.000,00 € fermi per 5 anni con i prezzi che salgono del 2,00% l'anno.
  // (1,02)^5                 = 1,1040808032        (102^5 = 11.040.808.032)
  // 1.000.000 / 1,1040808032 =   905.730,81  -> 905.731 cent (9.057,31 €)
  // perdita                  = 1.000.000 - 905.731 = 94.269 cent (942,69 €)
  // 10.000 / 1,1040808032    =     9.057,31  ->   9.057 cent (90,57 € su 100)
  const esito = simulaRisparmio({
    risparmioCent: 1_000_000,
    anni: 5,
    inflazioneAnnuaBp: 200,
  });

  it('calcola il valore reale al centesimo', () => {
    expect(valoreDi(esito).valoreRealeCent).toBe(905_731);
  });

  it('calcola la perdita come differenza fra la somma e il suo valore reale', () => {
    expect(valoreDi(esito).perditaCent).toBe(94_269);
  });

  it('calcola che cosa resta del valore di 100 €', () => {
    expect(valoreDi(esito).poterePerCentoEuroCent).toBe(9_057);
  });

  it('riporta l ingresso nel risultato, senza alterarlo', () => {
    const v = valoreDi(esito);
    expect([v.risparmioCent, v.anni, v.inflazioneAnnuaBp]).toEqual([1_000_000, 5, 200]);
  });

  it('la firma stretta resta assegnabile a Esito<T>, come prescrive lo standard', () => {
    const generico: Esito<RisultatoSimulazioneRisparmio> = esito;
    expect(generico.ok).toBe(true);
  });

  it('è deterministico: stesso ingresso, stesso risultato', () => {
    const secondo = simulaRisparmio({
      risparmioCent: 1_000_000,
      anni: 5,
      inflazioneAnnuaBp: 200,
    });
    expect(valoreDi(secondo)).toEqual(valoreDi(esito));
  });
});

describe('i due casi limite che la specifica nomina', () => {
  it('con anni = 0 il valore resta identico (moltiplicatore = 1)', () => {
    // (1,02)^0 = 1 esatto -> 1.000.000 / 1 = 1.000.000 cent, perdita 0,
    // e di ogni 100 € resta il valore di 100 € = 10.000 cent.
    const v = calcolaSimulazioneRisparmio({
      risparmioCent: 1_000_000,
      anni: 0,
      inflazioneAnnuaBp: 200,
    });
    expect([v.valoreRealeCent, v.perditaCent, v.poterePerCentoEuroCent]).toEqual([
      1_000_000, 0, 10_000,
    ]);
  });

  it('anni = 0 resta aritmetica valida ma non è un ingresso digitabile', () => {
    // Il confine sta qui, ed è voluto: 1-30 vincola il campo, non la formula.
    const esito = simulaRisparmio({ risparmioCent: 1_000_000, anni: 0, inflazioneAnnuaBp: 200 });
    expect(esito.ok).toBe(false);
    expect(esito.ok === false && esito.errore).toBe('anni-fuori-intervallo');
  });

  it('con inflazioneAnnuaBp = 0 non c erosione, per quanti anni passino', () => {
    // (1 + 0/10.000)^30 = 1^30 = 1 esatto -> valore identico, perdita 0.
    const v = valoreDi(
      simulaRisparmio({ risparmioCent: 1_000_000, anni: ANNI_MAX, inflazioneAnnuaBp: 0 }),
    );
    expect([v.valoreRealeCent, v.perditaCent, v.poterePerCentoEuroCent]).toEqual([
      1_000_000, 0, 10_000,
    ]);
  });
});

describe('dati lunghi — sette cifre e trent anni', () => {
  // 1.234.567,00 € fermi per 30 anni al 2,00% l'anno.
  // (1,02)^16 = 1,3727857051 -> (1,02)^15 = 1,3727857051 / 1,02 = 1,3458683383
  // (1,02)^30 = 1,3458683383^2                              = 1,8113615840
  // 123.456.700 / 1,8113615840 = 68.156.850,12 -> 68.156.850 cent (681.568,50 €)
  // perdita = 123.456.700 - 68.156.850 = 55.299.850 cent (552.998,50 €)
  // 10.000 / 1,8113615840 = 5.520,71 -> 5.521 cent (55,21 € su 100)
  const v = valoreDi(
    simulaRisparmio({ risparmioCent: 123_456_700, anni: 30, inflazioneAnnuaBp: 200 }),
  );

  it('regge un importo a sette cifre su trenta anni', () => {
    expect(v.valoreRealeCent).toBe(68_156_850);
  });

  it('la perdita quadra con la differenza', () => {
    expect(v.perditaCent).toBe(55_299_850);
    expect(v.risparmioCent - v.valoreRealeCent).toBe(v.perditaCent);
  });

  it('il paragone su 100 € non dipende dall importo digitato', () => {
    expect(v.poterePerCentoEuroCent).toBe(5_521);
  });
});

describe('il ramo ok:false porta un codice, non una frase', () => {
  type Caso = readonly [string, Parameters<typeof simulaRisparmio>[0], MotivoRifiutoRisparmio];
  const casi: readonly Caso[] = [
    ['somma con più di due decimali', { risparmioCent: 1_000.5, anni: 5, inflazioneAnnuaBp: 200 }, 'somma-non-leggibile'],
    ['somma che non è un numero', { risparmioCent: Number.NaN, anni: 5, inflazioneAnnuaBp: 200 }, 'somma-non-leggibile'],
    ['somma sotto zero', { risparmioCent: -1_000, anni: 5, inflazioneAnnuaBp: 200 }, 'somma-sotto-zero'],
    ['somma a zero', { risparmioCent: 0, anni: 5, inflazioneAnnuaBp: 200 }, 'somma-a-zero'],
    // 1.000.000.000 cent = 10.000.000,00 € è il limite: un centesimo oltre esce.
    ['somma oltre il limite', { risparmioCent: RISPARMIO_MAX_CENT + 1, anni: 5, inflazioneAnnuaBp: 200 }, 'somma-troppo-alta'],
    ['anni non interi', { risparmioCent: 1_000_000, anni: 5.5, inflazioneAnnuaBp: 200 }, 'anni-non-interi'],
    ['anni oltre trenta', { risparmioCent: 1_000_000, anni: 31, inflazioneAnnuaBp: 200 }, 'anni-fuori-intervallo'],
    ['tasso sotto zero', { risparmioCent: 1_000_000, anni: 5, inflazioneAnnuaBp: -100 }, 'tasso-sotto-zero'],
    ['tasso non in punti base interi', { risparmioCent: 1_000_000, anni: 5, inflazioneAnnuaBp: 2.5 }, 'tasso-non-leggibile'],
  ];

  for (const [nome, ingresso, atteso] of casi) {
    it(`${nome}: codice ${atteso}, nessuna eccezione`, () => {
      const esito = simulaRisparmio(ingresso);
      expect(esito.ok).toBe(false);
      expect(esito.ok === false && esito.errore).toBe(atteso);
    });
  }

  it('ogni codice esportato è raggiungibile da un ingresso', () => {
    // Se la schermata deve tradurne otto, otto devono poter capitare davvero.
    const raggiunti = new Set(casi.map(([, , codice]) => codice));
    expect([...MOTIVI_RIFIUTO_RISPARMIO].filter((c) => !raggiunti.has(c))).toEqual([]);
  });

  it('il limite della somma è incluso, non escluso', () => {
    // 1.000.000.000 cent esatti passano: il rifiuto parte da 1.000.000.001.
    expect(simulaRisparmio({ risparmioCent: RISPARMIO_MAX_CENT, anni: 5, inflazioneAnnuaBp: 200 }).ok).toBe(true);
  });
});
