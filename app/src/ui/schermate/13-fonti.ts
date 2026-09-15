/**
 * LA SCHERMATA «FONTI» — dichiarazione per il registro. Funzionalità 14,
 * schermata della 13 (src/ui/PaginaFonti.tsx).
 *
 * `percorso` deve restare identico a PERCORSO_FONTI in percorsi.ts, la sola
 * copia rimasta per evitare l'import circolare descritto in
 * docs/features/14-registro-delle-schermate.md (sezione 6): NotaTasso.tsx,
 * dentro la 07, non può importare questo registro. Le chiavi in `stringhe`
 * derivano da STRINGHE_FONTI per lo stesso motivo della 07.
 */
import { PaginaFonti } from '../PaginaFonti.tsx';
import { STRINGHE_FONTI } from '../testiFonti.ts';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'fonti',
  percorso: '#/da-dove-vengono-i-numeri',
  componente: PaginaFonti,
  passo: 'fontiPasso',
  stringhe: Object.keys(STRINGHE_FONTI),
} as const satisfies DichiarazioneSchermata;
