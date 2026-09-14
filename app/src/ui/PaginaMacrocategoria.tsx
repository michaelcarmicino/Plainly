/**
 * La pagina di una macrocategoria — agente ui-builder.
 *
 * Mostra il titolo dell'area e l'elenco completo delle sue domande, quella
 * della card compresa: è da lì che si vede da dove viene il numero del
 * badge (quattro domande, meno quella già letta, fa tre).
 *
 * Le domande che hanno già una schermata dietro sono link veri; le altre
 * restano testo, e sotto di loro la nota dice che il contenuto non c'è
 * ancora. Un elenco onesto vale più di link che non portano da nessuna
 * parte: il confine fra le due categorie si vede senza passare il mouse e
 * senza distinguere un colore, perché il link è sottolineato.
 */

import type { ReactElement } from 'react';
import { AREE, type IdArea } from './contenutiHome.ts';
import { PERCORSO_VALORE_RISPARMI } from './rotte.ts';
import { Testo } from './Testo.tsx';
import type { ChiaveStringaUtente } from './testi.ts';

/** La domanda che questa schermata risponde, e l'indirizzo che ci porta. */
const SCHERMATA_DELLA_DOMANDA: Partial<Record<ChiaveStringaUtente, string>> = {
  area3Altra3: PERCORSO_VALORE_RISPARMI,
};

function VoceDomanda({ chiave }: { chiave: ChiaveStringaUtente }): ReactElement {
  const percorso = SCHERMATA_DELLA_DOMANDA[chiave];
  if (percorso === undefined) {
    return <Testo chiave={chiave} />;
  }
  return (
    <a className="domanda-collegata" href={percorso}>
      <Testo chiave={chiave} />
    </a>
  );
}

export function PaginaMacrocategoria({ id }: { id: IdArea }): ReactElement {
  const area = AREE[id];
  const inCostruzione = area.domande.some(
    (chiave) => SCHERMATA_DELLA_DOMANDA[chiave] === undefined,
  );

  return (
    <section className="sezione">
      <h2>
        <Testo chiave={area.titolo} />
      </h2>

      <ul className="elenco-domande">
        {area.domande.map((chiave) => (
          <li key={chiave}>
            <VoceDomanda chiave={chiave} />
          </li>
        ))}
      </ul>

      {inCostruzione && (
        <p className="placeholder">
          <Testo chiave="statoPlaceholder" />
        </p>
      )}
    </section>
  );
}
