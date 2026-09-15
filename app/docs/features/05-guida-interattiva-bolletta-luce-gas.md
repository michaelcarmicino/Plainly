# 05 — «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «01-core-engine»
> e «00-architect» per le fixture
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 3 «Guide interattive ai documenti quotidiani», documento 2.
> Task di backlog: `05`.
>
> **Nessuna deroga al brief.** La lettura di una bolletta è lo **scenario 1**
> di `docs/brief.md`, e `'bolletta'` è già un valore dell'unione `Scenario` in
> `types/contracts.ts`: questa funzionalità sta dentro il perimetro dichiarato
> senza estenderlo. È l'unica delle tre guide-documento di cui si può dire.
>
> **La meccanica non è ridichiarata qui.** È definita una volta nella spec
> `04` e questa la riusa: vedi «La meccanica condivisa» qui sotto, dove la
> scelta è motivata e dove è elencato ciò che questa spec **aggiunge** invece
> di ripetere.
>
> **Due scostamenti dal documento d'origine**, entrambi spiegati in «Cosa
> questa funzionalità NON fa»: nessuna lettura di una bolletta vera, e
> **nessun ponte al simulatore energia/spese, che non esiste e non è in
> backlog** — è un blocco dichiarato, non un dettaglio rinviato.

## La meccanica condivisa — dove sta, e perché non sta qui

Le tre guide-documento (`04` busta paga, `05` bolletta, `06` 730) hanno lo
stesso impianto: un facsimile anonimizzato a righe, alcune righe apribili, una
spiegazione che compare sotto la riga toccata, una card di riepilogo che non è
un quiz, un ponte verso il simulatore collegato.

**Quell'impianto è dichiarato per intero nella spec `04`**
(`docs/features/04-guida-interattiva-busta-paga.md`, sezioni «Output» e
«Accessibilità»). Questa spec lo riferisce e descrive solo il documento, i
numeri e le parole che cambiano.

Perché così, e non tre dichiarazioni indipendenti:

- **La terza copia divergerebbe.** Le tre guide vengono implementate da agenti
  diversi in momenti diversi. Tre descrizioni della stessa meccanica non
  restano allineate: la prima che cambia lascia le altre due indietro, e
  nessun test se ne accorge, perché sono file di documentazione.
- **L'ordine è già obbligato**, quindi il riferimento non può restare appeso.
  Il backlog di `04` dichiara che `05` va fatta **dopo**, non in parallelo:
  quando questa spec entra in `/implementa`, `04` è già stata realizzata e i
  suoi componenti esistono.
- **Il risparmio è reale, non teorico.** Se `04` produce componenti generici
  su `VoceDocumento`, questa funzionalità è una fixture più qualche stringa.

E una cosa che invece **viene ripetuta per intero**, non riferita: il
**contratto di accessibilità** (qui sotto). Un vincolo che si legge solo
aprendo un altro file è un vincolo che viene saltato, e questo è il punto
esatto in cui una guida a zone cliccabili si rompe.

> **Dipendenza da dichiarare prima di `/implementa`.** `04` elenca i propri
> componenti con nomi legati al cedolino (`RigaCedolino.tsx`,
> `stiliCedolino.css`). Perché il riuso sia reale e non una biforcazione,
> quei componenti devono essere **generici su `VoceDocumento`** e avere nomi
> che non nominino un solo documento — `RigaDocumento`, `RiepilogoVoci`,
> `GuidaDocumento`, `stiliGuidaDocumento.css`. È una decisione di
> denominazione che va presa **mentre si implementa `04`**, non dopo: dopo
> costa una riscrittura. Registrata anche in testa alla spec `04`.

### Il contratto di accessibilità — ripetuto, non riferito

Vale identico per tutte e tre le guide. `.claude/rules/design.md` vieta
**qualunque informazione disponibile solo al passaggio del mouse**: al
proiettore e su un telefono il passaggio del mouse non esiste, e una guida a
zone cliccabili è il posto in cui questo errore si commette per distrazione.

| Requisito | Come si realizza |
| --- | --- |
| **Niente di solo-hover** | l'evidenziazione e la spiegazione arrivano dal **clic o dal tocco**, e **restano** finché non si apre un'altra riga. Il passaggio del mouse può cambiare il fondo della riga, ma **non può essere l'unico modo** di vedere un dato |
| **Tastiera** | ogni riga apribile è un **`<button>` vero**: si raggiunge con `Tab`, si apre con `Invio` **e** con `Spazio`, porta `aria-expanded` che passa a `true`, e la spiegazione è collegata con `aria-controls` |
| **Focus visibile** | contorno netto sulla riga che ha il focus, mai `outline: none` senza un sostituto altrettanto evidente |
| **Ordine di tabulazione** | uguale all'ordine di lettura del documento, dall'alto in basso |
| **Area cliccabile** | **minimo 44×44 px** per ogni riga apribile, anche quando l'etichetta è corta: è l'intera riga a essere il bersaglio, non il solo testo |
| **Nessun gesto obbligatorio** | nessuno swipe, nessun pinch, nessun trascinamento sul facsimile: al tocco esiste sempre l'equivalente clic |
| **Nessun limite di tempo** | la spiegazione non si chiude da sola, la schermata non si resetta |
| **Icone con testo** | nessuna icona da sola: il segno di «apribile» ha accanto la sua parola |

## Per chi

Una persona che riceve la bolletta della luce e vede un totale più alto di
quello che si aspettava. In casa non è cambiato niente: stessi
elettrodomestici, stesse abitudini. Ha già fatto l'unica verifica che sa fare
— ha guardato i kWh — e i kWh non sono aumentati molto. Quindi il conto non le
torna, e non ha modo di capire dove guardare: la bolletta ha quattro righe in
sintesi e sei pagine di dettaglio, e le quattro righe hanno nomi che non
descrivono niente di riconoscibile (`oneri di sistema`).

È la domanda già scritta sulla home, nell'area «Il costo della vita»: «Perché
la bolletta è così alta questo mese?». Questa funzionalità è la sua risposta,
e la risposta **non è** un giudizio sull'offerta: è la scomposizione del
totale.

## Quando serve

Con la bolletta in mano o aperta sul telefono, nel momento in cui la persona
la sta confrontando con quella di prima. Non in un momento di studio: in un
momento di controllo, in cui sta cercando una riga che spieghi la differenza.

## Cosa deve poter fare dopo

Indicare sulla propria bolletta **quale parte del totale dipende da quanto ha
consumato e quale no**, e dire a voce quanto vale ciascuna delle due parti.
Non «capire la bolletta»: quello non è osservabile. Questo lo è — o sa dire
quali righe non cambiano con i kWh, o non lo sa dire.

Il numero che porta via: **l'energia consumata costa 0,25 € per kWh, ma la
bolletta divisa per gli stessi kWh viene 0,49 € per kWh.** Circa il doppio, e
la differenza non è energia.

## Input

Nessun dato digitato dalla persona. Il documento è **uno solo, dichiarato,
strutturato a mano**.

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| la bolletta | `DocumentoUtente` | **fixture nuova** `fixtures/bolletta-luce-bimestrale.input.json` |
| il risultato atteso | oggetto di confronto | **fixture nuova** `fixtures/bolletta-luce-bimestrale.atteso.json` |

`provenienza: 'fixture'`. L'agente `02-data-ingest` **non è attivato** e
`src/ingest/` è vuota di proposito: qui non entra nessun PDF e nessuna foto di
bolletta.

### La fixture, per esteso

Una bolletta bimestrale della luce di un'utenza domestica residente, anonima,
luglio–agosto 2026. Il bimestre estivo non è casuale: è quello in cui il
consumo sale e la bolletta viene guardata.

`totaleDichiaratoCent` è il **totale da pagare stampato sulla bolletta**, non
un numero che ricaviamo noi: il core lo confronta con la somma delle righe e
segnala lo scarto, non lo corregge.

| `id` | `etichettaOriginale` — **così com'è scritta sulla bolletta** | `categoria` | `importoCent` |
| --- | --- | --- | --- |
| `voce-01` | `Spesa per la materia energia` | `consumo` | `4000` |
| `voce-02` | `Spesa per il trasporto e la gestione del contatore` | `canone` | `1800` |
| `voce-03` | `Spesa per oneri di sistema` | `altro` | `1000` |
| `voce-04` | `Accisa (imposta di consumo)` | `imposta` | `360` |
| `voce-05` | `IVA 10%` | `imposta` | `716` |

`totaleDichiaratoCent: 7876` · `scenario: 'bolletta'` ·
`periodoInizio: '2026-07-01'` · `periodoFine: '2026-08-31'`.

Su `voce-01`: `quantita: 160`, `unitaMisura: 'kWh'` — i kWh sono **stampati
sulla bolletta** e sono il dato che la persona ha già guardato da sola.
Su `voce-02`: `ricorrente: true` — è la parte che torna ogni bolletta.
Su `voce-05`: `aliquotaBp: 1000`, perché quel `10%` è **stampato
sull'etichetta** e quindi è un dato del documento.

`_visualizzazione` riporta gli importi nel formato italiano come compaiono sulla
carta (`78,76 €`, `160 kWh`), come già fa
`estratto-conto-trimestrale.input.json`.

> **Blocco da sciogliere, non un dettaglio: le proporzioni della fixture.**
> Gli importi di un facsimile non sono un dato «vivo» — sono i numeri di un
> documento dichiarato, non un'affermazione sul mondo — ma **il numero che la
> persona porta via sì**: «quasi metà della bolletta non è energia» è vero
> solo se le proporzioni della fixture assomigliano a quelle di una bolletta
> reale. Se le sbagliamo, la schermata è aritmeticamente corretta e
> **fattualmente fuorviante**, che è il difetto peggiore fra i due.
>
> Serve che una persona verifichi, su una bolletta domestica vera e anonima o
> sui dati pubblicati da ARERA, **due cose sole**: che la spesa per la materia
> energia stia intorno alla metà del totale, e che l'IVA sull'uso domestico
> sia al **10%** — l'aliquota su cui è costruita `voce-05`. Va dichiarato il
> periodo di riferimento, come chiede la sezione 7 del documento d'origine.
>
> **L'architettura è studiata perché questo blocco non fermi
> l'implementazione**: il core riceve il documento come *parametro* e non
> conosce nessuna costante, quindi codice e test si scrivono e passano subito
> sui numeri qui dichiarati. Se le proporzioni vanno corrette, cambiano la
> fixture e i valori attesi nei commenti del test — non una riga di logica.
> Ferma però la demo con numeri veri: finché non è verificato, i `78,76 €` di
> questa fixture sono un facsimile plausibile, non una bolletta misurata.
>
> **`oneri di sistema` finisce in `altro`, e questa è una scelta dichiarata.**
> `CategoriaVoce` non ha un valore che descriva gli oneri di sistema. Metterli
> in `imposta` sarebbe comodo e **sarebbe falso**: non sono imposte, sono
> importi destinati per legge a coprire costi del sistema elettrico. Il
> contratto porta già un `TODO(scenario): affinare la tassonomia`, e la
> tassonomia **non si tocca per far entrare una riga**: la voce va in `altro`,
> che è il valore onesto, e il fatto che la sua categoria non la descriva è un
> limite dichiarato in fondo a questa spec. Alterare la classificazione di una
> voce per renderla più ordinata è alterare il significato
> dell'informazione originale, che il progetto vieta.

## Elaborazione

Tutto in `src/core/`, puro e deterministico. **Un solo arrotondamento in tutta
la catena**, al passo 6, ed è dichiarato: tutti gli altri passi tornano esatti
perché la fixture è stata costruita con quel criterio — una bolletta i cui
numeri tornano è una bolletta su cui chi legge può rifare i conti a mano e
trovarsi.

1. **Quadratura** — `verificaQuadratura(documento)`, già esistente.
   `sommaVociCent = 7876`, `totaleDichiaratoCent = 7876`, `scartoCent = 0`,
   `quadra = true`.
2. **Peso di ogni voce sul totale**, in punti base, con la
   `pesoInBp(importoCent, totaleCent)` già esistente.
3. **Quota che dipende dal consumo**: l'importo della voce con
   `categoria: 'consumo'` → `energiaCent = 4000`.
4. **Quota che non dipende dal consumo**: `totaleCent - energiaCent`
   → `nonEnergiaCent = 3876`. È il complemento, non una seconda somma: così le
   due parti non possono che ricomporre il totale.
5. **Prezzo dell'energia per kWh**, dai due numeri stampati sulla bolletta:
   `prezzoEnergiaPerKwhCent = energiaCent / quantita` → esatto, nessun resto.
6. **Costo totale per kWh**: `costoTotalePerKwhCent = Math.round(totaleCent / quantita)`.
   **È l'unico arrotondamento**, e avviene una volta sola, alla fine.

### Verifica a mano, da riportare nei commenti del test

```
totale        4.000 + 1.800 + 1.000 + 360 + 716 = 7.876 cent  (78,76 €)
              e 7.876 e' anche il totale stampato  -> quadra

pesi sul totale, in punti base
  materia energia        4.000 x 10.000 / 7.876 = 5.079 bp -> 50,79%
  trasporto e contatore  1.800 x 10.000 / 7.876 = 2.285 bp -> 22,85%
  oneri di sistema       1.000 x 10.000 / 7.876 = 1.270 bp -> 12,70%
  accisa                   360 x 10.000 / 7.876 =   457 bp ->  4,57%
  IVA 10%                  716 x 10.000 / 7.876 =   909 bp ->  9,09%
                                          somma = 10.000 bp -> 100,00%

le due parti
  dipende dal consumo    4.000 cent (40,00 €)  -> 5.079 bp -> 50,79%
  non dipende            7.876 - 4.000 = 3.876 -> 4.921 bp -> 49,21%
                                5.079 + 4.921  = 10.000 bp -> 100,00%

per kWh, su 160 kWh stampati sulla bolletta
  energia      4.000 / 160 = 25 cent/kWh esatti        (0,25 €)
  bolletta     7.876 / 160 = 49,225 -> 49 cent/kWh     (0,49 €)

controllo dell'IVA stampata sull'etichetta
  base imponibile  4.000 + 1.800 + 1.000 + 360 = 7.160 cent
  10% di 7.160                                 =   716 cent
  e 716 e' esattamente la voce-05 del documento
```

**Tre controlli incrociati che il test deve asserire**, perché sono ciò che
rende il risultato verificabile invece che plausibile:

1. i cinque pesi sommano **esattamente** a 10000 bp;
2. il peso della quota da consumo e quello della quota non da consumo sommano
   **esattamente** a 10000 bp;
3. il 10% **stampato sull'etichetta** di `voce-05`, applicato alla somma delle
   altre quattro voci, restituisce **esattamente** l'importo di `voce-05`
   (716). È il più utile dei tre: dice che la percentuale scritta sul
   documento e gli importi del documento raccontano la stessa cosa.

## Output

Una schermata sola, un concetto solo: **quanto di questo totale non è
l'energia che ho usato.**

Struttura, evidenziazione, apertura di una riga e riepilogo: **come definiti
in `04`**. Qui solo ciò che cambia.

### Il facsimile

Le cinque righe della sintesi, nell'ordine della fixture: `etichettaOriginale`
a sinistra **così com'è scritta**, importo a destra, allineato a destra, cifre
tabulari, euro accanto al valore. In cima, fuori dall'elenco, il **totale da
pagare** — `78,76 €` — che è il numero più grande della schermata, e accanto i
`160 kWh`, perché è il numero che la persona ha già guardato.

**Le cinque righe restano tutte visibili sempre.** Quattro sono apribili — la
materia energia, il trasporto e la gestione del contatore, gli oneri di
sistema, le due imposte prese insieme — e sono quelle che generano il dubbio.

### La riga in più che `04` non ha: le due parti del totale

Sotto il facsimile, **una sola barra** divisa in due, con le due cifre scritte
sopra e non solo disegnate:

| Parte | Valore |
| --- | --- |
| dipende da quanto hai consumato | `40,00 €` · `50,79%` |
| non dipende da quanto hai consumato | `38,76 €` · `49,21%` |

La barra non è l'unico modo di leggere il dato: le due cifre stanno scritte
accanto, perché un rapporto disegnato non si legge da lontano e non si legge
con uno screen reader.

### Bozze delle stringhe

Vanno in `src/ui/`, **non nella fixture**: la fixture contiene le parole della
bolletta, il registro contiene le nostre. `testi.ts` è a 114 righe e il limite
è 150, quindi le stringhe stanno in un file affiancato `testiBolletta.ts` che
entra in `STRINGHE_UTENTE` con lo spread — lo stesso schema già usato da
`testiSimulazione.ts`. Il registro da scandire resta un oggetto solo.

Queste sono **bozze**: le scrive `ui-builder` e le rilegge
`guardrail-officer` prima del merge, contro il lessico **e** contro
`.claude/rules/scrittura-e-accessibilita.md`.

- **Spesa per la materia energia** — «Questa è l'unica riga che cambia davvero
  se accendi il condizionatore in meno: è l'elettricità che è passata dal tuo
  contatore. Sono 40,00 € per 160 kWh, cioè 0,25 € ogni kWh. Un kWh è quanto
  consuma un forno acceso per circa un'ora.»
- **Spesa per il trasporto e la gestione del contatore** — «I fili che portano
  la corrente fino a casa, e chi legge il contatore, si pagano anche nei mesi
  in cui usi poco: è come l'abbonamento del treno, che costa uguale se lo
  prendi dieci volte o due. Sono 18,00 € su 78,76 €, cioè 22,85 € ogni 100 €
  di bolletta.»
- **Spesa per oneri di sistema** — «Sotto questo nome ci sono costi che per
  legge vengono divisi fra tutte le bollette d'Italia — per esempio gli
  incentivi alle fonti rinnovabili e la chiusura delle vecchie centrali
  nucleari. Non dipendono da quanto consumi tu e non vanno al tuo fornitore.
  Sono 10,00 €, cioè 12,70 € ogni 100 € di bolletta.»
- **Accisa e IVA** — «Le due tasse sull'energia. L'accisa è una cifra fissa per
  ogni kWh, l'IVA è il 10% di tutto il resto messo insieme. Sono 3,60 € e
  7,16 €: insieme 10,76 €, cioè 13,66 € ogni 100 € di bolletta.»
- **Le due parti del totale** — «Hai consumato 160 kWh. L'energia costa 0,25 €
  per kWh, ma la bolletta intera divisa per quegli stessi 160 kWh viene 0,49 €
  per kWh: quasi il doppio. La differenza — 38,76 € — è la parte che non
  cambia con quanto accendi.»

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`.

### I quattro stati obbligatori

Gli stati **vuoto** e **in caricamento** sono quelli di `04`: nessuna voce
ancora aperta e riquadro del riepilogo già presente; fixture importata
staticamente, calcolo immediato, nessuna rotellina, nessuno spostamento del
layout all'apertura di una riga. I due che qui sono diversi:

3. **Errore** — il caso che può davvero succedere è **la quadratura che non
   torna**: la somma delle cinque righe diversa dal totale stampato. Succede
   sulle bollette vere, dove la sintesi è arrotondata al centesimo e il
   dettaglio no. La schermata lo dice in linguaggio umano, mostra lo scarto, e
   **non corregge niente**: una bolletta che non torna è un'informazione, non
   un guasto da nascondere.
4. **Dati lunghi o numerosi** — `Spesa per il trasporto e la gestione del
   contatore` è lunga trentaquattro caratteri e deve andare a capo senza
   rompere la griglia né staccarsi dal suo importo. Il layout deve reggere il
   caso vero della **bolletta del gas a conguaglio**: venti righe e un totale
   a quattro cifre in euro.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/letturaBolletta.test.ts`, con i
  valori della verifica a mano scritti nei commenti accanto alle asserzioni, e
  i tre controlli incrociati. Copre anche il documento che **non quadra**
  (`totaleDichiaratoCent` alterato di 1 cent: `scartoCent` deve valere 1 e
  `quadra` deve essere `false`), la bolletta **senza voce di consumo**
  (`energiaCent = 0`, `nonEnergiaCent = totaleCent`: il caso del conguaglio a
  zero consumi, che non deve dividere per zero) e `quantita` assente o zero
  (il costo per kWh **non si mostra**, non si mostra `Infinity`).
- **Test di accettazione** —
  `tests/accettazione/05-guida-bolletta-luce-gas.test.ts`, scritto dal
  `tester` dalla specifica, non dal codice.
- **Lessico** — `tests/lessico-ui.test.ts` scandisce già sia il registro sia
  le fixture: le stringhe nuove e le etichette della bolletta ci passano
  dentro senza aggiungere niente. Questa schermata è **sorvegliata più delle
  altre**: «perché la bolletta è alta» confina con «cambia offerta», e
  `cambia fornitore` · `convien*` · `miglior*` sono già nel lessico di blocco.
- **In demo, dieci secondi**: si tocca `Spesa per oneri di sistema`, compare
  `12,70 € ogni 100 € di bolletta` e la frase che dice che quella riga non
  dipende dai kWh; poi si guarda la barra in fondo: `40,00 €` da una parte,
  `38,76 €` dall'altra, quasi metà e metà.

## Cosa questa funzionalità NON fa

- **Non dice niente sull'offerta né sul fornitore.** Nessun confronto fra
  tariffe, nessun accenno al mercato libero o tutelato, nessun «quanto
  potresti pagare altrove». È il confine che questa funzionalità rischia di
  più, perché la domanda successiva — «e allora che faccio?» — arriva subito.
  La schermata dice **da dove viene ogni numero di questa bolletta** e si
  ferma lì. Il lessico di blocco copre già le formulazioni più probabili, ma
  il lessico prende le parole, non le intenzioni: la rilettura di
  `guardrail-officer` serve proprio qui.
- **Non dice come consumare meno.** Nessun elenco di accorgimenti, nessuna
  indicazione sugli elettrodomestici, nessuna fascia oraria da preferire.
  Spiegare che la quota di trasporto non cambia con i kWh è informazione;
  dire che cosa fare di conseguenza non lo è.
- **Non riscrive le etichette del documento.** `etichettaOriginale` compare
  identica, sempre: `Spesa per oneri di sistema` resta scritto così anche se
  non descrive niente. La spiegazione si mette **accanto**, mai al posto —
  altrimenti chi confronta lo schermo con la carta non ritrova la riga, e la
  bolletta vera diventa meno leggibile di prima, non più.
- **Non nasconde le voci che non spiega** e non arrotonda via le righe
  piccole. I 3,60 € di accisa restano una riga: una voce di costo che esiste
  non si semplifica via, perché la somma delle righe deve continuare a fare il
  totale stampato.
- **Non ricalcola gli importi.** Gli importi sono quelli **stampati sulla
  bolletta**; il core calcola soltanto i rapporti fra loro — pesi, le due
  parti, il costo per kWh, la quadratura. Ricostruire la spesa per materia
  energia dalle componenti tariffarie direbbe implicitamente «il numero sulla
  tua bolletta dovrebbe essere questo», che è la consulenza che il prodotto
  non fa.
- **Non rimanda al simulatore energia/spese: quel simulatore non esiste.**
  Vedi «Il ponte al simulatore» qui sotto. Nessun collegamento a una pagina
  che non c'è: un ponte verso il vuoto è una promessa rotta, e `04` ha già
  preso la stessa decisione per il suo.
- **Non legge una bolletta vera.** Nessun caricamento di PDF, nessuna foto,
  nessun riconoscimento del testo: `02-data-ingest` non è attivato e
  `src/ingest/` è vuota di proposito. La bolletta è una, anonima e dichiarata
  nella fixture. Chi ha in mano la propria confronta le righe con l'occhio —
  ed è anche il motivo per cui le etichette devono restare identiche.
- **Non è la bolletta di chi legge.** I numeri sono quelli della fixture: chi
  consuma altro vedrà importi diversi dai suoi, e la schermata lo dice invece
  di lasciarlo intuire.
- **Non copre il gas.** Il titolo del task dice «luce/gas», la fixture è
  **solo la luce**. Il gas ha un'unità di misura diversa (Smc), un'IVA a due
  aliquote e una componente di trasporto costruita in un altro modo: farlo
  entrare nella stessa fixture significherebbe o semplificarlo — cioè
  alterarlo — o raddoppiare il documento su una schermata che deve spiegare
  **un concetto solo**. Il gas è una seconda fixture e una seconda schermata,
  cioè un altro task: qui viene dichiarato, non abbozzato.
- **Non chiede e non conserva niente.** Nessun campo da compilare, nessun dato
  personale, nessun POD, nessun salvataggio. Il riepilogo vive nella pagina:
  uscendo e rientrando riparte vuoto, e la schermata non finge il contrario.
- **Non fa domande e non assegna punteggi.** Il riepilogo è un promemoria. La
  misura della comprensione è di `src/assessment/`, un'altra directory e un
  altro agente.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | `DocumentoUtente`, `VoceDocumento`, `CategoriaVoce`, `Provenienza`, `QuadraturaTotale`, `Scenario`. **Tutti esistono già**, e `'bolletta'` è già un valore di `Scenario`: **questa funzionalità non ha bisogno di nessuna modifica a `types/`** — l'unica delle tre guide-documento. `VoceDocumento` porta già `quantita` e `unitaMisura`, che qui reggono i kWh, e `aliquotaBp`, che regge il `10%` stampato sull'etichetta dell'IVA. `LetturaCalcolata` **non** viene usata: porta una `proiezioneAnnuaCent` che su un bimestre sarebbe una moltiplicazione per sei presentata come un dato annuo, cioè un numero che il documento non dice. I tipi dell'uscita (`LetturaBolletta`, le due quote, il costo per kWh) nascono **dentro `src/core/`**, di proprietà di core-engine. Il tipo condiviso che descrive **quali righe sono apribili e con quale spiegazione** non è un contratto di dominio ma di presentazione: vive in `src/ui/`, di proprietà di ui-builder, e nasce con `04` |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root, quindi i contratti si possono ancora estendere. **Irrilevante qui: questa funzionalità non modifica `types/`**, quindi non richiede l'architetto per i contratti. Resta vero in generale che una modifica a `types/contracts.ts` è **dell'architetto**, non dell'agente incaricato, anche a contratti non congelati |
| **Agente incaricato** | **`03-ui-builder`** (la guida è una schermata, ed è il grosso del lavoro), con **`01-core-engine`** per `letturaBolletta.ts` e il suo test, **`00-architect`** per le due fixture, **`04-guardrail-officer`** per la rilettura delle stringhe e il test di accettazione. **Ordine obbligato**: architect (fixture) → core-engine → ui-builder → guardrail-officer. Non è parallelizzabile al proprio interno |
| **Directory toccate** | **4 — quindi più di un agente, e non è un dettaglio organizzativo.** `fixtures/` (`bolletta-luce-bimestrale.input.json`, `bolletta-luce-bimestrale.atteso.json` — **architetto**) · `src/core/` (`letturaBolletta.ts`, `index.ts` per l'export, `__tests__/letturaBolletta.test.ts` — **core-engine**) · `src/ui/` (`PaginaBolletta.tsx`, `BarraDueQuote.tsx`, `testiBolletta.ts`, `testi.ts` per lo spread, `rotte.ts`, `App.tsx`, `stiliBolletta.css` — **ui-builder**) · `tests/` (`accettazione/05-guida-bolletta-luce-gas.test.ts` — **guardrail-officer**). `types/` **non** è toccata |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/05-bolletta-due-quote.png` — la riga `Spesa per oneri di sistema` **aperta** e, nella stessa inquadratura, la barra delle due quote con `40,00 €` e `38,76 €` scritti a fianco. È lo scatto più dimostrativo del sito: una schermata sola in cui si vede insieme il documento vero, la spiegazione della riga toccata e il numero che risponde alla domanda — e sono gli stessi numeri che il test asserisce, quindi la slide mostra ciò che il test dimostra. Più `05-bolletta-mobile.png` per il caso stretto, che su una guida-documento è il caso che rompe la griglia |

### Il ponte al simulatore — blocco dichiarato, non dettaglio

La sezione 3 del documento d'origine prescrive che **ogni** guida-documento
rimandi al simulatore collegato, e per la bolletta indica «il simulatore
energia/spese».

**Quel simulatore non esiste e non è in backlog.** La sezione 4 del documento
d'origine definisce quattro simulatori — valore dei risparmi (`07`), netto in
busta (`08`), fondo di emergenza (`09`), rata del mutuo (`10`) — e **nessuno
dei quattro riguarda l'energia o le spese di casa**. Il backlog rispecchia
questa lacuna: fra i task `02`–`13` non c'è un simulatore bollette.

Non è una dipendenza in attesa: è un **destinatario mancante**. Le
conseguenze, esplicite:

1. **`05` si consegna senza ponte.** Nessun collegamento, nessun bottone
   disattivato, nessun «presto disponibile»: una porta che non si apre è
   peggio di una parete. È la stessa decisione già presa in `04` per il ponte
   verso `08`.
2. **La scelta non è dell'agente che implementa.** Aprire un task per un
   simulatore energia è una decisione di perimetro, del `pm` e
   dell'architetto. Se quel task nasce e viene realizzato, il ponte da qui è
   **una riga in `rotte.ts`**: la schermata è già costruita per ospitarlo.
3. **`09` non è un sostituto.** Il simulatore del fondo di emergenza chiede le
   spese fisse mensili, e una bolletta bimestrale è un ingresso plausibile.
   Ma agganciare `05` a `09` significherebbe portare chi ha chiesto «perché è
   alta» dentro «quanto resisto senza stipendio»: un'altra domanda. Il ponte
   si fa verso il simulatore che risponde alla stessa domanda, o non si fa.

### Conflitti di pianificazione, da sapere prima di `/implementa`

- **`05` va dopo `04`, non in parallelo.** Entrambe occupano `src/ui/` e
  `tests/`, e soprattutto `05` **riusa i componenti che `04` produce**. In
  parallelo divergerebbero: in fila, `05` è una fixture più qualche stringa.
  È una ragione per non parallelizzare, non un problema.
- **`fixtures/` e `src/core/` sono libere adesso.** Le due fixture e
  `letturaBolletta.ts` si possono scrivere mentre `04` occupa `src/ui/`:
  quando `04` libera la schermata, la parte di calcolo è già verde.
- **`06` (730) non può girare insieme a `05`**: stesse directory, e stessa
  meccanica ereditata da `04`.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-15, dalla sola specifica.
> La fase 2 — rilettura del codice e dei test, esecuzione dei passi qui sotto
> e riscrittura al presente sotto «Verificato» — non è ancora stata fatta.

### Cosa farà

Aprendo questa guida comparirà, riga per riga, la bolletta della luce così
come arriva davvero: cinque voci con il nome esatto stampato sul documento, e
in cima il totale da pagare — **78,76 €**. Toccando una voce comparirà,
accanto ad essa, quanto pesa sul totale e se dipende o no da quanto è stato
consumato. In fondo, una barra dividerà il totale in due parti — quella
legata al consumo e quella che resta uguale comunque — e dirà, in chiaro, che
l'energia costa **0,25 €** per ogni kWh mentre l'intera bolletta, divisa per
gli stessi kWh, viene **0,49 €**: quasi il doppio.

### Per chi

Chi ha appena ricevuto la bolletta della luce e trova un totale più alto di
quanto si aspettava, senza aver cambiato niente in casa: ha già fatto
l'unica verifica che sa fare — ha guardato i kWh — e i kWh non sono
aumentati abbastanza da spiegare la differenza. Le servirà nel momento in
cui la sta confrontando con la bolletta di prima, in mano o sullo schermo
del telefono, mentre cerca una riga che spieghi lo scarto — non in un
momento di studio.

### Come si proverà

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non
dà il risultato atteso, la funzionalità non è finita. I comandi vanno
eseguiti da `app/`.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`, che esegue
   `node scripts/prepara.mjs`). Serve solo la prima volta.
   *Risultato atteso:* lo script dirà che l'ambiente è pronto, oppure
   elencherà i passi che ha installato, e il suo controllo di salute —
   `tsc --noEmit` e poi `npm test` — finirà senza errori.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue
   `node scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un
   processo che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo
   `http://localhost:5173`.

3. **Raggiungere la guida dalla domanda vera, non da un indirizzo scritto a
   mano.** Aprire quell'indirizzo, entrare nell'area «Il costo della vita» e
   aprire la domanda già scritta lì oggi, «Perché la bolletta è così alta
   questo mese?» — segnata, prima di questa funzionalità, come «in arrivo»
   nel catalogo delle diciotto domande, senza un percorso vero.
   *Risultato atteso:* la domanda porterà a una schermata vera, non a un
   avviso «presto disponibile»: la guida alla bolletta della luce.

4. **Il facsimile, con il totale in cima.** Guardare la parte alta della
   schermata, poi scorrere le cinque righe sotto.
   *Risultato atteso:* il numero più grande di tutta la schermata sarà il
   totale da pagare, **78,76 €**, con accanto **160 kWh** — il dato che la
   persona ha già controllato da sola. Sotto, cinque righe nell'ordine della
   bolletta, ciascuna con l'etichetta **esattamente come stampata**: «Spesa
   per la materia energia», «Spesa per il trasporto e la gestione del
   contatore», «Spesa per oneri di sistema», «Accisa (imposta di consumo)»,
   «IVA 10%». Nessuna sarà riscritta, nessuna mancherà — nemmeno la più
   piccola, i 3,60 € dell'accisa — e sommandole a mano si otterrà lo stesso
   78,76 € del totale, senza alcun avviso di scarto.

5. **Aprire una voce.** Toccare o cliccare «Spesa per oneri di sistema», poi
   provare a farlo anche con un'altra riga.
   *Risultato atteso:* sotto la riga toccata — **accanto** all'etichetta
   originale, mai al posto — comparirà una spiegazione con un numero e il
   suo paragone: qualcosa come «12,70 € ogni 100 € di bolletta», più la
   frase che dice che quella spesa non dipende da quanto si è consumato. La
   spiegazione resterà visibile finché non se ne apre un'altra o non si
   richiude la stessa riga: non scomparirà da sola né al passaggio del
   mouse.

6. **Il numero che risponde alla domanda.** Guardare in fondo alla
   schermata, dove le due parti del totale sono scritte accanto a una
   barra.
   *Risultato atteso:* si leggeranno due cifre, non solo una barra
   disegnata: **40,00 € · 50,79%** per la parte che dipende da quanto
   consumato, **38,76 € · 49,21%** per quella che non ne dipende. Le due
   percentuali sommeranno a 100%.

7. **Il paragone sul prezzo dell'energia — il numero che la persona porta
   via.** Cercare, nella spiegazione della materia energia o accanto alla
   barra, il confronto fra il prezzo dell'energia e il prezzo dell'intera
   bolletta.
   *Risultato atteso:* si leggerà che l'energia costa **0,25 €** per ogni
   kWh, ma l'intera bolletta, divisa per gli stessi 160 kWh, viene
   **0,49 €** — quasi il doppio. I due numeri nasceranno dai valori già
   stampati sulla bolletta — i 40,00 € della materia energia, i 78,76 € del
   totale, i 160 kWh — e non da un prezzo dell'energia preso da altrove.

8. **Nessun accenno all'offerta o al fornitore.** Rileggere tutta la
   schermata: facsimile, ogni spiegazione aperta una alla volta, la barra
   delle due parti.
   *Risultato atteso:* in nessun punto comparirà un confronto fra tariffe,
   una parola come «conviene» o «cambia fornitore», né un'indicazione su
   che cosa fare. La schermata dirà da dove viene ogni euro di questa
   bolletta, e si fermerà lì.

9. **Da tastiera, senza mouse.** Premere Tab dall'inizio della pagina.
   *Risultato atteso:* il fuoco si sposterà sulle righe apribili nello
   stesso ordine in cui sono stampate, con un contorno netto sempre
   visibile, e il testo resterà leggibile — bianco pieno su fondo scuro,
   mai una tonalità sbiadita. Invio e anche la barra spaziatrice apriranno
   la riga con il fuoco; nessuna informazione di questa schermata sarà
   leggibile solo passando il mouse sopra qualcosa, senza cliccare o
   premere un tasto.

10. **A finestra stretta, come un telefono.** Restringere la finestra sotto
    i 768 px di larghezza e rifare i passi 4 e 5.
    *Risultato atteso:* nessuna barra di scorrimento orizzontale;
    l'etichetta più lunga — «Spesa per il trasporto e la gestione del
    contatore», trentaquattro caratteri — andrà a capo restando comunque
    accanto al proprio importo; nessuna scritta scenderà sotto i 16 px;
    ogni riga apribile resterà un bersaglio di almeno 44×44 px, anche
    quando il testo è corto.

11. **Vuoto e in caricamento — non devono far saltare il layout.**
    Osservare la schermata nell'istante esatto in cui si apre.
    *Risultato atteso:* nessuna rotellina che gira e sparisce. Il documento
    è una fixture importata staticamente, quindi il facsimile e il
    riepilogo delle due quote compariranno già pronti, con le cinque righe
    chiuse: nessuno scatto del layout un istante dopo l'apertura.

12. **Errore — la quadratura che non torna, verificabile solo in parte con
    questa bolletta.** Controllare se compare un avviso di scarto.
    *Risultato atteso:* nessuno, perché questa bolletta **quadra** — la
    somma delle cinque righe è esattamente il totale stampato. È il
    comportamento corretto per un documento che torna, ma **non mette alla
    prova** il caso in cui i conti non tornano: quel comportamento
    (l'avviso mostrato in linguaggio umano, senza correggere nulla) non è
    raggiungibile cliccando su questa fixture, e andrà verificato in fase 2
    leggendo il caso dedicato in
    `src/core/__tests__/letturaBolletta.test.ts` — un documento con il
    totale alterato di un centesimo. Se in fase 2 quel test non lo copre, è
    una divergenza da segnalare, non un dato da inventare per poterlo
    mostrare.

13. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la schermata.
    *Risultato atteso:* la build finirà senza errori, e rifacendo i passi
    3-8 si leggerà lo stesso identico contenuto — senza che parta una sola
    richiesta fuori dal computer: nessun prezzo dell'energia scaricato da
    nessuna parte, perché la bolletta e tutti i suoi numeri sono scritti
    nel codice, non recuperati da una fonte esterna.

### Limiti previsti

- **Non dirà nulla sull'offerta né sul fornitore.** Nessun confronto fra
  tariffe, nessun accenno al mercato libero o tutelato, nessuna indicazione
  su dove costerebbe meno. È il limite più delicato: la domanda «e allora
  che faccio?» arriverà naturale subito dopo la scomposizione, e la
  risposta non ci sarà.
- **Non dirà come consumare meno.** Nessun elenco di accorgimenti, nessuna
  fascia oraria da preferire, nessun elettrodomestico da evitare: spiegare
  da dove viene un costo è informazione, dire che cosa farne non lo è.
- **Non riscriverà le etichette della bolletta.** Resteranno identiche a
  come sono stampate, anche quando non descrivono niente di riconoscibile
  («Spesa per oneri di sistema»): la spiegazione si affiancherà, non le
  sostituirà.
- **Non nasconderà né arrotonderà via le voci piccole.** Anche i 3,60 €
  dell'accisa resteranno una riga a sé, visibile quanto le altre.
- **Non ricalcolerà gli importi della bolletta.** Userà solo i numeri già
  stampati, per calcolarne i rapporti — pesi, le due quote, il prezzo per
  kWh, la quadratura — mai per rifare il conto al posto del documento.
- **Non rimanderà a un simulatore energia/spese.** Quel simulatore non
  esiste e non è in programma: nessun collegamento verso una pagina che
  non c'è.
- **Non leggerà una bolletta vera.** Nessun caricamento di PDF o foto,
  nessun riconoscimento del testo: la bolletta sarà una sola, anonima,
  sempre uguale.
- **Non sarà la bolletta di chi guarda.** Chi consuma diversamente vedrà
  comunque questi stessi numeri, e la schermata lo dirà invece di
  lasciarlo intuire.
- **Non coprirà il gas.** Solo la luce: il gas ha un'unità di misura
  diversa e una struttura diversa, ed è un lavoro a parte — non abbozzato
  qui.
- **Non chiederà né conserverà alcun dato.** Nessun campo da compilare,
  nessun salvataggio: uscendo e rientrando, la schermata ripartirà come la
  prima volta.
- **Non farà domande né assegnerà punteggi.** Nessun quiz, nessuna misura
  della comprensione: quella è un'altra parte del sito.

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

> **Non ancora compilata.** Il codice di questa funzionalità non è ancora
> stato scritto: non c'è niente da verificare, e scrivere qui qualcosa
> significherebbe dichiarare fatto ciò che nessuno ha controllato.
>
> Questa sezione si riempie in **fase 2**, al termine di `/implementa`,
> aprendo `src/core/letturaBolletta.ts` e i file di `src/ui/` che
> costruiscono la guida, leggendo
> `src/core/__tests__/letturaBolletta.test.ts` e
> `tests/accettazione/05-guida-bolletta-luce-gas.test.ts`, e **rieseguendo
> davvero** i tredici passi scritti sopra. Conterrà «Cosa fa», «Come si
> prova», «Limiti» e «Divergenze fra previsto e realizzato», tutto al
> presente, e solo allora lo stato passerà a `implementato`.
>
> Finché questa sezione resta vuota, `/verifica` non accetta la
> funzionalità come `implementato`.
