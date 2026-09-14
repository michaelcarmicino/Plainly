id: 08-simulatore-netto-in-busta-paga
stato: da-fare
directory: src/core/, src/ui/, tests/
dipende-da:
note: impronta ricavata da docs/features/08-simulatore-netto-in-busta-paga.md

# 08 — Quanto mi resta davvero in busta

## Obiettivo

Chi digita il lordo scritto sulla sua busta paga e quante buste riceve in un
anno ottiene il netto mensile e la scomposizione del lordo in tre pezzi —
contributi, imposta sul reddito, quello che resta — che rimessi insieme fanno
esattamente il lordo di partenza: «con 2.000 € lordi al mese e 13 mensilità,
restano 1.398,47 € al mese; su ogni 100 € lordi ne arrivano 69,92».

## Specifica collegata

`docs/features/08-simulatore-netto-in-busta-paga.md` — stato: **proposta**.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 4, simulatore 2.

Impronta **identica a quella della `07`**: non può girare in parallelo con
nessun task che tocchi `src/ui/` o `tests/` — in particolare `04` (guida alla
busta paga, che da qui è collegata) e i simulatori `09` e `10`. La parte in
`src/core/` non ha conflitti e può partire per prima. `types/` non si tocca:
nessun contratto nuovo, nessun valore aggiunto a `Scenario`.

**Blocco aperto**: aliquote IRPEF, soglie degli scaglioni, aliquota contributiva
INPS e soglia dell'eccedenza vanno recuperate da una persona insieme all'**anno
d'imposta** a cui si riferiscono (Agenzia delle Entrate / Legge di Bilancio per
l'IRPEF, circolare INPS per i contributi). Non ferma l'implementazione — il core
riceve scaglioni e aliquote come parametri, come per il tasso della `07` — ma
ferma la demo con numeri veri. Il modulo che li dichiara,
`src/core/fiscoDichiarato.ts`, è il secondo di provenienza del progetto dopo
`inflazioneDichiarata.ts` e alimenta il task `13`.

Due scostamenti dal documento d'origine, entrambi motivati nella specifica: la
variante «dipendente o forfettario» resta fuori, e il risultato è dichiarato a
schermo come stima che non include detrazioni per lavoro dipendente né
addizionali regionali e comunali.
