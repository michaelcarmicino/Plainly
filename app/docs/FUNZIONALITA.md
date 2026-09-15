# Funzionalità di Plainly

> **File generato.** Non modificarlo a mano: si rigenera con
> `npm run docs:funzionali` e ogni modifica manuale andrebbe persa.
> Le fonti sono i file in `docs/features/`, scritti dall'agente
> `doc-funzionale`.
>
> Ultima generazione: 2026-09-15T10:47:34.100Z

**Come si legge il tempo verbale.** Ciò che è scritto al **futuro** è previsto
e non ancora verificato; ciò che è al **presente** è stato confermato leggendo
il codice e i test. Non è stile: è il modo per sapere in un secondo che cosa è
reale.

## Indice

| | Stato | Funzionalità |
| --- | --- | --- |
| ● | implementato | [01 — «La landing page: tre porte e una navigazione che non cambia mai»](#01-la-landing-page-tre-porte-e-una-navigazione-che-non-cambia-mai) |
| ● | implementato | [02 — «Il catalogo delle domande vere, e che cosa il sito sa rispondere»](#02-il-catalogo-delle-domande-vere-e-che-cosa-il-sito-sa-rispondere) |
| ◌ | in sviluppo | [03 — «La pagina che risponde a una domanda: il contenitore, non il contenuto»](#03-la-pagina-che-risponde-a-una-domanda-il-contenitore-non-il-contenuto) |
| ◌ | in sviluppo | [04 — «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»](#04-sulla-busta-paga-c-un-numero-grande-sul-conto-ne-arriva-uno-pi-piccolo-dove-va-la-differenza) |
| ◌ | in sviluppo | [05 — «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»](#05-ho-consumato-poco-e-la-bolletta-alta-che-cosa-sto-pagando) |
| ◌ | in sviluppo | [06 — «Sul 730 c'è scritto che mi tornano 665 €: da dove esce quel numero?»](#06-sul-730-c-scritto-che-mi-tornano-665-da-dove-esce-quel-numero) |
| ◌ | in sviluppo | [07 — «Quanto valgono davvero i miei soldi fra qualche anno»](#07-quanto-valgono-davvero-i-miei-soldi-fra-qualche-anno) |
| ◌ | in sviluppo | [08 — «Quanto mi resta davvero in busta»](#08-quanto-mi-resta-davvero-in-busta) |
| ◌ | in sviluppo | [09 — «Per quanti mesi bastano i soldi che ho da parte»](#09-per-quanti-mesi-bastano-i-soldi-che-ho-da-parte) |
| ◌ | in sviluppo | [10 — «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»](#10-quanto-pago-al-mese-la-rata-con-un-tasso-fermo-e-con-un-tasso-che-si-muove) |
| ◌ | in sviluppo | [11 — «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»](#11-quanto-costa-in-tutto-un-mutuo-oltre-ai-soldi-che-la-banca-presta) |
| ◌ | in sviluppo | [12 — «Il foglio che ti danno prima di firmare»](#12-il-foglio-che-ti-danno-prima-di-firmare) |
| ● | implementato | [13 — «Da dove vengono i numeri di questo sito»](#13-da-dove-vengono-i-numeri-di-questo-sito) |

**Totali** — in sviluppo: 10 · implementate: 3 · verificate: 0

---

## 01 — «La landing page: tre porte e una navigazione che non cambia mai»
**Stato:** ● implementato  
**Origine:** [`docs/features/01-landing-page.md`](features/01-landing-page.md)
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

### Divergenze fra previsto e realizzato

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

---

## 02 — «Il catalogo delle domande vere, e che cosa il sito sa rispondere»
**Stato:** ● implementato  
**Origine:** [`docs/features/02-catalogo-domande-reali-per-macrocategoria.md`](features/02-catalogo-domande-reali-per-macrocategoria.md)
### Cosa fa

Le pagine delle tre aree mostrano diciotto domande, non più dodici: cinque in
«Il costo della vita», sei in «Il lavoro», sette in «Il futuro». Il totale e
la ripartizione sono un dato dichiarato in `src/ui/catalogoDomande.ts`
(`CATALOGO_DOMANDE`, 18 oggetti), non un conteggio a mano: contato riga per
riga nel file, e confermato a schermo con un browser (18 `<li>` in tutto
sulle tre pagine).

Sotto ogni domanda compare una riga di stato scritta a parole, mai in un
colore soltanto: **«La schermata che risponde a questa domanda non c'è
ancora.»** per le sedici voci `in-arrivo`; **«Su questa il sito non ha una
risposta con una fonte dichiarata, e non la inventa.»**, in rosa, per
l'unica voce `senza-fonte`; un link vero e **sottolineato** per l'unica voce
`con-schermata`. `PaginaMacrocategoria.tsx` sceglie quale delle tre stampare
con uno `switch` sul campo `stato` del catalogo, non più con la vecchia
mappa `SCHERMATA_DELLA_DOMANDA` che conosceva un solo percorso scritto a
mano.

Il numero dei tre badge — **4 · 5 · 6**, letto a schermo — è la lunghezza di
ciascuna lista meno uno, calcolata da `contaAltreDomande()` in
`contenutiHome.ts`: la funzione non contiene nessuna cifra, solo
`AREE[id].domande.length - 1`, e `domande` a sua volta è filtrato dal
catalogo tramite la nuova `chiaviDiArea()`. Prima di questa funzionalità le
tre aree leggevano tutte «altre 3 domande qui dentro»; adesso leggono tre
numeri diversi, e `tests/home.test.ts` verifica il caso «lavoro»
(`contaAltreDomande('lavoro') === 5`).

La card «Il lavoro» mostra ora «Se perdo il lavoro, quanto prendo ogni mese e
per quanto tempo?», non più «Il mio settore è a rischio nei prossimi anni?»,
che è scesa in fondo alla sua area — sesta e ultima voce — riscritta in «Nel
mio settore, quante persone hanno perso il lavoro negli ultimi anni?» e
segnata «senza fonte». Confermato leggendo `testi.ts` (`area2Domanda` è
l'unica chiave già a schermo il cui valore cambia) e verificato a schermo, in
entrambi i punti.

Le sette domande che sceglievano per chi legge o indovinavano il suo futuro
sono sparite dal codice sorgente — cercate una per una su tutte e quattro le
pagine toccate (home e tre aree): zero occorrenze — e sostituite dalle sette
riscritture della tabella «Le diciotto domande», verificate parola per
parola a schermo.

Il catalogo è compilato nel pacchetto, non caricato da altrove: ricaricando
una pagina d'area il contenuto compare già completo al primo
`domcontentloaded`, senza alcun elemento che somigli a un indicatore di
caricamento.

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

### Come si prova

Sono gli stessi quattordici passi della fase 1, eseguiti il 2026-09-15 da
`app/`, con un Chromium pilotato da Playwright dove serviva una misura
invece di una lettura a occhio.

1. **Preparare l'ambiente.** `npm run prepara` risponde «Ambiente già pronto.
   Niente da fare.» ✅
2. **Avviare l'applicazione.** `node scripts/dev-server.mjs start` risponde
   `Server avviato: http://localhost:5173` e lascia la sessione libera;
   all'indirizzo compare la home. ✅
3. **I tre badge.** Letti a schermo: **«altre 4 domande qui dentro»** su «Il
   costo della vita», **«altre 5 domande qui dentro»** su «Il lavoro»,
   **«altre 6 domande qui dentro»** su «Il futuro» — tre numeri diversi, dove
   prima erano tre volte lo stesso «3». `contaAltreDomande('lavoro')`
   restituisce `5`, confermato sia dal codice sia da `tests/home.test.ts`. ✅
4. **Diciotto domande in tutto.** Contate a schermo, area per area: «Il costo
   della vita» **5**, «Il lavoro» **6**, «Il futuro» **7** — somma **18**,
   sei più delle dodici di prima. Le tre liste restano di lunghezza diversa,
   come previsto. ✅
5. **La card «Il lavoro» e la domanda spostata.** Sulla card si legge **«Se
   perdo il lavoro, quanto prendo ogni mese e per quanto tempo?»**; entrando
   nell'area, l'ultima delle sei voci è **«Nel mio settore, quante persone
   hanno perso il lavoro negli ultimi anni?»**, seguita da «Su questa il sito
   non ha una risposta con una fonte dichiarata, e non la inventa.», in
   rosa. ✅
6. **Le sette riscritture.** Verificate una per una, su tutte e quattro le
   pagine: nessuna delle sette frasi d'origine (compresa «Meglio conto
   deposito, ETF o BTP») compare più; tutte e sette le riscritture compaiono,
   parola per parola come nella tabella della specifica. ✅
7. **Stato a parole, senza mouse.** Il testo di stato è stato letto
   direttamente dal DOM, senza simulare nessun passaggio del mouse: compare
   comunque, per tutte e tre le voci di esempio. ✅
8. **L'unico link vero.** In «Il futuro», la voce «I risparmi fermi sul
   conto: che cosa succede loro mentre i prezzi salgono?» è un `<a>`
   sottolineato con `href="#/valore-dei-risparmi"`; `tests/catalogo.test.ts`
   verifica che `parseRotta` di quel percorso non torni mai alla home. ✅
9. **Stato vuoto.** Su «Il costo della vita» e su «Il lavoro» — le due aree
   senza ancora nessuna voce `con-schermata` — compare, sopra l'elenco
   completo, la riga «In quest'area, oggi, nessuna domanda ha ancora una
   schermata di risposta pronta: arriveranno una alla volta.» Su «Il
   futuro», che una voce con schermata ce l'ha già, quella riga non
   compare. ✅
10. **Nessuno stato di caricamento.** Al primo `domcontentloaded`, sia alla
    prima apertura sia dopo un ricaricamento, le sei voci di «Il lavoro» sono
    già tutte presenti nel DOM e nessun elemento che richiami «spinner»,
    «loading» o «caricamento» esiste in pagina. ✅
11. **Errore.** Un indirizzo inventato (`#/un-area-inventata`) mostra il
    contenuto della home (`.griglia-aree` presente); l'indirizzo nella barra
    resta quello digitato, esattamente come già succedeva prima di questa
    funzionalità. ✅
12. **Dati lunghi.** A 375 px di larghezza, la domanda più lunga di «Il
    futuro» va a capo su più righe restando a corpo **19,1 px** (misurato,
    sopra il minimo di 16), senza tagli a metà parola; ogni voce misura più
    di 44 px di altezza anche su più righe, misurato con le coordinate del
    browser. Uno screenshot alla stessa larghezza mostra inoltre che il
    pallino di ogni voce — link compreso — si allinea alla **prima** riga
    del testo, non all'ultima: vedi «Divergenze» per la correzione che lo
    rende vero. ✅
13. **Il resto della home invariato.** Le tre card restano tre, con la stessa
    struttura di classi (`tests/home.test.ts`, ancora verde); «Pagina
    iniziale» e «Indietro» restano in alto, nello stesso ordine, su ogni
    pagina; a 375 px le tre card si impilano nell'ordine dichiarato — costo
    della vita, lavoro, futuro; premendo Tab dalla pagina «Il futuro» il
    fuoco passa da «Pagina iniziale» a «Indietro» all'unico link vero, con un
    contorno rosa (`solid 3px rgb(255, 80, 160)`, cioè `#FF50A0`) visibile a
    ogni passaggio. ✅
14. **Con il Wi-Fi spento.** Fermato il server (`node scripts/dev-server.mjs
    stop`), `npm run build` produce `dist/` senza errori (`index.html` 0,50
    kB · foglio di stile 8,61 kB · pacchetto JS 176,27 kB). Nel pacchetto non
    compare nessun indirizzo da scaricare, a parte gli URI dello schema
    XML/SVG e il link — mai richiesto — del decoder degli errori di React:
    la stessa situazione già registrata per `01`, senza nulla di nuovo.
    Servendo `dist/` con `npm run preview` e riaprendo home, «Il lavoro» e
    «Il futuro» con un browser che registra ogni richiesta: **tre richieste
    in tutto, tutte verso `localhost`, zero verso l'esterno**; badge e
    contenuti restano gli stessi della build di sviluppo. Non è stato
    possibile spegnere davvero l'interfaccia di rete della macchina da questo
    ambiente: la verifica sostituisce la disconnessione fisica con la prova,
    più stringente, che nessuna richiesta lasci mai `localhost`. Il caso già
    noto del doppio clic diretto su `dist/index.html` (registrato nella fase
    2 di `01`) non è stato ripetuto qui, come la specifica stessa richiede:
    si è verificato solo che questa funzionalità non ne introduca uno nuovo,
    non che quello esistente sia risolto. ✅

### Limiti

- **Non introduce nessun campo di domanda libera né una ricerca a testo.** In
  nessuna delle pagine toccate esiste un elemento di input testuale: le
  diciotto domande si raggiungono solo scorrendo un elenco a tocco.
- **Non risponde a nessuna delle diciotto domande.** Le sedici voci
  `in-arrivo` e l'unica `senza-fonte` restano testo con una nota di stato;
  l'unica risposta vera è quella già costruita dalla funzionalità 07, a cui
  il catalogo si limita a collegarsi.
- **Non aggiunge nessuna schermata né nessuna rotta.** `src/ui/rotte.ts` non
  fa parte del diff di questa funzionalità: l'unico percorso citato,
  `PERCORSO_VALORE_RISPARMI`, esisteva già.
- **Non calcola nessun numero di dominio.** `catalogoDomande.ts` e
  `contenutiHome.ts` non importano nulla da `src/core/` e non leggono
  nessuna fixture: l'unico numero a schermo resta il conteggio delle domande
  nei tre badge.
- **Non ordina le domande per importanza.** L'ordine dichiarato in
  `CATALOGO_DOMANDE` è quello di stampa; nessun criterio di rilevanza compare
  nel codice.
- **Non separa «quanto sarà la mia pensione» da «a che età potrò andare in
  pensione».** `area3Domanda` resta un'unica voce, identica a prima.
- **Non dichiara la fonte delle risposte non ancora scritte.** Il testo delle
  voci `in-arrivo` non nomina mai un dato o un ente: solo che la schermata
  arriverà.
- **Non riscrive nessun'altra domanda già a schermo.** `area2Domanda` è
  l'unica chiave preesistente il cui valore cambia; confermato dal diff di
  `testi.ts`, che tocca quella riga sola oltre alle due righe di import.
- **Non tocca `types/`.** Il diff di questa funzionalità non include nessun
  file sotto `types/`.

### Divergenze fra previsto e realizzato

1. **Il foglio di stile toccato è `stiliNavigazione.css`, non
   `stiliHome.css`.** Le dichiarazioni tecniche della specifica ipotizzavano
   «`stiliHome.css` o un foglio affiancato»: `stiliNavigazione.css`
   conteneva già, da `01`, le regole `.elenco-domande`, ed è lì che le nuove
   regole di stato e la correzione del pallino sono state aggiunte, senza
   creare un file in più.

2. **Una correzione visiva non richiesta dalla fase 1.** Il pallino
   dell'elenco su una voce collegata che va a capo su più righe si allineava
   alla propria **ultima** riga invece che alla prima, per via del
   `display: inline-block` di `.domanda-collegata` ereditato da
   `stiliRisultato.css`. È stato aggiunto, dentro `stiliNavigazione.css`,
   `.elenco-domande .domanda-collegata { display: block; }`, che riporta il
   pallino alla prima riga **solo** dentro un elenco. Verificato in due modi:
   uno screenshot a 375 px su «Il futuro» mostra il pallino allineato alla
   prima riga della voce collegata; e su `#/valore-dei-risparmi`
   (funzionalità 07, che riusa la stessa classe `.domanda-collegata` fuori
   da un `.elenco-domande`) `getComputedStyle` restituisce ancora
   `inline-block` — quella pagina non è stata toccata dalla correzione.

3. **Il lessico si allarga di una parola sola, non di due.** Le dichiarazioni
   tecniche della specifica (punto 3) prevedevano di bloccare sia
   «preferibile» sia «meglio». `guardrail-officer` ha aggiunto solo la radice
   `preferibil*` alla voce `comparativo-valore` di `src/guardrails/lessico.ts`
   ed **esclude deliberatamente** «meglio»: il motivo, scritto nel commento
   sopra quella voce, è che «meglio» è un avverbio quasi sempre innocuo e
   centrale nel registro «amico che spiega» di questo progetto («si capisce
   meglio con un esempio»), e bloccarlo produrrebbe falsi allarmi
   sistematici; la frase pericolosa d'origine, «Meglio conto deposito, ETF o
   BTP», è comunque già neutralizzata dalla riscrittura in `area3Altra5` e
   non compare in `src/`. È una divergenza rispetto a un'ipotesi tecnica
   della specifica, non rispetto a un comportamento a schermo: verificato che
   `tests/lessico-ui.test.ts` resti verde e che zero occorrenze di «meglio» o
   «preferibile» esistessero già in `src/` prima dell'aggiunta. Nota per chi
   legge il referto del `tester`: il caso `CF-04` in
   `docs/test/02-catalogo-domande.md` ipotizza il blocco di entrambi i
   termini — questa è la ragione per cui, alla prova, solo metà di
   quell'ipotesi risulta vera.

4. **Il messaggio di stato «vuoto» è comparso sopra l'elenco, non sotto.**
   Nella versione precedente di `PaginaMacrocategoria.tsx` (quella di `01`)
   il placeholder «contenuto in costruzione» compariva **dopo** l'elenco; il
   nuovo `areaNessunaSchermata` compare **prima**, in testa alla sezione. Non
   era un impegno della fase 1, che si limitava a chiedere «una frase in
   testa» senza dettagliare la posizione precedente: lo si registra qui
   perché è un cambiamento reale di comportamento visto leggendo il diff, non
   solo un dettaglio di stile.

5. **Un difetto scoperto rileggendo la suite dopo la riconciliazione,
   segnalato e non corretto: `npm test` non è verde.** Mentre questa scheda
   veniva scritta, `tester` ha completato la propria fase 2 aggiungendo
   `tests/accettazione/02-catalogo-domande-conformita.test.ts`. Rilanciando
   `npm test` **un file fallisce** (1 fallito, 18 verdi, su 19): il caso
   CF-03 trova la frase «Meglio conto deposito, ETF o BTP» dentro
   `src/guardrails/lessico.ts` — non nel codice di questa funzionalità, ma
   nel commento che `guardrail-officer` ha scritto sopra `comparativo-valore`
   per spiegare perché «meglio» resta escluso (la stessa nota citata nella
   divergenza 3 qui sopra): quel commento cita la frase pericolosa **per
   intero, fra virgolette**, dentro `src/`, ed è esattamente ciò che CF-03
   vieta — «nessuna delle sette frasi d'origine compare in `src/`, in nessuna
   forma, nemmeno come commento che spiega la riscrittura». Nessuno dei file
   che questa scheda documenta è coinvolto: `catalogoDomande.ts`,
   `testiCatalogo.ts`, `contenutiHome.ts`, `PaginaMacrocategoria.tsx`,
   `testi.ts` e `stiliNavigazione.css` restano quelli letti sopra, invariati
   da quando sono stati verificati, e i quattordici passi restano tutti
   confermati. Per questo lo stato di **questa scheda** resta
   `implementato`. Ma **la funzionalità nel suo complesso non supera
   `/verifica`** finché `src/guardrails/lessico.ts` non viene riformulato
   senza citare la frase per intero — file che appartiene a
   `guardrail-officer`, non a `doc-funzionale`: per questo si segnala qui e
   non si corregge.

---

## 03 — «La pagina che risponde a una domanda: il contenitore, non il contenuto»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/03-pagina-di-spiegazione-struttura-riusabile.md`](features/03-pagina-di-spiegazione-struttura-riusabile.md)
### Cosa fa

«…»

### Per chi

La stessa persona della `01`: è arrivata con un'ansia già formata, ha toccato
una delle tre porte e adesso guarda l'elenco delle domande di quell'area. Ne
sceglie una aspettandosi una risposta, non un rimando — e le servirà nel
secondo o terzo tocco dall'apertura del sito, che per la regola dei due-tre
tap è anche l'ultimo disponibile: quello che non starà in questa pagina non
avrà più un posto dove stare.

Di riflesso servirà anche a chi scriverà le prossime pagine di spiegazione, che
potrà dichiarare un contenuto senza poter sbagliare la forma. Ma il
destinatario resta la persona che legge: se la struttura servisse solo a chi
scrive, sarebbe un file di appunti, non una funzionalità.

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»

---

## 04 — «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/04-guida-interattiva-busta-paga.md`](features/04-guida-interattiva-busta-paga.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 05 — «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/05-guida-interattiva-bolletta-luce-gas.md`](features/05-guida-interattiva-bolletta-luce-gas.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»

---

## 06 — «Sul 730 c'è scritto che mi tornano 665 €: da dove esce quel numero?»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/06-guida-interattiva-dichiarazione-730.md`](features/06-guida-interattiva-dichiarazione-730.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»

---

## 07 — «Quanto valgono davvero i miei soldi fra qualche anno»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/07-valore-dei-risparmi-nel-tempo.md`](features/07-valore-dei-risparmi-nel-tempo.md)
### Cosa fa

Chi scriverà due cose — quanti soldi ha fermi sul conto e per quanti anni li
lascia lì — vedrà comparire una cifra sola, grande: quanto varranno davvero
quei soldi alla fine, cioè quanta roba ci si porterà a casa. Con 10.000 € e
5 anni comparirà **9.057,31 €**, e accanto la riga che lo rende afferrabile:
su ogni 100 € lasciati fermi ne resterà il valore di 90,57 €.

La schermata dirà che cosa succede a quei soldi e si fermerà lì: non dirà a
nessuno che cosa farne.

### Per chi

Una persona che ha una somma ferma sul conto — quel che resta di una
liquidazione, i risparmi messi da parte in qualche anno — e ha sentito ripetere
che «con l'inflazione i soldi fermi perdono valore», senza che quella frase le
dica niente di preciso: non sa se «perdono» significhi dieci euro o mille, e non
sa se riguardi la sua situazione o quella di qualcun altro.

Le servirà **nel momento in cui guarda il saldo del conto** e si chiede se
lasciarlo lì sia un gesto neutro. È una domanda che si pone da sola: nessuno
gliela deve fare. Dopo, al posto della frase generica, avrà una cifra riferita
ai suoi soldi e a quanti anni ha in mente lei.

### Come si prova

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non dà
il risultato atteso, la funzionalità non è finita. I comandi vanno eseguiti da
`app/`.

Il caso di riferimento è quello già verificato a mano nella sezione
«Elaborazione»: **10.000 €, 5 anni, tasso dichiarato 2,00% (200 punti base)** —
cioè due euro in più ogni cento spesi, ogni anno. Lo stesso caso che il test
unitario blocca e che finirà nello screenshot della demo: la slide mostrerà la
cifra che il test dimostra.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`, che esegue
   `node scripts/prepara.mjs`). Serve solo la prima volta.
   *Risultato atteso:* lo script dirà «Ambiente già pronto», oppure elencherà i
   passi che ha installato, e il suo controllo di salute — `tsc --noEmit` e poi
   `npm test` — finirà senza errori. Se fallisce, ci si ferma qui: il resto
   della prova non direbbe niente di utile.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue
   `node scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un processo
   che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo `http://localhost:5173`.

3. **Arrivare alla schermata.** Aprire quell'indirizzo e raggiungere la
   simulazione dei risparmi.
   *Risultato atteso:* la schermata comparirà. **L'indirizzo esatto non è
   fissato dalla specifica** — dice solo che `rotte.ts` avrà una rotta nuova:
   chi costruisce lo sceglie, e in fase 2 va scritto qui per esteso insieme al
   percorso per arrivarci partendo dalla pagina iniziale. Se non si arriva alla
   schermata navigando, ma solo scrivendo l'indirizzo a mano nella barra, il
   passo non è superato: va segnalato come divergenza, non aggirato.

4. **Lo stato vuoto — prima di digitare qualunque cosa.** Guardare la schermata
   appena aperta, senza toccare i campi.
   *Risultato atteso:* **nessun numero grande inventato e nessuno zero** al
   posto del risultato. Al loro posto una frase che dice quali due cose servono
   — la somma che si ha ferma e per quanti anni la si lascia lì — e dove
   scriverle. Non «nessun risultato»: quella è una porta chiusa, non una
   spiegazione.

5. **Il caso verificato a mano.** Digitare `10000` nel campo della somma e `5`
   in quello degli anni.
   *Risultato atteso:* comparirà **9.057,31 €** come numero grande, e sarà il
   più grande della schermata — non uno fra tanti della stessa dimensione, così
   chi guarda sa dove posare l'occhio. Accanto si leggerà la frase che lo
   spiega: «I tuoi 10.000 € fra 5 anni comprano quanto 9.057,31 € comprano
   oggi». Le cifre saranno scritte all'italiana — punto per le migliaia, virgola
   per i centesimi — con l'euro **accanto al valore**, non relegato in
   un'intestazione.

6. **Il paragone su 100 €, accanto al numero e non in fondo.** Restando sulla
   stessa schermata, leggere la riga sotto il numero grande.
   *Risultato atteso:* si leggerà «Su ogni 100 € lasciati fermi, dopo 5 anni ne
   resta il valore di 90,57 €». Il conto si rifà a mano in due secondi:
   9.057,31 diviso 10.000, per 100, fa 90,57 — il paragone è lo stesso numero
   del risultato ridotto a una banconota che tutti hanno avuto in mano, non un
   secondo calcolo che potrebbe non tornare.

7. **Da dove viene il numero — il tasso e la sua fonte, scritti a schermo.**
   Cercare, vicino al risultato, da quale tasso è stato ricavato.
   *Risultato atteso:* si leggerà il tasso usato — **2,00%** — con **la fonte e
   il periodo su cui è calcolato scritti accanto**, leggibili senza passare il
   mouse su niente e senza aprire niente. Insieme ci sarà l'avvertenza che
   questo non è un pronostico: è un'aritmetica su un tasso medio dichiarato, e
   se l'inflazione dei prossimi anni sarà diversa il numero sarà diverso. Testo
   dell'avvertenza mai sotto i 16 px e mai in grigio slavato: se sta a schermo
   dev'essere leggibile anche da lontano.

8. **Lo stato «in caricamento» non deve far saltare il layout.** Guardare dove
   si trova l'avvertenza a schermo **prima** di digitare, poi digitare
   `10000` e `5` e guardare dove si trova **dopo**.
   *Risultato atteso:* sarà nello stesso posto. Il riquadro del risultato
   occuperà già il suo spazio da vuoto, così quando il numero arriva non spinge
   in basso ciò che sta sotto. Il calcolo è immediato e tutto locale: non ci
   sarà nessuna attesa, quindi nemmeno una rotellina che gira per un istante e
   sparisce.

9. **L'errore in linguaggio umano.** Nel campo della somma scrivere qualcosa che
   non è un importo — per esempio delle lettere — oppure un numero di anni che
   la schermata non accetta.
   *Risultato atteso:* comparirà un messaggio scritto come lo direbbe una
   persona: «Controlla questo numero, sembra troppo alto», mai «errore di
   validazione nel campo input». Il numero grande **non mostrerà una cifra
   sbagliata**: o resta com'era o torna allo stato vuoto del passo 4, mai un
   risultato calcolato su un dato che non va. **E quello che si era già digitato
   nell'altro campo resterà lì**: correggere un campo non deve costare
   ricominciare da capo. L'elenco completo dei valori di confine — dove comincia
   esattamente «troppo alto», che cosa succede a 0 anni — non è qui: è del
   `tester`, in `docs/test/`.

10. **Dati lunghi — il caso che rompe le griglie.** Digitare una somma a sette
    cifre, `9999999`, e `30` anni. Non è una cifra realistica per questa
    schermata: serve proprio a farla sudare.
    *Risultato atteso:* il numero grande resterà **su una riga sola**, senza
    andare a capo a metà e senza uscire dal suo riquadro. La pagina non avrà
    barra di scorrimento orizzontale. Le cifre saranno tabulari — tutte della
    stessa larghezza — così le colonne non ballano fra un numero e l'altro, e
    nelle eventuali tabelle i numeri staranno allineati a destra. Anche qui il
    paragone su 100 € resterà al suo posto accanto al risultato.

11. **Con la finestra stretta come un telefono, e solo con la tastiera.**
    Stringere la finestra sotto i 768 px di larghezza — quanto misura lo schermo
    di un telefono tenuto in verticale — e rifare il passo 5. Poi, senza toccare
    il mouse, premere Tab più volte e compilare i due campi da tastiera.
    *Risultato atteso:* i campi e il risultato si impileranno senza testo
    tagliato, nessuna scritta scenderà sotto i 16 px e nessun bersaglio da
    toccare sarà più piccolo di 44×44 px, cioè del polpastrello di un dito. Con
    Tab il focus attraverserà i campi nell'ordine in cui si leggono — prima la
    somma, poi gli anni — e a ogni passaggio si vedrà un contorno netto attorno
    all'elemento che lo ha, non un accenno. Ogni campo avrà la sua etichetta
    scritta accanto, non solo un testo grigio dentro al riquadro che sparisce
    appena si scrive. Questo passo non è un extra: se fallisce, la funzionalità
    non è finita.

12. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la schermata dalla cartella
    `dist/`.
    *Risultato atteso:* la build finirà senza errori, e rifacendo il passo 5 il
    numero sarà lo stesso — 9.057,31 € — **senza che parta una sola richiesta
    fuori dal computer**: il tasso è una costante scritta nel codice, non un
    dato che si va a prendere da qualche parte. Il caso del doppio clic su
    `dist/index.html` è un difetto già noto e registrato in
    `01-landing-page`, passo 8: qui si verifica che questa schermata **non
    aggiunga** nuove richieste di rete, non lo si risolve.

### Limiti

- **Non dirà che cosa farne.** Nessun accenno a spostare quei soldi, a
  impiegarli o a confrontarli con qualcos'altro. La schermata descriverà
  un'erosione e si fermerà lì. È il confine più facile da sfondare proprio qui,
  perché la domanda successiva — «e allora?» — viene da sé: la risposta non sta
  in questa schermata.
- **Non confronterà strumenti** e non nominerà conti, titoli o fondi.
- **Il tasso non arriverà dalla rete**, né mentre il sito gira né mentre viene
  costruito. Resterà una costante scritta nel codice, con fonte e periodo
  dichiarati accanto, e si aggiornerà a mano.
- **Il valore vero del tasso è un blocco ancora aperto.** Deve essere la media
  di più anni dell'indice dei prezzi ISTAT, e nessuno di noi può inventarlo:
  serve che una persona lo recuperi e dichiari su quali anni è calcolato.
  Finché non succede, il **2,00%** dei passi qui sopra è un tasso di prova —
  l'aritmetica è quella definitiva, la fonte no. Non fermerà l'implementazione,
  perché il calcolo riceve il tasso come parametro, ma fermerà la demo con
  numeri veri.
- **Non userà il paragone «oggi la spesa di un mese, fra 5 anni tre
  settimane»** del documento d'origine: richiederebbe di sapere quanto costa la
  spesa di un mese, cioè un secondo numero che nessuna fonte ci dà e che quindi
  andrebbe inventato. Al suo posto il paragone su 100 €, altrettanto concreto e
  senza dati di provenienza ignota.
- **Non sarà una previsione.** Se l'inflazione dei prossimi anni sarà diversa da
  quella media, il numero sarà diverso — e starà scritto a schermo, non in una
  nota a piè di pagina.
- **Non chiederà e non conserverà dati personali.** La cifra digitata resterà
  nella pagina e non verrà salvata da nessuna parte.
- **Non leggerà un documento vero.** Somma e anni si digitano a mano: qui non
  entra nessun estratto conto.

---

---

## 08 — «Quanto mi resta davvero in busta»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/08-simulatore-netto-in-busta-paga.md`](features/08-simulatore-netto-in-busta-paga.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 09 — «Per quanti mesi bastano i soldi che ho da parte»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/09-mesi-coperti-dai-risparmi.md`](features/09-mesi-coperti-dai-risparmi.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 10 — «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/10-simulatore-rata-mutuo-fisso-variabile.md`](features/10-simulatore-rata-mutuo-fisso-variabile.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 11 — «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/11-approfondimento-sul-mutuo.md`](features/11-approfondimento-sul-mutuo.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 12 — «Il foglio che ti danno prima di firmare»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/12-guida-al-foglio-prima-di-firmare.md`](features/12-guida-al-foglio-prima-di-firmare.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 13 — «Da dove vengono i numeri di questo sito»
**Stato:** ● implementato  
**Origine:** [`docs/features/13-tabella-fonti-dati-sorgente-unica.md`](features/13-tabella-fonti-dati-sorgente-unica.md)
### Cosa fa

Aprendo `#/da-dove-vengono-i-numeri` compare, per ogni riga del registro, un
riquadro con tre risposte nell'ordine in cui una persona se le pone leggendo
un numero scritto da qualcun altro: chi lo dice, su quale periodo vale, da
quando è scritto qui dentro. Oggi il registro ha una sola riga — l'inflazione,
2,00% — e la sua provenienza è incompleta: manca il periodo. La pagina lo
dichiara con una frase esplicita in rosa (`#FF50A0`), invece di lasciar
credere che il 2,00% sia già un dato verificabile: confermato anche
programmaticamente che quel colore, in tutta la pagina, compare **soltanto**
lì — nessun altro elemento lo usa.

Il numero non vive in due posti: `INFLAZIONE_DICHIARATA.valoreBp` (letto dalla
nota sotto il simulatore dei risparmi, funzionalità 07) e il campo `valore`
della riga `'inflazione-nic'` del registro sono confrontati da un test
dedicato, e coincidono sempre — chi corregge il 200 lo fa in un file solo. Il
core stabilisce SE la provenienza è completa guardando i tre campi della riga
(`provenienzaCompleta`, mai un flag scritto a mano); la UI decide solo COME
scriverlo (`dataInLettere` trasforma `'2026-09-14'` in «14 settembre 2026»).

Da qualunque punto del sito mostri quel numero — oggi, la nota sotto la
simulazione dei risparmi fermi — un tocco solo apre questa pagina; «Indietro»
torna al punto di partenza senza perdere i valori digitati lì.

### Per chi

La persona che è arrivata in fondo alla schermata dei risparmi fermi, ha letto
«un aumento dei prezzi di 2,00% all'anno» e si chiede chi lo dice: tocca la
nota sotto il risultato e in un passo solo arriva a questa pagina.

Le serve anche, più raramente e in modo più delicato, quando la pagina
dichiara che il periodo su cui è calcolata la media non è ancora stato
stabilito: lì non sta approfondendo, sta verificando — ed è il momento in cui
il prodotto ha più da perdere se nasconde la lacuna invece di dichiararla.
Confermato: non la nasconde.

### Come si prova

Gli stessi undici passi della fase 1, eseguiti il 2026-09-15 da `app/` con un
browser pilotato, non a occhio. Accanto a ciascuno, ciò che è successo
davvero.

1. **Preparare l'ambiente.** `npm run prepara` conferma Node, dipendenze,
   browser Playwright e directory di lavoro già a posto, e `tsc --noEmit`
   pulito. Il controllo dei test segnala 2 test falliti su 125 (114 passati,
   9 ancora da scrivere) — non per una regressione di questa funzionalità:
   vedi il richiamo qui sopra e «Divergenze». I 20 test di
   `registroFonti.test.ts` sono fra quelli verdi. ✅ (con la nota qui sopra)

2. **Avviare l'applicazione.** `node scripts/dev-server.mjs start` risponde
   `Server avviato: http://localhost:5173` e lascia la sessione libera. ✅

3. **Partire da un numero vero.** Scritti **10000** e **5** nella schermata
   dei risparmi, compare la nota con «Il calcolo parte da un aumento dei
   prezzi di 2,00% all'anno...» e, in fondo, il collegamento «Vedi da dove
   vengono tutti i numeri di questo sito, uno per uno». ✅

4. **Il tocco che porta alla pagina delle fonti.** Il collegamento ha
   `href="#/da-dove-vengono-i-numeri"`; un click sposta davvero l'indirizzo
   a quella pagina. Un tocco solo, nessun menu di mezzo. ✅

5. **Lo stato di oggi — il criterio più importante di tutti.** La riga
   mostra «2,00%» e «ISTAT»; al posto del periodo compare la frase «Su quali
   anni sia calcolata questa media non è ancora stato stabilito da nessuno: è
   un pezzo che manca, e qualcuno deve ancora recuperarlo e scriverlo qui»,
   colorata `rgb(255, 80, 160)` — cioè esattamente `#FF50A0` — misurato con
   `getComputedStyle`, non a occhio. Il 2,00% non è mai presentato come un
   fatto già verificabile. ✅

6. **Il resto della riga, nell'ordine giusto.** «Di quanto salgono i prezzi
   in un anno» precede sempre «(indice NIC)», mai da solo; «2,00%» è
   allineato a destra con cifre tabulari; la data è scritta «14 settembre
   2026», non `2026-09-14`. Passata in rassegna ogni riga di testo della
   pagina per colore: **una sola** usa `rgb(255, 80, 160)`, quella del
   periodo mancante. ✅

7. **Il ritorno.** «Indietro» compare nella stessa barra di navigazione di
   ogni pagina, riporta a `#/valore-dei-risparmi`, e i due campi mostrano
   ancora **10000** e **5**: nessun dato perso. ✅

8. **Caricamento senza salto.** Aprendo direttamente
   `#/da-dove-vengono-i-numeri` la riga è già presente al primo controllo,
   senza rotellina né un secondo rendering che la sostituisce. ✅

9. **Errore e dati lunghi — verificati solo in parte, come già previsto.**
   Con l'unico registro reale di oggi (una riga, coerente) non si porta a
   schermo né una riga rotta né trenta righe: contate, le righe sono una, gli
   errori zero. Il comportamento per la riga rotta è confermato **leggendo**
   `RigaRegistroFonte.tsx` (un id sconosciuto o un'unità incoerente
   restituiscono un riquadro con una frase, non fanno sparire la riga) — ma
   **non da un test**: né `registroFonti.test.ts` né i test del tester
   istanziano quel componente con una riga rotta; solo la parte di *core*
   (`fonteDi`, `valoreBpDiRiga`) è testata, ed è verde. Per «dati lunghi», la
   tenuta resta affidata solo alla struttura CSS letta in `stiliFonti.css`
   (`overflow-wrap: break-word`, nessuna larghezza fissa), mai messa alla
   prova con dati reali. Verificabile solo in parte, come già scritto in fase
   1 — con in più un dettaglio che la fase 1 non poteva prevedere: vedi
   «Divergenze».

10. **Finestra stretta e tastiera.** A 375 px la pagina non produce
    scorrimento orizzontale (`scrollWidth` = `clientWidth` = 375), il testo
    più piccolo misurato è 18 px, i due bottoni di navigazione misurano
    183×45 e 133×45 px — sopra il minimo di 44. Con solo Tab si raggiunge il
    collegamento alla pagina delle fonti, con un contorno di 3 px ben
    visibile, e Invio lo attiva. ✅

11. **Con il Wi-Fi spento — questo passo non dà il risultato atteso alla
    lettera.** `npm run build` finisce senza errori (`index.html` 0,5 kB, CSS
    8,4 kB, JS 173 kB). Servita da un server locale qualunque — anche in solo
    loopback, senza alcuna rete esterna — la build funziona in modo identico
    al server di sviluppo: nota, collegamento, riga, tutto corretto, zero
    richieste diverse da quelle verso quel server. **Aperta con un doppio
    clic reale su `dist/index.html`, cioè `file://`, la pagina resta
    bianca**, per lo stesso motivo già noto dalla scheda 01: gli attributi
    `type="module" crossorigin` sullo script e sul foglio di stile sono
    bloccati dal browser sotto origine `null`. ❌ per la lettera del passo
    («riaprire la schermata dalla cartella `dist/`»); ✅ per la sostanza che
    il passo voleva provare («funziona offline, zero richieste di rete»).
    Dettaglio in «Divergenze».

### Limiti

- **Non aggiorna niente da solo.** `registroFonti.ts` è un array scritto a
  mano; nessuna chiamata di rete in nessun file della funzionalità
  (confermato anche da `tests/accettazione/13-tabella-fonti-dati-conformita.test.ts`)
  né nel bundle costruito — zero richieste diverse da quelle verso chi serve
  la pagina, verificato ai passi 3-6 e 11.
- **Non ha una colonna che promette una cadenza.** `testiFonti.ts` non
  contiene nessuna chiave del genere; al suo posto solo la frase sui limiti e
  la data di inserimento di ogni riga.
- **Non include righe sui contenuti educativi.** `REGISTRO_FONTI` contiene un
  solo elemento — verificato da un test che ne blocca la lunghezza a 1.
- **Non traduce nomi di fonti o indicatori.** `riga.fonte` e
  `riga.indicatore` sono stampati così come sono scritti nel registro
  («ISTAT», «indice NIC»), mai passati da `testi.ts`.
- **Non giudica le fonti.** Nessuna funzione le ordina o le confronta;
  confermato anche da un test dedicato (`tests/lessico-fonti.test.ts`), che
  verifica l'assenza di parole come «affidabile» o «autorevole» nelle
  stringhe della pagina.
- **Non inventa le righe che mancano.** Il registro parte con la sola riga
  che esiste davvero nel codice, e un test lo blocca a lunghezza 1.
- **Non tocca `types/`.** Nessuno dei due commit di questa funzionalità
  (core-engine e ui-builder) modifica file sotto `types/` — confermato con
  `git show --stat` su entrambi.
- **Non risolve da sola il periodo mancante dell'inflazione.** `periodo`
  resta `null` sulla riga `'inflazione-nic'`, e la pagina continua a
  dichiararlo, non a nasconderlo.
- **Limite non previsto in fase 1, trovato in fase 2.**
  `src/ui/dataInLettere.ts` non gestisce una data scritta a mano senza
  trattini (stringa vuota o testo libero): lancia un'eccezione invece di
  mostrare una frase. Con il registro di oggi (una riga, data già valida) non
  è raggiungibile, ma è una fragilità reale di fronte a un errore di
  battitura futuro. Dettaglio in `docs/test/13-tabella-fonti-dati.md`.

### Divergenze fra previsto e realizzato

1. **Passo 11 — «con il Wi-Fi spento» non dà, alla lettera, il risultato
   previsto.** La fase 1 prevedeva che riaprendo la build da `dist/` si
   leggesse lo stesso contenuto senza alcuna richiesta esterna. È vero SOLO
   se `dist/` è raggiunta tramite un server, locale o di sviluppo: un doppio
   clic reale su `index.html` produce una pagina bianca, perché il tag
   generato dalla build (`<script type="module" crossorigin>`) viene
   bloccato dal browser sotto l'origine `null` di `file://`. **Non corretto
   qui**: la causa vive nella configurazione di build (`vite.config.ts` e
   l'HTML generato), fuori da `src/core/` e `src/ui/` — fuori dal perimetro
   di questa funzionalità e di questo agente. **Non è un difetto nuovo**: è
   lo stesso, identico problema già trovato e scritto nella scheda 01
   (`docs/features/01-landing-page.md`, passo 8, stesso giorno), mai risolto
   da allora. Lo strato applicativo di questa funzionalità — registro,
   pagina, navigazione, contenuti — è verificato corretto: solo il
   contenitore di consegna (`file://` puro) ha il buco.

2. **Passo 9 — la fase 1 assumeva che leggere `registroFonti.test.ts`
   bastasse a confermare il comportamento sulla riga rotta; non basta del
   tutto.** Quel test copre solo la parte di *core* (`fonteDi`,
   `valoreBpDiRiga` restituiscono il codice giusto — confermato, verde). La
   parte di *interfaccia* — che `RigaRegistroFonte.tsx` mostri una frase al
   posto della riga invece di farla sparire — è confermata **solo leggendo
   il codice sorgente del componente**: nessun test, né unitario né di
   accettazione, lo istanzia con una riga incoerente. Il comportamento c'è,
   come promesso; il modo in cui la fase 1 pensava di poterlo confermare non
   regge fino in fondo. Lo stesso vale per «trenta righe, nomi lunghi»: solo
   la CSS lo prevede, nessun test o schermata reale lo mette alla prova.

3. **Trovato durante questa riconciliazione, non prima: `src/ui/dataInLettere.ts`
   lancia un'eccezione su una data scritta senza trattini** (stringa vuota o
   testo libero), invece di restituire una frase leggibile. Scoperto dal
   `tester` con `tests/accettazione/13-tabella-fonti-dati-formattazione.test.ts`
   (2 test su 125 attualmente falliti in `npm test`), non da questa scheda:
   nessuno degli undici passi di «come si prova» lo incontra, perché tutti
   usano il dato reale del registro, già in forma valida. Riportato qui
   **solo perché a questa data la suite non è verde** e chi legge questa
   scheda deve saperlo senza cercare altrove; il difetto stesso, la causa e
   la classificazione («non bloccante oggi con l'unica riga reale, da
   correggere prima che 08 o 10 aggiungano righe scritte a mano») sono
   descritti per intero in `docs/test/13-tabella-fonti-dati.md`, sezione
   «Fallimenti». Non corretto qui: non è un file di questo agente.

4. **Nessuna divergenza sui restanti nove passi, né su «Cosa farà» o «Limiti
   previsti».** Quanto descritto in fase 1 corrisponde a quanto costruito,
   incluso il criterio dichiarato «il più importante di tutti» (passo 5): la
   pagina non presenta mai il 2,00% come un fatto già verificabile.

