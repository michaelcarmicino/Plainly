id: 05-guida-interattiva-bolletta-luce-gas
stato: da-fare
directory: src/core/, src/ui/, fixtures/, tests/
dipende-da:
note: impronta ricavata da docs/features/05-guida-interattiva-bolletta-luce-gas.md

# 05 — Guida interattiva alla bolletta della luce

## Obiettivo

Chi ha la bolletta in mano tocca una riga alla volta e vede da dove viene quel
numero: «di 73,92 € che pago, 12,80 € sono gli oneri di sistema — 1,73 € su ogni
10 €». Le etichette restano scritte come sulla carta, nessuna voce sparisce, e
se la somma non torna col totale stampato lo scarto si vede.

## Specifica collegata

`docs/features/05-guida-interattiva-bolletta-luce-gas.md` — stato: **proposta**.

## Note

Caricato da `pm:carica`. Origine:
`docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 3 «Guide interattive», documento 2.

**Serve una fixture nuova** — `fixtures/bolletta-luce-bimestrale.input.json` e
`.atteso.json`, facsimile anonimizzato strutturato a mano. `fixtures/` è della
architetto: è l'ingresso di tutto il resto e non ha conflitti con nessuno,
quindi può partire per prima.

**Non modifica `types/`**: i contratti esistenti (`DocumentoUtente`,
`VoceDocumento`, `LetturaCalcolata`, `QuadraturaTotale`) bastano così come sono.

Questa è la funzionalità che implementa `calcolaLettura`, oggi uno scheletro che
lancia `ErroreCalcolo`. Sblocca `04-guida-interattiva-busta-paga` e
`06-guida-interattiva-dichiarazione-730`, che sono la stessa meccanica su un
altro documento: chiuse dopo la 05 diventano «una fixture più le sue stringhe».

Conflitto di impronta con `13-tabella-fonti-dati-sorgente-unica` (`src/ui/`): i
due non girano in parallelo. `01` e `07` sono chiusi, quindi `src/ui/` e
`tests/` sono liberi.

La bolletta del **gas** resta fuori da questa consegna: è una seconda fixture
sulla stessa schermata, non un secondo schermo.
