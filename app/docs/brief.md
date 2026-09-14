# Brief — Plainly

> Letto da `/spec` come primo contesto. **L'idea non è ancora congelata**:
> si congela al checkpoint T+1:40 insieme ai contratti.

## Il tema

Educazione alla finanza personale di base. Quattro scenari ammessi, tutti
dentro il tema:

1. **Lettura di una bolletta** — energia, gas, telco
2. **Lettura di un estratto conto** — costi e commissioni di un conto corrente
3. **Budget personale** — entrate e uscite ricorrenti
4. **Simulazione di risparmio** — accantonamento nel tempo

Lo scaffolding regge tutti e quattro: i contratti in `types/contracts.ts`
usano il tipo `Scenario`, e la fixture di riferimento è un estratto conto
perché è quello con le voci più eterogenee — se i contratti reggono lui,
reggono gli altri tre.

## La promessa del prodotto

**Far capire da dove viene ogni numero.** Non far prendere decisioni migliori:
far capire il documento che si ha in mano.

## Cosa il prodotto NON fa, per costruzione

- Non consiglia, non raccomanda, non valuta la situazione personale.
- Non legge documenti automaticamente: si parte da fixture strutturate a mano
  (`../agents/02-data-ingest.md` spiega perché).
- Non chiama nulla a runtime: nessun LLM, nessuna API, nessuna chiave.
- Non offre una chat: a runtime non c'è un modello, e un finto assistente che
  risponde da regole fisse è peggio di nessun assistente.

## La persona

TODO(T+1:40) — una persona concreta, con il documento in mano e il punto
esatto in cui si ferma. Va in `../presentation/evidence/persona.json` e in
slide 2.

## Come si misura che ha funzionato

Stesse domande di comprensione prima e dopo la lettura, punteggio 0–100,
differenza fra i due. Con i limiti dichiarati sulla stessa slide del numero:
campione ridotto, effetto memoria, nessuna selezione casuale.

## Vincoli che una spec non può violare

Sono i quattro motivi di rifiuto di `/spec`:

1. consiglia o raccomanda una scelta;
2. richiede chiamate esterne a runtime;
3. altera il significato di un'informazione originale;
4. è un'interfaccia conversazionale aperta.
