/**
 * LE PAROLE DELLA SCHERMATA SUI RISPARMI FERMI — agente ui-builder.
 *
 * Sta in un file suo per una ragione meccanica: testi.ts, con queste dentro,
 * supererebbe le 150 righe. `STRINGHE_UTENTE` resta un oggetto solo — questo
 * blocco ci entra con lo spread — quindi il registro scandito dal guardrail
 * resta uno e uno soltanto.
 *
 * Due regole governano ogni frase qui sotto:
 *
 * 1. PRIMA L'IMMAGINE CONCRETA, POI IL NOME TECNICO. Il carrello della spesa
 *    che si svuota viene prima della parola «inflazione», mai dopo.
 * 2. LA SCHERMATA DESCRIVE UN'EROSIONE E SI FERMA LÌ. Nessuna frase dice che
 *    cosa fare di quei soldi, nemmeno di sfuggita: «tenerli fermi ti costa X»
 *    passerebbe il lessico parola per parola e resterebbe un giudizio su una
 *    scelta di chi legge.
 *
 * I numeri non sono mai scritti a mano: entrano dai segnaposto `{...}` che
 * <Testo> sostituisce con i valori che arrivano dal core.
 */

export const STRINGHE_SIMULAZIONE = {
  // --- Intestazione della schermata --------------------------------------
  simulazioneRisparmioOcchiello: 'Il futuro',
  simulazioneRisparmioTitolo:
    'I risparmi fermi: che cosa succede loro mentre i prezzi salgono?',
  simulazioneRisparmioIntro:
    'Immagina di fare la spesa con lo stesso carrello di un anno fa: con gli stessi soldi, oggi ci entrano meno cose. Quella differenza si chiama inflazione, e tocca anche i soldi che stanno fermi. Qui sotto vedi di quanto, sulla tua cifra.',
  simulazioneRisparmioPasso: 'I risparmi fermi e i prezzi che salgono',

  // --- I due campi: etichetta accanto, esempio dentro ---------------------
  simulazioneRisparmioEtichettaSomma: 'Quanti soldi hai fermi, in euro',
  simulazioneRisparmioAiutoSomma:
    'Scrivila come la scriveresti a mano: 10.000, oppure 10000. Vanno bene tutti e due.',
  simulazioneRisparmioEsempioSomma: '10.000',
  simulazioneRisparmioEtichettaAnni: 'Per quanti anni li lasci lì',
  simulazioneRisparmioAiutoAnni:
    'Un numero intero da {min} a {max}. Per esempio {esempio}: gli anni che si passano alle superiori.',
  simulazioneRisparmioEsempioAnni: '5',

  // --- Il riquadro del risultato, nei suoi tre momenti -------------------
  simulazioneRisparmioVuoto:
    'Qui comparirà la tua cifra. Servono due numeri, tutti e due qui sopra: quanti soldi hai fermi, e per quanti anni li lasci lì. Appena li scrivi, il calcolo si fa da solo.',
  simulazioneRisparmioInSospeso:
    'La cifra compare appena i due numeri qui sopra sono a posto. Accanto al campo c\'è scritto che cosa non torna.',
  simulazioneRisparmioEtichettaValore:
    'Fra {anni} anni quei soldi valgono quanto oggi vale',
  simulazioneRisparmioRisultato:
    'I tuoi {somma} fra {anni} anni comprano quanto {valore} comprano oggi.',
  simulazioneRisparmioParagone:
    'Su ogni 100 € lasciati fermi, dopo {anni} anni ne resta il valore di {resto}.',
  simulazioneRisparmioPerdita:
    'Fra le due cifre c\'è una differenza di {perdita}: i soldi sono ancora tutti lì, ma portano a casa meno roba.',
  simulazioneRisparmioPerditaNulla:
    'Su una cifra così piccola la differenza non arriva a un centesimo: l\'aumento dei prezzi c\'è lo stesso, ma in euro non si vede.',

  // --- Da dove viene il numero, e che cosa non è -------------------------
  simulazioneRisparmioTasso:
    'Il calcolo parte da un aumento dei prezzi di {tasso} all\'anno, ripetuto per ognuno degli anni che hai scritto.',
  simulazioneRisparmioFonte:
    'Quel {tasso} è un valore medio scritto a mano dentro il sito, non un dato preso da internet: è il motivo per cui questa pagina funziona anche con il Wi-Fi spento.',
  simulazioneRisparmioPeriodoMancante:
    'Su quali anni sia calcolata quella media non è ancora stato stabilito da nessuno. Finché manca, {tasso} è un numero di prova: il calcolo lo puoi rifare, la sua provenienza non la puoi ancora controllare.',
  simulazioneRisparmioAvvertenza:
    'Non è una previsione: è una divisione fatta su quel numero. Se nei prossimi anni i prezzi saliranno di più o di meno, la cifra sarà diversa.',
  simulazioneRisparmioLinkFonti:
    'Vedi da dove vengono tutti i numeri di questo sito, uno per uno',

  // --- Quando qualcosa non torna: messaggi da persona, non da modulo -----
  simulazioneRisparmioErroreSomma:
    'Questo non sembra un numero. Scrivi solo le cifre della somma, per esempio 10.000.',
  simulazioneRisparmioErroreSommaNegativa:
    'Qui va un numero sopra lo zero: è la somma che hai da parte, quindi il segno meno davanti non serve.',
  simulazioneRisparmioErroreSommaZero:
    'Con zero euro non c\'è niente da calcolare. Scrivi la somma che hai ferma, anche a occhio.',
  simulazioneRisparmioErroreSommaAlta:
    'Controlla questo numero, sembra troppo alto: questa pagina arriva fino a {massimo}.',
  simulazioneRisparmioErroreAnni:
    'Qui va un numero intero di anni, da {min} a {max} — per esempio {esempio}. Mezzi anni e parole scritte in lettere non si possono usare.',
  simulazioneRisparmioErroreAnniFuori:
    'Gli anni vanno da {min} a {max}. Scrivine uno dentro questo intervallo, per esempio {esempio}.',
  simulazioneRisparmioErroreTasso:
    'Il numero dell\'aumento dei prezzi scritto dentro il sito non è leggibile, quindi il calcolo non si può fare.',
  simulazioneRisparmioNotaCentesimi:
    'I calcoli si fermano al centesimo: il tuo numero è stato portato a {somma}, cioè al centesimo più vicino.',

  // --- Il confine, dichiarato a schermo ----------------------------------
  simulazioneRisparmioLimitiTitolo: 'Che cosa questa pagina non fa',
  simulazioneRisparmioLimiteAzione:
    'Non dice che cosa fare di quei soldi. Racconta che cosa succede loro mentre i prezzi salgono, e si ferma lì.',
  simulazioneRisparmioLimiteDati:
    'Non legge nessun documento e non chiede chi sei: i due numeri li scrivi tu e restano in questa pagina.',
} as const satisfies Record<string, string>;
