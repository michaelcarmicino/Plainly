/**
 * LE PAROLE DELLA GUIDA ALLA BOLLETTA DELLA LUCE — agente ui-builder.
 * Funzionalità 05.
 *
 * File affiancato per la stessa ragione di testiFonti.ts: dentro testi.ts
 * queste righe farebbero superare le 150. `STRINGHE_UTENTE` resta un
 * oggetto solo — questo blocco ci entra con lo spread — quindi il registro
 * scandito dal guardrail resta uno e uno soltanto.
 *
 * Bozze riprese da docs/features/05-guida-interattiva-bolletta-luce-gas.md,
 * da rileggere con guardrail-officer prima del merge: sono il punto in cui
 * «da dove viene questo euro» rischia di scivolare in «e allora che faccio».
 *
 * Ogni voce della bolletta è apribile SINGOLARMENTE, accisa e IVA comprese:
 * la specifica descrive un raggruppamento delle due imposte, ma unirle
 * richiederebbe sommare due importi già calcolati dentro il componente —
 * un calcolo nel JSX che gli standard di codice vietano. Cinque righe
 * indipendenti restano fedeli al documento senza introdurre quel calcolo.
 */

export const STRINGHE_BOLLETTA = {
  // --- Intestazione ---------------------------------------------------------
  bollettaOcchiello: 'La tua bolletta, voce per voce',
  bollettaPasso: 'Perché la bolletta è alta',
  bollettaTitolo: 'Perché la bolletta è così alta questo mese?',
  bollettaIntro:
    'Qui sotto trovi la bolletta della luce così come arriva davvero, riga per riga. Tocca una voce per vedere quanto pesa sul totale e se dipende da quanto hai consumato.',

  bollettaTotaleEtichetta: 'Totale da pagare',
  bollettaConsumoStampato: '{kwh} kWh consumati, secondo il contatore',

  bollettaNotaApri: 'Tocca per sapere da dove viene questo importo',
  bollettaNotaChiudi: 'Nascondi la spiegazione',

  bollettaDipendeConsumo: 'Dipende da quanto hai consumato.',
  bollettaNonDipendeConsumo: 'Non dipende da quanto hai consumato.',
  bollettaPesoSulTotale: 'Pesa {peso} sul totale della bolletta.',

  // --- Le cinque spiegazioni, una per voce -----------------------------------
  bollettaSpiegazioneEnergiaConKwh:
    "Questa è l'unica riga che cambia davvero se accendi il condizionatore in meno: è l'elettricità passata dal tuo contatore. Sono {importo} per {kwh} kWh, cioè {prezzo} ogni kWh. Un kWh è quanto consuma un forno acceso per circa un'ora.",
  bollettaSpiegazioneEnergiaSenzaKwh:
    "Questa è l'unica riga che cambia davvero se accendi il condizionatore in meno: è l'elettricità passata dal tuo contatore. Sono {importo}, cioè {peso} ogni 100 € di bolletta.",
  bollettaSpiegazioneTrasporto:
    "I fili che portano la corrente fino a casa, e chi legge il contatore, si pagano anche nei mesi in cui usi poco: è come l'abbonamento del treno, che costa uguale se lo prendi dieci volte o due. Sono {importo}, cioè {peso} ogni 100 € di bolletta.",
  bollettaSpiegazioneOneri:
    "Sotto questo nome ci sono costi che per legge vengono divisi fra tutte le bollette d'Italia — per esempio gli incentivi alle fonti rinnovabili e la chiusura delle vecchie centrali nucleari. Non dipendono da quanto consumi tu e non vanno al tuo fornitore. Sono {importo}, cioè {peso} ogni 100 € di bolletta.",
  bollettaSpiegazioneAccisa:
    "L'accisa è una tassa fissa sull'energia: non è una percentuale, è un importo scritto per ogni bolletta. Sono {importo}, cioè {peso} ogni 100 € di bolletta.",
  bollettaSpiegazioneIva:
    "L'IVA sull'energia di casa è il 10% di tutto il resto messo insieme — materia energia, trasporto e oneri di sistema. Sono {importo}, cioè {peso} ogni 100 € di bolletta.",

  // --- La barra delle due parti del totale -----------------------------------
  bollettaDueQuoteTitolo: 'Le due parti del totale',
  bollettaQuotaConsumoEtichetta: 'Dipende da quanto hai consumato',
  bollettaQuotaNonConsumoEtichetta: 'Non dipende da quanto hai consumato',
  bollettaQuotaValore: '{importo} · {percento}',
  bollettaParagoneKwh:
    "Hai consumato {kwh} kWh. L'energia costa {prezzoEnergia} per kWh, ma la bolletta intera, divisa per quegli stessi {kwh} kWh, viene {prezzoTotale} per kWh: quasi il doppio. La differenza — {differenza} — è la parte che non cambia con quanto accendi.",
  bollettaCostoKwhAssente:
    'Su questa bolletta non è scritta la quantità consumata: qui non mostriamo un prezzo per kWh.',
  bollettaCostoKwhZero:
    'Su questa bolletta la quantità consumata è zero: qui non mostriamo un prezzo per kWh, perché la divisione non avrebbe senso.',

  // --- Errore: la quadratura che non torna -----------------------------------
  bollettaErroreQuadraturaTitolo: 'Controlla questo numero, sembra sbagliato',
  bollettaErroreQuadratura:
    'Sommando le voci scritte qui sopra si ottiene {somma}, ma il documento dichiara un totale di {totale}. La differenza è {scarto}: resta segnalata, non corretta.',

  // --- Stato vuoto ------------------------------------------------------------
  bollettaVuoto:
    'Qui comparirà la bolletta della luce, voce per voce, appena il documento è disponibile.',

  // --- Il confine, dichiarato a schermo ---------------------------------------
  bollettaLimiteOfferta:
    "Questa pagina non dice niente sull'offerta o sul fornitore: nessun confronto fra tariffe, nessuna indicazione su dove costerebbe meno.",
  bollettaLimiteConsumo:
    'Questa pagina non dice come consumare meno: spiega da dove viene un costo, non che cosa farne.',
  bollettaLimiteGas:
    "Questa pagina copre solo la bolletta della luce: il gas ha un'unità di misura e una struttura diverse, ed è un'altra pagina.",
  bollettaLimiteFacsimile:
    "I numeri sono quelli di una bolletta d'esempio, anonima: chi consuma diversamente vedrà, sulla propria, importi diversi da questi.",
} as const satisfies Record<string, string>;
