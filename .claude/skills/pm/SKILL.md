---
name: pm
description: Coordina più funzionalità insieme invece di una alla volta — legge il backlog, calcola quali task possono procedere in parallelo senza toccare gli stessi file, li lancia a ondate e registra cosa è successo. Usala quando hai più cose da fare e non sai in che ordine.
disable-model-invocation: true
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
/pm                     mostra il piano: chi può partire insieme
/pm avvia               lancia la prossima ondata
/pm stato               a che punto siamo, e cosa è successo
/pm aggiungi <nome>     crea un task nel backlog
```

Working directory: **`app/`**.

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

## 3. Lanciare un'ondata

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
