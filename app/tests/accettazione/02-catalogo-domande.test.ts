/**
 * IL CATALOGO DELLE DOMANDE — test di accettazione, agente tester. Funzionalità 02.
 * Casi da docs/test/02-catalogo-domande.md, derivati dalla SPECIFICA
 * (docs/features/02-catalogo-domande-reali-per-macrocategoria.md), non dal
 * codice — che al momento della fase 1 non esisteva ancora.
 *
 * Parte 1/5: percorso nominale (C-01..C-07) e due derivazioni del catalogo
 * che ne sono la naturale prosecuzione (CL-03, CL-04). Diviso in più file
 * per restare sotto le 150 righe (standard-codice.md): il resto dei casi
 * limite (CL-05 compreso) in -limite.test.ts, gli errori attesi in
 * -errori.test.ts, la conformità in -conformita.test.ts e
 * -accessibilita.test.ts.
 *
 * Render con renderToStaticMarkup, come tests/home.test.ts: niente DOM da
 * simulare, e la prova stessa che nessuna informazione dipende dall'hover.
 * Niente snapshot: ogni valore atteso è calcolato a mano nel commento.
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CardMacrocategoria } from '../../src/ui/CardMacrocategoria.tsx';
import { CATALOGO_DOMANDE, domandeDiArea } from '../../src/ui/catalogoDomande.ts';
import { AREE, contaAltreDomande, type Area, type IdArea } from '../../src/ui/contenutiHome.ts';
import { PaginaMacrocategoria } from '../../src/ui/PaginaMacrocategoria.tsx';
import { parseRotta } from '../../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

const markupArea = (id: IdArea): string =>
  renderToStaticMarkup(createElement(PaginaMacrocategoria, { id }));
const markupCard = (area: Area): string =>
  renderToStaticMarkup(createElement(CardMacrocategoria, { area }));

describe('1. Percorso nominale', () => {
  it('C-01: il catalogo ha 18 voci, ripartite 5 · 6 · 7 per area', () => {
    // 5 + 6 + 7 = 18, come dichiarato nella tabella «Le diciotto domande».
    expect(CATALOGO_DOMANDE).toHaveLength(18);
    expect(domandeDiArea('costo-della-vita')).toHaveLength(5);
    expect(domandeDiArea('lavoro')).toHaveLength(6);
    expect(domandeDiArea('futuro')).toHaveLength(7);
  });

  it('C-02: la card «Il lavoro» porta la domanda nuova, non più quella spostata in fondo', () => {
    const markup = markupCard(AREE.lavoro);
    expect(markup).toContain(STRINGHE_UTENTE.area2Altra1);
    // La domanda d'origine, prima di questa funzionalità, era in evidenza
    // sulla card: non deve più comparirci.
    expect(markup).not.toContain('Il mio settore è a rischio nei prossimi anni?');
  });

  it('C-03: i tre badge riportano i conteggi nuovi', () => {
    // 5-1=4, 6-1=5, 7-1=6: la prima voce di ogni area è già sulla card.
    expect(markupCard(AREE['costo-della-vita'])).toContain('altre 4 domande qui dentro');
    expect(markupCard(AREE.lavoro)).toContain('altre 5 domande qui dentro');
    expect(markupCard(AREE.futuro)).toContain('altre 6 domande qui dentro');
  });

  it("C-04: l'unica voce con-schermata è un link vero e porta dove promette", () => {
    const voce = domandeDiArea('futuro').find((v) => v.stato === 'con-schermata');
    if (voce === undefined || voce.stato !== 'con-schermata') {
      throw new Error('nessuna voce con-schermata trovata in «futuro»');
    }
    expect(voce.percorso).toBeTruthy();
    expect(parseRotta(voce.percorso)).not.toEqual({ tipo: 'home' });
    expect(markupArea('futuro')).toContain(
      `<a class="domanda-collegata" href="${voce.percorso}">`,
    );
  });

  it('C-05: l\'ultima voce dell\'area «Il lavoro» mostra il testo riscritto e la nota «senza fonte»', () => {
    const voci = domandeDiArea('lavoro');
    const ultima = voci[voci.length - 1];
    expect(ultima.chiave).toBe('area2Domanda');
    expect(ultima.stato).toBe('senza-fonte');
    expect(STRINGHE_UTENTE.area2Domanda).toBe(
      'Nel mio settore, quante persone hanno perso il lavoro negli ultimi anni?',
    );

    const markup = markupArea('lavoro');
    const posDomanda = markup.indexOf(STRINGHE_UTENTE.area2Domanda);
    expect(posDomanda).toBeGreaterThan(-1);
    expect(markup.indexOf(STRINGHE_UTENTE.domandaSenzaFonte)).toBeGreaterThan(posDomanda);
  });

  it('C-06: le sei domande nuove compaiono con il testo esatto della specifica', () => {
    expect(STRINGHE_UTENTE.area1Altra4).toBe(
      "Che cosa cambia in bolletta fra un'offerta a prezzo fisso e una a prezzo variabile?",
    );
    expect(STRINGHE_UTENTE.area2Altra4).toBe(
      'Con lo stesso importo, quanto resta a un dipendente e quanto a chi lavora in proprio?',
    );
    expect(STRINGHE_UTENTE.area2Altra5).toBe(
      'Contratto a termine e a tempo indeterminato: che cosa cambia, in concreto, fra i due?',
    );
    expect(STRINGHE_UTENTE.area3Altra4).toBe(
      'Con i soldi che ho da parte, per quanti mesi coprirei le spese senza stipendio?',
    );
    expect(STRINGHE_UTENTE.area3Altra5).toBe(
      'Se i soldi mi servono fra sei mesi, che cosa cambia rispetto a quando mi servono fra dieci anni?',
    );
    expect(STRINGHE_UTENTE.area3Altra6).toBe(
      'Quando una persona muore, che cosa succede alla casa e ai risparmi che lascia?',
    );
  });

  it('C-07: ogni voce in-arrivo porta la stessa nota di stato', () => {
    const markup = markupArea('costo-della-vita');
    // react-dom/server esegue l'escape dell'apostrofo nel testo: "c'è"
    // diventa "c&#x27;è" nell'HTML prodotto.
    const nota = STRINGHE_UTENTE.domandaInArrivo.replace(/'/g, '&#x27;');
    expect(markup).toContain(nota);
    // 5 voci, tutte in-arrivo (vedi CL-07): la nota compare una volta per
    // ciascuna, non una sola in testa alla lista.
    expect(markup.split(nota).length - 1).toBe(5);
  });
});

describe('2. Casi limite — la struttura del catalogo (CL-03, CL-04)', () => {
  it('CL-03: il badge è derivato dalla lista, non scritto a mano', () => {
    // Calcolo indipendente: lunghezza della lista letta dal catalogo (non da
    // contaAltreDomande) meno la voce già sulla card.
    expect(contaAltreDomande('costo-della-vita')).toBe(domandeDiArea('costo-della-vita').length - 1);
    expect(contaAltreDomande('lavoro')).toBe(domandeDiArea('lavoro').length - 1);
    expect(contaAltreDomande('futuro')).toBe(domandeDiArea('futuro').length - 1);
    expect([
      contaAltreDomande('costo-della-vita'),
      contaAltreDomande('lavoro'),
      contaAltreDomande('futuro'),
    ]).toEqual([4, 5, 6]);
    // La stringa modello conserva il segnaposto: nessuna cifra scritta a mano.
    expect(STRINGHE_UTENTE.areaBadge).toContain('{n}');
    expect(STRINGHE_UTENTE.areaBadge).not.toMatch(/\d/);
  });

  it("CL-04: le diciotto chiavi sono tutte presenti, nessuna in meno o duplicata al posto di un'altra", () => {
    const attese: Record<IdArea, readonly string[]> = {
      'costo-della-vita': ['area1Domanda', 'area1Altra1', 'area1Altra2', 'area1Altra3', 'area1Altra4'],
      lavoro: ['area2Altra1', 'area2Altra2', 'area2Altra3', 'area2Altra4', 'area2Altra5', 'area2Domanda'],
      futuro: [
        'area3Domanda', 'area3Altra1', 'area3Altra2', 'area3Altra3',
        'area3Altra4', 'area3Altra5', 'area3Altra6',
      ],
    };
    for (const id of ['costo-della-vita', 'lavoro', 'futuro'] as const) {
      const reali = domandeDiArea(id).map((v) => v.chiave);
      expect(new Set(reali)).toEqual(new Set(attese[id]));
      expect(reali).toHaveLength(attese[id].length);
    }
    expect(new Set(CATALOGO_DOMANDE.map((v) => v.chiave)).size).toBe(18);
  });
});
