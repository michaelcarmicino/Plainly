/**
 * LA SCHERMATA «LETTURA» — dichiarazione per il registro. Funzionalità 14.
 *
 * Introdotta dalla 01 (src/ui/PaginaLettura.tsx) prima che esistesse questo
 * registro: qui viene solo dichiarata, nessun contenuto cambia. Non compare
 * fra «le due schermate esistenti» che la spec 14 usa come banco di prova
 * (07 e 13), ma senza questa dichiarazione «lettura» resterebbe un quarto
 * ramo a mano nello switch di App.tsx — esattamente ciò che la funzionalità
 * elimina per le altre due, quindi va tolto anche qui.
 */
import { PaginaLettura } from '../PaginaLettura.tsx';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'lettura',
  percorso: '#/lettura',
  componente: PaginaLettura,
  passo: 'sezioneLettura',
  stringhe: ['sezioneLettura'],
} as const satisfies DichiarazioneSchermata;
