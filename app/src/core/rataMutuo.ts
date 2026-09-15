/**
 * LA RATA DEL MUTUO, UN TASSO ALLA VOLTA — agente core-engine. Funzionalità 10.
 *
 * Formula dell'ammortamento alla francese, rata costante:
 *   rata = C × [ i × (1+i)^n ] ÷ [ (1+i)^n − 1 ]
 *
 * Puro e deterministico: nessun I/O, nessun Date.now, nessun random. L'unico
 * numero a virgola mobile è (1+i)^n — un'esponenziale su interi non esiste —
 * e resta deterministico perché IEEE-754 dà lo stesso risultato su ogni
 * macchina. L'ARROTONDAMENTO AL CENTESIMO AVVIENE UNA VOLTA SOLA, alla fine:
 * `i` e la crescita sono fattori, non importi, e spariscono dentro la stessa
 * espressione.
 *
 * Questo modulo calcola la rata per UN tasso alla volta: il confronto fra il
 * tasso fermo e quello che si muove sta in confrontoRateMutuo.ts, e la scala
 * delle ipotesi in ipotesiTassoVariabile.ts — entrambi chiamano
 * `calcolaRataCent` di qui, così l'arrotondamento resta nel posto unico in
 * cui è scritto.
 *
 * Limiti dei campi digitati, che non sono limiti dell'aritmetica: chi vuole
 * il caso limite chiama `calcolaRataCent`, chi riceve un valore digitato
 * chiama prima `motivoCapitale` / `motivoAnni` / `motivoTasso`.
 */

/** Oltre i 40 anni non esistono mutui in commercio: quasi sempre un refuso. */
export const ANNI_MUTUO_MIN = 1;
export const ANNI_MUTUO_MAX = 40;

/** 2.000.000,00 € — sopra, il campo raccoglie errori di battitura più che importi. */
export const CAPITALE_MUTUO_MAX_CENT = 200_000_000;

/** 20,00% — un TAN a due cifre alte è un refuso, non un'offerta. */
export const TASSO_MUTUO_MAX_BP = 2_000;

/**
 * I motivi per cui un ingresso viene rifiutato: CODICI, non frasi. Le parole
 * che legge una persona stanno in src/ui/testiRataMutuo.ts, unico punto in
 * cui il lessico viene scandito.
 */
export const MOTIVI_RIFIUTO_MUTUO = [
  'capitale-non-leggibile',
  'capitale-a-zero',
  'capitale-troppo-alto',
  'anni-non-interi',
  'anni-fuori-intervallo',
  'tasso-non-leggibile',
  'tasso-sotto-zero',
  'tasso-troppo-alto',
] as const;

export type MotivoRifiutoMutuo = (typeof MOTIVI_RIFIUTO_MUTUO)[number];

export interface IngressoRataMutuo {
  readonly capitaleCent: number;
  readonly anni: number;
  readonly tassoAnnuoBp: number;
}

/**
 * ARITMETICA PURA, senza i limiti del campo digitato. Copre `tassoAnnuoBp
 * === 0`: la formula degenera nel suo significato — senza interessi si
 * restituisce il capitale in parti uguali — quindi resta un arrotondamento
 * solo, non due.
 *
 * NIENTE ARROTONDAMENTI INTERMEDI: `crescita` è un fattore, non un importo,
 * e resta a piena precisione fino a entrare nella stessa espressione di
 * `rataGrezza`. Arrotondarlo prima di riusarlo — «per pulizia» — sposta il
 * risultato di un centesimo sul caso di riferimento (74.772 diventerebbe
 * 74.771): l'unico arrotondamento di questa funzione è l'ultimo, su
 * `rataGrezza`.
 *
 * `anni === 0` NON è validato qui: `numeroRate` varrebbe 0 e la funzione
 * restituirebbe `Infinity` (capitale diviso zero rate, oppure crescita − 1
 * = 0 al denominatore). Non è il caso che degenera in modo significativo —
 * a differenza di `tassoAnnuoBp === 0` — è un input che questa funzione non
 * ha ragione di accettare: il confine sta in `motivoAnni`, che rifiuta
 * `anni < ANNI_MUTUO_MIN` (1) PRIMA che questa funzione venga chiamata da
 * `confrontaRateMutuo`. Chi chiama `calcolaRataCent` direttamente, bypassando
 * la validazione, si assume la responsabilità di non passargli `anni <= 0`.
 */
export function calcolaRataCent(ingresso: IngressoRataMutuo): number {
  const { capitaleCent, anni, tassoAnnuoBp } = ingresso;
  const numeroRate = anni * 12;

  if (tassoAnnuoBp === 0) {
    return Math.round(capitaleCent / numeroRate);
  }

  const i = tassoAnnuoBp / 120_000;
  const crescita = (1 + i) ** numeroRate;
  const rataGrezza = (capitaleCent * (i * crescita)) / (crescita - 1);
  return Math.round(rataGrezza);
}

/**
 * Primo motivo di rifiuto sul capitale, oppure null.
 *
 * Un capitale sotto zero collassa nello stesso codice di un capitale a
 * zero: la specifica dichiara ESATTAMENTE otto motivi (vedi
 * `MOTIVI_RIFIUTO_MUTUO`) e non ne prevede uno separato per il negativo — a
 * differenza di `somma-sotto-zero` in simulazioneRisparmio.ts. Chi presta
 * soldi in prestito con un segno meno davanti ha comunque «niente da
 * calcolare», che è esattamente il messaggio di `capitale-a-zero`.
 */
export function motivoCapitale(capitaleCent: number): MotivoRifiutoMutuo | null {
  if (!Number.isInteger(capitaleCent)) return 'capitale-non-leggibile';
  if (capitaleCent <= 0) return 'capitale-a-zero';
  if (capitaleCent > CAPITALE_MUTUO_MAX_CENT) return 'capitale-troppo-alto';
  return null;
}

/** Primo motivo di rifiuto sugli anni, oppure null. */
export function motivoAnni(anni: number): MotivoRifiutoMutuo | null {
  if (!Number.isInteger(anni)) return 'anni-non-interi';
  if (anni < ANNI_MUTUO_MIN || anni > ANNI_MUTUO_MAX) return 'anni-fuori-intervallo';
  return null;
}

/**
 * Primo motivo di rifiuto su un tasso, oppure null. Condiviso dal tasso
 * fermo, dal tasso che si muove e da ogni riga della scala delle ipotesi:
 * la regola su che cosa è un tasso leggibile è UNA SOLA.
 */
export function motivoTasso(tassoAnnuoBp: number): MotivoRifiutoMutuo | null {
  if (!Number.isInteger(tassoAnnuoBp)) return 'tasso-non-leggibile';
  if (tassoAnnuoBp < 0) return 'tasso-sotto-zero';
  if (tassoAnnuoBp > TASSO_MUTUO_MAX_BP) return 'tasso-troppo-alto';
  return null;
}
