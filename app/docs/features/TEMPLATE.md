# NN — «nome della funzionalità»

> Modello delle spec. Copia di `.claude/skills/spec/template.md`, tenuta qui
> perché il modulo sia leggibile senza aprire `.claude/`.
> Non compilare questo file: lo copia `/spec` con il numero progressivo.

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: «AAAA-MM-GG» · Agente incaricato: «NN-nome»

## Per chi

«Quale persona. Non "gli utenti": una persona concreta, con il documento che
ha in mano.»

## Quando serve

«Il momento esatto in cui questa funzionalità entra in gioco. Se non riesci a
indicare un momento, la funzionalità non serve.»

## Cosa deve poter fare dopo

«Una frase, dal punto di vista della persona. Che cosa riesce a fare dopo che
prima non riusciva. Deve essere osservabile, non un sentimento.»

## Input

«Quali dati servono, e da dove arrivano. Se arrivano da una fixture, quale.
Se servono dati che oggi non esistono, dillo qui: è un blocco, non un
dettaglio.»

## Elaborazione

«Che cosa calcola, in passi numerati. Ogni passo deve essere verificabile a
mano su un foglio: se non lo è, il test non potrà avere un valore atteso
calcolato a mano, e la regola lo vieta.»

## Output

«Che cosa compare a schermo, e in quale forma. Quali stringhe nuove servono in
`src/ui/testi.ts`.»

## Come si dimostra che ha funzionato

«Il test che la copre, con nome del file. E come si mostra in demo, in dieci
secondi.»

## Cosa questa funzionalità NON fa

«I confini, espliciti. È la sezione che impedisce lo scivolamento di
perimetro a metà implementazione — e la prima che la giuria userà per capire
se sapevamo cosa stavamo escludendo.»

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->


| | |
| --- | --- |
| **Contratti necessari** | «quali tipi di `types/contracts.ts`» |
| **Contratti già congelati?** | «sì / no — se sì e servono modifiche: richiede l'architetto» |
| **Agente incaricato** | «NN-nome» |
| **Directory toccate** | «numero ed elenco — più di una significa più di un agente» |
| **Evidenza prodotta per il deck** | «file in ../presentation/evidence/ o screenshot» |

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

### Cosa farà

«Due righe comprensibili a chi non vede il codice.»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si proverà

«I passi esatti per vederla funzionare, dall'avvio in poi:
 1. `/prepara` (solo la prima volta) · 2. `/avvia` · 3. apri … · 4. ti aspetti …

 Questi passi sono anche i CRITERI DI ACCETTAZIONE: `/implementa` li legge e li
 tratta come parte della richiesta.»

### Limiti previsti

«Cosa non farà, e perché.»

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

*Finché questa sezione non esiste, la funzionalità non è riconciliata e
`/verifica` non la accetta come `implementato`.*

### Cosa fa

«…»

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»
