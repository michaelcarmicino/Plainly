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

**Scelta.** `app/src/ui/stringheUtente.ts` contiene ogni parola che l'utente
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
