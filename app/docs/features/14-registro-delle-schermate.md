# 14 — Registro delle schermate

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-15 · Agente incaricato: «03-ui-builder», con «04-guardrail-officer»
>
> **Funzionalità di infrastruttura.** Non aggiunge una schermata e non
> aggiunge una parola rivolta all'utente: toglie il motivo per cui le nove
> schermate che restano devono essere costruite una alla volta.
>
> Le tre affermazioni tecniche su cui poggia la proposta **sono state
> provate**, non assunte: l'esito delle prove è nel passo 1
> dell'«Elaborazione». Una di esse — il foglio di stile — chiude da sola uno
> dei cinque punti di conflitto senza bisogno di nessun registro.

## Conformità

I quattro criteri di rifiuto di `/spec`, applicati:

1. **Consiglia o raccomanda una scelta?** No. Non produce testo rivolto
   all'utente: nessuna stringa nuova in `src/ui/testi.ts`.
2. **Richiede chiamate esterne a runtime?** **È il criterio che conta qui**, e
   la risposta è no — ma solo perché il meccanismo scelto si risolve a *build
   time*. Verificato sul bundle costruito, non dedotto: passo 1.2.
3. **Altera il significato di un'informazione originale?** No: nessuna
   informazione di dominio passa da qui.
4. **È un'interfaccia conversazionale aperta?** No.

**Conforme.**

## Per chi

La persona che costruisce la prossima schermata — e, attraverso di lei, la
persona che legge il sito.

Restano **nove funzionalità da costruire, tutte schermate**. Oggi nessuna può
girare in parallelo con un'altra. Il collo di bottiglia non sono i file
*propri* di ogni schermata — `PaginaX.tsx`, `testiX.ts`, `stiliX.css` sono
nuovi ogni volta e non collidono mai — ma **cinque file condivisi** che ogni
schermata deve modificare:

| File condiviso | Che cosa ci aggiunge oggi ogni schermata |
| --- | --- |
| `src/ui/rotte.ts` | un membro all'unione `Rotta`, un ramo in `parseRotta`, una costante di percorso |
| `src/ui/App.tsx` | un `case` nello `switch` che risolve la pagina |
| `src/ui/Navigazione.tsx` | un gradino nel percorso (`passoCorrente`) |
| `src/ui/testi.ts` | lo spread del proprio registro di stringhe |
| `src/main.tsx` | l'import del proprio foglio di stile |

Cinque righe a testa, in cinque punti che tutti devono toccare.

Il guasto che questo produce è il peggiore del progetto, e non è il conflitto
git: è il caso in cui il conflitto **non** si vede. Due agenti che scrivono lo
stesso file in parallelo si sovrascrivono, **entrambi dichiarano di aver
finito**, e il lavoro perso si scopre molto dopo — quando la schermata di
qualcun altro semplicemente non c'è più. È esattamente il modo di fallire che
`CLAUDE.md` nomina: «non nascono dal codice difficile, nascono da due agenti
che scrivono lo stesso file — e falliscono in silenzio».

## Quando serve

**Adesso, prima delle nove schermate.** È l'unico momento in cui ha senso:
fatta dopo, va applicata retroattivamente a nove schermate già scritte; non
fatta affatto, le nove schermate restano in fila indiana.

Il precedente che lo dimostra è già nel repository. La funzionalità 02 ha
cambiato l'intero contenuto della home — diciotto domande, tre stati, i badge
— **senza che `Home.tsx` e `CardMacrocategoria.tsx` avessero bisogno di una
riga**: il contenuto è dichiarato in `catalogoDomande.ts` e i componenti lo
leggono invece di elencarlo. `contenutiHome.ts` filtra il catalogo per area
invece di ridichiarare le domande, e `contaAltreDomande()` deriva il numero
dalla lista «così non può mentire quando la lista cambia».

**Questa funzionalità generalizza quello schema dai contenuti alle
schermate.** Non è un'idea nuova da provare: è uno schema che in questo
repository ha già funzionato una volta.

## Cosa deve poter fare dopo

Chi costruisce la schermata NN la rende raggiungibile, navigabile e
visualizzata **aggiungendo file, senza modificarne nessuno** — tranne uno solo,
dichiarato qui sotto e sorvegliato da un test.

Osservabile, non un sentimento: `git show --stat` sul commit di una schermata
nuova mostra **file aggiunti**, e **al massimo un file modificato**
(`src/ui/testi.ts`, una riga). Oggi ne mostra cinque.

## Input

Nessun dato di dominio, nessuna fixture, nessun contratto. Gli ingressi sono
file che esistono già:

- i cinque file condivisi elencati sopra, nella forma di oggi;
- le due schermate esistenti — `src/ui/PaginaFonti.tsx` (funzionalità 13) e
  `src/ui/PaginaValoreRisparmi.tsx` (funzionalità 07) — che sono **il banco di
  prova**: dopo la modifica devono funzionare identiche, senza che l'utente
  possa accorgersi che qualcosa è cambiato sotto;
- `vite.config.ts`, letto e **non modificato**: `base: './'`,
  `assetsInlineLimit` a 1 MB e `cssCodeSplit: false` sono i tre valori da cui
  dipende l'esito della prova 1.3.

## Elaborazione

### 1. Le tre prove, eseguite prima di proporre

Fatte in un progetto isolato fuori dal repository, con le **stesse versioni**
installate qui (vite 5.4.21, vitest 2.1.9) e la stessa configurazione di
build. Nessun file del progetto è stato toccato per farle.

**1.1 — `import.meta.glob(..., { eager: true })` funziona sotto `vitest` con
`environment: 'node'`.** Due file in una cartella, raccolti, ordinati, letti:
due test verdi. Serviva provarlo perché la suite gira in ambiente `node`, non
in un browser, e un registro che si popola solo in `vite dev` sarebbe un
registro che i test non vedono.

**1.2 — La raccolta si risolve a build time. Nessuna richiesta a runtime.**
È la verifica che il vincolo offline impone. Nel bundle prodotto, la raccolta
compare così:

```js
const d = Object.assign({"./schermate/01-beta.ts": a, "./schermate/02-alfa.ts": f})
```

dove `a` e `f` sono i moduli **già inlinati nello stesso file**. Zero
`import()` dinamico, zero `fetch` verso i moduli raccolti, un solo chunk JS.
Conteggio di `fetch(` nel bundle di prova: **1**, ed è il polyfill
`modulepreload` di Vite — lo stesso, identico, che il bundle di `dist/`
**contiene già oggi**: `grep -o "fetch(" dist/assets/*.js` ne conta **1** sia
prima sia dopo. La raccolta automatica quindi **non aggiunge nulla** a ciò che
`/verifica` scandisce al controllo 3.

**1.3 — Un componente può importare il proprio foglio di stile. `src/main.tsx`
esce dalla lista senza bisogno di nessun registro.** È il guadagno più
economico dei cinque: non richiede il registro, non richiede una decisione, si
ottiene spostando una riga. Nella prova, un modulo raccolto contenente
`import './stiliAlfa.css'` ha prodotto la regola CSS dentro l'unico
`dist/assets/style-*.css` — perché `cssCodeSplit: false` raccoglie comunque
tutto in un foglio solo — e il test in ambiente `node` che importava quel
modulo **è rimasto verde**: vitest non processa i CSS e l'import non rompe
nulla.

**1.4 — Un errore di tipo che va risolto dentro `src/ui/`, non nella
configurazione.** `tsconfig.json` dichiara `"types": ["vitest/globals",
"node"]`: senza `vite/client`, `npx tsc --noEmit` fallisce con

```
error TS2339: Property 'glob' does not exist on type 'ImportMeta'.
```

Provato. Provata anche la via d'uscita: una direttiva
`/// <reference types="vite/client" />` **in testa al solo file del registro**
fa passare `tsc` con esito 0, **senza toccare `tsconfig.json`**. È lo stesso
gesto che `vite.config.ts` fa già alla riga 1 con `/// <reference
types="vitest" />`. Conta perché `tsconfig.json` è configurazione — perimetro
dell'architetto — mentre il file del registro sta in `src/ui/`, perimetro di
chi costruisce.

### 2. Che cosa dichiara una schermata

Un file per schermata, `src/ui/schermate/NN-nome.ts`, **di proprietà di chi
costruisce quella schermata**. Il `NN` è lo stesso di spec, branch e commit:
è già la convenzione del progetto, e qui serve anche a rendere l'ordine di
raccolta leggibile.

Quattro campi, il minimo perché i quattro file condivisi non servano più:

| Campo | Tipo | Sostituisce |
| --- | --- | --- |
| `id` | stringa letterale | il membro dell'unione `Rotta` |
| `percorso` | `#/...` | la costante di percorso in `rotte.ts` |
| `componente` | `() => ReactElement`, senza props | il `case` in `App.tsx` |
| `passo` | `ChiaveStringaUtente` | il ramo di `passoCorrente` in `Navigazione.tsx` |

**Il foglio di stile non è un campo.** Prova 1.3: il componente lo importa da
sé. Un campo in più qui sarebbe un secondo modo di fare la stessa cosa.

**Il registro delle stringhe non è la fonte, ma entra come controllo.** Il
perché è al passo 5. La dichiarazione porta un quinto campo **facoltativo**,
`stringhe`, che è il registro della schermata: non viene usato per costruire
`STRINGHE_UTENTE`, serve solo al test che verifica che quelle chiavi ci siano
davvero.

`componente` **senza props** è un vincolo, non una dimenticanza: rende la
dichiarazione uniforme e il registro tipizzabile. `PaginaMacrocategoria`, che
riceve `id`, resta perciò **fuori** dal registro insieme a `Home` — sono le
due rotte parametriche/di default, già gestite in `App.tsx` e non replicate da
nessuna schermata nuova.

### 3. Come il registro le raccoglie — la decisione

**`import.meta.glob('./*.ts', { eager: true })`, in
`src/ui/schermate/registro.ts`.**

Il motivo è per esclusione, ed è il punto su cui questa funzionalità vive o
muore. Un registro che **elenca a mano** le schermate — `import { SCHERMATA as
S07 } from './07-...'` e un array che le nomina — sarebbe più semplice, più
tipizzato e più ovvio. **E non risolverebbe il problema: lo sposterebbe di un
livello.** Quel file resterebbe condiviso, ogni schermata dovrebbe
aggiungerci la sua riga, e due agenti in parallelo tornerebbero a
sovrascriversi esattamente come oggi. Cinque punti di conflitto diventerebbero
uno, il che è già molto — ma il criterio dichiarato qui sopra («aggiungere
file, non modificarne») non sarebbe soddisfatto.

La raccolta automatica è accettabile **perché la prova 1.2 mostra che resta
statica**: risolta a build time, inlinata nel bundle, zero richieste. Il
vincolo offline non è scalfito.

I due costi vanno pagati, non taciuti:

**Costo A — la sicurezza dei tipi si perde nella raccolta.**
`import.meta.glob` restituisce `Record<string, unknown>`: il compilatore non
sa che cosa c'è dentro i moduli. Quindi il contenuto raccolto **va validato a
runtime**, con un type guard scritto a mano che controlla i quattro campi.
Una dichiarazione malformata non deve essere scartata in silenzio — sarebbe
lo stesso guasto di prima con un altro nome: deve **far fallire** con
un'eccezione dedicata che nomina il file. È la scelta che `contenutiHome.ts`
ha già fatto per un invariante rotto (`nessuna domanda di catalogo per
l'area…`) e che `src/main.tsx` fa per `#root` mancante, ed è coerente con
`standard-codice.md`: eccezione solo per l'invariante rotto, mai per il
flusso normale. Il singolo file di dichiarazione resta invece pienamente
tipizzato: `as const satisfies DichiarazioneSchermata` verifica al compilatore
tutto ciò che il glob non può più garantire.

**Costo B — l'ordine non può dipendere dal filesystem.** L'ordine di
restituzione del glob non è un'interfaccia su cui appoggiarsi: va reso
deterministico **ordinando esplicitamente** per la chiave del percorso file —
che, grazie al prefisso `NN`, è l'ordine dichiarato dei numeri di
funzionalità. Non ordinare significherebbe una build che cambia comportamento
cambiando macchina, che è il difetto che `standard-codice.md` vieta al core e
che non ha senso accettare qui.

### 4. Che cosa succede ai cinque file, uno per uno

Tutti e cinque vengono modificati **una volta sola, adesso**, da questa
funzionalità. Da lì in poi:

1. **`src/main.tsx` — esce.** Restano `styles.css` e gli stili globali già
   esistenti; i cinque `stiliX.css` delle schermate si spostano dentro i
   rispettivi componenti (prova 1.3).
2. **`src/ui/rotte.ts` — esce.** L'unione `Rotta` perde un membro per
   schermata e ne guadagna uno solo: `{ tipo: 'schermata'; id }`. `parseRotta`
   perde i rami uno-per-uno e cerca il percorso nel registro.
   **Resta pura** — legge una costante di modulo, non tocca il DOM, non fa
   I/O — e **continua a portare alla home qualunque indirizzo non
   riconosciuto**: è il ramo finale, invariato.
3. **`src/ui/App.tsx` — esce.** Lo `switch` conserva tre rami — `home`,
   `macrocategoria`, `schermata` — e l'ultimo risolve il componente dal
   registro invece di elencarlo. Un ramo per *forma* di rotta, non per
   schermata.
4. **`src/ui/Navigazione.tsx` — esce.** `passoCorrente` non conosce più le
   singole schermate: riceve il `passo` già risolto. I rami `home` e
   `macrocategoria` restano.
5. **`src/ui/testi.ts` — resta.** È l'unico. Il perché è il passo 5.

### 5. Le stringhe: perché `testi.ts` resta, e perché non è un cedimento

`STRINGHE_UTENTE` **deve restare un oggetto solo, esportato con quel nome**:
`tests/lessico-ui.test.ts` lo importa, ed è il punto unico che il guardrail
scandisce. Questo di per sé non impedirebbe al registro di raccogliere anche
le stringhe — l'oggetto finale resterebbe uno solo e il guardrail
continuerebbe a vederlo tutto.

Quello che lo impedisce è un'altra riga dello stesso file:

```ts
export type ChiaveStringaUtente = keyof typeof STRINGHE_UTENTE;
```

Passando dal glob, i tipi letterali delle chiavi si perdono — `Record<string,
unknown>` non li conserva, e la forma generica `import.meta.glob<T>` dà **un
tipo uniforme**, non l'unione delle chiavi dei singoli file. `ChiaveStringaUtente`
collasserebbe a `string`. Le conseguenze non sono accademiche:

- `<Testo chiave="…" />` smetterebbe di rifiutare una chiave inesistente: un
  refuso stamperebbe `undefined` a schermo invece di fallire alla
  compilazione. È esattamente ciò che il commento in `testi.ts` dichiara di
  impedire: «Accesso tipizzato: impedisce di stampare testo non registrato».
- `contenutiHome.ts` (`titolo: ChiaveStringaUtente`), `catalogoDomande.ts`
  (`chiave`), `PaginaLettura.tsx` e `Navigazione.tsx` perderebbero in silenzio
  lo stesso controllo.

**Scambiare un punto di conflitto visibile con un guardrail indebolito è un
cattivo affare**, e su un hackathon sull'inclusione il guardrail è il
progetto. Quindi `testi.ts` continua a fare lo spread esplicito, una riga per
schermata, come già fa per `STRINGHE_SIMULAZIONE`, `STRINGHE_FONTI`,
`STRINGHE_CATALOGO`.

Due cose rendono quella riga molto meno pericolosa delle cinque di oggi:

- **è una sola riga, in un gruppo contiguo in fondo all'oggetto.** Due
  schermate aggiunte in parallelo inseriscono in punti diversi e quasi sempre
  git le unisce da solo; quando non ci riesce, è un conflitto di una riga, che
  si vede e si risolve in dieci secondi. Il guasto grave non era il conflitto:
  era la sovrascrittura silenziosa;
- **dimenticarla non è più silenzioso.** Il campo `stringhe` della
  dichiarazione esiste per questo: un test attraversa il registro e verifica
  che **ogni chiave dichiarata da una schermata sia presente in
  `STRINGHE_UTENTE`**. Chi scorda lo spread trova un test rosso con il nome
  del file, non una pagina con dei buchi al posto delle parole.

### 6. Il cerchio da non chiudere

Il rischio più sottile dell'intera funzionalità, e va scritto perché non si
vede finché non morde: **il registro importa i componenti**, quindi nessun
componente può importare il registro. La catena che si formerebbe —
`rotte.ts` → `registro.ts` → `07-valore-risparmi.ts` →
`PaginaValoreRisparmi.tsx` → `NotaTasso.tsx` → `rotte.ts` — è un ciclo, e un
ciclo fra moduli ESM non esplode: lascia una costante `undefined` all'ora
giusta. Un `href` vuoto, nessun errore.

Oggi tre componenti importano `rotte.ts`: `NotaTasso.tsx` (`PERCORSO_FONTI`),
`Home.tsx` (`PERCORSO_LETTURA`), `CardMacrocategoria.tsx` (`percorsoArea`).

La regola da rispettare: **le costanti di percorso che i componenti usano
stanno in un modulo foglia, che non importa niente.** Che sia `rotte.ts`
alleggerito o un `percorsi.ts` affiancato lo decide chi implementa; il vincolo
è che quel modulo non importi il registro. `App.tsx` resta l'**unico** modulo
dell'interfaccia che importa il registro — risolve la schermata una volta e
passa `passo` a `Navigazione` come prop, invece di far cercare anche a lei.

Per il collegamento *fra* schermate il progetto ha già deciso, e la decisione
va tenuta: `catalogoDomande.ts` scrive il percorso della 07 come stringa
letterale «per non creare un import circolare», con il commento che lo
spiega. Lo stesso vale qui, con un test che confronta il letterale con il
percorso dichiarato nel registro.

## Output

**A schermo non compare niente di nuovo. È questo l'esito atteso**, ed è la
cosa da controllare per prima: le due schermate esistenti devono restare
identiche — stessi indirizzi `#/valore-dei-risparmi` e
`#/da-dove-vengono-i-numeri`, stesso percorso di navigazione, stessi stili,
stesso comportamento del tasto «indietro».

**Nessuna stringa nuova in `src/ui/testi.ts`.** Questa funzionalità non
produce testo rivolto all'utente: non ha nulla da far rileggere al guardrail
sul fronte del lessico, e il suo contributo all'utente è indiretto — le nove
schermate che restano arrivano insieme invece che in fila, e nessuna sparisce
per strada.

File nuovi:

| File | Contenuto |
| --- | --- |
| `src/ui/schermate/registro.ts` | il glob, la validazione, l'ordinamento, `SCHERMATE` e la ricerca per percorso. Direttiva `/// <reference types="vite/client" />` in testa |
| `src/ui/schermate/tipi.ts` | `DichiarazioneSchermata` e il type guard |
| `src/ui/schermate/07-valore-risparmi.ts` | la 07 dichiarata |
| `src/ui/schermate/13-fonti.ts` | la 13 dichiarata |
| `tests/accettazione/14-registro-delle-schermate.test.ts` | i test qui sotto |

Massimo 150 righe per file, export nominali, niente `any` — dove serve
un'apertura si usa `unknown` e si restringe con il type guard, che è
esattamente il caso previsto da `standard-codice.md`.

## Come si dimostra che ha funzionato

Il criterio vero **non è «la pagina si apre»**. Una pagina che si apre non
dice niente sul parallelismo. Quattro prove, in
`tests/accettazione/14-registro-delle-schermate.test.ts`:

1. **Il registro raccoglie tutte le schermate che esistono sul disco.** Il
   test legge la cartella `src/ui/schermate/` con `readdirSync`, ne filtra i
   file `NN-*.ts`, e confronta quell'elenco con `SCHERMATE`. È il test che non
   si può ingannare: un file dichiarato e non raccolto — il guasto silenzioso
   che tutta la funzionalità esiste per impedire — lo fa fallire con il nome
   del file mancante. `lessico-ui.test.ts` usa già `readdirSync` sull'albero
   dei sorgenti: lo schema è noto al progetto.
2. **I punti di conflitto rimasti sono uno, e si chiama `testi.ts`.** Il test
   legge `rotte.ts`, `App.tsx`, `Navigazione.tsx` e `main.tsx` e verifica che
   **non contengano** gli identificatori delle singole schermate
   (`valore-risparmi`, `fonti`, `PaginaFonti`, `stiliFonti.css`…). Finché
   passa, quei quattro file sono davvero fuori dal perimetro di chi aggiunge
   una schermata. È il numero della dimostrazione: **da 5 a 1**.
3. **Ogni chiave di stringa dichiarata è presente in `STRINGHE_UTENTE`** —
   il controllo che rende rumorosa l'unica riga condivisa rimasta (passo 5).
4. **Le due schermate esistenti non sono cambiate.** Nessun test nuovo: i
   test di 07 e 13 già scritti devono restare verdi **senza essere
   riscritti**, salvo le assunzioni sulla *forma* di `Rotta`.

**Costo dichiarato in anticipo, perché non sia una sorpresa in fase 2:**
quattro punti nei test esistenti asseriscono la forma vecchia di `Rotta` e
vanno aggiornati — `tests/accettazione/02-catalogo-domande-errori.test.ts:32`
(`{ tipo: 'valore-risparmi' }`), `tests/accettazione/13-tabella-fonti-dati-pagina.test.ts:111-112`
(`{ tipo: 'fonti' }`, `{ tipo: 'valore-risparmi' }`) e
`tests/accettazione/02-catalogo-domande-limite.test.ts:46` (`{ tipo: 'lettura' }`).
`parseRotta('#/qualcosa-che-non-esiste') → { tipo: 'home' }` **non cambia** e
non va toccato. È un costo di questa funzionalità, una volta sola; è anche il
motivo per cui `04-guardrail-officer` è coinvolto e `tests/` è nell'impronta.

**In demo, in dieci secondi:** `git show --stat` sul commit di questa
funzionalità accanto a `git show --stat` sul commit della 13. Il primo
aggiunge file, il secondo ne modificava cinque. È la slide del metodo, non
una schermata.

## Cosa questa funzionalità NON fa

- **Non aggiunge nessuna schermata e non cambia nulla di ciò che si vede.** Se
  a fine lavoro qualcosa appare diverso a schermo, è un difetto, non un
  effetto.
- **Non porta i punti di conflitto a zero. Ne resta uno**, `src/ui/testi.ts`,
  una riga per schermata, per la ragione al passo 5. Dichiararlo qui è il
  punto: un «zero» scritto e non vero sarebbe peggio di un «uno» vero.
- **Non tocca `types/`.** Nessun contratto di dominio entra: una schermata non
  è un dato di dominio. Non richiede l'architetto per il congelamento.
- **Non tocca `tsconfig.json` né `vite.config.ts`.** Prova 1.4: la direttiva
  `/// <reference types="vite/client" />` tiene la modifica dentro `src/ui/`.
- **Non risolve il difetto noto di `file://`.** Aperta con un doppio clic su
  `dist/index.html`, la pagina resta bianca: gli attributi `type="module"
  crossorigin` sono bloccati sotto origine `null`. È lo stesso difetto già
  registrato nelle schede 01 (passo 8) e 13 (passo 11, «Divergenze» 1), la sua
  causa vive nella configurazione di build, ed è fuori dal perimetro di questa
  funzionalità. **Il vincolo è non peggiorarlo**, ed è verificato: la prova
  1.2 mostra un solo chunk JS, nessun `import()` dinamico, nessun modulo
  caricato separatamente — la raccolta non aggiunge un secondo file che
  `file://` dovrebbe andare a prendere.
- **Non introduce una libreria di routing.** Le dipendenze consentite sono
  quelle dichiarate in `CLAUDE.md` e restano quelle.
- **Non fa caricamento differito né divisione del bundle.** `{ eager: true }`
  non è un dettaglio di stile: è il campo che tiene la raccolta a build time.
  Un glob senza `eager` produrrebbe `import()` dinamici, cioè richieste a
  runtime, cioè il vincolo 1 del progetto violato.
- **Non cambia il modo in cui si scrivono i componenti.** Nessuna stringa
  fuori da `testi.ts`, nessun calcolo nel JSX: le tre regole di `app/CLAUDE.md`
  valgono identiche prima e dopo.
- **Non rende parallele le schermate che condividono altro.** Due schermate
  che toccano entrambe `src/core/` restano in conflitto sul core: questa
  funzionalità scioglie il collo di bottiglia dell'interfaccia, non ogni
  possibile sovrapposizione. L'impronta del backlog continua a decidere.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **nessuno.** `DichiarazioneSchermata` nasce **dentro `src/ui/`**, di proprietà di ui-builder: descrive come l'interfaccia si compone, non un dato che l'utente riceve. `types/contracts.ts` non viene né letto né esteso |
| **Contratti già congelati?** | **no** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: `types/` non è toccata, quindi **non richiede l'architetto** |
| **Agente incaricato** | **`03-ui-builder`** (registro, dichiarazioni, i quattro file condivisi, `src/main.tsx`), con **`04-guardrail-officer`** per `tests/` — i quattro test nuovi e l'aggiornamento dei quattro punti che asseriscono la forma vecchia di `Rotta` |
| **Directory toccate** | **2 — servono due agenti.** `src/ui/` (nuovi: `schermate/registro.ts`, `schermate/tipi.ts`, `schermate/07-valore-risparmi.ts`, `schermate/13-fonti.ts`; modificati: `rotte.ts`, `App.tsx`, `Navigazione.tsx`, `testi.ts`, `PaginaFonti.tsx`, `PaginaValoreRisparmi.tsx` e gli altri componenti per l'import del proprio CSS, più `NotaTasso.tsx`/`Home.tsx`/`CardMacrocategoria.tsx` se le costanti di percorso si spostano in un modulo foglia) e `tests/` (nuovo `accettazione/14-registro-delle-schermate.test.ts`; modificati `accettazione/02-catalogo-domande-errori.test.ts`, `accettazione/02-catalogo-domande-limite.test.ts`, `accettazione/13-tabella-fonti-dati-pagina.test.ts`). **`types/`, `fixtures/`, `src/core/`, `src/guardrails/`, `src/assessment/` non sono toccate.** **`src/main.tsx` è modificato** (rimozione di cinque import di CSS) e **non appartiene formalmente a nessuna directory della tabella di `CLAUDE.md`**: è già stato toccato dai commit di ui-builder delle funzionalità 01, 07 e 13, quindi la prassi è consolidata, ma **va segnalato all'architetto invece che nascosto nel diff**, come prescrive la definition of done |
| **Evidenza prodotta per il deck** | non uno screenshot — non c'è niente di nuovo da vedere. L'evidenza è **numerica e di processo**: l'uscita di `npm run pm:piano` **prima e dopo**, che mostra le nove schermate passare da nove ondate a una sola, più il `git show --stat` di confronto fra il commit della 13 (cinque file condivisi modificati) e quello della prima schermata costruita dopo la 14. Va sulla slide del metodo, accanto a `agents/trace.md`: è la prova che la decomposizione in agenti è stata misurata e corretta, non dichiarata |
