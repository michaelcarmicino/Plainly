/**
 * UNA RIGA DEL FACSIMILE, APRIBILE O FERMA — agente ui-builder.
 *
 * Nome scelto per il riuso che la specifica della 12 chiede esplicitamente:
 * «etichetta e valore facoltativo», non `VoceDocumento` (etichetta più
 * importo obbligatorio, usata dalle guide-documento a voci). Qui il valore
 * non esiste: il facsimile non ha numeri. Se un domani un'altra schermata
 * userà questo stesso componente con un valore accanto all'etichetta, il
 * prop `valore` si aggiunge come facoltativo senza rompere questa pagina.
 *
 * Clic o tocco, mai solo hover: `<button>` vero, `aria-expanded` e
 * `aria-controls`, focus visibile (il contorno globale in styles.css),
 * bersaglio da almeno 44px, nessun gesto obbligatorio, nessun limite di
 * tempo. Le tre intestazioni non apribili restano un titolo fermo: aprirle
 * non rivelerebbe niente, e un bottone che non fa nulla è un bersaglio
 * ingannevole per chi naviga da tastiera o con uno screen reader.
 */

import type { ReactElement, ReactNode } from 'react';
import { Testo } from './Testo.tsx';
import type { ChiaveStringaUtente } from './testi.ts';

export function RigaDocumento({
  id,
  etichetta,
  apribile,
  aperto,
  onToggle,
  children,
}: {
  id: string;
  etichetta: ChiaveStringaUtente;
  apribile: boolean;
  aperto: boolean;
  onToggle: () => void;
  children?: ReactNode;
}): ReactElement {
  const idContenuto = `${id}-contenuto`;

  if (!apribile) {
    return (
      <div className="riquadro-foglio">
        <h3 className="riquadro-foglio-etichetta">
          <Testo chiave={etichetta} />
        </h3>
      </div>
    );
  }

  return (
    <div className="riquadro-foglio riquadro-foglio-apribile">
      <button
        type="button"
        className="riquadro-foglio-bottone"
        aria-expanded={aperto}
        aria-controls={idContenuto}
        onClick={onToggle}
      >
        <span className="riquadro-foglio-etichetta">
          <Testo chiave={etichetta} />
        </span>
        <span className="riquadro-foglio-icona" aria-hidden="true">
          {aperto ? '−' : '+'}
        </span>
      </button>
      {aperto && (
        <div id={idContenuto} className="riquadro-foglio-contenuto">
          {children}
        </div>
      )}
    </div>
  );
}
