/**
 * LETTURA BOLLETTA — funzionalità 05, guida interattiva alla bolletta di
 * luce e gas. Agente: core-engine.
 *
 * Non deriva da LetturaCalcolata: quel tipo porta una proiezioneAnnuaCent
 * pensata per un periodo che si annualizza (mesi/12), e su un bimestre
 * sarebbe una moltiplicazione per sei presentata come dato annuo — un
 * numero che il documento non dice (docs/features/05, «Dichiarazioni
 * tecniche»). LetturaBolletta è quindi un tipo proprio di questo modulo.
 *
 * `totaleCent` è SEMPRE `documento.totaleDichiaratoCent` — il totale
 * stampato, mai la somma delle voci: la quadratura segnala uno scarto, non
 * lo corregge, e ogni peso si legge contro il numero che la persona ha in
 * mano. Coerente con `pesoInBp(v.importoCent, documento.totaleDichiaratoCent)`
 * già usato in tests/core.test.ts sulla fixture dell'estratto conto.
 *
 * Un solo arrotondamento per ciascun numero esposto (Math.round nel punto
 * finale del calcolo, mai sulla somma di arrotondamenti per singola voce):
 * è il caso che il tester ha scritto apposta come CL-01.
 *
 * Puro e deterministico: nessun I/O, nessun Date.now, nessun random. Riusa
 * verificaQuadratura e pesoInBp già definite in ./index.ts — per questo
 * importa da lì invece di duplicarle; è l'unico punto di contatto con quel
 * file, in sola lettura.
 */

import type {
  DocumentoUtente,
  VoceDocumento,
  VoceCalcolata,
  QuadraturaTotale,
} from '../../types/contracts.ts';
import type { Esito } from './esito.ts';
import { esitoErrore, esitoOk } from './esito.ts';
import { formattaEuro, formattaPercentuale } from './formatoIt.ts';
import { pesoInBp, verificaQuadratura } from './index.ts';

/** Perché il costo per kWh non si mostra: mai Infinity, mai NaN a schermo. */
export const MOTIVI_COSTO_KWH_NON_DISPONIBILE = ['quantita-assente', 'quantita-zero'] as const;
export type MotivoCostoKwhNonDisponibile = (typeof MOTIVI_COSTO_KWH_NON_DISPONIBILE)[number];

export interface CostoPerKwhBolletta {
  /** Prezzo della sola energia, dai due numeri stampati sulla bolletta. */
  readonly prezzoEnergiaPerKwhCent: number;
  /** L'intera bolletta divisa per gli stessi kWh: il numero da confrontare col primo. */
  readonly costoTotalePerKwhCent: number;
}

/** Le due parti del totale: quanto dipende da quanto si è consumato, e quanto no. */
export interface DueQuoteBolletta {
  readonly energiaCent: number;
  readonly nonEnergiaCent: number;
  readonly pesoEnergiaBp: number;
  readonly pesoNonEnergiaBp: number;
}

export interface LetturaBolletta {
  readonly documentoId: string;
  /** Il totale stampato sul documento — vedi nota di testa sul perché. */
  readonly totaleCent: number;
  readonly quadratura: QuadraturaTotale;
  readonly voci: readonly VoceCalcolata[];
  readonly dueQuote: DueQuoteBolletta;
  readonly costoPerKwh: Esito<CostoPerKwhBolletta, MotivoCostoKwhNonDisponibile>;
}

/**
 * Spiegazione fattuale: importo, peso, e se dipende dal consumo. NON è testo
 * da stampare a schermo (D30, VoceCalcolata.spiegazione): se serve una frase
 * a schermo, la compone la UI dai campi numerici di VoceCalcolata.
 */
function spiegazioneVoce(voce: VoceDocumento, totaleCent: number, pesoBp: number): string {
  const base = `${formattaEuro(voce.importoCent)} su ${formattaEuro(totaleCent)} del totale, pari al ${formattaPercentuale(pesoBp)} del totale.`;
  return voce.categoria === 'consumo'
    ? `${base} Dipende da quanto è stato consumato.`
    : `${base} Non dipende da quanto è stato consumato.`;
}

/**
 * Somma delle quantità dichiarate sulle voci di consumo. `undefined` se
 * nessuna voce di consumo dichiara una quantità: non c'è un kWh da leggere,
 * il che è diverso da «0 kWh dichiarati» (quantita-assente vs quantita-zero,
 * distinti perché in JavaScript propagano rispettivamente NaN e Infinity —
 * due guasti diversi, non lo stesso caso ripetuto).
 */
function quantitaConsumoTotale(vociConsumo: readonly VoceDocumento[]): number | undefined {
  const dichiarate = vociConsumo.map((v) => v.quantita).filter((q): q is number => q !== undefined);
  return dichiarate.length === 0 ? undefined : dichiarate.reduce((acc, q) => acc + q, 0);
}

function calcolaCostoPerKwh(
  energiaCent: number,
  totaleCent: number,
  vociConsumo: readonly VoceDocumento[],
): Esito<CostoPerKwhBolletta, MotivoCostoKwhNonDisponibile> {
  const quantita = quantitaConsumoTotale(vociConsumo);
  if (quantita === undefined) return esitoErrore('quantita-assente');
  if (quantita <= 0) return esitoErrore('quantita-zero');
  // Unico arrotondamento per numero, sul rapporto finale: mai sulla somma di
  // arrotondamenti calcolati voce per voce (CL-01).
  return esitoOk({
    prezzoEnergiaPerKwhCent: Math.round(energiaCent / quantita),
    costoTotalePerKwhCent: Math.round(totaleCent / quantita),
  });
}

/**
 * Documento strutturato → lettura della bolletta: pesi, le due quote, il
 * costo per kWh. Non corregge la quadratura, non riclassifica le voci
 * («altro» resta «altro»), non riscrive le etichette originali.
 */
export function letturaBolletta(documento: DocumentoUtente): LetturaBolletta {
  const totaleCent = documento.totaleDichiaratoCent;
  const quadratura = verificaQuadratura(documento);

  const voci: VoceCalcolata[] = documento.voci.map((v) => {
    const pesoBp = pesoInBp(v.importoCent, totaleCent);
    return {
      id: v.id,
      etichettaOriginale: v.etichettaOriginale,
      categoria: v.categoria,
      importoCent: v.importoCent,
      pesoBp,
      spiegazione: spiegazioneVoce(v, totaleCent, pesoBp),
      rifOriginale: v.id,
    };
  });

  const vociConsumo = documento.voci.filter((v) => v.categoria === 'consumo');
  const energiaCent = vociConsumo.reduce((acc, v) => acc + v.importoCent, 0);
  // Complemento, non una seconda somma: le due quote ricompongono sempre il
  // totale per costruzione, anche quando compare una sesta voce imprevista.
  const nonEnergiaCent = totaleCent - energiaCent;

  const dueQuote: DueQuoteBolletta = {
    energiaCent,
    nonEnergiaCent,
    pesoEnergiaBp: pesoInBp(energiaCent, totaleCent),
    pesoNonEnergiaBp: pesoInBp(nonEnergiaCent, totaleCent),
  };

  return {
    documentoId: documento.id,
    totaleCent,
    quadratura,
    voci,
    dueQuote,
    costoPerKwh: calcolaCostoPerKwh(energiaCent, totaleCent, vociConsumo),
  };
}
