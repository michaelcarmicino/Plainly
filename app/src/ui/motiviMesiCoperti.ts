/**
 * DAL CODICE DEL CORE ALLA FRASE CHE SI LEGGE — agente ui-builder.
 * Funzionalità 09, sul modello di motiviRisparmio.ts (funzionalità 07).
 *
 * Il core rifiuta un ingresso restituendo un CODICE, non una frase; qui i
 * due mondi si toccano. `TESTO_DEL_MOTIVO` è `Record<MotivoRifiutoMesiCoperti, …>`
 * per essere esaustiva per costruzione: un codice nuovo nel core fa
 * fallire qui la compilazione invece di lasciare un riquadro muto.
 *
 * Per isolare quale dei due campi è in difficoltà, si interroga il core un
 * campo per volta tenendo l'altro su un valore neutro: le regole restano
 * UNA sola, quella del core, e non vengono riscritte qui.
 *
 * La grammatica del risultato (singolare/plurale, quale delle quattro
 * chiavi «Risultato…» usare) sta affiancata, in testoDurataMesiCoperti.ts:
 * un'altra ragione meccanica per restare sotto le 150 righe.
 */

import { mesiCoperti, type MotivoRifiutoMesiCoperti, type RisultatoMesiCoperti } from '../core/mesiCoperti.ts';
import type { LetturaCampo } from './letturaCampi.ts';
import type { ChiaveStringaUtente } from './testi.ts';

export type LuogoDelMotivo = 'spese' | 'risparmi';

export const TESTO_DEL_MOTIVO: Readonly<Record<MotivoRifiutoMesiCoperti, ChiaveStringaUtente>> = {
  'spese-non-leggibili': 'mesiCopertiErroreSpese',
  'spese-a-zero': 'mesiCopertiErroreSpeseZero',
  'spese-negative': 'mesiCopertiErroreSpeseNegative',
  'spese-sotto-soglia': 'mesiCopertiErroreSpeseBasse',
  'spese-sopra-soglia': 'mesiCopertiErroreSpeseAlte',
  'risparmi-non-leggibili': 'mesiCopertiErroreRisparmi',
  'risparmi-negativi': 'mesiCopertiErroreRisparmiNegativi',
  'risparmi-sopra-soglia': 'mesiCopertiErroreRisparmiAlti',
};

const LUOGO_DEL_MOTIVO: Readonly<Record<MotivoRifiutoMesiCoperti, LuogoDelMotivo>> = {
  'spese-non-leggibili': 'spese',
  'spese-a-zero': 'spese',
  'spese-negative': 'spese',
  'spese-sotto-soglia': 'spese',
  'spese-sopra-soglia': 'spese',
  'risparmi-non-leggibili': 'risparmi',
  'risparmi-negativi': 'risparmi',
  'risparmi-sopra-soglia': 'risparmi',
};

/** Valori neutri usati solo per interrogare il core su un campo per volta. */
const SPESE_NEUTRE_CENT = 100_000;
const RISPARMI_NEUTRI_CENT = 0;

function motivoDi(speseMensiliCent: number, risparmiCent: number): MotivoRifiutoMesiCoperti | null {
  const esito = mesiCoperti({ speseMensiliCent, risparmiCent });
  return esito.ok ? null : esito.errore;
}

function motivoNelLuogo(
  motivo: MotivoRifiutoMesiCoperti | null,
  luogo: LuogoDelMotivo,
): MotivoRifiutoMesiCoperti | null {
  return motivo !== null && LUOGO_DEL_MOTIVO[motivo] === luogo ? motivo : null;
}

export function motivoDelleSpese(lettura: LetturaCampo): MotivoRifiutoMesiCoperti | null {
  if (lettura.stato !== 'letto') return null;
  return motivoNelLuogo(motivoDi(lettura.valore, RISPARMI_NEUTRI_CENT), 'spese');
}

export function motivoDeiRisparmi(lettura: LetturaCampo): MotivoRifiutoMesiCoperti | null {
  if (lettura.stato !== 'letto') return null;
  return motivoNelLuogo(motivoDi(SPESE_NEUTRE_CENT, lettura.valore), 'risparmi');
}

export type StatoRisultato =
  | { readonly stato: 'vuoto' }
  | { readonly stato: 'in-sospeso' }
  | { readonly stato: 'pronto'; readonly risultato: RisultatoMesiCoperti };

/**
 * Il riquadro del risultato non mostra MAI una cifra vecchia: si ricava
 * ogni volta dai due campi, quindi svuotare un campo torna allo stato
 * vuoto invece di lasciare un numero con l'aria di essere ancora vero.
 */
export function statoRisultato(spese: LetturaCampo, risparmi: LetturaCampo): StatoRisultato {
  if (spese.stato !== 'letto' || risparmi.stato !== 'letto') return { stato: 'vuoto' };
  const esito = mesiCoperti({ speseMensiliCent: spese.valore, risparmiCent: risparmi.valore });
  return esito.ok ? { stato: 'pronto', risultato: esito.valore } : { stato: 'in-sospeso' };
}
