/**
 * REGRESSIONE — confine di parola sulle preposizioni articolate italiane.
 * Agente: guardrail-officer.
 *
 * «passa a» richiedeva un non-lettera subito dopo la "a": le preposizioni
 * articolate italiane (al, allo, alla, ai, agli, alle — più "ad" davanti a
 * vocale) fondono la "a" con l'articolo in un'unica parola, quindi «passa al
 * mercato libero» non veniva mai intercettato. Non era una scelta di
 * perimetro: la radice non copriva la forma più comune di ciò che intendeva
 * già bloccare. Stesso difetto, stessa correzione, in «fai bene a» ed
 * «evita di» (dovere-personale): del/dello/della/dei/degli/delle.
 *
 * «cambia offerta» è invece un'aggiunta, non una correzione: gap segnalato
 * sulla 05 (docs/test/05-guida-bolletta.md, CF-05), zero occorrenze
 * pre-esistenti in src/, tests/, fixtures/ al momento dell'aggiunta.
 */

import { describe, expect, it } from 'vitest';
import { verificaTestoUtente } from '../src/guardrails/index.ts';

describe('«passa a» copre anche le forme articolate', () => {
  it('blocca «passa al», la forma che sfuggiva prima della correzione', () => {
    const esito = verificaTestoUtente('Nella pagina si legge: passa al mercato libero.');
    expect(esito.conforme).toBe(false);
    expect(esito.violazioni.map((v) => v.termineId)).toContain('imperativo-scelta');
  });

  it('copre anche allo, alla, agli — non solo la forma con "al"', () => {
    for (const frase of [
      'La pagina dice di passa allo sportello online.',
      'La pagina dice di passa alla tariffa fissa.',
      'La pagina dice di passa agli operatori virtuali.',
    ]) {
      expect(verificaTestoUtente(frase).conforme, frase).toBe(false);
    }
  });

  it('la forma piana «passa a» resta bloccata come prima della correzione', () => {
    expect(verificaTestoUtente('Meglio passa a un altro fornitore.').conforme).toBe(false);
  });

  // Guardia anti-regressione: l'estensione non deve catturare parole che
  // iniziano per caso con "al"/"allo" — il confine dopo la forma articolata
  // resta attivo grazie al lookahead condiviso da tutte le radici.
  it('non scatta su parole solo simili alle forme articolate aggiunte', () => {
    const esito = verificaTestoUtente(
      'Passa allora al passo successivo: alloggio e allenamento non sono voci della bolletta.',
    );
    expect(esito.violazioni.map((v) => v.termineId)).not.toContain('imperativo-scelta');
  });
});

describe('«fai bene a» ed «evita di» coprono le stesse forme articolate', () => {
  it('«fai bene a» copre anche le forme articolate (al, alla)', () => {
    expect(verificaTestoUtente('Fai bene al bilancio a controllare ogni voce.').conforme).toBe(
      false,
    );
    expect(verificaTestoUtente('Fai bene alla tua situazione a cambiare.').conforme).toBe(false);
  });

  it('«evita di» copre anche le forme articolate (degli, del)', () => {
    const conAltri = verificaTestoUtente('Evita degli errori comuni quando leggi la bolletta.');
    const conDel = verificaTestoUtente('Evita del tutto i costi nascosti.');
    expect(conAltri.conforme).toBe(false);
    expect(conDel.conforme).toBe(false);
  });
});

describe('«cambia offerta» — gap segnalato dalla 05', () => {
  it('blocca «cambia offerta»', () => {
    const esito = verificaTestoUtente('Per pagare meno, cambia offerta prima del rinnovo.');
    expect(esito.conforme).toBe(false);
    expect(esito.violazioni.map((v) => v.termineId)).toContain('imperativo-scelta');
  });

  it('non scatta su «offerta» isolata, senza l\'imperativo «cambia» adiacente', () => {
    const esito = verificaTestoUtente(
      "Che cosa cambia in bolletta fra un'offerta a prezzo fisso e una a prezzo variabile?",
    );
    expect(esito.conforme).toBe(true);
  });
});
