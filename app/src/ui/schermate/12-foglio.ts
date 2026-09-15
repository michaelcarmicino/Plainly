/**
 * LA SCHERMATA «IL FOGLIO PRIMA DI FIRMARE» — dichiarazione per il registro.
 * Funzionalità 14, schermata della 12 (src/ui/PaginaFoglio.tsx).
 *
 * `percorso` non ha una seconda copia da tenere allineata altrove — a
 * differenza della 07 e della 13 — perché niente fuori da questa schermata
 * (nessun `NotaTasso`-simile) deve linkarci senza passare dal registro.
 *
 * NOTA TECNICA (vedi `docs/features/12-guida-al-foglio-prima-di-firmare.md`,
 * sezione «Previsto»): la spec tecnica prevede una riga in `rotte.ts` e in
 * `App.tsx`. Dalla funzionalità 14 questa istruzione è superata: bastano
 * questo file e lo spread di `STRINGHE_FOGLIO` in `testi.ts` (quest'ultimo
 * FUORI dal perimetro assegnato a questo intervento — vedi il rapporto).
 */
import { PaginaFoglio } from '../PaginaFoglio.tsx';
import { STRINGHE_FOGLIO } from '../testiFoglio.ts';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'foglio-prima-di-firmare',
  percorso: '#/foglio-prima-di-firmare',
  componente: PaginaFoglio,
  passo: 'foglioPasso',
  stringhe: Object.keys(STRINGHE_FOGLIO),
} as const satisfies DichiarazioneSchermata;
