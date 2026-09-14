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

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-14, dalla sola specifica.
> La fase 2 — rilettura del codice e dei test, esecuzione dei passi qui sotto e
> riscrittura al presente sotto «Verificato» — non è ancora stata fatta.

### Cosa farà

Chi scriverà due cose — quanti soldi ha fermi sul conto e per quanti anni li
lascia lì — vedrà comparire una cifra sola, grande: quanto varranno davvero
quei soldi alla fine, cioè quanta roba ci si porterà a casa. Con 10.000 € e
5 anni comparirà **9.057,31 €**, e accanto la riga che lo rende afferrabile:
su ogni 100 € lasciati fermi ne resterà il valore di 90,57 €.

La schermata dirà che cosa succede a quei soldi e si fermerà lì: non dirà a
nessuno che cosa farne.

### Per chi

Una persona che ha una somma ferma sul conto — quel che resta di una
liquidazione, i risparmi messi da parte in qualche anno — e ha sentito ripetere
che «con l'inflazione i soldi fermi perdono valore», senza che quella frase le
dica niente di preciso: non sa se «perdono» significhi dieci euro o mille, e non
sa se riguardi la sua situazione o quella di qualcun altro.

Le servirà **nel momento in cui guarda il saldo del conto** e si chiede se
lasciarlo lì sia un gesto neutro. È una domanda che si pone da sola: nessuno
gliela deve fare. Dopo, al posto della frase generica, avrà una cifra riferita
ai suoi soldi e a quanti anni ha in mente lei.

### Come si proverà

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non dà
il risultato atteso, la funzionalità non è finita. I comandi vanno eseguiti da
`app/`.

Il caso di riferimento è quello già verificato a mano nella sezione
«Elaborazione»: **10.000 €, 5 anni, tasso dichiarato 2,00% (200 punti base)** —
cioè due euro in più ogni cento spesi, ogni anno. Lo stesso caso che il test
unitario blocca e che finirà nello screenshot della demo: la slide mostrerà la
cifra che il test dimostra.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`, che esegue
   `node scripts/prepara.mjs`). Serve solo la prima volta.
   *Risultato atteso:* lo script dirà «Ambiente già pronto», oppure elencherà i
   passi che ha installato, e il suo controllo di salute — `tsc --noEmit` e poi
   `npm test` — finirà senza errori. Se fallisce, ci si ferma qui: il resto
   della prova non direbbe niente di utile.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue
   `node scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un processo
   che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo `http://localhost:5173`.

3. **Arrivare alla schermata.** Aprire quell'indirizzo e raggiungere la
   simulazione dei risparmi.
   *Risultato atteso:* la schermata comparirà. **L'indirizzo esatto non è
   fissato dalla specifica** — dice solo che `rotte.ts` avrà una rotta nuova:
   chi costruisce lo sceglie, e in fase 2 va scritto qui per esteso insieme al
   percorso per arrivarci partendo dalla pagina iniziale. Se non si arriva alla
   schermata navigando, ma solo scrivendo l'indirizzo a mano nella barra, il
   passo non è superato: va segnalato come divergenza, non aggirato.

4. **Lo stato vuoto — prima di digitare qualunque cosa.** Guardare la schermata
   appena aperta, senza toccare i campi.
   *Risultato atteso:* **nessun numero grande inventato e nessuno zero** al
   posto del risultato. Al loro posto una frase che dice quali due cose servono
   — la somma che si ha ferma e per quanti anni la si lascia lì — e dove
   scriverle. Non «nessun risultato»: quella è una porta chiusa, non una
   spiegazione.

5. **Il caso verificato a mano.** Digitare `10000` nel campo della somma e `5`
   in quello degli anni.
   *Risultato atteso:* comparirà **9.057,31 €** come numero grande, e sarà il
   più grande della schermata — non uno fra tanti della stessa dimensione, così
   chi guarda sa dove posare l'occhio. Accanto si leggerà la frase che lo
   spiega: «I tuoi 10.000 € fra 5 anni comprano quanto 9.057,31 € comprano
   oggi». Le cifre saranno scritte all'italiana — punto per le migliaia, virgola
   per i centesimi — con l'euro **accanto al valore**, non relegato in
   un'intestazione.

6. **Il paragone su 100 €, accanto al numero e non in fondo.** Restando sulla
   stessa schermata, leggere la riga sotto il numero grande.
   *Risultato atteso:* si leggerà «Su ogni 100 € lasciati fermi, dopo 5 anni ne
   resta il valore di 90,57 €». Il conto si rifà a mano in due secondi:
   9.057,31 diviso 10.000, per 100, fa 90,57 — il paragone è lo stesso numero
   del risultato ridotto a una banconota che tutti hanno avuto in mano, non un
   secondo calcolo che potrebbe non tornare.

7. **Da dove viene il numero — il tasso e la sua fonte, scritti a schermo.**
   Cercare, vicino al risultato, da quale tasso è stato ricavato.
   *Risultato atteso:* si leggerà il tasso usato — **2,00%** — con **la fonte e
   il periodo su cui è calcolato scritti accanto**, leggibili senza passare il
   mouse su niente e senza aprire niente. Insieme ci sarà l'avvertenza che
   questo non è un pronostico: è un'aritmetica su un tasso medio dichiarato, e
   se l'inflazione dei prossimi anni sarà diversa il numero sarà diverso. Testo
   dell'avvertenza mai sotto i 16 px e mai in grigio slavato: se sta a schermo
   dev'essere leggibile anche da lontano.

8. **Lo stato «in caricamento» non deve far saltare il layout.** Guardare dove
   si trova l'avvertenza a schermo **prima** di digitare, poi digitare
   `10000` e `5` e guardare dove si trova **dopo**.
   *Risultato atteso:* sarà nello stesso posto. Il riquadro del risultato
   occuperà già il suo spazio da vuoto, così quando il numero arriva non spinge
   in basso ciò che sta sotto. Il calcolo è immediato e tutto locale: non ci
   sarà nessuna attesa, quindi nemmeno una rotellina che gira per un istante e
   sparisce.

9. **L'errore in linguaggio umano.** Nel campo della somma scrivere qualcosa che
   non è un importo — per esempio delle lettere — oppure un numero di anni che
   la schermata non accetta.
   *Risultato atteso:* comparirà un messaggio scritto come lo direbbe una
   persona: «Controlla questo numero, sembra troppo alto», mai «errore di
   validazione nel campo input». Il numero grande **non mostrerà una cifra
   sbagliata**: o resta com'era o torna allo stato vuoto del passo 4, mai un
   risultato calcolato su un dato che non va. **E quello che si era già digitato
   nell'altro campo resterà lì**: correggere un campo non deve costare
   ricominciare da capo. L'elenco completo dei valori di confine — dove comincia
   esattamente «troppo alto», che cosa succede a 0 anni — non è qui: è del
   `tester`, in `docs/test/`.

10. **Dati lunghi — il caso che rompe le griglie.** Digitare una somma a sette
    cifre, `9999999`, e `30` anni. Non è una cifra realistica per questa
    schermata: serve proprio a farla sudare.
    *Risultato atteso:* il numero grande resterà **su una riga sola**, senza
    andare a capo a metà e senza uscire dal suo riquadro. La pagina non avrà
    barra di scorrimento orizzontale. Le cifre saranno tabulari — tutte della
    stessa larghezza — così le colonne non ballano fra un numero e l'altro, e
    nelle eventuali tabelle i numeri staranno allineati a destra. Anche qui il
    paragone su 100 € resterà al suo posto accanto al risultato.

11. **Con la finestra stretta come un telefono, e solo con la tastiera.**
    Stringere la finestra sotto i 768 px di larghezza — quanto misura lo schermo
    di un telefono tenuto in verticale — e rifare il passo 5. Poi, senza toccare
    il mouse, premere Tab più volte e compilare i due campi da tastiera.
    *Risultato atteso:* i campi e il risultato si impileranno senza testo
    tagliato, nessuna scritta scenderà sotto i 16 px e nessun bersaglio da
    toccare sarà più piccolo di 44×44 px, cioè del polpastrello di un dito. Con
    Tab il focus attraverserà i campi nell'ordine in cui si leggono — prima la
    somma, poi gli anni — e a ogni passaggio si vedrà un contorno netto attorno
    all'elemento che lo ha, non un accenno. Ogni campo avrà la sua etichetta
    scritta accanto, non solo un testo grigio dentro al riquadro che sparisce
    appena si scrive. Questo passo non è un extra: se fallisce, la funzionalità
    non è finita.

12. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la schermata dalla cartella
    `dist/`.
    *Risultato atteso:* la build finirà senza errori, e rifacendo il passo 5 il
    numero sarà lo stesso — 9.057,31 € — **senza che parta una sola richiesta
    fuori dal computer**: il tasso è una costante scritta nel codice, non un
    dato che si va a prendere da qualche parte. Il caso del doppio clic su
    `dist/index.html` è un difetto già noto e registrato in
    `01-landing-page`, passo 8: qui si verifica che questa schermata **non
    aggiunga** nuove richieste di rete, non lo si risolve.

### Limiti previsti

- **Non dirà che cosa farne.** Nessun accenno a spostare quei soldi, a
  impiegarli o a confrontarli con qualcos'altro. La schermata descriverà
  un'erosione e si fermerà lì. È il confine più facile da sfondare proprio qui,
  perché la domanda successiva — «e allora?» — viene da sé: la risposta non sta
  in questa schermata.
- **Non confronterà strumenti** e non nominerà conti, titoli o fondi.
- **Il tasso non arriverà dalla rete**, né mentre il sito gira né mentre viene
  costruito. Resterà una costante scritta nel codice, con fonte e periodo
  dichiarati accanto, e si aggiornerà a mano.
- **Il valore vero del tasso è un blocco ancora aperto.** Deve essere la media
  di più anni dell'indice dei prezzi ISTAT, e nessuno di noi può inventarlo:
  serve che una persona lo recuperi e dichiari su quali anni è calcolato.
  Finché non succede, il **2,00%** dei passi qui sopra è un tasso di prova —
  l'aritmetica è quella definitiva, la fonte no. Non fermerà l'implementazione,
  perché il calcolo riceve il tasso come parametro, ma fermerà la demo con
  numeri veri.
- **Non userà il paragone «oggi la spesa di un mese, fra 5 anni tre
  settimane»** del documento d'origine: richiederebbe di sapere quanto costa la
  spesa di un mese, cioè un secondo numero che nessuna fonte ci dà e che quindi
  andrebbe inventato. Al suo posto il paragone su 100 €, altrettanto concreto e
  senza dati di provenienza ignota.
- **Non sarà una previsione.** Se l'inflazione dei prossimi anni sarà diversa da
  quella media, il numero sarà diverso — e starà scritto a schermo, non in una
  nota a piè di pagina.
- **Non chiederà e non conserverà dati personali.** La cifra digitata resterà
  nella pagina e non verrà salvata da nessuna parte.
- **Non leggerà un documento vero.** Somma e anni si digitano a mano: qui non
  entra nessun estratto conto.

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

> **Non ancora compilata.** Il codice di questa funzionalità è in costruzione
> proprio ora: non c'è niente da verificare, e scrivere qui qualcosa
> significherebbe dichiarare fatto ciò che nessuno ha controllato.
>
> Questa sezione si riempie in **fase 2**, al termine di `/implementa`,
> aprendo i file di `src/core/` e `src/ui/`, leggendo
> `src/core/__tests__/simulazioneRisparmio.test.ts` e
> `tests/accettazione/07-valore-dei-risparmi.test.ts`, e **rieseguendo davvero**
> i dodici passi scritti sopra. Conterrà «Cosa fa», «Come si prova», «Limiti» e
> «Divergenze fra previsto e realizzato», tutto al presente, e solo allora lo
> stato passerà a `implementato`.
>
> Finché questa sezione resta vuota, `/verifica` non accetta la funzionalità
> come `implementato`.
