# 04 — casi di prova per «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/04-guida-interattiva-busta-paga.md` — **non dal codice**.
> Verificato, non presunto: `src/core/letturaBustaPaga.ts`,
> `src/ui/PaginaBustaPaga.tsx` (o `GuidaDocumento.tsx`, il nome generico che
> la specifica stessa impone per il riuso con 05 e 06), `RigaDocumento.tsx`,
> `RiepilogoVoci.tsx`, `testiBustaPaga.ts` e le due fixture
> (`fixtures/busta-paga-mensile.input.json` / `.atteso.json`) non esistono
> ancora — confermato con un elenco delle directory, non con la lettura del
> codice esistente di altre funzionalità (`verificaQuadratura`, `pesoInBp`,
> `formatoIt.ts`), il cui comportamento è preso qui solo dalla verifica a
> mano scritta nella specifica.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», il percorso
> nominale da mostrare in dieci secondi (tap sulla riga dei contributi IVS,
> poi il netto). Qui si scrive **cosa può andare storto**.
>
> ## Il rischio principale è il criterio 3 di conformità
>
> «Nessuna semplificazione può alterare il significato dell'informazione
> originale.» Cinque voci entrano nella fixture, cinque devono restare
> leggibili a schermo: spiegarne quattro e far sparire la quinta sarebbe
> un'alterazione per **sottrazione**, esattamente quanto riscrivere
> un'etichetta lo è per **traduzione**. Questo peso si vede nella
> distribuzione dei casi qui sotto: la conformità (§4) porta tre casi dedicati
> solo a questo (CF-03, CF-04, CF-05), il percorso nominale lo dimostra da
> un lato che funziona (C-08), i casi limite sulle due addizionali lo
> verificano dal lato più ambiguo della specifica (CL-11).
>
> ## L'aritmetica ha tre controlli incrociati, non uno
>
> La specifica li dichiara esplicitamente e sono ripresi qui come tre casi
> **separati** (C-04, C-05, C-06), non uno solo, perché ciascuno fallisce per
> un motivo diverso: un arrotondamento sfuggito nella somma dei quattro pesi
> (C-04), uno scarto fra le due metà del cedolino — trattenute e netto — che
> non tornano a 100 (C-05), o il più significativo dei tre: un peso
> ricalcolato che non racconta la stessa cosa del `9,19%` già stampato sul
> documento (C-06). Quest'ultimo è il controllo che, se fallisce, rivela
> l'errore concettuale più probabile di questa funzionalità: calcolare i pesi
> sul **netto** invece che sul **lordo** — la specifica lo esclude
> esplicitamente («il denominatore che ha senso è il lordo, non il netto»),
> ma è anche l'unico dei due che altre funzionalità già scritte usano
> (`LetturaCalcolata.pesoBp` è il peso sul totale), quindi è il punto in cui
> copiare un pattern esistente produrrebbe il numero sbagliato.
>
> ## Cinque punti su cui la specifica non decide la testabilità, segnalati e non indovinati
>
> 1. Se «le due addizionali prese insieme» restano **due righe distinte** nel
>    facsimile — ciascuna con la propria `etichettaOriginale` e il proprio
>    `importoCent` — condividendo solo la spiegazione, oppure se vengono
>    fuse in una riga sola. La lettera («le cinque righe restano tutte
>    visibili sempre») indica la prima lettura, adottata qui (CL-11, CF-05),
>    ma il paragrafo sull'apertura non lo dice in modo inequivocabile.
> 2. Il «netto» non è una delle cinque voci della fixture — non ha un `id`,
>    non compare in `voci` — eppure la specifica lo descrive con lo stesso
>    linguaggio delle righe («non è apribile»). È un sesto elemento a
>    schermo, non la quinta delle cinque righe: non cambia il comportamento
>    atteso (C-10), ma il conteggio testuale della specifica è impreciso, ed
>    è più onesto segnalarlo che correggerlo in silenzio qui.
> 3. Il comportamento di `pesoInBp` per un importo che supera la base
>    (trattenuta più grande del lordo) o per un valore negativo non è
>    specificato per questa funzione condivisa, riusata da funzionalità
>    precedenti. CL-02 si limita a ciò che è calcolabile per sottrazione
>    semplice (netto = lordo − trattenute), senza assumere una convenzione
>    di segno che la specifica non fissa.
> 4. Nessuna bozza di spiegazione esiste per una voce con `categoria`
>    diversa da `entrata` o `imposta` (`canone`, `consumo`, `una-tantum`,
>    `altro`): tutte le cinque voci reali sono `entrata` o `imposta`. Questa
>    funzionalità **non usa** `LetturaCalcolata` (dichiarato dalla specifica
>    stessa) e quindi non ha il campo `nonClassificate` — ma ne condivide lo
>    spirito: CL-08 fissa solo il minimo garantito, riga visibile e nessun
>    crash, non il testo esatto.
> 5. Nessuna bozza esiste per il messaggio di quadratura che non torna, a
>    differenza delle cinque spiegazioni di voce, tutte scritte per esteso in
>    «Bozze delle stringhe». E-01 ed E-02 fissano il minimo garantito dalla
>    filosofia del progetto («nessuna schermata bianca, nessuna eccezione»),
>    non un testo letterale.
>
> Dove la specifica non decide, il caso è scritto comunque: risultato minimo
> derivabile dal testo, più la nota su cosa controllare in fase 2.

## 1. Percorso nominale

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | La quadratura sul cedolino reale | `verificaQuadratura` sul documento della fixture (5 voci: `+250000, -22975, -39025, -1800, -700`; `totaleDichiaratoCent: 185500`) | `sommaVociCent: 185500`, `totaleDichiaratoCent: 185500`, `scartoCent: 0`, `quadra: true` | È il presupposto silenzioso di tutta la schermata: se la quadratura non fosse verificata per prima, ogni percentuale calcolata dopo racconterebbe una storia coerente ma basata su un documento che non torna |
| C-02 | Lordo e totale trattenute calcolati dalle voci | le 5 voci della fixture, separate per segno di `importoCent` | `lordoCent: 250000` (2.500,00 €, l'unica voce con `importoCent > 0`); `totaleTrattenuteCent: 64500` (645,00 €, somma dei valori assoluti delle 4 voci negative) | Sono i due numeri da cui derivano tutti i pesi. Se uno dei due include o esclude la voce sbagliata (per esempio contando `Retribuzione lorda` come trattenuta), ogni percentuale successiva è coerente ma falsa |
| C-03 | I quattro pesi delle trattenute sul lordo, in punti base | le 4 trattenute e `lordoCent: 250000`, con `pesoInBp(Math.abs(importoCent), lordoCent)` | IVS `919` bp (9,19%) · IRPEF `1561` bp (15,61%) · regionale `72` bp (0,72%) · comunale `28` bp (0,28%) | Sono i quattro numeri che la persona legge aprendo ciascuna riga. Un solo peso impreciso rende falsa la frase mostrata sotto quella riga, anche se le altre tre sono giuste |
| C-04 | **Controllo incrociato 1** — i quattro pesi sommano esattamente a `trattenuteSulLordoBp` | i quattro pesi di C-03, confrontati con `trattenuteSulLordoBp = pesoInBp(64500, 250000)` | `919 + 1561 + 72 + 28 = 2580` bp, uguale a `trattenuteSulLordoBp` **senza scarto** | La specifica promette che «nessuna divisione dà resto» in tutta la catena: se questo controllo fallisse anche di un solo punto base, un arrotondamento si sarebbe insinuato dove non è previsto |
| C-05 | **Controllo incrociato 2** — trattenute e netto sul lordo sommano a 10000 bp | `trattenuteSulLordoBp: 2580` e `nettoSulLordoBp = pesoInBp(185500, 250000): 7420` | `2580 + 7420 = 10000` bp (100,00%), esatto | Se lordo, trattenute e netto sono calcolati con formule leggermente diverse fra loro (per esempio arrotondando due volte), questo è il controllo che lo rivela: le due metà del cedolino devono ricomporre l'intero |
| C-06 | **Controllo incrociato 3, il più importante** — il peso ricalcolato dell'IVS coincide con l'aliquota stampata sull'etichetta | il peso ricalcolato di `voce-02` da `importoCent` e `lordoCent` (919 bp), confrontato con il campo `voce-02.aliquotaBp` (919, il valore del `9,19%` stampato sull'etichetta) | I due valori sono **uguali, 919** | È l'unico controllo di questa lista verificato **contro il documento di carta**, non solo internamente fra numeri calcolati. Se il core calcolasse i pesi sul netto invece che sul lordo — l'errore concettuale più probabile, vedi nota in apertura — questo è il caso che lo mostrerebbe: sul netto l'IVS pesa 1.238 bp circa, non 919 |
| C-07 | Il numero di apertura della funzionalità: quanto arriva sul conto ogni 100 € di lordo | `nettoSuCentoEuroCent = Math.round(10_000 × 185500 / 250000)` | `7420` (74,20 €) | È testualmente «il numero che porta via» dichiarato dalla specifica in «Cosa deve poter fare dopo», ripetuto nella spiegazione della riga «Retribuzione lorda» e in quella del «Netto in busta»: se questo numero è sbagliato, lo è in due punti della schermata insieme, non in uno solo |
| C-08 | Il facsimile mostra le cinque righe, nell'ordine della fixture, con le etichette del documento invariate | le 5 voci della fixture | 5 righe, nell'ordine `voce-01`…`voce-05`; ogni `etichettaOriginale` compare **carattere per carattere identica** a quella della fixture; ogni importo a destra, cifre tabulari, in euro (`2.500,00 €`, `229,75 €`, `390,25 €`, `18,00 €`, `7,00 €`) | È il presupposto di ogni altro caso: un facsimile che riordina, arrotonda diversamente o riscrive anche una sola etichetta non è più un facsimile, è un riassunto — e la specifica vieta esplicitamente il riassunto |
| C-09 | L'apertura della riga dei contributi IVS mostra i quattro elementi richiesti | tap sulla riga `voce-02` | Un riquadro sotto la riga con: etichetta ripetuta identica (`Contributi IVS c/dipendente 9,19%`), importo (`229,75 €`), peso sul lordo (`9,19%`, cioè «9,19 € ogni 100 € di lordo»), una spiegazione di due o tre frasi con l'immagine concreta prima del nome tecnico (IVS spiegato prima di essere nominato) | È lo scenario di demo dichiarato letteralmente dalla specifica («in demo, dieci secondi»): se uno solo dei quattro elementi manca, la demo non mostra ciò che la specifica promette di mostrare |
| C-10 | Il riepilogo accumula le voci aperte, nell'ordine di apertura, senza far sparire le precedenti | aprire prima la riga IVS, poi la riga IRPEF | Il riepilogo mostra **entrambe** le voci, nell'ordine in cui sono state aperte (prima IVS, poi IRPEF): aprire la seconda non rimuove la prima. Il netto resta sempre visibile a parte, non apribile, ed è il valore più grande della schermata (`1.855,00 €`) | È la differenza dichiarata fra «promemoria» e «quiz»: se aprire una seconda voce sostituisse la prima invece di aggiungerla, chi ha aperto due voci su quattro si troverebbe con la sensazione di aver perso qualcosa, esattamente ciò che la specifica dice di voler evitare |

## 2. Casi limite e valori di confine

*Voce a importo zero, trattenuta più grande del lordo, cedolino a una sola
voce o a zero voci, importi a sette cifre, etichetta lunga con dati reali,
molte righe, una categoria che nessuna spiegazione copre, gli stati Vuoto e
In caricamento. Ogni documento qui sotto è costruito nel test, non è una
fixture nuova: `fixtures/` resta dell'architetto.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | Una voce con `importoCent: 0` | documento costruito nel test: lorda `+200000`, trattenuta `-50000`, trattenuta a importo zero `0` (es. «Conguaglio imposte precedente») | `pesoInBp(0, 200000) = 0` bp, mostrato come `0,00 €` e `0,00%` — la riga **resta visibile**, non sparisce e non causa un errore di divisione | Una riga a zero è tentata a sparire per «non aggiungere rumore»: farlo sarebbe la stessa alterazione per sottrazione di cui parla il criterio 3, solo con un motivo diverso (l'importo, non la mancanza di spiegazione) |
| CL-02 | Una trattenuta più grande del lordo | documento costruito nel test: lorda `+100000` (1.000,00 €), un'unica trattenuta `-150000` (-1.500,00 €), `totaleDichiaratoCent: -50000` (coerente: quadra) | Netto calcolato per sottrazione semplice, `100000 − 150000 = -50000` (**-500,00 €**), un valore negativo mostrato con il segno leggibile, non azzerato né mostrato in valore assoluto. Il peso della trattenuta (`pesoInBp(150000, 100000) = 15000` bp, 150,00%) non viene troncato a 10000 | Un cedolino con un recupero eccezionale più grande dello stipendio del mese è raro ma reale (arretrati da restituire, errori del mese precedente): un netto negativo silenziosamente azzerato nasconderebbe esattamente il caso in cui la persona ha più motivo di preoccuparsi |
| CL-03 | Cedolino con una sola voce (lista di un elemento) | documento costruito nel test: un'unica voce, `Retribuzione lorda +180000`, nessuna trattenuta | `lordoCent: 180000`, `totaleTrattenuteCent: 0`, `netto: 180000` (coerente, quadra); il facsimile mostra **una riga sola**; il riepilogo esiste ed è vuoto finché quella riga non viene aperta | Un contratto con zero trattenute (per esempio un tirocinio non imponibile) non deve rompere un layout pensato per quattro trattenute più il netto |
| CL-04 | Documento con `voci` vuoto (lista vuota) | documento costruito nel test: `voci: []`, `totaleDichiaratoCent: 0` (coerente) | `lordoCent: 0`, `totaleTrattenuteCent: 0`, `quadra: true` (0 = 0); il facsimile non mostra righe, ma dice esplicitamente che non c'è nessuna voce da leggere — non una tabella vuota senza spiegazione | **Non riproducibile con l'app in esecuzione oggi**: la fixture reale ha sempre 5 voci, e non esiste un modo da interfaccia per svuotarla. Verificabile solo se il componente accetta un documento esterno, altrimenti da leggere isolato in fase 2 |
| CL-05 | Importi a sette cifre | documento costruito nel test: lorda `+1234567` (12.345,67 €), una trattenuta `-300000` (3.000,00 €), netto `934567` (9.345,67 €, coerente) | Le colonne restano allineate a destra, cifre tabulari, nessuna sovrapposizione fra l'importo e l'etichetta a sinistra. Peso della trattenuta: `300000 × 10000 / 1234567 ≈ 2430` bp (24,30%), calcolabile e verificabile a mano | Un cedolino con un premio annuale o un arretrato consistente ha cifre a sette figure più spesso di quanto sembri: è il caso che, per il template di design, «rompe le griglie» |
| CL-06 | Etichetta lunga che va a capo — **con dati reali, non costruiti** | la voce reale `voce-02`, etichetta `Contributi IVS c/dipendente 9,19%` (già la più lunga delle cinque) | L'etichetta va a capo su più righe se necessario, senza staccarsi dal proprio importo (`229,75 €`) e senza spingere la colonna dei numeri fuori dall'allineamento a destra | A differenza di molti casi «dati lunghi» di altre funzionalità, questo è **riproducibile oggi con la fixture reale**, senza costruire nulla: è la specifica stessa a dichiarare questa etichetta «già lunga» |
| CL-07 | Il layout regge trenta righe | documento costruito nel test: 1 voce lorda `+5000000` (50.000,00 €) e 29 trattenute da `-100000` ciascuna (1.000,00 € l'una, 29.000,00 € in totale); netto `2100000` (21.000,00 €, coerente) | Trenta righe visibili, nessuna barra di scorrimento orizzontale, la griglia non si rompe. Verifica di coerenza: 29 pesi da `200` bp ciascuno (`2,00%`) sommano a `5800` bp di trattenute, il netto pesa `4200` bp, insieme `10000` | **Non riproducibile con l'app in esecuzione oggi**: la fixture reale ne ha cinque. Un cedolino vero ne ha spesso più di trenta (voci di dettaglio, arretrati, rimborsi): il caso che rompe le griglie non è un'invenzione da manuale, è la norma sui cedolini reali |
| CL-08 | Una voce con `categoria` che nessuna delle cinque spiegazioni scritte copre | documento costruito nel test: le 5 voci reali più una sesta, «Quota welfare aziendale», `categoria: 'canone'`, `importoCent: -1500` (-15,00 €); nuovo netto `184000` (coerente) | La riga **resta visibile** con la propria etichetta e il proprio importo (peso: `1500 × 10000 / 250000 = 60` bp, 0,60%); l'apertura non genera un errore né un testo palesemente sbagliato copiato da un'altra voce | La specifica non scrive una spiegazione per `canone`/`consumo`/`una-tantum`/`altro` in un cedolino — non ne aveva bisogno, perché la fixture di oggi non ne contiene. Il giorno in cui un cedolino reale ne avrà una, questa riga non deve sparire né mentire su cosa sia |
| CL-09 | **Stato Vuoto**: nessuna voce ancora aperta | la pagina al primo caricamento, con la fixture reale | Il cedolino è intero e leggibile; una riga dice che toccando una voce compare da dove viene quel numero; il riquadro del riepilogo esiste già e dice che si riempirà — non «nessun risultato» | È lo stato in cui la persona atterra per prima: se sembra un errore o una schermata incompleta, la funzionalità perde la persona prima che tocchi la prima riga |
| CL-10 | **Stato In caricamento**: la fixture è una costante, il calcolo è immediato | la pagina dal primo istante in cui si apre | Nessuna rotellina, nessun testo «caricamento in corso»: le cinque righe e i loro importi sono già presenti al primo render. Il riquadro della spiegazione occupa il suo spazio anche da chiuso, così aprire una voce non sposta ciò che sta sotto | Lo stato è richiesto dal design ma qui è quasi un non-evento, e la specifica lo dice esplicitamente: il caso serve a impedire che qualcuno aggiunga un'attesa finta dove i dati sono già tutti in memoria |
| CL-11 | Le due addizionali restano **due righe distinte** anche se condividono la spiegazione | tap su `voce-04` (Addizionale regionale IRPEF, -18,00 €, peso individuale 72 bp) e, separatamente, su `voce-05` (Addizionale comunale IRPEF, -7,00 €, peso individuale 28 bp) | Ciascuna riga mostra la **propria** etichetta e il **proprio** importo individuale nel facsimile; la spiegazione che si apre toccando l'una o l'altra è la stessa, e cita il valore combinato («insieme sono 25,00 € su 2.500,00 €, cioè 1,00 € ogni 100 €» — 72 + 28 = 100 bp), ma il facsimile non fonde mai le due righe in una sola con etichetta o importo sommati | È il punto meno deciso dalla specifica (vedi nota in apertura) e il più a rischio per il criterio 3: fondere due righe distinte del documento per condividerne la spiegazione sembra un semplice risparmio di spazio, ma è la stessa alterazione per sottrazione di cui parla la specifica, solo travestita da fusione invece che da sparizione |

## 3. Errori attesi

*Qui i dati non sono digitati da una persona — sono scritti a mano nella
fixture — ma un errore mostrato male resta un difetto anche quando la causa
è un refuso di chi ha scritto il documento, non di chi usa il sito. Il caso
che la specifica dichiara come quello che «può davvero succedere» è la
quadratura che non torna: gli errori qui sotto ruotano tutti attorno a
quello.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | **La quadratura non torna, e la schermata lo dice in linguaggio umano** | documento costruito nel test: le 5 voci reali, invariate (somma `185500`), ma `totaleDichiaratoCent: 185501` — lo stesso scarto di 1 centesimo che la specifica assegna al test unitario di `core-engine` | `scartoCent: 1`, `quadra: false`; la schermata mostra una frase comprensibile che segnala l'incongruenza e riporta lo scarto in euro (`0,01 €`), non una schermata bianca né un'eccezione che interrompe il rendering | È l'unico errore che la specifica dichiara esplicitamente possibile («il caso che può davvero succedere»). Lo stesso input è usato dal test unitario di `core-engine` (che verifica il numero), ma qui si verifica una cosa diversa: che quel numero **arrivi fino allo schermo** in una forma leggibile — la divisione di responsabilità dichiarata fra i due agenti |
| E-02 | **Il messaggio non usa gergo tecnico** | lo stesso scarto di E-01 | Il testo non contiene nomi di variabili (`scartoCent`, `quadra`, `false`) né espressioni come «errore di validazione»: usa parole comuni, sul modello di `simulazioneRisparmioErroreTasso` già in uso altrove nel sito | Il testo esatto non è specificato dalla specifica (nessuna bozza esiste per questo stato, a differenza delle cinque spiegazioni di voce): questo caso fissa solo il vincolo di stile minimo, non le parole letterali |
| E-03 | **Nessuna correzione silenziosa** | lo stesso scarto di E-01 | Il numero mostrato come «quello che arriva sul conto» resta `1.855,01 €` — il valore **stampato/dichiarato** sul documento (`totaleDichiaratoCent`) — non un valore aggiustato per far tornare i conti; le cinque voci restano ai loro importi originali, nessuna viene ricalcolata per compensare lo scarto | È testuale nella specifica: «il core lo confronta con la somma delle voci e segnala lo scarto, non lo corregge». Un cedolino che non torna è un'informazione da mostrare, non un guasto da nascondere correggendolo in silenzio |
| E-04 | Il messaggio di scarto ha un paragone concreto, non un numero nudo | lo stesso scarto di E-01 | Lo scarto è espresso in euro (`0,01 €`), non come un numero grezzo di centesimi (`1`) o una percentuale astratta | «Ogni numero ha un paragone concreto» vale anche per gli errori: un numero di centesimi senza unità è esattamente il tipo di cifra nuda che il progetto vieta altrove |
| E-05 | **Il messaggio di errore si legge anche senza vedere il colore** | il messaggio di E-01/E-03, con qualunque colorazione (rosa o altro) gli venga assegnata | Il messaggio è testo leggibile a sé stante — corpo ≥16px, contrasto ≥4,5:1 — non solo un bordo o uno sfondo colorato | Chi non distingue quel colore, o guarda una copia in bianco e nero, deve poter leggere la stessa cosa a parole: altrimenti l'unico punto della schermata in cui qualcosa non torna è invisibile a una parte di chi guarda |

## 4. Conformità

*Richiama la suite dei guardrail, non la riscrive: il lessico vive in
`src/guardrails/lessico.ts` ed è scandito da `tests/lessico-ui.test.ts`.
CF-01 – CF-02 richiamano quella copertura; da CF-03 in poi ci sono i
controlli specifici di questa funzionalità — in particolare il criterio 3,
il rischio principale dichiarato in apertura — e quelli che la suite
generale non fa perché sono di contenuto, non di lessico.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo sulle stringhe nuove | le chiavi nuove in `testiBustaPaga.ts` (spread in `STRINGHE_UTENTE`), incluse le cinque bozze di spiegazione | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico | Richiamo alla suite esistente: elencare di nuovo qui i termini vietati farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Identificatori del codice | nomi introdotti da questa funzionalità: `letturaBustaPaga`, `PaginaBustaPaga`/`GuidaDocumento`, `RigaDocumento`, `RiepilogoVoci`, `testiBustaPaga` | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Il vincolo vale anche dove l'utente non legge, e questi nomi sopravviveranno più a lungo delle stringhe a schermo |
| CF-03 | **Le etichette del cedolino non vengono riscritte** | le cinque `etichettaOriginale` della fixture, in particolare `Contributi IVS c/dipendente 9,19%` | Compaiono **letterali, invariate**, sia nei dati calcolati (`rifOriginale`/etichetta) sia a schermo, riga aperta o chiusa | Il rischio principale dichiarato per questa funzionalità: un caso deve fallire se qualcuno «traduce» un'etichetta per renderla più chiara, perché chi confronta lo schermo con la carta non ritroverebbe più quella riga |
| CF-04 | **Nessuna voce scompare dal facsimile** | le cinque righe della fixture, indipendentemente da quali sono state aperte o da quali hanno una spiegazione dedicata | Tutte e cinque compaiono sempre nel facsimile, mai condizionate allo stato di apertura, alla presenza di una spiegazione o al valore dell'importo (vedi anche CL-01, CL-08) | È testuale nella specifica: «spiegarne quattro e far sparire la quinta sarebbe alterare il documento per sottrazione» |
| CF-05 | **Le due addizionali restano due righe indipendenti** | `voce-04` e `voce-05` | Compaiono come **due righe separate** nel facsimile, ciascuna con la propria `etichettaOriginale` e il proprio `importoCent` (18,00 € e 7,00 €), mai fuse in un'unica riga con etichetta o importo combinati — anche condividendo la spiegazione (vedi CL-11) | Diretta conseguenza del criterio 3 nel punto più ambiguo della specifica: un accorpamento visivo sarebbe un'alterazione per fusione, con lo stesso effetto sul documento originale di una sparizione |
| CF-06 | **Il confine «spiega e si ferma»** | tutte le stringhe nuove di questa funzionalità | Nessun giudizio sulla correttezza dello stipendio: niente «quanto dovresti guadagnare», niente «verifica se ti stanno pagando il giusto», nessun confronto con medie di categoria o contratti collettivi | È un confine di **contenuto**, non di lessico: nessuna delle parole della frase è necessariamente fra quelle vietate dal regex, quindi CF-01 da solo non lo intercetterebbe. Va riletto a mano da `guardrail-officer`, come previsto da `scrittura-e-accessibilita.md` |
| CF-07 | Nessun ricalcolo delle trattenute | gli importi delle quattro trattenute | Il core usa solo gli importi stampati sul documento (`importoCent`) e calcola esclusivamente rapporti fra loro — pesi, totale, quadratura. Nessuna formula IRPEF a scaglioni, nessuna ricostruzione di un importo diverso da quello scritto sul cedolino | Rifare il calcolo direbbe implicitamente «il numero sul tuo cedolino dovrebbe essere questo»: è la consulenza personalizzata che il prodotto vieta, ed è anche il confine esplicito con il task 08 |
| CF-08 | Nessuna chiamata di rete | la pagina della guida, build di produzione, Wi-Fi spento | Funziona per intero offline: il cedolino è importato staticamente dalla fixture, mai recuperato | Il documento è «uno solo, dichiarato, strutturato a mano» (sezione Input della specifica): non deve mai dipendere da una rete, nemmeno per un aggiornamento futuro |
| CF-09 | Nessun collegamento a una pagina che non esiste ancora | l'intera schermata | Nessun link o bottone verso un «simulatore del netto» (task 08): quella pagina non ha ancora né spec né schermata | Dichiarato esplicitamente in «Cosa questa funzionalità NON fa»: un collegamento a una pagina inesistente è una promessa rotta, non una funzionalità in più |
| CF-10 | Nessun campo di inserimento, nessun dato conservato | l'intera schermata, dal caricamento a un'uscita e un rientro | Nessun campo da compilare, nessun dato personale richiesto; il riepilogo delle voci aperte non sopravvive a un ricaricamento della pagina | «Non chiede e non conserva niente»: chi ricarica la pagina per errore non deve temere che qualcosa di suo sia rimasto da qualche parte, perché non c'è mai stato niente da conservare |
| CF-11 | I quattro stati obbligatori esistono tutti | la pagina della guida | Vuoto (CL-09, con dati reali), In caricamento (CL-10, con dati reali), Errore (E-01, segnalato), Dati lunghi o numerosi (CL-05/CL-06/CL-07, CL-06 con dati reali, CL-05 e CL-07 segnalati): tutti e quattro individuati, anche quando non eseguibili sull'app dal vivo con la sola fixture di oggi | «Una schermata che esiste solo nel caso perfetto non è finita» — qui si dichiara esplicitamente quali dei quattro stati si vedono oggi cliccando e quali solo leggendo il codice in fase 2 |
| CF-12 | Accessibilità di base, dichiarata «la funzionalità e non un contorno» dalla specifica | tastiera e lettura, sull'intera pagina | Righe apribili come bottoni veri (raggiungibili con Tab, `aria-expanded`, focus visibile, area ≥44×44 px); l'evidenziazione della riga toccata (bordo **e** fondo) resta senza bisogno del mouse; ordine di tabulazione uguale all'ordine di lettura del cedolino; nessun limite di tempo | Questa è la pagina in cui una persona confronta un documento vero con lo schermo: è il posto sbagliato per un'interfaccia che qualcuno non riesce a usare con la sola tastiera |
| CF-13 | La navigazione non cambia posizione | arrivo alla guida busta paga dalla home (area «Il lavoro»), confrontato con le altre pagine del sito | «Indietro» e il menu nella stessa posizione fissata dalle altre schermate | Richiamo, non ripetizione del percorso già scritto da `doc-funzionale`: una pagina nuova è esattamente il punto in cui la coerenza di navigazione si perde per disattenzione |

---

## Referto

*Scritto da `tester` in **fase 2**, dopo aver implementato ed ESEGUITO i casi
qui sopra. Vuota di proposito: la fase 2 non è stata avviata — il codice di
questa funzionalità non esiste ancora.*
