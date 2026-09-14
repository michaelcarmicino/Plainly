---
name: pm
description: Coordina più funzionalità insieme invece di una alla volta — legge il backlog, calcola quali task possono procedere in parallelo senza toccare gli stessi file, li lancia a ondate e registra cosa è successo. Usala quando hai più cose da fare e non sai in che ordine.
---

# /pm — più funzionalità insieme, senza pestarsi i piedi

`/implementa` lavora su **una specifica alla volta**. Con quattro cose da fare
sono quattro cicli in fila, anche quando tre non si toccano nemmeno.

Questa skill decide **che cosa può andare insieme e che cosa deve andare in
fila**, e tiene il registro.

> **Il parallelismo qui non è gratis.** Due task che scrivono sotto la stessa
> directory producono il guasto peggiore del progetto: il secondo sovrascrive
> il primo, entrambi risultano finiti, e il lavoro perso si scopre molto dopo.
>
> **Due task girano insieme se e solo se le directory che toccano sono
> disgiunte.** Il compito principale di questa skill è rifiutarsi quando non lo
> sono.

## Uso

```
/pm carica              prendi i task come sono e portali nel backlog
/pm                     mostra il piano: chi può partire insieme
/pm avvia               lancia la prossima ondata
/pm stato               a che punto siamo, e cosa è successo
```

Working directory: **`app/`**.

## 0. Caricare i task, come sono

I task arrivano come vengono: una lista incollata, un appunto, un file buttato
in una cartella. **Chiederli già nel formato giusto significa che non li scrive
nessuno.**

```
/pm carica                          normalizza i file in docs/backlog/_in-arrivo/
/pm carica compra latte; paga...    una riga per task
```

Sotto:

```bash
node scripts/pm-carica.mjs --testo "primo task; secondo task"
node scripts/pm-carica.mjs               # legge docs/backlog/_in-arrivo/
node scripts/pm-carica.mjs --controlla   # non scrive, dice solo cosa manca
```

Lo script fa **solo la parte deterministica**: numerazione progressiva, slug,
scheletro del file, archiviazione dell'originale.

### Che cosa NON fa, ed è deliberato

**Non inventa l'impronta.** Per i titoli riconoscibili propone una directory
(`calcolo`, `somma`, `percentuale` → `src/core/`; `schermata`, `layout`,
`mobile` → `src/ui/`) e la marca esplicitamente come **proposta da
confermare**. Per tutti gli altri lascia `directory` **vuota** e li dichiara
**non pianificabili**.

Indovinare con chi un task confligge produce esattamente il conflitto che il PM
esiste per evitare, e lo produce con l'aria di aver funzionato.

### Se il file è un documento unico, decomponilo

Un documento che descrive l'intero prodotto caricato come **un task solo** non
serve a pianificare niente. Spezzalo nei deliverable che descrive davvero, uno
per task, e su ciascuno metti **il rimando alla sezione d'origine**.

Non è una deviazione dal comportamento automatico: **è il comportamento
richiesto.** Un task deve essere qualcosa che un agente può prendere in mano.

### Quando manca l'impronta: non chiedere, ottienila

Per ogni task senza impronta:

1. se **esiste già una specifica** in `docs/features/`, leggila: dichiara le
   directory che toccherà, e quella è l'impronta;
2. se **non esiste, lancia `/spec` tu** sul task. È lo strumento che produce
   l'impronta. **Non fermarti a chiedere quali task specificare per primi:**
   quella è una decisione che puoi prendere, e fermarsi lì rimette l'uomo nel
   ciclo proprio dove non serve.

> **L'impronta non si indovina, si ottiene.** Sono due cose diverse, e la
> seconda non richiede il tuo intervento.

**Il criterio d'ordine, dichiaralo e applicalo:**

- prima i task che **sbloccano il collo di bottiglia**: se una cartella è
  occupata da un lavoro aperto, tutto ciò che la tocca è in fila comunque;
- poi quelli che **si dividono naturalmente fra `src/core/` e `src/ui/`**,
  perché sono gli unici che possono davvero girare in parallelo;
- per ultimi quelli che atterrano tutti sulla stessa cartella: lì l'ordine non
  cambia niente.

Questo criterio è **un'aspettativa finché `/spec` non la conferma**: dopo ogni
specifica, rilancia `npm run pm:piano` e lascia che sia il piano a decidere,
non la previsione.

Poi avvia le ondate.

## 1. Il piano

```bash
npm run pm:piano
```

È **deterministico**: nessuna euristica, nessun modello. Lo stesso backlog dà
sempre lo stesso piano, quindi chiunque può verificarlo.

Compone delle **ondate**: dentro un'ondata le impronte sono disgiunte, fra
un'ondata e l'altra si aspetta. Riporta il piano com'è stampato — inclusa la
riga finale che dice quante ondate invece di quanti passaggi in fila: è la
misura di quello che il coordinamento sta facendo guadagnare.

**Rilancialo ogni volta che il backlog cambia.** Non fidarti della memoria su
quali directory tocca un task.

## 2. Un task

Un file in `docs/backlog/NN-nome.md`:

```
id: 03-grafico-voci
stato: da-fare
directory: src/ui/
dipende-da: 01-calcolo-pesi
```

`directory` è **l'impronta**, ed è il campo che decide tutto. Senza, il task è
**non pianificabile** e il piano lo segnala: non si può sapere con chi
confligge, e indovinare è il modo di sbagliare.

**Non inventarla**: ricavala dalla specifica in `docs/features/`, che dichiara
già le directory che toccherà. Se la specifica non c'è ancora, l'impronta la
si conosce solo dopo `/spec` — e finché non c'è, il task resta fuori dal piano.

## 3. Le conferme le dà il PM, non tu

Quando il lavoro parte da `/pm`, il ciclo **non si ferma ad aspettarti** a ogni
passaggio: il PM approva le spec conformi, fa partire le fasi 1, lancia
`/implementa` e **verifica il risultato**.

È **l'agente che gira di default sul modello più potente disponibile** — oggi
Opus, mentre gli altri usano un modello più leggero: confermare al posto di una
persona richiede **giudizio**, non esecuzione.

**Tre cose restano tue, e il PM si ferma:**

| Situazione | Perché non decide il PM |
| --- | --- |
| **`/spec` ha rifiutato** una funzionalità | È un vincolo di dominio, non una preferenza. Il PM riporta il rifiuto e la variante conforme proposta, e ferma il task |
| Serve **modificare i contratti congelati** | Deroga di squadra, va annotata in `docs/decisioni.md` |
| Si vorrebbe **chiudere con `/verifica` rossa** | È una decisione di chi presenta |

**Come verifica**, in ordine: `/verifica` verde · i passi di «come si prova»
eseguiti · il referto del `tester` letto · il diff confrontato con l'impronta
dichiarata. Se uno solo non regge, il task torna `in-corso` o `bloccato` con il
motivo nel registro.

Se il diff esce dall'impronta, **è l'informazione più utile del giro**: la
specifica dichiarava meno di quanto toccava. Va registrata.

## 4. Lanciare un'ondata

Il ciclo di ogni singolo task **non cambia**: `/spec` se manca la specifica,
poi `/implementa`, che a sua volta instrada gli agenti e richiama
`doc-funzionale` in fase 2. Non inventare un percorso parallelo: cambia solo
**quanti ne partono insieme**.

1. Porta a `in-corso` i task che stai avviando.
2. **Lancia i subagent dell'ondata in un solo messaggio**, così girano davvero
   in parallelo invece che uno dopo l'altro.
3. Registra l'avvio:
   ```bash
   npm run pm:piano -- --registra "ondata 2 avviata: 03-grafico-voci, 04-quadratura"
   ```
4. Alla fine porta a `fatto` quelli conclusi, registra l'esito, e **rilancia il
   piano**.

Non avviare l'ondata successiva finché la precedente non è chiusa: le impronte
sono calcolate su quell'ipotesi.

## 4. Il registro

`docs/backlog/registro.md` è **append-only**: ogni riga è un fatto avvenuto,
non una previsione. Non riscrivere le righe passate, nemmeno per correggere
una stima sbagliata — una stima sbagliata registrata vale più di una corretta
a posteriori.

Registra almeno: avvio ed esito di ogni ondata, ogni task diventato
`bloccato` **con il motivo**, e ogni volta che il piano cambia perché
un'impronta si è rivelata più larga del previsto.

Quest'ultimo è il caso più utile da avere per iscritto: dice che una specifica
dichiarava meno di quanto toccava davvero.

## Quando fermarsi

- **Un task non dichiara le directory** → non pianificabile. Non indovinare.
- **L'impronta si allarga a metà lavoro** → ferma **quel task**, non l'ondata
  intera. Aggiorna, rilancia il piano, registra.
- **Due task confliggono ma servono entrambi subito** → vanno in fila. Se è
  davvero inaccettabile, la risposta è **dividere il task**, non ignorare il
  conflitto.
- **Il piano produce una sola ondata da un task solo** → il backlog è
  sequenziale per natura e qui non c'è niente da guadagnare. **Dillo**, invece
  di fingere parallelismo.
