# 12 — «Questi nomi che sento dire: che cosa sono, in concreto»

> Stato: **proposta** · 2026-09-14 · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con
> «04-guardrail-officer» e «01-core-engine»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 6 «Approfondimento: gli Investimenti». Task di backlog: `12`.
>
> ## Riaperta su variante, dopo un rifiuto di conformità
>
> **La sezione 6 del documento d'origine è stata rifiutata da `/spec` il
> 2026-09-14**, criterio 1 (consiglia o raccomanda una scelta). Il motivo, in
> due righe: quella sezione dichiara da sé il proprio impianto — «prima il
> bisogno, poi lo strumento» — e lo svolge in quattro punti della forma
> `bisogno → strumento`; **accostare la situazione di chi legge a un prodotto
> finanziario è una raccomandazione personalizzata**, e non è una frase da
> limare, è l'ossatura. Il rifiuto è registrato in
> `docs/backlog/12-approfondimento-sugli-investimenti.md`.
>
> **Questa spec è scritta sulla variante, non sul documento d'origine.** La
> variante **inverte gli assi**: non «quale strumento per quale bisogno», ma
> «che cos'è ciascuno strumento», descritto su tre caratteristiche osservabili e
> identiche per tutti. L'accostamento fra la propria situazione e lo strumento
> lo fa chi legge; il sito fornisce le caratteristiche, non l'abbinamento.
>
> La via d'uscita non è stata inventata da noi: sta nell'ultima nota della
> sezione 6, scritta dall'autore del documento d'origine — «meglio un contenuto
> puramente informativo su rischio, orizzonte temporale e liquidità di ciascuno
> strumento».

### Che cosa è stato tolto, e che cosa lo sostituisce

La tabella serve a due lettori: chi riprende questa spec fra sei mesi e non
deve rimettere in discussione il perimetro, e chi valuta il progetto e vuole
vedere che sapevamo che cosa stavamo escludendo.

| Elemento del documento d'origine | Perché non passa | Che cosa lo sostituisce |
| --- | --- | --- |
| I quattro punti `bisogno → strumento` (fondo di emergenza → conto deposito; obiettivo a 2-5 anni → titoli di Stato; lungo periodo → azioni, fondi, ETF; pensione → fondi pensione) | Mappa la situazione personale su un prodotto: **l'abbinamento è la raccomandazione**, comunque sia formulata la frase | Una scheda per strumento, tre caratteristiche osservabili, **nessuna situazione personale nominata** |
| «La regola d'oro da ripetere sempre: diversificare — non mettere tutti i risparmi in un solo strumento» | È un imperativo, ed è quasi parola per parola la formulazione che `.claude/rules/scrittura-e-accessibilita.md` porta come esempio di ciò che il progetto **vieta** | Niente, non qui. Il meccanismo senza l'ordine — «chi mette tutti i risparmi in una sola azienda, se quella va male perde tutto insieme» — è conforme, ma è **un paragrafo di una pagina di spiegazione** (task `03`), non questa funzionalità |
| «Criptoattività: adatte al massimo a una quota molto piccola di risparmio» | È una quota di portafoglio, cioè un'allocazione: il grado più diretto di consulenza personalizzata | Le stesse tre caratteristiche delle altre schede, nella stessa forma e nello stesso ordine |
| «Da trattare con cautela, non da promuovere» come intestazione | «Con cautela» è un giudizio. Il fatto descritto basta | La descrizione del fatto. Nessuna intestazione che separi «i buoni» dai «da maneggiare» |
| «Rischio basso», «rischio più alto» | È un semaforo su un prodotto finanziario | «Quanto oscilla il valore», descritto **per come si osserva**: se la cifra cambia da un giorno all'altro, e di quanto |
| «Rendimento atteso più alto nel tempo per chi resta investito a lungo» | Promessa di un risultato futuro | Niente. Su questa pagina non compare **nessun** rendimento: né passato, né medio, né atteso |
| Un simulatore che proietti «quanto avrai se investi X» | Lo esclude il documento d'origine stesso, e ha ragione: una proiezione si legge come una promessa | Il traduttore del costo scritto sul KID: da percentuale a euro, sull'anno e sul mese. Costi, non rendimenti |
| — | — | **Il KID resta, ed è la parte migliore della sezione**: «è il bugiardino del farmaco, ma per i soldi». È esattamente lo schema del progetto — prima l'immagine concreta, poi il nome tecnico |

Le fonti indicate nel documento d'origine restano come riferimento dei
contenuti: Banca d'Italia («L'economia per tutti»), CONSOB (portale di
educazione finanziaria), COVIP (guida alla previdenza complementare).

## Per chi

Una persona alla quale sono stati detti tre o quattro nomi — «BTP», «ETF»,
«fondo pensione», «cripto» — in banca, alle poste, o da un parente al pranzo di
famiglia. Non sa nemmeno di che categoria di cose si stia parlando: se sono
contratti, prodotti, conti, o azioni da compiere. Non vuole diventare esperta:
vuole capire di che si parla e non sentirsi l'unica a non saperlo.

E la stessa persona quando le mettono davanti un foglio di poche pagine da
leggere prima di firmare, con dentro un numero da 1 a 7 e una tabella di costi,
e non sa che cosa siano quei riquadri.

## Quando serve

Due momenti precisi.

1. **Appena dopo aver sentito il nome**, quando chiedere «che cos'è?» costa un
   imbarazzo che molte persone preferiscono evitare. È il momento in cui questa
   pagina sostituisce una domanda che non verrà fatta.
2. **Con il foglio in mano, prima della firma.** È il momento in cui una
   percentuale scritta piccola diventa un numero di euro, oppure resta una
   percentuale scritta piccola.

## Cosa deve poter fare dopo

Dire, di ciascuno dei nomi che ha sentito, **tre cose osservabili**: quanto
tempo passa prima di riavere i soldi in mano, se la cifra cambia da un giorno
all'altro, e se può risultare più piccola di quella messa.

E, sul proprio foglio: tradurre in euro la percentuale di costo che c'è scritta.
Osservabile: sa dire «1,50% su 10.000 € sono **150 € l'anno**, cioè **12,50 € al
mese**, cioè **1,50 € su ogni 100 € messi**».

Quello che **non** deve poter fare dopo, e la pagina non le fornisce: dire quale
di quei nomi riguarda la sua situazione. Quella frase non esiste su nessuna
schermata di questa funzionalità.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `costoBp` | punti base, 1–2000 | **lo digita la persona**, leggendolo sul proprio foglio |
| `capitaleCent` | intero in centesimi | **lo digita la persona** |
| le tre caratteristiche di ogni strumento | testo | **contenuto dichiarato** in `src/ui/`, nessun dato di mercato |

**Questa funzionalità non ha bisogno di un solo dato vivo.** Non dipende dal
task `13`, e non è una comodità: è una proprietà di conformità. Una pagina che
descrive **che cos'è** uno strumento non ha bisogno di nessuna quotazione;
appena servisse un rendimento, un tasso o una media, vorrebbe dire che la pagina
ha smesso di descrivere e ha iniziato a confrontare.

Le due cifre che si digitano sono **numeri che stanno scritti sul foglio di chi
legge**, esattamente come i 10.000 € della `07`: non sono un dato di mercato e
non hanno bisogno di una fonte esterna. La fonte è il documento che la persona
ha in mano.

## Le sette schede, una per schermata

Un indice con sette voci e sette schermate. **La forma è identica per tutte e
sette**, e l'uniformità non è pigrizia: è il dispositivo di conformità. Se una
scheda avesse una riga in più, o un riquadro colorato, o una posizione
privilegiata, quella differenza verrebbe letta come un'indicazione — anche se
nessuna parola la scrivesse.

**L'ordine è alfabetico sul nome di tutti i giorni**, ed è dichiarato tale sulla
pagina dell'indice. Qualunque altro ordine — dal meno al più mosso, dal più al
meno liquido, dal più al meno diffuso — costruirebbe una scala, e una scala su
strumenti finanziari è una graduatoria. L'alfabeto non dice niente, ed è
esattamente ciò che serve.

### La forma di una scheda

| Riga | Contenuto |
| --- | --- |
| Occhiello | «Il futuro» — l'area di appartenenza |
| Titolo | **l'immagine concreta**, non il nome tecnico: «Un pezzetto di un'azienda», non «Azioni» |
| Due o tre frasi | che cos'è, in parole di tutti i giorni. **Il nome tecnico arriva in chiusura**: «si chiamano azioni» |
| Caratteristica 1 | **Quanto tempo passa prima di riavere i soldi in mano** |
| Caratteristica 2 | **Se la cifra cambia da un giorno all'altro** |
| Caratteristica 3 | **Se può tornare indietro meno di quanto è entrato** |
| Dove lo leggi per il caso tuo | quale documento dice queste tre cose sul prodotto specifico: il KID, il foglio informativo, la nota informativa |

Le tre caratteristiche sono **sempre queste tre, sempre in questo ordine, su
tutte e sette le schede**. È un requisito strutturale, non stilistico, e il test
di accettazione lo verifica.

### Le sette schede

1. **«Un pezzetto di un'azienda»** — *azioni*. Si rivendono nei giorni in cui i
   mercati sono aperti; il valore cambia ogni giorno di apertura, anche di
   diversi punti percentuali in una settimana; la cifra può risultare più
   piccola di quella messa, e nel caso estremo in cui l'azienda chiude può non
   restare niente.
2. **«I soldi tenuti in banca, liberi o fermi per un periodo concordato»** —
   *conto corrente e conto deposito*. Dal conto corrente si prendono in
   giornata; dal conto deposito vincolato alla scadenza concordata, e prima
   spesso rinunciando agli interessi maturati. La cifra scritta non cambia da un
   giorno all'altro. La cifra versata resta quella; **esiste inoltre un fondo
   pubblico che rimborsa i depositi entro un limite fissato per legge se la
   banca non è più in grado di restituirli**.
3. **«Monete che esistono solo su internet, senza una banca centrale dietro»** —
   *criptoattività*. Si rivendono in qualunque momento, sulle piattaforme che le
   scambiano; il valore cambia continuamente, anche di decine di punti
   percentuali in pochi giorni; la cifra può risultare molto più piccola di
   quella messa, e **non esiste nessun fondo pubblico come quello dei depositi
   in banca**. Tre righe, la stessa forma delle altre sei: il fatto descritto
   basta, il giudizio è di troppo.
4. **«Soldi messi direttamente in un progetto o in una piccola azienda»** —
   *crowdfunding*. Prima della scadenza del progetto in genere non si rientra,
   perché non esiste un mercato dove rivenderli; il valore non ha un prezzo
   giornaliero, quindi non «oscilla»: si sa com'è andata alla fine; la cifra può
   non tornare affatto se il progetto non arriva in fondo.
5. **«Un unico contenitore che dentro ha tante cose diverse»** — *fondi comuni e
   ETF*. Si rivendono nei giorni di mercato aperto, con tempi di qualche giorno
   per l'accredito; il valore del contenitore cambia insieme a quello delle cose
   che ha dentro; la cifra può risultare più piccola di quella messa.
6. **«Un salvadanaio che si apre quando si va in pensione»** — *fondo pensione e
   previdenza complementare*. I soldi si riprendono **al momento della
   pensione**, e prima solo nei casi che la legge elenca (spese sanitarie gravi,
   acquisto della prima casa, disoccupazione prolungata, e una quota parziale
   dopo un certo numero di anni); il valore cambia secondo la linea di
   investimento scelta nel contratto; la cifra può risultare più piccola o più
   grande di quella versata secondo quella stessa linea. Due fatti in più, che
   stanno scritti nel contratto e non sono automatici: **su quei versamenti si
   pagano meno tasse entro un limite annuo fissato per legge**, e **il contratto
   di lavoro può prevedere che il datore aggiunga una quota**.
7. **«Soldi prestati allo Stato o a un'azienda per un tempo deciso»** — *titoli
   di Stato e obbligazioni*. Alla scadenza si riprendono per intero; prima, solo
   rivendendoli a un prezzo che oggi non si conosce; il prezzo di rivendita
   cambia ogni giorno di mercato, mentre la cifra promessa alla scadenza no; la
   cifra torna intera alla scadenza **a condizione che chi l'ha presa in
   prestito sia in grado di restituirla**.

Ordine alfabetico sui nomi di tutti i giorni: *azioni · conto corrente e conto
deposito · criptoattività · crowdfunding · fondi comuni ed ETF · fondi pensione
· titoli di Stato e obbligazioni*.

**Nessun numero compare sulle sette schede.** Non per prudenza: perché qualunque
numero — un rendimento, una percentuale, un anno — su una scheda che descrive
uno strumento diventa immediatamente un termine di confronto con le altre sei, e
il confronto è la graduatoria che questa funzionalità esiste per non fare.

### La schermata del KID — «Il foglio che ti danno prima di firmare»

Il pezzo migliore della sezione d'origine, e l'unico con un numero.

> ✅ «Prima di firmare, per legge, ti devono dare un foglio di poche pagine che
> dice sempre le stesse cose nello stesso ordine, per qualunque prodotto di
> questo tipo: è il bugiardino del farmaco, ma per i soldi. Si chiama KID.»

La schermata spiega **che cosa misura ogni riquadro di quel foglio**:

| Riquadro del KID | Che cosa dice la pagina |
| --- | --- |
| «Di che prodotto si tratta» | chi lo emette e che cosa contiene |
| **Il numero da 1 a 7** | che cosa **misura**: quanto il valore si è mosso in passato, su una scala stabilita per legge e uguale per tutti i prodotti, così due fogli diversi si possono mettere accanto. La pagina **non dice se quel numero vada bene per chi legge** |
| **I costi** | quali costi esistono e dove sono scritti — e qui entra il traduttore: da percentuale a euro |
| «Per quanto tempo è pensato» | il periodo che il prodotto ha in mente, e che cosa succede a riprendere i soldi prima |
| «Cosa succede se chi lo emette non può pagare» | che cosa dice il foglio su questo, e dove lo dice |

**Il traduttore del costo**: due campi — la percentuale che c'è scritta sul
foglio e la cifra che si sta considerando — e un numero grande in euro. Con
1,50% e 10.000 €: **150,00 € l'anno**, e accanto **12,50 € al mese** e
**1,50 € su ogni 100 € messi**. Il conto si rifà a mano in due secondi, ed è
questo che lo rende diverso da una proiezione.

## Elaborazione

Tutto in `src/core/`, puro e deterministico. Tre passi, aritmetica intera, **un
solo arrotondamento per grandezza**.

1. **Il costo di un anno.** `costoAnnuoCent = round(capitaleCent × costoBp / 10_000)`.
   Prodotto fra interi, divisione per 10.000 una volta sola alla fine.
2. **Lo stesso costo al mese.** `costoMensileCent = round(costoAnnuoCent / 12)`.
   È l'unica divisione che può lasciare un resto: arrotondamento al centesimo
   più vicino, mezzo centesimo verso l'alto.
3. **Il paragone su 100 €.** `costoPerCentoEuroCent = round(10_000 × costoBp / 10_000)`,
   che per costruzione è **esattamente `costoBp`**. L'invariante va asserito nel
   test: i punti base sono, letteralmente, i centesimi su cento euro. Se i due
   numeri divergono, uno dei due passi è sbagliato.

Non c'è un passo 4. Non si moltiplica per dieci anni, non si capitalizza, non si
sottrae il costo da un rendimento che non esiste.

### Verifica a mano, da riportare nel commento del test

Con `capitaleCent = 1_000_000` (10.000,00 €) e `costoBp = 150` (1,50%):

```
costo annuo      = 1.000.000 × 150 / 10.000
                 = 150.000.000 / 10.000        = 15.000 cent  (150,00 €)
costo mensile    = 15.000 / 12 = 1.250 esatto  =  1.250 cent  ( 12,50 €)
su 100 €         = 10.000 × 150 / 10.000       =    150 cent  (  1,50 €)
controllo: 150 cent su 100 € = 1,50% = 150 bp  ✓ coincide con costoBp
```

> **Nota sull'aritmetica.** Nessun numero a virgola mobile nel dominio: solo
> prodotti fra interi e divisioni arrotondate una volta. Con il tetto del campo
> (`capitaleCent` massimo 100.000.000, cioè 1.000.000,00 €, e `costoBp` massimo
> 2000) il prodotto più grande resta intorno a 2·10¹¹, molto sotto
> `Number.MAX_SAFE_INTEGER`.

### I motivi di rifiuto, come codici

Codici, non frasi: le parole che legge una persona stanno tutte in `src/ui/`.

`costo-non-leggibile` · `costo-a-zero` · `costo-troppo-alto` ·
`capitale-non-leggibile` · `capitale-a-zero` · `capitale-troppo-alto`

Limiti del campo digitato, non dell'aritmetica: `COSTO_MIN_BP = 1` (0,01%),
`COSTO_MAX_BP = 2000` (20,00%: oltre, è quasi sempre un errore di lettura o una
virgola sbagliata), `CAPITALE_MAX_CENT = 100_000_000`. La percentuale si accetta
scritta come la scriverebbe una persona — `1,5` e `1,50` danno entrambe 150 bp —
perché sul foglio è scritta in italiano, con la virgola.

## Output

Un indice, sette schede, una schermata del KID. **Un concetto per schermata**, e
il percorso dalla domanda alla risposta è di due tap: indice → scheda.

| Elemento | Forma |
| --- | --- |
| **L'indice** | i sette nomi di tutti i giorni, in ordine alfabetico, con la riga che dichiara l'ordine: «in ordine alfabetico» scritto, non sottinteso. Bersagli da almeno 44×44 px |
| **Le sette schede** | forma identica: occhiello, titolo-immagine, due o tre frasi, le tre caratteristiche nello stesso ordine, «dove lo leggi per il caso tuo» |
| **Il KID** | i cinque riquadri spiegati, più il traduttore del costo |
| **Il numero grande** (solo KID) | il costo di un anno in euro: «150,00 €». È il più grande della schermata |
| I due numeri di appoggio | il costo mensile e il costo su 100 €, visibilmente più piccoli |
| **Navigazione** | «indietro», «elenco dei sette» e «pagina iniziale» sempre nello stesso punto, su tutte le schermate |

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre tabulari,
unità accanto al valore. **Nessun semaforo, nessun colore di stato sulle
schede**: il verde/giallo/rosso del progetto serve a dire a una persona come sta
il suo numero, non a giudicare un prodotto. Il rosa resta riservato ai limiti e
alle esclusioni del prodotto — sulla pagina dei limiti, non sulle schede.

**Rotte nuove in `src/ui/rotte.ts`**: `#/strumenti` per l'indice,
`#/strumenti/<id>` per le sette schede, `#/foglio-prima-della-firma` per il KID.
Via hash, come tutto il resto. **Nessuna delle due cifre digitate finisce
nell'indirizzo**: la somma che una persona sta considerando resterebbe nella
cronologia del browser senza che nessuno l'abbia deciso.

**Stringhe nuove**: due file affiancati, entrambi incorporati in
`STRINGHE_UTENTE` con lo spread, perché sette schede non stanno in 150 righe e
il registro scandito dal guardrail deve restare **un oggetto solo**.

- `src/ui/testiStrumenti.ts` — indice e sette schede
- `src/ui/testiKid.ts` — la schermata del foglio e il traduttore

Chiavi: `strumentiIndiceTitolo`, `strumentiIndiceIntro`, `strumentiOrdineNota`;
poi per ciascuna delle sette, con `NN` da `01` a `07`:
`strumentoNNOcchiello`, `strumentoNNTitolo`, `strumentoNNSpiegazione`,
`strumentoNNNomeTecnico`, `strumentoNNTempoPerRiavere`,
`strumentoNNQuantoOscilla`, `strumentoNNCifraPuoScendere`,
`strumentoNNDoveLoLeggi`. Per il KID: `kidOcchiello`, `kidTitolo`, `kidIntro`,
`kidRiquadroProdotto`, `kidRiquadroIndicatore`, `kidRiquadroCosti`,
`kidRiquadroTempo`, `kidRiquadroInsolvenza`, `kidEtichettaCosto`,
`kidAiutoCosto`, `kidEsempioCosto`, `kidEtichettaCapitale`,
`kidAiutoCapitale`, `kidEsempioCapitale`, `kidVuoto`, `kidRisultatoAnnuo`,
`kidRisultatoMensile`, `kidParagone`, `kidErroreCosto`, `kidErroreCostoAlto`,
`kidErroreCapitale`, `kidLimitiTitolo`, `kidLimiteNessunAbbinamento`,
`kidLimiteNessunRendimento`.

### Le trappole lessicali, da conoscere prima di scrivere — non dopo

Questa è la pagina del progetto con il rischio di parole più alto, e il lessico
automatico **oggi non la copre**. Tre fatti verificati sul lessico reale in
`src/guardrails/lessico.ts`:

- la radice `investi` è vietata, ma **`investimenti` non viene intercettato**:
  la regex ha un confine di parola dopo `investi`, e la `m` lo rompe. Quindi
  «linea di investimento» passa la scansione — ed è corretto che passi, perché è
  descrittivo — ma la stessa disattenzione su una frase prescrittiva passerebbe
  allo stesso modo;
- `garantit*` è in lessico con gravità `attenzione`. Per questo la terza
  caratteristica **non si chiama «capitale garantito»**: si chiama «se può
  tornare indietro meno di quanto è entrato». La riformulazione non è un
  aggiramento del guardrail, è una frase migliore: «garantito» è un termine
  tecnico isolato, e la regola del progetto vieta i termini tecnici isolati;
- nessuna delle formulazioni rifiutate della sezione 6 — «rischio basso»,
  «rendimento atteso più alto», «adatte al massimo a una quota molto piccola»,
  la regola sul non concentrare i risparmi — viene bloccata dal lessico di oggi.

**Da qui la richiesta a `04-guardrail-officer`, che è parte di questa
funzionalità e non un seguito**: aggiungere al lessico le radici che coprono la
raccomandazione scritta in terza persona, ognuna con la sua riformulazione
ammessa. Proposta di partenza:

| Radice | Perché | Riformulazione ammessa |
| --- | --- | --- |
| `rischio\s(basso\|alto\|medio\|contenuto\|elevato)` | semaforo su un prodotto | descrivere l'oscillazione osservata: «il valore cambia ogni giorno di mercato» |
| `rendiment\p{L}*\s(atteso\|medio\|storico)` | promessa o proiezione di risultato | rimuovere: la pagina non riporta rendimenti |
| `quota\s(piccola\|minima\|molto\spiccola)` | allocazione di portafoglio | rimuovere: il prodotto non indica quote |
| `regola\sd'oro` | massima prescrittiva | descrivere il meccanismo senza l'imperativo |
| `con\scautela\|da\smaneggiare` | giudizio su uno strumento | rimuovere: il fatto descritto basta |
| `prima\sil\sbisogno` | l'impianto stesso del rifiuto | rimuovere: gli assi sono invertiti |

Senza queste radici, la stessa frase rifiutata oggi può rientrare domani e
nessun cancello la ferma: **il rifiuto resta una decisione, invece di diventare
un vincolo eseguibile.** È la differenza fra un progetto che ha detto no una
volta e un progetto che continua a dirlo.

### I quattro stati obbligatori

1. **Vuoto** — la schermata del KID prima di digitare: dice **quali due cose
   servono e dove si leggono sul foglio**, non «nessun risultato» e non uno
   zero. Le sette schede non hanno uno stato vuoto: sono contenuto, esistono
   sempre.
2. **In caricamento** — tutto locale e immediato. Il riquadro del risultato
   occupa già il suo spazio da vuoto, così il layout non salta quando il numero
   arriva.
3. **Errore** — in linguaggio umano: «Controlla questa percentuale, sembra
   troppo alta», mai «errore di validazione». Il numero grande non mostra mai
   una cifra calcolata su un dato che non va, e **quello già digitato nell'altro
   campo resta dov'è**: correggere un campo non deve costare ricominciare.
4. **Dati lunghi o numerosi** — un capitale a sette cifre e un costo del 20,00%;
   i titoli-immagine delle schede, che sono frasi e non parole, vanno a capo su
   due o tre righe a 375 px; le tre caratteristiche si impilano e **non
   diventano mai tre colonne su un telefono**.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/costoDelProdotto.test.ts`, con i
  valori calcolati a mano qui sopra nel commento accanto all'asserzione: 15.000
  cent, 1.250 cent, 150 cent, più l'invariante «centesimi su cento euro = punti
  base». Copre i confini del campo: `costoBp = 1`, `costoBp = 2000`, e il
  rifiuto di `0` e di `2001`.
- **Test di accettazione** — `tests/accettazione/12-strumenti-e-kid.test.ts`,
  scritto dal `tester` dalla specifica. Quattro casi che rendono **eseguibile la
  variante** invece di lasciarla a una rilettura:
  1. **struttura identica**: tutte e sette le schede hanno le stesse tre
     caratteristiche, nello stesso ordine, e nessuna ha una riga in più;
  2. **nessun numero sulle schede**: nessuna delle stringhe delle sette schede
     contiene una cifra o un simbolo di percentuale;
  3. **nessun abbinamento con una situazione personale**: nessuna stringa
     contiene `se ti serv`, `se hai bisogno`, `per chi vuole`, `adatt`,
     `rischio basso`, `rendimento atteso`, `quota`, `regola d'oro`, `cautela`;
  4. **ordine alfabetico**: l'elenco dell'indice coincide con l'ordinamento
     alfabetico dei sette nomi, così nessuno può riordinarlo «per comodità»
     senza far diventare rosso un test.
- **Test del lessico dedicato** — `tests/lessico-strumenti-e-kid.test.ts`,
  scritto da `guardrail-officer` sul modello di
  `tests/lessico-simulazione-risparmio.test.ts`: scandisce le stringhe nuove
  contro il lessico **esteso** con le radici della tabella qui sopra.
- **In demo, dieci secondi**: si apre il foglio, si digita 1,50 e 10.000,
  compare **150,00 € l'anno** con accanto 12,50 € al mese e 1,50 € su ogni
  100 €. Poi si aprono due schede di seguito — le azioni e le criptoattività —
  per mostrare che hanno **la stessa forma, le stesse tre righe, nessun semaforo
  e nessun giudizio**: è la variante che si vede a occhio, in cinque secondi.

## Cosa questa funzionalità NON fa

È la sezione che spiega il rifiuto e la riapertura: qui i confini sono la
funzionalità.

- **Non accosta nessuno strumento a nessuna situazione personale.** Non esiste
  nessuna frase della forma «se ti servono fra sei mesi, allora…», né la sua
  versione impersonale «chi ha bisogno dei soldi a breve usa…». L'accostamento
  lo fa chi legge. È il motivo esatto per cui la richiesta d'origine è stata
  rifiutata: se l'abbinamento rientra, rientra la raccomandazione, qualunque sia
  la grammatica con cui è scritto.
- **Non ordina, non gradua, non mette semafori sugli strumenti.** L'ordine è
  alfabetico e dichiarato tale sulla pagina: qualunque altro ordine costruirebbe
  una scala. Il verde/giallo/rosso del progetto resta per i numeri di chi legge.
- **Non affianca gli strumenti in una tabella di confronto.** Una tabella
  ordina, e ordinare è graduare; e sette strumenti per tre caratteristiche in
  una schermata violano «un concetto per schermata». Le schede si guardano una
  per volta, ed è anche il motivo per cui hanno tutte la stessa forma: il
  confronto, se chi legge lo vuole fare, lo fa nella sua testa con due schermate
  uguali, non in una griglia che gliel'ha già fatto.
- **Nessuna percentuale di allocazione**, nessuna «quota piccola», nessuna
  regola d'oro, nessun «da trattare con cautela». Le criptoattività hanno le
  stesse tre righe delle altre sei: valore che cambia continuamente, nessun
  fondo pubblico come quello dei depositi. Il fatto descritto basta.
- **Nessun rendimento: né passato, né medio, né atteso.** Non compare un numero
  che dica quanto uno strumento ha reso o potrebbe rendere. Non è prudenza
  legale: un rendimento accanto a sette schede uguali è l'unica riga che
  trasformerebbe l'elenco in una classifica.
- **Nessun simulatore che proietta quanto si avrà.** Lo esclude il documento
  d'origine stesso, e la ragione è giusta: una proiezione, anche dichiarata
  educativa, si legge come una promessa.
- **Il traduttore del costo non è un simulatore di rendimento**, e i suoi
  confini sono tre: prende una percentuale che **sta scritta sul foglio di chi
  legge**, non un dato di mercato; si ferma all'anno e al mese e **non moltiplica
  per dieci anni**, perché un costo decennale invita al confronto con un
  rendimento che qui non c'è; non accetta il nome di un prodotto e non confronta
  due fogli.
- **Non spiega la diversificazione.** La formulazione delle regole del progetto
  — «chi mette tutti i risparmi in una sola azienda, se quella va male, perde
  tutto insieme» — è conforme, ma è **un paragrafo di una pagina di
  spiegazione** (task `03`). Tenerla qui la rimetterebbe accanto alle sette
  schede, ed è lì che torna a somigliare a una regola da seguire: subito dopo
  aver letto che cosa sono gli strumenti, «non metterli tutti in uno» è un
  ordine, non un meccanismo.
- **Non valuta l'indicatore da 1 a 7 del KID.** Spiega che cosa misura e su
  quale scala. Non dice se quel numero vada bene per chi legge, e non lo
  traduce in «prudente» o «aggressivo»: sarebbe profilare chi legge partendo da
  un numero stampato su un foglio.
- **Non dice se firmare, quando, o a chi rivolgersi.**
- **Non nomina prodotti, emittenti, banche o piattaforme.** Nessun nome
  proprio: una scheda con un nome proprio dentro è una vetrina.
- **Non profila.** Non chiede età, reddito, patrimonio, obiettivi, «orizzonte
  temporale», tolleranza al rischio. Non esiste nessun questionario: profilare è
  esattamente ciò che la voce `adatto-a-te` del lessico vieta, e un questionario
  che finisce in una scheda è la sezione 6 riscritta con un'interfaccia.
- **Non prende un solo dato dalla rete, e non ne ha bisogno.** Le tre
  caratteristiche sono descrizioni, non quotazioni; le due cifre sono di chi
  legge.
- **Non chiede e non conserva dati personali.** Le due cifre restano nella
  pagina, non finiscono nell'indirizzo del browser, non vengono salvate.
- **Non è consulenza e non ne fa le veci.** Non guarda la situazione di nessuno.
  Chi cerca quel servizio lo trova altrove: questa pagina serve a non arrivarci
  senza sapere che cosa significano le parole.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **Nessuno.** I tipi dell'ingresso e dell'uscita del traduttore del costo nascono **dentro `src/core/`**, di proprietà di `01-core-engine`; l'elenco delle sette schede e le loro tre caratteristiche sono **contenuto**, quindi vivono in `src/ui/`, di proprietà di `03-ui-builder`. Nessun valore nuovo in `Scenario`: due cifre digitate non sono un `DocumentoUtente`. Se un giorno servisse un tipo condiviso, **la modifica di `types/contracts.ts` è dell'architetto**, non dell'agente incaricato |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root, quindi i contratti si potrebbero ancora estendere. Irrilevante qui: **questa funzionalità non scrive in `types/`**, e non lo farebbe nemmeno potendo |
| **Agente incaricato** | **`03-ui-builder`** — sette schede, il foglio, tutte le parole: su questa funzionalità il lavoro *è* il testo. Con **`04-guardrail-officer`**, che qui **non è l'ultimo passo ma uno dei primi**: le radici nuove del lessico e il test dedicato vanno scritti **prima** delle stringhe, non dopo, perché riscrivere un testo costa più che pensarlo. E **`01-core-engine`** per l'unica moltiplicazione e il suo test |
| **Directory toccate** | **4 — servono tre agenti.** `src/ui/` (indice, sette schede, schermata del foglio, `testiStrumenti.ts`, `testiKid.ts`, `testi.ts`, rotte in `rotte.ts`, foglio di stile), `src/guardrails/` (`lessico.ts`: **solo voci nuove**, nessuna riscritta), `src/core/` (`costoDelProdotto.ts`, `__tests__/costoDelProdotto.test.ts`, `index.ts`), `tests/` (`accettazione/12-strumenti-e-kid.test.ts`, `lessico-strumenti-e-kid.test.ts`). `types/`, `fixtures/` e `src/assessment/` non si toccano |
| **dipende-da** | `03` (pagina di spiegazione, struttura riusabile) — le sette schede sono sette istanze di quella struttura, non sette pagine scritte a mano. **Non dipende dal `13`**: non usa un solo dato vivo, e la ragione è di conformità, non di comodità — vedi «Input». Nessuna dipendenza dal `07`, dall'`08` o dal `10` |
| **Evidenza prodotta per il deck** | **Due cose, e la prima conta più della seconda.** 1) `../presentation/evidence/12-conformita.json`, prodotto da **`06-evidence-collector`**: richiesta originale, criterio violato, la tabella «che cosa è stato tolto e che cosa lo sostituisce» di questa spec, le radici aggiunte al lessico, e la data. Entra in `Evidence.extra`, che **esiste già** in `types/contracts.ts`: nessun campo nuovo, nessuna modifica ai contratti. 2) screenshot `../presentation/screenshots/12-foglio-prima-della-firma.png` (caso 1,50% su 10.000 €, lo stesso numero verificato a mano nel test) e `12-due-schede-uguali.png` (due schede affiancate, a mostrare la forma identica e l'assenza di semafori). **Su questa funzionalità l'evidenza più forte non è la schermata: è il cancello che ha funzionato dove il lessico automatico non arrivava.** `presentation/evidence/` è di `06-evidence-collector`, che lancia dalla root: è fuori dal perimetro di `03-ui-builder` e va chiesto, non scritto di straforo |

### Pianificazione, da sapere prima di `/implementa`

Ordine non negoziabile **dentro** il task: prima `src/guardrails/` (le radici),
poi `src/ui/` (le stringhe). Scrivere quarantacinque stringhe e poi scoprire che
il lessico esteso ne blocca sei è il modo più caro di arrivare allo stesso
posto.

L'impronta comprende `src/ui/` e `tests/`: **questo task non può girare in
parallelo** con `04`, `08`, `10` o `11`. `src/guardrails/` invece è libero —
nessun altro task aperto lo tocca — quindi la parte del lessico può partire
subito e in parallelo a qualunque cosa, ed è anche la parte che serve prima.

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
