/**
 * VALIDAZIONE DEL NETTO IN BUSTA — agente core-engine. Funzionalità 08.
 *
 * Limiti del campo digitato dalla persona (lordo mensile, mensilita) e
 * controlli sui dati di fisco ricevuti come parametro — non un errore che la
 * persona può causare digitando, ma un rischio dichiarato dalla specifica:
 * «il modulo delle fonti si riempie a mano».
 *
 * I motivi di rifiuto sono CODICI, non frasi: le parole che legge una
 * persona stanno in `src/ui/testi.ts`, unico punto in cui il lessico viene
 * scandito.
 */

import type { Esito } from './esito.ts';
import { esitoErrore, esitoOk } from './esito.ts';
import type { ParametriContributivi, ScaglioneIrpef } from './fiscoDichiarato.ts';
import type { IngressoNettoInBusta, RisultatoNettoInBusta } from './nettoInBusta.ts';
import { calcolaNettoInBusta } from './nettoInBusta.ts';

/** Limiti del campo digitato, non dell'aritmetica. */
export const MENSILITA_MIN = 12;
export const MENSILITA_MAX = 14;

/** 100.000,00 €/mese — oltre, la cifra è quasi sempre un errore di battitura. */
export const LORDO_MENSILE_MAX_CENT = 10_000_000;

/**
 * L'elenco è la fonte unica e il tipo nasce da qui, sullo stesso schema di
 * `MOTIVI_RIFIUTO_RISPARMIO`: chi costruisce la schermata ne ricava una mappa
 * esaustiva verso i testi, e il compilatore segnala il codice che manca.
 */
export const MOTIVI_RIFIUTO_NETTO = [
  'lordo-non-leggibile',
  'lordo-sotto-zero',
  'lordo-a-zero',
  'lordo-troppo-alto',
  'mensilita-non-intere',
  'mensilita-fuori-intervallo',
  'scaglioni-non-validi',
  'aliquote-contributive-non-valide',
] as const;

export type MotivoRifiutoNetto = (typeof MOTIVI_RIFIUTO_NETTO)[number];

/** Elenco vuoto, aliquote negative, o soglie che non crescono scaglione dopo scaglione. */
function scaglioniNonValidi(scaglioni: readonly ScaglioneIrpef[]): boolean {
  if (scaglioni.length === 0) return true;
  return scaglioni.some((scaglione, indice) => {
    if (scaglione.aliquotaBp < 0) return true;
    if (scaglione.limiteSuperioreCent !== null && scaglione.limiteSuperioreCent <= scaglione.limiteInferioreCent) {
      return true;
    }
    if (indice === 0) return false;
    return scaglione.limiteInferioreCent <= scaglioni[indice - 1].limiteInferioreCent;
  });
}

function contributiNonValidi(contributi: ParametriContributivi): boolean {
  return (
    contributi.aliquotaBaseBp < 0 || contributi.aliquotaEccedenzaBp < 0 || contributi.sogliaEccedenzaCent < 0
  );
}

/**
 * Primo motivo di rifiuto trovato, oppure null. L'ordine è quello della
 * lettura: prima il lordo, poi le mensilita, poi il fisco dichiarato.
 */
function primoMotivo(
  ingresso: IngressoNettoInBusta,
  scaglioni: readonly ScaglioneIrpef[],
  contributi: ParametriContributivi,
): MotivoRifiutoNetto | null {
  const { lordoMensileCent, mensilita } = ingresso;

  if (!Number.isInteger(lordoMensileCent)) return 'lordo-non-leggibile';
  if (lordoMensileCent < 0) return 'lordo-sotto-zero';
  if (lordoMensileCent === 0) return 'lordo-a-zero';
  if (lordoMensileCent > LORDO_MENSILE_MAX_CENT) return 'lordo-troppo-alto';

  if (!Number.isInteger(mensilita)) return 'mensilita-non-intere';
  if (mensilita < MENSILITA_MIN || mensilita > MENSILITA_MAX) return 'mensilita-fuori-intervallo';

  if (scaglioniNonValidi(scaglioni)) return 'scaglioni-non-validi';
  if (contributiNonValidi(contributi)) return 'aliquote-contributive-non-valide';

  return null;
}

/**
 * Ingresso digitato → risultato, oppure il codice del motivo per cui non si
 * calcola. Il controllo su mensilita avviene PRIMA di ogni divisione: nessun
 * tentativo di dividere per zero al passo del netto mensile.
 *
 * Il ramo fallito è stretto sui codici: resta assegnabile a
 * `Esito<RisultatoNettoInBusta>`.
 */
export function simulaNettoInBusta(
  ingresso: IngressoNettoInBusta,
  scaglioni: readonly ScaglioneIrpef[],
  contributi: ParametriContributivi,
): Esito<RisultatoNettoInBusta, MotivoRifiutoNetto> {
  const motivo = primoMotivo(ingresso, scaglioni, contributi);
  return motivo === null
    ? esitoOk(calcolaNettoInBusta(ingresso, scaglioni, contributi))
    : esitoErrore(motivo);
}
