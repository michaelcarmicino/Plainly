---
name: prepara
description: Prepara l'ambiente locale per eseguire l'applicazione — versione di Node, dipendenze, browser di Playwright, directory di lavoro, controllo di salute e prova di avvio. Lanciala una volta all'inizio, e di nuovo solo se qualcosa smette di funzionare.
disable-model-invocation: true
---

# /prepara — dal repository clonato a un progetto che gira

È il primo passo in assoluto. Chi apre questo progetto non ha modo di portarlo
in uno stato eseguibile senza conoscerlo: `npm install` da solo non basta, e il
pezzo che manca — il browser di Playwright — si scopre molto più tardi, sotto
forma di un errore che non dice che cosa manca davvero.

**È idempotente.** Rilanciarla su un ambiente già pronto non rompe niente e si
conclude in pochi secondi: verifica prima, installa solo ciò che manca.

## Uso

```
/prepara
```

Working directory: **`app/`**.

```bash
node scripts/prepara.mjs
```

Chi non usa Claude Code ottiene lo stesso risultato con `npm run prepara`.

## I sei passi, in ordine

1. **Versione di Node**, confrontata con quella richiesta dal progetto
   (`engines` in `package.json`). Se non è compatibile **si ferma qui**:
   installare dipendenze su una versione sbagliata produce errori che sembrano
   di codice e non lo sono, e si perde mezz'ora a cercarli nel posto sbagliato.
2. **Dipendenze npm**: `npm ci` se c'è il lockfile, altrimenti `npm install`
   — e in quel caso **il lockfile prodotto va committato**. Salta del tutto se
   `node_modules` è già coerente con il lockfile.
3. **Browser di Playwright**, solo Chromium e non l'intera suite. È il passo
   dimenticato sempre, perché non è incluso in `npm install`. Senza, `/guarda`
   fallisce più tardi con un messaggio poco chiaro.
4. **Directory e file di lavoro** che devono esistere ma non stanno nel
   repository: `.screenshots/` e le voci mancanti in `.gitignore`.
5. **Controllo di salute, eseguito davvero**: `tsc --noEmit`, poi `npm test`.
   Non «dovrebbe funzionare»: o passano o no.
6. **Prova di avvio**: fa partire il server, verifica che la porta risponda, e
   **lo ferma**. Non lascia processi in esecuzione. Se il server era già
   attivo, lo lascia com'era.

## Rete

**L'installazione richiede rete, l'esecuzione del prodotto no.** Sono due cose
diverse e vanno tenute distinte: il prodotto finito gira con il Wi-Fi spento,
ma per arrivarci bisogna prima scaricare dipendenze e browser.

Se un passo fallisce per mancanza di connessione, lo script **non ritenta
all'infinito**: si ferma, dice quale passo non è riuscito e che cosa resta da
fare a mano quando la connessione torna.

## Che cosa riportare

Solo l'output dello script: un elenco secco, per ogni passo *già a posto /
installato / fallito*, e in coda una riga sola.

**Se è tutto a posto, dillo e basta** — «Ambiente già pronto» — senza elencare
i dettagli. La seconda esecuzione non deve produrre un muro di testo: è il modo
in cui si smette di leggere l'output.

Se qualcosa è fallito, riporta **il blocco di errore così com'è**. È la cosa
che serve, e riassumerlo lo peggiora.
