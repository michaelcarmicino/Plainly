# NN — «nome della funzionalità»

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

| | |
| --- | --- |
| **Contratti necessari** | «quali tipi di `types/contracts.ts`» |
| **Contratti già congelati?** | «sì / no — se sì e servono modifiche: richiede l'architetto» |
| **Agente incaricato** | «NN-nome» |
| **Directory toccate** | «numero ed elenco — più di una significa più di un agente» |
| **Evidenza prodotta per il deck** | «file in ../presentation/evidence/ o screenshot» |
