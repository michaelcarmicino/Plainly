# Come lavorare qui

Guida operativa: come si usa **Claude Code** su questo progetto. Cinque minuti
di lettura, poi puoi cominciare.

Gli altri file rispondono ad altre domande, e non le ripeto qui:
**`CLAUDE.md`** dice che cos'è Plainly e che cosa fa · **`.claude/rules/`** dice
come si scrive il codice · **`../agents/README.md`** dice chi fa cosa e perché.

---

## 1. La prima volta: `/prepara`

```
/prepara
```

Porta il progetto da «appena clonato» a «gira»: controlla la versione di Node,
installa le dipendenze e il browser che serve a `/guarda`, crea le cartelle di
lavoro, lancia i test e prova ad avviare il server.

**Si lancia una volta all'inizio, e di nuovo solo se qualcosa smette di
funzionare.** Rilanciarla quando è già tutto a posto non fa danni: se ne
accorge e finisce subito.

Serve rete solo per questo passo. Il prodotto, una volta pronto, gira anche
con il Wi-Fi spento.

## 2. Da dove si lancia

```bash
cd app
claude
```

**Sempre da `app/`, mai dalla radice del repository.** Claude Code cerca skill,
agenti e regole a partire dalla cartella in cui lo lanci: dalla radice non
vedresti nessuna delle skill qui sotto, e ti sembrerebbe che non esistano.

Le regole generali del progetto arrivano comunque, perché Claude risale
l'albero delle cartelle da solo.

## 3. Il ciclo

```
/spec → confermi → /implementa → /verifica → commit
```

- **`/spec`** — descrivi la funzionalità a parole tue. Controlla che sia
  compatibile con i vincoli del progetto, e **può rifiutarla**: in quel caso ti
  propone la versione più vicina che invece va bene. Scrive la specifica in
  `docs/features/`. Non scrive codice.
- **`/implementa`** — prende la specifica approvata e la realizza, passando il
  lavoro agli agenti giusti nell'ordine giusto. Non devi sapere quali sono.
- **`/verifica`** — il controllo prima di ogni commit e di ogni merge. Risposta
  secca: passa o non passa, con la riga esatta che ha fallito.

Accanto, quattro skill per le cose che succedono davvero mentre lavori:

- **`/avvia`** — fa partire l'applicazione. Usala **al posto di `npm run dev`**.
- **`/guarda`** — apre l'app in un browser vero, cattura la schermata e te la
  fa esaminare. Serve ogni volta che la modifica riguarda ciò che si vede.
- **`/diagnosi`** — quando qualcosa non funziona e non sai perché. Trova la
  causa **prima** di toccare il codice.
- **`/annulla`** — torna all'ultimo stato in cui i test passavano.
- **`/promuovi`** — quando quello che c'è su `develop` è pronto da consegnare
  o da mostrare, lo porta su `master`. Ricontrolla tutto prima, e si rifiuta
  di promuovere qualcosa di rosso.

I due branch servono a questo: su **`develop`** un difetto è un problema
interno, su **`master`** è qualcosa che qualcuno vede. Per questo il passaggio
non è automatico.

## 4. Pianificare prima di scrivere

**Se leggi una sola cosa di questa guida, leggi questa: è l'abitudine che
cambia di più la qualità del risultato.**

Claude Code ha una **modalità di pianificazione**: legge il codice, capisce, e
ti propone un piano **senza poter modificare niente**. Tu leggi il piano, lo
correggi o lo approvi, e solo allora si esegue.

Si attiva con **Shift+Tab** (premilo finché non compare «plan mode») oppure con
**`/plan`**.

Usala **sempre** quando:

- la modifica tocca più di un file;
- stai lavorando su codice che non conosci;
- non sei sicuro al cento per cento di che cosa vuoi ottenere.

Il motivo è semplice: correggere un piano di dieci righe costa trenta secondi,
correggere trecento righe di codice già scritto ne costa venti minuti — e
spesso finisce che si tiene un'impostazione sbagliata perché rifarla sembra
troppo.

È la stessa idea della regola delle due fasi in
`.claude/rules/procedura-sviluppo.md`: qui c'è lo strumento che la rende
automatica invece che una buona intenzione.

## 5. Tenere pulito il contesto

Claude ha una memoria di lavoro limitata. In una sessione lunga si riempie di
cose vecchie — file letti un'ora fa, tentativi abbandonati, errori già risolti
— e da un certo punto in poi **la qualità peggiora senza che tu te ne accorga**:
non c'è un messaggio di avviso, semplicemente le risposte diventano meno
precise.

Tre comandi, e una regola:

- **`/clear`** — svuota tutto e riparte pulito. Usalo **fra una funzionalità e
  l'altra, senza esitare**. Non perdi il lavoro: i file sono sul disco e i
  commit in git. Perdi solo la conversazione, che a quel punto è zavorra.
- **`/context`** — mostra che cosa sta occupando spazio. Guardalo se hai
  l'impressione che stia rallentando o sbagliando più del solito.
- **`/compact`** — riassume la conversazione tenendo il filo. **Dagli sempre
  un'istruzione**, non lanciarlo a vuoto: `/compact tieni la spec in corso, i
  file modificati e i comandi di test`. A vuoto decide da solo che cosa buttare,
  e spesso butta proprio quello che ti serviva.

> **Regola pratica: una funzionalità, una sessione pulita.**
> Finita e committata → `/clear` → si ricomincia.

## 6. Correggere senza peggiorare

Quando Claude prende una direzione sbagliata, l'istinto è scrivere «no, non
così» e poi «intendevo un'altra cosa» e poi «rifallo». **È la cosa peggiore da
fare**: ogni messaggio resta nel contesto, insieme al codice sbagliato che
commenta, e il risultato è che stai chiedendo di ignorare qualcosa che continui
a tenergli sotto gli occhi.

Meglio:

- **`Esc`** — interrompe subito quello che sta facendo, senza perdere il
  contesto. Poi riformuli.
- **`Esc Esc`** oppure **`/rewind`** — riporta indietro a un momento precedente
  della conversazione, come se quel pezzo non fosse successo. Da lì riformuli
  la richiesta **dall'inizio e meglio**, invece di stratificare correzioni.

> **Attenzione, ed è importante:** i checkpoint di `/rewind` tracciano solo le
> modifiche fatte dagli strumenti di Claude. **Non tracciano quello che
> cambiano i comandi eseguiti nel terminale.** Non sostituiscono git.
>
> È esattamente il motivo per cui esistono `/annulla` e la regola di committare
> a ogni funzionalità verde: quella è la rete di sicurezza vera.

## 7. Dargli un modo per accorgersi da solo degli errori

Claude lavora molto meglio quando può **verificare** invece che supporre. Il
modo più semplice è nominare, dentro la richiesta, come si controlla il
risultato.

Invece di:

> «aggiungi il calcolo del costo annuo»

scrivi:

> «aggiungi il calcolo del costo annuo, poi lancia `npm test` e fallo passare»

oppure:

> «...e controlla con `/verifica` che sia tutto verde prima di fermarti»

Con un criterio di successo verificabile, se sbaglia se ne accorge e corregge
da solo. Senza, si ferma al primo risultato che sembra plausibile — e
«sembra plausibile» su un numero è precisamente ciò che questo progetto non può
permettersi.

## 8. Riprendere il lavoro

```bash
claude --continue    # riapre l'ultima sessione dov'era
claude --resume      # ti fa scegliere quale sessione riprendere
```

`--continue` serve la mattina dopo o dopo una pausa. `--resume` quando hai
lavorato su più cose e devi tornare su quella giusta.

Ricorda comunque il punto 4: riprendere una sessione lunga significa riprendere
anche il suo contesto sporco. Se stai cominciando una cosa nuova, `/clear` è
meglio di `--continue`.

## 9. Le tre cose da non fare mai, qui

1. **Non lanciare `npm run dev` a mano.** Non termina mai: la sessione resta
   appesa e non capisci perché. Usa `/avvia`, che lo fa partire staccato e ti
   restituisce l'indirizzo.
2. **Non modificare `types/`.** Sono i contratti condivisi con il resto del
   progetto: cambiarli invalida in silenzio il lavoro di altri e le fixture.
   Quando sono congelati un blocco automatico te lo impedisce e ti spiega
   perché. **Chiedi all'architetto**: quasi sempre basta aggiungere un campo
   opzionale dentro la tua cartella.
3. **Non scrivere testo rivolto all'utente fuori da `src/ui/testi.ts`.** Ogni
   parola che una persona legge sta lì, in un punto solo, perché il controllo
   automatico sul linguaggio possa vederle tutte. Una stringa scritta dentro un
   componente sfugge al controllo — ed è così che in un sito di finanza
   personale finisce per scapparci un consiglio.
