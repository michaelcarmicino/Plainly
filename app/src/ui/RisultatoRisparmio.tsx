/**
 * IL RIQUADRO DEL RISULTATO — agente ui-builder.
 *
 * Esiste in tutti e tre i suoi momenti e occupa SEMPRE lo stesso spazio: da
 * vuoto, in attesa che i due numeri siano a posto, e con la cifra dentro.
 * Il calcolo è immediato e tutto locale — nessuna attesa, nessuna rotellina
 * che gira per un istante — ma lo spazio va riservato lo stesso, altrimenti
 * l'arrivo del numero spinge in basso quello che la persona stava leggendo.
 *
 * La cifra grande è la più grande della schermata: se i numeri sono tutti
 * uguali, chi guarda non sa dove posare l'occhio. E non compare mai da sola:
 * accanto c'è sempre il paragone su 100 €, che è lo stesso numero ridotto a
 * una banconota che tutti hanno avuto in mano.
 *
 * Nessun calcolo qui dentro: ogni numero arriva dal core già pronto, e
 * diventa parole solo attraverso formattaEuro.
 */

import type { ReactElement } from 'react';
import { formattaEuro, type RisultatoSimulazioneRisparmio } from '../core/index.ts';
import { TESTO_DEL_MOTIVO, type StatoRisultato } from './motiviRisparmio.ts';
import { Testo } from './Testo.tsx';
import type { ChiaveStringaUtente } from './testi.ts';

function CifraPronta({ r }: { r: RisultatoSimulazioneRisparmio }): ReactElement {
  const valori = {
    somma: formattaEuro(r.risparmioCent),
    anni: r.anni,
    valore: formattaEuro(r.valoreRealeCent),
    resto: formattaEuro(r.poterePerCentoEuroCent),
    perdita: formattaEuro(r.perditaCent),
  };

  return (
    <>
      <p className="risultato-etichetta">
        <Testo chiave="simulazioneRisparmioEtichettaValore" valori={valori} />
      </p>

      <p className="risultato-cifra cifra">{valori.valore}</p>

      <p className="risultato-frase">
        <Testo chiave="simulazioneRisparmioRisultato" valori={valori} />
      </p>

      <p className="risultato-paragone">
        <Testo chiave="simulazioneRisparmioParagone" valori={valori} />
      </p>

      <p className="risultato-differenza">
        <Testo
          chiave={
            r.perditaCent === 0
              ? 'simulazioneRisparmioPerditaNulla'
              : 'simulazioneRisparmioPerdita'
          }
          valori={valori}
        />
      </p>
    </>
  );
}

function chiaveDellAttesa(stato: StatoRisultato): ChiaveStringaUtente {
  if (stato.stato === 'in-sospeso' && stato.motivoDiPagina !== null) {
    return TESTO_DEL_MOTIVO[stato.motivoDiPagina];
  }
  return stato.stato === 'vuoto'
    ? 'simulazioneRisparmioVuoto'
    : 'simulazioneRisparmioInSospeso';
}

function InAttesa({ stato }: { stato: StatoRisultato }): ReactElement {
  return (
    <>
      <p className="risultato-attesa">
        <Testo chiave={chiaveDellAttesa(stato)} />
      </p>
      {/* La riga vuota in cui comparirà la cifra: nessuno zero e nessun
          numero inventato al posto del risultato, solo lo spazio che il
          risultato occuperà. Decorativa, quindi aria-hidden. */}
      <span className="risultato-segnaposto" aria-hidden="true" />
    </>
  );
}

export function RisultatoRisparmio({ stato }: { stato: StatoRisultato }): ReactElement {
  return (
    <div className="risultato" aria-live="polite">
      {stato.stato === 'pronto' ? (
        <CifraPronta r={stato.risultato} />
      ) : (
        <InAttesa stato={stato} />
      )}
    </div>
  );
}
