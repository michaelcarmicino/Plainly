/**
 * IL TYPE GUARD DEL REGISTRO — agente ui-builder. Funzionalità 14.
 * Test unitario di tipi.ts, accanto al codice (come src/core/__tests__/):
 * una dichiarazione malformata deve rompere forte e nominare il file,
 * non sparire in silenzio. Il caso buono e i quattro modi di rompersi.
 */

import { describe, expect, it } from 'vitest';
import { leggiDichiarazioneSchermata } from '../tipi.ts';

const BASE = { id: 'prova', percorso: '#/prova', componente: () => null, passo: 'navHome' };

describe('leggiDichiarazioneSchermata', () => {
  it('accetta una dichiarazione con i quattro campi richiesti', () => {
    expect(leggiDichiarazioneSchermata(BASE, 'prova.ts')).toBe(BASE);
  });

  it('accetta anche il campo facoltativo "stringhe"', () => {
    const conStringhe = { ...BASE, stringhe: ['navHome'] };
    expect(leggiDichiarazioneSchermata(conStringhe, 'prova.ts')).toBe(conStringhe);
  });

  it('rifiuta e nomina il file quando manca "id"', () => {
    const senzaId = { percorso: '#/prova', componente: () => null, passo: 'navHome' };
    expect(() => leggiDichiarazioneSchermata(senzaId, 'rotta-01.ts')).toThrow(/rotta-01\.ts/);
  });

  it('rifiuta un percorso che non inizia con "#/"', () => {
    const percorsoStorto = { ...BASE, percorso: 'valore-dei-risparmi' };
    expect(() => leggiDichiarazioneSchermata(percorsoStorto, 'x.ts')).toThrow(/x\.ts/);
  });

  it('rifiuta quando "componente" non è una funzione', () => {
    const senzaFunzione = { ...BASE, componente: 'non-una-funzione' };
    expect(() => leggiDichiarazioneSchermata(senzaFunzione, 'y.ts')).toThrow(/y\.ts/);
  });

  it('rifiuta un valore che non è nemmeno un oggetto', () => {
    expect(() => leggiDichiarazioneSchermata(null, 'z.ts')).toThrow(/z\.ts/);
    expect(() => leggiDichiarazioneSchermata('stringa', 'z.ts')).toThrow(/z\.ts/);
  });
});
