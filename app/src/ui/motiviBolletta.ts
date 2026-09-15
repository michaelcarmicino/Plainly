/**
 * DAL CODICE DEL COSTO PER KWH ALLA FRASE CHE SI LEGGE — agente ui-builder.
 * Funzionalità 05. Stesso schema di motiviFonti.ts: il core rifiuta con un
 * CODICE, mai con una frase già scritta.
 *
 * Mappa `Record<MotivoCostoKwhNonDisponibile, ChiaveStringaUtente>`
 * COMPLETA: se il core aggiunge un terzo motivo, il compilatore segnala qui
 * la chiave mancante invece di lasciare a schermo un pezzo di riga muto.
 */

import type { MotivoCostoKwhNonDisponibile } from '../core/index.ts';
import type { ChiaveStringaUtente } from './testi.ts';

export const TESTO_DEL_MOTIVO_COSTO_KWH: Readonly<
  Record<MotivoCostoKwhNonDisponibile, ChiaveStringaUtente>
> = {
  'quantita-assente': 'bollettaCostoKwhAssente',
  'quantita-zero': 'bollettaCostoKwhZero',
};
