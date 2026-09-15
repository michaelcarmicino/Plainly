# 13 — «Da dove vengono i numeri di questo sito»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 7 «Fonti dati e piano di aggiornamento». Task di backlog: `13`.
>
> **Tre scostamenti dal documento d'origine**, tutti per conformità, tutti
> spiegati in «Cosa questa funzionalità NON fa»: non esiste la colonna
> «Aggiornamento», la riga sui contenuti educativi non entra, e il registro
> parte con le righe che esistono davvero nel codice — oggi una — non con le
> sei della tabella d'origine.

## Per chi

La persona che è arrivata in fondo alla schermata dei risparmi fermi, ha letto
«un aumento dei prezzi di 2,00% all'anno» e si è fatta la domanda che chiunque
si fa davanti a un numero scritto da qualcun altro: **chi lo dice?** Non
diffida per principio: ha imparato che le cifre in giro sono spesso decorative,
e non ha modo di distinguere un numero controllabile da uno inventato.

Di riflesso serve anche a chi costruisce le funzionalità 08 (le fasce di
tassazione sul reddito) e 10 (i tassi del mutuo), che porteranno altri numeri
senza fonte. Ma il destinatario è la persona: se la struttura servisse solo a
noi, sarebbe un file di appunti, non una funzionalità.

## Quando serve

Nel momento in cui, sotto un risultato, legge la riga «da dove viene questo
numero» e vuole andare a fondo. È **un tocco solo** da qualunque numero del
sito, e il percorso di ritorno è quello di sempre: «Indietro», nella stessa
posizione di ogni altra pagina.

Serve anche in un secondo momento, meno frequente e più importante: quando la
schermata dichiara che di un numero **non si sa** su quali anni sia calcolato.
Lì la persona non sta approfondendo, sta verificando — ed è la volta in cui il
prodotto ha più da perdere.

## Cosa deve poter fare dopo

Dire, di ogni numero che il sito le ha mostrato, **da chi viene, su quale
periodo vale e quando è stato scritto qui dentro** — oppure dire che una di
queste tre cose manca. Prima aveva una cifra e nessun modo di controllarla;
dopo ha una riga che o le permette di risalire alla fonte, o le dichiara che
non può.

Osservabile: aprendo la pagina legge, per l'inflazione, «2,00%», «ISTAT,
indice NIC» e la frase che dice che il periodo di calcolo non è ancora stato
stabilito.

## Input

Nessun dato digitato dalla persona. Nessun dato letto da un documento.
**Nessun dato preso dalla rete**, né mentre il sito gira né mentre viene
costruito.

L'unico ingresso è il **registro**: un array di righe scritte a mano nel
codice, in `src/core/registroFonti.ts`. Ogni riga è un numero con la sua
provenienza:

| Campo | Forma | Che cosa dice |
| --- | --- | --- |
| `id` | stringa stabile, es. `'inflazione-nic'` | la chiave con cui il resto del sito chiede questo numero |
| `valore` | **intero** | mai un float: la convenzione del dominio non si piega qui |
| `unita` | `'centesimi'` \| `'punti-base'` | le due sole convenzioni del progetto, dichiarate sulla riga invece che dedotte dal nome |
| `fonte` | stringa | il nome di chi pubblica il dato, **così come lo scrive lui**: `'ISTAT'`, `'Banca d'Italia'` |
| `indicatore` | stringa | il nome tecnico del dato presso quella fonte: `'indice NIC'`. Resta, non viene tradotto |
| `periodo` | `{ inizio, fine }` **oppure `null`** | gli anni su cui il valore è calcolato. `null` non è una svista: è il caso in cui nessuno l'ha ancora stabilito |
| `dataInserimento` | `'AAAA-MM-GG'` | **scritta a mano** dalla persona che ha inserito la riga. Non è `Date.now()`: il core è puro |

`periodo: null` è il cuore della struttura, non un caso di bordo. Esiste perché
**oggi il progetto ha già un numero con la provenienza incompleta** e ha
scelto di dichiararlo invece di nasconderlo.

### Le righe con cui parte

Una sola, quella che esiste davvero nel codice oggi:

```
id 'inflazione-nic' · valore 200 · unita 'punti-base' · fonte 'ISTAT'
indicatore 'indice NIC' · periodo null · dataInserimento '2026-09-14'
```

Le altre cinque righe della tabella d'origine **non entrano ora**: i loro
valori non esistono in nessun punto del codice, e scriverli qui significherebbe
inventarli. Entrano con 08 e con 10, una riga per volta, insieme al numero che
le rende vere.

## Elaborazione

Tutto in `src/core/`, puro e deterministico: nessun I/O, nessun `Date.now()`,
nessun `Math.random()`.

1. **`provenienzaCompleta(riga)`** → `true` solo quando `periodo !== null`,
   `fonte` non è vuota e `dataInserimento` non è vuota. È la generalizzazione
   del flag che oggi sta su `TassoInflazioneDichiarato`, e a differenza di
   quello **non è scritto a mano**: si ricava dai campi, quindi non può
   dichiarare completa una riga a cui manca il periodo.
2. **`fonteDi(id)`** → `Esito<RigaFonte>`: fallisce con un codice quando l'id
   non è nel registro. Nessuna `throw` nel flusso normale.
3. **`valoreBpDi(id)`** → `Esito<number>`: fallisce quando la riga esiste ma
   ha `unita: 'centesimi'`. Chiedere punti base a un importo in centesimi è
   l'errore che questa struttura esiste per rendere impossibile in silenzio.
4. **`righeConProvenienzaIncompleta(registro)`** → l'elenco delle righe da
   completare. È il numero che la schermata mostra in testa, ed è anche ciò
   che rende visibile quanto lavoro manuale resta aperto.

Nessun calcolo aritmetico: qui non si divide e non si moltiplica niente. La
formattazione avviene **solo** con `src/core/formatoIt.ts` — `formattaEuro`
per `'centesimi'`, `formattaPercentuale` per `'punti-base'` — mai con `Intl`.

### Come `inflazioneDichiarata.ts` confluisce qui

Non nasce un secondo registro: **due registri divergono**, e il difetto
arriverebbe esattamente il giorno in cui qualcuno corregge il 200 in uno solo
dei due.

- Il `200` si sposta **dentro `registroFonti.ts`**, sulla riga
  `'inflazione-nic'`. Dopo l'intervento quel numero compare **in un file
  solo**, e un test lo verifica.
- `src/core/inflazioneDichiarata.ts` **resta**, con il suo commento, ma smette
  di contenere un valore: `INFLAZIONE_DICHIARATA` diventa una vista ricavata
  dalla riga del registro, con la stessa forma di oggi (`valoreBp`,
  `periodoDichiarato`). `periodoDaCompilare` diventa il caso particolare di
  `provenienzaCompleta`.
- Perché tenere la vista invece di cambiare i punti di chiamata:
  `src/ui/NotaTasso.tsx` e i test esistenti continuano a compilare senza
  toccarli, quindi l'intervento non allarga il diff su `src/ui/` per un
  guadagno nullo. La vista non è un registro: **non possiede nessun numero.**

## Output

### È una schermata, non solo una struttura

Una pagina sola, raggiungibile da `#/da-dove-vengono-i-numeri`, con un
collegamento in `NotaTasso` — cioè sotto ogni numero che il sito mostra — e
uno nella navigazione. Il concetto della schermata è **uno**: da dove vengono
i numeri di questo sito.

Un «foglio di calcolo con sei colonne» violerebbe «un concetto per schermata».
Quindi non è una griglia di colonne: è **una riga per numero**, che risponde a
tre domande nell'ordine in cui la persona se le pone.

| Elemento | Forma |
| --- | --- |
| Che numero è | prima la frase di tutti i giorni — «di quanto salgono i prezzi in un anno» — **poi** il nome tecnico, «indice NIC», mai il contrario |
| Quanto vale | il valore formattato, **con l'unità accanto**: `2,00%`. Allineato a destra, cifre tabulari |
| Da dove viene | il nome della fonte come lo scrive lei: `ISTAT` |
| Su quale periodo vale | gli anni, **oppure** la riga in rosa che dichiara che non sono stati stabiliti |
| Da quando è scritto qui | la data di inserimento, in lettere: «scritto a mano qui dentro il 14 settembre 2026» |

Il rosa `#FF50A0` compare **solo** sulla riga della provenienza incompleta: è
il colore di ciò che il prodotto non fa, e qui è al suo posto. Sotto i 768 px
le righe si impilano a riquadri: **nessuna barra di scorrimento orizzontale**,
e nessun contenuto raggiungibile solo con un gesto.

### Le parole stanno in `src/ui/`, i numeri in `src/core/`

È la stessa separazione già imposta sulla 07, e vale qui parola per parola:
**il core dice SE la provenienza è completa, la schermata dice COM'È SCRITTA.**

Nuove stringhe in `src/ui/testiFonti.ts`, unite a `STRINGHE_UTENTE` con lo
spread come `testiSimulazione.ts` — `testi.ts` è a 114 righe su 150, e il
registro scandito dal guardrail deve restare **un oggetto solo**. Chiavi:
`fontiOcchiello`, `fontiTitolo`, `fontiIntro`, `fontiColonnaValore`,
`fontiColonnaFonte`, `fontiColonnaPeriodo`, `fontiInserito`,
`fontiPeriodoMancante`, `fontiAggiornamentoManuale`, `fontiVuoto`,
`fontiNessunaCompleta`, `fontiErroreRiga`, `fontiNomeInflazione`,
`fontiLimitiTitolo`, `fontiLimiteAggiornamento`.

Il nome proprio della fonte (`ISTAT`) e quello dell'indicatore (`indice NIC`)
restano **dati sulla riga del registro**, non chiavi di `testi.ts`: sono
etichette d'origine, e valgono la stessa regola di `etichettaOriginale` sulle
voci del documento — riscriverle altererebbe l'informazione originale. Non
sfuggono al controllo: `tests/lessico-ui.test.ts` scandisce già i letterali di
tutto `src/`, `src/core/` compreso.

### I quattro stati obbligatori

1. **Vuoto** — due casi, stessa regola. Registro senza righe: la pagina dice
   che qui compariranno i numeri usati nel sito, non «nessun risultato».
   Registro con righe ma **nessuna a provenienza completa** — che è lo stato
   reale di oggi, una riga su una — la pagina dice che cosa manca (gli anni su
   cui la media è calcolata) e come si ottiene (una persona lo recupera e lo
   scrive): non è un errore del sito, è lavoro non ancora fatto.
2. **In caricamento** — non c'è attesa: il registro è una costante compilata
   dentro la pagina. Lo stato esiste come spazio già occupato, così quando le
   righe compaiono il layout non salta. Nessuna rotellina che gira per un
   istante e sparisce.
3. **Errore** — una riga con unità e valore incoerenti non viene saltata in
   silenzio né fa sparire la pagina: **resta al suo posto** e al posto del
   numero c'è una frase da persona, sul modello di
   `simulazioneRisparmioErroreTasso`. Nascondere una riga rotta è il
   comportamento peggiore di tutti: toglie dalla vista proprio ciò che questa
   pagina esiste per mostrare.
4. **Dati lunghi o numerosi** — trenta righe, nomi di fonte lunghi
   («Agenzia delle Entrate»), importi a sette cifre. Le etichette vanno a capo,
   i numeri restano allineati a destra e tabulari, la griglia non si rompe.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/registroFonti.test.ts`:
  - `provenienzaCompleta` è `false` sulla riga `'inflazione-nic'`, perché
    `periodo` è `null`;
  - **il 200 sta in un posto solo**: `INFLAZIONE_DICHIARATA.valoreBp` è uguale
    al `valore` della riga del registro. È il test che impedisce il secondo
    registro parallelo;
  - `valoreBpDi` fallisce su una riga in centesimi e riesce su una in punti
    base;
  - ogni riga ha `valore` intero e `dataInserimento` nella forma `AAAA-MM-GG`.
- **Test di accettazione** — `tests/accettazione/13-tabella-fonti.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice.
- **Nessun test nuovo di lessico**: `tests/lessico-ui.test.ts` cammina già su
  tutto `src/` e scandisce i letterali sopra i 12 caratteri e le radici vietate
  negli identificatori. `registroFonti.ts` è coperto dal giorno in cui esiste.
- **In demo, dieci secondi**: dalla schermata dei risparmi si tocca «da dove
  viene questo numero», si apre la pagina, e si legge in rosa che il periodo su
  cui la media è calcolata non è stato stabilito. È il prodotto che dichiara il
  proprio buco invece di coprirlo.

## Cosa questa funzionalità NON fa

- **Non aggiorna niente da sola, e non promette di farlo.** Nessuna chiamata
  alla rete, né a runtime né in fase di build. I valori entrano a mano, e la
  riga dichiara **quando** sono stati scritti e **su quale periodo** valgono.
  L'aggiornamento resta un gesto umano: una persona apre il file, cambia il
  numero e la data, e committa.
- **Non ha la colonna «Aggiornamento» del documento d'origine** («Mensile»,
  «Annuale»). È una cadenza attesa, cioè una promessa sul futuro che il
  prodotto non può mantenere: nessun meccanismo qui dentro fa scattare
  alcunché a fine mese. Al suo posto il dato che la persona può davvero usare —
  la data in cui il numero è stato scritto — che le lascia giudicare da sola se
  è vecchio.
- **Non include la riga «Contenuti educativi su investimenti»** della sezione 7.
  Non è un valore numerico ma una bibliografia, e il registro tiene numeri.
  In più la sua cadenza è scritta nel documento d'origine con una parola che
  contiene una radice vietata: trascritta com'è, farebbe fallire `npm test`.
- **Non traduce i nomi delle fonti né degli indicatori.** `ISTAT` resta
  `ISTAT`, `indice NIC` resta `indice NIC`. La frase di tutti i giorni si
  affianca al nome tecnico, non lo sostituisce.
- **Non giudica le fonti** e non le mette in ordine di affidabilità. Non dice
  quale sia più attendibile né a quale credere: elenca, dichiara la
  provenienza, e si ferma lì.
- **Non inventa le righe che mancano.** Il registro parte con l'unico numero
  che esiste nel codice. Riempirlo con i valori delle altre cinque fonti
  «perché la tabella sembri completa» sarebbe esattamente il difetto che questa
  funzionalità esiste per impedire.
- **Non tocca `types/contracts.ts`.** I tipi del registro nascono dentro
  `src/core/`.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **nessuno.** `RigaFonte`, `UnitaValore` e `PeriodoRiferimento` nascono **dentro `src/core/`**, di proprietà di core-engine, come già i tipi della 07. `Provenienza` in `types/contracts.ts` è stato guardato e **non riusato**: descrive come è stata ottenuta una *voce di documento* (`'fixture'` \| `'inserimento-manuale'`), non la provenienza editoriale di una costante numerica. Sono due assi diversi, unirli confonderebbe entrambi |
| **Contratti già congelati?** | **no** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: questa funzionalità **non modifica `types/`**, quindi **non richiede l'architetto** |
| **Agente incaricato** | **`01-core-engine`** (il registro e i predicati, che sono il cuore), con **`03-ui-builder`** (la pagina, le stringhe, la rotta, il collegamento da `NotaTasso`) e **`04-guardrail-officer`** per `tests/` e la rilettura delle stringhe nuove prima del merge |
| **Directory toccate** | **3 — servono più agenti.** `src/core/` (`registroFonti.ts` nuovo, `inflazioneDichiarata.ts` **modificato**, `index.ts` esteso, `__tests__/registroFonti.test.ts`), `src/ui/` (`PaginaFonti.tsx`, `testiFonti.ts`, `testi.ts` esteso con lo spread, `rotte.ts`, `NotaTasso.tsx`, `Navigazione.tsx`, `stiliFonti.css`), `tests/` (`accettazione/13-tabella-fonti.test.ts`). **`types/` non è toccata** |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/13-da-dove-vengono-i-numeri.png`, con la riga dell'inflazione e la dichiarazione in rosa del periodo mancante. Va accanto alla slide dei limiti: è la prova che il prodotto dichiara ciò che non sa |

### Conflitto di pianificazione, da sapere prima di `/implementa`

**`src/core/` è nell'impronta**, perché `inflazioneDichiarata.ts` viene
modificato: il `200` si sposta nel registro. Conseguenze, da rispettare:

1. **Questo task non può girare in parallelo con nessun altro che tocchi
   `src/core/`** — in particolare **08** (fasce di tassazione sul reddito) e
   **10** (tassi del mutuo), che porteranno righe nuove nel registro. Né con
   task su `src/ui/` o `tests/`.
2. **13 va prima di 08 e di 10**, non dopo. È la struttura che quei due
   riempiono: costruirli prima significa che ognuno si risolve il problema a
   modo suo, ed è la situazione che questa funzionalità esiste per evitare.
3. La 07 è chiusa e pubblicata, quindi `src/core/` e `src/ui/` sono liberi.
   `NotaTasso.tsx` e `src/core/index.ts` sono i due file già esistenti che
   questo intervento tocca: vanno riletti, non riscritti.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-14, dalla sola specifica.
> La fase 2 — rilettura del codice e dei test, esecuzione dei passi qui sotto e
> riscrittura al presente sotto «Verificato» — non è ancora stata fatta.

### Cosa farà

Aprendo questa pagina comparirà, per ogni numero che il sito usa, una riga con
tre risposte: chi lo dice, su quale periodo vale, da quando è scritto qui
dentro. Se anche una sola di queste tre cose manca, la pagina lo dichiarerà
apertamente invece di lasciar credere che il numero sia comunque verificabile
— ed è esattamente il caso di oggi: l'unica riga presente, quella
dell'inflazione al 2,00% (due euro in più ogni cento spesi, ogni anno), ha gli
anni su cui è calcolata la media ancora da stabilire, e la pagina lo dirà in
chiaro invece di presentare quella percentuale come un fatto già controllato.

### Per chi

La persona che è arrivata in fondo a una schermata con un numero — per esempio
quella dei risparmi fermi, con «un aumento dei prezzi di 2,00% all'anno» — e
si è fatta la domanda che chiunque si fa davanti a una cifra scritta da
qualcun altro: chi lo dice? Le servirà nel momento esatto in cui tocca la nota
sotto quel numero, con un gesto solo, da qualunque punto del sito in cui
compare una cifra.

Le servirà anche, più raramente e in modo più delicato, quando la pagina le
dirà che di un numero il periodo non è ancora stato stabilito: lì non sta
approfondendo per curiosità, sta verificando — ed è il momento in cui il
prodotto ha più da perdere se la lacuna viene nascosta invece che dichiarata.

### Come si proverà

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non
dà il risultato atteso, la funzionalità non è finita. I comandi vanno eseguiti
da `app/`.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`, che esegue
   `node scripts/prepara.mjs`). Serve solo la prima volta.
   *Risultato atteso:* lo script dirà «Ambiente già pronto», oppure elencherà
   i passi che ha installato, e il suo controllo di salute — `tsc --noEmit` e
   poi `npm test` — finirà senza errori.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue
   `node scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un
   processo che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo `http://localhost:5173`.

3. **Partire da un numero vero, non dalla pagina delle fonti direttamente.**
   Aprire quell'indirizzo, raggiungere la schermata «quanto valgono davvero i
   miei risparmi» (funzionalità 07) e digitare una somma e degli anni
   qualunque — per esempio 10.000 e 5 — così da vedere comparire il risultato
   e, accanto, la nota su quale tasso è stato usato.
   *Risultato atteso:* accanto al risultato comparirà la nota con scritto il
   tasso — **2,00%** — e la sua fonte, la stessa già verificata nella
   funzionalità 07. Quella nota è il punto di partenza: da lì, con un tocco
   solo, si dovrà poter raggiungere la pagina «da dove vengono i numeri».

4. **Il tocco che porta alla pagina delle fonti.** Toccare la nota del tasso.
   *Risultato atteso:* si aprirà la pagina all'indirizzo
   `#/da-dove-vengono-i-numeri`. Un tocco solo, non un percorso a più passaggi
   dentro un menu.

5. **Lo stato di oggi — il criterio più importante di tutti.** Guardare la
   riga dell'inflazione, senza fare nient'altro.
   *Risultato atteso:* la pagina **non presenterà il 2,00% come un numero già
   del tutto verificabile**. Si leggeranno il valore e la fonte — ISTAT,
   indice NIC — ma al posto del periodo comparirà una dichiarazione esplicita,
   in linguaggio umano, che gli anni su cui è calcolata la media non sono
   ancora stati stabiliti. Sarà scritta **in rosa** (`#FF50A0`, il colore
   riservato a ciò che il prodotto non fa o non sa) — non un trattino, non un
   campo vuoto: una frase che dice che quell'informazione manca e che qualcuno
   deve ancora scriverla. È il caso reale di oggi — righe presenti, nessuna a
   provenienza completa — e la pagina lo tratterà come lavoro non finito, non
   lo nasconderà.

6. **Il resto della riga, letto nell'ordine giusto.** Sulla stessa riga,
   controllare l'ordine e la forma delle altre informazioni, e guardarsi
   attorno per vedere dove altro compare il rosa.
   *Risultato atteso:* prima la frase di tutti i giorni — qualcosa come «di
   quanto salgono i prezzi in un anno» — **poi** il nome tecnico, «indice
   NIC»: mai il nome tecnico da solo. Il valore, «2,00%», sarà allineato a
   destra con cifre tabulari e l'unità **accanto** al numero, non in
   un'intestazione separata. La data sarà scritta in lettere, non nel formato
   `AAAA-MM-GG`: qualcosa come «scritto qui il 14 settembre 2026». E il rosa
   del passo 5 sarà l'**unico** punto colorato così in tutta la pagina: da
   nessun'altra parte sarà usato per decorare.

7. **Il ritorno.** Usare il collegamento «Indietro» o l'equivalente di
   navigazione.
   *Risultato atteso:* comparirà nella stessa posizione in cui compare in ogni
   altra pagina del sito, e riporterà alla schermata da cui si era partiti —
   quella dei risparmi — senza aver perso i due numeri digitati al passo 3.

8. **Lo stato «in caricamento» non deve far saltare il layout.** Osservare la
   pagina delle fonti nell'istante esatto in cui si apre.
   *Risultato atteso:* nessuna rotellina che gira e sparisce. Il registro è
   una costante compilata dentro la pagina, quindi le righe compariranno già
   pronte, senza uno scatto del layout un istante dopo l'apertura.

9. **Errore e dati lunghi — verificabili solo in parte con i dati di oggi.**
   Cercare, nel registro visibile a schermo, una riga con l'unità e il valore
   incoerenti fra loro, e poi contare quante righe ci sono in tutto.
   *Risultato atteso:* non se ne troverà nessuna incoerente, e le righe
   saranno una sola — perché l'unica riga che esiste oggi, quella
   dell'inflazione, è coerente e da sola. **Questi due passi non sono quindi
   eseguibili end-to-end con l'app in esecuzione oggi**: il comportamento
   previsto per una riga rotta (resta al suo posto, con una frase da persona
   al posto del numero, invece di sparire) e quello per trenta righe con nomi
   di fonte lunghi vanno verificati in fase 2 leggendo
   `src/core/__tests__/registroFonti.test.ts`, non cliccando sulla pagina. Se
   in fase 2 quel test non copre questi casi, va segnalato come divergenza —
   non inventato un dato finto solo per poterlo mostrare.

10. **Da tastiera e a finestra stretta come un telefono.** Restringere la
    finestra sotto i 768 px di larghezza — quanto misura lo schermo di un
    telefono tenuto in verticale — e rifare i passi 5 e 6; poi, senza toccare
    il mouse, premere Tab più volte fino a raggiungere e attivare il
    collegamento del passo 4.
    *Risultato atteso:* la riga si impilerà a riquadro, senza barra di
    scorrimento orizzontale, nessuna scritta scenderà sotto i 16 px e nessun
    bersaglio sarà più piccolo di 44×44 px — cioè del polpastrello di un dito.
    Con Tab si raggiungerà la nota del tasso e la pagina delle fonti si aprirà
    anche premendo Invio, con un contorno netto visibile a ogni elemento che
    ha il focus.

11. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la schermata dalla cartella
    `dist/`.
    *Risultato atteso:* la build finirà senza errori, e rifacendo i passi 3-6
    si leggerà esattamente lo stesso contenuto — **senza che parta una sola
    richiesta fuori dal computer**: il registro è scritto nel codice, non un
    dato che si va a prendere da qualche parte.

### Limiti previsti

- **Non aggiornerà niente da solo.** Nessuna chiamata alla rete, né mentre il
  sito gira né mentre viene costruito: ogni numero entrerà a mano, e la riga
  dichiarerà quando è stato scritto e su quale periodo vale. L'aggiornamento
  resterà un gesto umano — una persona che apre il file, cambia il numero e la
  data, e committa.
- **Non avrà una colonna che promette una cadenza** («mensile», «annuale»)
  come nel documento d'origine: sarebbe una promessa sul futuro che nessun
  meccanismo qui dentro può mantenere. Al suo posto resterà solo la data in cui
  il numero è stato scritto, che lascia giudicare da sola se è vecchio.
- **Non includerà la riga sui contenuti educativi** del documento d'origine:
  non è un valore numerico ma un elenco di letture, e il registro esiste per
  tenere numeri con la loro provenienza, non bibliografie.
- **Non tradurrà i nomi delle fonti né degli indicatori.** «ISTAT» resterà
  «ISTAT», «indice NIC» resterà «indice NIC»: la frase di tutti i giorni si
  affiancherà al nome tecnico, non lo sostituirà.
- **Non giudicherà le fonti** e non le metterà in ordine di affidabilità:
  elencherà soltanto, dichiarando la provenienza di ciascuna.
- **Non inventerà le righe che mancano.** Partirà con l'unica riga che esiste
  davvero oggi nel codice — quella dell'inflazione — e non con le sei della
  tabella del documento d'origine. Le altre entreranno una alla volta, insieme
  al numero che le renderà vere, con le funzionalità che porteranno le fasce di
  tassazione e i tassi del mutuo.
- **Non toccherà i contratti condivisi** in `types/`: i tipi del registro
  nasceranno dentro `src/core/`.
- **Non risolverà da sola il periodo mancante dell'inflazione.** Resterà un
  buco dichiarato finché una persona non recupererà gli anni su cui la media
  ISTAT è calcolata: questa pagina lo rende visibile, non lo chiude.

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

> Stato: **implementato** · fase 2 eseguita il 2026-09-15 aprendo
> `src/core/registroFonti.ts`, `src/core/__tests__/registroFonti.test.ts`,
> `src/core/inflazioneDichiarata.ts`, `src/core/esito.ts`,
> `src/ui/PaginaFonti.tsx`, `src/ui/RigaRegistroFonte.tsx`,
> `src/ui/testiFonti.ts`, `src/ui/dataInLettere.ts`, `src/ui/motiviFonti.ts`,
> `src/ui/rotte.ts`, `src/ui/NotaTasso.tsx`, `src/ui/Navigazione.tsx` e
> `src/ui/stiliFonti.css`, e **rieseguendo** gli undici passi di fase 1 con un
> browser vero pilotato (Chromium via Playwright, non a occhio): server di
> sviluppo, build di produzione servita da un server locale, e apertura
> diretta di `dist/index.html`.
>
> **Dieci passi su undici danno il risultato atteso. L'undicesimo no, e non per
> una causa di questa funzionalità.** `dist/index.html` genera lo stesso tag
> `<script type="module" crossorigin>` già segnalato come difetto nella scheda
> 01 (`docs/features/01-landing-page.md`, passo 8): un doppio clic vero apre
> una pagina bianca per un blocco CORS sotto origine `null`. Servita da un
> server locale qualunque — verificato con un piccolo server statico su
> `127.0.0.1`, zero richieste fuori dal loopback — la stessa cartella `dist/`
> funziona in modo identico al server di sviluppo. Causa ed effetto vivono
> nella configurazione di build, fuori da `src/core/` e `src/ui/`: fuori dal
> perimetro di questa funzionalità e di questo agente. Dettaglio nel passo 11
> e in «Divergenze».
>
> **Un secondo fatto, emerso durante questa stessa verifica e non introdotto né
> corretto qui**: mentre scrivevo questa riconciliazione, il `tester` ha
> aggiunto in parallelo `tests/accettazione/13-tabella-fonti-dati-formattazione.test.ts`,
> che fa fallire `npm test` su 2 casi (125 totali): `dataInLettere('')` e
> `dataInLettere('ieri')` lanciano un `TypeError` invece di restituire un
> testo. Nessuno degli undici passi qui sotto lo incontra — usano tutti il
> dato reale del registro, già in forma valida — ed è un difetto in
> `src/ui/dataInLettere.ts`, non mio da correggere. È descritto per intero,
> con causa e classificazione, in `docs/test/13-tabella-fonti-dati.md`
> (sezione «Fallimenti»). Lo riporto qui solo perché a questa data `npm test`
> non è verde e chi legge questa scheda deve saperlo senza cercare altrove.

### Cosa fa

Aprendo `#/da-dove-vengono-i-numeri` compare, per ogni riga del registro, un
riquadro con tre risposte nell'ordine in cui una persona se le pone leggendo
un numero scritto da qualcun altro: chi lo dice, su quale periodo vale, da
quando è scritto qui dentro. Oggi il registro ha una sola riga — l'inflazione,
2,00% — e la sua provenienza è incompleta: manca il periodo. La pagina lo
dichiara con una frase esplicita in rosa (`#FF50A0`), invece di lasciar
credere che il 2,00% sia già un dato verificabile: confermato anche
programmaticamente che quel colore, in tutta la pagina, compare **soltanto**
lì — nessun altro elemento lo usa.

Il numero non vive in due posti: `INFLAZIONE_DICHIARATA.valoreBp` (letto dalla
nota sotto il simulatore dei risparmi, funzionalità 07) e il campo `valore`
della riga `'inflazione-nic'` del registro sono confrontati da un test
dedicato, e coincidono sempre — chi corregge il 200 lo fa in un file solo. Il
core stabilisce SE la provenienza è completa guardando i tre campi della riga
(`provenienzaCompleta`, mai un flag scritto a mano); la UI decide solo COME
scriverlo (`dataInLettere` trasforma `'2026-09-14'` in «14 settembre 2026»).

Da qualunque punto del sito mostri quel numero — oggi, la nota sotto la
simulazione dei risparmi fermi — un tocco solo apre questa pagina; «Indietro»
torna al punto di partenza senza perdere i valori digitati lì.

### Per chi

La persona che è arrivata in fondo alla schermata dei risparmi fermi, ha letto
«un aumento dei prezzi di 2,00% all'anno» e si chiede chi lo dice: tocca la
nota sotto il risultato e in un passo solo arriva a questa pagina.

Le serve anche, più raramente e in modo più delicato, quando la pagina
dichiara che il periodo su cui è calcolata la media non è ancora stato
stabilito: lì non sta approfondendo, sta verificando — ed è il momento in cui
il prodotto ha più da perdere se nasconde la lacuna invece di dichiararla.
Confermato: non la nasconde.

### Come si prova

Gli stessi undici passi della fase 1, eseguiti il 2026-09-15 da `app/` con un
browser pilotato, non a occhio. Accanto a ciascuno, ciò che è successo
davvero.

1. **Preparare l'ambiente.** `npm run prepara` conferma Node, dipendenze,
   browser Playwright e directory di lavoro già a posto, e `tsc --noEmit`
   pulito. Il controllo dei test segnala 2 test falliti su 125 (114 passati,
   9 ancora da scrivere) — non per una regressione di questa funzionalità:
   vedi il richiamo qui sopra e «Divergenze». I 20 test di
   `registroFonti.test.ts` sono fra quelli verdi. ✅ (con la nota qui sopra)

2. **Avviare l'applicazione.** `node scripts/dev-server.mjs start` risponde
   `Server avviato: http://localhost:5173` e lascia la sessione libera. ✅

3. **Partire da un numero vero.** Scritti **10000** e **5** nella schermata
   dei risparmi, compare la nota con «Il calcolo parte da un aumento dei
   prezzi di 2,00% all'anno...» e, in fondo, il collegamento «Vedi da dove
   vengono tutti i numeri di questo sito, uno per uno». ✅

4. **Il tocco che porta alla pagina delle fonti.** Il collegamento ha
   `href="#/da-dove-vengono-i-numeri"`; un click sposta davvero l'indirizzo
   a quella pagina. Un tocco solo, nessun menu di mezzo. ✅

5. **Lo stato di oggi — il criterio più importante di tutti.** La riga
   mostra «2,00%» e «ISTAT»; al posto del periodo compare la frase «Su quali
   anni sia calcolata questa media non è ancora stato stabilito da nessuno: è
   un pezzo che manca, e qualcuno deve ancora recuperarlo e scriverlo qui»,
   colorata `rgb(255, 80, 160)` — cioè esattamente `#FF50A0` — misurato con
   `getComputedStyle`, non a occhio. Il 2,00% non è mai presentato come un
   fatto già verificabile. ✅

6. **Il resto della riga, nell'ordine giusto.** «Di quanto salgono i prezzi
   in un anno» precede sempre «(indice NIC)», mai da solo; «2,00%» è
   allineato a destra con cifre tabulari; la data è scritta «14 settembre
   2026», non `2026-09-14`. Passata in rassegna ogni riga di testo della
   pagina per colore: **una sola** usa `rgb(255, 80, 160)`, quella del
   periodo mancante. ✅

7. **Il ritorno.** «Indietro» compare nella stessa barra di navigazione di
   ogni pagina, riporta a `#/valore-dei-risparmi`, e i due campi mostrano
   ancora **10000** e **5**: nessun dato perso. ✅

8. **Caricamento senza salto.** Aprendo direttamente
   `#/da-dove-vengono-i-numeri` la riga è già presente al primo controllo,
   senza rotellina né un secondo rendering che la sostituisce. ✅

9. **Errore e dati lunghi — verificati solo in parte, come già previsto.**
   Con l'unico registro reale di oggi (una riga, coerente) non si porta a
   schermo né una riga rotta né trenta righe: contate, le righe sono una, gli
   errori zero. Il comportamento per la riga rotta è confermato **leggendo**
   `RigaRegistroFonte.tsx` (un id sconosciuto o un'unità incoerente
   restituiscono un riquadro con una frase, non fanno sparire la riga) — ma
   **non da un test**: né `registroFonti.test.ts` né i test del tester
   istanziano quel componente con una riga rotta; solo la parte di *core*
   (`fonteDi`, `valoreBpDiRiga`) è testata, ed è verde. Per «dati lunghi», la
   tenuta resta affidata solo alla struttura CSS letta in `stiliFonti.css`
   (`overflow-wrap: break-word`, nessuna larghezza fissa), mai messa alla
   prova con dati reali. Verificabile solo in parte, come già scritto in fase
   1 — con in più un dettaglio che la fase 1 non poteva prevedere: vedi
   «Divergenze».

10. **Finestra stretta e tastiera.** A 375 px la pagina non produce
    scorrimento orizzontale (`scrollWidth` = `clientWidth` = 375), il testo
    più piccolo misurato è 18 px, i due bottoni di navigazione misurano
    183×45 e 133×45 px — sopra il minimo di 44. Con solo Tab si raggiunge il
    collegamento alla pagina delle fonti, con un contorno di 3 px ben
    visibile, e Invio lo attiva. ✅

11. **Con il Wi-Fi spento — questo passo non dà il risultato atteso alla
    lettera.** `npm run build` finisce senza errori (`index.html` 0,5 kB, CSS
    8,4 kB, JS 173 kB). Servita da un server locale qualunque — anche in solo
    loopback, senza alcuna rete esterna — la build funziona in modo identico
    al server di sviluppo: nota, collegamento, riga, tutto corretto, zero
    richieste diverse da quelle verso quel server. **Aperta con un doppio
    clic reale su `dist/index.html`, cioè `file://`, la pagina resta
    bianca**, per lo stesso motivo già noto dalla scheda 01: gli attributi
    `type="module" crossorigin` sullo script e sul foglio di stile sono
    bloccati dal browser sotto origine `null`. ❌ per la lettera del passo
    («riaprire la schermata dalla cartella `dist/`»); ✅ per la sostanza che
    il passo voleva provare («funziona offline, zero richieste di rete»).
    Dettaglio in «Divergenze».

### Limiti

- **Non aggiorna niente da solo.** `registroFonti.ts` è un array scritto a
  mano; nessuna chiamata di rete in nessun file della funzionalità
  (confermato anche da `tests/accettazione/13-tabella-fonti-dati-conformita.test.ts`)
  né nel bundle costruito — zero richieste diverse da quelle verso chi serve
  la pagina, verificato ai passi 3-6 e 11.
- **Non ha una colonna che promette una cadenza.** `testiFonti.ts` non
  contiene nessuna chiave del genere; al suo posto solo la frase sui limiti e
  la data di inserimento di ogni riga.
- **Non include righe sui contenuti educativi.** `REGISTRO_FONTI` contiene un
  solo elemento — verificato da un test che ne blocca la lunghezza a 1.
- **Non traduce nomi di fonti o indicatori.** `riga.fonte` e
  `riga.indicatore` sono stampati così come sono scritti nel registro
  («ISTAT», «indice NIC»), mai passati da `testi.ts`.
- **Non giudica le fonti.** Nessuna funzione le ordina o le confronta;
  confermato anche da un test dedicato (`tests/lessico-fonti.test.ts`), che
  verifica l'assenza di parole come «affidabile» o «autorevole» nelle
  stringhe della pagina.
- **Non inventa le righe che mancano.** Il registro parte con la sola riga
  che esiste davvero nel codice, e un test lo blocca a lunghezza 1.
- **Non tocca `types/`.** Nessuno dei due commit di questa funzionalità
  (core-engine e ui-builder) modifica file sotto `types/` — confermato con
  `git show --stat` su entrambi.
- **Non risolve da sola il periodo mancante dell'inflazione.** `periodo`
  resta `null` sulla riga `'inflazione-nic'`, e la pagina continua a
  dichiararlo, non a nasconderlo.
- **Limite non previsto in fase 1, trovato in fase 2.**
  `src/ui/dataInLettere.ts` non gestisce una data scritta a mano senza
  trattini (stringa vuota o testo libero): lancia un'eccezione invece di
  mostrare una frase. Con il registro di oggi (una riga, data già valida) non
  è raggiungibile, ma è una fragilità reale di fronte a un errore di
  battitura futuro. Dettaglio in `docs/test/13-tabella-fonti-dati.md`.

### Divergenze fra previsto e realizzato

1. **Passo 11 — «con il Wi-Fi spento» non dà, alla lettera, il risultato
   previsto.** La fase 1 prevedeva che riaprendo la build da `dist/` si
   leggesse lo stesso contenuto senza alcuna richiesta esterna. È vero SOLO
   se `dist/` è raggiunta tramite un server, locale o di sviluppo: un doppio
   clic reale su `index.html` produce una pagina bianca, perché il tag
   generato dalla build (`<script type="module" crossorigin>`) viene
   bloccato dal browser sotto l'origine `null` di `file://`. **Non corretto
   qui**: la causa vive nella configurazione di build (`vite.config.ts` e
   l'HTML generato), fuori da `src/core/` e `src/ui/` — fuori dal perimetro
   di questa funzionalità e di questo agente. **Non è un difetto nuovo**: è
   lo stesso, identico problema già trovato e scritto nella scheda 01
   (`docs/features/01-landing-page.md`, passo 8, stesso giorno), mai risolto
   da allora. Lo strato applicativo di questa funzionalità — registro,
   pagina, navigazione, contenuti — è verificato corretto: solo il
   contenitore di consegna (`file://` puro) ha il buco.

2. **Passo 9 — la fase 1 assumeva che leggere `registroFonti.test.ts`
   bastasse a confermare il comportamento sulla riga rotta; non basta del
   tutto.** Quel test copre solo la parte di *core* (`fonteDi`,
   `valoreBpDiRiga` restituiscono il codice giusto — confermato, verde). La
   parte di *interfaccia* — che `RigaRegistroFonte.tsx` mostri una frase al
   posto della riga invece di farla sparire — è confermata **solo leggendo
   il codice sorgente del componente**: nessun test, né unitario né di
   accettazione, lo istanzia con una riga incoerente. Il comportamento c'è,
   come promesso; il modo in cui la fase 1 pensava di poterlo confermare non
   regge fino in fondo. Lo stesso vale per «trenta righe, nomi lunghi»: solo
   la CSS lo prevede, nessun test o schermata reale lo mette alla prova.

3. **Trovato durante questa riconciliazione, non prima: `src/ui/dataInLettere.ts`
   lancia un'eccezione su una data scritta senza trattini** (stringa vuota o
   testo libero), invece di restituire una frase leggibile. Scoperto dal
   `tester` con `tests/accettazione/13-tabella-fonti-dati-formattazione.test.ts`
   (2 test su 125 attualmente falliti in `npm test`), non da questa scheda:
   nessuno degli undici passi di «come si prova» lo incontra, perché tutti
   usano il dato reale del registro, già in forma valida. Riportato qui
   **solo perché a questa data la suite non è verde** e chi legge questa
   scheda deve saperlo senza cercare altrove; il difetto stesso, la causa e
   la classificazione («non bloccante oggi con l'unica riga reale, da
   correggere prima che 08 o 10 aggiungano righe scritte a mano») sono
   descritti per intero in `docs/test/13-tabella-fonti-dati.md`, sezione
   «Fallimenti». Non corretto qui: non è un file di questo agente.

4. **Nessuna divergenza sui restanti nove passi, né su «Cosa farà» o «Limiti
   previsti».** Quanto descritto in fase 1 corrisponde a quanto costruito,
   incluso il criterio dichiarato «il più importante di tutti» (passo 5): la
   pagina non presenta mai il 2,00% come un fatto già verificabile.
