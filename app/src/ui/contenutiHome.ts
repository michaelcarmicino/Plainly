/**
 * Contenuto redazionale della home — agente ui-builder.
 *
 * Qui stanno solo le CHIAVI: le parole vivono in testi.ts, che resta il
 * punto unico che il guardrail scandisce. Questo file dichiara come sono
 * organizzate — quale domanda sta sulla card, quali stanno dentro l'area,
 * in che ordine — e deriva il numero del badge dalla lista invece di
 * scriverlo a mano.
 *
 * Nessun dato di dominio: la home non legge fixture e non chiama il core.
 */

import type { NomeIcona } from './icone.tsx';
import type { ChiaveStringaUtente } from './testi.ts';

/** L'ordine è quello in cui le card compaiono: è una scelta dichiarata. */
export const ID_AREE = ['costo-della-vita', 'lavoro', 'futuro'] as const;

export type IdArea = (typeof ID_AREE)[number];

export interface Area {
  readonly id: IdArea;
  readonly icona: NomeIcona;
  readonly titolo: ChiaveStringaUtente;
  /**
   * La prima è la domanda stampata sulla card; tutte e quattro compaiono
   * nella pagina dell'area. Tupla non vuota: `domande[0]` esiste sempre.
   */
  readonly domande: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
}

export const AREE: Readonly<Record<IdArea, Area>> = {
  'costo-della-vita': {
    id: 'costo-della-vita',
    icona: 'carrello',
    titolo: 'area1Titolo',
    domande: ['area1Domanda', 'area1Altra1', 'area1Altra2', 'area1Altra3'],
  },
  lavoro: {
    id: 'lavoro',
    icona: 'bustaPaga',
    titolo: 'area2Titolo',
    domande: ['area2Domanda', 'area2Altra1', 'area2Altra2', 'area2Altra3'],
  },
  futuro: {
    id: 'futuro',
    icona: 'salvadanaio',
    titolo: 'area3Titolo',
    domande: ['area3Domanda', 'area3Altra1', 'area3Altra2', 'area3Altra3'],
  },
};

/** Le tre aree nell'ordine dichiarato in ID_AREE. */
export const AREE_IN_ORDINE: readonly Area[] = ID_AREE.map((id) => AREE[id]);

/**
 * Quante domande restano da scoprire entrando nell'area: la lista intera
 * meno quella già stampata sulla card.
 *
 * Con quattro domande dichiarate: 4 − 1 = 3. Il numero si deriva dalla
 * lista, così non può mentire quando la lista cambia.
 */
export function contaAltreDomande(id: IdArea): number {
  return AREE[id].domande.length - 1;
}
