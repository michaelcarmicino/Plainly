/**
 * Test unitario della funzionalità 12 — agente core-engine.
 * Ogni valore atteso è calcolato a mano nel commento accanto all'asserzione:
 * un numero atteso che nessuno ha verificato documenta il difetto invece di
 * trovarlo. Niente snapshot.
 */

import { describe, expect, it } from 'vitest';
import { parseNumeroIt } from '../formatoIt.ts';
import {
  COSTO_BP_MAX,
  MOTIVI_RIFIUTO_COSTO,
  RISPARMIO_MAX_CENT,
  calcolaCostoFoglio,
  traduciCostoInEuro,
  type MotivoRifiutoCosto,
} from '../costoFoglio.ts';

function valoreDi(esito: ReturnType<typeof traduciCostoInEuro>) {
  if (!esito.ok) throw new Error(`atteso ok:true, ottenuto: ${esito.errore}`);
  return esito.valore;
}

function erroreDi(esito: ReturnType<typeof traduciCostoInEuro>): MotivoRifiutoCosto {
  if (esito.ok) throw new Error('atteso ok:false, ottenuto un risultato');
  return esito.errore;
}

describe('traduciCostoInEuro — il caso di riferimento della specifica', () => {
  // 1.000.000 x 150 / 10.000 = 15.000 cent -> 150,00 €
  // 15.000 / 12               =  1.250 esatti -> 12,50 €
  // controllo: 1.250 x 12     = 15.000 -> ricompone l'anno
  // su 100 €: 10.000 x 150 / 10.000 = 150 cent -> 1,50 €, cioè 150 bp
  const esito = traduciCostoInEuro({ costoAnnuoBp: 150, capitaleCent: 1_000_000 });

  it('calcola il costo di un anno', () => {
    expect(valoreDi(esito).costoAnnuoCent).toBe(15_000);
  });

  it('calcola il costo di un mese come il dodicesimo esatto dell\'anno', () => {
    expect(valoreDi(esito).costoMensileCent).toBe(1_250);
    expect(valoreDi(esito).costoMensileCent * 12).toBe(valoreDi(esito).costoAnnuoCent);
  });

  it('il paragone su 100 € coincide con i punti base', () => {
    expect(valoreDi(esito).costoPerCentoEuroCent).toBe(150);
  });
});

describe('traduciCostoInEuro — il caso con il resto: il mese non ricompone l\'anno', () => {
  // 350.000 x 230 / 10.000  = 8.050 cent -> 80,50 €
  // 8.050 / 12               = 670,833... -> 671 cent -> 6,71 €
  // controllo: 671 x 12      = 8.052, cioè 2 cent PIÙ dell'anno
  const esito = traduciCostoInEuro({ costoAnnuoBp: 230, capitaleCent: 350_000 });

  it('calcola il costo di un anno', () => {
    expect(valoreDi(esito).costoAnnuoCent).toBe(8_050);
  });

  it('arrotonda il mese per eccesso, e 12 volte il mese NON ricompone l\'anno', () => {
    expect(valoreDi(esito).costoMensileCent).toBe(671);
    expect(valoreDi(esito).costoMensileCent * 12).toBe(8_052);
    expect(valoreDi(esito).costoMensileCent * 12).not.toBe(valoreDi(esito).costoAnnuoCent);
  });

  it('il paragone su 100 € coincide comunque con i punti base', () => {
    expect(valoreDi(esito).costoPerCentoEuroCent).toBe(230);
  });
});

describe('traduciCostoInEuro — il caso zero', () => {
  it('costoAnnuoBp = 0 dà zero ovunque, ed è un esito ok', () => {
    const esito = traduciCostoInEuro({ costoAnnuoBp: 0, capitaleCent: 1_000_000 });
    expect(valoreDi(esito).costoAnnuoCent).toBe(0);
    expect(valoreDi(esito).costoMensileCent).toBe(0);
    expect(valoreDi(esito).costoPerCentoEuroCent).toBe(0);
  });
});

describe('traduciCostoInEuro — i confini', () => {
  it('costoAnnuoBp = 1001 è rifiutato: fuori dall\'intervallo 0..1000', () => {
    const esito = traduciCostoInEuro({ costoAnnuoBp: 1_001, capitaleCent: 1_000_000 });
    expect(erroreDi(esito)).toBe('costo-fuori-intervallo');
  });

  it('costoAnnuoBp = 1000 (10,00 %) è il confine ammesso', () => {
    const esito = traduciCostoInEuro({ costoAnnuoBp: COSTO_BP_MAX, capitaleCent: 1_000_000 });
    expect(esito.ok).toBe(true);
  });

  it('costoAnnuoBp negativo è rifiutato', () => {
    const esito = traduciCostoInEuro({ costoAnnuoBp: -1, capitaleCent: 1_000_000 });
    expect(erroreDi(esito)).toBe('costo-fuori-intervallo');
  });

  it('capitaleCent = 0 è rifiutato come somma mancante', () => {
    const esito = traduciCostoInEuro({ costoAnnuoBp: 150, capitaleCent: 0 });
    expect(erroreDi(esito)).toBe('somma-mancante');
  });

  it('capitaleCent negativo è rifiutato come somma mancante', () => {
    const esito = traduciCostoInEuro({ costoAnnuoBp: 150, capitaleCent: -1 });
    expect(erroreDi(esito)).toBe('somma-mancante');
  });

  it('capitaleCent = RISPARMIO_MAX_CENT + 1 è rifiutato come somma troppo alta', () => {
    const esito = traduciCostoInEuro({
      costoAnnuoBp: 150,
      capitaleCent: RISPARMIO_MAX_CENT + 1,
    });
    expect(erroreDi(esito)).toBe('somma-troppo-alta');
  });

  it('capitaleCent = RISPARMIO_MAX_CENT è il confine ammesso', () => {
    const esito = traduciCostoInEuro({ costoAnnuoBp: 150, capitaleCent: RISPARMIO_MAX_CENT });
    expect(esito.ok).toBe(true);
  });

  it('l\'elenco dei motivi è quello dichiarato dalla specifica, e nessun altro', () => {
    expect(MOTIVI_RIFIUTO_COSTO).toEqual([
      'costo-fuori-intervallo',
      'somma-troppo-alta',
      'somma-mancante',
    ]);
  });
});

describe('traduciCostoInEuro — l\'identità del paragone su 100 €', () => {
  it('costoPerCentoEuroCent === costoAnnuoBp per ogni valore ammesso', () => {
    for (const costoAnnuoBp of [0, 1, 150, 230, 500, 999, 1000]) {
      const r = calcolaCostoFoglio({ costoAnnuoBp, capitaleCent: 1_000_000 });
      expect(r.costoPerCentoEuroCent).toBe(costoAnnuoBp);
    }
  });
});

describe('il campo digitato: la virgola italiana, con l\'arrotondamento che conta', () => {
  // "2,30" in virgola mobile binaria vale 2.2999999999999998: senza
  // Math.round dentro parseNumeroIt il dominio riceverebbe 229 bp invece
  // di 230, cioè un centesimo sbagliato su ogni migliaio di euro.
  it('"2,30" digitato nel campo della percentuale diventa 230 bp, non 229', () => {
    expect(parseNumeroIt('2,30')).toBe(230);
  });

  it('"1,50" digitato diventa 150 bp', () => {
    expect(parseNumeroIt('1,50')).toBe(150);
  });
});
