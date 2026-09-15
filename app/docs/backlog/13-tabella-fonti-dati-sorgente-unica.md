id: 13-tabella-fonti-dati-sorgente-unica
stato: fatto
directory: src/core/, src/ui/, tests/
dipende-da:
note: impronta ricavata da docs/features/13-tabella-fonti-dati-sorgente-unica.md

# Tabella fonti dati sorgente unica

## Obiettivo

Ogni numero mostrato dal sito porta con sé valore, unità, fonte, periodo di
riferimento e data di inserimento — e dichiara se la provenienza è completa o
no. Un registro solo in `src/core/`, e una pagina che lo mostra.

## Specifica collegata

`docs/features/13-tabella-fonti-dati-sorgente-unica.md`

## Note

Caricato da `pm:carica`. Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`, sezione 7 «Fonti dati e piano di aggiornamento».

**L'impronta proposta era `src/ui/`: era sbagliata.** La specifica sposta il
`200` di `src/core/inflazioneDichiarata.ts` dentro il registro, quindi
`src/core/` è toccata e **questo task non può girare in parallelo con nessun
altro che tocchi il core**.

**13 va prima di 08 e di 10**, non dopo: è la struttura che quei due
riempiranno con le fasce di tassazione e con i tassi del mutuo. Costruirli
prima significa che ognuno si risolve a modo suo il problema della provenienza,
ed è esattamente ciò che questo task esiste per impedire.
