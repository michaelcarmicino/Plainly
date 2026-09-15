/**
 * LE PAROLE DELLA GUIDA AL KID — «il foglio prima di firmare» — agente
 * ui-builder. Funzionalità 12.
 *
 * Sta in un file suo perché testi.ts, con queste dentro, supererebbe le 150
 * righe. Entra nel registro con lo spread — vedi il blocco «Chiavi nuove»
 * della specifica — così `STRINGHE_UTENTE` resta un oggetto solo.
 *
 * BOZZE: le rilegge guardrail-officer prima del merge, contro il lessico e
 * contro `.claude/rules/scrittura-e-accessibilita.md`.
 *
 * Le sei chiavi `foglioRiquadro*` sono le intestazioni ORIGINALI del
 * documento imposto dalla legge: non si riscrivono, nemmeno se lunghe.
 *
 * `foglioPasso`, `foglioLimitiTitolo`, `foglioEsempioPercentuale`,
 * `foglioEsempioImporto`, `foglioAiutoImporto`, `foglioErroreImportoMancante`
 * sono aggiunte tecniche non elencate nella bozza della specifica: le
 * chiede il contratto dei componenti condivisi (il registro delle
 * schermate vuole un `passo`; `CampoNumerico` vuole un `esempio` e un
 * `aiuto` per ogni campo; il core distingue «somma mancante» da «somma
 * troppo alta», e i due codici non possono condividere la stessa frase).
 */

export const STRINGHE_FOGLIO = {
  // --- Intestazione della schermata --------------------------------------
  foglioOcchiello: 'Il futuro',
  foglioTitolo: 'Che cos\'è il foglio che mi danno da firmare?',
  foglioPasso: 'Il foglio che ti danno prima di firmare',
  foglioApertura:
    'Prima di firmare ti mettono in mano un foglio di poche pagine. È il bugiardino del farmaco, ma per i soldi: si chiama KID.',
  foglioOrdineFisso:
    'Quel foglio dice sempre le stesse cose, sempre nello stesso ordine: lo prevede una legge europea. Se ne hai letto uno, sai già dove guardare sul prossimo.',

  // --- Le intestazioni originali del facsimile, nell'ordine di legge -----
  foglioRiquadroProdotto: 'Cos\'è questo prodotto?',
  foglioRiquadroRischi: 'Quali sono i rischi e qual è il potenziale rendimento?',
  foglioRiquadroInsolvenza:
    'Cosa accade se non siamo in grado di corrispondervi quanto dovuto?',
  foglioRiquadroCosti: 'Quali sono i costi?',
  foglioRiquadroTempo:
    'Per quanto tempo devo detenerlo? Posso ritirare il capitale prematuramente?',
  foglioRiquadroReclami: 'Come presentare reclami?',

  foglioFacsimileVuoto:
    'I riquadri qui sopra sono vuoti apposta: i numeri del tuo foglio sono i tuoi, e li leggi tu.',

  // --- Dentro il riquadro dei rischi --------------------------------------
  foglioRischiSetteNumeri:
    'Su una riga trovi sette numeri, da 1 a 7, e sul tuo foglio uno di quei sette è segnato. Quel numero dice quanto il valore si è mosso in passato, non se il prodotto è buono.',
  foglioRischiCosaMisura:
    'Un 1 vuol dire che in passato quel valore è sceso e salito poco; un 7 che si è mosso molto, in su e in giù. È l\'ampiezza dell\'altalena, non la direzione in cui andrà.',
  foglioRischiNonDice:
    'Un numero più basso non vuol dire che il prodotto è più sicuro per te, e uno più alto non vuol dire che rende di più: quella riga misura una cosa sola, quanto il valore si è mosso finora.',

  // --- Dentro il riquadro dei costi ---------------------------------------
  foglioCostiDoveSta:
    'Sul tuo foglio, nel riquadro «Quali sono i costi?», accanto a «Costi di gestione e altri costi amministrativi o di esercizio» c\'è un numero con la virgola. È quello che va nel campo qui sotto.',
  foglioCostiEsempio:
    'Sul foglio i costi sono scritti in percentuale. 1,50% su 10.000 € sono 150 € l\'anno: 12,50 € al mese, quanto una bolletta del telefono.',

  // --- Dentro il riquadro del tempo ---------------------------------------
  foglioTempoSpiegazione:
    'Un altro riquadro dice per quanti anni quel prodotto è pensato per restare fermo. Non è una scadenza e non è un divieto: è il tempo su cui chi l\'ha costruito ha fatto i suoi conti. Chi ritira prima può trovare dei costi in più, scritti sullo stesso foglio.',

  // --- Il traduttore da percentuale a euro ---------------------------------
  foglioEtichettaPercentuale: 'La percentuale dei costi, come è scritta sul foglio',
  foglioAiutoPercentuale:
    'Guarda nel riquadro «Quali sono i costi?»: è il numero con la virgola scritto accanto a «Costi di gestione e altri costi amministrativi o di esercizio».',
  foglioEsempioPercentuale: '1,50',
  foglioEtichettaImporto: 'Quanti soldi stai mettendo',
  foglioAiutoImporto:
    'Scrivilo come lo scriveresti a mano: 10.000, oppure 10000. Vanno bene tutti e due.',
  foglioEsempioImporto: '10.000',

  // --- Il riquadro del risultato -------------------------------------------
  foglioVuoto:
    'Qui comparirà la cifra in euro. Servono due numeri, tutti e due qui sopra: la percentuale dei costi scritta sul foglio, e quanti soldi stai mettendo. Appena li scrivi, il calcolo si fa da solo.',
  foglioRisultatoAnno: '{percentuale} su {capitale} sono {annoValore} l\'anno.',
  foglioRisultatoMese: '{meseValore} al mese.',
  foglioParagoneCento: 'Su ogni 100 € che metti, {perCento} l\'anno se ne vanno in costi.',
  foglioNotaArrotondamento:
    'Il mese qui sopra è l\'anno diviso per dodici, arrotondato al centesimo: moltiplicato di nuovo per dodici può dare qualche centesimo in più o in meno rispetto all\'anno. Il numero esatto resta quello dell\'anno.',

  // --- Da dove viene il foglio ----------------------------------------------
  foglioFonteNorma:
    'Questo foglio esiste perché una legge europea impone di consegnarlo, sempre con le stesse voci e nello stesso ordine, a chi sottoscrive certi prodotti di investimento. Il testo qui sopra è scritto dentro il sito: non arriva da nessuna rete.',

  // --- Quando qualcosa non torna: messaggi da persona, non da modulo ------
  foglioErrorePercentuale:
    'Controlla questa percentuale, sembra troppo alta. Sul foglio è il numero con la virgola scritto nella riga dei costi, e qui arriva fino a {massimo}.',
  foglioErroreImporto: 'Controlla questo numero, sembra troppo alto: questa pagina arriva fino a {massimo}.',
  foglioErroreImportoMancante:
    'Qui va quanti soldi stai mettendo: un numero sopra lo zero.',

  // --- Il confine, dichiarato a schermo, sempre in rosa -------------------
  foglioLimitiTitolo: 'Che cosa questa pagina non fa',
  foglioNonFa1:
    'Questa pagina spiega che cosa c\'è scritto sul foglio. Non dice se firmare, non parla di nessun prodotto in particolare e non dice a nessuno che cosa fare dei propri soldi.',
  foglioNonFa2:
    'Non mostra la riga dei sette numeri come un giudizio: la mostra intera, senza segnare né colorare nessuno dei sette. Il numero che ti riguarda sta sul tuo foglio, non su questa pagina.',
  foglioNonFa3:
    'Non moltiplica il costo di un anno per gli anni in cui tieni il prodotto: darebbe un numero che sembra giusto ma presuppone che la somma resti ferma, cosa che qui non si può dare per certa.',
} as const satisfies Record<string, string>;
