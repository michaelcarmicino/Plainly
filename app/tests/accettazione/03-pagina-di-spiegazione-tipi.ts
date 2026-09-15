/**
 * LA PAGINA DI SPIEGAZIONE — CASI DI TIPO — agente tester. Funzionalità 03.
 * Da docs/test/03-pagina-di-spiegazione.md, gruppo 2: CL-01..CL-08 (obbligo
 * dei blocchi 3, 5/6, 8 e singolarità del blocco 4) e CL-18 (il blocco 7
 * oltre i due). CF-12 richiama CASO_CL01/CASO_CL02, non li ripete.
 *
 * File volutamente `.ts`, non `.test.ts`: vite.config.ts include solo
 * `tests/**\/*.test.ts`, quindi vitest non lo esegue mai — e infatti non
 * potrebbe: ogni oggetto qui sotto è scritto apposta per NON compilare.
 * `tsconfig.json` include «tests» per intero, quindi `npx tsc --noEmit` (e
 * `npm run build`) lo controllano comunque. Si verifica così, non con
 * un'asserzione vitest: un caso di tipo non gira a runtime.
 *
 * `@ts-expect-error` (non `@ts-ignore`, vietato da standard-codice.md):
 * dichiara che la riga seguente ha un errore, e fa fallire `tsc` se un
 * giorno quell'errore sparisse — il tipo si sarebbe allentato, e il caso lo
 * scoprirebbe da solo. Ogni oggetto è `export` solo perché `noUnusedLocals`
 * aggiungerebbe altrimenti un secondo errore sulla stessa riga: nessuno di
 * questi export viene mai letto altrove.
 */

import type {
  EsempioNumerico,
  PaginaSpiegazione,
  PassiSuccessivi,
} from '../../src/ui/contenutiSpiegazione.ts';

const IMMAGINE_VALIDA = ['spiegazioneInflazioneSpesaImmagine1'] as const;
const NON_FA_VALIDO = [
  'spiegazioneInflazioneSpesaNonFa1',
  'spiegazioneInflazioneSpesaNonFa2',
] as const;

// CL-01 — «nonFa» omesso: obbligatorio, non «di solito presente».
// @ts-expect-error CL-01: proprietà «nonFa» mancante.
export const CASO_CL01: PaginaSpiegazione = {
  id: 'inflazione-spesa',
  area: 'costo-della-vita',
  domanda: 'area1Altra1',
  immagine: IMMAGINE_VALIDA,
  nomeTecnico: null,
  esempio: null,
  passi: [],
};

// CL-02 — «nonFa: []»: presente ma vuoto, tupla non vuota violata diversamente da CL-01.
export const CASO_CL02: PaginaSpiegazione = {
  id: 'inflazione-spesa',
  area: 'costo-della-vita',
  domanda: 'area1Altra1',
  immagine: IMMAGINE_VALIDA,
  nomeTecnico: null,
  esempio: null,
  passi: [],
  // @ts-expect-error CL-02: «[]» non è assegnabile alla tupla non vuota del blocco 8.
  nonFa: [],
};

// CL-03 — «immagine» omessa: il blocco 3 è obbligatorio quanto l'8.
// @ts-expect-error CL-03: proprietà «immagine» mancante.
export const CASO_CL03: PaginaSpiegazione = {
  id: 'inflazione-spesa',
  area: 'costo-della-vita',
  domanda: 'area1Altra1',
  nomeTecnico: null,
  esempio: null,
  passi: [],
  nonFa: NON_FA_VALIDO,
};

// CL-04 — «immagine: []»: stesso principio di CL-02, sul blocco 3.
export const CASO_CL04: PaginaSpiegazione = {
  id: 'inflazione-spesa',
  area: 'costo-della-vita',
  domanda: 'area1Altra1',
  // @ts-expect-error CL-04: «[]» non è assegnabile alla tupla non vuota del blocco 3.
  immagine: [],
  nomeTecnico: null,
  esempio: null,
  passi: [],
  nonFa: NON_FA_VALIDO,
};

// CL-05 — «nomeTecnico» non accetta una lista: un concetto per schermata.
export const CASO_CL05: PaginaSpiegazione = {
  id: 'inflazione-spesa',
  area: 'costo-della-vita',
  domanda: 'area1Altra1',
  immagine: IMMAGINE_VALIDA,
  // @ts-expect-error CL-05: il tipo è «ChiaveStringaUtente | null», non un array.
  nomeTecnico: ['spiegazioneInflazioneSpesaNomeTecnico', 'spiegazioneTitoloEsempio'],
  esempio: null,
  passi: [],
  nonFa: NON_FA_VALIDO,
};

// CL-06 — «esempio» senza «paragone»: l'indivisibilità 5-6 imposta dal tipo.
// @ts-expect-error CL-06: proprietà «paragone» mancante in EsempioNumerico.
export const CASO_CL06: EsempioNumerico = {
  tipo: 'valore-risparmi',
  ingresso: { risparmioCent: 10_000, anni: 1, inflazioneAnnuaBp: 200 },
  frase: 'spiegazioneInflazioneSpesaFrase',
  fonte: 'spiegazioneInflazioneSpesaFonte',
  avvertenza: 'spiegazioneInflazioneSpesaAvvertenza',
};

// CL-07 — «esempio» senza «fonte»: il blocco 6 è obbligatorio se c'è il 5.
// @ts-expect-error CL-07: proprietà «fonte» mancante in EsempioNumerico.
export const CASO_CL07: EsempioNumerico = {
  tipo: 'valore-risparmi',
  ingresso: { risparmioCent: 10_000, anni: 1, inflazioneAnnuaBp: 200 },
  frase: 'spiegazioneInflazioneSpesaFrase',
  paragone: 'spiegazioneInflazioneSpesaParagone',
  avvertenza: 'spiegazioneInflazioneSpesaAvvertenza',
};

// CL-08 — «esempio» senza «avvertenza»: un numero non è un pronostico, sempre dichiarato.
// @ts-expect-error CL-08: proprietà «avvertenza» mancante in EsempioNumerico.
export const CASO_CL08: EsempioNumerico = {
  tipo: 'valore-risparmi',
  ingresso: { risparmioCent: 10_000, anni: 1, inflazioneAnnuaBp: 200 },
  frase: 'spiegazioneInflazioneSpesaFrase',
  paragone: 'spiegazioneInflazioneSpesaParagone',
  fonte: 'spiegazioneInflazioneSpesaFonte',
};

/**
 * CL-18 — «passi» oltre i due. La nota introduttiva di fase 1 lo dava per
 * caso di STRUTTURA (a runtime), perché la specifica mostrava `passi` come
 * `readonly PassoSuccessivo[]`, un array libero. Il codice dichiara invece
 * `PassiSuccessivi` come unione di tuple di lunghezza 0, 1, 2: un
 * MIGLIORAMENTO rispetto alla specifica — non un difetto — che sposta
 * questo caso da CL-18-a-runtime a CL-18-di-tipo. Segnalato nel referto.
 */
// @ts-expect-error CL-18: un terzo elemento non è assegnabile a «PassiSuccessivi».
export const CASO_CL18: PassiSuccessivi = [
  { percorso: '#/', testo: 'navHome' },
  { percorso: '#/', testo: 'navHome' },
  { percorso: '#/', testo: 'navHome' },
];

/**
 * CF-12 — «un contenitore che permette di scrivere un consiglio, prima o
 * poi lo riceve»: stesso meccanismo di CL-01 e CL-02, qui sopra, non
 * ripetuto. CASO_CL01 e CASO_CL02 SONO la prova che il tipo, non una
 * revisione a valle, impedisce una pagina senza confini dichiarati.
 */
