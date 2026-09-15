/**
 * LE DUE RATE, UNA ACCANTO ALL'ALTRA — agente ui-builder. Funzionalità 10.
 *
 * Le due cifre sono identiche nella forma: stessa dimensione, stesso colore,
 * stesso peso, nello stesso riquadro con lo stesso bordo. La loro posizione
 * segue l'ordine dei campi (fermo, poi mobile), non un giudizio. NESSUN
 * rosa qui: il rosa è il colore di ciò che il prodotto non fa, e sta solo
 * nel blocco dei limiti in fondo alla pagina.
 *
 * Esiste in tre momenti — vuoto, in sospeso, pronto — e il riquadro occupa
 * già il suo spazio da vuoto: il calcolo è immediato e locale, ma se lo
 * spazio non fosse riservato l'arrivo delle due cifre sposterebbe in basso
 * la scala delle ipotesi e i limiti.
 *
 * Nessun calcolo qui dentro: ogni numero arriva già pronto da
 * confrontaRateMutuo, e diventa parole solo attraverso formattaEuro.
 */

import type { ReactElement } from 'react';
import { formattaEuro } from '../core/formatoIt.ts';
import type { RisultatoConfrontoRateMutuo } from '../core/confrontoRateMutuo.ts';
import type { StatoRataMutuo } from './statoRataMutuo.ts';
import { Testo } from './Testo.tsx';

function RataSingola({
  etichetta,
  rataCent,
  mesi,
}: {
  etichetta: 'rataMutuoEtichettaRataFerma' | 'rataMutuoEtichettaRataMobile';
  rataCent: number;
  mesi: number;
}): ReactElement {
  return (
    <div className="rata-riquadro">
      <p className="rata-etichetta">
        <Testo chiave={etichetta} />
      </p>
      <p className="rata-cifra cifra">{formattaEuro(rataCent)}</p>
      <p className="rata-durata">
        <Testo chiave="rataMutuoRataAlMese" valori={{ rata: formattaEuro(rataCent), mesi }} />
      </p>
    </div>
  );
}

function Differenza({ r }: { r: RisultatoConfrontoRateMutuo }): ReactElement {
  const valori = {
    differenza: formattaEuro(Math.abs(r.differenzaMensileCent)),
    differenzaAnnua: formattaEuro(Math.abs(r.differenzaSu12MesiCent)),
  };
  return (
    <div className="rata-differenza">
      {r.differenzaMensileCent === 0 ? (
        <p className="differenza-frase">
          <Testo chiave="rataMutuoDifferenzaNulla" />
        </p>
      ) : (
        <>
          <p className="differenza-frase">
            <Testo chiave="rataMutuoDifferenzaMensile" valori={valori} />
          </p>
          <p className="differenza-frase">
            <Testo chiave="rataMutuoDifferenzaAnnua" valori={valori} />
          </p>
        </>
      )}
      <p className="differenza-nota">
        <Testo chiave="rataMutuoDifferenzaATassoFermo" />
      </p>
    </div>
  );
}

function InAttesa({ stato }: { stato: 'vuoto' | 'in-sospeso' }): ReactElement {
  return (
    <div className="rate-affiancate rate-in-attesa">
      <p className="rata-attesa">
        <Testo chiave={stato === 'vuoto' ? 'rataMutuoVuoto' : 'rataMutuoInSospeso'} />
      </p>
      <span className="rata-segnaposto" aria-hidden="true" />
    </div>
  );
}

export function RateAffiancate({ stato }: { stato: StatoRataMutuo }): ReactElement {
  if (stato.stato !== 'pronto') {
    return <InAttesa stato={stato.stato} />;
  }

  const { risultato } = stato;
  return (
    <div className="risultato-mutuo" aria-live="polite">
      <div className="rate-affiancate">
        <RataSingola
          etichetta="rataMutuoEtichettaRataFerma"
          rataCent={risultato.rataFissaCent}
          mesi={risultato.mesi}
        />
        <RataSingola
          etichetta="rataMutuoEtichettaRataMobile"
          rataCent={risultato.rataVariabileOggiCent}
          mesi={risultato.mesi}
        />
      </div>
      <Differenza r={risultato} />
    </div>
  );
}
