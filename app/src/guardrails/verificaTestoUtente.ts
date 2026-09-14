/**
 * NUCLEO DEI GUARDRAIL — implementato, non abbozzato.
 * Agente: guardrail-officer (app/src/guardrails/).
 *
 * `verificaTestoUtente` è la funzione che rende ESEGUIBILE il vincolo di
 * dominio: il prodotto spiega e calcola, non consiglia.
 * Viene usata in tre punti:
 *   1. dai test (app/tests/guardrails.test.ts, lessico-ui.test.ts)
 *   2. dall'hook PostToolUse dopo ogni Edit/Write sui sorgenti
 *   3. a runtime dalla UI, per ogni stringa mostrata a schermo
 * È pura e sincrona: nessuna rete, nessun LLM.
 */

import {
  LESSICO_PRESCRITTIVO,
  type GravitaViolazione,
  type TermineVietato,
} from './lessico.ts';

export interface Violazione {
  readonly termineId: string;
  /** Il testo esatto trovato, come appare nella stringa. */
  readonly occorrenza: string;
  readonly indice: number;
  readonly motivo: string;
  readonly riformulazione: string;
  readonly gravita: GravitaViolazione;
}

export interface EsitoVerifica {
  readonly conforme: boolean;
  readonly violazioni: readonly Violazione[];
  /** Estratto della stringa esaminata, per il messaggio d'errore. */
  readonly estratto: string;
}

const estrai = (testo: string, max = 120): string =>
  testo.length <= max ? testo : `${testo.slice(0, max)}…`;

/**
 * Verifica una singola stringa rivolta all'utente.
 * Ritorna sempre un esito: non lancia, non registra, non modifica il testo.
 */
export function verificaTestoUtente(testo: string): EsitoVerifica {
  const violazioni: Violazione[] = [];

  if (typeof testo !== 'string' || testo.length === 0) {
    return { conforme: true, violazioni: [], estratto: '' };
  }

  for (const termine of LESSICO_PRESCRITTIVO) {
    // lastIndex va azzerato: le regex sono globali e condivise fra chiamate.
    const re = new RegExp(termine.radice.source, termine.radice.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(testo)) !== null) {
      violazioni.push({
        termineId: termine.id,
        occorrenza: m[0],
        indice: m.index,
        motivo: termine.motivo,
        riformulazione: termine.riformulazione,
        gravita: termine.gravita,
      });
      if (m[0].length === 0) re.lastIndex += 1; // guardia anti-loop
    }
  }

  violazioni.sort((a, b) => a.indice - b.indice);

  return {
    conforme: violazioni.every((v) => v.gravita !== 'blocco'),
    violazioni,
    estratto: estrai(testo),
  };
}

/** Verifica un insieme di stringhe (es. l'intero registro della UI). */
export function verificaInsieme(
  stringhe: Readonly<Record<string, string>>,
): ReadonlyArray<{ chiave: string; esito: EsitoVerifica }> {
  return Object.entries(stringhe)
    .map(([chiave, testo]) => ({ chiave, esito: verificaTestoUtente(testo) }))
    .filter(({ esito }) => esito.violazioni.length > 0);
}

/** Messaggio d'errore leggibile in console e nel report del test. */
export function formattaViolazioni(chiave: string, esito: EsitoVerifica): string {
  const righe = esito.violazioni.map(
    (v) =>
      `    [${v.gravita}] "${v.occorrenza}" (${v.termineId}) — ${v.motivo}\n` +
      `        → ${v.riformulazione}`,
  );
  return `  ${chiave}: «${esito.estratto}»\n${righe.join('\n')}`;
}

export type { TermineVietato };
