/**
 * LA SCALA DELLE IPOTESI SUL TASSO CHE SI MUOVE — agente ui-builder.
 * Funzionalità 10.
 *
 * Quattro righe: che cosa succederebbe alla rata mobile a quattro valori di
 * tasso diversi da oggi. «Sono ipotesi, non pronostici» sta A SCHERMO,
 * accanto alla scala, non in una nota a piè di pagina.
 *
 * NIENTE ROSA QUI: il rosa è riservato al blocco «che cosa questa pagina non
 * fa», in fondo alla pagina — anche la riga sul periodo non dichiarato usa
 * il viola chiaro, non il rosa.
 *
 * Nessun calcolo qui dentro: ogni riga arriva già pronta da
 * calcolaScalaIpotesiTassoVariabile, e diventa parole solo attraverso
 * formattaEuro e formattaPercentuale.
 */

import type { ReactElement } from 'react';
import { formattaEuro, formattaPercentuale } from '../core/formatoIt.ts';
import type { RigaIpotesiTassoVariabile } from '../core/ipotesiTassoVariabile.ts';
import { periodoScartiDaCompilare, SCARTI_IPOTESI_TASSO_MUTUO } from '../core/scartiIpotesiTassoMutuo.ts';
import { Testo } from './Testo.tsx';
import type { ChiaveStringaUtente } from './testi.ts';

const ETICHETTA_SCARTO: Readonly<Record<number, ChiaveStringaUtente>> = {
  [-100]: 'rataMutuoIpotesiEtichettaMeno1',
  0: 'rataMutuoIpotesiEtichettaOggi',
  100: 'rataMutuoIpotesiEtichettaPiu1',
  200: 'rataMutuoIpotesiEtichettaPiu2',
};

function testoEtichettaScarto(scartoBp: number): ReactElement {
  const chiave = ETICHETTA_SCARTO[scartoBp];
  if (chiave !== undefined) return <Testo chiave={chiave} />;
  return (
    <Testo
      chiave="rataMutuoIpotesiEtichettaScarto"
      valori={{ scarto: formattaPercentuale(scartoBp) }}
    />
  );
}

function RigaIpotesi({ riga }: { riga: RigaIpotesiTassoVariabile }): ReactElement {
  const scesaOTagliata = riga.tassoIpotesiBp === 0 && riga.scartoBp < 0;
  return (
    <li className="ipotesi-riga">
      <span className="ipotesi-etichetta">{testoEtichettaScarto(riga.scartoBp)}</span>
      <span className="ipotesi-tasso cifra">{formattaPercentuale(riga.tassoIpotesiBp)}</span>
      <span className="ipotesi-rata cifra">{formattaEuro(riga.rataIpotesiCent)}</span>
      <span className="ipotesi-scarto cifra">
        {riga.differenzaMensileVsOggiCent === 0
          ? '—'
          : `${riga.differenzaMensileVsOggiCent > 0 ? '+' : '−'}${formattaEuro(
              Math.abs(riga.differenzaMensileVsOggiCent),
            )}`}
      </span>
      {scesaOTagliata && (
        <span className="ipotesi-nota-taglio">
          <Testo chiave="rataMutuoIpotesiTassoATerra" />
        </span>
      )}
    </li>
  );
}

export function ScalaIpotesiMutuo({
  ipotesi,
}: {
  ipotesi: readonly RigaIpotesiTassoVariabile[];
}): ReactElement {
  return (
    <section className="scala-ipotesi">
      <h3 className="ipotesi-titolo">
        <Testo chiave="rataMutuoIpotesiTitolo" />
      </h3>
      <p className="ipotesi-intro">
        <Testo chiave="rataMutuoIpotesiIntro" />
      </p>
      <ul className="ipotesi-elenco">
        {ipotesi.map((riga) => (
          <RigaIpotesi key={riga.scartoBp} riga={riga} />
        ))}
      </ul>
      <p className="ipotesi-non-previsione">
        <Testo chiave="rataMutuoIpotesiNonPrevisione" />
      </p>
      {periodoScartiDaCompilare(SCARTI_IPOTESI_TASSO_MUTUO) && (
        <p className="ipotesi-periodo-mancante">
          <Testo chiave="rataMutuoIpotesiPeriodoMancante" />
        </p>
      )}
    </section>
  );
}
