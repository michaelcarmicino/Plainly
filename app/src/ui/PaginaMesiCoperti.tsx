/**
 * PER QUANTI MESI BASTANO I SOLDI CHE HAI DA PARTE — agente ui-builder.
 * Funzionalità 09.
 *
 * Un concetto solo per schermata: si scrivono due numeri, ne esce uno. La
 * variante conforme di un task che nominava un obiettivo invece di una
 * misura — vedi docs/features/09-mesi-coperti-dai-risparmi.md — quindi
 * qui non compare mai quel nome, nessuna soglia sul risultato, nessun
 * semaforo di giudizio: solo il conto, e come rifarlo a mano.
 *
 * I due campi sono due pezzi di stato separati e nessuno dei due viene mai
 * svuotato dall'altro. Niente viene salvato fuori da questa pagina — né
 * nell'indirizzo, né altrove — e niente si azzera da solo mentre la
 * persona ci pensa su. I due valori sopravvivono a un giro fuori e ritorno
 * (il modulo resta caricato, App.tsx smonta e rimonta il componente), non a
 * un vero ricaricamento — sul modello di PaginaValoreRisparmi.tsx.
 *
 * Nessun numero viene calcolato qui dentro: la schermata legge quello che è
 * stato scritto, lo passa al core (mesiCoperti) e ne stampa la risposta.
 * Le due CSS importate sono già quelle della 07: generiche a ogni
 * simulazione a due campi del sito (.campi, .campo, .risultato, .limiti…),
 * riusate qui invece di essere riscritte.
 */

import { useState, type ReactElement } from 'react';
import { formattaEuro } from '../core/formatoIt.ts';
import { RISPARMI_MAX_CENT, SPESE_MENSILI_MAX_CENT, SPESE_MENSILI_MIN_CENT } from '../core/mesiCoperti.ts';
import { CampoNumerico, type MessaggioCampo } from './CampoNumerico.tsx';
import { decimaliOltreIlCentesimo, leggiSomma, type LetturaCampo } from './letturaCampi.ts';
import {
  motivoDeiRisparmi,
  motivoDelleSpese,
  statoRisultato,
  TESTO_DEL_MOTIVO,
  type StatoRisultato,
} from './motiviMesiCoperti.ts';
import { fraseDurata, testoScomposizione } from './testoDurataMesiCoperti.ts';
import './stiliRisultato.css';
import './stiliSimulazione.css';
import { Testo } from './Testo.tsx';

const VALORI_SPESE_BASSE = { minimo: formattaEuro(SPESE_MENSILI_MIN_CENT) };
const VALORI_SPESE_ALTE = { massimo: formattaEuro(SPESE_MENSILI_MAX_CENT) };
const VALORI_RISPARMI_ALTI = { massimo: formattaEuro(RISPARMI_MAX_CENT) };

function messaggioSpese(lettura: LetturaCampo, testo: string): MessaggioCampo | undefined {
  const motivo = motivoDelleSpese(lettura);
  if (motivo !== null) {
    const valori =
      motivo === 'spese-sotto-soglia' ? VALORI_SPESE_BASSE : motivo === 'spese-sopra-soglia' ? VALORI_SPESE_ALTE : undefined;
    return { chiave: TESTO_DEL_MOTIVO[motivo], valori, tono: 'errore' };
  }
  if (lettura.stato === 'letto' && decimaliOltreIlCentesimo(testo)) {
    return { chiave: 'mesiCopertiNotaCentesimi', valori: { valore: formattaEuro(lettura.valore) }, tono: 'nota' };
  }
  return undefined;
}

function messaggioRisparmi(lettura: LetturaCampo, testo: string): MessaggioCampo | undefined {
  const motivo = motivoDeiRisparmi(lettura);
  if (motivo !== null) {
    const valori = motivo === 'risparmi-sopra-soglia' ? VALORI_RISPARMI_ALTI : undefined;
    return { chiave: TESTO_DEL_MOTIVO[motivo], valori, tono: 'errore' };
  }
  if (lettura.stato === 'letto' && decimaliOltreIlCentesimo(testo)) {
    return { chiave: 'mesiCopertiNotaCentesimi', valori: { valore: formattaEuro(lettura.valore) }, tono: 'nota' };
  }
  return undefined;
}

function RiquadroRisultato({ stato }: { stato: StatoRisultato }): ReactElement {
  if (stato.stato !== 'pronto') {
    return (
      <div className="risultato" aria-live="polite">
        <p className="risultato-attesa">
          <Testo chiave={stato.stato === 'vuoto' ? 'mesiCopertiVuoto' : 'mesiCopertiInSospeso'} />
        </p>
        <span className="risultato-segnaposto" aria-hidden="true" />
      </div>
    );
  }

  const durata = fraseDurata(stato.risultato);
  const scomposizione = testoScomposizione(stato.risultato);

  return (
    <div className="risultato" aria-live="polite">
      <p className="risultato-etichetta">
        <Testo chiave="mesiCopertiEtichettaValore" />
      </p>
      <p className="risultato-cifra cifra">
        <Testo chiave={durata.chiave} valori={durata.valori} />
      </p>
      <p className="risultato-frase">
        <Testo chiave="mesiCopertiIpotesi" />
      </p>
      {scomposizione !== null && (
        <p className="risultato-paragone">
          <Testo chiave={scomposizione.chiave} valori={scomposizione.valori} />
        </p>
      )}
      <p className="risultato-differenza">
        <Testo chiave="mesiCopertiConvenzioneGiorni" />
      </p>
    </div>
  );
}

/** Sopravvivono a un giro fuori e ritorno; non a un ricaricamento vero. */
let ultimeSpeseScritte = '';
let ultimiRisparmiScritti = '';

export function PaginaMesiCoperti(): ReactElement {
  const [spese, setSpeseStato] = useState(ultimeSpeseScritte);
  const [risparmi, setRisparmiStato] = useState(ultimiRisparmiScritti);

  const setSpese = (testo: string): void => {
    ultimeSpeseScritte = testo;
    setSpeseStato(testo);
  };
  const setRisparmi = (testo: string): void => {
    ultimiRisparmiScritti = testo;
    setRisparmiStato(testo);
  };

  const letturaSpese = leggiSomma(spese);
  const letturaRisparmi = leggiSomma(risparmi);

  return (
    <div className="simulazione">
      <p className="occhiello">
        <Testo chiave="mesiCopertiOcchiello" />
      </p>
      <h2 className="simulazione-titolo">
        <Testo chiave="mesiCopertiTitolo" />
      </h2>
      <p className="simulazione-intro">
        <Testo chiave="mesiCopertiIntro" />
      </p>

      <div className="campi">
        <CampoNumerico
          id="campo-spese"
          etichetta="mesiCopertiEtichettaSpese"
          aiuto="mesiCopertiAiutoSpese"
          esempio="mesiCopertiEsempioSpese"
          testo={spese}
          messaggio={messaggioSpese(letturaSpese, spese)}
          modoTastiera="decimal"
          aCambio={setSpese}
        />
        <CampoNumerico
          id="campo-risparmi"
          etichetta="mesiCopertiEtichettaRisparmi"
          aiuto="mesiCopertiAiutoRisparmi"
          esempio="mesiCopertiEsempioRisparmi"
          testo={risparmi}
          messaggio={messaggioRisparmi(letturaRisparmi, risparmi)}
          modoTastiera="decimal"
          aCambio={setRisparmi}
        />
      </div>

      <RiquadroRisultato stato={statoRisultato(letturaSpese, letturaRisparmi)} />

      <p className="nota-riga">
        <Testo chiave="mesiCopertiNessunaFonte" />
      </p>
      <p className="nota-riga nota-avvertenza">
        <Testo chiave="mesiCopertiAvvertenza" />
      </p>

      <section className="limiti-schermata">
        <h3 className="limiti-titolo">
          <Testo chiave="mesiCopertiLimitiTitolo" />
        </h3>
        <ul className="limiti">
          <li>
            <Testo chiave="mesiCopertiLimiteSoglia" />
          </li>
          <li>
            <Testo chiave="mesiCopertiLimiteAzione" />
          </li>
          <li>
            <Testo chiave="mesiCopertiLimiteDati" />
          </li>
        </ul>
      </section>
    </div>
  );
}
