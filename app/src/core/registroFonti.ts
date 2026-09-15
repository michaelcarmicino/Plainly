/**
 * REGISTRO FONTI — agente core-engine. Funzionalità 13.
 *
 * «Da dove vengono i numeri di questo sito.» Un array di righe scritte a
 * mano, una per ogni numero che il prodotto usa: nessuna chiamata alla rete,
 * né a runtime né in fase di build. Il registro non calcola niente — qui non
 * si divide e non si moltiplica — dichiara soltanto CHI dice un valore, SU
 * QUALE periodo vale e QUANDO è stato scritto qui dentro.
 *
 * `periodo: null` non è un caso limite: è lo stato reale di oggi per l'unica
 * riga che esiste. Dichiararlo invece di nasconderlo è il punto di questo
 * modulo. Il registro parte con questa sola riga: le altre cinque della
 * tabella d'origine non entrano finché il valore che descrivono non esiste
 * davvero altrove nel codice — scriverle ora vorrebbe dire inventarle, ed è
 * esattamente ciò che questa struttura esiste per impedire. Entreranno con le
 * funzionalità 08 e 10, una riga per volta, insieme al numero vero.
 *
 * Puro e deterministico: nessun I/O, nessun Date.now, nessun random.
 */

import type { Esito } from './esito.ts';
import { esitoErrore, esitoOk } from './esito.ts';

/** Le due sole convenzioni numeriche del progetto, dichiarate sulla riga
 *  invece che dedotte dal nome del campo. */
export type UnitaValore = 'centesimi' | 'punti-base';

/** Gli anni su cui il valore è calcolato: un anno di inizio e uno di fine. */
export interface PeriodoRiferimento {
  readonly inizio: number;
  readonly fine: number;
}

/** Un numero con la sua provenienza: la sola unità che questo modulo gestisce. */
export interface RigaFonte {
  readonly id: string;
  readonly valore: number;
  readonly unita: UnitaValore;
  /** Il nome di chi pubblica il dato, così come lo scrive lui: 'ISTAT'. */
  readonly fonte: string;
  /** Il nome tecnico del dato presso quella fonte: 'indice NIC'. Non si traduce. */
  readonly indicatore: string;
  /** null quando nessuno ha ancora stabilito su quali anni vale il valore. */
  readonly periodo: PeriodoRiferimento | null;
  /** 'AAAA-MM-GG', scritta a mano da chi ha inserito la riga. */
  readonly dataInserimento: string;
}

/**
 * L'unica riga che esiste davvero nel codice oggi. Esportata anche a parte,
 * non solo dentro l'array: è il punto a cui inflazioneDichiarata.ts si
 * aggancia per restare una vista, senza un secondo lookup che potrebbe non
 * trovare nulla.
 */
export const RIGA_INFLAZIONE_NIC = {
  id: 'inflazione-nic',
  valore: 200,
  unita: 'punti-base',
  fonte: 'ISTAT',
  indicatore: 'indice NIC',
  periodo: null,
  dataInserimento: '2026-09-14',
} satisfies RigaFonte;

/** Il registro. Le righe di 08 e 10 si aggiungono qui, una per numero vero. */
export const REGISTRO_FONTI: readonly RigaFonte[] = [RIGA_INFLAZIONE_NIC];

/**
 * RICAVATA dai campi, mai dichiarata a mano: nessuno può scrivere `true` su
 * una riga a cui manca il periodo. È la generalizzazione del flag che prima
 * stava fisso su TassoInflazioneDichiarato — e a differenza di quello, questa
 * non può mentire per distrazione.
 */
export function provenienzaCompleta(riga: RigaFonte): boolean {
  return riga.periodo !== null && riga.fonte !== '' && riga.dataInserimento !== '';
}

/** Le righe ancora da completare: il numero che la schermata mostra in testa. */
export function righeConProvenienzaIncompleta(
  registro: readonly RigaFonte[],
): readonly RigaFonte[] {
  return registro.filter((riga) => !provenienzaCompleta(riga));
}

/** I motivi per cui il registro non risponde. Codici, non frasi: le parole
 *  che legge una persona stanno in src/ui/testi.ts. */
export const MOTIVI_ERRORE_FONTE = ['id-sconosciuto', 'unita-non-punti-base'] as const;

export type MotivoErroreFonte = (typeof MOTIVI_ERRORE_FONTE)[number];

/** La riga con questo id nel registro, oppure il codice del motivo per cui non c'è. */
export function fonteDi(id: string): Esito<RigaFonte, MotivoErroreFonte> {
  const riga = REGISTRO_FONTI.find((r) => r.id === id);
  return riga === undefined ? esitoErrore('id-sconosciuto') : esitoOk(riga);
}

/**
 * Il valore in punti base di una riga già in mano, oppure il codice del
 * motivo per cui non lo è. Chiedere punti base a un importo in centesimi è
 * l'errore che questa struttura esiste per rendere impossibile in silenzio.
 *
 * Separata da valoreBpDi per lo stesso motivo per cui calcolaSimulazioneRisparmio
 * è separata da simulaRisparmio: l'aritmetica pura si verifica su una riga
 * costruita a mano, senza dover passare dal registro vero.
 */
export function valoreBpDiRiga(riga: RigaFonte): Esito<number, MotivoErroreFonte> {
  return riga.unita === 'punti-base' ? esitoOk(riga.valore) : esitoErrore('unita-non-punti-base');
}

/** Il valore in punti base della riga con questo id nel registro. */
export function valoreBpDi(id: string): Esito<number, MotivoErroreFonte> {
  const esito = fonteDi(id);
  return esito.ok ? valoreBpDiRiga(esito.valore) : esito;
}
