/**
 * DA QUELLO CHE UNA PERSONA DIGITA AL NUMERO CHE IL CORE SA LEGGERE.
 * Agente: ui-builder.
 *
 * Qui non si calcola niente di dominio: si stabilisce soltanto in quale dei
 * tre momenti si trova un campo.
 *
 *   vuoto     — non c'è ancora niente. Chi non ha scritto non ha sbagliato.
 *   in-corso  — c'è un pezzo di numero: «10.», «10.0», «10.000,» sono
 *               passaggi di una digitazione, non errori. Un messaggio che
 *               compare a metà numero insegna a ignorare i messaggi, e qui
 *               nessuno ha un limite di tempo per scrivere.
 *   letto     — c'è un numero. Può anche essere NaN: se il testo non è
 *               interpretabile, il campo passa comunque `NaN` al core, che
 *               è l'unico posto in cui si decide che cosa è accettabile.
 *               La schermata non tiene una seconda copia delle regole.
 *
 * Gli importi si leggono SOLO con parseNumeroIt: «10.000» all'italiana vale
 * diecimila euro, e leggerlo all'inglese darebbe 9,06 € invece di 9.057,31 €,
 * sbagliato di tre ordini di grandezza e abbastanza plausibile da non
 * insospettire nessuno.
 */

import { parseNumeroIt } from '../core/index.ts';

export type LetturaCampo =
  | { readonly stato: 'vuoto' }
  | { readonly stato: 'in-corso' }
  | { readonly stato: 'letto'; readonly valore: number };

const VUOTO: LetturaCampo = { stato: 'vuoto' };
const IN_CORSO: LetturaCampo = { stato: 'in-corso' };

/** Un importo a metà strada: cifre, punti di migliaia incompleti, virgola. */
const IMPORTO_A_META = /^-?\d*(\.\d{0,3})*(,\d*)?$/;

/** Un numero di anni a metà strada: cifre, e al più un separatore finale. */
const ANNI_A_META = /^-?\d*[.,]?$/;

const ANNI_INTERI = /^-?\d+$/;
const ANNI_CON_DECIMALI = /^-?\d+[.,]\d+$/;

export function leggiSomma(testo: string): LetturaCampo {
  const pulito = testo.trim();
  if (pulito === '') return VUOTO;

  const cent = parseNumeroIt(pulito);
  if (cent !== null) return { stato: 'letto', valore: cent };

  if (IMPORTO_A_META.test(pulito)) return IN_CORSO;
  return { stato: 'letto', valore: Number.NaN };
}

export function leggiAnni(testo: string): LetturaCampo {
  const pulito = testo.trim();
  if (pulito === '') return VUOTO;

  if (ANNI_INTERI.test(pulito)) return { stato: 'letto', valore: Number(pulito) };
  if (ANNI_CON_DECIMALI.test(pulito)) {
    // Un anno e mezzo arriva al core come 1,5 e viene rifiutato lì, con il
    // suo codice: la formula accetterebbe l'esponente frazionario senza
    // protestare e restituirebbe un numero credibile.
    return { stato: 'letto', valore: Number(pulito.replace(',', '.')) };
  }

  if (ANNI_A_META.test(pulito)) return IN_CORSO;
  return { stato: 'letto', valore: Number.NaN };
}

/**
 * Vero quando la persona ha scritto più di due decimali.
 *
 * Il dominio si ferma al centesimo: «10.000,555» diventa 10.000,56 €. Un
 * arrotondamento fatto in silenzio è un risultato calcolato su un numero che
 * la persona non ha scritto, quindi la schermata lo dichiara.
 */
export function decimaliOltreIlCentesimo(testo: string): boolean {
  return /,\d{3,}$/.test(testo.trim().replace(/\s|€/g, ''));
}
