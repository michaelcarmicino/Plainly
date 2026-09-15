/**
 * LA GUIDA ALLA BOLLETTA DELLA LUCE — agente ui-builder. Funzionalità 05.
 *
 * Un concetto solo: quanto del totale non è l'energia usata. Il documento è
 * una costante importata staticamente (`documentoBollettaLuce.ts`): nessuna
 * attesa, nessuna rotellina, il facsimile e il riepilogo compaiono già
 * pronti (stato «in caricamento» di design.md).
 *
 * `letturaBolletta()` è l'unico calcolo: qui solo lettura dei campi già
 * pronti e formattazione (`formattaEuro`). La quadratura si SEGNALA, non si
 * corregge: se `!quadratura.quadra` compare un avviso, il totale mostrato
 * resta comunque quello stampato sul documento.
 */

import { useState, type ReactElement } from 'react';
import { formattaEuro, letturaBolletta } from '../core/index.ts';
import { BarraDueQuote } from './BarraDueQuote.tsx';
import { DOCUMENTO_BOLLETTA_LUCE } from './documentoBollettaLuce.ts';
import { RigaVoceBolletta } from './RigaVoceBolletta.tsx';
import { spiegazioneVoce } from './spiegazioniBolletta.tsx';
import './stiliBolletta.css';
import { Testo } from './Testo.tsx';

// Unica voce di categoria 'consumo' in questo documento: i kWh stampati
// sulla bolletta, letti direttamente dal campo dichiarato — nessuna somma.
const KWH_CONSUMO = DOCUMENTO_BOLLETTA_LUCE.voci.find((v) => v.categoria === 'consumo')?.quantita;

export function PaginaBolletta(): ReactElement {
  const lettura = letturaBolletta(DOCUMENTO_BOLLETTA_LUCE);
  const [rigaAperta, setRigaAperta] = useState<string | null>(null);

  return (
    <div className="bolletta">
      <p className="occhiello">
        <Testo chiave="bollettaOcchiello" />
      </p>
      <h2 className="bolletta-titolo">
        <Testo chiave="bollettaTitolo" />
      </h2>
      <p className="bolletta-intro">
        <Testo chiave="bollettaIntro" />
      </p>

      {!lettura.quadratura.quadra && (
        <p className="bolletta-errore" role="alert">
          <Testo
            chiave="bollettaErroreQuadratura"
            valori={{
              somma: formattaEuro(lettura.quadratura.sommaVociCent),
              totale: formattaEuro(lettura.quadratura.totaleDichiaratoCent),
              scarto: formattaEuro(lettura.quadratura.scartoCent),
            }}
          />
        </p>
      )}

      {lettura.voci.length === 0 ? (
        <p className="bolletta-vuoto">
          <Testo chiave="bollettaVuoto" />
        </p>
      ) : (
        <>
          <div className="bolletta-totale">
            <p className="bolletta-totale-etichetta">
              <Testo chiave="bollettaTotaleEtichetta" />
            </p>
            <p className="bolletta-totale-valore cifra">{formattaEuro(lettura.totaleCent)}</p>
            {KWH_CONSUMO !== undefined && (
              <p className="bolletta-totale-kwh">
                <Testo chiave="bollettaConsumoStampato" valori={{ kwh: KWH_CONSUMO }} />
              </p>
            )}
          </div>

          <h3 className="bolletta-sottotitolo">
            <Testo chiave="sezioneLettura" />
          </h3>
          <ul className="elenco-bolletta">
            {lettura.voci.map((voce) => (
              <RigaVoceBolletta
                key={voce.id}
                voce={voce}
                aperta={rigaAperta === voce.id}
                onToggle={() => setRigaAperta((corrente) => (corrente === voce.id ? null : voce.id))}
                spiegazione={spiegazioneVoce(voce, lettura, KWH_CONSUMO)}
              />
            ))}
          </ul>

          <BarraDueQuote lettura={lettura} kwh={KWH_CONSUMO} />
        </>
      )}

      <section className="limiti-schermata">
        <h3 className="limiti-titolo">
          <Testo chiave="sezioneLimiti" />
        </h3>
        <ul className="limiti">
          <li>
            <Testo chiave="bollettaLimiteOfferta" />
          </li>
          <li>
            <Testo chiave="bollettaLimiteConsumo" />
          </li>
          <li>
            <Testo chiave="bollettaLimiteFacsimile" />
          </li>
          <li>
            <Testo chiave="bollettaLimiteGas" />
          </li>
        </ul>
      </section>
    </div>
  );
}
