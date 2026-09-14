# 13 — «Da dove viene questo numero, e quando è stato scritto»

> Stato: **proposta** · 2026-09-14 · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «00-architect», con «01-core-engine» e
> «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 7 «Fonti dati e piano di aggiornamento». Task di backlog: `13`.
>
> **Uno scostamento dal backlog, sull'impronta.** Il task `13` propone
> `directory: src/ui/`, con la nota «impronta PROPOSTA, da confermare sulla
> specifica». **Non si conferma: è sbagliata**, e la sezione «Dove vive il dato,
> e perché non in `src/ui/`» spiega perché in cinque punti. Il dato vive in
> `fixtures/`, la lettura in `src/core/`, e `src/ui/` ne mostra soltanto la
> vista.
>
> **Questa non è una funzionalità in più: è il meccanismo che rende eseguibile
> il vincolo offline.** Ogni numero vivo del sito — tassi, aliquote, soglie —
> dichiarato con la sua fonte autoritativa e la sua cadenza di aggiornamento,
> mai una cifra scritta a mano senza sapere da dove viene o quando andrebbe
> rivista.

## Per chi

**Due persone**, e la funzionalità serve a entrambe con lo stesso file.

La prima è **chi legge un numero sul sito**: vede «2,00%» accanto ai propri
risparmi, o un'aliquota accanto al proprio stipendio, e si pone la domanda più
legittima che esista — *chi lo dice?* È la domanda che una persona con
alfabetizzazione finanziaria bassa ha imparato a non fare, perché nessuno le ha
mai risposto. Il sito promette di far capire **da dove viene ogni numero**:
questa è la schermata in cui quella promessa si verifica o cade.

La seconda è **chi tiene il sito**. Fra sei mesi l'aliquota cambia, e chi deve
aggiornarla deve trovare **un solo posto** in cui è scritta. Se ce ne sono due,
ne aggiorna uno.

## Quando serve

- Per la prima persona: **nel momento in cui un numero non suo compare accanto a
  una cifra sua.** Succede già nella `07` e succederà in `08`, `10` e `11`.
- Per la seconda: **adesso.** L'`08` ha bisogno di aliquote IRPEF e INPS, il
  `10` di tassi mutuo ed Euribor, l'`11` dei tassi medi. Tre task in attesa dello
  stesso dato: se partono prima di questa funzionalità, se lo dichiarano ognuno
  per conto proprio, e da quel momento in poi il sito ha tre verità.

## Cosa deve poter fare dopo

Chi legge sa dire, per ogni numero vivo del sito: **da quale ente viene**, **in
che data è stato scritto lì**, e **ogni quanto la fonte lo aggiorna**. Tre
informazioni, sempre le stesse tre, sempre nello stesso posto.

Chi mantiene il sito ha **una sola riga da cambiare** per aggiornare un dato, e
un test che fallisce se qualcuno ne dichiara un secondo esemplare da un'altra
parte.

Osservabile, e questa è la parte che conta: **nessun numero vivo compare sul
sito senza le sue tre informazioni**, e non perché ce lo siamo ricordati — perché
un test lo verifica.

> **Dichiarazione esplicita, richiesta dal documento d'origine.** Questa tabella
> è **la sorgente unica** da cui il task `08` legge le aliquote IRPEF e INPS e il
> task `10` legge i tassi mutuo e l'Euribor, invece di dichiararsi i numeri per
> conto proprio. Vale anche a ritroso: `src/core/inflazioneDichiarata.ts`, scritto
> per la `07`, smette di tenere il proprio valore e diventa una rilettura del
> registro. È il primo consumatore, e serve da prova che la migrazione funziona
> su qualcosa che è già in piedi e già coperto da test.

## Dove vive il dato, e perché non in `src/ui/`

Il backlog propone `src/ui/`. È la scelta più comoda — il dato si scrive dove si
mostra — ed è quella che rompe il sito in silenzio. Cinque motivi, in ordine di
gravità.

1. **Due copie dello stesso tasso non divergono con un errore: divergono in
   silenzio.** Se il dato vive nel componente, il prossimo simulatore se lo
   riscrive addosso, perché è più rapido che andarlo a cercare. Da quel momento
   due schermate mostrano due numeri diversi per la stessa cosa, e **nessun test
   se ne accorge**: ciascuna copia è coerente con se stessa. Un guasto che i test
   non vedono è il tipo di guasto che questo progetto non può permettersi.
2. **Il verso delle dipendenze sarebbe rovesciato.** `src/ui/` è di
   `03-ui-builder`. I consumatori del dato sono `src/core/` (la `07` e l'`08`) e
   le pagine di contenuto (l'`11`). Un dato condiviso che vive nella directory di
   *uno* dei consumatori costringe gli altri a uscire dal proprio perimetro per
   leggerlo — e la regola del progetto dice che in quel caso ci si ferma e si
   segnala. Il risultato pratico non è che qualcuno si ferma: è che il dato
   viene copiato.
3. **`fixtures/` è già, per definizione, questo.** `app/CLAUDE.md` la descrive
   come «la verità di riferimento dei test», e un tasso con la sua fonte è
   esattamente un dato di riferimento. Non stiamo inventando una convenzione
   nuova: stiamo mettendo il dato dove la convenzione dice già che vada.
4. **`fixtures/` è già scandita dal guardrail.** `tests/lessico-ui.test.ts`
   legge `fixtures/*.json` e fa fallire la build su una formulazione
   prescrittiva. Le parole che accompagnano il dato — che cos'è, come si chiama
   la fonte — finiscono quindi sotto il lessico **senza aggiungere niente**. Un
   file nuovo in `src/core/` non lo sarebbe allo stesso modo.
5. **Il core resta puro, e la separazione è già stata scelta una volta.**
   `src/core/inflazioneDichiarata.ts` la dichiara in testa: «qui vive il dato; le
   parole che descrivono la provenienza vivono in `src/ui/testi.ts`. Il core dice
   SE la provenienza è completa, la schermata dice COM'È SCRITTA.» Questa
   funzionalità **generalizza quella scelta, non la inventa**.

### I tre livelli, e chi scrive dove

| Livello | File | Agente |
| --- | --- | --- |
| **Il dato e la sua provenienza** | `fixtures/fonti-dati.json` | `00-architect` |
| **La lettura tipizzata e le funzioni pure** | `src/core/fontiDichiarate.ts` | `01-core-engine` |
| **La vista, il semaforo e le parole** | `src/ui/PaginaFonti.tsx`, `src/ui/testiFonti.ts` | `03-ui-builder` |

Un `import` di JSON **non è I/O a runtime**: Vite lo incorpora nel bundle in
fase di build, quindi non parte nessuna richiesta e il core resta puro.
`resolveJsonModule` è già attivo in `tsconfig.json`, e il precedente esiste:
`tests/core.test.ts` importa le fixture con `with { type: 'json' }`. Questa
funzionalità non introduce né rete né I/O: continua a non averne.

## Input

Le **sei righe** della sezione 7 del documento d'origine, nessuna in più e
nessuna in meno, perché sono i sei dati vivi che il sito ha dichiarato di usare.

| id | Dato | Fonte autoritativa | Cadenza | Usato in |
| --- | --- | --- | --- | --- |
| `inflazione-nic` | Inflazione, indice NIC | ISTAT | mensile | `07` |
| `aliquote-irpef` | Aliquote IRPEF e soglie degli scaglioni | Agenzia delle Entrate / Legge di Bilancio (Gazzetta Ufficiale) | annuale | `08` |
| `aliquote-inps` | Aliquote contributive INPS: dipendenti, Gestione Separata, forfettari | INPS, circolari sulle aliquote | annuale | `08` |
| `tassi-mutuo` | TAN e TAEG medi, fisso e variabile | Banca d'Italia / ABI, osservatori di settore | mensile | `10`, `11` |
| `euribor-storico` | Euribor storico, per l'intervallo del tasso che si muove | EMMI — European Money Markets Institute | mensile | `10` |
| `contenuti-educativi` | Contenuti di riferimento sugli strumenti finanziari | Banca d'Italia «L'economia per tutti», CONSOB, COVIP | semestrale (verifica) | `12` |

**Da dove arrivano i valori: a mano, da una persona, con il documento della
fonte davanti.** Non dalla rete, né a runtime né in fase di build.

> ### Il blocco, che qui non è un dettaglio ma la funzionalità stessa
>
> **Nessuna delle sei righe ha oggi un valore verificato.** Il registro nasce
> con `provenienzaVerificata: false` su tutte e sei, e questo non è uno stato
> transitorio da nascondere: è lo stato vero del progetto, e la schermata lo
> mostra. Perché un numero appaia servono tre cose che soltanto una persona può
> portare: il valore, **il documento da cui viene**, e **la data in cui l'ha
> scritto qui**.
>
> Il caso dell'inflazione è già documentato in
> `src/core/inflazioneDichiarata.ts`: i 200 punti base che il sito usa oggi sono
> «una decisione di progetto, non quella media». La stessa frase vale per le
> altre cinque righe.
>
> **L'architettura è studiata perché il blocco non fermi niente**: il codice, i
> test e la schermata si scrivono e passano con le righe vuote, perché lo stato
> «fonte non ancora dichiarata» è uno dei quattro stati previsti e non un errore.

### La forma di una riga

```ts
export type Cadenza = 'mensile' | 'semestrale' | 'annuale';

/** Un numero dichiarato dentro una riga. Una riga può averne più di uno:
 *  le aliquote IRPEF sono tre percentuali e due soglie. */
export type QuantitaDichiarata =
  | { readonly nome: string; readonly unita: 'bp'; readonly valoreBp: number }
  | { readonly nome: string; readonly unita: 'cent'; readonly valoreCent: number };

export interface FonteDato {
  readonly id: string;
  /** Che cos'è, in una riga. Non il nome tecnico: la cosa. */
  readonly dato: string;
  /** L'ente, per nome. Mai un indirizzo di rete come unica indicazione. */
  readonly fonte: string;
  /** Ogni quanto LA FONTE pubblica. Non ogni quanto il sito si aggiorna. */
  readonly cadenza: Cadenza;
  /** ISO 8601. La data in cui il valore è stato scritto QUI, a mano. */
  readonly scrittoIl: string | null;
  readonly quantita: readonly QuantitaDichiarata[];
  /** Vero solo se una persona ha recuperato il valore dalla fonte. */
  readonly provenienzaVerificata: boolean;
  /** In quali schermate del sito compare. */
  readonly usatoIn: readonly string[];
}

export interface RegistroFonti {
  readonly righe: readonly FonteDato[];
}
```

`cadenza` distingue due cose che vengono sempre confuse: **ogni quanto la fonte
pubblica** e **ogni quanto noi abbiamo guardato**. La prima è `cadenza`, la
seconda è `scrittoIl`. Tenerle separate è ciò che permette alla schermata di
dire «la fonte lo aggiorna ogni mese, noi l'abbiamo scritto cinque mesi fa»,
che è un'informazione, invece di «aggiornato mensilmente», che è una
rassicurazione.

## Elaborazione

Tutto in `src/core/fontiDichiarate.ts`, puro e deterministico: **nessun I/O,
nessun `Date.now()`, nessun `Math.random()`.**

1. **Lettura e restringimento.** `leggiRegistro(json: unknown): Esito<RegistroFonti>`.
   Il JSON importato non è un `RegistroFonti`: `cadenza` arriva come `string`, e
   il file può avere chiavi in più (il `_nota` che le fixture usano già). Si
   entra da `unknown` e si restringe — mai `any`, mai `@ts-ignore` — e il ramo
   `false` dell'`Esito` è il posto in cui vive un registro scritto male.
2. **Completezza di una riga.** `rigaCompleta(riga): boolean`: `dato`, `fonte` e
   `cadenza` non vuoti; e **se c'è almeno una quantità, allora `scrittoIl` deve
   esserci**. Un numero senza la data in cui è stato scritto è il difetto che
   questa funzionalità esiste per impedire.
3. **Quando un numero si può mostrare.**

   ```
   mostrabileComeNumero(riga) =
       riga.quantita.length > 0
       && riga.provenienzaVerificata
       && riga.scrittoIl !== null
   ```

   Le tre condizioni sono in `&&`: un valore c'è, una persona l'ha verificato,
   e la data esiste. Basta che una manchi e il numero **non compare**.
4. **Una quantità per nome.** `quantitaDi(riga, nome): Esito<QuantitaDichiarata>`,
   ramo `false` con `errore: 'quantita-non-dichiarata'`. La ricerca per nome è
   una stringa, quindi un nome sbagliato è possibile: per questo è un `Esito` e
   non un valore che può risultare `undefined` senza che nessuno se ne accorga.
5. **Quanti mesi pieni sono passati.** `mesiPieni(scrittoIl, oggi): number`,
   **pura, con la data di oggi come parametro**. Il core non chiama
   `Date.now()`: la data di oggi entra da `src/ui/`, che è il solo posto in cui
   il presente esiste. Senza questo accorgimento la funzione non sarebbe
   testabile con un valore atteso fisso, e la regola del progetto lo vieta.

   ```
   mesi  = (annoOggi - annoScritto) × 12 + (meseOggi - meseScritto)
   pieni = giornoOggi < giornoScritto ? mesi - 1 : mesi
   ```

6. **Il semaforo della freschezza.** `statoFreschezza(riga, oggi)`:

   ```
   se non mostrabileComeNumero(riga)          -> 'fonte-non-dichiarata'
   mesiDiCadenza = { mensile: 1, semestrale: 6, annuale: 12 }[riga.cadenza]
   se mesiPieni(riga.scrittoIl, oggi) < mesiDiCadenza -> 'scritta-di-recente'
   altrimenti                                          -> 'da-rivedere'
   ```

7. **Il controllo incrociato, che è del test e non della schermata.**
   `idSenzaRiga(registro, idUsati): readonly string[]` — dati che il sito
   dichiara di usare e che nel registro non ci sono. È la funzione su cui poggia
   il test che rende il vincolo eseguibile.

### Verifica a mano, da riportare nel commento del test

Con `oggi = '2026-09-14'`:

```
CASO A — inflazione, cadenza mensile, scritta il 2026-03-31
mesi di calendario = (2026-2026)×12 + (9-3)              = 6
giorno 14 < giorno 31                                    -> 6 - 1 = 5 mesi pieni
controllo: 31 marzo + 5 mesi = 31 agosto <= 14 settembre  ✓
           31 marzo + 6 mesi = 30 settembre > 14 settembre ✓
cadenza mensile = 1 mese; 5 >= 1                         -> 'da-rivedere'

CASO B — aliquote IRPEF, cadenza annuale, scritte il 2026-01-15
mesi di calendario = (9-1)                               = 8
giorno 14 < giorno 15                                    -> 8 - 1 = 7 mesi pieni
controllo: 15 gennaio + 7 mesi = 15 agosto <= 14 settembre ✓
cadenza annuale = 12 mesi; 7 < 12                        -> 'scritta-di-recente'

CASO C — tassi mutuo, provenienzaVerificata: false, con un valore presente
mostrabileComeNumero = false                             -> 'fonte-non-dichiarata'
il numero NON compare, anche se nel file c'è.
```

Il caso C è il più importante dei tre: è la prova che il valore presente nel
file **non basta** a farlo apparire a schermo.

> **Nota sull'aritmetica.** Nessun numero a virgola mobile: solo somme e
> sottrazioni fra interi ricavati dalla data in formato ISO, che si legge con
> `slice` e non con un parser di date. Le date non diventano mai un oggetto
> `Date`: `new Date('2026-03-31')` dipende dal fuso orario della macchina, ed è
> lo stesso genere di dipendenza dall'ambiente per cui il progetto ha già
> escluso `Intl`.

### I motivi di rifiuto, come codici

`registro-non-leggibile` · `riga-senza-fonte` · `riga-senza-cadenza` ·
`cadenza-non-riconosciuta` · `valore-senza-data` · `data-non-iso` ·
`quantita-non-dichiarata` · `id-duplicato`

`id-duplicato` non è pedanteria: due righe con lo stesso `id` sono esattamente
le due copie divergenti che questa funzionalità esiste per impedire, e
l'unico posto in cui possono ancora nascere è il file stesso.

## Output

### La schermata «Da dove vengono i numeri di questo sito»

Una riga per dato, e per ogni riga sette informazioni:

| Colonna | Contenuto |
| --- | --- |
| **Che cos'è** | in parole di tutti i giorni: «di quanto salgono i prezzi in un anno», non «indice NIC» — il nome tecnico arriva dopo |
| **Il valore** | solo se è mostrabile. Altrimenti la frase che dice che la fonte non è ancora stata dichiarata |
| **Che cosa vuol dire** | il paragone concreto, una riga: «2,00% all'anno: su 100 € di spesa, 2 € in più l'anno dopo». **Ogni numero ha accanto il suo paragone**, anche qui |
| **Chi lo dice** | l'ente, per nome |
| **Scritto il** | la data in cui il valore è entrato nel sito |
| **Ogni quanto la fonte lo aggiorna** | mensile, semestrale, annuale |
| **Dove si vede nel sito** | le schermate in cui compare, come collegamenti |

Più il **semaforo**, con **l'etichetta scritta accanto**: verde «scritta di
recente», giallo «da rivedere», **rosa «fonte non ancora dichiarata»**.

Tre note sul semaforo, tutte vincolanti:

- **Il colore non porta mai il significato da solo.** L'etichetta è sempre
  scritta: al proiettore, in bianco e nero, e per chi non distingue i colori il
  pallino colorato non esiste.
- **Il rosa è al suo posto.** La regola di design lo riserva ai limiti e alle
  esclusioni, e un dato di cui non conosciamo la fonte **è** un limite
  dichiarato del prodotto — non un errore di chi legge. `src/ui/NotaTasso.tsx`
  lo fa già così per l'inflazione: questa schermata estende quella scelta.
- **Verde e giallo non sono nell'identità del progetto.** Li stabilisce
  `03-ui-builder` dentro le regole di design: contrasto minimo 4,5:1 sul fondo
  `#050008`, mai una trasparenza bassa al posto di un colore più scuro.

### Il riquadro «da dove viene questo numero», su ogni schermata che ne usa uno

Il componente unico. `src/ui/NotaTasso.tsx`, scritto per la `07`, è già questo
in embrione: **diventa il componente generale**, prende l'`id` della riga invece
della costante dell'inflazione, e viene riusato da `08`, `10` e `11`. Sta sotto
il risultato, sempre nello stesso punto, a corpo pieno: non è una nota a piè di
pagina, non è in grigio slavato, non compare al passaggio del mouse.

**Rotta nuova in `src/ui/rotte.ts`**: `#/da-dove-vengono-i-numeri`, via hash
come tutto il resto. Il collegamento sta **nel piè di pagina di ogni pagina,
sempre nella stessa posizione**, accanto alla nota che dice che il sito è stato
generato con l'aiuto dell'intelligenza artificiale e può contenere errori. Le
due frasi stanno bene insieme: dicono la stessa cosa, una sul metodo e una sui
dati.

**Stringhe nuove in `src/ui/testiFonti.ts`**, incorporato in `STRINGHE_UTENTE`
con lo spread. Chiavi: `fontiOcchiello`, `fontiTitolo`, `fontiIntro`,
`fontiIntestazioneDato`, `fontiIntestazioneValore`,
`fontiIntestazioneSignificato`, `fontiIntestazioneEnte`,
`fontiIntestazioneScrittoIl`, `fontiIntestazioneCadenza`,
`fontiIntestazioneDoveSiVede`, `fontiStatoRecente`, `fontiStatoDaRivedere`,
`fontiStatoNonDichiarata`, `fontiVuoto`, `fontiRigaIncompleta`,
`fontiCadenzaMensile`, `fontiCadenzaSemestrale`, `fontiCadenzaAnnuale`, e una
chiave di significato per riga — `fontiSignificatoInflazioneNic`,
`fontiSignificatoAliquoteIrpef`, `fontiSignificatoAliquoteInps`,
`fontiSignificatoTassiMutuo`, `fontiSignificatoEuriborStorico`,
`fontiSignificatoContenutiEducativi`.

I numeri **non sono scritti a mano in nessuna di queste stringhe**: entrano dai
segnaposto `{...}` che `<Testo>` sostituisce con i valori che arrivano dal core.
Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre tabulari,
numeri allineati a destra, unità accanto al valore.

### I quattro stati obbligatori

1. **Vuoto** — ed è **lo stato vero di oggi**: nessuna delle sei righe ha la
   provenienza verificata. La schermata dice, riga per riga, **quale dato manca,
   da quale ente deve venire e che cosa serve per dichiararlo** — non «nessun
   risultato», che è una porta chiusa. È lo stato più importante dei quattro,
   perché è quello che la giuria vedrà.
2. **In caricamento** — lettura locale e immediata: lo spazio della tabella è
   già occupato, il piè di pagina non si sposta quando le righe arrivano.
3. **Errore** — una riga incompleta o un registro illeggibile **non si
   nascondono**: la riga compare con scritto che cosa le manca, in linguaggio
   umano — «Di questo numero non sappiamo ancora da dove viene» — e il resto
   della tabella resta leggibile. Un registro rotto non deve rompere la pagina:
   è la pagina che serve proprio a dire che qualcosa non torna.
4. **Dati lunghi o numerosi** — venti righe invece di sei; nomi di fonte lunghi
   («Agenzia delle Entrate / Legge di Bilancio, Gazzetta Ufficiale»); soglie a
   sette cifre. **Sotto i 768 px la tabella diventa una pila di riquadri**,
   perché sette colonne a 375 px non si leggono: ogni riquadro è un dato, con le
   sette informazioni una sotto l'altra e l'etichetta accanto a ciascuna. Niente
   scorrimento orizzontale, niente testo tagliato.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/fontiDichiarate.test.ts`, con i valori
  calcolati a mano qui sopra nel commento accanto all'asserzione: `mesiPieni`
  sui casi A e B (5 e 7 mesi pieni), `statoFreschezza` nei tre esiti, il caso C
  — **valore presente e `provenienzaVerificata: false` ⇒ il numero non si
  mostra** — e il ramo `false` di `leggiRegistro` su un registro con una cadenza
  non riconosciuta e su una riga con un valore senza data.
- **Il test che rende il vincolo eseguibile** — `tests/fonti-dati.test.ts`, il
  pezzo per cui questa funzionalità esiste:
  1. ogni riga ha `dato`, `fonte` e `cadenza` non vuoti;
  2. ogni riga con almeno una quantità ha `scrittoIl` in formato ISO
     `AAAA-MM-GG`;
  3. **le sei righe della sezione 7 esistono**, per `id`: se qualcuno ne toglie
     una, il test lo dice;
  4. **nessun `id` compare due volte**;
  5. **nessun dato vivo è dichiarato due volte nel codice**:
     `src/core/inflazioneDichiarata.ts` non contiene più un valore proprio ma
     rilegge il registro. L'asserzione è sull'assenza del letterale, e vale in
     avanti per ogni modulo di provenienza che nascerà — quello dell'`08`, quello
     del `10`;
  6. ogni valore in `usatoIn` corrisponde a una schermata che esiste.
- **Test di accettazione** — `tests/accettazione/13-fonti-dati.test.ts`, scritto
  dal `tester` dalla specifica, non dal codice.
- **In demo, dieci secondi**: si apre la schermata dal piè di pagina. Si legge la
  riga dell'inflazione — «di quanto salgono i prezzi in un anno · 2,00% · su
  100 € di spesa, 2 € in più l'anno dopo · ISTAT · scritto il 31 marzo 2026 · la
  fonte lo aggiorna ogni mese · si vede nella schermata dei risparmi fermi» — e
  poi la riga dei tassi mutuo, che dice a chiare lettere, in rosa, che la fonte
  non è ancora stata dichiarata. **La seconda riga vale più della prima**: il
  sito dichiara ciò che non sa, ed è una cosa che si vede in cinque secondi.

## Cosa questa funzionalità NON fa

- **Non aggiorna niente da sé.** Nessuna chiamata, né a runtime né in fase di
  build: il valore entra a mano, con la data di quando è entrato. Un
  aggiornamento automatico sarebbe una chiamata esterna, che il prodotto non
  fa — ed è il vincolo che questa funzionalità serve a rendere verificabile, non
  un'eccezione che si concede.
- **Non promette che i numeri siano aggiornati.** Dichiara **quando sono stati
  scritti** e **ogni quanto la fonte pubblica**: due fatti, dai quali chi legge
  ricava da sé se fidarsi. «Dati aggiornati» è una rassicurazione; «scritto il 31
  marzo, la fonte lo aggiorna ogni mese» è un'informazione.
- **Non nasconde le righe incomplete.** La tentazione è mostrare solo ciò che è
  verificato, così la schermata fa bella figura: ma allora mente per omissione, e
  la riga che manca è esattamente quella che serve a chi legge. Una schermata
  delle fonti che elenca solo le fonti che abbiamo non è una schermata delle
  fonti.
- **Non inventa i valori.** Nessuna delle sei righe nasce con un numero
  verificato, e il numero non compare finché una persona non lo recupera e non
  scrive la data. **Non è un difetto della funzionalità: è la funzionalità.**
- **Non è un cruscotto di dati di mercato.** Nessuna serie storica, nessun
  grafico, nessun andamento: una riga per dato, il valore corrente dichiarato, e
  nulla più. Un grafico storico invita a estrapolare, e un'estrapolazione è una
  previsione.
- **Non dice che cosa fare con i numeri che elenca.** Elenca provenienze.
- **Non spiega i concetti.** «Che cos'è» è una riga, non una lezione: per
  l'inflazione c'è la schermata della `07`, e da qui si arriva lì. Questa pagina
  non diventa un glossario, che il progetto ha deciso di non avere.
- **Non sostituisce la fonte e non la riproduce.** Non copia tabelle, testi o
  pagine degli enti: ne scrive il nome. Copiare una tabella dell'Agenzia delle
  Entrate significherebbe averne una seconda copia da tenere aggiornata, cioè il
  problema da cui siamo partiti.
- **Non affida il riferimento a un collegamento.** Ente, documento e data sono
  scritti in chiaro, così valgono anche con il Wi-Fi spento e anche stampati. Se
  un collegamento c'è, **non è mai l'unico modo** per sapere da dove viene il
  dato.
- **Non conserva niente e non chiede niente.** È una pagina di sola lettura:
  nessun campo, nessun dato personale, niente nell'indirizzo.
- **Non genera il file.** Non esiste uno script che scriva `fonti-dati.json`: lo
  scrive una persona. Uno script che lo generasse avrebbe bisogno di una fonte
  da cui leggere, e siamo di nuovo alla rete.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **`Cadenza`, `QuantitaDichiarata`, `FonteDato`, `RegistroFonti`: quattro tipi nuovi in `types/contracts.ts`.** È l'unica delle tre funzionalità che tocca i contratti, e lo fa per il motivo per cui i contratti esistono: la forma di una riga è condivisa fra `fixtures/` (chi scrive il dato), `src/core/` (chi lo legge), `src/ui/` (chi lo mostra) e i consumatori `07`, `08`, `10`, `11`. Un tipo condiviso da quattro directory non può vivere dentro una di esse. È un'**estensione**: quattro tipi nuovi in fondo al file, **nessuna riga esistente riscritta**. **La modifica di `types/contracts.ts` è dell'architetto**, non dell'agente incaricato: qui i due coincidono, ma la regola resta — `01-core-engine` e `03-ui-builder` non scrivono in `types/` nemmeno quando nessun hook li fermerebbe. *Alternativa scartata, e va detto perché*: dichiarare la forma in `src/core/fontiDichiarate.ts`. Allora il file del dato in `fixtures/`, che è dell'architetto, avrebbe la propria forma definita nella directory di un altro agente, e il verso della dipendenza sarebbe rovesciato |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root, quindi i contratti si possono ancora estendere e questa funzionalità può procedere. **Se esistesse, questa spec richiederebbe l'architetto prima di partire** e l'hook `PreToolUse` fermerebbe la scrittura: è il caso in cui la deroga si chiede, si annota in `docs/decisioni.md` e si ricongela — non si aggira |
| **Agente incaricato** | **`00-architect`** — il registro in `fixtures/fonti-dati.json` e i quattro tipi: è il dato condiviso, ed è suo per perimetro. Con **`01-core-engine`** per il lettore puro e le sei funzioni della sezione «Elaborazione», e **`03-ui-builder`** per la schermata, il semaforo, il componente unico «da dove viene questo numero» e tutte le parole |
| **Directory toccate** | **5 — è l'impronta più larga delle tre, e la ragione è strutturale: una sorgente unica attraversa per definizione tutti i livelli.** `types/` (`contracts.ts`, solo aggiunte), `fixtures/` (`fonti-dati.json`, nuovo), `src/core/` (`fontiDichiarate.ts`, `inflazioneDichiarata.ts` che diventa una rilettura, `__tests__/fontiDichiarate.test.ts`, `index.ts`), `src/ui/` (`PaginaFonti.tsx`, `NotaTasso.tsx` generalizzato, `testiFonti.ts`, `testi.ts`, rotta in `rotte.ts`, piè di pagina, foglio di stile), `tests/` (`fonti-dati.test.ts`, `accettazione/13-fonti-dati.test.ts`). `src/guardrails/` e `src/assessment/` non si toccano |
| **dipende-da** | **Niente.** Questa funzionalità non dipende da nessun'altra, ed è il motivo per cui va fatta presto. Al contrario: **`08` e `10` dipendono da lei** — devono leggere aliquote, tassi ed Euribor da qui invece di dichiararseli per conto proprio — e **`11` dipende da lei per i propri numeri**. La `07` è già in piedi e diventa il primo consumatore da riportare al registro: è la prova che la migrazione funziona su codice già coperto da test |
| **Evidenza prodotta per il deck** | `../presentation/evidence/13-fonti-dati.json` — il registro serializzato con lo stato di ciascuna riga (verificata / non ancora), prodotto da **`06-evidence-collector`**, che lancia dalla root: `presentation/evidence/` è il suo perimetro e va chiesto, non scritto di straforo. Entra in `Evidence.extra`, che **esiste già** in `types/contracts.ts`: nessun campo nuovo. Più lo screenshot `../presentation/screenshots/13-da-dove-vengono-i-numeri.png`, con la riga verde e la riga rosa nella stessa inquadratura. La slide che ne esce è quella dei limiti dichiarati, e l'argomento è questo: **un progetto che sa elencare i numeri di cui non conosce ancora la fonte è più verificabile di uno che non ha l'elenco** |

### Pianificazione, da sapere prima di `/implementa`

Ordine **dentro** il task, non negoziabile: `types/` e `fixtures/`
(`00-architect`) → `src/core/` (`01-core-engine`) → `src/ui/`
(`03-ui-builder`). I tre livelli non possono procedere in parallelo, perché
ciascuno legge la forma definita dal precedente.

Impronta a cinque directory: **questo task non può girare in parallelo con
nessun altro task aperto** — `04`, `08`, `10`, `11` e `12` toccano tutti almeno
una delle cinque. È un buon argomento per farlo **adesso**, quando le altre tre
non sono ancora partite, invece di infilarlo fra due funzionalità: più tardi
arriva, più numeri scritti a mano dovrà andare a recuperare.

`fixtures/fonti-dati.json` sarà scritto anche dall'`11` (righe nuove sui tassi
mutuo e sulle soglie): **le due scritture non possono avvenire insieme**. Prima
questa definisce forma e sei righe, poi l'`11` aggiunge le sue.

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
