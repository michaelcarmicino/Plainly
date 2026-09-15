/**
 * TEST DI quoteRata.ts — funzionalità 11, agente 01-core-engine (su
 * mandato di 03-ui-builder). Valori attesi calcolati a mano nel commento
 * accanto a ogni asserzione, come da standard-codice.md.
 *
 * Scenario comune, capitale prestato 100.000,00 € = 10.000.000 cent,
 * tasso 3,00% annuo = 300 bp, rata mensile 474,21 € = 47.421 cent su
 * 300 rate (25 anni) — la stessa rata dichiarata (non calcolata qui) nella
 * sezione «Elaborazione» di docs/features/11-approfondimento-sul-mutuo.md.
 */
import { describe, expect, test } from 'vitest';
import { calcolaRataCent } from '../rataMutuo.ts';
import { quoteDellaRata, totaleRestituitoCent } from '../quoteRata.ts';

const CAPITALE_PRESTATO_CENT = 10_000_000; // 100.000,00 €
const TASSO_300_BP = 300; // 3,00% annuo
const RATA_25_ANNI_CENT = 47_421; // 474,21 €, dichiarata da 10 (non calcolata qui)

describe('quoteDellaRata — prima e ultima rata, verificate a mano', () => {
  test('prima rata: il capitale residuo è tutto il prestito', () => {
    // interesse = 10.000.000 × 300 ÷ 120.000 = 25.000 cent = 250,00 €
    // capitale  = 47.421 − 25.000            = 22.421 cent = 224,21 €
    const { interesseCent, capitaleCent } = quoteDellaRata(
      CAPITALE_PRESTATO_CENT,
      TASSO_300_BP,
      RATA_25_ANNI_CENT,
    );
    expect(interesseCent).toBe(25_000);
    expect(capitaleCent).toBe(22_421);
  });

  test('ultima rata: capitale residuo dalla formula chiusa dichiarata in specifica', () => {
    // debito residuo (formula chiusa) = 47.421 ÷ 1,0025 = 47.302,74 -> 47.303 cent
    // interesse = 47.303 × 300 ÷ 120.000 = 118,26 -> 118 cent = 1,18 €
    // capitale  = 47.421 − 118              = 47.303 cent      = 473,03 €
    //
    // Nota: 47.303 è il residuo secondo la FORMULA CHIUSA che la specifica usa
    // per la sola verifica a mano dell'ultima riga. Il test sotto,
    // «la riconciliazione non risolta», mostra che il residuo prodotto
    // seguendo la RICORSIONE completa (rata dopo rata) è diverso — 47.352,
    // non 47.303 — e che le due vie non coincidono. Qui si riporta la cifra
    // che la specifica dichiara, non quella della ricorsione.
    const { interesseCent, capitaleCent } = quoteDellaRata(47_303, TASSO_300_BP, RATA_25_ANNI_CENT);
    expect(interesseCent).toBe(118);
    expect(capitaleCent).toBe(47_303);
  });

  test('tasso 0: nessun interesse, la rata è tutta quota capitale', () => {
    const { interesseCent, capitaleCent } = quoteDellaRata(CAPITALE_PRESTATO_CENT, 0, RATA_25_ANNI_CENT);
    expect(interesseCent).toBe(0);
    expect(capitaleCent).toBe(RATA_25_ANNI_CENT);
  });

  test('invariante: interesse + capitale = rata, sempre, per costruzione', () => {
    for (const [residuo, tasso, rata] of [
      [CAPITALE_PRESTATO_CENT, TASSO_300_BP, RATA_25_ANNI_CENT],
      [47_303, TASSO_300_BP, RATA_25_ANNI_CENT],
      [1, 1, 10],
      [0, 400, 52_784],
    ] as const) {
      const { interesseCent, capitaleCent } = quoteDellaRata(residuo, tasso, rata);
      expect(interesseCent + capitaleCent).toBe(rata);
    }
  });
});

describe('totaleRestituitoCent — su 300 rate, verificato a mano', () => {
  test('totale e interessi complessivi a 25 anni', () => {
    // totale    = 474,21 × 300 = 142.263,00 €  ->  14.226.300 cent
    // interessi = 142.263,00 − 100.000,00 = 42.263,00 €
    const totale = totaleRestituitoCent(RATA_25_ANNI_CENT, 300);
    expect(totale).toBe(14_226_300);
    expect(totale - CAPITALE_PRESTATO_CENT).toBe(4_226_300); // 42.263,00 €
  });
});

describe('integrazione con rataMutuo (10) — la rata non è scritta a mano', () => {
  /**
   * Alla scrittura del modulo `rataMutuo()` (funzionalità 10) non esisteva
   * ancora; è comparso — non finito, non ancora congelato — nel frattempo
   * come `calcolaRataCent` in src/core/rataMutuo.ts. Questo test verifica
   * che la rata dichiarata sopra come costante non sia stata scritta a
   * intuito: coincide con quanto produce la formula dell'ammortamento alla
   * francese, la stessa verificata a mano in docs/features/11-….md.
   */
  test('la rata a 25 anni, 3,00%, coincide con quella usata nei test qui sopra', () => {
    const rata = calcolaRataCent({
      capitaleCent: CAPITALE_PRESTATO_CENT,
      anni: 25,
      tassoAnnuoBp: TASSO_300_BP,
    });
    expect(rata).toBe(RATA_25_ANNI_CENT); // 47.421 cent = 474,21 €
  });
});

describe('la riconciliazione non risolta — dimostrazione, non soluzione', () => {
  /**
   * La specifica 11 dichiara che «le quote capitale di tutte le rate
   * rimesse insieme ridanno esattamente il capitale prestato». Questo test
   * simula le 300 rate applicando `quoteDellaRata` in ricorsione — lo stesso
   * modo in cui una schermata che mostrasse il piano intero dovrebbe usarla
   * — e mostra che l'invariante NON regge da sola: resta uno scarto.
   *
   * I valori qui sotto non sono calcolati a mano (300 passi non si rifanno
   * su carta): sono il risultato deterministico della stessa ricorsione
   * eseguita una volta con uno script e riportato qui come valore atteso,
   * verificabile rieseguendo la stessa funzione — non un numero scelto a
   * intuito. Il test esiste per rendere visibile lo scarto, non per farlo
   * sparire: se in futuro la specifica decide una regola per l'ultima rata
   * (per esempio farle assorbire il residuo esatto), questo test smette di
   * passare ed è quello il segnale che la regola è stata applicata.
   */
  test('senza una regola per l\'ultima rata, la somma delle 300 quote capitale non torna esatta', () => {
    let residuoCent = CAPITALE_PRESTATO_CENT;
    let sommaCapitaleCent = 0;
    for (let rata = 0; rata < 300; rata += 1) {
      const { capitaleCent } = quoteDellaRata(residuoCent, TASSO_300_BP, RATA_25_ANNI_CENT);
      sommaCapitaleCent += capitaleCent;
      residuoCent -= capitaleCent;
    }
    // Scarto misurato: 49 cent restano formalmente "non rimborsati" dopo
    // 300 rate — cioè la somma delle quote capitale è 49 cent IN MENO del
    // capitale prestato, e il debito residuo finale è 49 cent, non zero.
    expect(sommaCapitaleCent).toBe(9_999_951);
    expect(residuoCent).toBe(49);
    expect(CAPITALE_PRESTATO_CENT - sommaCapitaleCent).toBe(49);
  });
});
