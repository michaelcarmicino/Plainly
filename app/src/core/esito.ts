/**
 * ESITO — l'unione discriminata con cui il core riporta un fallimento.
 * Agente: core-engine.
 *
 * Motivo: una `throw` nel flusso normale rende l'errore invisibile fino al
 * runtime. Qui il compilatore obbliga chi chiama a gestire il ramo `false`,
 * e il messaggio arriva a schermo già in lingua umana.
 *
 * Le eccezioni restano lecite solo per un invariante rotto: in quel caso si
 * usa `ErroreCalcolo`, in `index.ts`.
 */

export type EsitoRiuscito<T> = { readonly ok: true; readonly valore: T };

export type EsitoFallito<E extends string = string> = {
  readonly ok: false;
  readonly errore: E;
};

/**
 * `Esito<T>` resta quello prescritto dagli standard. Il secondo parametro è
 * opzionale e serve a stringere il ramo fallito su un elenco chiuso di codici
 * invece che su una stringa qualunque: `Esito<T, Codice>` resta assegnabile a
 * `Esito<T>`, perché ogni codice è una stringa.
 */
export type Esito<T, E extends string = string> = EsitoRiuscito<T> | EsitoFallito<E>;

/** Ramo riuscito. Il tipo non nomina l'errore: entra in qualunque `Esito`. */
export function esitoOk<T>(valore: T): EsitoRiuscito<T> {
  return { ok: true, valore };
}

/** Ramo fallito. `E` si restringe da solo sul codice passato. */
export function esitoErrore<E extends string = string>(errore: E): EsitoFallito<E> {
  return { ok: false, errore };
}
