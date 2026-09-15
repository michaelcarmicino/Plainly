/**
 * DAL CODICE DEL CORE ALLA FRASE CHE SI LEGGE — agente ui-builder.
 * Funzionalità 12. Stessa struttura di motiviRisparmio.ts (funzionalità 07):
 * la mappa è un `Record<MotivoRifiutoCosto, …>`, quindi ESAUSTIVA per
 * costruzione — un codice nuovo nel core e il compilatore lo segnala qui.
 *
 * A differenza della 07, ogni motivo di rifiuto qui è attribuibile a un
 * campo preciso — percentuale o importo — quindi non esiste un motivo «di
 * pagina»: il riquadro del risultato ha solo due stati, vuoto e pronto (vedi
 * `statoRisultatoFoglio`), mai un terzo stato in sospeso.
 */

import {
  COSTO_BP_MAX,
  RISPARMIO_MAX_CENT,
  traduciCostoInEuro,
  type MotivoRifiutoCosto,
  type RisultatoCostoFoglio,
} from '../core/costoFoglio.ts';
import { formattaEuro, formattaPercentuale } from '../core/formatoIt.ts';
import type { MessaggioCampo } from './CampoNumerico.tsx';
import type { LetturaCampo } from './letturaCampi.ts';
import type { ChiaveStringaUtente } from './testi.ts';

export type LuogoDelMotivoFoglio = 'percentuale' | 'importo';

export const TESTO_DEL_MOTIVO_FOGLIO: Readonly<Record<MotivoRifiutoCosto, ChiaveStringaUtente>> = {
  'costo-fuori-intervallo': 'foglioErrorePercentuale',
  'somma-troppo-alta': 'foglioErroreImporto',
  'somma-mancante': 'foglioErroreImportoMancante',
};

export const LUOGO_DEL_MOTIVO_FOGLIO: Readonly<Record<MotivoRifiutoCosto, LuogoDelMotivoFoglio>> = {
  'costo-fuori-intervallo': 'percentuale',
  'somma-troppo-alta': 'importo',
  'somma-mancante': 'importo',
};

/** Valori neutri usati solo per interrogare il core su un campo per volta. */
const PERCENTUALE_NEUTRA_BP = 0;
const CAPITALE_NEUTRO_CENT = 1;

function motivoDi(costoAnnuoBp: number, capitaleCent: number): MotivoRifiutoCosto | null {
  const esito = traduciCostoInEuro({ costoAnnuoBp, capitaleCent });
  return esito.ok ? null : esito.errore;
}

function motivoNelLuogo(
  motivo: MotivoRifiutoCosto | null,
  luogo: LuogoDelMotivoFoglio,
): MotivoRifiutoCosto | null {
  return motivo !== null && LUOGO_DEL_MOTIVO_FOGLIO[motivo] === luogo ? motivo : null;
}

export function motivoDellaPercentuale(lettura: LetturaCampo): MotivoRifiutoCosto | null {
  if (lettura.stato !== 'letto') return null;
  return motivoNelLuogo(motivoDi(lettura.valore, CAPITALE_NEUTRO_CENT), 'percentuale');
}

export function motivoDellImporto(lettura: LetturaCampo): MotivoRifiutoCosto | null {
  if (lettura.stato !== 'letto') return null;
  return motivoNelLuogo(motivoDi(PERCENTUALE_NEUTRA_BP, lettura.valore), 'importo');
}

/** I due messaggi di campo: incapsulano i valori dei placeholder ({massimo}). */
const VALORI_PERCENTUALE = { massimo: formattaPercentuale(COSTO_BP_MAX) };
const VALORI_IMPORTO = { massimo: formattaEuro(RISPARMIO_MAX_CENT) };

export function messaggioPercentuale(lettura: LetturaCampo): MessaggioCampo | undefined {
  const motivo = motivoDellaPercentuale(lettura);
  if (motivo === null) return undefined;
  return { chiave: TESTO_DEL_MOTIVO_FOGLIO[motivo], valori: VALORI_PERCENTUALE, tono: 'errore' };
}

export function messaggioImporto(lettura: LetturaCampo): MessaggioCampo | undefined {
  const motivo = motivoDellImporto(lettura);
  if (motivo === null) return undefined;
  return { chiave: TESTO_DEL_MOTIVO_FOGLIO[motivo], valori: VALORI_IMPORTO, tono: 'errore' };
}

export type StatoRisultatoFoglio =
  | { readonly stato: 'vuoto' }
  | { readonly stato: 'pronto'; readonly risultato: RisultatoCostoFoglio };

/**
 * Il riquadro del risultato non mostra MAI una cifra calcolata su un dato
 * rifiutato: se uno dei due campi non è pronto, o il core rifiuta la
 * coppia, si torna allo stato vuoto — non si tiene un numero vecchio in
 * bella vista con l'aria di essere ancora vero.
 */
export function statoRisultatoFoglio(
  percentuale: LetturaCampo,
  importo: LetturaCampo,
): StatoRisultatoFoglio {
  if (percentuale.stato !== 'letto' || importo.stato !== 'letto') return { stato: 'vuoto' };

  const esito = traduciCostoInEuro({
    costoAnnuoBp: percentuale.valore,
    capitaleCent: importo.valore,
  });

  return esito.ok ? { stato: 'pronto', risultato: esito.valore } : { stato: 'vuoto' };
}
