/**
 * DALL'ESEMPIO DICHIARATO AL NUMERO DA MOSTRARE — agente ui-builder.
 * Funzionalità 03.
 *
 * Nessun calcolo qui dentro: solo il ponte fra ciò che un'istanza dichiara e
 * la funzione del core che lo trasforma in un risultato, più il
 * confezionamento dei valori pronti per i segnaposto di <Testo>. Stesso
 * confine che motiviRisparmio.ts già rispetta per la 07.
 *
 * `simulaRisparmio`, non l'aritmetica pura senza controlli: è l'unica delle
 * due che può rifiutare un ingresso, quindi l'unica che rende raggiungibile
 * lo stato «errore» — obbligatorio quanto gli altri tre. Per un ingresso
 * valido il numero prodotto è identico, perché il ramo riuscito richiama
 * proprio quell'aritmetica.
 *
 * Switch esaustivo su `tipo`: oggi un solo caso. Chi ne aggiunge uno smette
 * di compilare finché non lo gestisce qui.
 */

import {
  formattaEuro,
  formattaPercentuale,
  INFLAZIONE_DICHIARATA,
  periodoDaCompilare,
  simulaRisparmio,
} from '../core/index.ts';
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
  }
}
