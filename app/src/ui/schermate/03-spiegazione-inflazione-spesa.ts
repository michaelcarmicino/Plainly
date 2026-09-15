/**
 * LA SCHERMATA «SPIEGAZIONE: INFLAZIONE SULLA SPESA» — dichiarazione per il
 * registro. Funzionalità 03, istanza di riferimento del contenitore
 * riusabile (src/ui/PaginaSpiegazione.tsx).
 *
 * `componente` resta senza props, come il registro richiede: questo file
 * chiude l'istanza dichiarata su ciò che il contenitore si aspetta, con
 * `createElement` invece del JSX — che questo modulo, `.ts` e non `.tsx`,
 * non può contenere (lo stesso vincolo, e la stessa via d'uscita, già presi
 * da tests/home.test.ts).
 *
 * `passo` è la STESSA chiave di `domanda`: la specifica vieta una seconda
 * formulazione del titolo nel percorso di navigazione.
 *
 * Ogni pagina di spiegazione futura (11, 12, …) aggiunge un file gemello a
 * questo, mai una modifica qui dentro.
 */
import { createElement } from 'react';
import { ISTANZA_INFLAZIONE_SPESA } from '../contenutiSpiegazione.ts';
import { PaginaSpiegazione } from '../PaginaSpiegazione.tsx';
import { STRINGHE_SPIEGAZIONE } from '../testiSpiegazione.ts';
import type { DichiarazioneSchermata } from './tipi.ts';

export const SCHERMATA = {
  id: 'inflazione-spesa',
  percorso: '#/spiegazione/inflazione-spesa',
  componente: () => createElement(PaginaSpiegazione, { contenuto: ISTANZA_INFLAZIONE_SPESA }),
  passo: 'area1Altra1',
  stringhe: Object.keys(STRINGHE_SPIEGAZIONE),
} as const satisfies DichiarazioneSchermata;
