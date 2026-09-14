# Copione della demo — due voci

> Agente proprietario: [`08-demo-director`](../agents/08-demo-director.md).
> Scheletro a T+0:15. Si compila dopo il feature freeze (T+2:45): un copione
> scritto su un prodotto che sta ancora cambiando va riscritto.

## Come chiamare gli agenti quando parli

Nel codice, nelle slide e nella traccia restano i **nomi di ruolo**: dicono che
cosa fa un agente, e in venti secondi di slide è quello che serve. A voce
invece un nome proprio si ricorda, e «Greta ha bloccato il commit» scorre
meglio di «il guardrail-officer ha bloccato il commit».

| Persona | Ruolo | Che cosa possiede |
| --- | --- | --- |
| **Cora** | `core-engine` | il calcolo |
| **Ugo** | `ui-builder` | le schermate e i testi |
| **Greta** | `guardrail-officer` | il lessico vietato, e il veto |
| **Mira** | `impact-analyst` | la misura della comprensione |
| **Dafne** | `doc-funzionale` | la documentazione, in due fasi |
| **Teo** | `tester` | i casi di prova e il referto |
| **Pia** | `pm` | orchestra, e conferma al posto nostro |
| **Vera** | `ux-reviewer` | guarda le schermate e riporta |
| **Ivo** | `data-ingest` | **non attivato**, di proposito |

Fuori dalla squadra di prodotto, l'attrezzatura: **Arturo** (`architect`),
**Eva** (`evidence-collector`), **Dino** (`deck-builder`), **Delia**
(`demo-director`).

> **Usali solo parlando.** Se un nome proprio finisce su una slide o in un
> commit, chi ascolta deve chiedere chi è — e la corrispondenza fra nome e
> cartella, che è il punto della decomposizione, si perde.

## Divisione delle voci

| Voce | Chi | Slide | Perché |
| --- | --- | --- | --- |
| **Persona A** — il prodotto | … | **1, 2, 4, 5, 9** | Racconta il problema, la persona, che cosa calcola il software e quanto è migliorata la comprensione |
| **Persona B** — il metodo | … | **3, 6, 7, 8** | Racconta come è stato costruito e **guida la demo dal vivo** |

Una slide ha sempre **un solo proprietario**. Le sovrapposizioni fra due
presentatori costano più tempo di quanto ne facciano risparmiare.

**Il metodo occupa 4 slide su 9 e almeno un terzo del tempo**: la giuria
valuta l'uso di Claude Code per costruire software, non solo il prodotto.

---

## Timing — versione lunga (8 minuti = 480 s)

| # | Slide | Voce | Sec | Che cosa si dice · che cosa si mostra |
| --- | --- | --- | --- | --- |
| 1 | Titolo e problema | A | 30 | Una frase sul problema. Nessuna premessa sull'hackathon. TODO(scenario) |
| 2 | La persona e il punto di blocco | A | 45 | Il punto **esatto** in cui si ferma, non un profilo generico. TODO(scenario) |
| 3 | **METODO** — organizzazione | **B** | **70** | 4 ore · 2 persone · 4 cartelle valutate · N agenti, una directory ciascuno. Il modello **architetto / product developer**. Il vincolo da cui nasce: i conflitti non nascono dal codice difficile |
| 4 | Before / after | A | 45 | Le due schermate affiancate. Silenzio per 3 secondi: si legge da sola |
| 5 | La capability | A | 60 | Che cosa calcola, su quale voce, e **quale agente l'ha costruita** |
| 6 | **DAL VIVO** — il guardrail | **B** | **75** | Si aggiunge la riga prescrittiva, si salva, **l'hook fa fallire il test**. Vedi «Piano B» |
| 7 | **METODO** — la base agentica | **B** | **65** | Gli otto componenti del substrato. Il costo di ingresso: 2 file, 1 directory, 0 riunioni |
| 8 | **METODO** — prova di evoluzione | **B** | **55** | I numeri da `evolution.json`. Il numero che conta: **contratti modificati dopo il freeze** |
| 9 | Miglioramento e limiti | A | 35 | Prima / dopo / delta **e i limiti sulla stessa slide**, non in postilla |

**Totale: 480 s.** Al metodo (3+6+7+8): **265 s = 55%.**

## Timing — versione corta (5 minuti = 300 s)

Deck generato con `npm --prefix app run deck:short` (slide 7 e 8 unite, 8 slide).

| # | Voce | Sec |
| --- | --- | --- |
| 1 | A | 20 |
| 2 | A | 30 |
| 3 | B | 45 |
| 4 | A | 30 |
| 5 | A | 40 |
| 6 | B | 50 |
| 7+8 | B | 60 |
| 9 | A | 25 |

**Totale: 300 s.** Al metodo: **155 s = 52%.**

---

## Ordine delle finestre, prima di iniziare

Scritto qui perché nessuno cerchi un terminale mentre parla.

1. Browser a schermo intero su `presentation/deck.html` (tasto `f`)
2. Editor aperto su `app/src/ui/stringheUtente.ts`, cursore già sulla riga giusta
3. Terminale in `app/`, con `npm test` già digitato ma **non** inviato
4. Seconda scheda del browser sull'app in `npm run dev`
5. **Wi-Fi spento**: è parte della dimostrazione, non un incidente

---

## La demo dal vivo (slide 6) — e il piano B

**Persona B**, in sequenza:

1. «Il vincolo è: il prodotto spiega e calcola, non consiglia. Scritto in un
   documento è una speranza. Vediamo cos'è qui.»
2. Incolla in `stringheUtente.ts`:
   `demoRotta: 'Ti consigliamo di scegliere il conto migliore.',`
3. Salva. **L'hook `PostToolUse` parte da solo** e segnala le tre violazioni.
4. `npm test` → rosso, con il termine, il motivo e la riformulazione ammessa.
5. Rimuove la riga, salva, verde.

**Piano B** — se il comando non parte entro **10 secondi**: si passa a
`presentation/screenshots/04-test-rosso.png`, già nel deck. Non si debugga mai
davanti alla giuria.

---

## Il passaggio di consegne al PM — da raccontare in slide 7 o 8

**Persona B.** È il pezzo di metodo che vale di più, perché ha un prima e un
dopo, e il dopo è una conseguenza del prima e non una scelta di comodo.

### Come raccontarlo, in tre battute

> **Primo tempo.** «Abbiamo costruito gli agenti uno alla volta, ciascuno con
> una cartella in esclusiva. Poi abbiamo provato il ciclo su una funzionalità
> vera — specifica, implementazione, verifica — **con noi a dare la conferma
> fra uno step e l'altro**. Ogni volta che ci fermavamo, guardavamo cosa era
> uscito e correggevamo: il perimetro di un agente, una descrizione che non
> diceva *quando* usarlo, un controllo che mancava.»
>
> **Secondo tempo.** «Alla seconda configurazione, quelle conferme
> **tornavano tutte**. Ci fermavamo, guardavamo, e non c'era niente da
> correggere: stavamo battendo invio.»
>
> **Terzo tempo.** «Quello è il momento in cui una conferma smette di essere un
> controllo e diventa un collo di bottiglia. Allora abbiamo delegato
> l'orchestrazione degli step di una nuova funzionalità al PM.»

### Il punto da non perdere

**Non abbiamo tolto l'uomo dal ciclo perché era più veloce. L'abbiamo tolto
quando i controlli avevano smesso di aver bisogno di lui** — e solo là dove
avevano smesso.

La delega è arrivata **dopo** la prova, non al posto della prova. È la
differenza fra automatizzare qualcosa che funziona e sperare che funzioni
perché è automatizzato.

### E le tre cose che **non** abbiamo delegato

Se qualcuno chiede «quindi il modello decide da solo?», la risposta è no, e va
data con l'elenco preciso:

1. **Il rifiuto di una specifica.** Se `/spec` rifiuta perché la funzionalità
   darebbe un consiglio, il PM **non può ribaltarlo**. Se potesse, `/spec`
   smetterebbe di essere un cancello e diventerebbe un suggerimento.
2. **La deroga sui contratti congelati**, perché riguarda il lavoro di altri.
3. **La decisione di presentare qualcosa di rosso**, perché è di chi ci mette
   la faccia.

Tutto il resto — approvare una spec conforme, far partire le fasi, chiudere un
task — lo decide il PM, che per questo è **l'agente che gira di default sul
modello più potente disponibile**: confermare al posto di una persona richiede
giudizio, non esecuzione.

### Come verifica, così non è una promessa

`/verifica` verde · i passi di «come si prova» **eseguiti** · il referto del
tester letto · il diff confrontato con l'impronta dichiarata. Se uno solo non
regge, il task torna indietro con il motivo nel registro.

> **Frase di chiusura, se serve una sola riga:** «Abbiamo dato via le conferme
> quando hanno smesso di dirci qualcosa. Non prima, e non tutte.»

---

## Le tre domande più probabili della giuria

*Risposta scritta, sotto i 30 secondi ciascuna. Da provare a voce.*

### 1. «Quanto di questo codice l'ha scritto Claude Code, e come lo sapete?»

Praticamente tutto, e non lo diciamo: lo mostriamo. `agents/trace.md` è
generato da `npm run agents:trace`, che legge la cronologia git e mappa ogni
directory sull'agente che la possiede. Agenti attivi, file toccati, commit,
primo e ultimo commit — è un dato, non un racconto. Lo stesso dato alimenta la
slide 3. Quello che abbiamo scritto a mano sono i **vincoli**: contratti,
perimetri, lessico dei guardrail.

### 2. «Come evitate che il modello vi porti fuori strada?»

Non ci affidiamo alla sua buona volontà: i vincoli sono **eseguibili**. Un
hook `PostToolUse` lancia i test dei guardrail dopo ogni modifica, quindi una
formulazione prescrittiva viene bloccata al salvataggio. Un hook `PreToolUse`
blocca le scritture sui contratti dopo il congelamento e spiega perché
rivolgersi all'architetto. E c'è una sezione «Cosa abbiamo corretto» in
`agents/README.md` con i momenti in cui è andato fuori strada davvero: non
sosteniamo che non sia successo.

### 3. «Questa organizzazione regge oltre le quattro ore, o è usa e getta?»

La misuriamo invece di affermarlo. Al feature freeze abbiamo messo il tag
`freeze`, poi su un branch `evolution-proof` — mai unito, così la demo non è
mai a rischio — abbiamo aggiunto una capability con **un solo agente**.
`npm run evolution:proof` conta minuti, directory toccate dal diff e
**contratti modificati dopo il freeze**: quest'ultimo è il numero che conta,
ed è in slide 8. Per una terza persona il costo di ingresso è due file da
leggere e una directory libera da scegliere.

---

## Domande di riserva

- *«Perché non leggete i documenti automaticamente?»* → Decisione di scope
  documentata in `agents/02-data-ingest.md`: su quattro ore il parsing è
  l'unico componente che può fallire **in silenzio**, e un numero sbagliato
  presentato con sicurezza è peggio di nessun numero. Il limite è dichiarato
  nella UI, nel README e in slide 9.
- *«Il prodotto chiama un LLM?»* → No. Wi-Fi spento, l'app funziona. Claude
  Code è lo strumento con cui l'abbiamo costruito, non una dipendenza del
  prodotto.
- *«Chi ha scritto le slide?»* → `build-deck.ts` le genera dalle evidenze in
  `presentation/evidence/`. Nessun numero è scritto a mano nel generatore.
