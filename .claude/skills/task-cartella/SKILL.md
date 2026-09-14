---
name: task-cartella
description: Legge i task buttati nella cartella docs/backlog/_in-arrivo/, li sistema nel formato del backlog anche se sono scritti male, e li carica. Usala quando hai degli appunti o dei file di task da far entrare nel progetto senza riscriverli a mano.
disable-model-invocation: true
---

# /task-cartella — svuota la cartella dei task in arrivo

I task arrivano come vengono: un appunto, un elenco puntato, un file di
riunione. **Chiederli già nel formato giusto significa che non li scrive
nessuno.** Tu li butti in una cartella, questa skill li sistema.

## Uso

```
/task-cartella
```

Working directory: **`app/`**. La cartella è **`docs/backlog/_in-arrivo/`**:
metti lì dentro qualunque `.md` o `.txt` e lancia la skill.

## Che cosa fa

```bash
node scripts/pm-carica.mjs
```

Lo script fa la parte meccanica: numerazione progressiva, slug del nome,
scheletro del file, e sposta l'originale in `_in-arrivo/_normalizzati/` così la
cartella resta pulita e non ricarichi due volte le stesse cose.

Un file con **un titolo `#` e più righe** diventa **un task**; un file di sole
righe diventa **un task per riga**.

## Poi sistemi tu quello che lo script non può decidere

Dopo lo script, **leggi ogni file creato in `docs/backlog/`** e sistemalo.
È la parte per cui serve un modello e non un programma:

1. **Il titolo**: se è un appunto sbrigativo («grafico»), riscrivilo in modo che
   si capisca da solo («grafico del peso delle voci sul totale»).
2. **L'obiettivo**: una frase che dica **che cosa deve essere vero quando è
   finito**, non che ripeta il titolo.
3. **L'impronta** — il campo `directory`. È quello che decide tutto.

### Sull'impronta, la regola non si aggira

Lo script **propone** una directory quando il titolo è riconoscibile
(`calcolo`, `somma`, `percentuale` → `src/core/`; `schermata`, `layout`,
`mobile` → `src/ui/`) e la marca come **proposta**. Per gli altri la lascia
vuota.

Tu la confermi **leggendo la specifica** in `docs/features/`, che dichiara le
directory che toccherà.

> **Se la specifica non esiste, non inventare l'impronta.** Lascia il task non
> pianificabile e dì che deve passare da `/spec`. Indovinare con chi un task
> confligge produce esattamente il conflitto che il PM esiste per evitare — e
> lo produce con l'aria di aver funzionato.

## Che cosa riportare

L'elenco dei task creati, e per ciascuno: impronta **confermata**, **proposta
da confermare**, o **mancante**. Poi:

```bash
npm run pm:piano
```

e mostra il piano. Se qualche task è rimasto senza impronta, dillo prima del
piano: quelli non ci sono dentro.
