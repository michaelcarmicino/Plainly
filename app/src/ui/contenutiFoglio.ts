/**
 * IL FACSIMILE DEL KID, DICHIARATO — agente ui-builder. Funzionalità 12.
 *
 * Le sei intestazioni, nell'ordine di legge. Tre sono apribili — rischi,
 * costi, tempo — perché sono le uniche a portare un contenuto (la riga dei
 * sette numeri, la spiegazione della percentuale, il tempo per cui il
 * prodotto è pensato per restare fermo). Le altre tre restano intestazioni ferme, per far vedere
 * l'ordine: aprirle non rivelerebbe niente che questa pagina possa dire.
 *
 * Nessun riquadro porta un valore: il facsimile non ha numeri, per scelta
 * dichiarata nella specifica (`docs/features/12-*.md`, sezione «Il facsimile
 * non ha numeri»).
 */

import type { ChiaveStringaUtente } from './testi.ts';

export interface RiquadroFoglio {
  readonly id: string;
  readonly etichetta: ChiaveStringaUtente;
  readonly apribile: boolean;
}

export const RIQUADRI_FOGLIO: readonly RiquadroFoglio[] = [
  { id: 'prodotto', etichetta: 'foglioRiquadroProdotto', apribile: false },
  { id: 'rischi', etichetta: 'foglioRiquadroRischi', apribile: true },
  { id: 'insolvenza', etichetta: 'foglioRiquadroInsolvenza', apribile: false },
  { id: 'costi', etichetta: 'foglioRiquadroCosti', apribile: true },
  { id: 'tempo', etichetta: 'foglioRiquadroTempo', apribile: true },
  { id: 'reclami', etichetta: 'foglioRiquadroReclami', apribile: false },
] as const;
