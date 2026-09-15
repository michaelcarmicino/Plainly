/**
 * Test unitari — ipotesiTassoVariabile.ts. Agente core-engine. Funzionalità 10.
 * Valori attesi calcolati a mano nella specifica, riportati nel commento.
 */
import { describe, expect, it } from 'vitest';
import { calcolaScalaIpotesiTassoVariabile } from '../ipotesiTassoVariabile.ts';

describe('calcolaScalaIpotesiTassoVariabile — caso di riferimento', () => {
  const capitaleCent = 15_000_000;
  const anni = 25;
  const tassoVariabilePartenzaAnnuoBp = 280;
  const rataVariabileOggiCent = 69_581; // verificata a mano in rataMutuo.test.ts

  it('produce le quattro righe nell ordine degli scarti', () => {
    const scala = calcolaScalaIpotesiTassoVariabile(
      capitaleCent,
      anni,
      tassoVariabilePartenzaAnnuoBp,
      rataVariabileOggiCent,
      [-100, 0, 100, 200],
    );

    expect(scala.map((riga) => riga.scartoBp)).toEqual([-100, 0, 100, 200]);

    // −1 punto -> 180 bp -> 62.128 cent (arrotonda per eccesso, vedi rataMutuo.test.ts)
    expect(scala[0]).toMatchObject({
      tassoIpotesiBp: 180,
      rataIpotesiCent: 62_128,
      // 62.128 − 69.581 = −7.453 cent al mese, × 12 = −89.436
      differenzaMensileVsOggiCent: -7_453,
      differenzaAnnuaVsOggiCent: -89_436,
    });

    // 0 -> 280 bp -> è la rata di oggi: nessuna differenza.
    expect(scala[1]).toMatchObject({
      tassoIpotesiBp: 280,
      rataIpotesiCent: 69_581,
      differenzaMensileVsOggiCent: 0,
      differenzaAnnuaVsOggiCent: 0,
    });

    // +1 punto -> 380 bp -> 77.528 cent
    expect(scala[2]).toMatchObject({
      tassoIpotesiBp: 380,
      rataIpotesiCent: 77_528,
      // 77.528 − 69.581 = 7.947 cent al mese, × 12 = 95.364
      differenzaMensileVsOggiCent: 7_947,
      differenzaAnnuaVsOggiCent: 95_364,
    });

    // +2 punti -> 480 bp -> 85.950 cent (arrotonda per eccesso)
    expect(scala[3]).toMatchObject({
      tassoIpotesiBp: 480,
      rataIpotesiCent: 85_950,
      // 85.950 − 69.581 = 16.369 cent al mese, × 12 = 196.428
      differenzaMensileVsOggiCent: 16_369,
      differenzaAnnuaVsOggiCent: 196_428,
    });
  });

  it('taglia a zero uno scarto che scenderebbe sotto zero', () => {
    const scala = calcolaScalaIpotesiTassoVariabile(
      capitaleCent,
      anni,
      50, // tasso di partenza basso: uno scarto di -100 scenderebbe a -50
      12_345,
      [-100],
    );
    expect(scala[0].tassoIpotesiBp).toBe(0);
    // tasso 0 bp, 25 anni -> 15.000.000 / 300 = 50.000 cent esatti.
    expect(scala[0].rataIpotesiCent).toBe(50_000);
  });
});
