/**
 * IL CONTENITORE DELLE PAGINE DI SPIEGAZIONE — agente ui-builder.
 * Funzionalità 03.
 *
 * Monta gli otto blocchi dichiarati in contenutiSpiegazione.ts, sempre nello
 * stesso ordine: chi scrive un'istanza dichiara CHE COSA dire, questo file
 * decide COME e IN CHE ORDINE — in particolare che il blocco 3 (l'immagine
 * concreta) stampi sempre prima del blocco 4 (il nome tecnico). Un'istanza
 * non può invertirli: l'ordine non è nelle sue mani, lo impone solo questo
 * componente, verificabile sul markup reso — non sui campi di un oggetto,
 * che un ordine di stampa non ce l'ha.
 *
 * I blocchi 5 e 6 (il numero, la sua provenienza) sono affiancati in
 * BloccoEsempioSpiegazione.tsx per restare sotto le 150 righe. Nessun
 * calcolo qui dentro: il numero arriva già pronto da spiegazioneEsempio.ts,
 * che a sua volta lo chiede al core. Un ingresso fuori dai limiti non
 * produce un numero sbagliato né una pagina bianca: sostituisce i blocchi
 * 5-6 con l'unica riga condivisa spiegazioneEsempioNonDisponibile.
 *
 * Nessuna attesa: l'esempio è calcolato al primo disegno, senza I/O.
 */

import type { ReactElement } from 'react';
import { BloccoEsempio, BloccoFonte } from './BloccoEsempioSpiegazione.tsx';
import { AREE } from './contenutiHome.ts';
import type {
  PaginaSpiegazione as ContenutoSpiegazione,
  PassiSuccessivi,
} from './contenutiSpiegazione.ts';
import { calcolaEsempio } from './spiegazioneEsempio.ts';
import './stiliSpiegazione.css';
import { Testo } from './Testo.tsx';

/** Disegnata qui, non in icone.tsx: un solo uso, decorativa, mai sola. */
function FrecciaAvanti(): ReactElement {
  return (
    <svg
      className="icona-passo"
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 4.6 16 12l-7 7.4" />
    </svg>
  );
}

/** Blocco 7. Assente per davvero quando non c'è nessun rimando: non una
 *  sezione vuota, nessuna sezione. */
function BloccoPassi({ passi }: { passi: PassiSuccessivi }): ReactElement | null {
  if (passi.length === 0) return null;

  return (
    <section className="spiegazione-passi">
      <h3 className="limiti-titolo">
        <Testo chiave="spiegazioneTitoloPassi" />
      </h3>
      <ul className="elenco-passi">
        {passi.map((passo) => (
          <li key={passo.percorso}>
            <a className="passo-collegato" href={passo.percorso}>
              <FrecciaAvanti />
              <Testo chiave={passo.testo} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PaginaSpiegazione({
  contenuto,
}: {
  contenuto: ContenutoSpiegazione;
}): ReactElement {
  const area = AREE[contenuto.area];
  const esito = contenuto.esempio === null ? null : calcolaEsempio(contenuto.esempio);

  return (
    <div className="spiegazione">
      {/* Blocco 1: dove si è, prima di dire di che cosa si parla. */}
      <p className="occhiello">
        <Testo chiave={area.titolo} />
      </p>

      {/* Blocco 2: la stessa domanda dell'elenco, mai una sua variante. */}
      <h2 className="spiegazione-titolo">
        <Testo chiave={contenuto.domanda} />
      </h2>

      {/* Blocco 3: l'immagine concreta, sempre prima del nome tecnico. */}
      {contenuto.immagine.map((chiave) => (
        <p className="spiegazione-immagine" key={chiave}>
          <Testo chiave={chiave} />
        </p>
      ))}

      {/* Blocco 4: un solo nome tecnico, e solo dopo l'immagine qui sopra. */}
      {contenuto.nomeTecnico !== null && (
        <p className="spiegazione-nome-tecnico">
          <Testo chiave={contenuto.nomeTecnico} />
        </p>
      )}

      {contenuto.esempio !== null && esito !== null && (
        <>
          <BloccoEsempio esempio={contenuto.esempio} esito={esito} />
          <BloccoFonte esempio={contenuto.esempio} esito={esito} />
        </>
      )}

      <BloccoPassi passi={contenuto.passi} />

      {/* Blocco 8: i confini, sempre in fondo, sempre in rosa. */}
      <section className="limiti-schermata">
        <h3 className="limiti-titolo">
          <Testo chiave="spiegazioneTitoloNonFa" />
        </h3>
        <ul className="limiti spiegazione-non-fa">
          {contenuto.nonFa.map((chiave) => (
            <li key={chiave}>
              <Testo chiave={chiave} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
