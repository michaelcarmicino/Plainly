# Plainly

**Un cittadino riceve una bolletta, una busta paga o una dichiarazione dei
redditi, e non capisce cosa c'è scritto. Plainly glielo spiega, riga per riga,
senza dirgli cosa fare.**

Non insegna finanza: dà il minimo indispensabile per orientarsi nelle decisioni
economiche che una persona deve affrontare comunque — pagare le bollette,
leggere lo stipendio, capire le tasse, valutare un mutuo, pensare alla pensione.

> Il principio che guida tutto: **l'incertezza cala quando un'ansia generica
> — «i prezzi salgono», «non so se basterà» — diventa un numero concreto e
> verificabile sulla propria situazione.**

---

## Farlo girare

```bash
cd app
npm install
npm run dev
```

Poi `http://localhost:5173`. Build statica apribile con doppio clic:

```bash
cd app && npm run build
```

**Funziona offline. Nessuna API key, nessuna chiamata esterna a runtime.**
Provalo con il Wi-Fi spento: è parte di ciò che il progetto dimostra.

Chi clona il repository e non sa da dove cominciare: `/prepara` dentro `app/`,
oppure `npm run prepara`.

---

## Parte 1 — La squadra di agenti che ha costruito l'app

*Presentazione: [`presentation/slide-squadra.html`](presentation/slide-squadra.html)
· [`presentation/deck-metodo.html`](presentation/deck-metodo.html)*

### Il rischio non è il codice

In un progetto costruito in poche ore con un modello, i conflitti **non
nascono dal codice difficile**. Il codice difficile fallisce in modo rumoroso:
un test diventa rosso, un tipo non compila, qualcuno se ne accorge in trenta
secondi.

Due agenti che scrivono lo stesso file falliscono **in silenzio**: il secondo
sovrascrive il primo, entrambi «hanno finito», e il lavoro perso si scopre due
ore dopo.

### Un agente, una cartella, nessun conflitto

Quindi il criterio della decomposizione non è la coesione concettuale — che
sarebbe il criterio giusto in un progetto normale. È **l'assenza di
sovrapposizione sul filesystem**.

| Agente | Possiede | Fa |
| --- | --- | --- |
| `core-engine` | `src/core/` | il calcolo, puro e deterministico |
| `ui-builder` | `src/ui/` | i componenti e le stringhe |
| `guardrail-officer` | `src/guardrails/`, `tests/` | il lessico vietato, e il veto sui testi |
| `impact-analyst` | `src/assessment/` | la misura della comprensione |
| `doc-funzionale` | `docs/features/` | la documentazione, in due fasi |
| `tester` | `tests/accettazione/`, `docs/test/` | i casi di prova e il referto |
| `pm` | `docs/backlog/` | orchestra più funzionalità insieme |
| `ux-reviewer` | `docs/ux/` | guarda le schermate e riporta |

Mappa completa, razionale e grafo di concorrenza:
**[`agents/README.md`](agents/README.md)**.

### Il ciclo di vita di una funzionalità

```
/spec → /implementa → /verifica → commit → /promuovi
```

Le skill sono **i verbi che una persona digita**; gli agenti sono i lavoratori
con contesto isolato. Chi sviluppa non ha bisogno di sapere quanti agenti
esistono: **il routing lo fa la skill**.

**Documentazione e test nascono prima del codice**, in parallelo: `/spec`, una
volta confermata, avvia `doc-funzionale` e `tester` in *fase 1*, che scrivono
**al futuro** partendo dalla sola specifica. A implementazione finita, la
*fase 2* riscrive **al presente** solo ciò che è stato verificato sul codice.

Il campo «come si proverà» non è documentazione: sono i **criteri di
accettazione**, e chi costruisce li riceve prima di scrivere una riga.

### Le regole non si scrivono, si eseguono

Il vincolo «spiega e calcola, non consiglia» non è una linea guida: è
`src/guardrails/lessico.ts` più un test che scandisce **ogni stringa rivolta
all'utente** e fa fallire la build, più un hook che lo esegue **al
salvataggio**, più il componente `<Testo>` che lo riapplica a runtime.

Lo stesso vale per la presentazione: il generatore dei deck **si rifiuta di
generare** se una slide supera il suo budget di parole. Alla prima esecuzione
ha bloccato noi, per sette violazioni nostre.

### Prima a mano, poi il PM

La squadra non è nata così. Prima abbiamo costruito gli agenti uno alla volta e
provato il ciclo completo su una funzionalità vera, **con una persona a
confermare fra uno step e l'altro** — e a ogni fermata si correggeva qualcosa.

Alla seconda configurazione quelle conferme tornavano tutte. Allora
l'orchestrazione è passata al `pm`, al posto della persona.

> **Non abbiamo tolto la persona dal ciclo perché era più veloce. L'abbiamo
> tolta quando i controlli avevano smesso di aver bisogno di lei.**

Restano a una persona: il **rifiuto di una specifica**, la **deroga sui
contratti congelati**, e la scelta di **presentare qualcosa di rosso**.

### La traccia, che è un dato e non un racconto

```bash
npm --prefix app run agents:trace     # agents/trace.md + evidence/process.json
npm --prefix app run evolution:proof  # contratti modificati dopo il freeze
npm --prefix app run verify:roots     # stato delle due radici Claude Code
```

`agents/trace.md` è **generato dalla cronologia git**, mappando ogni cartella
sull'agente che la possiede. Non è scritto a mano.

---

## Parte 2 — Le funzionalità di prodotto

*Presentazione: [`presentation/deck-prodotto.html`](presentation/deck-prodotto.html)
· specifiche vive in [`app/docs/FUNZIONALITA.md`](app/docs/FUNZIONALITA.md)*

### Tre aree, e domande vere come titoli

Ogni pagina nasce da **una domanda posta in linguaggio umano**, non da un
termine tecnico.

| Area | Copre | Esempio di domanda |
| --- | --- | --- |
| **Il costo della vita** | inflazione, bollette, casa, stipendi | «Perché la bolletta è così alta questo mese?» |
| **Il lavoro** | disoccupazione, tasse sul reddito, precarietà | «Quanto mi tolgono davvero le tasse sullo stipendio?» |
| **Il futuro** | pensione, risparmio, mutui, successione | «Riuscirò a mettere via qualcosa ogni mese?» |

### Traduzione, non definizione

Prima l'immagine mentale concreta, **poi** il nome tecnico. Mai il contrario.

> ❌ «L'inflazione è l'aumento generalizzato dei prezzi che erode il potere
> d'acquisto.»
>
> ✅ «Immagina di fare la spesa con lo stesso carrello di un anno fa. Con gli
> stessi soldi, oggi ci entrano meno cose. Quella differenza si chiama
> inflazione.»

Lo schema è in [`app/.claude/rules/scrittura-e-accessibilita.md`](app/.claude/rules/scrittura-e-accessibilita.md),
caricato in automatico da chi scrive.

### Guide interattive ai documenti

Un facsimile del documento **come lo si riceve davvero**, con zone cliccabili.
Si spiegano solo le **3-5 voci che generano più dubbi**, una alla volta, non
tutto il testo insieme.

Alla fine **un riepilogo, non un quiz**: una card da rivedere in futuro.
Nessuna domanda, nessuna sensazione di essere valutati.

Priorità: **busta paga** · **bolletta luce/gas** · **730**.

### Quattro simulatori, con formule reali

| Simulatore | Che cosa risponde | Fonte del dato |
| --- | --- | --- |
| Valore dei soldi nel tempo | «cosa ci compro fra 5 anni» | ISTAT, indice NIC |
| Quanto resta in busta | netto stimato da lordo | INPS · Agenzia delle Entrate |
| Fondo di emergenza | mesi coperti senza reddito | nessuna: non dipende da dati vivi |
| Fisso o variabile | rata e range del variabile | Banca d'Italia · ABI · EMMI |

Sotto ogni risultato, sempre: *«Questo è un calcolo stimato… potrebbe non
corrispondere esattamente alla realtà.»*

### Mutuo e investimenti: prima il bisogno, poi lo strumento

Sul mutuo: fisso o variabile, TAN contro TAEG, come si legge il piano di
ammortamento, la surroga come **diritto** e non favore, e cosa fare se non si
riesce più a pagare la rata — scritto per essere letto nel momento di massimo
stress, non in una lettura serena.

Sugli investimenti **non c'è un simulatore di rendimenti**, ed è una scelta:
proiettare quanto guadagnerai, anche a scopo educativo, si legge come una
promessa. Si spiega il rapporto fra rischio, orizzonte temporale e liquidità,
e basta.

### Ogni numero ha una fonte e una scadenza

Nessun dato «vivo» è scritto a mano: inflazione, aliquote, tassi hanno una
fonte autoritativa dichiarata e una cadenza di aggiornamento. Se un dato
cambia, si aggiorna **in un posto solo** e si riflette ovunque.

---

## Vincoli e limiti

Cosa il prodotto **deliberatamente non fa**, e perché.

**Non consiglia.** Niente raccomandazioni di investimento, niente consulenza
personalizzata, niente indicazioni su cosa comprare, vendere o scegliere.
Nessuna semplificazione altera il significato dell'informazione originale: le
etichette del documento si riportano come sono scritte.

**Non legge i documenti da solo.** I dati vengono da esempi strutturati a mano.
Su poche ore il parsing è l'unico componente che può fallire **in silenzio**: un
parser che legge `1.234,56` come `1.23` restituisce un numero plausibile, la
UI lo mostra con sicurezza e i test passano perché testano il parser contro se
stesso. Decisione di scope documentata in
[`agents/02-data-ingest.md`](agents/02-data-ingest.md).

**Non chiama servizi esterni.** Nessun LLM a runtime, nessuna chiave, nessun
CDN. Claude Code è lo strumento con cui il prodotto è stato costruito, non una
sua dipendenza.

**La misura del miglioramento è un'indicazione, non una statistica.** Campione
ridotto, stesse domande prima e dopo (quindi con effetto memoria), nessuna
selezione casuale. I limiti stanno sulla stessa slide del numero.

Nel footer del sito: *«Questo sito è stato generato con l'aiuto
dell'intelligenza artificiale e potrebbe contenere errori.»*

---

## Dove guardare

| Cosa | Dove |
| --- | --- |
| La mappa della squadra e il perché | [`agents/README.md`](agents/README.md) |
| La traccia reale, generata da git | [`agents/trace.md`](agents/trace.md) |
| Come si lavora con lo strumento | [`app/COME-LAVORARE.md`](app/COME-LAVORARE.md) |
| Le decisioni prese, con il motivo | [`app/docs/decisioni.md`](app/docs/decisioni.md) |
| Le funzionalità, stato per stato | [`app/docs/FUNZIONALITA.md`](app/docs/FUNZIONALITA.md) |
| Il copione della demo | [`presentation/demo-script.md`](presentation/demo-script.md) |
