/**
 * LA SCHERMATA «VALORE DEI RISPARMI» — dichiarazione per il registro.
 * Funzionalità 14, schermata della 07 (src/ui/PaginaValoreRisparmi.tsx).
 *
 * `percorso` deve restare identico a PERCORSO_VALORE_RISPARMI in rotte.ts
 * (tenuta lì solo per compatibilità con un test già verde) e al letterale
 * duplicato in catalogoDomande.ts (PERCORSO_SCHERMATA_RISPARMI, per evitare
 * un import circolare). Le chiavi in `stringhe` derivano da
 * STRINGHE_SIMULAZIONE invece di essere ricopiate a mano: se qualcuno
 * dimentica lo spread in testi.ts, il test del registro lo trova da solo,
 * senza che questa lista debba essere tenuta aggiornata a parte.
 */
import { PaginaValoreRisparmi } from '../PaginaValoreRisparmi.tsx';
import { STRINGHE_SIMULAZIONE } from '../testiSimulazione.ts';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'valore-risparmi',
  percorso: '#/valore-dei-risparmi',
  componente: PaginaValoreRisparmi,
  passo: 'simulazioneRisparmioPasso',
  stringhe: Object.keys(STRINGHE_SIMULAZIONE),
} as const satisfies DichiarazioneSchermata;
