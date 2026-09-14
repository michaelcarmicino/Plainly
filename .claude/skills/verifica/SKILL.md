---
name: verifica
description: Il cancello d'uscita, da lanciare prima di ogni commit. Esegue test, scansione del lessico prescrittivo, controllo che il bundle non contenga chiamate di rete, e confronto dei contratti con il tag freeze. Esito binario.
disable-model-invocation: true
---

# /verifica — il cancello d'uscita

Da lanciare **prima di ogni commit**.

**Esito binario: passa o non passa.** Nessun «passa con avvertenze»: un
cancello con tre livelli di gravità diventa, sotto pressione di tempo, un
cancello sempre aperto.

Quando non passa, riporta **la riga esatta che ha fallito**, non un riassunto.

## Percorsi

Working directory: **`app/`**. `ROOT=$(git rev-parse --show-toplevel)`.

## I quattro controlli, in sequenza

Fermati al primo che fallisce: gli altri sarebbero rumore.

### 1. Test e tipi

```bash
npm test
npx tsc --noEmit
```

Fallisce → riporta il blocco `AssertionError` completo, con file e riga.

### 2. Lessico prescrittivo su tutte le stringhe utente

```bash
npx vitest run tests/lessico-ui.test.ts
```

Scandisce `src/ui/testi.ts`, le fixture, i letterali dei sorgenti e gli
identificatori. Fallisce → riporta termine, motivo **e la riformulazione
ammessa**, che il test già stampa. Non proporne una tua: quelle lecite stanno
in `src/guardrails/lessico.ts`.

### 3. Il bundle non parla con nessuno

```bash
npm run build
grep -rnE "fetch\(|XMLHttpRequest|https?://(?!localhost|127\.0\.0\.1)" dist/ || echo "OFFLINE OK"
```

Cerca anche nei sorgenti riferimenti a CDN e font remoti:

```bash
grep -rnE "cdn\.|googleapis|unpkg|jsdelivr|@import url\(" src/ index.html || echo "NESSUN RIFERIMENTO REMOTO"
```

Fallisce → **è il vincolo più grave del progetto**: l'app deve girare con il
Wi-Fi spento. Riporta il file e la riga, e fermati.

### 4. I contratti rispetto al tag `freeze`

```bash
git diff --name-only freeze...HEAD -- types/ 2>/dev/null
```

- Tag assente → non è un errore: il freeze è a T+2:45. Dillo e prosegui.
- Tag presente e output vuoto → **0 contratti modificati dopo il freeze**. È
  il numero che va in slide 8: dillo esplicitamente, è una buona notizia da
  registrare.
- Tag presente e output non vuoto → elenca i file e avverti che il numero di
  slide 8 non sarà più zero.

### 5. Documentazione funzionale allineata

Tre condizioni. Se una sola non regge, la verifica **non passa**.

```bash
npm run docs:funzionali
git status --porcelain docs/FUNZIONALITA.md
```

- **Nessuna funzionalità risulta `implementato` senza la fase 2.** Un file con
  stato `implementato` deve avere la sezione `## Verificato`: senza, qualcuno
  ha cambiato lo stato a mano saltando la riconciliazione.
- **`FUNZIONALITA.md` non è più vecchio dei file in `docs/features/`.** Se
  rigenerandolo cambia, era disallineato: è il segnale che una modifica alla
  documentazione non è mai arrivata all'indice.
- **Nessun file con stato `in sviluppo` contiene affermazioni al presente.**
  Sotto `## Previsto` si scrive al futuro. Il presente lì dentro significa che
  qualcosa è stato dichiarato fatto senza essere stato verificato — ed è
  esattamente il guasto che la divisione in due fasi esiste per impedire.

Fallisce → indica **il file e la riga**, e di' quale delle tre condizioni non
regge. Non «la documentazione è disallineata»: quale, e dove.

## Esito

```
VERIFICA PASSATA
  test: 25 passed, 9 todo
  lessico: nessuna formulazione prescrittiva
  offline: nessuna chiamata di rete nel bundle
  contratti dopo il freeze: 0
  documentazione: allineata, 0 in sviluppo con affermazioni al presente

Puoi committare:  tipo(agente): descrizione
```

oppure

```
VERIFICA NON PASSATA — controllo 2 (lessico)

  src/ui/testi.ts: «...»
    [blocco] "conviene" (convenienza) — <motivo>
        → <riformulazione ammessa>

Nessun commit finché non è verde.
```
