/**
 * LA PAGINA DI SPIEGAZIONE — test di accettazione, agente tester. Funzionalità 03.
 * Parte 4/5: errori attesi (E-01..E-07). Vedi 03-pagina-di-spiegazione.test.ts
 * per lo stile e per la nota sull'escape dell'apostrofo di react-dom/server.
 */

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AREE, ID_AREE } from '../../src/ui/contenutiHome.ts';
import {
  ISTANZA_INFLAZIONE_SPESA,
  PAGINE_SPIEGAZIONE,
  type EsempioNumerico,
  type PaginaSpiegazione as ContenutoSpiegazione,
} from '../../src/ui/contenutiSpiegazione.ts';
import { BloccoEsempio, BloccoFonte } from '../../src/ui/BloccoEsempioSpiegazione.tsx';
import { PERCORSO_HOME, percorsoArea } from '../../src/ui/percorsi.ts';
import { parseRotta } from '../../src/ui/rotte.ts';
import { SCHERMATE } from '../../src/ui/schermate/registro.ts';
import { calcolaEsempio } from '../../src/ui/spiegazioneEsempio.ts';
import { STRINGHE_UTENTE, type ChiaveStringaUtente } from '../../src/ui/testi.ts';

const esc = (s: string): string => s.replace(/'/g, '&#x27;');

describe('3. Errori attesi', () => {
  it('E-01: una pagina non dichiarata cade sulla home, non su una schermata di errore', () => {
    expect(() => parseRotta('#/spiegazione/non-esiste')).not.toThrow();
    expect(parseRotta('#/spiegazione/non-esiste')).toEqual({ tipo: 'home' });
  });

  it('E-02: ogni percorso dichiarato in un\'istanza reale esiste davvero (oggi, vacuo)', () => {
    const reali: readonly string[] = [
      PERCORSO_HOME,
      ...ID_AREE.map(percorsoArea),
      ...SCHERMATE.map((s) => s.percorso),
    ];
    // Oggi PAGINE_SPIEGAZIONE ha una sola istanza e passi:[]: il ciclo non
    // esercita nessun confronto reale — è il caso stesso a dichiararlo
    // (nota introduttiva del documento dei casi).
    expect(PAGINE_SPIEGAZIONE.flatMap((p) => p.passi)).toHaveLength(0);
    for (const pagina of PAGINE_SPIEGAZIONE) {
      for (const passo of pagina.passi) expect(reali).toContain(passo.percorso);
    }
    // Un percorso inventato non comparirebbe fra quelli reali: dimostra che
    // il controllo sopra intercetterebbe un rimando verso il nulla, se una
    // futura istanza (11, 12, ...) lo dichiarasse.
    expect(reali).not.toContain('#/spiegazione/questa-rotta-non-esiste');
  });

  it('E-03: un ingresso non valido sostituisce i blocchi 5-6 con la riga condivisa, niente eccezione', () => {
    const esempio: EsempioNumerico = {
      tipo: 'valore-risparmi',
      // 0 € è rifiutato da simulaRisparmio col motivo 'somma-a-zero': è il
      // minimo garantito dal tipo Esito, non un'istanza finta per far
      // passare il test — vedi core/simulazioneRisparmio.ts, primoMotivo().
      ingresso: { risparmioCent: 0, anni: 1, inflazioneAnnuaBp: 200 },
      frase: 'spiegazioneInflazioneSpesaFrase',
      paragone: 'spiegazioneInflazioneSpesaParagone',
      fonte: 'spiegazioneInflazioneSpesaFonte',
      avvertenza: 'spiegazioneInflazioneSpesaAvvertenza',
    };
    const esito = calcolaEsempio(esempio);
    expect(esito.ok).toBe(false);
    expect(() =>
      renderToStaticMarkup(createElement(BloccoEsempio, { esempio, esito })),
    ).not.toThrow();
    const m = renderToStaticMarkup(createElement(BloccoEsempio, { esempio, esito }));
    expect(m).toContain(STRINGHE_UTENTE.spiegazioneEsempioNonDisponibile);
    expect(m).not.toMatch(/\d €/); // nessun numero al posto della cifra
    expect(renderToStaticMarkup(createElement(BloccoFonte, { esempio, esito }))).toBe('');
  });

  it("E-04: ogni pagina dichiarata risponde a una domanda che la sua area contiene davvero", () => {
    for (const p of PAGINE_SPIEGAZIONE) {
      expect((AREE[p.area].domande as readonly ChiaveStringaUtente[])).toContain(p.domanda);
    }
    const sbagliata: ContenutoSpiegazione = { ...ISTANZA_INFLAZIONE_SPESA, area: 'lavoro' };
    expect((AREE[sbagliata.area].domande as readonly ChiaveStringaUtente[])).not.toContain(
      sbagliata.domanda,
    );
  });

  it('E-05: nessuna domanda ha due destinazioni, sulle istanze reali; con due costruite sì', () => {
    const duplicati = (pagine: readonly ContenutoSpiegazione[]): readonly ChiaveStringaUtente[] => {
      const viste = new Set<ChiaveStringaUtente>();
      const doppie = new Set<ChiaveStringaUtente>();
      for (const p of pagine) {
        if (viste.has(p.domanda)) doppie.add(p.domanda);
        viste.add(p.domanda);
      }
      return [...doppie];
    };
    expect(duplicati(PAGINE_SPIEGAZIONE)).toEqual([]);
    expect(duplicati([ISTANZA_INFLAZIONE_SPESA, { ...ISTANZA_INFLAZIONE_SPESA }])).toEqual([
      'area1Altra1',
    ]);
  });

  it("E-06: il paragone reale non ripete la frase; un esempio costruito con paragone=frase lo farebbe", () => {
    const reale = ISTANZA_INFLAZIONE_SPESA.esempio;
    if (reale === null) throw new Error('precondizione: esempio atteso');
    expect(reale.paragone).not.toBe(reale.frase);

    const esitoReale = calcolaEsempio(reale);
    if (!esitoReale.ok) throw new Error('precondizione: esito ok atteso');
    const fraseTesto = STRINGHE_UTENTE[reale.frase].replace('{valore}', String(esitoReale.valori.valore));
    const paragoneTesto = STRINGHE_UTENTE[reale.paragone].replace(
      '{perdita}',
      String(esitoReale.valori.perdita),
    );
    // Correzione entrata dopo la fase 1 (commit «il paragone della 03
    // ripeteva il numero»): oggi i due testi finali sono diversi davvero.
    expect(paragoneTesto).not.toBe(fraseTesto);

    const controfattuale: EsempioNumerico = { ...reale, paragone: reale.frase };
    const esitoCf = calcolaEsempio(controfattuale);
    if (!esitoCf.ok) throw new Error('precondizione: esito ok atteso');
    const paragoneControfattuale = STRINGHE_UTENTE[controfattuale.paragone].replace(
      '{valore}',
      String(esitoCf.valori.valore),
    );
    expect(paragoneControfattuale).toBe(fraseTesto); // dimostra che un refuso sarebbe rilevabile
  });

  it('E-07: il messaggio sostitutivo si legge, non solo si intuisce', () => {
    const esempio: EsempioNumerico = {
      tipo: 'valore-risparmi',
      ingresso: { risparmioCent: 0, anni: 1, inflazioneAnnuaBp: 200 },
      frase: 'spiegazioneInflazioneSpesaFrase',
      paragone: 'spiegazioneInflazioneSpesaParagone',
      fonte: 'spiegazioneInflazioneSpesaFonte',
      avvertenza: 'spiegazioneInflazioneSpesaAvvertenza',
    };
    const esito = calcolaEsempio(esempio);
    const m = renderToStaticMarkup(createElement(BloccoEsempio, { esempio, esito }));
    expect(m).toContain(esc(STRINGHE_UTENTE.spiegazioneEsempioNonDisponibile));
    expect(m).not.toContain('<svg'); // non solo un'icona
    expect(STRINGHE_UTENTE.spiegazioneEsempioNonDisponibile).not.toMatch(/errore|invalid|null|undefined/i);
  });
});
