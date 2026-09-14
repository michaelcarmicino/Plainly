# app/ — come si scrive il codice qui dentro

Avvio: **`cd app && claude`**. Questa è la radice del product developer.
Da qui sono visibili 4 agenti di costruzione e 4 skill.

I vincoli di governo (offline, «spiega non consiglia», ruoli, scadenze) stanno
in [`../CLAUDE.md`](../CLAUDE.md), che Claude Code legge comunque risalendo.
Qui c'è solo il **come**. Il perché della decomposizione: `../agents/README.md`.

## Stack e comandi

Vite + React + TypeScript + Vitest. Dipendenze consentite: `vite`, `react`,
`react-dom`, `typescript`, `vitest`, `@playwright/test`. Nient'altro.

```bash
npm run dev      # sviluppo
npm test         # suite completa
npm run build    # build statica, apribile da file://
```

## Dove vive cosa

| Cartella | Contenuto | Agente |
| --- | --- | --- |
| `src/core/` | calcolo puro e deterministico | `01-core-engine` |
| `src/ui/` | componenti + `testi.ts` | `03-ui-builder` |
| `src/guardrails/` | lessico vietato, `verificaTestoUtente` | `04-guardrail-officer` |
| `src/assessment/` | misura prima/dopo | `05-impact-analyst` |
| `src/ingest/` | **vuota di proposito** — vedi `../agents/02-data-ingest.md` | — |
| `types/` | contratti — **non si toccano** | architetto |
| `fixtures/` | verità di riferimento dei test | architetto |
| `docs/features/` | le spec approvate, prodotte da `/spec` | tu |

## I tre divieti che contano mentre scrivi

1. **Non toccare `types/` senza passare dall'architetto.** Dopo T+1:40 un hook
   `PreToolUse` blocca la scrittura e te lo dice. Non aggirarlo: chiedi.
2. **Nessuna stringa rivolta all'utente fuori da `src/ui/testi.ts`.** I
   componenti non contengono testo letterale: stampano via `<Testo>`.
3. **Nessuna logica di calcolo nei componenti.** Se ti serve un numero che il
   core non espone, lo chiedi al core — non lo calcoli nel JSX.

Il resto degli standard (strict, niente `any`, centesimi interi, errori come
unione discriminata, max 150 righe per file) è caricato automaticamente da
`.claude/rules/`. Non serve che tu lo ricordi.

## Il ciclo di lavoro

```
/spec  →  conferma  →  /implementa  →  /verifica  →  commit  →  /evidenza
```

Nessuna implementazione senza una spec approvata in `docs/features/`.
Che cosa c'è in `.claude/` e perché: [`COME-LAVORIAMO.md`](COME-LAVORIAMO.md).
