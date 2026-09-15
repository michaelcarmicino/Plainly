# Referto dei test

> **File generato.** Si rigenera con `npm run test:referto`. Le fonti sono i
> file in `docs/test/`, scritti dall'agente `tester`.
>
> Ultima generazione: 2026-09-15T08:46:45.881Z

## Quadro d'insieme

| | |
| --- | --- |
| **Casi totali** | 114 |
| **Passati** | 32 |
| **Falliti** | 2 |
| **Non coperti** | 6 |
| **Da eseguire** | 74 |

> **2 casi falliti.** Il dettaglio, con l'input che li produce, è nei referti collegati qui sotto.
> **6 casi non coperti**, dichiarati con il motivo. Sono le cose che sappiamo di non aver verificato, e alimentano i limiti dichiarati.

## Per funzionalità

| Funzionalità | Referto | Casi | Passati | Falliti | Non coperti | Da eseguire |
| --- | --- | --- | --- | --- | --- | --- |
| [02 — casi di prova per «Il catalogo delle domande vere, e che cosa il sito sa rispondere»](test/02-catalogo-domande.md) | sì | 31 | 1 | 1 | 2 | 27 |
| [07 — casi di prova per «Quanto valgono davvero i miei soldi fra qualche anno»](test/07-valore-dei-risparmi.md) | sì | 49 | 2 | 0 | 0 | 47 |
| [13 — casi di prova per «Da dove vengono i numeri di questo sito»](test/13-tabella-fonti-dati.md) | sì | 34 | 29 | 1 | 4 | 0 |


## Come si legge

- **Referto = no** significa che i casi sono stati scritti (fase 1) ma non
  ancora eseguiti (fase 2). È uno stato legittimo mentre si costruisce, non
  alla consegna.
- **Non coperto** è una scelta dichiarata con il motivo, non una dimenticanza.
  Un buco dichiarato vale più di un test finto che passa.
