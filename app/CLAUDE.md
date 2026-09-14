# Plainly

Sito che rende comprensibili economia e finanza personale a **un cittadino che
parte da zero**. Non uno studente di economia, non un piccolo investitore: una
persona che riceve una bolletta, una busta paga o una dichiarazione dei redditi
e non capisce cosa c'è scritto sopra.

Avvio della sessione di lavoro: **`cd app && claude`**. Questa è la radice del
progetto.

## La missione, e il principio che la guida

L'obiettivo **non è insegnare finanza**. È dare alla persona il minimo
indispensabile per orientarsi nelle decisioni economiche che deve affrontare
comunque, che lo voglia o no: pagare le bollette, leggere lo stipendio, capire
le tasse, valutare un mutuo, pensare alla pensione.

> **L'incertezza cala quando un'ansia generica — «i prezzi salgono», «non so se
> basterà» — viene trasformata in un numero concreto e verificabile relativo
> alla propria situazione.**

Il sito esiste per fare esattamente questo passaggio. Ogni funzionalità va
giudicata su questo: trasforma un'ansia vaga in un numero verificabile, oppure
no?

## Per chi

- **Alfabetizzazione finanziaria bassa o nulla.** Non conosce TAN, TAEG,
  aliquota marginale, ammortamento. Non sa di non saperlo.
- **Smartphone e computer allo stesso modo.** Nessuna assunzione sul
  dispositivo: l'esperienza deve essere completa su entrambi.
- **Comprende persone anziane o poco avvezze alla tecnologia**, non solo
  giovani con bassa cultura finanziaria.
- **Arriva con un'ansia specifica** — «perché la bolletta è così alta»,
  «quanto mi resta in busta» — non per curiosità teorica.
- **Ha poco tempo e poca pazienza.** Se non capisce in pochi secondi, se ne va.
- **Non deve mai sentirsi giudicato** per non sapere qualcosa.

## Le tre macrocategorie

Tutto il sito è organizzato attorno a tre aree, scelte perché rispecchiano le
reali preoccupazioni economiche dei cittadini italiani.

| | Area | Copre |
| --- | --- | --- |
| 1 | **Il costo della vita** | inflazione, bollette energetiche, casa (affitto o mutuo), stipendi che non tengono il passo dei prezzi |
| 2 | **Il lavoro** | rischio disoccupazione, instabilità di chi lavora in proprio, pressione fiscale sul reddito, precarietà contrattuale |
| 3 | **Il futuro** | pensione, capacità di risparmiare, investimenti, debiti e mutui, passaggio generazionale |

Ogni pagina risponde a **una domanda reale posta in linguaggio umano**, non a
una voce di glossario.

## Come si scrive e come si progetta

I principi non negoziabili — traduzione invece di definizione, un concetto per
schermata, ogni numero con un paragone concreto, semafori invece di
terminologia, e tutti i requisiti di accessibilità — sono in
**`.claude/rules/scrittura-e-accessibilita.md`**, caricata in automatico.

Non è materiale di consultazione: è la parte del progetto che decide se
funziona. Leggila prima di scrivere la prima parola rivolta all'utente.

## I due vincoli tecnici

Entrambi sono **eseguibili**, non affidati alla memoria di chi scrive.

### 1. Spiega e calcola, non consiglia

Il sito **non dice a nessuno che cosa fare**. Niente raccomandazioni di
investimento, niente consulenza personalizzata, niente indicazioni su cosa
comprare, vendere o scegliere. Nessuna semplificazione può alterare il
significato dell'informazione originale.

Vale anche nei nomi: niente `suggerisci`, `consiglia`, `migliore`,
`raccomanda` in nessun identificatore.

Come è imposto: `src/guardrails/` contiene il lessico dei termini vietati,
ognuno con **la riformulazione ammessa**; `tests/lessico-ui.test.ts` scandisce
ogni stringa rivolta all'utente e fa fallire la build; un hook lo esegue dopo
ogni modifica, e il componente `<Testo>` lo riapplica a runtime.

Attenzione: questo vincolo e la scrittura divulgativa si scontrano proprio dove
il testo è più utile. «Non mettere tutti i risparmi in un'unica azienda» è una
buona spiegazione **e** un consiglio di investimento. La via d'uscita è
descrivere il meccanismo senza l'imperativo: «chi mette tutto in un'unica
azienda, se quella va male, perde tutto insieme». Se sei in dubbio, chiedi a
`guardrail-officer` prima di scrivere, non dopo.

### 2. Funziona offline

Nessuna chiamata a servizi esterni, nessun modello linguistico a runtime,
nessuna chiave, nessun CDN, nessun font remoto. La build è statica e si apre da
`file://`. **Il sito deve funzionare con il Wi-Fi spento.**

Nel footer va una nota semplice, non un disclaimer elaborato:
«Questo sito è stato generato con l'aiuto dell'intelligenza artificiale e
potrebbe contenere errori.»

## Stack e comandi

Vite + React + TypeScript + Vitest. Dipendenze consentite: `vite`, `react`,
`react-dom`, `typescript`, `vitest`, `@playwright/test`. Nient'altro: ogni
dipendenza in più è una cosa in più che può rompersi.

```bash
npm install
npm run dev      # sviluppo su http://localhost:5173
npm test         # suite completa
npm run build    # build statica in dist/
```

## Dove vive cosa

| Cartella | Contenuto | Agente che la possiede |
| --- | --- | --- |
| `src/core/` | il calcolo, puro e deterministico | `core-engine` |
| `src/ui/` | componenti e `testi.ts` | `ui-builder` |
| `src/guardrails/` | lessico vietato, `verificaTestoUtente` | `guardrail-officer` |
| `src/assessment/` | la misura della comprensione, prima e dopo | `impact-analyst` |
| `src/ingest/` | **vuota di proposito** — vedi `../agents/02-data-ingest.md` | — |
| `types/` | i contratti di dominio — **non si toccano** | architetto |
| `fixtures/` | la verità di riferimento dei test | architetto |
| `docs/features/` | le specifiche approvate, scritte da `/spec` | tu |

Convenzioni di dominio: **importi in centesimi interi** (`...Cent`),
**percentuali in punti base** (`...Bp`, 1% = 100 bp). Nessun decimale nel
dominio: su bollette e stipendi l'errore di arrotondamento è il difetto che
nessuno vede finché qualcuno non confronta con il documento di carta.

## Che cosa è caricato da questa radice

**Quattro skill principali** — il ciclo completo. Nessuna parte da sola. Sei skill di supporto (/avvia, /guarda, /diagnosi, /annulla, /prepara, /promuovi) sono descritte in [`COME-LAVORARE.md`](COME-LAVORARE.md) — leggilo quando qualcosa si rompe.

| Skill | A cosa serve |
| --- | --- |
| `/spec` | Il cancello d'ingresso. Verifica la conformità, **può rifiutare** proponendo la variante conforme, e scrive la specifica in `docs/features/` |
| `/implementa` | Prende una specifica approvata e instrada il lavoro verso gli agenti giusti, nell'ordine giusto |
| `/verifica` | Il cancello d'uscita, prima di ogni commit e di ogni merge. Esito binario |
| `/evidenza` | Esegue lo scenario di una funzionalità e ne registra il risultato |

**Quattro agenti** — non devi invocarli tu: `/implementa` instrada al momento
giusto. Ognuno possiede una directory in esclusiva e non scrive fuori.

| Agente | Possiede | Chiamalo quando |
| --- | --- | --- |
| `core-engine` | `src/core/` | il problema è **un numero** |
| `ui-builder` | `src/ui/` | il problema è **a schermo** |
| `guardrail-officer` | `src/guardrails/`, `tests/` | il problema è **una parola** rivolta all'utente |
| `impact-analyst` | `src/assessment/` | serve **una misurazione** |
| `doc-funzionale` | `docs/features/`, `docs/FUNZIONALITA.md` | parte da solo con `/spec` e `/implementa` — non chiamarlo tu |
| `tester` | `tests/accettazione/`, `docs/test/` | idem: casi di prova e referto, in parallelo |
| `pm` | `docs/backlog/` | hai più cose da fare e non sai in che ordine → `/pm` |

`doc-funzionale` e `tester` si dividono il lavoro senza sovrapporsi: **il primo
descrive la strada buona** («come si proverà», il percorso da mostrare), **il
secondo tutte le buche** (casi limite, errori attesi, conformità). Entrambi
derivano dalla specifica, non dal codice: è ciò che li rende indipendenti.

I **test unitari restano di `core-engine`**, in `src/core/__tests__/`. Quelli
di accettazione sono del `tester`, in `tests/accettazione/`. È il confine più
facile da sfondare.

`doc-funzionale` lavora **in parallelo** al codice: scrive la documentazione
mentre la funzionalità viene costruita, al futuro, e la riscrive al presente
solo dopo averla verificata sul codice. Il parallelismo è sicuro perché
possiede `docs/` in esclusiva e non tocca mai `src/`.

Il campo **«come si proverà»** che produce sono i **criteri di accettazione**:
`/implementa` li legge come parte della richiesta, così chi costruisce sa in
anticipo su che cosa verrà misurato.

Altri agenti esistono ma lavorano fuori da `app/` e non sono caricati qui: il
catalogo completo è in `../agents/README.md`.

**Regole caricate in automatico** da `.claude/rules/`:
`scrittura-e-accessibilita.md`, `standard-codice.md`, `procedura-sviluppo.md`.

## I tre divieti che contano mentre scrivi

1. **Non toccare `types/`.** I contratti sono condivisi: cambiarli invalida in
   silenzio il lavoro di altri e le fixture. Quando sono congelati un hook
   blocca la scrittura e te lo spiega. Non aggirarlo: **chiedi all'architetto**.
   Quasi sempre basta un campo opzionale dentro la tua directory.
2. **Nessuna stringa rivolta all'utente fuori da `src/ui/testi.ts`.** I
   componenti non contengono testo letterale: stampano via `<Testo>`. Serve a
   dare al guardrail un punto unico da controllare.
3. **Nessuna logica di calcolo nei componenti.** Se ti serve un numero che il
   core non espone, lo chiedi al core: un calcolo dentro il JSX non è
   testabile e non compare nelle fixture.

## Il ciclo di lavoro

```
/spec → conferma → branch → /implementa → test+build → /verifica → commit → merge su develop
```

```bash
git switch develop && git switch -c feature/NN-nome   # una specifica, un branch
npm test && npm run build && npx tsc --noEmit
git switch develop && git merge --no-ff feature/NN-nome
```

Nessuna implementazione senza una specifica approvata in `docs/features/`.
`develop` deve restare sempre verde. Dettagli in
`.claude/rules/procedura-sviluppo.md`.

Che cosa c'è in `.claude/` e perché: [`COME-LAVORARE.md`](COME-LAVORARE.md).
