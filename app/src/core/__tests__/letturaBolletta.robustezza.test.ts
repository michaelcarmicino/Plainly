/**
 * Test unitario di letturaBolletta — funzionalità 05. Agente: core-engine.
 * Valori di confine: importi negativi, a sette cifre, venti righe, periodo
 * irrilevante, documento senza voci (docs/test/05-guida-bolletta.md, CL-05,
 * CL-09, CL-11, CL-12, CL-14, CL-15). Ogni valore atteso è calcolato a mano
 * nel commento accanto all'asserzione.
 */

import { describe, expect, it } from 'vitest';
import type { DocumentoUtente } from '../../../types/contracts.ts';
import { letturaBolletta } from '../letturaBolletta.ts';

function documento(parziale: Partial<DocumentoUtente> & { voci: DocumentoUtente['voci']; totaleDichiaratoCent: number }): DocumentoUtente {
  return {
    id: 'doc-prova',
    scenario: 'bolletta',
    provenienza: 'fixture',
    periodoInizio: '2026-07-01',
    periodoFine: '2026-08-31',
    ...parziale,
  };
}

describe('voce negativa: un conguaglio a credito (CL-05)', () => {
  it('il segno resta: una voce può pesare più del 100% del totale', () => {
    const doc = documento({
      totaleDichiaratoCent: 800, // 1000 - 200
      voci: [
        { id: 'v1', etichettaOriginale: 'Canone', categoria: 'canone', importoCent: 1000 },
        { id: 'v2', etichettaOriginale: 'Storno', categoria: 'una-tantum', importoCent: -200 },
      ],
    });
    // 1000*10000/800 = 12500 (125%) · -200*10000/800 = -2500 (-25%) · somma 10000
    const pesi = letturaBolletta(doc).voci.map((v) => v.pesoBp);
    expect(pesi).toEqual([12_500, -2_500]);
    expect(pesi[0] + pesi[1]).toBe(10_000);
  });
});

describe('importo a sette cifre in euro (CL-09)', () => {
  it('nessun overflow, i pesi restano esatti', () => {
    const doc = documento({
      totaleDichiaratoCent: 200_000_000, // 2.000.000,00 €
      voci: [
        { id: 'v1', etichettaOriginale: 'Energia', categoria: 'consumo', importoCent: 190_000_000, quantita: 1000 },
        { id: 'v2', etichettaOriginale: 'Trasporto', categoria: 'canone', importoCent: 10_000_000 },
      ],
    });
    const lettura = letturaBolletta(doc);
    // 190000000*10000/200000000 = 9500 · 10000000*10000/200000000 = 500 · somma 10000
    expect(lettura.voci.map((v) => v.pesoBp)).toEqual([9_500, 500]);
    expect(lettura.dueQuote).toEqual({
      energiaCent: 190_000_000,
      nonEnergiaCent: 10_000_000,
      pesoEnergiaBp: 9_500,
      pesoNonEnergiaBp: 500,
    });
  });
});

describe('venti righe e un totale a quattro cifre in euro (CL-14)', () => {
  it('nessuna voce persa, i venti pesi sommano a 10000', () => {
    const voci = Array.from({ length: 20 }, (_, i) => ({
      id: `v${i + 1}`,
      etichettaOriginale: `Voce numero ${i + 1}`,
      categoria: 'canone' as const,
      importoCent: 10_000,
    }));
    const lettura = letturaBolletta(documento({ totaleDichiaratoCent: 200_000, voci }));
    expect(lettura.voci).toHaveLength(20);
    // ciascuna: 10000*10000/200000 = 500; venti volte 500 = 10000
    expect(lettura.voci.every((v) => v.pesoBp === 500)).toBe(true);
    expect(lettura.voci.reduce((acc, v) => acc + v.pesoBp, 0)).toBe(10_000);
  });
});

describe('il periodo non entra mai nel calcolo (CL-11, CL-12)', () => {
  it('un mese o sei mesi danno esattamente lo stesso risultato', () => {
    const voci: DocumentoUtente['voci'] = [
      { id: 'v1', etichettaOriginale: 'Energia', categoria: 'consumo', importoCent: 4000, quantita: 160 },
      { id: 'v2', etichettaOriginale: 'Resto', categoria: 'canone', importoCent: 3876 },
    ];
    const unMese = letturaBolletta(documento({ totaleDichiaratoCent: 7876, voci, periodoInizio: '2026-07-01', periodoFine: '2026-07-31' }));
    const seiMesi = letturaBolletta(documento({ totaleDichiaratoCent: 7876, voci, periodoInizio: '2026-01-01', periodoFine: '2026-06-30' }));
    expect(unMese).toEqual(seiMesi);
  });
});

describe('documento senza alcuna voce (CL-15)', () => {
  it('nessuna riga, quadratura che non torna, nessun NaN', () => {
    const lettura = letturaBolletta(documento({ totaleDichiaratoCent: 500, voci: [] }));
    expect(lettura.voci).toEqual([]);
    // sommaVociCent = 0, diverso da 500 -> scartoCent = 0 - 500 = -500 (quadra=false)
    expect(lettura.quadratura).toEqual({ sommaVociCent: 0, totaleDichiaratoCent: 500, scartoCent: -500, quadra: false });
    // dueQuote è il complemento del TOTALE STAMPATO (vedi nota nel file
    // "limite"): 500 - 0 = 500, non 0. Con zero voci non c'è nulla da
    // spiegare, ma il totale pagato resta quello scritto sul documento.
    expect(lettura.dueQuote).toEqual({ energiaCent: 0, nonEnergiaCent: 500, pesoEnergiaBp: 0, pesoNonEnergiaBp: 10_000 });
    expect(lettura.costoPerKwh).toEqual({ ok: false, errore: 'quantita-assente' });
  });
});
