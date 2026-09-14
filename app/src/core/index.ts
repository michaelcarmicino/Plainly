/**
 * CORE — logica deterministica. Agente: core-engine.
 * Nessun import da src/ui, src/assessment, src/ingest. Nessuna rete.
 *
 * STATO A T+0:15: scheletro. Le firme sono definitive perché derivano dai
 * contratti; i corpi sono TODO fino a che lo scenario non è congelato.
 */

import type {
  DocumentoUtente,
  LetturaCalcolata,
  VoceCalcolata,
  QuadraturaTotale,
} from '../../types/contracts.ts';

/** Errore di dominio: il core non lancia stringhe nude. */
export class ErroreCalcolo extends Error {
  constructor(
    message: string,
    readonly documentoId: string,
  ) {
    super(message);
    this.name = 'ErroreCalcolo';
  }
}

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

/** TODO(scenario): una voce calcolata con la sua spiegazione fattuale. */
export function calcolaVoce(
  _documento: DocumentoUtente,
  _voceId: string,
): VoceCalcolata {
  throw new ErroreCalcolo('calcolaVoce non ancora implementata', _documento.id);
}

/**
 * Funzione di ingresso del core: documento strutturato → lettura calcolata.
 * TODO(scenario): implementare dopo il congelamento dell'idea (T+1:40).
 */
export function calcolaLettura(_documento: DocumentoUtente): LetturaCalcolata {
  throw new ErroreCalcolo('calcolaLettura non ancora implementata', _documento.id);
}

export { formattaEuro, formattaPercentuale, parseNumeroIt } from './formatoIt.ts';

export {
  esitoOk,
  esitoErrore,
  type Esito,
  type EsitoRiuscito,
  type EsitoFallito,
} from './esito.ts';

export {
  INFLAZIONE_DICHIARATA,
  periodoDaCompilare,
  type TassoInflazioneDichiarato,
} from './inflazioneDichiarata.ts';

export {
  simulaRisparmio,
  calcolaSimulazioneRisparmio,
  MOTIVI_RIFIUTO_RISPARMIO,
  ANNI_MIN,
  ANNI_MAX,
  RISPARMIO_MAX_CENT,
  type MotivoRifiutoRisparmio,
  type IngressoSimulazioneRisparmio,
  type RisultatoSimulazioneRisparmio,
} from './simulazioneRisparmio.ts';
