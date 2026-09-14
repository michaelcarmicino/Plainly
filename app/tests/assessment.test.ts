/**
 * Assessment — agente impact-analyst.
 * La misura del miglioramento è il numero di slide 9: deve essere
 * calcolata, non raccontata.
 */

import { describe, expect, it } from 'vitest';
import { calcolaDelta, calcolaEsito, LIMITI_DICHIARATI } from '../src/assessment/index.ts';
import type { DomandaComprensione } from '../types/contracts.ts';

const domande: readonly DomandaComprensione[] = [
  {
    id: 'd1',
    testo: 'Quanto pesa il canone sul totale del trimestre?',
    opzioni: ['27,51%', '13,41%', '3,14%'],
    indiceCorretto: 0,
    motivazione: '10,50 € su 38,17 € di spese.',
  },
  {
    id: 'd2',
    testo: 'Quale voce non è ricostruibile dai dati del documento?',
    opzioni: ['Imposta di bollo', 'Competenze a debito', 'Canone carta'],
    indiceCorretto: 1,
    motivazione: 'Il documento riporta il tasso ma non la base di calcolo.',
  },
];

describe('punteggio', () => {
  it('calcola un punteggio 0..100', () => {
    const esito = calcolaEsito(domande, [
      { domandaId: 'd1', indiceScelto: 0 },
      { domandaId: 'd2', indiceScelto: 0 },
    ]);
    expect(esito.corrette).toBe(1);
    expect(esito.totale).toBe(2);
    expect(esito.punteggio).toBe(50);
  });

  it('vale 0 su questionario vuoto, senza dividere per zero', () => {
    expect(calcolaEsito([], []).punteggio).toBe(0);
  });

  it('il delta è null se manca una delle due rilevazioni', () => {
    expect(calcolaDelta(null, calcolaEsito(domande, []))).toBeNull();
  });

  it('il delta è la differenza dei punteggi', () => {
    const prima = calcolaEsito(domande, [{ domandaId: 'd1', indiceScelto: 1 }]);
    const dopo = calcolaEsito(domande, [
      { domandaId: 'd1', indiceScelto: 0 },
      { domandaId: 'd2', indiceScelto: 1 },
    ]);
    expect(calcolaDelta(prima, dopo)).toBe(100);
  });

  it('i limiti sono dichiarati insieme al risultato', () => {
    expect(LIMITI_DICHIARATI.length).toBeGreaterThan(0);
  });
});

describe('verifica prima/dopo', () => {
  it.todo('costruisciQuestionario genera le domande dallo scenario congelato');
  it.todo('componiVerifica produce prima, dopo e deltaPunteggio');
  it.todo('la stessa domanda è posta prima e dopo, senza riformulazioni');
  it.todo('l\'evidenza finisce in presentation/evidence/comprehension.json');
});
