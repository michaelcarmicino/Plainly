/**
 * LA STRUTTURA DELLE PAGINE DI SPIEGAZIONE — agente ui-builder. Funzionalità 03.
 *
 * Gemello di contenutiHome.ts: qui stanno SOLO chiavi e numeri, mai parole.
 * Le parole vivono in testiSpiegazione.ts, il punto che il guardrail scandisce.
 *
 * Otto blocchi, in un ordine fisso che il TIPO impone, non la buona volontà
 * di chi scrive un'istanza:
 *   1 occhiello area (da `area`) · 2 domanda (titolo, invariata) ·
 *   3 immagine (tupla non vuota) · 4 nomeTecnico (uno solo, o null) ·
 *   5+6 esempio (frase+paragone+fonte+avvertenza insieme, o niente) ·
 *   7 passi (al più due) · 8 nonFa (tupla non vuota, mai assente).
 *
 * L'ordine di STAMPA — in particolare «prima l'immagine, poi il nome
 * tecnico» — non lo decide questo file: un oggetto non ha un ordine di
 * lettura. Lo impone PaginaSpiegazione.tsx, l'unico posto che monta i
 * blocchi a schermo.
 */

import type { IngressoSimulazioneRisparmio } from '../core/index.ts';
import type { IdArea } from './contenutiHome.ts';
import type { ChiaveStringaUtente } from './testi.ts';

/** Un valore per pagina dichiarata. Oggi una sola: l'inflazione sulla spesa. */
export type IdSpiegazione = 'inflazione-spesa';

/**
 * Blocco 7. Una rotta reale del sito, non un'unione chiusa sulle costanti di
 * rotte.ts: dalla funzionalità 14 le schermate si scoprono a runtime da
 * file, quindi un elenco chiuso qui andrebbe mantenuto a mano — esattamente
 * il problema che quel registro esiste per eliminare. «Un rimando verso il
 * nulla non è dichiarabile» resta un vincolo vero, ma verificato da un test
 * che enumera le rotte davvero registrate, non dal compilatore.
 */
export interface PassoSuccessivo {
  readonly percorso: string;
  readonly testo: ChiaveStringaUtente;
}

/**
 * «Al massimo due» come vincolo del TIPO: un'unione di tuple di lunghezza 0,
 * 1 o 2, non un array libero. Un terzo elemento non si dichiara: non passa
 * la compilazione, non serve un test che lo scopra dopo.
 */
export type PassiSuccessivi =
  | readonly []
  | readonly [PassoSuccessivo]
  | readonly [PassoSuccessivo, PassoSuccessivo];

/**
 * Blocchi 5 e 6, indivisibili: nessun campo è facoltativo, quindi «ogni
 * numero ha un paragone e una provenienza» è un campo che il compilatore
 * pretende, non una regola da ricordare. Unione discriminata su `tipo`: oggi
 * un solo caso, chi ne aggiunge uno estende qui e lo switch esaustivo in
 * spiegazioneEsempio.ts smette di compilare finché non lo gestisce.
 */
export type EsempioNumerico = {
  readonly tipo: 'valore-risparmi';
  /** Argomenti FISSI: nessuna persona li digita. */
  readonly ingresso: IngressoSimulazioneRisparmio;
  readonly frase: ChiaveStringaUtente;
  readonly paragone: ChiaveStringaUtente;
  readonly fonte: ChiaveStringaUtente;
  readonly avvertenza: ChiaveStringaUtente;
};

export interface PaginaSpiegazione {
  readonly id: IdSpiegazione;
  readonly area: IdArea;
  /** Blocco 2. La stessa chiave che l'elenco dell'area già mostra. */
  readonly domanda: ChiaveStringaUtente;
  /** Blocco 3. Tupla non vuota: da una a tre frasi. */
  readonly immagine: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
  /** Blocco 4. Uno solo, `null` quando non serve nominare niente. */
  readonly nomeTecnico: ChiaveStringaUtente | null;
  /** Blocchi 5 e 6, insieme o niente. */
  readonly esempio: EsempioNumerico | null;
  /** Blocco 7. */
  readonly passi: PassiSuccessivi;
  /** Blocco 8. Tupla non vuota: il tipo rifiuta una pagina senza confini. */
  readonly nonFa: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
}

/**
 * L'istanza di riferimento. Ingresso: 10.000 cent (100 €), 1 anno, 200 bp —
 * lo stesso esempio che scrittura-e-accessibilita.md porta come modello
 * della regola «ogni numero ha un paragone concreto»: una banconota che
 * chiunque ha avuto in mano, non una cifra scelta per far tornare un conto.
 *
 * Frase (blocco 5) e paragone leggono due campi distinti dello stesso
 * `Esito` di `simulaRisparmio` — non due calcoli separati che potrebbero
 * divergere, ma due letture dello stesso risultato già verificato:
 *
 * // valore reale, in …Frase: 10.000 / 1,02 = 9.803,92… -> 9.804 cent = 98,04 €
 * // perdita, in …Paragone:   10.000 - 9.804 = 196 cent = 1,96 €
 */
export const ISTANZA_INFLAZIONE_SPESA: PaginaSpiegazione = {
  id: 'inflazione-spesa',
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
};

/**
 * Tutte le pagine dichiarate. Oggi una sola, ma è già il posto da cui una
 * futura verifica strutturale (una domanda, una sola destinazione; ogni
 * pagina risponde a una domanda della propria area) deriva l'elenco intero,
 * invece di controllare solo l'istanza di turno.
 */
export const PAGINE_SPIEGAZIONE: readonly PaginaSpiegazione[] = [ISTANZA_INFLAZIONE_SPESA];
