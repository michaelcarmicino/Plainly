/**
 * UI — agente ui-builder. Possiede app/src/ui/ in esclusiva.
 * Non contiene testo letterale: ogni stringa passa da testi.ts,
 * così il guardrail ha un punto unico da controllare.
 * Nessuna chiamata di rete, nessun font remoto.
 *
 * Questo file è solo il guscio: legge la rotta dall'hash e mostra la
 * pagina corrispondente. Intestazione, navigazione e nota in fondo
 * restano fuori dal cambio di pagina, così non si spostano mai.
 */

import type { ReactElement } from 'react';
import { Home } from './Home.tsx';
import { Navigazione } from './Navigazione.tsx';
import { PaginaFonti } from './PaginaFonti.tsx';
import { PaginaLettura } from './PaginaLettura.tsx';
import { PaginaMacrocategoria } from './PaginaMacrocategoria.tsx';
import { PaginaValoreRisparmi } from './PaginaValoreRisparmi.tsx';
import { useRotta, type Rotta } from './rotte.ts';
import { Testo } from './Testo.tsx';

function pagina(rotta: Rotta): ReactElement {
  switch (rotta.tipo) {
    case 'home':
      return <Home />;
    case 'macrocategoria':
      return <PaginaMacrocategoria id={rotta.id} />;
    case 'lettura':
      return <PaginaLettura />;
    case 'valore-risparmi':
      return <PaginaValoreRisparmi />;
    case 'fonti':
      return <PaginaFonti />;
  }
}

export function App(): ReactElement {
  const rotta = useRotta();

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

      <Navigazione rotta={rotta} />

      <main>{pagina(rotta)}</main>

      <footer className="pie">
        <Testo chiave="notaOffline" />
      </footer>
    </div>
  );
}
