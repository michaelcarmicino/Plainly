# Specifiche scartate — doppioni da sessione parallela

Queste sei specifiche sono state scritte da una **seconda sessione Claude Code**
che lavorava sullo stesso backlog nello stesso momento. Per sei task su tredici
esistevano due specifiche con lo stesso numero, slug diverso e **piano tecnico
incompatibile**.

Sono archiviate, non cancellate: contengono lavoro reale, e la traccia di come
il conflitto è nato vale più dello spazio che occupano.

| Numero | Archiviata qui | Tenuta in `docs/features/` |
| --- | --- | --- |
| 08 | `08-simulatore-netto-in-busta.md` | `08-simulatore-netto-in-busta-paga.md` |
| 09 | `09-fondo-di-emergenza.md` | `09-mesi-coperti-dai-risparmi.md` |
| 10 | `10-rata-del-mutuo.md` | `10-simulatore-rata-mutuo-fisso-variabile.md` |
| 11 | `11-approfondimento-mutuo.md` | `11-approfondimento-sul-mutuo.md` |
| 12 | `12-approfondimento-investimenti.md` | `12-guida-al-foglio-prima-di-firmare.md` |
| 13 | `13-tabella-fonti-dati.md` | `13-tabella-fonti-dati-sorgente-unica.md` |

## Perché hanno vinto le altre

Le specifiche tenute sono **committate e referenziate dal backlog**: il campo
`directory` di ogni task punta a loro, ed è su quelle impronte che
`npm run pm:piano` calcola le ondate. Sostituirle avrebbe richiesto di rifare
il piano da capo.

Non erano differenze di nome. La `13` archiviata mette il dato in `fixtures/`
dove quella tenuta lo mette in `src/core/`: due directory diverse significano
due impronte, due agenti incaricati e due branch che non si uniscono.

## Un caso che non è solo duplicazione

`12-approfondimento-investimenti.md` **nomina gli strumenti e attribuisce a
ciascuno un livello di rischio**. Sono due delle cose che il vincolo del
progetto vieta in modo non negoziabile: un semaforo su un prodotto finanziario
è una raccomandazione di investimento.

Il task 12 nella sua forma originale era già stato **rifiutato** da `/spec` al
criterio 1, con il motivo scritto in `docs/backlog/12-approfondimento-sugli-investimenti.md`.
La versione tenuta è la variante conforme approvata: la guida al KID, che
mostra la riga dei sette valori senza segnarne nessuno, perché un «4 su 7»
stampato verrebbe letto come il valore normale.

**Nota per chi legge il lessico automatico e si fida.** È stato verificato due
volte oggi, su due funzionalità diverse: le frasi che raccomandano in terza
persona passano `src/guardrails/lessico.ts` senza essere bloccate. Le radici
vietate coprono l'imperativo diretto. Su questa famiglia di task l'unico
cancello è `/spec`, e nessun test lo sostituisce.
