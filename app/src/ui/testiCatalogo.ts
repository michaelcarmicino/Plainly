/**
 * LE PAROLE NUOVE DEL CATALOGO DELLE DOMANDE — agente ui-builder.
 *
 * File affiancato per la stessa ragione di testiSimulazione.ts e
 * testiFonti.ts: dentro testi.ts queste righe farebbero superare le 150.
 * STRINGHE_UTENTE resta un oggetto solo — questo blocco ci entra con lo
 * spread — quindi il registro scandito dal guardrail resta uno soltanto.
 *
 * Sei domande nuove: ognuna sostituisce, spiegando un meccanismo o una
 * differenza fra due percorsi invece di indicare una scelta o indovinare
 * il futuro di chi legge, una domanda d'origine che non poteva entrare
 * così com'era. La formulazione vecchia non compare qui, nemmeno come
 * commento: il guardrail scandisce anche i commenti dei sorgenti.
 *
 * Tre righe dicono lo stato di una voce A PAROLE — mai solo un colore, mai
 * solo al passaggio del mouse, che al proiettore e su touch non esiste.
 */

export const STRINGHE_CATALOGO = {
  // --- Sei domande nuove ---------------------------------------------------
  area1Altra4:
    'Che cosa cambia in bolletta fra un\'offerta a prezzo fisso e una a prezzo variabile?',
  area2Altra4:
    'Con lo stesso importo, quanto resta a un dipendente e quanto a chi lavora in proprio?',
  area2Altra5:
    'Contratto a termine e a tempo indeterminato: che cosa cambia, in concreto, fra i due?',
  area3Altra4:
    'Con i soldi che ho da parte, per quanti mesi coprirei le spese senza stipendio?',
  area3Altra5:
    'Se i soldi mi servono fra sei mesi, che cosa cambia rispetto a quando mi servono fra dieci anni?',
  area3Altra6:
    'Quando una persona muore, che cosa succede alla casa e ai risparmi che lascia?',

  // --- Lo stato di una voce, scritto a parole ------------------------------
  domandaInArrivo: 'La schermata che risponde a questa domanda non c\'è ancora.',
  domandaSenzaFonte:
    'Su questa il sito non ha una risposta con una fonte dichiarata, e non la inventa.',
  areaNessunaSchermata:
    'In quest\'area, oggi, nessuna domanda ha ancora una schermata di risposta pronta: arriveranno una alla volta.',
} as const satisfies Record<string, string>;
