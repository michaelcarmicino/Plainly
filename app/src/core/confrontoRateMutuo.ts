/**
 * LE DUE RATE AFFIANCATE, E LA LORO DIFFERENZA — agente core-engine.
 * Funzionalità 10.
 *
 * Il confronto è ARITMETICA INTERA SULLE RATE GIÀ ARROTONDATE: la rata al
 * centesimo è quella che la banca addebita davvero, quindi la differenza che
 * ne esce è quella che si vede sull'estratto conto, non un residuo di
 * calcolo su un numero a virgola mobile.
 *
 * Questo modulo non giudica le due opzioni fra loro, e non lo fa nemmeno la
 * schermata che lo consuma: restituisce due rate della stessa forma, allo
 * stesso livello.
 */

import { calcolaRataCent, motivoAnni, motivoCapitale, motivoTasso } from './rataMutuo.ts';
import type { MotivoRifiutoMutuo } from './rataMutuo.ts';
import type { Esito } from './esito.ts';
import { esitoErrore, esitoOk } from './esito.ts';

export interface IngressoConfrontoRateMutuo {
  readonly capitaleCent: number;
  readonly anni: number;
  readonly tassoFissoAnnuoBp: number;
  readonly tassoVariabilePartenzaAnnuoBp: number;
}

export interface RisultatoConfrontoRateMutuo {
  readonly capitaleCent: number;
  readonly anni: number;
  readonly mesi: number;
  readonly tassoFissoAnnuoBp: number;
  readonly tassoVariabilePartenzaAnnuoBp: number;
  readonly rataFissaCent: number;
  readonly rataVariabileOggiCent: number;
  /** Positiva quando la rata ferma costa di più al mese, oggi. */
  readonly differenzaMensileCent: number;
  readonly differenzaSu12MesiCent: number;
}

/**
 * ARITMETICA PURA, senza i limiti dei campi digitati. Chi vuole il caso
 * limite chiama questa funzione; chi riceve quattro valori digitati chiama
 * `confrontaRateMutuo`, che prima controlla.
 */
export function calcolaConfrontoRateMutuo(
  ingresso: IngressoConfrontoRateMutuo,
): RisultatoConfrontoRateMutuo {
  const { capitaleCent, anni, tassoFissoAnnuoBp, tassoVariabilePartenzaAnnuoBp } = ingresso;

  const rataFissaCent = calcolaRataCent({ capitaleCent, anni, tassoAnnuoBp: tassoFissoAnnuoBp });
  const rataVariabileOggiCent = calcolaRataCent({
    capitaleCent,
    anni,
    tassoAnnuoBp: tassoVariabilePartenzaAnnuoBp,
  });
  const differenzaMensileCent = rataFissaCent - rataVariabileOggiCent;

  return {
    capitaleCent,
    anni,
    mesi: anni * 12,
    tassoFissoAnnuoBp,
    tassoVariabilePartenzaAnnuoBp,
    rataFissaCent,
    rataVariabileOggiCent,
    differenzaMensileCent,
    differenzaSu12MesiCent: differenzaMensileCent * 12,
  };
}

/** Primo motivo trovato, nell'ordine di lettura: capitale, anni, i due tassi. */
function primoMotivo(ingresso: IngressoConfrontoRateMutuo): MotivoRifiutoMutuo | null {
  return (
    motivoCapitale(ingresso.capitaleCent) ??
    motivoAnni(ingresso.anni) ??
    motivoTasso(ingresso.tassoFissoAnnuoBp) ??
    motivoTasso(ingresso.tassoVariabilePartenzaAnnuoBp)
  );
}

/**
 * Ingresso digitato → confronto, oppure il codice del motivo per cui non si
 * calcola. La schermata traduce il codice in parole attingendo a
 * src/ui/testiRataMutuo.ts.
 */
export function confrontaRateMutuo(
  ingresso: IngressoConfrontoRateMutuo,
): Esito<RisultatoConfrontoRateMutuo, MotivoRifiutoMutuo> {
  const motivo = primoMotivo(ingresso);
  return motivo === null
    ? esitoOk(calcolaConfrontoRateMutuo(ingresso))
    : esitoErrore(motivo);
}
