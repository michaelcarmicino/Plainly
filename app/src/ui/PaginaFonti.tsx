/**
 * DA DOVE VENGONO I NUMERI DI QUESTO SITO — agente ui-builder. Funzionalità 13.
 *
 * Una riga per numero, non una griglia a sei colonne: il concetto della
 * pagina è uno solo. La lista degli id viene dal registro stesso, non da un
 * elenco scritto qui dentro — così nessuna riga vera resta nascosta solo
 * perché questo file non la conosce ancora.
 *
 * Oggi il registro ha una riga sola e la sua provenienza è incompleta: la
 * pagina lo dice in chiaro invece di ometterlo, con `righeConProvenienzaIncompleta`
 * — mai contando o confrontando a mano. È il punto per cui questa pagina
 * esiste: una cifra che chi legge non può controllare è indistinguibile da
 * una inventata, e qui si preferisce dichiarare il buco.
 *
 * Nessuna attesa: il registro è una costante compilata dentro la pagina,
 * quindi le righe compaiono già pronte, senza un caricamento che le sostituisca
 * un istante dopo.
 */

import type { ReactElement } from 'react';
import { REGISTRO_FONTI, righeConProvenienzaIncompleta } from '../core/index.ts';
import { RigaRegistroFonte } from './RigaRegistroFonte.tsx';
import './stiliFonti.css';
import { Testo } from './Testo.tsx';

export function PaginaFonti(): ReactElement {
  const ids = REGISTRO_FONTI.map((riga) => riga.id);
  const daCompletare = righeConProvenienzaIncompleta(REGISTRO_FONTI);
  const tutteDaCompletare = ids.length > 0 && daCompletare.length === ids.length;

  return (
    <div className="fonti">
      <p className="occhiello">
        <Testo chiave="fontiOcchiello" />
      </p>
      <h2 className="fonti-titolo">
        <Testo chiave="fontiTitolo" />
      </h2>
      <p className="fonti-intro">
        <Testo chiave="fontiIntro" />
      </p>
      <p className="fonti-nota">
        <Testo chiave="fontiAggiornamentoManuale" />
      </p>

      {tutteDaCompletare && (
        <p className="fonti-banner">
          <Testo chiave="fontiNessunaCompleta" />
        </p>
      )}

      {ids.length === 0 ? (
        <p className="fonti-vuoto">
          <Testo chiave="fontiVuoto" />
        </p>
      ) : (
        <ul className="elenco-fonti">
          {ids.map((id) => (
            <li key={id}>
              <RigaRegistroFonte id={id} />
            </li>
          ))}
        </ul>
      )}

      <section className="limiti-schermata">
        <h3 className="limiti-titolo">
          <Testo chiave="fontiLimitiTitolo" />
        </h3>
        <ul className="limiti">
          <li>
            <Testo chiave="fontiLimiteAggiornamento" />
          </li>
        </ul>
      </section>
    </div>
  );
}
