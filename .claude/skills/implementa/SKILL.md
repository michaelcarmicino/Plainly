---
name: implementa
description: Prende una spec approvata in docs/features/ e la realizza instradando il lavoro verso i subagent nell'ordine contratti, core-engine, ui-builder, guardrail-officer. Si ferma se servono modifiche ai contratti congelati.
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

## Passo 0-bis — leggi i criteri di accettazione

Nel file della spec, sotto `## Previsto`, l'agente `doc-funzionale` ha scritto
**«Come si proverà»**: i passi esatti per vedere la funzionalità funzionare.

**Trattali come parte della richiesta, non come documentazione.** Sono la
definizione operativa di «funziona»: chi costruisce deve sapere in anticipo su
che cosa verrà misurato.

Riportali in testa al lavoro, così restano sotto gli occhi:

```
Criteri di accettazione (da docs/features/NN-nome.md):
  1. ...
  2. ...
```

Leggi anche **`docs/test/NN-nome.md`**, se esiste: è la lista dei casi che
`tester` ha derivato dalla specifica. Vale la stessa regola — **è parte della
richiesta**, non documentazione. Riporta in particolare i casi limite e gli
errori attesi: è la differenza fra costruire il percorso nominale e costruire
qualcosa che regge.

Se quelle sezioni non ci sono ancora, `doc-funzionale` e `tester` stanno
ancora scrivendo: aspetta che compaiano. Se non compaiono affatto, `/spec` non
è stata confermata — fermati e dillo.

**Funzionalità già in corso prima che questi agenti esistessero:** se non
trovi né la scheda né la lista dei casi, **prosegui lo stesso** e segnalalo.
Non bloccare lavoro già avviato per un passo introdotto dopo.

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

## Passo 2 — riconciliazione della documentazione, obbligatoria

Quando il codice è verde, richiama `doc-funzionale` in **fase 2**. Non è
facoltativa e non è saltabile: senza, la documentazione resta una promessa
scritta al futuro, e il progetto si ritrova con dei file che descrivono ciò
che era stato previsto invece di ciò che esiste.

L'agente verifica ogni affermazione leggendo codice e test, riscrive **al
presente** solo ciò che ha confermato, **esegue davvero** i passi di «come si
prova», registra le divergenze fra previsto e realizzato con il motivo, porta
lo stato a `implementato` e rigenera l'indice con `npm run docs:funzionali`.

Nello stesso momento richiama **`tester` in fase 2**, se esiste una lista di
casi: implementa i casi in `tests/accettazione/`, li esegue, e scrive il
referto con atteso, ottenuto, esito e file di test per ciascuno.

**Se un caso fallisce, `tester` non corregge il codice.** Lo riporta, con
l'input che lo produce, classificato bloccante o no. Un caso non implementabile
si marca `non coperto` **con il motivo**: un buco dichiarato vale più di un
test finto che passa.

Due cose che devono restare chiare:

- **Se i passi di «come si prova» non funzionano, la funzionalità non è
  finita.** Non si aggiusta la documentazione per farla combaciare.
- **Le divergenze si segnalano, non si appianano.** Riscrivere la previsione
  per farla corrispondere al risultato rende inutile tutto l'esercizio.

## Passo 3 — chiudi con il conto delle directory

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
