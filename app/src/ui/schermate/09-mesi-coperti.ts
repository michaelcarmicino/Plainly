/**
 * LA SCHERMATA «PER QUANTI MESI BASTANO I SOLDI CHE HAI DA PARTE» —
 * dichiarazione per il registro. Funzionalità 14, schermata della 09
 * (src/ui/PaginaMesiCoperti.tsx).
 *
 * Via hash, come ogni percorso del sito: il sito deve aprirsi anche da
 * `file://`, dove un percorso vero non esiste. Le chiavi in `stringhe`
 * derivano da STRINGHE_MESI_COPERTI invece di essere ricopiate a mano, sul
 * modello già visto nella 07 e nella 13.
 *
 * `passo` diventa una chiave valida di STRINGHE_UTENTE solo dopo che
 * STRINGHE_MESI_COPERTI viene spread lì dentro (fuori dal perimetro di
 * questo agente): finché quello spread non è fatto, questo file non
 * compila da solo — è il punto di integrazione dichiarato nel mandato.
 */
import { PaginaMesiCoperti } from '../PaginaMesiCoperti.tsx';
import { STRINGHE_MESI_COPERTI } from '../testiMesiCoperti.ts';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'mesi-coperti',
  percorso: '#/quanti-mesi-bastano',
  componente: PaginaMesiCoperti,
  passo: 'mesiCopertiPasso',
  stringhe: Object.keys(STRINGHE_MESI_COPERTI),
} as const satisfies DichiarazioneSchermata;
