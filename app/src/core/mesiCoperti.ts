/**
 * MESI COPERTI DAI RISPARMI — agente core-engine. Funzionalità 09.
 *
 * Che cosa risponde: per quanti mesi e giorni una somma ferma copre una
 * spesa fissa mensile, se da un certo momento in poi non entrasse più
 * niente. Una divisione, e basta: nessun giudizio su quanto sia poco o tanto.
 *
 * Puro e deterministico: nessun I/O, nessun Date.now, nessun random.
 * Aritmetica interamente su interi — a differenza della 07, qui non compare
 * nessun numero a virgola mobile, perché non c'è nessuna esponenziale.
 *
 * Convenzione dichiarata, una sola: un mese vale sempre GIORNI_PER_MESE
 * giorni. Non è un dato di fonte, è il modo in cui il resto della divisione
 * viene reso leggibile — e va scritta anche a schermo, non solo qui.
 */

import type { Esito } from './esito.ts';
import { esitoErrore, esitoOk } from './esito.ts';

export interface IngressoMesiCoperti {
  readonly speseMensiliCent: number;
  readonly risparmiCent: number;
}

export interface RisultatoMesiCoperti {
  readonly speseMensiliCent: number;
  readonly risparmiCent: number;
  /** Totale dei giorni coperti, arrotondato per difetto. */
  readonly giorniCoperti: number;
  /** Quanti mesi interi, di GIORNI_PER_MESE giorni ciascuno, ci stanno. */
  readonly mesiInteri: number;
  /** Giorni oltre l'ultimo mese intero: sempre fra 0 e GIORNI_PER_MESE - 1. */
  readonly giorniResidui: number;
  /** Quanto resta dei risparmi dopo i mesi interi, in centesimi. */
  readonly residuoUltimoMeseCent: number;
}

/** Un mese vale sempre trenta giorni: convenzione dichiarata, non una fonte. */
export const GIORNI_PER_MESE = 30;

/** Limiti dei campi digitati, non dell'aritmetica. */
export const SPESE_MENSILI_MIN_CENT = 1_000;
export const SPESE_MENSILI_MAX_CENT = 10_000_000;
export const RISPARMI_MAX_CENT = 1_000_000_000;

/**
 * I motivi per cui un ingresso viene rifiutato: CODICI, non frasi. Le parole
 * stanno tutte in src/ui/testiMesiCoperti.ts, unico punto scandito dal
 * guardrail; un codice non ha lessico da controllare.
 *
 * `spese-a-zero` è distinto da `spese-sotto-soglia` perché il motivo è
 * diverso: zero rompe la divisione (motivo aritmetico), sotto la soglia è un
 * probabile errore di battitura. `risparmi-a-zero` non esiste: zero risparmi
 * è un risultato valido, non un rifiuto.
 */
export const MOTIVI_RIFIUTO_MESI_COPERTI = [
  'spese-non-leggibili',
  'spese-a-zero',
  'spese-negative',
  'spese-sotto-soglia',
  'spese-sopra-soglia',
  'risparmi-non-leggibili',
  'risparmi-negativi',
  'risparmi-sopra-soglia',
] as const;

export type MotivoRifiutoMesiCoperti = (typeof MOTIVI_RIFIUTO_MESI_COPERTI)[number];

/**
 * ARITMETICA PURA, senza i limiti del campo digitato. Presuppone
 * `speseMensiliCent > 0`: chi vuole il caso limite lo sa già rifiutato da
 * `mesiCoperti`, che valida prima di chiamare questa funzione.
 *
 * Tre proprietà, verificabili sull'algebra oltre che sui casi di test:
 * - `mesiInteri` coincide sempre con `Math.floor(risparmiCent / speseMensiliCent)`;
 * - `giorniResidui` sta sempre fra 0 e GIORNI_PER_MESE - 1;
 * - `residuoUltimoMeseCent` sta sempre fra 0 e `speseMensiliCent - 1`.
 */
export function calcolaMesiCoperti(ingresso: IngressoMesiCoperti): RisultatoMesiCoperti {
  const { speseMensiliCent, risparmiCent } = ingresso;

  const giorniCoperti = Math.floor((risparmiCent * GIORNI_PER_MESE) / speseMensiliCent);
  const mesiInteri = Math.floor(giorniCoperti / GIORNI_PER_MESE);
  const giorniResidui = giorniCoperti - mesiInteri * GIORNI_PER_MESE;
  const residuoUltimoMeseCent = risparmiCent - mesiInteri * speseMensiliCent;

  return {
    speseMensiliCent,
    risparmiCent,
    giorniCoperti,
    mesiInteri,
    giorniResidui,
    residuoUltimoMeseCent,
  };
}

/**
 * Primo motivo di rifiuto trovato, oppure null. L'ordine è quello della
 * lettura: prima le spese, poi i risparmi.
 *
 * `spese-non-leggibili` e `risparmi-non-leggibili` coprono anche il caso in
 * cui il numero non è un numero: `Number.isInteger` è falso su NaN.
 */
function primoMotivo(ingresso: IngressoMesiCoperti): MotivoRifiutoMesiCoperti | null {
  const { speseMensiliCent, risparmiCent } = ingresso;

  if (!Number.isInteger(speseMensiliCent)) return 'spese-non-leggibili';
  if (speseMensiliCent === 0) return 'spese-a-zero';
  if (speseMensiliCent < 0) return 'spese-negative';
  if (speseMensiliCent < SPESE_MENSILI_MIN_CENT) return 'spese-sotto-soglia';
  if (speseMensiliCent > SPESE_MENSILI_MAX_CENT) return 'spese-sopra-soglia';

  if (!Number.isInteger(risparmiCent)) return 'risparmi-non-leggibili';
  if (risparmiCent < 0) return 'risparmi-negativi';
  if (risparmiCent > RISPARMI_MAX_CENT) return 'risparmi-sopra-soglia';

  return null;
}

/**
 * Ingresso digitato → risultato, oppure il codice del motivo per cui non si
 * calcola. `risparmiCent = 0` non è mai un rifiuto: zero da parte è un
 * risultato reale — zero giorni coperti — non un errore da correggere.
 */
export function mesiCoperti(
  ingresso: IngressoMesiCoperti,
): Esito<RisultatoMesiCoperti, MotivoRifiutoMesiCoperti> {
  const motivo = primoMotivo(ingresso);
  return motivo === null
    ? esitoOk(calcolaMesiCoperti(ingresso))
    : esitoErrore(motivo);
}
