/**
 * La card di una macrocategoria — agente ui-builder.
 *
 * Un solo componente per tutte e tre le aree, con le STESSE classi: nessuna
 * variante «in evidenza», nessun colore diverso. Chi arriva con un'ansia
 * sul terzo tema non deve sentirsi in coda.
 *
 * Tutta la card è il bersaglio del click, non un bottoncino interno da
 * centrare. I due rettangoli dietro sono decorazione: `aria-hidden`, senza
 * href e senza tabindex, quindi non ricevono mai il focus da tastiera.
 * A riposo si legge già tutto: l'hover aggiunge movimento, non contenuto —
 * il numero delle altre domande è scritto nel badge, in parole.
 */

import type { ReactElement } from 'react';
import { contaAltreDomande, type Area } from './contenutiHome.ts';
import { Icona } from './icone.tsx';
import { percorsoArea } from './rotte.ts';
import { Testo } from './Testo.tsx';

export function CardMacrocategoria({ area }: { area: Area }): ReactElement {
  return (
    <a className="card-area" href={percorsoArea(area.id)}>
      <span className="card-pila" aria-hidden="true" />
      <span className="card-pila card-pila-due" aria-hidden="true" />

      <div className="card-fronte">
        <div className="card-testata">
          <Icona nome={area.icona} />
          <h2 className="card-titolo">
            <Testo chiave={area.titolo} />
          </h2>
        </div>

        <p className="card-domanda">
          <Testo chiave={area.domande[0]} />
        </p>

        <p className="card-badge">
          <Testo chiave="areaBadge" valori={{ n: contaAltreDomande(area.id) }} />
        </p>
      </div>
    </a>
  );
}
