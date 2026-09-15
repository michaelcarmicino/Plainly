/**
 * IL FISCO DICHIARATO — agente core-engine. Funzionalità 08.
 *
 * Aliquote IRPEF, soglie degli scaglioni, aliquota contributiva INPS e
 * soglia dell'eccedenza sono dati che nessuno di noi può inventare, e non
 * possono venire dalla rete: un aggiornamento automatico sarebbe una
 * chiamata esterna, che il prodotto non fa — né a runtime né in fase di
 * build.
 *
 * I valori qui sotto sono una decisione di progetto presa da un documento
 * interno, non una circolare verificata con il suo anno d'imposta. Finché
 * `annoImpostaDichiarato` resta `false`, la schermata lo dice apertamente
 * invece di presentare questi numeri come un fatto già verificato — stesso
 * schema di `inflazioneDichiarata.ts`, dove il flag è ancora falso oggi.
 *
 * La funzione che calcola riceve scaglioni e contributi come PARAMETRO e non
 * legge mai questa costante: così il calcolo resta verificabile senza
 * dipendere dal valore dichiarato (vedi `nettoInBusta.ts`).
 *
 * Nota per l'architetto: `registroFonti.ts` (funzionalità 13) anticipa già
 * una riga per questa funzionalità, ma il mandato di questo intervento vieta
 * di toccare file esistenti sotto `src/core/` — solo file nuovi, perché altri
 * agenti lavorano lì adesso. Questo modulo resta perciò AUTOSUFFICIENTE, sul
 * modello che `inflazioneDichiarata.ts` aveva prima della `13`: se si vuole
 * farne una vista sul registro, è una decisione da prendere a parte.
 */

/** Un pezzo di scaglione IRPEF: `limiteSuperioreCent: null` = nessun tetto. */
export interface ScaglioneIrpef {
  readonly limiteInferioreCent: number;
  readonly limiteSuperioreCent: number | null;
  readonly aliquotaBp: number;
}

/** L'aliquota contributiva INPS a carico della persona, con la soglia oltre
 *  la quale si applica l'aliquota maggiorata. */
export interface ParametriContributivi {
  readonly aliquotaBaseBp: number;
  readonly aliquotaEccedenzaBp: number;
  readonly sogliaEccedenzaCent: number;
}

export interface FiscoDichiarato {
  readonly scaglioniIrpef: readonly ScaglioneIrpef[];
  readonly contributi: ParametriContributivi;
  readonly fonteIrpef: string;
  readonly fonteContributi: string;
  /** Vero solo quando l'anno d'imposta è stato davvero dichiarato. */
  readonly annoImpostaDichiarato: boolean;
}

/**
 * DA COMPILARE — `annoImpostaDichiarato: false` non è una svista: un'aliquota
 * senza l'anno a cui si riferisce è indistinguibile da una inventata. Si
 * corregge insieme il valore e il flag, quando una persona recupera la fonte
 * e dichiara l'anno.
 */
export const FISCO_DICHIARATO: FiscoDichiarato = {
  scaglioniIrpef: [
    { limiteInferioreCent: 0, limiteSuperioreCent: 2_800_000, aliquotaBp: 2300 },
    { limiteInferioreCent: 2_800_000, limiteSuperioreCent: 5_000_000, aliquotaBp: 3300 },
    { limiteInferioreCent: 5_000_000, limiteSuperioreCent: null, aliquotaBp: 4300 },
  ],
  contributi: {
    aliquotaBaseBp: 919,
    aliquotaEccedenzaBp: 1019,
    sogliaEccedenzaCent: 5_219_000,
  },
  fonteIrpef: 'Agenzia delle Entrate / Legge di Bilancio',
  fonteContributi: 'INPS',
  annoImpostaDichiarato: false,
};

/** Vero finché l'anno d'imposta non è stato dichiarato. Nessun confronto fra testi. */
export function annoImpostaDaCompilare(fisco: FiscoDichiarato): boolean {
  return !fisco.annoImpostaDichiarato;
}
