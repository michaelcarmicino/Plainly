/**
 * Rotte del sito — agente ui-builder.
 *
 * Via hash (`#/lavoro`) e non via history.pushState: il sito deve aprirsi
 * anche con un doppio clic su dist/index.html, cioè da file://, dove un
 * percorso vero non esiste. In più l'hash fa funzionare il tasto
 * «indietro» del browser, che per molte persone è l'unico che conoscono.
 *
 * `parseRotta` è pura: stessa stringa, stessa rotta, senza toccare il DOM.
 */

import { useSyncExternalStore } from 'react';
import { ID_AREE, type IdArea } from './contenutiHome.ts';

export type Rotta =
  | { readonly tipo: 'home' }
  | { readonly tipo: 'macrocategoria'; readonly id: IdArea }
  | { readonly tipo: 'lettura' }
  | { readonly tipo: 'valore-risparmi' }
  | { readonly tipo: 'fonti' };

export const PERCORSO_HOME = '#/';
export const PERCORSO_LETTURA = '#/lettura';

/**
 * «Da dove vengono i numeri di questo sito» (funzionalità 13). Ci si arriva
 * con un tocco solo da sotto ogni numero del sito — oggi da NotaTasso.tsx —
 * mai digitando un id: la pagina elenca tutte le righe del registro.
 */
export const PERCORSO_FONTI = '#/da-dove-vengono-i-numeri';

/**
 * La schermata dei risparmi fermi. Nell'indirizzo non finisce MAI la cifra
 * digitata: i due numeri vivono nello stato della pagina e basta. Un importo
 * nell'hash resterebbe nella cronologia del browser senza che nessuno lo
 * abbia deciso, e la pagina promette il contrario.
 */
export const PERCORSO_VALORE_RISPARMI = '#/valore-dei-risparmi';

export const percorsoArea = (id: IdArea): string => `#/${id}`;

/**
 * Qualunque valore non riconosciuto porta alla home: chi arriva con un
 * indirizzo storto vede una pagina che funziona, non un errore.
 */
export function parseRotta(hash: string): Rotta {
  const nome = hash.replace(/^#/, '').replace(/^\//, '');
  if (nome === 'lettura') return { tipo: 'lettura' };
  if (nome === 'valore-dei-risparmi') return { tipo: 'valore-risparmi' };
  if (nome === 'da-dove-vengono-i-numeri') return { tipo: 'fonti' };
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
