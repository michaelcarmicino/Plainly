/**
 * UNA RIGA DEL REGISTRO, UNA RIGA A SCHERMO — agente ui-builder.
 *
 * Non una colonna di una griglia a sei colonne: un riquadro con dentro tre
 * risposte, nello stesso ordine in cui una persona se le pone leggendo un
 * numero scritto da qualcun altro — che numero è, quanto vale, da dove
 * viene, su quali anni vale, da quando è scritto qui dentro.
 *
 * Il nome di tutti i giorni viene SEMPRE prima del nome tecnico, mai dopo.
 * Se manca il periodo, qui compare la frase in rosa che lo dichiara — ed è
 * l'unico punto colorato così in questa pagina: il rosa è il colore di ciò
 * che il prodotto non fa, e altrove qui dentro non serve.
 *
 * La riga arriva per id, non già come oggetto in mano: passa da `fonteDi`,
 * come il valore passa da `esitoTestoValore` (che a sua volta passa da
 * `valoreBpDiRiga`). Un id sconosciuto o un'unità incoerente non fanno
 * sparire la riga: restano al loro posto, con una frase da persona al posto
 * del dato che non torna.
 */

import type { ReactElement } from 'react';
import { fonteDi, provenienzaCompleta } from '../core/index.ts';
import { dataInLettere } from './dataInLettere.ts';
import { esitoTestoValore, NOME_QUOTIDIANO_PER_ID, TESTO_DEL_MOTIVO_FONTE } from './motiviFonti.ts';
import { Testo } from './Testo.tsx';

export function RigaRegistroFonte({ id }: { id: string }): ReactElement {
  const esitoRiga = fonteDi(id);

  if (!esitoRiga.ok) {
    return (
      <article className="riga-fonte riga-fonte-errore">
        <p className="riga-fonte-messaggio">
          <Testo chiave={TESTO_DEL_MOTIVO_FONTE[esitoRiga.errore]} />
        </p>
      </article>
    );
  }

  const riga = esitoRiga.valore;
  const esitoValore = esitoTestoValore(riga);
  const nomeQuotidiano = NOME_QUOTIDIANO_PER_ID[riga.id];
  // Mai a confronto di stringhe scritte qui: la riga dichiara da sola,
  // tramite i suoi campi, se manca ancora qualcosa da poter controllare.
  const provenienzaDaCompletare = !provenienzaCompleta(riga);

  return (
    <article className="riga-fonte">
      <h3 className="riga-fonte-nome">
        {nomeQuotidiano === undefined ? (
          riga.indicatore
        ) : (
          <>
            <Testo chiave={nomeQuotidiano} />{' '}
            <span className="riga-fonte-tecnico">({riga.indicatore})</span>
          </>
        )}
      </h3>

      <div className="riga-fonte-campi">
        <p className="riga-fonte-campo riga-fonte-campo-numero">
          <span className="riga-fonte-etichetta">
            <Testo chiave="fontiColonnaValore" />
          </span>
          <span className="riga-fonte-valore cifra">
            {esitoValore.ok ? (
              esitoValore.valore
            ) : (
              <Testo chiave={TESTO_DEL_MOTIVO_FONTE[esitoValore.errore]} />
            )}
          </span>
        </p>

        <p className="riga-fonte-campo">
          <span className="riga-fonte-etichetta">
            <Testo chiave="fontiColonnaFonte" />
          </span>
          <span className="riga-fonte-valore">{riga.fonte}</span>
        </p>

        <p className="riga-fonte-campo">
          <span className="riga-fonte-etichetta">
            <Testo chiave="fontiColonnaPeriodo" />
          </span>
          <span className={provenienzaDaCompletare ? 'riga-fonte-valore riga-fonte-mancante' : 'riga-fonte-valore'}>
            {riga.periodo === null ? (
              <Testo chiave="fontiPeriodoMancante" />
            ) : (
              <Testo
                chiave="fontiPeriodoValori"
                valori={{ inizio: riga.periodo.inizio, fine: riga.periodo.fine }}
              />
            )}
          </span>
        </p>
      </div>

      <p className="riga-fonte-inserito">
        <Testo chiave="fontiInserito" valori={{ data: dataInLettere(riga.dataInserimento) }} />
      </p>
    </article>
  );
}
