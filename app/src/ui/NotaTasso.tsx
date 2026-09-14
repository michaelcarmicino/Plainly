/**
 * DA DOVE VIENE IL NUMERO — agente ui-builder.
 *
 * Sta SOTTO il risultato e sempre nello stesso punto, a corpo pieno: non è
 * una nota a piè di pagina, non è in grigio slavato e non compare al
 * passaggio del mouse. Chi legge deve poter rispondere a due domande senza
 * cercare: da dove esce questo numero, e che cosa NON è.
 *
 * Il periodo su cui la media è calcolata non è ancora stato stabilito da
 * nessuno, e finché è così la riga in rosa lo dichiara. Il rosa è il colore
 * di ciò che il prodotto non fa: qui è al suo posto. Una cifra che chi legge
 * non può controllare è indistinguibile da una inventata, e fra nascondere il
 * buco e dichiararlo il progetto preferisce dichiararlo.
 */

import type { ReactElement } from 'react';
import {
  formattaPercentuale,
  INFLAZIONE_DICHIARATA,
  periodoDaCompilare,
} from '../core/index.ts';
import { Testo } from './Testo.tsx';

export function NotaTasso(): ReactElement {
  const valori = { tasso: formattaPercentuale(INFLAZIONE_DICHIARATA.valoreBp) };

  return (
    <section className="nota-tasso">
      <p className="nota-riga">
        <Testo chiave="simulazioneRisparmioTasso" valori={valori} />
      </p>

      <p className="nota-riga">
        <Testo chiave="simulazioneRisparmioFonte" valori={valori} />
      </p>

      {periodoDaCompilare(INFLAZIONE_DICHIARATA) && (
        <p className="nota-riga nota-periodo">
          <Testo chiave="simulazioneRisparmioPeriodoMancante" valori={valori} />
        </p>
      )}

      <p className="nota-riga nota-avvertenza">
        <Testo chiave="simulazioneRisparmioAvvertenza" />
      </p>
    </section>
  );
}
