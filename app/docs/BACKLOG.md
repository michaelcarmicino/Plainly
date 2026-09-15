# Backlog

> **File generato.** Si rigenera con `npm run pm:piano`. Le fonti sono i
> file in `docs/backlog/`.
>
> Ultima generazione: 2026-09-15T12:50:16.929Z

## Stato

| Task | Stato | Titolo | Directory toccate | Dipende da |
| --- | --- | --- | --- | --- |
| `01-landing-page` | fatto | 01 — La landing page: tre porte e una navigazione che non cambia mai | `src/ui/`, `tests/` | — |
| `02-catalogo-domande-reali-per-macrocategoria` | fatto | 02 — Le domande vere, e che cosa il sito sa rispondere | `src/ui/`, `src/guardrails/`, `tests/` | — |
| `03-pagina-di-spiegazione-struttura-riusabile` | da-fare | 03 — La pagina che risponde a una domanda: il contenitore, non il contenuto | `src/ui/`, `tests/` | 01-landing-page |
| `04-guida-interattiva-busta-paga` | da-fare | 04 — Guida interattiva alla busta paga | `types/`, `fixtures/`, `src/core/`, `src/ui/`, `tests/` | — |
| `05-guida-interattiva-bolletta-luce-gas` | da-fare | 05 — Guida interattiva alla bolletta della luce | `src/core/`, `src/ui/`, `fixtures/`, `tests/` | — |
| `06-guida-interattiva-dichiarazione-730` | da-fare | 06 — Guida interattiva alla dichiarazione 730 | `types/`, `fixtures/`, `src/core/`, `src/ui/`, `tests/` | — |
| `07-valore-dei-risparmi-nel-tempo` | fatto | 07 — Quanto valgono davvero i miei soldi fra qualche anno | `src/core/`, `src/ui/`, `tests/` | 01-landing-page |
| `08-simulatore-netto-in-busta-paga` | da-fare | 08 — Quanto mi resta davvero in busta | `src/core/`, `src/ui/`, `tests/` | — |
| `09-simulatore-fondo-di-emergenza` | da-fare | 09 — Per quanti mesi bastano i soldi che ho da parte | `src/core/`, `src/ui/`, `tests/` | — |
| `10-simulatore-rata-mutuo-fisso-variabile` | da-fare | 10 — Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove | `src/core/`, `src/ui/`, `tests/` | — |
| `11-approfondimento-sul-mutuo` | da-fare | 11 — Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta | `src/core/`, `src/ui/`, `src/guardrails/`, `tests/` | 03-pagina-di-spiegazione-struttura-riusabile, 10-simulatore-rata-mutuo-fisso-variabile |
| `12-approfondimento-sugli-investimenti` | da-fare | 12 — Approfondimento sugli investimenti | `src/core/`, `src/ui/`, `tests/` | 01-landing-page, 04-guida-interattiva-busta-paga, 07-valore-dei-risparmi-nel-tempo |
| `13-tabella-fonti-dati-sorgente-unica` | fatto | Tabella fonti dati sorgente unica | `src/core/`, `src/ui/`, `tests/` | — |
| `14-registro-delle-schermate` | fatto | Registro delle schermate | `src/ui/`, `tests/` | — |

**Totali** — da fare: 9 · in corso: 0 · fatti: 5 · bloccati: 0

## Piano di esecuzione

Dentro un'ondata le directory sono **disgiunte**: i task si lanciano insieme.
Fra un'ondata e l'altra si aspetta, perché le impronte si sovrappongono.

> Il calcolo è per cartella dichiarata. È affinato solo dove una convenzione
> è stata **provata** con una specifica e un test — oggi solo `src/ui/`
> (`docs/decisioni.md`, D31): il punto di contatto rimasto,
> `src/ui/testi.ts`, non forza l'ondata perché il PM lo applica fuori
> dall'ondata, in un passaggio unico. Altrove il calcolo resta per cartella
> intera e **può sovrastimare** i conflitti reali — non li sottostima mai.

**Cartelle affinate:**

- `src/ui/` — punto di contatto `src/ui/testi.ts` (docs/features/14-registro-delle-schermate.md, sezione 5; D31)

### Ondata 1 — 1 in parallelo

- `03-pagina-di-spiegazione-struttura-riusabile` 03 — La pagina che risponde a una domanda: il contenitore, non il contenuto
  - tocca: `src/ui/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`03-pagina-di-spiegazione-struttura-riusabile`)

### Ondata 2 — 1 in parallelo

- `04-guida-interattiva-busta-paga` 04 — Guida interattiva alla busta paga
  - tocca: `types/`, `fixtures/`, `src/core/`, `src/ui/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`04-guida-interattiva-busta-paga`)

### Ondata 3 — 1 in parallelo

- `05-guida-interattiva-bolletta-luce-gas` 05 — Guida interattiva alla bolletta della luce
  - tocca: `src/core/`, `src/ui/`, `fixtures/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`05-guida-interattiva-bolletta-luce-gas`)

### Ondata 4 — 1 in parallelo

- `06-guida-interattiva-dichiarazione-730` 06 — Guida interattiva alla dichiarazione 730
  - tocca: `types/`, `fixtures/`, `src/core/`, `src/ui/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`06-guida-interattiva-dichiarazione-730`)

### Ondata 5 — 1 in parallelo

- `08-simulatore-netto-in-busta-paga` 08 — Quanto mi resta davvero in busta
  - tocca: `src/core/`, `src/ui/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`08-simulatore-netto-in-busta-paga`)

### Ondata 6 — 1 in parallelo

- `09-simulatore-fondo-di-emergenza` 09 — Per quanti mesi bastano i soldi che ho da parte
  - tocca: `src/core/`, `src/ui/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`09-simulatore-fondo-di-emergenza`)

### Ondata 7 — 1 in parallelo

- `10-simulatore-rata-mutuo-fisso-variabile` 10 — Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove
  - tocca: `src/core/`, `src/ui/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`10-simulatore-rata-mutuo-fisso-variabile`)

### Ondata 8 — 1 in parallelo

- `11-approfondimento-sul-mutuo` 11 — Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta
  - tocca: `src/core/`, `src/ui/`, `src/guardrails/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`11-approfondimento-sul-mutuo`)

### Ondata 9 — 1 in parallelo

- `12-approfondimento-sugli-investimenti` 12 — Approfondimento sugli investimenti
  - tocca: `src/core/`, `src/ui/`, `tests/`

  Contatto fuori onda — lo applica il PM in un passaggio unico, dopo l'ondata: `src/ui/testi.ts` (`12-approfondimento-sugli-investimenti`)


Registro di ciò che è successo: [`backlog/registro.md`](backlog/registro.md)
