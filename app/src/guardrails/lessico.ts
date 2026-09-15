/**
 * LESSICO PRESCRITTIVO VIETATO — agente guardrail-officer.
 *
 * Il prodotto SPIEGA e CALCOLA, non consiglia. Questo file è la forma
 * ESEGUIBILE di quella regola: non è una linea guida scritta in un
 * documento, è un elenco che un test legge e su cui la build fallisce.
 *
 * Ogni voce ha: una radice (regex), il motivo del divieto, e una
 * riformulazione lecita da usare al suo posto. Tipi e costruttore di
 * radici in `struttura.ts`: qui restano solo i dati.
 */

import { confineParola, type GravitaViolazione, type TermineVietato } from './struttura.ts';

export type { GravitaViolazione, TermineVietato };

const r = confineParola;

export const LESSICO_PRESCRITTIVO: readonly TermineVietato[] = [
  {
    id: 'consigliare',
    radice: r('consigli\\p{L}*|consiglia\\p{L}*|sconsigli\\p{L}*'),
    motivo: 'È una raccomandazione personalizzata: vietata dal vincolo di dominio.',
    riformulazione: 'Descrivi il calcolo: «questa voce pesa il X% del totale».',
    gravita: 'blocco',
  },
  {
    id: 'suggerire',
    radice: r('suggeri\\p{L}*|suggerim\\p{L}*'),
    motivo: 'Indica all\'utente cosa fare invece di spiegargli cosa sta leggendo.',
    riformulazione: 'Esponi il dato e la sua provenienza, senza indicare un\'azione.',
    gravita: 'blocco',
  },
  {
    id: 'raccomandare',
    radice: r('raccomand\\p{L}*'),
    motivo: 'Raccomandazione esplicita.',
    riformulazione: 'Riporta il numero e la riga originale da cui viene.',
    gravita: 'blocco',
  },
  {
    // «preferibile» aggiunto in occasione della 02 (vedi
    // docs/features/02-catalogo-domande-reali-per-macrocategoria.md, punto 3
    // delle dichiarazioni tecniche): stessa famiglia semantica di
    // «conveniente», quasi sempre un giudizio di valore o un consiglio
    // travestito da impersonale («è preferibile fare X»), con un registro
    // formale che questo sito non usa mai per spiegare — zero occorrenze
    // verificate in src/, tests/, types/, fixtures/ al momento dell'aggiunta.
    //
    // «meglio» valutato nella stessa occasione e DELIBERATAMENTE escluso:
    // è un avverbio a uso quasi sempre innocuo e centrale nel registro
    // «amico che spiega» che questo progetto impone («si capisce meglio con
    // un esempio», «spiegare meglio un calcolo») — bloccarlo produrrebbe
    // falsi positivi sistematici proprio contro il tono richiesto. La
    // formulazione comparativa dell'area investimenti nel documento
    // d'origine (task 02, sezione 6 — il confronto fra tre prodotti per
    // nome) è già neutralizzata dalla riscrittura in `area3Altra5`; che non
    // ricompaia in `src/`, commenti compresi, lo sorveglia CF-03 in
    // docs/test/02-catalogo-domande.md — un'asserzione ricontrollata a ogni
    // build, non un'affermazione scritta qui una volta e mai più verificata.
    // Il rischio concreto che «meglio» dovrebbe coprire resta comunque già
    // chiuso altrove. Decisione di guardrail-officer, non dell'architetto:
    // si aggiunge un termine, non se ne toglie uno già bloccato.
    id: 'comparativo-valore',
    radice: r(
      'miglior\\p{L}*|peggior\\p{L}*|ottim\\p{L}*|convenient\\p{L}*|preferibil\\p{L}*',
    ),
    motivo: 'Giudizio di valore su un prodotto finanziario.',
    riformulazione: 'Confronto numerico esplicito: «costa X € in più su 12 mesi».',
    gravita: 'blocco',
  },
  {
    id: 'convenienza',
    radice: r('convien\\p{L}*|convenga|converrebbe'),
    motivo: 'Afferma una convenienza soggettiva per l\'utente.',
    riformulazione: 'Mostra la differenza di importo, lascia la conclusione a chi legge.',
    gravita: 'blocco',
  },
  {
    // «passa a» falliva su «passa al mercato libero»: le preposizioni
    // articolate (al, allo, alla, ai, agli, alle) fondono "a" con
    // l'articolo — non un limite di perimetro, una radice che non copriva
    // la forma più comune. Stesso difetto risolto sotto in dovere-personale.
    // «cambia offerta»: registro di «cambia fornitore» già bloccato, gap
    // della 05 (CF-05). Zero occorrenze pregresse per entrambe le aggiunte.
    id: 'imperativo-scelta',
    radice: r('scegli|scegliere|passa\\s(?:ad?|al|allo|alla|ai|agli|alle)|cambia\\sfornitore|cambia\\soffert\\p{L}*|apri\\sun\\sconto|chiudi\\sil\\sconto'),
    motivo: 'Imperativo che indica una scelta contrattuale.',
    riformulazione: 'Elenca le voci di costo; la scelta non è del software.',
    gravita: 'blocco',
  },
  {
    id: 'investimento',
    radice: r('investi|investire|rendiment\\p{L}*\\sgarantit\\p{L}*|compra|comprare|vendi|vendere|acquista\\sil'),
    motivo: 'Raccomandazione di investimento: fuori perimetro e potenzialmente illecita.',
    riformulazione: 'Il prodotto non tratta investimenti. Rimuovere la frase.',
    gravita: 'blocco',
  },
  {
    // Stesso difetto di «passa a» sopra, esteso alle forme articolate
    // (al…alle; del…delle). Zero occorrenze pregresse per entrambe.
    id: 'dovere-personale',
    radice: r('dovresti|dovrebbe\\p{L}*|ti\\sconviene|fai\\sbene\\s(?:ad?|al|allo|alla|ai|agli|alle)|evita\\s(?:di|del|dello|della|dei|degli|delle)'),
    motivo: 'Consulenza personalizzata rivolta al singolo utente.',
    riformulazione: 'Frase impersonale e descrittiva: «la voce X è presente N volte».',
    gravita: 'blocco',
  },
  {
    id: 'adatto-a-te',
    radice: r('adatt\\p{L}*\\sa\\ste|su\\smisura\\sper\\ste|ideale\\sper\\ste|fa\\sper\\ste'),
    motivo: 'Profilazione: implica una valutazione del profilo dell\'utente.',
    riformulazione: 'Rimuovere. Il software non profila e non valuta le persone.',
    gravita: 'blocco',
  },
  {
    id: 'promessa-risparmio',
    radice: r('risparmier\\p{L}*|guadagner\\p{L}*|ti\\sfar\\p{L}*\\srisparmiare'),
    motivo: 'Promessa di un risultato futuro.',
    riformulazione: 'Proiezione aritmetica dichiarata come tale: «su 12 mesi, a parità di voci».',
    gravita: 'blocco',
  },
  {
    id: 'garanzia',
    radice: r('garantit\\p{L}*|sicuro\\sal|senza\\srischi|zero\\srischi'),
    motivo: 'Garanzia di risultato: vietata.',
    riformulazione: 'Dichiara invece il limite del calcolo.',
    gravita: 'attenzione',
  },
  {
    id: 'urgenza',
    radice: r('affrettati|subito\\sprima\\sche|offerta\\slimitata|imperdibil\\p{L}*'),
    motivo: 'Leva persuasiva: incompatibile con uno strumento educativo.',
    riformulazione: 'Rimuovere ogni pressione temporale.',
    gravita: 'attenzione',
  },
];

/** Radici vietate anche negli IDENTIFICATORI del codice (nomi di tipi,
 *  funzioni, componenti). Controllate da app/tests/lessico-ui.test.ts. */
export const RADICI_VIETATE_NEGLI_IDENTIFICATORI: readonly string[] = [
  'suggerisci',
  'suggerimento',
  'consiglia',
  'consiglio',
  'raccomanda',
  'migliore',
  'conviene',
  'scegli',
];
