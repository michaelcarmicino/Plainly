/**
 * LA PAGINA DI SPIEGAZIONE — test di accettazione, agente tester. Funzionalità 03.
 * Parte 5a/5: conformità CF-01..CF-06. Richiama i meccanismi già esistenti in
 * src/guardrails/ (verificaInsieme, RADICI_VIETATE_NEGLI_IDENTIFICATORI): non
 * li riscrive, come impone il mandato del tester. CF-07 (nessuna funzione nel
 * core, nessun contratto toccato) è dichiarato dalla specifica stessa
 * verificabile «a occhio sul diff, non con vitest»: nessun test qui, esito
 * riportato nel referto dopo lettura di `git show --stat` sui commit
 * 3106942 e 3fc47f9. Il resto della conformità (CF-08..CF-12) è in
 * -conformita-2.test.ts.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  calcolaSimulazioneRisparmio,
  formattaEuro,
  INFLAZIONE_DICHIARATA,
  periodoDaCompilare,
} from '../../src/core/index.ts';
import { BloccoFonte } from '../../src/ui/BloccoEsempioSpiegazione.tsx';
import { ISTANZA_INFLAZIONE_SPESA } from '../../src/ui/contenutiSpiegazione.ts';
import {
  RADICI_VIETATE_NEGLI_IDENTIFICATORI,
  verificaInsieme,
} from '../../src/guardrails/index.ts';
import { calcolaEsempio } from '../../src/ui/spiegazioneEsempio.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';
import { STRINGHE_SPIEGAZIONE } from '../../src/ui/testiSpiegazione.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));
function blocchiCss(percorsoRelativo: string): ReadonlyArray<readonly [string, string]> {
  const testo = readFileSync(join(APP, percorsoRelativo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...testo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2]] as const);
}

describe('4. Conformità — lessico e identificatori (CF-01, CF-02)', () => {
  it('CF-01: le 15 stringhe nuove (5 del contenitore + 10 dell\'istanza) sono conformi', () => {
    expect(Object.keys(STRINGHE_SPIEGAZIONE)).toHaveLength(15);
    expect(verificaInsieme(STRINGHE_SPIEGAZIONE)).toHaveLength(0);
  });

  it('CF-02: nessun identificatore nuovo contiene una radice vietata', () => {
    const nomi = [
      'PaginaSpiegazione', 'EsempioNumerico', 'PassoSuccessivo', 'IdSpiegazione',
      'contenutiSpiegazione', 'testiSpiegazione', 'stiliSpiegazione',
    ];
    for (const nome of nomi) {
      const minuscolo = nome.toLowerCase();
      for (const radice of RADICI_VIETATE_NEGLI_IDENTIFICATORI) expect(minuscolo).not.toContain(radice);
    }
  });
});

describe('4. Conformità — il numero viene dal core, non da un letterale (CF-03)', () => {
  it('lo stesso ingresso, chiamato di nuovo, dà lo stesso output mostrato', () => {
    const reale = ISTANZA_INFLAZIONE_SPESA.esempio;
    if (reale === null) throw new Error('precondizione: esempio atteso');
    const atteso = calcolaSimulazioneRisparmio(reale.ingresso);
    const esito = calcolaEsempio(reale);
    if (!esito.ok) throw new Error('precondizione: esito ok atteso');
    expect(esito.valori.valore).toBe(formattaEuro(atteso.valoreRealeCent));
  });
});

describe('4. Conformità — il periodo del tasso non è dichiarato come certo (CF-04)', () => {
  it('la fonte riporta lo stesso stato onesto già mostrato dalla 07', () => {
    expect(periodoDaCompilare(INFLAZIONE_DICHIARATA)).toBe(true); // stato reale di oggi: buco aperto
    const reale = ISTANZA_INFLAZIONE_SPESA.esempio;
    if (reale === null) throw new Error('precondizione: esempio atteso');
    const esito = calcolaEsempio(reale);
    if (!esito.ok) throw new Error('precondizione: esito ok atteso');
    expect(esito.periodoMancante).toBe(true);
    const m = renderToStaticMarkup(createElement(BloccoFonte, { esempio: reale, esito }));
    expect(m).toContain(STRINGHE_UTENTE.simulazioneRisparmioPeriodoMancante.split('{tasso}')[0]);
  });
});

describe('4. Conformità — il rosa resta il colore di ciò che il prodotto non fa (CF-05)', () => {
  it('in stiliSpiegazione.css SOLO .spiegazione-non-fa usa --rose', () => {
    const conRosa = blocchiCss('src/ui/stiliSpiegazione.css').filter(([, corpo]) =>
      /--rose|#ff50a0/i.test(corpo),
    );
    expect(conRosa).toHaveLength(1);
    expect(conRosa[0][0]).toBe('.spiegazione-non-fa');
  });

  it('le classi riusate (occhiello, limiti-titolo, nota-riga) non introducono rosa nel loro file', () => {
    const casi: ReadonlyArray<readonly [string, string]> = [
      ['src/ui/stiliSimulazione.css', '.occhiello'],
      ['src/ui/stiliRisultato.css', '.limiti-titolo'],
      ['src/ui/stiliRisultato.css', '.nota-riga'],
    ];
    for (const [file, selettore] of casi) {
      const blocco = blocchiCss(file).find(([sel]) => sel === selettore);
      expect(blocco?.[1]).not.toMatch(/--rose|#ff50a0/i);
    }
  });
});

describe('4. Conformità — nessuna chiamata di rete (CF-06)', () => {
  it('i cinque file di questa funzionalità non contengono fetch/XHR/import dinamico', () => {
    const file = [
      'src/ui/contenutiSpiegazione.ts',
      'src/ui/PaginaSpiegazione.tsx',
      'src/ui/BloccoEsempioSpiegazione.tsx',
      'src/ui/spiegazioneEsempio.ts',
      'src/ui/testiSpiegazione.ts',
    ];
    for (const f of file) {
      const testo = readFileSync(join(APP, f), 'utf8');
      expect(testo).not.toMatch(/fetch\(|XMLHttpRequest|axios|import\(/);
    }
  });
});
