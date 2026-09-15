/**
 * IL RIQUADRO DEL RISULTATO — la percentuale tradotta in euro. Agente
 * ui-builder. Funzionalità 12. Isolato da PaginaFoglio.tsx per restare
 * sotto le 150 righe per file (standard-codice.md).
 *
 * Esiste in entrambi i suoi momenti — vuoto e pronto — e occupa SEMPRE lo
 * stesso spazio (vedi `.foglio-risultato` in stiliFoglio.css): il calcolo
 * è immediato, ma se lo spazio non fosse riservato l'arrivo della cifra
 * spingerebbe in basso il blocco dei limiti.
 *
 * Non esiste un terzo stato «in sospeso»: ogni motivo di rifiuto del core è
 * attribuibile a un campo preciso (vedi motiviFoglio.ts), quindi un dato
 * rifiutato riporta semplicemente questo riquadro allo stato vuoto — mai una
 * cifra calcolata su un numero che il core ha respinto.
 *
 * Il numero grande è l'anno: esatto. Il mese è dichiarato per quello che è,
 * l'anno diviso dodici arrotondato al centesimo — mai moltiplicato di nuovo
 * per dodici a schermo, perché non ricomporrebbe sempre l'anno.
 */

import type { ReactElement } from 'react';
import { formattaEuro, formattaPercentuale } from '../core/formatoIt.ts';
import type { RisultatoCostoFoglio } from '../core/costoFoglio.ts';
import type { StatoRisultatoFoglio } from './motiviFoglio.ts';
import { Testo } from './Testo.tsx';

function FoglioCifraPronta({ r }: { r: RisultatoCostoFoglio }): ReactElement {
  const valori = {
    percentuale: formattaPercentuale(r.costoAnnuoBp),
    capitale: formattaEuro(r.capitaleCent),
    annoValore: formattaEuro(r.costoAnnuoCent),
    meseValore: formattaEuro(r.costoMensileCent),
    perCento: formattaEuro(r.costoPerCentoEuroCent),
  };

  return (
    <>
      <p className="foglio-risultato-cifra cifra">{valori.annoValore}</p>
      <p className="foglio-risultato-frase">
        <Testo chiave="foglioRisultatoAnno" valori={valori} />
      </p>
      <p className="foglio-risultato-mese">
        <Testo chiave="foglioRisultatoMese" valori={valori} />
      </p>
      <p className="foglio-risultato-paragone">
        <Testo chiave="foglioParagoneCento" valori={valori} />
      </p>
      <p className="foglio-risultato-nota">
        <Testo chiave="foglioNotaArrotondamento" />
      </p>
    </>
  );
}

export function RisultatoFoglio({ stato }: { stato: StatoRisultatoFoglio }): ReactElement {
  return (
    <div className="foglio-risultato" aria-live="polite">
      {stato.stato === 'pronto' ? (
        <FoglioCifraPronta r={stato.risultato} />
      ) : (
        <>
          <p className="foglio-risultato-attesa">
            <Testo chiave="foglioVuoto" />
          </p>
          {/* Decorativa: lo spazio in cui comparirà la cifra, mai un numero
              inventato. aria-hidden perché non porta informazione. */}
          <span className="foglio-risultato-segnaposto" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
