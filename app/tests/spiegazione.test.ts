/**
 * INVARIANTI STRUTTURALI DELLA «03 — PAGINA DI SPIEGAZIONE» — agente
 * guardrail-officer. Copre gli invarianti dichiarati da
 * docs/features/03-pagina-di-spiegazione-struttura-riusabile.md che il
 * compilatore da solo non basta a garantire: l'ordine dei blocchi lo decide
 * il componente e non l'istanza, il blocco 6 esiste se e solo se il 5, il
 * blocco 8 non è mai vuoto, e ogni chiave dichiarata è registrata.
 *
 * Il troncamento della domanda (CSS: nowrap/text-overflow) e il rosa #FF50A0
 * riservato al blocco 8 stanno in tests/spiegazione-css.test.ts, affiancato
 * per restare sotto le 150 righe (standard-codice.md).
 *
 * Fuori da questo file, per costruzione:
 *  - le 15 chiavi di STRINGHE_SPIEGAZIONE e il "passo" della schermata sono
 *    già verificati da src/ui/schermate/__tests__/registro.test.ts — non
 *    ridondato qui. Il test sulle chiavi qui sotto deriva invece l'elenco dal
 *    CONTENUTO dichiarato (PaginaSpiegazione), non dall'elenco "stringhe"
 *    scritto a mano nel file della schermata: due fonti diverse, un bug
 *    diverso da scoprire in ciascuna.
 *  - il lessico prescrittivo (tests/lessico-ui.test.ts) e i casi di
 *    accettazione (tests/accettazione/03-…, del tester) non sono duplicati.
 *  - otto casi di docs/test/03-pagina-di-spiegazione.md sono garanzie del
 *    COMPILATORE, non asserzioni eseguibili (CL-01..CL-08, marcati [tipo]:
 *    `immagine`/`nonFa` assente o vuota, `nomeTecnico`/`esempio` come lista
 *    invece che un valore solo, `esempio` privo di `paragone`/`fonte`/
 *    `avvertenza`). Si verificano con `// @ts-expect-error` più
 *    `npx tsc --noEmit`: li esegue e li riporta il `tester` nel referto,
 *    fingerli qui come test vitest non li eserciterebbe davvero.
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BloccoEsempio, BloccoFonte } from '../src/ui/BloccoEsempioSpiegazione.tsx';
import { ISTANZA_INFLAZIONE_SPESA, PAGINE_SPIEGAZIONE } from '../src/ui/contenutiSpiegazione.ts';
import type { PaginaSpiegazione as ContenutoSpiegazione } from '../src/ui/contenutiSpiegazione.ts';
import { PaginaSpiegazione } from '../src/ui/PaginaSpiegazione.tsx';
import type { EsitoEsempio } from '../src/ui/spiegazioneEsempio.ts';
import { STRINGHE_UTENTE, t } from '../src/ui/testi.ts';
import type { ChiaveStringaUtente } from '../src/ui/testi.ts';

const rendi = (contenuto: ContenutoSpiegazione): string =>
  renderToStaticMarkup(createElement(PaginaSpiegazione, { contenuto }));

const haCifra = (markup: string): boolean => markup.includes('class="spiegazione-cifra');
const haFonte = (markup: string): boolean => markup.includes('class="spiegazione-fonte"');

/** react-dom/server esegue l'escape dell'apostrofo nei nodi di testo:
 *  "dell'anno" -> "dell&#x27;anno" (stesso comportamento già annotato in
 *  tests/accettazione/02-catalogo-domande-accessibilita.test.ts). */
const perMarkup = (testo: string): string => testo.replace(/'/g, '&#x27;');

describe("ordine dei blocchi: lo impone il componente, non l'istanza", () => {
  it("per ogni pagina con nomeTecnico, l'ultima immagine precede sempre il nome tecnico", () => {
    const violazioni: string[] = [];
    for (const p of PAGINE_SPIEGAZIONE) {
      if (p.nomeTecnico === null) continue;
      const markup = rendi(p);
      const iImmagine = markup.indexOf(perMarkup(t(p.immagine[p.immagine.length - 1])));
      const iNomeTecnico = markup.indexOf(perMarkup(t(p.nomeTecnico)));
      if (iImmagine === -1 || iNomeTecnico === -1 || iImmagine >= iNomeTecnico) violazioni.push(p.id);
    }
    expect(violazioni, `pagine con ordine invertito o testo assente: ${violazioni.join(', ')}`).toEqual([]);
  });
});

describe('blocco 6 (da dove viene il numero) esiste se e solo se esiste il blocco 5', () => {
  it('su ogni pagina dichiarata, cifra e fonte compaiono sempre insieme', () => {
    for (const p of PAGINE_SPIEGAZIONE) {
      const markup = rendi(p);
      expect(haCifra(markup), `pagina «${p.id}»`).toBe(haFonte(markup));
    }
  });

  it('senza esempio (esempio: null), non compaiono né la cifra né la fonte', () => {
    const senzaEsempio: ContenutoSpiegazione = { ...ISTANZA_INFLAZIONE_SPESA, esempio: null };
    const markup = rendi(senzaEsempio);
    expect(haCifra(markup)).toBe(false);
    expect(haFonte(markup)).toBe(false);
  });

  it('con un esempio che il core rifiuta, non compare una cifra e il blocco fonte non esiste', () => {
    // esito costruito a mano, non calcolato: quale ingresso reale produca
    // ok:false è responsabilità della 07 (simulaRisparmio), non di questo
    // file — vedi la nota introduttiva di docs/test/03-pagina-di-spiegazione.md.
    // Qui si verifica solo che il CONTENITORE non mostri mai un numero senza
    // fonte, indipendentemente da quale ingresso l'abbia prodotto.
    const esempio = ISTANZA_INFLAZIONE_SPESA.esempio;
    if (esempio === null) throw new Error("l'istanza di riferimento deve avere un esempio");
    const esitoFallito: EsitoEsempio = { ok: false };
    const markupCifra = renderToStaticMarkup(createElement(BloccoEsempio, { esempio, esito: esitoFallito }));
    const markupFonte = renderToStaticMarkup(createElement(BloccoFonte, { esempio, esito: esitoFallito }));
    expect(haCifra(markupCifra)).toBe(false);
    expect(markupFonte).toBe('');
  });
});

describe('blocco 8 (che cosa questa pagina non fa): presente, mai vuoto', () => {
  it('il markup mostra tante voci quante ne dichiara nonFa, nessuna vuota', () => {
    for (const p of PAGINE_SPIEGAZIONE) {
      const markup = rendi(p);
      const sezione = markup.match(/<ul class="limiti spiegazione-non-fa">([\s\S]*?)<\/ul>/);
      if (sezione === null) throw new Error(`pagina «${p.id}»: sezione limiti assente dal markup`);
      const voci = [...sezione[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
      expect(voci.length, `pagina «${p.id}»`).toBe(p.nonFa.length);
      expect(voci.length, `pagina «${p.id}»: nonFa non può essere vuoto`).toBeGreaterThan(0);
      expect(voci.every((v) => v.trim().length > 0), `pagina «${p.id}»: una voce vuota`).toBe(true);
    }
  });
});

describe('la domanda non è mai troncata (il caso CSS sta in spiegazione-css.test.ts)', () => {
  it('compare per intero nel proprio markup, senza puntini di troncamento', () => {
    for (const p of PAGINE_SPIEGAZIONE) {
      const domanda = t(p.domanda);
      expect(domanda, `pagina «${p.id}»`).not.toMatch(/…|\.\.\./);
      expect(rendi(p), `pagina «${p.id}»: domanda non trovata per intero`).toContain(perMarkup(domanda));
    }
  });
});

/** Deriva le chiavi dal CONTENUTO dichiarato (non dall'elenco "stringhe"
 *  scritto a mano nel file della schermata, già verificato altrove). */
function chiaviDiPagina(p: ContenutoSpiegazione): readonly ChiaveStringaUtente[] {
  const esempio = p.esempio;
  return [
    p.domanda,
    ...p.immagine,
    ...(p.nomeTecnico === null ? [] : [p.nomeTecnico]),
    ...(esempio === null ? [] : [esempio.frase, esempio.paragone, esempio.fonte, esempio.avvertenza]),
    ...p.passi.map((passo) => passo.testo),
    ...p.nonFa,
  ];
}

describe("ogni chiave dichiarata da un'istanza esiste in STRINGHE_UTENTE", () => {
  it('vale per ogni pagina, chiave per chiave', () => {
    const mancanti = PAGINE_SPIEGAZIONE.flatMap((p) =>
      chiaviDiPagina(p)
        .filter((chiave) => !(chiave in STRINGHE_UTENTE))
        .map((chiave) => `${p.id}: ${chiave}`),
    );
    expect(mancanti, `chiavi dichiarate ma non registrate: ${mancanti.join(', ')}`).toEqual([]);
  });
});
