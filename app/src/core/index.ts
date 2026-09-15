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

export { verificaQuadratura, pesoInBp } from './calcoliDocumento.ts';

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
  REGISTRO_FONTI,
  provenienzaCompleta,
  righeConProvenienzaIncompleta,
  fonteDi,
  valoreBpDi,
  valoreBpDiRiga,
  MOTIVI_ERRORE_FONTE,
  type RigaFonte,
  type UnitaValore,
  type PeriodoRiferimento,
  type MotivoErroreFonte,
} from './registroFonti.ts';

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

export {
  letturaBolletta,
  MOTIVI_COSTO_KWH_NON_DISPONIBILE,
  type MotivoCostoKwhNonDisponibile,
  type CostoPerKwhBolletta,
  type DueQuoteBolletta,
  type LetturaBolletta,
} from './letturaBolletta.ts';

export {
  traduciCostoInEuro,
  calcolaCostoFoglio,
  MOTIVI_RIFIUTO_COSTO,
  COSTO_BP_MIN,
  COSTO_BP_MAX,
  type IngressoCostoFoglio,
  type RisultatoCostoFoglio,
  type MotivoRifiutoCosto,
} from './costoFoglio.ts';

export {
  mesiCoperti,
  calcolaMesiCoperti,
  MOTIVI_RIFIUTO_MESI_COPERTI,
  GIORNI_PER_MESE,
  SPESE_MENSILI_MIN_CENT,
  SPESE_MENSILI_MAX_CENT,
  RISPARMI_MAX_CENT,
  type MotivoRifiutoMesiCoperti,
  type IngressoMesiCoperti,
  type RisultatoMesiCoperti,
} from './mesiCoperti.ts';
