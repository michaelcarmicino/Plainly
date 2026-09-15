/**
 * LE PAROLE DELLA SCHERMATA «LA RATA DEL MUTUO» — agente ui-builder.
 * Funzionalità 10.
 *
 * Sta in un file suo per la stessa ragione meccanica di testiSimulazione.ts:
 * testi.ts supererebbe le 150 righe. `STRINGHE_UTENTE` resta un oggetto
 * solo — questo blocco ci entra con lo spread — quindi il registro scandito
 * dal guardrail resta uno e uno soltanto.
 *
 * BLOCCO DA SCIOGLIERE (segnalato nel rapporto di consegna): queste chiavi
 * non sono ancora spandute in src/ui/testi.ts, che è fuori dal perimetro di
 * questo intervento. Finché non lo sono, `ChiaveStringaUtente` non le
 * conosce e ogni componente che le usa non compila: manca una riga sola,
 * `...STRINGHE_RATA_MUTUO,` accanto alle altre nello spread di testi.ts.
 *
 * Tre regole governano ogni frase:
 * 1. PRIMA L'IMMAGINE CONCRETA, POI IL NOME TECNICO — mai il contrario.
 * 2. LE DUE RATE NON HANNO UN VINCITORE: nessuna frase indica quale delle
 *    due opzioni sia da prendere, nemmeno di sfuggita.
 * 3. LE IPOTESI NON SONO PREVISIONI: lo dicono a schermo, non in una nota.
 *
 * I numeri non sono mai scritti a mano: entrano dai segnaposto `{...}` che
 * <Testo> sostituisce con i valori che arrivano dal core.
 */

export const STRINGHE_RATA_MUTUO = {
  // --- Intestazione -------------------------------------------------------
  rataMutuoOcchiello: 'Il futuro',
  rataMutuoTitolo: 'La rata del mutuo: un tasso fermo, un tasso che si muove',
  rataMutuoIntro:
    'Hai in mano un preventivo con due tassi: uno resta fermo per tutta la durata — sul preventivo lo trovi scritto "fisso" — l\'altro si muove insieme a un indice che non controlli — lo trovi scritto "variabile". Scrivi qui sotto i quattro numeri del tuo preventivo: vedrai le due rate mensili una accanto all\'altra, e la pagina si ferma lì, senza indicarne una.',
  rataMutuoPasso: 'La rata del mutuo, fermo e mobile a confronto',

  // --- I quattro campi ------------------------------------------------------
  rataMutuoEtichettaCapitale: 'Quanto chiedi in prestito, in euro',
  rataMutuoAiutoCapitale:
    'Scrivilo come lo scriveresti a mano: 150.000, oppure 150000. Vanno bene tutti e due.',
  rataMutuoEsempioCapitale: '150.000',
  rataMutuoEtichettaAnni: 'Per quanti anni',
  rataMutuoAiutoAnni: 'Un numero intero da {min} a {max}, quello scritto sul preventivo.',
  rataMutuoEsempioAnni: '25',
  rataMutuoEtichettaTassoFermo:
    'Il tasso che resta fermo per tutta la durata — sul preventivo è il TAN "fisso"',
  rataMutuoAiutoTassoFermo: 'Scrivilo in percentuale, come sul preventivo: per esempio {esempio}.',
  rataMutuoEsempioTassoFermo: '3,46',
  rataMutuoEtichettaTassoMobile:
    'Il tasso che si muove, oggi — sul preventivo è il TAN "variabile" di partenza',
  rataMutuoAiutoTassoMobile:
    'Anche questo in percentuale, il valore di partenza scritto sul preventivo: per esempio {esempio}.',
  rataMutuoEsempioTassoMobile: '2,80',

  // --- Il risultato: le due rate affiancate --------------------------------
  rataMutuoVuoto:
    'Qui compariranno le tue due rate mensili. Servono i quattro numeri qui sopra: il prestito, gli anni, e i due tassi scritti sul tuo preventivo.',
  rataMutuoInSospeso:
    'Le due rate compaiono appena i quattro numeri qui sopra sono a posto. Accanto al campo c\'è scritto che cosa non torna.',
  rataMutuoEtichettaRataFerma: 'Con il tasso fermo',
  rataMutuoEtichettaRataMobile: 'Con il tasso che si muove, oggi',
  rataMutuoRataAlMese: '{rata} al mese, per {mesi} mesi',
  rataMutuoDifferenzaMensile: '{differenza} al mese di differenza fra le due rate',
  rataMutuoDifferenzaAnnua: 'In dodici mesi sono {differenzaAnnua}',
  rataMutuoDifferenzaNulla: 'Ai due tassi che hai scritto, le due rate coincidono al centesimo',
  rataMutuoDifferenzaATassoFermo:
    'La differenza è calcolata a tassi fermi, cioè come se quello che si muove non si muovesse: è una fotografia di oggi, non un confronto sui prossimi anni.',

  // --- La scala delle ipotesi ----------------------------------------------
  rataMutuoIpotesiTitolo: 'Se il tasso che si muove, si muovesse davvero',
  rataMutuoIpotesiIntro:
    'Quando quel tasso sale, la rata sale con lui; quando scende, scende con lui. Ecco che cosa succederebbe alla rata mobile a quattro valori di tasso diversi da oggi.',
  rataMutuoIpotesiRiga: '{etichettaScarto}: tasso {tasso}, rata {rata} al mese ({differenza} rispetto a oggi)',
  rataMutuoIpotesiEtichettaMeno1: '1 punto percentuale in meno',
  rataMutuoIpotesiEtichettaOggi: 'Il tasso di oggi',
  rataMutuoIpotesiEtichettaPiu1: '1 punto percentuale in più',
  rataMutuoIpotesiEtichettaPiu2: '2 punti percentuali in più',
  rataMutuoIpotesiEtichettaScarto: '{scarto} rispetto al tasso di oggi',
  rataMutuoIpotesiNonPrevisione:
    'Sono ipotesi, non pronostici: nessuno sa come si muoverà davvero quel tasso nei prossimi anni. Questa scala mostra soltanto che cosa succede alla rata ai quattro valori scritti qui sopra.',
  rataMutuoIpotesiPeriodoMancante:
    'Su quanti anni di storia di quel tasso sia costruita questa scala non è ancora stato stabilito da nessuno: finché manca, i quattro valori sono un\'ipotesi di lavoro, non un intervallo verificabile.',
  rataMutuoIpotesiTassoATerra:
    'Uno scarto che avrebbe portato il tasso sotto zero è stato fermato a zero: sotto zero il calcolo produrrebbe un numero che non significa niente.',

  // --- Provenienza e confini ------------------------------------------------
  rataMutuoTassiScrittiDaTe:
    'I due tassi qui sopra li hai scritti tu, dal tuo preventivo: il sito non li prende da internet e non ne propone nessuno al posto tuo.',
  rataMutuoTanNonTaeg:
    'Quello che hai scritto è il TAN, il solo interesse. Sul contratto c\'è anche il TAEG, cioè quanto costa davvero tutto insieme — istruttoria, perizia, assicurazioni — che qui non entra nel calcolo.',
  rataMutuoAvvertenza:
    'Questo calcolo usa solo i quattro numeri che hai scritto tu. Non tiene conto di ogni dettaglio del tuo contratto, e il risultato è una stima: potrebbe non corrispondere esattamente a quello che trovi sul tuo estratto conto.',
  rataMutuoNotaCentesimi:
    'I calcoli si fermano al centesimo: il tuo numero è stato portato a {valore}, cioè al centesimo più vicino.',

  // --- Errori, in lingua umana ----------------------------------------------
  rataMutuoErroreCapitale:
    'Questo non sembra un numero. Scrivi solo le cifre del prestito, per esempio 150.000.',
  rataMutuoErroreCapitaleZero:
    'Con zero euro non c\'è niente da calcolare. Scrivi l\'importo del prestito, anche a occhio.',
  rataMutuoErroreCapitaleAlto:
    'Controlla questo numero, sembra troppo alto: questa pagina arriva fino a {massimo}.',
  rataMutuoErroreAnni:
    'Qui va un numero intero di anni, da {min} a {max}. Mezzi anni e parole scritte in lettere non si possono usare.',
  rataMutuoErroreAnniFuori: 'Gli anni vanno da {min} a {max}. Scrivine uno dentro questo intervallo.',
  rataMutuoErroreTasso:
    'Questo tasso non sembra leggibile, oppure è sotto zero: scrivilo in percentuale, come sul preventivo, per esempio {esempio}.',
  rataMutuoErroreTassoAlto:
    'Controlla questo numero, sembra troppo alto per un tasso: questa pagina arriva fino a {massimo}.',

  // --- Il confine, dichiarato a schermo -------------------------------------
  rataMutuoLimitiTitolo: 'Che cosa questa pagina non fa',
  rataMutuoLimiteNessunaIndicazione:
    'Non indica quale delle due rate sia da prendere, in nessuna forma: mostra le due cifre una accanto all\'altra, allo stesso modo, e si ferma lì.',
  rataMutuoLimiteNessunTotale:
    'Non calcola il totale pagato in tutta la durata, né per l\'una né per l\'altra: per il tasso che si muove sarebbe una previsione su venticinque anni, e affiancarla a un totale vero direbbe "questa costa meno" con l\'aggravante di sembrare un fatto.',
  rataMutuoLimiteNessunaPrevisione:
    'Non prevede come si muoverà il tasso variabile: la scala mostra un\'aritmetica su valori dichiarati, non uno scenario probabile.',
  rataMutuoLimiteDati:
    'Non legge nessun documento e non chiede chi sei: i quattro numeri li scrivi tu e restano in questa pagina.',
} as const satisfies Record<string, string>;
