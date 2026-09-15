/**
 * LA RATA DEL MUTUO, LE DUE AFFIANCATE — agente ui-builder. Funzionalità 10.
 *
 * «Fisso o variabile: quanto rischio?» era la domanda «quale delle due
 * prendere», e questa pagina esiste per non risponderle: mostra le due rate
 * accanto, con la loro differenza, e si ferma lì. Vedi docs/features/10-*.md
 * per il perché del titolo riscritto.
 *
 * I quattro campi sono quattro pezzi di stato separati — come in
 * PaginaValoreRisparmi.tsx — e sopravvivono a un giro fuori e ritorno (mai a
 * un ricaricamento vero): nessuno dei quattro si svuota perché un altro è
 * sbagliato.
 *
 * Nessun numero è calcolato qui dentro: la schermata legge quello che è
 * stato scritto, lo passa al core (per percorso diretto, non dal barrel —
 * vedi il rapporto di consegna) e ne stampa la risposta. CampiRataMutuo,
 * RateAffiancate, ScalaIpotesiMutuo e ConfiniRataMutuo sono file separati
 * solo per restare entro le 150 righe: la pagina resta UN concetto solo.
 */

import { useState, type ReactElement } from 'react';
import { CampiRataMutuo } from './CampiRataMutuo.tsx';
import { ConfiniRataMutuo } from './ConfiniRataMutuo.tsx';
import { leggiAnni, leggiSomma } from './letturaCampi.ts';
import { RateAffiancate } from './RateAffiancate.tsx';
import { ScalaIpotesiMutuo } from './ScalaIpotesiMutuo.tsx';
import { statoRataMutuo } from './statoRataMutuo.ts';
import './stiliIpotesiMutuo.css';
import './stiliRataMutuo.css';
import './stiliRisultato.css';
import './stiliSimulazione.css';
import { Testo } from './Testo.tsx';

/** Sopravvivono a un giro fuori e ritorno; non a un ricaricamento vero. */
let ultimoCapitaleScritto = '';
let ultimiAnniScritti = '';
let ultimoTassoFermoScritto = '';
let ultimoTassoMobileScritto = '';

export function PaginaRataMutuo(): ReactElement {
  const [capitale, setCapitaleStato] = useState(ultimoCapitaleScritto);
  const [anni, setAnniStato] = useState(ultimiAnniScritti);
  const [tassoFermo, setTassoFermoStato] = useState(ultimoTassoFermoScritto);
  const [tassoMobile, setTassoMobileStato] = useState(ultimoTassoMobileScritto);

  const setCapitale = (v: string): void => {
    ultimoCapitaleScritto = v;
    setCapitaleStato(v);
  };
  const setAnni = (v: string): void => {
    ultimiAnniScritti = v;
    setAnniStato(v);
  };
  const setTassoFermo = (v: string): void => {
    ultimoTassoFermoScritto = v;
    setTassoFermoStato(v);
  };
  const setTassoMobile = (v: string): void => {
    ultimoTassoMobileScritto = v;
    setTassoMobileStato(v);
  };

  const letturaCapitale = leggiSomma(capitale);
  const letturaAnni = leggiAnni(anni);
  const letturaTassoFermo = leggiSomma(tassoFermo);
  const letturaTassoMobile = leggiSomma(tassoMobile);

  const stato = statoRataMutuo(letturaCapitale, letturaAnni, letturaTassoFermo, letturaTassoMobile);

  return (
    <div className="rata-mutuo">
      <p className="occhiello">
        <Testo chiave="rataMutuoOcchiello" />
      </p>
      <h2 className="simulazione-titolo">
        <Testo chiave="rataMutuoTitolo" />
      </h2>
      <p className="simulazione-intro">
        <Testo chiave="rataMutuoIntro" />
      </p>

      <CampiRataMutuo
        capitale={capitale}
        anni={anni}
        tassoFermo={tassoFermo}
        tassoMobile={tassoMobile}
        letturaCapitale={letturaCapitale}
        letturaAnni={letturaAnni}
        letturaTassoFermo={letturaTassoFermo}
        letturaTassoMobile={letturaTassoMobile}
        aCambioCapitale={setCapitale}
        aCambioAnni={setAnni}
        aCambioTassoFermo={setTassoFermo}
        aCambioTassoMobile={setTassoMobile}
      />

      <RateAffiancate stato={stato} />

      {stato.stato === 'pronto' && <ScalaIpotesiMutuo ipotesi={stato.ipotesi} />}

      <ConfiniRataMutuo />
    </div>
  );
}
