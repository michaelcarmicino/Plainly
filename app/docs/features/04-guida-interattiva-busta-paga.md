# 04 — «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «01-core-engine»
> e una riga di «00-architect»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 3 «Guide interattive ai documenti quotidiani», documento 1.
> Task di backlog: `04`.
>
> ## ⚠ Estensione del brief, dichiarata e non fatta passare in silenzio
>
> `docs/brief.md` ammette **quattro scenari**: lettura di una bolletta,
> lettura di un estratto conto, budget personale, simulazione di risparmio.
> **La busta paga non è fra questi**, e nemmeno la dichiarazione dei redditi
> (task `06`, stessa situazione, stessa dichiarazione in testa a quella spec).
>
> Perché resta legittima:
>
> - sta dentro le macrocategorie di `CLAUDE.md`, area «Il lavoro», voci
>   **«pressione fiscale sul reddito»** e «stipendi che non tengono il passo
>   dei prezzi»;
> - risponde a una domanda già mappata nella sezione 1 del documento
>   d'origine: «Quanto mi tolgono davvero le tasse sullo stipendio?»;
> - il brief dichiara esplicitamente che **«l'idea non è ancora congelata»**,
>   e i contratti non sono congelati (`.contracts-frozen` non esiste nella
>   root) — il che è anche il motivo per cui la riga di `Scenario` qui sotto
>   è ammessa.
>
> **Chi approva questa spec approva anche l'estensione del perimetro.** Se
> l'idea viene congelata sui quattro scenari del brief, questo task decade:
> non va implementato «tanto è quasi dentro». La decisione è dell'architetto,
> e va annotata in `docs/decisioni.md`.
>
> La `05` (bolletta luce/gas) **non** ha questo problema: è lo scenario 1 del
> brief, senza deroghe.
>
> ## Questa spec è la fonte della meccanica condivisa fra 04, 05 e 06
>
> Le tre guide-documento hanno lo stesso impianto — facsimile a righe, righe
> apribili, spiegazione sotto la riga toccata, riepilogo che non è un quiz,
> ponte al simulatore. **Quell'impianto è dichiarato per intero qui**
> (sezioni «Output» e «Accessibilità»); `05` e `06` lo riferiscono e
> descrivono solo il documento, i numeri e le parole che cambiano. Il motivo
> della scelta è argomentato in `docs/features/05-guida-interattiva-bolletta-luce-gas.md`,
> sezione «La meccanica condivisa»: tre copie della stessa meccanica, scritte
> da agenti diversi in momenti diversi, non restano allineate, e la terza
> diverge senza che nessun test se ne accorga.
>
> **Conseguenza operativa su questa implementazione, da leggere prima di
> scrivere i componenti.** I nomi elencati più sotto in «Directory toccate»
> sono legati al cedolino (`RigaCedolino.tsx`, `stiliCedolino.css`). Perché il
> riuso sia reale e non una biforcazione, quei componenti vanno scritti
> **generici su `VoceDocumento`** e nominati in modo da non citare un solo
> documento: **`RigaDocumento`, `RiepilogoVoci`, `GuidaDocumento`,
> `stiliGuidaDocumento.css`**. È una decisione di denominazione che costa
> nulla adesso e una riscrittura dopo.
>
> **Richiede una modifica a `types/`**: una riga sola, additiva — il valore
> `'busta-paga'` manca nell'unione `Scenario`. I contratti **non sono
> congelati** (`.contracts-frozen` non esiste nella root), quindi la modifica
> è ammessa; resta comunque di competenza dell'architetto, non di chi
> implementa.
>
> **Tre scostamenti dal documento d'origine**, tutti per conformità o per
> perimetro, tutti spiegati in «Cosa questa funzionalità NON fa»: nessuna
> lettura di un documento vero, nessun ponte al simulatore del netto, nessun
> ricalcolo delle trattenute.

## Per chi

Una persona con contratto da dipendente che ogni mese riceve il cedolino, lo
guarda per due secondi, cerca l'ultima riga in basso e butta il resto. Sa
riconoscere due numeri — quello grande in alto e quello che le arriva sul
conto — e sa che il secondo è più piccolo del primo. Non sa dire perché, e ha
smesso di chiederselo perché ogni volta che ci ha provato ha trovato sigle:
`IVS`, `IRPEF`, `c/dipendente`. Non è una persona che vuole imparare come
funziona il fisco: è una persona che vuole sapere dove sono finiti 645 euro.

È letteralmente la domanda già scritta sulla home, nell'area «Il lavoro»
(`area2Altra2` in `src/ui/testi.ts`). Questa funzionalità è la sua risposta.

## Quando serve

Il giorno dello stipendio, con il cedolino aperto sul telefono accanto
all'applicazione. Non in un momento di studio: in un momento di verifica, in
cui la persona sta confrontando due schermate.

Serve anche — ed è il caso meno scontato — a chi riceve la **prima** busta
paga della vita e non ha un termine di paragone: per quella persona il salto
fra lordo e netto non è una curiosità, è una sorpresa da 645 euro.

## Cosa deve poter fare dopo

Indicare con il dito, sul proprio cedolino, **quali righe** formano la
differenza fra il numero grande e quello che arriva sul conto, e dire ad alta
voce a che cosa serve ciascuna. Non «capire la busta paga»: quello non è
osservabile. Questo lo è — o sa nominare le righe, o non le sa nominare.

Il numero che porta via: **su ogni 100 € di lordo, sul conto ne arrivano
74,20 €**.

## Input

Nessun dato digitato dalla persona. Il documento è **uno solo, dichiarato,
strutturato a mano**.

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| il cedolino | `DocumentoUtente` | **fixture nuova** `fixtures/busta-paga-mensile.input.json` |
| il risultato atteso | oggetto di confronto | **fixture nuova** `fixtures/busta-paga-mensile.atteso.json` |

`provenienza: 'fixture'`. L'agente `02-data-ingest` **non è attivato** e
`src/ingest/` è vuota di proposito: qui non entra nessun PDF e nessuna foto.

### La fixture, per esteso

Un cedolino mensile di un dipendente privato, anonimo, settembre 2026.
`totaleDichiaratoCent` è il **netto in busta stampato sul documento**, non un
numero che ricaviamo noi: il core lo confronta con la somma delle righe e
segnala lo scarto, non lo corregge.

| `id` | `etichettaOriginale` — **così com'è scritta sul cedolino** | `categoria` | `importoCent` |
| --- | --- | --- | --- |
| `voce-01` | `Retribuzione lorda` | `entrata` | `+250000` |
| `voce-02` | `Contributi IVS c/dipendente 9,19%` | `imposta` | `-22975` |
| `voce-03` | `IRPEF netta` | `imposta` | `-39025` |
| `voce-04` | `Addizionale regionale IRPEF` | `imposta` | `-1800` |
| `voce-05` | `Addizionale comunale IRPEF` | `imposta` | `-700` |

`totaleDichiaratoCent: 185500` · `scenario: 'busta-paga'` ·
`periodoInizio: '2026-09-01'` · `periodoFine: '2026-09-30'`.
Su `voce-02`: `aliquotaBp: 919`, perché quel `9,19%` è **stampato
sull'etichetta** e quindi è un dato del documento.

> **Il segno negativo è una decisione, non un dettaglio.** Sul cedolino di
> carta le trattenute stanno in una colonna a parte, scritte come numeri
> positivi. Qui hanno `importoCent` negativo per una ragione precisa: così la
> somma delle voci **è** il netto, e `verificaQuadratura` — che esiste già, è
> già testata e già si rifiuta di correggere lo scarto — funziona senza
> aggiungere una riga. La resa a schermo resta quella del documento: colonna
> «Trattenute», cifre positive. Il campo `_visualizzazione` della fixture
> riporta gli importi nel formato italiano come compaiono sulla carta, come
> già fa `estratto-conto-trimestrale.input.json`.

## Elaborazione

Tutto in `src/core/`, puro e deterministico. Nessuna divisione dà resto:
**non c'è un solo arrotondamento in tutta la catena**, e questo non è un caso
fortunato ma un criterio con cui la fixture è stata costruita — un cedolino
i cui numeri tornano esatti è un cedolino su cui chi legge può rifare i conti
a mano e trovarsi.

1. **Quadratura** — `verificaQuadratura(documento)`, già esistente.
   `sommaVociCent = 185500`, `totaleDichiaratoCent = 185500`,
   `scartoCent = 0`, `quadra = true`.
2. **Lordo** — somma delle voci con `importoCent > 0`:
   `lordoCent = 250000`.
3. **Totale trattenute** — somma dei valori assoluti delle voci con
   `importoCent < 0`: `totaleTrattenuteCent = 64500`.
4. **Peso di ogni trattenuta sul lordo**, in punti base, con la
   `pesoInBp(Math.abs(importoCent), lordoCent)` già esistente.
5. **Peso delle trattenute e del netto sul lordo**, con la stessa funzione:
   `trattenuteSulLordoBp` e `nettoSulLordoBp`.
6. **Il paragone concreto** — quanto di ogni 100 € di lordo arriva sul conto:
   `nettoSuCentoEuroCent = Math.round((10_000 * nettoCent) / lordoCent)`.

### Verifica a mano, da riportare nei commenti del test

```
lordo                        = 250.000 cent            (2.500,00 €)
trattenute  22.975 + 39.025 + 1.800 + 700 = 64.500 cent  (645,00 €)
netto       250.000 - 64.500 = 185.500 cent            (1.855,00 €)
            e 185.500 e' anche la somma delle cinque voci  -> quadra

pesi sul lordo, in punti base
  IVS          22.975 x 10.000 / 250.000 =   919 bp ->  9,19%
  IRPEF        39.025 x 10.000 / 250.000 = 1.561 bp -> 15,61%
  regionale     1.800 x 10.000 / 250.000 =    72 bp ->  0,72%
  comunale        700 x 10.000 / 250.000 =    28 bp ->  0,28%
                                  somma  = 2.580 bp -> 25,80%

  trattenute   64.500 x 10.000 / 250.000 = 2.580 bp -> 25,80%
  netto       185.500 x 10.000 / 250.000 = 7.420 bp -> 74,20%
                          2.580 + 7.420  = 10.000 bp -> 100,00%

paragone     10.000 x 185.500 / 250.000  = 7.420 cent  (74,20 € su 100 €)
```

**Tre controlli incrociati che il test deve asserire**, perché sono ciò che
rende il risultato verificabile invece che plausibile:

1. i quattro pesi sommano **esattamente** a `trattenuteSulLordoBp` (2580);
2. `trattenuteSulLordoBp + nettoSulLordoBp` fa **esattamente** 10000;
3. il peso ricalcolato di `voce-02` (919 bp) coincide con l'`aliquotaBp`
   **stampata sull'etichetta** (919). È il controllo più utile dei tre: dice
   che la percentuale scritta sul documento e i due importi del documento
   raccontano la stessa cosa.

## Output

Una schermata sola, un concetto solo: **dove va la differenza**.

### Il facsimile

Le cinque righe del cedolino, nell'ordine della fixture. Ogni riga mostra
l'`etichettaOriginale` **così com'è scritta** a sinistra e l'importo a destra,
allineato a destra, cifre tabulari, con l'euro accanto al valore.

**Le cinque righe restano tutte visibili sempre.** Quattro sono apribili — la
retribuzione lorda, i contributi, l'IRPEF, le due addizionali prese insieme —
e sono quelle che generano il dubbio. Il netto non è apribile: è il risultato,
ed è il numero più grande della schermata.

### L'apertura di una riga

Toccando una riga apribile, quella riga si evidenzia — bordo **e** fondo, non
il solo colore — e **sotto** compare il riquadro con:

| Elemento | Contenuto |
| --- | --- |
| l'etichetta | ripetuta **identica** a quella della riga |
| l'importo | `229,75 €` |
| il peso sul lordo | `9,19%`, cioè `9,19 € ogni 100 € di lordo` |
| la spiegazione | due o tre frasi, immagine concreta prima del nome tecnico |

Una riga per volta, come chiede il documento d'origine: si apre quella che
serve adesso, non tutto il testo insieme.

### Il riepilogo — un promemoria, non un quiz

Sotto il facsimile, una card raccoglie **una riga per ogni voce già aperta**,
nell'ordine in cui sono state aperte. È ciò che resta quando il riquadro si
chiude per far posto alla voce successiva, ed è la ragione per cui aprire una
riga non fa perdere quella di prima. Nessuna domanda, nessun punteggio,
nessuna barra di avanzamento: chi apre due voci su quattro non ha lasciato
niente a metà.

### Bozze delle stringhe

Vanno in `src/ui/`, **non nella fixture**: la fixture contiene le parole del
documento, il registro contiene le nostre. `testi.ts` è a 114 righe e il
limite è 150, quindi le stringhe stanno in un file affiancato
`testiBustaPaga.ts` che entra in `STRINGHE_UTENTE` con lo spread — lo stesso
schema già usato da `testiSimulazione.ts`. Il registro da scandire resta un
oggetto solo.

Queste sono **bozze**: le scrive `ui-builder` e le rilegge `guardrail-officer`
prima del merge, contro il lessico **e** contro
`.claude/rules/scrittura-e-accessibilita.md`.

- **Retribuzione lorda** — «È il numero da cui parte tutto: quanto costa il tuo
  mese di lavoro prima che ne venga tolto qualcosa. Sul conto questa cifra non
  arriva mai. Su ogni 100 € scritti qui, sul conto ne arrivano 74,20 €.»
- **Contributi IVS c/dipendente 9,19%** — «Ogni mese una parte dello stipendio
  non passa dal tuo conto: va all'INPS e costruisce la pensione che ti verrà
  pagata quando smetterai di lavorare. Quelle tre lettere, IVS, stanno per
  invalidità, vecchiaia e superstiti: le tre situazioni in cui quei soldi
  tornano indietro. Sono 229,75 € su 2.500,00 €, cioè 9,19 € ogni 100 € — la
  stessa percentuale stampata accanto all'etichetta.»
- **IRPEF netta** — «È la tassa sul reddito. Lo Stato ne trattiene una parte, e
  il datore di lavoro la versa al posto tuo ogni mese, così non ti arriva un
  conto unico a fine anno. Si chiama IRPEF. Sono 390,25 € su 2.500,00 €, cioè
  15,61 € ogni 100 €.»
- **Addizionale regionale e comunale** — «Oltre alla tassa dello Stato ce ne
  sono due più piccole: una va alla Regione in cui abiti, una al Comune.
  Cambiano da posto a posto: due persone con lo stesso stipendio, in due città
  diverse, si ritrovano sul conto cifre leggermente diverse. Insieme sono
  25,00 € su 2.500,00 €: esattamente 1,00 € ogni 100 €.»
- **Netto in busta** — «Questo è quello che arriva davvero sul conto. Su ogni
  100 € scritti come lordo ne arrivano 74,20 €, e la differenza — 645,00 € — è
  la somma delle quattro righe qui sopra.»

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`.

### I quattro stati obbligatori

1. **Vuoto** — nessuna voce ancora aperta. Il cedolino è intero e leggibile, e
   una riga dice che toccando una voce compare da dove viene quel numero. Il
   riquadro del riepilogo **esiste già** e dice che si riempirà: non «nessun
   risultato», che è una porta chiusa.
2. **In caricamento** — la fixture è importata staticamente e il calcolo è
   immediato: lo stato esiste ma non lampeggia. Il riquadro della spiegazione
   occupa il suo spazio da chiuso, così aprire una voce non spinge in basso
   ciò che sta sotto. **Nessuna rotellina.**
3. **Errore** — il caso che può davvero succedere è **la quadratura che non
   torna**: la somma delle righe diversa dal netto stampato. La schermata lo
   dice in linguaggio umano, mostra lo scarto, e **non corregge niente** — un
   documento che non torna è un'informazione, non un guasto da nascondere.
4. **Dati lunghi o numerosi** — `Contributi IVS c/dipendente 9,19%` è già
   lunga; le etichette devono andare a capo senza rompere la griglia né
   staccarsi dal loro importo. Il layout deve reggere **trenta righe** — un
   cedolino vero ne ha molte più di cinque — e importi a sette cifre.

### Accessibilità, che qui è la funzionalità e non un contorno

- Le righe apribili sono **bottoni veri**: raggiungibili con Tab, con
  `aria-expanded`, focus visibile, area minima 44×44 px.
- **Niente di solo-hover.** L'evidenziazione arriva dal tocco, non dal
  passaggio del mouse, e resta.
- **Nessun gesto obbligatorio**: nessuno swipe, nessun pinch sul facsimile.
- Ordine di tabulazione uguale all'ordine di lettura del cedolino.
- **Nessun limite di tempo**: la schermata non si chiude e non si resetta.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/letturaBustaPaga.test.ts`, con i
  valori della verifica a mano scritti nei commenti accanto alle asserzioni, e
  i tre controlli incrociati. Copre anche il documento che **non quadra**
  (`totaleDichiaratoCent` alterato di 1 cent: `scartoCent` deve valere 1 e
  `quadra` deve essere `false`) e il lordo a zero (`pesoInBp` restituisce già
  `0`, non una divisione per zero).
- **Test di accettazione** — `tests/accettazione/04-guida-busta-paga.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice.
- **Lessico** — `tests/lessico-ui.test.ts` scandisce già sia il registro sia le
  fixture: le stringhe nuove e le etichette del cedolino ci passano dentro
  senza aggiungere niente.
- **In demo, dieci secondi**: si tocca la riga `Contributi IVS c/dipendente
  9,19%`, compare `9,19 € ogni 100 € di lordo` — cioè la percentuale stampata
  sull'etichetta, ritrovata partendo dai due importi — e in fondo il netto:
  `su ogni 100 € ne arrivano 74,20 €`.

## Cosa questa funzionalità NON fa

- **Non riscrive le etichette del documento.** `etichettaOriginale` compare
  identica, sempre: `Contributi IVS c/dipendente 9,19%` resta scritto così
  anche se non lo capisce nessuno. La spiegazione si mette **accanto**, mai al
  posto. È il confine che questa funzionalità rischia di più: «tradurre» una
  riga del cedolino in una più chiara sembra un favore, ma chi poi confronta lo
  schermo con la carta non ritrova quella riga, e il documento vero diventa
  meno leggibile di prima, non più.
- **Non nasconde le voci che non spiega.** Le cinque righe restano tutte
  visibili. Spiegarne quattro e far sparire la quinta sarebbe alterare il
  documento per sottrazione.
- **Non dice se lo stipendio è giusto.** Niente «quanto dovresti guadagnare»,
  niente «verifica se ti stanno pagando il giusto», nessun confronto con
  medie di categoria o con contratti collettivi. La schermata dice **da dove
  viene ogni numero di questo cedolino** e si ferma lì.
- **Non ricalcola le trattenute.** Gli importi sono quelli **stampati sul
  documento**; il core calcola soltanto i rapporti fra loro — pesi, totale,
  quadratura. Rifare l'IRPEF con la formula a scaglioni direbbe implicitamente
  «il numero sul tuo cedolino dovrebbe essere questo», che è la consulenza che
  il prodotto non fa. Il calcolo dal lordo al netto è un'altra funzionalità,
  il task `08`.
- **Non rimanda al simulatore del netto.** Il documento d'origine prevede il
  ponte busta paga → simulatore, ma il task `08` non ha ancora né spec né
  schermata: un collegamento a una pagina che non esiste è una promessa rotta.
  Quando `08` sarà pronta, il ponte è una riga in `rotte.ts`.
- **Non legge un documento vero.** Nessun caricamento di PDF, nessuna foto,
  nessun riconoscimento del testo: `02-data-ingest` non è attivato e
  `src/ingest/` è vuota di proposito. Il cedolino è uno, anonimo e dichiarato
  nella fixture. Chi ha in mano il proprio confronta le righe con l'occhio —
  ed è anche il motivo per cui le etichette devono restare identiche.
- **Non è il cedolino di chi legge.** I numeri sono quelli della fixture: chi
  guadagna altro vedrà importi diversi dai suoi, e la schermata lo dice invece
  di lasciarlo intuire.
- **Non chiede e non conserva niente.** Nessun campo da compilare, nessun dato
  personale, nessun salvataggio. Il riepilogo vive nella pagina: uscendo e
  rientrando riparte vuoto, e la schermata non finge il contrario.
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
| **Contratti necessari** | `DocumentoUtente`, `VoceDocumento`, `CategoriaVoce`, `Provenienza`, `QuadraturaTotale`, `Scenario`. Tutti **esistono già** e descrivono esattamente un documento a voci. `LetturaCalcolata` **non** viene usata: il suo `pesoBp` è il peso sul totale, e su un cedolino il denominatore che ha senso è il **lordo**, non il netto. I tipi dell'uscita nascono **dentro `src/core/`**, di proprietà di core-engine |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. **Ma una modifica serve**: `Scenario` non ha il valore `'busta-paga'`, e va aggiunto all'unione in `types/contracts.ts`. È **una riga, puramente additiva**: nessuno `switch` esaustivo su `Scenario` esiste nel repository (verificato), quindi non rompe niente e non invalida le fixture esistenti. La riga la scrive **`00-architect`**, non chi implementa |
| **Agente incaricato** | **`03-ui-builder`** (la guida è una schermata, ed è il grosso del lavoro), con **`01-core-engine`** per `letturaBustaPaga.ts` e il suo test, **`00-architect`** per la riga di `types/` e le due fixture, **`04-guardrail-officer`** per la rilettura delle stringhe e il test di accettazione. **Ordine obbligato**: architect → core-engine → ui-builder → guardrail-officer. Non è parallelizzabile al proprio interno |
| **Directory toccate** | **5 — il task con l'impronta più larga del backlog.** `types/` (una riga in `contracts.ts`) · `fixtures/` (`busta-paga-mensile.input.json`, `busta-paga-mensile.atteso.json`) · `src/core/` (`letturaBustaPaga.ts`, `index.ts` per l'export, `__tests__/letturaBustaPaga.test.ts`) · `src/ui/` (`PaginaBustaPaga.tsx`, `RigaCedolino.tsx`, `RiepilogoVoci.tsx`, `testiBustaPaga.ts`, `testi.ts` per lo spread, `rotte.ts`, `App.tsx`, `stiliCedolino.css`) · `tests/` (`accettazione/04-guida-busta-paga.test.ts`) |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/04-busta-paga-voce-aperta.png` — la riga dei contributi aperta, con `9,19 € ogni 100 € di lordo` leggibile: la slide mostra lo stesso numero che il test asserisce. Più `04-busta-paga-mobile.png` per il caso stretto |

### Conflitti di pianificazione, da sapere prima di `/implementa`

Cinque directory su cinque disponibili sono un'impronta che **non lascia
spazio a nessun altro task che tocchi `src/ui/` o `tests/`**. In pratica,
finché `04` è aperto, `05` (bolletta), `06` (730) e `08` (simulatore netto)
non possono girare in parallelo: sono tutti task a schermata.

Due note che riducono il blocco:

- `types/` e `fixtures/` servono **solo all'inizio** e per pochi minuti. Una
  volta scritta la riga di `Scenario` e le due fixture, quelle due directory
  tornano libere.
- `05` (bolletta luce/gas) è **la stessa meccanica su un altro documento**.
  Se `04` produce `RigaCedolino.tsx` e `RiepilogoVoci.tsx` come componenti
  generici su `VoceDocumento`, `05` diventa una fixture più qualche stringa.
  Farli in parallelo li farebbe divergere; farli in fila fa risparmiare la
  seconda metà. È una ragione per **non** parallelizzare, non un problema.
