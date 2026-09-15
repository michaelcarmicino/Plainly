/**
 * GLI SCARTI DELLA SCALA DELLE IPOTESI — agente core-engine. Funzionalità 10.
 *
 * Sta in un modulo suo, separato dal calcolo, per la stessa ragione di
 * inflazioneDichiarata.ts: uno scarto non è un numero nudo, è un numero CON
 * la sua provenienza. Il core dice SE la provenienza è completa, la
 * schermata dice COM'È SCRITTA (in src/ui/testiRataMutuo.ts).
 *
 * `calcolaScalaIpotesiTassoVariabile` riceve questi scarti come PARAMETRO e
 * non legge mai questa costante: così il calcolo resta verificabile senza
 * dipendere dal valore dichiarato, e il blocco qui sotto non ferma
 * l'implementazione.
 *
 * DA COMPILARE — `periodoDichiarato: false` non è una svista: la scala va
 * costruita guardando quanto si è mosso storicamente l'Euribor in periodi di
 * durata comparabile, e quel periodo nessuno di noi lo ha ancora dichiarato.
 * Una scala di ipotesi senza gli anni su cui è costruita è indistinguibile
 * da una scala inventata. Finché il flag resta `false`, la schermata dichiara
 * apertamente che il periodo non è stato stabilito.
 *
 * Per completarlo serve la storia dell'Euribor su un periodo dichiarato: si
 * aggiornano `valoriBp` (se lo scarto storico osservato è diverso) e
 * `periodoDichiarato` INSIEME, in una decisione di squadra.
 */

export interface ScartiIpotesiTassoMutuo {
  /** Punti base di scostamento dal tasso di partenza: −1 punto, 0, +1, +2. */
  readonly valoriBp: readonly number[];
  /** Vero solo quando il periodo storico su cui è costruita la scala è dichiarato. */
  readonly periodoDichiarato: boolean;
}

export const SCARTI_IPOTESI_TASSO_MUTUO: ScartiIpotesiTassoMutuo = {
  valoriBp: [-100, 0, 100, 200],
  periodoDichiarato: false,
};

/** Vero finché il periodo non è stato dichiarato. Nessun confronto fra testi. */
export function periodoScartiDaCompilare(scarti: ScartiIpotesiTassoMutuo): boolean {
  return !scarti.periodoDichiarato;
}
