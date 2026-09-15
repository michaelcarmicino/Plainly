/**
 * Rotte del sito — agente ui-builder.
 *
 * Via hash (`#/lavoro`) e non via history.pushState: il sito deve aprirsi
 * anche con un doppio clic su dist/index.html, cioè da file://, dove un
 * percorso vero non esiste. In più l'hash fa funzionare il tasto
 * «indietro» del browser, che per molte persone è l'unico che conoscono.
 *
 * `parseRotta` è pura: stessa stringa, stessa rotta, senza toccare il DOM.
 *
 * Dalla funzionalità 14 (docs/features/14-registro-delle-schermate.md) le
 * schermate non sono più elencate qui a mano: `parseRotta` cerca il
 * percorso nel registro (schermate/registro.ts), che le raccoglie da
 * schermate/*.ts. Questo file può importare il registro — che importa i
 * componenti — solo perché le costanti di percorso che i componenti usano
 * vivono ora in percorsi.ts, un modulo foglia che non importa questo file:
 * altrimenti si richiuderebbe il ciclo rotte.ts → registro → componente →
 * rotte.ts descritto nella sezione 6 della specifica.
 */

import { useSyncExternalStore } from 'react';
import { ID_AREE, type IdArea } from './contenutiHome.ts';
import { PERCORSO_HOME } from './percorsi.ts';
import { trovaSchermataPerPercorso } from './schermate/registro.ts';

export type Rotta =
  | { readonly tipo: 'home' }
  | { readonly tipo: 'macrocategoria'; readonly id: IdArea }
  | { readonly tipo: 'schermata'; readonly id: string };

/**
 * Tenuta qui solo per compatibilità con tests/catalogo.test.ts, che la
 * confronta col percorso duplicato in catalogoDomande.ts. Deve restare
 * identica al campo `percorso` dichiarato per la schermata 07 nel registro
 * (src/ui/schermate/).
 */
export const PERCORSO_VALORE_RISPARMI = '#/valore-dei-risparmi';

/**
 * Qualunque valore non riconosciuto porta alla home: chi arriva con un
 * indirizzo storto vede una pagina che funziona, non un errore.
 */
export function parseRotta(hash: string): Rotta {
  const nome = hash.replace(/^#/, '').replace(/^\//, '');
  const schermata = trovaSchermataPerPercorso(`#/${nome}`);
  if (schermata !== undefined) return { tipo: 'schermata', id: schermata.id };
  const area = ID_AREE.find((id) => id === nome);
  if (area !== undefined) return { tipo: 'macrocategoria', id: area };
  return { tipo: 'home' };
}

const sottoscrivi = (aCambiamento: () => void): (() => void) => {
  window.addEventListener('hashchange', aCambiamento);
  return () => window.removeEventListener('hashchange', aCambiamento);
};

const hashCorrente = (): string => window.location.hash;

/** Fuori dal browser (test, render statico) si parte dalla home. */
const hashIniziale = (): string => PERCORSO_HOME;

export function useRotta(): Rotta {
  const hash = useSyncExternalStore(sottoscrivi, hashCorrente, hashIniziale);
  return parseRotta(hash);
}

/**
 * «Indietro» ripercorre la strada fatta dal browser. Se la pagina è stata
 * aperta direttamente su un'area non c'è un passo precedente: si torna
 * alla home, che è il livello sopra.
 */
export function tornaIndietro(): void {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.hash = PERCORSO_HOME;
}
