/**
 * MISURA DEL MIGLIORAMENTO — agente impact-analyst.
 * Stessa domanda prima e dopo la lettura: il delta è il numero di slide 9.
 * Scheletro a T+0:15: firme definite, corpi TODO.
 */

import type {
  DomandaComprensione,
  EsitoQuestionario,
  RispostaUtente,
  VerificaComprensione,
} from '../../types/contracts.ts';

/** Limiti dichiarati insieme al risultato. Non sono una postilla: fanno
 *  parte del risultato, perché un campione da hackathon non è una misura. */
export const LIMITI_DICHIARATI: readonly string[] = [
  'Campione ridotto, raccolto durante l\'evento: indicazione, non statistica.',
  'Le stesse domande vengono poste prima e dopo: parte del delta è effetto memoria.',
  'Nessuna selezione casuale dei partecipanti.',
  // TODO(scenario): limiti specifici del dominio scelto.
];

/** Punteggio 0..100 su un insieme di risposte. Deterministico. */
export function calcolaEsito(
  domande: readonly DomandaComprensione[],
  risposte: readonly RispostaUtente[],
): EsitoQuestionario {
  const indice = new Map(domande.map((d) => [d.id, d]));
  const corrette = risposte.reduce((acc, r) => {
    const d = indice.get(r.domandaId);
    return acc + (d && d.indiceCorretto === r.indiceScelto ? 1 : 0);
  }, 0);
  const totale = domande.length;
  return {
    risposte,
    corrette,
    totale,
    punteggio: totale === 0 ? 0 : Math.round((corrette / totale) * 100),
  };
}

/** Delta prima/dopo. null se manca una delle due rilevazioni. */
export function calcolaDelta(
  prima: EsitoQuestionario | null,
  dopo: EsitoQuestionario | null,
): number | null {
  if (!prima || !dopo) return null;
  return dopo.punteggio - prima.punteggio;
}

/** TODO(scenario): il questionario dipende dallo scenario congelato. */
export function costruisciQuestionario(_documentoId: string): readonly DomandaComprensione[] {
  return [];
}

/** TODO(scenario): assemblaggio finale dell'evidenza di slide 9. */
export function componiVerifica(_documentoId: string): VerificaComprensione {
  throw new Error('componiVerifica non ancora implementata');
}
