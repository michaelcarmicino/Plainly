/**
 * LE PAROLE DI «PER QUANTI MESI BASTANO I SOLDI CHE HAI DA PARTE» — agente
 * ui-builder. Funzionalità 09.
 *
 * Sta in un file suo per la stessa ragione meccanica di testiSimulazione.ts:
 * testi.ts, con queste dentro, supererebbe le 150 righe. Entra in
 * STRINGHE_UTENTE con lo spread, quindi il registro scandito dal guardrail
 * resta uno e uno soltanto.
 *
 * Vincoli di questa schermata, non negoziabili — vedi
 * docs/features/09-mesi-coperti-dai-risparmi.md:
 *
 * 1. NESSUN GIUDIZIO NUMERICO. Non si dice mai se il numero di mesi sia
 *    poco o tanto: si mostra il conto e ci si ferma.
 * 2. NESSUN SEMAFORO. Deroga dichiarata dalla specifica: qui classificare
 *    «va bene / attenzione / preoccupante» sarebbe un giudizio sulla
 *    situazione personale di chi legge.
 * 3. Il nome che questa schermata ha rifiutato in fase di specifica NON
 *    COMPARE MAI, in nessuna forma.
 * 4. Le due ipotesi — nessuna nuova entrata, spese invariate — sono
 *    dichiarate a schermo, non in una nota a piè di pagina.
 */

export const STRINGHE_MESI_COPERTI = {
  // --- Intestazione --------------------------------------------------
  mesiCopertiOcchiello: 'Il futuro',
  mesiCopertiTitolo: 'Per quanti mesi bastano i soldi che hai da parte',
  mesiCopertiIntro:
    'Hai qualcosa messo via e ti chiedi per quanto durerebbe, se da un certo momento in poi non entrasse più niente sul conto. Scrivi due numeri — quanto spendi in un mese e quanto hai da parte — e qui sotto trovi per quanti mesi e giorni quella cifra copre quelle spese.',
  mesiCopertiPasso: 'Per quanti mesi bastano i soldi che hai da parte',

  // --- I due campi -----------------------------------------------------
  mesiCopertiEtichettaSpese: 'Quanto spendi in un mese, in euro',
  mesiCopertiAiutoSpese:
    'Le spese fisse di un mese: affitto o mutuo, bollette, la spesa, quello che paghi sempre. Scrivila come la scriveresti a mano: 1.200, oppure 1200.',
  mesiCopertiEsempioSpese: '1.200',
  mesiCopertiEtichettaRisparmi: 'Quanto hai da parte, in euro',
  mesiCopertiAiutoRisparmi:
    'Tutto quello che hai messo via fino a oggi, in un colpo solo. Anche zero è una risposta valida.',
  mesiCopertiEsempioRisparmi: '3.100',

  // --- Il risultato, nei suoi momenti --------------------------------------
  mesiCopertiVuoto:
    'Qui comparirà la tua cifra. Servono due numeri, tutti e due qui sopra: quanto spendi in un mese e quanto hai da parte. Appena li scrivi, il calcolo si fa da solo.',
  mesiCopertiInSospeso:
    'La cifra compare appena i due numeri qui sopra sono a posto. Accanto al campo che non torna trovi scritto il motivo.',
  mesiCopertiEtichettaValore: 'Quei soldi coprono le tue spese per',
  mesiCopertiRisultato: '{mesi}{giorniSuffix}',
  mesiCopertiRisultatoSoloGiorni: '{giorni}',
  mesiCopertiRisultatoZero: '0 giorni',
  mesiCopertiRisultatoMeseSingolo: '1 mese{giorniSuffix}',
  mesiCopertiIpotesi:
    'Ipotesi di questo conto: da domani non entra più niente sul conto, e le spese restano quelle che hai scritto.',
  mesiCopertiScomposizione: '{mesi} — {importoMesi}{residuoSuffix}.',
  mesiCopertiConvenzioneGiorni:
    'Il conto considera un mese come 30 giorni, e si ferma sempre al giorno pieno: mai un giorno in più di quelli che i due numeri danno davvero.',

  // --- Provenienza e confini, dichiarati a schermo -------------------------
  mesiCopertiNessunaFonte:
    'Questo numero non viene da nessun documento e non è preso da internet: è il risultato dei due numeri che hai scritto tu, divisi fra loro.',
  mesiCopertiAvvertenza:
    'Non è una previsione: presuppone che le spese restino quelle scritte e che non entri più nessuna entrata. Se una delle due cose cambia nella realtà, anche la cifra cambia.',
  mesiCopertiLimitiTitolo: 'Che cosa questa pagina non fa',
  mesiCopertiLimiteSoglia:
    'Non dice se questo numero di mesi sia poco o tanto: mostra il conto e si ferma lì.',
  mesiCopertiLimiteAzione:
    'Non dice dove tenere questi soldi né che cosa farne: racconta soltanto per quanto durano, nell\'ipotesi scritta qui sopra.',
  mesiCopertiLimiteDati:
    'Non legge nessun documento e non conserva i due numeri da nessuna parte: restano su questa pagina finché ci resti tu.',

  // --- Quando qualcosa non torna: messaggi da persona, non da modulo ------
  mesiCopertiErroreSpese:
    'Questo non sembra un numero. Scrivi solo le cifre della spesa, per esempio 1.200.',
  mesiCopertiErroreSpeseNegative:
    'Qui va un numero sopra lo zero: è quanto spendi in un mese, quindi il segno meno davanti non serve.',
  mesiCopertiErroreSpeseZero:
    'Con zero euro di spese il conto non si può fare: sono il numero per cui si divide. Scrivi una cifra sopra lo zero, anche a occhio.',
  mesiCopertiErroreSpeseBasse:
    'Controlla questo numero, sembra un errore di battitura: questa pagina parte da {minimo}.',
  mesiCopertiErroreSpeseAlte:
    'Controlla questo numero, sembra troppo alto: questa pagina arriva fino a {massimo}.',
  mesiCopertiErroreRisparmi:
    'Questo non sembra un numero. Scrivi solo le cifre di quello che hai da parte, per esempio 3.100.',
  mesiCopertiErroreRisparmiNegativi:
    'Qui va un numero da zero in su: è quello che hai da parte, quindi il segno meno davanti non serve.',
  mesiCopertiErroreRisparmiAlti:
    'Controlla questo numero, sembra troppo alto: questa pagina arriva fino a {massimo}.',
  mesiCopertiNotaCentesimi:
    'I calcoli si fermano al centesimo: il tuo numero è stato portato a {valore}, cioè al centesimo più vicino.',
} as const satisfies Record<string, string>;
