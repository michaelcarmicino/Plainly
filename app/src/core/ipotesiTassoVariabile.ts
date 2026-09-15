/**
 * LA SCALA DELLE IPOTESI SUL TASSO CHE SI MUOVE — agente core-engine.
 * Funzionalità 10.
 *
 * Quattro righe, una per scarto dichiarato: che cosa succederebbe alla rata
 * mobile se il suo tasso si muovesse davvero. Sono ipotesi, non pronostici —
 * aritmetica su valori dichiarati, non uno scenario probabile — e questo
 * modulo non lo dimentica: il taglio a zero al passo 9 non è cosmetico, sotto
 * zero la formula produce un numero che esiste ma non significa niente.
 *
 * Riceve gli scarti come PARAMETRO (mai la costante di
 * scartiIpotesiTassoMutuo.ts): così il calcolo si scrive e si verifica prima
 * che il periodo storico sia dichiarato.
 */

import { calcolaRataCent } from './rataMutuo.ts';

export interface RigaIpotesiTassoVariabile {
  readonly scartoBp: number;
  /** Il tasso di partenza spostato dello scarto, mai sotto zero. */
  readonly tassoIpotesiBp: number;
  readonly rataIpotesiCent: number;
  /** Positiva quando l'ipotesi costa di più al mese di oggi. */
  readonly differenzaMensileVsOggiCent: number;
  readonly differenzaAnnuaVsOggiCent: number;
}

/**
 * Una riga per ogni scarto in `scartiBp`, nello stesso ordine in cui è
 * passato l'elenco. `rataVariabileOggiCent` è la rata già calcolata allo
 * scarto zero: non viene ricalcolata qui, per restare fedele alla cifra che
 * la persona ha già letto sopra la scala.
 */
export function calcolaScalaIpotesiTassoVariabile(
  capitaleCent: number,
  anni: number,
  tassoVariabilePartenzaAnnuoBp: number,
  rataVariabileOggiCent: number,
  scartiBp: readonly number[],
): readonly RigaIpotesiTassoVariabile[] {
  return scartiBp.map((scartoBp) => {
    const tassoIpotesiBp = Math.max(0, tassoVariabilePartenzaAnnuoBp + scartoBp);
    const rataIpotesiCent = calcolaRataCent({
      capitaleCent,
      anni,
      tassoAnnuoBp: tassoIpotesiBp,
    });
    const differenzaMensileVsOggiCent = rataIpotesiCent - rataVariabileOggiCent;

    return {
      scartoBp,
      tassoIpotesiBp,
      rataIpotesiCent,
      differenzaMensileVsOggiCent,
      differenzaAnnuaVsOggiCent: differenzaMensileVsOggiCent * 12,
    };
  });
}
