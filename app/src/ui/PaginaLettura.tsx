/**
 * La lettura del documento — agente ui-builder.
 *
 * È il contenuto che prima stava in App.tsx, spostato qui intatto quando
 * la home è diventata la schermata d'ingresso: adesso App.tsx è il guscio
 * che instrada, e questa è una delle destinazioni.
 *
 * Nessun testo letterale: ogni stringa passa da testi.ts e da <Testo>.
 */

import type { ReactElement, ReactNode } from 'react';
import { Testo } from './Testo.tsx';
import type { ChiaveStringaUtente } from './testi.ts';

function Sezione({
  titolo,
  children,
}: {
  titolo: ChiaveStringaUtente;
  children?: ReactNode;
}): ReactElement {
  return (
    <section className="sezione">
      <h2>
        <Testo chiave={titolo} />
      </h2>
      {children ?? (
        <p className="placeholder">
          <Testo chiave="statoPlaceholder" />
        </p>
      )}
    </section>
  );
}

export function PaginaLettura(): ReactElement {
  return (
    <div className="lettura">
      {/* TODO(scenario): il documento arriva da app/fixtures/ una volta
          congelato lo scenario. Il core espone calcolaLettura(). */}
      <Sezione titolo="sezioneDocumento" />
      <Sezione titolo="sezioneLettura" />
      <Sezione titolo="sezioneVerifica">
        <p>
          <Testo chiave="verificaIntro" />
        </p>
      </Sezione>

      <Sezione titolo="sezioneLimiti">
        <ul className="limiti">
          <li>
            <Testo chiave="limiteNoConsulenza" />
          </li>
          <li>
            <Testo chiave="limiteNoParsing" />
          </li>
          <li>
            <Testo chiave="limiteCampione" />
          </li>
        </ul>
      </Sezione>
    </div>
  );
}
