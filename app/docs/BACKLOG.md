# Backlog

> **File generato.** Si rigenera con `npm run pm:piano`. Le fonti sono i
> file in `docs/backlog/`.
>
> Ultima generazione: 2026-09-14T14:44:13.742Z

## Stato

| Task | Stato | Titolo | Directory toccate | Dipende da |
| --- | --- | --- | --- | --- |
| `01-landing-page` | fatto | 01 — La landing page: tre porte e una navigazione che non cambia mai | `src/ui/`, `tests/` | — |
| `02-catalogo-domande-reali-per-macrocategoria` | da-fare | 02 — Le domande vere, e che cosa il sito sa rispondere | `src/ui/`, `src/guardrails/`, `tests/` | — |
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
| `13-tabella-fonti-dati-sorgente-unica` | da-fare | Tabella fonti dati sorgente unica | `src/core/`, `src/ui/`, `tests/` | — |

**Totali** — da fare: 11 · in corso: 0 · fatti: 2 · bloccati: 0

## Piano di esecuzione

Dentro un'ondata le directory sono **disgiunte**: i task si lanciano insieme.
Fra un'ondata e l'altra si aspetta, perché le impronte si sovrappongono.

### Ondata 1 — 1 in parallelo

- `02-catalogo-domande-reali-per-macrocategoria` 02 — Le domande vere, e che cosa il sito sa rispondere
  - tocca: `src/ui/`, `src/guardrails/`, `tests/`

### Ondata 2 — 1 in parallelo

- `03-pagina-di-spiegazione-struttura-riusabile` 03 — La pagina che risponde a una domanda: il contenitore, non il contenuto
  - tocca: `src/ui/`, `tests/`

### Ondata 3 — 1 in parallelo

- `04-guida-interattiva-busta-paga` 04 — Guida interattiva alla busta paga
  - tocca: `types/`, `fixtures/`, `src/core/`, `src/ui/`, `tests/`

### Ondata 4 — 1 in parallelo

- `05-guida-interattiva-bolletta-luce-gas` 05 — Guida interattiva alla bolletta della luce
  - tocca: `src/core/`, `src/ui/`, `fixtures/`, `tests/`

### Ondata 5 — 1 in parallelo

- `06-guida-interattiva-dichiarazione-730` 06 — Guida interattiva alla dichiarazione 730
  - tocca: `types/`, `fixtures/`, `src/core/`, `src/ui/`, `tests/`

### Ondata 6 — 1 in parallelo

- `08-simulatore-netto-in-busta-paga` 08 — Quanto mi resta davvero in busta
  - tocca: `src/core/`, `src/ui/`, `tests/`

### Ondata 7 — 1 in parallelo

- `09-simulatore-fondo-di-emergenza` 09 — Per quanti mesi bastano i soldi che ho da parte
  - tocca: `src/core/`, `src/ui/`, `tests/`

### Ondata 8 — 1 in parallelo

- `10-simulatore-rata-mutuo-fisso-variabile` 10 — Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove
  - tocca: `src/core/`, `src/ui/`, `tests/`

### Ondata 9 — 1 in parallelo

- `11-approfondimento-sul-mutuo` 11 — Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta
  - tocca: `src/core/`, `src/ui/`, `src/guardrails/`, `tests/`

### Ondata 10 — 1 in parallelo

- `12-approfondimento-sugli-investimenti` 12 — Approfondimento sugli investimenti
  - tocca: `src/core/`, `src/ui/`, `tests/`

### Ondata 11 — 1 in parallelo

- `13-tabella-fonti-dati-sorgente-unica` Tabella fonti dati sorgente unica
  - tocca: `src/core/`, `src/ui/`, `tests/`


Registro di ciò che è successo: [`backlog/registro.md`](backlog/registro.md)
