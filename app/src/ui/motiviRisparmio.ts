/**
 * DAL CODICE DEL CORE ALLA FRASE CHE SI LEGGE — agente ui-builder.
 *
 * Il core rifiuta un ingresso restituendo un CODICE, non una frase: le parole
 * stanno tutte in testi.ts, unico punto che il guardrail scandisce. Qui i due
 * mondi si toccano, e le due mappe sono `Record<MotivoRifiutoRisparmio, …>`
 * per una ragione precisa: sono ESAUSTIVE per costruzione, quindi il giorno
 * in cui il core aggiunge un codice il compilatore lo segnala invece di
 * lasciare a schermo un riquadro muto.
 *
 * Le regole su che cosa è accettabile restano UNA SOLA, quella del core. Per
 * sapere quale dei due campi è in difficoltà, la schermata interroga il core
 * un campo per volta, tenendo l'altro su un valore neutro che non mostra mai:
 * riscrivere qui gli stessi controlli darebbe due verità che prima o poi
 * divergono.
 */

import {
  ANNI_MIN,
  INFLAZIONE_DICHIARATA,
  simulaRisparmio,
  type MotivoRifiutoRisparmio,
  type RisultatoSimulazioneRisparmio,
} from '../core/index.ts';
import type { LetturaCampo } from './letturaCampi.ts';
import type { ChiaveStringaUtente } from './testi.ts';

/** Dove va mostrato il messaggio: accanto a un campo, o nel riquadro. */
export type LuogoDelMotivo = 'somma' | 'anni' | 'pagina';

export const TESTO_DEL_MOTIVO: Readonly<
  Record<MotivoRifiutoRisparmio, ChiaveStringaUtente>
> = {
  'somma-non-leggibile': 'simulazioneRisparmioErroreSomma',
  'somma-sotto-zero': 'simulazioneRisparmioErroreSommaNegativa',
  'somma-a-zero': 'simulazioneRisparmioErroreSommaZero',
  'somma-troppo-alta': 'simulazioneRisparmioErroreSommaAlta',
  'anni-non-interi': 'simulazioneRisparmioErroreAnni',
  'anni-fuori-intervallo': 'simulazioneRisparmioErroreAnniFuori',
  'tasso-sotto-zero': 'simulazioneRisparmioErroreTasso',
  'tasso-non-leggibile': 'simulazioneRisparmioErroreTasso',
};

export const LUOGO_DEL_MOTIVO: Readonly<
  Record<MotivoRifiutoRisparmio, LuogoDelMotivo>
> = {
  'somma-non-leggibile': 'somma',
  'somma-sotto-zero': 'somma',
  'somma-a-zero': 'somma',
  'somma-troppo-alta': 'somma',
  'anni-non-interi': 'anni',
  'anni-fuori-intervallo': 'anni',
  'tasso-sotto-zero': 'pagina',
  'tasso-non-leggibile': 'pagina',
};

export type StatoRisultato =
  | { readonly stato: 'vuoto' }
  | { readonly stato: 'in-sospeso'; readonly motivoDiPagina: MotivoRifiutoRisparmio | null }
  | { readonly stato: 'pronto'; readonly risultato: RisultatoSimulazioneRisparmio };

/** Valori neutri usati solo per interrogare il core su un campo per volta. */
const SOMMA_NEUTRA_CENT = 1;

const TASSO_BP = INFLAZIONE_DICHIARATA.valoreBp;

function motivoDi(risparmioCent: number, anni: number): MotivoRifiutoRisparmio | null {
  const esito = simulaRisparmio({ risparmioCent, anni, inflazioneAnnuaBp: TASSO_BP });
  return esito.ok ? null : esito.errore;
}

function motivoNelLuogo(
  motivo: MotivoRifiutoRisparmio | null,
  luogo: LuogoDelMotivo,
): MotivoRifiutoRisparmio | null {
  return motivo !== null && LUOGO_DEL_MOTIVO[motivo] === luogo ? motivo : null;
}

export function motivoDellaSomma(lettura: LetturaCampo): MotivoRifiutoRisparmio | null {
  if (lettura.stato !== 'letto') return null;
  return motivoNelLuogo(motivoDi(lettura.valore, ANNI_MIN), 'somma');
}

export function motivoDegliAnni(lettura: LetturaCampo): MotivoRifiutoRisparmio | null {
  if (lettura.stato !== 'letto') return null;
  return motivoNelLuogo(motivoDi(SOMMA_NEUTRA_CENT, lettura.valore), 'anni');
}

/**
 * Il riquadro del risultato non mostra MAI una cifra vecchia: il suo stato si
 * ricava ogni volta dai due campi, quindi svuotare un campo riporta alla
 * schermata vuota invece di lasciare lì un numero con l'aria di essere ancora
 * vero.
 */
export function statoRisultato(somma: LetturaCampo, anni: LetturaCampo): StatoRisultato {
  if (somma.stato !== 'letto' || anni.stato !== 'letto') return { stato: 'vuoto' };

  const esito = simulaRisparmio({
    risparmioCent: somma.valore,
    anni: anni.valore,
    inflazioneAnnuaBp: TASSO_BP,
  });

  return esito.ok
    ? { stato: 'pronto', risultato: esito.valore }
    : { stato: 'in-sospeso', motivoDiPagina: motivoNelLuogo(esito.errore, 'pagina') };
}
