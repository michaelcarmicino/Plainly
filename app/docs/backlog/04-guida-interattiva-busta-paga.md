id: 04-guida-interattiva-busta-paga
stato: da-fare
directory: types/, fixtures/, src/core/, src/ui/, tests/
dipende-da:
note: impronta ricavata da docs/features/04-guida-interattiva-busta-paga.md

# 04 — Guida interattiva alla busta paga

## Obiettivo

Chi tocca una riga del cedolino legge da dove viene quel numero, con
l'etichetta del documento lasciata identica accanto alla spiegazione, e alla
fine sa dire dove vanno i 645,00 € che separano i 2.500,00 € di lordo dai
1.855,00 € che arrivano sul conto: su ogni 100 € di lordo ne arrivano 74,20 €.

## Specifica collegata

`docs/features/04-guida-interattiva-busta-paga.md` — stato: **proposta**.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 3 «Guide interattive», documento 1.

**Cinque directory: è l'impronta più larga del backlog.** Finché è aperto,
nessun altro task che tocchi `src/ui/` o `tests/` può girare in parallelo —
cioè `05`, `06` e `08`. `types/` e `fixtures/` servono solo nei primi minuti e
poi tornano libere.

**Ordine obbligato al proprio interno**: architect (una riga in `types/`, le
due fixture) → core-engine → ui-builder → guardrail-officer.

Richiede **una riga additiva in `types/contracts.ts`**: il valore
`'busta-paga'` manca nell'unione `Scenario`. I contratti non sono congelati,
ma la riga è dell'architetto, non di chi implementa.

Serve una **fixture nuova**: `fixtures/busta-paga-mensile.input.json` e il suo
`.atteso.json`. Nessuna lettura di documenti veri — `02-data-ingest` non è
attivato.

`05` (bolletta) è la stessa meccanica su un altro documento: farlo **dopo**,
non in parallelo, permette di riusare i componenti invece di farli divergere.
