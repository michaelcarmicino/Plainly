# 02 — casi di prova per «Il catalogo delle domande vere, e che cosa il sito sa rispondere»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/02-catalogo-domande-reali-per-macrocategoria.md`, e non dal
> codice. La parte nuova (`catalogoDomande.ts`, `testiCatalogo.ts`) non esiste
> ancora; la parte già scritta da `01` (`contenutiHome.ts`, `testi.ts`,
> `PaginaMacrocategoria.tsx`) esiste ma **non è stata letta**, per restare
> fedeli alla regola che definisce questo ruolo. L'unico codice consultato è
> quello che la richiesta indicava esplicitamente: `tests/home.test.ts`, per
> sapere **che cosa si romperà** (non per copiarne le asserzioni), e
> `src/guardrails/lessico.ts`, per richiamare — non riscrivere — che cosa la
> conformità già copre. Una verifica indipendente (`grep -i "meglio|preferibile"
> src types`) conferma, ad oggi, zero occorrenze: l'estensione del lessico
> proposta dalla specifica non troverebbe nulla da rompere.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», il percorso
> nominale da mostrare in demo (l'area «Il lavoro» scorsa fino in fondo). Qui
> si scrive **cosa può andare storto**: la regressione sulla `01`, il numero
> scritto a mano al posto di derivato, le sette domande che non devono
> ricomparire, il buco del lessico che questa funzionalità apre e chiude nello
> stesso commit.
>
> **Non di mia proprietà, per chiarezza**: `tests/catalogo.test.ts` (previsto
> dalla specifica) e le modifiche a `tests/home.test.ts` sono di
> `ui-builder`/`guardrail-officer` — vivono in `tests/` ma non in
> `tests/accettazione/`. I casi qui sotto, in fase 2, diventano
> `tests/accettazione/02-catalogo-domande.test.ts`.
>
> **Derivazione, dalla specifica.** Diciotto domande d'origine, `5 + 6 + 7` per
> area. Tre stati: `con-schermata` (1) · `senza-fonte` (1) · `in-arrivo` (16).
> `contaAltreDomande` = lunghezza lista − 1 (la prima è già sulla card): costo
> della vita `5 − 1 = 4`, lavoro `6 − 1 = 5`, futuro `7 − 1 = 6`. Ogni
> risultato atteso qui sotto è questa aritmetica, non un numero scritto a
> memoria.
>
> **Niente input numerico, quindi niente confini aritmetici.** La specifica lo
> dichiara in prima persona («Elaborazione: nessun calcolo di dominio» ·
> «Input: nessuna fixture, nessuna chiamata al core, nessun numero»): zero,
> negativi, importi enormi non esistono in questa funzionalità. I «casi
> limite» del gruppo 2 sono perciò redazionali e strutturali, non aritmetici —
> è la stessa scelta di peso indicata nella richiesta.
>
> **Un punto su cui la specifica non decide**, segnalato e non indovinato: il
> testo esatto della riga di stato «vuoto» (`areaNessunaSchermata`) non è dato
> verbatim — la specifica ne descrive solo il comportamento («dice che cosa
> manca e che arriverà, non "nessun risultato"»). CL-06 verifica il
> comportamento, non una stringa che nessuno ha ancora scritto.

## 1. Percorso nominale

*Pochi casi, e quasi tutti di contenuto: quello che deve esserci a schermo
appena la funzionalità è pubblicata.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | Il catalogo ha le diciotto voci dichiarate, ripartite per area | il catalogo completo | lunghezza totale **18**; costo della vita **5**, lavoro **6**, futuro **7** | È la promessa che intitola la funzionalità: se questo conteggio non torna, badge e stati poggiano su un dato falso fin dall'inizio |
| C-02 | La card «Il lavoro» porta la domanda nuova, non più quella spostata in fondo | apertura della pagina iniziale | il markup della card «lavoro» contiene la riscrittura già fatta in `01` di «Cosa succede economicamente se perdo il lavoro adesso?» (`area2Altra1`); **non contiene più** «Il mio settore è a rischio nei prossimi anni?» | È il cambiamento più visibile della funzionalità, e la specifica lo segnala esplicitamente come decisione da confermare, non da applicare di nascosto |
| C-03 | I tre badge riportano i conteggi nuovi | apertura della pagina iniziale | badge costo della vita «altre 4 domande qui dentro» · lavoro «altre 5 domande qui dentro» · futuro «altre 6 domande qui dentro» | È il segno a schermo che il numero segue la lista; l'anti-scrittura-a-mano è provata a parte in CL-03 |
| C-04 | L'unica voce `con-schermata` è un link vero e porta dove promette | apertura dell'area «Il futuro» | la voce (la riscrittura già a schermo di «Come proteggo i miei risparmi dall'inflazione?», `area3Altra3`) è **sottolineata**, ha un `percorso`, e `parseRotta(percorso)` **non** restituisce `home` | È l'unica domanda, su diciotto, a cui il sito risponde oggi. Se il link fosse rotto, la frase «una su diciotto ha una schermata dietro» diventerebbe falsa senza che nessuno se ne accorga guardando lo schermo |
| C-05 | L'ultima voce dell'area «Il lavoro» mostra il testo riscritto e la nota «senza fonte» | apertura dell'area «Il lavoro», ultima voce | testo **«Nel mio settore, quante persone hanno perso il lavoro negli ultimi anni?»**, seguito da «Su questa il sito non ha una risposta con una fonte dichiarata, e non la inventa.» | È la voce citata in specifica come «la slide dei limiti dimostrata dal prodotto»: se il testo o la posizione non corrispondono, la demo di dieci secondi che la specifica descrive non si può fare |
| C-06 | Le sei domande nuove compaiono con il testo esatto della specifica | apertura delle tre aree | `area1Altra4`, `area2Altra4`, `area2Altra5`, `area3Altra4`, `area3Altra5`, `area3Altra6` compaiono **parola per parola** come scritte nella tabella «Le diciotto domande» | Sono contenuto redazionale puro: nessun compilatore si accorge di un refuso o di una parola saltata, solo la lettura la trova |
| C-07 | Ogni voce `in-arrivo` porta la stessa nota di stato | una voce qualunque non `con-schermata` e non `senza-fonte` | sotto la domanda compare **«La schermata che risponde a questa domanda non c'è ancora.»** | È il testo che distingue «risponde oggi» da «risponderà», leggibile senza passare il mouse — la promessa centrale della funzionalità |

## 2. Casi limite e valori di confine

*Non aritmetici: qui il peso è sulla regressione (quanto resta uguale a `01`),
sulla derivazione (badge non scritto a mano) e sui confini di contenuto —
liste uniformi, aree senza risposte, testo lungo.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | Le tre card restano tre, con le stesse classi e lo stesso peso visivo | markup della pagina iniziale, prima e dopo questa funzionalità | 3 card, stessa struttura di classi delle altre due — nessuna evidenziata, nessuna ridotta — lo stesso invariante che `tests/home.test.ts` verifica già oggi | La specifica dichiara che questa funzionalità cambia **che cosa c'è dentro** le schermate di `01`, non la struttura: una card che cambia contenuto e nel farlo perde peso visivo è la regressione più facile da non notare, perché lo sguardo cade sul contenuto nuovo |
| CL-02 | La navigazione non cambia posizione | «torna alla home» / «indietro» su ciascuna delle tre pagine d'area | stessa posizione delle altre schermate già fissata da `01`, invariata da questa funzionalità | Una schermata che cambia contenuto è esattamente il punto in cui un menu che si sposta passa inosservato: regola generale richiamata, non riscritta |
| CL-03 | Il numero del badge è derivato dalla lista, non scritto a mano | le tre aree | `contaAltreDomande` restituisce **4** (costo della vita), **5** (lavoro), **6** (futuro) — l'aritmetica dichiarata sopra; la stringa modello del badge contiene ancora il segnaposto (`{n}` o equivalente) e **nessuna cifra** | È il punto esplicitamente a rischio: se qualcuno scrivesse tre stringhe con «4», «5», «6» letterali invece di derivarle, oggi sembrerebbe corretto e mentirebbe alla prossima domanda aggiunta — solo questo caso distingue le due situazioni |
| CL-04 | Le diciotto chiavi sono tutte presenti, per nome | l'insieme completo delle chiavi del catalogo | esattamente queste 18, nessuna in meno e nessuna duplicata al posto di un'altra: `area1Domanda, area1Altra1, area1Altra2, area1Altra3, area1Altra4` (costo della vita) · `area2Altra1, area2Altra2, area2Altra3, area2Altra4, area2Altra5, area2Domanda` (lavoro) · `area3Domanda, area3Altra1, area3Altra2, area3Altra3, area3Altra4, area3Altra5, area3Altra6` (futuro) | Un conteggio che torna a 18 non basta: se una voce sparisse e un'altra fosse duplicata per compensare, il totale mentirebbe lo stesso. La specifica vieta esplicitamente l'omissione silenziosa |
| CL-05 | Nessuna area ha una lista vuota | le tre aree | lunghezza ≥ 1 per ciascuna (oggi 5, 6, 7) | È la forma raggiungibile oggi del limite generale «liste vuote»: con i dati dichiarati non esiste un'area a zero voci, e il test lo certifica invece di darlo per scontato |
| CL-06 | Stato «vuoto»: un'area senza nessuna voce `con-schermata` | apertura di «Il costo della vita» o «Il lavoro» (oggi entrambe a zero voci con schermata) | l'elenco compare comunque per intero, e in testa una riga **dice che cosa manca**, non «nessun risultato». Il testo esatto non è fissato dalla specifica (vedi nota in apertura): il caso verifica il comportamento — una riga informativa distinta dalle voci — non una stringa letterale | È uno dei quattro stati obbligatori del design, ed è il più facile da dimenticare perché con il catalogo già pieno di voci «in arrivo» la schermata non sembra mai vuota a prima vista |
| CL-07 | Elenco con tutte le voci nello stesso stato | apertura di «Il costo della vita»: 5 voci, tutte `in-arrivo` | nessuna voce differisce dalle altre nello stato mostrato; il badge (4) resta coerente con una lista uniforme | È il caso che una prova fatta solo su «Il lavoro» (stati misti) non incontrerebbe mai: un badge o una nota di stato che funzionano solo quando c'è varietà si rompono proprio qui |
| CL-08 | Domanda molto lunga va a capo senza troncarsi | `area3Altra5`: «Se i soldi mi servono fra sei mesi, che cosa cambia rispetto a quando mi servono fra dieci anni?» — **96 caratteri**, verificato a mano | il testo va a capo su più righe, resta interamente leggibile, corpo **≥ 16px** | È la voce più lunga delle diciotto (la specifica dichiara che «le domande più lunghe passano i 90 caratteri» proprio nell'area «Il futuro»): se il contenitore la tronca o ne restringe il corpo, è un difetto che nessun caso base troverebbe mai |
| CL-09 | Nessuna voce `senza-fonte` è la prima domanda della sua area | tutte e tre le aree | in nessuna delle tre la prima voce ha stato `senza-fonte` (oggi verificabile a vista in «Il lavoro», dove la voce `senza-fonte` è l'ultima, non la prima) | È l'invariante nuovo della specifica: una card è una promessa, e promettere una risposta che non arriva è, testualmente, «il modo più rapido per perdere chi legge alla prima schermata» |

## 3. Errori attesi

*Nessun modulo da compilare, quindi nessun messaggio di validazione: gli
«errori» qui sono link che non portano dove promettono, o voci che sembrano
cliccabili senza esserlo. Un caso è dichiarato non applicabile perché il
compilatore lo impedisce prima che esista un utente da mostrarglielo.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Indirizzo d'area inesistente | un hash non riconosciuto (es. `#/qualcosa-che-non-esiste`) | si arriva alla pagina iniziale, **senza messaggio d'errore**: comportamento invariato, già garantito da `01` tramite `parseRotta` | Questa funzionalità non tocca il meccanismo di instradamento, solo il contenuto delle pagine: se lo rompesse di riflesso — per esempio spostando dove `AREE` viene costruito — sarebbe una regressione su una funzionalità già consegnata |
| E-02 | Il link vero non è un vicolo cieco | l'unica voce `con-schermata` (`area3Altra3`) | `parseRotta(percorso)` per quella voce **non** restituisce `{ tipo: 'home' }`: porta davvero alla schermata di `07` | Un `percorso` scritto storto passerebbe inosservato a occhio (il link c'è, è sottolineato) e si scoprirebbe solo cliccandoci sopra — il vicolo cieco che l'invariante della specifica vuole rendere impossibile |
| E-03 | Le voci senza schermata non si comportano da link | ogni voce `in-arrivo` o `senza-fonte` | nessun `href` verso una rotta reale, nessuna zona che segnali un tocco possibile | Come lo vede la persona: un testo che sembra cliccabile e non porta da nessuna parte è un errore anche se non compare nessun messaggio — la stessa famiglia di difetto di un link rotto, vista dal lato opposto |
| E-04 | Chiave di testo mancante — **dichiarato non applicabile a runtime** | riferimento a una chiave del catalogo assente in `STRINGHE_UTENTE` | nessuna schermata di errore da prevedere: il compilatore (`npx tsc --noEmit`) rifiuta il riferimento prima che il programma esista. **Non coperto** in `tests/accettazione/`, per costruzione | La specifica lo dichiara in prima persona: «una chiave di testo inesistente non è un errore da gestire a schermo». Inventare un test runtime per un caso che il sistema di tipi impedisce a monte misurerebbe una garanzia che non appartiene a questa funzionalità |

## 4. Conformità

*La suite esistente non viene riscritta qui: il lessico vive in
`src/guardrails/lessico.ts` ed è scandito da `tests/lessico-ui.test.ts`. CF-01
e CF-02 richiamano quella copertura; da CF-03 in poi ci sono i vincoli che
questa funzionalità introduce e che quella suite, oggi, non copre ancora.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Nessun linguaggio prescrittivo nelle stringhe nuove o modificate | le nove chiavi previste in `testiCatalogo.ts` più `area2Domanda` in `testi.ts` | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico esistente | Richiamo alla suite esistente: duplicare qui l'elenco dei termini farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Nessuna radice vietata negli identificatori nuovi | nomi di tipi (`DomandaCatalogo`, `StatoDomanda`) e funzioni introdotti da questa funzionalità | nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Stesso richiamo: il vincolo vale anche dove l'utente non legge, perché i nomi sopravvivono più a lungo dei testi |
| CF-03 | Le sette formulazioni prescrittive o predittive d'origine non compaiono mai, **nemmeno in un commento** | «Mutuo o affitto, cosa mi conviene?» · «Conviene cambiare fornitore o offerta?» · «Conviene aprire una partita IVA o restare dipendente?» · «Meglio conto deposito, ETF o BTP per i miei risparmi?» · «Come proteggo i miei risparmi dall'inflazione?» · «Il mio contratto a termine verrà rinnovato?» · «Il mio settore è a rischio nei prossimi anni?» | nessuna delle sette frasi d'origine compare in `src/`, in nessuna forma, nemmeno come commento che spiega la riscrittura | La specifica lo scrive testualmente: «la formulazione vecchia non resta da nessuna parte in `src/`, nemmeno in un commento» — e il guardrail scandisce anche i commenti, quindi lasciarla lì farebbe fallire la build per un motivo diverso da quello di chi l'ha scritta |
| CF-04 | Il lessico si allarga: «meglio» e «preferibile» diventano radici bloccate | il testo d'origine «Meglio conto deposito, ETF o BTP», ipoteticamente reinserito in `src/` | dopo l'estensione, verrebbe **rifiutato**; prima di questa funzionalità passerebbe la scansione — è il buco che la specifica dichiara e chiede di chiudere. **Effetto collaterale dichiarato**: da questo momento un commento con «si legge meglio così» fa fallire `tests/lessico-ui.test.ts`, perché la scansione include i commenti dei sorgenti | È l'unico punto in cui questa funzionalità tocca `src/guardrails/lessico.ts`. Verificato **indipendentemente** (`grep -i "meglio\|preferibile" src types`, zero risultati) prima di scriverlo: l'aggiunta non fa diventare rosso niente di già scritto |
| CF-05 | Nessuna interfaccia conversazionale | le pagine toccate da questa funzionalità (iniziale e delle tre aree) | nessun campo di domanda libera, nessuna casella di ricerca a testo libero | La specifica lo esclude in prima persona: un campo che invita a scrivere una domanda produce l'aspettativa di una risposta che il sito, offline, non può dare. È il confine che «qualcuno riaprirà» |
| CF-06 | I tre stati sono leggibili a parole, mai solo per colore o solo in hover | markup statico (`renderToStaticMarkup`, che non esegue l'hover) di una voce per stato | il testo di stato compare nel markup **senza** interazione simulata, per tutte e tre le voci di esempio (`con-schermata` tramite il link sottolineato, `in-arrivo`, `senza-fonte`) | Al proiettore e su touch l'hover non esiste: se il testo comparisse solo lì, per metà delle persone quel dato non ci sarebbe — e `renderToStaticMarkup` prova che non serve simulare il mouse per trovarlo |
| CF-07 | Nessun semaforo di colore sulle tre etichette di stato | markup delle tre etichette | nessuna classe o icona verde/giallo/rosso associata al testo di stato | La specifica lo vieta esplicitamente, in controtendenza col resto del sito dove i semafori sono la regola: «lo stato riguarda il sito, non la domanda: si scrive a parole» |
| CF-08 | Nessuna chiamata di rete | build di produzione con questa funzionalità inclusa | nessun `fetch` nuovo nel bundle; il controllo è quello già esistente sul bundle, richiamato e non riscritto | Il catalogo è una costante compilata: non ha motivo di introdurre rete, ma è il tipo di regressione silenziosa che un `import` sbagliato potrebbe causare |
| CF-09 | I quattro stati obbligatori esistono tutti | le pagine toccate | **vuoto** (CL-06) · **in caricamento**: assente per costruzione — il catalogo è una costante nel bundle, non un dato che arriva, e va detto perché nessuno lo aggiunga per riflesso · **errore**: indirizzo inesistente → home (E-01, invariato da `01`) · **dati lunghi** (CL-08) | Una schermata che esiste solo nel caso perfetto non è finita; qui il caso perfetto è anche il più numeroso (sedici voci «in arrivo»), quindi il più facile da scambiare per l'unico che serve provare |
| CF-10 | Accessibilità di base, richiamata e non riscritta | le tre pagine d'area | corpo ≥ 16px, contrasto ≥ 4,5:1, area cliccabile ≥ 44×44 px per l'unico link vero, focus da tastiera visibile — soglie definite in `.claude/rules/design.md`, non duplicate qui | Siamo a un hackathon sull'inclusione: un'interfaccia inaccessibile è ciò che chi valuta nota prima di qualunque contenuto, ed è ancora più vero in una schermata che è **solo** contenuto |
| CF-11 | Il significato non si perde nelle riscritture — **non verificabile da una regex** | le sei domande nuove e la domanda riscritta | dichiarato **non coperto in automatico**: richiede la rilettura umana di `guardrail-officer` prima del merge, come da `scrittura-e-accessibilita.md` | Una frase può passare ogni scansione lessicale e restare comunque un giudizio travestito, o perdere il meccanismo che doveva spiegare. Stesso limite che `07` aveva già dichiarato nel proprio CF-04: nessuna regex lo trova |

---

## Referto

*Scritto da `tester` in **fase 2**, dopo aver implementato in
`tests/accettazione/02-catalogo-domande.test.ts` ed **eseguito** i casi qui
sopra. Finché questa sezione è vuota, la fase 2 non è stata fatta e la
funzionalità non è finita.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
