/**
 * LA GRAMMATICA DEL RISULTATO — agente ui-builder. Funzionalità 09.
 * Affiancato a motiviMesiCoperti.ts per restare sotto le 150 righe.
 *
 * Non calcola NIENTE di dominio: dai numeri già pronti (mesiInteri,
 * giorniResidui, ...) determina solo la FORMA GRAMMATICALE — singolare o
 * plurale, quale delle quattro chiavi «Risultato…» di testiMesiCoperti.ts
 * usare — così ogni caso particolare della specifica («meno di un mese»,
 * «giorni residui a zero», «un mese solo») resta scritto una volta sola,
 * qui, e non nel componente.
 *
 * Le migliaia si separano a mano, come in src/core/formatoIt.ts: niente
 * Intl, perché il numero deve restare identico su ogni macchina.
 */

import type { RisultatoMesiCoperti } from '../core/mesiCoperti.ts';
import { formattaEuro } from '../core/formatoIt.ts';
import type { ChiaveStringaUtente } from './testi.ts';

function formattaIntero(n: number): string {
  return String(Math.trunc(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const testoMesi = (n: number): string => (n === 1 ? '1 mese' : `${formattaIntero(n)} mesi`);
const testoGiorni = (n: number): string => (n === 1 ? '1 giorno' : `${formattaIntero(n)} giorni`);
const testoMesiPagati = (n: number): string =>
  n === 1 ? '1 mese pagato per intero' : `${formattaIntero(n)} mesi pagati per intero`;
const testoGiorniDelMeseDopo = (n: number): string =>
  n === 1 ? '1 giorno del mese dopo' : `${formattaIntero(n)} giorni del mese dopo`;
const suffissoGiorni = (n: number): string => (n === 0 ? '' : ` e ${testoGiorni(n)}`);

export interface FraseComposta {
  readonly chiave: ChiaveStringaUtente;
  readonly valori: Readonly<Record<string, string>>;
}

/**
 * Determina quale delle quattro chiavi usare in base ai numeri già calcolati dal
 * core. Applica le regole di resa della specifica: «meno di un mese» mai
 * con «0 mesi», «giorni residui a zero» mai con «e 0 giorni», «un mese
 * solo» al singolare.
 */
export function fraseDurata(r: RisultatoMesiCoperti): FraseComposta {
  const { mesiInteri, giorniResidui } = r;

  if (mesiInteri === 0 && giorniResidui === 0) {
    return { chiave: 'mesiCopertiRisultatoZero', valori: {} };
  }
  if (mesiInteri === 0) {
    return {
      chiave: 'mesiCopertiRisultatoSoloGiorni',
      valori: { giorni: testoGiorni(giorniResidui) },
    };
  }
  if (mesiInteri === 1) {
    return {
      chiave: 'mesiCopertiRisultatoMeseSingolo',
      valori: { giorniSuffix: suffissoGiorni(giorniResidui) },
    };
  }
  return {
    chiave: 'mesiCopertiRisultato',
    valori: { mesi: testoMesi(mesiInteri), giorniSuffix: suffissoGiorni(giorniResidui) },
  };
}

/**
 * La scomposizione — il paragone concreto — solo quando c'è almeno un mese
 * intero da scomporre: sotto un mese non c'è niente da decomporre, ed è lo
 * stesso motivo per cui il caso «niente da parte» non mostra un commento.
 */
export function testoScomposizione(r: RisultatoMesiCoperti): FraseComposta | null {
  if (r.mesiInteri === 0) return null;

  const residuoSuffix =
    r.residuoUltimoMeseCent === 0
      ? ''
      : ` — più ${formattaEuro(r.residuoUltimoMeseCent)} che restano, cioè ${testoGiorniDelMeseDopo(r.giorniResidui)}`;

  return {
    chiave: 'mesiCopertiScomposizione',
    valori: {
      mesi: testoMesiPagati(r.mesiInteri),
      importoMesi: formattaEuro(r.mesiInteri * r.speseMensiliCent),
      residuoSuffix,
    },
  };
}
