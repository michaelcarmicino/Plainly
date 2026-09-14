# Copione della demo — due voci

> Agente proprietario: [`08-demo-director`](../agents/08-demo-director.md).
> Scheletro a T+0:15. Si compila dopo il feature freeze (T+2:45): un copione
> scritto su un prodotto che sta ancora cambiando va riscritto.

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
