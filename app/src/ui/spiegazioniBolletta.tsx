/**
 * DAI CAMPI NUMERICI DELLA VOCE ALLA FRASE CHE SI LEGGE — agente ui-builder.
 * Funzionalità 05.
 *
 * `VoceCalcolata.spiegazione` (il campo del core) NON si stampa così com'è
 * (D30): questo file compone la frase da mostrare a partire dai soli campi
 * numerici (`importoCent`, `pesoBp`) e dall'esito del costo per kWh, tutti
 * già calcolati dal core — nessuna divisione o sottrazione qui dentro.
 *
 * Le cinque voci sono distinte per `id`: questa pagina mostra sempre e solo
 * il documento di `documentoBollettaLuce.ts`, quindi l'id è stabile. Non è
 * una scelta generalizzabile a un documento diverso — se un domani questa
 * pagina dovesse mostrare bollette diverse, la distinzione andrebbe rifatta
 * su un campo dichiarato apposta, non sull'id.
 */

import type { ReactElement } from 'react';
import type { VoceCalcolata } from '../../types/contracts.ts';
import { formattaEuro, formattaPercentuale, type LetturaBolletta } from '../core/index.ts';
import { TESTO_DEL_MOTIVO_COSTO_KWH } from './motiviBolletta.ts';
import { Testo } from './Testo.tsx';

function spiegazioneEnergia(voce: VoceCalcolata, kwh: number | undefined, lettura: LetturaBolletta): ReactElement {
  const importo = formattaEuro(voce.importoCent);
  if (kwh !== undefined && lettura.costoPerKwh.ok) {
    return (
      <Testo
        chiave="bollettaSpiegazioneEnergiaConKwh"
        valori={{ importo, kwh, prezzo: formattaEuro(lettura.costoPerKwh.valore.prezzoEnergiaPerKwhCent) }}
      />
    );
  }
  return <Testo chiave="bollettaSpiegazioneEnergiaSenzaKwh" valori={{ importo, peso: formattaPercentuale(voce.pesoBp) }} />;
}

/** Una spiegazione per ciascuna delle cinque voci dichiarate dalla specifica. */
export function spiegazioneVoce(
  voce: VoceCalcolata,
  lettura: LetturaBolletta,
  kwh: number | undefined,
): ReactElement {
  const importo = formattaEuro(voce.importoCent);
  const peso = formattaPercentuale(voce.pesoBp);

  switch (voce.id) {
    case 'voce-01':
      return spiegazioneEnergia(voce, kwh, lettura);
    case 'voce-02':
      return <Testo chiave="bollettaSpiegazioneTrasporto" valori={{ importo, peso }} />;
    case 'voce-03':
      return <Testo chiave="bollettaSpiegazioneOneri" valori={{ importo, peso }} />;
    case 'voce-04':
      return <Testo chiave="bollettaSpiegazioneAccisa" valori={{ importo, peso }} />;
    case 'voce-05':
      return <Testo chiave="bollettaSpiegazioneIva" valori={{ importo, peso }} />;
    default:
      // Voce imprevista: nessuna riga viene nascosta (E-03), ma senza una
      // bozza scritta per lei mostriamo solo il fatto verificabile che ha.
      return <Testo chiave={voce.categoria === 'consumo' ? 'bollettaDipendeConsumo' : 'bollettaNonDipendeConsumo'} />;
  }
}

/** Il messaggio quando il costo per kWh non è mostrabile: mai Infinity, mai NaN. */
export function messaggioCostoKwhNonDisponibile(lettura: LetturaBolletta): ReactElement | null {
  if (lettura.costoPerKwh.ok) return null;
  return <Testo chiave={TESTO_DEL_MOTIVO_COSTO_KWH[lettura.costoPerKwh.errore]} />;
}
