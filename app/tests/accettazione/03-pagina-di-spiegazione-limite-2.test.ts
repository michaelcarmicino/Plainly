/**
 * LA PAGINA DI SPIEGAZIONE — test di accettazione, agente tester. Funzionalità 03.
 * Parte 3/5: il resto dei casi limite a runtime — nonFa a sei voci (CL-14),
 * importo a sette cifre (CL-15), un'area intera senza pagine (CL-16, che
 * regge oggi anche prima della 11/12), id assente nella rotta (CL-17). Vedi
 * 03-pagina-di-spiegazione.test.ts per lo stile.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { calcolaSimulazioneRisparmio, formattaEuro } from '../../src/core/index.ts';
import { domandeDiArea } from '../../src/ui/catalogoDomande.ts';
import type { PaginaSpiegazione as ContenutoSpiegazione } from '../../src/ui/contenutiSpiegazione.ts';
import { PaginaMacrocategoria } from '../../src/ui/PaginaMacrocategoria.tsx';
import { PaginaSpiegazione } from '../../src/ui/PaginaSpiegazione.tsx';
import { parseRotta } from '../../src/ui/rotte.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));
const markup = (contenuto: ContenutoSpiegazione): string =>
  renderToStaticMarkup(createElement(PaginaSpiegazione, { contenuto }));

function blocchiCss(percorsoRelativo: string): ReadonlyArray<readonly [string, string]> {
  const testo = readFileSync(join(APP, percorsoRelativo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...testo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2]] as const);
}

const BASE = {
  id: 'inflazione-spesa',
  area: 'costo-della-vita',
  domanda: 'area1Altra1',
  immagine: ['spiegazioneInflazioneSpesaImmagine1'],
  nomeTecnico: null,
  passi: [],
  nonFa: ['spiegazioneInflazioneSpesaNonFa1', 'spiegazioneInflazioneSpesaNonFa2'],
} as const;

describe('2. Casi limite — nonFa con sei voci, il caso di stress dichiarato (CL-14)', () => {
  it('sei righe in rosa, nessuna tagliata, nessuna sovrapposizione', () => {
    const seiVoci = ['navHome', 'navIndietro', 'navPercorso', 'area1Titolo', 'area2Titolo', 'area3Titolo'] as const;
    const m = markup({ ...BASE, esempio: null, nonFa: seiVoci });
    const ul = m.match(/<ul class="limiti spiegazione-non-fa">([\s\S]*?)<\/ul>/);
    expect(ul).not.toBeNull();
    expect([...(ul?.[1] ?? '').matchAll(/<li>/g)]).toHaveLength(6);

    const blocco = blocchiCss('src/ui/styles.css').find(([sel]) => sel === '.limiti li + li');
    expect(blocco?.[1]).toMatch(/margin-top/); // distanzia le voci: nessuna sovrapposizione
  });
});

describe('2. Casi limite — importo a sette cifre nell\'esempio (CL-15)', () => {
  it('2.000.000,00 € resta allineato a destra, cifre tabulari, mai spezzato', () => {
    const ingresso = { risparmioCent: 200_000_000, anni: 1, inflazioneAnnuaBp: 200 };
    const risultato = calcolaSimulazioneRisparmio(ingresso);
    // 200.000.000 / 1,02 = 196.078.431,37... -> 196.078.431 cent = 1.960.784,31 €
    // perdita = 200.000.000 - 196.078.431 = 3.921.569 cent = 39.215,69 €
    expect(risultato.valoreRealeCent).toBe(196_078_431);
    expect(risultato.perditaCent).toBe(3_921_569);
    const valore = formattaEuro(risultato.valoreRealeCent);
    expect(valore).toBe('1.960.784,31 €');

    const contenuto: ContenutoSpiegazione = {
      ...BASE,
      esempio: {
        tipo: 'valore-risparmi',
        ingresso,
        frase: 'spiegazioneInflazioneSpesaFrase',
        paragone: 'spiegazioneInflazioneSpesaParagone',
        fonte: 'spiegazioneInflazioneSpesaFonte',
        avvertenza: 'spiegazioneInflazioneSpesaAvvertenza',
      },
    };
    expect(markup(contenuto)).toContain(valore);

    const cifra = blocchiCss('src/ui/stiliSpiegazione.css').find(([sel]) => sel === '.spiegazione-cifra');
    expect(cifra?.[1]).toMatch(/text-align:\s*right/);
    expect(cifra?.[1]).toMatch(/white-space:\s*nowrap/); // mai spezzato a metà numero
    const base = blocchiCss('src/ui/styles.css').find(([sel]) => sel === '.cifra');
    expect(base?.[1]).toMatch(/font-variant-numeric:\s*tabular-nums/);
  });
});

describe('2. Casi limite — un\'area intera senza nessuna pagina di spiegazione (CL-16)', () => {
  it('«Il lavoro»: ogni domanda resta testo con la nota di stato, nessun link, nessuna eccezione', () => {
    const voci = domandeDiArea('lavoro');
    expect(voci.every((v) => v.stato !== 'con-schermata')).toBe(true); // precondizione oggi
    const m = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'lavoro' }));
    expect(m).not.toContain('class="domanda-collegata"');
    expect(m).toContain('class="placeholder"');
  });
});

describe('2. Casi limite — id assente o vuoto nella rotta (CL-17)', () => {
  it('sia con la barra finale sia senza, si cade sulla home', () => {
    expect(parseRotta('#/spiegazione/')).toEqual({ tipo: 'home' });
    expect(parseRotta('#/spiegazione')).toEqual({ tipo: 'home' });
  });
});
