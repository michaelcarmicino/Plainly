/**
 * LA PAGINA DI SPIEGAZIONE — SCOPERTE OLTRE I 44 CASI — agente tester.
 * Funzionalità 03.
 *
 * Non sono identificativi di docs/test/03-pagina-di-spiegazione.md: sono
 * emersi scrivendo i test di accettazione, non previsti in fase 1 (che non
 * legge il codice). Riportati qui, con test reale e non finto, e nel
 * referto come fallimenti — non corretti, per mandato del tester.
 *
 * La specifica (sezione «Conflitti di pianificazione», risoluzione «vince il
 * catalogo») impone che, se 02 è già entrata, 03 aggiorni la voce di
 * catalogoDomande.ts della propria domanda a stato:'con-schermata' con il
 * percorso della schermata. 02 è entrata (catalogoDomande.ts esiste, con
 * diciotto voci) prima di 03 (che dichiara già lo stato «vince il
 * catalogo» come sua stessa conseguenza attesa): quella riga non risulta
 * scritta.
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { domandeDiArea } from '../../src/ui/catalogoDomande.ts';
import { PaginaMacrocategoria } from '../../src/ui/PaginaMacrocategoria.tsx';

describe('Oltre i 44 casi — una scoperta emersa scrivendo i test, non un ID di fase 1', () => {
  it('la domanda che risponde alla pagina di riferimento non è ancora un link nell\'elenco della sua area', () => {
    const voce = domandeDiArea('costo-della-vita').find((v) => v.chiave === 'area1Altra1');
    expect(voce).toBeDefined();
    // ATTESO (spec 03, «Conflitti di pianificazione» + doc-funzionale, passo
    // 3: «sarà... una delle prime dell'elenco a diventare un collegamento
    // cliccabile invece di restare ferma con la nota "in arrivo" sotto»):
    // stato 'con-schermata', con percorso '#/spiegazione/inflazione-spesa'.
    // OTTENUTO: stato ancora 'in-arrivo' — la schermata esiste ed è
    // raggiungibile per indirizzo diretto (C-01, verde), ma non da un click
    // nell'elenco dell'area, che è il percorso a tre tocchi che la specifica
    // promette. catalogoDomande.ts non è stato toccato da questa
    // funzionalità (vedi CF-07). Difetto reale, non del test.
    expect(voce?.stato).toBe('con-schermata');
  });

  it('di riflesso: nell\'elenco dell\'area la domanda non è un link, oggi', () => {
    const m = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'costo-della-vita' }));
    // ATTESO: <a class="domanda-collegata" href="#/spiegazione/inflazione-spesa">
    // OTTENUTO: nessun link per questa domanda, ancora testo con la nota
    // «in arrivo» — conseguenza diretta del test sopra.
    expect(m).toContain('href="#/spiegazione/inflazione-spesa"');
  });
});
