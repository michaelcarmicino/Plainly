/**
 * FONTI DEI DATI — test di accettazione, agente tester. Funzionalità 13.
 * Parte 3/4: il markup della pagina, il colore riservato al periodo
 * mancante, l'accessibilità di base e la navigazione. Render con
 * renderToStaticMarkup, come tests/home.test.ts: niente DOM da simulare,
 * nessuna dipendenza nuova, e la prova stessa che nulla dipende dall'hover.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { formattaPercentuale, INFLAZIONE_DICHIARATA } from '../../src/core/index.ts';
import { Navigazione } from '../../src/ui/Navigazione.tsx';
import { PaginaFonti } from '../../src/ui/PaginaFonti.tsx';
import type { Rotta } from '../../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));
const markupPagina = (): string => renderToStaticMarkup(createElement(PaginaFonti));

/** Selettore e corpo di ogni blocco CSS non annidato, commenti già rimossi. */
function blocchiCss(percorsoRelativo: string): ReadonlyArray<readonly [string, string]> {
  const testo = readFileSync(join(APP, percorsoRelativo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...testo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2]] as const);
}

describe('2. Casi limite — lo stato reale di oggi (CL-09)', () => {
  it("la riga dell'inflazione dichiara il periodo mancante in rosa, non con un vuoto", () => {
    const markup = markupPagina();
    expect(markup).toContain(STRINGHE_UTENTE.fontiPeriodoMancante);
    expect(markup).toContain('riga-fonte-mancante');
    expect(markup).toContain('ISTAT');
    // 200 bp -> 2,00%: la stessa costante già verificata dalla 07, non un
    // numero riscritto a mano qui.
    expect(markup).toContain(formattaPercentuale(INFLAZIONE_DICHIARATA.valoreBp));
  });
});

describe('2. Casi limite — nessuno stato di caricamento (CL-13)', () => {
  it('le righe sono già presenti al primo render sincrono, nessuna rotellina', () => {
    const markup = markupPagina();
    expect(markup).toContain('riga-fonte');
    expect(markup.toLowerCase()).not.toContain('caricamento');
  });
});

describe('3. Errori attesi — il periodo mancante si legge anche senza il colore (E-06)', () => {
  it('la dichiarazione è testo leggibile, non solo un bordo o uno sfondo colorato', () => {
    expect(markupPagina()).toContain(STRINGHE_UTENTE.fontiPeriodoMancante);
  });

  it('.riga-fonte-mancante non riduce il corpo del testo sotto la base ereditata', () => {
    const blocco = blocchiCss('src/ui/stiliFonti.css').find(
      ([selettore]) => selettore === '.riga-fonte-mancante',
    );
    expect(blocco?.[1]).not.toMatch(/font-size/);
  });

  it('il contrasto fra #FF50A0 e #0a0014 supera la soglia AA di 4,5:1', () => {
    // Luminanza relativa WCAG ricalcolata qui (non solo letta dal commento
    // in stiliFonti.css): L ~= 0,2954 per il rosa, ~= 0,00115 per il fondo
    // del riquadro. Contrasto = (0,2954+0,05)/(0,00115+0,05) ~= 6,75:1.
    const canale = (c: number): number => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const luminanza = (hex: string): number => {
      const n = parseInt(hex.slice(1), 16);
      return (
        0.2126 * canale((n >> 16) & 255) + 0.7152 * canale((n >> 8) & 255) + 0.0722 * canale(n & 255)
      );
    };
    const [chiaro, scuro] = [luminanza('#FF50A0'), luminanza('#0a0014')].sort((a, b) => b - a);
    expect((chiaro + 0.05) / (scuro + 0.05)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("4. Conformità — il rosa resta il colore di ciò che il prodotto non fa (CF-04)", () => {
  it('in stiliFonti.css SOLO .riga-fonte-mancante usa --rose o #FF50A0', () => {
    const conRosa = blocchiCss('src/ui/stiliFonti.css').filter(([, corpo]) =>
      /--rose|#ff50a0/i.test(corpo),
    );
    expect(conRosa).toHaveLength(1);
    expect(conRosa[0][0]).toBe('.riga-fonte-mancante');
  });
});

describe('4. Conformità — accessibilità di base, controlli automatizzabili (CF-08)', () => {
  it('nessun focus disabilitato senza sostituto nel foglio di stile della pagina', () => {
    const css = readFileSync(join(APP, 'src/ui/stiliFonti.css'), 'utf8');
    expect(css).not.toMatch(/outline:\s*(none|0)\b/);
  });

  it('i bersagli della navigazione restano di almeno 44x44px', () => {
    const css = readFileSync(join(APP, 'src/ui/stiliNavigazione.css'), 'utf8');
    const blocco = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(
      (m) => m[1].trim() === '.bottone-nav',
    );
    expect(blocco?.[2]).toMatch(/min-height:\s*44px/);
    expect(blocco?.[2]).toMatch(/min-width:\s*44px/);
  });
});

describe('4. Conformità — la navigazione non cambia posizione (CF-09)', () => {
  it('la barra di navigazione ha la stessa struttura di classi su ogni rotta', () => {
    const classiDi = (markup: string): readonly string[] =>
      [...markup.matchAll(/class="([^"]*)"/g)].map((m) => m[1]);
    const rottaFonti: Rotta = { tipo: 'fonti' };
    const rottaRisparmi: Rotta = { tipo: 'valore-risparmi' };
    const fonti = renderToStaticMarkup(createElement(Navigazione, { rotta: rottaFonti }));
    const risparmi = renderToStaticMarkup(createElement(Navigazione, { rotta: rottaRisparmi }));
    expect(classiDi(fonti)).toEqual(classiDi(risparmi));
  });
});
