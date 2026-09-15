/**
 * Navigazione — agente ui-builder.
 *
 * Sta nello stesso punto di ogni pagina, con la stessa dimensione: chi si
 * perde ritrova la strada dove l'ha lasciata, senza doverla cercare.
 * «Pagina iniziale» è sempre il primo bottone, così non si sposta mai;
 * «Indietro» compare accanto solo dove un passo precedente esiste davvero —
 * sulla prima pagina non c'è, e un bottone spento si spiega peggio di un
 * bottone assente.
 *
 * Il percorso dice DOVE SI È, non dove si può andare: nessun gradino è
 * cliccabile, nemmeno il primo. Così verso la pagina iniziale resta un
 * solo bersaglio, sempre nello stesso punto, invece di due etichette
 * identiche di cui una risponde al click e l'altra no. Per lo stesso
 * motivo sulla prima pagina il percorso non si stampa affatto: un percorso
 * di un gradino solo non è un percorso.
 *
 * Dalla funzionalità 14, `passoCorrente` non conosce più le singole
 * schermate registrate: per `rotta.tipo === 'schermata'` legge `passo`,
 * già risolto una volta da App.tsx tramite il registro. I rami `home` e
 * `macrocategoria` restano qui, invariati.
 */

import type { ReactElement } from 'react';
import { AREE } from './contenutiHome.ts';
import { Icona } from './icone.tsx';
import { PERCORSO_HOME } from './percorsi.ts';
import { tornaIndietro, type Rotta } from './rotte.ts';
import './stiliNavigazione.css';
import { Testo } from './Testo.tsx';
import { t, type ChiaveStringaUtente } from './testi.ts';

/** Il gradino finale del percorso: dove ci si trova adesso. */
function passoCorrente(
  rotta: Rotta,
  passoSchermata: ChiaveStringaUtente | undefined,
): ChiaveStringaUtente | undefined {
  switch (rotta.tipo) {
    case 'home':
      return undefined;
    case 'macrocategoria':
      return AREE[rotta.id].titolo;
    case 'schermata':
      return passoSchermata;
  }
}

export function Navigazione({
  rotta,
  passo,
}: {
  rotta: Rotta;
  passo?: ChiaveStringaUtente;
}): ReactElement {
  const corrente = passoCorrente(rotta, passo);

  return (
    <div className="barra-navigazione">
      <div className="barra-azioni">
        <a className="bottone-nav" href={PERCORSO_HOME}>
          <Icona nome="casa" />
          <Testo chiave="navHome" />
        </a>
        {corrente !== undefined && (
          <button className="bottone-nav" type="button" onClick={tornaIndietro}>
            <Icona nome="frecciaIndietro" />
            <Testo chiave="navIndietro" />
          </button>
        )}
      </div>

      {corrente !== undefined && (
        <nav className="percorso-navigazione" aria-label={t('navPercorso')}>
          <ol className="percorso">
            <li>
              <Testo chiave="navHome" />
            </li>
            <li>
              <span aria-current="page">
                <Testo chiave={corrente} />
              </span>
            </li>
          </ol>
        </nav>
      )}
    </div>
  );
}
