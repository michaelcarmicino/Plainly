/**
 * UNA VOCE DELLA BOLLETTA, UNA RIGA APRIBILE — agente ui-builder. Funzionalità 05.
 *
 * L'intera riga è il bersaglio (bottone vero, min 44px): niente di
 * riservato al solo passaggio del mouse. `aria-expanded` e `aria-controls`
 * collegano il bottone al pannello; il pannello resta nel DOM con `hidden`
 * quando chiuso, non viene smontato, così il riferimento di `aria-controls`
 * punta sempre a qualcosa che esiste. Il segno «+/−» è decorativo
 * (`aria-hidden`): la parola accanto («Tocca per sapere...») è ciò che si
 * legge con uno screen reader o si vede senza saper leggere un'icona.
 *
 * `spiegazione` arriva già composta dal chiamante (spiegazioniBolletta.tsx):
 * questo componente riceve il testo già pronto, lo dispone soltanto —
 * nessuna logica di calcolo qui dentro, solo formattazione di numeri già
 * calcolati dal core (formattaEuro, formattaPercentuale).
 */

import type { ReactElement, ReactNode } from 'react';
import type { VoceCalcolata } from '../../types/contracts.ts';
import { formattaEuro, formattaPercentuale } from '../core/index.ts';
import { Testo } from './Testo.tsx';

export function RigaVoceBolletta({
  voce,
  aperta,
  onToggle,
  spiegazione,
}: {
  readonly voce: VoceCalcolata;
  readonly aperta: boolean;
  readonly onToggle: () => void;
  readonly spiegazione: ReactNode;
}): ReactElement {
  const idPannello = `bolletta-spiegazione-${voce.id}`;

  return (
    <li className="riga-bolletta">
      <button
        type="button"
        className="riga-bolletta-bottone"
        aria-expanded={aperta}
        aria-controls={idPannello}
        onClick={onToggle}
      >
        <span className="riga-bolletta-riga1">
          <span className="riga-bolletta-etichetta">{voce.etichettaOriginale}</span>
          <span className="riga-bolletta-importo cifra">{formattaEuro(voce.importoCent)}</span>
        </span>
        <span className="riga-bolletta-riga2">
          <span className="riga-bolletta-segno" aria-hidden="true">
            {aperta ? '−' : '+'}
          </span>
          <span className="riga-bolletta-nota-tocco">
            <Testo chiave={aperta ? 'bollettaNotaChiudi' : 'bollettaNotaApri'} />
          </span>
        </span>
      </button>

      <div id={idPannello} className="riga-bolletta-pannello" hidden={!aperta}>
        <p className="riga-bolletta-spiegazione">{spiegazione}</p>
        <p className="riga-bolletta-peso">
          <Testo chiave="bollettaPesoSulTotale" valori={{ peso: formattaPercentuale(voce.pesoBp) }} />
        </p>
        <p className="riga-bolletta-dipendenza">
          <Testo chiave={voce.categoria === 'consumo' ? 'bollettaDipendeConsumo' : 'bollettaNonDipendeConsumo'} />
        </p>
      </div>
    </li>
  );
}
