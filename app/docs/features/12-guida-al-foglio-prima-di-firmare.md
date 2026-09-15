# 12 — «Il foglio che ti danno prima di firmare»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «01-core-engine»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 6 «Approfondimento: gli Investimenti». Task di backlog: `12`.
>
> ## Questa spec nasce da un rifiuto, e ne porta il perimetro
>
> Il task `12` nella sua forma d'origine è stato **rifiutato** da `/spec` il
> 2026-09-14, criterio 1. Il motivo è scritto per esteso in
> `docs/backlog/12-approfondimento-sugli-investimenti.md` e **resta valido**: la
> sezione 6 dichiara l'impianto «prima il bisogno, poi lo strumento» e lo
> svolge in quattro punti `Bisogno → Strumento`. Dire a una persona quale
> strumento corrisponde al suo bisogno **è** dirle quale scegliere.
>
> Questa spec copre **la variante conforme**, approvata: non l'approfondimento,
> ma **una guida a un documento che la persona ha già in mano**. Il numero `12`
> resta perché lega task, branch, commit e `agents:trace`; lo slug cambia
> perché la funzionalità è un'altra.
>
> **Cambia famiglia.** Non sta più con `11` (approfondimento sul mutuo): sta con
> `04` (busta paga), `05` (bolletta), `06` (730). È l'unica forma in cui il task
> rientra nella promessa del prodotto — «far capire il documento che si ha in
> mano».
>
> ## La sezione da leggere per prima è «Cosa questa funzionalità NON fa»
>
> Su questo argomento **il controllo automatico non protegge**. È stato
> verificato che dodici frasi prese alla lettera dalla sezione 6 passano tutte
> `src/guardrails/lessico.ts` senza essere bloccate: le radici vietate coprono
> l'imperativo diretto (`investi`, `compra`, `dovresti`, `adatto a te`), non la
> stessa raccomandazione scritta in terza persona. Il cancello qui è questa
> spec, e dentro questa spec è quella sezione. È stata scritta per prima.

## Per chi

Una persona a cui, allo sportello o in un ufficio, hanno appena messo davanti
una pila di fogli da firmare. Fra quelli ce n'è uno di poche pagine, fitto, con
dei riquadri e una riga di sette numeri. Non l'ha chiesto: glielo devono dare
per legge. Non sa che cos'è, non sa se serve a lei o all'ufficio, e non sa
quale parte guardare.

Non è una persona che si informa per curiosità: è una persona con una penna in
mano e qualcuno seduto davanti che aspetta.

## Quando serve

**Prima della firma, non dopo** — nel momento in cui il foglio è già sul tavolo
e nessuno l'ha spiegato. Oppure la sera, a casa, con la copia in mano e la
domanda «che cosa ho firmato».

È il momento di massima fretta e di massima soggezione del percorso: qualunque
cosa questa pagina chieda di capire deve entrare in pochi secondi, o la persona
firma lo stesso senza aver letto.

## Cosa deve poter fare dopo

Due cose osservabili, non un sentimento:

1. **Indicare sul proprio foglio dove sta la percentuale dei costi** — il
   riquadro, la riga, il numero con la virgola.
2. **Dire in euro quanto vale quella percentuale sui propri soldi**: «1,50% sui
   miei 10.000 € sono 150 € l'anno, cioè 12,50 € al mese».

Prima aveva una percentuale che non le diceva niente, dopo ha una cifra in euro
che può confrontare con qualunque altra spesa di casa. O sa dire quel numero, o
non lo sa dire: si verifica in dieci secondi.

## Input

Nessuna fixture, nessun documento strutturato, **nessun dato dalla rete**. Il
foglio è quello che la persona ha in mano; la pagina è la legenda.

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `costoAnnuoBp` | punti base, intero | **lo digita la persona**, leggendolo sul proprio foglio |
| `capitaleCent` | intero in centesimi | **lo digita la persona** |

È la stessa scelta della `07`: i due numeri li porta la persona, e il prodotto
non ne conosce nessuno. Qui è ancora più netto che nella `07`, dove almeno il
tasso è una costante dichiarata: **questa funzionalità non ha nessuna costante
di dominio, nessun dato vivo, nessuna riga da aggiornare quando i mercati si
muovono.** Non compare nella tabella delle fonti della `13` perché non ha
niente da dichiararle.

### Il facsimile non ha numeri, ed è una scelta

Le tre guide-documento (`04`, `05`, `06`) mostrano un facsimile **con gli
importi dentro**, perché lì il numero è il punto. Qui no: il facsimile mostra i
riquadri **vuoti**, con le etichette originali e il posto in cui il numero sta
sul foglio vero.

Tre motivi, in ordine di peso:

1. **Un indicatore di rischio riempito è un giudizio su un prodotto.** Se il
   facsimile mostrasse «4 su 7», quel 4 verrebbe letto come il valore tipico, o
   peggio come il valore accettabile. La riga viene mostrata **intera, tutti e
   sette i numeri, nessuno segnato**: la persona guarda quale è segnato **sul
   proprio**. Il divieto di semaforo su uno strumento è così rispettato dalla
   forma, non dalla diligenza di chi scrive.
2. **Una percentuale di costo inventata diventerebbe un metro.** «1,50% come
   nell'esempio» è a un passo da «1,50% è normale», che è un giudizio che
   nessuno qui può dare. Il solo numero che compare nell'esempio lavorato è
   dichiarato come tale e serve a mostrare l'aritmetica, non a fissare un
   riferimento.
3. **È più fedele alla promessa.** «Il foglio che **ti** danno» significa che il
   foglio vero è il suo. Un facsimile pieno inviterebbe a leggere il nostro
   invece del proprio.

## Elaborazione

Tutto in `src/core/`, puro e deterministico. Un solo calcolo, e sta in piedi da
solo: **una percentuale letta su un foglio, tradotta in euro.**

`traduciCostoInEuro({ capitaleCent, costoAnnuoBp })` → `Esito<RisultatoCostoFoglio, MotivoRifiutoCosto>`,
nella stessa forma di `calcolaSimulazioneRisparmio` della `07`.

1. **La percentuale digitata diventa punti base.** Il campo è testo — `1,50`,
   con la virgola italiana — e passa da `parseNumeroIt`, già nel core. Poi
   `costoAnnuoBp = Math.round(valore * 100)`. **L'arrotondamento qui non è
   pignoleria**: `2,30` in virgola mobile binaria vale `2.2999999999999998`, e
   `2.3 * 100` dà `229.99999999999997`. Senza quel `Math.round` il dominio
   riceverebbe 229 bp invece di 230, cioè un centesimo sbagliato su ogni
   migliaio di euro.
2. **Rifiuto, prima di ogni conto.** `costoAnnuoBp` fuori da `0 … 1000`
   (0 % … 10,00 %) → `'costo-fuori-intervallo'`. `capitaleCent` maggiore di
   `RISPARMIO_MAX_CENT` → `'somma-troppo-alta'`; minore o uguale a zero →
   `'somma-mancante'`. La costante è **quella già esportata dalla `07`**, non
   una nuova: due schermate dello stesso sito che non vanno d'accordo su dove
   comincia «troppo alto» sono due schermate che si contraddicono.
3. **Il costo di un anno** — `costoAnnuoCent = Math.round(capitaleCent * costoAnnuoBp / 10_000)`.
   È **il numero grande della schermata**, ed è l'unico che compare senza aver
   subito una seconda approssimazione.
4. **Il costo di un mese** — `costoMensileCent = Math.round(costoAnnuoCent / 12)`.
   Si ricava **dall'anno**, non di nuovo dal capitale: il mese che compare a
   schermo dev'essere il dodicesimo dell'anno che compare a schermo, altrimenti
   chi rifà il conto sui due numeri stampati non si ritrova.
5. **Il paragone su 100 €** — `costoPerCentoEuroCent = Math.round(10_000 * costoAnnuoBp / 10_000)`,
   che è **esattamente `costoAnnuoBp`**. Su 100 € il costo in centesimi
   coincide con la cifra in punti base: `150 bp → 150 cent → 1,50 €`. Il
   paragone non è un secondo calcolo che potrebbe non tornare, **è la
   percentuale stessa letta come una banconota**. Stessa proprietà che la `03`
   sfrutta per il suo esempio su 100 €.

### Verifica a mano, da riportare nei commenti del test

**Caso di riferimento** — quello della demo e dello screenshot:

```
capitaleCent    = 1.000.000            (10.000,00 €)
costoAnnuoBp    =       150            (1,50%)

un anno   1.000.000 x 150 / 10.000 = 15.000 cent        (150,00 €)
un mese          15.000 / 12       =  1.250 esatti      ( 12,50 €)
controllo         1.250 x 12       = 15.000  -> ricompone l'anno
su 100 €     10.000 x 150 / 10.000 =    150 cent        (  1,50 €)
             cioe' esattamente i punti base: 150 bp -> 150 cent
```

**Caso con il resto** — serve a bloccare l'arrotondamento, ed è il caso che
dice la verità sul mese:

```
capitaleCent    =   350.000            (3.500,00 €)
costoAnnuoBp    =       230            (2,30%)

un anno     350.000 x 230 / 10.000 =  8.050 cent        ( 80,50 €)
un mese           8.050 / 12       =    670,83... -> 671 cent ( 6,71 €)
controllo           671 x 12       =  8.052, cioe' 2 cent PIU' dell'anno
su 100 €     10.000 x 230 / 10.000 =    230 cent        (  2,30 €)
```

> **Conseguenza che la schermata deve rispettare, non nascondere.** Dodici volte
> il costo di un mese **non ricompone sempre** il costo di un anno: qui sono due
> centesimi in più. Per questo il numero grande è **l'anno**, che è esatto, e il
> mese gli sta accanto dichiarato per quello che è — l'anno diviso dodici,
> arrotondato al centesimo. La schermata non scrive mai «12 × 6,71 € = 80,50 €»,
> perché non è vero.

**Caso zero** — `costoAnnuoBp = 0` dà `0` ovunque. `0,00 €` è un risultato
legittimo e va mostrato, con la riga che chiarisce che lo zero riguarda **quella
riga di costo**, non il foglio intero: sul foglio le righe di costo sono più di
una.

## Output

Una schermata sola, un concetto solo: **la percentuale scritta sul foglio, in
euro.** Il facsimile è la mappa per trovarla, il calcolo è la risposta.

### La struttura, dall'alto in basso

| # | Blocco | Che cosa contiene |
| --- | --- | --- |
| 1 | **Occhiello** | l'area da cui si arriva, maiuscolo spaziato |
| 2 | **La domanda, come titolo** | «Che cos'è il foglio che mi danno da firmare?» |
| 3 | **L'immagine mentale, poi il nome** | il bugiardino del farmaco, **poi** la parola KID. Mai il contrario |
| 4 | **Il facsimile a riquadri** | le intestazioni del foglio **nell'ordine di legge**, tre apribili |
| 5 | **Il traduttore da percentuale a euro** | due campi, e il numero grande |
| 6 | **Da dove viene** | la norma che impone il foglio, senza rete |
| 7 | **Che cosa questa pagina non fa** | in rosa `#FF50A0`, in fondo, sempre nello stesso punto |

### Il facsimile

Le intestazioni **così come sono scritte sul documento**, nell'ordine che la
legge fissa — ed è proprio quell'ordine la prima cosa utile che la pagina
consegna: chi ne ha letto uno sa già dove guardare sul prossimo.

| Riquadro | Apribile | Perché |
| --- | --- | --- |
| `Cos'è questo prodotto?` | no | intestazione, per far vedere l'ordine |
| `Quali sono i rischi e qual è il potenziale rendimento?` | **sì** | è la riga dei sette numeri |
| `Cosa accade se non siamo in grado di corrispondervi quanto dovuto?` | no | intestazione |
| `Quali sono i costi?` | **sì** | è la riga che il traduttore usa |
| `Per quanto tempo devo detenerlo? Posso ritirare il capitale prematuramente?` | **sì** | è il tempo di cui parla il titolo |
| `Come presentare reclami?` | no | intestazione |

Le etichette **non si riscrivono**: `Costi di gestione e altri costi
amministrativi o di esercizio` resta scritto così anche se è lungo e ostico.
Chi confronta lo schermo con la carta deve ritrovare la riga identica —
altrimenti il foglio vero diventa meno leggibile di prima, non più. È lo stesso
vincolo della `05`.

Dentro il riquadro dei rischi, **la riga dei sette numeri per intero, da 1 a 7,
nessuno segnato e nessuno colorato.** Nessun verde, nessun giallo, nessun rosso:
è l'unico punto del sito in cui il semaforo — che
`scrittura-e-accessibilita.md` raccomanda come forma — **è vietato**, perché un
semaforo su uno strumento finanziario è un giudizio. La deroga è dichiarata qui,
non lasciata all'intuito di chi implementa.

### La meccanica della riga apribile

**Non è ridichiarata qui.** È definita per intero nella `04`
(`docs/features/04-guida-interattiva-busta-paga.md`, sezioni «Output» e
«Accessibilità») e questa spec la riusa: clic o tocco, mai solo hover,
`<button>` vero con `aria-expanded` e `aria-controls`, focus visibile, bersaglio
da almeno 44×44 px, nessun gesto obbligatorio, nessun limite di tempo, nessuna
icona senza la sua parola.

> **Differenza da dichiarare prima di `/implementa`.** Le righe di `04`, `05` e
> `06` sono `VoceDocumento`: etichetta **più importo**. Le righe di questa
> pagina sono **etichetta e basta** — il facsimile non ha numeri, e il KID non è
> un documento a voci che sommano a un totale. Se il componente apribile della
> `04` viene tipizzato su `VoceDocumento`, **qui non entra**. Perché il riuso sia
> reale va tipizzato su «una riga con un'etichetta e un valore *facoltativo*»,
> che è una decisione da prendere **mentre si implementa `04`**, non dopo. È la
> stessa richiesta che la `05` ha già messo per iscritto sui nomi; questa ne
> aggiunge una sul tipo.

### Il traduttore da percentuale a euro

Due campi, entrambi `CampoNumerico` già esistente, etichetta **accanto** al
campo e non solo dentro:

| Campo | Etichetta | Aiuto scritto sotto |
| --- | --- | --- |
| percentuale | «La percentuale dei costi, come è scritta sul foglio» | dove trovarla, riquadro e riga |
| importo | «Quanti soldi stai mettendo» | nessun aiuto: la domanda si spiega da sé |

E il risultato:

| Elemento | Forma |
| --- | --- |
| **Il numero grande** | il costo di un anno: `150,00 €`. È il più grande della schermata |
| La frase che lo spiega | «1,50% su 10.000 € sono 150 € l'anno» |
| Il secondo numero | il mese: `12,50 €`, visibilmente più piccolo dell'anno |
| Il paragone | «Su ogni 100 € che metti, 1,50 € l'anno se ne vanno in costi» |

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre tabulari,
unità accanto al valore, numeri allineati a destra.

> **Il paragone della bolletta del telefono sta nell'esempio, non accanto al
> risultato.** «12,50 € al mese, quanto una bolletta del telefono» è vero per il
> caso lavorato 1,50 % su 10.000 €; non è vero per chi digita 3,00 % su
> 50.000 €, dove il mese vale 125 €. Un paragone che smette di essere vero
> quando cambiano i numeri **non può essere una stringa fissa accanto al
> risultato**: sta scritto nel riquadro dei costi, dentro l'esempio lavorato,
> dove i due numeri sono quelli. Accanto al risultato calcolato ci va il
> paragone su 100 €, che regge per qualunque coppia di valori. È lo stesso
> ragionamento con cui la `07` ha scartato «la spesa di un mese diventa tre
> settimane».

### Bozze delle stringhe

Vanno in `src/ui/`, in un file affiancato `testiFoglio.ts` che entra in
`STRINGHE_UTENTE` con lo spread — stesso schema di `testiSimulazione.ts`.
`testi.ts` è a 114 righe su un limite di 150: non ci stanno dentro.

Queste sono **bozze**. Le scrive `ui-builder`, le rilegge `guardrail-officer`
prima del merge contro il lessico **e** contro
`.claude/rules/scrittura-e-accessibilita.md` — e su questa pagina la seconda
lettura è quella che conta, perché la prima non intercetta niente.

- **Apertura** — «Prima di firmare ti mettono in mano un foglio di poche pagine.
  È il bugiardino del farmaco, ma per i soldi: si chiama KID.»
- **L'ordine fisso** — «Quel foglio dice sempre le stesse cose, sempre nello
  stesso ordine: lo prevede una legge europea. Se ne hai letto uno, sai già dove
  guardare sul prossimo.»
- **La riga dei sette numeri** — «Su una riga trovi sette numeri, da 1 a 7, e sul
  tuo foglio uno di quei sette è segnato. Quel numero dice quanto il valore si è
  mosso in passato, non se il prodotto è buono.»
- **Che cosa misura davvero** — «Un 1 vuol dire che in passato quel valore è
  sceso e salito poco; un 7 che si è mosso molto, in su e in giù. È l'ampiezza
  dell'altalena, non la direzione in cui andrà.»
- **La lettura sbagliata, detta prima che venga in mente** — «Un numero più basso
  non vuol dire che il prodotto è più sicuro per te, e uno più alto non vuol dire
  che rende di più: quella riga misura una cosa sola, quanto il valore si è
  mosso finora.»
- **Dove sta la percentuale** — «Sul tuo foglio, nel riquadro "Quali sono i
  costi?", accanto a "Costi di gestione e altri costi amministrativi o di
  esercizio" c'è un numero con la virgola. È quello che va qui.»
- **L'esempio lavorato** — «Sul foglio i costi sono scritti in percentuale.
  1,50% su 10.000 € sono 150 € l'anno: 12,50 € al mese, quanto una bolletta del
  telefono.»
- **Il tempo** — «Un altro riquadro dice per quanti anni quel prodotto è pensato
  per restare fermo. Non è una scadenza e non è un divieto: è il tempo su cui chi
  l'ha costruito ha fatto i suoi conti. Chi ritira prima può trovare dei costi in
  più, scritti sullo stesso foglio.»
- **Il facsimile vuoto** — «I riquadri qui sopra sono vuoti apposta: i numeri del
  tuo foglio sono i tuoi, e li leggi tu.»
- **I limiti, in rosa** — «Questa pagina spiega che cosa c'è scritto sul foglio.
  Non dice se firmare, non parla di nessun prodotto in particolare e non dice a
  nessuno che cosa fare dei propri soldi.»

**Chiavi nuove in `src/ui/` (tutte in `testiFoglio.ts`, esportate in
`testi.ts` con lo spread):**

`foglioOcchiello`, `foglioTitolo`, `foglioApertura`, `foglioOrdineFisso`,
`foglioRiquadroProdotto`, `foglioRiquadroRischi`, `foglioRiquadroInsolvenza`,
`foglioRiquadroCosti`, `foglioRiquadroTempo`, `foglioRiquadroReclami`,
`foglioRischiSetteNumeri`, `foglioRischiCosaMisura`, `foglioRischiNonDice`,
`foglioCostiDoveSta`, `foglioCostiEsempio`, `foglioTempoSpiegazione`,
`foglioFacsimileVuoto`, `foglioEtichettaPercentuale`,
`foglioEtichettaImporto`, `foglioAiutoPercentuale`, `foglioRisultatoAnno`,
`foglioRisultatoMese`, `foglioParagoneCento`, `foglioNotaArrotondamento`,
`foglioFonteNorma`, `foglioVuoto`, `foglioErrorePercentuale`,
`foglioErroreImporto`, `foglioNonFa1`, `foglioNonFa2`, `foglioNonFa3`.

Le sei etichette `foglioRiquadro*` contengono le intestazioni **originali del
documento**: sono l'unico posto della pagina in cui il testo non è nostro, e
non si toccano.

### I quattro stati obbligatori

Una schermata che esiste solo nel caso perfetto non è finita.

1. **Vuoto** — è lo stato **normale** di questa pagina, non un incidente: chi
   arriva vede il facsimile e la legenda, e il traduttore ancora spento. Al posto
   del numero grande, una frase che dice quali due cose servono — la percentuale
   scritta sul foglio e quanti soldi si stanno mettendo — e dove si trova la
   prima. Mai uno `0,00 €` messo lì come segnaposto: uno zero è un risultato, e
   fingerlo è dire una cosa falsa.
2. **In caricamento** — non esiste un'attesa: nessun I/O, nessuna rete, il conto
   è immediato. Lo stato si chiude qui, senza rotelline. Quello che va garantito
   è che **il riquadro del risultato occupi già il suo spazio da vuoto**, così
   quando il numero arriva non spinge in basso il blocco rosa dei limiti.
3. **Errore** — in linguaggio umano. Percentuale fuori intervallo: «Controlla
   questa percentuale, sembra troppo alta. Sul foglio è il numero con la virgola
   scritto nella riga dei costi.» Importo: «Controlla questo numero, sembra
   troppo alto.» Il numero grande **non mostra mai una cifra calcolata su un dato
   rifiutato**: o resta com'era o torna allo stato vuoto. **E ciò che si era già
   digitato nell'altro campo resta lì.**
4. **Dati lunghi o numerosi** — due casi, entrambi veri.
   `Per quanto tempo devo detenerlo? Posso ritirare il capitale
   prematuramente?` è lunga 75 caratteri e deve andare a capo dentro il suo
   riquadro senza rompere la griglia. E `10,00%` su una somma a sette cifre
   (`9.999.999 €`) dà un costo di un anno a sei cifre in euro: il numero grande
   resta su una riga sola, dentro il suo riquadro, senza barra di scorrimento
   orizzontale.

### Accessibilità — i punti decisi qui

- Il contratto della riga apribile è quello della `04`, ripetuto sopra e non
  solo riferito.
- La riga dei sette numeri **non è un'immagine e non è solo un disegno**: i
  sette valori sono testo, leggibili da uno screen reader e ingrandibili con lo
  zoom del browser.
- Corpo mai sotto i 16 px, interlinea almeno 1,5, contrasto almeno 4,5:1.
  Nessun testo affidato a una trasparenza bassa. Il rosa `#FF50A0` (6,5:1) **solo**
  nel blocco dei limiti.
- Ordine di tabulazione uguale all'ordine di lettura: prima i riquadri del
  facsimile dall'alto in basso, poi i due campi, poi il risultato.
- Navigazione, «torna alla home» e «indietro» nella stessa posizione di ogni
  altra pagina: `App.tsx` li disegna già fuori dal cambio di schermata.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/costoFoglio.test.ts`, con i valori
  della «Verifica a mano» scritti nel commento accanto a ogni asserzione:

  ```ts
  // 1.000.000 x 150 / 10.000 = 15.000 cent -> 150,00 €
  // 350.000 x 230 / 10.000 = 8.050 -> 8.050 / 12 = 670,83 -> 671 cent
  ```

  Più i casi di confine: `costoAnnuoBp = 0` (tutto zero, esito `ok`),
  `costoAnnuoBp = 1001` (rifiuto), `capitaleCent = 0` (rifiuto),
  `capitaleCent = RISPARMIO_MAX_CENT + 1` (rifiuto), e **l'identità del
  paragone**: `costoPerCentoEuroCent === costoAnnuoBp` per ogni valore ammesso.
  E il caso della virgola: da `'2,30'` devono uscire **230** bp, non 229.
- **Test di accettazione** —
  `tests/accettazione/12-guida-al-foglio-prima-di-firmare.test.ts`, scritto dal
  `tester` **dalla specifica, non dal codice**.
- **Lessico** — `tests/lessico-ui.test.ts` scandisce già `testi.ts` e quindi lo
  spread di `testiFoglio.ts`: non serve aggiungere niente per farlo girare.
  **Serve però sapere che non basta**, ed è scritto sopra: la rilettura di
  `guardrail-officer` contro i principi di scrittura è, su questa pagina, il
  controllo vero.
- **In demo, dieci secondi**: si tocca `Quali sono i costi?`, si digita `1,50`
  e `10000`, compare **150,00 €** e sotto `12,50 € al mese`. Poi si scorre di
  una riga e si vede il blocco rosa: «non dice se firmare».

## Cosa questa funzionalità NON fa

**La sezione più importante di questa spec, e la prima che è stata scritta.**
Ogni voce qui sotto è un pezzo della sezione 6 d'origine che **non rientra**, o
un confine che la variante rischia di sfondare da sola.

- **Non nomina nessun prodotto e nessuno strumento.** Niente conto deposito,
  niente BOT, BTP, obbligazioni, azioni, fondi comuni, ETF, fondi pensione,
  criptoattività, crowdfunding. Nemmeno in un elenco «a titolo di esempio»:
  l'elenco **è** la sezione rifiutata, rimessa dentro da un'altra porta.
- **Non accosta bisogni a strumenti.** L'impianto `Bisogno → Strumento` della
  sezione 6 è esattamente ciò per cui il task è stato rifiutato. Una frase come
  «per i soldi che servono fra sei mesi si usa X» è la stessa raccomandazione
  scritta in terza persona, e **il lessico non la ferma**. Non entra.
- **Non indica percentuali di portafoglio.** Nessun «al massimo una quota
  piccola», nessun «la parte che puoi permetterti di perdere». È un giudizio di
  idoneità travestito da prudenza.
- **Non dice che cosa è adatto a chi.** La pagina non fa domande sulla
  situazione di chi legge, non ha un profilo, non ha un questionario. Non sa chi
  ha davanti e non deve saperlo.
- **Non mostra rendimenti, né passati né futuri.** Il KID contiene gli scenari
  di performance: questa pagina **non li riporta e non li spiega**. Un
  rendimento passato messo a schermo viene letto come un'attesa, qualunque
  avvertenza gli si scriva accanto — e la nota di prudenza della sezione 6
  d'origine arriva da sé alla stessa conclusione. Per lo stesso motivo **non
  esiste un simulatore** di questa pagina che proietti «quanto avrai».
- **Non moltiplica il costo per gli anni.** Sarebbe facile — `150 × 5 = 750 €` —
  e sarebbe **aritmeticamente corretto e fattualmente falso**: presuppone in
  silenzio che la somma resti ferma a 10.000 € per cinque anni, cosa che su un
  prodotto di questo tipo non succede. Un numero giusto che racconta una cosa
  che non è vera è il difetto peggiore fra i due. Il costo si mostra **per un
  anno**, che è l'orizzonte su cui la percentuale è scritta sul foglio.
- **Non dà nessun semaforo e nessun punteggio.** L'indicatore da 1 a 7 è
  mostrato come una riga di sette numeri, tutti uguali, senza colori e senza
  parole di giudizio ai due estremi. È la deroga dichiarata al principio dei
  semafori: verde/giallo/rosso comunica «va bene / attenzione / preoccupante», e
  su uno strumento finanziario quella è una valutazione che il prodotto non dà.
- **Non dice se firmare.** Non c'è una riga, un riepilogo o un «cosa fare
  adesso» che porti verso o lontano dalla firma. La pagina consegna la legenda
  di un foglio e si ferma. È il confine che questa funzionalità rischia di più,
  perché la domanda successiva — «e allora, firmo?» — arriva **mentre la persona
  ha la penna in mano**: il momento di massima pressione di tutto il sito.
- **Non contiene la diversificazione.** La formulazione conforme esiste già,
  scritta in `.claude/rules/scrittura-e-accessibilita.md` — «chi mette tutti i
  risparmi in una sola azienda, se quella va male, perde tutto insieme» — ma è
  **un paragrafo, non questa funzionalità**: è una pagina di spiegazione
  costruita sulla `03`, con il suo task e la sua spec. Metterla qui allargherebbe
  una schermata che deve spiegare **un concetto solo**.
- **Non riscrive le intestazioni del foglio.** Compaiono identiche, anche quelle
  lunghe e ostiche. La spiegazione si mette **accanto**, mai al posto.
- **Non legge un KID vero.** Nessun caricamento di PDF, nessuna foto, nessun
  riconoscimento del testo: `02-data-ingest` non è attivato e `src/ingest/` è
  vuota di proposito. I due numeri li digita la persona guardando il proprio
  foglio.
- **Non prende niente dalla rete** e non ha nessun dato che invecchia. Il
  riferimento normativo è testo dichiarato nel codice; non c'è un tasso, non c'è
  un'aliquota, non c'è una soglia da aggiornare.
- **Non fa domande e non assegna punteggi.** La misura della comprensione è di
  `src/assessment/`, un'altra directory e un altro agente.
- **Non chiede e non conserva dati personali.** Le due cifre digitate restano
  nella pagina, non finiscono nell'indirizzo e non vengono salvate — stessa
  scelta già motivata in `rotte.ts` per la `07`.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **nessuno.** La pagina non usa `DocumentoUtente` e non deve usarlo: il KID **non è un documento a voci che sommano a un totale** — i suoi riquadri non hanno `importoCent`, non c'è un `totaleDichiaratoCent` e non c'è quadratura. Forzarlo dentro `VoceDocumento` con importi a zero sarebbe piegare un contratto per farci entrare una cosa che non è quella, cioè il difetto che `05` ha rifiutato di commettere sulla tassonomia. `Scenario` **non** va esteso: questa schermata non è uno scenario di lettura di un documento a importi. I tipi dell'ingresso e dell'uscita (`IngressoCostoFoglio`, `RisultatoCostoFoglio`, `MotivoRifiutoCosto`) nascono **dentro `src/core/`**, di proprietà di core-engine; la struttura dichiarativa del facsimile nasce **dentro `src/ui/`**, come `contenutiHome.ts`. `RISPARMIO_MAX_CENT`, `parseNumeroIt`, `formattaEuro`, `formattaPercentuale` ed `Esito` sono **già esportati** da `src/core/index.ts`: si leggono, non si toccano |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root. **Irrilevante: questa funzionalità non scrive in `types/`**, quindi non richiede l'architetto. È l'unica delle tre guide-documento a non chiedere una riga di `Scenario`, perché non è una lettura di documento a importi |
| **Agente incaricato** | **`03-ui-builder`** (facsimile, traduttore, stringhe: è il grosso del lavoro), con **`01-core-engine`** per `costoFoglio.ts` e il suo test unitario, e **`04-guardrail-officer`** per la rilettura delle stringhe e il test di accettazione. **Ordine obbligato**: core-engine → ui-builder → guardrail-officer. Non è parallelizzabile al proprio interno |
| **Directory toccate** | **3 — quindi più di un agente.** `src/core/` (`costoFoglio.ts` nuovo, `index.ts` per l'export, `__tests__/costoFoglio.test.ts` — **core-engine**) · `src/ui/` (`PaginaFoglio.tsx`, `RiquadroFoglio.tsx`, `ScalaSetteNumeri.tsx`, `contenutiFoglio.ts`, `testiFoglio.ts`, `stiliFoglio.css` nuovi · `testi.ts` per lo spread, `rotte.ts` per `PERCORSO_FOGLIO = '#/foglio-prima-di-firmare'`, `App.tsx` — **ui-builder**) · `tests/` (`accettazione/12-guida-al-foglio-prima-di-firmare.test.ts` — **guardrail-officer** e **tester**). **Fuori dall'impronta, e non per caso:** `types/`, `fixtures/`, `src/guardrails/`, `src/assessment/`, `src/ingest/` |
| **Evidenza prodotta per il deck** | `../presentation/screenshots/12-foglio-costi-in-euro.png` — nella stessa inquadratura il riquadro `Quali sono i costi?` **aperto**, i due campi con `1,50` e `10000`, il numero grande `150,00 €` con sotto `12,50 € al mese`, e il blocco rosa dei limiti visibile in fondo. Sono gli stessi numeri che il test unitario asserisce: la slide mostra la cifra che il test dimostra. Più `12-foglio-mobile.png` per il caso stretto, che su un facsimile a riquadri è il caso che rompe la griglia |
| **dipende-da** | `04-guida-interattiva-busta-paga` — **dipendenza di riuso, non di blocco** (vedi sotto) · `07-valore-dei-risparmi-nel-tempo` (**fatto**) per `CampoNumerico`, `parseNumeroIt`, `formattaEuro`, `RISPARMIO_MAX_CENT` e la forma `Esito` del rifiuto, tutti già scritti e già coperti da test · `01-landing-page` (**fatto**) per navigazione e percorso. **Non dipende dalla `03`**: il motivo è scritto qui sotto, ed è una correzione da propagare |

### Perché **non** dipende dalla `03`, e che cosa va corretto di conseguenza

`docs/features/03-pagina-di-spiegazione-struttura-riusabile.md` dichiara la `12`
fra le proprie istanze, «per intero». **Quella riga descrive il task `12`
rifiutato, non questa funzionalità**, e va riletta quando qualcuno riapre la
`03`: la variante ha cambiato famiglia, e con la famiglia è cambiata la
dipendenza. Non la correggo qui perché `docs/features/03-*.md` non è un file di
questa spec.

Il contenitore della `03` **non regge questa pagina**, per due motivi tecnici,
non di gusto:

1. **La `03` dichiara esempi con «argomenti FISSI: nessuno li digita».** Qui i
   due numeri li digita la persona. Nel tipo `EsempioNumerico` non esiste il
   posto per un campo di ingresso, e aggiungercelo cambierebbe il contenitore
   per cinque task a valle.
2. **La `03` ammette un `nomeTecnico` e un `esempio`, non una lista.** Questa
   pagina ha un facsimile con sei riquadri di cui tre apribili: gli otto blocchi
   non hanno dove metterlo.

Restano in piedi **due regole della `03`, applicate qui per iscritto** anche
senza il suo contenitore: l'immagine concreta **prima** del nome tecnico
(blocco 3), e il blocco dei confini **in fondo, in rosa, non vuoto** (blocco 8).
E se la `03` arriva prima, **le sue classi CSS si riusano** (`occhiello`,
`limiti`, `limiti-titolo`, `nota-riga`): due schermate dello stesso sito che si
somigliano non si ottengono ridisegnandole.

### La dipendenza dalla `04`, e perché è di riuso e non di blocco

Questa pagina **può essere implementata anche prima della `04`** senza rompersi:
il suo facsimile non ha importi, quindi non aspetta niente dal core della busta
paga. Ma se parte prima, scrive **un secondo componente di riga apribile**
accanto a quello che la `04` scriverà, e da lì in avanti i due divergono senza
che nessun test se ne accorga — è lo stesso rischio che la `05` ha già messo per
iscritto.

**Ordine raccomandato: `04` → `12`.** E se per ragioni di pianificazione la `12`
va prima, il componente che scrive **deve** essere quello generico — riga con
etichetta e valore **facoltativo** — e va nominato come chiede la `05`:
`RigaDocumento`, non `RiquadroFoglio`.

### Conflitti di pianificazione, da sapere prima di `/implementa`

- L'impronta `src/core/` + `src/ui/` + `tests/` è **identica a quella della
  `07`** e contiene quella della `03`. La `12` **non può girare in parallelo**
  con `03`, `04`, `05`, `06`, `08`, `09`, `10`, `11`, `13`: toccano tutti
  `src/ui/`.
- **Non c'è nessun blocco aperto.** A differenza della `07` (il tasso ISTAT da
  recuperare) e della `05` (le proporzioni della bolletta da verificare), questa
  funzionalità **non ha un solo dato da procurarsi**: i numeri li digita la
  persona, il facsimile è vuoto, e l'unico riferimento esterno è una norma, non
  un valore. È il task più veloce da portare a verde fra quelli rimasti.
- **Segnalazione a `guardrail-officer`, fuori da questa impronta.** Il lessico
  non intercetta la raccomandazione in terza persona. Estenderlo — radici su
  `rischio bass*`, `rendiment* attes*`, `quota (molto )?piccola`, `nel lungo
  periodo rende` — tocca `src/guardrails/`, che è **fuori dall'impronta di
  questa funzionalità** e vale per ogni stringa del progetto, quindi per ogni
  branch aperto. Va aperto come task suo, non nascosto in questo diff.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

> Stato: **in sviluppo** · fase 1 scritta il 2026-09-15, dalla sola specifica.
> La fase 2 — rilettura del codice e dei test, esecuzione dei passi qui sotto e
> riscrittura al presente sotto «Verificato» — non è ancora stata fatta.
>
> **Nota tecnica sui percorsi, da segnalare e non da ignorare.** La riga
> «Directory toccate» qui sopra prevede una modifica a `src/ui/rotte.ts`
> (`PERCORSO_FOGLIO`) e a `src/ui/App.tsx`. Dalla funzionalità **14**, entrata
> nel frattempo, quell'istruzione è superata: una schermata nuova si dichiara
> aggiungendo `src/ui/schermate/12-foglio.ts` (id, percorso, componente,
> passo) e il registro la raccoglie da sé — `rotte.ts` e `App.tsx` **non si
> toccano più** per una schermata in più, salvo la riga di spread in
> `testi.ts`. I passi di prova qui sotto sono scritti sulla struttura attuale
> (`src/ui/schermate/`), non su quella descritta nella sezione tecnica della
> spec. Lo scostamento va tenuto presente da chi implementa: non è una
> licenza per riaprire `rotte.ts` come previsto lì.

### Cosa farà

Mostrerà, in un'unica pagina, il facsimile vuoto di un KID — il foglio di
poche pagine che per legge accompagna ogni prodotto di investimento
complesso, «il bugiardino del farmaco, ma per i soldi» — con le sue
intestazioni originali nell'ordine di legge, e un traduttore che prende i due
numeri che la persona legge sul proprio foglio (una percentuale di costo e la
somma che sta mettendo) e li trasforma in un euro grande: quanto costa un
anno, quanto costa un mese, e quanto si spende per ogni 100 € messi.

Nella riga dei rischi mostrerà i sette numeri **per intero, nessuno segnato e
nessuno colorato**: chi guarda riconosce dove sta, sul proprio foglio, il
numero che lo riguarda — non gli viene detto quale sia il numero «buono».

### Per chi

La persona a cui, allo sportello o in un ufficio, hanno appena messo davanti
un foglio fitto di poche pagine che non ha chiesto e non capisce, con
qualcuno seduto davanti che aspetta una firma — oppure la stessa persona, la
sera a casa, con la copia in mano e la domanda «che cosa ho firmato». Le
servirà **prima di firmare**, non dopo: il tempo a disposizione è pochi
secondi, non una lettura con calma.

### Come si proverà

Sono i **criteri di accettazione**: finché anche uno solo di questi passi non
dà il risultato atteso, la funzionalità non è finita. I comandi vanno
eseguiti da `app/`.

1. **Preparare l'ambiente.** Lanciare la skill `/prepara` (o `npm run
   prepara`, che esegue `node scripts/prepara.mjs`). Serve solo la prima
   volta.
   *Risultato atteso:* lo script confermerà l'ambiente pronto, e il suo
   controllo di salute — `tsc --noEmit` e poi `npm test` — finirà senza
   errori.

2. **Avviare l'applicazione.** Lanciare la skill `/avvia` (che esegue `node
   scripts/dev-server.mjs start`). Mai `npm run dev` a mano: è un processo che
   non termina e lascia la sessione appesa.
   *Risultato atteso:* lo script riporterà l'indirizzo
   `http://localhost:5173`.

3. **Raggiungere la pagina.** Aprire quell'indirizzo e arrivarci con un
   percorso di navigazione, senza scrivere l'indirizzo a mano — dalla home o
   da un collegamento dell'area «Il futuro» — fino a `#/foglio-prima-di-firmare`.
   *Risultato atteso:* comparirà, dall'alto in basso: l'occhiello dell'area, il
   titolo come domanda («Che cos'è il foglio che mi danno da firmare?»),
   l'immagine mentale del bugiardino del farmaco **prima** della parola KID,
   il facsimile a riquadri, il traduttore, la nota su chi impone il foglio, e
   in fondo — sempre nello stesso punto — il blocco rosa dei limiti.

4. **Lo stato vuoto — il primo che si vede, non un incidente.** Guardare la
   pagina senza aver ancora digitato nulla nei due campi.
   *Risultato atteso:* nessuno `0,00 €` messo lì come segnaposto. Al posto del
   numero grande comparirà una frase che dice quali due dati servono — la
   percentuale scritta sul foglio e quanti soldi si stanno mettendo — e dove
   si trova la prima, cioè nel riquadro «Quali sono i costi?».

5. **Il facsimile, nell'ordine di legge.** Leggere le sei intestazioni dei
   riquadri, dall'alto in basso, senza aprirne nessuno.
   *Risultato atteso:* le etichette compariranno **identiche** a quelle di
   legge, incluse quelle lunghe («Costi di gestione e altri costi
   amministrativi o di esercizio»), senza essere riscritte o abbreviate. Tre
   riquadri risulteranno apribili — rischi, costi, tempo — gli altri tre no.
   Tutti i riquadri saranno **vuoti**: nessun numero, nessun importo, nessuna
   percentuale già scritta dentro.

6. **La riga dei sette numeri.** Aprire il riquadro «Quali sono i rischi e
   qual è il potenziale rendimento?».
   *Risultato atteso:* comparirà una riga con i numeri da 1 a 7, **tutti
   uguali fra loro, nessuno segnato, nessuno colorato**: niente verde, niente
   giallo, niente rosso. Il testo accanto dirà che quel numero misura quanto
   il valore si è mosso in passato — non se il prodotto è buono — e che un
   numero più basso non significa più sicuro né uno più alto rende di più.

7. **Il traduttore, con il caso di riferimento.** Aprire il riquadro «Quali
   sono i costi?», digitare `1,50` nel campo della percentuale e `10000` nel
   campo dell'importo.
   *Risultato atteso:* comparirà, come numero più grande della pagina,
   **150,00 €**, con accanto la frase che lo spiega («1,50% su 10.000 € sono
   150 € l'anno»); sotto, visibilmente più piccolo, **12,50 € al mese**; e il
   paragone su 100 €: «su ogni 100 € che metti, 1,50 € l'anno se ne vanno in
   costi». Il paragone con la bolletta del telefono comparirà **solo dentro
   il testo dell'esempio del riquadro dei costi**, non accanto al risultato
   appena calcolato.

8. **Il caso con il resto — il mese non ricompone l'anno.** Cambiare i due
   campi in `2,30` e `3500`.
   *Risultato atteso:* il numero grande mostrerà **80,50 €** l'anno; il mese
   mostrerà **6,71 €**, e la pagina **non scriverà mai** che dodici volte il
   mese fa l'anno — quel conto darebbe 80,52 €, due centesimi in più, e
   affermarlo sarebbe falso.

9. **Un errore, in linguaggio umano.** Digitare una percentuale fuori
   intervallo (per esempio `15`) e poi un importo troppo alto.
   *Risultato atteso:* comparirà una frase in linguaggio umano — «Controlla
   questa percentuale, sembra troppo alta» con l'indicazione di dove si trova
   sul foglio, oppure «Controlla questo numero, sembra troppo alto» per
   l'importo — mai un messaggio tecnico. Il numero grande non mostrerà mai una
   cifra calcolata su un dato rifiutato, e ciò che era digitato nell'altro
   campo resterà al suo posto.

10. **Il blocco dei limiti, in fondo, sempre visibile.** Scorrere fino in
    fondo alla pagina.
    *Risultato atteso:* un blocco in rosa (`#FF50A0`) dirà che la pagina non
    dice se firmare, non parla di nessun prodotto in particolare e non dice a
    nessuno che cosa fare dei propri soldi. Sarà l'**unico** punto della
    pagina colorato così: guardandosi attorno, nessun altro elemento — inclusa
    la riga dei sette numeri — userà quel colore.

11. **Da tastiera e a finestra stretta come un telefono.** Restringere la
    finestra sotto i 768 px di larghezza, rifare i passi 5-7, poi — senza
    toccare il mouse — premere Tab più volte, nell'ordine: prima i riquadri
    del facsimile, poi i due campi, poi il risultato.
    *Risultato atteso:* i riquadri si impileranno senza barra di scorrimento
    orizzontale, nessuna scritta scenderà sotto i 16 px, nessun bersaglio
    sarà più piccolo di 44×44 px, e ogni elemento che riceve il focus mostrerà
    un contorno visibile. Il riquadro apribile risponderà anche a Invio, non
    solo al clic.

12. **Dati lunghi.** Con la finestra stretta del passo 11, controllare
    l'intestazione più lunga («Per quanto tempo devo detenerlo? Posso
    ritirare il capitale prematuramente?») e digitare un importo a sette
    cifre (`9999999`) con una percentuale al massimo (`10`).
    *Risultato atteso:* l'intestazione andrà a capo dentro il proprio
    riquadro senza rompere la griglia, e il numero grande — a sei cifre in
    euro — resterà su una riga sola, dentro il suo riquadro, senza scorrimento
    orizzontale.

13. **Con il Wi-Fi spento.** Fermare il server con `/avvia stop`, lanciare
    `npm run build`, spegnere il Wi-Fi e riaprire la build da un server
    locale (non con un doppio clic su `dist/index.html`: quel caso è un
    difetto già noto e tracciato altrove, non di questa funzionalità — vedi la
    scheda 01, passo 8, e la scheda 13, passo 11).
    *Risultato atteso:* la build finirà senza errori, e rifacendo i passi 3-7
    si leggerà esattamente lo stesso contenuto, **senza che parta una sola
    richiesta fuori dal computer**.

### Limiti previsti

- **Non nominerà nessun prodotto e nessuno strumento finanziario.** Niente
  conto deposito, BOT, BTP, obbligazioni, azioni, fondi comuni, ETF, fondi
  pensione, criptoattività, crowdfunding — nemmeno come esempio.
- **Non accosterà bisogni a strumenti** e non dirà a nessuno quale prodotto
  corrisponde alla propria situazione: è il motivo per cui la versione
  originale del task è stata rifiutata, e questa variante lo evita per
  costruzione.
- **Non indicherà percentuali di portafoglio** né userà formule come «solo
  una piccola parte»: sarebbe un giudizio di idoneità travestito da prudenza.
- **Non dirà che cosa è adatto a chi.** Nessuna domanda sulla situazione di
  chi legge, nessun profilo, nessun questionario.
- **Non mostrerà rendimenti, né passati né futuri**, e non avrà un simulatore
  che proietti «quanto avrai»: un rendimento passato messo a schermo verrebbe
  letto come un'attesa, qualunque avvertenza gli si scriva accanto.
- **Non moltiplicherà il costo per gli anni** (niente «150 € × 5 anni»):
  sarebbe aritmeticamente corretto e fattualmente falso, perché presuppone in
  silenzio che la somma resti ferma. Mostrerà solo il costo di un anno e,
  derivato da quello, il costo di un mese.
- **Non darà nessun semaforo e nessun punteggio** sulla riga da 1 a 7: sarà
  mostrata per intero, senza colori né parole di giudizio.
- **Non dirà se firmare.** Nessun riepilogo, nessuna riga «cosa fare adesso».
- **Non conterrà la spiegazione della diversificazione**: esiste già come
  paragrafo altrove (`.claude/rules/scrittura-e-accessibilita.md`), non fa
  parte di questa pagina, che spiega un concetto solo.
- **Non riscriverà le intestazioni del foglio.** Compariranno identiche,
  anche quelle lunghe.
- **Non leggerà un KID vero**: nessun caricamento di PDF, nessuna foto,
  nessun riconoscimento del testo. I due numeri li digita la persona guardando
  il proprio foglio.
- **Non prenderà niente dalla rete** e non avrà nessun dato che invecchia: il
  riferimento normativo è testo scritto nel codice, non un tasso da
  aggiornare.
- **Non farà domande e non assegnerà punteggi**: la misura della comprensione
  è un'altra funzionalità, di un altro agente.
- **Non conserverà i due numeri digitati**: restano nella pagina, non finiscono
  nell'indirizzo e non vengono salvati da nessuna parte.

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
