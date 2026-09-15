/**
 * LA PAGINA DI SPIEGAZIONE — test di accettazione, agente tester. Funzionalità 03.
 * Casi da docs/test/03-pagina-di-spiegazione.md, derivati dalla SPECIFICA
 * (docs/features/03-pagina-di-spiegazione-struttura-riusabile.md), non dal
 * codice — che al momento della fase 1 non esisteva ancora.
 *
 * Parte 1/5: percorso nominale (C-01..C-07). Il resto in altri quattro file,
 * per restare sotto le 150 righe (standard-codice.md): -limite.test.ts e
 * -limite-2.test.ts (casi limite a runtime), -errori.test.ts (errori
 * attesi), -conformita.test.ts (conformità). I casi [tipo] (CL-01..CL-08,
 * CL-18, CF-12) sono in -tipi.ts, verificato da `tsc --noEmit`, non da
 * vitest — vedi la nota in testa a quel file.
 *
 * Render con renderToStaticMarkup, come tests/home.test.ts: niente DOM da
 * simulare, e la prova stessa che nessuna informazione dipende dall'hover.
 * Niente snapshot: ogni valore atteso è calcolato a mano nel commento, o
 * derivato dalla stessa funzione del core che il prodotto chiama (mai
 * copiato come stringa letterale — è esattamente ciò che CF-03 verifica).
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { calcolaSimulazioneRisparmio, formattaEuro } from '../../src/core/index.ts';
import { ISTANZA_INFLAZIONE_SPESA } from '../../src/ui/contenutiSpiegazione.ts';
import { Navigazione } from '../../src/ui/Navigazione.tsx';
import { PaginaMacrocategoria } from '../../src/ui/PaginaMacrocategoria.tsx';
import { PaginaSpiegazione } from '../../src/ui/PaginaSpiegazione.tsx';
import { parseRotta, type Rotta } from '../../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

/** react-dom/server esegue l'escape dell'apostrofo: "c'è" -> "c&#x27;è". */
const esc = (s: string): string => s.replace(/'/g, '&#x27;');

const markupPagina = (): string =>
  renderToStaticMarkup(createElement(PaginaSpiegazione, { contenuto: ISTANZA_INFLAZIONE_SPESA }));
const markupAreaCostoDellaVita = (): string =>
  renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'costo-della-vita' }));

describe('1. Percorso nominale', () => {
  it('C-01: la rotta risolve l\'istanza di riferimento, non la home', () => {
    const rotta = parseRotta('#/spiegazione/inflazione-spesa');
    expect(rotta).toEqual({ tipo: 'schermata', id: 'inflazione-spesa' });
    expect(rotta).not.toEqual({ tipo: 'home' });
  });

  it('C-02: blocchi 1 e 2, la stessa domanda dell\'elenco, senza riscritture', () => {
    const pagina = markupPagina();
    const area = markupAreaCostoDellaVita();

    // Blocco 1: l'occhiello stampa il titolo dell'area. Il maiuscolo/spaziato
    // è solo CSS (.occhiello{text-transform:uppercase}): il DOM porta il
    // casing dichiarato in testi.ts, non una riscrittura.
    expect(pagina).toContain(`<p class="occhiello">${STRINGHE_UTENTE.area1Titolo}</p>`);

    // Blocco 2: la STESSA chiave che l'elenco dell'area già mostra, non una
    // sua variante — verificato confrontando i due rendering, non solo
    // leggendo due volte la stessa costante.
    expect(area).toContain(esc(STRINGHE_UTENTE.area1Altra1));
    expect(pagina).toContain(`<h2 class="spiegazione-titolo">${STRINGHE_UTENTE.area1Altra1}</h2>`);

    expect(pagina.indexOf('class="occhiello"')).toBeLessThan(
      pagina.indexOf('class="spiegazione-titolo"'),
    );
  });

  it('C-03: il blocco 3 (immagine concreta) precede sempre il blocco 4 (nome tecnico)', () => {
    const pagina = markupPagina();
    const posImmagine = pagina.indexOf(esc(STRINGHE_UTENTE.spiegazioneInflazioneSpesaImmagine1));
    const posNomeTecnico = pagina.indexOf(STRINGHE_UTENTE.spiegazioneInflazioneSpesaNomeTecnico);
    expect(posImmagine).toBeGreaterThan(-1);
    expect(posNomeTecnico).toBeGreaterThan(-1);
    expect(posImmagine).toBeLessThan(posNomeTecnico);
  });

  it('C-04: i blocchi 5 e 6 sono indivisibili e il numero viene dal core, non da un letterale', () => {
    if (ISTANZA_INFLAZIONE_SPESA.esempio === null) throw new Error('precondizione: esempio atteso');
    const { ingresso } = ISTANZA_INFLAZIONE_SPESA.esempio;
    const risultato = calcolaSimulazioneRisparmio(ingresso);
    // 10.000 / 1,02 = 9.803,92... -> 9.804 cent = 98,04 €; perdita 196 cent = 1,96 €
    expect(risultato.valoreRealeCent).toBe(9_804);
    expect(risultato.perditaCent).toBe(196);
    const valore = formattaEuro(risultato.valoreRealeCent);
    const perdita = formattaEuro(risultato.perditaCent);
    expect(valore).toBe('98,04 €');
    expect(perdita).toBe('1,96 €');

    const pagina = markupPagina();
    expect(pagina).toContain(valore);
    expect(pagina).toContain(
      STRINGHE_UTENTE.spiegazioneInflazioneSpesaFrase.replace('{valore}', valore),
    );
    expect(pagina).toContain(
      esc(STRINGHE_UTENTE.spiegazioneInflazioneSpesaParagone.replace('{perdita}', perdita)),
    );
    expect(pagina).toContain(esc(STRINGHE_UTENTE.spiegazioneInflazioneSpesaFonte).split('{tasso}')[0]);
    expect(pagina).toContain(STRINGHE_UTENTE.spiegazioneInflazioneSpesaAvvertenza);
  });

  it('C-05: il blocco 8 esiste, non è vuoto, ed è sempre l\'ultimo', () => {
    expect(ISTANZA_INFLAZIONE_SPESA.nonFa.length).toBeGreaterThan(0);
    const pagina = markupPagina();
    expect(pagina).toContain('class="limiti spiegazione-non-fa"');
    const posNonFa = pagina.indexOf(esc(STRINGHE_UTENTE.spiegazioneInflazioneSpesaNonFa1));
    const posAvvertenza = pagina.indexOf(STRINGHE_UTENTE.spiegazioneInflazioneSpesaAvvertenza);
    expect(posAvvertenza).toBeGreaterThan(-1);
    expect(posNonFa).toBeGreaterThan(posAvvertenza);
  });

  it('C-06: il blocco 7 è assente (non vuoto: assente) quando passi è vuoto', () => {
    expect(ISTANZA_INFLAZIONE_SPESA.passi).toHaveLength(0); // precondizione dell'istanza di riferimento
    const pagina = markupPagina();
    expect(pagina).not.toContain(STRINGHE_UTENTE.spiegazioneTitoloPassi);
    expect(pagina).not.toContain('spiegazione-passi');
  });

  it('C-07: il percorso mostra Home · Area · Domanda, tre gradini, nessuno cliccabile', () => {
    const rotta: Rotta = { tipo: 'schermata', id: 'inflazione-spesa' };
    const markup = renderToStaticMarkup(createElement(Navigazione, { rotta, passo: 'area1Altra1' }));

    // ATTESO (spec, «Il percorso»): 3 gradini, Pagina iniziale › Il costo
    // della vita › la domanda. OTTENUTO: Navigazione.tsx (funzionalità 14)
    // per rotta.tipo==='schermata' calcola `corrente` come il SOLO `passo`
    // ricevuto — non compone mai l'area. Il breadcrumb ha quindi sempre e
    // solo 2 gradini per ogni schermata, non 3. Difetto reale del codice
    // (non del test): riportato nel referto come bloccante, non corretto qui.
    expect(gradiniLi(markup)).toBe(3);
    expect(markup).toContain(esc(STRINGHE_UTENTE.area1Titolo));
    expect(markup).toContain(esc(STRINGHE_UTENTE.area1Altra1));
    expect(markup).not.toContain('<a');
  });
});

function gradiniLi(markup: string): number {
  const percorso = markup.match(/<nav[^>]*class="percorso-navigazione"[^>]*>[\s\S]*?<\/nav>/);
  if (percorso === null) return 0;
  return [...percorso[0].matchAll(/<li>/g)].length;
}
