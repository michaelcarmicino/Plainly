/**
 * UN CAMPO IN CUI SI SCRIVE UN NUMERO — agente ui-builder.
 *
 * Scelte che non sono di gusto:
 *
 * - `type="text"`, non `type="number"`. Un campo numerico del browser rifiuta
 *   il punto delle migliaia italiano, e i suoi `min`/`max` non fermano quello
 *   che viene incollato: il confine vero vive nel core, che controlla sia
 *   quello che si scrive sia quello che si incolla.
 * - L'etichetta sta ACCANTO al campo, non solo dentro. Il testo dentro
 *   sparisce appena si scrive, e con lui sparirebbe la domanda.
 * - Lo spazio del messaggio è riservato sempre, anche quando non c'è niente
 *   da dire: così la comparsa di un errore non sposta di una riga tutto ciò
 *   che sta sotto.
 * - `aria-describedby` lega l'aiuto e il messaggio AL CAMPO: con due campi a
 *   schermo, un avviso generico in cima costringerebbe a indovinare quale dei
 *   due riguarda, e chi usa uno screen reader non lo sentirebbe affatto.
 */

import type { ReactElement } from 'react';
import { Testo } from './Testo.tsx';
import { t, type ChiaveStringaUtente } from './testi.ts';

export type ValoriTesto = Readonly<Record<string, string | number>>;

export interface MessaggioCampo {
  readonly chiave: ChiaveStringaUtente;
  readonly valori?: ValoriTesto;
  /** `errore` blocca il calcolo; `nota` racconta che cosa è stato fatto. */
  readonly tono: 'errore' | 'nota';
}

export function CampoNumerico({
  id,
  etichetta,
  aiuto,
  aiutoValori,
  esempio,
  testo,
  messaggio,
  modoTastiera,
  aCambio,
}: {
  id: string;
  etichetta: ChiaveStringaUtente;
  aiuto: ChiaveStringaUtente;
  aiutoValori?: ValoriTesto;
  esempio: ChiaveStringaUtente;
  testo: string;
  messaggio?: MessaggioCampo;
  modoTastiera: 'decimal' | 'numeric';
  aCambio: (testo: string) => void;
}): ReactElement {
  const idAiuto = `${id}-aiuto`;
  const idMessaggio = `${id}-messaggio`;
  const inErrore = messaggio?.tono === 'errore';

  return (
    <div className={inErrore ? 'campo campo-in-errore' : 'campo'}>
      <label className="campo-etichetta" htmlFor={id}>
        <Testo chiave={etichetta} />
      </label>

      <p className="campo-aiuto" id={idAiuto}>
        <Testo chiave={aiuto} valori={aiutoValori} />
      </p>

      <input
        className="campo-input cifra"
        id={id}
        type="text"
        inputMode={modoTastiera}
        autoComplete="off"
        spellCheck={false}
        placeholder={t(esempio)}
        value={testo}
        aria-invalid={inErrore || undefined}
        aria-describedby={messaggio === undefined ? idAiuto : `${idAiuto} ${idMessaggio}`}
        onChange={(evento) => aCambio(evento.target.value)}
      />

      <p
        className={inErrore ? 'campo-messaggio campo-messaggio-errore' : 'campo-messaggio'}
        id={idMessaggio}
        role={inErrore ? 'alert' : undefined}
      >
        {messaggio !== undefined && (
          <Testo chiave={messaggio.chiave} valori={messaggio.valori} />
        )}
      </p>
    </div>
  );
}
