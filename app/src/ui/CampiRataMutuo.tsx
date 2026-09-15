/**
 * I QUATTRO CAMPI DEL PREVENTIVO — agente ui-builder. Funzionalità 10.
 *
 * Quattro pezzi di stato, gestiti dal chiamante: questo componente legge e
 * mostra, non possiede nulla. I messaggi d'errore traducono un codice del
 * core (via motiviRataMutuo.ts) in una frase da src/ui/testiRataMutuo.ts.
 */

import type { ReactElement } from 'react';
import { formattaEuro, formattaPercentuale } from '../core/formatoIt.ts';
import { CAPITALE_MUTUO_MAX_CENT, TASSO_MUTUO_MAX_BP } from '../core/rataMutuo.ts';
import { CampoNumerico, type MessaggioCampo } from './CampoNumerico.tsx';
import { decimaliOltreIlCentesimo, type LetturaCampo } from './letturaCampi.ts';
import { motivoDegliAnniMutuo, motivoDelCapitale, motivoDelTasso, TESTO_DEL_MOTIVO_MUTUO } from './motiviRataMutuo.ts';
import { t } from './testi.ts';

const VALORI_CAPITALE = { massimo: formattaEuro(CAPITALE_MUTUO_MAX_CENT) };
const VALORI_TASSO_ALTO = { massimo: formattaPercentuale(TASSO_MUTUO_MAX_BP) };
const VALORI_ANNI = { min: 1, max: 40 };

function messaggioCapitale(lettura: LetturaCampo, testo: string): MessaggioCampo | undefined {
  const motivo = motivoDelCapitale(lettura);
  if (motivo !== null) return { chiave: TESTO_DEL_MOTIVO_MUTUO[motivo], valori: VALORI_CAPITALE, tono: 'errore' };
  if (lettura.stato === 'letto' && decimaliOltreIlCentesimo(testo)) {
    return {
      chiave: 'rataMutuoNotaCentesimi',
      valori: { valore: formattaEuro(lettura.valore) },
      tono: 'nota',
    };
  }
  return undefined;
}

function messaggioAnni(lettura: LetturaCampo): MessaggioCampo | undefined {
  const motivo = motivoDegliAnniMutuo(lettura);
  return motivo === null ? undefined : { chiave: TESTO_DEL_MOTIVO_MUTUO[motivo], valori: VALORI_ANNI, tono: 'errore' };
}

function messaggioTasso(lettura: LetturaCampo, esempio: string): MessaggioCampo | undefined {
  const motivo = motivoDelTasso(lettura);
  if (motivo === null) return undefined;
  const valori = motivo === 'tasso-troppo-alto' ? VALORI_TASSO_ALTO : { esempio };
  return { chiave: TESTO_DEL_MOTIVO_MUTUO[motivo], valori, tono: 'errore' };
}

export function CampiRataMutuo({
  capitale,
  anni,
  tassoFermo,
  tassoMobile,
  letturaCapitale,
  letturaAnni,
  letturaTassoFermo,
  letturaTassoMobile,
  aCambioCapitale,
  aCambioAnni,
  aCambioTassoFermo,
  aCambioTassoMobile,
}: {
  capitale: string;
  anni: string;
  tassoFermo: string;
  tassoMobile: string;
  letturaCapitale: LetturaCampo;
  letturaAnni: LetturaCampo;
  letturaTassoFermo: LetturaCampo;
  letturaTassoMobile: LetturaCampo;
  aCambioCapitale: (testo: string) => void;
  aCambioAnni: (testo: string) => void;
  aCambioTassoFermo: (testo: string) => void;
  aCambioTassoMobile: (testo: string) => void;
}): ReactElement {
  const esempioFermo = t('rataMutuoEsempioTassoFermo');
  const esempioMobile = t('rataMutuoEsempioTassoMobile');

  return (
    <div className="campi">
      <CampoNumerico
        id="campo-capitale-mutuo"
        etichetta="rataMutuoEtichettaCapitale"
        aiuto="rataMutuoAiutoCapitale"
        esempio="rataMutuoEsempioCapitale"
        testo={capitale}
        messaggio={messaggioCapitale(letturaCapitale, capitale)}
        modoTastiera="decimal"
        aCambio={aCambioCapitale}
      />
      <CampoNumerico
        id="campo-anni-mutuo"
        etichetta="rataMutuoEtichettaAnni"
        aiuto="rataMutuoAiutoAnni"
        aiutoValori={VALORI_ANNI}
        esempio="rataMutuoEsempioAnni"
        testo={anni}
        messaggio={messaggioAnni(letturaAnni)}
        modoTastiera="numeric"
        aCambio={aCambioAnni}
      />
      <CampoNumerico
        id="campo-tasso-fermo"
        etichetta="rataMutuoEtichettaTassoFermo"
        aiuto="rataMutuoAiutoTassoFermo"
        aiutoValori={{ esempio: esempioFermo }}
        esempio="rataMutuoEsempioTassoFermo"
        testo={tassoFermo}
        messaggio={messaggioTasso(letturaTassoFermo, esempioFermo)}
        modoTastiera="decimal"
        aCambio={aCambioTassoFermo}
      />
      <CampoNumerico
        id="campo-tasso-mobile"
        etichetta="rataMutuoEtichettaTassoMobile"
        aiuto="rataMutuoAiutoTassoMobile"
        aiutoValori={{ esempio: esempioMobile }}
        esempio="rataMutuoEsempioTassoMobile"
        testo={tassoMobile}
        messaggio={messaggioTasso(letturaTassoMobile, esempioMobile)}
        modoTastiera="decimal"
        aCambio={aCambioTassoMobile}
      />
    </div>
  );
}
