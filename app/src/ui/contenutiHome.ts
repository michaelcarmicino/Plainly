/**
 * Contenuto redazionale della home — agente ui-builder.
 *
 * Qui stanno le AREE — icona, titolo, id — e la loro composizione: quali
 * domande, in che ordine, appartengono a ciascuna. Le domande stesse, con
 * il loro stato e l'eventuale percorso, sono dichiarate una volta sola in
 * catalogoDomande.ts: questo file filtra il catalogo per area, non
 * ridichiara la lista. Le parole vivono in testi.ts, il punto unico che il
 * guardrail scandisce.
 *
 * Il badge deriva il suo numero dalla lista invece di scriverlo a mano.
 * Nessun dato di dominio: la home non legge fixture e non chiama il core.
 */

import { CATALOGO_DOMANDE } from './catalogoDomande.ts';
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
   * La prima è la domanda stampata sulla card; tutte compaiono nella
   * pagina dell'area, nell'ordine dichiarato in catalogoDomande.ts. Tupla
   * non vuota: `domande[0]` esiste sempre.
   */
  readonly domande: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
}

/**
 * Le chiavi delle domande di un'area, filtrate dal catalogo e nel suo
 * stesso ordine. Il catalogo copre tutte e tre le aree con almeno una
 * voce ciascuna (18 = 5 + 6 + 7): se mai non fosse così sarebbe un
 * invariante rotto, non un caso da gestire a schermo — da qui l'eccezione
 * invece di un valore vuoto silenzioso.
 */
function chiaviDiArea(
  id: IdArea,
): readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]] {
  const [prima, ...resto] = CATALOGO_DOMANDE.filter(
    (voce) => voce.area === id,
  ).map((voce) => voce.chiave);
  if (prima === undefined) {
    throw new Error(`nessuna domanda di catalogo per l'area «${id}»`);
  }
  return [prima, ...resto];
}

export const AREE: Readonly<Record<IdArea, Area>> = {
  'costo-della-vita': {
    id: 'costo-della-vita',
    icona: 'carrello',
    titolo: 'area1Titolo',
    domande: chiaviDiArea('costo-della-vita'),
  },
  lavoro: {
    id: 'lavoro',
    icona: 'bustaPaga',
    titolo: 'area2Titolo',
    domande: chiaviDiArea('lavoro'),
  },
  futuro: {
    id: 'futuro',
    icona: 'salvadanaio',
    titolo: 'area3Titolo',
    domande: chiaviDiArea('futuro'),
  },
};

/** Le tre aree nell'ordine dichiarato in ID_AREE. */
export const AREE_IN_ORDINE: readonly Area[] = ID_AREE.map((id) => AREE[id]);

/**
 * Quante domande restano da scoprire entrando nell'area: la lista intera
 * meno quella già stampata sulla card.
 *
 * Con l'area «lavoro» a sei voci dichiarate: 6 − 1 = 5. Il numero si
 * deriva dalla lista, così non può mentire quando la lista cambia.
 */
export function contaAltreDomande(id: IdArea): number {
  return AREE[id].domande.length - 1;
}
