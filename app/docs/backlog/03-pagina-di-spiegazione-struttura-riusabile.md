id: 03-pagina-di-spiegazione-struttura-riusabile
stato: da-fare
directory: src/ui/, tests/
dipende-da: 01-landing-page
note: impronta ricavata da docs/features/03-pagina-di-spiegazione-struttura-riusabile.md

# 03 — La pagina che risponde a una domanda: il contenitore, non il contenuto

## Obiettivo

Pagina di spiegazione, struttura riusabile

## Specifica collegata

`docs/features/03-pagina-di-spiegazione-struttura-riusabile.md` — **proposta**,
scritta con `/spec` il 2026-09-14.

Dichiara gli **otto blocchi** che compongono una pagina di spiegazione, quali
sono obbligatori e in che ordine si montano, e consegna il contenitore più
**una sola** istanza di riferimento. I contenuti delle altre pagine restano ai
task che li riguardano.

## Note

Caricato da `pm:carica`. Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`, sezione 2 «Pagine di spiegazione dei concetti».

**Task strutturale.** `11` e `12` sono sue istanze per intero; `04`, `05` e `06`
lo sono per la parte spiegata di ogni voce di documento. Vanno **dopo**: farli
partire prima significherebbe scrivere due volte lo stesso contenitore, in due
modi diversi, sullo stesso file.

L'impronta `src/ui/` + `tests/` è identica a quella della `01`: **niente che
tocchi `src/ui/` può girare in parallelo con questo task**. `src/core/` viene
solo letta — l'istanza di riferimento riusa `calcolaSimulazioneRisparmio`, già
scritta e coperta da test dalla `07` — quindi resta libera.
