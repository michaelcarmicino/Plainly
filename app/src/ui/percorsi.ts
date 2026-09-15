/**
 * COSTANTI DI PERCORSO — modulo foglia, agente ui-builder. Funzionalità 14.
 *
 * Le usano i componenti che costruiscono un href: Home.tsx, CardMacrocategoria.tsx,
 * NotaTasso.tsx. Foglia per costruzione — non importa rotte.ts né il
 * registro — ed è per questo che NotaTasso.tsx (dentro la schermata 07) può
 * importarla senza chiudere il ciclo
 *   rotte.ts → registro.ts → 07-valore-risparmi.ts → PaginaValoreRisparmi.tsx
 *   → NotaTasso.tsx → rotte.ts
 * descritto in docs/features/14-registro-delle-schermate.md (sezione 6): un
 * ciclo fra moduli ESM non esplode, lascia una costante `undefined` all'ora
 * giusta — un `href` vuoto, nessun errore. rotte.ts, che ora importa il
 * registro per `parseRotta`, resta l'unico a poterlo fare perché nessun
 * componente della catena del registro dipende più da lui.
 *
 * PERCORSO_FONTI duplica il percorso dichiarato in schermate/13-fonti.ts,
 * per lo stesso motivo per cui catalogoDomande.ts duplica quello della 07
 * (PERCORSO_SCHERMATA_RISPARMI): le due stringhe possono divergere in
 * silenzio, e un test (in tests/, non di questo agente) le confronta.
 */

import type { IdArea } from './contenutiHome.ts';

export const PERCORSO_HOME = '#/';
export const PERCORSO_LETTURA = '#/lettura';
export const PERCORSO_FONTI = '#/da-dove-vengono-i-numeri';

export const percorsoArea = (id: IdArea): string => `#/${id}`;
