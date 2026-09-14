# Conti Chiari — regole di progetto

Valgono per **ogni** agente e ogni skill. Non sono preferenze di stile: sono
i vincoli dell'hackathon, e alcune sono rese eseguibili da hook e test.

## I tre vincoli non negoziabili

### 1. Offline a runtime

Il prodotto **non chiama LLM né API esterne**. Claude Code è lo strumento con
cui costruiamo, non una dipendenza di ciò che costruiamo.

A fine giornata l'app deve girare con il **Wi-Fi spento**: nessun `fetch`
verso l'esterno, nessuna chiave, nessun CDN, nessun font remoto. Font di
sistema o incorporati. La build è statica e si apre da `file://`
(`base: './'` in `vite.config.ts`).

### 2. Spiega e calcola, non consiglia

Vietato produrre raccomandazioni di investimento, consulenza personalizzata o
indicazioni su cosa comprare, vendere o scegliere.

**Nessuna semplificazione può alterare il significato dell'informazione
originale.** In particolare `etichettaOriginale` non si riscrive mai.

Vale anche nei **nomi**: niente `suggerisci`, `consiglia`, `migliore`,
`raccomanda` in nessun identificatore, da nessuna parte nel codice.

Questa regola è eseguibile: `app/src/guardrails/verificaTestoUtente.ts`,
`app/tests/lessico-ui.test.ts`, hook `PostToolUse`. Se il testo che stai
scrivendo non passa, la riformulazione ammessa è accanto al termine vietato
in `app/src/guardrails/lessico.ts`.

### 3. Struttura di consegna

Esattamente quattro elementi **valutati** nella root: `app/`, `agents/`,
`presentation/`, `README.md`. Mai nuove cartelle di progetto nella root: le
note di lavoro vanno in `app/docs/`.
(`CLAUDE.md`, `.claude/` e i `.gitignore` sono infrastruttura di Claude Code,
non cartelle di progetto — vedi `app/docs/decisioni.md`.)

## Dipendenze consentite

`vite`, `react`, `react-dom`, `typescript`, `vitest`, `@playwright/test`
(più `@vitejs/plugin-react` e i `@types` necessari). **Nient'altro.**
Ogni dipendenza in più è un rischio di integrazione in più.

## Il team non è simmetrico

- **L'architetto** tocca contratti (`app/types/`), agenti (`agents/`), hook e
  skill (`.claude/`), guardrail.
- **Il product developer** non tocca niente di tutto questo. Interagisce con
  il progetto **solo attraverso le skill** e non ha bisogno di sapere quanti
  agenti esistono né come si chiamano: **il routing verso l'agente giusto lo
  fa la skill**.

Modello mentale: **una skill è il verbo che l'umano digita, un subagent è il
lavoratore con contesto isolato e una directory in esclusiva.**

Percorso standard del product developer:
`/spec` → `/implementa` → `/verifica` → `/evidenza` → commit.

## Un agente, una directory

Ogni agente possiede una directory **in esclusiva** e non scrive fuori.
Se il lavoro richiede di uscire dal perimetro: **fermarsi e segnalarlo**, non
aggirare. La mappa è in `agents/README.md`, la versione leggibile a macchina
in `app/scripts/mappa-agenti.mjs`.

Motivo: in un hackathon i conflitti non nascono dal codice difficile, nascono
da due agenti che scrivono lo stesso file — e falliscono in silenzio.

## I contratti si congelano a T+1:40

Da quel momento esiste `.contracts-frozen` nella root e un hook `PreToolUse`
**blocca** ogni scrittura sotto `app/types/`.

Dopo il congelamento i contratti **si estendono, non si riscrivono**: campo
opzionale o tipo nuovo nel file dell'agente che ne ha bisogno. Se una firma è
davvero sbagliata è una decisione di squadra: **rivolgersi all'architetto**,
annotare in `app/docs/decisioni.md`, poi ricongelare.

Il numero «contratti modificati dopo il freeze» finisce in slide 8.

## Convenzioni di dominio

- Importi: **interi in centesimi** (`...Cent`). Nessun float nel dominio.
- Percentuali: **punti base** (`...Bp`), 1% = 100 bp.
- Formato italiano (`1.234,56` · `5,90%`): solo nel layer di presentazione,
  con `app/src/core/formatoIt.ts`. Mai `Intl` con locale variabile.
- Il core è **puro**: niente `Date.now()`, niente random, niente I/O. È ciò
  che rende le fixture una verità verificabile.
- Ciò che non si sa calcolare si **dichiara** (`nonClassificate`), non si
  assorbe in «altro» in silenzio.

## Prima di ogni commit

`npm --prefix app test` verde. Oppure `/verifica`, che fa lo stesso più il
controllo offline e il confronto dei contratti con il tag `freeze`.
