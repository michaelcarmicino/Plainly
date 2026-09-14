# 13 — casi di prova per «Da dove vengono i numeri di questo sito»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/13-tabella-fonti-dati-sorgente-unica.md` — **non dal codice**.
> `src/core/registroFonti.ts` esiste già, e proprio per questo non è stato
> letto: leggerlo avrebbe fatto scrivere casi che confermano il codice invece
> di misurare la specifica.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», il percorso
> nominale in undici passi già scritto in `## Previsto` → `### Come si
> proverà`. Qui si scrive **cosa può andare storto**.
>
> **Non c'è una formula.** Questa funzionalità non calcola nulla: dichiara la
> provenienza di un numero già calcolato altrove. Il «risultato atteso» di
> ogni caso è quindi ricavato parola per parola dal contratto testuale della
> specifica — i tre campi di `provenienzaCompleta`, il fallimento dichiarato
> di `valoreBpDi`, i cinque elementi di ogni riga — non da un'aritmetica.
>
> **Tre punti su cui la specifica non decide la testabilità**, segnalati e non
> indovinati:
> 1. Se `fonteDi(id)` e `valoreBpDi(id)` accettino solo l'`id` — risolto contro
>    la costante interna — o anche un registro passato dall'esterno. Da questo
>    dipende se «id duplicato» (CL-04) e «riga in centesimi» (CL-07) sono
>    eseguibili oggi o solo leggibili nel test unitario di `core-engine`.
> 2. Se `PaginaFonti` importi la costante direttamente o riceva il registro
>    come dato esterno. Da questo dipende se «registro a zero righe»,
>    «trenta righe» e «riga con uso incoerente» (CL-10, CL-12, E-01) sono
>    raggiungibili con l'app in esecuzione oggi o solo nel test unitario.
> 3. Se esista una funzione che trasforma `dataInserimento` in lettere, o se la
>    trasformazione sia scritta dentro il componente. Da questo dipende come si
>    esegue CL-11.
>
> Dove la specifica non decide, il caso è scritto comunque: risultato minimo
> derivabile dal testo, più la nota su cosa controllare in fase 2.

## 1. Percorso nominale

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | La riga con cui il registro parte oggi risponde con tutti i campi dichiarati | `fonteDi('inflazione-nic')` | `Esito` con `ok: true` e una riga uguale, campo per campo, a quella della specifica: `valore 200` · `unita 'punti-base'` · `fonte 'ISTAT'` · `indicatore 'indice NIC'` · `periodo null` · `dataInserimento '2026-09-14'` | È la riga che tutta la funzionalità esiste per rendere raggiungibile. Se anche un solo campo non torna, ogni numero futuro che si appoggerà al registro (08, 10) eredita il difetto |
| C-02 | `valoreBpDi` riesce quando l'unità è quella giusta | `valoreBpDi('inflazione-nic')` | `Esito` con `ok: true` e valore **200** | È il ramo «va bene» della stessa funzione il cui ramo di fallimento è CL-07. Senza questo caso, una funzione che fallisse sempre supererebbe comunque CL-07 |
| C-03 | `provenienzaCompleta` è **ricavata**, non un interruttore: sulla riga reale di oggi risulta incompleta perché manca un solo campo su tre | `provenienzaCompleta` sulla riga `'inflazione-nic'`: `periodo: null`, `fonte: 'ISTAT'` (non vuota), `dataInserimento: '2026-09-14'` (non vuota) | **`false`** — non perché tutto manchi, ma perché **uno solo** dei tre controlli (`periodo !== null`) non è soddisfatto | È la generalizzazione del vecchio flag `periodoDaCompilare`. Se qualcuno la riscrivesse come booleano scritto a mano, questo test da solo non lo mostrerebbe: va letto insieme a CL-01, che prova il ramo opposto |
| C-04 | L'elenco delle righe da completare trova la riga reale | `righeConProvenienzaIncompleta` sul registro reale (una riga) | Un array di lunghezza **1** contenente l'id `'inflazione-nic'` | È il numero che la schermata mostra in testa. Se l'elenco fosse vuoto quando dovrebbe contenere la riga, la pagina direbbe che tutto è a posto quando non lo è |
| C-05 | **Il secondo registro parallelo non esiste**: il valore dell'inflazione compare in un punto solo | Confronto fra `INFLAZIONE_DICHIARATA.valoreBp` (da `inflazioneDichiarata.ts`, usato dalla nota sotto il risultato della 07) e il campo `valore` della riga `'inflazione-nic'` del registro | I due valori sono **uguali, 200** — e lo restano perché il secondo è una vista ricavata dal primo, non un numero scritto una seconda volta | È la promessa esplicita di «Come `inflazioneDichiarata.ts` confluisce qui». Se un domani qualcuno corregge il 200 in un solo dei due file, è esattamente ciò che questo caso deve far emergere: C-01 da solo non lo scoprirebbe, perché guarda solo il registro |

## 2. Casi limite e valori di confine

*Zero, id inesistenti, righe duplicate, periodi incoerenti, registro a una riga sola o a molte, stati vuoto/caricamento/dati-lunghi.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | `provenienzaCompleta` nel verso opposto: una riga ipotetica con tutti e tre i campi presenti | riga costruita nel test: `periodo: { inizio: 2015, fine: 2025 }`, `fonte: 'ISTAT'`, `dataInserimento: '2026-01-01'` | **`true`** | C-03 da solo prova che la funzione sa dire «no». Questo prova che sa anche dire «sì» quando è vero: una funzione tarata per restituire sempre `false` supererebbe C-03 ma non questo. **Non riproducibile con l'app in esecuzione oggi** (nessuna riga reale è completa): eseguibile chiamando la funzione con una riga costruita nel test, perché `provenienzaCompleta(riga)` prende la riga direttamente e non un `id` da cercare |
| CL-02 | Registro senza righe, alla funzione che estrae le incomplete | `righeConProvenienzaIncompleta([])` | Array **vuoto** `[]`, non un errore | Zero righe è uno stato previsto esplicitamente («Registro senza righe» nello stato Vuoto). La funzione deve restituire «niente da completare», non confondere «vuoto» con «non valido» |
| CL-03 | L'elenco delle incomplete non include quelle già complete | registro costruito nel test con due righe: una completa (`periodo`, `fonte`, `dataInserimento` tutti valorizzati), una uguale alla riga reale di oggi (incompleta) | Array di lunghezza **1**, con solo la riga incompleta | Se la funzione restituisse anche la riga completa, la schermata elencherebbe come «da completare» un numero che non lo è: l'errore opposto a quello che la funzionalità esiste per evitare |
| CL-04 | Righe duplicate con lo stesso `id` | registro costruito nel test con due righe che condividono `id: 'inflazione-nic'`, entrambe incomplete | La specifica non impone una deduplicazione: **entrambe** compaiono nell'elenco (lunghezza 2), perché la funzione descritta è un filtro su tutte le righe, non un indice per chiave | **La specifica non decide se un `id` duplicato sia un errore da segnalare.** Il risultato qui è il minimo derivabile dal comportamento dichiarato; se in fase 2 il codice fa altro, è la specifica a dover essere completata, non il codice a essere sbagliato |
| CL-05 | `id` che non esiste nel registro | `fonteDi('id-che-non-esiste')` | `Esito` con **`ok: false`** e un codice di errore — mai un `throw`, mai un valore restituito in silenzio | Il tipo `Esito<T>` esiste apposta perché chi chiama sia costretto dal compilatore a gestire il fallimento. Una funzione che invece lancia un'eccezione qui rompe ogni chiamante che non se lo aspetta |
| CL-06 | Stesso principio sulla funzione del valore in punti base | `valoreBpDi('id-che-non-esiste')` | `Esito` con **`ok: false`** | Un `id` sbagliato è l'errore più comune per chi collega una funzionalità nuova (08, 10) al registro: deve fallire in modo gestibile ovunque venga chiesto |
| CL-07 | **Chiedere punti base a una riga in centesimi deve fallire, non convertire** | riga ipotetica con `unita: 'centesimi'`, interrogata con `valoreBpDi` | `Esito` con **`ok: false`** — mai un numero, nemmeno convertito | È l'errore che, per parola esplicita della specifica, questa struttura esiste per rendere impossibile in silenzio. **Non riproducibile oggi con il registro reale**, che ha una sola riga ed è in punti base: nessuna riga in centesimi esiste per interrogare `valoreBpDi` dal vivo. Verificabile solo se la funzione accetta una riga o un registro costruiti nel test; altrimenti resta leggibile solo in `registroFonti.test.ts` di `core-engine`, da segnalare come tale in fase 2 |
| CL-08 | **Periodo con `inizio` dopo `fine`** | riga altrimenti completa (`fonte` e `dataInserimento` non vuote) con `periodo: { inizio: 2020, fine: 2010 }` | Per la lettera della specifica, `provenienzaCompleta` guarda solo `periodo !== null`: il risultato è **`true`**, un periodo logicamente invertito **non** viene rilevato | **Segnalato, non indovinato**: la specifica non promette un controllo di coerenza fra `inizio` e `fine`. Questo caso fissa che cosa succede *oggi*, con il contratto scritto; se il comportamento voluto è un altro, deve dirlo la specifica |
| CL-09 | **Lo stato reale di oggi: nessuna riga ha provenienza completa** | la pagina delle fonti, registro reale (una riga, quella dell'inflazione) | La riga è dichiarata a **provenienza incompleta**: compare una frase esplicita che dice che il periodo non è ancora stabilito, in **rosa `#FF50A0`** — non un trattino, non un campo vuoto | **È il caso più importante di tutta questa lista.** Non è un'invenzione per completezza: è ciò che chiunque vede aprendo la pagina oggi. Se questo caso fallisse, la funzionalità avrebbe fallito il suo unico scopo dichiarato |
| CL-10 | **Registro a zero righe, come stato della pagina** (non solo della funzione di CL-02) | la pagina delle fonti con un registro vuoto | La pagina dice che qui compariranno i numeri usati nel sito — non «nessun risultato» | **Non riproducibile con l'app in esecuzione oggi**: il registro compilato ha sempre almeno la riga dell'inflazione, e non esiste un modo da interfaccia per svuotarlo. A differenza di CL-02 (la funzione, testabile passandole `[]` a mano), questo è lo stato del **componente**: eseguibile solo se `PaginaFonti` accetta un registro esterno, altrimenti da verificare leggendo il componente isolato in fase 2. È un buco che né la specifica né `doc-funzionale` avevano reso esplicito, perché il percorso di demo parte da un registro che una riga già ce l'ha |
| CL-11 | **La data scritta a mano si legge in lettere, senza spostamenti di un'unità** | `dataInserimento: '2026-09-14'` | Il giorno è **14** (non 13 né 15), il mese è **settembre** (il nono, non l'ottavo né il decimo), l'anno è **2026** in cifre piene — qualcosa come «scritto qui il 14 settembre 2026» | I mesi scritti a mano in un array si contano facilmente in modo sbagliato di uno (`'09'` letto come indice 9 di un array che parte da 0 è ottobre, non settembre). Un confronto con *un solo* mese qualunque non lo scoprirebbe se lo scarto fosse casuale: qui il mese è verificato per nome |
| CL-12 | **Molte righe, nomi di fonte lunghi, importi a sette cifre** | un registro con trenta righe, alcune con `fonte: 'Agenzia delle Entrate'` e `valore` a sette cifre | Le etichette vanno a capo, i numeri restano **allineati a destra** e **tabulari**, nessuna barra di scorrimento orizzontale, la griglia non si rompe | **Non riproducibile con l'app in esecuzione oggi**, come già segnalato da `doc-funzionale` al passo 9 di «Come si proverà»: il registro reale ha una sola riga. Confermato qui dal lato del `tester`: da verificare in fase 2 leggendo `registroFonti.test.ts` o un test di componente con dati costruiti, non cliccando sulla pagina |
| CL-13 | **Nessuno stato di caricamento visibile**: il registro è una costante, non un dato atteso | la pagina delle fonti, dal primo istante in cui si apre | Nessuna rotellina, nessun testo «caricamento in corso»: le righe sono già presenti al primo render | È lo stato «in caricamento» richiesto dal design, ma qui è quasi un non-evento: la specifica lo chiarisce («il registro è una costante compilata dentro la pagina»). Il caso serve a impedire che qualcuno aggiunga un finto stato di attesa dove non ne serve uno |
| CL-14 | **Il formattatore dipende dall'unità della riga, non da una convenzione fissa** | una riga ipotetica in `'centesimi'` e una in `'punti-base'`, mostrate nella stessa pagina | La riga in centesimi passa da `formattaEuro`, quella in punti base da `formattaPercentuale`: la scelta segue il campo `unita`, non l'ordine o il nome della riga | **Non riproducibile oggi**: l'unica riga reale è in punti base, quindi il ramo `formattaEuro` non viene mai esercitato dal vivo. Quando (08, 10) arriverà una riga in centesimi con il ramo sbagliato collegato, il numero apparirebbe come una percentuale — un errore visibile solo quando è già troppo tardi per prevenirlo |

## 3. Errori attesi

*Cosa succede quando i dati non sono validi, e come lo vede la persona. Qui i dati non sono digitati da un utente — sono scritti a mano nel registro — ma un errore mostrato male resta un difetto anche quando la causa è un refuso di chi ha scritto il codice.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | **Una riga con un uso incoerente non sparisce e non rompe la pagina** | una riga che, nel punto in cui viene mostrata, richiede il valore in un'unità diversa da quella dichiarata (l'incoerenza descritta dallo stato «Errore» della specifica) | La riga **resta al suo posto**; al posto del numero compare una frase in linguaggio umano, sul modello di `simulazioneRisparmioErroreTasso` — non una riga saltata in silenzio, non una pagina bianca | **Non riproducibile con il registro reale di oggi**, che ha una sola riga coerente: già segnalato da `doc-funzionale` al passo 9. È il comportamento «peggiore evitato» dichiarato esplicitamente dalla specifica: nascondere una riga rotta toglierebbe alla pagina proprio ciò per cui esiste. Va verificato comunque in fase 2, sul test unitario o su un componente isolato con una riga costruita apposta |
| E-02 | **`dataInserimento` scritta a mano in un formato non valido** | valori come `'2026-13-40'` (mese e giorno fuori intervallo), `''` (vuota), oppure testo libero come `'ieri'` | Il minimo garantito dalla filosofia del progetto (`Esito`, mai un errore che interrompe il rendering): **nessuna schermata bianca**, nessuna eccezione che fa sparire l'intera pagina | **La specifica non dice quale testo esatto mostrare** in questo caso: dichiara solo la forma attesa (`'AAAA-MM-GG'`), non il comportamento su un valore fuori forma. Il caso resta scritto con il risultato minimo derivabile; il testo esatto è una lacuna da segnalare, non da inventare |
| E-03 | **Una `fonte` vuota basta da sola a rendere la provenienza incompleta** | riga con `periodo` valorizzato e `dataInserimento` non vuota, ma `fonte: ''` | `provenienzaCompleta` restituisce **`false`** | I tre controlli sono un AND, non una gerarchia: nessuno dei tre da solo basta. C-03 guarda solo `periodo`: serve un caso in cui **proprio** `periodo` è a posto e qualcos'altro manca |
| E-04 | Stesso principio sul terzo campo | riga con `periodo` valorizzato e `fonte` non vuota, ma `dataInserimento: ''` | `provenienzaCompleta` restituisce **`false`** | Completa la prova che tutti e tre i campi contano allo stesso modo: dopo E-03 ed E-04, nessuno dei tre controlli resta mai provato a metà |
| E-05 | `id` vuoto, non solo inesistente | `fonteDi('')` | `Esito` con **`ok: false`**, con lo stesso trattamento di un `id` qualunque non trovato — nessun ramo speciale che distingue «vuoto» da «sbagliato» | Una stringa vuota è il valore che arriva più spesso per un errore di programmazione (una variabile non ancora valorizzata passata per sbaglio): deve fallire in modo prevedibile come ogni altro `id` sconosciuto |
| E-06 | **La dichiarazione di provenienza incompleta si legge anche senza vedere il colore** | la riga in rosa di CL-09 | Il messaggio è **testo leggibile** («il periodo non è stato ancora stabilito», o equivalente), non solo un bordo o uno sfondo colorato: corpo ≥16px, contrasto ≥4,5:1 | Il rosa comunica a chi lo distingue. Chi non distingue quel colore, o guarda una copia in bianco e nero, deve poter leggere la stessa cosa a parole — altrimenti l'unico punto della pagina in cui il prodotto dichiara un proprio limite è invisibile a una parte di chi guarda |

## 4. Conformità

*Richiama la suite dei guardrail, non la riscrive: il lessico vive in
`src/guardrails/lessico.ts` ed è scandito da `tests/lessico-ui.test.ts`, che
cammina già su tutto `src/`, `src/core/` compreso — `registroFonti.ts` è
coperto dal giorno in cui esiste. CF-01 – CF-03 richiamano quella copertura;
da CF-04 in poi ci sono i controlli che questa funzionalità introduce e che
la suite generale non fa.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo sulle stringhe nuove | le chiavi nuove in `src/ui/testiFonti.ts` (`fontiOcchiello`, `fontiTitolo`, `fontiIntro`, `fontiColonnaValore`, `fontiColonnaFonte`, `fontiColonnaPeriodo`, `fontiInserito`, `fontiPeriodoMancante`, `fontiAggiornamentoManuale`, `fontiVuoto`, `fontiNessunaCompleta`, `fontiErroreRiga`, `fontiNomeInflazione`, `fontiLimitiTitolo`, `fontiLimiteAggiornamento`) | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico | Richiamo alla suite esistente: elencare di nuovo qui i termini vietati farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Identificatori del codice | nomi introdotti da questa funzionalità: `registroFonti`, `PaginaFonti`, `provenienzaCompleta`, `fonteDi`, `valoreBpDi`, `righeConProvenienzaIncompleta`, `RigaFonte` | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Stesso richiamo: il vincolo vale anche dove l'utente non legge, e questi nomi sopravviveranno più a lungo delle stringhe a schermo |
| CF-03 | I nomi propri della fonte non vengono riscritti | `'ISTAT'`, `'indice NIC'` | Compaiono **letterali, invariati**, sia nel registro sia a schermo | Già coperto: `tests/lessico-ui.test.ts` scandisce i letterali di tutto `src/`. Non serve un test nuovo, solo la conferma che nessuno li ha «semplificati» traducendoli |
| CF-04 | **Il rosa `#FF50A0` compare solo sulla riga a provenienza incompleta** | l'intera pagina delle fonti | Nessun altro elemento — bordi, titoli, sfondi decorativi — usa quel colore | Controllo **nuovo**, introdotto da questa funzionalità: non è nel lessico testuale, è una regola di design («il colore di ciò che il prodotto non fa»). Usarlo altrove per decorare toglierebbe senso all'unico punto in cui la specifica lo richiede |
| CF-05 | Nessuna chiamata di rete | la pagina delle fonti, build di produzione con il Wi-Fi spento | Funziona per intero: il registro è una costante nel codice, non un dato recuperato | Richiamo al controllo esistente sul bundle: questa funzionalità esiste apposta per rendere manuale ciò che altrimenti si sarebbe tentati di far arrivare da una rete |
| CF-06 | **Nessuna riga viene presentata come completa se manca anche un solo elemento** | i tre controlli di `provenienzaCompleta`, verificati uno alla volta (C-03, E-03, E-04) e nel verso opposto (CL-01) | In tutti e quattro i casi il risultato segue esattamente l'AND dei tre campi, mai un'approssimazione | Roll-up del principio guida di questa funzionalità: non è un test in più, è la dichiarazione che i quattro casi sopra, letti insieme, coprono i tre campi e i due versi (completo/incompleto) senza lasciarne fuori uno |
| CF-07 | I quattro stati obbligatori esistono tutti | la pagina delle fonti | Vuoto (CL-09 con dati reali, CL-10 con registro a zero righe — segnalato), in caricamento (CL-13), errore (E-01 — segnalato), dati lunghi (CL-12 — segnalato): tutti e quattro individuati, anche quando non eseguibili sull'app dal vivo | Una schermata che esiste solo nel caso perfetto non è finita. Due dei quattro stati non sono verificabili end-to-end con i dati di oggi: dichiararlo è meglio che ometterlo |
| CF-08 | Accessibilità di base della pagina | tastiera e lettura, sulla pagina delle fonti | Corpo ≥16px, contrasto ≥4,5:1 su ogni testo (compresa la riga in rosa: vedi E-06), aree cliccabili ≥44px, focus sempre visibile, nessuna informazione disponibile solo al passaggio del mouse, ordine di tabulazione coerente | Siamo a un hackathon sull'inclusione, e questa è la pagina che spiega da dove vengono i numeri a chi ha meno motivo di fidarsi: è il posto sbagliato per un'interfaccia che qualcuno non riesce a usare |
| CF-09 | La navigazione non cambia posizione | arrivo alla pagina delle fonti da `NotaTasso`, confrontato con le altre pagine del sito | «Indietro» nella stessa posizione fissata dalle altre schermate | Richiamo, non ripetizione del percorso già scritto da `doc-funzionale`: una pagina nuova è esattamente il punto in cui la coerenza di navigazione si perde per disattenzione |

---

## Referto

*Scritto da `tester` in **fase 2**, dopo aver implementato ed ESEGUITO i casi
qui sopra in `tests/accettazione/13-tabella-fonti.test.ts`. Finché questa
sezione non esiste, la fase 2 non è stata fatta e la funzionalità non è
finita.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
