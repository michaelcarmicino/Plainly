# 10 — «Quanto pago di rata ogni mese, con un tasso fermo e con uno che si muove»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 4, simulatore 4. Task di backlog: `10`.
>
> **La formula passa, il titolo no, e il modo di presentare il tasso variabile
> va corretto.** Tre scostamenti dal documento d'origine, tutti spiegati qui
> sotto e tutti ripresi in «Cosa questa funzionalità NON fa».

## I tre scostamenti, da leggere prima del resto

**1. Il titolo d'origine è stato riscritto.** Il documento chiama questo
simulatore «Fisso o variabile: quanto rischio?». Non è una domanda a cui un
calcolo possa rispondere: «quanto rischio» chiede una valutazione della
situazione personale di chi legge — quanto reggerebbe *lui* una rata che sale,
quanto è stabile *il suo* reddito — e il prodotto non valuta le persone. Posta
così, la domanda diventa «quale delle due mi conviene», che è esattamente il
divieto.

Il titolo scelto è **«Quanto pago di rata ogni mese, con un tasso fermo e con
uno che si muove»**: è una domanda reale, in prima persona, in linguaggio
umano, e **non chiede una scelta a nessuno**. Dice quale numero comparirà e in
quali due forme. La parola «rischio» **non compare in nessuna stringa** di
questa schermata.

**2. Mostrare i due scenari affiancati è conforme, e resta.** Due rate, ognuna
con il tasso da cui viene, sono due fatti. Diventa un consiglio nel momento in
cui una delle due viene marcata — un colore, un ordine che suggerisce una
preferenza, una riga che dice quanto si risparmia. Niente di tutto questo entra
nella schermata.

**3. L'escursione del tasso variabile è un fatto già avvenuto, non uno
scenario futuro.** Il documento d'origine è esplicito: il range «non va
inventato», si costruisce guardando **quanto si è mosso storicamente
l'Euribor** in periodi di durata comparabile. Questa specifica va un passo
oltre e ne fissa la forma: il numero si presenta **al passato** — «negli ultimi
dieci anni quell'indice si è mosso di tanto» — e mai al futuro condizionale
generico. Una proiezione di tassi si legge come previsione, e una previsione
sui soldi di chi legge è fuori perimetro, indipendentemente da come è
etichettata.

Di conseguenza il numero mostrato è: **questa è la rata di oggi; se il tasso si
muovesse di quanto si è già mosso in passato, la rata sarebbe questa.** È
un'aritmetica su uno scarto documentato, non un pronostico.

## Per chi

Una persona che ha in mano **un preventivo di mutuo**, o due, e legge righe che
non sa tradurre: «3,46% fisso», «2,80% variabile». Sa che uno resta fermo e
l'altro si muove — glielo ha detto l'impiegato — ma non sa quanto siano
distanti **in euro al mese**, che è l'unica unità di misura con cui la sua vita
è organizzata. E non sa di quanto si muoverebbe la rata se il secondo tasso si
muovesse davvero.

Non è una persona che studia finanza. È una persona con un foglio stampato e
una firma da mettere entro qualche giorno.

## Quando serve

Nel momento esatto in cui ha il preventivo aperto sul tavolo e sta per chiedere
a qualcuno «ma in pratica quanto pago?». È l'unica domanda che sa formulare, ed
è anche quella giusta: la rata è il numero che le uscirà dal conto ogni mese per
venticinque anni.

## Cosa deve poter fare dopo

Dire tre cifre riferite al **suo** importo e alla **sua** durata, non a un
esempio: «con il tasso fermo pago 747,72 € al mese», «con quello che si muove,
al valore di oggi, pagherei 695,81 €», «se quel tasso si muovesse di quanto si
è già mosso in passato, la rata arriverebbe a 775,28 €».

Osservabile: prima aveva delle percentuali, dopo ha degli euro al mese. **Che
cosa farne resta interamente suo**: la schermata mette i numeri uno accanto
all'altro e finisce lì.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `capitaleCent` | intero in centesimi | lo digita la persona |
| `anni` | intero, 5–40 | lo digita la persona |
| `tassoFissoBp` | punti base annui | **parametro**, da un modulo dichiarato |
| `tassoVariabileBp` | punti base annui | **parametro**, da un modulo dichiarato |
| `escursioneStoricaBp` | punti base | **parametro**, da un modulo dichiarato |

Si chiede il **capitale finanziato**, non il prezzo della casa: è la cifra che
sta sul preventivo, ed è quella che la banca presta. Si chiede la **durata in
anni** e non in rate, perché «venticinque anni» è come la persona pensa al
mutuo; le 300 rate le calcola il core.

I **tre tassi non si chiedono alla persona**: non li conosce, e il preventivo
che ha in mano riporta il suo, non la media di mercato. Entrano come valori
dichiarati, con la loro data.

> ### Blocco da sciogliere, non un dettaglio
>
> **TAN medio fisso, TAN medio variabile ed escursione storica dell'Euribor
> sono dati che nessuno di noi può inventare**, e non possono venire dalla
> rete: un aggiornamento automatico sarebbe una chiamata esterna, che il
> prodotto non fa — né a runtime né in fase di build.
>
> Le fonti sono quelle della sezione 7 del documento d'origine: **Banca
> d'Italia / ABI** e gli osservatori di settore per i tassi medi correnti,
> **EMMI (European Money Markets Institute)** per l'Euribor storico;
> aggiornamento **mensile** per entrambi.
>
> Il modulo che li tiene è **`src/core/tassiMutuoDichiarati.ts`**, costruito
> sul modello esatto di `src/core/inflazioneDichiarata.ts`: il valore **non è
> un numero nudo, è un numero con la sua provenienza**. Tre flag,
> inizialmente `false`:
>
> ```
> dataRilevazioneDichiarata   // a che mese si riferiscono i due TAN medi
> periodoEscursioneDichiarato // su quanti anni è misurata l'escursione
> fonteDichiarata             // chi l'ha pubblicata
> ```
>
> Finché un flag è falso, **la schermata lo dice** invece di presentare il
> numero come un fatto verificabile — è la riga in rosa che `NotaTasso.tsx` già
> mostra per l'inflazione della `07`. Una cifra che chi legge non può
> controllare è indistinguibile da una inventata, e fra nascondere il buco e
> dichiararlo il progetto dichiara.
>
> **L'architettura è studiata perché questo blocco non fermi
> l'implementazione**: la funzione del core **riceve i punti base come
> parametro** e non legge mai la costante dichiarata, quindi codice e test si
> scrivono e passano subito. I valori usati nella verifica a mano qui sotto —
> 3,46%, 2,80%, e un'escursione di 100 punti base — sono **valori di prova**:
> l'aritmetica è definitiva, la loro provenienza no. L'escursione in
> particolare **non è la vera escursione storica dell'Euribor**: è un punto
> percentuale tondo, scelto perché rende il test leggibile. Va sostituita con
> il dato EMMI e il periodo su cui è misurato.

Limiti dei campi — del campo digitato, non dell'aritmetica:

| Costante | Valore | Perché |
| --- | --- | --- |
| `CAPITALE_MIN_CENT` | `1_000_000` (10.000,00 €) | sotto, non è un mutuo |
| `CAPITALE_MAX_CENT` | `200_000_000` (2.000.000,00 €) | oltre, è quasi sempre un errore di battitura |
| `ANNI_MIN` | `5` | le durate sotto i cinque anni non sono mutui ipotecari |
| `ANNI_MAX` | `40` | il documento d'origine osserva che quasi metà dei nuovi mutui è a 30 anni: 40 copre il caso con margine |

## Elaborazione

Tutto in `src/core/`, puro e deterministico: nessun I/O, nessun `Date.now()`,
nessun `Math.random()`. Il modulo sta sotto le 150 righe; se cresce, la parte
dei valori dichiarati resta in `tassiMutuoDichiarati.ts` e il calcolo in
`rataMutuo.ts`.

**Ammortamento alla francese, rata costante.** La formula del documento
d'origine passa senza modifiche:

```
rata = C × [ i × (1+i)^n ] / [ (1+i)^n − 1 ]
```

dove `C` è il capitale finanziato, `i` il tasso **mensile** (annuo diviso 12) e
`n` il numero totale di rate (anni × 12).

I passi, ognuno verificabile a mano:

1. `n = anni × 12`. Moltiplicazione fra interi.
2. `i = (tanBp / 10_000) / 12`. Il tasso mensile **non** si arrotonda a un
   numero di punti base: arrotondarlo qui sposterebbe la rata di centesimi su
   ogni mese e di qualche euro sull'anno.
3. `moltiplicatore = (1 + i) ** n`.
4. `rataCent = Math.round(capitaleCent × (i × moltiplicatore) / (moltiplicatore − 1))`.
   **L'arrotondamento al centesimo intero avviene una volta sola**, alla fine:
   nessun importo intermedio viene conservato come valore arrotondato.
5. **Il caso `tanBp = 0` si tratta a parte, e non è teorico.** Con `i = 0` il
   numeratore e il denominatore valgono entrambi zero e la formula dà `NaN`,
   non zero: un tasso azzerato nel modulo dichiarato — o dichiarato male —
   farebbe comparire a schermo la scritta `NaN` al posto della rata. Con
   interesse nullo la rata è semplicemente il capitale diviso le rate:
   `rataCent = Math.round(capitaleCent / n)`.
6. **Lo scarto fra i due scenari**, che è il paragone concreto della
   schermata:

   ```
   scartoMensileCent = rataFissaCent - rataVariabileCent
   scartoAnnuoCent   = scartoMensileCent × 12
   ```

   Sottrazione e moltiplicazione fra interi, esatte. **Non si calcola nessun
   totale sull'intera durata**: il perché sta in «Cosa questa funzionalità NON
   fa».
7. **La rata con l'escursione già avvenuta.** Si applica lo scarto storico al
   tasso variabile e si rifà il passo 4:
   `rataConEscursioneCent = rata(capitaleCent, anni, tassoVariabileBp + escursioneStoricaBp)`.
   È la stessa funzione, chiamata una terza volta: non esiste una seconda
   formula, e questo è il motivo per cui il test ne verifica una sola.

> **Nota sull'aritmetica.** Come nella `07`, **l'elevamento a potenza è
> l'unico punto del dominio in cui compare un numero a virgola mobile**: una
> esponenziale su interi non esiste, e `(1 + i)^300` non è esprimibile
> altrimenti. Resta deterministico — IEEE-754 dà lo stesso risultato su ogni
> macchina, che è ciò che rende il valore atteso del test una verità e non
> un'istantanea — e l'arrotondamento al centesimo intero avviene **una volta
> sola**, alla fine. Il capitale e le rate restano interi in centesimi:
> nessun importo viene conservato come float.

### Verifica a mano, da riportare nel commento del test

Caso di riferimento, lo stesso in tutti e quattro gli scenari:
`capitaleCent = 15_000_000` (150.000,00 €), `anni = 25`, quindi `n = 300`.

**Scenario 1 — il tasso fermo**, `tassoFissoBp = 346` (3,46%).

```
n              = 25 × 12                                       = 300
i              = 0,0346 / 12                                   = 0,00288333333333...
(1 + i)^300                                                    = 2,372051874108
i × (1+i)^300  = 0,00288333333333 × 2,372051874108             = 0,00683941623701
(1+i)^300 − 1                                                  = 1,372051874108
fattore        = 0,00683941623701 / 1,372051874108             = 0,00498480878...
rata           = 15.000.000 × 0,00498480878 = 74.772,13 cent
               -> 74.772 cent                                    (747,72 €)
```

**Scenario 2 — il tasso che si muove, al valore di oggi**,
`tassoVariabileBp = 280` (2,80%).

```
i              = 0,028 / 12                                    = 0,00233333333333...
(1 + i)^300                                                    = 2,012111365754
i × (1+i)^300                                                  = 0,00469492651608
(1+i)^300 − 1                                                  = 1,012111365754
fattore        = 0,00469492651608 / 1,012111365754             = 0,00463874498...
rata           = 15.000.000 × 0,00463874498 = 69.581,17 cent
               -> 69.581 cent                                    (695,81 €)
```

**Lo scarto fra i due, che è il numero da mostrare accanto alle rate.**

```
scarto mensile = 74.772 - 69.581                               = 5.191 cent ( 51,91 €)
scarto annuo   = 5.191 × 12                                    = 62.292 cent (622,92 €)
```

**Scenario 3 — la rata se il tasso si muovesse di quanto si è già mosso.**
Con `escursioneStoricaBp = 100` (valore di prova, **non** il dato EMMI):
`280 + 100 = 380` bp, cioè 3,80%.

```
i              = 0,038 / 12                                    = 0,00316666666667...
(1 + i)^300                                                    = 2,581831423576
i × (1+i)^300                                                  = 0,00817579950800
(1+i)^300 − 1                                                  = 1,581831423576
fattore        = 0,00817579950800 / 1,581831423576             = 0,00516856562...
rata           = 15.000.000 × 0,00516856562 = 77.528,48 cent
               -> 77.528 cent                                    (775,28 €)

differenza rispetto alla rata di oggi:
               = 77.528 - 69.581                               = 7.947 cent ( 79,47 €)
su dodici mesi = 7.947 × 12                                    = 95.364 cent (953,64 €)
```

**Scenario 4 — interesse nullo, il caso che manda la formula in `NaN`.**
`tanBp = 0`.

```
formula generale: numeratore 0, denominatore 0  ->  NaN, non 0
ramo dedicato:   rata = 15.000.000 / 300        =  50.000 cent (500,00 €)
```

Cinquecento euro al mese per venticinque anni fanno esattamente i 150.000 €
prestati: è la controprova che il ramo dedicato è giusto e non un cerotto.

I tre moltiplicatori (`2,372051874108` · `2,012111365754` ·
`2,581831423576`) vanno **scritti nel commento del test** insieme alla rata:
sono il passaggio che nessuno può rifare a memoria, e senza di essi il valore
atteso diventa un numero che nessuno ha verificato.

### I motivi di rifiuto, come codici

Stesso schema della `07`: **codici, non frasi**. Le parole che legge una
persona stanno tutte in `src/ui/`, unico punto in cui il lessico viene
scandito.

`capitale-non-leggibile` · `capitale-sotto-zero` · `capitale-a-zero` ·
`capitale-troppo-basso` · `capitale-troppo-alto` · `anni-non-interi` ·
`anni-fuori-intervallo` · `tasso-non-leggibile` · `tasso-sotto-zero`

L'ultimo copre un modulo dichiarato male, e serve perché quel modulo si riempie
a mano. `tasso-a-zero` **non è** un codice di rifiuto: è lo scenario 4, un
risultato calcolabile.

## Output

Una schermata sola, un concetto solo: **quanto esce dal conto ogni mese**.

| Elemento | Forma |
| --- | --- |
| **Il numero grande** | la rata con il **tasso fermo**: «747,72 €». È il più grande della schermata — non perché sia preferibile, ma perché è l'unico che non cambia mai, quindi è l'unico che si può scrivere una volta sola |
| Il secondo numero, stessa dimensione fra loro | la rata con il **tasso che si muove, al valore di oggi**: «695,81 €» |
| Lo scarto fra i due | «51,91 € al mese di differenza, cioè 622,92 € in dodici mesi» |
| Il terzo numero | la rata **se il tasso si muovesse di quanto si è già mosso in passato**: «775,28 €», con accanto «79,47 € al mese in più, cioè 953,64 € in dodici mesi» |
| La traduzione della differenza fra i due tipi di tasso | in una riga, senza gergo: quello fermo resta la stessa cifra per tutta la durata, quello che si muove sale e scende insieme a un indice che nessuno dei due — né la persona né la banca — decide |
| Da dove vengono i numeri | i tre tassi usati, **con la fonte e la data di rilevazione scritte accanto**, e il periodo su cui l'escursione è misurata |
| L'avvertenza | che la terza cifra è un'aritmetica su uno scarto **già avvenuto**, non un pronostico su quello che farà il tasso |

**Le due rate degli scenari 1 e 2 hanno lo stesso peso visivo**: stesso corpo,
stesso colore, stesso riquadro. Nessun bordo viola su una delle due, nessuna
freccia, nessun ordine che suggerisca una preferenza. Il **rosa resta
riservato ai limiti e alle esclusioni**, come vuole la regola di design: le due
rate non lo usano.

**Nessuna informazione disponibile solo al passaggio del mouse.** Le tre rate,
i tre tassi e i due scarti sono scritti sempre, anche su telefono e al
proiettore.

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre
tabulari, unità accanto al valore, numeri allineati a destra: qui stanno in
colonna, ed è il caso in cui le cifre proporzionali farebbero ballare i
confronti.

**Stringhe nuove**: in un file dedicato `src/ui/testiRataMutuo.ts`,
incorporato in `STRINGHE_UTENTE` di `src/ui/testi.ts` con lo spread, come già
`testiSimulazione.ts`: il registro scandito dal guardrail resta **un oggetto
solo** e `testi.ts` non supera le 150 righe. Chiavi, per gruppo:

- intestazione — `rataMutuoOcchiello`, `rataMutuoTitolo`, `rataMutuoIntro`,
  `rataMutuoPasso`
- i due campi — `rataMutuoEtichettaCapitale`, `rataMutuoAiutoCapitale`,
  `rataMutuoEsempioCapitale`, `rataMutuoEtichettaAnni`,
  `rataMutuoAiutoAnni`, `rataMutuoEsempioAnni`
- il risultato — `rataMutuoVuoto`, `rataMutuoInSospeso`,
  `rataMutuoEtichettaFerma`, `rataMutuoEtichettaMobile`,
  `rataMutuoScartoMensile`, `rataMutuoScartoAnnuo`
- l'escursione già avvenuta — `rataMutuoEtichettaEscursione`,
  `rataMutuoEscursioneSpiegazione`, `rataMutuoEscursioneDifferenza`
- la traduzione dei due tipi di tasso — `rataMutuoTassoFermoSpiegato`,
  `rataMutuoTassoMobileSpiegato`
- la provenienza — `rataMutuoTassi`, `rataMutuoFonte`,
  `rataMutuoDataMancante`, `rataMutuoPeriodoMancante`, `rataMutuoAvvertenza`
- gli errori — `rataMutuoErroreCapitale`, `rataMutuoErroreCapitaleBasso`,
  `rataMutuoErroreCapitaleAlto`, `rataMutuoErroreCapitaleZero`,
  `rataMutuoErroreAnni`, `rataMutuoErroreAnniFuori`, `rataMutuoErroreTasso`,
  `rataMutuoNotaCentesimi`
- il confine — `rataMutuoLimitiTitolo`, `rataMutuoLimiteAzione`,
  `rataMutuoLimiteCosto`, `rataMutuoLimiteDati`

Quattro trappole da conoscere **prima** di scrivere queste frasi. La parola
**«rischio» non si usa**: è la formulazione rifiutata del titolo, e rientrerebbe
dalla finestra. `conviene`, `migliore`, `scegli`, `passa a`, `senza rischi`
sono bloccati dal lessico, e `risparmier*` pure: lo scarto si dice «51,91 € al
mese di differenza», mai «risparmieresti 51,91 €». Il condizionale va usato
**solo** agganciato allo scarto storico («se si muovesse di quanto si è già
mosso»), mai da solo: «se i tassi salissero» è una previsione travestita da
ipotesi. E ogni parola tecnica va accompagnata **nella stessa frase** dal suo
esempio: «TAN» da solo non dice niente, «il TAN è solo l'interesse, la parte
che la banca ti fa pagare per il prestito» sì.

**I quattro stati obbligatori**, non solo quello che funziona:

1. **Vuoto** — nessuna cifra digitata: la schermata dice quali due cose servono
   **e dove si leggono sul preventivo**, non «nessun risultato». Le tre rate non
   compaiono a zero: al loro posto la frase che spiega che cosa mostreranno.
2. **In caricamento** — il calcolo è immediato e locale, quindi lo stato esiste
   ma non lampeggia: i tre riquadri delle rate occupano già il loro spazio, così
   il layout non salta quando i numeri arrivano.
3. **Errore** — in linguaggio umano: «Controlla questo numero, sembra troppo
   alto», mai «errore di validazione». Nessuna rata mostra mai una cifra
   calcolata su un dato che non va, e **quello già digitato nell'altro campo
   resta dov'è**.
4. **Dati lunghi o numerosi** — capitale a sette cifre e 40 anni. Le tre rate
   stanno in colonna: su schermo stretto si impilano senza che l'importo si
   stacchi dalla sua etichetta, e le cifre tabulari tengono allineate le tre
   righe. È il caso che rompe questa griglia più delle altre, perché qui i
   numeri da confrontare sono tre e non uno.

### Che cosa si riusa della `07`, invece di ricostruirlo

| Pezzo | Come si riusa |
| --- | --- |
| `src/ui/CampoNumerico.tsx` | **così com'è.** Già parametrizzato per chiavi di testo: i due campi sono due istanze, niente da modificare |
| `src/ui/letturaCampi.ts` | **così com'è.** `leggiSomma` per il capitale, `leggiAnni` per la durata — è letteralmente lo stesso campo «anni» della `07`, con un intervallo diverso deciso dal core |
| `src/ui/Testo.tsx` e `t()` | **così come sono.** Segnaposto `{nome}` per ogni numero: nessuna cifra scritta a mano |
| `src/core/formatoIt.ts` | **così com'è.** `formattaEuro`, `formattaPercentuale` |
| `src/core/esito.ts` | **così com'è.** `Esito<T, Codice>` per il ramo di rifiuto |
| `src/ui/rotte.ts` | si aggiunge **una rotta**, sullo stile di `PERCORSO_VALORE_RISPARMI`. Nell'indirizzo non finisce l'importo digitato |
| CSS di `stiliSimulazione.css` e `stiliRisultato.css` | **classi riusate**: `.simulazione`, `.campi`, `.campo`, `.risultato`, `.risultato-cifra`, `.risultato-paragone`, `.cifra`, `.nota-tasso`, `.nota-periodo`, `.limiti`. Serve **in più** il solo blocco a tre colonne delle rate |
| `src/core/inflazioneDichiarata.ts` | **il modello, riga per riga.** `tassiMutuoDichiarati.ts` ne copia la struttura: valore + flag di provenienza + una funzione booleana che dice se la provenienza è incompleta, **senza nessun confronto fra testi**. Il core dice **se** la provenienza è completa, la schermata dice **com'è scritta** |
| `src/ui/NotaTasso.tsx` | **da generalizzare, non da copiare.** Oggi legge `INFLAZIONE_DICHIARATA` e le chiavi della `07` direttamente: va reso un componente che riceve il valore dichiarato, la sua fonte e i flag come proprietà. Qui servono **tre** valori dichiarati invece di uno, quindi la generalizzazione non è un abbellimento. Tocca un file della `07`: **da dichiarare nel diff, non da nascondere** |
| `src/ui/RisultatoRisparmio.tsx` | **il pattern, non il componente.** È tipizzato sul risultato della `07`. Si ripete la forma — riquadro che occupa sempre lo stesso spazio, cifra grande, `aria-live="polite"`, il segnaposto `aria-hidden` al posto dello zero — in un componente proprio che regge **tre** cifre invece di una |
| `src/ui/motiviRisparmio.ts` | **il pattern.** La mappa `Record<MotivoRifiuto, ChiaveStringaUtente>` esaustiva per costruzione, così il giorno in cui il core aggiunge un codice il compilatore lo segnala |

**Sull'avvertenza prescritta dal documento d'origine.** Il testo standard
(«Questo è un calcolo stimato, basato su formule semplificate e dati
pubblici…») **non esiste come stringa riusabile nella `07`**: al suo posto la
`07` ha tre righe più strette e più utili — `simulazioneRisparmioTasso`,
`simulazioneRisparmioFonte`, `simulazioneRisparmioAvvertenza` — rese da
`NotaTasso.tsx` in una posizione fissa sotto il risultato, a corpo pieno e mai
in grigio slavato. **Si riusa la posizione e la forma, non le parole.** Qui le
parole devono dire una cosa che l'avvertenza generica non dice: che la formula
della rata **non è semplificata** — è l'ammortamento alla francese, la stessa
che usa la banca — mentre **i tassi sono medie di mercato, non il tasso del tuo
preventivo**. È uno scostamento dichiarato dal documento d'origine, nella
direzione che le regole di scrittura chiedono: un limite verificabile al posto
di uno generico.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/rataMutuo.test.ts`, con i valori
  attesi dei **quattro scenari calcolati a mano qui sopra** — moltiplicatore
  incluso — scritti nel commento accanto all'asserzione. Copre inoltre: il ramo
  `tanBp = 0` con la controprova `rata × n = capitale`; il fatto che una durata
  più lunga a parità di tasso dia una rata più bassa (proprietà, non caso); e
  il rifiuto di un tasso dichiarato negativo.
- **Conformità lessicale scoped** — `tests/lessico-rata-mutuo.test.ts`, sul
  modello di `tests/lessico-simulazione-risparmio.test.ts`. Scandisce
  `testiRataMutuo.ts` contro le formulazioni che il lessico sitewide non copre
  e che **qui** entrerebbero facilmente: `rischio`, `rischioso`, `sicuro`,
  `prudente`, `tranquillo`, `sorpresa`, `salirà`, `scenderà`, `previsione`,
  `surroga`. Le ultime tre sono le più insidiose, perché un futuro semplice
  («la rata salirà») trasforma un'aritmetica in un pronostico senza che nessuna
  parola vietata compaia. Restano fuori dal lessico generale di proposito:
  «rischio» è vocabolario legittimo nell'area lavoro («il mio settore è a
  rischio»), e bloccarlo sitewide produrrebbe falsi positivi sistematici.
- **Test di accettazione** — `tests/accettazione/10-rata-del-mutuo.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice.
- **In demo, dieci secondi**: si digita 150.000, si digita 25, compaiono
  **747,72 €** e **695,81 €** affiancate con lo stesso peso, sotto «51,91 € al
  mese di differenza, cioè 622,92 € in dodici mesi», e la terza cifra —
  **775,28 €** — con scritto accanto che è la rata se il tasso si muovesse di
  quanto si è già mosso.

## Cosa questa funzionalità NON fa

- **Non indica quale dei due tassi prendere**, né con le parole né con il
  colore, l'ordine o la dimensione. È il confine più facile da sfondare qui,
  perché la domanda successiva — «e allora quale prendo?» — è la ragione per
  cui la persona è arrivata: la risposta non sta in questa schermata, e non
  sta nemmeno in un sottinteso grafico.
- **Non dice «quanto rischio».** Era il titolo d'origine, ed è una valutazione
  della situazione personale di chi legge: quanto reggerebbe *lui* una rata che
  sale. Il prodotto non valuta le persone. La parola non compare in nessuna
  stringa, e un test lo verifica.
- **Non presenta l'escursione come uno scenario futuro.** La terza cifra è
  costruita su **quanto quell'indice si è già mosso**, con il periodo dichiarato
  accanto. Non esiste una riga che dica che i tassi saliranno, scenderanno o
  resteranno dove sono: sarebbe una previsione sui soldi di chi legge, fuori
  perimetro indipendentemente da come è etichettata. Il documento d'origine
  chiede la stessa cosa — il range «non va inventato» — e questa specifica ne
  fissa anche la forma grammaticale.
- **Non calcola il costo totale sull'intera durata**, né gli interessi
  complessivi. Due motivi. Sul tasso fermo sarebbe aritmetica esatta, ma sul
  tasso che si muove sarebbe una **proiezione a venticinque anni**: le due
  colonne diventerebbero incomparabili, e un totale mostrato su una sola delle
  due è peggio che nessun totale. In più è un **secondo concetto** nella stessa
  schermata. Il tema «più anni, rata più bassa, interessi più alti in totale»
  esiste ed è del task `11`, dove non deve reggere il confronto fra due tassi.
- **Non calcola il TAEG**, e nemmeno lo nomina come se fosse ricavabile da qui.
  Il documento d'origine è chiaro: il TAN è solo l'interesse, il TAEG è quanto
  costa tutto insieme — istruttoria, perizia, assicurazioni. Quelle voci sono
  numeri che non abbiamo, e stimarle a occhio è esattamente ciò che la sezione
  7 esiste per impedire. Argomento del task `11`.
- **Non mostra il piano di ammortamento** riga per riga, e non spiega che nei
  primi anni la rata paga soprattutto interessi. È il contenuto più
  contro-intuitivo del tema e merita una schermata sua: è del task `11`, con
  l'aggancio alla guida-documento del piano di ammortamento.
- **Non parla di surroga**, di rinegoziazione o di sospensione della rata.
  Sono contenuti del task `11`, e due di essi vanno scritti con cura
  particolare perché vengono letti nel momento di massimo stress. Qui
  entrerebbero come un'azione da compiere.
- **Non usa il tasso del preventivo della persona.** Usa medie di mercato
  dichiarate, e lo scrive accanto al risultato: chi ha un preventivo con un
  tasso diverso vedrà una rata diversa dalla sua. Chiedere il tasso in un terzo
  campo è una funzionalità plausibile, ma è **un'altra spec**: cambia la natura
  della schermata, da «quanto costa un mutuo così» a «quanto costa il mio».
- **Non prende i tassi dalla rete**, né a runtime né in fase di build. Le fonti
  restano Banca d'Italia / ABI ed EMMI con aggiornamento mensile, ma i valori
  entrano nel codice come costanti dichiarate e si aggiornano a mano.
- **Non chiede e non conserva dati personali.** Le due cifre restano nella
  pagina, **non finiscono nell'indirizzo del browser** e non vengono salvate da
  nessuna parte.
- **Non legge nessun documento.** Il preventivo non si carica: i due numeri si
  digitano.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->


| | |
| --- | --- |
| **Contratti necessari** | **Nessuna modifica a `types/contracts.ts`.** I tipi dell'ingresso, dell'uscita e dei tassi dichiarati nascono **dentro `src/core/`**, di proprietà di core-engine, come già per la `07`. Non si aggiunge nessun valore a `Scenario`: qui non c'è nessun `DocumentoUtente` — due numeri digitati non producono una `LetturaCalcolata`. Se in corso d'opera servisse comunque un campo in `types/`, **è dell'architetto**: ci si ferma e si chiede, non si scrive |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root del repository, quindi i contratti si possono ancora estendere. Irrilevante qui, perché questa funzionalità non li tocca; ma la regola resta: **estendere `types/` è dell'architetto**, anche da sbloccati |
| **Agente incaricato** | **Due, e va detto**: `01-core-engine` per la formula e il modulo dei tassi dichiarati (`src/core/`), `03-ui-builder` per la schermata a tre cifre e **tutte le stringhe** (`src/ui/`, con ogni parola in `src/ui/testi.ts` via `testiRataMutuo.ts`). Il test di conformità lessicale scoped è di **`04-guardrail-officer`** (`tests/`), e qui **non è un extra**: è il cancello che tiene fuori il futuro semplice, cioè la previsione. Ordine obbligato: core-engine → ui-builder → guardrail-officer |
| **Directory toccate** | **3.** `src/core/` (`rataMutuo.ts`, `tassiMutuoDichiarati.ts`, `__tests__/rataMutuo.test.ts`, una riga di riesportazione in `index.ts`) · `src/ui/` (`PaginaRataMutuo.tsx`, il componente delle tre rate affiancate, `testiRataMutuo.ts`, `testi.ts`, la rotta in `rotte.ts`, il foglio di stile delle tre colonne, la generalizzazione di `NotaTasso.tsx`) · `tests/` (`lessico-rata-mutuo.test.ts`, `accettazione/10-rata-del-mutuo.test.ts`). **`types/`, `fixtures/`, `src/guardrails/`, `src/assessment/` e `src/ingest/` non si toccano** |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/10-rata-del-mutuo.png` con il caso **150.000 € / 25 anni**, cioè gli stessi numeri verificati a mano: la slide mostra le cifre che il test dimostra. In più `../presentation/evidence/` riceve la serializzazione dei tre scenari con i tre moltiplicatori, generata da `/evidenza`: è l'evidenza che regge la slide sui limiti, perché mostra un dato dichiarato con la sua provenienza ancora incompleta invece di una cifra senza storia |

### Dipendenze dichiarate

| Verso | Natura |
| --- | --- |
| `11-approfondimento-sul-mutuo` | **la dipendenza principale, e in due direzioni.** Da qui escono quattro temi che il documento d'origine assegna alla `11` e che questa specifica **esclude di proposito**: TAN e TAEG, il piano di ammortamento, la durata (20/25/30 anni), la surroga. La `11` è il posto dove atterra chi, letta la rata, vuole capire il resto — e questa schermata è il numero concreto da cui la `11` parte. **Non è un blocco**: questa funzionalità sta in piedi da sola. Ma i due testi devono usare **le stesse parole** per «tasso fermo» e «tasso che si muove», altrimenti la persona crede di leggere due cose diverse |
| `13-tabella-fonti-dati-sorgente-unica` | **a valle, non bloccante.** `tassiMutuoDichiarati.ts` è il **terzo** modulo di provenienza del progetto, dopo `inflazioneDichiarata.ts` (`07`) e `fiscoDichiarato.ts` (`08`), e porta **tre** valori con cadenza mensile: è il caso che rende evidente perché quella tabella deve esistere come sorgente unica. La `13` **non deve esistere perché questa parta**, ma questa deve nascere con la forma che la `13` potrà consumare: valore + fonte + cadenza + data di rilevazione + flag «provenienza incompleta» |
| `07-valore-dei-risparmi-nel-tempo` | **a monte, già fatta.** Da lì arrivano i componenti riusati, il modello del dato dichiarato e la nota sull'aritmetica in virgola mobile, che qui vale identica |
| `12-approfondimento-sugli-investimenti` | **nessuna, e va detto.** Il documento d'origine chiede di non costruire un simulatore che proietti rendimenti futuri. Questa schermata proietta una **rata**, non un rendimento, e solo su uno scarto già avvenuto: la nota di prudenza della sezione 6 non si applica, ma il confine da cui nasce è lo stesso |

### Pianificazione, da sapere prima di `/implementa`

L'impronta è **identica a quella della `07`** — `src/core/`, `src/ui/`,
`tests/`. Questo task **non può girare in parallelo** con nessun altro che
tocchi `src/ui/` o `tests/`: in particolare `04`, `08` e `09`. La parte in
`src/core/` non ha conflitti e **può partire per prima**, perché la formula
riceve i punti base come parametro e non attende che il modulo dichiarato sia
riempito.

Un avviso per chi pianifica: fra i tre simulatori `08`, `09` e `10`, questo è
quello con **il blocco sui dati più grande** — tre valori, tutti a cadenza
mensile, due fonti diverse. La `09` non ne ha nessuno. Se si deve mostrare
qualcosa con numeri definitivi, l'ordine che riduce il rischio è `09`, poi
`08`, poi questa.

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
