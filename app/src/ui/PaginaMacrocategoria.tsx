/**
 * La pagina di una macrocategoria — agente ui-builder.
 *
 * Mostra il titolo dell'area e l'elenco completo delle sue domande, quella
 * della card compresa: è da lì che si vede da dove viene il numero del
 * badge (quattro domande, meno quella già letta, fa tre).
 *
 * Le domande non sono ancora link: sotto l'elenco compare la nota che il
 * contenuto è in costruzione. Un elenco onesto vale più di tre link che
 * non portano da nessuna parte.
 */

import type { ReactElement } from 'react';
import { AREE, type IdArea } from './contenutiHome.ts';
import { Testo } from './Testo.tsx';

export function PaginaMacrocategoria({ id }: { id: IdArea }): ReactElement {
  const area = AREE[id];

  return (
    <section className="sezione">
      <h2>
        <Testo chiave={area.titolo} />
      </h2>

      <ul className="elenco-domande">
        {area.domande.map((chiave) => (
          <li key={chiave}>
            <Testo chiave={chiave} />
          </li>
        ))}
      </ul>

      <p className="placeholder">
        <Testo chiave="statoPlaceholder" />
      </p>
    </section>
  );
}
