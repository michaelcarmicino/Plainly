/**
 * REGISTRO UNICO DELLE STRINGHE RIVOLTE ALL'UTENTE.
 * Agente: ui-builder.
 *
 * Regola: la UI NON contiene testo letterale. Ogni parola che l'utente
 * legge passa da qui, così il test in app/tests/lessico-ui.test.ts ha un
 * punto unico da scandire e la build fallisce se entra una formulazione
 * prescrittiva.
 *
 * PER LA DEMO (slide 6): la riga da incollare qui per far fallire la build
 * di proposito è in testa a app/tests/lessico-ui.test.ts. Non è riportata
 * in questo file perché il guardrail scandisce anche i commenti dei
 * sorgenti: un esempio scritto qui renderebbe `npm test` rosso di default.
 *
 * Le stringhe della schermata sui risparmi fermi stanno in un file affiancato
 * — testiSimulazione.ts — e quelle della pagina «da dove vengono i numeri»
 * in testiFonti.ts, per non superare le 150 righe. Entrano qui con lo
 * spread: il registro da scandire resta UN oggetto solo.
 */

import { STRINGHE_FONTI } from './testiFonti.ts';
import { STRINGHE_SIMULAZIONE } from './testiSimulazione.ts';

export const STRINGHE_UTENTE = {
  appTitolo: 'Plainly',
  appSottotitolo:
    'Leggi un documento di spesa e capisci da dove viene ogni numero.',

  // --- Home: le tre porte -------------------------------------------------
  homeIntestazione:
    'Da dove nasce la tua domanda? Qui sotto ci sono tre aree: dentro ognuna, le domande scritte con le parole di tutti i giorni.',
  homeAccessoRapido:
    'Se hai già una bolletta o una busta paga davanti, puoi leggerla voce per voce.',

  // --- Navigazione, uguale su ogni pagina ---------------------------------
  navHome: 'Pagina iniziale',
  navIndietro: 'Indietro',
  navPercorso: 'Dove ti trovi',

  // Una sola stringa per tutte le aree: il numero arriva da
  // contaAltreDomande() in contenutiHome.ts e non è scritto a mano.
  areaBadge: 'altre {n} domande qui dentro',

  // --- Area 1: il costo della vita ----------------------------------------
  area1Titolo: 'Il costo della vita',
  area1Domanda: 'Perché la bolletta è così alta questo mese?',
  area1Altra1:
    'Con gli stessi soldi della spesa, quanto porto a casa rispetto a un anno fa?',
  area1Altra2: 'Quanto mi costa la casa ogni mese, tutto compreso?',
  area1Altra3:
    'Lo stipendio è uguale ma i prezzi no: di quanto si è allargata la differenza?',

  // --- Area 2: il lavoro --------------------------------------------------
  area2Titolo: 'Il lavoro',
  area2Domanda: 'Il mio settore è a rischio nei prossimi anni?',
  area2Altra1: 'Se perdo il lavoro, quanto prendo ogni mese e per quanto tempo?',
  area2Altra2:
    'Sulla busta paga c\'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?',
  area2Altra3:
    'Lavoro in proprio: quanto devo mettere da parte per tasse e contributi?',

  // --- Area 3: il futuro --------------------------------------------------
  area3Titolo: 'Il futuro',
  area3Domanda: 'Quanto sarà la mia pensione?',
  area3Altra1: 'Se metto via 50 € al mese, in dieci anni quanto diventano?',
  area3Altra2: 'Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta?',
  area3Altra3:
    'I risparmi fermi sul conto: che cosa succede loro mentre i prezzi salgono?',

  sezioneDocumento: 'Il documento',
  sezioneLettura: 'Che cosa dice, voce per voce',
  sezioneVerifica: 'Verifica di comprensione',
  sezioneLimiti: 'Che cosa questo strumento non fa',

  etichettaTotale: 'Totale del documento',
  etichettaProiezione: 'Stesso importo proiettato su 12 mesi',
  etichettaPeso: 'Peso sul totale',
  etichettaRigaOriginale: 'Riga sul documento originale',
  etichettaQuadratura: 'Somma delle voci confrontata con il totale stampato',

  notaProiezione:
    'La proiezione è una moltiplicazione per 12 delle voci ricorrenti. Non è una previsione: assume che le voci restino identiche.',
  notaEtichetteOriginali:
    'Le etichette sono riportate come compaiono sul documento. Non vengono riscritte, per non alterarne il significato.',
  notaOffline:
    'Tutti i calcoli avvengono su questo dispositivo. Nessun dato esce da qui e nessuna connessione è necessaria.',

  limiteNoConsulenza:
    'Questo strumento spiega e calcola. Non indica quali prodotti o contratti adottare e non valuta la situazione personale di chi lo usa.',
  limiteNoParsing:
    'I documenti non vengono letti automaticamente: i dati mostrati provengono da un esempio strutturato a mano.',
  limiteCampione:
    'La misura di comprensione è raccolta su un campione ridotto e va letta come indicazione, non come risultato statistico.',

  verificaIntro:
    'Rispondi prima di leggere la spiegazione, poi di nuovo dopo. Il confronto fra i due esiti è la misura del cambiamento.',
  verificaPrima: 'Prima della lettura',
  verificaDopo: 'Dopo la lettura',
  verificaDelta: 'Differenza fra i due punteggi',

  statoPlaceholder:
    'Contenuto non ancora disponibile: lo scenario di dominio è in corso di definizione.',
  statoQuadraturaOk: 'La somma delle voci coincide con il totale stampato.',
  statoQuadraturaScarto:
    'La somma delle voci non coincide con il totale stampato. Lo scarto è riportato qui sotto senza essere corretto.',

  // TODO(scenario): testi specifici dello scenario, una volta congelato
  // (bolletta · estratto conto · budget · simulazione di risparmio).

  ...STRINGHE_SIMULAZIONE,
  ...STRINGHE_FONTI,
} as const satisfies Record<string, string>;

export type ChiaveStringaUtente = keyof typeof STRINGHE_UTENTE;

/** Accesso tipizzato: impedisce di stampare testo non registrato. */
export const t = (chiave: ChiaveStringaUtente): string => STRINGHE_UTENTE[chiave];
