/**
 * IL CATALOGO DELLE DOMANDE — invarianti dichiarati dalla specifica 02 che
 * nessun altro test verifica sul dato dichiarato in catalogoDomande.ts.
 * Agente: guardrail-officer.
 *
 * Copre, uno a uno, i punti del paragrafo «Elaborazione» di
 * docs/features/02-catalogo-domande-reali-per-macrocategoria.md:
 *
 *   - le 18 voci sono esattamente quelle promesse, 5 + 6 + 7 per area,
 *     senza sparizioni né duplicati mascherati da un conteggio che torna
 *     comunque a 18 (vedi CL-04 in docs/test/02-catalogo-domande.md);
 *   - i tre stati sommano al totale: 1 con-schermata + 1 senza-fonte +
 *     16 in-arrivo = 18;
 *   - `percorso` esiste se e solo se `stato` è 'con-schermata' — il tipo lo
 *     impone a chi scrive, tramite l'unione discriminata; questo test lo
 *     controlla sul dato reale, a protezione di chi rinomina;
 *   - nessuna voce 'senza-fonte' è la prima della propria area: una card è
 *     una promessa, e questa non deve mai essere una promessa vuota;
 *   - ogni `chiave` esiste davvero in STRINGHE_UTENTE — una chiave scritta
 *     male non darebbe errore a runtime, stamperebbe il nulla;
 *   - ogni `percorso` dichiarato è una rotta che parseRotta riconosce, e la
 *     stringa duplicata in catalogoDomande.ts (per evitare un import
 *     circolare con rotte.ts: vedi il commento su
 *     PERCORSO_SCHERMATA_RISPARMI) non diverge dalla fonte in rotte.ts.
 *
 * Niente snapshot: ogni valore atteso è scritto qui, non catturato.
 */

import { describe, expect, it } from 'vitest';
import { CATALOGO_DOMANDE, domandeDiArea } from '../src/ui/catalogoDomande.ts';
import type { DomandaCatalogo } from '../src/ui/catalogoDomande.ts';
import { ID_AREE } from '../src/ui/contenutiHome.ts';
import { parseRotta, PERCORSO_VALORE_RISPARMI } from '../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../src/ui/testi.ts';

// Le chiavi attese, area per area e nell'ordine di stampa (la prima di ogni
// gruppo è quella sulla card). 5 + 6 + 7 = 18, calcolato a mano su
// catalogoDomande.ts e confrontato con CL-04 del referto del tester.
const CHIAVI_COSTO_DELLA_VITA = [
  'area1Domanda', 'area1Altra1', 'area1Altra2', 'area1Altra3', 'area1Altra4',
] as const;
const CHIAVI_LAVORO = [
  'area2Altra1', 'area2Altra2', 'area2Altra3',
  'area2Altra4', 'area2Altra5', 'area2Domanda',
] as const;
const CHIAVI_FUTURO = [
  'area3Domanda', 'area3Altra1', 'area3Altra2',
  'area3Altra3', 'area3Altra4', 'area3Altra5', 'area3Altra6',
] as const;

describe('le 18 voci sono esattamente quelle promesse, 5 + 6 + 7', () => {
  it('il totale è 18, senza sparizioni né duplicati mascherati', () => {
    // Un conteggio da solo non basterebbe: una voce duplicata al posto di
    // una sparita lascerebbe il totale a 18 lo stesso. Le tre asserzioni
    // sotto confrontano le chiavi esatte, non solo la lunghezza; questa
    // aggiunge il controllo sull'insieme (nessun valore ripetuto).
    expect(CATALOGO_DOMANDE).toHaveLength(5 + 6 + 7);
    expect(new Set(CATALOGO_DOMANDE.map((v) => v.chiave)).size).toBe(18);
  });

  it('"costo-della-vita" ha queste 5 chiavi, in questo ordine', () => {
    expect(domandeDiArea('costo-della-vita').map((v) => v.chiave)).toEqual(
      CHIAVI_COSTO_DELLA_VITA,
    );
  });

  it('"lavoro" ha queste 6 chiavi, in questo ordine', () => {
    expect(domandeDiArea('lavoro').map((v) => v.chiave)).toEqual(CHIAVI_LAVORO);
  });

  it('"futuro" ha queste 7 chiavi, in questo ordine', () => {
    expect(domandeDiArea('futuro').map((v) => v.chiave)).toEqual(CHIAVI_FUTURO);
  });
});

describe('i tre stati sommano al totale, 1 + 1 + 16', () => {
  it('con-schermata 1, senza-fonte 1, in-arrivo 16 (1 + 1 + 16 = 18)', () => {
    const conteggi: Record<DomandaCatalogo['stato'], number> = {
      'con-schermata': 0,
      'in-arrivo': 0,
      'senza-fonte': 0,
    };
    for (const voce of CATALOGO_DOMANDE) conteggi[voce.stato] += 1;
    expect(conteggi).toEqual({ 'con-schermata': 1, 'in-arrivo': 16, 'senza-fonte': 1 });
  });
});

describe('percorso presente se e solo se stato è "con-schermata"', () => {
  it('vale per tutte e 18 le voci, non solo per quella con schermata', () => {
    const violazioni = CATALOGO_DOMANDE.filter(
      (voce) => ('percorso' in voce) !== (voce.stato === 'con-schermata'),
    ).map((voce) => voce.chiave);
    expect(violazioni, `voci che violano l'invariante: ${violazioni.join(', ')}`).toEqual([]);
  });
});

describe('ogni chiave del catalogo ha una stringa registrata', () => {
  it('nessuna chiave rimanda a una voce cancellata da STRINGHE_UTENTE', () => {
    const mancanti = CATALOGO_DOMANDE.filter(
      (voce) => !(voce.chiave in STRINGHE_UTENTE),
    ).map((voce) => voce.chiave);
    expect(mancanti, `chiavi senza stringa registrata: ${mancanti.join(', ')}`).toEqual([]);
  });
});

describe('nessuna voce "senza-fonte" è la prima della propria area', () => {
  it('vale per tutte e tre le aree', () => {
    const violazioni = ID_AREE.filter((id) => {
      const [prima] = domandeDiArea(id);
      return prima.stato === 'senza-fonte';
    });
    expect(violazioni, `aree con "senza-fonte" in testa: ${violazioni.join(', ')}`).toEqual([]);
  });
});

/** Le voci con `percorso`, narrowate dal tipo invece che con un cast. */
function vociConSchermata(): ReadonlyArray<
  Extract<DomandaCatalogo, { readonly stato: 'con-schermata' }>
> {
  return CATALOGO_DOMANDE.filter(
    (voce): voce is Extract<DomandaCatalogo, { readonly stato: 'con-schermata' }> =>
      voce.stato === 'con-schermata',
  );
}

describe('ogni percorso dichiarato è una rotta che parseRotta riconosce', () => {
  it('parseRotta(percorso) non torna mai alla home', () => {
    const vicoliCiechi = vociConSchermata()
      .filter((voce) => parseRotta(voce.percorso).tipo === 'home')
      .map((voce) => voce.chiave);
    expect(vicoliCiechi, `link rotti: ${vicoliCiechi.join(', ')}`).toEqual([]);
  });

  it('oggi è una sola voce (area3Altra3), col percorso identico a rotte.ts', () => {
    // catalogoDomande.ts non importa rotte.ts (evita un import circolare:
    // rotte.ts dipende da IdArea, quindi da contenutiHome.ts, quindi da
    // questo stesso file) e ne duplica il valore come letterale. Le due
    // stringhe possono divergere in silenzio: questo confronto è ciò che
    // rende sicura quella duplicazione — probabilmente l'asserzione più
    // utile del file.
    const voci = vociConSchermata();
    expect(voci).toHaveLength(1);
    expect(voci[0].chiave).toBe('area3Altra3');
    expect(voci[0].percorso).toBe(PERCORSO_VALORE_RISPARMI);
  });
});
