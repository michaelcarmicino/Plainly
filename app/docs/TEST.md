# Referto dei test

> **File generato.** Si rigenera con `npm run test:referto`. Le fonti sono i
> file in `docs/test/`, scritti dall'agente `tester`.
>
> Ultima generazione: 2026-09-15T14:38:21.307Z

## Quadro d'insieme

| | |
| --- | --- |
| **Casi totali** | 523 |
| **Passati** | 113 |
| **Falliti** | 56 |
| **Non coperti** | 7 |
| **Da eseguire** | 347 |

> **56 casi falliti.** Il dettaglio, con l'input che li produce, è nei referti collegati qui sotto.
> **7 casi non coperti**, dichiarati con il motivo. Sono le cose che sappiamo di non aver verificato, e alimentano i limiti dichiarati.

## Per funzionalità

| Funzionalità | Referto | Casi | Passati | Falliti | Non coperti | Da eseguire |
| --- | --- | --- | --- | --- | --- | --- |
| [02 — casi di prova per «Il catalogo delle domande vere, e che cosa il sito sa rispondere»](test/02-catalogo-domande.md) | sì | 31 | 28 | 1 | 2 | 0 |
| [03 — casi di prova per «La pagina che risponde a una domanda: il contenitore, non il contenuto»](test/03-pagina-di-spiegazione.md) | sì | 44 | 43 | 1 | 0 | 0 |
| [04 — casi di prova per «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»](test/04-guida-busta-paga.md) | sì | 39 | 0 | 4 | 0 | 35 |
| [05 — casi di prova per «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»](test/05-guida-bolletta.md) | sì | 40 | 1 | 8 | 0 | 31 |
| [06 — casi di prova per «Sul 730 c'è scritto che mi tornano 665 €: da dove esce quel numero?»](test/06-guida-730.md) | sì | 43 | 0 | 7 | 0 | 36 |
| [07 — casi di prova per «Quanto valgono davvero i miei soldi fra qualche anno»](test/07-valore-dei-risparmi.md) | sì | 49 | 2 | 0 | 0 | 47 |
| [08 — casi di prova per «Quanto mi resta davvero in busta»](test/08-simulatore-netto.md) | sì | 49 | 1 | 13 | 1 | 34 |
| [09 — casi di prova per «Per quanti mesi bastano i soldi che ho da parte»](test/09-mesi-coperti.md) | sì | 44 | 6 | 2 | 0 | 36 |
| [10 — casi di prova per «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»](test/10-rata-del-mutuo.md) | sì | 57 | 0 | 2 | 0 | 55 |
| [11 — casi di prova per «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»](test/11-approfondimento-mutuo.md) | sì | 47 | 2 | 5 | 0 | 40 |
| [12 — casi di prova per «Il foglio che ti danno prima di firmare»](test/12-guida-al-foglio.md) | sì | 46 | 1 | 12 | 0 | 33 |
| [13 — casi di prova per «Da dove vengono i numeri di questo sito»](test/13-tabella-fonti-dati.md) | sì | 34 | 29 | 1 | 4 | 0 |


## Come si legge

- **Referto = no** significa che i casi sono stati scritti (fase 1) ma non
  ancora eseguiti (fase 2). È uno stato legittimo mentre si costruisce, non
  alla consegna.
- **Non coperto** è una scelta dichiarata con il motivo, non una dimenticanza.
  Un buco dichiarato vale più di un test finto che passa.
