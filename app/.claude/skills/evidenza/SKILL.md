---
name: evidenza
description: Esegue lo scenario di una funzionalità, serializza il risultato in presentation/evidence/, cattura gli screenshot con Playwright e rigenera il deck. Da lanciare dopo ogni funzionalità finita, non a fine giornata.
---

# /evidenza — raccogli mentre accade

Da lanciare **subito dopo che una funzionalità è verde**, non alla fine.

Uno screenshot del *before* è impossibile da ricostruire dopo che l'*after*
esiste. La presentazione deve essere **generata da ciò che è successo**, non
ricostruita a memoria negli ultimi venti minuti.

## Percorsi — attenzione, si scrive FUORI dalla radice del developer

Working directory: **`app/`**. Le evidenze vivono un livello sopra.

```bash
ROOT=$(git rev-parse --show-toplevel)
EVIDENCE="$ROOT/presentation/evidence"
SHOTS="$ROOT/presentation/screenshots"
```

Usa sempre `$ROOT`, mai `../presentation/` scritto a mano: `..` è corretto
solo se la sessione è partita esattamente da `app/`, e questa skill deve
funzionare anche se viene invocata dalla radice.

La scrittura fuori da `app/` è **autorizzata** in `app/.claude/settings.json`:
è l'unica eccezione al perimetro del product developer, e c'è perché senza
evidenza il lavoro fatto non è dimostrabile.

## Passo 1 — esegui lo scenario e serializza

Prendi la funzionalità dalla spec in `docs/features/NN-*.md`, eseguila sulla
fixture di riferimento e scrivi il risultato come JSON in `$EVIDENCE/`.

| File | Contenuto | Slide |
| --- | --- | --- |
| `capability.json` | che cosa calcola, su quali voci, con quale agente e quale test | 5 |
| `persona.json` | `nome`, `descrizione`, `puntoDiBlocco` | 2 |
| `comprehension.json` | prima / dopo / delta / numeroPartecipanti / limitiDichiarati | 9 |

La forma dei campi è nel tipo `Evidence` di `types/contracts.ts`. Non
inventare campi: il deck legge quelli.

**Nessun numero scritto a mano.** Ogni cifra deve venire da un'esecuzione
reale. Se un dato non c'è ancora, non scrivere il file: il deck mostrerà un
placeholder visibile, che è preferibile a un numero inventato.

## Passo 2 — screenshot

```bash
npm run capture
```

Playwright scrive in `$SHOTS/`. Attesi:

- `01-schermata-principale.png`
- `02-before.png` — il documento così com'è → slide 4
- `03-after.png` — la lettura calcolata → slide 4
- `04-test-rosso.png` — il guardrail che rompe la build → slide 6, **piano B
  della demo dal vivo**

Se Playwright non ha i browser installati, **non fallire**: dillo, salta il
passo e prosegui. Uno screenshot mancante costa un placeholder; una skill che
si pianta costa il flusso di lavoro.

## Passo 3 — traccia e deck

```bash
npm run agents:trace     # agents/trace.md + evidence/process.json
npm run deck             # presentation/deck.html
```

`agents:trace` va rilanciato qui perché i commit appena fatti devono comparire
nella traccia: è l'evidenza primaria del progetto.

## Esito

Stampa che cosa è stato scritto e **che cosa manca ancora**:

```
Evidenze aggiornate:
  capability.json     scritto
  persona.json        già presente, invariato
  comprehension.json  MANCANTE — slide 9 mostrerà un placeholder
  screenshot          3 su 4 (manca 04-test-rosso.png)
  deck                9 slide rigenerate
```

L'elenco di ciò che manca è la parte utile: dice che cosa fare nei prossimi
dieci minuti.
