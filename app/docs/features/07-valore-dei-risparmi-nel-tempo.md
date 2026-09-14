# 07 — «Quanto valgono davvero i miei soldi fra qualche anno»

> Stato: **approvata** · 2026-09-14 · pronta per `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 4, simulatore 1. Task di backlog: `07`.
>
> **Due scostamenti dal documento d'origine**, entrambi per conformità, entrambi
> spiegati in «Cosa questa funzionalità NON fa»: il tasso non viene dalla rete,
> e il paragone «spesa di un mese → tre settimane» non viene implementato.

## Per chi

Una persona che ha una somma ferma sul conto — il residuo di una liquidazione,
i risparmi di qualche anno — e sente ripetere che «con l'inflazione i soldi
fermi perdono valore». La frase non le dice niente di preciso: non sa se «poco»
significhi dieci euro o mille, e non sa se riguardi la sua situazione o quella
di qualcun altro.

## Quando serve

Nel momento in cui guarda il saldo del conto e si chiede se lasciarlo lì sia un
gesto neutro. È una domanda che si pone da sola: nessuno gliela deve fare.

## Cosa deve poter fare dopo

Dire una cifra riferita alla propria somma: «i miei 10.000 € fra 5 anni
comprano quanto 9.057 € comprano oggi». Prima aveva una frase generica, dopo ha
un numero verificabile.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `risparmioCent` | intero in centesimi | lo digita la persona |
| `anni` | intero, 1–30 | lo digita la persona |
| `inflazioneAnnuaBp` | punti base | **costante dichiarata nel codice** |

Il tasso **non viene chiesto alla persona** — non lo conosce, e farglielo
inventare renderebbe il risultato una fantasia — e **non viene preso dalla
rete**, che è vietato a runtime.

> **Blocco da sciogliere, non un dettaglio.** Il valore della costante deve
> essere la **media pluriennale dell'indice NIC ISTAT**, e nessuno di noi può
> inventarlo: un numero senza fonte è esattamente il difetto che la sezione 7
> del documento d'origine esiste per impedire. Serve che una persona lo
> recuperi e lo dichiari, con il periodo esatto su cui è calcolato.
>
> **L'architettura è studiata perché questo blocco non fermi
> l'implementazione**: la funzione del core riceve il tasso come *parametro*,
> quindi codice e test si scrivono e passano subito. Resta da riempire una sola
> riga — la costante — in un modulo separato che dichiara fonte e periodo.

## Elaborazione

Tutto in `src/core/`, puro e deterministico.

1. `moltiplicatore = (1 + inflazioneAnnuaBp / 10_000) ** anni`
2. `valoreRealeCent = Math.round(risparmioCent / moltiplicatore)`
3. `perditaCent = risparmioCent - valoreRealeCent`
4. `poterePerCentoEuroCent = Math.round(10_000 / moltiplicatore)` — quanto resta
   di ogni 100 €, che è il paragone mostrato a schermo

### Verifica a mano, da riportare nel commento del test

Con `risparmioCent = 1_000_000` (10.000,00 €), `inflazioneAnnuaBp = 200`
(2,00%), `anni = 5`:

```
(1,02)^5                    = 1,1040808032
1.000.000 / 1,1040808032    =   905.730,81  -> 905.731 cent   (9.057,31 €)
perdita                     = 1.000.000 - 905.731 = 94.269 cent (942,69 €)
10.000 / 1,1040808032       =     9.057,31  ->   9.057 cent   (90,57 € su 100)
```

> **Nota sull'aritmetica.** L'elevamento a potenza è l'unico punto del dominio
> in cui compare un numero a virgola mobile: un'esponenziale su interi non
> esiste. Resta deterministico — IEEE-754 dà lo stesso risultato su ogni
> macchina — e l'arrotondamento a centesimo intero avviene **una volta sola**,
> alla fine. Nessun importo intermedio viene conservato come float.

## Output

Una schermata sola, un concetto solo.

| Elemento | Forma |
| --- | --- |
| **Il numero grande** | il valore reale: «9.057,31 €». È il più grande della schermata |
| La frase che lo spiega | «I tuoi 10.000 € fra 5 anni comprano quanto 9.057,31 € comprano oggi» |
| Il paragone | «Su ogni 100 € lasciati fermi, dopo 5 anni ne resta il valore di 90,57 €» |
| Da dove viene il numero | il tasso usato, **con la fonte e il periodo scritti accanto** |
| Avvertenza | il testo standard della sezione 4 del documento d'origine |

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre tabulari,
unità accanto al valore.

**Stringhe nuove in `src/ui/testi.ts`** — chiavi: `simulazioneRisparmioOcchiello`,
`simulazioneRisparmioTitolo`, `simulazioneRisparmioEtichettaSomma`,
`simulazioneRisparmioEtichettaAnni`, `simulazioneRisparmioRisultato`,
`simulazioneRisparmioParagone`, `simulazioneRisparmioFonte`,
`simulazioneRisparmioVuoto`, `simulazioneRisparmioErroreSomma`,
`simulazioneRisparmioErroreAnni`, `simulazioneRisparmioAvvertenza`.

**I quattro stati obbligatori**, non solo quello che funziona:

1. **Vuoto** — nessuna cifra ancora digitata: la schermata dice che cosa serve
   inserire, non «nessun risultato».
2. **In caricamento** — il calcolo è immediato e locale, quindi lo stato esiste
   ma non lampeggia: il riquadro del risultato occupa già il suo spazio, così il
   layout non salta quando il numero arriva.
3. **Errore** — in linguaggio umano: «Controlla questo numero, sembra troppo
   alto», mai «errore di validazione».
4. **Dati lunghi** — importi a sette cifre e 30 anni non devono rompere la
   griglia né mandare a capo il numero grande.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/simulazioneRisparmio.test.ts`, con i
  valori attesi calcolati a mano qui sopra scritti nel commento accanto
  all'asserzione. Copre anche `anni = 0` (il valore resta identico) e
  `inflazioneAnnuaBp = 0` (nessuna erosione).
- **Test di accettazione** — `tests/accettazione/07-valore-dei-risparmi.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice.
- **In demo, dieci secondi**: si digita 10.000, si digita 5, compare 9.057,31 €
  con accanto la riga «su ogni 100 € ne resta il valore di 90,57 €».

## Cosa questa funzionalità NON fa

- **Non indica che cosa farne.** Niente accenni a spostare, impiegare o
  confrontare i soldi con altro. La schermata descrive un'erosione e si ferma
  lì. È il confine più facile da sfondare in questa funzionalità, perché la
  domanda successiva — «e allora?» — è naturale: la risposta non sta qui.
- **Non confronta strumenti** e non nomina conti, titoli o fondi.
- **Non prende il tasso dalla rete**, né a runtime né in fase di build. Il
  documento d'origine indica ISTAT come fonte con aggiornamento mensile: la
  fonte resta quella, ma il valore entra nel codice come costante dichiarata e
  si aggiorna a mano. Un aggiornamento automatico sarebbe una chiamata esterna,
  che il prodotto non fa.
- **Non usa il paragone «oggi la spesa di un mese, fra 5 anni tre settimane»**
  del documento d'origine. Richiederebbe il costo di una spesa mensile: un
  secondo numero, che nessuna fonte ci dà e che quindi andrebbe inventato. Al
  suo posto il paragone «su ogni 100 € ne resta il valore di 90,57 €», che è
  altrettanto concreto e non introduce dati senza provenienza.
- **Non è una previsione.** È un'aritmetica su un tasso medio dichiarato: se
  l'inflazione futura sarà diversa, il numero sarà diverso. Sta scritto a
  schermo, non in una nota a piè di pagina.
- **Non chiede e non conserva dati personali.** La cifra digitata resta nella
  pagina e non viene salvata da nessuna parte.

---

## Dichiarazioni tecniche (compilate da `/spec`)

| | |
| --- | --- |
| **Contratti necessari** | `Scenario` — il valore `'simulazione-risparmio'` **esiste già** in `types/contracts.ts`. Nessun altro contratto serve: `DocumentoUtente` e `LetturaCalcolata` descrivono la lettura di un documento a voci, che qui non c'è. I tipi dell'ingresso e dell'uscita della simulazione nascono **dentro `src/core/`**, di proprietà di core-engine |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: **questa funzionalità non modifica `types/`**, quindi non richiede l'architetto |
| **Agente incaricato** | **`01-core-engine`** (la formula, che è il cuore), con **`03-ui-builder`** per la schermata e le stringhe |
| **Directory toccate** | **3 — servono più agenti.** `src/core/` (`simulazioneRisparmio.ts`, `inflazioneDichiarata.ts`, `__tests__/`), `src/ui/` (schermata, `testi.ts`, nuova rotta in `rotte.ts`, `styles.css`), `tests/` (accettazione) |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/07-simulatore-risparmio.png` con il caso 10.000 € / 5 anni, cioè lo stesso numero verificato a mano nel test: la slide mostra la cifra che il test dimostra |

### Conflitto di pianificazione, da sapere prima di `/implementa`

`01-landing-page` è **in corso** e occupa `src/ui/` e `tests/`. Due delle tre
directory di questa funzionalità sono le stesse: **i due task non possono
girare in parallelo**. `src/core/` invece è libero, quindi la parte di calcolo
può partire subito senza attendere nulla.
