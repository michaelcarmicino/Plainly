/**
 * LA SCHERMATA «BOLLETTA» — dichiarazione per il registro. Funzionalità 05,
 * schermata in src/ui/PaginaBolletta.tsx.
 *
 * Il catalogo delle domande (catalogoDomande.ts) segna oggi `area1Domanda`
 * come «in-arrivo», senza percorso: collegarla è una modifica a un file di
 * un altro perimetro di lavoro in corso, non fatta qui — vedi il rapporto
 * di consegna di questa funzionalità. Il percorso qui sotto è comunque
 * raggiungibile da subito scrivendolo nella barra dell'indirizzo.
 */
import { PaginaBolletta } from '../PaginaBolletta.tsx';
import { STRINGHE_BOLLETTA } from '../testiBolletta.ts';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'bolletta',
  percorso: '#/perche-la-bolletta-e-alta',
  componente: PaginaBolletta,
  passo: 'bollettaPasso',
  stringhe: Object.keys(STRINGHE_BOLLETTA),
} as const satisfies DichiarazioneSchermata;
