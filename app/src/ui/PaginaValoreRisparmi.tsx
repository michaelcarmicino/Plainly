/**
 * I RISPARMI FERMI MENTRE I PREZZI SALGONO — agente ui-builder.
 *
 * Un concetto solo per schermata: si scrivono due numeri, ne esce uno.
 *
 * I due campi sono due pezzi di stato separati, e nessuno dei due viene mai
 * svuotato dall'altro: chi ha digitato sette cifre non le ridigita perché ha
 * sbagliato gli anni. Niente viene salvato fuori da questa pagina — né
 * nell'indirizzo, né altrove — e niente si azzera da solo mentre la persona
 * ci pensa su: qui non esiste un limite di tempo.
 *
 * Nessun numero viene calcolato qui dentro: la schermata legge quello che è
 * stato scritto, lo passa al core e ne stampa la risposta.
 */

import { useState, type ReactElement } from 'react';
import { ANNI_MAX, ANNI_MIN, formattaEuro, RISPARMIO_MAX_CENT } from '../core/index.ts';
import { CampoNumerico, type MessaggioCampo } from './CampoNumerico.tsx';
import { decimaliOltreIlCentesimo, leggiAnni, leggiSomma, type LetturaCampo } from './letturaCampi.ts';
import {
  motivoDegliAnni,
  motivoDellaSomma,
  statoRisultato,
  TESTO_DEL_MOTIVO,
} from './motiviRisparmio.ts';
import { NotaTasso } from './NotaTasso.tsx';
import { RisultatoRisparmio } from './RisultatoRisparmio.tsx';
import { Testo } from './Testo.tsx';
import { t } from './testi.ts';

const VALORI_SOMMA = { massimo: formattaEuro(RISPARMIO_MAX_CENT) };

const valoriAnni = (): Readonly<Record<string, string | number>> => ({
  min: ANNI_MIN,
  max: ANNI_MAX,
  esempio: t('simulazioneRisparmioEsempioAnni'),
});

function messaggioSomma(lettura: LetturaCampo, testo: string): MessaggioCampo | undefined {
  const motivo = motivoDellaSomma(lettura);
  if (motivo !== null) {
    return { chiave: TESTO_DEL_MOTIVO[motivo], valori: VALORI_SOMMA, tono: 'errore' };
  }
  if (lettura.stato === 'letto' && decimaliOltreIlCentesimo(testo)) {
    return {
      chiave: 'simulazioneRisparmioNotaCentesimi',
      valori: { somma: formattaEuro(lettura.valore) },
      tono: 'nota',
    };
  }
  return undefined;
}

function messaggioAnni(lettura: LetturaCampo): MessaggioCampo | undefined {
  const motivo = motivoDegliAnni(lettura);
  if (motivo === null) return undefined;
  return { chiave: TESTO_DEL_MOTIVO[motivo], valori: valoriAnni(), tono: 'errore' };
}

export function PaginaValoreRisparmi(): ReactElement {
  const [somma, setSomma] = useState('');
  const [anni, setAnni] = useState('');

  const letturaSomma = leggiSomma(somma);
  const letturaAnni = leggiAnni(anni);

  return (
    <div className="simulazione">
      <p className="occhiello">
        <Testo chiave="simulazioneRisparmioOcchiello" />
      </p>
      <h2 className="simulazione-titolo">
        <Testo chiave="simulazioneRisparmioTitolo" />
      </h2>
      <p className="simulazione-intro">
        <Testo chiave="simulazioneRisparmioIntro" />
      </p>

      <div className="campi">
        <CampoNumerico
          id="campo-somma"
          etichetta="simulazioneRisparmioEtichettaSomma"
          aiuto="simulazioneRisparmioAiutoSomma"
          esempio="simulazioneRisparmioEsempioSomma"
          testo={somma}
          messaggio={messaggioSomma(letturaSomma, somma)}
          modoTastiera="decimal"
          aCambio={setSomma}
        />
        <CampoNumerico
          id="campo-anni"
          etichetta="simulazioneRisparmioEtichettaAnni"
          aiuto="simulazioneRisparmioAiutoAnni"
          aiutoValori={valoriAnni()}
          esempio="simulazioneRisparmioEsempioAnni"
          testo={anni}
          messaggio={messaggioAnni(letturaAnni)}
          modoTastiera="numeric"
          aCambio={setAnni}
        />
      </div>

      <RisultatoRisparmio stato={statoRisultato(letturaSomma, letturaAnni)} />

      <NotaTasso />

      <section className="limiti-schermata">
        <h3 className="limiti-titolo">
          <Testo chiave="simulazioneRisparmioLimitiTitolo" />
        </h3>
        <ul className="limiti">
          <li>
            <Testo chiave="simulazioneRisparmioLimiteAzione" />
          </li>
          <li>
            <Testo chiave="simulazioneRisparmioLimiteDati" />
          </li>
        </ul>
      </section>
    </div>
  );
}
