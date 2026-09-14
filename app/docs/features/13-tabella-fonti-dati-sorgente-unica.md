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
