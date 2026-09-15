/**
 * FONTI DEI DATI — test di accettazione, agente tester. Funzionalità 13.
 * Parte 2/4: gli errori sui tre campi della provenienza e sull'id
 * (E-03..E-05), la data scritta a mano in lettere (CL-11), il formattatore
 * che segue l'unità della riga (CL-14), e il difetto trovato su E-02. Vedi
 * 13-tabella-fonti-dati.test.ts per la nota sulla divisione in più file.
 */

import { describe, expect, it } from 'vitest';
import { fonteDi, formattaEuro, formattaPercentuale, provenienzaCompleta } from '../../src/core/index.ts';
import type { RigaFonte } from '../../src/core/index.ts';
import { dataInLettere } from '../../src/ui/dataInLettere.ts';
import { esitoTestoValore } from '../../src/ui/motiviFonti.ts';

/** Riga ipotetica completa: base per E-03/E-04, che tolgono un campo alla volta. */
const RIGA_COMPLETA: RigaFonte = {
  id: 'prova-errori',
  valore: 999,
  unita: 'punti-base',
  fonte: 'ISTAT',
  indicatore: 'indicatore di prova',
  periodo: { inizio: 2015, fine: 2025 },
  dataInserimento: '2026-01-01',
};

/** Base per le due righe ipotetiche di CL-14: cambia solo unità e valore. */
const BASE: Omit<RigaFonte, 'unita' | 'valore'> = {
  id: 'prova-formato',
  fonte: 'Fonte di prova',
  indicatore: 'indicatore di prova',
  periodo: null,
  dataInserimento: '2026-01-01',
};

describe('2. Casi limite — la data scritta a mano, in lettere (CL-11)', () => {
  it('gennaio: MESI[Number("01")-1] = MESI[0] = "gennaio"', () => {
    expect(dataInLettere('2026-01-05')).toBe('5 gennaio 2026');
  });

  it('settembre: MESI[Number("09")-1] = MESI[8] = "settembre", non ottobre', () => {
    // Il rischio dichiarato in fase 1: '09' letto come indice 9 (invece che
    // indice 8) darebbe 'ottobre'. Il codice fa Number(mese)-1, quindi qui
    // il risultato corretto è 'settembre'.
    expect(dataInLettere('2026-09-14')).toBe('14 settembre 2026');
  });

  it('dicembre: MESI[Number("12")-1] = MESI[11] = "dicembre"', () => {
    expect(dataInLettere('2026-12-25')).toBe('25 dicembre 2026');
  });
});

describe("2. Casi limite — il formattatore segue l'unità della riga (CL-14)", () => {
  it('una riga in centesimi passa da formattaEuro', () => {
    const riga: RigaFonte = { ...BASE, unita: 'centesimi', valore: 123456 };
    const esito = esitoTestoValore(riga);
    // 123456 cent -> intero 1.234, decimali 56 -> "1.234,56 €"
    expect(esito.ok && esito.valore).toBe(formattaEuro(123456));
    expect(esito.ok && esito.valore).toBe('1.234,56 €');
  });

  it('una riga in punti base passa da formattaPercentuale', () => {
    const riga: RigaFonte = { ...BASE, unita: 'punti-base', valore: 200 };
    const esito = esitoTestoValore(riga);
    // 200 bp / 100 = 2,00 -> "2,00%"
    expect(esito.ok && esito.valore).toBe(formattaPercentuale(200));
    expect(esito.ok && esito.valore).toBe('2,00%');
  });
});

describe('3. Errori attesi — dataInserimento scritta a mano in un formato non valido (E-02)', () => {
  it('mese e giorno fuori intervallo non interrompono il rendering', () => {
    // '2026-13-40': MESI[13-1]=MESI[12] è fuori dall'array (12 mesi, indici
    // 0-11) -> `?? mese` mostra '13' così com'è, per scelta dichiarata nel
    // commento della funzione. Nessuna eccezione.
    expect(() => dataInLettere('2026-13-40')).not.toThrow();
  });

  it('una stringa vuota non deve interrompere il rendering', () => {
    // ATTESO dalla specifica (E-02, nel .md): nessuna schermata bianca,
    // nessuna eccezione. OTTENUTO: ''.split('-') = [''], quindi `giorno`
    // resta undefined e `giorno.replace(...)` lancia un TypeError. Il
    // difetto è riportato nel referto, non corretto qui.
    expect(() => dataInLettere('')).not.toThrow();
  });

  it('un testo libero non deve interrompere il rendering', () => {
    // Stesso meccanismo di rottura: 'ieri'.split('-') = ['ieri'], `giorno`
    // resta undefined. Riportato nel referto, non corretto qui.
    expect(() => dataInLettere('ieri')).not.toThrow();
  });
});

describe('3. Errori attesi — i tre campi della provenienza contano allo stesso modo', () => {
  it('E-03: una fonte vuota basta da sola a rendere incompleta la provenienza', () => {
    const riga: RigaFonte = { ...RIGA_COMPLETA, fonte: '' };
    expect(provenienzaCompleta(riga)).toBe(false);
  });

  it('E-04: una dataInserimento vuota basta da sola a rendere incompleta la provenienza', () => {
    const riga: RigaFonte = { ...RIGA_COMPLETA, dataInserimento: '' };
    expect(provenienzaCompleta(riga)).toBe(false);
  });

  it('E-05: un id vuoto riceve lo stesso trattamento di un id qualunque non trovato', () => {
    const esitoVuoto = fonteDi('');
    expect(esitoVuoto.ok).toBe(false);
    const codiceVuoto = !esitoVuoto.ok ? esitoVuoto.errore : null;
    const esitoIgnoto = fonteDi('qualunque-cosa-non-esistente');
    const codiceIgnoto = !esitoIgnoto.ok ? esitoIgnoto.errore : null;
    expect(codiceVuoto).toBe(codiceIgnoto); // nessun ramo speciale per l'id vuoto
    expect(codiceVuoto).toBe('id-sconosciuto');
  });
});
