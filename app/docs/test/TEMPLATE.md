# NN — casi di prova per «titolo della funzionalità»

> Modello. Non compilare questo file: copialo con il numero progressivo.
> Scritto da `tester` in **fase 1**, dalla sola SPECIFICA e non dal codice,
> che in quel momento non esiste ancora.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», cioè il percorso
> nominale da mostrare. Qui si scrive **cosa può andare storto**.

## 1. Percorso nominale

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | «…» | «…» | «…» | «…» |

## 2. Casi limite e valori di confine

*Zero, negativi, importi molto grandi, campi vuoti, liste con un solo
elemento, liste vuote.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | «…» | «…» | «…» | «…» |

## 3. Errori attesi

*Cosa succede quando l'input non è valido, e **come lo vede la persona**.
Un errore corretto mostrato male resta un difetto.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | «…» | «…» | «…» | «…» |

## 4. Conformità

*Richiama la suite dei guardrail, non riscriverla: il lessico vive in
`src/guardrails/lessico.ts` e duplicarlo qui farebbe divergere le due copie.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Nessun linguaggio prescrittivo nelle stringhe nuove | le chiavi aggiunte in `src/ui/testi.ts` | `tests/lessico-ui.test.ts` verde | Il prodotto spiega e calcola, non consiglia |
| CF-02 | Nessuna chiamata di rete a runtime | build di produzione | nessun `fetch` verso l'esterno nel bundle | Il sito deve funzionare offline |
| CF-03 | Le etichette originali non vengono riscritte | fixture di riferimento | `etichettaOriginale` invariata | Nessuna semplificazione può alterare il significato |

---

## Referto

*Scritto da `tester` in **fase 2**, dopo aver implementato ed ESEGUITO i casi.
Finché questa sezione non esiste, la fase 2 non è stata fatta.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |
| C-01 | «…» | «…» | passato | `tests/accettazione/NN-nome.test.ts` |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
