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
 * 'AAAA-MM-GG' -> '14 settembre 2026'. Il giorno perde lo zero iniziale: in
 * italiano si scrive «5 marzo», non «05 marzo».
 *
 * Se il mese non è uno dei dodici attesi (una riga scritta male a mano), non
 * si inventa una data: si mostra il numero del mese così com'è, invece di
 * lasciare un buco o un testo che sembra corretto e non lo è.
 */
export function dataInLettere(dataIso: string): string {
  const [anno, mese, giorno] = dataIso.split('-');
  const nomeMese = MESI[Number(mese) - 1] ?? mese;
  const giornoSenzaZero = giorno.replace(/^0/, '');
  return `${giornoSenzaZero} ${nomeMese} ${anno}`;
}
