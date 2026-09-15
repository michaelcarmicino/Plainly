/**
 * Tipi e costruttore di radici condivisi dal lessico prescrittivo.
 * Codice riutilizzabile, non dati: i termini vietati restano tutti in
 * `lessico.ts`, com'è richiesto per quel file.
 */

export type GravitaViolazione = 'blocco' | 'attenzione';

export interface TermineVietato {
  readonly id: string;
  /** Radice case-insensitive. \p{L} per gestire gli accenti italiani. */
  readonly radice: RegExp;
  readonly motivo: string;
  /** Come si dice la stessa cosa senza consigliare. */
  readonly riformulazione: string;
  readonly gravita: GravitaViolazione;
}

/** Costruisce una regex su radice di parola, accent-safe. */
export const confineParola = (pattern: string): RegExp =>
  new RegExp(`(?<![\\p{L}])(?:${pattern})(?![\\p{L}])`, 'giu');
