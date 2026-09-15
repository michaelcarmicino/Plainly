/**
 * IL CATALOGO DELLE DICIOTTO DOMANDE — agente ui-builder.
 *
 * Un dato dichiarato, non calcolato: qui sta SOLO la struttura — quale
 * domanda, di quale area, con quale stato, con quale percorso se esiste.
 * Le parole restano in testi.ts / testiCatalogo.ts, il registro unico che
 * il guardrail scandisce; contenutiHome.ts filtra questo elenco per area
 * invece di ridichiarare le domande.
 *
 * Tre stati, uno solo per voce:
 *   con-schermata  la risposta c'è ed è raggiungibile con un percorso vero
 *   in-arrivo      la risposta è prevista, la schermata non c'è ancora
 *   senza-fonte    rispondere richiederebbe un dato che nessuna fonte
 *                  dichiarata dà, o una previsione sulla persona che
 *                  legge: il sito lo dice invece di indovinare
 *
 * L'unione discriminata qui sotto lega `percorso` a `stato: 'con-schermata'`
 * nel tipo stesso: una voce «in arrivo» con un percorso scritto per errore
 * non supererebbe la compilazione, non solo un test lanciato più tardi.
 *
 * Le voci sono già nell'ordine di stampa di ciascuna area: la prima di
 * ogni gruppo è la domanda che compare sulla card. Nessuna voce
 * «senza fonte» è la prima della propria area.
 */

import type { IdArea } from './contenutiHome.ts';
import type { ChiaveStringaUtente } from './testi.ts';

export type StatoDomanda = 'con-schermata' | 'in-arrivo' | 'senza-fonte';

interface VoceBase {
  readonly chiave: ChiaveStringaUtente;
  readonly area: IdArea;
}

export type DomandaCatalogo =
  | (VoceBase & { readonly stato: 'con-schermata'; readonly percorso: string })
  | (VoceBase & { readonly stato: 'in-arrivo' })
  | (VoceBase & { readonly stato: 'senza-fonte' });

/**
 * Il percorso della schermata 07 (i risparmi fermi). Scritto qui come
 * stringa letterale e NON importato da rotte.ts, per non creare un import
 * circolare: rotte.ts dipende da IdArea — quindi, tramite contenutiHome.ts,
 * da questo stesso file — e questo file non può allora dipendere da
 * rotte.ts. Deve restare identico a PERCORSO_VALORE_RISPARMI in rotte.ts;
 * un percorso storto qui non passerebbe inosservato: è la voce con
 * `stato: 'con-schermata'`, l'unica che diventa un link vero a schermo.
 */
const PERCORSO_SCHERMATA_RISPARMI = '#/valore-dei-risparmi';

export const CATALOGO_DOMANDE: readonly DomandaCatalogo[] = [
  // --- Il costo della vita — 5 ---------------------------------------------
  { chiave: 'area1Domanda', area: 'costo-della-vita', stato: 'in-arrivo' },
  { chiave: 'area1Altra1', area: 'costo-della-vita', stato: 'in-arrivo' },
  { chiave: 'area1Altra2', area: 'costo-della-vita', stato: 'in-arrivo' },
  { chiave: 'area1Altra3', area: 'costo-della-vita', stato: 'in-arrivo' },
  { chiave: 'area1Altra4', area: 'costo-della-vita', stato: 'in-arrivo' },

  // --- Il lavoro — 6 --------------------------------------------------------
  // La card passa a area2Altra1: area2Domanda scende in fondo, riscritta e
  // «senza fonte» — nessuna fonte dichiarata dà un rischio per settore, ed
  // è comunque una previsione sulla persona che legge.
  { chiave: 'area2Altra1', area: 'lavoro', stato: 'in-arrivo' },
  { chiave: 'area2Altra2', area: 'lavoro', stato: 'in-arrivo' },
  { chiave: 'area2Altra3', area: 'lavoro', stato: 'in-arrivo' },
  { chiave: 'area2Altra4', area: 'lavoro', stato: 'in-arrivo' },
  { chiave: 'area2Altra5', area: 'lavoro', stato: 'in-arrivo' },
  { chiave: 'area2Domanda', area: 'lavoro', stato: 'senza-fonte' },

  // --- Il futuro — 7 ----------------------------------------------------------
  { chiave: 'area3Domanda', area: 'futuro', stato: 'in-arrivo' },
  { chiave: 'area3Altra1', area: 'futuro', stato: 'in-arrivo' },
  { chiave: 'area3Altra2', area: 'futuro', stato: 'in-arrivo' },
  {
    chiave: 'area3Altra3',
    area: 'futuro',
    stato: 'con-schermata',
    percorso: PERCORSO_SCHERMATA_RISPARMI,
  },
  { chiave: 'area3Altra4', area: 'futuro', stato: 'in-arrivo' },
  { chiave: 'area3Altra5', area: 'futuro', stato: 'in-arrivo' },
  { chiave: 'area3Altra6', area: 'futuro', stato: 'in-arrivo' },
];

/** Le voci di un'area, filtrate dal catalogo e nel suo stesso ordine. */
export function domandeDiArea(id: IdArea): readonly DomandaCatalogo[] {
  return CATALOGO_DOMANDE.filter((voce) => voce.area === id);
}
