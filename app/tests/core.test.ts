/**
 * Core — agente core-engine.
 * Verdi: formato italiano e quadratura (già implementati).
 * TODO: il calcolo della lettura, che dipende dallo scenario congelato a T+1:40.
 */

import { describe, expect, it } from 'vitest';
import {
  formattaEuro,
  formattaPercentuale,
  parseNumeroIt,
  pesoInBp,
  verificaQuadratura,
} from '../src/core/index.ts';
import input from '../fixtures/estratto-conto-trimestrale.input.json' with { type: 'json' };
import atteso from '../fixtures/estratto-conto-trimestrale.atteso.json' with { type: 'json' };
import type { DocumentoUtente } from '../types/contracts.ts';

const documento = input as unknown as DocumentoUtente;

describe('formato italiano', () => {
  it('formatta gli importi con separatore di migliaia e virgola decimale', () => {
    expect(formattaEuro(123456)).toBe('1.234,56 €');
    expect(formattaEuro(3817)).toBe('38,17 €');
    expect(formattaEuro(-500)).toBe('-5,00 €');
    expect(formattaEuro(0)).toBe('0,00 €');
  });

  it('formatta le percentuali dai punti base', () => {
    expect(formattaPercentuale(590)).toBe('5,90%');
    expect(formattaPercentuale(2751)).toBe('27,51%');
    expect(formattaPercentuale(10000)).toBe('100,00%');
  });

  it('legge i numeri scritti in italiano', () => {
    expect(parseNumeroIt('1.234,56')).toBe(123456);
    expect(parseNumeroIt('38,17 €')).toBe(3817);
    expect(parseNumeroIt('1,234.56')).toBeNull();
  });
});

describe('quadratura sulla fixture di riferimento', () => {
  it('la somma delle voci coincide con il totale dichiarato', () => {
    expect(verificaQuadratura(documento)).toEqual(atteso.quadratura);
  });

  it('i pesi in punti base sommano a 10000', () => {
    const pesi = documento.voci.map((v) =>
      pesoInBp(v.importoCent, documento.totaleDichiaratoCent),
    );
    expect(pesi.reduce((a, b) => a + b, 0)).toBe(10_000);
    expect(pesi).toEqual(atteso.voci.map((v) => v.pesoBp));
  });
});

describe('calcolo della lettura', () => {
  it.todo('calcolaLettura riproduce esattamente estratto-conto-trimestrale.atteso.json');
  it.todo('aggrega gli importi per categoria');
  it.todo('proietta su 12 mesi solo le voci ricorrenti');
  it.todo('elenca in nonClassificate le voci che non sa spiegare, senza nasconderle');
  it.todo('non altera mai etichettaOriginale');
});
