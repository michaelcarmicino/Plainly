/**
 * Test unitario della funzionalità 13 — agente core-engine.
 * Ogni valore atteso è calcolato a mano nel commento accanto all'asserzione:
 * un numero atteso che nessuno ha verificato documenta il difetto invece di
 * trovarlo. Niente snapshot.
 */

import { describe, expect, it } from 'vitest';
import type { Esito } from '../esito.ts';
import { INFLAZIONE_DICHIARATA, periodoDaCompilare } from '../inflazioneDichiarata.ts';
import type { MotivoErroreFonte, RigaFonte } from '../registroFonti.ts';
import {
  MOTIVI_ERRORE_FONTE,
  REGISTRO_FONTI,
  fonteDi,
  provenienzaCompleta,
  righeConProvenienzaIncompleta,
  valoreBpDi,
  valoreBpDiRiga,
} from '../registroFonti.ts';

/** Scorciatoia: il ramo ok:false non ha `valore`, il compilatore lo impone. */
function valoreDi<T>(esito: Esito<T, MotivoErroreFonte>): T {
  if (!esito.ok) throw new Error(`atteso ok:true, ottenuto: ${esito.errore}`);
  return esito.valore;
}

/** Riga di prova completa: base per gli scenari che tolgono un campo alla volta. */
const RIGA_PROVA: RigaFonte = {
  id: 'prova-completa',
  valore: 450,
  unita: 'punti-base',
  fonte: 'Fonte di prova',
  indicatore: 'indicatore di prova',
  periodo: { inizio: 2015, fine: 2024 },
  dataInserimento: '2026-01-01',
};

describe('il registro parte con la sola riga che esiste davvero nel codice', () => {
  it('ha esattamente una riga', () => {
    // Le altre cinque della tabella d'origine non entrano finché il numero
    // che descrivono non esiste altrove nel codice (specifica, sezione Input).
    expect(REGISTRO_FONTI).toHaveLength(1);
  });

  it('quella riga è inflazione-nic, in punti base, senza periodo stabilito', () => {
    const riga = valoreDi(fonteDi('inflazione-nic'));
    expect([riga.unita, riga.periodo]).toEqual(['punti-base', null]);
  });
});

describe('provenienzaCompleta — ricavata dai campi, mai dichiarata a mano', () => {
  type CasoProvenienza = readonly [string, RigaFonte, boolean];
  const casiProvenienza: readonly CasoProvenienza[] = [
    ['la riga reale: il periodo è null', valoreDi(fonteDi('inflazione-nic')), false],
    ['periodo, fonte e data tutti presenti', RIGA_PROVA, true],
    ['fonte assente', { ...RIGA_PROVA, fonte: '' }, false],
    ['data di inserimento assente', { ...RIGA_PROVA, dataInserimento: '' }, false],
    ['periodo null anche con fonte e data presenti', { ...RIGA_PROVA, periodo: null }, false],
  ];

  for (const [nome, riga, atteso] of casiProvenienza) {
    it(`${nome} -> ${atteso}`, () => {
      expect(provenienzaCompleta(riga)).toBe(atteso);
    });
  }
});

describe('il 200 sta in un posto solo', () => {
  it('INFLAZIONE_DICHIARATA.valoreBp è uguale al valore della riga nel registro', () => {
    // IL TEST CHE IMPEDISCE IL SECONDO REGISTRO PARALLELO: se in futuro
    // qualcuno riscrive un numero a mano in inflazioneDichiarata.ts invece
    // di correggere la riga qui, questo confronto smette di tornare da solo.
    const [riga] = REGISTRO_FONTI;
    expect(INFLAZIONE_DICHIARATA.valoreBp).toBe(riga.valore);
  });

  it('oggi quel valore è 200 punti base, cioè 2,00% annuo', () => {
    expect(INFLAZIONE_DICHIARATA.valoreBp).toBe(200);
  });

  it('periodoDaCompilare segue la riga: vero perché il periodo è null', () => {
    expect(periodoDaCompilare(INFLAZIONE_DICHIARATA)).toBe(true);
  });
});

describe('fonteDi e valoreBpDi — accesso al registro per id, codici non frasi', () => {
  it('trova la riga reale e ne legge il valore in punti base', () => {
    expect(valoreDi(valoreBpDi('inflazione-nic'))).toBe(200);
  });

  it('valoreBpDiRiga riesce su una riga in punti base', () => {
    expect(valoreDi(valoreBpDiRiga(RIGA_PROVA))).toBe(450);
  });

  type CasoErrore = readonly [string, Esito<unknown, MotivoErroreFonte>, MotivoErroreFonte];
  const casiErrore: readonly CasoErrore[] = [
    ['un id assente dal registro', fonteDi('id-inesistente'), 'id-sconosciuto'],
    ['valoreBpDi con lo stesso id assente', valoreBpDi('id-inesistente'), 'id-sconosciuto'],
    [
      'una riga in centesimi invece che in punti base',
      valoreBpDiRiga({ ...RIGA_PROVA, unita: 'centesimi' }),
      'unita-non-punti-base',
    ],
  ];

  for (const [nome, esito, atteso] of casiErrore) {
    it(`${nome}: fallisce con ${atteso}`, () => {
      expect(esito.ok).toBe(false);
      expect(esito.ok === false && esito.errore).toBe(atteso);
    });
  }

  it('ogni codice di MOTIVI_ERRORE_FONTE capita davvero con un ingresso', () => {
    const raggiunti = new Set(casiErrore.map(([, , codice]) => codice));
    expect([...MOTIVI_ERRORE_FONTE].filter((c) => !raggiunti.has(c))).toEqual([]);
  });
});

describe('righeConProvenienzaIncompleta', () => {
  it('nel registro reale contiene oggi la sola riga che esiste', () => {
    expect(righeConProvenienzaIncompleta(REGISTRO_FONTI).map((r) => r.id)).toEqual(['inflazione-nic']);
  });

  it('su un registro con una riga completa e una no, tiene solo quella incompleta', () => {
    const incompleta = { ...RIGA_PROVA, id: 'prova-incompleta', periodo: null };
    const risultato = righeConProvenienzaIncompleta([RIGA_PROVA, incompleta]);
    expect(risultato.map((r) => r.id)).toEqual(['prova-incompleta']);
  });
});

describe('forma dei dati su ogni riga del registro, oggi e in futuro', () => {
  it('il valore è sempre un intero, mai un float', () => {
    expect(REGISTRO_FONTI.every((r) => Number.isInteger(r.valore))).toBe(true);
  });

  it('la data di inserimento è sempre nella forma AAAA-MM-GG', () => {
    expect(REGISTRO_FONTI.every((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.dataInserimento))).toBe(true);
  });
});
