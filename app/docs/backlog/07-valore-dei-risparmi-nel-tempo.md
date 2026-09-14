id: 07-valore-dei-risparmi-nel-tempo
stato: fatto
directory: src/core/, src/ui/, tests/
dipende-da: 01-landing-page
note: impronta ricavata da docs/features/07-valore-dei-risparmi-nel-tempo.md

# 07 — Quanto valgono davvero i miei soldi fra qualche anno

## Obiettivo

Chi digita la somma che ha ferma sul conto e per quanti anni la lascia lì
ottiene una cifra riferita a sé: «i tuoi 10.000 € fra 5 anni comprano quanto
9.057,31 € comprano oggi».

## Specifica collegata

`docs/features/07-valore-dei-risparmi-nel-tempo.md` — stato: **proposta**.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 4, simulatore 1.

Dipende da `01-landing-page` **per conflitto di impronta, non per contenuto**:
entrambi scrivono in `src/ui/` e `tests/`. La parte in `src/core/` non ha
conflitti e potrebbe partire prima.

Blocco aperto: il valore della costante dell'inflazione (media pluriennale NIC
ISTAT) va recuperato da una persona. Non ferma l'implementazione — il core
riceve il tasso come parametro — ma ferma la demo con numeri veri.
