/**
 * UI — agente ui-builder. Possiede app/src/ui/ in esclusiva.
 * Non contiene testo letterale: ogni stringa passa da testi.ts,
 * così il guardrail ha un punto unico da controllare.
 * Nessuna chiamata di rete, nessun font remoto.
 *
 * Questo file è solo il guscio: legge la rotta dall'hash e mostra la
 * pagina corrispondente. Intestazione, navigazione e nota in fondo
 * restano fuori dal cambio di pagina, così non si spostano mai.
 *
 * Dalla funzionalità 14, è l'UNICO modulo dell'interfaccia che importa il
 * registro delle schermate (schermate/registro.ts): risolve la schermata
 * corrente una volta sola qui sotto, e ne passa il pezzo che serve a chi lo
 * usa — `componente` a `pagina()`, `passo` a `<Navigazione>` — invece di
 * far cercare anche a loro nel registro.
 */

import type { ReactElement } from 'react';
import { Home } from './Home.tsx';
import { Navigazione } from './Navigazione.tsx';
import { PaginaMacrocategoria } from './PaginaMacrocategoria.tsx';
import { useRotta, type Rotta } from './rotte.ts';
import type { DichiarazioneSchermata } from './schermate/tipi.ts';
import { trovaSchermata } from './schermate/registro.ts';
import { Testo } from './Testo.tsx';

/** Un solo ramo per «schermata»: risolve dal registro invece di elencare. */
function pagina(rotta: Rotta, schermata: DichiarazioneSchermata | undefined): ReactElement {
  switch (rotta.tipo) {
    case 'home':
      return <Home />;
    case 'macrocategoria':
      return <PaginaMacrocategoria id={rotta.id} />;
    case 'schermata': {
      if (schermata === undefined) return <Home />;
      const Componente = schermata.componente;
      return <Componente />;
    }
  }
}

export function App(): ReactElement {
  const rotta = useRotta();
  const schermata = rotta.tipo === 'schermata' ? trovaSchermata(rotta.id) : undefined;

  return (
    <div className="app">
      <header className="intestazione">
        <h1>
          <Testo chiave="appTitolo" />
        </h1>
        <p className="sottotitolo">
          <Testo chiave="appSottotitolo" />
        </p>
      </header>

      <Navigazione rotta={rotta} passo={schermata?.passo} />

      <main>{pagina(rotta, schermata)}</main>

      <footer className="pie">
        <Testo chiave="notaOffline" />
      </footer>
    </div>
  );
}
