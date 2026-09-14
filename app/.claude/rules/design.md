# Design

Le decisioni visive si prendono **una volta**, non si ridecidono a ogni
componente. Qui stanno già prese.

## Identità

| Colore | Valore | Usi |
| --- | --- | --- |
| Viola | `#A100FF` | accenti, bordi attivi. **Mai per il testo** su fondo scuro: dà 3.2:1 |
| Viola chiaro | `#BE82FF` | occhielli e titoli minori — 7.0:1, si può usare per il testo |
| Viola scuro | `#460073` | riempimenti |
| Rosa | `#FF50A0` | **solo** limiti ed esclusioni — 6.5:1 |
| Fondo | `#050008` | quasi nero |
| Testo | `#FFFFFF` | 20.4:1 |

Forma: **occhiello maiuscolo con spaziatura ampia** sopra i titoli; titoli con
spaziatura fra lettere **leggermente negativa**; riquadri con **bordo sottile
chiarissimo** su fondo appena più chiaro del nero; angoli arrotondati, **ampi
per i contenitori, stretti per i riquadri interni**.

Il rosa significa qualcosa: **è il colore di ciò che il prodotto non fa**.
Usarlo per decorare toglie senso all'unico posto in cui serve.

## Leggibilità — non negoziabile

| | Soglia |
| --- | --- |
| Corpo | **minimo 16px**, mai sotto |
| Contrasto | **minimo 4.5:1 su ogni testo** |
| Interlinea | almeno **1.5** |
| Larghezza di lettura | massimo **70 caratteri** |

**Le trasparenze molto basse sul nero non passano.** `opacity: 0.4` su bianco
dà circa 3.7:1: sembra elegante sullo schermo a venti centimetri e sparisce a
cinque metri. Se un testo è meno importante, **rendilo più piccolo o spostalo**,
non più trasparente.

Il documento originale dell'evento ha un piè di pagina a **2.04:1**: non va
imitato. È materiale da leggere da vicino, non da proiettare.

Siamo a un hackathon **sull'inclusione**: un'interfaccia inaccessibile è un
autogol che chi valuta nota prima di qualunque funzionalità.

## Interazione

- **Nessuna informazione disponibile solo al passaggio del mouse.** Al
  proiettore e su touch il hover non esiste. Se un dato è visibile solo in
  hover, per metà delle persone quel dato non c'è.
- **Area cliccabile minima 44px**, anche quando l'icona è più piccola.
- **Focus da tastiera sempre visibile.** Non rimuovere `outline` senza
  sostituirlo con qualcosa di altrettanto evidente.
- **Ordine di tabulazione coerente con la lettura.**
- **Nessun contenuto essenziale sotto la piega** alla prima schermata.

## I quattro stati obbligatori

È la parte che si dimentica sempre. Ogni schermata deve esistere in **quattro**
versioni, non solo in quella che funziona:

1. **Vuoto** — nessun dato ancora. Dice che cosa manca e come si ottiene, non
   solo «nessun risultato».
2. **In caricamento** — e non deve far saltare il layout quando arrivano i dati.
3. **Errore** — messaggio in linguaggio umano: «Controlla questo numero, sembra
   troppo alto», non «Errore di validazione nel campo input».
4. **Dati lunghi o numerosi** — etichette che vanno a capo, liste con trenta
   voci, importi a sette cifre. È il caso che rompe le griglie.

> **Una schermata che esiste solo nel caso perfetto non è finita.**

## Numeri

- **Allineati a destra** nelle tabelle.
- **Cifre tabulari** (`font-variant-numeric: tabular-nums`), altrimenti le
  colonne ballano.
- **Unità sempre accanto al valore**: `38,17 €`, non `38,17` con l'euro
  nell'intestazione.
- **Il valore più importante è visivamente più grande degli altri.** Se sono
  tutti uguali, chi guarda non sa dove posare l'occhio.

E la regola che viene da `scrittura-e-accessibilita.md`: **ogni numero ha
accanto il suo paragone concreto**. Una cifra nuda non lascia traccia.
