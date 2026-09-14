/**
 * Unico componente autorizzato a stampare testo rivolto all'utente.
 * Applica il guardrail A RUNTIME, non solo nei test: se una stringa
 * prescrittiva sfugge alla revisione, qui viene bloccata e resa visibile
 * invece di finire sotto gli occhi di chi usa l'app.
 */

import { verificaTestoUtente } from '../guardrails/index.ts';
import { t, type ChiaveStringaUtente } from './testi.ts';

export function Testo({ chiave }: { chiave: ChiaveStringaUtente }) {
  const testo = t(chiave);
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
