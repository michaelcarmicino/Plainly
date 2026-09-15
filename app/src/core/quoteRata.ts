/**
 * QUOTA CAPITALE E QUOTA INTERESSI DI UNA RATA — scritto su mandato della
 * funzionalità 11 («approfondimento sul mutuo»), agente 03-ui-builder con
 * 01-core-engine.
 *
 * Due funzioni pure SOPRA `rataMutuo()` della funzionalità 10: questo modulo
 * NON calcola una rata, la riceve già calcolata come `rataCent` — chi
 * chiama (10, o un test con un valore verificato a mano) gliela passa.
 * Alla data di questo file `rataMutuo()` non esiste ancora (10 risulta
 * «proposta», non costruita): è per questo che qui sotto e nel test i
 * valori di `rataCent` sono costanti dichiarate, verificate a mano nella
 * sezione «Elaborazione» di docs/features/11-approfondimento-sul-mutuo.md,
 * non il risultato di una chiamata a quella funzione.
 *
 * ATTENZIONE — punto lasciato aperto di proposito, non deciso qui.
 * La specifica 11 chiede che «le quote capitale di tutte le rate rimesse
 * insieme ridiano esattamente il capitale prestato». Con un arrotondamento
 * all'interesse a OGNI rata (una sola cifra arrotondata, come sotto), la
 * somma delle quote capitale su N rate NON torna esatta da sola: si simula
 * la ricorsione completa in quoteRata.test.ts e la si dimostra, mostrando
 * uno scarto di alcune decine di centesimi su 300-360 rate a seconda dello
 * scenario. Riconciliare quello scarto — tipicamente facendo assorbire il
 * residuo esatto all'ultima rata, come fa una banca — è una scelta che
 * questo modulo non prende da solo: la specifica non la dichiara. Questo
 * file espone solo le due funzioni richieste; la simulazione e lo scarto
 * misurato stanno nel test, come dimostrazione del problema, non come sua
 * soluzione silenziosa.
 */

/** Le due quote in cui si divide una rata già calcolata. */
export interface QuoteRata {
  readonly interesseCent: number;
  readonly capitaleCent: number;
}

/**
 * Come si divide UNA rata fra interessi e quota capitale.
 * Un arrotondamento solo — sull'interesse, al centesimo — e la quota
 * capitale è ciò che resta della rata: `interesseCent + capitaleCent`
 * fa sempre `rataCent`, per costruzione, senza eccezioni da gestire.
 *
 * `tassoAnnuoBp` è il tasso ANNUO in punti base (1% = 100 bp); la divisione
 * per 120_000 = 12 mesi × 10_000 (punti base per unità) porta l'interesse
 * mensile sul capitale residuo, in centesimi.
 */
export function quoteDellaRata(
  capitaleResiduoCent: number,
  tassoAnnuoBp: number,
  rataCent: number,
): QuoteRata {
  const interesseCent = Math.round((capitaleResiduoCent * tassoAnnuoBp) / 120_000);
  return { interesseCent, capitaleCent: rataCent - interesseCent };
}

/**
 * Quanto si restituisce in tutto su `numeroRate` rate, sulla rata già
 * arrotondata: interi su interi, la cifra che vede chi paga e che si
 * rifà a mano con una sola moltiplicazione.
 */
export function totaleRestituitoCent(rataCent: number, numeroRate: number): number {
  return rataCent * numeroRate;
}
