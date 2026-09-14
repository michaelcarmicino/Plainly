id: 11-approfondimento-sul-mutuo
stato: da-fare
directory: src/core/, src/ui/, src/guardrails/, tests/
dipende-da: 03-pagina-di-spiegazione-struttura-riusabile, 10-simulatore-rata-mutuo-fisso-variabile
note: impronta ricavata da docs/features/11-approfondimento-sul-mutuo.md

# 11 — Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta

## Obiettivo

Otto schermate — un indice più sette concetti, uno per schermata — che
traducono le parole del mutuo prima di nominarle: chi legge sa dire che della
prima rata da 474,21 € ben 250,00 € sono interessi e solo 224,21 € abbassano il
debito, e che nell'ultima gli interessi sono 1,18 €.

## Specifica collegata

`docs/features/11-approfondimento-sul-mutuo.md` — stato: **approvata**.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 5 «Approfondimento: il Mutuo».

Funzionalità **prevalentemente redazionale**: cinque schermate su otto sono
solo parole. Ma `src/core/` **è** nell'impronta, e il motivo va letto: la specifica
`10` esclude esplicitamente il totale restituito, gli interessi complessivi e
la divisione della singola rata, e li rimanda a questo task. Quei numeri
nascono qui, in `quoteRata.ts`, **sopra** `rataMutuo()` di `10` — la formula
non viene riscritta.

Dipende da `03` **per struttura**: questo approfondimento è un'istanza — sette
volte — della pagina di spiegazione riusabile, non un contenitore nuovo. La
spec `03` lo dichiara a sua volta.
Dipende da `10` **per la formula**: le schermate 1, 3 e 4 si appoggiano
all'ammortamento alla francese. Le quattro schermate senza numeri si scrivono
anche prima; il merge aspetta.

**Impronta più larga del backlog — quattro directory su cinque.** Va
pianificata da sola. Il taglio naturale, se serve stringerla, è staccare le
tre voci di lessico in un intervento separato, ma prima e non dopo.

`src/guardrails/` è nell'impronta per un'aggiunta piccola: tre voci nuove nel
lessico (`cambia banca`, `rinegozia`, `tratta con la banca`), le formulazioni
imperative che su questo tema vengono naturali.

Esclusi di proposito, con il motivo nella spec: i numeri di mercato (TAN e
TAEG medi, Euribor — appartengono al task `13`) e le due statistiche di prova
sociale del documento d'origine.
