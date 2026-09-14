# Standard di codice

Valgono per ogni file sotto `app/src/` e `app/tests/`. Sono caricati
automaticamente: non serve ricordarli, serve non violarli.

## TypeScript

- **Strict**, senza eccezioni. `any` e `@ts-ignore` sono **vietati**: se il
  tipo non torna, il problema è il tipo, non il compilatore. Se serve
  un'apertura usa `unknown` e restringi.
- **Solo export nominali.** Niente `export default`: rende i rinomini
  invisibili e le ricerche inaffidabili.
- **Massimo 150 righe per file.** Oltre, si divide. Un file lungo è un
  perimetro che sta scivolando.

## Lingua

**Termini di dominio in italiano, tutto il resto in inglese.**

`documento`, `voce`, `quadratura`, `importoCent`, `pesoBp` restano in
italiano: sono i termini che compaiono sui documenti reali degli utenti, e
tradurli introdurrebbe un livello di traduzione in cui si perde significato.
`map`, `filter`, `index`, `parse`, `result` restano in inglese.

## Il core è puro

Sotto `src/core/`: **nessun I/O, nessun `Date.now()`, nessun `Math.random()`.**
Stesso input, stesso output, su qualunque macchina. È ciò che rende le fixture
in `fixtures/` una verità verificabile invece di un'istantanea.

## Numeri

- **Importi: interi in centesimi** (`...Cent`). Nessun float nel dominio.
- **Percentuali: punti base** (`...Bp`), 1% = 100 bp.
- La formattazione italiana (`1.234,56` · `5,90%`) si fa **solo** con
  `src/core/formatoIt.ts`, mai con `Intl`: `Intl` dipende dai dati di locale
  della macchina e cambia risultato su un runtime con ICU ridotto.

## Errori: unione discriminata, mai eccezioni di controllo

```ts
export type Esito<T> =
  | { ok: true; valore: T }
  | { ok: false; errore: string };
```

Chi chiama **deve** gestire il ramo `false`: il compilatore lo obbliga. Una
`throw` per il flusso normale rende l'errore invisibile fino al runtime, che è
esattamente il tipo di guasto che questo progetto non può permettersi.

Le eccezioni restano lecite solo per ciò che è davvero eccezionale (un
invariante rotto), e in quel caso si usa una classe d'errore dedicata.

## Interfaccia

- **Tutte le stringhe rivolte all'utente stanno in `src/ui/testi.ts`.** Nessun
  testo letterale nei componenti: il guardrail ha bisogno di un punto unico da
  scandire, e testo sparso in venti file non è controllabile.
- **Nessuna logica di calcolo nei componenti.** Se serve un numero che il core
  non espone, si chiede al core. Un calcolo nel JSX non è testabile e non
  compare nelle fixture.

## Test

- **Il valore atteso si calcola a mano e si scrive nel commento**, accanto
  all'asserzione:

  ```ts
  // 1050 / 3817 * 10000 = 2750,85 -> 2751 bp
  expect(pesoInBp(1050, 3817)).toBe(2751);
  ```

  Un numero atteso che nessuno ha verificato a mano documenta il bug invece
  di trovarlo.
- **Niente snapshot.** Uno snapshot si aggiorna con un tasto e passa di nuovo:
  è un test che non può fallire, cioè non è un test.
- Ogni comportamento nuovo arriva con il suo test nello stesso commit.
