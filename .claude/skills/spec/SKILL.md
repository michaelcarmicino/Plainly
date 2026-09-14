---
name: spec
description: Il cancello d'ingresso. Verifica che una funzionalità sia conforme ai vincoli del progetto, la rifiuta proponendo l'alternativa conforme se non lo è, e altrimenti scrive la spec in docs/features/. Non scrive codice.
disable-model-invocation: true
---

# /spec — il cancello d'ingresso

Unica skill che può **rifiutare**. Il controllo di conformità sta all'ingresso,
non all'uscita: rifiutare a valle significa buttare via lavoro già fatto, e su
quattro ore non è recuperabile.

**Non scrivi codice in questa skill.** Ti fermi e chiedi conferma.

## Percorsi

Le skill girano con working directory **`app/`**. La radice del repository è
un livello sopra. Quando serve un percorso che deve valere da entrambe le
radici, risolvilo così:

```bash
ROOT=$(git rev-parse --show-toplevel)
```

- spec da scrivere → `docs/features/NN-nome.md`
- modello → `docs/features/TEMPLATE.md`
- contratti → `types/contracts.ts`
- sentinella del congelamento → `$ROOT/.contracts-frozen`
- definizioni degli agenti → `../agents/`

## Passo 0 — leggi il contesto

Leggi, in quest'ordine: `docs/brief.md` (se esiste), `../CLAUDE.md`,
`CLAUDE.md`. Non leggere altro: se la risposta non è lì, il problema è la
documentazione, e va segnalato.

## Passo 1 — conformità, PRIMA di ogni altra cosa

Rifiuta se la funzionalità richiesta:

1. **consiglia o raccomanda una scelta** — «quale conto conviene», «quale
   opzione scegliere», «cosa dovrebbe fare l'utente»;
2. **richiede chiamate esterne a runtime** — API, LLM, tassi aggiornati dalla
   rete, qualunque cosa con una chiave;
3. **altera il significato di un'informazione originale** — riscrivere le
   etichette del documento, «semplificare» una voce cambiandone il senso,
   arrotondare via una componente di costo;
4. **è un'interfaccia conversazionale aperta** — una chat, un campo di
   domanda libera: a runtime non c'è modello, e un finto assistente che
   risponde da regole fisse è peggio di nessun assistente.

### Il rifiuto propone SEMPRE l'alternativa conforme più vicina

Un «no» senza alternativa fa perdere tempo due volte, perché la richiesta
torna riformulata a caso. Formato:

```
RIFIUTATA — motivo: <quale dei quattro punti, in una riga>

Perché: <due righe, concrete>

Variante conforme più vicina:
  <la funzionalità riscritta in modo che passi, non una generica>

Vuoi che apra la spec su questa variante?
```

Esempi di riscrittura, da usare come modello:

| Richiesta non conforme | Variante conforme |
| --- | --- |
| «suggerisci quale opzione conviene» | «mostra affiancate le due opzioni con la differenza di costo su 12 mesi, senza indicarne una» |
| «dì all'utente come risparmiare» | «elenca le voci ricorrenti e il loro peso sul totale» |
| «chiedi a un modello di spiegare la voce» | «mostra la spiegazione del calcolo prodotta dal core, con il riferimento alla riga originale» |
| «aggiorna i tassi dalla rete» | «rendi il tasso un dato del documento in ingresso, dichiarato nella fixture» |

## Passo 2 — se è conforme, scrivi la spec

Numero progressivo: il più alto in `docs/features/` più uno, due cifre.
File: `docs/features/NN-nome-kebab.md`, partendo da `docs/features/TEMPLATE.md`.

Oltre al modello, **dichiara esplicitamente**:

- **Contratti necessari**, e **se sono già congelati**. Controlla
  `$ROOT/.contracts-frozen`: se esiste e la funzionalità richiede modifiche a
  `types/`, scrivilo in testa alla spec — «richiede l'architetto» — e dillo
  anche a voce.
- **Agente incaricato**, scelto in `../agents/` in base alla directory che la
  funzionalità tocca. Non nominare l'agente all'utente se non lo chiede: il
  routing è compito tuo.
- **Quante directory toccherà.** Se sono più di una, dillo: è il segnale che
  serviranno due agenti.
- **Quale evidenza produrrà per il deck**, cioè quale file in
  `../presentation/evidence/` o quale screenshot.

## Passo 3 — fermati

Stampa il percorso del file scritto e le quattro dichiarazioni sopra, poi:

> Spec pronta. Confermi? Poi `/implementa`.

**Non proseguire senza un sì esplicito.**

## Manutenzione

Se modifichi `template.md` in questa cartella, riallinea
`docs/features/TEMPLATE.md`: il product developer deve poter leggere il
modello senza aprire `.claude/`.
