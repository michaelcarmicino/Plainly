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
 */

export const STRINGHE_UTENTE = {
  appTitolo: 'Conti Chiari',
  appSottotitolo:
    'Leggi un documento di spesa e capisci da dove viene ogni numero.',

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
} as const satisfies Record<string, string>;

export type ChiaveStringaUtente = keyof typeof STRINGHE_UTENTE;

/** Accesso tipizzato: impedisce di stampare testo non registrato. */
export const t = (chiave: ChiaveStringaUtente): string => STRINGHE_UTENTE[chiave];
