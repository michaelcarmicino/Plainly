/**
 * La home: tre porte — agente ui-builder.
 *
 * Nessun numero di dominio, nessuna fixture, nessuna chiamata al core.
 * L'unico numero a schermo è quello del badge, che conta domande e non euro.
 *
 * Le tre card escono dallo stesso componente e dalla stessa lista: hanno
 * per costruzione lo stesso peso visivo, perché non c'è un punto in cui
 * una di loro possa ricevere una classe che le altre non hanno.
 */

import type { ReactElement } from 'react';
import { CardMacrocategoria } from './CardMacrocategoria.tsx';
import { AREE_IN_ORDINE } from './contenutiHome.ts';
import { PERCORSO_LETTURA } from './percorsi.ts';
import './stiliHome.css';
import { Testo } from './Testo.tsx';

export function Home(): ReactElement {
  return (
    <div className="home">
      <p className="home-intestazione">
        <Testo chiave="homeIntestazione" />
      </p>

      <ul className="griglia-aree">
        {AREE_IN_ORDINE.map((area) => (
          <li key={area.id}>
            <CardMacrocategoria area={area} />
          </li>
        ))}
      </ul>

      <p className="accesso-rapido">
        <a className="bottone-nav" href={PERCORSO_LETTURA}>
          <Testo chiave="homeAccessoRapido" />
        </a>
      </p>
    </div>
  );
}
