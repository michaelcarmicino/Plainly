/**
 * LA SCHERMATA «LA RATA DEL MUTUO» — dichiarazione per il registro.
 * Funzionalità 14, schermata della 10 (src/ui/PaginaRataMutuo.tsx).
 *
 * Segue lo stesso schema di 07-valore-risparmi.ts: le chiavi in `stringhe`
 * derivano da STRINGHE_RATA_MUTUO invece di essere ricopiate a mano.
 *
 * BLOCCO DA SCIOGLIERE (segnalato nel rapporto di consegna): finché
 * STRINGHE_RATA_MUTUO non entra con lo spread in src/ui/testi.ts, `passo`
 * qui sotto non è un `ChiaveStringaUtente` valido e questo file — come
 * PaginaRataMutuo.tsx e i suoi componenti — non compila. Manca una riga
 * sola in testi.ts, fuori dal perimetro di questo intervento.
 */
import { PaginaRataMutuo } from '../PaginaRataMutuo.tsx';
import { STRINGHE_RATA_MUTUO } from '../testiRataMutuo.ts';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'rata-mutuo',
  percorso: '#/rata-del-mutuo',
  componente: PaginaRataMutuo,
  passo: 'rataMutuoPasso',
  stringhe: Object.keys(STRINGHE_RATA_MUTUO),
} as const satisfies DichiarazioneSchermata;
