/// <reference types="vite/client" />
/**
 * IL REGISTRO DELLE SCHERMATE — agente ui-builder. Funzionalità 14.
 * Vedi docs/features/14-registro-delle-schermate.md.
 *
 * Ogni schermata si dichiara nel proprio file `NN-nome.ts`, qui accanto.
 * Questo file le raccoglie, le valida e le ordina: aggiungere una schermata
 * vuol dire aggiungere un file in questa cartella, non modificare questo.
 *
 * `import.meta.glob('./*.ts', { eager: true })` si risolve a build time —
 * verificato sul bundle: nessun `import()` dinamico, nessuna richiesta in
 * più rispetto a oggi (vedi il conteggio di `fetch(` prima e dopo, riportato
 * nel rapporto della funzionalità). La direttiva sopra serve solo a
 * `tsc --noEmit`, che altrimenti non conosce `import.meta.glob`: non tocca
 * tsconfig.json, che non è di questo agente.
 *
 * Il glob raccoglie anche `tipi.ts` e questo stesso file (`'./*.ts'` non fa
 * eccezioni): nessuno dei due esporta `SCHERMATA`, quindi vengono scartati
 * qui sotto PRIMA della validazione. Non sono dichiarazioni malformate,
 * semplicemente non sono dichiarazioni — la differenza è ciò che decide se
 * il file scompare in silenzio o fa fallire il registro.
 *
 * L'ordine del filesystem non è un'interfaccia (Costo B della spec): si
 * ordina esplicitamente per il nome del file, che grazie al prefisso `NN`
 * è già l'ordine dichiarato delle funzionalità.
 */

import { leggiDichiarazioneSchermata, type DichiarazioneSchermata } from './tipi.ts';

const moduli = import.meta.glob('./*.ts', { eager: true }) as Readonly<
  Record<string, Readonly<Record<string, unknown>>>
>;

function fileConDichiarazione(): ReadonlyArray<readonly [string, unknown]> {
  return Object.keys(moduli)
    .sort()
    .filter((file) => 'SCHERMATA' in moduli[file])
    .map((file) => [file, moduli[file].SCHERMATA] as const);
}

export const SCHERMATE: readonly DichiarazioneSchermata[] = fileConDichiarazione().map(
  ([file, candidato]) => leggiDichiarazioneSchermata(candidato, file),
);

/** Usato da App.tsx per risolvere `componente` e `passo` una volta sola. */
export function trovaSchermata(id: string): DichiarazioneSchermata | undefined {
  return SCHERMATE.find((schermata) => schermata.id === id);
}

/** Usato da rotte.ts: un indirizzo corrisponde a una schermata registrata? */
export function trovaSchermataPerPercorso(percorso: string): DichiarazioneSchermata | undefined {
  return SCHERMATE.find((schermata) => schermata.percorso === percorso);
}
