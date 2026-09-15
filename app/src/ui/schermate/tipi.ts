/**
 * I TIPI DEL REGISTRO DELLE SCHERMATE — agente ui-builder. Funzionalità 14.
 * Vedi docs/features/14-registro-delle-schermate.md per il perché.
 *
 * Una schermata si dichiara con questi quattro campi, più uno facoltativo:
 * `id` sostituisce il membro dell'unione `Rotta`, `percorso` la costante in
 * rotte.ts, `componente` (SENZA props) il case in App.tsx, `passo` il ramo
 * di Navigazione.tsx. `stringhe` non alimenta nulla: serve solo al test che
 * verifica che quelle chiavi esistano davvero in STRINGHE_UTENTE.
 *
 * `import.meta.glob` restituisce Record<string, unknown>: il compilatore
 * non sa più che cosa c'è dentro ogni modulo raccolto (Costo A della spec).
 * Il type guard qui sotto ripristina quella garanzia A RUNTIME, e fallisce
 * rumorosamente — non scarta in silenzio — quando una dichiarazione è
 * malformata: la stessa scelta già fatta in contenutiHome.ts per un
 * invariante rotto, e in standard-codice.md per ciò che è davvero
 * eccezionale.
 */

import type { ReactElement } from 'react';
import type { ChiaveStringaUtente } from '../testi.ts';

export interface DichiarazioneSchermata {
  readonly id: string;
  readonly percorso: `#/${string}`;
  readonly componente: () => ReactElement;
  readonly passo: ChiaveStringaUtente;
  /** Facoltativo: solo per il test che confronta con STRINGHE_UTENTE. */
  readonly stringhe?: readonly string[];
}

/** Un invariante rotto, non un caso da gestire a schermo: vedi standard-codice.md. */
export class DichiarazioneSchermataNonValida extends Error {
  constructor(file: string, motivo: string) {
    super(`dichiarazione di schermata non valida in «${file}»: ${motivo}`);
    this.name = 'DichiarazioneSchermataNonValida';
  }
}

function motivoNonValido(v: Readonly<Record<string, unknown>>): string | null {
  if (typeof v.id !== 'string' || v.id === '') return 'manca "id" (stringa non vuota)';
  if (typeof v.percorso !== 'string' || !v.percorso.startsWith('#/')) {
    return 'manca "percorso" nella forma "#/…"';
  }
  if (typeof v.componente !== 'function') return 'manca "componente"';
  if (typeof v.passo !== 'string' || v.passo === '') return 'manca "passo" (stringa non vuota)';
  if (v.stringhe !== undefined && !Array.isArray(v.stringhe)) {
    return '"stringhe", se presente, deve essere un elenco';
  }
  return null;
}

/**
 * Restringe `unknown` a `DichiarazioneSchermata`, o fallisce nominando il
 * file: una dichiarazione malformata deve rompere forte, non sparire.
 */
export function leggiDichiarazioneSchermata(
  candidato: unknown,
  file: string,
): DichiarazioneSchermata {
  if (typeof candidato !== 'object' || candidato === null) {
    throw new DichiarazioneSchermataNonValida(file, 'SCHERMATA non è un oggetto');
  }
  const motivo = motivoNonValido(candidato as Readonly<Record<string, unknown>>);
  if (motivo !== null) throw new DichiarazioneSchermataNonValida(file, motivo);
  return candidato as DichiarazioneSchermata;
}
