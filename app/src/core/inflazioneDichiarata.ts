/**
 * IL TASSO DICHIARATO — agente core-engine.
 *
 * Sta in un modulo suo, separato dal calcolo, per una ragione sola: il tasso
 * non è un numero nudo, è un numero CON la sua provenienza. Qui vive il dato;
 * le parole che descrivono la provenienza vivono in src/ui/testi.ts, unico
 * punto in cui il lessico viene scandito. Il core dice SE la provenienza è
 * completa, la schermata dice COM'È SCRITTA.
 *
 * La funzione che calcola riceve i punti base come parametro e non legge mai
 * questa costante: così il calcolo resta verificabile senza dipendere dal
 * valore dichiarato.
 *
 * Nessuna rete, né a runtime né in fase di build: il valore entra a mano.
 * L'aggiornamento automatico sarebbe una chiamata esterna, che il prodotto
 * non fa.
 */

export interface TassoInflazioneDichiarato {
  /** Punti base annui: 1% = 100 bp. */
  readonly valoreBp: number;
  /** Vero solo quando il periodo di calcolo è stato davvero dichiarato. */
  readonly periodoDichiarato: boolean;
}

/**
 * DA COMPILARE — `periodoDichiarato: false` non è una svista, è il punto del
 * progetto in cui manca ancora un dato che nessuno di noi può inventare.
 *
 * Un tasso senza il periodo su cui è calcolato è esattamente il difetto che
 * questo modulo esiste per impedire: 200 bp senza dire su quali anni è una
 * cifra che chi legge non può controllare, e una cifra non controllabile è
 * indistinguibile da una inventata. Finché il flag resta `false`, la
 * schermata dichiara che il periodo non è stato stabilito invece di
 * presentare il 2,00% come un fatto verificabile.
 *
 * Per riempire la riga serve la media pluriennale dell'indice dei prezzi al
 * consumo con gli anni esatti su cui è calcolata, recuperata e dichiarata da
 * una persona: allora `valoreBp` e il flag si rivedono INSIEME, perché i 200
 * bp di adesso sono una decisione di progetto, non quella media.
 */
export const INFLAZIONE_DICHIARATA: TassoInflazioneDichiarato = {
  valoreBp: 200,
  periodoDichiarato: false,
};

/** Vero finché il periodo non è stato dichiarato. Nessun confronto fra testi. */
export function periodoDaCompilare(tasso: TassoInflazioneDichiarato): boolean {
  return !tasso.periodoDichiarato;
}
