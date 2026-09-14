/**
 * CONTRATTI DI DOMINIO — "Plainly"
 * =====================================================================
 * QUESTI CONTRATTI SI CONGELANO A T+1:40.
 * Dopo quel momento si crea il file `.contracts-frozen` nella root e un
 * hook PreToolUse blocca ogni scrittura sotto app/types/.
 * Da lì in avanti i contratti SI ESTENDONO (campi opzionali, nuovi tipi
 * in altri file), NON SI RISCRIVONO.
 * =====================================================================
 *
 * REGOLE DI NAMING NON NEGOZIABILI (vincolo di dominio):
 * il prodotto SPIEGA e CALCOLA, non consiglia. Nessun identificatore in
 * questo repository può contenere: suggerisci / consiglia / migliore /
 * raccomanda / conviene / scegli. Il test in app/tests/lessico-ui.test.ts
 * fa fallire la build se accade.
 *
 * CONVENZIONI:
 * - Tutti gli importi sono INTERI in CENTESIMI di euro (`...Cent`).
 *   Nessun float nel dominio: i calcoli su bollette e commissioni devono
 *   essere riproducibili al centesimo.
 * - Tutte le percentuali sono in PUNTI BASE (`...Bp`, 1% = 100 bp).
 * - La formattazione italiana (1.234,56 · 5,90%) è responsabilità del
 *   layer di presentazione, mai del dominio.
 */

/** Scenario applicativo. L'idea non è ancora congelata: il core deve
 *  reggere tutti e quattro i casi dentro il tema. */
export type Scenario =
  | 'bolletta'          // lettura di una bolletta (energia, gas, telco)
  | 'estratto-conto'    // costi e commissioni di un conto corrente
  | 'budget'            // budget personale mensile
  | 'simulazione-risparmio'; // accantonamento nel tempo

/** Come è stata ottenuta una voce. A T+0:15 esiste solo 'fixture':
 *  l'agente data-ingest NON è attivato (vedi agents/02-data-ingest.md). */
export type Provenienza = 'fixture' | 'inserimento-manuale';

export type CategoriaVoce =
  | 'canone'
  | 'commissione'
  | 'imposta'
  | 'consumo'
  | 'una-tantum'
  | 'entrata'
  | 'altro'; // TODO(scenario): affinare la tassonomia quando l'idea è congelata

/** Una singola riga leggibile del documento che l'utente porta. */
export interface VoceDocumento {
  readonly id: string;
  /** Etichetta COSÌ COM'È SCRITTA sul documento originale.
   *  Non va riscritta né "tradotta": alterarla altererebbe il significato
   *  dell'informazione originale, che è vietato. */
  readonly etichettaOriginale: string;
  readonly categoria: CategoriaVoce;
  readonly importoCent: number;
  /** Ricorrenza mensile della voce, se nota. */
  readonly ricorrente?: boolean;
  /** Aliquota/percentuale associata, in punti base. Es. 5,90% => 590. */
  readonly aliquotaBp?: number;
  /** Quantità consumata (kWh, Smc, GB...). TODO(scenario): unità di misura. */
  readonly quantita?: number;
  readonly unitaMisura?: string;
}

/** ---------------------------------------------------------------
 *  INPUT: ciò che l'utente porta, già in forma strutturata.
 *  --------------------------------------------------------------- */
export interface DocumentoUtente {
  readonly id: string;
  readonly scenario: Scenario;
  readonly provenienza: Provenienza;
  /** Periodo di riferimento in ISO 8601 (YYYY-MM-DD). */
  readonly periodoInizio: string;
  readonly periodoFine: string;
  /** Totale dichiarato SUL DOCUMENTO. Il core verifica la quadratura
   *  contro la somma delle voci e segnala lo scarto, non lo corregge. */
  readonly totaleDichiaratoCent: number;
  readonly voci: readonly VoceDocumento[];
  /** TODO(scenario): campi specifici (fornitore, IBAN mascherato, POD...). */
  readonly metadati?: Readonly<Record<string, string>>;
}

/** ---------------------------------------------------------------
 *  OUTPUT: ciò che il core calcola. Deterministico, offline, puro.
 *  --------------------------------------------------------------- */

/** Una voce dopo il calcolo: importo, peso relativo, spiegazione. */
export interface VoceCalcolata {
  readonly id: string;
  readonly etichettaOriginale: string;
  readonly categoria: CategoriaVoce;
  readonly importoCent: number;
  /** Peso sul totale, in punti base. */
  readonly pesoBp: number;
  /** Spiegazione FATTUALE di come si ottiene il numero.
   *  Descrive il calcolo, non che cosa l'utente dovrebbe fare. */
  readonly spiegazione: string;
  /** Riferimento alla riga del documento originale, per tracciabilità. */
  readonly rifOriginale: string;
}

export interface QuadraturaTotale {
  readonly sommaVociCent: number;
  readonly totaleDichiaratoCent: number;
  readonly scartoCent: number;
  readonly quadra: boolean;
}

export interface LetturaCalcolata {
  readonly documentoId: string;
  readonly scenario: Scenario;
  readonly totaleCent: number;
  readonly quadratura: QuadraturaTotale;
  readonly voci: readonly VoceCalcolata[];
  /** Aggregati per categoria, in centesimi. */
  readonly perCategoriaCent: Readonly<Record<string, number>>;
  /** Costi ricorrenti proiettati su 12 mesi. Proiezione aritmetica,
   *  non una previsione. */
  readonly proiezioneAnnuaCent: number;
  /** Voci che il core non è riuscito a classificare: dichiarate, mai
   *  nascoste. Fanno parte dei limiti dichiarati in slide 9. */
  readonly nonClassificate: readonly string[];
}

/** ---------------------------------------------------------------
 *  MISURA DEL MIGLIORAMENTO (agente impact-analyst)
 *  --------------------------------------------------------------- */

export interface DomandaComprensione {
  readonly id: string;
  readonly testo: string;
  readonly opzioni: readonly string[];
  readonly indiceCorretto: number;
  /** Perché la risposta è quella. Fattuale. */
  readonly motivazione: string;
}

export interface RispostaUtente {
  readonly domandaId: string;
  readonly indiceScelto: number;
  readonly msImpiegati?: number;
}

export interface EsitoQuestionario {
  readonly risposte: readonly RispostaUtente[];
  /** Risposte corrette su totale. */
  readonly corrette: number;
  readonly totale: number;
  /** Punteggio 0..100, intero. */
  readonly punteggio: number;
}

/** Prima / dopo: il numero che va in slide 9. */
export interface VerificaComprensione {
  readonly documentoId: string;
  readonly domande: readonly DomandaComprensione[];
  readonly prima: EsitoQuestionario | null;
  readonly dopo: EsitoQuestionario | null;
  /** dopo.punteggio - prima.punteggio. null se una delle due manca. */
  readonly deltaPunteggio: number | null;
  /** Numerosità del campione: a un hackathon è piccola e va dichiarata. */
  readonly numeroPartecipanti: number;
  /** Limiti dichiarati, mostrati in slide 9 insieme al risultato. */
  readonly limitiDichiarati: readonly string[];
}

/** ---------------------------------------------------------------
 *  EVIDENCE: tutto ciò che finisce nelle slide.
 *  Ogni campo è opzionale: una evidenza mancante deve produrre un
 *  placeholder visibile nel deck, mai un errore di build.
 *  --------------------------------------------------------------- */

export interface EvidenzaAgente {
  readonly agente: string;
  readonly directoryPosseduta: string;
  readonly fileToccati: readonly string[];
  readonly commit: number;
  readonly primoCommit: string | null;
  readonly ultimoCommit: string | null;
}

/** presentation/evidence/process.json — slide 3 e 7. */
export interface EvidenzaProcesso {
  readonly generatoIl: string;
  readonly agenti: readonly EvidenzaAgente[];
  readonly agentiAttivi: number;
  readonly commitTotali: number;
  readonly durataPerFascia: Readonly<Record<string, number>>;
}

/** presentation/evidence/evolution.json — slide 8. */
export interface EvidenzaEvoluzione {
  readonly generatoIl: string;
  readonly tagRiferimento: string;
  readonly tagPresente: boolean;
  readonly minutiTrascorsi: number;
  readonly directoryToccate: readonly string[];
  readonly fileModificati: readonly string[];
  /** IL NUMERO CHE CONTA: file sotto app/types/ modificati dopo il freeze. */
  readonly contrattiModificatiDopoFreeze: number;
  readonly note: string;
}

/** Radice consumata da presentation/build-deck.ts. */
export interface Evidence {
  readonly processo?: EvidenzaProcesso;
  readonly evoluzione?: EvidenzaEvoluzione;
  readonly comprensione?: VerificaComprensione;
  readonly lettura?: LetturaCalcolata;
  readonly screenshot?: readonly string[];
  /** TODO(scenario): evidenza specifica dello scenario congelato. */
  readonly extra?: Readonly<Record<string, unknown>>;
}
