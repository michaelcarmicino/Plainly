/**
 * LA STRUTTURA DELLE PAGINE DI SPIEGAZIONE — agente ui-builder. Funzionalità 03.
 *
 * Gemello di contenutiHome.ts: qui stanno SOLO chiavi e numeri, mai parole,
 * che vivono in testiSpiegazione.ts, il punto scandito dal guardrail.
 *
 * Otto blocchi, in un ordine fisso che il TIPO impone: 1 occhiello area (da
 * `area`) · 2 domanda (titolo, invariata) · 3 immagine (tupla non vuota) ·
 * 4 nomeTecnico (uno solo, o null) · 5+6 esempio (frase+paragone+fonte+
 * avvertenza insieme, o niente) · 7 passi (al più due) · 8 nonFa (tupla non
 * vuota, mai assente). L'ordine di STAMPA — «prima l'immagine, poi il nome
 * tecnico» — non lo decide questo file: lo impone PaginaSpiegazione.tsx.
 *
 * IdSpiegazione non è più un'unione scritta a mano: era il difetto che
 * bloccava 11 e 12, ognuna un'istanza nuova di questo stesso contenitore. Le
 * istanze vivono in CONTENUTI_SPIEGAZIONE, chiave->dati; la chiave FA da
 * identificatore, e `keyof typeof` deriva il tipo da lì.
 */

import type { IngressoCostoFoglio, IngressoSimulazioneRisparmio } from '../core/index.ts';
import type { IdArea } from './contenutiHome.ts';
import type { ChiaveStringaUtente } from './testi.ts';

/** Blocco 7. Una rotta reale, non un'unione chiusa sulle costanti di
 *  rotte.ts: dalla 14 le schermate si scoprono a runtime da file. «Un
 *  rimando verso il nulla non è dichiarabile» resta vero, verificato da un
 *  test sulle rotte registrate, non dal compilatore. */
export interface PassoSuccessivo {
  readonly percorso: string;
  readonly testo: ChiaveStringaUtente;
}

/** «Al massimo due» come vincolo del TIPO: un'unione di tuple di lunghezza
 *  0, 1 o 2, non un array libero. Un terzo elemento non si dichiara. */
export type PassiSuccessivi =
  | readonly []
  | readonly [PassoSuccessivo]
  | readonly [PassoSuccessivo, PassoSuccessivo];

/**
 * Blocchi 5 e 6, indivisibili: «ogni numero ha un paragone e una provenienza»
 * è un campo che il compilatore pretende. Unione discriminata su `tipo`: chi
 * ne aggiunge uno estende l'unione (non un `unknown`), e lo switch esaustivo
 * in spiegazioneEsempio.ts smette di compilare finché non lo gestisce. Tre
 * casi: risparmio eroso dall'inflazione (03), quote di una rata di mutuo
 * (11, su quoteRata.ts), costo percentuale su un capitale (12, su
 * costoFoglio.ts). Campi comuni in `BloccoNumerico`, sotto.
 */
interface BloccoNumerico {
  readonly frase: ChiaveStringaUtente;
  readonly paragone: ChiaveStringaUtente;
  readonly fonte: ChiaveStringaUtente;
  readonly avvertenza: ChiaveStringaUtente;
}

export type EsempioNumerico =
  /** Argomenti FISSI: nessuna persona li digita, in nessuno dei tre casi. */
  | (BloccoNumerico & { readonly tipo: 'valore-risparmi'; readonly ingresso: IngressoSimulazioneRisparmio })
  | (BloccoNumerico & {
      readonly tipo: 'quote-rata-mutuo';
      readonly ingresso: {
        readonly capitaleResiduoCent: number;
        readonly tassoAnnuoBp: number;
        readonly rataCent: number;
        readonly numeroRate: number;
      };
    })
  | (BloccoNumerico & { readonly tipo: 'costo-su-capitale'; readonly ingresso: IngressoCostoFoglio });

/** Ciò che un'istanza dichiara, id escluso: la chiave in
 *  CONTENUTI_SPIEGAZIONE fa già da identificatore. */
export interface DatiSpiegazione {
  readonly area: IdArea;
  /** Blocco 2, la stessa chiave che l'elenco dell'area già mostra. */
  readonly domanda: ChiaveStringaUtente;
  /** Blocco 3, tupla non vuota: da una a tre frasi. */
  readonly immagine: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
  /** Blocco 4, uno solo, `null` quando non serve nominare niente. */
  readonly nomeTecnico: ChiaveStringaUtente | null;
  /** Blocchi 5 e 6, insieme o niente. */
  readonly esempio: EsempioNumerico | null;
  /** Blocco 7, al più due rimandi. */
  readonly passi: PassiSuccessivi;
  /** Blocco 8, tupla non vuota: il tipo rifiuta una pagina senza confini. */
  readonly nonFa: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
}

/** Un'istanza completa: `DatiSpiegazione` più l'id per riga. */
export interface PaginaSpiegazione extends DatiSpiegazione {
  readonly id: IdSpiegazione;
}

/**
 * TUTTE le istanze dichiarate, chiave = identificatore. Oggi una sola:
 * l'inflazione sulla spesa, ingresso 10.000 cent (100 €), 1 anno, 200 bp —
 * l'esempio-modello di scrittura-e-accessibilita.md. Chi aggiunge la 11 o
 * la 12 aggiunge una chiave qui sotto, con dati che soddisfino
 * `DatiSpiegazione` — non un'istanza da elencare altrove, non un caso in
 * più di un'unione a mano.
 *
 * // valore reale, in …Frase: 10.000 / 1,02 = 9.803,92… -> 9.804 cent = 98,04 €
 * // perdita, in …Paragone:   10.000 - 9.804 = 196 cent = 1,96 €
 */
export const CONTENUTI_SPIEGAZIONE = {
  'inflazione-spesa': {
    area: 'costo-della-vita',
    domanda: 'area1Altra1',
    immagine: [
      'spiegazioneInflazioneSpesaImmagine1',
      'spiegazioneInflazioneSpesaImmagine2',
      'spiegazioneInflazioneSpesaImmagine3',
    ],
    nomeTecnico: 'spiegazioneInflazioneSpesaNomeTecnico',
    esempio: {
      tipo: 'valore-risparmi',
      ingresso: { risparmioCent: 10_000, anni: 1, inflazioneAnnuaBp: 200 },
      frase: 'spiegazioneInflazioneSpesaFrase',
      paragone: 'spiegazioneInflazioneSpesaParagone',
      fonte: 'spiegazioneInflazioneSpesaFonte',
      avvertenza: 'spiegazioneInflazioneSpesaAvvertenza',
    },
    passi: [],
    nonFa: ['spiegazioneInflazioneSpesaNonFa1', 'spiegazioneInflazioneSpesaNonFa2'],
  },
} as const satisfies Record<string, DatiSpiegazione>;

/** Deriva dalle chiavi sopra: un'istanza in più, nessuna unione a mano. */
export type IdSpiegazione = keyof typeof CONTENUTI_SPIEGAZIONE;

/** Un'istanza completa a partire dal suo identificatore: la funzione che
 *  ogni file di schermata (03, 11, 12, …) chiama per il proprio contenuto. */
export function paginaSpiegazione(id: IdSpiegazione): PaginaSpiegazione {
  return { id, ...CONTENUTI_SPIEGAZIONE[id] };
}

/** Per spread, non con `paginaSpiegazione`: senza l'annotazione
 *  `: PaginaSpiegazione` (che allargherebbe `esempio` all'unione) i test che
 *  leggono `.esempio.ingresso` senza controllare `tipo` vedono il tipo
 *  stretto di questa istanza, non l'unione a tre casi. */
export const ISTANZA_INFLAZIONE_SPESA = {
  id: 'inflazione-spesa' as const,
  ...CONTENUTI_SPIEGAZIONE['inflazione-spesa'],
};

/** Tutte le pagine dichiarate, derivate da CONTENUTI_SPIEGAZIONE: da qui una
 *  futura verifica (una domanda, una sola destinazione) legge l'elenco. */
export const PAGINE_SPIEGAZIONE: readonly PaginaSpiegazione[] =
  (Object.keys(CONTENUTI_SPIEGAZIONE) as readonly IdSpiegazione[]).map(paginaSpiegazione);
