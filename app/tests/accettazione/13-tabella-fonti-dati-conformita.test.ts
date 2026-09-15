/**
 * FONTI DEI DATI — test di accettazione, agente tester. Funzionalità 13.
 * Parte 4/4: lessico, identificatori e assenza di rete. Richiama i
 * meccanismi già esistenti in src/guardrails/ (verificaInsieme,
 * RADICI_VIETATE_NEGLI_IDENTIFICATORI): non li riscrive, come impone il
 * mandato del tester su docs/test/13-tabella-fonti-dati.md, gruppo 4.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { fonteDi } from '../../src/core/index.ts';
import { RADICI_VIETATE_NEGLI_IDENTIFICATORI, verificaInsieme } from '../../src/guardrails/index.ts';
import { STRINGHE_FONTI } from '../../src/ui/testiFonti.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));

describe('4. Conformità — lessico e identificatori (CF-01, CF-02, CF-03)', () => {
  it('CF-01: le stringhe nuove di testiFonti.ts sono conformi al lessico dei guardrail', () => {
    expect(verificaInsieme(STRINGHE_FONTI)).toHaveLength(0);
  });

  it('CF-02: nessun identificatore introdotto da questa funzionalità contiene una radice vietata', () => {
    const identificatori = [
      'registroFonti',
      'PaginaFonti',
      'provenienzaCompleta',
      'fonteDi',
      'valoreBpDi',
      'righeConProvenienzaIncompleta',
      'RigaFonte',
    ];
    for (const nome of identificatori) {
      const minuscolo = nome.toLowerCase();
      for (const radice of RADICI_VIETATE_NEGLI_IDENTIFICATORI) {
        expect(minuscolo).not.toContain(radice);
      }
    }
  });

  it('CF-03: i nomi propri della fonte restano letterali, non tradotti', () => {
    const esito = fonteDi('inflazione-nic');
    expect(esito.ok && esito.valore.fonte).toBe('ISTAT');
    expect(esito.ok && esito.valore.indicatore).toBe('indice NIC');
  });
});

describe('4. Conformità — nessuna chiamata di rete (CF-05)', () => {
  it('i file sorgente di questa funzionalità non contengono chiamate di rete', () => {
    const file = [
      'src/core/registroFonti.ts',
      'src/ui/PaginaFonti.tsx',
      'src/ui/RigaRegistroFonte.tsx',
      'src/ui/testiFonti.ts',
      'src/ui/dataInLettere.ts',
      'src/ui/motiviFonti.ts',
    ];
    for (const relativo of file) {
      const sorgente = readFileSync(join(APP, relativo), 'utf8');
      expect(sorgente).not.toMatch(/fetch\s*\(|XMLHttpRequest|axios|https?:\/\//i);
    }
  });
});
