# agents/trace.md — traccia di esecuzione reale

> Generato da `npm run agents:trace`. **Non modificare a mano**: è l'evidenza,
> non il racconto. Rigenerato a ogni checkpoint e prima della consegna.
>
> Ultima generazione: 2026-09-14T10:32:34.412Z


## Chi ha fatto che cosa

| Agente | Directory posseduta | File toccati | Commit | Primo commit | Ultimo commit |
| --- | --- | --- | --- | --- | --- |
| `00-architect` | `app/fixtures/` | 85 file | 6 | be076c69 2026-09-14T11:18:34+02:00 | b45da286 2026-09-14T12:25:03+02:00 |
| `01-core-engine` | `app/src/core/` | 2 file | 1 | be076c69 2026-09-14T11:18:34+02:00 | be076c69 2026-09-14T11:18:34+02:00 |
| `02-data-ingest (NON ATTIVATO)` | `app/src/ingest/` | 1 file | 1 | be076c69 2026-09-14T11:18:34+02:00 | be076c69 2026-09-14T11:18:34+02:00 |
| `03-ui-builder` | `app/src/ui/` | 5 file | 3 | be076c69 2026-09-14T11:18:34+02:00 | 990acfc7 2026-09-14T11:55:17+02:00 |
| `04-guardrail-officer` | `app/src/guardrails/` | 7 file | 2 | be076c69 2026-09-14T11:18:34+02:00 | 35def0f8 2026-09-14T11:25:38+02:00 |
| `05-impact-analyst` | `app/src/assessment/` | 1 file | 1 | be076c69 2026-09-14T11:18:34+02:00 | be076c69 2026-09-14T11:18:34+02:00 |
| `06-evidence-collector` | `presentation/evidence/` | 5 file | 1 | be076c69 2026-09-14T11:18:34+02:00 | be076c69 2026-09-14T11:18:34+02:00 |
| `07-deck-builder` | `presentation/` | 3 file | 2 | be076c69 2026-09-14T11:18:34+02:00 | 990acfc7 2026-09-14T11:55:17+02:00 |
| `08-demo-director` | `presentation/demo-script.md` | 1 file | 1 | be076c69 2026-09-14T11:18:34+02:00 | be076c69 2026-09-14T11:18:34+02:00 |
| `09-doc-funzionale` | `app/docs/features/` | 1 file | 1 | 35def0f8 2026-09-14T11:25:38+02:00 | 35def0f8 2026-09-14T11:25:38+02:00 |

**Totali** — agenti attivi: 10 / 10 · commit complessivi: 6

## Durata osservata per fascia oraria

| Fascia | Minuti di attività osservata |
| --- | --- |
| 0:00-0:30 architect da solo | 25 |
| 0:30-1:40 wave 1 | 30 |
| 1:40-1:50 checkpoint e congelamento contratti | 0 |
| 1:50-2:45 wave 2 | 0 |
| 2:45-4:00 feature freeze e consegna | 0 |

## Dettaglio dei file per agente

### 00-architect

- `.claude/agents/00-architect.md`
- `.claude/agents/01-core-engine.md`
- `.claude/agents/02-data-ingest.md`
- `.claude/agents/03-ui-builder.md`
- `.claude/agents/04-guardrail-officer.md`
- `.claude/agents/05-impact-analyst.md`
- `.claude/agents/06-evidence-collector.md`
- `.claude/agents/07-deck-builder.md`
- `.claude/agents/08-demo-director.md`
- `.claude/hooks/benvenuto-developer.mjs`
- `.claude/hooks/contratti-congelati.mjs`
- `.claude/hooks/guardrail-dopo-modifica.mjs`
- `.claude/hooks/tipi-dopo-modifica.mjs`
- `.claude/rules/procedura-sviluppo.md`
- `.claude/rules/scrittura-e-accessibilita.md`
- `.claude/rules/standard-codice.md`
- `.claude/settings.json`
- `.claude/skills/annulla/SKILL.md`
- `.claude/skills/avvia/SKILL.md`
- `.claude/skills/diagnosi/SKILL.md`
- `.claude/skills/evidenza/SKILL.md`
- `.claude/skills/guarda/SKILL.md`
- `.claude/skills/implementa/SKILL.md`
- `.claude/skills/nuovo-agente/SKILL.md`
- `.claude/skills/nuovo-agente/template-agente.md`
- `.claude/skills/prepara/SKILL.md`
- `.claude/skills/spec/SKILL.md`
- `.claude/skills/spec/template.md`
- `.claude/skills/verifica/SKILL.md`
- `.gitignore`
- `CLAUDE.md`
- `README.md`
- `agents/00-architect.md`
- `agents/01-core-engine.md`
- `agents/02-data-ingest.md`
- `agents/03-ui-builder.md`
- `agents/04-guardrail-officer.md`
- `agents/05-impact-analyst.md`
- `agents/06-evidence-collector.md`
- `agents/07-deck-builder.md`
- `agents/08-demo-director.md`
- `agents/README.md`
- `agents/trace.md`
- `app/.claude/agents/01-core-engine.md`
- `app/.claude/agents/03-ui-builder.md`
- `app/.claude/agents/04-guardrail-officer.md`
- `app/.claude/agents/05-impact-analyst.md`
- `app/.claude/rules/procedura-sviluppo.md`
- `app/.claude/rules/scrittura-e-accessibilita.md`
- `app/.claude/rules/standard-codice.md`
- `app/.claude/settings.json`
- `app/.claude/skills/annulla/SKILL.md`
- `app/.claude/skills/avvia/SKILL.md`
- `app/.claude/skills/diagnosi/SKILL.md`
- `app/.claude/skills/evidenza/SKILL.md`
- `app/.claude/skills/guarda/SKILL.md`
- `app/.claude/skills/implementa/SKILL.md`
- `app/.claude/skills/prepara/SKILL.md`
- `app/.claude/skills/spec/SKILL.md`
- `app/.claude/skills/spec/template.md`
- `app/.claude/skills/verifica/SKILL.md`
- `app/.gitignore`
- `app/CLAUDE.md`
- `app/COME-LAVORARE.md`
- `app/docs/brief.md`
- `app/docs/decisioni.md`
- `app/docs/verifica-struttura.md`
- `app/fixtures/estratto-conto-trimestrale.atteso.json`
- `app/fixtures/estratto-conto-trimestrale.input.json`
- `app/index.html`
- `app/package-lock.json`
- `app/package.json`
- `app/playwright.config.ts`
- `app/scripts/agents-sync.mjs`
- `app/scripts/agents-trace.mjs`
- `app/scripts/dev-server.mjs`
- `app/scripts/evolution-proof.mjs`
- `app/scripts/guarda.mjs`
- `app/scripts/mappa-agenti.mjs`
- `app/scripts/prepara.mjs`
- `app/scripts/verify-roots.mjs`
- `app/src/main.tsx`
- `app/tsconfig.json`
- `app/types/contracts.ts`
- `app/vite.config.ts`

### 01-core-engine

- `app/src/core/formatoIt.ts`
- `app/src/core/index.ts`

### 02-data-ingest (NON ATTIVATO)

- `app/src/ingest/.gitkeep`

### 03-ui-builder

- `app/src/ui/App.tsx`
- `app/src/ui/Testo.tsx`
- `app/src/ui/stringheUtente.ts`
- `app/src/ui/styles.css`
- `app/src/ui/testi.ts`

### 04-guardrail-officer

- `app/src/guardrails/index.ts`
- `app/src/guardrails/lessico.ts`
- `app/src/guardrails/verificaTestoUtente.ts`
- `app/tests/assessment.test.ts`
- `app/tests/core.test.ts`
- `app/tests/guardrails.test.ts`
- `app/tests/lessico-ui.test.ts`

### 05-impact-analyst

- `app/src/assessment/index.ts`

### 06-evidence-collector

- `app/tests/e2e/capture.spec.ts`
- `presentation/evidence/.gitkeep`
- `presentation/evidence/evolution.json`
- `presentation/evidence/process.json`
- `presentation/screenshots/.gitkeep`

### 07-deck-builder

- `presentation/.gitignore`
- `presentation/build-deck.ts`
- `presentation/deck.html`

### 08-demo-director

- `presentation/demo-script.md`

### 09-doc-funzionale

- `app/docs/features/TEMPLATE.md`

## Momenti di correzione

Da tenere aggiornato a mano durante la giornata (è l'unica parte non
generata): vedi la sezione "Cosa abbiamo corretto" in `agents/README.md`.
