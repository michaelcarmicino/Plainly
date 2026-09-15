/**
 * DALL'ESEMPIO DICHIARATO AL NUMERO DA MOSTRARE — agente ui-builder.
 * Funzionalità 03.
 *
 * Nessun calcolo qui dentro: solo il ponte fra ciò che un'istanza dichiara e
 * la funzione del core che lo trasforma in un risultato, più il
 * confezionamento dei valori pronti per i segnaposto di <Testo>. Stesso
 * confine che motiviRisparmio.ts già rispetta per la 07.
 *
 * Dove esiste una funzione del core che PUÒ rifiutare un ingresso
 * (`simulaRisparmio`, `traduciCostoInEuro`), si chiama quella e non
 * l'aritmetica pura: è ciò che rende raggiungibile lo stato «errore»,
 * obbligatorio quanto gli altri tre. Per un ingresso valido il numero
 * prodotto è identico, perché il ramo riuscito richiama proprio
 * quell'aritmetica. `quoteDellaRata`/`totaleRestituitoCent` non hanno un
 * involucro che rifiuta un ingresso: gli argomenti sono FISSI, scelti da chi
 * scrive l'istanza, non digitati da una persona — non c'è un ingresso da
 * rifiutare, quindi quel ramo resta sempre riuscito.
 *
 * Switch esaustivo su `tipo`: tre casi oggi. Chi ne aggiunge un quarto smette
 * di compilare finché non lo gestisce qui.
 */

import {
  formattaEuro,
  formattaPercentuale,
  INFLAZIONE_DICHIARATA,
  periodoDaCompilare,
  simulaRisparmio,
  traduciCostoInEuro,
} from '../core/index.ts';
import { quoteDellaRata, totaleRestituitoCent } from '../core/quoteRata.ts';
import type { EsempioNumerico } from './contenutiSpiegazione.ts';

export type ValoriEsempio = Readonly<Record<string, string | number>>;

export type EsitoEsempio =
  | { readonly ok: true; readonly valori: ValoriEsempio; readonly periodoMancante: boolean }
  | { readonly ok: false };

export function calcolaEsempio(esempio: EsempioNumerico): EsitoEsempio {
  switch (esempio.tipo) {
    case 'valore-risparmi': {
      const esito = simulaRisparmio(esempio.ingresso);
      if (!esito.ok) return { ok: false };
      const r = esito.valore;
      return {
        ok: true,
        periodoMancante: periodoDaCompilare(INFLAZIONE_DICHIARATA),
        valori: {
          somma: formattaEuro(r.risparmioCent),
          anni: r.anni,
          valore: formattaEuro(r.valoreRealeCent),
          resto: formattaEuro(r.poterePerCentoEuroCent),
          perdita: formattaEuro(r.perditaCent),
          tasso: formattaPercentuale(INFLAZIONE_DICHIARATA.valoreBp),
        },
      };
    }
    case 'quote-rata-mutuo': {
      const { capitaleResiduoCent, tassoAnnuoBp, rataCent, numeroRate } = esempio.ingresso;
      const quote = quoteDellaRata(capitaleResiduoCent, tassoAnnuoBp, rataCent);
      return {
        ok: true,
        periodoMancante: false,
        valori: {
          rata: formattaEuro(rataCent),
          interesse: formattaEuro(quote.interesseCent),
          capitale: formattaEuro(quote.capitaleCent),
          totale: formattaEuro(totaleRestituitoCent(rataCent, numeroRate)),
          numeroRate,
          tasso: formattaPercentuale(tassoAnnuoBp),
        },
      };
    }
    case 'costo-su-capitale': {
      const esito = traduciCostoInEuro(esempio.ingresso);
      if (!esito.ok) return { ok: false };
      const r = esito.valore;
      return {
        ok: true,
        periodoMancante: false,
        valori: {
          capitale: formattaEuro(r.capitaleCent),
          costo: formattaEuro(r.costoAnnuoCent),
          costoMensile: formattaEuro(r.costoMensileCent),
          tasso: formattaPercentuale(r.costoAnnuoBp),
        },
      };
    }
  }
}
