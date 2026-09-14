---
name: implementa
description: Prende una spec approvata in docs/features/ e la realizza instradando il lavoro verso i subagent nell'ordine contratti, core-engine, ui-builder, guardrail-officer. Si ferma se servono modifiche ai contratti congelati.
disable-model-invocation: true
---

# /implementa — dalla spec al codice

Realizza una spec **già approvata**. Se la spec non esiste in
`docs/features/`, fermati e di' di lanciare `/spec`: non improvvisare il
perimetro.

## Percorsi

Working directory: **`app/`**. Radice del repository: `ROOT=$(git rev-parse --show-toplevel)`.

- spec → `docs/features/NN-*.md`
- contratti → `types/contracts.ts`
- sentinella → `$ROOT/.contracts-frozen`
- definizioni degli agenti → `../agents/`

## Passo 0 — il cancello dei contratti

Se la spec dichiara modifiche a `types/` **e** `$ROOT/.contracts-frozen`
esiste: **fermati**.

Non aggirare l'hook, **rendilo leggibile**:

```
FERMO — la spec richiede una modifica ai contratti, che sono congelati.

Congelati il: <contenuto di .contracts-frozen>
Tipo da modificare: <nome>
Perché serve: <una riga dalla spec>

Questa è una decisione dell'architetto, non mia. Due strade:
  1. estendere invece di riscrivere — campo OPZIONALE o tipo nuovo fuori da
     types/ (spesso basta, e non richiede la deroga);
  2. deroga esplicita: l'architetto rimuove .contracts-frozen, annota il
     motivo in docs/decisioni.md, poi ricongela.

Il numero "contratti modificati dopo il freeze" finisce in slide 8.
```

Una skill che disattiva un vincolo lo rende decorativo. Non farlo.

## Passo 1 — instrada, nell'ordine

Delega ai subagent visibili da questa radice, **uno alla volta e in
quest'ordine**. Ogni agente scrive **solo** nella directory che possiede.

| # | Agente | Directory | Che cosa fa |
| --- | --- | --- | --- |
| 1 | *(contratti)* | `types/` | Solo se la spec li estende **e** non sono congelati. Altrimenti salta |
| 2 | `01-core-engine` | `src/core/` | Il calcolo, puro, con il suo test e il valore atteso calcolato a mano |
| 3 | `03-ui-builder` | `src/ui/` | I componenti e le nuove stringhe in `src/ui/testi.ts` |
| 4 | `04-guardrail-officer` | `src/guardrails/`, `tests/` | **Revisione dei testi**: rilegge ogni stringa nuova contro il lessico |

Il passo 4 non è facoltativo: è il punto in cui una formulazione prescrittiva
viene intercettata da qualcuno che non l'ha scritta.

Se un agente ha bisogno di scrivere fuori dalla propria directory, **fermati e
segnalalo**. È il segnale che il perimetro va ridisegnato, non un ostacolo da
aggirare.

## Passo 2 — chiudi con il conto delle directory

Alla fine stampa, ricavandolo da `git diff --name-only`:

```
Directory toccate dal diff: N
  src/core/        3 file
  src/ui/          2 file
  tests/           2 file

Contratti modificati: N     <- se > 0 e i contratti erano congelati, è un errore
```

È lo stesso numero che `evolution:proof` misura per la slide 8: se qui sono
più di due o tre, la funzionalità era più grande di un agente e vale la pena
dirlo.

Poi:

> Fatto. Lancia `/verifica` prima di committare.
