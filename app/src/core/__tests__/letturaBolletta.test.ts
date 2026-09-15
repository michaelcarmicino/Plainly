/**
 * Test unitario di letturaBolletta — funzionalità 05. Agente: core-engine.
 * Percorso nominale: la bolletta della luce dichiarata nella specifica
 * (docs/features/05, «La fixture, per esteso»). Ogni valore atteso è
 * calcolato a mano nel commento accanto all'asserzione. Niente snapshot.
 *
 * `fixtures/bolletta-luce-bimestrale.input.json` non esiste ancora — è
 * dell'architetto. Il documento qui sotto TRASCRIVE la tabella della
 * specifica, non la inventa: da sostituire con l'import della fixture reale
 * non appena esiste.
 */

import { describe, expect, it } from 'vitest';
import type { DocumentoUtente } from '../../../types/contracts.ts';
import { letturaBolletta } from '../letturaBolletta.ts';

const BOLLETTA_LUCE: DocumentoUtente = {
  id: 'bolletta-luce-2026-lug-ago',
  scenario: 'bolletta',
  provenienza: 'fixture',
  periodoInizio: '2026-07-01',
  periodoFine: '2026-08-31',
  totaleDichiaratoCent: 7876,
  voci: [
    {
      id: 'voce-01',
      etichettaOriginale: 'Spesa per la materia energia',
      categoria: 'consumo',
      importoCent: 4000,
      quantita: 160,
      unitaMisura: 'kWh',
    },
    {
      id: 'voce-02',
      etichettaOriginale: 'Spesa per il trasporto e la gestione del contatore',
      categoria: 'canone',
      importoCent: 1800,
      ricorrente: true,
    },
    { id: 'voce-03', etichettaOriginale: 'Spesa per oneri di sistema', categoria: 'altro', importoCent: 1000 },
    { id: 'voce-04', etichettaOriginale: 'Accisa (imposta di consumo)', categoria: 'imposta', importoCent: 360 },
    {
      id: 'voce-05',
      etichettaOriginale: 'IVA 10%',
      categoria: 'imposta',
      importoCent: 716,
      aliquotaBp: 1000,
    },
  ],
};

describe('letturaBolletta — percorso nominale sulla bolletta della luce', () => {
  const lettura = letturaBolletta(BOLLETTA_LUCE);

  it('la quadratura torna: la somma delle cinque voci è il totale stampato', () => {
    // 4000+1800+1000+360+716 = 7876, uguale al totale dichiarato -> scarto 0
    expect(lettura.quadratura).toEqual({
      sommaVociCent: 7876,
      totaleDichiaratoCent: 7876,
      scartoCent: 0,
      quadra: true,
    });
    expect(lettura.totaleCent).toBe(7876);
  });

  it('i cinque pesi in punti base sommano esattamente a 10000', () => {
    // 4000*10000/7876=5078,72->5079 · 1800*10000/7876=2285,42->2285
    // 1000*10000/7876=1269,68->1270 · 360*10000/7876=457,08->457
    // 716*10000/7876=909,09->909 · somma = 10000
    expect(lettura.voci.map((v) => v.pesoBp)).toEqual([5079, 2285, 1270, 457, 909]);
    expect(lettura.voci.reduce((acc, v) => acc + v.pesoBp, 0)).toBe(10_000);
  });

  it('le etichette originali restano intatte, nell\'ordine del documento, nessuna omessa', () => {
    expect(lettura.voci.map((v) => v.etichettaOriginale)).toEqual([
      'Spesa per la materia energia',
      'Spesa per il trasporto e la gestione del contatore',
      'Spesa per oneri di sistema',
      'Accisa (imposta di consumo)',
      'IVA 10%',
    ]);
    // la categoria 'altro' degli oneri di sistema non viene "aggiustata" in imposta
    expect(lettura.voci[2]?.categoria).toBe('altro');
  });

  it('le due quote: 40,00 € dipendono dal consumo, 38,76 € no, e i pesi sommano a 10000', () => {
    // energiaCent = voce-01 = 4000; nonEnergiaCent = 7876 - 4000 = 3876
    // pesoEnergia = 4000*10000/7876 = 5079 (identico al peso di voce-01)
    // pesoNonEnergia = 3876*10000/7876 = 4921,28 -> 4921
    expect(lettura.dueQuote).toEqual({
      energiaCent: 4000,
      nonEnergiaCent: 3876,
      pesoEnergiaBp: 5079,
      pesoNonEnergiaBp: 4921,
    });
    expect(lettura.dueQuote.pesoEnergiaBp + lettura.dueQuote.pesoNonEnergiaBp).toBe(10_000);
  });

  it('il prezzo dell\'energia e il costo totale, sugli stessi 160 kWh stampati: quasi il doppio', () => {
    // prezzoEnergiaPerKwhCent = 4000/160 = 25 esatto (0,25 €/kWh)
    // costoTotalePerKwhCent = round(7876/160) = round(49,225) = 49 (0,49 €/kWh)
    expect(lettura.costoPerKwh).toEqual({
      ok: true,
      valore: { prezzoEnergiaPerKwhCent: 25, costoTotalePerKwhCent: 49 },
    });
  });

  it('controllo incrociato: il 10% stampato su voce-05 applicato alle altre quattro voci dà esattamente voce-05', () => {
    // base imponibile = 4000+1800+1000+360 = 7160; 7160*1000/10000 = 716
    const ivaVoce = BOLLETTA_LUCE.voci.find((v) => v.id === 'voce-05');
    const baseImponibileCent = BOLLETTA_LUCE.voci
      .filter((v) => v.id !== 'voce-05')
      .reduce((acc, v) => acc + v.importoCent, 0);
    expect(baseImponibileCent).toBe(7160);
    expect(Math.round((baseImponibileCent * (ivaVoce?.aliquotaBp ?? 0)) / 10_000)).toBe(716);
    expect(ivaVoce?.importoCent).toBe(716);
  });

  it('la spiegazione di ogni voce è fattuale: descrive il calcolo, non un\'azione da compiere', () => {
    // La conformità lessicale è già coperta da tests/lessico-ui.test.ts, che
    // scandisce l'intero sorgente di src/: qui si verifica solo il contenuto
    // atteso, non si ripete la scansione lessicale.
    // la voce di consumo dichiara la dipendenza dal consumo, le altre no
    expect(lettura.voci[0]?.spiegazione).toContain('Dipende da quanto è stato consumato');
    expect(lettura.voci[1]?.spiegazione).toContain('Non dipende da quanto è stato consumato');
  });
});
