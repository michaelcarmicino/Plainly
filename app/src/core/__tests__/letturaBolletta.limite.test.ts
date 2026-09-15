/**
 * Test unitario di letturaBolletta — funzionalità 05. Agente: core-engine.
 * Casi limite ed errori attesi richiesti dalla specifica (docs/features/05,
 * «Come si dimostra che ha funzionato») e dai casi del tester
 * (docs/test/05-guida-bolletta.md, gruppi 2 e 3). Ogni valore atteso è
 * calcolato a mano nel commento accanto all'asserzione.
 *
 * NOTA PER L'ARCHITETTO E IL TESTER — due scarti dal referto del tester,
 * spiegati anche qui dove si vedono nel numero:
 * 1. `verificaQuadratura` (già esistente in ./index.ts, riusata qui) calcola
 *    `scartoCent = sommaVociCent - totaleDichiaratoCent`. Il tester aveva
 *    scritto il segno opposto per E-01 e CL-15 (`scartoCent = +1` / `+500`):
 *    qui sotto uso il segno della funzione già implementata, non la riscrivo.
 * 2. Le due quote (dueQuote) sono definite come complemento del TOTALE
 *    STAMPATO (`documento.totaleDichiaratoCent`), non della somma delle voci
 *    presenti: coerente con `pesoInBp(v.importoCent, documento.totaleDichiaratoCent)`
 *    già in tests/core.test.ts. Su un documento senza voci (vedi CL-15) questo
 *    dà `nonEnergiaCent = totaleCent`, non 0 come ipotizzato dal tester.
 */

import { describe, expect, it } from 'vitest';
import type { DocumentoUtente } from '../../../types/contracts.ts';
import { letturaBolletta } from '../letturaBolletta.ts';

const CONSUMO = { id: 'v-c', etichettaOriginale: 'Materia energia', categoria: 'consumo' as const };

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

describe('la quadratura che non torna si segnala, non si corregge (E-01)', () => {
  it('scarto di un centesimo: quadra=false, il totale mostrato resta quello stampato', () => {
    const doc = documento({
      totaleDichiaratoCent: 7877, // alterato di 1 cent, voci invariate (sommano 7876)
      voci: [{ ...CONSUMO, importoCent: 4000, quantita: 160 }, { id: 'v2', etichettaOriginale: 'Trasporto', categoria: 'canone', importoCent: 3876 }],
    });
    const lettura = letturaBolletta(doc);
    // sommaVociCent = 4000+3876 = 7876; scartoCent = 7876 - 7877 = -1 (vedi nota di testa sul segno)
    expect(lettura.quadratura).toEqual({ sommaVociCent: 7876, totaleDichiaratoCent: 7877, scartoCent: -1, quadra: false });
    expect(lettura.totaleCent).toBe(7877); // il totale stampato, non la somma delle voci
  });
});

describe('bolletta senza voce di consumo (CL-08): conguaglio a zero consumi', () => {
  it('energiaCent è 0, nonEnergiaCent prende tutto, nessun NaN', () => {
    const doc = documento({
      totaleDichiaratoCent: 3876,
      voci: [
        { id: 'v1', etichettaOriginale: 'Trasporto', categoria: 'canone', importoCent: 1800 },
        { id: 'v2', etichettaOriginale: 'Oneri', categoria: 'altro', importoCent: 1000 },
        { id: 'v3', etichettaOriginale: 'Accisa', categoria: 'imposta', importoCent: 360 },
        { id: 'v4', etichettaOriginale: 'IVA', categoria: 'imposta', importoCent: 716 },
      ],
    });
    const lettura = letturaBolletta(doc);
    expect(lettura.dueQuote).toEqual({ energiaCent: 0, nonEnergiaCent: 3876, pesoEnergiaBp: 0, pesoNonEnergiaBp: 10_000 });
    expect(lettura.costoPerKwh).toEqual({ ok: false, errore: 'quantita-assente' });
  });
});

describe('il costo per kWh non si mostra quando manca un dato — mai Infinity, mai NaN', () => {
  it('quantita a zero (CL-06): 4000/0 sarebbe Infinity in JS, qui è un errore dichiarato', () => {
    const doc = documento({ totaleDichiaratoCent: 4000, voci: [{ ...CONSUMO, importoCent: 4000, quantita: 0 }] });
    expect(letturaBolletta(doc).costoPerKwh).toEqual({ ok: false, errore: 'quantita-zero' });
  });

  it('quantita assente (CL-07): 4000/undefined sarebbe NaN in JS, qui è un errore diverso dal precedente', () => {
    const doc = documento({ totaleDichiaratoCent: 4000, voci: [{ ...CONSUMO, importoCent: 4000 }] });
    expect(letturaBolletta(doc).costoPerKwh).toEqual({ ok: false, errore: 'quantita-assente' });
  });

  it('divisione non esatta (CL-02): il valore mostrato è un intero, mai un centesimo frazionario', () => {
    // 4001/160 = 25,00625 -> round -> 25. La specifica non impone questo
    // arrotondamento per il passo 5 (lo dichiara "esatto" sulla sua fixture),
    // ma standard-codice.md vieta ogni float nel dominio: si arrotonda.
    const doc = documento({ totaleDichiaratoCent: 4001, voci: [{ ...CONSUMO, importoCent: 4001, quantita: 160 }] });
    const esito = letturaBolletta(doc).costoPerKwh;
    expect(esito.ok).toBe(true);
    expect(esito.ok && esito.valore.prezzoEnergiaPerKwhCent).toBe(25);
    expect(esito.ok && Number.isInteger(esito.valore.prezzoEnergiaPerKwhCent)).toBe(true);
  });
});

describe('nessuna correzione silenziosa (E-03, E-04, E-05)', () => {
  it('una voce a zero resta in elenco, con peso zero: non sparisce (E-03, CL-04)', () => {
    const doc = documento({
      totaleDichiaratoCent: 7516, // 7876 - 360: l'accisa passa a 0
      voci: [
        { ...CONSUMO, importoCent: 4000, quantita: 160 },
        { id: 'v2', etichettaOriginale: 'Trasporto', categoria: 'canone', importoCent: 1800 },
        { id: 'v3', etichettaOriginale: 'Oneri', categoria: 'altro', importoCent: 1000 },
        { id: 'v4', etichettaOriginale: 'Accisa', categoria: 'imposta', importoCent: 0 },
        { id: 'v5', etichettaOriginale: 'IVA', categoria: 'imposta', importoCent: 716 },
      ],
    });
    const lettura = letturaBolletta(doc);
    expect(lettura.voci).toHaveLength(5);
    expect(lettura.voci.find((v) => v.id === 'v4')).toMatchObject({ importoCent: 0, pesoBp: 0 });
  });

  it('i pesi non vengono forzati a sommare 10000 (E-04)', () => {
    const doc = documento({
      totaleDichiaratoCent: 3,
      voci: [1, 2, 3].map((n) => ({ id: `v${n}`, etichettaOriginale: `Voce ${n}`, categoria: 'altro' as const, importoCent: 1 })),
    });
    // 1*10000/3 = 3333,33 -> 3333, per tutte e tre: somma 9999, non 10000
    expect(letturaBolletta(doc).voci.map((v) => v.pesoBp)).toEqual([3333, 3333, 3333]);
  });

  it('nessun campo di proiezione annua compare nell\'output (E-05)', () => {
    const doc = documento({ totaleDichiaratoCent: 100, voci: [{ id: 'v1', etichettaOriginale: 'Voce', categoria: 'canone', importoCent: 100 }] });
    expect(Object.keys(letturaBolletta(doc))).not.toContain('proiezioneAnnuaCent');
  });
});
