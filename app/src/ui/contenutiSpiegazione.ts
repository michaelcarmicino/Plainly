/**
 * LA STRUTTURA DELLE PAGINE DI SPIEGAZIONE — agente ui-builder. Funzionalità 03.
 *
 * Gemello di contenutiHome.ts: qui stanno SOLO chiavi e numeri, mai parole,
 * che vivono in testiSpiegazione.ts, il punto scandito dal guardrail.
 *
 * Otto blocchi, ordine fisso imposto dal TIPO: 1 occhiello (da `area`) ·
 * 2 domanda · 3 immagine (tupla non vuota) · 4 nomeTecnico (uno o null) ·
 * 5+6 esempio (frase+paragone+fonte+avvertenza insieme, o niente) · 7 passi
 * (al più due) · 8 nonFa (tupla non vuota). L'ordine di STAMPA — immagine
 * prima del nome tecnico — lo impone PaginaSpiegazione.tsx, non questo file.
 *
 * IdSpiegazione = `keyof typeof CONTENUTI_SPIEGAZIONE`: la chiave dell'oggetto
 * FA da identificatore, così 11 e 12 aggiungono chiavi, non un'unione a mano.
 */

import type { IngressoCostoFoglio, IngressoSimulazioneRisparmio } from '../core/index.ts';
import type { IngressoConfrontoRateMutuo } from '../core/confrontoRateMutuo.ts';
import type { IdArea } from './contenutiHome.ts';
import { ISTANZE_MUTUO } from './contenutiMutuo.ts';
import type { ChiaveStringaUtente } from './testi.ts';

/** Blocco 7: una rotta reale, non un'unione chiusa. Verificata a runtime
 *  contro le rotte registrate, non dal compilatore. */
export interface PassoSuccessivo {
  readonly percorso: string;
  readonly testo: ChiaveStringaUtente;
}

/** «Al più due», nel TIPO: tuple di lunghezza 0, 1 o 2. */
export type PassiSuccessivi =
  | readonly []
  | readonly [PassoSuccessivo]
  | readonly [PassoSuccessivo, PassoSuccessivo];

/**
 * Blocchi 5+6, indivisibili. Unione discriminata su `tipo`, switch esaustivo
 * in spiegazioneEsempio.ts. `valore-risparmi` (03) · `quote-rata-mutuo` (11,
 * DUE capitali residui — prima e ultima rata — altrimenti «250,00 €/224,21 €
 * nella prima, 1,18 € nell'ultima» richiederebbe un numero scritto a mano) ·
 * `confronto-durata-mutuo` (11, due chiamate a `calcolaRataCent` di `10`) ·
 * `confronto-tasso-mutuo` (11, chiama `calcolaConfrontoRateMutuo` di `10`,
 * non la riscrive) · `costo-su-capitale` (12).
 */
interface BloccoNumerico {
  readonly frase: ChiaveStringaUtente;
  readonly paragone: ChiaveStringaUtente;
  readonly fonte: ChiaveStringaUtente;
  readonly avvertenza: ChiaveStringaUtente;
}

export type EsempioNumerico =
  /** Argomenti FISSI: nessuna persona li digita, in nessuno dei cinque casi. */
  | (BloccoNumerico & { readonly tipo: 'valore-risparmi'; readonly ingresso: IngressoSimulazioneRisparmio })
  | (BloccoNumerico & {
      readonly tipo: 'quote-rata-mutuo';
      readonly ingresso: {
        readonly capitaleResiduoPrimaCent: number;
        readonly capitaleResiduoUltimaCent: number;
        readonly tassoAnnuoBp: number;
        readonly rataCent: number;
        readonly numeroRate: number;
      };
    })
  | (BloccoNumerico & {
      readonly tipo: 'confronto-durata-mutuo';
      readonly ingresso: {
        readonly capitaleCent: number;
        readonly tassoAnnuoBp: number;
        readonly anniA: number;
        readonly anniB: number;
      };
    })
  | (BloccoNumerico & {
      readonly tipo: 'confronto-tasso-mutuo';
      readonly ingresso: IngressoConfrontoRateMutuo;
    })
  | (BloccoNumerico & { readonly tipo: 'costo-su-capitale'; readonly ingresso: IngressoCostoFoglio });

/** Ciò che un'istanza dichiara, id escluso (la chiave in
 *  CONTENUTI_SPIEGAZIONE fa già da identificatore): 2 domanda (stessa
 *  chiave del catalogo) · 3 immagine (tupla non vuota) · 4 nomeTecnico (uno
 *  o null) · 5+6 esempio (o niente) · 7 passi (al più due) · 8 nonFa (tupla
 *  non vuota: il tipo rifiuta una pagina senza confini). */
export interface DatiSpiegazione {
  readonly area: IdArea;
  readonly domanda: ChiaveStringaUtente;
  readonly immagine: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
  readonly nomeTecnico: ChiaveStringaUtente | null;
  readonly esempio: EsempioNumerico | null;
  readonly passi: PassiSuccessivi;
  readonly nonFa: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
}

/** Un'istanza completa: `DatiSpiegazione` più l'id per riga. */
export interface PaginaSpiegazione extends DatiSpiegazione {
  readonly id: IdSpiegazione;
}

// TUTTE le istanze dichiarate, chiave = identificatore.
// valore reale …Frase: 10.000/1,02 = 9.803,92… -> 9.804 cent = 98,04 €
// perdita …Paragone:   10.000-9.804 = 196 cent = 1,96 €
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

  // Le sette istanze della 11 («approfondimento sul mutuo»), dichiarate in
  // contenutiMutuo.ts e spandute qui con lo stesso meccanismo di
  // STRINGHE_UTENTE: il registro resta UN oggetto solo.
  ...ISTANZE_MUTUO,
} as const satisfies Record<string, DatiSpiegazione>;

/** Deriva dalle chiavi sopra: un'istanza in più, nessuna unione a mano. */
export type IdSpiegazione = keyof typeof CONTENUTI_SPIEGAZIONE;

/** Istanza completa dal suo id: la chiama ogni file di schermata (03, 11, 12). */
export function paginaSpiegazione(id: IdSpiegazione): PaginaSpiegazione {
  return { id, ...CONTENUTI_SPIEGAZIONE[id] };
}

/** Per spread, non con `paginaSpiegazione`: senza l'annotazione
 *  `: PaginaSpiegazione` un test che legge `.esempio.ingresso` senza
 *  controllare `tipo` vede il tipo stretto di questa istanza. */
export const ISTANZA_INFLAZIONE_SPESA = {
  id: 'inflazione-spesa' as const,
  ...CONTENUTI_SPIEGAZIONE['inflazione-spesa'],
};

/** Tutte le pagine dichiarate, derivate da CONTENUTI_SPIEGAZIONE: da qui una
 *  futura verifica (una domanda, una sola destinazione) legge l'elenco. */
export const PAGINE_SPIEGAZIONE: readonly PaginaSpiegazione[] =
  (Object.keys(CONTENUTI_SPIEGAZIONE) as readonly IdSpiegazione[]).map(paginaSpiegazione);
