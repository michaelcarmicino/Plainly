# 08 — «Quanto mi resta davvero in busta»

> Stato: **proposta** · 2026-09-14 · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 4, simulatore 2. Task di backlog: `08`.
>
> **Tre scostamenti dal documento d'origine**, tutti per conformità o per
> onestà del dato, tutti spiegati in «Cosa questa funzionalità NON fa»: la
> variante «dipendente o forfettario» resta fuori, le aliquote non arrivano
> dalla rete, e il risultato è dichiarato a schermo come stima, non come la
> busta paga vera.

## Per chi

Una persona con la busta paga in mano che legge due numeri molto diversi — il
lordo in alto e quello che le arriva sul conto — e non sa che cosa sia successo
in mezzo. Ha sentito dire «ti tolgono le tasse», ma non sa quanto, non sa a chi
vanno, e soprattutto non sa se quella differenza sia normale o se riguardi solo
lei.

Non è un consulente del lavoro e non è un commercialista: è chi riceve un
documento, vede una sottrazione che non ha fatto, e vorrebbe almeno sapere da
dove viene.

## Quando serve

Nel momento esatto in cui arriva la busta paga, o in cui qualcuno le propone un
lordo — un colloquio, un rinnovo, un passaggio di livello — e lei deve capire
che cosa significhi quel numero per la sua spesa di tutti i mesi. Un lordo
annuo, da solo, non compra niente: è il netto mensile che si confronta con
l'affitto.

È anche il momento di arrivo dalla guida alla busta paga (task `04`): chi sta
leggendo le voci del documento e vuole rifare il conto sul proprio caso.

## Cosa deve poter fare dopo

Dire due cifre riferite a sé: «con 2.000 € lordi al mese e 13 mensilità, me ne
restano 1.398,47 al mese» e «su ogni 100 € che il datore di lavoro scrive come
lordo, 69,92 arrivano sul mio conto». Prima aveva una differenza inspiegata fra
due numeri, dopo ha una sottrazione in tre pezzi che può rifare su un foglio.

Osservabile: sa dire **quanto** va in contributi, **quanto** in imposta sul
reddito, **quanto** resta — e che i tre pezzi rimessi insieme fanno esattamente
il lordo di partenza, senza avanzi.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `lordoMensileCent` | intero in centesimi | lo digita la persona |
| `mensilita` | intero, 12–14 | lo digita la persona |
| `scaglioni` | elenco di soglie e aliquote in bp | **parametro**, da un modulo dichiarato |
| `contributi` | aliquote e soglia in bp e centesimi | **parametro**, da un modulo dichiarato |

Si chiede il **lordo mensile** e non il lordo annuo perché il lordo mensile sta
scritto sulla busta che la persona ha in mano, mentre il lordo annuo sta sul
contratto o nel riepilogo di fine anno, che spesso non ha sottomano. Le
mensilità non sono un dato che possiamo dedurre — 12, 13 o 14 cambiano il
risultato di parecchio — ma sono un fatto che la persona conosce: è quante
volte l'anno le arriva lo stipendio.

Il lordo annuo non è un terzo campo: si ricava con una moltiplicazione fra
interi, `lordoMensileCent × mensilita`, senza arrotondamenti.

> ### Blocco da sciogliere, non un dettaglio
>
> **Aliquote IRPEF, soglie degli scaglioni, aliquote contributive INPS e
> soglia dell'eccedenza sono dati che nessuno di noi può inventare**, e non
> possono venire dalla rete: un aggiornamento automatico sarebbe una chiamata
> esterna, che il prodotto non fa — né a runtime né in fase di build.
>
> I valori citati nel documento d'origine (23% / 33% / 43% con soglie a 28.000
> e 50.000 €; 9,19% con 10,19% sulla quota oltre 52.190 €/anno) sono **una
> decisione di progetto presa da un documento interno, non una circolare
> verificata con il suo anno d'imposta**. Finché una persona non recupera la
> fonte — Agenzia delle Entrate / Legge di Bilancio per l'IRPEF, circolare
> INPS per i contributi — e dichiara **l'anno d'imposta a cui si riferiscono**,
> quei numeri sono valori di prova: il calcolo si può rifare, la loro
> provenienza non si può ancora controllare.
>
> **L'architettura è studiata perché questo blocco non fermi
> l'implementazione**, esattamente come nella `07`: la funzione del core
> **riceve scaglioni e aliquote come parametri** e non legge mai la costante
> dichiarata, quindi codice e test si scrivono e passano subito. Resta da
> riempire **un modulo separato**, `src/core/fiscoDichiarato.ts`, che tiene il
> valore insieme alla sua provenienza e a un flag `annoImpostaDichiarato`
> inizialmente `false`. Finché il flag è falso **la schermata lo dice**,
> invece di presentare le aliquote come un fatto verificabile.
>
> È lo stesso schema di `src/core/inflazioneDichiarata.ts`, e alimenta il task
> `13` (tabella delle fonti come sorgente unica).

## Elaborazione

Tutto in `src/core/`, puro e deterministico: nessun I/O, nessun `Date.now()`,
nessun `Math.random()`. Aritmetica intera; **l'arrotondamento avviene una volta
sola per ogni grandezza**, mai su un valore intermedio già arrotondato.

1. **Lordo annuo.** `lordoAnnuoCent = lordoMensileCent × mensilita`.
   Moltiplicazione fra interi: esatta, nessun arrotondamento.

2. **Contributi INPS a carico della persona.** L'aliquota base si applica fino
   alla soglia, quella maggiorata solo alla quota che la supera:

   ```
   quotaBaseCent      = min(lordoAnnuoCent, sogliaEccedenzaCent)
   quotaEccedenteCent = max(0, lordoAnnuoCent - sogliaEccedenzaCent)
   contributiCent     = round(
       (quotaBaseCent × aliquotaBaseBp + quotaEccedenteCent × aliquotaEccedenzaBp)
       / 10_000 )
   ```

   Il numeratore è un prodotto fra interi e la divisione per 10.000 avviene una
   volta sola, alla fine: le due tranche non si arrotondano separatamente.

3. **Imponibile IRPEF.** `imponibileCent = lordoAnnuoCent - contributiCent`.
   Sottrazione fra interi.

4. **IRPEF lorda a scaglioni.** Per ogni scaglione si prende **solo la porzione
   di imponibile che ci sta dentro**, non tutto l'imponibile:

   ```
   porzioneCent = max(0, min(imponibileCent, limiteSuperioreCent) - limiteInferioreCent)
   irpefCent    = round( Σ (porzioneCent × aliquotaBp) / 10_000 )
   ```

   Il limite inferiore di uno scaglione è il limite superiore del precedente; il
   primo parte da zero e l'ultimo non ha tetto (`limiteSuperioreCent: null`). La
   somma si accumula come intero e si divide per 10.000 **una volta sola**.

5. **Netto annuo.** `nettoAnnuoCent = lordoAnnuoCent - contributiCent - irpefCent`.
   Per costruzione i tre pezzi rimessi insieme fanno esattamente il lordo: non
   c'è uno scarto da nascondere.

6. **Netto mensile.** `nettoMensileCent = round(nettoAnnuoCent / mensilita)`.
   È il numero grande della schermata, e l'unico punto in cui una divisione non
   esatta produce un resto: l'arrotondamento è al centesimo più vicino, con il
   mezzo centesimo verso l'alto.

7. **Il paragone concreto — quanto resta di ogni 100 € lordi.**
   `nettoPerCentoEuroCent = round(nettoAnnuoCent × 10_000 / lordoAnnuoCent)`.
   Cento euro sono una banconota che tutti hanno avuto in mano: è il paragone
   mostrato accanto al risultato, non un secondo calcolo che potrebbe non
   tornare.

8. **Le tre quote della barra, in punti base.**

   ```
   quotaContributiBp = round(contributiCent × 10_000 / lordoAnnuoCent)
   quotaIrpefBp      = round(irpefCent      × 10_000 / lordoAnnuoCent)
   quotaNettoBp      = 10_000 - quotaContributiBp - quotaIrpefBp
   ```

   La terza quota si **ricava per differenza**, non si arrotonda: è l'unico modo
   perché la barra chiuda sempre esattamente al 100% invece di lasciare uno o
   due punti base di buco visibile a schermo. Scelta dichiarata, non una svista:
   gli importi in centesimi restano quelli dei passi 2, 4 e 5, ed è su quelli
   che si verifica la quadratura.

### Verifica a mano, da riportare nel commento del test

**Caso A — quello della demo.** `lordoMensileCent = 200_000` (2.000,00 €),
`mensilita = 13`, aliquote e scaglioni come sopra.

```
lordo annuo        = 200.000 × 13                    = 2.600.000 cent  (26.000,00 €)
contributi         = 2.600.000 × 919 / 10.000        =   238.940 cent  ( 2.389,40 €)
                     (26.000 sotto la soglia 52.190: nessuna quota eccedente)
imponibile         = 2.600.000 - 238.940             = 2.361.060 cent  (23.610,60 €)
IRPEF (solo 23%)   = 2.361.060 × 2300 / 10.000
                   = 5.430.438.000 / 10.000 = 543.043,8 ->  543.044 cent ( 5.430,44 €)
netto annuo        = 2.600.000 - 238.940 - 543.044   = 1.818.016 cent  (18.180,16 €)
netto mensile      = 1.818.016 / 13 = 139.847,38...  ->  139.847 cent  ( 1.398,47 €)
su 100 € lordi     = 1.818.016 × 10.000 / 2.600.000 = 6.992,37 -> 6.992 cent (69,92 €)
quota contributi   =   238.940 × 10.000 / 2.600.000 =   919,00 ->   919 bp  ( 9,19%)
quota IRPEF        =   543.044 × 10.000 / 2.600.000 = 2.088,63 -> 2.089 bp  (20,89%)
quota netto        = 10.000 - 919 - 2.089           = 6.992 bp           (69,92%)
quadratura         = 238.940 + 543.044 + 1.818.016 = 2.600.000  ✓ esatto
```

Il caso A esercita l'arrotondamento vero (`543.043,8 → 543.044`) e l'aggancio
fra il paragone su 100 € e la quota del netto, che devono dare **lo stesso
numero**: 6.992. Se divergono, uno dei due passi è sbagliato.

**Caso B — quello che attraversa tutti gli scaglioni e la soglia dei
contributi.** `lordoMensileCent = 500_000` (5.000,00 €), `mensilita = 12`.

```
lordo annuo        = 500.000 × 12                    = 6.000.000 cent  (60.000,00 €)
quota base         = min(6.000.000; 5.219.000)       = 5.219.000 × 919  = 4.796.261.000
quota eccedente    = 6.000.000 - 5.219.000 = 781.000 ×1019 =               795.839.000
contributi         = 5.592.100.000 / 10.000          =   559.210 cent  ( 5.592,10 €)
imponibile         = 6.000.000 - 559.210             = 5.440.790 cent  (54.407,90 €)
IRPEF 23% su 0..28.000      : 2.800.000 × 2300 =  6.440.000.000
IRPEF 33% su 28.000..50.000 : 2.200.000 × 3300 =  7.260.000.000
IRPEF 43% oltre 50.000      :   440.790 × 4300 =  1.895.397.000
IRPEF lorda        = 15.595.397.000 / 10.000 = 1.559.539,7 -> 1.559.540 cent (15.595,40 €)
netto annuo        = 6.000.000 - 559.210 - 1.559.540 = 3.881.250 cent  (38.812,50 €)
netto mensile      = 3.881.250 / 12 = 323.437,5      ->  323.438 cent  ( 3.234,38 €)
su 100 € lordi     = 3.881.250 × 10.000 / 6.000.000 = 6.468,75 -> 6.469 cent (64,69 €)
quota contributi   =   559.210 × 10.000 / 6.000.000 =   932,02 ->   932 bp  ( 9,32%)
quota IRPEF        = 1.559.540 × 10.000 / 6.000.000 = 2.599,23 -> 2.599 bp  (25,99%)
quota netto        = 10.000 - 932 - 2.599           = 6.469 bp           (64,69%)
quadratura         = 559.210 + 1.559.540 + 3.881.250 = 6.000.000  ✓ esatto
```

Il caso B esercita la terza porzione di scaglione, la quota eccedente dei
contributi e il mezzo centesimo esatto (`323.437,5 → 323.438`, verso l'alto).

> **Nota sull'aritmetica.** A differenza della `07` qui **non compare nessun
> numero a virgola mobile nel dominio**: non ci sono esponenziali, solo
> moltiplicazioni fra interi e divisioni per 10.000 arrotondate una volta. I
> prodotti più grandi restano molto sotto `Number.MAX_SAFE_INTEGER`: con il
> tetto del campo (10.000.000 cent al mese) il numeratore massimo dell'IRPEF
> resta intorno a 5·10¹¹.

### I motivi di rifiuto, come codici

Stesso schema della `07`: codici, non frasi. Le parole che legge una persona
stanno tutte in `src/ui/`, unico punto in cui il lessico viene scandito.

`lordo-non-leggibile` · `lordo-sotto-zero` · `lordo-a-zero` ·
`lordo-troppo-alto` · `mensilita-non-intere` · `mensilita-fuori-intervallo` ·
`scaglioni-non-validi` · `aliquote-contributive-non-valide`

Limiti del campo digitato, non dell'aritmetica: `MENSILITA_MIN = 12`,
`MENSILITA_MAX = 14`, `LORDO_MENSILE_MAX_CENT = 10_000_000` (100.000,00 € al
mese: oltre, la cifra è quasi sempre un errore di battitura). Gli ultimi due
codici coprono un fisco dichiarato male — scaglioni vuoti, soglie non crescenti,
aliquote negative — e servono perché il modulo delle fonti si riempie a mano.

## Output

Una schermata sola, un concetto solo: **dove finisce il lordo**.

| Elemento | Forma |
| --- | --- |
| **Il numero grande** | il netto mensile: «1.398,47 €». È il più grande della schermata |
| Il numero di appoggio | il netto annuo, «18.180,16 € in un anno», visibilmente più piccolo |
| Il paragone | «Su ogni 100 € scritti come lordo, 69,92 € arrivano sul tuo conto» |
| **La barra in tre pezzi** | contributi · imposta sul reddito · quello che resta. Ogni pezzo ha **accanto** la sua etichetta, la sua percentuale e il suo importo in euro |
| Da dove viene il numero | le aliquote usate e le soglie, **con la fonte e l'anno d'imposta scritti accanto** |
| Avvertenza | che cosa il calcolo non include, **a schermo e in chiaro**, non in una nota a piè di pagina |

La barra non è decorativa: è il modo in cui una sottrazione diventa una cosa che
si guarda. **Nessuna informazione disponibile solo al passaggio del mouse**: le
tre etichette e i tre importi sono scritti, sempre, anche su telefono e al
proiettore. Il rosa resta riservato ai limiti e alle esclusioni, come vuole la
regola di design: i tre pezzi della barra non lo usano.

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre tabulari,
unità accanto al valore, numeri allineati a destra dove stanno in colonna.

**Stringhe nuove in `src/ui/testi.ts`** — vanno in un file dedicato,
`src/ui/testiNetto.ts`, incorporato in `STRINGHE_UTENTE` con lo spread: il
registro scandito dal guardrail resta uno solo, e `testi.ts` non supera le 150
righe. Chiavi:

- intestazione — `nettoBustaOcchiello`, `nettoBustaTitolo`, `nettoBustaIntro`,
  `nettoBustaPasso`
- i due campi — `nettoBustaEtichettaLordo`, `nettoBustaAiutoLordo`,
  `nettoBustaEsempioLordo`, `nettoBustaEtichettaMensilita`,
  `nettoBustaAiutoMensilita`, `nettoBustaEsempioMensilita`
- il risultato — `nettoBustaVuoto`, `nettoBustaInSospeso`,
  `nettoBustaEtichettaValore`, `nettoBustaRisultatoMensile`,
  `nettoBustaRisultatoAnnuo`, `nettoBustaParagone`
- la barra — `nettoBustaBarraTitolo`, `nettoBustaQuotaContributi`,
  `nettoBustaQuotaIrpef`, `nettoBustaQuotaNetto`
- la provenienza — `nettoBustaAliquote`, `nettoBustaScaglioni`,
  `nettoBustaFonte`, `nettoBustaAnnoMancante`
- l'avvertenza — `nettoBustaAvvertenza`, `nettoBustaAvvertenzaDetrazioni`,
  `nettoBustaAvvertenzaTredicesima`
- gli errori — `nettoBustaErroreLordo`, `nettoBustaErroreLordoNegativo`,
  `nettoBustaErroreLordoZero`, `nettoBustaErroreLordoAlto`,
  `nettoBustaErroreMensilita`, `nettoBustaErroreMensilitaFuori`,
  `nettoBustaErroreFisco`, `nettoBustaNotaCentesimi`
- il confine — `nettoBustaLimitiTitolo`, `nettoBustaLimiteAzione`,
  `nettoBustaLimiteDati`, `nettoBustaLimiteContratto`

Due trappole lessicali da conoscere **prima** di scrivere queste frasi, non
dopo: `scegli` è vietato sia nei testi sia negli identificatori — il campo delle
mensilità si chiede con «quante buste paga ricevi in un anno», non con un
imperativo — e ogni parola tecnica va accompagnata **nella stessa frase** dal
suo esempio quotidiano. «Contributi» da solo non dice niente: «i soldi che ogni
mese vanno all'INPS e che un giorno diventeranno la tua pensione» sì.

**I quattro stati obbligatori**, non solo quello che funziona:

1. **Vuoto** — nessuna cifra ancora digitata: la schermata dice quali due cose
   servono e dove si leggono sulla busta, non «nessun risultato». La barra non
   compare vuota né a zero: al suo posto la frase che spiega che cosa mostrerà.
2. **In caricamento** — il calcolo è immediato e locale, quindi lo stato esiste
   ma non lampeggia: il riquadro del risultato e la barra occupano già il loro
   spazio, così il layout non salta quando i numeri arrivano.
3. **Errore** — in linguaggio umano: «Controlla questo numero, sembra troppo
   alto», mai «errore di validazione». Il numero grande non mostra mai una cifra
   calcolata su un dato che non va, e **quello già digitato nell'altro campo
   resta dov'è**.
4. **Dati lunghi o numerosi** — un lordo a sette cifre non deve rompere la
   griglia né mandare a capo il numero grande; le tre etichette della barra
   devono reggere l'andata a capo su schermo stretto senza sovrapporsi ai pezzi
   colorati, e senza che l'importo si stacchi dalla sua etichetta.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/nettoInBusta.test.ts`, con i valori
  attesi dei casi A e B calcolati a mano qui sopra, scritti nel commento accanto
  all'asserzione. Copre inoltre: la quadratura (contributi + IRPEF + netto =
  lordo annuo, esatta, in tutti i casi provati), un lordo che resta interamente
  nel primo scaglione, un lordo che supera la soglia dei contributi ma non il
  terzo scaglione, e il rifiuto di uno scaglione dichiarato male.
- **Test di accettazione** — `tests/accettazione/08-netto-in-busta.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice.
- **In demo, dieci secondi**: si digita 2.000, si digita 13, compare
  **1.398,47 €** come numero grande, e sotto la barra in tre pezzi con scritto
  accanto 9,19% ai contributi, 20,89% all'imposta, 69,92% che resta — cioè la
  riga «su ogni 100 € lordi, 69,92 arrivano sul tuo conto».

## Cosa questa funzionalità NON fa

- **Non dice a nessuno che cosa farne.** Niente su quanto chiedere di aumento,
  su come ridurre le trattenute, su quale inquadramento o quale regime. La
  schermata scompone una sottrazione e si ferma lì. È il confine più facile da
  sfondare qui, perché la domanda successiva — «e allora come faccio ad averne
  di più?» — è la ragione stessa per cui la persona è arrivata: la risposta non
  sta in questa schermata.
- **Non confronta «dipendente» e «partita IVA in regime forfettario»**, che pure
  il documento d'origine propone come variante. Due motivi, entrambi
  sufficienti. Il primo è di conformità: affiancare due regimi con un numero
  finale ciascuno è a un passo dall'indicarne uno, e il passo lo fa chi legge
  anche se il testo non lo scrive. Se un giorno rientrerà, dovrà essere una
  specifica sua, costruita come confronto affiancato senza indicare un'opzione —
  e con il coefficiente di redditività **digitato dalla persona**, mai fisso. Il
  secondo è di dato: servirebbero altre tre grandezze dichiarate (coefficiente,
  imposta sostitutiva, aliquota della Gestione Separata) e nessuna di esse è
  oggi verificata con il suo anno d'imposta.
- **Non è la busta paga vera, e lo dice a schermo.** Il calcolo **non include le
  detrazioni per lavoro dipendente né le addizionali regionali e comunali**, e
  le due omissioni tirano in direzioni opposte: le detrazioni alzerebbero il
  netto, le addizionali lo abbasserebbero. Per questo la cifra non va presentata
  come «il tuo netto» ma come «un netto calcolato così, con queste due cose
  lasciate fuori». Sta scritto accanto al risultato, in corpo leggibile, non in
  una nota a piè di pagina: dichiarare un limite in un carattere che nessuno
  legge equivale a non dichiararlo.
- **Non spalma correttamente la tredicesima.** Il netto mensile è il netto annuo
  diviso per le mensilità: nella busta vera il mese della tredicesima è tassato a
  parte e risulta diverso dagli altri. È una media, ed è scritto che è una media.
- **Non tratta i casi che non sono «lavoratore dipendente del settore privato»**:
  niente pubblico impiego, niente part-time con orario variabile, niente premi,
  straordinari, fringe benefit, bonus o trattenute personali. Ogni caso in più
  è un'aliquota in più senza fonte.
- **Non prende aliquote, scaglioni e soglie dalla rete**, né a runtime né in fase
  di build. Il documento d'origine indica Agenzia delle Entrate e INPS come
  fonti con aggiornamento annuale: le fonti restano quelle, ma i valori entrano
  nel codice come costanti dichiarate e si aggiornano a mano.
- **Non chiede e non conserva dati personali.** Le due cifre digitate restano
  nella pagina, non finiscono nell'indirizzo del browser e non vengono salvate
  da nessuna parte. Uno stipendio nell'hash resterebbe nella cronologia senza
  che nessuno l'abbia deciso.
- **Non legge un documento vero.** La busta paga non si carica: i due numeri si
  digitano. La lettura del documento è il perimetro del task `04`, che da qui
  è collegato ma non è questo.

---

## Dichiarazioni tecniche (compilate da `/spec`)

| | |
| --- | --- |
| **Contratti necessari** | **Nessuno.** I tipi dell'ingresso, dell'uscita e del fisco dichiarato nascono **dentro `src/core/`**, di proprietà di core-engine, come già per la `07`. In particolare **non si aggiunge un valore `'busta-paga'` a `Scenario`**: `Scenario` etichetta un `DocumentoUtente`, cioè un documento a voci, e qui non c'è nessun documento — due numeri digitati non sono una `LetturaCalcolata` |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. Irrilevante comunque: **questa funzionalità non modifica `types/`**, quindi non richiede l'architetto |
| **Agente incaricato** | **`01-core-engine`** (il calcolo e il modulo delle fonti, che è il cuore), con **`03-ui-builder`** per la schermata, la barra e le stringhe |
| **Directory toccate** | **3 — servono più agenti.** `src/core/` (`nettoInBusta.ts`, `fiscoDichiarato.ts`, `__tests__/nettoInBusta.test.ts`, `index.ts`), `src/ui/` (`PaginaNettoInBusta.tsx`, il componente della barra, `testiNetto.ts`, `testi.ts`, nuova rotta in `rotte.ts`, il foglio di stile della schermata), `tests/` (`accettazione/08-netto-in-busta.test.ts`). **`src/guardrails/`, `src/assessment/` e `types/` non si toccano** |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/08-simulatore-netto.png` con il caso 2.000 € × 13 mensilità, cioè lo stesso numero verificato a mano nel test: la slide mostra la cifra che il test dimostra |

### Pianificazione, da sapere prima di `/implementa`

L'impronta è **identica a quella della `07`** — `src/core/`, `src/ui/`, `tests/`
— e comprende `src/ui/`, che è anche l'impronta della `01`. Entrambe risultano
`fatto`, quindi oggi **non c'è conflitto aperto**. Resta vero in avanti: questo
task **non può girare in parallelo** con nessun altro che tocchi `src/ui/` o
`tests/`, a cominciare da `04` (guida alla busta paga) e dagli altri simulatori
`09` e `10`. La parte in `src/core/` non ha conflitti e può partire per prima.

Legame **non bloccante** con `13` (tabella delle fonti come sorgente unica):
`fiscoDichiarato.ts` è il secondo modulo di provenienza del progetto dopo
`inflazioneDichiarata.ts`, e insieme sono ciò che quella tabella dovrà leggere.
Il `13` non deve esistere perché questo parta.
