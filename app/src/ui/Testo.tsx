/**
 * Unico componente autorizzato a stampare testo rivolto all'utente.
 * Applica il guardrail A RUNTIME, non solo nei test: se una stringa
 * prescrittiva sfugge alla revisione, qui viene bloccata e resa visibile
 * invece di finire sotto gli occhi di chi usa l'app.
 */

import { verificaTestoUtente } from '../guardrails/index.ts';
import { t, type ChiaveStringaUtente } from './testi.ts';

/**
 * Sostituisce i segnaposto `{nome}` con un valore calcolato altrove.
 * Serve alle stringhe che contengono un numero derivato — il badge delle
 * aree — senza doverne scrivere una copia per ogni caso: nel registro
 * resta una frase intera da scandire, e il numero non è mai scritto a mano.
 */
function applicaValori(
  testo: string,
  valori: Readonly<Record<string, string | number>> | undefined,
): string {
  if (valori === undefined) return testo;
  return Object.entries(valori).reduce(
    (acc, [nome, valore]) => acc.split(`{${nome}}`).join(String(valore)),
    testo,
  );
}

export function Testo({
  chiave,
  valori,
}: {
  chiave: ChiaveStringaUtente;
  valori?: Readonly<Record<string, string | number>>;
}) {
  const testo = applicaValori(t(chiave), valori);
  const esito = verificaTestoUtente(testo);

  if (!esito.conforme) {
    return (
      <mark className="violazione-guardrail" role="alert">
        [guardrail] stringa «{chiave}» bloccata:{' '}
        {esito.violazioni.map((v) => v.termineId).join(', ')}
      </mark>
    );
  }

  return <>{testo}</>;
}
