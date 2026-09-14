# Decisioni

> Ogni scelta ambigua risolta al più semplice, annotata qui con il motivo.
> Il criterio costante: **ridurre il rischio di integrazione**, mai
> massimizzare l'eleganza. Serve anche dopo l'hackathon: chi arriva dopo
> legge qui perché le cose stanno così.

---

## T+0:15 — impalcatura

### D01 · Root: cosa conta come «quattro elementi»

**Scelta.** Nella root ci sono i quattro elementi valutati (`app/`, `agents/`,
`presentation/`, `README.md`) più l'infrastruttura di Claude Code: `CLAUDE.md`
e `.claude/`. Nessun `package.json` nella root, nessuna cartella `scripts/`,
`docs/`, `tools/`.

**Perché.** Il vincolo vieta **cartelle di progetto** nuove nella root.
`CLAUDE.md` deve stare lì per essere caricato da Claude Code, e il brief
stesso lo cita come componente del substrato. Spostarlo altrove lo renderebbe
non funzionante — cioè romperebbe la cosa che deve dimostrare.

### D02 · Script npm in `app/package.json`, invocati con `--prefix`

**Scelta.** Tutti gli script vivono in `app/package.json`. Dalla root si
lanciano con `npm --prefix app run <script>`. Gli script che scrivono fuori da
`app/` (deck, trace, evolution) risolvono i percorsi rispetto al **file dello
script**, non alla working directory.

**Perché.** Un `package.json` nella root sarebbe un quinto elemento e un
secondo `node_modules` da installare. Il `--prefix` costa sei caratteri.

### D03 · Importi in centesimi, percentuali in punti base

**Scelta.** Interi ovunque nel dominio. Nessun float.

**Perché.** Su costi e commissioni l'errore di arrotondamento è il bug che
nessuno vede in demo e che un giurato trova in dieci secondi guardando il
documento originale. I pesi in punti base sommano esattamente a 10000, ed è un
test.

### D04 · Formattazione italiana scritta a mano, non `Intl`

**Scelta.** `app/src/core/formatoIt.ts` implementa `1.234,56` e `5,90%` con
manipolazione di stringhe.

**Perché.** `Intl.NumberFormat` dipende dai dati di locale presenti sulla
macchina: su un runtime con ICU ridotto il risultato cambia. Deve essere
identico ovunque, anche offline, anche sul portatile che proietta.

### D05 · Tutto il testo utente in un registro unico

**Scelta.** `app/src/ui/testi.ts` contiene ogni parola che l'utente
legge. I componenti non contengono testo letterale e stampano via `<Testo>`.

**Perché.** Dà al guardrail **un punto unico da scandire**. Testo sparso in
venti file non è controllabile, e rende la demo di slide 6 fragile. Effetto
collaterale utile: rompere la build di proposito è una riga.

### D06 · Il guardrail gira in tre punti

**Scelta.** Test, hook `PostToolUse`, e a runtime nel componente `<Testo>`.

**Perché.** I test coprono ciò che esiste al momento del commit; l'hook copre
il momento della scrittura; il runtime copre il caso in cui qualcosa sfugga a
entrambi — e lo rende **visibile** invece che silenzioso.

### D07 · Fixture: estratto conto trimestrale

**Scelta.** La fixture d'esempio è un estratto conto con canoni, commissioni,
imposta di bollo e competenze a debito. Contiene i formati richiesti
(`1.234,56`, `5,90%`).

**Perché.** L'idea non è congelata: serviva **uno** scenario concreto per far
partire core e UI in parallelo. L'estratto conto è quello con più voci
eterogenee, quindi il più severo per i contratti. Se i contratti reggono
questo, reggono anche bolletta, budget e simulazione.
Una voce (`voce-07`, competenze a debito) è deliberatamente **non
classificabile** dai dati presenti: serve a verificare che il sistema dichiari
ciò che non sa invece di assorbirlo in «altro».

### D08 · `#A100FF` non si usa per il testo

**Scelta.** Su fondo `#050008` il viola dell'evento ha contrasto **3,2:1**,
sotto la soglia di 4.5:1. Per il testo si usano `#FFFFFF` (20,4:1),
`#BE82FF` (7,0:1) e `#FF50A0` (6,5:1); `#A100FF` resta per bordi e fondi, con
testo bianco sopra (6,3:1). Corpo a 18px invece dei 16 minimi.

**Perché.** Il vincolo di contrasto è esplicito e l'interfaccia va proiettata.
Annotato in testa a `app/src/ui/styles.css` così non si perde.

### D09 · Hook scritti in Node, non in shell

**Scelta.** `.claude/hooks/*.mjs`, invocati con `node`.

**Perché.** La squadra lavora su Windows; uno script `.sh` richiederebbe una
shell POSIX e uno `.ps1` non girerebbe altrove. Node c'è già come dipendenza
del progetto. Entrambi escono con `0` su qualunque errore proprio.

### D10 · Un symlink per file in `.claude/agents/`, con fallback a copia

**Scelta.** `npm --prefix app run agents:sync` crea un symlink per ciascuna
delle nove definizioni; se i symlink non sono disponibili (Windows senza
Developer Mode) **copia** i file e lo dichiara a video.

**Perché.** Il symlink della cartella intera farebbe leggere a Claude Code
anche `README.md` e `trace.md` come agenti, e non hanno frontmatter valido.
La fonte di verità resta `agents/`, che è la cartella valutata.

### D11 · Git inizializzato subito

**Scelta.** `git init` a T+0:15, commit alla fine di ogni blocco.

**Perché.** `agents:trace` e `evolution:proof` leggono la cronologia: sono
l'evidenza primaria del progetto. Senza commit dall'inizio, la traccia
sarebbe ricostruita a posteriori — cioè esattamente ciò che non deve essere.
Entrambi gli script funzionano comunque su repo vuoto, senza fallire.

### D12 · `build-deck.ts` eseguito con il type stripping di Node

**Scelta.** `npm run deck` lancia `node ../presentation/build-deck.ts`.
Esiste `deck:compat` che compila prima con `tsc`, come riserva.

**Perché.** Il brief impone il file in TypeScript, e le dipendenze consentite
non includono un runner TS. Node ≥ 22.6 rimuove i tipi da solo (qui: v24). La
riserva copre la macchina dell'altro membro del team se avesse Node più
vecchio.

### D13 · `app/src/ingest/` creata e lasciata vuota

**Scelta.** Directory presente con un `.gitkeep` che spiega perché è vuota.
Agente `02-data-ingest` scritto per intero e marcato **NON ATTIVATO**.

**Perché.** Il perimetro è già assegnato: se l'ingest venisse attivato,
nessun altro agente deve averne nel frattempo occupato lo spazio. E la
decisione deve **leggersi** come decisione di scope, non come dimenticanza.

---

## T+0:15 — piattaforma per il product developer *(addendum)*

### D14 · Le skill non partono da sole

**Scelta.** Tutte e cinque hanno `disable-model-invocation: true`.

**Perché.** Sono **verbi che l'umano digita**. Una skill che parte da sola
mentre il modello sta facendo altro salta il cancello d'ingresso (`/spec`) o
quello d'uscita (`/verifica`), che è esattamente ciò che devono impedire.

### D15 · `/spec` è l'unica skill che può rifiutare

**Scelta.** Il controllo di conformità sta all'ingresso, non all'uscita, e il
rifiuto propone **sempre** la variante conforme più vicina.

**Perché.** Rifiutare a valle significa buttare via lavoro già fatto: su
quattro ore non è recuperabile. E un «no» senza alternativa fa perdere tempo
due volte, perché la richiesta torna riformulata a caso.

### D16 · `/implementa` non aggira l'hook sui contratti

**Scelta.** Se servono modifiche a `app/types/` e `.contracts-frozen` esiste,
la skill **si ferma** e rimanda all'architetto, mostrando il messaggio
dell'hook.

**Perché.** Una skill che disattiva un vincolo lo rende decorativo. Il punto
del congelamento è che la deroga sia una decisione esplicita di squadra,
annotata qui.

### D17 · `/verifica` ha esito binario

**Scelta.** Passa o non passa, con la **riga esatta** che ha fallito. Nessun
esito «con avvertenze».

**Perché.** Un cancello d'uscita con tre livelli di gravità diventa, sotto
pressione di tempo, un cancello sempre aperto.

### D18 · `app/docs/features/TEMPLATE.md` duplica `spec/template.md`

**Scelta.** Lo stesso modulo esiste in due posti; `/spec` allinea il secondo
quando cambia il primo.

**Perché.** Il product developer deve poter leggere il modulo senza aprire
`.claude/`, che per lui non esiste. La duplicazione è consapevole: costa un
file, evita di esporre l'infrastruttura a chi non deve toccarla.

---

## Momenti di verifica programmati

| Quando | Cosa | Chi |
| --- | --- | --- |
| T+1:40 | Congelamento contratti: `echo "T+1:40" > .contracts-frozen`, poi **verificare che l'hook blocchi davvero** con una scrittura di prova | architetto |
| T+1:40 | `npm --prefix app run agents:trace` | evidence-collector |
| T+2:45 | `git tag freeze`, poi `git switch -c evolution-proof` | architetto |
| T+2:45 | `npm --prefix app run agents:trace` | evidence-collector |
| T+3:00 | README compilato | architetto |
| T+3:30 | `agents:trace` finale + `deck` rigenerato | evidence-collector |

---

## Documentazione funzionale in parallelo

### D19 · `doc-funzionale` è `09`, non `08`

**Scelta.** Il prompt lo chiamava `08-doc-funzionale`, ma `08-demo-director`
esiste già dal primo blocco. Usato `09-doc-funzionale`.

**Perché.** Rinumerare un agente esistente avrebbe rotto i riferimenti in
`agents/README.md`, in `mappa-agenti.mjs` e nella traccia git già prodotta,
per guadagnare un numero.

### D20 · La proprietà di `app/docs/` è divisa

**Scelta.** `app/docs/features/` e `app/docs/FUNZIONALITA.md` a
`09-doc-funzionale`; il resto di `app/docs/` (decisioni, brief, revisioni)
resta all'architetto. In `mappa-agenti.mjs` i prefissi più specifici vengono
prima.

**Perché.** È ciò che rende sicuro il parallelismo: directory disgiunte da
quelle di chi scrive sotto `src/`. Senza la divisione, `app/docs/` sarebbe
posseduta da due agenti, cioè l'unica cosa che questa organizzazione vieta.

### D21 · Il confine dentro il file della spec è una riga di markdown

**Scelta.** Sopra `## Previsto` il file appartiene a `/spec`; da lì in giù a
`doc-funzionale`. Nessun meccanismo tecnico lo impone: è una convenzione
scritta nel template e nel file dell'agente.

**Perché.** La più semplice che funziona. Separare i due contenuti in due file
avrebbe raddoppiato i percorsi da tenere allineati e reso illeggibile la
scheda di una funzionalità, che ha senso solo letta intera.

### D22 · Il tempo verbale è il segnale di stato

**Scelta.** Fase 1 scrive al futuro, fase 2 al presente. `/verifica` fallisce
se un file in stato `in sviluppo` contiene affermazioni al presente.

**Perché.** È un controllo che costa zero a chi legge: non serve confrontare
con il codice per sapere che cosa è verificato. L'alternativa — un campo di
stato per ogni affermazione — sarebbe più preciso e nessuno la compilerebbe.

### D23 · `tester` non è stato creato

**Scelta.** Era stato richiesto in un messaggio separato, poi la richiesta è
stata ristretta alla sola documentazione. `app/tests/accettazione/` e
`app/docs/test/` **non esistono**, e `09-tester` nemmeno.

**Perché.** Non è una dimenticanza: è scope non ancora aperto. Va deciso
esplicitamente prima di aprirlo, perché aggiunge un secondo output da
revisionare per ogni funzionalità.

### D24 · Solo il PM gira su Opus

**Scelta.** `model: opus` nel frontmatter di `10-pm`, `model: sonnet` su tutti
gli altri undici agenti, dichiarato esplicitamente invece che lasciato
all'eredità dalla sessione.

**Perché.** Il PM è l'unico che **decide al posto di una persona**: approva una
spec, chiude un task, giudica se un risultato regge. È giudizio, non
esecuzione. Gli altri agenti eseguono dentro un perimetro stretto, con i
vincoli già resi eseguibili da test e hook: il modello più capace lì aggiunge
poco e costa a ogni invocazione.

Dichiararlo su tutti e non solo sul PM è voluto: `inherit` renderebbe il costo
dipendente da come è avviata la sessione, cioè imprevedibile.

### D25 · Il PM sostituisce l'uomo nel ciclo, con tre eccezioni

**Scelta.** Quando è il PM ad avviare il lavoro, conferma lui e verifica lui.
Restano alla persona: il **rifiuto di `/spec`**, la **deroga sui contratti
congelati**, e la decisione di **presentare qualcosa di rosso**.

**Perché.** Le conferme di routine erano il collo di bottiglia: fermavano il
ciclo a ogni passaggio senza aggiungere informazione, perché i vincoli veri
sono già eseguibili (test, lessico, hook). Le tre eccezioni invece non sono
verificabili da una macchina: un rifiuto di conformità è un vincolo di
dominio, una deroga sui contratti riguarda il lavoro di altri, e presentare
qualcosa di rosso è una scelta di chi ci mette la faccia.

Il PM **non può ribaltare un rifiuto**: se potesse, `/spec` smetterebbe di
essere un cancello e diventerebbe un suggerimento.

### D26 · Apertura piena: le skill del ciclo sono invocabili dal modello

**Scelta.** Rimosso `disable-model-invocation` da tutte le skill tranne
`nuovo-agente`. Allargata l'allowlist dei permessi in
`app/.claude/settings.json` a npm, npx, git di lavoro e scritture sotto
`src/`, `tests/`, `docs/`.

**Perché.** Il PM non poteva far avanzare niente: le istruzioni dicevano «il PM
lancia /implementa» ma le skill erano solo-umane, quindi quella frase
descriveva un'intenzione e non un meccanismo. Il ciclo si fermava a ogni
passaggio proprio dove le conferme non aggiungevano informazione.

**Rischio accettato, dichiarato.** `/spec` può ora partire da sola, quindi un
suo **rifiuto di conformità** potrebbe non passare più sotto gli occhi di una
persona. È stato segnalato prima di procedere ed è stata una scelta esplicita,
non una svista.

Il rischio non è nudo: il divieto di linguaggio prescrittivo resta **eseguibile**
(test, hook `PostToolUse`, componente `<Testo>` a runtime), quindi una
raccomandazione che sfuggisse a `/spec` verrebbe comunque bloccata più a valle.

**Restano chiusi:** `nuovo-agente` (crea perimetri, cambia la mappa e la
presentazione), le scritture su `types/`, `agents/`, `.claude/`, e
`git push` / `git reset` / `rm -rf`, che restano a comando esplicito.

### D27 · Il PM non chiede l'impronta: la ottiene

**Scelta.** Quando un task non ha impronta, il PM **lancia `/spec`** invece di
fermarsi a chiedere su quali task farlo per primi. L'ordine lo decide con un
criterio dichiarato: prima ciò che sblocca il collo di bottiglia, poi ciò che
si divide fra `src/core/` e `src/ui/`, per ultimo ciò che atterra tutto sulla
stessa cartella.

**Perché.** Il divieto era «non indovinare l'impronta», e resta valido.
Ma fermarsi a chiedere non è l'unica alternativa a indovinare: **ottenerla** lo
è. Il modo più comune in cui questo ruolo fallisce non è decidere troppo, è
fermarsi a chiedere qualcosa che poteva ottenere.

Il criterio d'ordine resta **un'aspettativa finché `/spec` non la conferma**:
dopo ogni specifica si rilancia `pm:piano` e decide il piano, non la previsione.

### D28 · Un documento unico si decompone, non si carica intero

**Scelta.** `/task-file` e `/task-cartella` spezzano un documento che descrive
l'intero prodotto nei deliverable che descrive davvero, uno per task, con il
rimando alla sezione d'origine.

**Perché.** Un documento caricato come task singolo non serve a pianificare
niente: un task deve essere qualcosa che un agente può prendere in mano. Era
già stato fatto a mano in una sessione, marcandolo come deviazione dal
comportamento automatico: ora è il comportamento automatico.
