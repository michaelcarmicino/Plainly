---
name: avvia
description: Avvia l'applicazione in background e restituisce l'URL, oppure la ferma con `stop`. NON lanciare mai `npm run dev` direttamente: è un processo che non termina e lascia la sessione appesa. Usa sempre questa skill.
disable-model-invocation: true
---

# /avvia — far girare l'applicazione senza bloccare la sessione

`npm run dev` **non termina mai**. Lanciato in primo piano dentro una sessione
Claude Code, la sessione resta appesa aspettando un processo che non finirà, e
chi sta lavorando non capisce perché tutto si è fermato.

Questa skill lo avvia **staccato** dalla sessione.

> **Regola:** non lanciare mai `npm run dev` direttamente. Mai.

## Uso

```
/avvia          avvia, o riporta l'URL se è già attivo
/avvia stop     ferma il processo avviato prima
/avvia stato    dice solo se è attivo, senza avviare nulla
```

## Che cosa eseguire

Working directory: **`app/`**.

```bash
node scripts/dev-server.mjs start     # oppure: stop | status
```

Lo script fa già tutto, in quest'ordine:

1. **Controlla se la porta 5173 risponde.** Se sì si ferma lì e riporta l'URL:
   non avvia un secondo processo. Due server sulla stessa porta sono il modo
   più veloce per perdere dieci minuti su un errore che non esiste.
2. Altrimenti lo avvia **in background**, con l'output rediretto su
   `app/.dev-server.log` e il pid in `app/.dev-server.pid`.
3. Attende che la porta risponda, **al massimo 40 secondi**.
4. Riporta l'URL, oppure — se non è partito — **le ultime righe del log**, che
   sono la cosa che serve davvero.

Con `stop` termina il processo usando il pid salvato (su Windows con
`taskkill /T`, perché npm e vite sono due processi distinti e fermare solo il
padre lascia la porta occupata).

## Che cosa riportare

Solo l'output dello script. Se non è partito, **incolla le righe del log**: non
riassumerle e non interpretarle: l'errore di Vite è quasi sempre già la
diagnosi.

Se la porta 5173 è occupata da qualcos'altro, prova
`node scripts/dev-server.mjs start --port 5174` e dillo, perché anche `/guarda`
dovrà usare quella porta.

## Quando serve

- Prima di `/guarda`: la skill lo fa già da sola, non serve anticiparla.
- Quando vuoi aprire l'applicazione nel browser e vederla con i tuoi occhi.
- Dopo `/implementa`, per controllare che ciò che è stato costruito esista
  davvero a schermo e non solo nei test.

**Ferma il server con `/avvia stop` quando hai finito.** Un processo dimenticato
tiene la porta occupata e confonde la sessione successiva.
