---
name: diagnosi
description: Parte da un sintomo — un test rosso, un numero sbagliato, una schermata che non si comporta come dovrebbe — e ne trova la causa prima di toccare qualsiasi cosa. Usala quando qualcosa non funziona e non sai perché. Non modifica nulla senza conferma.
---

# /diagnosi — capire prima di correggere

Gli agenti di questo progetto sono pensati per **costruire**. Nessuno possiede
il **correggere**, ed è un buco che si sente esattamente quando il lavoro
smette di essere «aggiungere una funzionalità» e diventa «capire perché quella
di prima non va più».

Questa skill copre quel buco.

> **Regola assoluta: non modifichi niente finché non hai una diagnosi.**
> La correzione a tentativi è il modo più veloce per trasformare un difetto in
> tre, e per perdere il punto a cui tornare.

## Uso

```
/diagnosi il totale a schermo è 38,17 ma sul documento c'è 38,20
/diagnosi il test lessico-ui è rosso e non capisco cosa stia segnalando
/diagnosi sul telefono la tabella esce dallo schermo
```

Working directory: **`app/`**.

## I cinque passi, in ordine

### 1. Riproduci il problema

Non fidarti della descrizione: falla accadere.

```bash
npm test                 # se il sintomo è un test o un numero
npx tsc --noEmit         # se il sintomo è un errore di compilazione
```

Se il sintomo è **a schermo**, usa `/guarda` — e guarda davvero lo screenshot,
alla larghezza in cui il problema si manifesta.

Se non riesci a riprodurlo, **fermati e dillo**. Un difetto non riproducibile
non si corregge: si circoscrive. Chiedi i passi esatti.

### 2. Individua la directory, e quindi l'agente

La directory in cui vive il problema dice chi lo possiede:

| Sintomo | Directory | Agente |
| --- | --- | --- |
| un numero è sbagliato, una somma non torna | `src/core/` | `core-engine` |
| il testo, il layout, la leggibilità | `src/ui/` | `ui-builder` |
| una parola rivolta all'utente viene bloccata | `src/guardrails/` | `guardrail-officer` |
| il punteggio della comprensione | `src/assessment/` | `impact-analyst` |

> **Se il sintomo riguarda un numero sbagliato, il sospetto va prima al core e
> ai suoi test, mai alla UI.** L'interfaccia non calcola: non può produrre un
> numero sbagliato, può solo mostrarne uno che ha ricevuto. Cercare in
> `src/ui/` un numero errato è il modo più comune di perdere venti minuti.
>
> L'unica eccezione è la **formattazione**: `38,17` mostrato come `3817` è un
> problema di `formatoIt.ts`, che sta comunque nel core.

### 3. Confronta con l'ultimo stato verde

```bash
git log --oneline -12
git diff HEAD~1 --stat          # che cosa è cambiato per ultimo
git diff HEAD~1 -- src/core/    # il dettaglio nella directory sospetta
```

Se il difetto non c'era prima, **è in quel diff**. È quasi sempre più veloce
che leggere il codice dall'inizio.

Per trovare il punto esatto in cui si è rotto:

```bash
git stash && git checkout HEAD~3 -- src/ && npm test   # e poi torna indietro
```

Se lo fai, **ricordati di ripristinare**: `git checkout HEAD -- src/`.

### 4. Formula la diagnosi

Scrivila prima di proporre qualsiasi cosa, in questa forma:

```
SINTOMO   che cosa si osserva
CAUSA     il file e la riga, con il perché — non «sembra che»
PROVA     che cosa lo dimostra: il test che fallisce, il valore che esce,
          la riga del diff
CORREZIONE MINIMA   la modifica più piccola che risolve, e perché è la più
          piccola
RISCHIO   che cos'altro tocca, e quale test lo copre
```

Se non hai la **prova**, non hai una diagnosi: hai un'ipotesi. Dillo, e dì
quale verifica servirebbe per confermarla.

### 5. Fermati e chiedi conferma

Non applicare la correzione. Presenta la diagnosi e attendi un sì.

Poi la applica **l'agente che possiede quella directory**, non tu
direttamente: è ciò che tiene in piedi i perimetri anche quando si corregge, e
non solo quando si costruisce.

## Se la correzione richiede di toccare i contratti

`types/` non è tuo e potrebbe essere congelato. Fermati e dillo: è una
decisione dell'architetto. Quasi sempre il difetto si risolve senza toccarli.

## Se dopo la correzione qualcosa peggiora

`/annulla` riporta all'ultimo stato verde. Non accanirti: tornare indietro e
ripartire da una diagnosi migliore costa meno di tre tentativi in fila.
