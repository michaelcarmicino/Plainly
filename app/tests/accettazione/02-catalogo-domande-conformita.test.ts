/**
 * IL CATALOGO DELLE DOMANDE — test di accettazione, agente tester. Funzionalità 02.
 * Parte 4/5: conformità sul lessico e sull'origine delle formulazioni
 * (CF-01..CF-04). Richiama i meccanismi già esistenti in src/guardrails/
 * (verificaTestoUtente, verificaInsieme, RADICI_VIETATE_NEGLI_IDENTIFICATORI):
 * non li riscrive, come impone il mandato del tester. Il resto della
 * conformità è in -accessibilita.test.ts, per restare sotto le 150 righe
 * (standard-codice.md). CF-09 e CF-11 sono documentati solo nel referto: il
 * primo è un'aggregazione di casi già coperti altrove, il secondo una
 * rilettura umana dichiarata non automatizzabile.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  RADICI_VIETATE_NEGLI_IDENTIFICATORI,
  verificaInsieme,
  verificaTestoUtente,
} from '../../src/guardrails/index.ts';
import { STRINGHE_CATALOGO } from '../../src/ui/testiCatalogo.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));

function fileSorgente(dir: string, acc: string[] = []): string[] {
  for (const voce of readdirSync(dir)) {
    const p = join(dir, voce);
    if (statSync(p).isDirectory()) fileSorgente(p, acc);
    else if (/\.(ts|tsx)$/.test(voce)) acc.push(p);
  }
  return acc;
}

describe('4. Conformità — lessico e identificatori (CF-01, CF-02)', () => {
  it('CF-01: le stringhe nuove del catalogo sono conformi al lessico', () => {
    expect(
      verificaInsieme({ ...STRINGHE_CATALOGO, area2Domanda: STRINGHE_UTENTE.area2Domanda }),
    ).toHaveLength(0);
  });

  it('CF-02: nessun identificatore nuovo contiene una radice vietata', () => {
    const identificatori = [
      'DomandaCatalogo', 'StatoDomanda', 'domandeDiArea', 'CATALOGO_DOMANDE', 'VoceDomanda',
    ];
    for (const nome of identificatori) {
      const minuscolo = nome.toLowerCase();
      for (const radice of RADICI_VIETATE_NEGLI_IDENTIFICATORI) {
        expect(minuscolo).not.toContain(radice);
      }
    }
  });
});

describe("4. Conformità — le formulazioni d'origine non tornano, nemmeno in un commento (CF-03)", () => {
  it('nessuno dei sette frammenti distintivi compare in src/, commenti compresi', () => {
    // Frammenti distintivi, non le sette frasi intere: una frase intera (con
    // punto interrogativo e clausola finale) lascerebbe passare una
    // citazione PARZIALE usata per motivare la riscrittura — proprio
    // l'abitudine che questo caso deve intercettare.
    const frammenti: Record<string, string> = {
      'Mutuo o affitto': 'Mutuo o affitto, cosa mi conviene',
      'Cambiare fornitore o offerta': 'Conviene cambiare fornitore o offerta',
      'Partita IVA o dipendente': 'Conviene aprire una partita IVA o restare dipendente',
      'Meglio conto deposito, ETF o BTP': 'Meglio conto deposito, ETF o BTP',
      "Proteggo i risparmi dall'inflazione": "Come proteggo i miei risparmi dall'inflazione",
      'Contratto a termine rinnovato': 'Il mio contratto a termine verrà rinnovato',
      'Settore a rischio': 'Il mio settore è a rischio nei prossimi anni',
    };
    const file = fileSorgente(join(APP, 'src'));
    const trovati: string[] = [];
    for (const [nome, frammento] of Object.entries(frammenti)) {
      for (const f of file) {
        if (readFileSync(f, 'utf8').includes(frammento)) {
          trovati.push(`«${nome}» in ${relative(APP, f)}`);
        }
      }
    }
    expect(trovati, `\n${trovati.join('\n')}\n`).toEqual([]);
  });
});

describe('4. Conformità — «preferibile» bloccato, «meglio» deliberatamente no (CF-04)', () => {
  it("verifica la decisione presa da guardrail-officer, non l'ipotesi di fase 1", () => {
    // Divergenza registrata nel referto: fase 1 ipotizzava che ANCHE «meglio»
    // sarebbe diventato bloccato. guardrail-officer ha deciso altrimenti
    // (src/guardrails/lessico.ts, commento su 'comparativo-valore'): «meglio»
    // resta ammesso perché centrale nel registro «amico che spiega».
    expect(verificaTestoUtente('È preferibile il conto deposito.').conforme).toBe(false);
    expect(
      verificaTestoUtente('Meglio conto deposito, ETF o BTP per i miei risparmi?').conforme,
    ).toBe(true);
  });
});
