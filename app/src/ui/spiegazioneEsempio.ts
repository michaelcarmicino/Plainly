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
import { calcolaConfrontoRateMutuo } from '../core/confrontoRateMutuo.ts';
import { calcolaRataCent } from '../core/rataMutuo.ts';
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
      const { capitaleResiduoPrimaCent, capitaleResiduoUltimaCent, tassoAnnuoBp, rataCent, numeroRate } =
        esempio.ingresso;
      const prima = quoteDellaRata(capitaleResiduoPrimaCent, tassoAnnuoBp, rataCent);
      const ultima = quoteDellaRata(capitaleResiduoUltimaCent, tassoAnnuoBp, rataCent);
      return {
        ok: true,
        periodoMancante: false,
        valori: {
          valore: formattaEuro(rataCent),
          rata: formattaEuro(rataCent),
          interessePrima: formattaEuro(prima.interesseCent),
          capitalePrima: formattaEuro(prima.capitaleCent),
          interesseUltima: formattaEuro(ultima.interesseCent),
          capitaleUltima: formattaEuro(ultima.capitaleCent),
          totale: formattaEuro(totaleRestituitoCent(rataCent, numeroRate)),
          numeroRate,
          tasso: formattaPercentuale(tassoAnnuoBp),
        },
      };
    }
    case 'confronto-durata-mutuo': {
      const { capitaleCent, tassoAnnuoBp, anniA, anniB } = esempio.ingresso;
      const rataACent = calcolaRataCent({ capitaleCent, anni: anniA, tassoAnnuoBp });
      const rataBCent = calcolaRataCent({ capitaleCent, anni: anniB, tassoAnnuoBp });
      const totaleACent = totaleRestituitoCent(rataACent, anniA * 12);
      const totaleBCent = totaleRestituitoCent(rataBCent, anniB * 12);
      return {
        ok: true,
        periodoMancante: false,
        valori: {
          valore: formattaEuro(rataACent - rataBCent),
          anniA,
          anniB,
          rataA: formattaEuro(rataACent),
          rataB: formattaEuro(rataBCent),
          differenzaRata: formattaEuro(rataACent - rataBCent),
          totaleA: formattaEuro(totaleACent),
          totaleB: formattaEuro(totaleBCent),
          differenzaTotale: formattaEuro(totaleBCent - totaleACent),
          tasso: formattaPercentuale(tassoAnnuoBp),
        },
      };
    }
    case 'confronto-tasso-mutuo': {
      const r = calcolaConfrontoRateMutuo(esempio.ingresso);
      const differenzaMensileCent = Math.abs(r.differenzaMensileCent);
      const differenzaAnnuaCent = Math.abs(r.differenzaSu12MesiCent);
      return {
        ok: true,
        periodoMancante: false,
        valori: {
          valore: formattaEuro(differenzaMensileCent),
          rataFissa: formattaEuro(r.rataFissaCent),
          rataVariabile: formattaEuro(r.rataVariabileOggiCent),
          differenzaMensile: formattaEuro(differenzaMensileCent),
          differenzaAnnua: formattaEuro(differenzaAnnuaCent),
          tassoFisso: formattaPercentuale(r.tassoFissoAnnuoBp),
          tassoVariabile: formattaPercentuale(r.tassoVariabilePartenzaAnnuoBp),
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
