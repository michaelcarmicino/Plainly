# Conti Chiari

> **Scheletro da compilare a T+3:00.** Le sezioni e il loro ordine sono
> definitivi; i contenuti marcati TODO si riempiono quando lo scenario è
> congelato e i numeri esistono.

<!-- TODO(T+3:00): una frase. Quale persona, quale difficoltà, cosa risolve.
     Esempio di forma, da sostituire:
     «Chi riceve un estratto conto legge un totale che non sa verificare:
      Conti Chiari mostra da dove viene ogni cifra, voce per voce.» -->

**Una frase:** TODO — quale persona, quale difficoltà, cosa risolve.

---

## Farlo girare

```bash
cd app
npm install
npm run dev
```

Poi `http://localhost:5173`.

Build statica, apribile con doppio clic da `file://`:

```bash
cd app && npm run build && start dist/index.html   # macOS/Linux: open
```

**Funziona offline. Nessuna API key, nessuna chiamata esterna a runtime.**
Provalo con il Wi-Fi spento: è parte di ciò che il progetto dimostra.

---

## I tre deliverable del tema

<!-- TODO(T+3:00): copiare i titoli esatti dal regolamento dell'hackathon.
     Una sezione ciascuno, con il rimando al punto del repository che li
     soddisfa. Non parafrasare i titoli: la giuria cerca i suoi. -->

### 1. TODO — titolo esatto dal regolamento

TODO

### 2. TODO — titolo esatto dal regolamento

TODO

### 3. TODO — titolo esatto dal regolamento

TODO

---

## Come è stato costruito

*La sezione più importante per questa giuria: valuta l'uso di Claude Code per
costruire software, non solo il prodotto finito. Il prodotto è la prova che il
metodo ha funzionato.*

### Il team non è simmetrico

Due persone con due ruoli diversi, non due sviluppatori intercambiabili.

- **L'architetto** tocca contratti, agenti, hook, skill, guardrail: definisce
  i vincoli e li rende eseguibili.
- **Il product developer** non tocca niente di tutto questo. Interagisce con
  il progetto **solo attraverso skill** e non ha bisogno di sapere quanti
  agenti esistono né come si chiamano: **il routing verso l'agente giusto lo
  fa la skill**.

Modello: **una skill è il verbo che l'umano digita, un subagent è il
lavoratore con contesto isolato e una directory in esclusiva.**

Percorso del product developer: `/spec` → `/implementa` → `/verifica` →
`/evidenza` → commit. Cinque skill in tutto, elencate in
[`agents/README.md`](agents/README.md#interfaccia-per-lo-sviluppo-di-funzionalità).

### Un agente, una directory in esclusiva

In un hackathon i conflitti **non nascono dal codice difficile**: nascono da
due agenti che scrivono lo stesso file. Il codice difficile fallisce in modo
rumoroso — un test rosso, un tipo che non compila. Due agenti sullo stesso
file falliscono in silenzio, e il lavoro perso si scopre due ore dopo.

Quindi il criterio della decomposizione non è la coesione concettuale, è
**l'assenza di sovrapposizione sul filesystem**. Ne discende il parallelismo
(due agenti con directory disgiunte si lanciano insieme) e la tracciabilità
(se ogni directory ha un proprietario, la cronologia git si mappa sugli agenti
in modo meccanico).

### Le regole sono eseguibili, non scritte

Due hook in [`.claude/settings.json`](.claude/settings.json):

- `PostToolUse` esegue i test dei guardrail dopo ogni modifica ai sorgenti:
  il divieto di linguaggio prescrittivo non dipende dalla buona volontà del
  modello;
- `PreToolUse` blocca le scritture sotto `app/types/` quando i contratti sono
  congelati, e spiega perché rivolgersi all'architetto.

Entrambi escono con successo se si rompono da soli: un hook difettoso non deve
mai fermare il lavoro.

### Dove guardare

| Cosa | Dove |
| --- | --- |
| **La mappa della squadra**, il grafo di concorrenza e il razionale | [`agents/README.md`](agents/README.md) |
| **La traccia di esecuzione reale** — chi ha toccato cosa, quanti commit | [`agents/trace.md`](agents/trace.md) *(generata da git, non scritta a mano)* |
| Le nove definizioni di agente | [`agents/`](agents/) |
| Le decisioni prese e il loro motivo | [`app/docs/decisioni.md`](app/docs/decisioni.md) |
| Le specifiche delle funzionalità | [`app/docs/features/`](app/docs/features/) |

### L'evolvibilità, misurata invece che affermata

```bash
npm --prefix app run evolution:proof
```

Confronta il branch corrente con il tag `freeze` e scrive
`presentation/evidence/evolution.json`: minuti trascorsi, directory toccate
dal diff, file modificati, e **quanti di questi sono contratti** sotto
`app/types/`. Quest'ultimo è il numero che conta, ed è in slide 8.

Gira su un branch `evolution-proof` che non viene mai unito, così la build
della demo non è mai a rischio.

---

## Vincoli e limiti

Cosa il prodotto **deliberatamente non fa**, e perché.

### Non legge documenti automaticamente

I dati provengono da fixture strutturate a mano (`app/fixtures/`), non dal
parsing di un PDF caricato dall'utente.

Su quattro ore il parsing è **l'unico componente che può fallire in
silenzio**: un parser che legge `1.234,56` come `1.23` restituisce un numero
plausibile, la UI lo mostra con sicurezza e i test passano perché testano il
parser contro se stesso. In un prodotto di educazione finanziaria un numero
sbagliato presentato con sicurezza è peggio di nessun numero.

Decisione di scope documentata per esteso in
[`agents/02-data-ingest.md`](agents/02-data-ingest.md): l'agente esiste,
ha un perimetro e una directory riservata, e non è stato attivato.

### Non consiglia

Spiega e calcola. Niente raccomandazioni di investimento, niente consulenza
personalizzata, niente indicazioni su cosa comprare, vendere o scegliere.
Nessuna semplificazione altera il significato dell'informazione originale: le
etichette del documento sono riportate come sono scritte.

Il vincolo è eseguibile, non dichiarato: `app/src/guardrails/` più un test che
scandisce tutte le stringhe rivolte all'utente e fa fallire la build.

### Non chiama servizi esterni

Nessun LLM a runtime, nessuna API, nessuna chiave, nessun CDN. Claude Code è
lo strumento con cui il prodotto è stato costruito, non una sua dipendenza.

### La misura del miglioramento è un'indicazione, non una statistica

Campione ridotto raccolto durante l'evento, stesse domande prima e dopo
(quindi con effetto memoria), nessuna selezione casuale. I limiti sono
dichiarati sulla stessa slide del numero, non in una postilla.

<!-- TODO(T+3:00): aggiungere i limiti emersi durante la giornata. -->
