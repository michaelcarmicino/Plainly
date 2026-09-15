/**
 * COSTO DEL FOGLIO — agente core-engine. Funzionalità 12.
 *
 * Che cosa risponde: una percentuale di costo letta su un foglio informativo
 * (il KID), tradotta in euro su una somma dichiarata. Non nomina nessun
 * prodotto e non giudica nessuna cifra: traduce un numero in un altro.
 *
 * Puro e deterministico: nessun I/O, nessun Date.now, nessun random.
 *
 * `RISPARMIO_MAX_CENT` è quella già esportata da simulazioneRisparmio.ts
 * (funzionalità 07): due schermate dello stesso sito non possono avere due
 * idee diverse su dove comincia «troppo alto».
 */

import type { Esito } from './esito.ts';
import { esitoErrore, esitoOk } from './esito.ts';
import { RISPARMIO_MAX_CENT } from './simulazioneRisparmio.ts';

export interface IngressoCostoFoglio {
  readonly costoAnnuoBp: number;
  readonly capitaleCent: number;
}

export interface RisultatoCostoFoglio {
  readonly costoAnnuoBp: number;
  readonly capitaleCent: number;
  /** Il numero grande della schermata: esatto, mai una seconda approssimazione. */
  readonly costoAnnuoCent: number;
  /** L'anno diviso dodici, arrotondato al centesimo. 12x questo NON ricompone l'anno. */
  readonly costoMensileCent: number;
  /** Su 100 €, il costo in centesimi coincide con i punti base: è il paragone. */
  readonly costoPerCentoEuroCent: number;
}

/** 0 % … 10,00 %, in punti base. Oltre, la cifra è quasi sempre un errore di lettura. */
export const COSTO_BP_MIN = 0;
export const COSTO_BP_MAX = 1000;

export { RISPARMIO_MAX_CENT };

/**
 * I motivi per cui un ingresso viene rifiutato: CODICI, non frasi. Le parole
 * stanno in src/ui/testi.ts, unico punto scandito dal guardrail.
 */
export const MOTIVI_RIFIUTO_COSTO = [
  'costo-fuori-intervallo',
  'somma-troppo-alta',
  'somma-mancante',
] as const;

export type MotivoRifiutoCosto = (typeof MOTIVI_RIFIUTO_COSTO)[number];

/**
 * ARITMETICA PURA, senza i limiti del campo digitato: chi vuole il caso
 * limite chiama questa funzione, chi riceve quello che una persona ha
 * digitato chiama `traduciCostoInEuro`, che prima controlla.
 */
export function calcolaCostoFoglio(ingresso: IngressoCostoFoglio): RisultatoCostoFoglio {
  const { costoAnnuoBp, capitaleCent } = ingresso;
  const costoAnnuoCent = Math.round((capitaleCent * costoAnnuoBp) / 10_000);
  const costoMensileCent = Math.round(costoAnnuoCent / 12);
  // Identità: su 100 € il costo in centesimi coincide con i punti base.
  const costoPerCentoEuroCent = Math.round((10_000 * costoAnnuoBp) / 10_000);
  return {
    costoAnnuoBp,
    capitaleCent,
    costoAnnuoCent,
    costoMensileCent,
    costoPerCentoEuroCent,
  };
}

/**
 * Primo motivo di rifiuto trovato, oppure null. L'ordine è quello della
 * lettura: prima la percentuale (il riquadro dei costi), poi la somma.
 *
 * Un valore non intero (compreso NaN, per un testo non leggibile) non ha
 * dove stare in nessuno dei due campi: viene trattato come fuori intervallo
 * o come somma mancante, non come un quarto codice a parte.
 */
function primoMotivo(ingresso: IngressoCostoFoglio): MotivoRifiutoCosto | null {
  const { costoAnnuoBp, capitaleCent } = ingresso;

  if (
    !Number.isInteger(costoAnnuoBp) ||
    costoAnnuoBp < COSTO_BP_MIN ||
    costoAnnuoBp > COSTO_BP_MAX
  ) {
    return 'costo-fuori-intervallo';
  }

  if (!Number.isInteger(capitaleCent) || capitaleCent <= 0) return 'somma-mancante';
  if (capitaleCent > RISPARMIO_MAX_CENT) return 'somma-troppo-alta';

  return null;
}

/**
 * Ingresso digitato → risultato, oppure il codice del motivo per cui non si
 * calcola. Stessa forma di `simulaRisparmio` (funzionalità 07).
 */
export function traduciCostoInEuro(
  ingresso: IngressoCostoFoglio,
): Esito<RisultatoCostoFoglio, MotivoRifiutoCosto> {
  const motivo = primoMotivo(ingresso);
  return motivo === null ? esitoOk(calcolaCostoFoglio(ingresso)) : esitoErrore(motivo);
}
