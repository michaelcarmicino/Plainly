/**
 * LE PAROLE DELLA PAGINA «DA DOVE VENGONO I NUMERI» — agente ui-builder.
 *
 * File affiancato per la stessa ragione di testiSimulazione.ts: dentro
 * testi.ts queste righe farebbero superare le 150. `STRINGHE_UTENTE` resta
 * un oggetto solo — questo blocco ci entra con lo spread — quindi il
 * registro scandito dal guardrail resta uno e uno soltanto.
 *
 * Il nome proprio di una fonte ('ISTAT') e quello del suo indicatore
 * ('indice NIC') NON stanno qui: restano dati sulla riga del registro,
 * letti così come sono scritti, per non alterare l'informazione originale.
 *
 * Questa pagina descrive da dove viene un numero e si ferma lì: non mette le
 * fonti in fila per affidabilità, non promette un aggiornamento che non può
 * fare da sola.
 */

export const STRINGHE_FONTI = {
  // --- Intestazione della pagina e della voce di percorso -----------------
  fontiOcchiello: 'Le fonti dei numeri',
  fontiPasso: 'Da dove vengono i numeri',
  fontiTitolo: 'Da dove vengono i numeri di questo sito',
  fontiIntro:
    'Ogni numero che vedi in questo sito ha una storia dietro: chi lo dice, su quali anni è calcolato, e da quando è scritto qui dentro. Qui sotto trovi quella storia, un numero alla volta — e se manca un pezzo, te lo diciamo invece di nasconderlo.',
  fontiAggiornamentoManuale:
    'Nessun numero qui dentro arriva da internet mentre usi il sito: ogni riga è scritta a mano da una persona, insieme alla data in cui l\'ha scritta.',

  // --- I campi di ogni riga: prima la domanda, poi il dato ----------------
  fontiColonnaValore: 'Quanto vale',
  fontiColonnaFonte: 'Da dove viene',
  fontiColonnaPeriodo: 'Su quali anni vale',
  fontiPeriodoValori: 'Dal {inizio} al {fine}',
  fontiInserito: 'Scritto qui a mano il {data}.',
  fontiPeriodoMancante:
    'Su quali anni sia calcolata questa media non è ancora stato stabilito da nessuno: è un pezzo che manca, e qualcuno deve ancora recuperarlo e scriverlo qui.',

  // --- I quattro stati: vuoto, righe da completare, riga rotta ------------
  fontiVuoto:
    'Qui compariranno i numeri usati in questo sito, uno per uno: chi li dice e da quando. Li aggiunge una persona a mano, un numero alla volta — al momento non ce n\'è ancora nessuno da mostrare.',
  fontiNessunaCompleta:
    'Per nessuno dei numeri qui sotto la provenienza è ancora completa: a ciascuno manca almeno un pezzo, indicato riga per riga.',
  fontiErroreRiga:
    'Questo numero scritto dentro il sito non è leggibile in modo corretto, quindi qui non viene mostrato.',

  // --- La frase di tutti i giorni per l'unica riga di oggi -----------------
  fontiNomeInflazione: 'Di quanto salgono i prezzi in un anno',

  // --- Il confine, dichiarato a schermo ------------------------------------
  fontiLimitiTitolo: 'Che cosa questa pagina non fa',
  fontiLimiteAggiornamento:
    'Questa pagina non aggiorna niente da sola: ogni numero cambia solo quando una persona lo scrive di nuovo a mano. Al posto di una data fissata in anticipo per il prossimo aggiornamento, trovi la data in cui ciascun numero è stato scritto qui.',
} as const satisfies Record<string, string>;
