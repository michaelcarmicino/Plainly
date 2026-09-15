/**
 * I BLOCCHI 5 E 6 DI UNA PAGINA DI SPIEGAZIONE — agente ui-builder.
 * Funzionalità 03. Affiancato a PaginaSpiegazione.tsx per restare sotto le
 * 150 righe: due componenti, non un file solo con il contenitore intero.
 *
 * Blocco 5 (il numero e il suo paragone) e blocco 6 (da dove viene) sono due
 * elementi separati — come RisultatoRisparmio e NotaTasso nella 07 — ma
 * condividono lo stesso `esito`, calcolato una sola volta dal chiamante:
 * nessuno dei due lo ricalcola.
 *
 * Se il core rifiuta l'ingresso (`esito.ok === false`), il blocco 5 mostra
 * la riga condivisa `spiegazioneEsempioNonDisponibile` al posto del numero,
 * e il blocco 6 non compare affatto: non c'è una provenienza da dichiarare
 * per un numero che non esiste.
 */

import type { ReactElement } from 'react';
import type { EsempioNumerico } from './contenutiSpiegazione.ts';
import type { EsitoEsempio } from './spiegazioneEsempio.ts';
import { Testo } from './Testo.tsx';

export function BloccoEsempio({
  esempio,
  esito,
}: {
  esempio: EsempioNumerico;
  esito: EsitoEsempio;
}): ReactElement {
  if (!esito.ok) {
    return (
      <section className="spiegazione-esempio">
        <h3 className="limiti-titolo">
          <Testo chiave="spiegazioneTitoloEsempio" />
        </h3>
        <p className="spiegazione-esempio-frase">
          <Testo chiave="spiegazioneEsempioNonDisponibile" />
        </p>
      </section>
    );
  }

  return (
    <section className="spiegazione-esempio">
      <h3 className="limiti-titolo">
        <Testo chiave="spiegazioneTitoloEsempio" />
      </h3>
      <p className="spiegazione-cifra cifra">{esito.valori.valore}</p>
      <p className="spiegazione-esempio-frase">
        <Testo chiave={esempio.frase} valori={esito.valori} />
      </p>
      <p className="spiegazione-esempio-paragone">
        <Testo chiave={esempio.paragone} valori={esito.valori} />
      </p>
    </section>
  );
}

export function BloccoFonte({
  esempio,
  esito,
}: {
  esempio: EsempioNumerico;
  esito: EsitoEsempio;
}): ReactElement | null {
  if (!esito.ok) return null;

  return (
    <div className="spiegazione-fonte">
      <h3 className="limiti-titolo">
        <Testo chiave="spiegazioneTitoloFonte" />
      </h3>
      <p className="nota-riga">
        <Testo chiave={esempio.fonte} valori={esito.valori} />
      </p>
      {esito.periodoMancante && (
        <p className="nota-riga">
          <Testo chiave="simulazioneRisparmioPeriodoMancante" valori={esito.valori} />
        </p>
      )}
      <p className="nota-riga">
        <Testo chiave={esempio.avvertenza} />
      </p>
    </div>
  );
}
