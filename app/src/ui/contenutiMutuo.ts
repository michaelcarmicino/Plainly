/**
 * LE SETTE ISTANZE DEL MUTUO — agente ui-builder. Funzionalità 11.
 *
 * Spandute in CONTENUTI_SPIEGAZIONE (contenutiSpiegazione.ts) con lo stesso
 * meccanismo di STRINGHE_UTENTE: il contenitore resta un oggetto solo. Le
 * parole vivono in testiMutuo.ts / testiMutuoConcetti.ts.
 *
 * Solo i concetti 1, 3 e 4 hanno un esempio numerico (Elaborazione della
 * spec 11); tutti e cinque gli altri campi restano dichiarati per intero,
 * `nomeTecnico`/`esempio` a `null` dove il concetto è solo meccanismo.
 *
 * Mutuo d'esempio, unico per tutta la funzionalità: 100.000,00 € (10.000.000
 * cent), 3,00%/300 rate contro 4,00% e contro 30 anni — gli stessi numeri
 * verificati a mano in docs/features/11-approfondimento-sul-mutuo.md.
 */

import type { DatiSpiegazione } from './contenutiSpiegazione.ts';

/** Duplica il percorso di schermate/10-rata-mutuo.ts: stesso motivo di
 *  PERCORSO_SCHERMATA_RISPARMI in catalogoDomande.ts (evita un ciclo
 *  d'import verso il registro delle schermate). */
const PERCORSO_SIMULATORE_RATA = '#/rata-del-mutuo';
const PASSO_SIMULATORE = [
  { percorso: PERCORSO_SIMULATORE_RATA, testo: 'mutuoLinkSimulatore' },
] as const;

export const ISTANZE_MUTUO = {
  'mutuo-ammortamento': {
    area: 'futuro',
    domanda: 'mutuoAmmortamentoDomanda',
    immagine: ['mutuoAmmortamentoImmagine1', 'mutuoAmmortamentoImmagine2'],
    nomeTecnico: 'mutuoAmmortamentoNomeTecnico',
    esempio: {
      tipo: 'quote-rata-mutuo',
      ingresso: {
        capitaleResiduoPrimaCent: 10_000_000,
        capitaleResiduoUltimaCent: 47_303,
        tassoAnnuoBp: 300,
        rataCent: 47_421,
        numeroRate: 300,
      },
      frase: 'mutuoAmmortamentoFrase',
      paragone: 'mutuoAmmortamentoParagone',
      fonte: 'mutuoIpotesiEsempio',
      avvertenza: 'mutuoAmmortamentoAvvertenza',
    },
    passi: PASSO_SIMULATORE,
    nonFa: ['mutuoAmmortamentoConfine'],
  },

  'mutuo-tan-taeg': {
    area: 'futuro',
    domanda: 'mutuoTanTaegDomanda',
    immagine: ['mutuoTanTaegImmagine1', 'mutuoTanTaegImmagine2'],
    nomeTecnico: null,
    esempio: null,
    passi: [],
    nonFa: ['mutuoTanTaegConfine'],
  },

  'mutuo-durata': {
    area: 'futuro',
    domanda: 'mutuoDurataDomanda',
    immagine: ['mutuoDurataImmagine1', 'mutuoDurataImmagine2'],
    nomeTecnico: null,
    esempio: {
      tipo: 'confronto-durata-mutuo',
      ingresso: { capitaleCent: 10_000_000, tassoAnnuoBp: 300, anniA: 25, anniB: 30 },
      frase: 'mutuoDurataFrase',
      paragone: 'mutuoDurataParagone',
      fonte: 'mutuoIpotesiEsempio',
      avvertenza: 'mutuoDurataAvvertenza',
    },
    passi: PASSO_SIMULATORE,
    nonFa: ['mutuoDurataConfine'],
  },

  'mutuo-fisso-variabile': {
    area: 'futuro',
    domanda: 'mutuoFissoVariabileDomanda',
    immagine: ['mutuoFissoVariabileImmagine1', 'mutuoFissoVariabileImmagine2'],
    nomeTecnico: 'mutuoFissoVariabileNomeTecnico',
    esempio: {
      tipo: 'confronto-tasso-mutuo',
      ingresso: {
        capitaleCent: 10_000_000,
        anni: 25,
        tassoFissoAnnuoBp: 300,
        tassoVariabilePartenzaAnnuoBp: 400,
      },
      frase: 'mutuoFissoVariabileFrase',
      paragone: 'mutuoFissoVariabileParagone',
      fonte: 'mutuoIpotesiEsempio',
      avvertenza: 'mutuoFissoVariabileAvvertenza',
    },
    passi: PASSO_SIMULATORE,
    nonFa: ['mutuoFissoVariabileConfine'],
  },

  'mutuo-spese-iniziali': {
    area: 'futuro',
    domanda: 'mutuoSpeseInizialiDomanda',
    immagine: [
      'mutuoSpeseInizialiImmagine1',
      'mutuoSpeseIstruttoria',
      'mutuoSpeseIpoteca',
      'mutuoSpeseNotaio',
      'mutuoSpeseImposta',
      'mutuoSpesePerizia',
      'mutuoSpeseAssicurazione',
    ],
    nomeTecnico: null,
    esempio: null,
    passi: [],
    nonFa: ['mutuoSpeseInizialiConfine'],
  },

  'mutuo-surroga': {
    area: 'futuro',
    domanda: 'mutuoSurrogaDomanda',
    immagine: ['mutuoSurrogaImmagine1'],
    nomeTecnico: 'mutuoSurrogaNomeTecnico',
    esempio: null,
    passi: [],
    nonFa: ['mutuoSurrogaConfine'],
  },

  'mutuo-rata-sospesa': {
    area: 'futuro',
    domanda: 'mutuoRataSospesaDomanda',
    immagine: ['mutuoRataSospesaImmagine1', 'mutuoRataSospesaRinegoziazione'],
    nomeTecnico: 'mutuoRataSospesaNomeTecnico',
    esempio: null,
    passi: [],
    nonFa: ['mutuoRataSospesaConfine'],
  },
} as const satisfies Record<string, DatiSpiegazione>;
