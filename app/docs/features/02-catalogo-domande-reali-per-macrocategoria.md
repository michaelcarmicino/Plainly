# 02 — «Il catalogo delle domande vere, e che cosa il sito sa rispondere»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «04-guardrail-officer»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 1 «Domande reali da mappare per categoria». Task di backlog: `02`.
>
> **Il rischio di questa funzionalità non è un calcolo sbagliato: è il taglio
> delle domande.** Sette delle diciotto domande d'origine, scritte così come
> sono, non possono entrare a schermo, per due motivi diversi:
>
> - **cinque sono un consiglio travestito da domanda** — «conviene…», «meglio…»,
>   «come proteggo…»: chiedono che cosa fare o quale opzione prendere, e una
>   risposta le asseconderebbe;
> - **due sono una previsione sulla singola persona** — «il mio settore è a
>   rischio», «il mio contratto verrà rinnovato»: nessuna fonte le può dare, e
>   rispondere vorrebbe dire indovinare.
>
> Tutte e sette sono **riscritte una per una** nella tabella «Le diciotto
> domande», con il motivo accanto e la formulazione nuova in chiaro. Il criterio
> è sempre lo stesso: **da «cosa mi conviene» a «che differenza c'è fra»** —
> resta il meccanismo, sparisce la scelta. Nessuna domanda viene buttata via in
> silenzio: la riga d'origine resta scritta qui, in `docs/`, che è l'unico posto
> dove può stare. In `src/` non entra nemmeno come commento, perché il guardrail
> cerca «conviene» e «scegli» anche lì.
>
> **Due riscritture diverse, da non confondere.** Queste sette sono riscritte
> **per conformità**: senza la riscrittura non potrebbero comparire a schermo.
> Altre righe delle undici restanti sono riscritte **per le regole di
> scrittura** — un nome tecnico o un imperativo come titolo («Come funziona la
> NASpI?», «Come costruisco un fondo di emergenza?») non è un consiglio, è solo
> un titolo che la persona a cui parliamo non userebbe mai. Le prime sono
> obbligatorie, le seconde sono redazionali: nelle tabelle la colonna «che cosa
> non andava» dice quale delle due è.

## Per chi

Una persona che arriva sul sito con un'ansia già formata — «la bolletta di
questo mese non me la spiego», «se perdo il posto, di che vivo» — e che davanti
a un menu di parole tecniche non saprebbe dove cliccare, perché nessuna di
quelle parole è la sua. Non sta cercando «inflazione» o «previdenza
complementare»: sta cercando **la propria frase**, scritta come la direbbe lei.

È anche la persona che, non trovandola, se ne va in dieci secondi convinta che
il sito non parli con lei.

## Quando serve

Nei primi due tocchi, sempre. È il momento in cui la persona entra in un'area
dalla pagina iniziale e deve riconoscere, in un elenco corto, la domanda che si
è fatta stamattina — e capire **subito** se a quella domanda il sito risponde
oggi, risponderà, o dichiara di non poter rispondere.

Serve anche ai task che verranno: `03` (le pagine di spiegazione) e i
simulatori `08`–`12` si agganciano a una voce di questo catalogo. Senza, ognuno
si inventerebbe la propria lista e le domande finirebbero scritte in tre posti
diversi con tre formulazioni diverse.

## Cosa deve poter fare dopo

Entrare in un'area, scorrere un elenco di domande scritte con le parole di
tutti i giorni, e dire a voce alta: «questa è la mia». E accanto a quella
domanda leggere, **senza passare il mouse su niente**, una di tre cose:
la risposta c'è (ed è un link vero), la risposta arriverà, oppure il sito
dichiara di non avere una risposta con una fonte.

Prima trovava dodici domande, di cui una sola portava da qualche parte, e per
le altre undici non sapeva se il vuoto fosse un errore suo o del sito.

## Input

Nessun dato di dominio: **nessuna fixture, nessuna chiamata al core, nessun
numero**. Il contenuto è redazionale e sta tutto in `src/ui/`.

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| Le 18 domande d'origine | testo | `plainly-prompt-2-funzionalita.md`, sezione 1 |
| Le 12 domande già a schermo | chiavi in `testi.ts` | scritte in `01-landing-page`, già verificate dal lessico |
| Lo stato di ogni voce | `con-schermata` · `in-arrivo` · `senza-fonte` | dichiarato qui, riga per riga |
| La destinazione, se esiste | un percorso di `rotte.ts` | oggi solo `PERCORSO_VALORE_RISPARMI` (task `07`) |

### Le diciotto domande

Tre tabelle, una per area. **La colonna «stato» non è un dettaglio grafico: è
una promessa, e il test la controlla.**

#### Il costo della vita — 5 voci

| Domanda d'origine | Che cosa non andava | Voce del catalogo | Stato |
| --- | --- | --- | --- |
| «Perché la bolletta è così alta questo mese?» | niente | *invariata* (`area1Domanda`) — **sulla card** | in arrivo |
| «Quanto sono aumentati davvero i prezzi rispetto all'anno scorso?» | niente | *già riscritta in `01`* (`area1Altra1`): «Con gli stessi soldi della spesa, quanto porto a casa rispetto a un anno fa?» | in arrivo |
| «Mutuo o affitto, cosa mi conviene?» | **sceglie per chi legge**, e contiene un termine che il lessico blocca | *già riscritta in `01`* (`area1Altra2`): «Quanto mi costa la casa ogni mese, tutto compreso?» — il confronto fra affitto e rata **non sparisce, si sposta dentro la risposta**: la pagina affianca i due costi mensili e si ferma lì. La scelta resta di chi legge | in arrivo |
| «Il mio stipendio tiene il passo con i prezzi?» | niente | *già riscritta in `01`* (`area1Altra3`) | in arrivo |
| «Conviene cambiare fornitore o offerta?» | **sceglie per chi legge**; termine bloccato dal lessico | **nuova** (`area1Altra4`): «Che cosa cambia in bolletta fra un'offerta a prezzo fisso e una a prezzo variabile?» — si risponde spiegando il meccanismo, senza nominare né indicare un'offerta | in arrivo |
| «Come proteggo i miei risparmi dall'inflazione?» | **imperativo**: chiede che cosa fare, non che cosa succede | **spostata ne «Il futuro»** (`area3Altra3`, già a schermo): «I risparmi fermi sul conto: che cosa succede loro mentre i prezzi salgono?» | — |

#### Il lavoro — 6 voci

| Domanda d'origine | Che cosa non andava | Voce del catalogo | Stato |
| --- | --- | --- | --- |
| «Cosa succede economicamente se perdo il lavoro adesso?» | niente | *già riscritta in `01`* (`area2Altra1`): «Se perdo il lavoro, quanto prendo ogni mese e per quanto tempo?» — **passa sulla card** | in arrivo |
| «Quanto mi tolgono davvero le tasse sullo stipendio?» | niente | *già riscritta in `01`* (`area2Altra2`) | in arrivo |
| *(nessuna: viene dalla sezione 4 del documento d'origine)* | — | *già presente* (`area2Altra3`): «Lavoro in proprio: quanto devo mettere da parte per tasse e contributi?» | in arrivo |
| «Conviene aprire una partita IVA o restare dipendente?» | **sceglie fra due stati**; termine bloccato dal lessico | **nuova** (`area2Altra4`): «Con lo stesso importo, quanto resta a un dipendente e quanto a chi lavora in proprio?» — le due opzioni affiancate, senza indicarne una | in arrivo |
| «Il mio contratto a termine verrà rinnovato? Cosa cambia rispetto a un indeterminato?» | la **prima metà è una previsione sulla singola persona**: nessuna fonte la può dare | **nuova** (`area2Altra5`), solo la seconda metà: «Contratto a termine e a tempo indeterminato: che cosa cambia, in concreto, fra i due?» | in arrivo |
| «Come funziona la NASpI?» | **un nome tecnico come titolo** — vietato dalle regole di scrittura e dal documento d'origine stesso | **fusa** in `area2Altra1`: il nome compare dentro la risposta, dopo l'immagine concreta, mai come porta d'ingresso | — |
| «Il mio settore è a rischio nei prossimi anni?» | **previsione sulla situazione di chi legge**: nessuna fonte la può dare, e rispondere vorrebbe dire indovinare | **riscritta** (`area2Domanda`, **testo nuovo**): «Nel mio settore, quante persone hanno perso il lavoro negli ultimi anni?» — dal pronostico sul futuro di una persona a un numero già accaduto e pubblicato. **Tolta dalla card e messa in fondo** | **senza fonte** |

> **Perché questa è l'unica riscritta *e* dichiarata senza fonte.** Le altre sei
> riscritture bastano a sé stesse: dopo la riscrittura il sito sa rispondere, o
> saprà. Questa no. Riscritta, la domanda diventa **rispondibile in principio** —
> è statistica descrittiva sul passato, con una fonte che esiste (ISTAT) — ma il
> dato per settore **non è nel repository** e non può arrivare dalla rete a
> runtime. Quindi la voce resta `senza-fonte`, e lo stato adesso dice una cosa
> vera e precisa: «il numero esiste, noi non l'abbiamo», invece di «questa
> domanda non si può porre».
>
> **La riscrittura serve comunque, e non è un formalismo.** «Il mio settore è a
> rischio?» passa la scansione automatica del lessico parola per parola —
> nessuna radice vietata — e resta una previsione personalizzata: è esattamente
> il difetto che `01-landing-page` aveva già annotato come eredità dell'area 2.
> Qualunque risposta scritta sotto quel titolo scivolerebbe in «il tuo settore è
> a rischio», cioè in `adatto-a-te` e `dovere-personale` senza averne usato le
> parole. Cambiando il titolo, la risposta che quel titolo chiede diventa un
> conteggio, e la deriva non ha più da dove partire.

#### Il futuro — 7 voci

| Domanda d'origine | Che cosa non andava | Voce del catalogo | Stato |
| --- | --- | --- | --- |
| «Quanto sarà la mia pensione? A che età potrò andare in pensione?» | due domande in una | *invariata* la prima metà (`area3Domanda`) — **sulla card**. La seconda metà non diventa una voce a sé: vedi «Cosa NON fa» | in arrivo |
| «Come proteggo i miei risparmi dall'inflazione?» *(da «Il costo della vita»)* | imperativo | *già riscritta in `01`* (`area3Altra3`) | **con schermata** → `07` |
| «Riuscirò a metter via qualcosa ogni mese?» | previsione sulla persona | *già riscritta in `01`* (`area3Altra1`): «Se metto via 50 € al mese, in dieci anni quanto diventano?» — da pronostico ad aritmetica su una cifra dichiarata | in arrivo |
| «Come costruisco un fondo di emergenza?» | **imperativo**: chiede istruzioni | **nuova** (`area3Altra4`): «Con i soldi che ho da parte, per quanti mesi coprirei le spese senza stipendio?» — è la stessa divisione della sezione 4, simulatore 3, senza il «devi» | in arrivo |
| «Quanto mi costa davvero il mio mutuo/prestito nel tempo?» | niente | *già riscritta in `01`* (`area3Altra2`) | in arrivo |
| «Meglio conto deposito, ETF o BTP per i miei risparmi?» | **sceglie fra prodotti con il nome** — la riga più pericolosa delle diciotto | **nuova** (`area3Altra5`): «Se i soldi mi servono fra sei mesi, che cosa cambia rispetto a quando mi servono fra dieci anni?» — il principio della sezione 6 («prima il bisogno, poi lo strumento») portato fino in fondo: resta il bisogno, sparisce il prodotto | in arrivo |
| «Come pianifico la successione senza litigi in famiglia?» | **istruzioni** più una promessa sul risultato | **nuova** (`area3Altra6`): «Quando una persona muore, che cosa succede alla casa e ai risparmi che lascia?» | in arrivo |

**Diciotto entrano, diciotto escono**: 5 + 6 + 7. Una cambia area, una è fusa in
un'altra, di una si tiene solo la seconda metà, e una in più arriva dalla
sezione 4. Il conto torna, e il test lo verifica.

## Elaborazione

Nessun calcolo di dominio. Ci sono però **sei derivazioni**, tutte rifacibili a
mano su un foglio, ed è su quelle che poggiano i test.

1. **Ogni voce è un oggetto dichiarato**: `id`, area di appartenenza, chiave in
   `testi.ts`, `stato`, e `percorso` solo quando esiste.
2. **`stato` ha tre valori e uno solo**: `con-schermata` (la risposta c'è ed è
   raggiungibile), `in-arrivo` (la risposta è prevista, la schermata no),
   `senza-fonte` (rispondere richiederebbe un dato che nessuna fonte dichiarata
   ci dà, o una previsione su chi legge: il sito dichiara di non rispondere).
3. **`percorso` è presente se e solo se `stato` è `con-schermata`.** È
   l'invariante che rende impossibile un link che non porta da nessuna parte, e
   una schermata esistente che nessuno raggiunge.
4. **La domanda stampata sulla card è la prima della lista dell'area**, come già
   oggi. Regola nuova: **nessuna voce `senza-fonte` può stare prima.** Una card
   è una promessa; promettere una risposta che non arriva è il modo più rapido
   per perdere chi legge alla prima schermata.
5. **Il numero del badge resta una sottrazione**, già scritta in
   `contaAltreDomande`: lunghezza della lista meno la domanda già stampata.

   ```
   costo della vita   5 − 1 = 4      badge: «altre 4 domande qui dentro»
   lavoro             6 − 1 = 5      badge: «altre 5 domande qui dentro»
   futuro             7 − 1 = 6      badge: «altre 6 domande qui dentro»
   ```

6. **I tre stati sommano al totale**: 1 `con-schermata` + 1 `senza-fonte` +
   16 `in-arrivo` = 18. Oggi **una domanda su diciotto** ha una schermata
   dietro, ed è `07`. Il catalogo lo dice a voce alta invece di nasconderlo:
   è anche il numero che rende leggibile il progresso delle prossime ore.

> **Le liste non sono lunghe uguali — 5, 6, 7 — ed è voluto.** Pareggiarle
> vorrebbe dire inventare una domanda o buttarne via una vera per simmetria. Il
> numero del badge si deriva dalla lista, quindi non può mentire quando la
> lista cambia.

## Output

Nessuna schermata nuova: cambia **che cosa c'è dentro** le schermate di
`01-landing-page`.

| Dove | Che cosa cambia |
| --- | --- |
| Pagina iniziale | i tre badge leggono 4 · 5 · 6; la card de «Il lavoro» porta una domanda diversa |
| Pagina di un'area | l'elenco completo delle voci, **ognuna con il suo stato scritto a parole** |
| Voce `con-schermata` | link vero, **sottolineato**: si distingue senza colore e senza passare il mouse |
| Voce `in-arrivo` | testo, e sotto: «La schermata che risponde a questa domanda non c'è ancora.» |
| Voce `senza-fonte` | testo, e sotto: «Su questa il sito non ha una risposta con una fonte dichiarata, e non la inventa.» |

**Niente semaforo di colore su queste tre etichette.** Verde/giallo/rosso
direbbe «buona / così così / brutta domanda», che è un giudizio su chi la pone.
Lo stato riguarda il sito, non la domanda: si scrive a parole.

**Una stringa cambia valore** — `area2Domanda` in `testi.ts`: da «Il mio settore
è a rischio nei prossimi anni?» a «Nel mio settore, quante persone hanno perso
il lavoro negli ultimi anni?». È l'unica delle dodici già a schermo che viene
riscritta, e va riletta da `guardrail-officer` come se fosse nuova. **La
formulazione vecchia non resta da nessuna parte in `src/`**, nemmeno in un
commento che spiega il cambio: il nome della chiave non cambia, quindi non
serve, e il guardrail scandisce anche i commenti.

**Stringhe nuove** — sei domande (`area1Altra4`, `area2Altra4`, `area2Altra5`,
`area3Altra4`, `area3Altra5`, `area3Altra6`) e tre righe di stato
(`domandaInArrivo`, `domandaSenzaFonte`, `areaNessunaSchermata`). Vanno in un
file affiancato `src/ui/testiCatalogo.ts`, che entra in `testi.ts` con lo
spread: stessa soluzione già adottata per `testiSimulazione.ts`, e il registro
che il guardrail scandisce resta **un oggetto solo**. Motivo: `testi.ts` è a
115 righe e il limite è 150.

**I quattro stati obbligatori:**

1. **Vuoto** — un'area in cui **nessuna** voce ha una schermata (oggi «Il costo
   della vita» e «Il lavoro»): l'elenco si vede lo stesso, e in testa una riga
   dice che cosa manca e che arriverà, non «nessun risultato».
2. **In caricamento** — non esiste: il catalogo è una costante compilata nel
   bundle. Va detto qui perché nessuno lo aggiunga per riflesso: una rotellina
   su un dato già presente è rumore.
3. **Errore** — un indirizzo d'area inesistente porta alla pagina iniziale,
   comportamento già garantito da `parseRotta`. Una chiave di testo inesistente
   non è un errore da gestire a schermo: il compilatore la rifiuta prima, ed è
   il motivo per cui le voci portano chiavi tipizzate e non stringhe.
4. **Dati lunghi** — sette voci, e le domande più lunghe passano i 90 caratteri:
   devono andare a capo senza tagliarsi, restare sopra i 16 px, e ogni link
   deve restare toccabile in 44×44 px anche su due righe.

## Come si dimostra che ha funzionato

**`tests/catalogo.test.ts` (nuovo)** — sono gli invarianti del punto
«Elaborazione», uno a uno:

- il catalogo ha **18 voci**, e ogni area ne ha rispettivamente 5, 6, 7;
- **ogni chiave del catalogo esiste in `STRINGHE_UTENTE`** — un elenco che
  rimanda a una stringa cancellata è il difetto che nessuno vede finché non
  apre quella pagina;
- `percorso` presente **se e solo se** `stato === 'con-schermata'`;
- per ogni voce con `percorso`, **`parseRotta(percorso)` non restituisce
  `home`**: è la prova che nessun link muore, calcolabile senza aprire il
  browser;
- **nessuna voce `senza-fonte` è in prima posizione** in nessuna area;
- i tre conteggi per stato sommano a 18 (1 + 1 + 16).

**`tests/home.test.ts` (modificato)** — due asserzioni cambiano ed è previsto,
non una sorpresa: `contaAltreDomande('lavoro')` passa da `3` a `5`, e il badge
da «altre 3 domande qui dentro» a «altre 5 domande qui dentro». È il segno che
il numero si deriva dalla lista: se la lista cresce e il test non si accorge di
niente, il numero era scritto a mano.

**`tests/lessico-ui.test.ts` (invariato)** — prende le nove stringhe nuove da
solo, perché passano da `testi.ts`. Con il termine aggiunto al lessico
(«meglio», «preferibile»), la domanda d'origine «Meglio conto deposito, ETF o
BTP» **non potrebbe più entrare a schermo**: oggi passerebbe la scansione, ed è
il buco che questa funzionalità mette in luce.

**In demo, dieci secondi**: si apre «Il lavoro», si scorre l'elenco fino
all'ultima voce e si legge ad alta voce la riga sotto «Nel mio settore, quante
persone hanno perso il lavoro negli ultimi anni?» — «su questa il sito non ha
una risposta con una fonte dichiarata, e non la inventa». È la slide dei limiti,
dimostrata dal prodotto invece che scritta accanto.

## Cosa questa funzionalità NON fa

- **Non introduce nessun campo di domanda libera, nessuna ricerca a testo.** Il
  documento d'origine indica questo catalogo come base anche per la ricerca
  interna; `01-landing-page` l'aveva già rimandata proprio qui. Resta fuori: a
  runtime non c'è nessun modello, e un campo in cui si scrive una domanda
  produce l'aspettativa di una risposta che il sito non può dare. Se un giorno
  si farà, dovrà **portare a una voce di questo catalogo**, non rispondere — e
  sarà una spec sua, che lo dichiara in prima riga.
- **Non risponde a nessuna delle diciotto domande.** Le pagine di spiegazione
  sono `03`, i simulatori `08`–`12`. Qui si costruisce l'indice e il suo stato.
- **Non costruisce nessuna schermata nuova e non aggiunge rotte.** L'unico
  percorso citato è quello che `07` ha già creato.
- **Non calcola niente** e non tocca `src/core/`: nessun numero compare.
- **Non ordina le domande per importanza.** L'ordine è una scelta redazionale
  dichiarata — la più frequente per prima — non una classifica di quanto una
  domanda «conta». Dire a qualcuno che la sua domanda è la meno importante è
  esattamente il modo di farlo sentire giudicato.
- **Non spacca «a che età potrò andare in pensione?» in una voce a sé.** Ha la
  stessa fonte e la stessa pagina della prima metà: sarà la spec della pensione
  a decidere se separarle, con i dati sotto gli occhi. Separarla adesso
  significherebbe promettere due pagine dove ne è prevista una.
- **Non inventa le fonti delle risposte.** Le voci `in-arrivo` dicono che la
  risposta arriverà, non quando né da quale dato: la tabella delle fonti è il
  task `13`, e duplicarla qui creerebbe due verità che divergono al primo
  aggiornamento.
- **Non riscrive le dodici domande già a schermo.** Sono riformulazioni già
  approvate in `01` e già passate dal lessico. Riaprirle costerebbe la
  riverifica di tutte per un guadagno nullo.
- **Non tocca `types/`.** Il catalogo è contenuto redazionale e vive in
  `src/ui/`, esattamente come `contenutiHome.ts` oggi.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **nessuno.** Il catalogo non legge `types/contracts.ts`: non c'è documento, non c'è voce, non c'è importo. I tipi `DomandaCatalogo` e `StatoDomanda` nascono **dentro `src/ui/`**, di proprietà di ui-builder |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: **questa funzionalità non modifica `types/`**, quindi **non richiede l'architetto** |
| **Agente incaricato** | **`03-ui-builder`** (catalogo, testi, pagina d'area), con **`04-guardrail-officer`** per il termine nuovo nel lessico e per i test |
| **Directory toccate** | **3 — servono due agenti.** `src/ui/` · `src/guardrails/` · `tests/`. **Non** `src/core/`, **non** `src/assessment/`, **non** `types/` |
| **File previsti** | `src/ui/`: `catalogoDomande.ts` (nuovo, le 18 voci), `testiCatalogo.ts` (nuovo, 9 stringhe), `contenutiHome.ts` (le aree derivano dal catalogo), `PaginaMacrocategoria.tsx` (perde la mappa `SCHERMATA_DELLA_DOMANDA`, stampa lo stato), `testi.ts` (spread), `stiliHome.css` o un foglio affiancato per l'elenco e le righe di stato. `src/guardrails/`: `lessico.ts`. `tests/`: `catalogo.test.ts` (nuovo), `home.test.ts` (due asserzioni) |
| **Evidenza prodotta per il deck** | `../presentation/screenshots/02-area-lavoro.png` — la pagina de «Il lavoro» con le sei voci e, in fondo, l'unica voce «senza fonte»: è la slide dei limiti mostrata dal prodotto. In più `02-home-badge.png`, i tre badge a 4 · 5 · 6, che prova che il numero si deriva dalla lista |
| **dipende-da** | `01-landing-page` (**fatto**): riusa le sue dodici chiavi in `testi.ts`, il suo `contenutiHome.ts` e la sua `PaginaMacrocategoria.tsx`. Nessun'altra dipendenza in ingresso |
| **Alimenta** | `03` (le pagine di spiegazione prendono da qui i titoli: una pagina = una voce di catalogo) e i simulatori `08`–`12`, che per comparire nell'elenco cambiano **una riga** del catalogo — `stato` e `percorso` — e nessun componente. Da eseguire **prima** di tutti loro: al contrario, ognuno riscriverebbe la propria lista di domande |

### Il guadagno strutturale, non solo sei domande in più

Oggi la frase «questa domanda ha una schermata dietro» è scritta **dentro un
componente**, nella mappa `SCHERMATA_DELLA_DOMANDA` di
`PaginaMacrocategoria.tsx`. Con diciotto voci e cinque task in arrivo, ognuno
andrebbe a modificare quel componente: cinque agenti sullo stesso file, che è
il modo esatto in cui i conflitti nascono e falliscono in silenzio.

Il catalogo sposta quella conoscenza in un **dato dichiarato**. Da lì in poi
`03` e i simulatori cambiano una riga del catalogo — `stato` e `percorso` — e
non toccano più nessun componente.

### Conflitto di pianificazione, da sapere prima di `/implementa`

- **Libero adesso.** `01-landing-page` e `07` sono `fatto`: `src/ui/` e `tests/`
  non sono occupati da nessuno.
- **Occupa tre directory su cinque**, fra cui `src/ui/` e `tests/`, che sono le
  più contese: **finché `02` è aperto, `03` e i task dei simulatori non possono
  girare in parallelo**.
- **`src/guardrails/` è nell'impronta**: un solo termine aggiunto a
  `lessico.ts`, ma quella directory è condivisa e va dichiarata, non subita.
- **Va prima di `03`.** Le pagine di spiegazione si agganciano alle voci del
  catalogo: invertire l'ordine significherebbe riscrivere la lista delle
  domande dentro `03`, cioè produrre la seconda copia che questo task esiste
  per evitare.

### Da portare all'architetto, non da aggirare

1. **La card de «Il lavoro» cambia domanda, e quella domanda cambia testo.**
   `01-landing-page` è chiuso e verificato con «Il mio settore è a rischio nei
   prossimi anni?» in evidenza. Questa spec fa due cose su quella riga: la
   **riscrive** — perché è una previsione sulla singola persona, difetto che la
   `01` aveva già annotato come eredità dell'area 2 — e la **sposta in fondo**,
   perché è l'unica delle diciotto a cui il sito non può rispondere con una
   fonte. Sono due decisioni di prodotto su lavoro già consegnato e verificato:
   vanno confermate, non applicate di nascosto. Conseguenza documentale: la
   sezione «Verificato» della `01` cita la formulazione vecchia e andrà
   riallineata da `doc-funzionale`, non da chi scrive il codice.
2. **Le chiavi non vengono rinominate.** Dopo lo spostamento, `area2Domanda` non
   è più la domanda della card: il nome mente. Rinominarla toccherebbe il test
   di `01` senza cambiare un solo comportamento, quindi non si fa — e
   l'invariante sul primo elemento della lista impedisce che l'equivoco diventi
   un difetto. Resta un debito di nome, dichiarato qui.
3. **Il lessico si allarga: «meglio» e «preferibile».** Oggi «migliore» è
   bloccato ma «meglio» passa — e la domanda d'origine dice proprio «Meglio
   conto deposito, ETF o BTP». Verificato prima di proporlo: **nessuna
   occorrenza delle due parole in `src/`, `tests/`, `types/`**, quindi
   l'aggiunta non fa diventare rosso niente di esistente. Il costo c'è, e va
   detto: l'hook scandisce anche i commenti dei sorgenti, quindi da quel momento
   un commento con «si legge meglio» farà fallire la build. La chiamata finale è
   di `04-guardrail-officer`.
4. **«Proteggere» resta fuori dal lessico.** L'imperativo di «come proteggo i
   miei risparmi» è già sciolto dalla riformulazione, e la parola ha usi
   fattuali legittimi («la legge protegge…»): metterla nell'elenco produrrebbe
   falsi allarmi senza guadagno.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-14, dalla sola specifica.
> La fase 2 — rilettura del codice e dei test, esecuzione dei passi qui sotto e
> riscrittura al presente sotto «Verificato» — non è ancora stata fatta.

### Cosa farà

Le pagine delle tre aree mostreranno diciotto domande al posto delle dodici di
oggi — cinque per «il costo della vita», sei per «il lavoro», sette per «il
futuro», sei in più di adesso — e sotto ognuna comparirà una riga scritta a
parole, non a colori, che dirà se il sito sa già rispondere, se risponderà
presto, oppure se dichiara di non avere ancora una fonte per quel numero.

Sette domande che oggi chiedono «che cosa mi conviene» o provano a indovinare
il futuro di chi legge diventeranno domande su un meccanismo — la differenza
fra due percorsi, non la scelta fra loro. E «Il mio settore è a rischio nei
prossimi anni?» lascerà il posto in evidenza sulla card «Il lavoro» a una
domanda a cui si può rispondere con i fatti: scenderà in fondo all'elenco della
sua area, riscritta e segnata «senza fonte» — resterà visibile, non sparirà.

### Per chi

Una persona che entra in un'area del sito con un'ansia già formata — «la
bolletta di questo mese non me la spiego», «se perdo il posto, di che vivo» —
e che davanti a un elenco di parole tecniche non saprebbe dove guardare,
perché nessuna di quelle parole è la sua. Non cercherà «inflazione» né
«previdenza complementare»: cercherà la propria frase, scritta come la
direbbe lei. Se non la trova in dieci secondi, se ne andrà convinta che il
sito non parli con lei.

Le servirà **nei primi due tocchi, sempre**: nel momento in cui entra in
un'area dalla pagina iniziale e scorre un elenco corto per riconoscere la
domanda che si è fatta stamattina — e per capire subito, senza passare il
mouse su niente, se il sito le sa già rispondere, le risponderà presto, o le
dice onestamente che oggi non ha una fonte per farlo.

### Come si proverà

Sono i criteri di accettazione: finché anche uno solo di questi passi non dà
il risultato atteso, la funzionalità non è finita. I comandi vanno eseguiti da
`app/`.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`).
   *Risultato atteso:* lo script dirà «Ambiente già pronto», oppure elencherà i
   passi che ha installato, e il suo controllo di salute — `tsc --noEmit` e poi
   `npm test` — finirà senza errori. Se fallisce, ci si ferma qui.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia`. Mai `npm run dev` a
   mano: è un processo che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo `http://localhost:5173`.
   Aprendolo comparirà la home.

3. **Il numero sui tre badge, e perché non è più lo stesso ovunque.** Sulla
   home, leggere la riga in fondo a ciascuna delle tre card.
   *Risultato atteso:* oggi le tre card leggono tutte «altre 3 domande qui
   dentro», lo stesso numero ovunque. Dopo, si leggeranno tre numeri diversi:
   **«altre 4 domande qui dentro»** su «Il costo della vita», **«altre 5
   domande qui dentro»** su «Il lavoro» (la funzione che lo calcola,
   `contaAltreDomande('lavoro')`, passerà da 3 a 5) e **«altre 6 domande qui
   dentro»** su «Il futuro». Tre liste di lunghezza diversa, tre badge diversi:
   è il segno che il numero si deriva dalla lista invece di essere scritto a
   mano.

4. **Diciotto domande in tutto, non più dodici.** Entrare in ciascuna delle tre
   aree ed elencare tutte le voci, quella già letta sulla card compresa.
   *Risultato atteso:* «Il costo della vita» ne conterà **5**, «Il lavoro»
   **6**, «Il futuro» **7** — 5 + 6 + 7 fa **18**, sei domande in più delle
   dodici di prima. Le liste non saranno lunghe uguali, ed è voluto: pareggiarle
   avrebbe voluto dire inventare una domanda o buttarne via una vera.

5. **La card «Il lavoro» ha cambiato domanda, e quella vecchia non è sparita.**
   Sulla home, leggere la domanda in evidenza sulla card «Il lavoro»; poi
   entrare nell'area e scorrere fino all'ultima voce dell'elenco.
   *Risultato atteso:* sulla card si leggerà **«Se perdo il lavoro, quanto
   prendo ogni mese e per quanto tempo?»**, non più «Il mio settore è a rischio
   nei prossimi anni?». Quella domanda non sarà sparita: comparirà come
   **ultima** voce dell'elenco, riscritta in **«Nel mio settore, quante persone
   hanno perso il lavoro negli ultimi anni?»**, con sotto la frase «Su questa
   il sito non ha una risposta con una fonte dichiarata, e non la inventa.»

6. **Le sette domande che sceglievano per chi legge, tutte con una nuova
   formulazione.** Cercare, nelle tre aree, se compare ancora una delle sette
   domande d'origine qui sotto; se non compare, verificare che al suo posto
   compaia la riscrittura.

   | Non comparirà più | Comparirà al suo posto |
   | --- | --- |
   | «Mutuo o affitto, cosa mi conviene?» | «Quanto mi costa la casa ogni mese, tutto compreso?» |
   | «Come proteggo i miei risparmi dall'inflazione?» | «I risparmi fermi sul conto: che cosa succede loro mentre i prezzi salgono?» |
   | «Conviene cambiare fornitore o offerta?» | «Che cosa cambia in bolletta fra un'offerta a prezzo fisso e una a prezzo variabile?» |
   | «Conviene aprire una partita IVA o restare dipendente?» | «Con lo stesso importo, quanto resta a un dipendente e quanto a chi lavora in proprio?» |
   | «Il mio contratto a termine verrà rinnovato? Cosa cambia rispetto a un indeterminato?» | «Contratto a termine e a tempo indeterminato: che cosa cambia, in concreto, fra i due?» |
   | «Il mio settore è a rischio nei prossimi anni?» | «Nel mio settore, quante persone hanno perso il lavoro negli ultimi anni?» |
   | «Meglio conto deposito, ETF o BTP per i miei risparmi?» | «Se i soldi mi servono fra sei mesi, che cosa cambia rispetto a quando mi servono fra dieci anni?» |

   *Risultato atteso:* nessuna delle sette frasi di sinistra comparirà in
   nessuna delle tre aree; ognuna delle sette di destra sì. Le nuove
   formulazioni descriveranno un meccanismo o una differenza fra due percorsi,
   mai una scelta da fare o un pronostico sulla persona che legge — coerente
   con il fatto che il sito spiega e calcola, non consiglia.

7. **Ogni voce dice il proprio stato a parole, senza bisogno del mouse.**
   Scorrere l'elenco di un'area intera senza mai avvicinare il puntatore a
   nessuna riga.
   *Risultato atteso:* sotto ogni domanda **con schermata** ci sarà un link
   vero, riconoscibile perché **sottolineato** — non da un colore diverso, che
   da lontano, al proiettore, si vedrebbe peggio di una riga sotto la parola.
   Sotto ogni domanda **in arrivo** si leggerà «La schermata che risponde a
   questa domanda non c'è ancora.» Sotto l'unica domanda **senza fonte** si
   leggerà «Su questa il sito non ha una risposta con una fonte dichiarata, e
   non la inventa.» Tutte e tre le frasi si leggeranno stando fermi, senza
   passare il mouse su niente: al proiettore e su un telefono il passaggio del
   mouse non esiste.

8. **L'unico link vero porta dove promette.** Entrare in «Il futuro» e
   cliccare sulla domanda «I risparmi fermi sul conto: che cosa succede loro
   mentre i prezzi salgono?».
   *Risultato atteso:* il click porterà alla schermata della funzionalità 07
   (`#/valore-dei-risparmi`), quella già costruita per calcolare quanto valgono
   i risparmi fermi nel tempo. È l'unica delle diciotto voci raggiungibile oggi
   con un link vero: una su diciotto, non zero e non finta.

9. **Lo stato vuoto — un'area dove nessuna voce ha ancora una schermata.**
   Entrare in «Il costo della vita» oppure in «Il lavoro»: oggi nessuna delle
   due ha una voce «con schermata».
   *Risultato atteso:* l'elenco delle domande comparirà comunque per intero, e
   una frase dirà che cosa manca e che arriverà — non «nessun risultato», che è
   una porta chiusa e non una spiegazione.

10. **Lo stato «in caricamento» non esiste, e non dovrà comparire.** Ricaricare
    la pagina di un'area e guardarla nell'istante in cui appare.
    *Risultato atteso:* l'elenco comparirà **subito, già completo**: nessuna
    rotellina, nessun lampeggio, nessun testo che cambia un attimo dopo. Il
    catalogo è compilato dentro il pacchetto della pagina, non arriva da
    nessuna parte: se comparisse un'attesa, sarebbe un difetto nuovo, non una
    cosa prevista.

11. **L'errore — un indirizzo d'area che non esiste.** Scrivere a mano nella
    barra dell'indirizzo qualcosa come `#/un-area-inventata`.
    *Risultato atteso:* si aprirà la home, non una pagina bianca né un
    messaggio d'errore tecnico: è lo stesso comportamento già garantito per
    ogni indirizzo storto, e questa funzionalità non dovrà romperlo.

12. **Dati lunghi — le domande più lunghe non rompono la griglia.** Aprire «Il
    futuro», che con sette voci è l'elenco più lungo dei tre, e cercare la
    domanda su che cosa cambia se i soldi servono fra sei mesi o fra dieci
    anni: la sua riga misurerà più di 90 caratteri — più del doppio di «Perché
    la bolletta è così alta questo mese?», che oggi sta per intero su una card.
    *Risultato atteso:* il testo andrà a capo su più righe senza tagliarsi a
    metà parola, resterà leggibile sopra i 16 px, e l'area toccabile — link o
    meno — resterà larga almeno 44×44 px anche quando occupa due righe: quanto
    un polpastrello, non meno.

13. **Il resto della home resta come prima.** Ripetere, su questa versione, i
    controlli già superati dalla funzionalità 01: le tre card restano
    identiche per dimensione, colore e stile; il bottone «Pagina iniziale» e
    «Indietro» restano nello stesso punto su ogni pagina; stringendo la
    finestra sotto i 768 px le tre card si impilano nello stesso ordine; con
    solo Tab il focus attraversa le card e poi le voci dell'elenco in ordine di
    lettura, con un contorno visibile a ogni passaggio.
    *Risultato atteso:* nessuna di queste cose sarà cambiata. Le uniche
    differenze rispetto a prima saranno i numeri dei badge (passo 3), la
    domanda sulla card «Il lavoro» (passo 5) e il contenuto delle liste (passi
    4 e 6): tutto il resto della funzionalità 01 continuerà a funzionare
    esattamente come il giorno in cui è stata verificata.

14. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la pagina dalla cartella
    `dist/` servita da un server locale.
    *Risultato atteso:* la build finirà senza errori, e rifacendo i passi 3–9
    si vedrà lo stesso risultato, **senza che parta una sola richiesta fuori
    dal computer**: il catalogo è testo dichiarato nel codice, non un dato
    preso da qualche parte. Il caso del doppio clic diretto su
    `dist/index.html` è un difetto già noto e registrato nella funzionalità 01
    (passo 8): qui si verifica solo che questa funzionalità non ne aggiunga
    uno nuovo, non lo si risolve.

### Limiti previsti

- **Non introdurrà nessun campo di domanda libera né una ricerca a testo.** Un
  campo così, senza un modello che gira sul dispositivo, produrrebbe l'attesa
  di una risposta che il sito non può dare: resterà un elenco a tocco, non una
  casella da riempire.
- **Non risponderà a nessuna delle diciotto domande.** Costruirà solo l'indice
  e il suo stato: le risposte vere sono compito delle pagine di spiegazione
  (funzionalità 03) e dei simulatori (08–12).
- **Non aggiungerà nessuna schermata nuova e nessuna rotta.** L'unico percorso
  citato resterà quello che la funzionalità 07 ha già aperto.
- **Non calcolerà nessun numero di dominio.** Il catalogo è contenuto
  redazionale: nessuna fixture, nessun euro, nessuna voce di un documento.
- **Non ordinerà le domande per quanto contano.** L'ordine resterà una scelta
  dichiarata — la più frequente per prima — non una classifica: dire a
  qualcuno che la sua domanda è l'ultima della lista la farebbe sentire
  giudicata, ed è proprio ciò che il sito non deve mai far succedere.
- **Non separerà «quanto sarà la mia pensione» da «a che età potrò andare in
  pensione» in due voci distinte.** Restano un'unica voce finché una specifica
  dedicata alla pensione non deciderà diversamente, con i dati sotto gli occhi.
- **Non dichiarerà da quale fonte arriverà ciascuna risposta ancora da
  scrivere.** Le voci «in arrivo» diranno solo che la risposta arriverà, non
  quando né da quale numero: la tabella delle fonti è compito della
  funzionalità 13.
- **Non riscriverà le domande già a schermo, a un'unica eccezione:** quella in
  evidenza sulla card «Il lavoro», spostata e riscritta perché restava un
  pronostico sulla situazione di chi legge, travestito da domanda.
- **Non toccherà `types/`.** Il catalogo resterà contenuto redazionale dentro
  `src/ui/`, come già oggi le dodici domande esistenti.

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

> **Non ancora compilata.** Il codice di questa funzionalità non esiste ancora:
> non c'è niente da verificare, e scrivere qui qualcosa significherebbe
> dichiarare fatto ciò che nessuno ha controllato.
>
> Questa sezione si riempie in **fase 2**, al termine di `/implementa`, aprendo
> `src/ui/catalogoDomande.ts`, `src/ui/testiCatalogo.ts`,
> `src/ui/contenutiHome.ts`, `src/ui/PaginaMacrocategoria.tsx` e
> `src/guardrails/lessico.ts`, leggendo `tests/catalogo.test.ts` e le due
> asserzioni cambiate in `tests/home.test.ts`, e **rieseguendo davvero** i
> quattordici passi scritti sopra — badge compresi, Wi-Fi spento compreso.
> Conterrà «Cosa fa», «Come si prova», «Limiti» e «Divergenze fra previsto e
> realizzato», tutto al presente, e solo allora lo stato passerà a
> `implementato`.
>
> Finché questa sezione resta vuota, `/verifica` non accetta la funzionalità
> come `implementato`.
