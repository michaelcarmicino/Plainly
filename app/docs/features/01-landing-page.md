# 01 — «La landing page: tre porte e una navigazione che non cambia mai»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder»
>
> Fonte della richiesta: `.claude/skills/spec/landing-page.md` (punti 7.1, 7.2,
> 7.4). Il punto **7.3 — ricerca interna — non è in questa spec**: vedi
> «Cosa questa funzionalità NON fa».

## Per chi

Una persona che apre il sito con un'ansia già formata — «la bolletta di questo
mese è più alta e non capisco perché» — e nessuna idea di come si chiami la
cosa che sta cercando. Non sa che esiste la parola «quota fissa», non sa se il
sito parli di lei. Ha trenta secondi di pazienza.

## Quando serve

Al primo secondo: è la schermata che si apre. Serve anche al ritorno, ogni
volta che la persona finisce una lettura e deve capire dove andare adesso
senza perdersi.

## Cosa deve poter fare dopo

Da ferma sulla home, riconoscere in meno di dieci secondi **quale delle tre
aree contiene la sua domanda**, entrarci con un tap solo, e da qualunque punto
del sito tornare indietro o alla home trovando i due bottoni sempre nello
stesso posto.

## Input

Nessun dato di dominio. La home **non mostra numeri**: non legge fixture, non
chiama il core, non usa `types/contracts.ts`.

L'unico «dato» è contenuto redazionale, dichiarato in questa spec e scritto in
`src/ui/testi.ts`: per ogni macrocategoria un titolo, una domanda in evidenza e
tre altre domande.

> **Dato che oggi non esiste.** Il documento sorgente cita «le domande reali
> mappate nel Prompt 2» e «i dati dei sondaggi al punto 6»: nel repository non
> c'è né l'uno né l'altro. Le dodici domande qui sotto sono quindi una scelta
> redazionale di questa spec, non un estratto di una ricerca. L'ordine delle
> card (costo della vita → lavoro → futuro) è per lo stesso motivo una
> decisione dichiarata, non un ordinamento derivato da dati.

**Il costo della vita** — in evidenza: *«Perché la bolletta è così alta questo
mese?»*
1. «Con gli stessi soldi della spesa, quanto porto a casa rispetto a un anno fa?»
2. «Quanto mi costa la casa ogni mese, tutto compreso?»
3. «Lo stipendio è uguale ma i prezzi no: di quanto si è allargata la differenza?»

**Il lavoro** — in evidenza: *«Il mio settore è a rischio nei prossimi anni?»*
1. «Se perdo il lavoro, quanto prendo ogni mese e per quanto tempo?»
2. «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»
3. «Lavoro in proprio: quanto devo mettere da parte per tasse e contributi?»

> **Vincolo che questa spec lascia in eredità all'area 2.** «Il mio settore è a
> rischio nei prossimi anni?» è l'unica delle dodici che chiede un pronostico
> sulla situazione personale di chi legge, invece di un calcolo su qualcosa che
> è già vero. Come domanda è conforme e resta. Ma la **risposta**, quando verrà
> scritta, dovrà essere statistica descrittiva con la fonte dichiarata: un
> «il tuo settore è a rischio» ricadrebbe in `adatto-a-te` e `dovere-personale`
> senza averne usato le parole, cioè supererebbe il lessico automatico restando
> una consulenza personalizzata.

**Il futuro** — in evidenza: *«Quanto sarà la mia pensione?»*
1. «Se metto via 50 € al mese, in dieci anni quanto diventano?»
2. «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta?»
3. «I risparmi fermi sul conto: che cosa succede loro mentre i prezzi salgono?»

## Elaborazione

Nessun calcolo di dominio. I due soli passi verificabili a mano sono:

1. **Numero del badge** = lunghezza della lista di domande della
   macrocategoria − 1 (quella in evidenza è già visibile sulla card).
   Con quattro domande dichiarate: 4 − 1 = 3 → il badge legge «altre 3 domande
   qui dentro». Il numero **non si scrive a mano**: si deriva dalla lista, così
   non può mentire quando la lista cambia.

   In concreto: in `testi.ts` c'è **una sola** chiave `areaBadge`, con valore
   `'altre {n} domande qui dentro'`. Il `{n}` lo sostituisce
   `contaAltreDomande(area)` in `contenutiHome.ts`. Una stringa fissa per area
   riscriverebbe il numero a mano e ricadrebbe nel difetto che questo passo
   esiste per evitare; il segnaposto lascia comunque al guardrail una stringa
   intera da scandire in `testi.ts`.
2. **Rotta corrente** = lettura di `location.hash`. `#/` e qualunque valore non
   riconosciuto → home; `#/costo-della-vita`, `#/lavoro`, `#/futuro` → pagina
   della macrocategoria; `#/lettura` → la schermata di lettura del documento
   che oggi occupa `App.tsx`.

Rotte via hash e non via `history.pushState` perché il sito deve aprirsi da
`file://` con il Wi-Fi spento: con l'hash funziona anche il tasto «indietro»
del browser, che per molte persone è l'unico che conoscono.

## Output

**Home (`#/`)**

- Titolo e sottotitolo dell'app, già presenti.
- Tre card **identiche per dimensione, colore e stile**. Nessuna più grande o
  più colorata: chi ha un'ansia sul terzo tema non deve sentirsi in coda.
  Desktop: tre colonne. Sotto i 768 px: impilate, stesso ordine.
- Ogni card contiene, in quest'ordine: icona concreta (SVG inline, `aria-hidden`,
  mai sola — sempre accanto al titolo), titolo, domanda in evidenza, badge con
  il testo «altre 3 domande qui dentro».
- **Le tre icone sono dichiarate qui**, così non si inventano in fase di
  costruzione: carrello della spesa per il costo della vita, busta paga per il
  lavoro, salvadanaio per il futuro. Oggetti quotidiani, mai simboli astratti
  come `€` o un grafico: chi non ha dimestichezza con la finanza non li legge.
- **Tutta la card è il bersaglio del click** (`<a href="#/...">` in blocco,
  altezza minima 44 px abbondantemente superata), non un bottoncino interno.
- **Effetto «carte impilate»**: massimo 2 rettangoli vuoti dietro, offset 8 px
  in basso-destra su desktop e 4 px su mobile, nessuna rotazione, **bordo
  sottile** invece del solo colore chiaro così restano visibili a chi ha una
  vista meno acuta. Sono `aria-hidden` e non cliccabili. A riposo è già tutto
  leggibile: l'hover su desktop scopre un po' di più le carte dietro, ma
  **non è mai l'unica fonte dell'informazione** — il badge testuale lo è.
- Sotto le card, accesso rapido alla schermata di lettura del documento
  (`#/lettura`), per chi sa già dove vuole andare.

**Pagina macrocategoria (`#/costo-della-vita` · `#/lavoro` · `#/futuro`)**

Titolo dell'area e l'elenco completo delle sue quattro domande, come testo.
Le domande **non sono ancora link**: sotto l'elenco compare
`statoPlaceholder`, che dichiara che il contenuto è in costruzione. Meglio un
elenco onesto che tre link che non portano da nessuna parte.

**Navigazione, su ogni pagina, sempre nella stessa posizione**

Percorso («Pagina iniziale › Il lavoro»), bottone «Pagina iniziale» e bottone
«Indietro». Sulla home **non compare né il percorso né «Indietro»**: non esiste
un passo precedente, e un percorso di un solo gradino non è un percorso. Un
bottone disattivato si spiega peggio di un bottone assente. Tutto raggiungibile
da tastiera, con `:focus-visible` visibile.

**Il percorso è posizione, mai destinazione: nessun gradino è cliccabile.**
Così verso la pagina iniziale esiste **una sola** affordance, in **un solo**
punto fisso — che è quello che chiede la tabella di accessibilità. Il gradino
corrente porta `aria-current="page"`.

> **Emendamento, non scivolamento.** La prima stesura diceva «sulla home il
> breadcrumb legge solo Home». `guardrail-officer` ha rilevato che si
> otteneva così la parola «Home» due volte affiancata, una cliccabile e una
> no, senza che niente dicesse quale fosse quale: per questo pubblico è
> proprio ciò che produce l'esitazione. L'argomento è identico a quello che
> la spec applicava già a «Indietro», quindi è stato esteso al percorso.
> «Home» è inoltre diventato «Pagina iniziale»: è vocabolario del web dato
> per scontato, e l'icona non porta l'informazione da sola.

**Stringhe nuove in `src/ui/testi.ts`** — chiavi: `homeIntestazione`,
`homeAccessoRapido`, `navHome`, `navIndietro`, `navPercorso`, `areaBadge`
(una sola, con il segnaposto `{n}`), e per ciascuna delle tre aree
`areaNTitolo`, `areaNDomanda`, `areaNAltra1..3`. Nessun testo letterale nei
componenti, come sempre.

## Come si dimostra che ha funzionato

`tests/home.test.ts` (nuovo), con `renderToStaticMarkup` da `react-dom/server`
— nessuna dipendenza nuova:

- `contaAltreDomande('lavoro')` → `3` (4 domande dichiarate − 1 in evidenza).
- Il testo del badge dell'area «lavoro» → `'altre 3 domande qui dentro'`:
  prova che il segnaposto `{n}` viene sostituito e che nessun numero è
  scritto a mano in `testi.ts`.
- `parseRotta('#/lavoro')` → `{ tipo: 'macrocategoria', id: 'lavoro' }`;
  `parseRotta('#/qualunque-cosa')` → `{ tipo: 'home' }`.
- Il markup della home contiene esattamente 3 card e nessuna delle tre porta
  una classe diversa dalle altre due (peso visivo identico, verificato sul
  markup e non a occhio).
- Ogni stringa nuova passa `verificaTestoUtente`: è il test già esistente
  `lessico-ui.test.ts`, che le prende automaticamente da `testi.ts`.

**In demo, dieci secondi**: si apre la home, si legge ad alta voce la domanda
sulla prima card, un tap, si è dentro. Poi si stringe la finestra a larghezza
telefono e le card si impilano senza che nulla si rompa.

## Cosa questa funzionalità NON fa

- **Non fa la ricerca interna (punto 7.3).** Ha bisogno di un indice di domande
  e di varianti informali che oggi non esiste, ed è la parte che più rischia di
  scivolare verso un campo di domanda libera — cioè verso il quarto motivo di
  rifiuto. Va in una spec propria, `02-ricerca-domande`, che dovrà dichiarare
  l'indice come dato statico e il fatto che la ricerca **naviga**, non risponde.
- **Non fa i Simulatori né le Guide-documento.** L'accesso rapido punta solo
  alla schermata di lettura che già esiste.
- **Non mostra nessun numero di dominio** e non tocca il core.
- **Non produce da sola il valore del prodotto.** È il guscio che rende
  raggiungibili le funzionalità che un'ansia la trasformano in un numero: presa
  da sola non trasforma niente, e non è il centro della demo.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | nessuno. La home non legge `types/contracts.ts`: i contenuti sono redazionali e vivono in `src/ui/` |
| **Contratti già congelati?** | no — `.contracts-frozen` non esiste nella root. Irrilevante qui: non serve toccarli, e questa spec **non richiede l'architetto** |
| **Agente incaricato** | `03-ui-builder` (costruzione) · `04-guardrail-officer` (il test nuovo e la rilettura delle 12 domande) |
| **Directory toccate** | **2 — servono due agenti.** `src/ui/` (più `src/main.tsx` e `index.html`, che appartengono comunque a ui-builder) e `tests/` |
| **File previsti** | `src/ui/`: `testi.ts` esteso, `contenutiHome.ts`, `rotte.ts`, `Navigazione.tsx`, `CardMacrocategoria.tsx`, `Home.tsx`, `PaginaMacrocategoria.tsx`, `PaginaLettura.tsx` (il contenuto attuale di `App.tsx`, spostato), `App.tsx` ridotto a guscio di rotte, `styles.css` esteso. `tests/`: `home.test.ts` |
| **Evidenza prodotta per il deck** | `presentation/screenshots/01-home-desktop.png` e `01-home-mobile.png` per la slide 4, catturati con `/evidenza` (li deposita `06-evidence-collector`, che lavora dalla root) |

## Da portare all'architetto, non da aggirare

1. `agents/03-ui-builder.md` cita `app/src/ui/stringheUtente.ts`; il file reale
   è `testi.ts`. Divergenza nella definizione dell'agente, non nel codice.
2. `docs/brief.md` descrive un prodotto a documento singolo con quattro
   scenari; questa home è l'architettura a tre macrocategorie di
   `app/CLAUDE.md`. Le due cose convivono solo se la lettura del documento
   diventa una delle destinazioni. Il brief dice che l'idea si congela a
   T+1:40: è la decisione da prendere lì.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-14, dalla sola specifica.
> La fase 2 — rilettura del codice e dei test, e riscrittura al presente sotto
> «Verificato» — non è ancora stata fatta.

### Cosa farà

La prima schermata mostrerà tre porte, una per ciascuna delle tre aree in cui
il sito è diviso — il costo della vita, il lavoro, il futuro — e su ognuna sarà
stampata per esteso la domanda che quell'area affronta, scritta come la
direbbe una persona: «Perché la bolletta è così alta questo mese?».

Un tocco su una porta porterà all'elenco delle domande di quell'area. Da
qualunque schermata del sito, i bottoni «Home» e «Indietro» resteranno sempre
nello stesso punto, così chi si perde ritrova la strada senza cercarla.

### Per chi

Una persona che apre il sito con un'ansia già precisa — «la bolletta di questo
mese è più alta e non capisco perché» — ma senza la parola tecnica per cercarla:
non sa che esiste «quota fissa», e non sa nemmeno se questo sito parli di lei.

Le servirà **al primo secondo**, perché è la schermata che si apre: in meno di
dieci secondi deve riconoscere quale delle tre aree contiene la sua domanda ed
entrarci con un tocco solo. E le servirà **di nuovo al ritorno**, ogni volta
che finisce una lettura e deve capire dove andare adesso.

### Come si proverà

Sono i criteri di accettazione: finché anche uno solo di questi passi non dà il
risultato atteso, la funzionalità non è finita. I comandi vanno eseguiti da
`app/`.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`, che esegue
   `node scripts/prepara.mjs`).
   *Risultato atteso:* lo script dirà «Ambiente già pronto», oppure elencherà
   i passi che ha installato. Il suo controllo di salute — `tsc --noEmit` e poi
   `npm test` — finirà senza errori. Se un passo fallisce, ci si ferma qui: il
   resto della prova non direbbe niente di utile.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue
   `node scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un
   processo che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo
   `http://localhost:5173`. Aprendolo nel browser comparirà la home.

3. **Le tre porte, con lo stesso peso.** Guardare la home senza toccare nulla.
   *Risultato atteso:* si vedranno tre card, in quest'ordine — «Il costo della
   vita», «Il lavoro», «Il futuro» — identiche per dimensione, colore e stile.
   Nessuna sarà più grande, più colorata o con il bordo diverso dalle altre due:
   chi arriva con un'ansia sul terzo tema non deve sentirsi in coda. Su desktop
   staranno su tre colonne della stessa larghezza. Il controllo non si farà a
   occhio: con «tasto destro → Ispeziona» su ciascuna card, le tre porteranno
   le stesse classi, senza varianti «in evidenza» su una sola.

4. **Il badge dice una frase, non un numero.** Leggere la riga in fondo a
   ciascuna delle tre card.
   *Risultato atteso:* si leggerà **«altre 3 domande qui dentro»** — una frase
   intera, non un «3» isolato dentro un cerchio, che da solo non direbbe di che
   cosa sono tre. Per vedere da dove viene quel 3: entrare nella card «Il
   lavoro» e contare le domande elencate nella pagina. Saranno quattro — quella
   già stampata sulla card più altre tre — e 4 − 1 = 3 è esattamente il numero
   del badge. Ripetendo il conteggio sulle altre due aree il badge dirà ancora
   3, perché anche lì le domande dichiarate sono quattro: il numero si deriva
   dalla lista, quindi non potrà mentire quando la lista cambierà.

5. **La navigazione, sempre nello stesso posto.** Dalla home, fare click in un
   punto qualunque della prima card — tutta la card sarà il bersaglio, non un
   bottoncino interno da centrare.
   *Risultato atteso:* l'indirizzo diventerà `#/costo-della-vita` e comparirà
   il titolo dell'area, l'elenco completo delle sue quattro domande come testo
   e, sotto, la nota che il contenuto è in costruzione. Il percorso in alto
   leggerà «Home › Il costo della vita». Il bottone «Home» sarà nello stesso
   identico punto in cui stava sulla home, con la stessa dimensione, e accanto
   comparirà «Indietro» — che sulla home non c'era perché lì non esiste un
   passo precedente. Un click su «Indietro» riporterà alla home; un click su
   «Home» anche. Funzionerà pure il tasto «indietro» del browser, che per molte
   persone è l'unico che conoscono.

6. **Con la finestra stretta come un telefono.** Trascinare il bordo della
   finestra fino a scendere sotto i 768 px di larghezza — quanto misura lo
   schermo di un telefono tenuto in verticale — oppure aprire il sito dal
   telefono.
   *Risultato atteso:* le tre card si impileranno una sotto l'altra **nello
   stesso ordine** di prima. Niente testo tagliato, nessuna barra di
   scorrimento orizzontale, nessun bottone più piccolo di 44×44 px — cioè più
   piccolo del polpastrello di un dito — e nessuna scritta sotto i 16 px.
   Riallargando la finestra le tre colonne si ricomporranno da sole.

7. **Solo con la tastiera, senza toccare il mouse.** Dalla home, premere Tab
   più volte di seguito, poi Invio.
   *Risultato atteso:* il focus attraverserà le tre card nell'ordine dichiarato
   e a ogni passaggio si vedrà un contorno netto attorno alla card che lo ha —
   visibile, non un accenno. Invio sulla card con il focus aprirà la pagina di
   quell'area, esattamente come il click. Continuando con Tab si raggiungeranno
   «Home» e «Indietro», che si attiveranno con Invio. I rettangoli vuoti
   dell'effetto «carte impilate» non riceveranno mai il focus. Questo passo non
   è un extra: se fallisce, la funzionalità non è finita.

8. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, poi lanciare
   `npm run build`. Spegnere il Wi-Fi e aprire il file `dist/index.html` con un
   doppio clic, così che si apra come `file://`.
   *Risultato atteso:* la build finirà senza errori e produrrà la cartella
   `dist/`. La home comparirà identica a quella vista al passo 3, le tre card
   resteranno cliccabili, la navigazione fra le aree e i bottoni «Home» e
   «Indietro» continueranno a funzionare. Nessun carattere tipografico e
   nessuna immagine resteranno in attesa di essere scaricati.

### Limiti previsti

- **Non ci sarà la ricerca interna.** Niente campo in cui scrivere la propria
  domanda: per arrivare a un'area si passerà dalle tre card. La ricerca ha
  bisogno di un elenco di domande e di modi informali di dirle che oggi non
  esiste, e vivrà in una specifica sua, `02-ricerca-domande`.
- **Non ci saranno Simulatori né Guide-documento.** L'accesso rapido sotto le
  card punterà soltanto alla schermata di lettura del documento che esiste già.
- **Non comparirà nessun numero di dominio.** La home non leggerà fixture e non
  chiamerà il core: l'unico numero a schermo sarà il 3 del badge, che conta
  domande e non euro.
- **Le domande dentro le pagine di area non saranno ancora link.** Si leggeranno
  come elenco, con sotto la nota che il contenuto è in costruzione: un elenco
  onesto vale più di tre link che non portano da nessuna parte.
- **Da sola non trasformerà nessuna ansia in un numero.** È il guscio che rende
  raggiungibili le funzionalità che lo fanno, e per questo non sarà il centro
  della demo.

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

> Stato: **implementato** · fase 2 eseguita il 2026-09-14 aprendo i file di
> `src/ui/`, il test `tests/home.test.ts` e rieseguendo gli otto passi scritti
> in fase 1.
>
> **Sette passi su otto danno il risultato atteso. L'ottavo no**: la build si
> apre bene da un server locale, ma con un doppio clic su `dist/index.html` la
> pagina resta bianca. Il dettaglio è nel passo 8 e in «Divergenze», e non è
> stato aggiustato qui per far combaciare la documentazione.

### Cosa fa

La prima schermata mostra tre porte, una per ciascuna delle tre aree in cui il
sito è diviso — il costo della vita, il lavoro, il futuro — e su ognuna è
stampata per esteso la domanda che quell'area affronta, scritta come la direbbe
una persona: «Perché la bolletta è così alta questo mese?».

Un tocco in un punto qualunque della porta apre l'elenco delle quattro domande
di quell'area. Da ogni schermata i due bottoni per tornare indietro restano
sempre nello stesso punto: misurati sul browser, «Pagina iniziale» occupa
182×44 px alle stesse identiche coordinate sulla home e dentro un'area, e
accanto compare «Indietro» solo dove un passo precedente esiste davvero.

### Per chi

Una persona che apre il sito con un'ansia già precisa — «la bolletta di questo
mese è più alta e non capisco perché» — ma senza la parola tecnica per
cercarla: non sa che esiste «quota fissa», e non sa nemmeno se questo sito
parli di lei.

Le serve **al primo secondo**, perché è la schermata che si apre: le tre porte
sono l'unica cosa a schermo sotto il titolo, e ognuna porta scritta la domanda
per intero. E le serve **di nuovo al ritorno**, ogni volta che finisce una
lettura e deve capire dove andare adesso.

### Come si prova

Sono gli stessi otto passi della fase 1, eseguiti il 2026-09-14 da `app/`.
Accanto a ciascuno c'è ciò che è successo davvero, non ciò che ci si aspettava.

1. **Preparare l'ambiente.** `npm run prepara` risponde «Ambiente pronto» e
   riporta ogni riga come «già a posto»: tipi, dipendenze, browser, e i test
   con 33 passati e 9 ancora da scrivere. ✅

2. **Avviare l'applicazione.** `node scripts/dev-server.mjs start` riporta
   `http://localhost:5173` e lascia la sessione libera. All'indirizzo compare
   la home. ✅

3. **Le tre porte, con lo stesso peso.** Le tre card compaiono nell'ordine
   dichiarato — «Il costo della vita», «Il lavoro», «Il futuro» — su tre
   colonne. Il controllo non è stato fatto a occhio: misurate dal browser, le
   tre occupano **345×217 px l'una**, sulla stessa riga, e portano la stessa
   identica classe `card-area`. Anche il fondo e il bordo calcolati dal browser
   sono la stessa stringa per tutte e tre: non esiste una variante «in
   evidenza» su una sola. ✅

4. **Il badge dice una frase, non un numero.** Sotto ogni domanda si legge
   **«altre 3 domande qui dentro»** — una frase intera, non un «3» solo dentro
   un cerchio. Entrando in un'area si contano quattro domande elencate: quella
   già letta sulla card più altre tre, e 4 − 1 = 3 è il numero del badge. Il
   test `tests/home.test.ts` lo blocca da due lati: `contaAltreDomande('lavoro')`
   vale 3, e in `testi.ts` la stringa `areaBadge` non contiene nessuna cifra,
   solo il segnaposto `{n}`. ✅

5. **La navigazione, sempre nello stesso posto.** Un click in un punto
   qualunque della prima card porta a `#/costo-della-vita`: compaiono il titolo
   dell'area, le sue quattro domande come testo e la nota che il contenuto è in
   costruzione. Il percorso in alto legge **«Pagina iniziale › Il costo della
   vita»** e **nessuno dei due gradini risponde al click** (contati: zero
   elementi cliccabili dentro il percorso); il gradino corrente porta
   `aria-current="page"`. Il bottone «Pagina iniziale» sta alle stesse
   coordinate e con la stessa dimensione della home, e accanto compare
   «Indietro», che sulla home non c'è. «Indietro» riporta alla home, «Pagina
   iniziale» anche, e il tasto «indietro» del browser pure. Un indirizzo
   inventato come `#/indirizzo-storto` apre la home, non una schermata di
   errore. ✅

6. **Con la finestra stretta come un telefono.** A 375×812 px le tre card si
   impilano **nello stesso ordine**, larghe 327 px ciascuna. La pagina non ha
   barra di scorrimento orizzontale (il contenuto misura 375 px esatti, quanto
   la finestra), il testo più piccolo dell'intera pagina è di 18 px — sopra il
   minimo di 16 — e «Pagina iniziale» resta 182×44 px. Riallargando la finestra
   le tre colonne si ricompongono da sole, di nuovo 345×217 l'una. Nota: da
   telefono le tre card hanno altezze diverse fra loro, perché ognuna è alta
   quanto il proprio testo; la larghezza e lo stile restano identici. ✅

7. **Solo con la tastiera.** Premendo Tab il focus attraversa le tre card
   nell'ordine dichiarato, e su ognuna compare un contorno netto di 3 px in
   rosa, non un accenno. Invio sulla card con il focus apre la pagina di
   quell'area, come il click. I rettangoli vuoti dell'effetto «carte impilate»
   non ricevono mai il focus: sono `aria-hidden="true"` e non ce n'è nemmeno
   uno raggiungibile da tastiera. ✅

8. **Con il Wi-Fi spento — questo passo non dà il risultato atteso.** ❌
   `npm run build` finisce senza errori e produce tre file: `index.html`
   (0,5 kB), un foglio di stile (4 kB) e il pacchetto JavaScript (156 kB).
   Dentro il pacchetto non c'è nessun indirizzo da scaricare: le uniche scritte
   che somigliano a un indirizzo sono i nomi tecnici degli SVG e un messaggio
   d'errore di React, nessuna delle due viene mai richiesta.
   La stessa cartella `dist/`, servita da un server locale, funziona per
   intero — home, tre card, badge, passaggio a un'area, tasto «indietro» — con
   **zero richieste fuori dal computer**.
   **Ma aperta come `file://`, cioè con il doppio clic, la pagina resta
   bianca.** Il browser rifiuta sia il JavaScript sia il foglio di stile con lo
   stesso motivo: «Access to script … from origin 'null' has been blocked by
   CORS policy». Il contenitore della pagina resta vuoto e non compare niente.
   La causa è nel tag che la build scrive: `<script type="module" crossorigin
   src="./assets/…">`. Il percorso è relativo e quello va bene; sono
   `type="module"` e `crossorigin` a pretendere un'origine, che un file aperto
   con il doppio clic non ha.
   **Che cosa resta non verificato**: la prova è stata fatta con Chromium
   pilotato da Playwright, cioè lo stesso motore di Chrome e di Edge, ma **non**
   con un doppio clic dato a mano nel browser di tutti i giorni, e **non** su
   Firefox o Safari. Il rimedio starebbe in `vite.config.ts`, che è fuori dal
   perimetro di questa funzionalità.

### Limiti

- **Non c'è la ricerca interna.** Nessun campo in cui scrivere la propria
  domanda: per arrivare a un'area si passa dalle tre card. La ricerca vive in
  una specifica sua, `02-ricerca-domande`.
- **Non ci sono Simulatori né Guide-documento.** L'accesso rapido sotto le card
  apre la schermata di lettura del documento, che ha quattro sezioni: due
  portano ancora la nota che il contenuto non è disponibile.
- **Non compare nessun numero di dominio.** La home non legge fixture e non
  chiama il core — nei suoi file non c'è nessun collegamento all'uno o
  all'altro — e l'unico numero a schermo è il 3 del badge, che conta domande e
  non euro.
- **Le domande dentro le pagine di area non sono link.** Si leggono come
  elenco, con sotto la nota che il contenuto è in costruzione.
- **Con il doppio clic su `dist/index.html` la pagina resta bianca.** Servita
  da un server locale funziona tutta, e senza rete; è il solo caso `file://`
  che oggi non regge. Vedi il passo 8 e «Divergenze».
- **Da sola non trasforma nessuna ansia in un numero.** È il guscio che rende
  raggiungibili le funzionalità che lo fanno.

### Divergenze

Fra ciò che la fase 1 aveva previsto e ciò che è stato costruito. La sezione
«Previsto» è rimasta com'era, anche dove si è rivelata sbagliata: è il
confronto fra le due ad avere valore.

1. **La navigazione non si chiama più «Home», e il percorso non è cliccabile.**
   La fase 1 prevedeva i bottoni «Home» e «Indietro» e un percorso che leggeva
   «Home › Il costo della vita». Nel codice il bottone è **«Pagina iniziale»**,
   sulla home **il percorso non compare affatto**, e **nessun gradino del
   percorso risponde al click**. Motivo, portato da `guardrail-officer`: «Home»
   accanto a un bottone «Home» erano due etichette identiche di cui una
   rispondeva al click e l'altra no, ed è proprio ciò che fa esitare questo
   pubblico; «Home» è inoltre vocabolario del web dato per scontato. Verso la
   pagina iniziale resta così **un solo** bersaglio, in **un solo** punto fisso.
   La specifica sopra è stata emendata con il motivo in chiaro; la fase 1 no.

2. **Una delle dodici domande è stata riscritta.** `area2Altra2` diceva «Dallo
   stipendio lordo a quello che arriva sul conto…»; adesso dice «Sulla busta
   paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la
   differenza?». Motivo: apriva con il termine tecnico invece che con
   l'immagine concreta, che è il contrario dello schema di scrittura del
   progetto.

3. **`homeAccessoRapido` è stata riscritta.** Adesso legge «Se hai già una
   bolletta o una busta paga davanti, puoi leggerla voce per voce»: la prima
   stesura dava per scontato che chi arriva abbia già un documento in mano.

4. **Due file in più e il foglio di stile diviso in tre.** Oltre ai file
   elencati nella specifica ci sono `icone.tsx` e `stiliNavigazione.css`, e il
   CSS sta in `styles.css` (132 righe), `stiliNavigazione.css` (91) e
   `stiliHome.css` (138). Motivo: un file solo ne farebbe 361, e lo standard di
   codice ferma ogni file a 150 righe.

5. **`<Testo>` ha una proprietà `valori` che la specifica non prevedeva.**
   Serve a sostituire il segnaposto `{n}` del badge con il numero calcolato da
   `contaAltreDomande`. La specifica chiedeva che il numero non fosse scritto a
   mano, ma non diceva come farlo.

6. **`index.html` non è stato modificato**, pur comparendo nell'elenco dei file
   previsti: non conteneva già nessun collegamento a un CDN o a un font remoto,
   quindi non c'era niente da togliere.

7. **Il criterio 8 non passa.** Era scritto come criterio di accettazione, e
   non è stato riscritto per farlo combaciare: dettaglio nel passo 8.

8. **Due cose viste di passaggio, che non riguardano la fase 1.** Dentro la
   schermata di lettura il percorso legge «Pagina iniziale › Che cosa dice,
   voce per voce», cioè prende il nome della seconda delle quattro sezioni
   della pagina invece di un nome della pagina intera. E l'indice generato
   `docs/FUNZIONALITA.md` continua a riportare questa funzionalità come «in
   sviluppo»: lo script legge la prima riga `Stato:` del file, che è quella
   della specifica in cima, e non lo stato scritto qui. Nessuna delle due è
   correggibile da qui: la prima sta in `src/`, la seconda in `scripts/`.
