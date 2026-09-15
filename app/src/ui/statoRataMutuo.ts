/**
 * DAI QUATTRO CAMPI ALLO STATO DELLA SCHERMATA — agente ui-builder.
 * Funzionalità 10.
 *
 * Come in motiviRisparmio.ts: il riquadro dei risultati non mostra MAI una
 * cifra vecchia. Se anche un solo campo non è ancora "letto" (vuoto o a
 * metà digitazione), lo stato resta 'vuoto': non c'è un caso intermedio in
 * cui tre cifre su quattro producono un numero.
 *
 * NOTA SUL PERIMETRO: importa i moduli del core per percorso diretto e non
 * da '../core/index.ts', perché il barrel non riesporta ancora queste firme
 * (fuori dal perimetro di questo intervento — vedi il rapporto di consegna).
 */

import { confrontaRateMutuo, type RisultatoConfrontoRateMutuo } from '../core/confrontoRateMutuo.ts';
import {
  calcolaScalaIpotesiTassoVariabile,
  type RigaIpotesiTassoVariabile,
} from '../core/ipotesiTassoVariabile.ts';
import { SCARTI_IPOTESI_TASSO_MUTUO } from '../core/scartiIpotesiTassoMutuo.ts';
import type { LetturaCampo } from './letturaCampi.ts';

export type StatoRataMutuo =
  | { readonly stato: 'vuoto' }
  | { readonly stato: 'in-sospeso' }
  | {
      readonly stato: 'pronto';
      readonly risultato: RisultatoConfrontoRateMutuo;
      readonly ipotesi: readonly RigaIpotesiTassoVariabile[];
    };

export function statoRataMutuo(
  capitale: LetturaCampo,
  anni: LetturaCampo,
  tassoFermo: LetturaCampo,
  tassoMobile: LetturaCampo,
): StatoRataMutuo {
  if (
    capitale.stato !== 'letto' ||
    anni.stato !== 'letto' ||
    tassoFermo.stato !== 'letto' ||
    tassoMobile.stato !== 'letto'
  ) {
    return { stato: 'vuoto' };
  }

  const esito = confrontaRateMutuo({
    capitaleCent: capitale.valore,
    anni: anni.valore,
    tassoFissoAnnuoBp: tassoFermo.valore,
    tassoVariabilePartenzaAnnuoBp: tassoMobile.valore,
  });

  if (!esito.ok) return { stato: 'in-sospeso' };

  const ipotesi = calcolaScalaIpotesiTassoVariabile(
    esito.valore.capitaleCent,
    esito.valore.anni,
    esito.valore.tassoVariabilePartenzaAnnuoBp,
    esito.valore.rataVariabileOggiCent,
    SCARTI_IPOTESI_TASSO_MUTUO.valoriBp,
  );

  return { stato: 'pronto', risultato: esito.valore, ipotesi };
}
