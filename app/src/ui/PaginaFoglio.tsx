/**
 * IL FOGLIO CHE TI DANNO PRIMA DI FIRMARE — agente ui-builder. Funzionalità 12.
 *
 * Un concetto solo: una percentuale letta su un foglio, tradotta in euro. Il
 * facsimile è la mappa per trovarla — vuoto apposta, senza numeri — e il
 * traduttore è la risposta. Il riquadro del risultato e il contenuto dei
 * riquadri apribili stanno in due file affiancati (RisultatoFoglio.tsx,
 * RiquadroContenutoFoglio.tsx) per restare sotto le 150 righe.
 *
 * I due campi sopravvivono a un giro fuori e ritorno (stesso schema di
 * PaginaValoreRisparmi.tsx), non a un ricaricamento vero: niente indirizzo,
 * niente disco, nessun limite di tempo per pensarci su.
 *
 * Nessun calcolo qui dentro: la schermata legge il testo digitato, lo passa
 * al core tramite motiviFoglio.ts e ne stampa la risposta già pronta.
 */

import { useState, type ReactElement } from 'react';
import { CampoNumerico } from './CampoNumerico.tsx';
import { RIQUADRI_FOGLIO } from './contenutiFoglio.ts';
import { leggiSomma } from './letturaCampi.ts';
import { messaggioImporto, messaggioPercentuale, statoRisultatoFoglio } from './motiviFoglio.ts';
import { RigaDocumento } from './RigaDocumento.tsx';
import { RiquadroContenutoFoglio } from './RiquadroContenutoFoglio.tsx';
import { RisultatoFoglio } from './RisultatoFoglio.tsx';
import './stiliSimulazione.css';
import './stiliFoglio.css';
import { Testo } from './Testo.tsx';

/** Sopravvivono a un giro fuori e ritorno; non a un ricaricamento vero. */
let ultimaPercentualeScritta = '';
let ultimoImportoScritto = '';
let ultimiAperti: ReadonlySet<string> = new Set();

export function PaginaFoglio(): ReactElement {
  const [percentuale, setPercentualeStato] = useState(ultimaPercentualeScritta);
  const [importo, setImportoStato] = useState(ultimoImportoScritto);
  const [aperti, setApertiStato] = useState(ultimiAperti);

  const setPercentuale = (testo: string): void => {
    ultimaPercentualeScritta = testo;
    setPercentualeStato(testo);
  };
  const setImporto = (testo: string): void => {
    ultimoImportoScritto = testo;
    setImportoStato(testo);
  };
  const commuta = (id: string): void => {
    const successivo = new Set(aperti);
    if (successivo.has(id)) {
      successivo.delete(id);
    } else {
      successivo.add(id);
    }
    ultimiAperti = successivo;
    setApertiStato(successivo);
  };

  const letturaPercentuale = leggiSomma(percentuale);
  const letturaImporto = leggiSomma(importo);
  const stato = statoRisultatoFoglio(letturaPercentuale, letturaImporto);

  return (
    <div className="foglio">
      <p className="occhiello">
        <Testo chiave="foglioOcchiello" />
      </p>
      <h2 className="simulazione-titolo">
        <Testo chiave="foglioTitolo" />
      </h2>
      <p className="simulazione-intro">
        <Testo chiave="foglioApertura" /> <Testo chiave="foglioOrdineFisso" />
      </p>

      <div className="foglio-facsimile">
        {RIQUADRI_FOGLIO.map((riquadro) => (
          <RigaDocumento
            key={riquadro.id}
            id={`foglio-riquadro-${riquadro.id}`}
            etichetta={riquadro.etichetta}
            apribile={riquadro.apribile}
            aperto={aperti.has(riquadro.id)}
            onToggle={() => commuta(riquadro.id)}
          >
            <RiquadroContenutoFoglio id={riquadro.id} />
          </RigaDocumento>
        ))}
      </div>
      <p className="foglio-facsimile-nota">
        <Testo chiave="foglioFacsimileVuoto" />
      </p>

      <div className="campi">
        <CampoNumerico
          id="campo-percentuale"
          etichetta="foglioEtichettaPercentuale"
          aiuto="foglioAiutoPercentuale"
          esempio="foglioEsempioPercentuale"
          testo={percentuale}
          messaggio={messaggioPercentuale(letturaPercentuale)}
          modoTastiera="decimal"
          aCambio={setPercentuale}
        />
        <CampoNumerico
          id="campo-importo"
          etichetta="foglioEtichettaImporto"
          aiuto="foglioAiutoImporto"
          esempio="foglioEsempioImporto"
          testo={importo}
          messaggio={messaggioImporto(letturaImporto)}
          modoTastiera="decimal"
          aCambio={setImporto}
        />
      </div>

      <RisultatoFoglio stato={stato} />

      <p className="foglio-fonte">
        <Testo chiave="foglioFonteNorma" />
      </p>

      <section className="limiti-schermata">
        <h3 className="limiti-titolo">
          <Testo chiave="foglioLimitiTitolo" />
        </h3>
        <ul className="limiti foglio-non-fa">
          <li>
            <Testo chiave="foglioNonFa1" />
          </li>
          <li>
            <Testo chiave="foglioNonFa2" />
          </li>
          <li>
            <Testo chiave="foglioNonFa3" />
          </li>
        </ul>
      </section>
    </div>
  );
}
