/**
 * IL CATALOGO DELLE DOMANDE — test di accettazione, agente tester. Funzionalità 02.
 * Parte 2/5: il resto dei casi limite — regressione sulla 01 (CL-01, CL-02),
 * nessuna area vuota (CL-05), gli stati vuoto e uniforme (CL-06, CL-07), il
 * testo lungo (CL-08) e la posizione della voce senza fonte (CL-09). Vedi
 * 02-catalogo-domande.test.ts per la nota sulla divisione in più file.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { domandeDiArea } from '../../src/ui/catalogoDomande.ts';
import { contaAltreDomande } from '../../src/ui/contenutiHome.ts';
import { Home } from '../../src/ui/Home.tsx';
import { Navigazione } from '../../src/ui/Navigazione.tsx';
import { PaginaMacrocategoria } from '../../src/ui/PaginaMacrocategoria.tsx';
import type { Rotta } from '../../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));
const classiDi = (markup: string): readonly string[] =>
  [...markup.matchAll(/class="([^"]*)"/g)].map((m) => m[1]);

describe('2. Casi limite — regressione sulla 01 (CL-01, CL-02)', () => {
  it('CL-01: le tre card restano tre, con le stesse classi', () => {
    const markup = renderToStaticMarkup(createElement(Home));
    const card = [...markup.matchAll(/<a class="card-area"[\s\S]*?<\/a>/g)].map((m) => m[0]);
    expect(card).toHaveLength(3);
    const attese = classiDi(card[0]);
    expect(attese[0]).toBe('card-area');
    expect(classiDi(card[1])).toEqual(attese);
    expect(classiDi(card[2])).toEqual(attese);
  });

  it("CL-02: la pagina di un'area non introduce una propria navigazione", () => {
    const pagina = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'lavoro' }));
    expect(pagina).not.toContain('barra-navigazione');
    expect(pagina).not.toContain('bottone-nav');

    // La barra resta la stessa: struttura di classi identica sulla rotta di
    // un'area e su una rotta già verificata da un'altra funzionalità.
    const perArea: Rotta = { tipo: 'macrocategoria', id: 'lavoro' };
    const perLettura: Rotta = { tipo: 'schermata', id: 'lettura' };
    const navArea = renderToStaticMarkup(createElement(Navigazione, { rotta: perArea }));
    // Dalla 14 Navigazione non ricava più da sola il passo di una schermata:
    // lo riceve come prop, già risolto da App.tsx tramite il registro.
    // 'sezioneLettura' è lo stesso valore che il vecchio `case 'lettura'`
    // restituiva qui dentro, ora dichiarato in schermate/01-lettura.ts: senza
    // passarlo, navLettura non avrebbe nessun gradino e il confronto con
    // navArea (che un gradino ce l'ha sempre) fallirebbe per un motivo che
    // non ha niente a che fare con CL-02.
    const navLettura = renderToStaticMarkup(
      createElement(Navigazione, { rotta: perLettura, passo: 'sezioneLettura' }),
    );
    expect(classiDi(navArea)).toEqual(classiDi(navLettura));
  });
});

describe('2. Casi limite — nessuna area ha una lista vuota (CL-05)', () => {
  it('ogni area ha almeno una voce, oggi 5, 6, 7', () => {
    expect(domandeDiArea('costo-della-vita').length).toBeGreaterThanOrEqual(1);
    expect(domandeDiArea('lavoro').length).toBeGreaterThanOrEqual(1);
    expect(domandeDiArea('futuro').length).toBeGreaterThanOrEqual(1);
  });
});

describe('2. Casi limite — stato «vuoto»: nessuna voce con-schermata (CL-06)', () => {
  it.each(['costo-della-vita', 'lavoro'] as const)(
    "%s: l'elenco compare per intero, e in testa una riga dice che cosa manca",
    (id) => {
      const voci = domandeDiArea(id);
      expect(voci.every((v) => v.stato !== 'con-schermata')).toBe(true); // precondizione

      const markup = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id }));
      // react-dom/server esegue l'escape dell'apostrofo: "quest'area" diventa
      // "quest&#x27;area" nell'HTML prodotto.
      expect(markup).toContain(STRINGHE_UTENTE.areaNessunaSchermata.replace(/'/g, '&#x27;'));
      expect(markup).toContain('class="placeholder"');
      expect([...markup.matchAll(/<li>/g)]).toHaveLength(voci.length);
    },
  );
});

describe('2. Casi limite — elenco con tutte le voci nello stesso stato (CL-07)', () => {
  it('«Il costo della vita»: 5 voci, tutte in-arrivo, badge coerente', () => {
    const voci = domandeDiArea('costo-della-vita');
    expect(voci).toHaveLength(5);
    expect(voci.every((v) => v.stato === 'in-arrivo')).toBe(true);
    expect(contaAltreDomande('costo-della-vita')).toBe(4);
  });
});

describe('2. Casi limite — domanda molto lunga, nessun troncamento (CL-08)', () => {
  it('area3Altra5 misura 96 caratteri e il foglio di stile non la taglia', () => {
    // Conta a mano: 19 parole per un totale di 78 lettere + 18 spazi = 96.
    expect(STRINGHE_UTENTE.area3Altra5).toHaveLength(96);
    expect(STRINGHE_UTENTE.area3Altra5.length).toBeGreaterThan(90);

    // I commenti CSS vanno tolti PRIMA di isolare i blocchi: altrimenti un
    // commento fra due regole finisce catturato dentro il "selettore"
    // successivo, e nessun confronto per uguaglianza troverebbe più niente
    // (come già in stiliFonti.css, 13-tabella-fonti-dati-pagina.test.ts).
    const css = readFileSync(join(APP, 'src/ui/stiliNavigazione.css'), 'utf8').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    );
    const blocchi = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
      (m) => [m[1].trim(), m[2]] as const,
    );
    const domandaTesto = blocchi.find(([sel]) => sel === '.domanda-testo');
    expect(domandaTesto?.[1]).toMatch(/overflow-wrap:\s*break-word/);
    expect(domandaTesto?.[1]).not.toMatch(/text-overflow|white-space:\s*nowrap|line-clamp/);

    const elenco = blocchi.find(([sel]) => sel === '.elenco-domande');
    expect(elenco?.[1]).toMatch(/font-size:\s*1\.0625rem/); // 1,0625 × 18px = 19,125px, sopra i 16px

    const vociAltezza = blocchi.find(([sel]) => sel === '.elenco-domande li');
    expect(vociAltezza?.[1]).toMatch(/min-height:\s*44px/);
  });
});

describe("2. Casi limite — nessuna voce senza-fonte è la prima della sua area (CL-09)", () => {
  it('in nessuna delle tre aree la prima voce ha stato senza-fonte', () => {
    for (const id of ['costo-della-vita', 'lavoro', 'futuro'] as const) {
      expect(domandeDiArea(id)[0].stato).not.toBe('senza-fonte');
    }
    // Riscontro a vista: in «Il lavoro» la voce senza-fonte è l'ultima, non la prima.
    const lavoro = domandeDiArea('lavoro');
    expect(lavoro[lavoro.length - 1].stato).toBe('senza-fonte');
  });
});
