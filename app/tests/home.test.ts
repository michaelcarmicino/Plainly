/**
 * LA HOME — i criteri di accettazione della spec 01-landing-page.
 * Agente: guardrail-officer (app/tests/).
 *
 * Il punto di questo file è controllare sul MARKUP ciò che la spec promette
 * a parole: che le card siano tre, che portino le stesse classi, e che il
 * numero del badge sia derivato dalla lista invece che scritto a mano.
 * «Peso visivo identico» è una promessa che si verifica contando, non
 * guardando: a occhio una differenza di una classe non si vede.
 *
 * Render con `renderToStaticMarkup`: react-dom c'è già, nessuna dipendenza
 * nuova e nessun DOM da simulare. JSX non serve — `createElement` basta e
 * tiene il file in .ts, come la spec lo nomina.
 *
 * Niente snapshot: uno snapshot si aggiorna con un tasto e passa di nuovo,
 * cioè è un test che non può fallire.
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CardMacrocategoria } from '../src/ui/CardMacrocategoria.tsx';
import { AREE, contaAltreDomande } from '../src/ui/contenutiHome.ts';
import { Home } from '../src/ui/Home.tsx';
import { parseRotta } from '../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../src/ui/testi.ts';

const markupHome = (): string => renderToStaticMarkup(createElement(Home));

/**
 * I frammenti delle tre card. L'ancora della card non ne contiene altre
 * annidate, quindi il primo `</a>` che segue chiude sempre la stessa card.
 */
const cardDellaHome = (markup: string): readonly string[] =>
  markup.match(/<a class="card-area"[\s\S]*?<\/a>/g) ?? [];

/** Tutti i valori di `class` del frammento, nell'ordine in cui compaiono. */
const classi = (frammento: string): readonly string[] =>
  [...frammento.matchAll(/class="([^"]*)"/g)].map((m) => m[1]);

describe('il badge conta le domande, non le scrive a mano', () => {
  it('contaAltreDomande("lavoro") vale 5', () => {
    // La 02 porta l'area «lavoro» a 6 domande — area2Altra1, area2Altra2,
    // area2Altra3, area2Altra4, area2Altra5, area2Domanda (quest'ultima
    // spostata in fondo e riscritta, «senza fonte») — e la prima è già
    // stampata sulla card. 6 − 1 = 5
    expect(contaAltreDomande('lavoro')).toBe(5);
  });

  it('il badge della card «lavoro» legge «altre 5 domande qui dentro»', () => {
    const markup = renderToStaticMarkup(
      createElement(CardMacrocategoria, { area: AREE.lavoro }),
    );
    // Il 5 non compare in testi.ts: se il segnaposto non venisse sostituito
    // qui si leggerebbe «altre {n} domande qui dentro».
    expect(markup).toContain('altre 5 domande qui dentro');
    expect(markup).not.toContain('{n}');
  });

  it('in testi.ts il numero non è scritto: c\'è il segnaposto', () => {
    // Una stringa per area con il numero dentro ricadrebbe nel difetto che
    // il badge esiste per evitare: mentirebbe appena la lista cambia.
    expect(STRINGHE_UTENTE.areaBadge).toContain('{n}');
    expect(STRINGHE_UTENTE.areaBadge).not.toMatch(/\d/);
  });
});

describe('le rotte via hash', () => {
  it('#/lavoro apre la pagina della macrocategoria', () => {
    expect(parseRotta('#/lavoro')).toEqual({
      tipo: 'macrocategoria',
      id: 'lavoro',
    });
  });

  it('un indirizzo non riconosciuto porta alla home, non a un errore', () => {
    // Chi arriva con un indirizzo storto deve vedere una pagina che
    // funziona: nessuna schermata di errore da interpretare.
    expect(parseRotta('#/qualunque-cosa')).toEqual({ tipo: 'home' });
  });
});

describe('le tre porte hanno lo stesso peso visivo', () => {
  it('la home contiene esattamente 3 card', () => {
    // Tre macrocategorie dichiarate in ID_AREE, tre card: nessuna in più
    // (una quarta porta non dichiarata) e nessuna in meno.
    expect(cardDellaHome(markupHome())).toHaveLength(3);
  });

  it('nessuna card porta una classe che le altre due non hanno', () => {
    const card = cardDellaHome(markupHome());
    expect(card).toHaveLength(3);

    // Le classi della prima card, nell'ordine, sono il metro delle altre
    // due. Una variante «in evidenza» su una sola card — o un colore, o un
    // bordo diverso — cambierebbe questo elenco e farebbe fallire il test.
    const attese = classi(card[0]);
    // Guardia contro il confronto a vuoto: se l'estrazione delle classi
    // smettesse di trovarle, tre elenchi vuoti sarebbero «uguali» e il
    // test passerebbe senza aver controllato niente.
    expect(attese[0]).toBe('card-area');
    expect(attese.length).toBeGreaterThan(1);

    expect(classi(card[1])).toEqual(attese);
    expect(classi(card[2])).toEqual(attese);
  });
});

describe('il guardrail a runtime sulla home', () => {
  it('nessuna stringa della home viene bloccata da <Testo>', () => {
    // <Testo> sostituisce la stringa con un <mark class="violazione-guardrail">
    // quando verificaTestoUtente la rifiuta. L'assenza di quel marcatore
    // prova che ogni stringa a schermo è passata — badge già sostituito
    // compreso, che lessico-ui.test.ts vede invece ancora con il {n}.
    expect(markupHome()).not.toContain('violazione-guardrail');
  });
});
