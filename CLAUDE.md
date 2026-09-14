# Plainly — governo del progetto

Questo file contiene **solo le regole di governo**: vincoli, ruoli, proprietà
delle directory, scadenze, comandi.

**Come si scrive il codice sta in [`app/CLAUDE.md`](app/CLAUDE.md)** e nelle
regole caricate da `app/.claude/rules/`. Non duplicare qui quelle regole.

Chi sono gli agenti e perché la decomposizione è questa:
[`agents/README.md`](agents/README.md).

---

## I tre vincoli non negoziabili

### 1. Offline a runtime

Il prodotto **non chiama LLM né API esterne**. Claude Code è lo strumento con
cui costruiamo, non una dipendenza di ciò che costruiamo. A fine giornata
l'app deve girare con il **Wi-Fi spento**: nessun fetch, nessuna chiave,
nessun CDN, nessun font remoto.

### 2. Spiega e calcola, non consiglia

Vietate raccomandazioni di investimento, consulenza personalizzata, indicazioni
su cosa comprare, vendere o scegliere. **Nessuna semplificazione può alterare
il significato dell'informazione originale.**

Vale anche nei nomi: niente `suggerisci`, `consiglia`, `migliore`,
`raccomanda` in nessun identificatore.

Il vincolo è **eseguibile**: `app/src/guardrails/`, `app/tests/lessico-ui.test.ts`,
hook `PostToolUse` su entrambe le radici.

### 3. Struttura di consegna

Quattro elementi valutati nella root: `app/`, `agents/`, `presentation/`,
`README.md`. **Mai nuove cartelle di progetto nella root**: le note di lavoro
vanno in `app/docs/`. `CLAUDE.md`, `.claude/` e i `.gitignore` sono
infrastruttura, non cartelle di progetto (`app/docs/decisioni.md`, D01).

---

## I due ruoli, e le due radici Claude Code

| | Architetto | Product developer |
| --- | --- | --- |
| Lancia Claude Code da | la **root** del repository | **`cd app && claude`** |
| Tocca | `app/types/`, `agents/`, `.claude/`, guardrail, fixture, script | solo `app/src/`, `app/tests/`, `app/docs/features/` |
| Vede | tutti e 9 gli agenti, la skill `/nuovo-agente` | 4 agenti di costruzione, 4 skill |
| Non deve | — | toccare contratti, agenti, hook, skill |

**Il product developer non ha bisogno di sapere quanti agenti esistono né come
si chiamano: il routing verso l'agente giusto lo fa la skill.**

Modello: **una skill è il verbo che l'umano digita, un subagent è il lavoratore
con contesto isolato e una directory in esclusiva.**

Le skill e i subagent si risolvono sulla **radice della sessione**, non sul
repository: per questo la configurazione è duplicata in `app/.claude/`. Questo
`CLAUDE.md` viene letto comunque da entrambe le radici, risalendo l'albero,
quindi i vincoli di governo arrivano a tutti e due.

---

## Proprietà delle directory

Un agente possiede una directory **in esclusiva** e non scrive fuori. Se il
lavoro richiede di uscire dal perimetro: **fermarsi e segnalarlo**, non
aggirare. Versione leggibile a macchina: `app/scripts/mappa-agenti.mjs`.

| Directory | Agente | Radice |
| --- | --- | --- |
| `app/src/core/` | `01-core-engine` | entrambe |
| `app/src/ingest/` | `02-data-ingest` — **non attivato** | — |
| `app/src/ui/` | `03-ui-builder` | entrambe |
| `app/src/guardrails/`, `app/tests/` | `04-guardrail-officer` | entrambe |
| `app/src/assessment/` | `05-impact-analyst` | entrambe |
| `app/types/`, `app/fixtures/`, `app/scripts/`, `app/docs/`, `agents/`, `.claude/` | `00-architect` | root |
| `presentation/evidence/`, `presentation/screenshots/`, `app/tests/e2e/` | `06-evidence-collector` | root |
| `presentation/build-deck.ts`, `presentation/deck.html` | `07-deck-builder` | root |
| `presentation/demo-script.md` | `08-demo-director` | root |

Motivo: in un hackathon i conflitti non nascono dal codice difficile, nascono
da due agenti che scrivono lo stesso file — e falliscono in silenzio.

---

## Le due scadenze

### T+1:40 — congelamento dei contratti

```bash
echo "congelati a T+1:40" > .contracts-frozen
```

Da quel momento un hook `PreToolUse` **blocca** ogni scrittura sotto
`app/types/`, da entrambe le radici. I contratti **si estendono, non si
riscrivono**: campo opzionale o tipo nuovo nel file dell'agente che ne ha
bisogno. Una deroga è una decisione di squadra: **rivolgersi all'architetto**,
annotare in `app/docs/decisioni.md`, poi ricongelare.

### T+2:45 — feature freeze

```bash
git tag freeze && git switch -c evolution-proof
```

Il branch `evolution-proof` non viene mai unito: la build della demo non deve
mai dipendere dall'esperimento.

---

## Comandi

Dalla root si usano con `--prefix app`; da `app/` senza.

| Comando | Cosa fa |
| --- | --- |
| `npm --prefix app run dev` | app in sviluppo |
| `npm --prefix app test` | suite completa |
| `npm --prefix app run verify:roots` | stato delle due radici Claude Code |
| `npm --prefix app run agents:sync` | riallinea `.claude/` da `agents/` e dalle rules |
| `npm --prefix app run agents:trace` | `agents/trace.md` + `evidence/process.json` |
| `npm --prefix app run evolution:proof` | `evidence/evolution.json` |
| `npm --prefix app run deck` | `presentation/deck.html` |

Formato commit: `tipo(agente): descrizione`, dove `agente` corrisponde a un
file realmente presente in `agents/`.

Prima di ogni commit: `npm --prefix app test` verde, o la skill `/verifica`.
