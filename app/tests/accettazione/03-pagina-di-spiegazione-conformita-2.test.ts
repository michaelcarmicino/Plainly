/**
 * LA PAGINA DI SPIEGAZIONE — test di accettazione, agente tester. Funzionalità 03.
 * Parte 5b/5: CF-08 (aggregazione, parte automatizzabile), CF-09
 * (accessibilità, parte automatizzabile — il posizionamento sopra la piega
 * resta alla rilettura umana, come CF-09 dichiara già in fase 1), CF-10
 * (posizione della navigazione, stesso metodo di 13-tabella-fonti-dati-pagina
 * .test.ts). CF-11 e CF-12 sono solo richiami (CL-11/CL-12 e CL-01/CL-02): non
 * duplicati qui.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  ISTANZA_INFLAZIONE_SPESA,
  type PaginaSpiegazione as ContenutoSpiegazione,
} from '../../src/ui/contenutiSpiegazione.ts';
import { Navigazione } from '../../src/ui/Navigazione.tsx';
import { PaginaSpiegazione } from '../../src/ui/PaginaSpiegazione.tsx';
import { PERCORSO_HOME } from '../../src/ui/percorsi.ts';
import type { Rotta } from '../../src/ui/rotte.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));
function blocchiCss(percorsoRelativo: string): ReadonlyArray<readonly [string, string]> {
  const testo = readFileSync(join(APP, percorsoRelativo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...testo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2]] as const);
}
const canale = (c: number): number => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminanza = (hex: string): number => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * canale((n >> 16) & 255) + 0.7152 * canale((n >> 8) & 255) + 0.0722 * canale(n & 255);
};
const contrasto = (a: string, b: string): number => {
  const [chiaro, scuro] = [luminanza(a), luminanza(b)].sort((x, y) => y - x);
  return (chiaro + 0.05) / (scuro + 0.05);
};

describe("4. Conformità — i quattro stati obbligatori (CF-08, aggregazione)", () => {
  it("nessuno stato di caricamento: il contenitore non ha hook asincroni", () => {
    // Vuoto -> CL-16, CL-01/CL-03 [tipo]. Errore -> E-01, E-03.
    // Dati lunghi -> CL-11, CL-14, CL-15. Tutti verificati altrove: qui solo
    // la parte che manca, «in caricamento», assente per costruzione.
    const testo = readFileSync(join(APP, 'src/ui/PaginaSpiegazione.tsx'), 'utf8');
    expect(testo).not.toMatch(/useState|useEffect|Suspense|\basync\b/);
  });
});

describe('4. Conformità — accessibilità di base, parte automatizzabile (CF-09)', () => {
  it('corpo e interlinea di base rispettano le soglie minime', () => {
    const css = readFileSync(join(APP, 'src/ui/styles.css'), 'utf8');
    expect(css).toMatch(/font-size:\s*18px/);
    expect(css).toMatch(/line-height:\s*1\.6/);
  });

  it('ogni blocco di testo continuo resta entro 70 caratteri di larghezza', () => {
    const conMaxWidth = blocchiCss('src/ui/stiliSpiegazione.css').filter(([, corpo]) =>
      /max-width:\s*\d+ch/.test(corpo),
    );
    expect(conMaxWidth.length).toBeGreaterThan(0);
    for (const [selettore, corpo] of conMaxWidth) {
      const n = Number(corpo.match(/max-width:\s*(\d+)ch/)?.[1]);
      expect(n, selettore).toBeLessThanOrEqual(70);
    }
  });

  it('i rimandi del blocco 7 sono bersagli di almeno 44px, con testo accanto all\'icona', () => {
    const blocco = blocchiCss('src/ui/stiliSpiegazione.css').find(([sel]) => sel === '.passo-collegato');
    expect(blocco?.[1]).toMatch(/min-height:\s*44px/);
    const contenuto: ContenutoSpiegazione = {
      ...ISTANZA_INFLAZIONE_SPESA,
      passi: [{ percorso: PERCORSO_HOME, testo: 'navHome' }],
    };
    const m = renderToStaticMarkup(createElement(PaginaSpiegazione, { contenuto }));
    expect(m).toMatch(/<a class="passo-collegato"[^>]*>[\s\S]*?<svg[\s\S]*?aria-hidden="true"[\s\S]*?<\/svg>[\s\S]*?<\/a>/);
  });

  it('nessuna informazione compare solo al passaggio del mouse, focus non disabilitato', () => {
    const css = readFileSync(join(APP, 'src/ui/stiliSpiegazione.css'), 'utf8');
    expect(css).not.toMatch(/:hover/);
    expect(css).not.toMatch(/outline:\s*(none|0)\b/);
  });

  it('il contrasto del rosa e del viola chiaro sul fondo supera 4,5:1, ricalcolato qui', () => {
    expect(contrasto('#FF50A0', '#050008')).toBeGreaterThanOrEqual(4.5);
    expect(contrasto('#BE82FF', '#050008')).toBeGreaterThanOrEqual(4.5);
  });

  it('nessun tabIndex positivo altera l\'ordine naturale di lettura', () => {
    for (const f of ['src/ui/PaginaSpiegazione.tsx', 'src/ui/BloccoEsempioSpiegazione.tsx']) {
      const testo = readFileSync(join(APP, f), 'utf8');
      expect(testo).not.toMatch(/tabIndex=\{?[1-9]/);
    }
  });
});

describe('4. Conformità — la navigazione non cambia posizione (CF-10)', () => {
  it('stessa struttura di classi su questa pagina e su un\'altra già verificata', () => {
    const classiDi = (m: string): readonly string[] => [...m.matchAll(/class="([^"]*)"/g)].map((x) => x[1]);
    const rottaSpiegazione: Rotta = { tipo: 'schermata', id: 'inflazione-spesa' };
    const rottaFonti: Rotta = { tipo: 'schermata', id: 'fonti' };
    const a = renderToStaticMarkup(createElement(Navigazione, { rotta: rottaSpiegazione, passo: 'area1Altra1' }));
    const b = renderToStaticMarkup(createElement(Navigazione, { rotta: rottaFonti, passo: 'fontiPasso' }));
    expect(classiDi(a)).toEqual(classiDi(b));
  });
});
