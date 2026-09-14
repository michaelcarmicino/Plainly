id: 10-simulatore-rata-mutuo-fisso-variabile
stato: da-fare
directory: src/core/, src/ui/, tests/
dipende-da:
note: impronta ricavata da docs/features/10-simulatore-rata-mutuo-fisso-variabile.md

# 10 — Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove

## Obiettivo

Chi digita i quattro numeri scritti sul suo preventivo — quanto chiede in
prestito, per quanti anni, il tasso fermo e il tasso di partenza di quello che
si muove — vede le due rate mensili affiancate, la differenza su 12 mesi, e che
cosa succede alla rata a quattro valori di tasso dichiarati come ipotesi.
Affiancate e basta: la schermata non indica nessuna delle due.

## Specifica collegata

`docs/features/10-simulatore-rata-mutuo-fisso-variabile.md` — stato:
**proposta**.

## Note

Caricato da `pm:carica`. Origine:
`docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 4, simulatore 4.

**Il titolo d'origine era «Fisso o variabile: quanto rischio?»**, cioè la
domanda «quale delle due conviene»: non conforme al vincolo di dominio. La
specifica è la variante conforme che `/spec` prescrive — le due opzioni
affiancate con la differenza di costo su 12 mesi, senza indicarne una. Lo slug
resta quello originale per non spezzare il legame fra task, branch e commit.

Impronta identica a `07`, che è chiusa. **Conflitto aperto con `13`**
(`src/ui/`), e quasi certamente con `08` e `09` quando riceveranno la loro
impronta: la parte in `src/core/` è indipendente e può partire in parallelo con
tutto, la schermata no.

Blocco aperto, lo stesso della 07: la scala degli scostamenti del tasso
variabile va costruita su quanto si è mosso storicamente l'Euribor in periodi
comparabili, e quel dato va recuperato e dichiarato da una persona. Non ferma
l'implementazione — il calcolo riceve gli scarti come parametro — ma finché il
periodo non è dichiarato la schermata deve dirlo apertamente.
