/**
 * LE PAROLE DELLE PAGINE DI SPIEGAZIONE — agente ui-builder. Funzionalità 03.
 *
 * File affiancato per la stessa ragione di testiSimulazione.ts: dentro
 * testi.ts queste righe farebbero superare le 150. `STRINGHE_UTENTE` resta
 * un oggetto solo — questo blocco ci entra con lo spread — quindi il
 * registro scandito dal guardrail resta uno e uno soltanto.
 *
 * NON è ancora dentro testi.ts: lo spread `...STRINGHE_SPIEGAZIONE` lo
 * aggiunge l'architetto in un unico passaggio, insieme a quello di altre
 * funzionalità in arrivo nello stesso momento. Fino ad allora queste chiavi
 * non sono `ChiaveStringaUtente` e nessun'altra pagina può ancora leggerle.
 *
 * Due gruppi. Le prime cinque sono del contenitore: condivise da ogni
 * istanza presente e futura (11, 12, e le voci spiegate di 04/05/06), non si
 * riscrivono per ogni pagina nuova. Le altre dieci sono della sola istanza
 * di riferimento, «inflazione-spesa».
 *
 * Due regole, le stesse di testiSimulazione.ts:
 * 1. Prima l'immagine concreta, poi il nome tecnico — qui lo impone anche il
 *    componente, non solo chi scrive.
 * 2. La pagina descrive un meccanismo e si ferma lì: nessuna frase indica
 *    che cosa fare di quei soldi.
 */

export const STRINGHE_SPIEGAZIONE = {
  // --- Il contenitore, condivise da ogni istanza --------------------------
  spiegazioneTitoloEsempio: 'Un numero per capirlo',
  spiegazioneTitoloFonte: 'Da dove viene questo numero',
  spiegazioneTitoloPassi: 'Dove porta questa pagina',
  spiegazioneTitoloNonFa: 'Che cosa questa pagina non fa',
  spiegazioneEsempioNonDisponibile:
    'Qualcosa in questo conto non torna: per non mostrare un numero sbagliato, qui non ne compare nessuno.',

  // --- L'istanza di riferimento: «inflazione-spesa» -----------------------
  spiegazioneInflazioneSpesaImmagine1:
    "Immagina di fare oggi la spesa con lo stesso carrello dell'anno scorso.",
  spiegazioneInflazioneSpesaImmagine2:
    'Hai in mano la stessa cifra di allora, scritta sullo scontrino.',
  spiegazioneInflazioneSpesaImmagine3:
    'Con quei soldi, in quel carrello oggi entrano meno cose di un anno fa.',
  spiegazioneInflazioneSpesaNomeTecnico:
    'Quella differenza ha un nome: si chiama inflazione.',
  spiegazioneInflazioneSpesaFrase:
    'Con gli stessi 100 € della spesa, oggi porti a casa quello che un anno fa costava {valore}.',
  spiegazioneInflazioneSpesaParagone:
    "Su ogni 100 € di un anno fa, il potere d'acquisto reale oggi vale {resto}.",
  spiegazioneInflazioneSpesaFonte:
    "Il conto parte da un aumento dei prezzi di {tasso} l'anno, un valore medio scritto a mano dentro il sito e non preso da internet.",
  spiegazioneInflazioneSpesaAvvertenza:
    'Non è una previsione: è una divisione fatta su quel numero, che cambierebbe se negli anni successivi i prezzi salissero di più o di meno.',
  spiegazioneInflazioneSpesaNonFa1:
    'Non dice che cosa fare con i tuoi soldi: racconta soltanto come cambia, nel tempo, quello che con gli stessi soldi ci si porta a casa.',
  spiegazioneInflazioneSpesaNonFa2:
    'Non usa la tua spesa reale: il numero qui sopra è lo stesso esempio, sempre sui medesimi 100 €, per chiunque apra questa pagina.',
} as const satisfies Record<string, string>;
