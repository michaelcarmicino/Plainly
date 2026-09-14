---
name: task-file
description: Prende uno o più file markdown di task, incollandone i percorsi, li corregge nel formato del backlog anche se sono scritti in tutt'altro modo, e li carica. Usala quando i task stanno già in file tuoi e non vuoi spostarli né riscriverli.
---

# /task-file — incolla i percorsi, ci pensa lui

Come `/task-cartella`, ma **senza spostare niente**: i file restano dove sono,
tu incolli i percorsi.

## Uso

```
/task-file docs/note/riunione.md
/task-file ../appunti/sprint.md docs/note/idee.md
/task-file C:\Users\...\task-da-fare.md
```

Percorsi relativi a **`app/`**, oppure assoluti. Più di uno, separati da spazi.

## Che cosa fa

```bash
node scripts/pm-carica.mjs --file <percorso> <percorso> …
```

Legge ogni file, ne ricava i task, e li scrive in `docs/backlog/` nel formato
giusto: numerazione progressiva, slug, scheletro. **Gli originali non vengono
toccati né spostati**: restano tuoi.

Un file con **un titolo `#`** diventa **un task**; un file di sole righe
diventa **un task per riga**. Righe vuote, intestazioni e trattini di elenco
vengono ripuliti.

## Se il task non è come serve, lo correggi

È il punto della skill: **il file di partenza non deve essere nel formato
giusto.** Dopo lo script, apri ogni task creato in `docs/backlog/` e sistemalo:

| Campo | Che cosa ci vuole |
| --- | --- |
| titolo | comprensibile da solo, non un appunto |
| `## Obiettivo` | che cosa deve essere vero quando è finito |
| `directory` | **l'impronta**: le directory che il task tocca |
| `dipende-da` | solo se serve il **risultato** di un altro task, non se «viene dopo» |

Se un file contiene dieci righe e solo tre sono task veri — le altre sono note,
decisioni, o cose già fatte — **scarta le altre e dillo**. Caricare rumore nel
backlog è peggio che non caricarlo: il piano lo pianifica.

### Se il file è un documento unico, decomponilo

Un documento che descrive tutto il prodotto caricato come **un task solo** non
serve a pianificare niente. Spezzalo nei deliverable che descrive davvero, uno
per task, con **il rimando alla sezione d'origine** su ciascuno.

### L'impronta: non indovinarla, ottienila

Lo script ne propone una quando il titolo è riconoscibile, e la marca come
proposta. Tu la confermi leggendo la specifica in `docs/features/`.

**Se la specifica non esiste, lancia `/spec`**: è lo strumento che produce
l'impronta. Non lasciare il task fermo in attesa che qualcuno decida.

> Indovinare con chi un task confligge produce esattamente il conflitto che il
> PM esiste per evitare — ma **ottenere** l'impronta lanciando `/spec` non è
> indovinare, è fare il lavoro.

## Che cosa riportare

Per ogni file di origine: quanti task ne sono usciti e quante righe hai
scartato, con il motivo. Poi l'elenco dei task con impronta **confermata**,
**proposta**, o **mancante**. Infine:

```bash
npm run pm:piano
```
