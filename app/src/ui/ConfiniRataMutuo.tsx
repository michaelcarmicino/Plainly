/**
 * DA DOVE VENGONO I NUMERI, E CHE COSA QUESTA PAGINA NON FA — agente
 * ui-builder. Funzionalità 10.
 *
 * Due sezioni separate: la provenienza dei tassi e il confine di TAN/TAEG
 * a corpo pieno (mai rosa — il rosa è riservato alla sezione dei limiti),
 * poi il blocco dei limiti, in rosa, l'unico punto della pagina in cui il
 * rosa compare.
 */

import type { ReactElement } from 'react';
import { Testo } from './Testo.tsx';

export function ConfiniRataMutuo(): ReactElement {
  return (
    <>
      <section className="provenienza-mutuo">
        <p className="provenienza-riga">
          <Testo chiave="rataMutuoTassiScrittiDaTe" />
        </p>
        <p className="provenienza-riga">
          <Testo chiave="rataMutuoTanNonTaeg" />
        </p>
        <p className="provenienza-riga nota-avvertenza">
          <Testo chiave="rataMutuoAvvertenza" />
        </p>
      </section>

      <section className="limiti-mutuo">
        <h3 className="limiti-mutuo-titolo">
          <Testo chiave="rataMutuoLimitiTitolo" />
        </h3>
        <ul className="limiti-mutuo-elenco">
          <li>
            <Testo chiave="rataMutuoLimiteNessunaIndicazione" />
          </li>
          <li>
            <Testo chiave="rataMutuoLimiteNessunTotale" />
          </li>
          <li>
            <Testo chiave="rataMutuoLimiteNessunaPrevisione" />
          </li>
          <li>
            <Testo chiave="rataMutuoLimiteDati" />
          </li>
        </ul>
      </section>
    </>
  );
}
