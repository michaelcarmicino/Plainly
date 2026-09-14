/**
 * DAL CODICE DEL REGISTRO ALLA FRASE CHE SI LEGGE — agente ui-builder.
 *
 * Stesso schema della 07 (motiviRisparmio.ts): il core rifiuta un ingresso
 * con un CODICE, mai con una frase già scritta — le parole restano tutte in
 * testi.ts / testiFonti.ts, l'unico punto che il guardrail scandisce. La
 * mappa qui sotto è un `Record<MotivoErroreFonte, ChiaveStringaUtente>`
 * COMPLETO, non parziale: se un domani il core aggiunge un terzo codice, il
 * compilatore segnala qui la chiave mancante invece di lasciare a schermo un
 * pezzo di riga muto.
 *
 * Nessuno dei due codici è raggiungibile con i dati reali di oggi — un solo
 * id nel registro, una sola unità e coerente — ma la mappa resta comunque
 * completa: è la garanzia che non lo sia più domani senza che il
 * compilatore se ne accorga.
 */

import {
  esitoOk,
  formattaEuro,
  formattaPercentuale,
  valoreBpDiRiga,
  type Esito,
  type MotivoErroreFonte,
  type RigaFonte,
} from '../core/index.ts';
import type { ChiaveStringaUtente } from './testi.ts';

export const TESTO_DEL_MOTIVO_FONTE: Readonly<Record<MotivoErroreFonte, ChiaveStringaUtente>> = {
  'id-sconosciuto': 'fontiErroreRiga',
  'unita-non-punti-base': 'fontiErroreRiga',
};

/**
 * La frase di tutti i giorni che precede il nome tecnico, per gli id che
 * questa pagina sa già descrivere. Un id che arriva dal registro ma non è
 * ancora qui dentro non sparisce dalla pagina: la riga mostra comunque il
 * suo indicatore tecnico, non un vuoto — vedi RigaRegistroFonte.tsx.
 */
export const NOME_QUOTIDIANO_PER_ID: Partial<Record<string, ChiaveStringaUtente>> = {
  'inflazione-nic': 'fontiNomeInflazione',
};

/**
 * Il testo del valore, con l'unità giusta secondo quello che la riga
 * dichiara di essere. Per i punti base passa SEMPRE da `valoreBpDiRiga`
 * invece di leggere `valore` a occhio: così un'unità scritta male in una
 * riga futura diventa una frase da persona, non un numero mostrato con
 * sicurezza sbagliata.
 */
export function esitoTestoValore(riga: RigaFonte): Esito<string, MotivoErroreFonte> {
  if (riga.unita === 'centesimi') return esitoOk(formattaEuro(riga.valore));
  const esito = valoreBpDiRiga(riga);
  return esito.ok ? esitoOk(formattaPercentuale(esito.valore)) : esito;
}
