# 06 — «Sul 730 c'è scritto che mi tornano 665 €: da dove esce quel numero?»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «01-core-engine»,
> «00-architect» per una riga di `types/` e le fixture
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 3 «Guide interattive ai documenti quotidiani», documento 3.
> Task di backlog: `06`.
>
> ## ⚠ Estensione del brief, dichiarata e non fatta passare in silenzio
>
> `docs/brief.md` ammette **quattro scenari**: lettura di una bolletta,
> lettura di un estratto conto, budget personale, simulazione di risparmio.
> **La dichiarazione dei redditi non è fra questi**, e nemmeno la busta paga
> (task `04`, stessa situazione, stessa dichiarazione in testa a quella spec).
>
> Perché resta legittima:
>
> - sta dentro le macrocategorie di `CLAUDE.md`, area «Il lavoro», voce
>   **«pressione fiscale sul reddito»**;
> - risponde a una domanda già mappata nella sezione 1 del documento
>   d'origine: «Quanto mi tolgono davvero le tasse sullo stipendio?»;
> - il brief dichiara esplicitamente che **«l'idea non è ancora congelata»**,
>   e i contratti non sono congelati (`.contracts-frozen` non esiste nella
>   root).
>
> **Chi approva questa spec approva anche l'estensione del perimetro.** Se
> l'idea viene congelata sui quattro scenari del brief, questo task decade:
> non va implementato «tanto è quasi dentro». La decisione è dell'architetto,
> e va annotata in `docs/decisioni.md`.
>
> ## ⚠ Il confine più delicato del sito
>
> Spiegare **che cosa significa** una voce del 730 è informazione. Dire a
> qualcuno **che cosa metterci** è consulenza fiscale, che il progetto vieta.
> Il confine è dichiarato per esteso nella sezione «Cosa questa funzionalità
> NON fa», che su questa funzionalità va letta **prima** dell'«Output».
>
> **La meccanica non è ridichiarata qui.** È definita una volta nella spec
> `04` e questa la riusa: vedi «La meccanica condivisa» nella spec `05`, dove
> la scelta è motivata per tutte e tre. Il **contratto di accessibilità** è
> ripetuto qui sotto per intero, perché un vincolo che si legge solo aprendo
> un altro file è un vincolo che viene saltato.
>
> **Richiede una modifica a `types/`**: una riga sola, additiva — il valore
> `'dichiarazione-730'` manca nell'unione `Scenario`. La riga è
> dell'**architetto**, non di chi implementa.
>
> **Due scostamenti dal documento d'origine**, spiegati in «Cosa questa
> funzionalità NON fa»: nessuna lettura di un 730 vero, e nessun calcolo
> dell'imposta.

## Il contratto di accessibilità — ripetuto, non riferito

`.claude/rules/design.md` vieta **qualunque informazione disponibile solo al
passaggio del mouse**: al proiettore e su un telefono il passaggio del mouse
non esiste, e una guida a zone cliccabili è il posto in cui questo errore si
commette per distrazione.

| Requisito | Come si realizza |
| --- | --- |
| **Niente di solo-hover** | l'evidenziazione e la spiegazione arrivano dal **clic o dal tocco**, e **restano** finché non si apre un'altra riga. Il passaggio del mouse può cambiare il fondo della riga, ma **non può essere l'unico modo** di vedere un dato |
| **Tastiera** | ogni riga apribile è un **`<button>` vero**: si raggiunge con `Tab`, si apre con `Invio` **e** con `Spazio`, porta `aria-expanded` che passa a `true`, e la spiegazione è collegata con `aria-controls` |
| **Focus visibile** | contorno netto sulla riga che ha il focus, mai `outline: none` senza un sostituto altrettanto evidente |
| **Ordine di tabulazione** | uguale all'ordine di lettura del modulo, dall'alto in basso, **rigo per rigo** |
| **Area cliccabile** | **minimo 44×44 px** per ogni riga apribile, anche quando l'importo è corto: è l'intera riga a essere il bersaglio, non il solo testo |
| **Nessun gesto obbligatorio** | nessuno swipe, nessun pinch, nessun trascinamento sul facsimile — che qui conta doppio, perché un modulo fiscale invita a ingrandire per leggere |
| **Nessun limite di tempo** | la spiegazione non si chiude da sola, la schermata non si resetta |
| **Icone con testo** | nessuna icona da sola: il segno di «apribile» ha accanto la sua parola |

## Per chi

Una persona dipendente che ogni anno riceve il 730 **già compilato**. Non lo
compila: lo guarda, cerca l'ultima riga, vede una cifra con scritto
«rimborso», e la accetta senza sapere da dove venga. Non ha idea se quel
numero sia grande o piccolo, giusto o sbagliato, e non ha modo di verificarlo:
il modulo è fatto di righi numerati, sigle e rimandi ad altri righi.

Due cose la bloccano, e sono diverse fra loro:

- **non sa che quel rimborso è una restituzione**, non un regalo e non un
  premio: pensa che lo Stato «le dia» dei soldi, e quindi non capisce perché
  l'anno scorso fosse un'altra cifra;
- **non collega il 730 alla busta paga**, cioè non sa che le righe `IRPEF` che
  le vengono trattenute ogni mese sono esattamente i soldi di cui una parte
  torna indietro qui.

È la persona del task `04`: **la fixture di questa funzionalità è l'anno dello
stesso cedolino anonimo** — dodici mesi da 2.500,00 € di lordo. Non è un
vezzo: è ciò che permette di mostrare i due documenti uno dopo l'altro e far
vedere che i numeri si tengono.

## Quando serve

Fra aprile e luglio, con il 730 precompilato aperto e la sensazione che
bisogni «solo confermare». È il momento in cui la persona ha davanti
un'informazione sul proprio anno di lavoro e la sta per chiudere senza
leggerla.

## Cosa deve poter fare dopo

Dire **perché** il rimborso è di quella cifra e non di un'altra: indicare le
righe di spesa che l'hanno prodotto e dire quanto torna di ogni cento euro
spesi. Non «capire il 730»: quello non è osservabile. Questo lo è — o sa
nominare le righe e la percentuale, o non le sa nominare.

Il numero che porta via: **su ogni 100 € di queste spese, ne tornano 19,00 €.**
E la sua conseguenza, che è la parte che sorprende: **gli altri 81,00 € li ha
pagati lei.**

## Input

Nessun dato digitato dalla persona. Il documento è **uno solo, dichiarato,
strutturato a mano**.

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| il 730 | `DocumentoUtente` | **fixture nuova** `fixtures/dichiarazione-730-annuale.input.json` |
| il risultato atteso | oggetto di confronto | **fixture nuova** `fixtures/dichiarazione-730-annuale.atteso.json` |

`provenienza: 'fixture'`. L'agente `02-data-ingest` **non è attivato** e
`src/ingest/` è vuota di proposito: qui non entra nessun PDF, nessuna
credenziale, nessun collegamento all'Agenzia delle Entrate — che sarebbe
comunque una chiamata esterna, vietata a runtime.

### La fixture, per esteso

Il **quadro E** di un 730 precompilato, anno d'imposta 2026, dipendente
privato anonimo: l'elenco delle spese per cui spetta la detrazione del 19%.

`totaleDichiaratoCent` è il **totale degli oneri stampato sul modulo**, non un
numero che ricaviamo noi: il core lo confronta con la somma dei righi e
segnala lo scarto, non lo corregge.

| `id` | `etichettaOriginale` — **così com'è scritta sul modulo** | `categoria` | `importoCent` | `aliquotaBp` |
| --- | --- | --- | --- | --- |
| `voce-01` | `Interessi passivi su mutuo ipotecario - abitazione principale` | `altro` | `200000` | `1900` |
| `voce-02` | `Spese sanitarie (al netto della franchigia di 129,11)` | `altro` | `100000` | `1900` |
| `voce-03` | `Spese di istruzione - iscrizione scolastica` | `altro` | `50000` | `1900` |

`totaleDichiaratoCent: 350000` · `scenario: 'dichiarazione-730'` ·
`periodoInizio: '2026-01-01'` · `periodoFine: '2026-12-31'`.

`metadati` — i numeri che stanno **sul modulo** ma non sono righi di spesa,
come già fa `estratto-conto-trimestrale.input.json` con `saldoFinale`:

| Chiave | Valore | Che cos'è |
| --- | --- | --- |
| `intestazione` | `Modello 730 precompilato - anno d'imposta 2026` | |
| `redditoComplessivo` | `27.243,00 €` | lordo annuo meno contributi: `30.000,00 − 2.757,00` |
| `ritenuteIrpef` | `4.683,00 €` | l'IRPEF già trattenuta nei dodici cedolini: `390,25 × 12` |
| `rimborsoSpettante` | `665,00 €` | il risultato stampato sul prospetto di liquidazione |

`_visualizzazione` riporta gli stessi importi nel formato italiano come
compaiono sulla carta.

> **Blocco da sciogliere, non un dettaglio: i due parametri di legge.**
> Gli importi delle spese sono i numeri di un documento dichiarato, e quelli
> possono essere quello che vogliamo. **Due numeri di questa fixture non
> sono nostri**: l'aliquota di detrazione del **19%** e la franchigia
> sanitaria di **129,11 €**. Sono parametri di legge (art. 15 del TUIR), e
> compaiono **a schermo, scritti nelle parole della persona**: se sono
> sbagliati o superati, la schermata dice a qualcuno una cosa falsa sulle
> proprie tasse — che su questo documento non è un difetto di presentazione.
>
> Serve che una persona li verifichi sulla fonte indicata dalla sezione 7 del
> documento d'origine — **Agenzia delle Entrate**, aggiornamento **annuale**,
> legato alla Legge di Bilancio — e dichiari **l'anno d'imposta** a cui si
> riferiscono. L'anno va scritto **accanto ai numeri a schermo**, non in una
> nota: un 730 è un documento datato, e una detrazione giusta per un anno
> sbagliato è una detrazione sbagliata.
>
> **L'architettura è studiata perché questo blocco non fermi
> l'implementazione**: il 19% entra nel core come `aliquotaBp` **della voce**,
> cioè come dato del documento, e non come costante scritta nel codice. La
> franchigia non entra affatto nel calcolo — è già sottratta nella
> `etichettaOriginale`, come sul modulo vero. Quindi codice e test si scrivono
> e passano subito. Ferma però la demo con numeri veri, e su questa
> funzionalità è il blocco più serio delle tre guide.
>
> **Perché le tre voci hanno `categoria: 'altro'`, e perché è una scelta
> dichiarata.** `CategoriaVoce` non ha un valore per «onere detraibile».
> Metterle in `imposta` sarebbe comodo e **sarebbe il contrario del vero**:
> non sono imposte pagate, sono spese su cui si recupera imposta. La
> tassonomia porta già un `TODO(scenario): affinare la tassonomia`, e **non si
> tocca per far entrare tre righi**: le voci vanno in `altro`, che è il valore
> onesto, e il fatto che la categoria non le descriva è un limite dichiarato
> in fondo a questa spec.
>
> **Perché `importoCent` è la spesa e non la detrazione.** Sul modulo il
> numero scritto nel rigo **è la spesa**; la detrazione non c'è, la calcola
> chi liquida. Mettere la detrazione in `importoCent` renderebbe la
> quadratura verde contro un totale che il documento non stampa — cioè
> renderebbe il controllo inutile. La detrazione la calcola il core, dal 19%
> **stampato sul modulo**.

## Elaborazione

Tutto in `src/core/`, puro e deterministico. **Nessun arrotondamento in tutta
la catena**: non è un caso fortunato ma il criterio con cui la fixture è stata
costruita — un modulo i cui numeri tornano esatti è un modulo su cui chi legge
può rifare i conti a mano e trovarsi.

1. **Quadratura** — `verificaQuadratura(documento)`, già esistente.
   `sommaVociCent = 350000`, `totaleDichiaratoCent = 350000`,
   `scartoCent = 0`, `quadra = true`.
2. **Detrazione di ogni rigo**, dall'aliquota **stampata sul modulo**:
   `detrazioneCent = Math.round((importoCent * aliquotaBp) / 10_000)`.
   Su tutte e tre le voci la divisione non dà resto.
3. **Totale delle detrazioni**: somma dei tre valori del passo 2
   → `totaleDetrazioniCent`.
4. **Peso di ogni rigo sul totale delle spese**, in punti base, con la
   `pesoInBp(importoCent, totaleCent)` già esistente.
5. **Quanto torna di ogni 100 € spesi**:
   `pesoInBp(totaleDetrazioniCent, totaleCent)`.
6. **Quanto resta a carico**: `totaleCent - totaleDetrazioniCent`. È il
   complemento, non una seconda somma: così le due parti non possono che
   ricomporre il totale.

### Verifica a mano, da riportare nei commenti del test

```
spese dichiarate al 19%
  interessi mutuo      200.000 cent  (2.000,00 €)
  spese sanitarie      100.000 cent  (1.000,00 €)
  spese istruzione      50.000 cent    (500,00 €)
                somma = 350.000 cent  (3.500,00 €)
  e 350.000 e' anche il totale stampato sul modulo  -> quadra

detrazione di ogni rigo, al 19% stampato sul modulo
  mutuo        200.000 x 1.900 / 10.000 = 38.000 cent  (380,00 €)
  sanitarie    100.000 x 1.900 / 10.000 = 19.000 cent  (190,00 €)
  istruzione    50.000 x 1.900 / 10.000 =  9.500 cent   (95,00 €)
                                  somma = 66.500 cent  (665,00 €)
  nessuna delle tre divisioni da' resto

pesi delle spese sul totale, in punti base
  mutuo        200.000 x 10.000 / 350.000 = 5.714 bp -> 57,14%
  sanitarie    100.000 x 10.000 / 350.000 = 2.857 bp -> 28,57%
  istruzione    50.000 x 10.000 / 350.000 = 1.429 bp -> 14,29%
                                    somma = 10.000 bp -> 100,00%

quanto torna di ogni 100 € spesi
  66.500 x 10.000 / 350.000 = 1.900 bp -> 19,00%
  ed e' ESATTAMENTE il 19% stampato sul modulo
resta a carico
  350.000 - 66.500 = 283.500 cent (2.835,00 €) -> 81,00 € ogni 100 €

il ponte con il cedolino della 04, per chi rifa' i conti
  lordo annuo         2.500,00 x 12 = 30.000,00 €
  contributi IVS        229,75 x 12 =  2.757,00 €
  reddito complessivo               = 27.243,00 €   (sta nei metadati)
  IRPEF trattenuta      390,25 x 12 =  4.683,00 €   (sta nei metadati)
  imposta netta       4.683,00 - 665,00 = 4.018,00 €
```

**Tre controlli incrociati che il test deve asserire**, perché sono ciò che
rende il risultato verificabile invece che plausibile:

1. i tre pesi sommano **esattamente** a 10000 bp;
2. il peso del totale delle detrazioni sul totale delle spese fa
   **esattamente** 1900 bp, cioè ritrova il 19% **stampato sul modulo**
   partendo dai tre importi del modulo. È il più utile dei tre: dice che la
   percentuale scritta e gli importi scritti raccontano la stessa cosa;
3. `totaleDetrazioniCent + restaACaricoCent` fa **esattamente**
   `totaleCent` (350000).

## Output

Una schermata sola, un concetto solo: **il rimborso non è un regalo, è la
parte di queste spese che torna indietro.**

Struttura, evidenziazione, apertura di una riga e riepilogo: **come definiti
in `04`**. Qui solo ciò che cambia.

### Il facsimile

I tre righi del quadro E, nell'ordine della fixture: `etichettaOriginale` a
sinistra **così com'è scritta**, importo a destra, allineato a destra, cifre
tabulari, euro accanto al valore. Sopra l'elenco, il **rimborso** — `665,00 €`
— che è il numero più grande della schermata, perché è il numero per cui la
persona è arrivata qui.

**Tutti e tre i righi sono apribili**, e sono tre perché sono le spese che
generano il dubbio: il mutuo (di cui si detraggono gli interessi, non la
rata), le spese sanitarie (di cui si detrae solo la parte oltre la
franchigia), l'istruzione (che quasi nessuno sa di poter dichiarare). Oltre ai
tre, **due riquadri apribili sul prospetto**: il reddito complessivo e le
ritenute già trattenute, che stanno nei `metadati` e sono il ponte con la
busta paga.

### L'apertura di un rigo

Come in `04`: la riga si evidenzia — bordo **e** fondo, non il solo colore — e
**sotto** compare il riquadro. Il contenuto qui ha una riga in più rispetto a
`04`, perché su un onere detraibile i numeri che contano sono due:

| Elemento | Contenuto |
| --- | --- |
| l'etichetta | ripetuta **identica** a quella del rigo |
| la spesa | `2.000,00 €` — quanto è stato speso |
| **la detrazione** | `380,00 €` — quanto di quella spesa torna |
| il 19% | `19,00 € ogni 100 € spesi`, con accanto che quel 19% è **stampato sul modulo**, non una nostra ipotesi |
| la spiegazione | due o tre frasi, immagine concreta prima del nome tecnico |

### La riga in più che `04` non ha: le due parti della spesa

Sotto il facsimile, **una sola barra** divisa in due, con le due cifre scritte
sopra e non solo disegnate:

| Parte | Valore |
| --- | --- |
| torna con il 730 | `665,00 €` · `19,00%` |
| resta a carico | `2.835,00 €` · `81,00%` |

È la parte che corregge l'idea sbagliata più diffusa su questo documento —
«con le detrazioni le spese me le ripagano» — e la corregge con un numero, non
con una precisazione. La barra non è l'unico modo di leggere il dato: le due
cifre stanno scritte accanto, perché un rapporto disegnato non si legge da
lontano e non si legge con uno screen reader.

### Bozze delle stringhe

Vanno in `src/ui/`, **non nella fixture**: la fixture contiene le parole del
modulo, il registro contiene le nostre. `testi.ts` è a 114 righe e il limite è
150, quindi le stringhe stanno in un file affiancato `testiDichiarazione.ts`
che entra in `STRINGHE_UTENTE` con lo spread — lo stesso schema già usato da
`testiSimulazione.ts`. Il registro da scandire resta un oggetto solo.

Queste sono **bozze**: le scrive `ui-builder` e le rilegge
`guardrail-officer` prima del merge, contro il lessico **e** contro
`.claude/rules/scrittura-e-accessibilita.md`. **Su questa schermata la
rilettura non è una formalità**: ogni frase su una dichiarazione dei redditi
è a una parola di distanza dalla consulenza fiscale.

- **Il rimborso — 665,00 €** — «Questi soldi non sono un regalo dello Stato:
  sono soldi tuoi che avevi già pagato. Ogni mese, dalla busta paga, ti hanno
  trattenuto una parte di stipendio per le tasse. A fine anno si rifà il
  conto tenendo dentro alcune spese che avevi fatto, e se ti hanno trattenuto
  più del dovuto la differenza torna indietro. Si chiama rimborso.»
- **Interessi passivi su mutuo ipotecario** — «Della rata del mutuo, una parte
  è il prestito che restituisci e una parte è il costo del prestito: gli
  interessi. Solo di quella seconda parte una fetta torna indietro, ed è
  questa riga. Sono 2.000,00 € di interessi in un anno, di cui tornano
  380,00 €: 19,00 € ogni 100 €.»
- **Spese sanitarie (al netto della franchigia di 129,11)** — «Le visite, gli
  esami e i medicinali contano, ma non dal primo euro: i primi 129,11 €
  dell'anno restano interi a carico tuo, e solo quello che c'è sopra entra nel
  conto. È come la franchigia dell'assicurazione dell'auto. Qui la spesa oltre
  quella soglia è di 1.000,00 €, e ne tornano 190,00 €.»
- **Spese di istruzione** — «L'iscrizione a scuola, all'università o al nido
  entra in questo conto, ed è la riga che più spesso resta vuota perché
  nessuno sa che c'è. Su 500,00 € tornano 95,00 €.»
- **Reddito complessivo — 27.243,00 €** — «Non è quello che ti è arrivato sul
  conto, e non è nemmeno il totale dei tuoi stipendi lordi: è il lordo
  dell'anno meno i contributi per la pensione. Nei dodici cedolini sono
  30.000,00 € di lordo meno 2.757,00 € di contributi.»
- **Ritenute IRPEF — 4.683,00 €** — «Questa cifra l'hai già pagata, un
  dodicesimo per volta: è la somma delle righe IRPEF dei dodici cedolini,
  390,25 € al mese. Il datore di lavoro le ha versate al posto tuo mese per
  mese, così non ti arriva un conto unico a fine anno.»
- **Le due parti della spesa** — «Hai speso 3.500,00 € nelle tre cose qui
  sopra. Con il 730 ne tornano 665,00 €, cioè 19,00 € ogni 100 € spesi. Gli
  altri 2.835,00 € li hai pagati tu: una spesa che si detrae non è una spesa
  che si recupera.»

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`.

### I quattro stati obbligatori

Gli stati **vuoto** e **in caricamento** sono quelli di `04`: nessun rigo
ancora aperto e riquadro del riepilogo già presente; fixture importata
staticamente, calcolo immediato, nessuna rotellina, nessuno spostamento del
layout all'apertura di un rigo. I due che qui sono diversi:

3. **Errore** — due casi, entrambi veri su un 730:
   **(a)** la **quadratura che non torna**, cioè la somma dei righi diversa
   dal totale stampato: la schermata lo dice in linguaggio umano, mostra lo
   scarto, e **non corregge niente**;
   **(b)** un rigo **senza `aliquotaBp`**. Succede: non tutti gli oneri del
   quadro E stanno al 19%. In quel caso la detrazione di quel rigo **non si
   mostra** — non si assume il 19% per analogia. Assumere un'aliquota che il
   modulo non stampa è inventare un dato fiscale, e questa schermata non lo
   fa. Il rigo resta visibile con la sua spesa, e la riga della detrazione
   dice che quel numero il modulo non lo stampa.
4. **Dati lunghi o numerosi** — `Interessi passivi su mutuo ipotecario -
   abitazione principale` è lunga sessanta caratteri e deve andare a capo
   senza rompere la griglia né staccarsi dal suo importo. Il layout deve
   reggere il caso vero del **quadro E pieno**: venti righi, aliquote diverse
   fra loro, e importi a sei cifre in euro.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/letturaDichiarazione.test.ts`, con i
  valori della verifica a mano scritti nei commenti accanto alle asserzioni, e
  i tre controlli incrociati. Copre anche il documento che **non quadra**
  (`totaleDichiaratoCent` alterato di 1 cent: `scartoCent` deve valere 1 e
  `quadra` deve essere `false`), il rigo **senza `aliquotaBp`** (la detrazione
  è assente, **non zero e non il 19% per analogia** — la differenza fra «non
  lo sappiamo» e «fa zero» è tutta la conformità di questa funzionalità), e
  il totale a zero (`pesoInBp` restituisce già `0`, non una divisione per
  zero).
- **Test di accettazione** —
  `tests/accettazione/06-guida-dichiarazione-730.test.ts`, scritto dal
  `tester` dalla specifica, non dal codice. Deve contenere **un caso di
  conformità esplicito**: nessuna stringa del registro di questa schermata
  contiene un imperativo rivolto a chi legge.
- **Lessico** — `tests/lessico-ui.test.ts` scandisce già sia il registro sia
  le fixture. Questa è **la schermata più sorvegliata del sito**: il lessico
  di blocco prende già `dovresti` · `dovrebbe*` · `convien*` · `scegli` ·
  `suggeri*`, che sono esattamente le parole in cui una spiegazione fiscale
  scivola. Ma il lessico prende le parole, non le intenzioni: la rilettura di
  `guardrail-officer` è **obbligatoria e bloccante** qui, e va fatta contro la
  sezione «Cosa questa funzionalità NON fa» di questa spec, non solo contro il
  lessico.
- **In demo, dieci secondi**: si tocca `Interessi passivi su mutuo ipotecario`
  e compaiono i due numeri accoppiati — `2.000,00 €` spesi, `380,00 €` che
  tornano, `19,00 € ogni 100 €`; poi si guarda la barra in fondo: `665,00 €`
  tornano, `2.835,00 €` restano. Se prima si è mostrata la `04`, il ponte si
  fa con una frase: le `IRPEF` del cedolino, per dodici mesi, sono le
  `4.683,00 €` di ritenute scritte qui.

## Cosa questa funzionalità NON fa

Su questa funzionalità questa sezione **non è un elenco di confini: è la
funzionalità**. Va letta prima dell'«Output».

- **Non dice a nessuno che cosa mettere nella dichiarazione.** È il confine
  che definisce questo task. Spiegare che gli interessi del mutuo prima casa
  rientrano fra gli oneri al 19% è **informazione** — sta scritta sul modulo e
  nella legge. Dire «controlla se hai spese sanitarie da inserire», «verifica
  di aver messo tutto», «ti conviene dichiarare anche X» è **consulenza
  fiscale**: presuppone di conoscere la situazione della persona, e il
  prodotto non la conosce e non la valuta. La schermata spiega **i righi che
  sono già scritti su questo modulo** e si ferma lì.
- **Non dice se il 730 è compilato bene.** Nessuna verifica, nessun controllo
  di completezza, nessun «sembra mancare qualcosa», nessun confronto con
  quello che dichiarano gli altri. La quadratura confronta la somma dei righi
  con il totale stampato **sullo stesso documento**: è un controllo interno al
  foglio, non un giudizio sulla dichiarazione.
- **Non calcola l'imposta.** Nessuna IRPEF a scaglioni, nessuna detrazione per
  lavoro dipendente, nessuna addizionale, nessun ricalcolo del rimborso. Gli
  importi sono quelli **stampati sul modulo**; il core calcola soltanto i
  rapporti fra loro — le detrazioni dall'aliquota stampata, i pesi, le due
  parti, la quadratura. Rifare il conto dell'imposta direbbe implicitamente
  «il rimborso sul tuo modulo dovrebbe essere questo», che è esattamente la
  consulenza vietata. Il calcolo dal lordo al netto è un'altra funzionalità,
  il task `08`.
- **Non assume aliquote che il modulo non stampa.** Un rigo senza `aliquotaBp`
  non riceve il 19% per analogia: la detrazione non si mostra. Inventare
  un'aliquota su un documento fiscale è alterare il significato
  dell'informazione originale, che il progetto vieta, e su questo documento
  sarebbe anche il tipo di errore che costa soldi a chi ci crede.
- **Non tratta il caso «a debito».** Questa fixture esce a rimborso. Un 730
  che esce a debito è una schermata diversa, con una domanda diversa
  («perché devo pagare?») e un tono che va pensato da zero: è il momento di
  massimo stress su questo documento, e infilarlo in una variante di questa
  schermata lo tratterebbe come un caso limite invece che come la situazione
  che è. È un altro task: qui viene dichiarato, non abbozzato.
- **Non copre il resto del modulo.** Solo il quadro E, e di quello solo tre
  righi al 19%. Familiari a carico, redditi di altra natura, quadro B degli
  immobili, oneri deducibili (che si sottraggono dal reddito, non
  dall'imposta, e sono un concetto diverso): niente di tutto questo.
  «Si spiegano solo le 3-5 voci che generano più dubbi reali, non l'intero
  documento» è la sezione 3 del documento d'origine, ed è anche l'unico modo
  di rispettare «un concetto per schermata» su un modulo di sei pagine.
- **Non riscrive le etichette del documento.** `etichettaOriginale` compare
  identica, sempre: `Spese sanitarie (al netto della franchigia di 129,11)`
  resta scritto così, franchigia compresa. La spiegazione si mette
  **accanto**, mai al posto — altrimenti chi confronta lo schermo con il
  modulo non ritrova il rigo, e il 730 vero diventa meno leggibile di prima,
  non più.
- **Non nasconde i righi che non spiega** e non arrotonda via le spese
  piccole. I 500,00 € di istruzione restano un rigo: una voce che esiste non
  si semplifica via, perché la somma dei righi deve continuare a fare il
  totale stampato.
- **Non legge un 730 vero e non si collega a nessun servizio.** Nessun
  caricamento di PDF, nessuna credenziale, nessuno SPID, nessuna chiamata
  all'Agenzia delle Entrate: `02-data-ingest` non è attivato, `src/ingest/` è
  vuota di proposito, e una chiamata esterna a runtime è vietata. Il modulo è
  uno, anonimo e dichiarato nella fixture. Chi ha in mano il proprio confronta
  i righi con l'occhio — ed è anche il motivo per cui le etichette devono
  restare identiche.
- **Non è il 730 di chi legge.** I numeri sono quelli della fixture: chi ha
  altre spese vedrà cifre diverse dalle sue, e la schermata lo dice invece di
  lasciarlo intuire. Su un documento fiscale questa frase non è una cautela
  formale: è la differenza fra una spiegazione e un calcolo personale.
- **Non chiede e non conserva niente.** Nessun campo da compilare, nessun
  codice fiscale, nessun dato personale, nessun salvataggio. Il riepilogo vive
  nella pagina: uscendo e rientrando riparte vuoto, e la schermata non finge
  il contrario.
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
| **Contratti necessari** | `DocumentoUtente`, `VoceDocumento`, `CategoriaVoce`, `Provenienza`, `QuadraturaTotale`, `Scenario`. Le interfacce **esistono già** e descrivono esattamente un documento a righi: `VoceDocumento.aliquotaBp` regge il 19% stampato sul modulo, e `DocumentoUtente.metadati` regge i tre numeri del prospetto che non sono righi di spesa — lo stesso uso che ne fa già `estratto-conto-trimestrale.input.json`. **Nessuna interfaccia nuova serve in `types/`**: in particolare **non** serve un campo per la detrazione, perché la detrazione non è scritta sul modulo e la calcola il core. `LetturaCalcolata` **non** viene usata: il suo `pesoBp` è il peso sul totale e la sua `proiezioneAnnuaCent` moltiplicherebbe per dodici un documento che è già annuale. I tipi dell'uscita (`LetturaDichiarazione`, la detrazione per rigo, le due parti) nascono **dentro `src/core/`**, di proprietà di core-engine. Il tipo condiviso che descrive **quali righi sono apribili e con quale spiegazione** non è un contratto di dominio ma di presentazione: vive in `src/ui/`, di proprietà di ui-builder, e nasce con `04` |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root, quindi i contratti si possono ancora **estendere**. **Ma una modifica serve**: `Scenario` non ha il valore `'dichiarazione-730'`, e va aggiunto all'unione in `types/contracts.ts`. È **una riga, puramente additiva**: nessuno `switch` esaustivo su `Scenario` esiste nel repository, quindi non rompe niente e non invalida le fixture esistenti. La riga la scrive **`00-architect`**, non chi implementa — anche a contratti non congelati, `types/` resta della radice del repository. Se `.contracts-frozen` verrà creato prima che questo task parta, la riga richiede una deroga esplicita: fermarsi e rivolgersi all'architetto, annotare in `docs/decisioni.md`, poi ricongelare |
| **Agente incaricato** | **`03-ui-builder`** (la guida è una schermata, ed è il grosso del lavoro), con **`01-core-engine`** per `letturaDichiarazione.ts` e il suo test, **`00-architect`** per la riga di `types/` e le due fixture, **`04-guardrail-officer`** per la rilettura delle stringhe — che qui è **bloccante**, non consultiva — e per il test di accettazione. **Ordine obbligato**: architect → core-engine → ui-builder → guardrail-officer. Non è parallelizzabile al proprio interno |
| **Directory toccate** | **5 — quindi quattro agenti, e non è un dettaglio organizzativo.** `types/` (una riga in `contracts.ts` — **architetto**) · `fixtures/` (`dichiarazione-730-annuale.input.json`, `dichiarazione-730-annuale.atteso.json` — **architetto**) · `src/core/` (`letturaDichiarazione.ts`, `index.ts` per l'export, `__tests__/letturaDichiarazione.test.ts` — **core-engine**) · `src/ui/` (`PaginaDichiarazione.tsx`, `BarraDueQuote.tsx` riusato da `05`, `testiDichiarazione.ts`, `testi.ts` per lo spread, `rotte.ts`, `App.tsx`, `stiliDichiarazione.css` — **ui-builder**) · `tests/` (`accettazione/06-guida-dichiarazione-730.test.ts` — **guardrail-officer**) |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/06-730-detrazione-aperta.png` — il rigo degli interessi del mutuo **aperto**, con i due numeri accoppiati nella stessa inquadratura (`2.000,00 €` spesi, `380,00 €` che tornano, `19,00 € ogni 100 €`) e la barra `665,00 € / 2.835,00 €`. È lo scatto che **dimostra il vincolo del progetto invece di raccontarlo**: su un documento fiscale si vede una schermata che spiega da dove viene un numero e non dice a nessuno cosa fare. Sono gli stessi numeri che il test asserisce, quindi la slide mostra ciò che il test dimostra. Più `06-730-mobile.png` per il caso stretto |

### Il ponte al simulatore — e il ponte verso `04`

La sezione 3 del documento d'origine prescrive che ogni guida-documento
rimandi al simulatore collegato, ma **per il 730 non ne indica nessuno**: i
due ponti nominati sono bolletta → simulatore energia e busta paga →
simulatore netto.

Due destinazioni possibili, entrambe condizionate, nessuna delle due
implementata da questo task:

1. **Verso `08`, il simulatore del netto in busta.** Pertinente: la ritenuta
   IRPEF del cedolino è la cifra che qui compare come `ritenuteIrpef`. Ma `08`
   non ha né spec né schermata, e `04` ha già preso la decisione di non
   costruire quel ponte finché la pagina non esiste.
2. **Verso `04`, la guida alla busta paga.** È il ponte più utile e il meno
   ovvio: non porta a un simulatore ma **all'altro documento della stessa
   persona**, e chiude il cerchio — le dodici righe `IRPEF netta` del
   cedolino sono le `4.683,00 €` di ritenute scritte qui. **È la ragione per
   cui la fixture di questo task è l'anno del cedolino di `04`.** Si fa solo
   **dopo che `04` è stata unita a `develop`**, ed è una riga in `rotte.ts`.

Finché nessuna delle due condizioni è vera, `06` si consegna **senza ponte**:
nessun bottone disattivato, nessun «presto disponibile». Una porta che non si
apre è peggio di una parete.

### Conflitti di pianificazione, da sapere prima di `/implementa`

- **`06` va dopo `04`**, per due motivi indipendenti: occupa le stesse
  directory (`src/ui/`, `tests/`), e **riusa i componenti che `04` produce**.
  In parallelo divergerebbero.
- **`06` va dopo `05`** se si vuole riusare `BarraDueQuote.tsx` invece di
  scriverlo due volte. Non è obbligatorio, ma l'ordine `04 → 05 → 06` fa
  scrivere la meccanica una volta e riusarla due.
- **`types/` serve solo all'inizio**, per una riga: dopo torna libera.
  Conviene raggrupparla con la riga di `Scenario` che serve a `04`
  (`'busta-paga'`) in **un solo intervento dell'architetto**, così `types/`
  si apre e si chiude una volta sola invece di due.
- **`fixtures/` e `src/core/` sono libere adesso.** Le due fixture e
  `letturaDichiarazione.ts` si possono scrivere mentre `04` occupa `src/ui/`.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-15, dalla sola specifica.
> La fase 2 — rilettura del codice e dei test, esecuzione dei passi qui sotto e
> riscrittura al presente sotto «Verificato» — non è ancora stata fatta.

### Cosa farà

Aprendo questa guida comparirà il quadro E di un 730 già compilato,
riprodotto riga per riga con le stesse identiche parole del modulo: tre spese
che danno diritto a una detrazione — gli interessi del mutuo, le spese
sanitarie, le spese di istruzione — e, sopra l'elenco, il numero più grande
di tutta la schermata: il rimborso, **665,00 €**. Toccando una riga comparirà
sotto di essa quanto è stato speso, quanto di quella spesa torna indietro e
quanto torna ogni 100 € spesi — per esempio sugli interessi del mutuo:
**2.000,00 €** spesi, **380,00 €** che tornano, **19,00 €** ogni 100 €, con
accanto la precisazione che quel 19% è il numero stampato sul modulo, non
un'ipotesi di questo sito. Due riquadri in più, apribili allo stesso modo,
mostreranno il reddito complessivo (**27.243,00 €**) e le ritenute IRPEF già
trattenute in busta paga (**4.683,00 €**): il ponte fra questo modulo e il
cedolino della funzionalità 04. In fondo, una barra dividerà le tre spese in
due parti — quanto torna con il 730 e quanto resta comunque a carico — per
correggere con un numero solo l'idea più diffusa su questo documento, che una
spesa detratta sia una spesa recuperata per intero: su ogni 100 € di queste
spese, **19,00 €** torneranno e **81,00 €** resteranno pagati da chi ha
dichiarato.

### Per chi

Una persona dipendente che riceve il 730 **già compilato** ogni anno: lo
guarda, cerca l'ultima riga, vede scritto «rimborso» e la accetta senza
sapere da dove venga — non ha modo di dire se quella cifra sia grande o
piccola, giusta o sbagliata, perché il modulo è fatto di righi numerati,
sigle e rimandi ad altri righi.

Due cose la bloccano, ed è a queste due che la guida risponderà: non saprà
che quel rimborso è una **restituzione**, non un regalo né un premio dello
Stato; e non collegherà il 730 alla busta paga, cioè non saprà che le righe
`IRPEF` trattenute ogni mese sono esattamente i soldi di cui una parte torna
indietro qui. Le servirà fra aprile e luglio, con il 730 precompilato aperto
e la sensazione di dover «solo confermare» — il momento esatto in cui sta per
chiuderlo senza averlo letto.

È la stessa persona della funzionalità 04: la fixture di questa guida userà
l'anno dello stesso cedolino anonimo — dodici mesi da 2.500,00 € di lordo —
così da poter mostrare i due documenti in fila e far vedere che i numeri si
tengono.

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

3. **Raggiungere la guida.** Aprire quell'indirizzo e navigare fino alla
   guida alla dichiarazione 730, all'indirizzo che `rotte.ts` le assegnerà.
   *Risultato atteso:* si aprirà la schermata del 730, con le sue righe
   leggibili da subito — non un avviso «presto disponibile», non una pagina
   bianca. **Nota sulla specifica, da leggere prima di considerare questo
   passo scontato**: a differenza delle guide 04 (cedolino) e 05 (bolletta),
   che si raggiungono toccando una domanda già scritta sulla home, questa
   specifica non lega la guida a nessuna voce del catalogo delle diciotto
   domande — verificato: né `src/ui/catalogoDomande.ts` né
   `src/ui/testi.ts`/`testiCatalogo.ts` contengono oggi una domanda sul 730 o
   sulla dichiarazione dei redditi, in nessuna area. Questo criterio verifica
   quindi l'indirizzo diretto della guida, non un percorso dalla home: se in
   fase 2 risultasse comunque presente un collegamento dalla home, sarebbe
   un'aggiunta rispetto a quanto scritto qui, da segnalare come tale.

4. **Il facsimile, prima di toccare qualunque riga — lo stato vuoto.**
   Guardare la schermata subito dopo l'apertura, senza toccare niente.
   *Risultato atteso:* compariranno le tre righe del quadro E, con le
   etichette **identiche**, carattere per carattere, a quelle di un modulo
   vero: `Interessi passivi su mutuo ipotecario - abitazione principale`,
   `Spese sanitarie (al netto della franchigia di 129,11)`, `Spese di
   istruzione - iscrizione scolastica`. Gli importi saranno allineati a
   destra, con cifre tabulari e l'euro accanto al valore: `2.000,00 €`,
   `1.000,00 €`, `500,00 €`. Sopra l'elenco, **665,00 €** — il rimborso —
   sarà il numero più grande di tutta la schermata. Il riquadro del
   riepilogo sarà già presente, con una riga che dirà che si riempirà via
   via che si aprono le voci — non «nessun risultato».

5. **Il caricamento non sposterà il layout.** Osservare lo stesso istante
   del passo precedente, con attenzione a eventuali scatti del layout.
   *Risultato atteso:* nessuna rotellina né alcun indicatore di attesa: il
   730 è una fixture importata staticamente, quindi le tre righe, i due
   riquadri del prospetto e il riepilogo compariranno già pronti. Il
   riquadro dove poi comparirà la spiegazione occuperà già il suo spazio da
   chiuso, così aprire la prima riga non sposterà il resto della schermata
   verso il basso.

6. **Aprire il rigo degli interessi del mutuo.** Toccare
   `Interessi passivi su mutuo ipotecario - abitazione principale`.
   *Risultato atteso:* la riga si evidenzierà con un bordo **e** un fondo
   diversi, non il solo colore, e sotto comparirà un riquadro con
   l'etichetta ripetuta identica, la spesa `2.000,00 €`, la detrazione
   `380,00 €` e il paragone `19,00 € ogni 100 €`, con accanto la frase che
   dichiara che quel 19% è il numero **stampato sul modulo**, non
   un'ipotesi di questo sito. La spiegazione partirà dall'immagine di tutti
   i giorni — la rata fatta di prestito restituito più interessi — prima
   della sigla.

7. **Il controllo che conta più di tutti.** Con una calcolatrice qualunque,
   dividere `380,00` per `2.000,00` e moltiplicare per 100.
   *Risultato atteso:* il risultato sarà `19`, lo stesso numero già
   stampato dentro l'etichetta del modulo. Sarà la prova che la percentuale
   scritta sul documento e i due importi del documento raccontano la stessa
   cosa, e non due cose diverse per caso vicine.

8. **Le altre due righe, guardando il riepilogo dopo ognuna.** Toccare
   `Spese sanitarie (al netto della franchigia di 129,11)`, poi `Spese di
   istruzione - iscrizione scolastica`.
   *Risultato atteso:* sulle spese sanitarie si leggerà `1.000,00 €` di
   spesa — già al netto della franchigia di 129,11 €, spiegata con il
   paragone della franchigia dell'assicurazione dell'auto — e `190,00 €`
   che tornano; sull'istruzione, `500,00 €` di spesa e `95,00 €` che
   tornano. Ogni tocco sostituirà il contenuto del riquadro di spiegazione
   con quello della riga appena aperta — una spiegazione visibile alla
   volta — ma il riepilogo sotto **aggiungerà** una riga per ogni voce
   toccata finora, senza perdere quelle di prima: nessuna domanda, nessun
   punteggio, nessuna barra di avanzamento.

9. **I due riquadri sul prospetto — il ponte con la busta paga.** Toccare
   il riquadro del reddito complessivo, poi quello delle ritenute IRPEF.
   *Risultato atteso:* si leggerà **27.243,00 €** di reddito complessivo,
   con la spiegazione che è il lordo dell'anno meno i contributi, e
   **4.683,00 €** di ritenute IRPEF, con la spiegazione che è la somma
   delle dodici righe `IRPEF netta` del cedolino, `390,25 €` al mese. Sarà
   il punto in cui, se si è già vista la funzionalità 04, si riconoscono
   gli stessi numeri.

10. **La barra delle due parti.** Guardare in fondo alla schermata.
    *Risultato atteso:* due cifre scritte accanto a una barra sola, non
    solo disegnata: **665,00 € · 19,00%** per la parte che torna con il
    730, **2.835,00 € · 81,00%** per quella che resta comunque a carico. Le
    due percentuali sommeranno esattamente a 100%, e la frase accanto dirà
    che una spesa che si detrae non è una spesa che si recupera per
    intero.

11. **Nessuna consulenza fiscale — il criterio più delicato di tutti.**
    Rileggere tutta la schermata: le tre righe aperte una alla volta, i due
    riquadri del prospetto, la barra finale.
    *Risultato atteso:* in nessun punto comparirà un'indicazione su quali
    spese portare in detrazione, su quale modello usare, su quali ricevute
    procurarsi, né un giudizio se il 730 è compilato bene o se manca
    qualcosa. Nessun ricalcolo dell'imposta lorda con gli scaglioni IRPEF:
    gli unici numeri saranno rapporti fra cifre già stampate sul modulo.
    Nessuna parola come «dovresti», «ti conviene», «ricordati di»,
    «potresti recuperare»: il lessico di blocco le intercetta già, ma qui
    la rilettura di `guardrail-officer` è dichiarata bloccante proprio
    perché il lessico prende le parole, non le intenzioni.

12. **Errore — verificabile solo in parte con questa fixture.** Cercare,
    nel facsimile, un punto in cui la somma delle tre spese non coincida
    con il totale stampato, oppure una riga senza la sua percentuale.
    *Risultato atteso:* non se ne troverà nessuno: questa fixture **quadra
    per costruzione** — la somma delle tre voci, `3.500,00 €`, è
    esattamente il totale degli oneri stampato sul modulo — e tutte e tre
    le righe hanno la loro aliquota. **I due comportamenti d'errore non
    sono quindi eseguibili end-to-end con questo documento**: (a) una
    quadratura che non torna dovrà essere dichiarata in linguaggio umano,
    con lo scarto mostrato e **mai corretto**, esattamente come su un
    cedolino o una bolletta che non tornano; (b) un rigo senza aliquota
    stampata non dovrà mostrare nessuna detrazione, **né assumerla al 19%
    per analogia**: la riga resterà con la sua spesa, e al posto della
    detrazione ci sarà scritto che il modulo non stampa quel numero.
    Andranno verificati in fase 2 leggendo
    `src/core/__tests__/letturaDichiarazione.test.ts`. Se in fase 2 quei
    casi non risultano coperti, va segnalato come divergenza, non
    inventato un modulo finto solo per poterlo mostrare.

13. **Dati lunghi — in parte verificabile oggi, in parte no.** Guardare
    come va a capo l'etichetta più lunga, `Interessi passivi su mutuo
    ipotecario - abitazione principale` (sessanta caratteri).
    *Risultato atteso:* andrà a capo su più righe restando accanto al
    proprio importo, senza rompere la griglia né staccarsi dall'importo.
    **Il quadro E pieno — venti righi, aliquote diverse fra loro, importi a
    sei cifre — non è invece riproducibile con questa fixture di tre
    righe**, e andrà verificato in fase 2 leggendo la struttura pensata per
    reggerlo in `stiliDichiarazione.css`.

14. **Da tastiera e a finestra stretta come un telefono.** Restringere la
    finestra sotto i 768 px di larghezza e rifare i passi 4-10 leggendo con
    attenzione la riga del mutuo; poi, senza toccare il mouse, premere Tab
    più volte fino a raggiungere e attivare la prima riga, e passare il
    mouse su una riga **senza** cliccarla.
    *Risultato atteso:* le etichette andranno a capo restando accanto al
    proprio importo, senza barra di scorrimento orizzontale; nessuna
    scritta scenderà sotto i 16 px, il contrasto resterà leggibile (almeno
    4,5:1), e nessun bersaglio sarà più piccolo di 44×44 px. Ogni riga
    apribile sarà un `<button>` vero, raggiungibile con Tab, apribile con
    Invio **e** con Spazio, con `aria-expanded` che passa a `true` e la
    spiegazione collegata da `aria-controls`; il fuoco avrà un contorno
    netto sempre visibile, nello stesso ordine della lettura del modulo,
    rigo per rigo. Passando il mouse senza cliccare non comparirà nessuna
    informazione nuova: l'unico modo di aprire una riga sarà il tocco, il
    clic o l'attivazione da tastiera.

15. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la stessa schermata
    servita da un server locale qualunque.
    *Risultato atteso:* la build finirà senza errori, e rifacendo i passi
    3-10 si leggerà esattamente lo stesso contenuto — **senza che parta una
    sola richiesta fuori dal computer**: nessuna lettura di un 730 vero,
    nessuna chiamata all'Agenzia delle Entrate, perché il modulo e tutti i
    suoi numeri sono scritti in una fixture dentro il codice.

### Limiti previsti

- **Non dirà a nessuno che cosa mettere nella dichiarazione.** È il confine
  che definisce questo task: spiegare che gli interessi del mutuo prima casa
  rientrano fra gli oneri al 19% è informazione, perché sta scritta sul
  modulo e nella legge; dire quali spese portare in detrazione, quale
  modello usare, quali ricevute procurarsi o se si potrebbero recuperare
  altri soldi è consulenza fiscale, che il prodotto non dà. Spiegherà solo i
  righi già scritti su questo modulo, e si fermerà lì.
- **Non dirà se il 730 è compilato bene.** Nessuna verifica di completezza,
  nessun «sembra mancare qualcosa», nessun confronto con quello che
  dichiarano altre persone: la quadratura confronterà solo la somma dei
  righi con il totale stampato sullo stesso documento.
- **Non calcolerà l'imposta.** Nessuna IRPEF a scaglioni, nessuna detrazione
  per lavoro dipendente, nessuna addizionale, nessun ricalcolo del
  rimborso: gli importi saranno quelli stampati sul modulo, e il conto
  riguarderà solo i rapporti fra loro. Ricalcolare l'imposta lorda
  richiederebbe gli scaglioni IRPEF e trasformerebbe questa guida in un
  calcolatore di tasse — un'altra funzionalità, la 08.
- **Non assumerà aliquote che il modulo non stampa.** Un rigo senza
  percentuale stampata non riceverà il 19% per analogia: la sua detrazione
  semplicemente non comparirà.
- **Non tratterà il caso «a debito».** Questa fixture esce a rimborso: un
  730 a debito è una domanda diversa — «perché devo pagare?» — con un tono
  che va pensato da zero, non una variante di questa schermata.
- **Non coprirà il resto del modulo.** Solo il quadro E, e di quello solo
  tre righi al 19%: niente familiari a carico, redditi di altra natura,
  quadro B degli immobili, oneri deducibili.
- **Non riscriverà le etichette del documento.** `etichettaOriginale`
  comparirà identica, franchigia compresa: la spiegazione si metterà
  accanto, mai al posto.
- **Non nasconderà i righi che non spiega** né arrotonderà via le spese
  piccole: anche i 500,00 € di istruzione resteranno un rigo a sé, visibile
  quanto gli altri.
- **Non leggerà un 730 vero e non si collegherà a nessun servizio.** Nessun
  PDF, nessuno SPID, nessuna chiamata all'Agenzia delle Entrate: il modulo
  sarà uno solo, anonimo, scritto a mano in una fixture.
- **Non sarà il 730 di chi legge.** I numeri saranno quelli della fixture:
  chi ha altre spese vedrà cifre diverse dalle sue, e la schermata lo dirà
  invece di lasciarlo intuire.
- **Non avrà nessun collegamento verso un simulatore o verso la guida 04.**
  Il ponte più utile — verso la busta paga, per chiudere il cerchio fra
  ritenute e rimborso — si farà solo dopo che `04` sarà stata unita a
  `develop`: fino ad allora nessun bottone disattivato, nessun «presto
  disponibile» — una porta che non si apre è peggio di una parete.
- **Non chiederà e non conserverà niente.** Nessun campo da compilare,
  nessun dato personale, nessun salvataggio: uscendo e rientrando il
  riepilogo ripartirà vuoto.
- **Non farà domande e non assegnerà punteggi.** Il riepilogo sarà un
  promemoria, non un quiz: la misura della comprensione appartiene a
  `src/assessment/`, un'altra parte del sito.

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
> aprendo `src/core/letturaDichiarazione.ts` e i file di `src/ui/` che
> costruiscono la guida, leggendo
> `src/core/__tests__/letturaDichiarazione.test.ts` e
> `tests/accettazione/06-guida-dichiarazione-730.test.ts`, e **rieseguendo
> davvero** i quindici passi scritti sopra. Conterrà «Cosa fa», «Come si
> prova», «Limiti» e «Divergenze fra previsto e realizzato», tutto al
> presente, e solo allora lo stato passerà a `implementato`.
>
> Finché questa sezione resta vuota, `/verifica` non accetta la
> funzionalità come `implementato`.
