# agents/ — la squadra che ha costruito Plainly

Questa cartella è il **come**. Il prodotto in `app/` è la prova che il come
ha funzionato.

Undici agenti, nove attivi e uno deliberatamente no (02-data-ingest). Ogni agente ha una
responsabilità in una frase, **una directory che possiede in esclusiva**, un
elenco di directory che non deve toccare, una definition of done e una
fascia oraria. Nient'altro.

---

## Mappa della squadra

| Agente | Directory posseduta | Responsabilità | Fascia |
| --- | --- | --- | --- |
| [`00-architect`](00-architect.md) | `app/types/`, `app/fixtures/`, `app/scripts/`, `app/docs/`, `agents/`, `.claude/` | Contratti, perimetri, vincoli eseguibili, evidenza | 0:00–0:30 · 1:40–1:50 · 2:45–3:00 |
| [`01-core-engine`](01-core-engine.md) | `app/src/core/` | Calcolo deterministico: pesi, aggregati, quadratura, proiezione | 0:30–1:40 · 1:50–2:45 |
| [`02-data-ingest`](02-data-ingest.md) | `app/src/ingest/` | **NON ATTIVATO** — parsing di documenti reali | — |
| [`03-ui-builder`](03-ui-builder.md) | `app/src/ui/` | Interfaccia leggibile in proiezione, testo tutto a registro | 0:30–1:40 · 1:50–2:45 |
| [`04-guardrail-officer`](04-guardrail-officer.md) | `app/src/guardrails/`, `app/tests/` | «Spiega, non consiglia» reso eseguibile | 0:15–0:30 · 1:50–2:45 |
| [`05-impact-analyst`](05-impact-analyst.md) | `app/src/assessment/` | Misura del miglioramento prima/dopo, con i limiti dichiarati | 1:50–2:45 · 2:45–3:15 |
| [`06-evidence-collector`](06-evidence-collector.md) | `presentation/evidence/`, `presentation/screenshots/`, `app/tests/e2e/` | Raccoglie l'evidenza mentre accade | continuo, con 3 checkpoint |
| [`07-deck-builder`](07-deck-builder.md) | `presentation/build-deck.ts`, `presentation/deck.html` | Genera il deck dalle evidenze | 1:50–2:45 · 3:40 |
| [`08-demo-director`](08-demo-director.md) | `presentation/demo-script.md` | Copione a due voci, timing, risposte alla giuria | 2:45–3:40 · 3:40–4:00 |
| [`09-doc-funzionale`](09-doc-funzionale.md) | `app/docs/features/`, `app/docs/FUNZIONALITA.md` | Documentazione funzionale in due fasi: al futuro mentre si costruisce, al presente dopo la verifica | **in parallelo** a ogni funzionalità |
| [`10-pm`](10-pm.md) | `app/docs/backlog/`, `app/docs/BACKLOG.md` | Coordina più funzionalità in parallelo calcolando le ondate senza conflitti di directory | su richiesta, dalla root |

### Perché `doc-funzionale` può girare in parallelo

Possiede `app/docs/` in esclusiva e **non scrive una riga sotto `app/src/`**.
Le directory sono disgiunte da quelle di tutti gli agenti di costruzione,
quindi la regola di concorrenza è soddisfatta per costruzione: la
documentazione si scrive **mentre** il codice viene scritto, non dopo.

Il rischio che questo introduce è documentare l'intenzione invece del
risultato. È governato da una regola dura e da un segnale visibile: **nulla
passa da previsto a fatto senza essere stato verificato sul codice**, e il
tempo verbale lo rende leggibile a colpo d'occhio — futuro in fase 1, presente
solo in fase 2.

Costo dichiarato: un agente in più è un output in più da revisionare. Resta
sostenibile in due persone perché la fase 1 produce **un solo file markdown
breve**, e perché quel file — il campo «come si proverà» — è comunque lavoro
che andava fatto: sono i criteri di accettazione.

Traccia di ciò che gli agenti hanno **effettivamente** fatto: [`trace.md`](trace.md)
(generato da `npm --prefix app run agents:trace`, mai scritto a mano).

---

## Grafo di concorrenza

```
T+0:00 ──────────── T+0:15 ──── T+0:30 ─────────────────── T+1:40 ── T+1:50 ─────────────── T+2:45 ────────── T+4:00
   │                   │           │                          │         │                      │                 │
   │  00-architect     │           │                          │         │                      │                 │
   │  DA SOLO          │           │                          │         │                      │                 │
   │  impalcatura,     │           │                          │         │                      │                 │
   │  contratti,       │           │                          │         │                      │                 │
   │  perimetri, hook  │           │                          │         │                      │                 │
   └───────────────────┤           │                          │         │                      │                 │
                       │ 04-guardrail-officer                 │         │                      │                 │
                       │ nucleo del lessico                   │         │                      │                 │
                       └───────────┤                          │         │                      │                 │
                                   │                          │         │                      │                 │
                                   │  ── WAVE 1 (parallelo) ──┤         │                      │                 │
                                   │  01-core-engine  ────────┤         │                      │                 │
                                   │  03-ui-builder   ────────┤         │                      │                 │
                                   │  (entrambi lavorano CONTRO I CONTRATTI, non l'uno         │                 │
                                   │   contro l'output dell'altro: per questo non si aspettano)│                 │
                                   │                          │         │                      │                 │
                                   │                    CHECKPOINT      │                      │                 │
                                   │                    T+1:40          │                      │                 │
                                   │                    • contratti congelati                  │                 │
                                   │                      (`.contracts-frozen` + hook)         │                 │
                                   │                    • agents:trace                         │                 │
                                   │                    • scenario congelato                   │                 │
                                   │                          │         │                      │                 │
                                   │                          │  ── WAVE 2 (parallelo) ────────┤                 │
                                   │                          │  01-core-engine    ────────────┤                 │
                                   │                          │  03-ui-builder     ────────────┤                 │
                                   │                          │  05-impact-analyst ────────────┤                 │
                                   │                          │  07-deck-builder   ────────────┤                 │
                                   │                          │                      FEATURE FREEZE              │
                                   │                          │                      T+2:45                      │
                                   │                          │                      • git tag freeze            │
                                   │                          │                      • branch evolution-proof    │
                                   │                          │                      │                           │
                                   │                          │                      │  08-demo-director ────────┤
                                   │                          │                      │  06-evidence-collector ───┤
                                   │                          │                      │  (finale + agents:trace)  │
   06-evidence-collector ═══════════════════════════ attivo per tutta la durata ══════════════════════════════════╡
```

**Regola di concorrenza**: due agenti possono girare insieme **se e solo se**
le directory che possiedono sono disgiunte. È verificabile leggendo la tabella
qui sopra, e `app/scripts/mappa-agenti.mjs` la rende leggibile a una macchina.

---

## Il razionale: un agente, una directory

In un hackathon i conflitti **non nascono dal codice difficile**. Nascono da
due agenti che scrivono lo stesso file.

Il codice difficile fallisce in modo rumoroso: un test diventa rosso, un tipo
non compila, qualcuno se ne accorge in trenta secondi. Due agenti sullo stesso
file falliscono in silenzio: il secondo sovrascrive il primo, entrambi
"hanno finito", e il lavoro perso si scopre due ore dopo, quando non c'è più
tempo per rifarlo.

Quindi il criterio della decomposizione non è la coesione concettuale, che è
il criterio giusto in un progetto normale. È **l'assenza di sovrapposizione
sul filesystem**. Ne discende tutto il resto:

- il perimetro di un agente si legge come un percorso, non come una
  descrizione: `app/src/core/` non ha zone grigie, «la logica di dominio» sì;
- quando un agente ha bisogno di scrivere fuori dal proprio perimetro, la
  risposta corretta è **fermarsi e segnalarlo**, non aggirare. È scritto in
  ogni file di definizione, e serve come segnale che un perimetro va
  ridisegnato — non come ostacolo;
- il parallelismo diventa una proprietà verificabile, non una speranza: due
  agenti con directory disgiunte si lanciano insieme, punto;
- la traccia diventa possibile. Se ogni directory ha un proprietario, la
  cronologia git si mappa sugli agenti in modo meccanico: è esattamente ciò
  che fa `agents:trace`, ed è il motivo per cui `trace.md` è un dato e non un
  racconto.

Il costo di questa scelta è reale e lo dichiariamo: alcuni cambiamenti
attraversano più directory e richiedono due agenti invece di uno. Su quattro
ore, il tempo perso in coordinamento è molto minore del tempo perso in un
conflitto scoperto tardi.

---

## Le regole sono eseguibili, non scritte

Due hook in `.claude/settings.json`. Sono la parte più importante di questa
cartella, perché sono il punto in cui il metodo smette di dipendere dalla
buona volontà del modello.

### `PostToolUse` su Edit/Write → `.claude/hooks/guardrail-dopo-modifica.mjs`

Dopo ogni modifica a un file sotto `app/src/`, `app/types/` o `app/fixtures/`,
esegue i test dei guardrail. Se una formulazione prescrittiva è entrata nel
codice, il modello lo scopre **al salvataggio**, non alla consegna.

Il vincolo «il prodotto spiega e calcola, non consiglia» scritto in un
documento è una speranza. Lo stesso vincolo dietro un hook è un fatto.

### `PreToolUse` su Edit/Write → `.claude/hooks/contratti-congelati.mjs`

Se nella root esiste `.contracts-frozen`, **blocca** ogni scrittura sotto
`app/types/` e spiega perché: dopo T+1:40 tutti gli altri agenti e le fixture
dipendono da quelle firme, e cambiarle invalida in silenzio il loro lavoro.
Il messaggio di blocco propone l'alternativa (estendere con campi opzionali)
e ricorda che rimuovere il congelamento è una decisione di squadra da
annotare in `app/docs/decisioni.md`.

Il file `.contracts-frozen` **non esiste** a T+0:15: si crea a mano a T+1:40.
Il congelamento è un atto esplicito, con un'ora precisa.

### Due proprietà comuni, non negoziabili

- **Veloci**: il primo filtra per percorso e lancia solo i due test dei
  guardrail, non l'intera suite; il secondo fa un `existsSync`.
- **Non bloccano mai per errore**: qualunque problema dello script stesso —
  `node_modules` assenti, JSON malformato, git mancante — produce `exit 0`.
  Un hook rotto che ferma il lavoro costerebbe più di quanto il vincolo valga.

### E una skill: `/nuovo-agente`

`.claude/skills/nuovo-agente/SKILL.md` crea un agente completo: file in
`agents/`, directory posseduta con `.gitkeep`, voce nella mappa, symlink,
riga in questa tabella. Ha `disable-model-invocation: true`: decidere un
nuovo perimetro è una scelta di squadra, non qualcosa che parte da sola.

---

## Perché questa organizzazione

*Ogni scelta qui sotto nasce da un vincolo, non da una preferenza. Si riempie
durante la giornata, con il vincolo a sinistra e la conseguenza a destra.*

> **Esempio** — Vincolo: la giuria valuta 4 cartelle, 3 delle quali non sono
> l'applicazione. Conseguenza: `presentation/` ha tre agenti dedicati
> (evidence, deck, demo) quanto il prodotto ne ha per il calcolo. Sarebbe
> sproporzionato se il prodotto fosse il fine; non lo è.

- **4 ore.** → …
- **2 persone che devono poter revisionare l'output.** → …
- **4 cartelle valutate, di cui 3 non sono l'applicazione.** → …

---

## La base dello sviluppo

*I sei componenti del substrato, e a che cosa serve ognuno **dopo**
l'hackathon. Il punto centrale: **le regole sono eseguibili, non scritte.**
Si riempie durante la giornata, una riga per componente.*

> **Esempio** — Fixture come verità di riferimento: a T+2:10 il core ha
> cambiato l'arrotondamento dei pesi e la somma non faceva più 10000; il test
> sulla fixture è diventato rosso in dieci secondi. Dopo l'hackathon è il
> punto da cui parte chiunque tocchi il calcolo: si modifica la fixture
> attesa **prima** del codice.

| Componente | Dove | A che cosa serve dopo |
| --- | --- | --- |
| Regole di progetto | `CLAUDE.md` | … |
| Contratti congelati | `app/types/contracts.ts` + `.contracts-frozen` | … |
| Ruoli e confini | `agents/*.md` | … |
| Fixture come verità di riferimento | `app/fixtures/` | … |
| Guardrail e test come vincoli eseguibili | `app/src/guardrails/`, `app/tests/` | … |
| Traccia come memoria del processo | `agents/trace.md` | … |

---

## Come si evolve

*La ricetta per chi arriva dopo. Quattro righe, non un capitolo.*

1. **Nuova capability** → si descrive il perimetro in una frase. Se servono
   due frasi, sono due agenti.
2. **Nuovo agente** → `/nuovo-agente <nome> <perimetro>`.
3. **Nuova directory**, posseduta in esclusiva, registrata in
   `app/scripts/mappa-agenti.mjs` così compare nella traccia.
4. **I contratti si estendono, non si riscrivono**: campo opzionale o tipo
   nuovo. Se serve cambiare una firma esistente, è una decisione di squadra e
   si annota in `app/docs/decisioni.md`.

**Costo di ingresso per una terza persona**: due file da leggere
(`agents/README.md` e `app/types/contracts.ts`) e una directory libera da
scegliere. Nessuna riunione, nessun giro di domande.

> **Esempio** — Il candidato naturale è `02-data-ingest`: perimetro già
> scritto, directory già riservata, contratto di uscita (`DocumentoUtente`)
> già definito. Il core non cambia di una riga.

La misura, non l'affermazione: `npm --prefix app run evolution:proof` →
`presentation/evidence/evolution.json` → slide 8.

---

## Cosa abbiamo corretto

*Log dei momenti in cui Claude Code ha preso una direzione sbagliata e di come
è stato riportato in carreggiata. Si scrive quando succede: ricostruito alla
fine, non se lo ricorda nessuno. Tre o quattro voci bastano.*

> **Esempio** — **T+0:20** — Chiesto di generare i testi della UI, ha prodotto
> «Ti conviene ridurre i prelievi allo sportello»: corretto, ma è una
> raccomandazione. Correzione: il lessico dei termini vietati è stato scritto
> **prima** di qualunque testo rivolto all'utente, e agganciato a un hook.
> Da quel momento la stessa deriva è stata bloccata al salvataggio, tre volte,
> senza che nessuno la rileggesse.

- **Dalla conferma manuale alla delega al PM.** Abbiamo costruito gli agenti
  uno alla volta e provato il ciclo su una funzionalità vera — specifica,
  implementazione, verifica — **con noi a confermare fra uno step e l'altro**.
  A ogni fermata correggevamo qualcosa: un perimetro troppo largo, una
  `description` che diceva *che cosa* fa un agente ma non *quando* usarlo, un
  controllo che mancava. Alla seconda configurazione le conferme **tornavano
  tutte**: ci fermavamo, guardavamo, e non c'era niente da correggere.
  Da lì abbiamo delegato al `10-pm` l'orchestrazione degli step di una nuova
  funzionalità.
  **Non abbiamo tolto l'uomo dal ciclo perché era più veloce: l'abbiamo tolto
  quando i controlli avevano smesso di aver bisogno di lui**, e solo là dove
  avevano smesso. Restano alla persona il rifiuto di una spec, la deroga sui
  contratti congelati, e la decisione di presentare qualcosa di rosso.
- **T+…** — …
- **T+…** — …
