/**
 * DALLA DATA SCRITTA A MANO ALLA FRASE CHE SI LEGGE — agente ui-builder.
 *
 * `registroFonti.ts` scrive la data in cui una riga è stata inserita nella
 * forma 'AAAA-MM-GG', la stessa in cui la scrive a mano chi compila la riga.
 * Qui dentro diventa una frase: «14 settembre 2026». Il core dice SE la
 * provenienza è completa; questa pagina dice SOLO com'è scritta — questa
 * funzione fa esattamente quel secondo passo, e nient'altro.
 *
 * Manuale e non con Intl.DateTimeFormat: un formattatore di locale dipende
 * dai dati installati sulla macchina, e qui il risultato deve restare
 * identico offline, su qualunque dispositivo. Pura: nessun Date.now, nessun
 * I/O, stesso ingresso stesso esito ovunque.
 *
 * La data arriva scritta a mano da una persona (08 e 10 aggiungeranno righe
 * così), quindi può essere sbagliata: vuota, senza trattini, con giorno e
 * anno invertiti, con un mese o un giorno fuori dai limiti del calendario.
 * `null` segnala questo fallimento senza inventare una data — un motivo
 * solo, non tanti da distinguere a schermo, per questo `null` invece di un
 * `Esito`. Chi chiama (RigaRegistroFonte.tsx) mostra al suo posto la stessa
 * frase già in uso per una riga illeggibile: la riga si degrada, la pagina
 * no.
 */

const MESI = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
] as const;

/**
 * Tre gruppi di sole cifre separati da un trattino: anno su quattro cifre,
 * mese e giorno su una o due. Non basta da sola a garantire una data che
 * esiste — ci pensano i controlli sui limiti subito sotto — ma già esclude
 * la stringa vuota, il testo libero e il formato invertito GG-MM-AAAA: lì
 * il primo gruppo (il giorno) non arriva mai a quattro cifre.
 */
const FORMATO_DATA = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

/**
 * 'AAAA-MM-GG' -> '14 settembre 2026'. Il giorno perde lo zero iniziale: in
 * italiano si scrive «5 marzo», non «05 marzo».
 *
 * `null` quando la stringa non ha questa forma, o il mese non è fra 1 e 12,
 * o il giorno non è fra 1 e 31: sono esattamente gli errori possibili su un
 * campo scritto a mano, e nessuno dei tre produce una data indovinata o
 * un'eccezione.
 */
export function dataInLettere(dataIso: string): string | null {
  const corrispondenza = FORMATO_DATA.exec(dataIso);
  if (corrispondenza === null) return null;

  const [, anno, mese, giorno] = corrispondenza;
  const numeroMese = Number(mese);
  const numeroGiorno = Number(giorno);
  if (numeroMese < 1 || numeroMese > 12) return null;
  if (numeroGiorno < 1 || numeroGiorno > 31) return null;

  const nomeMese = MESI[numeroMese - 1];
  const giornoSenzaZero = giorno.replace(/^0/, '');
  return `${giornoSenzaZero} ${nomeMese} ${anno}`;
}
