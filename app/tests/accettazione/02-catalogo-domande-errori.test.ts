/**
 * IL CATALOGO DELLE DOMANDE — test di accettazione, agente tester. Funzionalità 02.
 * Parte 3/5: errori attesi (E-01..E-03). E-04 — una chiave di testo mancante
 * — è dichiarato non applicabile a runtime già in fase 1
 * (docs/test/02-catalogo-domande.md): il compilatore rifiuta il riferimento
 * prima che il programma esista, quindi non c'è un test da eseguire qui.
 * Non coperto per costruzione: documentato nel referto, non in codice.
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { domandeDiArea } from '../../src/ui/catalogoDomande.ts';
import { PaginaMacrocategoria } from '../../src/ui/PaginaMacrocategoria.tsx';
import { parseRotta } from '../../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

describe('3. Errori attesi', () => {
  it("E-01: un indirizzo d'area inesistente porta alla home, non a un errore", () => {
    // Invariato da 01: questa funzionalità non tocca parseRotta.
    expect(parseRotta('#/qualcosa-che-non-esiste')).toEqual({ tipo: 'home' });
  });

  it('E-02: il link vero non è un vicolo cieco: porta esattamente alla schermata dei risparmi', () => {
    const voce = domandeDiArea('futuro').find((v) => v.stato === 'con-schermata');
    if (voce === undefined || voce.stato !== 'con-schermata') {
      throw new Error('voce con-schermata non trovata in «futuro»');
    }
    // Verifica indipendente che il percorso duplicato in catalogoDomande.ts
    // (per evitare un import circolare, dichiarato nel suo commento) punti
    // ancora alla rotta vera, non solo "non alla home".
    expect(parseRotta(voce.percorso)).toEqual({ tipo: 'valore-risparmi' });
  });

  it('E-03: le voci senza schermata non si comportano da link', () => {
    const paginaLavoro = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'lavoro' }));
    const liDi = (testo: string): string => {
      const blocco = [...paginaLavoro.matchAll(/<li>[\s\S]*?<\/li>/g)]
        .map((m) => m[0])
        .find((li) => li.includes(testo));
      if (blocco === undefined) throw new Error(`voce «${testo}» non trovata nel markup`);
      return blocco;
    };
    expect(liDi(STRINGHE_UTENTE.area2Altra1)).not.toMatch(/<a /); // in-arrivo
    expect(liDi(STRINGHE_UTENTE.area2Domanda)).not.toMatch(/<a /); // senza-fonte

    // «Il costo della vita»: tutte e cinque le voci in-arrivo, zero ancore.
    const paginaCostoVita = renderToStaticMarkup(
      createElement(PaginaMacrocategoria, { id: 'costo-della-vita' }),
    );
    expect(paginaCostoVita).not.toContain('<a ');
  });
});
