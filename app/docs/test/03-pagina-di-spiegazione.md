# 03 — casi di prova per «La pagina che risponde a una domanda: il contenitore, non il contenuto»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/03-pagina-di-spiegazione-struttura-riusabile.md` — **non dal
> codice**, che per le parti nuove di questa funzionalità
> (`contenutiSpiegazione.ts`, `PaginaSpiegazione.tsx`, `testiSpiegazione.ts`,
> `stiliSpiegazione.css`) non esiste ancora. Nessun file sotto `src/` è stato
> letto per scrivere questa lista — nemmeno i quattro blocchi già presenti
> dentro `PaginaValoreRisparmi.tsx` che la specifica cita per nome: la loro
> esistenza è presa per buona dalla parola della specifica, non verificata
> aprendo il file.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», il percorso a tre
> tocchi (home → area → domanda → pagina) già dichiarato in `## Previsto` →
> `### Come si proverà`. Qui si scrive **cosa può andare storto** — compreso
> il modo in cui la forma stessa può, o non può, essere scritta.
>
> **Questa non è una schermata, è un contenitore.** Il rischio non è
> lessicale, è **strutturale**: se il tipo permette di dichiarare una pagina
> malfatta, prima o poi qualcuno la dichiara. Per questo una parte
> consistente dei casi qui sotto non prova un comportamento a schermo ma un
> **impedimento a tempo di compilazione** — che un'istanza malformata non
> possa nemmeno esistere. Sono marcati **[tipo]** subito dopo l'identificativo,
> e il "Risultato atteso" dice esplicitamente che si verificano con
> `// @ts-expect-error` più `npx tsc --noEmit` (o un file dedicato compilato a
> parte), **non** con un'asserzione `vitest`: un caso di tipo è un caso, ma
> non si esegue allo stesso modo di uno a runtime, e in fase 2 va riportato
> come tale, non forzato dentro un file `.test.ts` che non lo eseguirebbe
> davvero.
>
> **Quattro punti su cui la specifica non decide la testabilità oggi**,
> segnalati e non indovinati:
> 1. `passi` è dichiarato `readonly PassoSuccessivo[]` — un array semplice,
>    non una tupla di lunghezza massima due. «Al massimo due» (blocco 7) è
>    quindi, per come il tipo è scritto in questa specifica, un vincolo che
>    **il compilatore non impone**: CL-18 lo tratta come caso di struttura a
>    runtime, non come caso di tipo. Se in fase 2 risultasse che
>    `ui-builder` ha ristretto il tipo a una tupla, il caso andrebbe spostato
>    fra quelli di tipo — un miglioramento da segnalare, non un difetto.
> 2. La forma di `PassoSuccessivo` non è mostrata in questa specifica: se il
>    suo campo `percorso` è un'unione chiusa sulle costanti di `rotte.ts`,
>    «un rimando verso il nulla non è dichiarabile» diventa un caso di tipo;
>    se è una stringa qualunque, resta un caso a runtime che deve leggere le
>    rotte esportate ed enumerarle. E-02 è scritto in entrambe le forme.
> 3. Quali valori di `IngressoSimulazioneRisparmio` facciano fallire
>    `calcolaSimulazioneRisparmio` (`ok:false`) è responsabilità della
>    specifica `07`, non di questa. E-03 userà un ingresso costruito nel test
>    scelto per essere manifestamente non valido; se in fase 2 risultasse che
>    nessun ingresso combinabile con quel tipo produce mai `ok:false`, va
>    segnalato come non riproducibile, non forzato con un tipo scorretto.
> 4. **Se `02` (catalogo delle domande) è già entrata quando `03` viene
>    implementata — l'ordine che la specifica stessa dichiara atteso, e che
>    oggi (`docs/test/02-catalogo-domande.md` ha ancora il referto vuoto) non
>    è ancora un fatto compiuto — la mappa «domanda → pagina» non è derivata
>    da `03` ma scritta a mano dentro `catalogoDomande.ts`.** I casi su
>    questa mappa (E-04, E-05) sono scritti sul comportamento osservabile
>    (una domanda con pagina porta alla pagina, una domanda duplicata non è
>    dichiarabile), non sul meccanismo che lo produce: valgono in entrambi
>    gli scenari, ma **quale file la esercita cambia**, e questo si decide
>    solo in fase 2.

## 1. Percorso nominale

*L'istanza di riferimento (`inflazione-spesa`, che risponde a `area1Altra1`)
monta tutti i blocchi che dichiara, nell'ordine dichiarato, con il numero
prodotto dal core e non scritto a mano.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | La rotta risolve l'istanza di riferimento | `parseRotta('#/spiegazione/inflazione-spesa')` | Restituisce la pagina con `id: 'inflazione-spesa'`, non la home | È il punto d'ingresso: se la rotta non risolve, nessun altro blocco è raggiungibile |
| C-02 | Blocchi 1 e 2, senza riscritture | rendering dell'istanza | Il markup contiene, in quest'ordine, l'occhiello dell'area «Il costo della vita» (maiuscolo spaziato) e poi, come titolo, il testo esatto «Con gli stessi soldi della spesa, quanto porto a casa rispetto a un anno fa?» — identico, carattere per carattere, a quello che l'elenco dell'area già mostra | La specifica vieta esplicitamente una seconda versione del titolo: una domanda promessa nell'elenco e un'altra stampata in cima sarebbero due informazioni diverse — il motivo di rifiuto che questo progetto applica a se stesso |
| C-03 | Il blocco 3 esiste e precede sempre il blocco 4 | stesso rendering | Sul markup reso, `indexOf(testo del blocco 3) < indexOf(testo del blocco 4)` | È lo schema fondamentale del progetto reso eseguibile — prima l'immagine concreta, poi il nome tecnico, mai il contrario — e vale per ogni istanza futura che dichiari entrambi i campi, non solo per questa |
| C-04 | Blocchi 5 e 6, indivisibili e coerenti col core | `ingresso: { risparmioCent: 10_000, anni: 1, inflazioneAnnuaBp: 200 }` | Compaiono insieme frase, paragone, fonte e avvertenza; il valore mostrato è **98,04 €**, ottenuto chiamando `calcolaSimulazioneRisparmio` con quell'ingresso — non un numero scritto a mano nel testo (`10.000 / 1,02 = 9.803,92… → 9.804 cent`, perdita `196 cent = 1,96 €`) | Se il componente calcolasse nel JSX, o qualcuno incollasse «98,04 €» come stringa letterale in `testiSpiegazione.ts`, un domani un cambio della formula nel core lascerebbe la pagina con un numero sbagliato senza che nessun test se ne accorga |
| C-05 | Il blocco 8 esiste, non è vuoto, ed è sempre l'ultimo | stesso rendering | Le due voci di `nonFa` dell'istanza compaiono, in rosa `#FF50A0`, dopo ogni altro blocco | È la difesa strutturale dichiarata dalla specifica: se questo blocco mancasse anche in un solo rendering, il contenitore avrebbe fallito il suo unico scopo |
| C-06 | Il blocco 7 è assente quando `passi` è vuoto | rendering dell'istanza di riferimento (`passi: []`) | Nessuna intestazione «Dove porta questa pagina» (`spiegazioneTitoloPassi`) compare nel markup — non una sezione vuota, **nessuna sezione** | Blocco facoltativo per davvero: uno stato vuoto renderizzato è disonesto quanto un numero inventato, per lo stesso principio dichiarato per il blocco 5 |
| C-07 | Il percorso a tre gradini | stesso rendering | «Pagina iniziale › Il costo della vita › [la domanda]», tre gradini, nessuno cliccabile | Saltare l'area direbbe una strada diversa da quella percorsa: la specifica lo dice esplicitamente, richiamando la `01` |

## 2. Casi limite e valori di confine

*Prima gli otto impedimenti che la forma dei tipi dichiara — [tipo], si
verificano a compilazione, non con `vitest` — poi i valori di confine a
runtime: un solo blocco facoltativo, tutti e tre, domanda molto lunga, `nonFa`
a una voce e a sei, importo a sette cifre, area senza istanze.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 [tipo] | Un'istanza senza `nonFa` non compila | oggetto letterale di tipo `PaginaSpiegazione` con la proprietà `nonFa` omessa | `tsc --noEmit` **fallisce**: proprietà obbligatoria mancante — verificato con `// @ts-expect-error` su una dichiarazione dedicata al test di tipo | È il caso che la specifica chiede esplicitamente: il blocco 8 non è "di solito presente", è strutturalmente impossibile ometterlo |
| CL-02 [tipo] | `nonFa: []` non compila | stesso oggetto con `nonFa: []` | `tsc --noEmit` fallisce: `[]` non è assegnabile a `readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]]` | Distingue «manca la proprietà» (CL-01) da «la proprietà c'è ma è vuota»: sono due modi diversi di rompere la stessa regola, e la specifica descrive proprio una tupla non vuota |
| CL-03 [tipo] | Un'istanza senza `immagine` non compila | proprietà `immagine` omessa | `tsc --noEmit` fallisce | Stesso principio di CL-01 sul blocco 3, obbligatorio quanto l'8 |
| CL-04 [tipo] | `immagine: []` non compila | `immagine: []` | `tsc --noEmit` fallisce | Stesso principio di CL-02 sul blocco 3 |
| CL-05 [tipo] | `nomeTecnico` non accetta una lista | `nomeTecnico: [chiaveA, chiaveB]` invece di una chiave singola | `tsc --noEmit` fallisce: il tipo è `ChiaveStringaUtente \| null`, non un array | È «un concetto per schermata» reso eseguibile: il tipo non offre il posto per un secondo nome tecnico |
| CL-06 [tipo] | `esempio` senza `paragone` non compila | oggetto `EsempioNumerico` con `paragone` omesso | `tsc --noEmit` fallisce | È l'indivisibilità 5-6 promessa dalla specifica: «ogni numero ha un paragone concreto» smette di essere una regola da ricordare e diventa un campo che il compilatore pretende |
| CL-07 [tipo] | `esempio` senza `fonte` non compila | oggetto `EsempioNumerico` con `fonte` omesso | `tsc --noEmit` fallisce | Il blocco 6 è obbligatorio se c'è il 5: un numero senza dichiarare da dove viene non deve essere scrivibile — è il caso che deve fallire citato dalla richiesta |
| CL-08 [tipo] | `esempio` senza `avvertenza` non compila | oggetto `EsempioNumerico` con `avvertenza` omesso | `tsc --noEmit` fallisce | Stesso principio di CL-07 sul secondo campo del blocco 6: un numero non è un pronostico, e la specifica non lascia il campo opzionale |
| CL-09 | Istanza con un solo blocco facoltativo | oggetto costruito nel test: `nomeTecnico` presente, `esempio: null`, `passi: []` | I blocchi 5, 6 e 7 sono tutti assenti dal rendering; i blocchi 1, 2, 3, 4, 8 compaiono normalmente | L'istanza reale di oggi ne ha due su tre (nomeTecnico ed esempio, non passi): questo caso copre la combinazione che nessuna istanza dichiarata oggi esercita |
| CL-10 | Istanza con tutti e tre i blocchi facoltativi | oggetto costruito nel test: `nomeTecnico` presente, `esempio` presente, `passi` con 2 elementi verso rotte realmente esportate da `rotte.ts` | Tutti gli otto blocchi compaiono, nell'ordine 1-2-3-4-5/6-7-8, incluso il titolo `spiegazioneTitoloPassi` | È l'altro estremo di CL-09: prova che il contenitore non ha un limite nascosto che impedisce di popolare tutto insieme |
| CL-11 | Domanda molto lunga come titolo | `domanda` uguale alla più lunga delle dodici, `area2Altra2` (103 caratteri) | Il titolo va a capo su più righe, larghezza di lettura ≤70 caratteri, nessun `text-overflow: ellipsis`, nessuna barra di scorrimento orizzontale | È il caso di prova che la specifica dichiara esplicitamente per lo stato «Dati lunghi» |
| CL-12 | Stessa domanda, sull'ultimo gradino del percorso | stesso `domanda: area2Altra2`, come ultimo gradino del breadcrumb | Il gradino va a capo, mai troncato con «…» | La specifica lo vieta per nome: «l'ultimo gradino non viene mai troncato con i puntini» — un troncamento sarebbe una domanda diversa |
| CL-13 | `nonFa` con una sola voce | istanza costruita nel test, `nonFa` di lunghezza 1 | Il blocco 8 compare con una sola riga in rosa, layout non rotto | È il minimo ammesso dal tipo: deve reggere quanto il massimo |
| CL-14 | `nonFa` con sei voci | istanza costruita nel test, `nonFa` di lunghezza 6, come dichiarato dallo stato «Dati lunghi» | Sei righe in rosa, nessuna tagliata, nessuna sovrapposizione | È il caso di stress dichiarato esplicitamente dalla specifica per questo blocco |
| CL-15 | Esempio con importo a sette cifre | `ingresso: { risparmioCent: 200_000_000, anni: 1, inflazioneAnnuaBp: 200 }` (2.000.000,00 €) | `// 200.000.000 / 1,02 = 196.078.431,37… -> 196.078.431 cent = 1.960.784,31 €` (perdita `3.921.569 cent = 39.215,69 €`): il valore resta allineato a destra, cifre tabulari, nessuna riga spezzata a metà numero | Design.md: «è il caso che rompe le griglie» — il valore piccolo dell'esempio di riferimento (98,04 €) non lo dimostra da solo |
| CL-16 | Area senza nessuna istanza di spiegazione | l'area «Il lavoro» o «Il futuro»: dopo questa funzionalità nessuna delle loro domande ha una pagina, perché l'unica istanza risponde a una domanda dell'area «Il costo della vita» | Ogni domanda di quell'area resta testo con la nota di stato placeholder già in uso, nessun link rotto, nessuna eccezione | È lo stato «Vuoto» nella sua forma più estesa, e **verificabile oggi con i dati reali**: la `03` consegna una sola istanza, quindi due aree su tre restano interamente senza spiegazioni finché `11` e `12` non arrivano |
| CL-17 | `id` assente o vuoto nella rotta | `parseRotta('#/spiegazione/')` e `parseRotta('#/spiegazione')` | Entrambi cadono sulla home, come qualunque indirizzo non dichiarato | Campo vuoto è uno dei valori di confine che il mandato chiede sempre di controllare, e qui coincide con il comportamento già promesso per un `id` sconosciuto |
| CL-18 | `passi` oltre i due, come vincolo di struttura e non di tipo | istanza costruita nel test con 3 elementi in `passi` | **Non un errore di compilazione** (il tipo è un array semplice, non una tupla — vedi nota introduttiva, punto 1): il caso verifica invece che nessuna istanza **realmente dichiarata** in `contenutiSpiegazione.ts` superi 2 elementi in `passi`, contando ogni istanza esportata | «Al massimo due» è un vincolo che la specifica enuncia ma il tipo, così come mostrato, non impone da solo: se `ui-builder` lo promuove a tupla in fase di implementazione, questo caso migra fra quelli di tipo, e va segnalato come miglioramento, non richiesto come correzione |

## 3. Errori attesi

*Che cosa succede quando il contenuto è scritto storto, o quando il core
fallisce — e come lo vede la persona, non solo il compilatore. Un errore
corretto mostrato male resta un difetto.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Una pagina non dichiarata cade sulla home, non su una schermata di errore | `parseRotta('#/spiegazione/non-esiste')` | Restituisce la home, **non** una pagina d'errore, **non** un'eccezione | Doppia dichiarazione esplicita della specifica (elaborazione punto 1 e stato «Errore»): è ciò che rende impossibile un link rotto visibile a chi legge |
| E-02 | Un rimando del blocco 7 verso una rotta che non esiste non è dichiarabile | un `PassoSuccessivo` con `percorso` che non corrisponde a nessuna costante esportata da `rotte.ts` | **Se `percorso` è tipizzato come unione chiusa sulle rotte reali**: non compila, verificato con `// @ts-expect-error` — di fatto un caso **[tipo]**. **Se è una stringa qualunque**: un test enumera le costanti esportate da `rotte.ts` e verifica che ogni `percorso` dichiarato in ogni istanza compaia fra quelle. Quale delle due forme si applichi non è noto fino alla fase 2 (nota introduttiva, punto 2) | «Un rimando verso il nulla non è dichiarabile», per parola della specifica: un blocco 7 che punta a una rotta morta è un errore invisibile finché qualcuno non ci clicca |
| E-03 | La funzione del core fallisce: niente numero sbagliato, niente pagina bianca | `ingresso` costruito nel test scelto per essere manifestamente non valido per `calcolaSimulazioneRisparmio` (il minimo garantito dal tipo `Esito`: `ok:false` su qualche combinazione) | I blocchi 5-6 sono sostituiti dalla riga condivisa `spiegazioneEsempioNonDisponibile`, non un numero, non un'eccezione che fa sparire la pagina; gli altri blocchi (1, 2, 3, 4, 8) restano presenti | È lo stato «Errore» dichiarato dalla specifica parola per parola: «mai un numero sbagliato, mai una pagina bianca». **Segnalato**: quale ingresso produca `ok:false` non è deciso da questa specifica ma dalla `07` (nota introduttiva, punto 3); se nessuna combinazione lo produce mai, il caso passa da eseguibile a non riproducibile, non va forzato con un tipo scorretto |
| E-04 | Una pagina dichiara una domanda che la sua area non contiene davvero | istanza costruita nel test con `area` e `domanda` non coerenti (una chiave che l'elenco di quell'area non contiene) | Il controllo strutturale esplicito della specifica (`AREE[p.area].domande.includes(p.domanda)`) fallisce su quell'istanza — verificato contro **tutte** le istanze realmente dichiarate, non solo quella costruita | La specifica lo chiama «la prima forma di scivolamento»: una pagina che risponde a una domanda che nessuno ha posto |
| E-05 | Due pagine rivendicano la stessa domanda | due istanze costruite nel test che dichiarano la stessa `domanda` | La mappa «domanda → pagina» **non deve avere chiavi duplicate**: sulle istanze realmente dichiarate oggi (una sola) non ce ne sono due con la stessa domanda; con le due costruite nel test, il duplicato viene rilevato | Non riproducibile con i dati reali di oggi (una sola istanza esiste): costruito per provare che il controllo esiste, non che sia mai stato necessario finora |
| E-06 | Il paragone ripete la frase, invece di confrontarla con qualcosa | istanza costruita nel test con `paragone` identico a `frase` | Il caso segnala l'anomalia: la specifica non lo vieta in una frase sola, ma il suo stesso elenco di verifiche lo richiede indirettamente («ogni esempio ha un paragone non vuoto **e diverso dalla frase**») | Se il paragone ripete la frase parola per parola, il numero resta senza un vero confronto concreto: la regola sarebbe rispettata solo sulla lettera, non nello spirito di `scrittura-e-accessibilita.md` |
| E-07 | Il messaggio sostitutivo dell'esempio si legge, non solo si intuisce | la riga `spiegazioneEsempioNonDisponibile` di E-03, resa a schermo | Testo ≥16px, contrasto ≥4,5:1, linguaggio umano («qualcosa non torna in questo calcolo», non un codice o un termine tecnico) — non un'icona sola, non un colore sganciato dal testo | Richiama `scrittura-e-accessibilita.md`: «Controlla questo numero, sembra troppo alto», non «Errore di validazione nel campo input» — un errore corretto mostrato male resta un difetto anche quando la causa è un dato costruito da chi scrive il contenuto, non digitato da chi legge |

## 4. Conformità

*Richiama la suite dei guardrail, non la riscrive: il lessico vive in
`src/guardrails/lessico.ts` ed è scandito da `tests/lessico-ui.test.ts`, che
cammina già su tutto `src/ui/` — le stringhe di questa funzionalità sono
coperte dal giorno in cui esistono. CF-01 e CF-02 richiamano quella copertura;
da CF-03 in poi ci sono i vincoli che questa funzionalità introduce e che la
suite generale non fa da sola.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Nessun linguaggio prescrittivo nelle stringhe nuove | le 15 chiavi nuove in `src/ui/testi.ts`: le 5 del contenitore (`spiegazioneTitoloEsempio`, `spiegazioneTitoloFonte`, `spiegazioneTitoloPassi`, `spiegazioneTitoloNonFa`, `spiegazioneEsempioNonDisponibile`) e le 10 dell'istanza di riferimento (`spiegazioneInflazioneSpesaImmagine1..3`, `…NomeTecnico`, `…Frase`, `…Paragone`, `…Fonte`, `…Avvertenza`, `…NonFa1..2`) | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico esistente | Richiamo alla suite esistente: elencare di nuovo qui i termini vietati farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Nessuna radice vietata negli identificatori nuovi | `PaginaSpiegazione`, `EsempioNumerico`, `PassoSuccessivo`, `IdSpiegazione`, `contenutiSpiegazione`, `testiSpiegazione`, `stiliSpiegazione` | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Il vincolo vale anche dove chi legge non guarda, e questi nomi sopravvivranno più a lungo delle stringhe a schermo: saranno il modello copiato da `11` e `12` |
| CF-03 | Il numero mostrato viene dal core, non da un letterale copiato | il valore dell'esempio di riferimento | Uguale, per costruzione, all'output di `calcolaSimulazioneRisparmio` chiamata con l'ingresso dichiarato — verifica strutturale (stessa chiamata), non un confronto fra due stringhe scritte a mano | «Nessuna semplificazione può alterare il significato dell'informazione originale»: un numero incollato a mano diverge silenziosamente dal core alla prima modifica della formula |
| CF-04 | La fonte dell'esempio di riferimento non dichiara un periodo certo quando non lo è | blocco 6 dell'istanza `inflazione-spesa` | Il testo riflette lo stesso stato onesto già mostrato dalla schermata dei risparmi (`07`) e dalla tabella delle fonti (`13`): il periodo del tasso non è ancora stabilito | La specifica lo segnala esplicitamente come «buco aperto, non un blocco per questa pagina»: la pagina deve riportarlo, non nasconderlo né inventarlo |
| CF-05 | Il rosa `#FF50A0` compare solo sul blocco 8 | l'intera pagina di spiegazione, ogni istanza | Nessun altro elemento — titoli, bordi, sfondi — usa quel colore | «È il colore di ciò che il prodotto non fa»: usarlo altrove per decorare toglierebbe senso all'unico punto in cui la specifica lo richiede |
| CF-06 | Nessuna chiamata di rete | build di produzione, con l'esempio calcolato | Il numero è prodotto da una funzione del core con argomenti fissi dichiarati nel contenuto — nessun `fetch`, nessuna dipendenza da dati remoti | Il sito deve funzionare a Wi-Fi spento; questa pagina esiste apposta per mostrare un numero senza mai andare a cercarlo fuori |
| CF-07 | Nessuna funzione nuova nel core, nessun contratto toccato | diff del branch di questa funzionalità | `src/core/` e `types/` non compaiono nel diff — solo letti | La specifica lo dichiara esplicitamente in «Cosa questa funzionalità NON fa»: verificabile a occhio sul diff, non con `vitest` |
| CF-08 | I quattro stati obbligatori esistono tutti, anche quando non eseguibili end-to-end oggi | l'istanza di riferimento e le istanze costruite nel test | Vuoto: CL-16 (area intera) e CL-01/CL-03 (pagina senza esempio, di tipo). In caricamento: nessuno stato di attesa, i blocchi 5-6 sono già presenti al primo render (nessun I/O da attendere). Errore: E-01 (id sconosciuto) ed E-03 (core fallito). Dati lunghi: CL-11, CL-14, CL-15 | Una schermata che esiste solo nel caso perfetto non è finita — la stessa regola che ha già protetto la `13` |
| CF-09 | Accessibilità di base della pagina | l'istanza di riferimento, resa | Corpo ≥16px, interlinea ≥1,5, contrasto ≥4,5:1 su ogni testo (incluso il rosa del blocco 8), larghezza di lettura ≤70 caratteri, bersagli dei rimandi del blocco 7 ≥44px con testo accanto all'icona, nessuna informazione solo al passaggio del mouse, focus da tastiera sempre visibile, ordine di tabulazione coerente con la lettura. **Parziale per costruzione**: il posizionamento sopra la piega non è verificabile da un markup statico e resta alla rilettura umana di `guardrail-officer` in fase 2 | Siamo a un hackathon sull'inclusione: questa è la pagina che deve funzionare per chi ha meno dimestichezza con la tecnologia, non solo per chi la collauda da uno schermo grande |
| CF-10 | La navigazione non cambia posizione | arrivo alla pagina di spiegazione, confrontato con le altre pagine del sito | «Indietro» e il percorso a gradini nella stessa posizione fissata dalle altre schermate | Richiamo, non ripetizione, del percorso già scritto da `doc-funzionale`: un contenitore nuovo è esattamente il punto in cui la coerenza di navigazione si perde per disattenzione |
| CF-11 | Nessun troncamento della domanda, in nessun punto della pagina | titolo (blocco 2) e ultimo gradino del percorso — richiamo a CL-11/CL-12, non un test in più | Nessun carattere «…», nessuna `text-overflow: ellipsis` applicata al testo della domanda | Motivo di rifiuto esplicito di questo progetto per l'informazione alterata: una domanda tagliata è una domanda diversa. Elencato anche qui, sotto conformità, perché non è solo estetica — è il vincolo «nessuna semplificazione può alterare il significato dell'informazione originale» applicato al titolo stesso |
| CF-12 | **Il caso che pesa di più: un'istanza non può esistere senza dichiarare i propri confini** | qualunque tentativo di scrivere una `PaginaSpiegazione` in `contenutiSpiegazione.ts` senza il campo `nonFa`, o con `nonFa: []` | Non compila — stesso meccanismo di CL-01 e CL-02, richiamato qui non per ripeterlo ma perché **è la prova che è la struttura, non la revisione a valle, a impedire il consiglio** | La specifica lo scrive in modo esplicito: «un contenitore che permette di scrivere un consiglio, prima o poi lo riceve». Il vincolo «spiega e calcola, non consiglia» qui non dipende da una rilettura di `guardrail-officer` prima del merge: dipende dal compilatore, prima che il merge sia anche solo pensabile. È l'unico punto di tutta questa lista in cui la conformità non è verificata a valle ma resa strutturalmente impossibile da violare a monte |

---

## Referto

*Scritto da `tester` in **fase 2**, dopo aver implementato in
`tests/accettazione/` ed **eseguito** i casi qui sopra (i casi **[tipo]** con
`tsc --noEmit`, gli altri con `vitest`). Finché questa sezione è vuota, la
fase 2 non è stata fatta e la funzionalità non è finita.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
