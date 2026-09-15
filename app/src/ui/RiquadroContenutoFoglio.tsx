/**
 * IL CONTENUTO DEI TRE RIQUADRI APRIBILI DEL FACSIMILE — agente ui-builder.
 * Funzionalità 12. Isolato da PaginaFoglio.tsx per restare sotto le 150
 * righe per file (standard-codice.md).
 *
 * Le altre tre intestazioni («Cos'è questo prodotto?», l'insolvenza, i
 * reclami) non hanno contenuto: sono intestazioni ferme, per far vedere
 * l'ordine di legge, e `RigaDocumento` le rende senza bottone.
 */

import type { ReactElement } from 'react';
import { Testo } from './Testo.tsx';

export function RiquadroContenutoFoglio({ id }: { id: string }): ReactElement | null {
  if (id === 'rischi') {
    return (
      <>
        {/* La riga dei sette numeri: TESTO, non un'immagine — leggibile da
            uno screen reader e ingrandibile con lo zoom del browser. Nessuno
            dei sette è segnato o colorato: è la deroga dichiarata al
            principio dei semafori, perché un semaforo su uno strumento
            finanziario sarebbe un giudizio. */}
        <div className="foglio-scala-sette">
          {[1, 2, 3, 4, 5, 6, 7].map((numero) => (
            <span key={numero} className="foglio-scala-numero cifra">
              {numero}
            </span>
          ))}
        </div>
        <p className="foglio-riquadro-testo">
          <Testo chiave="foglioRischiSetteNumeri" />
        </p>
        <p className="foglio-riquadro-testo">
          <Testo chiave="foglioRischiCosaMisura" />
        </p>
        <p className="foglio-riquadro-testo">
          <Testo chiave="foglioRischiNonDice" />
        </p>
      </>
    );
  }

  if (id === 'costi') {
    return (
      <>
        <p className="foglio-riquadro-testo">
          <Testo chiave="foglioCostiDoveSta" />
        </p>
        <p className="foglio-riquadro-testo">
          <Testo chiave="foglioCostiEsempio" />
        </p>
      </>
    );
  }

  if (id === 'tempo') {
    return (
      <p className="foglio-riquadro-testo">
        <Testo chiave="foglioTempoSpiegazione" />
      </p>
    );
  }

  return null;
}
