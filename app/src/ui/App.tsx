/**
 * UI — agente ui-builder. Possiede app/src/ui/ in esclusiva.
 * Non contiene testo letterale: ogni stringa passa da stringheUtente.ts,
 * così il guardrail ha un punto unico da controllare.
 * Nessuna chiamata di rete, nessun font remoto.
 */

import { t } from './stringheUtente.ts';
import { Testo } from './Testo.tsx';

function Sezione({
  titolo,
  children,
}: {
  titolo: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="sezione">
      <h2>{titolo}</h2>
      {children ?? <p className="placeholder">{t('statoPlaceholder')}</p>}
    </section>
  );
}

export function App() {
  return (
    <div className="app">
      <header className="intestazione">
        <h1>{t('appTitolo')}</h1>
        <p className="sottotitolo">{t('appSottotitolo')}</p>
      </header>

      <main>
        {/* TODO(scenario): il documento arriva da app/fixtures/ una volta
            congelato lo scenario. Il core espone calcolaLettura(). */}
        <Sezione titolo={t('sezioneDocumento')} />
        <Sezione titolo={t('sezioneLettura')} />
        <Sezione titolo={t('sezioneVerifica')}>
          <p>
            <Testo chiave="verificaIntro" />
          </p>
        </Sezione>

        <Sezione titolo={t('sezioneLimiti')}>
          <ul className="limiti">
            <li>
              <Testo chiave="limiteNoConsulenza" />
            </li>
            <li>
              <Testo chiave="limiteNoParsing" />
            </li>
            <li>
              <Testo chiave="limiteCampione" />
            </li>
          </ul>
        </Sezione>
      </main>

      <footer className="pie">
        <Testo chiave="notaOffline" />
      </footer>
    </div>
  );
}
