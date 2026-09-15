/**
 * CALCOLI DOCUMENTO — le due operazioni comuni a qualunque documento a voci:
 * quanto scarta la somma delle voci dal totale dichiarato, e quanto pesa una
 * singola voce sul totale, in punti base. Agente: core-engine.
 *
 * File foglia: importa solo i contratti, nessuna dipendenza dal resto di
 * src/core/. Per questo qualunque modulo di src/core/ (letturaBolletta.ts, e
 * le prossime funzionalità con lo stesso bisogno) può importarle da qui
 * invece che da index.ts — che le riesporta per non cambiare la superficie
 * pubblica — senza mettersi in un import circolare con index.ts stesso.
 */

import type { DocumentoUtente, QuadraturaTotale } from '../../types/contracts.ts';

/** Somma delle voci vs totale stampato. Segnala lo scarto, non lo corregge. */
export function verificaQuadratura(documento: DocumentoUtente): QuadraturaTotale {
  const sommaVociCent = documento.voci.reduce((acc, v) => acc + v.importoCent, 0);
  const scartoCent = sommaVociCent - documento.totaleDichiaratoCent;
  return {
    sommaVociCent,
    totaleDichiaratoCent: documento.totaleDichiaratoCent,
    scartoCent,
    quadra: scartoCent === 0,
  };
}

/** Peso di una voce sul totale, in punti base. Arrotondamento half-up. */
export function pesoInBp(importoCent: number, totaleCent: number): number {
  if (totaleCent === 0) return 0;
  return Math.round((importoCent * 10_000) / totaleCent);
}
