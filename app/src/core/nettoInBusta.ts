/**
 * NETTO IN BUSTA — agente core-engine. Funzionalità 08.
 *
 * Quanto resta di un lordo dopo i contributi INPS e l'IRPEF a scaglioni.
 * Descrive la sottrazione in tre pezzi e si ferma lì: non indica come
 * cambiarla.
 *
 * Puro e deterministico: nessun I/O, nessun Date.now, nessun random.
 * Scaglioni e contributi arrivano come PARAMETRO e non vengono mai letti da
 * `fiscoDichiarato.ts`: così il calcolo resta verificabile senza dipendere
 * dal valore dichiarato.
 *
 * CONVENZIONE DI ARROTONDAMENTO, unica per tutti i passi (2, 4, 6): al
 * centesimo più vicino, mezzo centesimo verso l'alto — `Math.round`, che su
 * valori sempre positivi arrotonda già così. La specifica la dichiara solo
 * al passo 6 (netto mensile); qui si applica la STESSA regola anche ai
 * passi 2 e 4, perché la quadratura fra i tre pezzi e il lordo deve tornare
 * esatta ovunque, non solo nel punto in cui la specifica lo scrive per
 * esteso (vedi CL-10 in docs/test/08-simulatore-netto.md).
 *
 * L'arrotondamento avviene UNA VOLTA SOLA per ogni grandezza, sulla somma
 * intera già completa — mai tranche per tranche (passo 2) né scaglione per
 * scaglione (passo 4): vedi CL-02, dove arrotondare pezzo per pezzo dà un
 * centesimo in meno di quello corretto.
 */

import type { ParametriContributivi, ScaglioneIrpef } from './fiscoDichiarato.ts';

export interface IngressoNettoInBusta {
  readonly lordoMensileCent: number;
  readonly mensilita: number;
}

export interface ScomposizioneAnnua {
  readonly lordoAnnuoCent: number;
  readonly contributiCent: number;
  readonly imponibileCent: number;
  readonly irpefCent: number;
  readonly nettoAnnuoCent: number;
  /** Che cosa resta di 100 € lordi: il paragone concreto. */
  readonly nettoPerCentoEuroCent: number;
  readonly quotaContributiBp: number;
  readonly quotaIrpefBp: number;
  readonly quotaNettoBp: number;
}

export interface RisultatoNettoInBusta extends ScomposizioneAnnua {
  readonly lordoMensileCent: number;
  readonly mensilita: number;
  readonly nettoMensileCent: number;
}

function contributiSuLordoAnnuo(lordoAnnuoCent: number, contributi: ParametriContributivi): number {
  const quotaBaseCent = Math.min(lordoAnnuoCent, contributi.sogliaEccedenzaCent);
  const quotaEccedenteCent = Math.max(0, lordoAnnuoCent - contributi.sogliaEccedenzaCent);
  return Math.round(
    (quotaBaseCent * contributi.aliquotaBaseBp + quotaEccedenteCent * contributi.aliquotaEccedenzaBp) / 10_000,
  );
}

function irpefSuImponibile(imponibileCent: number, scaglioni: readonly ScaglioneIrpef[]): number {
  let numeratore = 0;
  for (const scaglione of scaglioni) {
    const limiteSuperiore = scaglione.limiteSuperioreCent ?? Infinity;
    const porzioneCent = Math.max(0, Math.min(imponibileCent, limiteSuperiore) - scaglione.limiteInferioreCent);
    numeratore += porzioneCent * scaglione.aliquotaBp;
  }
  return Math.round(numeratore / 10_000);
}

/**
 * ARITMETICA PURA sul lordo annuo, senza i limiti del campo digitato e senza
 * mensilita: è il punto da cui si verifica al centesimo esatto ciascuna delle
 * tre soglie fiscali che i due campi dell'interfaccia non possono
 * raggiungere (docs/test/08-simulatore-netto.md, nota 1) — passando
 * `lordoAnnuoCent` direttamente invece che ricavandolo da lordo mensile ×
 * mensilita.
 */
export function scomponiLordoAnnuo(
  lordoAnnuoCent: number,
  scaglioni: readonly ScaglioneIrpef[],
  contributi: ParametriContributivi,
): ScomposizioneAnnua {
  const contributiCent = contributiSuLordoAnnuo(lordoAnnuoCent, contributi);
  const imponibileCent = lordoAnnuoCent - contributiCent;
  const irpefCent = irpefSuImponibile(imponibileCent, scaglioni);
  const nettoAnnuoCent = lordoAnnuoCent - contributiCent - irpefCent;
  const quotaContributiBp = Math.round((contributiCent * 10_000) / lordoAnnuoCent);
  const quotaIrpefBp = Math.round((irpefCent * 10_000) / lordoAnnuoCent);
  return {
    lordoAnnuoCent,
    contributiCent,
    imponibileCent,
    irpefCent,
    nettoAnnuoCent,
    nettoPerCentoEuroCent: Math.round((nettoAnnuoCent * 10_000) / lordoAnnuoCent),
    quotaContributiBp,
    quotaIrpefBp,
    // Per differenza, mai arrotondata da sola: è l'unico modo perché la
    // barra chiuda sempre esattamente a 10.000 bp (100%), invece di lasciare
    // uno o due punti base di buco visibile a schermo.
    quotaNettoBp: 10_000 - quotaContributiBp - quotaIrpefBp,
  };
}

/**
 * Ingresso digitato (lordo mensile, mensilita) → scomposizione completa.
 * Qui non c'è controllo sui limiti del campo, solo aritmetica: chi riceve
 * l'input di una persona chiama `simulaNettoInBusta` (in
 * `nettoInBustaValidazione.ts`).
 */
export function calcolaNettoInBusta(
  ingresso: IngressoNettoInBusta,
  scaglioni: readonly ScaglioneIrpef[],
  contributi: ParametriContributivi,
): RisultatoNettoInBusta {
  const { lordoMensileCent, mensilita } = ingresso;
  const lordoAnnuoCent = lordoMensileCent * mensilita;
  const scomposizione = scomponiLordoAnnuo(lordoAnnuoCent, scaglioni, contributi);
  return {
    ...scomposizione,
    lordoMensileCent,
    mensilita,
    nettoMensileCent: Math.round(scomposizione.nettoAnnuoCent / mensilita),
  };
}
