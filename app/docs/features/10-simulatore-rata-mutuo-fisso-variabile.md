# 10 — «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 4, simulatore 4. Task di backlog: `10`.
>
> **Il titolo d'origine è stato riscritto per conformità, e il perché va letto
> prima del resto.** Il documento chiama questo simulatore «Fisso o variabile:
> quanto rischio?». Così posta, è la domanda «quale delle due opzioni
> conviene», che il vincolo di dominio vieta: `.claude/skills/spec/SKILL.md`
> la elenca fra i casi da rifiutare e ne dà anche la riscrittura — «mostra
> affiancate le due opzioni con la differenza di costo su 12 mesi, **senza
> indicarne una**».
>
> Questa specifica è quella riscrittura, non il simulatore d'origine. Le tre
> conseguenze sono tutte in «Cosa questa funzionalità NON fa», che qui è la
> sezione più importante del documento: **nessun semaforo su una delle due
> rate**, **nessun totale sull'intera durata**, **nessuna ipotesi presentata
> come pronostico**.
>
> **Lo slug resta `10-simulatore-rata-mutuo-fisso-variabile`** anche se il
> titolo leggibile è cambiato: il numero e il nome legano task di backlog,
> branch e commit, ed è ciò che permette a `agents:trace` di ricostruire chi ha
> fatto cosa. Il titolo si legge, lo slug si incrocia.

## Per chi

Una persona che ha in mano **due preventivi di mutuo**, o un preventivo solo
con due righe di tasso, e legge due numeri che non sa tradurre: «3,46% fisso»
e «2,80% variabile». Sa che uno resta fermo e l'altro si muove — glielo ha
detto l'impiegato — ma non sa quanto siano distanti **in euro al mese**, che è
l'unica unità di misura con cui la sua vita è organizzata. E non sa di quanto
si muoverebbe la rata se il secondo tasso si muovesse davvero.

Non è una persona che studia finanza. È una persona con un foglio stampato e
una firma da mettere entro qualche giorno.

## Quando serve

Nel momento esatto in cui ha il preventivo aperto sul tavolo e sta per
chiedere a qualcuno «ma in pratica quanto pago?». È l'unica domanda che sa
formulare, ed è anche quella giusta: la rata è il numero che le uscirà dal
conto ogni mese per venticinque anni.

## Cosa deve poter fare dopo

Dire due cifre riferite al **suo** preventivo, non a un esempio: «con il tasso
fermo pago 747,72 € al mese, con quello che si muove oggi ne pagherei 695,81 —
51,91 € al mese di differenza, cioè 622,92 € in dodici mesi». E aggiungerne
una terza: «se quel tasso salisse di un punto, la rata passerebbe a 775,28 €».

È osservabile: prima aveva due percentuali, dopo ha degli euro al mese.

**Che cosa farne resta interamente suo.** La schermata mette i numeri uno
accanto all'altro e finisce lì.

## Input

Tutti e quattro **li digita la persona**, copiandoli dal foglio che ha in
mano. Nessuno arriva dalla rete, nessuno è una media di mercato scritta dentro
il sito.

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `capitaleCent` | intero in centesimi | lo digita — è l'importo chiesto in prestito |
| `anni` | intero, 1–40 | lo digita — è la durata scritta sul preventivo |
| `tassoFissoAnnuoBp` | punti base | lo digita — è il TAN dell'offerta a tasso fermo |
| `tassoVariabilePartenzaAnnuoBp` | punti base | lo digita — è il TAN **di partenza** dell'offerta a tasso che si muove |

> **Perché digitati e non dichiarati nel codice.** È la differenza con la 07,
> ed è deliberata. Il tasso d'inflazione della 07 è una costante dichiarata
> perché la persona non lo conosce e farglielo inventare renderebbe il
> risultato una fantasia. Qui è il contrario: **i due tassi sono stampati sul
> preventivo che ha in mano**, quindi li conosce davvero, e sono i suoi — non
> una media di mercato che con la sua banca potrebbe non c'entrare niente.
> Prenderli dalla rete sarebbe vietato a runtime; scriverli come costante
> significherebbe mostrarle la rata di qualcun altro.

Un quinto dato non è digitato, e ha un modulo suo:

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `scartiIpotesiBp` | elenco di interi in punti base | **costante dichiarata nel codice**, con provenienza |

Sono gli scostamenti con cui si prova a muovere il tasso variabile: `-100`,
`0`, `+100`, `+200` punti base, cioè un punto percentuale in meno, il tasso di
oggi, uno in più, due in più.

> **Blocco da sciogliere, non un dettaglio — è lo stesso della 07.** Il
> documento d'origine è esplicito: «il range mostrato non va inventato — si
> costruisce guardando quanto si è mosso storicamente l'Euribor in periodi di
> durata comparabile». Quel dato nessuno di noi lo ha, e una scala di ipotesi
> senza gli anni su cui è costruita è indistinguibile da una scala inventata.
>
> Si risolve **come la costante dell'inflazione in `inflazioneDichiarata.ts`**:
> un modulo separato che tiene il valore *e* un flag `periodoDichiarato`.
> Finché il flag è `false`, la schermata dichiara che il periodo non è stato
> stabilito invece di presentare la scala come un fatto verificabile. Il core
> dice **se** la provenienza è completa, la schermata dice **com'è scritta**.
>
> **Non ferma l'implementazione**: la funzione di calcolo riceve gli scarti
> come *parametro* e non legge mai la costante, quindi codice e test si
> scrivono e passano subito. Resta da riempire una riga.

## Elaborazione

Tutto in `src/core/`, puro e deterministico: nessun I/O, nessun `Date.now()`,
nessun `Math.random()`.

**La formula è quella del documento d'origine** — ammortamento alla francese,
rata costante — e non viene semplificata:

```
rata = C × [ i × (1+i)ⁿ ] ÷ [ (1+i)ⁿ − 1 ]
```

I passi, numerati e rifacibili su un foglio:

1. `n = anni × 12` — il numero di rate.
2. `i = tassoAnnuoBp / 120_000` — il tasso del singolo mese come frazione.
   `120_000` è `10_000 × 12`: diecimila porta i punti base a frazione, dodici
   porta l'anno al mese. Una divisione sola, non due arrotondate in fila.
3. `crescita = (1 + i) ** n`
4. `rataGrezza = capitaleCent × (i × crescita) / (crescita − 1)`
5. `rataCent = Math.round(rataGrezza)` — **l'unico arrotondamento.**
6. Caso `tassoAnnuoBp === 0`: al passo 4 il denominatore è zero. La formula
   degenera nel suo significato — senza interessi si restituisce il capitale in
   parti uguali — quindi `rataCent = Math.round(capitaleCent / n)`. Resta un
   arrotondamento solo.

Poi il confronto, che è **aritmetica intera sulle rate già arrotondate**:

7. `differenzaMensileCent = rataFissaCent − rataVariabileOggiCent`
8. `differenzaSu12MesiCent = differenzaMensileCent × 12`

E la scala delle ipotesi, una riga per ogni scarto dichiarato:

9. `tassoIpotesiBp = Math.max(0, tassoVariabilePartenzaAnnuoBp + scartoBp)` —
   il taglio a zero non è cosmetico: sotto zero la formula produce un numero
   che esiste ma non significa niente, e una rata che non significa niente a
   schermo è peggio di una riga in meno.
10. `rataIpotesiCent` = passi 2–6 su `tassoIpotesiBp`.
11. `differenzaMensileVsOggiCent = rataIpotesiCent − rataVariabileOggiCent`, e
    `× 12` per i dodici mesi. Di nuovo interi su interi.

### Verifica a mano, da riportare nel commento del test

Caso di riferimento: **150.000,00 € per 25 anni**, tasso fermo **3,46%**,
tasso che si muove oggi **2,80%**. Cioè `capitaleCent = 15_000_000`,
`anni = 25`, `tassoFissoAnnuoBp = 346`, `tassoVariabilePartenzaAnnuoBp = 280`.

I due tassi sono i numeri dell'esempio, **digitati**: sono quelli che la
sezione 5 del documento d'origine cita come ordine di grandezza di settembre
2026, e servono qui solo a rendere il caso realistico. Il sito non li dichiara
da nessuna parte e non li propone a nessuno.

```
n = 25 × 12 = 300 rate

TASSO FERMO — 346 bp
  i           = 346 / 120.000                    = 0,0028833333…
  (1+i)^300                                      = 2,3720518741
  rata grezza = 15.000.000 × (0,0028833333 × 2,3720518741)
                            ÷ (2,3720518741 − 1) = 74.772,131791
  rata                                    -> 74.772 cent  =  747,72 €

TASSO CHE SI MUOVE, OGGI — 280 bp
  i           = 280 / 120.000                    = 0,0023333333…
  (1+i)^300                                      = 2,0121113658
  rata grezza                                    = 69.581,174744
  rata                                    -> 69.581 cent  =  695,81 €

DIFFERENZA, a tassi fermi
  74.772 − 69.581 = 5.191 cent al mese                    =   51,91 €
  5.191 × 12      = 62.292 cent su 12 mesi                =  622,92 €

SCALA DELLE IPOTESI sul tasso che si muove
  −100 bp -> 180 bp  (1+i)^300 = 1,5677834980   62.127,780801 -> 62.128  621,28 €
     0 bp -> 280 bp  già calcolata sopra                      -> 69.581  695,81 €
  +100 bp -> 380 bp  (1+i)^300 = 2,5818314238   77.528,484254 -> 77.528  775,28 €
  +200 bp -> 480 bp  (1+i)^300 = 3,3121793309   85.949,544310 -> 85.950  859,50 €
```

Due delle cinque rate arrotondano per eccesso (180 e 480 bp) e tre per
difetto: il caso non è compiacente, e chi rifà i conti se ne accorge.

> **Nota sull'aritmetica, che è il punto delicato di questa funzionalità.**
> `(1+i)ⁿ` è un'esponenziale: un numero a virgola mobile c'è per forza, perché
> un'esponenziale su interi non esiste. Resta deterministica — IEEE-754 dà lo
> stesso risultato su ogni macchina, che è ciò che tiene in piedi le fixture.
>
> **L'arrotondamento al centesimo intero avviene una volta sola per ogni rata,
> al passo 5, e mai due volte sulla stessa cifra.** Nessun importo intermedio
> viene conservato come float: `i` e `crescita` sono fattori, non importi, e
> spariscono dentro la stessa espressione. Tutto ciò che segue — differenza al
> mese, differenza su 12 mesi, scarti della scala — è **somma e moltiplicazione
> fra interi**, quindi esatto per costruzione.
>
> Derivare la differenza dalla rata *arrotondata* invece che da quella grezza
> non è una scorciatoia: è la scelta fedele. La rata arrotondata al centesimo è
> quella che la banca addebita davvero, quindi 51,91 € è la differenza che si
> vede sull'estratto conto, non un residuo di calcolo.

### Limiti dei campi digitati, che non sono limiti dell'aritmetica

Come nella 07, l'aritmetica pura e l'ingresso digitato restano **due funzioni
diverse**: chi vuole il caso limite chiama il calcolo, chi riceve quello che
una persona ha digitato chiama la funzione che prima controlla.

| Limite | Valore | Perché |
| --- | --- | --- |
| `ANNI_MUTUO_MIN` / `MAX` | 1 / 40 | oltre i 40 anni non esistono mutui in commercio: è quasi sempre una cifra battuta storta |
| `CAPITALE_MUTUO_MAX_CENT` | 200_000_000 (2.000.000,00 €) | sopra, il campo raccoglierebbe errori di battitura più che importi |
| `TASSO_MUTUO_MAX_BP` | 2_000 (20,00%) | un TAN a due cifre alte è un refuso, non un'offerta |

I motivi di rifiuto sono **codici, non frasi** — `capitale-non-leggibile`,
`capitale-a-zero`, `capitale-troppo-alto`, `anni-non-interi`,
`anni-fuori-intervallo`, `tasso-non-leggibile`, `tasso-sotto-zero`,
`tasso-troppo-alto` — come in `simulazioneRisparmio.ts`: le parole che legge
una persona stanno tutte in `src/ui/`, unico punto in cui il lessico viene
scandito, e un codice non ha lessico da controllare.

## Output

Una schermata sola. Il concetto è uno — **quanto esce dal conto ogni mese** —
anche se i numeri da copiare sono quattro: sono tutti copiati **dallo stesso
foglio**, in due blocchi separati a vista («il prestito» e «i due tassi scritti
sul preventivo»), e nessuno di loro chiede alla persona di interpretare
qualcosa.

| Elemento | Forma |
| --- | --- |
| **I due numeri grandi, affiancati e della stessa dimensione** | «747,72 €» e «695,81 €», ognuno con sopra l'etichetta di quale tasso è. Stessa dimensione, stesso colore, stesso peso: è qui che si decide se la schermata confronta o giudica |
| Che cosa sono | «al mese, per 300 mesi» — la durata resa tangibile accanto alla cifra |
| **La differenza** | «51,91 € al mese: in dodici mesi sono 622,92 €» |
| Come è calcolata la differenza | «a tasso fermo, cioè come se quello che si muove non si muovesse» — **a schermo, non in nota** |
| La scala delle ipotesi | quattro righe: tasso ipotizzato, rata, e quanto cambia al mese rispetto a oggi |
| Che cosa è la scala | «sono ipotesi, non pronostici» — **a schermo, accanto alla scala** |
| Da dove vengono i tassi | «li hai scritti tu, dal tuo preventivo: il sito non li prende da internet» |
| TAN e TAEG | «quello che hai scritto è il solo interesse; sul contratto ci sono anche istruttoria, perizia e assicurazioni, che qui non entrano» |
| Avvertenza | il testo standard della sezione 4 del documento d'origine |
| Che cosa la pagina non fa | dichiarato **a schermo**, in fondo, non solo in questa specifica |

Formattazione **solo** con `src/core/formatoIt.ts` (`formattaEuro`,
`formattaPercentuale`), mai `Intl`. Cifre tabulari, unità accanto al valore,
numeri allineati a destra nella scala delle ipotesi.

**Il rosa `#FF50A0` va sul blocco «che cosa questa pagina non fa» e solo lì.**
Non va su una delle due rate: sarebbe il semaforo che questa specifica esiste
per non avere.

### Stringhe nuove in `src/ui/`

Vanno in un file nuovo, **`src/ui/testiRataMutuo.ts`**, che entra in
`STRINGHE_UTENTE` con lo spread esattamente come `testiSimulazione.ts`: il
registro scandito dal guardrail resta **uno solo**, e `testi.ts` resta sotto le
150 righe.

Chiavi, per blocco:

- **Intestazione** — `rataMutuoOcchiello`, `rataMutuoTitolo`, `rataMutuoIntro`,
  `rataMutuoPasso`
- **I quattro campi** — `rataMutuoEtichettaCapitale`, `rataMutuoAiutoCapitale`,
  `rataMutuoEsempioCapitale`, `rataMutuoEtichettaAnni`, `rataMutuoAiutoAnni`,
  `rataMutuoEsempioAnni`, `rataMutuoEtichettaTassoFermo`,
  `rataMutuoAiutoTassoFermo`, `rataMutuoEsempioTassoFermo`,
  `rataMutuoEtichettaTassoMobile`, `rataMutuoAiutoTassoMobile`,
  `rataMutuoEsempioTassoMobile`
- **Il risultato** — `rataMutuoVuoto`, `rataMutuoInSospeso`,
  `rataMutuoEtichettaRataFerma`, `rataMutuoEtichettaRataMobile`,
  `rataMutuoRataAlMese`, `rataMutuoDifferenzaMensile`,
  `rataMutuoDifferenzaAnnua`, `rataMutuoDifferenzaNulla`,
  `rataMutuoDifferenzaATassoFermo`
- **La scala delle ipotesi** — `rataMutuoIpotesiTitolo`, `rataMutuoIpotesiIntro`,
  `rataMutuoIpotesiRiga`, `rataMutuoIpotesiNonPrevisione`,
  `rataMutuoIpotesiPeriodoMancante`, `rataMutuoIpotesiTassoATerra`
- **Provenienza e confini** — `rataMutuoTassiScrittiDaTe`,
  `rataMutuoTanNonTaeg`, `rataMutuoAvvertenza`, `rataMutuoNotaCentesimi`
- **Errori, in lingua umana** — `rataMutuoErroreCapitale`,
  `rataMutuoErroreCapitaleZero`, `rataMutuoErroreCapitaleAlto`,
  `rataMutuoErroreAnni`, `rataMutuoErroreAnniFuori`, `rataMutuoErroreTasso`,
  `rataMutuoErroreTassoAlto`
- **Il confine, dichiarato a schermo** — `rataMutuoLimitiTitolo`,
  `rataMutuoLimiteNessunaIndicazione`, `rataMutuoLimiteNessunTotale`,
  `rataMutuoLimiteNessunaPrevisione`, `rataMutuoLimiteDati`

Nessun identificatore contiene le radici vietate: la scelta di chiamare i due
tassi **«fermo»** e **«che si muove»** invece che «fisso» e «variabile» nelle
etichette non è un vezzo — è lo schema «prima l'immagine concreta, poi il nome
tecnico». Il nome tecnico compare nella stessa frase, subito dopo: «il tasso
che resta fermo per tutta la durata — sul preventivo lo trovi scritto *fisso*».

### I quattro stati obbligatori

1. **Vuoto** — nessuna cifra digitata. La schermata dice **quali quattro numeri
   servono e dove sono scritti sul foglio**, non «nessun risultato». È lo stato
   che questa funzionalità non può sbagliare: quattro campi vuoti senza una
   spiegazione sono il punto in cui la persona chiude la pagina.
2. **In caricamento** — il calcolo è immediato e locale. Lo stato esiste ma non
   lampeggia: i due riquadri delle rate e le quattro righe della scala
   occupano **già il loro spazio da vuoti**, così quando i numeri arrivano il
   layout non salta e l'avvertenza non si sposta.
3. **Errore** — in lingua umana, accanto al campo che non torna: «Controlla
   questo numero, sembra troppo alto: questa pagina arriva fino a
   2.000.000,00 €». Mai «errore di validazione». Le rate **non mostrano una
   cifra sbagliata**: o restano come erano o tornano allo stato vuoto. **Quello
   che si era già scritto negli altri tre campi resta lì.**
4. **Dati lunghi o numerosi** — capitale a sette cifre e 40 anni: le due rate
   affiancate devono restare **su una riga sola ciascuna**, senza uscire dal
   riquadro, e sotto i 768 px si impilano invece di stringersi. La scala delle
   ipotesi è la parte che rompe le griglie: quattro righe con tasso, rata e
   scarto, con le etichette che vanno a capo e i numeri che **restano allineati
   a destra e tabulari**.

## Come si dimostra che ha funzionato

- **Test unitari** — `src/core/__tests__/rataMutuo.test.ts` e
  `src/core/__tests__/confrontoRateMutuo.test.ts`, con i valori attesi
  **calcolati a mano qui sopra scritti nel commento accanto all'asserzione**:

  ```ts
  // 15.000.000 × (0,0028833333 × 2,3720518741) / 1,3720518741
  //   = 74.772,131791 -> 74.772 cent
  expect(calcolaRataCent({ capitaleCent: 15_000_000, anni: 25, tassoAnnuoBp: 346 }))
    .toBe(74_772);
  ```

  Coprono anche i due casi che la formula non gestisce da sola: `tassoAnnuoBp`
  a 0 (rata = capitale ÷ numero di rate, 50.000 cent nel caso di riferimento) e
  l'ipotesi che scenderebbe sotto zero, tagliata a 0 bp.
- **Test di accettazione** — `tests/accettazione/10-rata-mutuo.test.ts`,
  scritto dal `tester` **dalla specifica, non dal codice**.
- **Lessico** — `tests/lessico-ui.test.ts` scandisce già ogni chiave nuova: non
  serve un test in più, serve che le chiavi entrino nel registro unico.
- **In demo, dieci secondi**: si digitano 150.000 e 25, poi 3,46 e 2,80.
  Compaiono **747,72 €** e **695,81 €** affiancati, sotto «51,91 € al mese, in
  dodici mesi 622,92 €», e la scala con 775,28 € alla riga «+1 punto». Nessuna
  delle due cifre è evidenziata rispetto all'altra — ed è proprio questo il
  punto da far notare alla giuria.

## Cosa questa funzionalità NON fa

**È la sezione decisiva di questa specifica.** Il simulatore d'origine nasceva
come una domanda di scelta, e ogni riga qui sotto è il punto in cui quella
domanda è stata tolta senza togliere il calcolo.

- **Non indica quale delle due opzioni prendere, in nessuna forma.** Né a
  parole, né con un semaforo, né con un colore, né con la dimensione del
  carattere, né con l'ordine — le due rate sono affiancate e identiche nella
  forma, e la loro posizione segue l'ordine dei campi, non un giudizio. È il
  confine più facile da sfondare: basta far diventare una delle due cifre un
  po' più grande, e la schermata ha dato un parere senza scrivere una parola.
- **Non dice «se pensi che i tassi saliranno…».** Un condizionale che invita a
  formarsi un'aspettativa e poi ad agire di conseguenza è un consiglio
  travestito da ipotesi. La scala mostra che cosa **succede alla rata** a
  quattro valori di tasso, e la frase che l'accompagna descrive il meccanismo —
  «quando quel tasso sale, la rata sale con lui» — senza mai rivolgersi a chi
  legge come a qualcuno che deve decidere.
- **Non presenta le ipotesi come previsioni.** Un tasso variabile futuro non è
  prevedibile, e questa pagina non finge il contrario. La frase sta **a schermo
  accanto alla scala**, non in una nota a piè di pagina: le quattro righe sono
  aritmetica su quattro valori dichiarati, non quattro scenari probabili.
  Finché il periodo su cui è costruita la scala non è dichiarato, la schermata
  lo dice apertamente, come fa la 07 con il periodo dell'inflazione.
- **Non calcola il totale pagato sull'intera durata, né gli interessi
  complessivi**, per nessuna delle due offerte. Per il tasso che si muove
  sarebbe una previsione a venticinque anni; e affiancare un totale vero a uno
  inventato produrrebbe esattamente l'affermazione «questa costa meno», cioè la
  cosa che l'intera specifica esiste per evitare — con l'aggravante di sembrare
  un fatto. Resta fuori anche per il tasso fermo: la simmetria fra le due
  colonne è ciò che le tiene alla pari.
- **Non mostra il piano di ammortamento** rata per rata, e non spiega qui
  perché nei primi anni si pagano soprattutto interessi. È materiale del task
  `11-approfondimento-sul-mutuo`: un concetto per schermata, e questa schermata
  ha già il suo.
- **Non calcola il TAEG e non lo stima.** Quello che la persona digita è il
  TAN, il solo interesse. Istruttoria, perizia e assicurazioni cambiano il
  costo vero e **non sono in questo calcolo**: sta scritto a schermo, perché
  tacerlo altererebbe il significato del numero mostrato.
- **Non prende nessun tasso dalla rete**, né a runtime né in fase di build, e
  non tiene dentro di sé nessun tasso medio di mercato. I due TAN sono quelli
  del preventivo della persona; l'unico dato dichiarato nel codice è la scala
  degli scostamenti, con fonte e periodo da compilare a mano.
- **Non valuta la sostenibilità della rata** e non la confronta con nessun
  reddito. Non chiede quanto guadagna la persona, e se lo chiedesse starebbe
  profilando.
- **Non nomina banche, prodotti o offerte**, e non ne mette in fila nessuna.
- **Non chiede e non conserva dati personali.** I quattro numeri restano nella
  pagina, non finiscono nell'indirizzo — come nella 07, l'hash non porta mai
  una cifra digitata — e non vengono salvati da nessuna parte.

---

## Dichiarazioni tecniche (compilate da `/spec`)

| | |
| --- | --- |
| **Contratti necessari** | **Nessuno.** `DocumentoUtente` e `LetturaCalcolata` descrivono la lettura di un documento a voci, che qui non c'è; `Scenario` serve solo a quelli, quindi **non serve un valore nuovo**. I tipi di ingresso e di uscita nascono **dentro `src/core/`**, di proprietà di `core-engine`, come è già successo per la 07 |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: **questa funzionalità non scrive una riga sotto `types/`**, quindi non richiede l'architetto |
| **Agente incaricato** | **`01-core-engine`** (la formula e la scala delle ipotesi, che sono il cuore), con **`03-ui-builder`** per la schermata e le parole. **`04-guardrail-officer`** rilegge le stringhe prima del merge, come da procedura: qui non è una formalità, perché il testo cammina sul confine per tutta la pagina |
| **Directory toccate** | **3 — servono più agenti.** `src/core/` (`rataMutuo.ts`, `confrontoRateMutuo.ts`, `ipotesiTassoVariabile.ts`, `__tests__/`, più gli export in `index.ts`) · `src/ui/` (`PaginaRataMutuo.tsx`, `testiRataMutuo.ts`, spread in `testi.ts`, rotta nuova in `rotte.ts`, `stiliRataMutuo.css`) · `tests/` (`accettazione/10-rata-mutuo.test.ts`). **`types/`, `src/guardrails/` e `src/assessment/` non vengono toccate** |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/10-rata-mutuo.png` con il caso 150.000 € / 25 anni / 3,46% / 2,80%, cioè **lo stesso caso verificato a mano nel test**: la slide mostra le due cifre che il test dimostra, affiancate e senza un vincitore |

### Impronta e parallelismo, da sapere prima di `/implementa`

L'impronta `src/core/, src/ui/, tests/` è **la stessa della 07**, che è già
`fatto`, e `01-landing-page` è chiusa: nessuno dei due blocca.

Restano due conflitti potenziali, tutti e due su `src/ui/`:

- **`13-tabella-fonti-dati-sorgente-unica`** ha già impronta `src/ui/`. I due
  task non possono girare insieme.
- **`08` e `09`** sono gli altri due simulatori: quando riceveranno la loro
  impronta sarà quasi certamente la stessa di questa. Il pezzo in `src/core/`
  è indipendente e può partire in parallelo con qualunque cosa; la schermata
  no.

Il legame con **`11-approfondimento-sul-mutuo`** è di contenuto, non di file:
questa pagina calcola la rata, quella spiega il meccanismo. Se `11` arriva
prima, questa schermata ci si collega con un link; se arriva dopo, non cambia
niente qui.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-15, dalla sola
> specifica. La fase 2 — rilettura del codice e dei test, esecuzione dei
> passi qui sotto e riscrittura al presente sotto «Verificato» — non è
> ancora stata fatta.
>
> **Uno scostamento già visibile nella specifica stessa, segnalato qui
> invece che corretto.** La tabella «Directory toccate» (sezione
> «Dichiarazioni tecniche») indica ancora `rotte.ts` come file da estendere
> per aggiungere la rotta della nuova schermata. Dalla funzionalità
> `14-registro-delle-schermate` questo non è più il modo in cui una
> schermata si aggiunge: si dichiara in un file nuovo sotto
> `src/ui/schermate/NN-nome.ts` (vedi `07-valore-risparmi.ts` e
> `13-fonti.ts` come modello) e il registro la raccoglie da sola —
> `rotte.ts` non si tocca più. I passi di prova qui sotto seguono la
> struttura attuale, non quella scritta nella specifica; chi implementa
> dovrà fare lo stesso, e la fase 2 dovrà verificare che sia successo
> davvero.

### Cosa farà

Digitando l'importo del prestito, gli anni e i due tassi scritti sul
preventivo, la schermata mostrerà le due rate mensili — quella a tasso fermo e
quella a tasso che si muove — **affiancate, della stessa dimensione, dello
stesso colore e dello stesso peso**, con la differenza fra le due in euro al
mese e in dodici mesi, e una scala di quattro ipotesi su come cambierebbe la
rata mobile se il suo tasso si muovesse davvero. Non indicherà, in nessuna
forma, quale delle due opzioni convenga.

### Per chi

Una persona che ha in mano due preventivi di mutuo — o un preventivo solo con
due righe di tasso, «3,46% fisso» e «2,80% variabile» — nel momento esatto in
cui li tiene sul tavolo e sta per chiedere a qualcuno «ma in pratica quanto
pago?». Non sta scegliendo fra le due offerte: vuole tradurre due percentuali
che non sa leggere in euro al mese, l'unica unità con cui la sua vita è
organizzata.

### Come si proverà

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non
dà il risultato atteso, la funzionalità non è finita. I comandi vanno eseguiti
da `app/`.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (o
   `node scripts/prepara.mjs`). Serve solo la prima volta.
   *Risultato atteso:* l'ambiente risulterà pronto e il controllo di salute
   — `tsc --noEmit` e poi `npm test` — finirà senza errori.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia`, che esegue
   `node scripts/dev-server.mjs start`. Mai `npm run dev` a mano.
   *Risultato atteso:* lo script riporterà l'indirizzo
   `http://localhost:5173`.

3. **Raggiungere la schermata.** Aprire quell'indirizzo e arrivarci dalla
   home, attraverso l'area «Il futuro» — oppure, se il collegamento da lì non
   fosse ancora presente, aprire direttamente il percorso dichiarato nella
   schermata sotto `src/ui/schermate/` per questa funzionalità.
   *Risultato atteso:* si aprirà una pagina sola, con quattro campi da
   compilare: l'importo del prestito, gli anni, il tasso fermo, il tasso che
   si muove.

4. **Il caso vuoto, prima di digitare qualunque cosa.**
   *Risultato atteso:* la schermata dirà **quali quattro numeri servono e
   dove sono scritti sul foglio** — non «nessun risultato» — e i due riquadri
   delle rate occuperanno già il loro spazio, senza numeri, così il layout
   non salterà quando i dati arriveranno.

5. **Il caso di riferimento.** Digitare **150.000,00 €** di capitale, **25**
   anni, **3,46** di tasso fermo e **2,80** di tasso che si muove — lo stesso
   caso calcolato a mano nella specifica.
   *Risultato atteso:* compariranno **747,72 €** e **695,81 €**, affiancate,
   **della stessa dimensione, dello stesso colore e dello stesso peso**,
   ognuna con sopra l'etichetta di quale tasso rappresenta e accanto la
   durata resa tangibile («al mese, per 300 mesi»).

6. **La differenza.** Guardare sotto le due rate.
   *Risultato atteso:* si leggerà **51,91 € al mese** e, subito accanto, **in
   dodici mesi sono 622,92 €**, con la frase «a tasso fermo, cioè come se
   quello che si muove non si muovesse» **a schermo**, non in una nota a piè
   di pagina.

7. **La scala delle ipotesi.** Guardare le quattro righe sotto la
   differenza.
   *Risultato atteso:* quattro righe, con lo scarto rispetto a oggi
   (−1 punto, oggi, +1 punto, +2 punti), la rata corrispondente e quanto
   cambia rispetto a oggi; alla riga «+1 punto» comparirà **775,28 €**.
   Accanto alla scala, a schermo, comparirà la frase che dichiara che sono
   **ipotesi, non pronostici**.

8. **Nessun totale, nessun semaforo — il criterio più importante di
   tutti.** Cercare, in tutta la pagina, un totale sull'intera durata o gli
   interessi complessivi di una delle due offerte, e confrontare i colori
   delle due rate fra loro.
   *Risultato atteso:* **nessun totale sui 25 anni comparirà, per nessuna
   delle due rate.** Le due cifre principali useranno lo stesso colore e lo
   stesso peso: nessuna sarà più grande, più scura o accompagnata da un
   colore diverso dall'altra. Il rosa `#FF50A0` comparirà **solo** nel
   blocco «che cosa questa pagina non fa», in fondo, e da nessun'altra
   parte.

9. **Errore, in lingua umana.** Scrivere un capitale sopra 2.000.000,00 €
   (per esempio 3.000.000,00 €) nel campo del prestito.
   *Risultato atteso:* comparirà un messaggio in linguaggio umano accanto al
   campo — non «errore di validazione» — che dirà che il numero sembra
   troppo alto e fino a dove arriva la pagina. Le due rate **non
   mostreranno una cifra sbagliata**: resteranno come erano o torneranno
   allo stato vuoto, e gli altri tre campi già compilati **non** si
   svuoteranno.

10. **Dati lunghi o numerosi.** Digitare un capitale a sette cifre (per
    esempio 1.980.000,00 €) e 40 anni.
    *Risultato atteso:* le due rate resteranno **su una riga sola ciascuna**,
    senza uscire dal riquadro; restringendo la finestra sotto i 768 px di
    larghezza i due riquadri si impileranno invece di stringersi. Nella
    scala delle ipotesi le etichette andranno a capo se necessario, ma i
    numeri resteranno **allineati a destra e con cifre tabulari**.

11. **Da tastiera e senza mouse.** Restringere la finestra sotto i 768 px,
    poi, senza toccare il mouse, premere Tab più volte fino a raggiungere e
    compilare i quattro campi e ad attivare ogni collegamento della pagina.
    *Risultato atteso:* nessuna scritta scenderà sotto i **16 px**, ogni
    testo avrà un contrasto di almeno **4,5:1**, nessun bersaglio sarà più
    piccolo di **44×44 px**, ogni elemento che riceve il focus mostrerà un
    contorno visibile, e **nessuna informazione** — in particolare la
    differenza fra le due rate e la scala delle ipotesi — sarà leggibile
    **solo** passando il mouse sopra qualcosa.

12. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la build da un server
    locale (non con un doppio clic su `dist/index.html`: quel caso ha un
    difetto già noto e non suo, descritto nella scheda 01).
    *Risultato atteso:* la build finirà senza errori, e rifacendo i passi
    5-8 si leggerà esattamente lo stesso contenuto, senza che parta una sola
    richiesta fuori dal computer.

### Limiti previsti

- **Non indicherà quale delle due opzioni prendere**, in nessuna forma: né a
  parole, né con un colore diverso, né con una dimensione diversa, né con
  l'ordine. È il confine più facile da sfondare, e per questo il passo 8 lo
  mette alla prova per primo fra i criteri di merito.
- **Non calcolerà il totale pagato sull'intera durata**, né gli interessi
  complessivi, per nessuna delle due offerte — nemmeno per il tasso fermo,
  dove sarebbe stato legittimo: la simmetria fra le due colonne è ciò che le
  tiene alla pari.
- **Non presenterà le ipotesi come previsioni.** La scala mostrerà che cosa
  succede alla rata a quattro valori di tasso dichiarati, non quattro
  scenari probabili, e lo dirà a schermo accanto alla scala.
- **Non mostrerà il piano di ammortamento** rata per rata: è materiale della
  funzionalità `11-approfondimento-sul-mutuo`.
- **Non calcolerà né stimerà il TAEG.** Quello che la persona digita è il
  TAN, il solo interesse: istruttoria, perizia e assicurazioni non
  entreranno nel calcolo, e la pagina lo dichiarerà.
- **Non prenderà nessun tasso dalla rete**, né a runtime né in fase di
  build: i due tassi sono quelli che la persona ha scritto, presi dal suo
  preventivo.
- **Non valuterà la sostenibilità della rata** e non la confronterà con
  nessun reddito: non chiederà quanto guadagna la persona.
- **Non nominerà banche, prodotti o offerte.**
- **Non chiederà né conserverà dati personali:** i quattro numeri
  resteranno nella pagina, non finiranno nell'indirizzo e non saranno
  salvati da nessuna parte.

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
