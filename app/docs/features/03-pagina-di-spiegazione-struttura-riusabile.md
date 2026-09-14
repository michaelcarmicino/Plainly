# 03 — «La pagina che risponde a una domanda: il contenitore, non il contenuto»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «04-guardrail-officer»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 2 «Pagine di spiegazione dei concetti». Task di backlog: `03`.
>
> **Questa è la funzionalità strutturale del backlog.** I task `11` e `12` sono
> sue istanze per intero; `04`, `05` e `06` lo sono per la parte spiegata di
> ogni voce di documento. Una struttura sbagliata qui si paga cinque volte, e
> per questo la spec dichiara i blocchi **prima** che esista un contenuto da
> metterci dentro.

## Per chi

La stessa persona della `01`: arriva con un'ansia già formata, ha toccato una
delle tre porte, e adesso sta guardando l'elenco delle domande di quell'area.
Ne sceglie una — «Con gli stessi soldi della spesa, quanto porto a casa
rispetto a un anno fa?» — e si aspetta una risposta, non un rimando.

Oggi quell'elenco è quasi tutto testo morto: una sola delle dodici domande
porta da qualche parte. Chi tocca le altre non ottiene niente.

## Quando serve

Nel secondo o terzo tocco dall'apertura del sito, che è anche l'ultimo
disponibile: `scrittura-e-accessibilita.md` fissa il percorso a **due o tre
tap** dalla domanda alla risposta pratica. Home → area → **questa pagina** sono
già tre. Quello che non sta qui dentro non ha più un posto dove stare.

È anche il momento in cui la persona decide se il sito parla la sua lingua. Se
qui trova una definizione da manuale, se ne va e non torna.

## Cosa deve poter fare dopo

Leggere la risposta alla domanda che ha toccato, riconoscere il meccanismo
dalla propria vita quotidiana — il carrello della spesa, non l'indice dei
prezzi — vedere **un** numero con accanto il suo paragone, sapere da dove viene
quel numero, e sapere che cosa quella pagina **non** le ha detto.

E chi scrive la pagina successiva deve poterlo fare **senza poter sbagliare la
forma**: dichiara i contenuti, non costruisce una schermata.

## Input

Nessun dato digitato dalla persona e nessuna fixture. Gli ingressi sono due, e
sono entrambi già nel repository:

| Ingresso | Da dove arriva |
| --- | --- |
| Le dodici domande delle tre aree | `src/ui/contenutiHome.ts` (chiavi) e `src/ui/testi.ts` (parole) — esistono già, scritte dalla `01` |
| I numeri degli esempi | **solo** da funzioni già esportate da `src/core/index.ts`, con argomenti fissi dichiarati nel contenuto |

> **Nessun dato nuovo, nessun blocco aperto.** L'istanza di riferimento di
> questa spec riusa `calcolaSimulazioneRisparmio`, già scritta e già coperta da
> test dalla `07`. È una scelta deliberata: una funzionalità strutturale che
> per essere dimostrata pretende anche un calcolo nuovo mette due rischi sullo
> stesso branch, e quando fallisce non si capisce quale dei due l'ha rotta.

## Elaborazione

Non c'è calcolo di dominio nuovo. I passi verificabili a mano sono quattro, e
sono tutti **derivazioni**, cioè valori che nessuno scrive a mano perché
verrebbero scritti sbagliati:

1. **Rotta della pagina** = `#/spiegazione/<id>`, con `<id>` fra quelli
   dichiarati. Un `<id>` non dichiarato non apre una schermata d'errore: cade
   sulla home, che è il comportamento che `parseRotta` ha già per qualunque
   indirizzo storto.

2. **Il titolo della pagina è la domanda dell'elenco, non una sua variante.**
   La pagina dichiara la **chiave** `domanda`, e stampa quella. Non esiste un
   punto in cui si possa riscrivere il titolo: una domanda promessa nell'elenco
   e un'altra stampata in cima alla pagina sarebbero due informazioni diverse,
   cioè il terzo motivo di rifiuto di `/spec` applicato a noi stessi.

3. **La mappa «domanda → dove porta» si deriva dalle pagine dichiarate.** Oggi
   `PaginaMacrocategoria.tsx` tiene a mano `SCHERMATA_DELLA_DOMANDA`, con una
   riga sola dentro. Con più pagine quella mappa diventa il posto in cui ci si
   dimentica una riga e un link sparisce senza che niente fallisca. Si inverte:
   ogni pagina dichiara la domanda a cui risponde, e la mappa si costruisce da
   lì. È lo stesso movimento già fatto per il numero del badge nella `01` — «si
   deriva dalla lista, così non può mentire quando la lista cambia».

   > **Questo passo vale solo se `03` arriva prima della `02`.** Il catalogo
   > delle domande sposta la stessa mappa dentro il dato dichiarato, con
   > `stato` e `percorso` su ogni voce. Se `02` è già entrata — ed è l'ordine
   > previsto — questa pagina **non** deriva niente: scrive `percorso` sulla
   > voce di catalogo della sua domanda. Due derivazioni della stessa mappa
   > sarebbero due verità nello stesso file. Vedi «Conflitti di
   > pianificazione».

4. **L'esempio numerico dell'istanza di riferimento**, con
   `risparmioCent = 10_000` (100,00 €), `anni = 1`, `inflazioneAnnuaBp = 200`:

   ```
   (1,02)^1                 = 1,02
   10.000 / 1,02            = 9.803,92…  -> 9.804 cent  (98,04 €)
   perdita                  = 10.000 - 9.804 = 196 cent (1,96 €)
   ```

   Da cui la frase: «Con gli stessi 100 € della spesa, oggi porti a casa quello
   che un anno fa costava 98,04 €.» Con 100 € il valore reale e il paragone su
   100 € sono **lo stesso numero**: il paragone non è un secondo calcolo che
   potrebbe non tornare, è la cifra stessa letta come una banconota che tutti
   hanno avuto in mano.

## Output

**Il cuore di questa spec.** Una pagina di spiegazione è fatta di **otto
blocchi**, in **quest'ordine e non in un altro**. Quattro ci sono sempre, uno
c'è se e solo se c'è il numero, tre sono facoltativi.

| # | Blocco | Obbligatorio | Che cosa contiene |
| --- | --- | --- | --- |
| 1 | **Occhiello dell'area** | **sì** | il titolo dell'area da cui si è arrivati, in maiuscolo spaziato. Dice *dove si è* prima di dire *di che cosa si parla* |
| 2 | **La domanda, come titolo** | **sì** | la stessa chiave che l'elenco dell'area già mostra. Mai un termine tecnico come titolo |
| 3 | **L'immagine mentale concreta** | **sì** | da una a tre frasi, oggetti quotidiani, nessuna parola difficile |
| 4 | **Il nome tecnico** | no | **una sola frase, e solo qui**: «quella differenza si chiama inflazione». Se la pagina non ha bisogno di nominare niente, il blocco non esiste |
| 5 | **L'esempio numerico con il suo paragone** | no | **indivisibile**: la cifra e il paragone si dichiarano insieme o non si dichiara nessuno dei due |
| 6 | **Da dove viene il numero** | **sì, se c'è il 5** | fonte, periodo, e l'avvertenza che non è un pronostico |
| 7 | **Dove porta questa pagina** | no | **al massimo due** rimandi, e solo verso rotte che esistono davvero |
| 8 | **Che cosa questa pagina non fa** | **sì, e non vuoto** | i confini, in rosa, sempre in fondo e sempre nello stesso punto |

### Perché l'ordine è questo, e perché non è negoziabile

- **3 prima di 4** è lo schema fondamentale del progetto — *prima l'immagine
  mentale concreta, poi il nome tecnico, mai il contrario*. Non è una
  raccomandazione di stile: è il modo in cui il componente monta i blocchi, e
  un'istanza non può invertirli perché non sceglie l'ordine.
- **5 contiene 6 e non può esistere senza il paragone.** «Ogni numero ha un
  paragone concreto» smette di essere una regola da ricordare e diventa un
  campo che il compilatore pretende.
- **8 è obbligatorio e non può essere vuoto.** È la difesa strutturale contro
  il rischio vero di questa funzionalità, che non è il consiglio scritto per
  distrazione: è che **un contenitore che permette di scrivere un consiglio,
  prima o poi lo riceve**. Costringere chi scrive a nominare il confine
  *prima* di pubblicare la pagina è più efficace di qualunque revisione a
  valle, perché avviene mentre ha ancora in mente che cosa stava per dire.

### Un concetto per schermata, imposto dalla forma

Il contenuto dichiara **un** `nomeTecnico` e **un** `esempio`, non una lista.
Se una pagina avesse bisogno di tre numeri, sarebbero tre pagine: il tipo non
offre il posto dove metterli. È la traduzione eseguibile di «se servono tre
informazioni, sono tre passaggi, non una tabella con tre colonne».

### Come il contenuto viene dichiarato

Non in JSX. Una struttura dati tipizzata, gemella di `contenutiHome.ts`, che
contiene **solo chiavi**: le parole restano in `src/ui/testi.ts`, che è il
punto unico che il guardrail scandisce. Un'istanza è un oggetto, non un
componente — ed è questo che le impedisce di aggiungere un blocco che il
contenitore non ha.

```ts
// src/ui/contenutiSpiegazione.ts — solo chiavi, nessuna parola
export interface PaginaSpiegazione {
  readonly id: IdSpiegazione;
  readonly area: IdArea;
  /** La stessa chiave che l'elenco dell'area già mostra. Blocco 2. */
  readonly domanda: ChiaveStringaUtente;
  /** Blocco 3. Tupla non vuota: una pagina senza immagine concreta non è
   *  dichiarabile. Da una a tre frasi. */
  readonly immagine: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
  /** Blocco 4. Uno solo, e `null` quando non serve nominare niente. */
  readonly nomeTecnico: ChiaveStringaUtente | null;
  /** Blocchi 5 e 6, insieme o niente. */
  readonly esempio: EsempioNumerico | null;
  /** Blocco 7. Al massimo due, verso percorsi dichiarati in rotte.ts. */
  readonly passi: readonly PassoSuccessivo[];
  /** Blocco 8. Tupla non vuota: il tipo rifiuta una pagina senza confini. */
  readonly nonFa: readonly [ChiaveStringaUtente, ...ChiaveStringaUtente[]];
}

/** Unione discriminata: oggi un solo caso. Chi ne aggiunge uno estende qui e
 *  lo `switch` esaustivo gli impedisce di dimenticare il collegamento. */
export type EsempioNumerico = {
  readonly tipo: 'valore-risparmi';
  /** Argomenti FISSI dell'esempio: nessuno li digita. */
  readonly ingresso: IngressoSimulazioneRisparmio;
  readonly frase: ChiaveStringaUtente;
  /** Accanto al numero, non in fondo alla pagina. Non è opzionale. */
  readonly paragone: ChiaveStringaUtente;
  readonly fonte: ChiaveStringaUtente;
  readonly avvertenza: ChiaveStringaUtente;
};
```

Il numero **non si calcola nel componente**: l'esempio dichiara gli argomenti,
il componente li passa alla funzione del core e stampa la risposta con
`formattaEuro`. Stesso confine che `RisultatoRisparmio.tsx` rispetta già.

### La struttura nasce dal codice che c'è, non accanto

`PaginaValoreRisparmi.tsx` contiene **già** quattro degli otto blocchi —
occhiello, titolo, introduzione, e la sezione `limiti-schermata` con il suo
elenco. Oggi sono lì perché chi l'ha scritta si è ricordato di metterceli. La
`03` li estrae in un componente che **li impone**, invece di lasciarli alla
diligenza di chi scriverà la prossima schermata. Le classi CSS esistenti
(`occhiello`, `limiti`, `limiti-titolo`, `nota-riga`) si riusano: cambiare i
nomi renderebbe le due schermate diverse a schermo senza nessun motivo.

**File previsti, tutti dentro `src/ui/`:** `contenutiSpiegazione.ts` (la
struttura e le istanze), `PaginaSpiegazione.tsx` (il contenitore),
`testiSpiegazione.ts` (le parole, affiancato come `testiSimulazione.ts` per
restare sotto le 150 righe), `stiliSpiegazione.css`, più tre innesti minimi:
`testi.ts` (uno spread in più), `rotte.ts` (la rotta nuova),
`PaginaMacrocategoria.tsx` (la mappa derivata) e `Navigazione.tsx` (il gradino
in più del percorso).

### Il percorso, e il perché di un gradino in più

«Pagina iniziale › Il costo della vita › *la domanda*». Tre gradini: saltare
l'area direbbe una strada che non è quella percorsa. Nessun gradino è
cliccabile, come già stabilito dalla `01`.

**L'ultimo gradino non viene mai troncato con i puntini**, nemmeno quando la
domanda è lunga 103 caratteri come `area2Altra2`: una domanda tagliata a metà è
una domanda diversa, e questo progetto ha un motivo di rifiuto apposta per
l'informazione alterata. Va a capo.

### Stringhe nuove in `src/ui/testi.ts`

Del contenitore, condivise da ogni istanza: `spiegazioneTitoloEsempio`,
`spiegazioneTitoloFonte`, `spiegazioneTitoloPassi`, `spiegazioneTitoloNonFa`,
`spiegazioneEsempioNonDisponibile`.

Dell'istanza di riferimento (`inflazione-spesa`, che risponde a `area1Altra1`):
`spiegazioneInflazioneSpesaImmagine1..3`, `…NomeTecnico`, `…Frase`,
`…Paragone`, `…Fonte`, `…Avvertenza`, `…NonFa1..2`.

L'istanza di riferimento scrive l'immagine mentale del carrello della spesa —
quella che `scrittura-e-accessibilita.md` porta come esempio della forma giusta
— e il paragone su 100 €, che è l'esempio che la stessa regola usa. La
struttura dimostra la propria regola con l'esempio della regola.

### I quattro stati obbligatori

Una schermata che esiste solo nel caso perfetto non è finita.

1. **Vuoto.** Due casi distinti. *Una domanda senza pagina*: resta testo
   nell'elenco dell'area, con la nota `statoPlaceholder` sotto — è già il
   comportamento di oggi e non peggiora. *Una pagina senza esempio*
   (`esempio: null`): i blocchi 5 e 6 **non esistono**, non compaiono vuoti.
   Riservare lo spazio per un numero che non arriverà mai è il contrario
   dell'onestà che il riquadro riservato serve a ottenere altrove.
2. **In caricamento.** Non esiste un'attesa: nessun I/O, nessuna rete, il
   numero è già lì al primo disegno. Lo stato si dichiara e si chiude qui,
   senza rotelline che girano per un istante. Quello che va garantito è che
   l'ordine dei blocchi sia fisso, così niente si sposta fra un disegno e
   l'altro.
3. **Errore.** Se la funzione del core risponde `ok: false`, la pagina stampa
   **la spiegazione senza il numero** e una riga in linguaggio umano al posto
   della cifra — mai un numero sbagliato, mai una pagina bianca. Un `<id>` non
   dichiarato porta alla home, non a una schermata d'errore.
4. **Dati lunghi.** Il caso di prova è dichiarato: la domanda più lunga fra le
   dodici (`area2Altra2`, 103 caratteri) come titolo, tre frasi d'immagine, sei
   voci nel blocco 8 e una cifra a sette cifre nell'esempio. Larghezza di
   lettura al massimo 70 caratteri, il titolo va a capo, niente barra di
   scorrimento orizzontale, niente testo tagliato.

### Accessibilità — i punti che questa struttura decide una volta per tutte

- Navigazione **sempre nella stessa posizione**: `App.tsx` la disegna già fuori
  dal cambio di pagina, quindi non c'è niente da fare — ed è esattamente il
  motivo per cui va lasciata dov'è.
- **Nessuna informazione disponibile solo al passaggio del mouse**: niente
  spiegazioni in tooltip. Se un testo merita di essere letto, sta a schermo.
- I rimandi del blocco 7 sono **blocchi cliccabili per intero**, alti almeno
  44 px, con il testo accanto all'icona e mai un'icona sola.
- Corpo mai sotto i 16 px, interlinea almeno 1,5, contrasto almeno 4,5:1: il
  rosa del blocco 8 è `#FF50A0`, che sta a 6,5:1 ed è riservato ai limiti.
  Nessun testo affidato a una trasparenza bassa.
- Ordine di tabulazione uguale all'ordine di lettura, focus sempre visibile.

## Come si dimostra che ha funzionato

`tests/spiegazione.test.ts` (nuovo), con `renderToStaticMarkup` come già fa
`tests/home.test.ts`: nessuna dipendenza nuova, nessuno snapshot. I casi sono
**strutturali**, cioè valgono per ogni istanza presente e futura, e sono il
vero deliverable di questa funzionalità:

- **Ogni pagina dichiarata risponde a una domanda che la sua area contiene
  davvero**: `AREE[p.area].domande.includes(p.domanda)` per tutte. Una pagina
  che risponde a una domanda che nessuno ha posto è la prima forma di
  scivolamento.
- **Nessuna domanda ha due destinazioni**: la mappa derivata non ha chiavi
  duplicate.
- **Il blocco 8 esiste ed è non vuoto in ogni istanza**, verificato sul markup
  e non solo sul tipo: il tipo protegge chi compila, il markup protegge chi
  legge.
- **Il nome tecnico non compare mai prima dell'immagine concreta**: sul markup
  reso, `indexOf(immagine) < indexOf(nomeTecnico)` per ogni pagina che dichiara
  entrambi. È la regola di scrittura trasformata in un'asserzione.
- **Ogni esempio ha un paragone non vuoto e diverso dalla frase.**
- **Al massimo due passi successivi, e ogni percorso è una costante di
  `rotte.ts`**, mai una stringa scritta a mano: un rimando verso il nulla non
  è dichiarabile.
- **L'esempio di riferimento vale 98,04 €**, con il conto a mano nel commento
  accanto all'asserzione:
  `// 10.000 / 1,02 = 9.803,92 -> 9.804 cent = 98,04 €`
- **`parseRotta('#/spiegazione/inflazione-spesa')`** dà la pagina;
  `'#/spiegazione/non-esiste'` dà la home.
- Ogni stringa nuova passa `verificaTestoUtente`: lo fa già in automatico
  `tests/lessico-ui.test.ts`, che legge `testi.ts` e quindi anche lo spread di
  `testiSpiegazione.ts`.

**In demo, dieci secondi**: dalla home si tocca «Il costo della vita», si tocca
la domanda sulla spesa, e compare la pagina — carrello, poi la parola
«inflazione», poi 98,04 € con accanto il paragone, e in fondo in rosa che cosa
la pagina non fa. Tre tocchi, il massimo che il progetto si concede.

## Cosa questa funzionalità NON fa

- **Non scrive i contenuti delle altre pagine.** Consegna il contenitore e
  **una sola** istanza di riferimento, quella che serve a dimostrare che i
  blocchi si montano. Mutuo (`11`), strumenti per i risparmi (`12`) e le voci
  spiegate delle tre guide-documento (`04`, `05`, `06`) sono specifiche loro,
  branch loro, e testi loro riletti da `guardrail-officer`.
- **Non è la ricerca interna e non ha un campo di domanda libera.** Le domande
  sono un elenco dichiarato: il titolo è una domanda che il sito pone per conto
  della persona, non un posto dove lei ne scrive una. Un campo libero sarebbe
  il quarto motivo di rifiuto di `/spec`.
- **Non prende niente dalla rete**, né i numeri né le fonti. Le fonti si
  scrivono come testo dichiarato, con il periodo, e si aggiornano a mano.
- **Non aggiunge nessuna funzione al core** e non tocca `types/`.
- **Non riscrive le dodici domande della `01`** né le loro chiavi: le usa come
  sono. Cambiarle sposterebbe il contenuto di una funzionalità già chiusa.
- **Non promette che ogni argomento entri in questa forma.** Se un contenuto
  non sta in otto blocchi con un concetto solo, il difetto è del contenuto, non
  del contenitore: va spezzato in due pagine. Questa spec non prevede la
  deroga, e non prevederla è la decisione.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **nessuno**. La pagina non legge `types/contracts.ts`: i contenuti sono redazionali e i tipi della struttura (`PaginaSpiegazione`, `EsempioNumerico`, `PassoSuccessivo`, `IdSpiegazione`) nascono **dentro `src/ui/`**, come `Area` in `contenutiHome.ts`. `IngressoSimulazioneRisparmio` è già esportato da `src/core/index.ts` e viene solo letto |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: **questa funzionalità non scrive in `types/`**, quindi **non richiede l'architetto** |
| **Agente incaricato** | **`03-ui-builder`** (contenitore, istanza di riferimento, stringhe), con **`04-guardrail-officer`** per `tests/spiegazione.test.ts` e la rilettura delle stringhe nuove contro i principi di scrittura, non solo contro il lessico |
| **Directory toccate** | **2 — servono due agenti.** `src/ui/` · `tests/` |
| **Evidenza prodotta per il deck** | `../presentation/screenshots/03-spiegazione-desktop.png` e `03-spiegazione-mobile.png`, catturati con `/evidenza`: la stessa pagina a larghezza proiettore e a larghezza telefono, con in fondo il blocco rosa dei limiti visibile in entrambe |
| **dipende-da** | `01-landing-page` (**fatto**) per le chiavi delle domande e la navigazione · `07-valore-dei-risparmi-nel-tempo` (**fatto**) per `calcolaSimulazioneRisparmio`, che l'esempio numerico riusa senza aggiungere codice al core · **`02-catalogo-domande-reali-per-macrocategoria`**, che è la dipendenza da rispettare: i titoli sono voci di quel catalogo, e dopo la `02` il collegamento «domanda → pagina» si scrive **là**, non in un componente. Nessuna delle tre richiede l'architetto |
| **Riusata da** | `11` (mutuo) e `12` (strumenti per i risparmi) per intero — `11` la dichiara già in `docs/backlog/11-approfondimento-sul-mutuo.md` — e `04`, `05`, `06` per la parte spiegata di ogni voce di documento. **`12` è stata rifiutata da `/spec` il 2026-09-14** e attende una variante conforme: la struttura la aspetta, non la presuppone. Cinque task poggiano su questi otto blocchi: cambiarli dopo costa cinque riscritture |

### L'impronta, in chiaro

| Directory | Che cosa ci finisce |
| --- | --- |
| `src/ui/` | `contenutiSpiegazione.ts`, `PaginaSpiegazione.tsx`, `testiSpiegazione.ts`, `stiliSpiegazione.css` (nuovi) · `testi.ts`, `rotte.ts`, `PaginaMacrocategoria.tsx`, `Navigazione.tsx` (innesti minimi) |
| `tests/` | `tests/spiegazione.test.ts` (nuovo) · `tests/accettazione/03-pagina-di-spiegazione.test.ts`, del `tester` |

**Fuori dall'impronta, e non per caso:** `src/core/` non viene toccata — solo
letta — perché l'istanza di riferimento riusa una funzione già scritta e già
coperta da test. `types/`, `src/guardrails/`, `src/assessment/` e `src/ingest/`
non entrano.

### Conflitti di pianificazione, da sapere prima di `/implementa`

- L'impronta `src/ui/` + `tests/` è **identica a quella della `01`** e
  contenuta in quella della `07`. Entrambe sono chiuse e pubblicate, quindi
  oggi il campo è libero — ma **`03` non può girare in parallelo con nessun
  altro task che tocchi `src/ui/`**, e quasi tutti i task rimasti lo toccano.
- **`03` va prima di `11` e `12`**, che sono sue istanze: farle partire prima
  significherebbe scrivere due volte lo stesso contenitore, in due modi
  diversi, sullo stesso file.
- **`02` (catalogo delle domande) va prima, e non è solo una questione di
  ordine: le due spec risolvono lo stesso problema da due lati opposti.** Il
  punto 3 dell'«Elaborazione» qui sopra deriva la mappa «domanda → dove porta»
  **dalle pagine dichiarate**; la `02` la sposta **dentro il catalogo**, come
  `stato` e `percorso` di ogni voce. Prese entrambe alla lettera darebbero due
  verità sullo stesso fatto, nello stesso file, e divergerebbero al primo task
  che ne aggiorna una sola.

  **Risoluzione, da applicare in `/implementa`: vince il catalogo.** Se `02` è
  già entrata, `03` **non** costruisce nessuna derivazione propria: cambia
  `stato` in `con-schermata` e scrive `percorso` sulla voce della domanda a cui
  la sua istanza di riferimento risponde — una riga in `catalogoDomande.ts` — e
  `PaginaMacrocategoria.tsx` resta come la `02` l'ha lasciata. Il punto 3
  dell'«Elaborazione» resta valido **solo** nel caso in cui `03` venga eseguita
  prima della `02`, che è il caso da evitare.

- **I titoli vengono dal catalogo, non da questa spec.** `03` non scrive
  nessuna domanda nuova: prende una chiave che esiste già. La domanda
  dell'istanza di riferimento — `area1Altra1`, «Con gli stessi soldi della spesa,
  quanto porto a casa rispetto a un anno fa?» — è fra le dodici che la `02`
  dichiara **invariate**, quindi l'ordine `02` → `03` non cambia una virgola del
  contenuto previsto qui. L'unica delle dodici che la `02` riscrive è
  `area2Domanda`, che non è usata da questa spec.

### Da sapere quando si scriveranno le istanze, non da risolvere qui

1. **Il lessico bloccante e la `12`.** Nel lessico il termine `investimento`
   colpisce i **verbi** (`investire`, `compra`, `vendi`), non il sostantivo
   plurale, che passa. Una pagina su quell'argomento è quindi scrivibile, ma
   solo in forma descrittiva. Il documento d'origine, nella sezione 6, contiene
   più frasi che ricadono in `imperativo-scelta` e `dovere-personale`: **vanno
   riformulate da `guardrail-officer` prima di entrare**, non aggirate. Il
   documento stesso, nella sua nota di prudenza, arriva alla stessa conclusione
   per conto suo.
2. **Il periodo del tasso dichiarato è ancora un buco aperto** (`07`,
   `INFLAZIONE_DICHIARATA.periodoDichiarato` è `false`). L'istanza di
   riferimento di questa spec mostra la stessa riga onesta che mostra già la
   schermata dei risparmi. Non è un blocco per `03`: è un blocco per la demo
   con numeri veri, ed è già registrato.
3. **`docs/FUNZIONALITA.md` legge la prima riga `Stato:` del file**, che è
   quella della specifica. È il difetto già annotato nella `01`, divergenza 8:
   vale anche qui, e sta in `scripts/`, fuori da questo perimetro.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

### Cosa farà

«Due righe comprensibili a chi non vede il codice.»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si proverà

«I passi esatti per vederla funzionare, dall'avvio in poi:
 1. `/prepara` (solo la prima volta) · 2. `/avvia` · 3. apri … · 4. ti aspetti …

 Questi passi sono anche i CRITERI DI ACCETTAZIONE: `/implementa` li legge e li
 tratta come parte della richiesta.»

### Limiti previsti

«Cosa non farà, e perché.»

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

*Finché questa sezione non esiste, la funzionalità non è riconciliata e
`/verifica` non la accetta come `implementato`.*

### Cosa fa

«…»

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»
