/**
 * Test unitari — rataMutuo.ts. Agente core-engine. Funzionalità 10.
 * Valori attesi calcolati a mano, riportati nel commento accanto
 * all'asserzione, dalla verifica in docs/features/10-*.md.
 */
import { describe, expect, it } from 'vitest';
import {
  ANNI_MUTUO_MAX,
  ANNI_MUTUO_MIN,
  CAPITALE_MUTUO_MAX_CENT,
  TASSO_MUTUO_MAX_BP,
  calcolaRataCent,
  motivoAnni,
  motivoCapitale,
  motivoTasso,
} from '../rataMutuo.ts';

describe('calcolaRataCent — caso di riferimento 150.000 € / 25 anni', () => {
  const capitaleCent = 15_000_000;
  const anni = 25;

  it('tasso fermo 346 bp', () => {
    // i = 346 / 120.000 = 0,0028833333…
    // (1+i)^300 = 2,3720518741
    // rata grezza = 15.000.000 × (0,0028833333 × 2,3720518741) / 1,3720518741
    //             = 74.772,131791 -> 74.772 cent = 747,72 €
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 346 })).toBe(74_772);
  });

  it('tasso che si muove, oggi, 280 bp', () => {
    // i = 280 / 120.000 = 0,0023333333…
    // (1+i)^300 = 2,0121113658
    // rata grezza = 69.581,174744 -> 69.581 cent = 695,81 €
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 280 })).toBe(69_581);
  });

  it('ipotesi a −1 punto, 180 bp, arrotonda per eccesso', () => {
    // (1+i)^300 = 1,5677834980 -> rata grezza 62.127,780801 -> 62.128
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 180 })).toBe(62_128);
  });

  it('ipotesi a +1 punto, 380 bp', () => {
    // (1+i)^300 = 2,5818314238 -> rata grezza 77.528,484254 -> 77.528
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 380 })).toBe(77_528);
  });

  it('ipotesi a +2 punti, 480 bp, arrotonda per eccesso', () => {
    // (1+i)^300 = 3,3121793309 -> rata grezza 85.949,544310 -> 85.950
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 480 })).toBe(85_950);
  });

  it('tasso a 0 bp: la formula degenera in capitale ÷ numero di rate', () => {
    // 15.000.000 / 300 = 50.000 cent esatti, un solo arrotondamento (nessuno).
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 0 })).toBe(50_000);
  });

  it('NON arrotonda la crescita a metà calcolo: un centesimo di differenza', () => {
    // Se (1+i)^300 venisse arrotondato a 4 decimali (2,3721) PRIMA di essere
    // riusato, il risultato scenderebbe a 74.771 cent invece di 74.772: la
    // prova che l'unico arrotondamento della funzione è l'ultimo.
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 346 })).not.toBe(74_771);
    expect(calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: 346 })).toBe(74_772);
  });

  it('documenta il confine non validato qui: anni = 0 dà Infinity', () => {
    // Non è un caso che la funzione pura debba gestire in modo significativo
    // (a differenza di tassoAnnuoBp = 0): il confine sta in motivoAnni, che
    // rifiuta anni < ANNI_MUTUO_MIN PRIMA che questa funzione sia chiamata
    // da confrontaRateMutuo. Il test fissa il comportamento di chi la
    // chiamasse comunque, così un cambiamento silenzioso si vede.
    expect(calcolaRataCent({ capitaleCent, anni: 0, tassoAnnuoBp: 346 })).toBe(Infinity);
    expect(calcolaRataCent({ capitaleCent, anni: 0, tassoAnnuoBp: 0 })).toBe(Infinity);
  });
});

describe('motivoCapitale', () => {
  it('accetta un capitale nel range', () => {
    expect(motivoCapitale(15_000_000)).toBeNull();
  });
  it('rifiuta un numero non intero (NaN incluso)', () => {
    expect(motivoCapitale(Number.NaN)).toBe('capitale-non-leggibile');
  });
  it('rifiuta zero o sotto zero', () => {
    expect(motivoCapitale(0)).toBe('capitale-a-zero');
    expect(motivoCapitale(-100)).toBe('capitale-a-zero');
  });
  it('rifiuta sopra il massimo', () => {
    // 200_000_000 è il massimo consentito: un centesimo sopra rifiuta.
    expect(motivoCapitale(CAPITALE_MUTUO_MAX_CENT + 1)).toBe('capitale-troppo-alto');
    expect(motivoCapitale(CAPITALE_MUTUO_MAX_CENT)).toBeNull();
  });
});

describe('motivoAnni', () => {
  it('accetta i confini dell intervallo', () => {
    expect(motivoAnni(ANNI_MUTUO_MIN)).toBeNull();
    expect(motivoAnni(ANNI_MUTUO_MAX)).toBeNull();
  });
  it('rifiuta un valore non intero', () => {
    expect(motivoAnni(25.5)).toBe('anni-non-interi');
  });
  it('rifiuta fuori intervallo', () => {
    expect(motivoAnni(0)).toBe('anni-fuori-intervallo');
    expect(motivoAnni(41)).toBe('anni-fuori-intervallo');
  });
});

describe('motivoTasso', () => {
  it('accetta 0 e il massimo', () => {
    expect(motivoTasso(0)).toBeNull();
    expect(motivoTasso(TASSO_MUTUO_MAX_BP)).toBeNull();
  });
  it('rifiuta non interi, negativi, sopra il massimo', () => {
    expect(motivoTasso(3.46)).toBe('tasso-non-leggibile');
    expect(motivoTasso(-1)).toBe('tasso-sotto-zero');
    expect(motivoTasso(TASSO_MUTUO_MAX_BP + 1)).toBe('tasso-troppo-alto');
  });
});
