/**
 * LE DUE PARTI DEL TOTALE — agente ui-builder. Funzionalità 05.
 *
 * La barra è puramente decorativa (`role="img" aria-hidden`): il dato vero
 * sta nelle due cifre scritte accanto, in una `<dl>` leggibile da uno
 * screen reader e da lontano — «un rapporto disegnato non si legge da
 * lontano e non si legge con uno screen reader» (spec 05). Tutti i numeri
 * (`energiaCent`, `nonEnergiaCent`, i due pesi, il costo per kWh) sono già
 * calcolati dal core: qui solo formattazione (`formattaEuro`,
 * `formattaPercentuale`), nessuna divisione o sottrazione.
 */

import type { CSSProperties, ReactElement } from 'react';
import { formattaEuro, formattaPercentuale, type LetturaBolletta } from '../core/index.ts';
import { messaggioCostoKwhNonDisponibile } from './spiegazioniBolletta.tsx';
import { Testo } from './Testo.tsx';

/** flexGrow non accetta valori negativi: un credito (CL-05) resterebbe
 *  comunque leggibile nella cifra accanto, che non viene mai clampata. */
function larghezzaBarra(pesoBp: number): CSSProperties {
  return { flexGrow: Math.max(pesoBp, 0) };
}

export function BarraDueQuote({
  lettura,
  kwh,
}: {
  readonly lettura: LetturaBolletta;
  readonly kwh: number | undefined;
}): ReactElement {
  const { energiaCent, nonEnergiaCent, pesoEnergiaBp, pesoNonEnergiaBp } = lettura.dueQuote;
  const messaggioAssente = messaggioCostoKwhNonDisponibile(lettura);

  return (
    <section className="due-quote" aria-labelledby="due-quote-titolo">
      <h3 id="due-quote-titolo" className="due-quote-titolo">
        <Testo chiave="bollettaDueQuoteTitolo" />
      </h3>

      <div className="due-quote-barra" role="img" aria-hidden="true">
        <span className="due-quote-barra-energia" style={larghezzaBarra(pesoEnergiaBp)} />
        <span className="due-quote-barra-resto" style={larghezzaBarra(pesoNonEnergiaBp)} />
      </div>

      <dl className="due-quote-cifre">
        <div className="due-quote-voce">
          <dt>
            <Testo chiave="bollettaQuotaConsumoEtichetta" />
          </dt>
          <dd className="cifra due-quote-valore">
            <Testo
              chiave="bollettaQuotaValore"
              valori={{ importo: formattaEuro(energiaCent), percento: formattaPercentuale(pesoEnergiaBp) }}
            />
          </dd>
        </div>
        <div className="due-quote-voce">
          <dt>
            <Testo chiave="bollettaQuotaNonConsumoEtichetta" />
          </dt>
          <dd className="cifra due-quote-valore">
            <Testo
              chiave="bollettaQuotaValore"
              valori={{ importo: formattaEuro(nonEnergiaCent), percento: formattaPercentuale(pesoNonEnergiaBp) }}
            />
          </dd>
        </div>
      </dl>

      <p className="due-quote-paragone">
        {kwh !== undefined && lettura.costoPerKwh.ok ? (
          <Testo
            chiave="bollettaParagoneKwh"
            valori={{
              kwh,
              prezzoEnergia: formattaEuro(lettura.costoPerKwh.valore.prezzoEnergiaPerKwhCent),
              prezzoTotale: formattaEuro(lettura.costoPerKwh.valore.costoTotalePerKwhCent),
              differenza: formattaEuro(nonEnergiaCent),
            }}
          />
        ) : (
          messaggioAssente
        )}
      </p>
    </section>
  );
}
