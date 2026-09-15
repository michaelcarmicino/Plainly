/**
 * DAL CODICE DEL CORE ALLA FRASE CHE SI LEGGE — agente ui-builder.
 * Funzionalità 10.
 *
 * Il core rifiuta un ingresso restituendo un CODICE, non una frase. Qui i due
 * mondi si toccano: la mappa è `Record<MotivoRifiutoMutuo, …>`, quindi
 * ESAUSTIVA per costruzione — il giorno in cui il core aggiunge un codice il
 * compilatore lo segnala invece di lasciare a schermo un riquadro muto.
 *
 * Le regole su che cosa è accettabile restano UNA SOLA, quella del core:
 * questo modulo interroga `motivoCapitale` / `motivoAnni` / `motivoTasso`
 * campo per campo, non riscrive i controlli.
 *
 * NOTA SUL PERIMETRO: importa da './rataMutuo.ts' e non da
 * '../core/index.ts', perché il barrel non riesporta ancora questo modulo
 * (fuori dal perimetro di questo intervento — vedi il rapporto di consegna).
 */

import {
  motivoAnni,
  motivoCapitale,
  motivoTasso,
  type MotivoRifiutoMutuo,
} from '../core/rataMutuo.ts';
import type { LetturaCampo } from './letturaCampi.ts';
import type { ChiaveStringaUtente } from './testi.ts';

export const TESTO_DEL_MOTIVO_MUTUO: Readonly<Record<MotivoRifiutoMutuo, ChiaveStringaUtente>> = {
  'capitale-non-leggibile': 'rataMutuoErroreCapitale',
  'capitale-a-zero': 'rataMutuoErroreCapitaleZero',
  'capitale-troppo-alto': 'rataMutuoErroreCapitaleAlto',
  'anni-non-interi': 'rataMutuoErroreAnni',
  'anni-fuori-intervallo': 'rataMutuoErroreAnniFuori',
  'tasso-non-leggibile': 'rataMutuoErroreTasso',
  'tasso-sotto-zero': 'rataMutuoErroreTasso',
  'tasso-troppo-alto': 'rataMutuoErroreTassoAlto',
};

export function motivoDelCapitale(lettura: LetturaCampo): MotivoRifiutoMutuo | null {
  return lettura.stato === 'letto' ? motivoCapitale(lettura.valore) : null;
}

export function motivoDegliAnniMutuo(lettura: LetturaCampo): MotivoRifiutoMutuo | null {
  return lettura.stato === 'letto' ? motivoAnni(lettura.valore) : null;
}

/** `lettura.valore` è in bp: la lettura del campo tasso arriva già moltiplicata per 100. */
export function motivoDelTasso(lettura: LetturaCampo): MotivoRifiutoMutuo | null {
  return lettura.stato === 'letto' ? motivoTasso(lettura.valore) : null;
}
