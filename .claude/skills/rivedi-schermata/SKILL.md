---
name: rivedi-schermata
description: Fa guardare una schermata da un revisore indipendente — contrasti calcolati, stati mancanti, comprensibilità, testi prescrittivi sfuggiti alla scansione — e propone di applicare i soli rilievi bloccanti. Usala prima di dichiarare finita una schermata.
disable-model-invocation: true
---

# /rivedi-schermata — farla guardare a qualcun altro

Chi ha appena scritto una schermata non è nella posizione di giudicarla: la
guarda con gli occhi di chi sa già cosa dovrebbe fare. Questa skill la fa
guardare a un revisore che non l'ha scritta.

## Uso

```
/rivedi-schermata              la home
/rivedi-schermata /percorso    una pagina specifica
```

Working directory: **`app/`**.

## Che cosa fa

1. Invoca l'agente **`ux-reviewer`**, che cattura la schermata a **390px** e
   **1920px** con `/guarda`, **legge gli screenshot**, calcola i contrasti
   reali e confronta con `.claude/rules/design.md` punto per punto.
2. Scrive il referto in **`docs/ux/NN-schermata.md`**: tre liste
   — **BLOCCANTE**, **DA SISTEMARE**, **MINORE** — più i contrasti calcolati e
   un **verdetto: proiettabile o no**.
3. Ti mostra il referto.
4. Propone di applicare **i soli rilievi BLOCCANTI**, delegando a
   `ui-builder`. **Chiede conferma prima di toccare qualsiasi cosa.**

`ux-reviewer` non ha `Edit` fra i suoi strumenti: non può modificare `src/`
nemmeno volendo. Il confine è tecnico, non una promessa.

## Il limite: due cicli, non di più

> **Massimo due cicli di revisione per schermata.** Dopo il secondo si accetta
> quello che c'è e si va avanti.

L'iterazione visiva senza un limite è un pozzo senza fondo: c'è sempre un
rilievo minore in più, e il terzo giro migliora meno del tempo che costa. Qui
il tempo è la risorsa scarsa.

Se dopo due cicli restano rilievi **bloccanti**, non si va avanti in silenzio:
si dice esplicitamente quali sono e si decide se presentare così.

## Che cosa riportare

Il referto **com'è**, senza riassumerlo: i rilievi sono già scritti per essere
letti in fila.

Poi la domanda, secca: quali BLOCCANTI applichiamo?

## Quando usarla

- **Prima di dichiarare finita una schermata.** Fa parte della definition of
  done: ogni funzionalità con interfaccia ha un referto con verdetto
  *proiettabile*.
- Dopo una modifica che tocca il layout.
- Prima di mostrare qualcosa a qualcuno — che è il momento in cui i difetti si
  vedono comunque, ma davanti a un pubblico.
