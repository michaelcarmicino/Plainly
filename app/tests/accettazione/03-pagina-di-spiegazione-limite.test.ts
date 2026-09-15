/**
 * LA PAGINA DI SPIEGAZIONE — test di accettazione, agente tester. Funzionalità 03.
 * Parte 2/5: casi limite a runtime CL-09..CL-13 (un blocco facoltativo, tutti
 * e tre, domanda molto lunga nel titolo e nel percorso). CL-14..CL-17 in
 * -limite-2.test.ts. I casi [tipo] (CL-01..08, CL-18) sono in -tipi.ts.
 * Vedi 03-pagina-di-spiegazione.test.ts per la nota sullo stile.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { PaginaSpiegazione as ContenutoSpiegazione } from '../../src/ui/contenutiSpiegazione.ts';
import { Navigazione } from '../../src/ui/Navigazione.tsx';
import { PaginaSpiegazione } from '../../src/ui/PaginaSpiegazione.tsx';
import { PERCORSO_FONTI, PERCORSO_HOME } from '../../src/ui/percorsi.ts';
import type { Rotta } from '../../src/ui/rotte.ts';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));
const esc = (s: string): string => s.replace(/'/g, '&#x27;');
const markup = (contenuto: ContenutoSpiegazione): string =>
  renderToStaticMarkup(createElement(PaginaSpiegazione, { contenuto }));

/** Selettore e corpo di ogni blocco CSS non annidato, commenti già rimossi. */
function blocchiCss(percorsoRelativo: string): ReadonlyArray<readonly [string, string]> {
  const testo = readFileSync(join(APP, percorsoRelativo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...testo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2]] as const);
}

const BASE = {
  id: 'inflazione-spesa',
  area: 'costo-della-vita',
  domanda: 'area1Altra1',
  immagine: ['spiegazioneInflazioneSpesaImmagine1'],
  nonFa: ['spiegazioneInflazioneSpesaNonFa1', 'spiegazioneInflazioneSpesaNonFa2'],
} as const;

describe('2. Casi limite — un solo blocco facoltativo su tre (CL-09)', () => {
  it('nomeTecnico presente, esempio e passi assenti: solo i blocchi 1,2,3,4,8', () => {
    const m = markup({ ...BASE, nomeTecnico: 'spiegazioneInflazioneSpesaNomeTecnico', esempio: null, passi: [] });
    for (const cls of ['occhiello', 'spiegazione-titolo', 'spiegazione-immagine', 'spiegazione-nome-tecnico', 'limiti-schermata']) {
      expect(m).toContain(`class="${cls}`);
    }
    expect(m).not.toContain('spiegazione-esempio');
    expect(m).not.toContain('spiegazione-fonte');
    expect(m).not.toContain('spiegazione-passi');
  });
});

describe('2. Casi limite — tutti e tre i blocchi facoltativi insieme (CL-10)', () => {
  it('ordine 1-2-3-4-5/6-7-8, nessun limite nascosto sulla combinazione completa', () => {
    const contenuto: ContenutoSpiegazione = {
      ...BASE,
      nomeTecnico: 'spiegazioneInflazioneSpesaNomeTecnico',
      esempio: {
        tipo: 'valore-risparmi',
        ingresso: { risparmioCent: 10_000, anni: 1, inflazioneAnnuaBp: 200 },
        frase: 'spiegazioneInflazioneSpesaFrase',
        paragone: 'spiegazioneInflazioneSpesaParagone',
        fonte: 'spiegazioneInflazioneSpesaFonte',
        avvertenza: 'spiegazioneInflazioneSpesaAvvertenza',
      },
      // Due passi verso rotte REALMENTE registrate (home, fonti): E-02 tratta
      // la loro esistenza, qui contano solo come "due voci, non zero".
      passi: [
        { percorso: PERCORSO_HOME, testo: 'navHome' },
        { percorso: PERCORSO_FONTI, testo: 'navHome' },
      ],
    };
    const m = markup(contenuto);
    const indici = [
      'occhiello',
      'spiegazione-titolo',
      'spiegazione-immagine',
      'spiegazione-nome-tecnico',
      'spiegazione-esempio',
      'spiegazione-fonte',
      'spiegazione-passi',
      'limiti-schermata',
    ].map((cls) => m.indexOf(`class="${cls}`));
    expect(indici.every((i) => i > -1)).toBe(true);
    for (let i = 1; i < indici.length; i += 1) expect(indici[i]).toBeGreaterThan(indici[i - 1]);
    expect(m).toContain(STRINGHE_UTENTE.spiegazioneTitoloPassi);
  });
});

describe('2. Casi limite — domanda molto lunga come titolo (CL-11)', () => {
  it('area2Altra2 come titolo va a capo, senza troncamento (98 caratteri, non 103: vedi referto)', () => {
    // Misurato dal sorgente, non a occhio: 98 caratteri, non 103 come
    // ipotizzato in fase 1 — divergenza segnalata nel referto, non corretta
    // qui. Resta comunque la più lunga delle diciotto domande dichiarate.
    expect(STRINGHE_UTENTE.area2Altra2).toHaveLength(98);
    const m = markup({ ...BASE, domanda: 'area2Altra2', nomeTecnico: null, esempio: null, passi: [] });
    expect(m).toContain(esc(STRINGHE_UTENTE.area2Altra2));
    expect(m).not.toContain('…');

    const blocco = blocchiCss('src/ui/stiliSpiegazione.css').find(([sel]) => sel === '.spiegazione-titolo');
    expect(blocco?.[1]).not.toMatch(/text-overflow|white-space:\s*nowrap|line-clamp/);
    const largo = blocco?.[1].match(/max-width:\s*(\d+)ch/);
    expect(largo).not.toBeNull();
    expect(Number(largo?.[1])).toBeLessThanOrEqual(70);
  });
});

describe("2. Casi limite — stessa domanda lunga sull'ultimo gradino del percorso (CL-12)", () => {
  it('il gradino va a capo, mai troncato con «…»', () => {
    const rotta: Rotta = { tipo: 'schermata', id: 'inflazione-spesa' };
    const m = renderToStaticMarkup(createElement(Navigazione, { rotta, passo: 'area2Altra2' }));
    expect(m).toContain(esc(STRINGHE_UTENTE.area2Altra2));
    expect(m).not.toContain('…');
    const blocco = blocchiCss('src/ui/stiliNavigazione.css').find(([sel]) => sel === '.percorso');
    expect(blocco?.[1]).not.toMatch(/text-overflow|white-space:\s*nowrap|line-clamp/);
  });
});

describe('2. Casi limite — nonFa con una sola voce (CL-13)', () => {
  it('il minimo ammesso dal tipo regge quanto il massimo, layout non rotto', () => {
    const m = markup({ ...BASE, nomeTecnico: null, esempio: null, passi: [], nonFa: ['spiegazioneInflazioneSpesaNonFa1'] });
    const ul = m.match(/<ul class="limiti spiegazione-non-fa">([\s\S]*?)<\/ul>/);
    expect(ul).not.toBeNull();
    expect([...(ul?.[1] ?? '').matchAll(/<li>/g)]).toHaveLength(1);
  });
});
