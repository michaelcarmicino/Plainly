/**
 * La pagina di una macrocategoria — agente ui-builder.
 *
 * Mostra il titolo dell'area e l'elenco completo delle sue domande, quella
 * della card compresa: è da lì che si vede da dove viene il numero del
 * badge (in «lavoro», sei domande meno quella già letta fa cinque). Stato
 * e percorso di ogni voce vengono dal catalogo dichiarato in
 * catalogoDomande.ts, non da una mappa dentro questo componente: i task
 * futuri cambieranno una riga del catalogo, non questo file.
 *
 * Le domande «con schermata» sono link veri, sottolineati — non da un
 * colore diverso, che al proiettore si distingue peggio di una riga sotto
 * la parola. Le altre restano testo, e sotto ognuna una riga dice A PAROLE
 * se la risposta arriverà o se il sito dichiara di non averla: leggibile
 * stando fermi, senza passare il mouse. Nessun semaforo di colore: il rosa
 * segna solo il limite dichiarato, non un giudizio sulla domanda.
 *
 * Stato «vuoto»: se in un'area nessuna voce ha ancora una schermata, una
 * riga in testa lo dice, e l'elenco compare comunque per intero.
 */

import type { ReactElement } from 'react';
import { domandeDiArea, type DomandaCatalogo } from './catalogoDomande.ts';
import { AREE, type IdArea } from './contenutiHome.ts';
import { Testo } from './Testo.tsx';

function VoceDomanda({ voce }: { voce: DomandaCatalogo }): ReactElement {
  switch (voce.stato) {
    case 'con-schermata':
      return (
        <a className="domanda-collegata" href={voce.percorso}>
          <Testo chiave={voce.chiave} />
        </a>
      );
    case 'in-arrivo':
      return (
        <>
          <p className="domanda-testo">
            <Testo chiave={voce.chiave} />
          </p>
          <p className="stato-domanda">
            <Testo chiave="domandaInArrivo" />
          </p>
        </>
      );
    case 'senza-fonte':
      return (
        <>
          <p className="domanda-testo">
            <Testo chiave={voce.chiave} />
          </p>
          <p className="stato-domanda stato-domanda-limite">
            <Testo chiave="domandaSenzaFonte" />
          </p>
        </>
      );
  }
}

export function PaginaMacrocategoria({ id }: { id: IdArea }): ReactElement {
  const area = AREE[id];
  const voci = domandeDiArea(id);
  const nessunaConSchermata = voci.every((voce) => voce.stato !== 'con-schermata');

  return (
    <section className="sezione">
      <h2>
        <Testo chiave={area.titolo} />
      </h2>

      {nessunaConSchermata && (
        <p className="placeholder">
          <Testo chiave="areaNessunaSchermata" />
        </p>
      )}

      <ul className="elenco-domande">
        {voci.map((voce) => (
          <li key={voce.chiave}>
            <VoceDomanda voce={voce} />
          </li>
        ))}
      </ul>
    </section>
  );
}
