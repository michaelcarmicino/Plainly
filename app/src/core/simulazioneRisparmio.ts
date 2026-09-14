/**
 * SIMULAZIONE RISPARMIO — agente core-engine. Funzionalità 07.
 *
 * Che cosa risponde: quanto compra fra N anni una somma ferma oggi, se i
 * prezzi salgono ogni anno di un tasso dichiarato. Descrive un'erosione e si
 * ferma lì: non indica che cosa farne.
 *
 * Puro e deterministico: nessun I/O, nessun Date.now, nessun random. Il tasso
 * arriva come parametro e non viene mai letto dalla costante dichiarata.
 *
 * Aritmetica: l'elevamento a potenza è l'unico punto in cui compare un numero
 * a virgola mobile, perché un'esponenziale su interi non esiste. Resta
 * deterministico (IEEE-754 dà lo stesso risultato su ogni macchina) e
 * l'arrotondamento al centesimo intero avviene UNA VOLTA SOLA, alla fine:
 * nessun importo intermedio viene conservato come float.
 */

import type { Esito } from './esito.ts';
import { esitoErrore, esitoOk } from './esito.ts';

export interface IngressoSimulazioneRisparmio {
  readonly risparmioCent: number;
  readonly anni: number;
  readonly inflazioneAnnuaBp: number;
}

export interface RisultatoSimulazioneRisparmio {
  readonly risparmioCent: number;
  readonly anni: number;
  readonly inflazioneAnnuaBp: number;
  /** Quanto comprano oggi i soldi che avrai fra `anni`, in centesimi. */
  readonly valoreRealeCent: number;
  /** Differenza fra la somma di partenza e il suo valore reale. */
  readonly perditaCent: number;
  /** Che cosa resta del valore di 100 €, in centesimi: il paragone concreto. */
  readonly poterePerCentoEuroCent: number;
}

/** Limiti del campo digitato dalla persona, non dell'aritmetica. */
export const ANNI_MIN = 1;
export const ANNI_MAX = 30;

/** 10.000.000,00 € — oltre, la cifra è quasi sempre un errore di battitura. */
export const RISPARMIO_MAX_CENT = 1_000_000_000;

/**
 * I motivi per cui un ingresso viene rifiutato: CODICI, non frasi. Le parole
 * che legge una persona stanno tutte in src/ui/testi.ts, unico punto in cui
 * il lessico viene scandito; un codice non ha lessico da controllare e non
 * cambia quando il testo viene riscritto.
 *
 * L'elenco è la fonte unica e il tipo nasce da qui, quindi non può restare
 * indietro: chi costruisce la schermata ne ricava una mappa esaustiva verso i
 * testi, e il compilatore segnala il codice che manca.
 */
export const MOTIVI_RIFIUTO_RISPARMIO = [
  'somma-non-leggibile',
  'somma-sotto-zero',
  'somma-a-zero',
  'somma-troppo-alta',
  'anni-non-interi',
  'anni-fuori-intervallo',
  'tasso-sotto-zero',
  'tasso-non-leggibile',
] as const;

export type MotivoRifiutoRisparmio = (typeof MOTIVI_RIFIUTO_RISPARMIO)[number];

/**
 * ARITMETICA PURA, senza i limiti del campo digitato.
 *
 * Qui `anni = 0` è perfettamente calcolabile: il moltiplicatore vale 1 e la
 * somma resta identica a se stessa. È voluto, ed è il punto in cui la tensione
 * fra la specifica e il modulo si scioglie: l'intervallo 1–30 riguarda
 * l'ingresso dell'interfaccia — a nessuno serve digitare «0 anni» — mentre
 * l'aritmetica non ha ragione di rifiutarlo. Chi vuole il caso limite chiama
 * questa funzione; chi riceve quello che una persona ha digitato chiama
 * `simulaRisparmio`, che prima controlla.
 */
export function calcolaSimulazioneRisparmio(
  ingresso: IngressoSimulazioneRisparmio,
): RisultatoSimulazioneRisparmio {
  const { risparmioCent, anni, inflazioneAnnuaBp } = ingresso;
  const moltiplicatore = (1 + inflazioneAnnuaBp / 10_000) ** anni;
  const valoreRealeCent = Math.round(risparmioCent / moltiplicatore);
  return {
    risparmioCent,
    anni,
    inflazioneAnnuaBp,
    valoreRealeCent,
    perditaCent: risparmioCent - valoreRealeCent,
    poterePerCentoEuroCent: Math.round(10_000 / moltiplicatore),
  };
}

/**
 * Primo motivo di rifiuto trovato, oppure null. L'ordine è quello della
 * lettura: prima la somma, poi gli anni, poi il tasso.
 *
 * `somma-non-leggibile` copre anche il caso in cui il numero non è un numero:
 * `Number.isInteger` è falso su NaN, e per chi legge è lo stesso problema.
 */
function primoMotivo(ingresso: IngressoSimulazioneRisparmio): MotivoRifiutoRisparmio | null {
  const { risparmioCent, anni, inflazioneAnnuaBp } = ingresso;

  if (!Number.isInteger(risparmioCent)) return 'somma-non-leggibile';
  if (risparmioCent < 0) return 'somma-sotto-zero';
  if (risparmioCent === 0) return 'somma-a-zero';
  if (risparmioCent > RISPARMIO_MAX_CENT) return 'somma-troppo-alta';

  if (!Number.isInteger(anni)) return 'anni-non-interi';
  if (anni < ANNI_MIN || anni > ANNI_MAX) return 'anni-fuori-intervallo';

  if (!Number.isInteger(inflazioneAnnuaBp)) return 'tasso-non-leggibile';
  if (inflazioneAnnuaBp < 0) return 'tasso-sotto-zero';

  return null;
}

/**
 * Ingresso digitato → risultato, oppure il codice del motivo per cui non si
 * calcola. È la funzione che consuma la schermata, che traduce il codice in
 * parole attingendo a src/ui/testi.ts.
 *
 * Il ramo fallito è stretto sui codici: il tipo impedisce di scriverci dentro
 * una frase, e resta assegnabile a `Esito<RisultatoSimulazioneRisparmio>`.
 */
export function simulaRisparmio(
  ingresso: IngressoSimulazioneRisparmio,
): Esito<RisultatoSimulazioneRisparmio, MotivoRifiutoRisparmio> {
  const motivo = primoMotivo(ingresso);
  return motivo === null
    ? esitoOk(calcolaSimulazioneRisparmio(ingresso))
    : esitoErrore(motivo);
}
