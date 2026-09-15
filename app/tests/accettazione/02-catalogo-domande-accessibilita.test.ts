/**
 * IL CATALOGO DELLE DOMANDE — test di accettazione, agente tester. Funzionalità 02.
 * Parte 5/5: conformità su interazione e accessibilità di base (CF-05,
 * CF-06, CF-07, CF-08, CF-10). Vedi 02-catalogo-domande-conformita.test.ts
 * per il lessico e gli identificatori, e per la nota sulla divisione in più
 * file. CF-09 e CF-11 sono documentati solo nel referto.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PaginaMacrocategoria } from '../../src/ui/PaginaMacrocategoria.tsx';
import { STRINGHE_UTENTE } from '../../src/ui/testi.ts';

const APP = fileURLToPath(new URL('../..', import.meta.url));

/**
 * Selettore e corpo di ogni blocco CSS non annidato, commenti già rimossi
 * (come 13-tabella-fonti-dati-pagina.test.ts): un commento fra due regole,
 * lasciato dentro, finirebbe catturato come parte del "selettore"
 * successivo, e nessun confronto per uguaglianza troverebbe più niente.
 */
function blocchiCss(percorsoRelativo: string): ReadonlyArray<readonly [string, string]> {
  const testo = readFileSync(join(APP, percorsoRelativo), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...testo.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2]] as const);
}

describe('4. Conformità — nessuna interfaccia conversazionale (CF-05)', () => {
  it("nessun campo di domanda libera nella pagina di un'area", () => {
    const markup = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'lavoro' }));
    expect(markup).not.toMatch(/<input|<textarea|type="search"/i);
  });
});

describe('4. Conformità — i tre stati si leggono senza hover (CF-06)', () => {
  it('con-schermata, in-arrivo e senza-fonte compaiono tutti nel markup statico', () => {
    const futuro = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'futuro' }));
    expect(futuro).toContain('domanda-collegata');
    // react-dom/server esegue l'escape dell'apostrofo: "c'è" -> "c&#x27;è".
    expect(futuro).toContain(STRINGHE_UTENTE.domandaInArrivo.replace(/'/g, '&#x27;'));
    const lavoro = renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'lavoro' }));
    expect(lavoro).toContain(STRINGHE_UTENTE.domandaSenzaFonte);
  });
});

describe('4. Conformità — nessun semaforo di colore sulle tre etichette (CF-07)', () => {
  it('nessuna parola o classe da semaforo nelle etichette di stato', () => {
    const markup =
      renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'futuro' })) +
      renderToStaticMarkup(createElement(PaginaMacrocategoria, { id: 'lavoro' }));
    expect(markup).not.toMatch(/verde|rosso|giallo|semaforo/i);

    const blocchi = blocchiCss('src/ui/stiliNavigazione.css');
    expect(blocchi.find(([sel]) => sel === '.stato-domanda')?.[1]).toMatch(/--purple-light/);
    expect(blocchi.find(([sel]) => sel === '.stato-domanda-limite')?.[1]).toMatch(/--rose/);
  });
});

describe('4. Conformità — nessuna chiamata di rete (CF-08)', () => {
  it('i file nuovi o modificati da questa funzionalità non contengono chiamate di rete', () => {
    const file = [
      'src/ui/catalogoDomande.ts',
      'src/ui/testiCatalogo.ts',
      'src/ui/contenutiHome.ts',
      'src/ui/PaginaMacrocategoria.tsx',
      'src/ui/testi.ts',
      'src/guardrails/lessico.ts',
    ];
    for (const relativo of file) {
      const sorgente = readFileSync(join(APP, relativo), 'utf8');
      expect(sorgente).not.toMatch(/fetch\s*\(|XMLHttpRequest|axios|https?:\/\//i);
    }
  });
});

describe('4. Conformità — accessibilità di base, controlli automatizzabili (CF-10)', () => {
  it('corpo, focus e area cliccabile: soglie richiamate da design.md, non ricalcolate', () => {
    const cssNavGrezzo = readFileSync(join(APP, 'src/ui/stiliNavigazione.css'), 'utf8');
    expect(cssNavGrezzo).not.toMatch(/outline:\s*(none|0)\b/);
    const blocchi = blocchiCss('src/ui/stiliNavigazione.css');
    expect(blocchi.find(([sel]) => sel === '.elenco-domande li')?.[1]).toMatch(/min-height:\s*44px/);

    // Stessa coppia di colori già verificata altrove (styles.css: 7.0:1 per
    // --purple-light, 6.5:1 per --rose, entrambi su fondo scuro): non
    // ricalcolata una terza volta qui, richiamata.
    const cssRisultato = readFileSync(join(APP, 'src/ui/stiliRisultato.css'), 'utf8');
    expect(cssRisultato).toMatch(/\.domanda-collegata[^}]*min-height:\s*44px/);
  });
});
