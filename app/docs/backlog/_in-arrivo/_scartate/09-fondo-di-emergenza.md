# 09 — «Per quanti mesi bastano i soldi che ho da parte»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 4, simulatore 3. Task di backlog: `09`.
>
> **Il calcolo passa esattamente come sta nel documento d'origine.** È l'unico
> simulatore del sito che **non dipende da nessun dato esterno**: nessuna
> fonte da recuperare, nessun periodo da dichiarare, nessun blocco aperto come
> la `07` e la `08`. Un solo confine va messo, e va letto prima del resto.

## Il confine: mostra quanti mesi coprono, non quanti dovrebbero coprire

La divulgazione finanziaria accompagna quasi sempre questo calcolo con una
frase: «dovresti avere da parte tre-sei mesi di spese». Quella frase **non può
comparire da nessuna parte in questa schermata**, ed è vietata due volte:

1. **è una raccomandazione personalizzata**, cioè il primo divieto del
   progetto — e il lessico la blocca già alla lettera, perché `dovresti` è una
   delle radici di `src/guardrails/lessico.ts`, voce `dovere-personale`;
2. **è un numero senza fonte.** Nella tabella della sezione 7 del documento
   d'origine non compare, perché nessuna fonte autoritativa la pubblica. Sono
   i due difetti che il progetto esiste per non avere, nella stessa riga.

Da qui tre conseguenze operative, tutte volute:

- **la schermata mostra quanti mesi i risparmi coprono, non quanti mesi
  dovrebbero coprire.** La differenza non è di tono: è la differenza fra un
  fatto e un giudizio sulla vita di chi legge;
- **niente semaforo verde/giallo/rosso**, pur essendo un pattern prescritto da
  `.claude/rules/scrittura-e-accessibilita.md`. È una **deroga dichiarata, non
  una dimenticanza**: il semaforo classifica bene un fatto verificabile — una
  somma che quadra o non quadra — ma qui il colore direbbe «va bene /
  attenzione / preoccupante» su una situazione personale, e per dirlo servirebbe
  una soglia. **Una soglia è un consiglio travestito da colore.** Il rosa resta
  quello che è nel resto del sito: il colore dei limiti, non del giudizio;
- **l'espressione «fondo di emergenza» non compare a schermo**, né negli
  identificatori, né nella rotta. Il numero del task resta `09` perché lega
  backlog, branch e commit — la traccia di `agents:trace` si incrocia sul
  numero — ma il nome è precisamente ciò che pone da sola la domanda «il mio è
  abbastanza grande?», a cui questo prodotto non può rispondere.

Applicato lo schema della regola sulla diversificazione: **tolto il «tu devi»,
resta il «chi ha questa cifra e queste spese, copre questi mesi»**.

## Per chi

Una persona con un lavoro che potrebbe non esserci fra sei mesi — un contratto
a termine in scadenza, un cliente solo, un'azienda che ha annunciato tagli. Ha
qualcosa da parte e non sa dire quanto le durerebbe. L'ansia è nella forma
peggiore, quella generica: «non so se basterebbe». In quella forma non si può
né misurare né posare.

Non è una persona che fa il budget su un foglio di calcolo. È una persona che
sa quanto paga di affitto e di bollette, e non ha mai diviso una cifra per
l'altra.

## Quando serve

Nel momento in cui arriva la notizia che il reddito potrebbe fermarsi. Oppure
nel momento tranquillo in cui guarda il saldo e la domanda le passa per la
testa da sola. Serve **prima** che succeda qualcosa: dopo, nessuno apre un sito
per fare una divisione.

## Cosa deve poter fare dopo

Dire una cifra riferita a sé: «con 1.250 € di spese fisse al mese e 4.000 €
da parte, quei soldi coprono 3 mesi e 6 giorni». Prima aveva «non so se
basterebbe», dopo ha un numero che **può rifare su un foglio** — ed è
importante che possa: il conto in chiaro è ciò che distingue questa schermata
da un oracolo.

Osservabile: sa dire quanti mesi, quanti giorni oltre i mesi interi, e quanto
le costa una giornata di spese fisse.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `speseMensiliCent` | intero in centesimi | lo digita la persona |
| `risparmiCent` | intero in centesimi | lo digita la persona |

**Nessun terzo dato, e nessuna fonte esterna.** Niente costante da recuperare,
niente periodo da dichiarare, nessun flag «provenienza incompleta»: è la
proprietà migliore di questo simulatore e va detta a schermo, perché è anche
la ragione per cui il numero è controllabile fino in fondo.

Che cosa contano come «spese fisse» lo decide la persona, e la schermata glielo
dice con esempi concreti — affitto o rata, bollette, spesa, trasporti,
telefono — **senza fornire un elenco da spuntare**: una casella dimenticata
produrrebbe un numero sbagliato che sembra giusto, e un elenco completo sarebbe
un secondo concetto nella stessa schermata.

Limiti dei campi — del campo digitato, non dell'aritmetica:

| Costante | Valore | Perché |
| --- | --- | --- |
| `SPESE_MENSILI_MIN_CENT` | `1_000` (10,00 €) | sotto, è un errore di battitura: sono le spese fisse di un mese intero |
| `SPESE_MENSILI_MAX_CENT` | `10_000_000` (100.000,00 €) | lo stesso, dall'altro lato |
| `RISPARMI_MAX_CENT` | `1_000_000_000` (10.000.000,00 €) | **stessa soglia della `07`**, per coerenza fra due schermate che chiedono la stessa cosa |

> **`risparmiCent = 0` non è un errore: è un risultato.** Zero da parte dà zero
> giorni coperti, e per chi si trova in quella situazione quella è la risposta
> vera. Rifiutarla come «errore di validazione» sarebbe un giudizio mascherato
> da controllo, e la persona che più avrebbe bisogno di vedere il numero è
> proprio quella che verrebbe respinta. È una **differenza voluta rispetto alla
> `07`**, dove `somma-a-zero` è un rifiuto perché su zero euro non c'è nessuna
> erosione da mostrare.
>
> `speseMensiliCent = 0` invece è un rifiuto, e per un motivo puramente
> aritmetico: è il divisore.

## Elaborazione

Tutto in `src/core/`, puro e deterministico. **Aritmetica interamente su
interi**: qui, a differenza della `07`, non compare **nessun** numero a virgola
mobile, perché non c'è nessuna esponenziale. Il risultato è esatto, non
approssimato.

Una convenzione dichiarata, una sola: **`GIORNI_PER_MESE = 30`**. Non è un dato
di nessuna fonte e non pretende di essere un calendario: è il modo in cui il
resto della divisione diventa leggibile. Sta scritta **a schermo**, non solo
nel codice, perché chi rifà il conto sul foglio deve sapere per che cosa
dividere.

1. `mesiInteri = Math.floor(risparmiCent / speseMensiliCent)`
2. `restoCent = risparmiCent - mesiInteri × speseMensiliCent`
3. `giorniResidui = Math.floor((restoCent × 30) / speseMensiliCent)`
4. `costoGiornalieroCent = Math.floor(speseMensiliCent / 30)` — quanto costa una
   giornata di spese fisse: è il ponte che rende rifacibile a mano il passo 3
5. `giorniPerCentoEuro = Math.floor((10_000 × 30) / speseMensiliCent)` — quanti
   giorni copre ogni 100 € messi da parte, che è il paragone mostrato a schermo

**Arrotondamento sempre per difetto** (`floor`, mai `round`), su tutti i passi.
La cifra mostrata non dichiara mai una copertura più lunga di quella che la
divisione dà. Non è prudenza consigliata a chi legge: è igiene del numero, e
non va spiegata come una precauzione, perché una precauzione è un consiglio.

Tre proprietà, vere sull'algebra e non solo sull'esempio — il test le verifica
come proprietà, non come casi:

- `giorniResidui` sta **sempre** fra `0` e `29`, perché `restoCent` è per
  costruzione minore di `speseMensiliCent`;
- `restoCent` sta **sempre** fra `0` e `speseMensiliCent - 1`;
- `mesiInteri × speseMensiliCent + restoCent = risparmiCent`, **esatto**: la
  scomposizione non perde un centesimo, ed è ciò che permette di mostrarla in
  chiaro senza uno scarto da giustificare.

Nessun rischio di superare l'intero sicuro: il prodotto più grande è
`1_000_000_000 × 30 = 3 × 10¹⁰`, contro un `Number.MAX_SAFE_INTEGER` di circa
`9 × 10¹⁵`.

### Verifica a mano, da riportare nel commento del test

**Caso A — quello della demo.** `speseMensiliCent = 125_000` (1.250,00 € al
mese), `risparmiCent = 400_000` (4.000,00 €).

```
mesiInteri           = floor(400.000 / 125.000) = floor(3,2)        =  3
restoCent            = 400.000 - 3 × 125.000 = 400.000 - 375.000    = 25.000 cent (250,00 €)
giorniResidui        = floor(25.000 × 30 / 125.000)
                     = floor(750.000 / 125.000) = floor(6,0)        =  6
costoGiornalieroCent = floor(125.000 / 30) = floor(4.166,67)        =  4.166 cent (41,66 €)
giorniPerCentoEuro   = floor(10.000 × 30 / 125.000)
                     = floor(300.000 / 125.000) = floor(2,4)        =  2
```

Risultato: **3 mesi e 6 giorni**.

Controprova, quella che rifà la persona sul foglio: 250,00 € di resto diviso
41,66 € al giorno fa 6 giorni interi. I due conti devono dare lo stesso numero
— il passo 3 e il passo 4 non possono divergere.

**Caso B — quello che fa lavorare `floor` su tutti i passi.**
`speseMensiliCent = 98_000` (980,00 €), `risparmiCent = 250_000` (2.500,00 €).

```
mesiInteri           = floor(250.000 / 98.000) = floor(2,551)       =  2
restoCent            = 250.000 - 2 × 98.000 = 250.000 - 196.000     = 54.000 cent (540,00 €)
giorniResidui        = floor(54.000 × 30 / 98.000)
                     = floor(1.620.000 / 98.000) = floor(16,53)     = 16
                       (98.000 × 16 = 1.568.000 <= 1.620.000 < 1.666.000 = 98.000 × 17)
costoGiornalieroCent = floor(98.000 / 30) = floor(3.266,67)         =  3.266 cent (32,66 €)
giorniPerCentoEuro   = floor(10.000 × 30 / 98.000)
                     = floor(300.000 / 98.000) = floor(3,06)        =  3
```

Risultato: **2 mesi e 16 giorni**.

**Caso C — meno di un mese.** È lo stato che una schermata sbagliata
colorerebbe di rosso. `speseMensiliCent = 98_000`, `risparmiCent = 50_000`
(500,00 €).

```
mesiInteri           = floor(50.000 / 98.000)                       =  0
restoCent            = 50.000 - 0                                   = 50.000 cent (500,00 €)
giorniResidui        = floor(50.000 × 30 / 98.000)
                     = floor(1.500.000 / 98.000) = floor(15,31)     = 15
```

Risultato: **0 mesi e 15 giorni**. La schermata lo scrive esattamente come
scrive «3 mesi e 6 giorni»: **stesso colore, stesso corpo, stesso posto**.
Nessun allarme, nessun punto esclamativo, nessun cambio di tono. Chi ha
quindici giorni davanti lo sa già: la schermata gli dà il numero, non il
giudizio.

**Caso D — zero da parte.** `speseMensiliCent = 98_000`, `risparmiCent = 0`.

```
mesiInteri = 0 · restoCent = 0 · giorniResidui = 0
```

Risultato: **0 mesi e 0 giorni**, mostrato come risultato e non come errore.

**Caso E — i dati che rompono la griglia.** `speseMensiliCent = 1_000`
(10,00 €, il minimo), `risparmiCent = 1_000_000_000` (10.000.000,00 €, il
massimo).

```
mesiInteri           = floor(1.000.000.000 / 1.000)                 = 1.000.000
restoCent            = 0
giorniResidui        = 0
giorniPerCentoEuro   = floor(300.000 / 1.000)                       = 300
```

Un milione di mesi non è una cifra realistica: serve a far sudare il layout. Il
numero grande deve restare su una riga sola, con i punti delle migliaia, senza
barra di scorrimento orizzontale.

## Output

Una schermata sola, un concetto solo: **per quanti mesi bastano**.

| Elemento | Forma |
| --- | --- |
| **Il numero grande** | «3 mesi e 6 giorni». È il più grande della schermata, e non è una cifra in euro: è la risposta alla domanda posta nel titolo |
| Il paragone | «Ogni 100 € che hai da parte coprono 2 giorni delle tue spese fisse» |
| Il conto in chiaro | le tre righe della scomposizione, così come stanno nella verifica a mano: «3 mesi interi da 1.250,00 € fanno 3.750,00 € · ti restano 250,00 € · una giornata di spese fisse ti costa 41,66 €, quindi altri 6 giorni» |
| La convenzione dichiarata | che un mese qui vale 30 giorni, scritto accanto al conto e non in fondo |
| Le due ipotesi | che le spese restino queste e che non entri più niente — **accanto al risultato**, in corpo pieno |

Il conto in chiaro non è un dettaglio per curiosi: è **il motivo per cui la
persona può fidarsi del numero**. Su questa schermata non esiste nessun dato
dichiarato da verificare altrove, quindi l'unica prova disponibile è che il
conto si possa rifare — e per rifarlo servono i tre passaggi scritti.

**Nessuna informazione disponibile solo al passaggio del mouse.** Il conto in
chiaro è sempre visibile, non dietro un «mostra dettagli»: al proiettore e su
touch il hover non esiste.

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre
tabulari, unità accanto al valore.

**Stringhe nuove**: in un file dedicato `src/ui/testiMesiCoperti.ts`,
incorporato in `STRINGHE_UTENTE` di `src/ui/testi.ts` con lo spread, come già
`testiSimulazione.ts`: il registro scandito dal guardrail resta **un oggetto
solo** e `testi.ts` non supera le 150 righe. Chiavi, per gruppo:

- intestazione — `mesiCopertiOcchiello`, `mesiCopertiTitolo`,
  `mesiCopertiIntro`, `mesiCopertiPasso`
- i due campi — `mesiCopertiEtichettaSpese`, `mesiCopertiAiutoSpese`,
  `mesiCopertiEsempioSpese`, `mesiCopertiEtichettaRisparmi`,
  `mesiCopertiAiutoRisparmi`, `mesiCopertiEsempioRisparmi`
- il risultato — `mesiCopertiVuoto`, `mesiCopertiInSospeso`,
  `mesiCopertiEtichettaValore`, `mesiCopertiRisultato`,
  `mesiCopertiRisultatoSoloGiorni`, `mesiCopertiRisultatoZero`,
  `mesiCopertiParagone`
- il conto in chiaro — `mesiCopertiContoMesi`, `mesiCopertiContoResto`,
  `mesiCopertiContoGiorni`, `mesiCopertiConvenzione`
- le ipotesi — `mesiCopertiIpotesiSpese`, `mesiCopertiIpotesiEntrate`
- gli errori — `mesiCopertiErroreSpese`, `mesiCopertiErroreSpeseZero`,
  `mesiCopertiErroreSpeseBasse`, `mesiCopertiErroreSpeseAlte`,
  `mesiCopertiErroreRisparmi`, `mesiCopertiErroreRisparmiNegativi`,
  `mesiCopertiErroreRisparmiAlti`, `mesiCopertiNotaCentesimi`
- il confine — `mesiCopertiLimitiTitolo`, `mesiCopertiLimiteSoglia`,
  `mesiCopertiLimiteAzione`, `mesiCopertiLimiteDati`

Tre casi di testo che vanno pensati **prima** di scriverli. `mesiCoperti = 0`
richiede una frase propria (`mesiCopertiRisultatoSoloGiorni`): «0 mesi e 15
giorni» è aritmeticamente giusto e umanamente brutto, si scrive «15 giorni».
Il singolare va gestito: «1 mese e 1 giorno», non «1 mesi e 1 giorni». E
nessuna frase può contenere `dovresti`, `dovrebbe`, `conviene`, `migliore` —
il lessico li blocca — né la parola «fondo», che il test scoped di questa
funzionalità aggiunge.

**I quattro stati obbligatori**, non solo quello che funziona:

1. **Vuoto** — nessuna cifra digitata: la schermata dice quali due cose
   servono, **con esempi di che cosa sono le spese fisse**, e dove scriverle.
   Non «nessun risultato», che è una porta chiusa e non una spiegazione.
2. **In caricamento** — il calcolo è immediato e locale, quindi lo stato esiste
   ma non lampeggia: il riquadro del risultato e le tre righe del conto
   occupano già il loro spazio, così il layout non salta quando i numeri
   arrivano.
3. **Errore** — in linguaggio umano: «Controlla questo numero, sembra troppo
   alto», mai «errore di validazione». Il numero grande non mostra mai un
   risultato calcolato su un dato che non va, e **quello già digitato
   nell'altro campo resta dov'è**.
4. **Dati lunghi o numerosi** — il caso E: sette cifre da una parte e il minimo
   dall'altra. Il numero grande resta su una riga, la scomposizione non
   sovrappone le sue tre righe, nessuna barra di scorrimento orizzontale.

### Che cosa si riusa della `07`, invece di ricostruirlo

| Pezzo | Come si riusa |
| --- | --- |
| `src/ui/CampoNumerico.tsx` | **così com'è.** Già parametrizzato per chiavi di testo: i due campi sono due istanze, niente da modificare |
| `src/ui/letturaCampi.ts` | **così com'è.** `leggiSomma` per tutti e due i campi, che sono due importi — e `decimaliOltreIlCentesimo` per la nota sull'arrotondamento |
| `src/ui/Testo.tsx` e `t()` | **così come sono.** Segnaposto `{nome}` per ogni numero |
| `src/core/formatoIt.ts` | **così com'è.** `formattaEuro` |
| `src/core/esito.ts` | **così com'è.** `Esito<T, Codice>` per il ramo di rifiuto |
| `src/ui/rotte.ts` | si aggiunge **una rotta**, sullo stile di `PERCORSO_VALORE_RISPARMI`. Nell'indirizzo non finiscono le cifre digitate |
| CSS di `stiliSimulazione.css` e `stiliRisultato.css` | **classi riusate**: `.simulazione`, `.campi`, `.campo`, `.risultato`, `.risultato-cifra`, `.risultato-paragone`, `.cifra`, `.limiti`. Serve in più il solo blocco del conto in chiaro |
| `src/ui/RisultatoRisparmio.tsx` | **il pattern, non il componente.** È tipizzato sul risultato della `07`. Si ripete la forma — riquadro che occupa sempre lo stesso spazio, cifra grande + paragone accanto, tre momenti, `aria-live="polite"`, il segnaposto `aria-hidden` al posto dello zero — in un componente proprio |
| `src/ui/motiviRisparmio.ts` | **il pattern.** La mappa `Record<MotivoRifiuto, ChiaveStringaUtente>` esaustiva per costruzione: il giorno in cui il core aggiunge un codice, il compilatore lo segnala invece di lasciare a schermo un riquadro muto |
| `src/ui/NotaTasso.tsx` | **non si riusa, e non serve.** Quel componente esiste per dichiarare la provenienza di un dato esterno: qui non c'è nessun dato esterno. Al suo posto, nella stessa posizione e con la stessa forma, le due ipotesi e la convenzione dei 30 giorni |

**Sull'avvertenza prescritta dal documento d'origine.** Il testo standard
(«Questo è un calcolo stimato, basato su formule semplificate e dati
pubblici…») **non esiste come stringa riusabile nella `07`**, e su questa
schermata sarebbe anche falso: qui non ci sono «dati pubblici» e la formula non
è semplificata — è una divisione esatta. Si riusa **la posizione e la forma**
delle tre righe di `NotaTasso.tsx` (sotto il risultato, corpo pieno, mai in
grigio slavato), e le parole dicono la cosa vera: che il numero presuppone
spese ferme e nessuna entrata, e che un mese qui vale trenta giorni.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/mesiCoperti.test.ts`, con i valori
  attesi dei **cinque casi calcolati a mano qui sopra** scritti nel commento
  accanto all'asserzione. Copre inoltre le **tre proprietà**: `giorniResidui`
  sempre fra 0 e 29, `restoCent` sempre minore delle spese mensili, e la
  ricomposizione esatta `mesiInteri × spese + resto = risparmi`.
- **Conformità lessicale scoped** — `tests/lessico-mesi-coperti.test.ts`, sul
  modello di `tests/lessico-simulazione-risparmio.test.ts`. Scandisce
  `testiMesiCoperti.ts` contro **due famiglie** che il lessico sitewide non
  copre: le **soglie** (`tre mesi`, `sei mesi`, `almeno`, `abbastanza`,
  `sufficiente`, `obiettivo`, `traguardo`, `dovresti`) e il **nome vietato**
  (`fondo`, `emergenza`, `cuscinetto`, `salvadanaio`). Restano fuori dal
  lessico generale di proposito: «fondo pensione» è l'esempio canonico di
  `.claude/rules/scrittura-e-accessibilita.md` e va poter essere scritto
  altrove nel sito. Il controllo è **scoped a questa schermata**, come già per
  la `07`.
- **Test di accettazione** — `tests/accettazione/09-mesi-coperti.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice.
- **In demo, dieci secondi**: si digita 1.250, si digita 4.000, compare
  **«3 mesi e 6 giorni»** come numero grande, e sotto le tre righe del conto
  che chiunque può rifare — 3 mesi da 1.250 fanno 3.750, restano 250, una
  giornata costa 41,66, quindi altri 6 giorni.

## Cosa questa funzionalità NON fa

- **Non dice se quei mesi siano pochi o tanti.** Nessuna soglia, nessun
  obiettivo, nessun «tre-sei mesi». Sarebbero due violazioni in una riga sola:
  una raccomandazione personalizzata **e** un numero senza provenienza.
- **Non usa il semaforo verde/giallo/rosso**, ed è una **deroga dichiarata** a
  un pattern che il progetto prescrive altrove. Il semaforo ha bisogno di una
  soglia per esistere, e qualunque soglia qui sarebbe un consiglio travestito
  da colore.
- **Non si chiama «fondo di emergenza»** a schermo, né negli identificatori, né
  nella rotta. Il nome pone da solo la domanda «il mio è abbastanza grande?», e
  a quella domanda il prodotto non può rispondere.
- **Non propone un traguardo e non calcola quanto manca per arrivarci.** «Ti
  mancano 4.500 € per arrivare a sei mesi» è un consiglio travestito da
  sottrazione.
- **Non fa digitare un traguardo alla persona.** Sarebbe conforme — lo
  stabilirebbe lei — ma è un **secondo concetto** nella stessa schermata, e la
  regola è uno per schermata. Se servirà: altra spec, altro branch.
- **Non chiede perché** le entrate potrebbero fermarsi, e non distingue fra un
  licenziamento, una malattia e una pausa voluta: la divisione è la stessa. E
  non drammatizza l'ipotesi — la dichiara e basta.
- **Non nomina prodotti finanziari** — conti, depositi, fondi, titoli, polizze —
  e **non dice dove tenere quei soldi**. È lo stesso divieto che la `07` rende
  eseguibile in `tests/lessico-simulazione-risparmio.test.ts`.
- **Non calcola l'inflazione** su quella cifra. Incrociare la `07` e la `09`
  metterebbe due concetti nella stessa schermata, e il secondo mangerebbe il
  primo.
- **Non è una previsione.** Presuppone che le spese restino quelle e che non
  entri più niente: due ipotesi che stanno **a schermo**, accanto al risultato,
  non in una nota a piè di pagina. Non tiene conto di spese che cambiano, di
  entrate residue — una NASpI, un lavoro part-time — né di imprevisti.
- **Non usa un calendario vero.** Trenta giorni per mese è una convenzione
  dichiarata: su febbraio e su un anno intero il numero sarebbe leggermente
  diverso. Vale la stessa scelta di tutto il progetto: **dichiarare la
  convenzione invece di nasconderla dietro una precisione che non serve.**
- **Non legge nessun documento** e non tocca `src/ingest/`: i due numeri si
  digitano a mano.
- **Non conserva e non trasmette niente.** Le due cifre restano nello stato
  della pagina e **non finiscono nell'indirizzo**, per la ragione già scritta
  in `src/ui/rotte.ts` per la `07`: un importo nell'hash resterebbe nella
  cronologia del browser senza che nessuno l'abbia deciso.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->


| | |
| --- | --- |
| **Contratti necessari** | **Nessuna modifica a `types/contracts.ts`.** I tipi dell'ingresso e dell'uscita nascono **dentro `src/core/`**, di proprietà di core-engine, come già per la `07`. Non si aggiunge nessun valore a `Scenario`: qui non c'è nessun `DocumentoUtente` — due numeri digitati non producono una `LetturaCalcolata`. Se in corso d'opera servisse comunque un campo in `types/`, **è dell'architetto**: ci si ferma e si chiede, non si scrive |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root del repository, quindi i contratti si possono ancora estendere. Irrilevante qui, perché questa funzionalità non li tocca; ma la regola resta: **estendere `types/` è dell'architetto**, anche da sbloccati |
| **Agente incaricato** | **Due, e va detto**: `01-core-engine` per il calcolo (`src/core/`), `03-ui-builder` per la schermata e **tutte le stringhe** (`src/ui/`, con ogni parola in `src/ui/testi.ts` via `testiMesiCoperti.ts`). Il test di conformità lessicale scoped è di **`04-guardrail-officer`** (`tests/`), e su questa funzionalità **non è un extra**: è il cancello che tiene fuori la soglia dei tre-sei mesi. Ordine obbligato: core-engine → ui-builder → guardrail-officer |
| **Directory toccate** | **3.** `src/core/` (`mesiCoperti.ts`, `__tests__/mesiCoperti.test.ts`, una riga di riesportazione in `index.ts`) · `src/ui/` (`PaginaMesiCoperti.tsx`, `testiMesiCoperti.ts`, `testi.ts`, la rotta in `rotte.ts`, il blocco di stile del conto in chiaro) · `tests/` (`lessico-mesi-coperti.test.ts`, `accettazione/09-mesi-coperti.test.ts`). **`types/`, `fixtures/`, `src/guardrails/`, `src/assessment/` e `src/ingest/` non si toccano.** In `src/core/` **nessun modulo di dato dichiarato**: è l'unico simulatore che non ne ha bisogno |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/09-mesi-coperti.png` con il caso **1.250 € / 4.000 €**, cioè lo stesso numero verificato a mano nel caso A: la slide mostra la cifra che il test dimostra. In più uno screenshot del **caso C** (0 mesi e 15 giorni) come prova visiva che la schermata non giudica: stesso colore, stesso corpo, nessun allarme — è l'evidenza più eloquente del vincolo «spiega, non consiglia» in tutto il progetto |

### Dipendenze dichiarate

| Verso | Natura |
| --- | --- |
| `13-tabella-fonti-dati-sorgente-unica` | **nessuna dipendenza, e va detto esplicitamente.** È l'unico simulatore del documento d'origine che non ha una riga in quella tabella, perché non usa nessun dato che cambia nel tempo. Quando la `13` verrà costruita, **questa funzionalità va elencata come l'eccezione**, non dimenticata: una tabella che non dice «qui non serve niente» lascia il dubbio che qualcuno si sia distratto |
| `07-valore-dei-risparmi-nel-tempo` | **a monte, già fatta.** Da lì arrivano i componenti riusati e il modello del test lessicale scoped. Le due schermate parlano alla stessa persona della stessa cifra da parte, e **devono usare le stesse parole** per chiamarla |
| `01-landing-page` | **a monte.** Questa schermata è una delle risposte dell'area «Il futuro» e la sua domanda va agganciata lì. La rotta nuova va aggiunta accanto alle esistenti |

### Pianificazione, da sapere prima di `/implementa`

L'impronta è **identica a quella della `07`** — `src/core/`, `src/ui/`,
`tests/`. Questo task **non può girare in parallelo** con nessun altro che
tocchi `src/ui/` o `tests/`: in particolare `04`, `08` e `10`. La parte in
`src/core/` non ha conflitti e **può partire per prima**; ed essendo il solo
simulatore senza dati da recuperare, è anche **il solo che può essere portato a
termine e mostrato in demo con numeri definitivi**, senza attendere che
nessuno dichiari niente.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

### Cosa farà

«Due righe comprensibili a chi non vede il codice.»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si proverà

«I passi esatti per vederla funzionare, dall'avvio in poi:
 1. `/prepara` (solo la prima volta) · 2. `/avvia` · 3. apri … · 4. ti aspetti …

 Questi passi sono anche i CRITERI DI ACCETTAZIONE: `/implementa` li legge e li
 tratta come parte della richiesta.»

### Limiti previsti

«Cosa non farà, e perché.»

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

*Finché questa sezione non esiste, la funzionalità non è riconciliata e
`/verifica` non la accetta come `implementato`.*

### Cosa fa

«…»

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»
