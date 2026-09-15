/**
 * INVARIANTE DEL REGISTRO — agente ui-builder. Funzionalità 14.
 *
 * Il campo `stringhe` di una dichiarazione non alimenta nulla: serve solo a
 * questo test. `testi.ts` resta l'unico punto di conflitto condiviso (vedi
 * docs/features/14-registro-delle-schermate.md, sezione 5) proprio perché
 * dimenticare lo spread del proprio registro di stringhe deve dare un test
 * rosso col nome della schermata, non una pagina con dei buchi al posto
 * delle parole.
 */

import { describe, expect, it } from 'vitest';
import { SCHERMATE } from '../registro.ts';
import { STRINGHE_UTENTE } from '../../testi.ts';

describe('ogni chiave dichiarata da una schermata è in STRINGHE_UTENTE', () => {
  it('il registro non è vuoto (altrimenti il test sotto non controlla niente)', () => {
    expect(SCHERMATE.length).toBeGreaterThan(0);
  });

  for (const schermata of SCHERMATE) {
    const chiavi = schermata.stringhe ?? [];
    it(`«${schermata.id}»: ${chiavi.length} chiavi proprie, tutte registrate`, () => {
      const mancanti = chiavi.filter((chiave) => !(chiave in STRINGHE_UTENTE));
      expect(mancanti, `chiavi mancanti in testi.ts: ${mancanti.join(', ')}`).toEqual([]);
    });
  }

  it('anche il "passo" di ogni schermata è una chiave registrata', () => {
    const mancanti = SCHERMATE.filter((s) => !(s.passo in STRINGHE_UTENTE)).map((s) => s.id);
    expect(mancanti, `schermate col "passo" non registrato: ${mancanti.join(', ')}`).toEqual([]);
  });
});
