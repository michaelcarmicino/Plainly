# Funzionalità di Plainly

> **File generato.** Non modificarlo a mano: si rigenera con
> `npm run docs:funzionali` e ogni modifica manuale andrebbe persa.
> Le fonti sono i file in `docs/features/`, scritti dall'agente
> `doc-funzionale`.
>
> Ultima generazione: 2026-09-15T14:18:42.129Z

**Come si legge il tempo verbale.** Ciò che è scritto al **futuro** è previsto
e non ancora verificato; ciò che è al **presente** è stato confermato leggendo
il codice e i test. Non è stile: è il modo per sapere in un secondo che cosa è
reale.

## Indice

| | Stato | Funzionalità |
| --- | --- | --- |
| ● | implementato | [01 — «La landing page: tre porte e una navigazione che non cambia mai»](#01-la-landing-page-tre-porte-e-una-navigazione-che-non-cambia-mai) |
| ● | implementato | [02 — «Il catalogo delle domande vere, e che cosa il sito sa rispondere»](#02-il-catalogo-delle-domande-vere-e-che-cosa-il-sito-sa-rispondere) |
| ● | implementato | [03 — «La pagina che risponde a una domanda: il contenitore, non il contenuto»](#03-la-pagina-che-risponde-a-una-domanda-il-contenitore-non-il-contenuto) |
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
| ◌ | in sviluppo | [14 — Registro delle schermate](#14-registro-delle-schermate) |

**Totali** — in sviluppo: 10 · implementate: 4 · verificate: 0

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
**Stato:** ● implementato  
**Origine:** [`docs/features/03-pagina-di-spiegazione-struttura-riusabile.md`](features/03-pagina-di-spiegazione-struttura-riusabile.md)
### Cosa fa

Toccando `#/spiegazione/inflazione-spesa` compare una pagina intera, non più
testo morto. In cima, in maiuscolo con lettere spaziate, «IL COSTO DELLA VITA»
(la classe `.occhiello` applica `text-transform: uppercase` al testo dichiarato
«Il costo della vita»); subito sotto, come titolo, esattamente la stessa
domanda già letta nell'elenco dell'area — «Con gli stessi soldi della spesa,
quanto porto a casa rispetto a un anno fa?», carattere per carattere, confermato
confrontando il markup con la costante `area1Altra1` di `testi.ts`.

Poi tre frasi sul carrello della spesa, **e solo dopo di loro** — mai prima,
confermato sul DOM del browser, sul markup prodotto da `renderToStaticMarkup` e
da un'asserzione dedicata di `tests/spiegazione.test.ts` che confronta le
posizioni nel markup reso, non l'ordine dei campi dichiarati — la frase «Quella
differenza ha un nome: si chiama inflazione.». Il componente impone quest'ordine
per costruzione: nessun punto del codice permette a un'istanza di invertirlo.

Poi un numero solo, **98,04 €**, allineato a destra con cifre tabulari
(`font-variant-numeric: tabular-nums`, misurato con `getComputedStyle`), e
accanto il suo paragone: «Fra le due cifre c'è una differenza di 1,96 €: i
100 € sono ancora tutti lì, ma portano a casa meno roba di prima.» — un numero
diverso dalla cifra grande, non una sua ripetizione (la specifica lo richiedeva
esplicitamente dopo un difetto trovato e corretto il giorno stesso, commit
`3fc47f9`). Il numero non è scritto a mano: `spiegazioneEsempio.ts` lo chiede a
`simulaRisparmio` del core con l'ingresso fisso (10.000 cent, 1 anno, 200 bp) e
stampa la risposta con `formattaEuro`.

Subito sotto, la fonte: il conto parte da un aumento dei prezzi del 2,00%
l'anno, dichiarato come «un valore medio scritto a mano dentro il sito e non
preso da internet»; una riga onesta dice che il periodo su cui è calcolata
quella media non è ancora stato stabilito (stesso comportamento della
schermata dei risparmi, `07`, perché la fonte è la stessa costante
`INFLAZIONE_DICHIARATA`); un'ultima riga avverte che non è una previsione. In
nessun punto della pagina compare la parola «ISTAT» — vedi «Divergenze», punto
4.

In fondo, sempre come ultimo blocco della pagina (`.spiegazione.lastElementChild
=== .limiti-schermata`, confermato via DOM), due righe in rosa `#FF50A0`
dicono che cosa questa pagina non fa. Passata in rassegna ogni riga di testo
della pagina per colore computato, quel rosa compare **soltanto** lì — nessun
titolo, bordo o sfondo lo usa altrove — confermato sia a runtime (Playwright)
sia staticamente su `stiliSpiegazione.css` (`tests/spiegazione-css.test.ts`,
nuovo).

L'istanza di riferimento non dichiara alcun rimando (`passi: []`): il blocco 7
non compare affatto, non come sezione vuota.

Oggi, però, **questa pagina si raggiunge solo scrivendo l'indirizzo a mano**:
dall'elenco della sua area la domanda resta testo semplice con la nota «La
schermata che risponde a questa domanda non c'è ancora.», perché
`catalogoDomande.ts` non è stato aggiornato a `stato: 'con-schermata'`. Il
percorso di navigazione mostra due gradini, non tre. Entrambi i fatti sono
divergenze dal previsto — vedi sotto — e non sono stati corretti qui: non è
questo il file dell'agente che li deve correggere.

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

I 15 passi di fase 1, eseguiti il 2026-09-15 da `app/` con un browser pilotato
(Playwright/Chromium), non a occhio. Accanto a ciascuno, ciò che è successo
davvero.

1. **Preparare l'ambiente.** Non ho rilanciato `/prepara` da zero (il server
   era già attivo, come dichiarato nel compito): ho verificato l'equivalente
   sostanziale, `npx tsc --noEmit` e `npm test`, più volte durante questa
   riconciliazione. Risultato in «Divergenze», punto 3: non sempre verde, e il
   motivo non è mai un file di questa funzionalità. ✅ (con la nota)

2. **Avviare l'applicazione.** `node scripts/dev-server.mjs status` risponde
   «attivo · http://localhost:5173 · pid 580»: non ho dovuto avviarlo. ✅

3. **Dalla home alla domanda, non alla pagina direttamente — questo passo non
   dà il risultato atteso.** Dalla home, il click sulla card «Il costo della
   vita» porta davvero a `#/costo-della-vita` (href `#/costo-della-vita`,
   confermato). Ma nell'elenco dell'area la domanda **non è un collegamento**:
   resta un paragrafo di testo con sotto la nota «La schermata che risponde a
   questa domanda non c'è ancora.» — la stessa frase che compare per ogni
   domanda ancora senza pagina. Navigando invece direttamente all'indirizzo
   `#/spiegazione/inflazione-spesa`, la pagina si apre correttamente. ❌ per la
   lettera del passo («toccare la domanda» apre la pagina); ✅ per la
   sostanza (la pagina esiste e funziona, raggiunta per indirizzo). Causa e
   classificazione in «Divergenze», punto 2.

4. **Il percorso in cima, di tre gradini — questo passo non dà il risultato
   atteso.** La barra di navigazione mostra **due** gradini — «Pagina
   iniziale» e, come corrente, la domanda stessa — non tre: manca il gradino
   intermedio con il nome dell'area. Confermato leggendo `Navigazione.tsx`
   (per `rotta.tipo === 'schermata'` il gradino corrente è solo `passoSchermata`,
   senza un livello per l'area) e sulla barra resa a schermo. **Ora anche
   confermato da un test automatico**, comparso durante questa stessa
   riconciliazione: `tests/accettazione/03-pagina-di-spiegazione.test.ts`,
   caso C-07, fallisce con `expected 2 to be 3`, e il commento del test stesso
   lo classifica: «difetto reale del codice (non del test): riportato nel
   referto come bloccante, non corretto qui». ❌. Causa in «Divergenze», punto
   1.

5. **I primi due blocchi.** Confermato: `.occhiello` mostra «IL COSTO DELLA
   VITA» (maiuscolo per CSS, testo dichiarato «Il costo della vita»);
   `.spiegazione-titolo` mostra, carattere per carattere, la stessa domanda
   già letta nell'elenco. ✅

6. **L'immagine prima del nome tecnico — il criterio più importante di
   tutti.** Confermato in tre modi indipendenti: sul DOM del browser
   (`compareDocumentPosition`, l'ultima frase-immagine precede il nome
   tecnico), sul markup prodotto da `renderToStaticMarkup` (stessa
   posizione relativa, verificato anche eseguendo il componente con
   `vite-node`), e da `tests/spiegazione.test.ts`
   («per ogni pagina con nomeTecnico, l'ultima immagine precede sempre il
   nome tecnico»). Mai il nome tecnico compare per primo. ✅

7. **Il numero e il suo paragone.** Confermato: «98,04 €», `text-align:
   right`, `font-variant-numeric: tabular-nums`; accanto, il paragone
   «Fra le due cifre c'è una differenza di 1,96 €…» — un numero diverso, non
   una ripetizione. ✅

8. **Da dove viene quel numero — confermato, con una precisazione rispetto
   a fase 1.** La riga sulla fonte, l'avvertenza «non è una previsione», e la
   dichiarazione onesta che il periodo della media non è ancora stabilito
   compaiono tutte. **Non compare, però, la parola «ISTAT»**, che la fase 1
   dava per attesa: né questa pagina né la schermata analoga dei risparmi
   (`07`, stessa fonte `INFLAZIONE_DICHIARATA`) la nominano in quel punto — dicono
   solo che è «un valore scritto a mano dentro il sito, non preso da
   internet». Il nome della fonte compare, letteralmente, solo nella pagina
   dedicata «da dove vengono i numeri» (`13`). ✅ per la sostanza (fonte,
   periodo, avvertenza dichiarati); imprecisione di fase 1 in «Divergenze»,
   punto 4.

9. **Il blocco dei limiti, sempre in fondo e sempre in rosa.** Confermato: due
   voci, colore computato `rgb(255, 80, 160)` = `#FF50A0`, ultimo blocco
   della pagina (`lastElementChild`); nessun altro elemento di testo della
   pagina usa quel colore (verificato interrogando ogni nodo foglia dentro
   `.spiegazione`), confermato anche staticamente su `stiliSpiegazione.css`
   da `tests/spiegazione-css.test.ts`, comparso durante questa
   riconciliazione. ✅

10. **Il ritorno.** «Indietro» riporta a `#/costo-della-vita`, la stessa
    posizione di navigazione delle altre pagine. ✅

11. **Nessuna attesa, nessun salto di layout.** Aprendo direttamente
    l'indirizzo con `waitUntil: 'commit'` (il minimo che Playwright permette),
    la cifra «98,04 €» è già presente al primo controllo: nessuna rotellina,
    nessun ricalcolo successivo. ✅

12. **Da tastiera e a 375 px.** Nessuno scorrimento orizzontale
    (`scrollWidth` = `innerWidth` = 375); il contenuto (occhiello, titolo,
    cifra, numero di voci del blocco 8) è identico al disegno desktop;
    nessuna scritta sotto i 16 px (misurate 18 px, 18,9 px, 19,125 px — tutte
    sopra il minimo). Con solo Tab si raggiungono, in sequenza, «Pagina
    iniziale» e «Indietro» — i due soli elementi cliccabili di questa
    istanza, dato `passi: []` — ciascuno con un contorno di 3 px `#FF50A0`
    ben visibile (`:focus-visible`, regola globale del sito). ✅

13. **Con il Wi-Fi spento — questo passo non dà il risultato atteso alla
    lettera.** `npm run build` finisce senza errori (`index.html` 0,50 kB,
    CSS 9,97 kB, JS 183,99 kB). Servita da un server locale — verificato sia
    con il server di sviluppo sia con un piccolo server statico scritto per
    l'occasione su `127.0.0.1:4321` — la build funziona in modo identico:
    stesso contenuto (occhiello, titolo, cifra, paragone, numero di voci del
    blocco 8), **zero richieste diverse da quelle verso l'host che la
    serve**. **Aperta con un doppio clic reale su `dist/index.html`, cioè
    `file://`, la pagina resta bianca**: `<script type="module"
    crossorigin>` e `<link rel="stylesheet" crossorigin>` vengono bloccati
    dal browser sotto l'origine `null` di `file://` (confermato leggendo
    gli eventi `console`/`requestfailed`: «Access to script… blocked by CORS
    policy… origin 'null'»). **Non è un difetto nuovo**: è lo stesso,
    identico problema già trovato e registrato in `01-landing-page` (passo
    8), e ritrovato identico in `02`, `07`, `09`, `13`. ❌ per la lettera del
    passo; ✅ per la sostanza che il passo voleva provare (funziona offline,
    zero richieste di rete). Causa in «Divergenze», punto 5.

14. **Nessuna regressione sulle domande senza pagina.** L'area «Il lavoro»
    mostra ancora le sue sei voci, tutte con la nota «in arrivo» invariata:
    l'arrivo di questa pagina non ne cambia una. ✅

15. **Ciò che nessun clic può dimostrare — verificato leggendo il codice e
    (novità rispetto a fase 1) da test comparsi durante questa stessa
    riconciliazione.**
    - **Blocco 7 assente quando `passi: []`.** Confermato a schermo (nessuna
      sezione, non una sezione vuota) e ora anche da
      `tests/spiegazione.test.ts` indirettamente tramite il vincolo 5⇔6; il
      caso specifico «passi vuoto» resta confermato leggendo
      `BloccoPassi` in `PaginaSpiegazione.tsx` (`if (passi.length === 0)
      return null;`).
    - **Esempio `null` → blocchi 5 e 6 assenti.** Non più solo una lettura
      del tipo: `tests/spiegazione.test.ts` lo esercita a runtime («senza
      esempio (esempio: null), non compaiono né la cifra né la fonte») e
      passa.
    - **Stato «errore» (`ok: false`) → nessuna cifra, blocco fonte
      assente.** Esercitato a runtime da `tests/spiegazione.test.ts»
      («con un esempio che il core rifiuta…»), che passa: `BloccoEsempio`
      mostra la riga condivisa «Qualcosa in questo conto non torna…» al
      posto del numero, `BloccoFonte` non stampa nulla (`renderToStaticMarkup`
      restituisce `''`).
    - **Caso «dati lunghi» (103 caratteri, sei voci, importo a sette
      cifre).** Non esercitato dall'istanza di riferimento. Il `tester` ha
      scritto, durante questa stessa finestra di tempo,
      `tests/accettazione/03-pagina-di-spiegazione-limite.test.ts` e
      `…-limite-2.test.ts`; quest'ultimo, al momento di chiudere questa
      scheda, non compila ancora (`tsc --noEmit` segnala una proprietà
      `nonFa` mancante) — è un file evidentemente ancora in scrittura. Non
      verificato da questa scheda: resta un caso di struttura CSS
      dichiarata (`stiliSpiegazione.css`), non messo alla prova con
      un'istanza reale a sette cifre.
    - **Le due tuple non vuote (`immagine`, `nonFa`) e i due campi singolari
      (`nomeTecnico`, `esempio`).** Confermati leggendo i tipi in
      `contenutiSpiegazione.ts`, e ora anche da
      `tests/accettazione/03-pagina-di-spiegazione-tipi.ts` (CL-01…CL-08),
      che con `@ts-expect-error` dimostra che `tsc --noEmit` rifiuta
      un'istanza priva di uno di questi campi o con una tupla vuota — file
      apparso durante questa riconciliazione, eseguito con successo
      (nessun errore residuo sui suoi otto casi).
    - **L'ordine «immagine prima del nome tecnico» deciso dal componente.**
      Confermato sul markup reso (punto 6 qui sopra), non sull'ordine dei
      campi dichiarati.
    - **In più, non previsto da fase 1: «al massimo due passi» è ora un
      vincolo di TIPO**, non solo un test a runtime. `contenutiSpiegazione.ts`
      dichiara `PassiSuccessivi` come unione chiusa di tuple di lunghezza 0,
      1, 2 — un miglioramento rispetto a quanto la specifica descriveva
      («un array libero, verificato da un test»), confermato anche dal caso
      CL-18 del `tester`. Resta invece un test a runtime, non un vincolo di
      tipo, che ogni `percorso` dichiarato sia una rotta realmente
      registrata: imporlo nel tipo richiederebbe l'elenco a mano che la
      funzionalità 14 ha eliminato — confermato leggendo il commento su
      `PassoSuccessivo` in `contenutiSpiegazione.ts`.

### Limiti

- **Non scrive i contenuti delle altre pagine.** Consegna il contenitore
  (`PaginaSpiegazione.tsx`, `contenutiSpiegazione.ts`) e una sola istanza,
  quella sull'inflazione: confermato, `PAGINE_SPIEGAZIONE` ha un solo
  elemento.
- **Non è una ricerca interna e non ha un campo di domanda libera.**
  Confermato: il titolo è la chiave `domanda`, letta da `testi.ts`, mai un
  valore digitato.
- **Non prende niente dalla rete.** Confermato al passo 13: zero richieste
  diverse da quelle verso l'host che serve la pagina, sia in sviluppo sia
  dalla build.
- **Non aggiunge nessuna funzione al core e non tocca `types/`.** Confermato:
  `spiegazioneEsempio.ts` chiama `simulaRisparmio`, già scritta per la `07`;
  nessun file di questa funzionalità è sotto `src/core/` o `types/` (`git
  show --stat` sui due commit di questa funzionalità, `3106942` e
  `3fc47f9`, mostra solo file sotto `src/ui/` e due file di `docs/`).
- **Non riscrive le dodici domande della `01`.** Confermato: `domanda:
  'area1Altra1'` legge una chiave già esistente in `testi.ts`, non ne
  dichiara una nuova.
- **Non risolve il periodo mancante del tasso d'inflazione.** Confermato:
  stessa dichiarazione esplicita già presente nella schermata dei risparmi,
  perché la fonte è la stessa costante `INFLAZIONE_DICHIARATA`
  (`periodoDaCompilare` resta vero).
- **Non decide da sola l'ordine fra `02` e `03`: qui vince il catalogo, ma
  il catalogo non è stato aggiornato.** La `02` è già entrata (esiste
  `catalogoDomande.ts`, con `domandeDiArea` già usato da
  `PaginaMacrocategoria.tsx`): per la regola di risoluzione dichiarata nella
  specifica, la `03` avrebbe dovuto scrivere `stato: 'con-schermata'` e
  `percorso` sulla voce `area1Altra1`. Non l'ha fatto — vedi «Divergenze»,
  punto 2 — quindi oggi questo non è (solo) un limite previsto ma anche una
  divergenza: la pagina esiste ma non è raggiungibile dal catalogo.
- **Il collegamento fra domanda e pagina, quando esisterà nel catalogo, non
  aggiungerà un secondo modo di navigare**: resterà sempre un tocco sulla
  stessa voce dell'elenco, non un percorso alternativo.

### Divergenze fra previsto e realizzato

1. **Il percorso di navigazione ha due gradini, non tre.** La fase 1 (e la
   specifica) prevedevano «Pagina iniziale › Il costo della vita › la
   domanda». `Navigazione.tsx`, per una rotta di tipo `'schermata'`, mostra
   solo il gradino corrente (`passoSchermata`, risolto dal registro) accanto
   a «Pagina iniziale»: manca un livello per il nome dell'area. **Confermato
   da un test automatico** apparso durante questa stessa riconciliazione
   (`tests/accettazione/03-pagina-di-spiegazione.test.ts`, C-07,
   `expected 2 to be 3`), il cui stesso commento lo classifica «difetto
   reale del codice (non del test)… bloccante». **Non corretto qui**:
   `Navigazione.tsx` non è dentro il perimetro di questo agente (`docs/`), e
   la specifica lo elencava fra gli «innesti minimi» di `03-ui-builder` — chi
   ha costruito la funzionalità non l'ha esteso a un terzo gradino.

2. **Il collegamento «domanda → pagina» nel catalogo non è stato scritto.**
   La specifica, alla sezione «Conflitti di pianificazione», stabiliva che se
   la `02` fosse entrata prima (ed è entrata: `catalogoDomande.ts` esiste ed
   è usato da `PaginaMacrocategoria.tsx`), la `03` avrebbe dovuto scrivere
   `stato: 'con-schermata'` e `percorso: '#/spiegazione/inflazione-spesa'`
   sulla voce `area1Altra1`. La voce, confermato leggendo
   `catalogoDomande.ts`, è rimasta `{ chiave: 'area1Altra1', area:
   'costo-della-vita', stato: 'in-arrivo' }`. Conseguenza osservabile: dalla
   home la domanda resta testo con la nota «La schermata che risponde a
   questa domanda non c'è ancora.» — la stessa di una domanda senza
   nessuna pagina — mentre una pagina vera esiste e funziona a un indirizzo
   diretto. **Non corretto qui**: `catalogoDomande.ts` è sotto `src/ui/`, non
   sotto `docs/`.

3. **Il file di test promesso dalla specifica non esisteva quando questa
   fase 2 è iniziata, ed è comparso mentre la scrivevo.** La sezione «Come
   si dimostra che ha funzionato» della specifica promette
   `tests/spiegazione.test.ts`, assegnato a `guardrail-officer`. All'inizio
   di questa riconciliazione (`npm test`, 15:55) la suite contava 195 test
   in 25 file: **nessuno** relativo a questa funzionalità. Rieseguendo la
   stessa suite alle 16:03 e alle 16:10, comparivano
   `tests/spiegazione.test.ts`, `tests/spiegazione-css.test.ts` (di
   `guardrail-officer`) e `tests/accettazione/03-pagina-di-spiegazione*.test.ts`
   più `…-tipi.ts` (di `tester`) — tutti non ancora committati
   (`git status`, 2026-09-15 16:14, li mostra `??`). Il vuoto descritto è
   reale ed è durato dall'apertura della funzionalità fino a questo momento;
   non lo dichiaro chiuso perché non lo era quando ho iniziato a verificare,
   e perché i file più recenti (`…-limite-2.test.ts`) non compilano ancora a
   questa data. **Non è un difetto di questa scheda**: è cronaca di ciò che
   ho osservato, riportata perché chi legge deve saperlo senza cercare
   altrove.

4. **Imprecisione di fase 1: la fonte non nomina «ISTAT» in questa
   pagina.** Il passo 8 di fase 1 prevedeva che comparisse «la fonte —
   ISTAT, la stessa già letta sotto il simulatore dei risparmi». Verificato
   che né questa pagina né quella dei risparmi (`07`) nominano «ISTAT» in
   quel punto: entrambe dicono solo che il tasso è «un valore scritto a mano
   dentro il sito, non preso da internet» (`spiegazioneInflazioneSpesaFonte`,
   `simulazioneRisparmioFonte`). «ISTAT» compare, come stringa letterale,
   solo nella pagina dedicata `13` e nel registro `registroFonti.ts`. Non è
   un difetto della `03`: è che fase 1 attribuiva a questa pagina un
   dettaglio testuale che la specifica non prometteva e che nessuna delle
   due pagine analoghe realizza.

5. **Passo 13 — «con il Wi-Fi spento» non dà, alla lettera, il risultato
   previsto.** Un doppio clic reale su `dist/index.html` produce una pagina
   bianca: gli attributi `type="module" crossorigin` generati dalla build
   sono bloccati dal browser sotto l'origine `null` di `file://`. **Non è un
   difetto nuovo**: è lo stesso, identico problema già trovato e registrato
   in `01-landing-page` (passo 8) e ritrovato in `02`, `07`, `09`, `13`. La
   causa vive nella configurazione di build (`vite.config.ts` e l'HTML
   generato), fuori da `src/ui/` — fuori dal perimetro di questa
   funzionalità e di questo agente. Servita da un server locale, anche solo
   di loopback, la stessa build funziona in modo identico al server di
   sviluppo, con zero richieste esterne.

6. **Un fallimento non riprodotto, trovato e chiarito durante questa stessa
   verifica.** La prima volta che ho eseguito l'intera suite dopo la
   comparsa di `tests/spiegazione.test.ts`, un'asserzione sull'ordine dei
   blocchi 3→4 è fallita (`expected [] to equal ['inflazione-spesa']`).
   Rieseguendo lo stesso file in isolamento (7/7 verdi) e di nuovo l'intera
   suite subito dopo (di nuovo verde su questo file), e confrontando
   indipendentemente il markup prodotto da `renderToStaticMarkup` (via
   `vite-node`) con il DOM del browser — entrambi mostrano l'ordine
   corretto — attribuisco il fallimento al carico concorrente di più agenti
   sulla stessa macchina nello stesso istante (più processi `vitest`/`tsc`
   in esecuzione insieme), non a un difetto del codice di questa
   funzionalità. Registrato per trasparenza: non ha richiesto nessuna
   correzione, perché non c'era niente da correggere.

7. **Nessuna divergenza sui restanti passi**, né su «Cosa farà», né sui
   limiti previsti diversi da quelli elencati sopra: il numero di
   riferimento, il suo paragone, l'ordine dei blocchi 1-2-3-4-5/6-8, il
   blocco 8 sempre presente e sempre in rosa, la tenuta a 375 px e da
   tastiera, e l'assenza di regressioni sulle altre aree corrispondono, alla
   lettera, a quanto la fase 1 prevedeva.

---

## 04 — «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/04-guida-interattiva-busta-paga.md`](features/04-guida-interattiva-busta-paga.md)
### Cosa fa

«…»

### Per chi

Una persona con contratto da dipendente che riceve il cedolino ogni mese, lo
guarda due secondi, cerca l'ultima riga in basso e butta il resto: sa che il
numero sul conto è più piccolo di quello scritto in alto, ma non sa dire
perché, e ha smesso di chiederselo perché ogni volta ha trovato solo sigle —
`IVS`, `IRPEF`, `c/dipendente`. Le servirà il giorno dello stipendio, con il
proprio cedolino vero aperto accanto al telefono: non in un momento di
studio, in un momento in cui sta confrontando due schermate.

Le servirà anche, ed è il caso meno scontato, a chi riceve la **prima** busta
paga della vita e non ha un termine di paragone: per quella persona il salto
fra lordo e netto non sarà una curiosità, sarà una sorpresa da 645 euro.

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»

---

## 05 — «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/05-guida-interattiva-bolletta-luce-gas.md`](features/05-guida-interattiva-bolletta-luce-gas.md)
### Cosa fa

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

### Come si prova

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

### Limiti

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

---

## 06 — «Sul 730 c'è scritto che mi tornano 665 €: da dove esce quel numero?»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/06-guida-interattiva-dichiarazione-730.md`](features/06-guida-interattiva-dichiarazione-730.md)
### Cosa fa

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

### Come si prova

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

### Limiti

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
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/08-simulatore-netto-in-busta-paga.md`](features/08-simulatore-netto-in-busta-paga.md)
### Cosa fa

Chi digiterà quanto guadagna lordo al mese e quante mensilità riceve in un
anno vedrà comparire, subito e senza attese, quanto gli resterà davvero: il
numero grande sarà il netto mensile — con 2.000 € lordi e 13 mensilità,
**1.398,47 €** — insieme al netto annuo, più piccolo, e a una barra che
scomporrà la differenza in tre pezzi visibili tutti insieme: quanto andrà ai
contributi, quanto all'imposta sul reddito, quanto resterà sul conto.
Accanto comparirà il paragone «su ogni 100 € scritti come lordo, 69,92 €
arrivano sul tuo conto», e — in corpo leggibile, non in una nota a piè di
pagina — la frase che dichiara che questo numero è una stima calcolata così,
non la busta paga vera.

### Per chi

La persona con il cedolino in mano che vede due numeri molto diversi — il
lordo in alto, il netto arrivato sul conto — senza sapere che cosa sia
successo in mezzo. Le servirà nel momento in cui arriva la busta paga, o
quando qualcuno le proporrà un lordo — un colloquio, un rinnovo, un
passaggio di livello — e dovrà tradurlo nella cifra mensile che si confronta
con l'affitto e con la spesa di tutti i giorni.

Le servirà anche arrivando dalla guida che spiega il cedolino voce per voce
(funzionalità 04): dopo aver letto le singole trattenute sul proprio
documento, potrà digitare qui gli stessi due numeri e rifare il conto sul
proprio caso.

### Come si prova

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non
dà il risultato atteso, la funzionalità non è finita. I comandi vanno
eseguiti da `app/`.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`, che esegue
   `node scripts/prepara.mjs`). Serve solo la prima volta.
   *Risultato atteso:* lo script dirà «Ambiente già pronto», oppure elencherà
   i passi che ha installato, e il suo controllo di salute — `tsc --noEmit` e
   poi `npm test` — finirà senza errori.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue
   `node scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un
   processo che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo `http://localhost:5173`.

3. **Raggiungere la schermata, continuando dalla guida al cedolino.** Aprire
   quell'indirizzo e arrivare — dalla home, area «Il lavoro» — alla guida che
   spiega il cedolino voce per voce (funzionalità 04); da lì toccare l'invito
   a rifare il conto sul proprio caso: è il collegamento che la specifica
   della 04 dichiara **ancora assente oggi**, con la promessa esplicita di
   aggiungerlo «quando 08 sarà pronta».
   *Risultato atteso:* si aprirà, con un tocco solo dalla guida, una
   schermata dedicata a un concetto solo — dove finisce il lordo.
   **Attenzione**: quel collegamento non è fra i file che la specifica di
   questa funzionalità dichiara di toccare (non cita `PaginaBustaPaga.tsx` né
   `catalogoDomande.ts`). Se all'apertura della guida 04 il collegamento non
   comparisse ancora, è un punto da segnalare in fase 2 come divergenza — non
   un motivo per inventare un altro percorso di prova: tutti i passi
   successivi restano verificabili aprendo la schermata dal suo indirizzo,
   qualunque esso sia.

4. **Lo stato vuoto, prima di digitare niente.** Osservare la schermata
   appena aperta, senza scrivere nei due campi.
   *Risultato atteso:* comparirà quali due numeri servono — il lordo
   mensile e le mensilità — e dove si leggono sulla propria busta paga, non
   «nessun risultato». La barra non comparirà vuota né a zero: al suo posto
   una frase che spiega che cosa mostrerà una volta compilati i campi.

5. **Lo stato «in caricamento» non sposterà il layout.** Osservare la
   schermata nell'istante esatto in cui si apre.
   *Risultato atteso:* nessuna rotellina che gira e sparisce: il calcolo è
   immediato e locale, quindi lo stato esisterà solo come spazio già
   riservato. Il riquadro del risultato e la barra occuperanno già il loro
   posto da vuoti, così quando compariranno i numeri il resto della
   schermata non si sposterà.

6. **Digitare il caso di riferimento.** Scrivere **2000** (il lordo
   mensile, in euro) nel primo campo e **13** (le mensilità) nel secondo.
   *Risultato atteso:* senza attese comparirà **1.398,47 €** come numero
   grande — il netto mensile — e sotto, più piccolo, **18.180,16 €** come
   netto annuo, insieme al paragone «su ogni 100 € scritti come lordo, 69,92 €
   arrivano sul tuo conto».

7. **La barra e la quadratura — il criterio più importante di tutti.**
   Leggere i tre pezzi della barra e, con una calcolatrice qualunque,
   sommare i tre importi in euro scritti accanto a ciascuno.
   *Risultato atteso:* tre pezzi — contributi, imposta sul reddito, quello
   che resta — ciascuno con etichetta, percentuale e importo **sempre
   scritti**, mai visibili solo al passaggio del mouse: **9,19%** ai
   contributi (2.389,40 €), **20,89%** all'imposta (5.430,44 €), **69,92%**
   che resta (18.180,16 €). Sommando i tre importi si otterrà **esattamente**
   26.000,00 € — il lordo annuo, 2.000 × 13 — senza un centesimo di scarto:
   è la sottrazione che la persona potrà rifare su un foglio.

8. **L'avvertenza che questo numero non è la busta paga vera.** Cercare,
   sulla stessa schermata, la frase che dichiara i limiti del calcolo.
   *Risultato atteso:* comparirà in corpo leggibile — della stessa
   dimensione del resto del testo, almeno 16 px, **non** in una nota a piè
   di pagina — e dirà che il calcolo lascia fuori le detrazioni per lavoro
   dipendente e le addizionali regionali e comunali: le due cose tirano in
   direzioni opposte (le detrazioni alzerebbero il netto, le addizionali lo
   abbasserebbero), e per questo la cifra sarà presentata come una stima —
   «un netto calcolato così, con queste due cose lasciate fuori» — non come
   «il tuo netto».

9. **Da dove vengono le aliquote usate.** Cercare, vicino al risultato, la
   riga che dichiara le aliquote e le soglie con cui è stato fatto il
   calcolo.
   *Risultato atteso:* comparirà la fonte attesa per ciascun dato — Agenzia
   delle Entrate per l'IRPEF, INPS per i contributi — insieme a una
   dichiarazione esplicita che l'anno d'imposta a cui questi valori si
   riferiscono non è ancora stato confermato da nessuno: le aliquote non
   saranno presentate come un fatto già verificato, sullo stesso schema già
   usato per il tasso di inflazione della funzionalità 07, dove quel flag è
   tuttora falso.

10. **Lo stato di errore.** Cancellare il valore digitato nel campo delle
    mensilità e scrivere **15** (fuori dall'intervallo 12–14 ammesso).
    *Risultato atteso:* comparirà una frase in linguaggio umano — sul
    modello di «controlla questo numero, sembra troppo alto», mai «errore di
    validazione» — il numero grande non mostrerà una cifra calcolata su un
    dato che non va, e il **2000** digitato nell'altro campo resterà dov'è,
    senza sparire.

11. **Dati lunghi.** Cancellare e riscrivere **99000** come lordo mensile
    (99.000 €, sotto la soglia massima di 100.000 €) con **14** mensilità:
    un lordo annuo a sette cifre, 1.386.000 €.
    *Risultato atteso:* la griglia non si romperà, il numero grande non
    andrà a capo in un punto illeggibile, e le tre etichette della barra
    resteranno leggibili e affiancate al proprio importo anche dovendo
    andare a capo.

12. **Da tastiera e a finestra stretta come un telefono.** Restringere la
    finestra sotto i 768 px di larghezza e rifare i passi 6-8; poi, senza
    toccare il mouse, premere Tab più volte fino a raggiungere i due campi e
    i collegamenti della schermata.
    *Risultato atteso:* nessuna scritta scenderà sotto i 16 px, il contrasto
    fra testo e fondo resterà leggibile (almeno 4,5:1), nessun bersaglio —
    campi, collegamenti — sarà più piccolo di 44×44 px, e ogni elemento che
    riceve il focus da tastiera avrà un contorno visibile, mai un `outline`
    rimosso senza un sostituto altrettanto evidente.

13. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la stessa schermata servita
    da un server locale qualunque.
    *Risultato atteso:* la build finirà senza errori, e rifacendo i passi
    6-9 si leggerà esattamente lo stesso risultato — **1.398,47 €**, la
    stessa barra, la stessa avvertenza — senza che parta una sola richiesta
    fuori dal computer: le aliquote sono scritte nel codice, non lette da
    qualche parte in rete.

### Limiti

- **Non dirà a nessuno che cosa farne.** Niente su quanto chiedere di
  aumento, su come ridurre le trattenute, su quale inquadramento o regime
  fiscale avere. Si fermerà a mostrare dove va il lordo digitato — una
  sottrazione scomposta in tre pezzi — non un'indicazione su come cambiarla.
- **Non metterà a confronto il regime da lavoratore dipendente con quello da
  partita IVA in regime forfettario.** Se un giorno rientrerà, sarà una
  specifica a sé, con i due conti mostrati fianco a fianco senza che nessuno
  dei due venga indicato come l'opzione buona, e con il coefficiente di
  redditività digitato dalla persona, mai fisso: oggi mancano comunque,
  dichiarate con il loro anno d'imposta, le altre grandezze che
  servirebbero — coefficiente, imposta sostitutiva, aliquota della Gestione
  Separata.
- **Non prenderà le aliquote IRPEF, gli scaglioni né l'aliquota contributiva
  INPS dalla rete**, né a runtime né in fase di build: sono dati che nessuno
  di noi può inventare. Entreranno nel codice come parametri dichiarati in un
  modulo a parte, `fiscoDichiarato.ts`, insieme alla loro fonte attesa —
  Agenzia delle Entrate / Legge di Bilancio per l'IRPEF, circolare INPS per i
  contributi — e a un flag, `annoImpostaDichiarato`, che partirà `false`.
  Finché resterà falso, la schermata lo dirà apertamente invece di
  presentare 23% / 33% / 43% e 9,19% / 10,19% come aliquote già verificate:
  sono, per ora, valori di prova presi da un documento interno, non da una
  circolare controllata. È lo stesso schema già usato per il tasso di
  inflazione della funzionalità 07, dove quel flag è tuttora falso — e con
  la funzionalità 13 esiste ora un registro unico delle fonti che è il luogo
  naturale in cui questi valori finiranno una volta confermati: è quel
  passaggio, non l'implementazione di questo calcolo, a fermare la demo
  dall'avere qui numeri già verificati.
- **Non includerà le detrazioni per lavoro dipendente né le addizionali
  regionali e comunali**, e lo dichiarerà a schermo in corpo leggibile: sono
  due omissioni che tirano in direzioni opposte, e per questo il risultato
  non sarà presentato come «il tuo netto» ma come una stima calcolata così.
- **Non spalmerà correttamente la tredicesima.** Il netto mensile sarà una
  media fra le mensilità digitate, mentre nella busta vera il mese della
  tredicesima è tassato a parte — e la schermata lo dichiarerà.
- **Non tratterà casi diversi da un lavoratore dipendente del settore
  privato**: niente pubblico impiego, part-time a orario variabile, premi,
  straordinari, fringe benefit, bonus o trattenute personali.
- **Non chiederà né conserverà dati personali.** Le due cifre digitate
  resteranno nella pagina, non finiranno nell'indirizzo del browser né
  saranno salvate da nessuna parte.
- **Non leggerà un documento vero.** I due numeri si digiteranno a mano.
  Leggere il cedolino riga per riga resta il compito della guida —
  funzionalità 04 — a cui questa schermata si collega ma che non sostituisce.

---

---

## 09 — «Per quanti mesi bastano i soldi che ho da parte»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/09-mesi-coperti-dai-risparmi.md`](features/09-mesi-coperti-dai-risparmi.md)
### Cosa fa

Chi scriverà due numeri — quanto spende in un mese per le spese fisse e quanto
ha da parte — vedrà comparire una cifra sola, grande: per quanti mesi e giorni
quella cifra copre quelle spese, se da un certo momento in poi non entrasse più
niente sul conto. Con 1.200 € di spese al mese e 3.100 € da parte comparirà
**2 mesi e 17 giorni**, e subito sotto la scomposizione che permette di rifare
il conto a mano: due mesi pagati per intero — 2.400,00 € — più altri 700,00 €
che restano, cioè 17 giorni del mese successivo. Il conto si fermerà sempre al
giorno pieno per difetto: non dichiarerà mai una copertura più lunga di quella
che la divisione dà davvero.

La schermata dirà per quanti mesi durano quei soldi, con l'ipotesi scritta in
chiaro accanto al risultato — non in una nota a piè di pagina — e si fermerà
lì: non dirà se quel numero è poco o tanto, non userà nessun colore di
giudizio e non proporrà nessun traguardo da raggiungere.

### Per chi

Una persona con un lavoro che potrebbe non esserci fra sei mesi — un contratto
a termine in scadenza, una partita IVA con un cliente solo, un'azienda che ha
annunciato tagli. Ha qualcosa da parte e non sa dire quanto le durerebbe:
l'ansia è generica — «non so se basterebbe» — e in quella forma non si può né
misurare né mettere giù.

Le servirà nel momento in cui arriva la notizia che il reddito potrebbe
fermarsi, o nel momento tranquillo in cui guarda il conto e la domanda le
passa per la testa da sola — prima che succeda qualcosa, perché dopo nessuno
apre un sito per fare una divisione. Dopo, al posto di «non so se basterebbe»,
avrà una cifra riferita a sé — «con 1.200 € di spese al mese e 3.100 € da
parte, quei soldi coprono 2 mesi e 17 giorni» — che potrà rifare su un foglio
ogni volta che vorrà.

### Come si prova

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non
dà il risultato atteso, la funzionalità non è finita. I comandi vanno eseguiti
da `app/`.

Il caso di riferimento è quello già verificato a mano nella specifica: **1.200 €
di spese fisse al mese, 3.100 € da parte** → 2 mesi e 17 giorni, con un residuo
di 700,00 € nell'ultimo mese. Lo stesso caso che il test unitario bloccherà e
che finirà nello screenshot della demo: la slide mostrerà la cifra che il test
dimostra.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (chi non usa Claude
   Code ottiene lo stesso risultato con `npm run prepara`, che esegue
   `node scripts/prepara.mjs`). Serve solo la prima volta.
   *Risultato atteso:* lo script dirà «Ambiente già pronto», oppure elencherà
   i passi che ha installato, e il suo controllo di salute — `tsc --noEmit` e
   poi `npm test` — finirà senza errori. Se fallisce, ci si fermerà qui.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue
   `node scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un
   processo che non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo `http://localhost:5173`.

3. **Arrivare alla schermata navigando, non scrivendo l'indirizzo a mano.**
   Aprire quell'indirizzo, entrare nell'area «Il futuro» e aprire la nuova
   domanda nella sua lista di argomenti.
   *Risultato atteso:* si aprirà la pagina all'indirizzo
   `#/quanti-mesi-bastano`. Se la voce nuova non comparirà nella lista
   dell'area «Il futuro» e vi si potrà arrivare solo scrivendo l'indirizzo a
   mano nella barra, il passo non sarà superato: andrà segnalato come
   divergenza in fase 2, non aggirato.

4. **Lo stato vuoto — prima di digitare qualunque cosa.** Guardare la
   schermata appena aperta, senza toccare i campi.
   *Risultato atteso:* **nessun numero grande inventato e nessuno zero** al
   posto del risultato, e **nessuna frase che anticipi un giudizio** su quello
   che comparirà. Al loro posto una frase che dirà quali due cifre servono —
   le spese fisse di un mese e quanto si ha da parte — e dove scriverle.

5. **Il caso verificato a mano.** Digitare le spese mensili e i risparmi del
   caso di riferimento — 1.200 € e 3.100 €.
   *Risultato atteso:* comparirà **2 mesi e 17 giorni** come numero grande —
   il più grande della schermata. Accanto si leggerà l'ipotesi in chiaro, non
   in una nota a piè di pagina: «se da domani non entrasse più niente sul
   conto». Sotto, la scomposizione che permette di rifare il conto a mano: due
   mesi pagati per intero — **2.400,00 €** — più **700,00 €** che restano,
   cioè altri 17 giorni. Si leggeranno anche la convenzione dichiarata — «un
   mese contato come 30 giorni; i conti si fermano sempre al giorno pieno» —
   la frase che dice che il numero non viene da nessuna fonte esterna ma solo
   dalle due cifre digitate, e l'avvertenza standard già usata nelle altre
   simulazioni del sito.

6. **Niente da parte — un risultato, non un errore.** Lasciare le spese
   mensili come al passo 5 e cambiare i risparmi in `0`.
   *Risultato atteso:* comparirà **0 giorni** come risultato valido, con la
   frase che spiega il conto — non un messaggio d'errore, non un campo che si
   rifiuta, non un tono che lasci intendere che zero sia sbagliato. Rifiutarlo
   come errore di validazione sarebbe un giudizio mascherato da controllo:
   dire a chi non ha nulla da parte che il suo numero «non va bene» non
   sarebbe un controllo, sarebbe un verdetto. È una differenza voluta rispetto
   alla funzionalità «quanto valgono davvero i miei risparmi» (07), dove una
   somma a zero viene invece rifiutata perché lì non c'è nessuna erosione da
   mostrare: qui zero da parte è una situazione reale che qualcuno può
   trovarsi a leggere, e la schermata la tratterà come tale.

7. **L'errore in linguaggio umano.** Nel campo delle spese mensili scrivere
   `0`, oppure una cifra chiaramente troppo bassa per essere le spese fisse di
   un mese, oppure del testo al posto di un numero.
   *Risultato atteso:* comparirà un messaggio scritto come lo direbbe una
   persona, mai «errore di validazione nel campo input». Il numero grande non
   mostrerà un risultato calcolato su una divisione per zero o su un dato che
   non va, e quello che resterà digitato nel campo dei risparmi **non andrà
   perso**: correggere un campo non dovrà costare quello già scritto
   nell'altro.

8. **Nessun giudizio in vista — il criterio più delicato di tutti.** Con il
   caso del passo 5 ancora a schermo, guardare l'intera pagina: colori,
   titoli, ogni frase.
   *Risultato atteso:* nessun elemento colorato di verde, giallo o rosso — né
   in generale nessun colore usato per comunicare un verdetto — e nessuna
   parola come «abbastanza», «sufficiente», «obiettivo», «traguardo»,
   «dovresti avere», o «tre mesi» / «sei mesi» usate come soglia da
   raggiungere. In nessun punto comparirà l'espressione «fondo di emergenza».
   La pagina dirà per quanti mesi durano quei soldi e non dirà se è poco o
   tanto.

9. **Lo stato «in caricamento» non deve far saltare il layout.** Guardare
   dove si trova il riquadro del risultato prima di digitare, poi digitare i
   valori del passo 5 e guardare dove si trova dopo.
   *Risultato atteso:* sarà nello stesso posto. Il calcolo è immediato e tutto
   locale: nessuna rotellina che gira per un istante e sparisce.

10. **Dati lunghi — il caso che rompe le griglie.** Digitare `500` nelle
    spese mensili e `999999` nei risparmi.
    *Risultato atteso:* comparirà **1.999 mesi e 29 giorni** su una riga
    leggibile, senza spezzare «1.999» da «mesi» andando a capo a metà, e senza
    barra di scorrimento orizzontale. Le cifre resteranno tabulari e allineate
    a destra dove compaiono in una tabella.

11. **Da tastiera e a finestra stretta come un telefono.** Restringere la
    finestra sotto i 768 px di larghezza — quanto misura lo schermo di un
    telefono tenuto in verticale — e rifare il passo 5; poi, senza toccare il
    mouse, premere Tab più volte per compilare i due campi e raggiungere ogni
    collegamento della pagina.
    *Risultato atteso:* i campi e il risultato si impileranno senza testo
    tagliato, nessuna scritta scenderà sotto i 16 px, ogni testo si leggerà
    con un contrasto di almeno 4,5:1 sul fondo — mai un grigio slavato — e
    nessun bersaglio da toccare sarà più piccolo di 44×44 px, cioè del
    polpastrello di un dito. Con Tab il focus attraverserà i campi nell'ordine
    in cui si leggono e a ogni passaggio si vedrà un contorno netto attorno
    all'elemento che lo ha; nessuna informazione — l'ipotesi, la
    scomposizione, l'avvertenza — sarà disponibile solo passando il mouse
    sopra qualcosa.

12. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la schermata dalla cartella
    `dist/`.
    *Risultato atteso:* la build finirà senza errori, e rifacendo il passo 5
    il risultato sarà lo stesso — 2 mesi e 17 giorni — **senza che parta una
    sola richiesta fuori dal computer**. Questa è l'unica funzionalità del
    sito che non dipende da nessuna costante esterna da dichiarare: non c'è un
    tasso, non c'è una fonte, quindi non c'è niente da aggiornare né alcun
    blocco aperto legato ai dati. Il caso del doppio clic diretto su
    `dist/index.html` è un difetto già noto e registrato in `01-landing-page`,
    passo 8: qui si verifica solo che questa schermata non aggiunga nuove
    richieste di rete, non lo si risolve.

### Limiti

- **Non dirà se i mesi calcolati sono pochi o tanti.** Nessuna soglia, nessun
  obiettivo, nessun «tre mesi» o «sei mesi» presentati come traguardo da
  raggiungere: sarebbero insieme una raccomandazione personalizzata e un
  numero senza nessuna fonte che lo dichiari.
- **Non userà il semaforo verde/giallo/rosso**, pur essendo il pattern che le
  regole di scrittura del sito prescrivono di solito per tradurre un numero in
  un giudizio immediato. È una **deroga dichiarata, non una dimenticanza**:
  qui il semaforo classificherebbe la situazione personale di chi legge — «va
  bene» / «attenzione» / «preoccupante» — che è esattamente il giudizio che
  questo prodotto non dà.
- **Non si chiamerà, in nessun punto** — schermata, indirizzo, testo del
  codice — **«fondo di emergenza»**: è il nome respinto dal cancello
  d'ingresso della specifica, non una scelta di stile evitata per gusto.
- **Non proporrà un traguardo** e non calcolerà quanto manca per
  raggiungerlo: «ti mancano 4.500 € per arrivare a sei mesi» sarebbe un
  consiglio travestito da sottrazione.
- **Non farà digitare un traguardo scelto dalla persona**: sarebbe un secondo
  concetto nella stessa schermata, e la regola del sito è un concetto per
  schermata. Se servirà, sarà un'altra specifica e un altro branch.
- **Non chiederà perché le entrate potrebbero fermarsi** e non distinguerà
  fra le cause: la divisione resterà identica in ogni caso, senza profilare
  né drammatizzare chi la usa.
- **Non nominerà prodotti finanziari** — conti, depositi, fondi, titoli,
  polizze — e non dirà dove tenere quei soldi.
- **Non calcolerà l'inflazione** su quella cifra: incrociarla con la
  funzionalità «quanto valgono davvero i miei risparmi» raddoppierebbe i
  concetti in una schermata sola.
- **Non sarà una previsione.** Presupporrà che le spese restino quelle
  digitate e che non entri più nessuna entrata, e le due ipotesi
  compariranno scritte a schermo, non in una nota a piè di pagina.
- **Non leggerà nessun documento.** I due numeri si digiteranno a mano, e la
  funzionalità non toccherà `src/ingest/`.
- **Non conserverà né trasmetterà le due cifre da nessuna parte.**
  Resteranno nello stato della pagina e non finiranno nell'indirizzo, per la
  stessa ragione già valida nella «07»: un importo nell'hash resterebbe nella
  cronologia del browser senza che nessuno l'abbia deciso.

---

---

## 10 — «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/10-simulatore-rata-mutuo-fisso-variabile.md`](features/10-simulatore-rata-mutuo-fisso-variabile.md)
### Cosa fa

«…»

### Per chi

Una persona che ha in mano due preventivi di mutuo — o un preventivo solo con
due righe di tasso, «3,46% fisso» e «2,80% variabile» — nel momento esatto in
cui li tiene sul tavolo e sta per chiedere a qualcuno «ma in pratica quanto
pago?». Non sta scegliendo fra le due offerte: vuole tradurre due percentuali
che non sa leggere in euro al mese, l'unica unità con cui la sua vita è
organizzata.

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»

---

## 11 — «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/11-approfondimento-sul-mutuo.md`](features/11-approfondimento-sul-mutuo.md)
### Cosa fa

«…»

### Per chi

Una persona che sta per firmare, o ha già firmato, il debito più grande
della sua vita, e che davanti al foglio della banca riconosce solo la
cifra della rata: TAN, TAEG, ammortamento, ipoteca, istruttoria sono parole
lette senza aver mai osato chiedere che cosa significano. Le serve nei
giorni fra il preventivo e la firma, nei mesi dopo quando il debito scende
meno di quanto sperava, e — per la sola schermata 7 — nel momento in cui la
rata comincia a pesare troppo: lì non legge per curiosità.

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»

---

## 12 — «Il foglio che ti danno prima di firmare»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/12-guida-al-foglio-prima-di-firmare.md`](features/12-guida-al-foglio-prima-di-firmare.md)
### Cosa fa

«…»

### Per chi

La persona a cui, allo sportello o in un ufficio, hanno appena messo davanti
un foglio fitto di poche pagine che non ha chiesto e non capisce, con
qualcuno seduto davanti che aspetta una firma — oppure la stessa persona, la
sera a casa, con la copia in mano e la domanda «che cosa ho firmato». Le
servirà **prima di firmare**, non dopo: il tempo a disposizione è pochi
secondi, non una lettura con calma.

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»

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

---

## 14 — Registro delle schermate
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/14-registro-delle-schermate.md`](features/14-registro-delle-schermate.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

