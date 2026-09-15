/**
 * FONTI DEI DATI — test di accettazione, agente tester. Funzionalità 13.
 * Casi da docs/test/13-tabella-fonti-dati.md, derivati dalla SPECIFICA
 * (docs/features/13-tabella-fonti-dati-sorgente-unica.md), non dal codice.
 *
 * Parte 1/4: percorso nominale (C-01..C-05) e casi limite sul registro e sui
 * suoi predicati (CL-01..CL-08). Diviso in più file per restare sotto le 150
 * righe per file (standard-codice.md): gli errori sui tre campi della
 * provenienza (E-03..E-05), la data in lettere e il formato del valore
 * stanno in -formattazione.test.ts, il markup e il colore in
 * -pagina.test.ts, lessico/identificatori/rete in -conformita.test.ts.
 *
 * Niente snapshot: ogni valore atteso è calcolato a mano nel commento.
 */

import { describe, expect, it } from 'vitest';
import {
  fonteDi,
  INFLAZIONE_DICHIARATA,
  MOTIVI_ERRORE_FONTE,
  provenienzaCompleta,
  REGISTRO_FONTI,
  righeConProvenienzaIncompleta,
  valoreBpDi,
  valoreBpDiRiga,
} from '../../src/core/index.ts';
import type { Esito, MotivoErroreFonte, RigaFonte } from '../../src/core/index.ts';

/** Il ramo ok:true, o un errore di test esplicito — come registroFonti.test.ts. */
function valoreDi<T>(esito: Esito<T, MotivoErroreFonte>): T {
  if (!esito.ok) throw new Error(`atteso ok:true, ottenuto errore: ${esito.errore}`);
  return esito.valore;
}

/** Riga ipotetica completa: base per i casi che tolgono o invertono un campo. */
const RIGA_COMPLETA: RigaFonte = {
  id: 'prova-accettazione',
  valore: 999,
  unita: 'punti-base',
  fonte: 'ISTAT',
  indicatore: 'indicatore di prova',
  periodo: { inizio: 2015, fine: 2025 },
  dataInserimento: '2026-01-01',
};

describe('1. Percorso nominale', () => {
  it('C-01: fonteDi("inflazione-nic") risponde con tutti i campi della specifica', () => {
    expect(valoreDi(fonteDi('inflazione-nic'))).toEqual({
      id: 'inflazione-nic',
      valore: 200,
      unita: 'punti-base',
      fonte: 'ISTAT',
      indicatore: 'indice NIC',
      periodo: null,
      dataInserimento: '2026-09-14',
    });
  });

  it('C-02: valoreBpDi riesce sulla riga reale, in punti base', () => {
    expect(valoreDi(valoreBpDi('inflazione-nic'))).toBe(200);
  });

  it('C-03: provenienzaCompleta è falsa sulla riga reale perché manca solo il periodo', () => {
    const riga = valoreDi(fonteDi('inflazione-nic'));
    expect(riga.periodo).toBeNull();
    expect(riga.fonte).not.toBe(''); // fonte e dataInserimento NON sono vuote:
    expect(riga.dataInserimento).not.toBe(''); // a mancare è solo il periodo
    expect(provenienzaCompleta(riga)).toBe(false);
  });

  it('C-04: righeConProvenienzaIncompleta trova la sola riga reale', () => {
    const risultato = righeConProvenienzaIncompleta(REGISTRO_FONTI);
    expect(risultato).toHaveLength(1);
    expect(risultato[0].id).toBe('inflazione-nic');
  });

  it("C-05: il valore dell'inflazione vive in un punto solo", () => {
    const rigaRegistro = valoreDi(fonteDi('inflazione-nic'));
    // Non due «200» scritti a mano separatamente: lo stesso valore letto da
    // due punti diversi del codice, confrontato per uguaglianza strutturale.
    // Se un domani divergessero, è QUESTO confronto a romperlo, non C-01.
    expect(INFLAZIONE_DICHIARATA.valoreBp).toBe(rigaRegistro.valore);
    expect(INFLAZIONE_DICHIARATA.valoreBp).toBe(200);
  });
});

describe('2. Casi limite — registro e predicati', () => {
  it('CL-01: provenienzaCompleta è vera quando tutti e tre i campi sono presenti', () => {
    expect(provenienzaCompleta(RIGA_COMPLETA)).toBe(true);
  });

  it('CL-02: righeConProvenienzaIncompleta su un registro vuoto risponde con [], non un errore', () => {
    expect(righeConProvenienzaIncompleta([])).toEqual([]);
  });

  it('CL-03: una riga già completa non compare fra le incomplete', () => {
    const incompleta = valoreDi(fonteDi('inflazione-nic'));
    const risultato = righeConProvenienzaIncompleta([RIGA_COMPLETA, incompleta]);
    expect(risultato).toHaveLength(1);
    expect(risultato[0].id).toBe('inflazione-nic');
  });

  it('CL-04: righe duplicate con lo stesso id compaiono entrambe: nessuna deduplicazione', () => {
    const duplicato = valoreDi(fonteDi('inflazione-nic'));
    const risultato = righeConProvenienzaIncompleta([duplicato, { ...duplicato }]);
    // La specifica non impone una deduplicazione per id: righeConProvenienzaIncompleta
    // è un filtro su tutte le righe, non un indice per chiave (vedi CL-04 nel .md:
    // se questo cambia, è la specifica a doversi pronunciare, non il codice).
    expect(risultato).toHaveLength(2);
  });

  it('CL-05: fonteDi su un id inesistente fallisce con un codice, mai con un throw', () => {
    const esito = fonteDi('id-che-non-esiste');
    expect(esito.ok).toBe(false);
    expect(!esito.ok && MOTIVI_ERRORE_FONTE.includes(esito.errore)).toBe(true);
  });

  it('CL-06: valoreBpDi su un id inesistente fallisce con un codice', () => {
    const esito = valoreBpDi('id-che-non-esiste');
    expect(esito.ok).toBe(false);
    expect(!esito.ok && MOTIVI_ERRORE_FONTE.includes(esito.errore)).toBe(true);
  });

  it('CL-07: chiedere punti base a una riga in centesimi fallisce, non converte', () => {
    const rigaCentesimi: RigaFonte = { ...RIGA_COMPLETA, unita: 'centesimi' };
    expect(valoreBpDiRiga(rigaCentesimi).ok).toBe(false);
  });

  it('CL-08: un periodo con inizio dopo fine non viene rilevato come incoerente', () => {
    // Per lettera della specifica provenienzaCompleta guarda solo
    // `periodo !== null`: nessun confronto fra inizio e fine è promesso.
    const rigaInvertita: RigaFonte = { ...RIGA_COMPLETA, periodo: { inizio: 2020, fine: 2010 } };
    expect(provenienzaCompleta(rigaInvertita)).toBe(true);
  });
});
