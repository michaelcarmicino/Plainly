# 11 — «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»

> Stato: **approvata** · 2026-09-14 · pronta per `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «01-core-engine»
> e «04-guardrail-officer»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 5 «Approfondimento: il Mutuo». Task di backlog: `11`.
>
> **Funzionalità prevalentemente redazionale**: cinque schermate su otto sono
> solo parole. Il calcolo che resta è piccolo e dichiarato — due funzioni pure
> che si appoggiano alla formula della funzionalità `10` senza riscriverla.
> Vedi «Elaborazione», che dice esattamente che cosa nasce qui e che cosa no.

## Conformità — l'esito dei quattro criteri, prima di tutto il resto

| Criterio di rifiuto | Esito | Perché |
| --- | --- | --- |
| 1 · consiglia o raccomanda una scelta | **superato, con tre condizioni vincolanti** | vedi sotto |
| 2 · chiamate esterne a runtime | **superato** | nessun dato di mercato entra in questa funzionalità: vedi «Input» |
| 3 · altera il significato dell'informazione originale | **superato, con una condizione** | il nome tecnico resta, non viene sostituito dalla parafrasi |
| 4 · interfaccia conversazionale aperta | **superato** | otto schermate ferme, nessun campo di domanda libera |

### Il criterio 1 è il vero cancello, e qui passa solo a certe condizioni

Il mutuo è il tema in cui la spiegazione scivola nell'imperativo da sola.
«Meglio un mutuo corto», «attento alle spese accessorie», «tratta con la
banca» sono consigli, e sono la cosa più naturale da scrivere su questa
pagina. La via d'uscita è quella di `.claude/rules/scrittura-e-accessibilita.md`:
**togli il «tu devi», lascia il «chi fa così, ottiene questo»**.

| Formulazione vietata | Stessa informazione, ammessa |
| --- | --- |
| «conviene allungare la durata» | «chi allunga la durata paga una rata più bassa ogni mese e un totale di interessi più alto» |
| «attento alle spese accessorie» | «oltre alla rata si pagano queste quattro voci, una volta sola, all'inizio» |
| «se trovi un tasso migliore cambia banca» | «la legge prevede che il mutuo si possa spostare in un'altra banca senza pagare notaio, penali né pratica» |
| «il fisso è più sicuro» | «con il tasso fisso la cifra della rata non cambia dal primo all'ultimo mese» |

Le tre condizioni, vincolanti per chi implementa:

1. **Nessuna frase in seconda persona che indichi un'azione.** Le schermate
   descrivono meccanismi, non dicono a nessuno che cosa fare. Ogni schermata
   chiude con una riga che dichiara il proprio confine.
2. **Nessuna prova sociale.** Il documento d'origine riporta «oltre il 90%
   degli italiani sceglie il fisso» e «quasi metà dei nuovi mutui è a 30
   anni». Sono numeri veri ma funzionano come spinta: «fanno tutti così»
   è un consiglio travestito da statistica. **Non entrano.** Motivo scritto
   in «Cosa questa funzionalità NON fa».
3. **La schermata 7 — «se la rata non si riesce più a pagare» — si rilegge
   per ultima con `04-guardrail-officer`.** È il testo letto nel momento di
   massimo stress: descrive strumenti pubblici che esistono, senza dire a
   nessuno di usarli e senza mettere fretta.

### Il criterio 3, e il punto in cui si rompe

«Semplificare» qui significa togliere una condizione. «La surroga è gratis»
è falso a metà: è gratis per chi la ottiene, e la banca nuova può non
accettarla. **La condizione sta nella stessa frase del meccanismo, mai in una
nota.** Stessa regola per il Fondo di solidarietà: esiste, e vale in alcune
situazioni previste dalla legge — le due cose si dicono insieme.

E, per lo schema «traduzione, non definizione»: la parafrasi **aggiunge** il
nome tecnico, non lo sostituisce. Chi legge deve poter riconoscere la parola
quando la trova sul contratto. Prima l'immagine, poi il nome — mai il
contrario.

## Per chi

Una persona che sta per firmare, o ha già firmato, il debito più grande della
sua vita, e che davanti al foglio della banca riconosce solo la cifra della
rata. TAN, TAEG, ammortamento, ipoteca, istruttoria sono parole che ha letto
e su cui non ha chiesto spiegazioni, perché chiedere avrebbe significato
ammettere di non sapere.

Non è una persona che sta valutando un investimento: è una persona che ha già
la casa in mente e il foglio in mano.

## Quando serve

Nei giorni fra il preventivo della banca e la firma — quando il foglio è sul
tavolo e le domande si accumulano — e nei mesi dopo, quando arriva il piano
di ammortamento e il debito è sceso molto meno di quanto ci si aspettava.

C'è un terzo momento, ed è quello della schermata 7: quando la rata comincia
a pesare troppo. Lì la persona non legge per curiosità.

## Cosa deve poter fare dopo

Cose osservabili, non sentimenti. Dopo, la persona sa dire a voce:

- **che cosa c'è dentro una rata** — «della prima rata da 474,21 €, 250,00 €
  sono interessi e solo 224,21 € abbassano il debito; nell'ultima gli interessi
  sono 1,18 €»;
- **che cosa distingue TAN e TAEG** — «uno è il prezzo dei soldi, l'altro
  mette dentro anche la pratica, la perizia e l'assicurazione»;
- **che cosa cambia allungando la durata** — «da 25 a 30 anni la rata scende
  di 52,61 € al mese e in tutto si pagano 9.513 € di interessi in più»;
- **che il mutuo si può spostare in un'altra banca**, e che è scritto in una
  legge;
- **che se la rata non si riesce più a pagare esistono due strade previste
  dalla legge**, e sa come si chiamano.

## Input

**Nessun dato di mercato. Nessuna fixture. Nessun documento.**

Tutto il contenuto è testo scritto nel bundle. I numeri che compaiono sono
aritmetica su **un mutuo d'esempio dichiarato come tale nella stessa frase in
cui appare**:

| Dato dell'esempio | Valore | Da dove arriva |
| --- | --- | --- |
| capitale prestato | 100.000,00 € | **ipotesi scritta nella schermata** |
| durata | 25 anni (300 rate), confrontata con 30 anni (360 rate) | ipotesi |
| tasso annuo | 3,00% (300 bp), confrontato con 4,00% (400 bp) | ipotesi |

> **Perché un'ipotesi e non il tasso vero.** Il documento d'origine indica
> Banca d'Italia / ABI per i tassi medi ed EMMI per l'Euribor, con
> aggiornamento mensile: prenderli sarebbe una chiamata di rete, che il
> prodotto non fa. Scriverli a mano senza fonte sarebbe un numero inventato,
> che la sezione 7 del documento d'origine esiste per impedire.
>
> **La terza via è dire la verità**: questi numeri sono un esempio scelto per
> far vedere il meccanismo, e la schermata lo scrive. Un esempio dichiarato
> non è un dato sbagliato: è un dato che non finge di essere altro. I valori
> di mercato veri appartengono alla tabella unica del task `13`, non a questa
> pagina.

## Elaborazione

**Cinque schermate su otto non calcolano niente**: l'indice e i concetti 2, 5,
6 e 7 sono testo, e non chiamano il core. Le tre che mostrano numeri sono i
concetti 1, 3 e 4. Il calcolo che resta è poco, e va dichiarato per intero
invece di essere nascosto in un componente.

**La formula della rata non nasce qui.** L'ammortamento alla francese è di
`10`, che lo mette in `src/core/rataMutuo.ts` con la sua verifica a mano:

```
rata = C × [ i × (1+i)^n ] ÷ [ (1+i)^n − 1 ]
  C = capitale · i = tasso annuo ÷ 12 · n = anni × 12
```

**Quello che nasce qui sono due funzioni pure**, in un modulo nuovo sotto
`src/core/` — `quoteRata.ts` — che chiama `rataMutuo()` e non la riscrive.
Due implementazioni della stessa formula divergono di un centesimo, e il
centesimo che non torna è il difetto che questo progetto dichiara di voler
impedire.

1. `quoteDellaRata(capitaleResiduoCent, tassoAnnuoBp, rataCent)` — come si
   divide **una** rata:
   `interesseCent = Math.round(capitaleResiduoCent × tassoAnnuoBp / 120_000)`
   e `capitaleCent = rataCent − interesseCent`. Un arrotondamento solo, e la
   somma delle due quote fa la rata per costruzione: non può sballare.
2. `totaleRestituitoCent(rataCent, n)` = `rataCent × n`, e
   `interessiTotaliCent` = quel totale meno il capitale. **Interi su interi,
   sulla rata già arrotondata**: è la cifra che vede chi paga, e si rifà a
   mano con una moltiplicazione.

Per la prima rata `capitaleResiduoCent` è il capitale prestato. Per l'ultima è
`Math.round(rataCent / (1 + i))`, cioè il debito che quella rata chiude.

> **Perché `11` mostra un totale di interessi e `10` no.** La specifica `10`
> esclude i totali per una ragione precisa: affiancare il totale di due
> offerte diverse — una a tasso fermo e una a tasso che si muove — direbbe
> «questa costa meno», e per il tasso variabile sarebbe per giunta una
> previsione a venticinque anni. **Qui il confronto è un altro**: stesso
> tasso, stessa cifra prestata, **due durate**. Non ci sono due prodotti da
> mettere alla pari, c'è una sola aritmetica guardata a 300 e a 360 rate. Il
> divieto di `10` resta intatto: nessuna schermata di `11` affianca il fermo
> al variabile con un totale accanto.

### I valori attesi, verificati a mano

Riportati qui perché `01-core-engine`, il `tester` e chi implementa `10`
abbiano lo stesso riferimento. Su `C = 100.000 €`, cioè `10.000.000 cent`:

```
25 anni, 3,00%   i = 0,0025      n = 300
(1,0025)^300     = 2,1150197
rata = 100000 × 0,0025 × 2,1150197 ÷ 1,1150197 = 474,2113 -> 474,21 €
totale restituito = 474,21 × 300 = 142.263,00 €  ->  interessi 42.263,00 €

prima rata:  interesse = 10.000.000 × 300 ÷ 120.000 = 25.000 cent = 250,00 €
             debito    = 47.421 − 25.000          = 22.421 cent = 224,21 €
ultima rata: debito residuo = 47.421 ÷ 1,0025     = 47.302,74 -> 47.303 cent
             interesse = 47.303 × 300 ÷ 120.000   = 118,26 ->    118 cent = 1,18 €
             debito    = 47.421 − 118             = 47.303 cent = 473,03 €

30 anni, 3,00%   i = 0,0025      n = 360
(1,0025)^360     = 2,4568422
rata = 100000 × 0,0025 × 2,4568422 ÷ 1,4568422 = 421,6040 -> 421,60 €
totale restituito = 421,60 × 360 = 151.776,00 €  ->  interessi 51.776,00 €
differenza rata      = 474,21 − 421,60 = 52,61 € al mese in meno
differenza interessi = 51.776 − 42.263 = 9.513 € in più
9.513 ÷ 421,60 = 22,56  ->  circa 22 rate e mezzo, quasi due anni

25 anni, 4,00%   i = 0,00333333  n = 300
(1,0033333)^300  = 2,7137652
rata = 100000 × 0,0033333 × 2,7137652 ÷ 1,7137652 = 527,8368 -> 527,84 €
differenza = 527,84 − 474,21 = 53,63 € al mese · 643,56 € in un anno
```

> **Dove si arrotonda, e dove no.** Una volta sulla rata — ed è `10` a farlo.
> Una volta sull'interesse della singola rata, che è una quantità sua e non
> un secondo arrotondamento della prima. **La quota di debito non si arrotonda
> affatto**: è una sottrazione fra due interi, ed è il motivo per cui
> `interesse + debito = rata` vale sempre, senza eccezioni da gestire. I
> totali moltiplicano la rata già arrotondata: è la cifra che vede chi paga, e
> rende il conto rifacibile a mano su un foglio.

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`.

## Output

**Otto schermate: un indice più sette concetti, un concetto per schermata.**
Sette concetti non sono una tabella con sette righe: sono sette passaggi.

L'indice è la schermata dietro la domanda `area3Altra2` già presente sulla
pagina dell'area «Il futuro» — «Quanto costa in tutto un mutuo, oltre ai
soldi che la banca presta?». Dalla home sono **tre tap**: il limite dichiarato
in `.claude/rules/scrittura-e-accessibilita.md`, non un tap in più.

Ogni schermata di concetto ha la **struttura riusabile del task `03`**, nei
suoi quattro pezzi: la domanda reale come titolo · l'immagine mentale
concreta in due o tre frasi · l'esempio numerico o la condizione · il link
al simulatore collegato, dove esiste.

### I sette concetti, in ordine di costruzione

| # | La domanda, in lingua umana | Termini tradotti | Numeri |
| --- | --- | --- | --- |
| 1 | Perché nei primi anni il debito scende così poco? | ammortamento alla francese | prima rata 250,00 € / 224,21 €; ultima rata 1,18 € |
| 2 | Sul volantino c'è un numero, sul contratto ce ne sono due | TAN, TAEG, istruttoria, perizia | nessuno: il meccanismo, non la cifra |
| 3 | 20, 25 o 30 anni: che cosa cambia nel conto? | — | −52,61 € al mese, +9.513 € in tutto |
| 4 | Rata sempre uguale o rata che si muove? | tasso fisso, tasso variabile | +1 punto → +53,63 € al mese |
| 5 | Che cosa si paga e che cosa si firma all'inizio | ipoteca, notaio, imposta sostitutiva, perizia, assicurazione | nessuno |
| 6 | Spostare il mutuo in un'altra banca: che cosa dice la legge | surroga, art. 120-quater TUB | nessuno |
| 7 | Se la rata non si riesce più a pagare, che cosa esiste | Fondo di solidarietà, rinegoziazione | nessuno |

L'ordine non è quello del documento d'origine: **apre la schermata 1**, che è
l'unica contro-intuitiva e l'unica che si vede in dieci secondi in demo. Se il
tempo finisce, quello che manca si legge dal fondo della lista — e si vede,
perché l'indice mostra le voci non ancora costruite come testo semplice con la
nota `statoPlaceholder`, il meccanismo che `PaginaMacrocategoria.tsx` usa già.

**L'ipoteca sta nella schermata 5 e non in una sua**: la schermata 5 ha un
concetto solo, ed è «l'inizio del mutuo, oltre alla rata» — le voci che si
pagano e il vincolo che si firma, tutte nello stesso momento.

### Stringhe nuove in `src/ui/testi.ts`

Entrano con lo **spread**, come `STRINGHE_SIMULAZIONE`: il registro scandito
dal guardrail resta **un oggetto solo**. Le nuove chiavi stanno in
`src/ui/testiMutuo.ts` e, per il limite di 150 righe per file,
`src/ui/testiMutuoConcetti.ts`. La divisione è meccanica, non semantica.

**Comuni** — `mutuoOcchiello`, `mutuoTitolo`, `mutuoIntro`,
`mutuoIndiceIntestazione`, `mutuoIndiceNota`, `mutuoIpotesiEsempio`,
`mutuoLinkSimulatore`, `mutuoTornaIndice`, `mutuoLimitiTitolo`,
`mutuoLimiteAzione`, `mutuoLimiteMercato`, `mutuoLimiteSituazione`.

**Stati** — `mutuoEsempioVuoto`, `mutuoEsempioNonCalcolabile`,
`mutuoConcettoNonTrovato`.

**Per concetto**, con il suffisso `Domanda` · `Immagine` · `NomeTecnico` ·
`Esempio` · `Confine`:
`mutuoAmmortamento*`, `mutuoTanTaeg*`, `mutuoDurata*`, `mutuoFissoVariabile*`,
`mutuoSpeseIniziali*`, `mutuoSurroga*`, `mutuoRataSospesa*`.

In più, dove l'elenco è parte del concetto: `mutuoSpeseIpoteca`,
`mutuoSpeseNotaio`, `mutuoSpeseImposta`, `mutuoSpesePerizia`,
`mutuoSpeseAssicurazione`; `mutuoSurrogaCondizione`;
`mutuoRataSospesaRinegoziazione`.

I numeri non sono mai scritti a mano dentro le stringhe: entrano dai
segnaposto `{...}` che `<Testo>` sostituisce, come già in
`testiSimulazione.ts`.

### Tre trappole del lessico, da sapere prima di scrivere

Il guardrail è vivo e queste tre formulazioni lo fanno scattare — sono
esattamente quelle che verrebbero naturali su questa pagina:

- **«la rata passa a 527,84 €»** → la radice `passa\sa` è vietata.
  Si scrive «la rata passa **da** 474,21 € **a** 527,84 €», oppure «diventa».
- **«la legge garantisce»** → `garantit*` è segnalato. Si scrive «la legge
  **prevede**».
- **«il fisso è senza rischi»** → `senza\srischi` è vietato, e sarebbe comunque
  falso. Si scrive «con il fisso la cifra della rata non cambia».

### I quattro stati obbligatori

1. **Vuoto** — il riquadro dell'esempio numerico quando la funzione di
   ammortamento non è disponibile: dice quale numero manca e perché non viene
   inventato, non mostra uno zero. E l'indice, che elenca anche i concetti non
   ancora costruiti invece di nasconderli: un elenco onesto vale più di link
   che non portano da nessuna parte.
2. **In caricamento** — il testo è nel bundle, non arriva da nessuna parte:
   lo stato esiste ma non lampeggia. Il riquadro dell'esempio occupa già il
   suo spazio, così quando i numeri compaiono non spingono in basso ciò che
   sta sotto.
3. **Errore** — non c'è niente da digitare, quindi l'errore è di percorso: un
   indirizzo scritto a mano che punta a un concetto inesistente mostra un
   messaggio da persona e la via per tornare all'indice, mai una pagina
   bianca. Se la funzione del core risponde `{ ok: false }`, il solo riquadro
   dell'esempio lo dice in lingua umana e il resto della schermata continua a
   funzionare.
4. **Dati lunghi** — la schermata 7 è la più lunga di tutte; «imposta
   sostitutiva» è l'etichetta che va a capo per prima; l'indice ha sette
   domande lunghe una riga e mezzo. Nessuna deve rompere la griglia sotto i
   768 px, e i numeri restano tabulari e allineati a destra.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/quoteRata.test.ts`, di
  `01-core-engine`, con i valori attesi calcolati a mano qui sopra scritti nel
  commento accanto all'asserzione: `250,00 € / 224,21 €` sulla prima rata,
  `1,18 € / 473,03 €` sull'ultima, `42.263,00 €` di interessi su 300 rate.
  Copre anche il caso `tassoAnnuoBp = 0`, dove l'interesse è zero e la rata è
  tutta debito, e l'invariante che vale sempre: **interesse + capitale = rata**.
- **Test di accettazione** — `tests/accettazione/11-approfondimento-sul-mutuo.test.ts`,
  scritto dal `tester` dalla specifica. Copre: l'indice elenca sette voci; da
  ogni voce si arriva alla schermata; un indirizzo storto porta al messaggio
  di percorso e non a una pagina bianca; la schermata 1 mostra 250,00 € e
  224,21 € accanto alla rata da 474,21 €.
- **Test del lessico** — `tests/lessico-mutuo.test.ts`, sul modello di
  `tests/lessico-simulazione-risparmio.test.ts`: scandisce le stringhe nuove
  contro `LESSICO_PRESCRITTIVO` e verifica che **ogni schermata abbia la sua
  riga di confine** e che il nome tecnico compaia **dopo** l'immagine, mai
  prima.
- **In demo, dieci secondi**: si apre la schermata 1 e si legge una riga —
  «della prima rata da 474,21 €, 250,00 € sono interessi; nell'ultima sono
  1,18 €». È il fatto contro-intuitivo che chiunque abbia un mutuo ha visto
  senza capirlo.

## Cosa questa funzionalità NON fa

- **Non dice a nessuno che cosa scegliere.** Non fra fisso e variabile, non
  fra 20 e 30 anni, non se spostare il mutuo. Mostra che cosa cambia nel
  conto e si ferma lì. È il confine più facile da sfondare di tutto il
  progetto, perché ogni schermata finisce su una domanda che chiede una
  risposta che questa pagina non dà.
- **Non usa numeri di mercato.** Niente TAN medio, niente TAEG medio, niente
  Euribor: prenderli sarebbe una chiamata di rete, scriverli a mano senza
  fonte sarebbe inventarli. I valori veri appartengono alla tabella unica del
  task `13`. Le cifre di questa pagina sono aritmetica su un mutuo d'esempio
  che la pagina stessa dichiara tale.
- **Non riporta che «oltre il 90% degli italiani sceglie il fisso» né che
  «quasi metà dei nuovi mutui è a 30 anni».** Sono nel documento d'origine e
  sono probabilmente veri, ma in una pagina che spiega funzionano come spinta:
  «fanno tutti così» è un consiglio travestito da statistica. Fuori entrambi,
  e il motivo è scritto qui perché l'esclusione sia visibile.
- **Non riscrive la formula della rata.** L'ammortamento alla francese è di
  `10`: qui si chiama `rataMutuo()` e ci si appoggia sopra. Quello che nasce
  in `src/core/` per questa funzionalità sono due funzioni piccole — come si
  divide una rata, quanto si restituisce in tutto — e niente altro.
- **Non affianca mai il tasso fermo al tasso che si muove con un totale
  accanto.** È il confine che `10` ha posto, e resta in piedi: un totale su
  venticinque anni di tasso variabile sarebbe una previsione, e due totali
  affiancati direbbero «questa costa meno». Il confronto con i totali qui
  esiste solo fra **due durate a parità di tasso**.
- **Non mostra il piano di ammortamento rata per rata.** Mostra due sole rate,
  la prima e l'ultima, perché il concetto sta tutto nel loro confronto.
- **Non è il simulatore.** Non ha campi da compilare: l'esempio è uno, fisso e
  dichiarato. Chi vuole provare con la propria cifra passa dal simulatore
  `10`, e il link ce l'ha in fondo alle schermate 1, 3 e 4.
- **Non spiega il piano di ammortamento come documento.** La guida-documento
  al piano è nel documento d'origine fra i documenti di fase successiva: qui
  si spiega il meccanismo, non si legge il foglio.
- **Non valuta la situazione di chi legge** e non chiede niente di personale:
  non c'è un campo da compilare, quindi non c'è un dato da conservare.
- **Non promette che la surroga sia ottenibile.** Dice che la legge la
  prevede e, nella stessa frase, che la banca nuova deve accettarla.
- **Non mette fretta.** In particolare la schermata 7: descrive due strumenti
  che esistono e le condizioni a cui esistono, senza nessuna pressione
  temporale.

---

## Dichiarazioni tecniche (compilate da `/spec`)

| | |
| --- | --- |
| **Contratti necessari** | **Nessuno.** Questa funzionalità non legge un documento e non produce una lettura: `DocumentoUtente`, `LetturaCalcolata` e `Scenario` non la riguardano. I tipi delle due funzioni nuove nascono **dentro `src/core/`**, come è già successo per la `07` e per la `10` |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: **`types/` non viene toccata**, quindi non richiede l'architetto |
| **Agente incaricato** | **`03-ui-builder`** — otto schermate su otto sono parole, e cinque sono soltanto parole: è lì che sta il rischio. Con **`01-core-engine`** per `quoteRata.ts`, che è piccolo ma è calcolo e non va scritto in un componente. Con **`04-guardrail-officer`** per le voci nuove del lessico e per la rilettura dei testi prima del merge, che qui è un passo obbligatorio e non una cortesia |
| **Directory toccate** | **4 — servono tre agenti.** `src/core/` (`quoteRata.ts` + `__tests__/`, più l'export in `index.ts`; **la formula della rata NON nasce qui**, viene da `10`) · `src/ui/` (`testiMutuo.ts`, `testiMutuoConcetti.ts`, `contenutiMutuo.ts`, `PaginaMutuo.tsx`, `PaginaConcettoMutuo.tsx`, rotte a due segmenti in `rotte.ts`, il collegamento di `area3Altra2` in `PaginaMacrocategoria.tsx`, `stiliMutuo.css`) · `src/guardrails/` (voci nuove in `LESSICO_PRESCRITTIVO`: `cambia banca`, `rinegozia`, `tratta con la banca` — **aggiunta, nessuna modifica alla struttura**) · `tests/` (`accettazione/11-…`, `lessico-mutuo.test.ts`). **`types/` e `src/assessment/` non vengono toccate** |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/11-mutuo-ammortamento.png`, la schermata 1 con 250,00 € / 224,21 € sulla prima rata e 1,18 € sull'ultima — gli stessi numeri verificati a mano in «Elaborazione». Secondario: `11-mutuo-durata.png` con −52,61 € al mese e +9.513 € in tutto |

### Dipendenze, e perché sono reali

**`dipende-da: 03-pagina-di-spiegazione-struttura-riusabile, 10-simulatore-rata-mutuo-fisso-variabile`**

- **`03` — dipendenza strutturale.** Questo approfondimento è **un'istanza**
  della struttura di pagina che il task `03` definisce: domanda reale come
  titolo, immagine mentale, esempio numerico, link al simulatore collegato.
  Sette istanze, per la precisione. Costruire qui un contenitore proprio
  significherebbe averne due da mantenere e da rendere accessibili, e il
  secondo nascerebbe già divergente dal primo.
- **`10` — dipendenza sulla formula, non sul contenitore.** Le schermate 1, 3
  e 4 mostrano cifre che escono dall'ammortamento alla francese.
  `rataMutuo()` è di `10` e sta in `src/core/`: qui la si chiama.
  Riscriverla significherebbe due implementazioni della stessa formula che
  possono divergere di un centesimo — e il centesimo che non torna è
  esattamente il difetto che questo progetto dichiara di voler impedire.

  **Attenzione, è il punto che è stato quasi sbagliato.** La specifica `10`
  esclude esplicitamente il totale restituito, gli interessi complessivi e il
  piano rata per rata, e li rimanda a **questo** task. Quei numeri quindi
  **non arrivano da `10` già pronti**: li produce `quoteRata.ts`, che nasce
  qui sopra `rataMutuo()`. È il motivo per cui `src/core/` è nell'impronta di
  `11` anche se questa è una funzionalità di parole.

**Se `10` non è pronto, le quattro schermate senza numeri (2, 5, 6, 7) si
scrivono lo stesso**: sono testo puro e non chiamano il core. Ma il merge
aspetta, perché una funzionalità è una spec sola e si chiude intera.

### Conflitto di pianificazione, da sapere prima di `/implementa`

L'impronta `src/ui/` è la più contesa del progetto. **Non possono girare in
parallelo a questa**: `03` (stesso `src/ui/`, ed è anche una dipendenza),
`10` (`src/core/` e `src/ui/`, ed è l'altra dipendenza), `13` (impronta
proposta `src/ui/`), e ogni altra funzionalità che scriva schermate. `01` e
`07` sono già `fatto`, quindi non confliggono più.

Con quattro directory su cinque, **questa è l'impronta più larga del
backlog**: va pianificata da sola. Se il PM vuole stringerla, il taglio
naturale è staccare `src/guardrails/` — le tre voci nuove del lessico, che
nessun altro task rivendica — in un intervento separato di
`04-guardrail-officer`. Ma allora vanno fatte **prima**, non dopo, perché
servono a scandire i testi mentre nascono.
