# 12 — casi di prova per «Il foglio che ti danno prima di firmare»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/12-guida-al-foglio-prima-di-firmare.md` e **non dal codice**,
> che in questo momento non esiste ancora.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», cioè il percorso
> nominale da mostrare in demo. Qui si scrive **cosa può andare storto**.
>
> **Formula, dalla specifica.** `costoAnnuoBp = parseNumeroIt(testoPercentuale)`
> — la stessa funzione usata per gli importi, riletta come punti base invece
> che come centesimi, perché `'1,50'` e `1,50 €` producono lo stesso intero
> `150` prima di sapere a cosa si applica. Poi `costoAnnuoCent =
> Math.round(capitaleCent * costoAnnuoBp / 10_000)` · `costoMensileCent =
> Math.round(costoAnnuoCent / 12)` · `costoPerCentoEuroCent = Math.round(10_000
> * costoAnnuoBp / 10_000)`, che è **esattamente** `costoAnnuoBp`. Rifiuto:
> `costoAnnuoBp` fuori da `0…1000` → `'costo-fuori-intervallo'`; `capitaleCent`
> sopra `RISPARMIO_MAX_CENT` (1.000.000.000, costante già esportata dalla `07`)
> → `'somma-troppo-alta'`; `capitaleCent` minore o uguale a zero →
> `'somma-mancante'`. Ogni risultato atteso qui sotto è ricalcolato a mano da
> questi passi, con l'aritmetica scritta accanto.

## Perché la sezione 4 conta più delle altre, qui

Il task originale — «approfondimento sugli investimenti» — è stato
**rifiutato** al criterio 1: la sezione d'origine dichiara da sé l'impianto
«prima il bisogno, poi lo strumento» in quattro punti `Bisogno → Strumento`, e
dire a una persona quale strumento corrisponde al suo bisogno **è** dirle
quale scegliere. La specifica che segue è la variante conforme — una guida al
KID, il foglio che per legge accompagna un prodotto di investimento — e i casi
di conformità qui sotto esistono per provare che il rifiuto **regge nel
codice**, non solo nel testo della specifica.

La specifica stessa lo scrive: **dodici frasi** prese alla lettera dalla
sezione d'origine («rischio basso», «rendimento atteso più alto», «adatte al
massimo a una quota molto piccola», la regola sul non concentrare i risparmi)
passano tutte `src/guardrails/lessico.ts` senza essere bloccate. Le radici
vietate coprono l'imperativo diretto (`investi`, `compra`, `dovresti`, `adatto
a te`), non la stessa raccomandazione scritta in terza persona — che è
esattamente la forma in cui l'idoneità di prodotto e il livello di rischio
ricompaiono più facilmente in questa pagina. **Nessuna di queste radici è
oggi nel lessico generale**: «rischio basso/alto», «rendimento atteso»,
«quota piccola», «adatto a chi ha bisogno di» passerebbero senza un test
scoped dedicato, sul modello di `tests/lessico-simulazione-risparmio.test.ts`
e `tests/lessico-fonti.test.ts` (CF-04 più sotto).

E le formulazioni vietate sopravvivono nei commenti — l'hook di
`tests/lessico-ui.test.ts` li scandisce, comprese le citazioni fra virgolette
a caporale «» — ma **solo per il lessico generale**: un test scoped che legge
esclusivamente le chiavi di `testiFoglio.ts` non guarda dentro ai commenti
degli altri file toccati. È già successo una volta, proprio nel file del
guardrail (vedi il commento sulla voce `comparativo-valore` in
`src/guardrails/lessico.ts`, righe 42-63, che cita «meglio» proprio per
motivare perché non è bloccato). CF-03 esiste per questo.

## Un punto che la specifica non decide, segnalato e non indovinato

Il motivo di rifiuto `'costo-fuori-intervallo'` copre **entrambi gli estremi**
dell'intervallo `0…1000`: sia `costoAnnuoBp > 1000` sia `costoAnnuoBp < 0`. La
specifica scrive però un solo testo di errore per questo motivo — «Controlla
questa percentuale, sembra troppo alta» — che è corretto per il primo caso e
**falso** per il secondo: una percentuale digitata come negativa non è «alta»,
ed è un errore di battitura di natura diversa (un segno meno dove non
dovrebbe esserci, non una cifra fuori scala). La specifica non fissa un
secondo testo per il ramo basso dell'intervallo. Segnalato in E-04, non
indovinato: è materiale per i limiti dichiarati, non un caso da inventare qui.

## 1. Percorso nominale

*Pochi casi: quelli che devono funzionare sempre.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | Il caso di riferimento della specifica, quello che finisce in demo e nello screenshot | `capitaleCent = 1.000.000` (10.000,00 €) · `costoAnnuoBp = 150` (da `'1,50'`, 1,50%) | `costoAnnuoCent = round(1.000.000×150/10.000) = round(15.000.000/10.000) = 15.000` (150,00 €) · `costoMensileCent = round(15.000/12) = 1.250` (12,50 €, esatto) · `costoPerCentoEuroCent = round(10.000×150/10.000) = 150` (1,50 €, coincide con `costoAnnuoBp`). A schermo: **«150,00 €»** come numero grande, «1,50% su 10.000 € sono 150 € l'anno», sotto «12,50 € al mese», paragone «su ogni 100 € che metti, 1,50 € l'anno se ne vanno in costi» | È il numero che va in demo e nella slide. Se cambia, la slide afferma una cifra che nessun test sostiene |
| C-02 | Il caso «con il resto» che la specifica dichiara esplicitamente: il mese **non ricompone** l'anno | `capitaleCent = 350.000` (3.500,00 €) · `costoAnnuoBp = 230` (da `'2,30'`, 2,30%) | `costoAnnuoCent = round(350.000×230/10.000) = round(8.050.000/10.000) = 8.050` (80,50 €) · `costoMensileCent = round(8.050/12) = round(670,83…) = 671` (6,71 €). Controprova esplicita: `671×12 = 8.052`, cioè **2 centesimi in più** dell'anno — la schermata non deve mai scrivere «12 × 6,71 € = 80,50 €», perché non è vero | Un solo caso tondo (C-01, dove 12×12,50=150 esatto) nasconde che il mese è un secondo arrotondamento indipendente. Questo caso è quello che smaschera un'implementazione che ricalcola il mese «all'indietro» per farlo tornare con l'anno |
| C-03 | Quadratura esatta del caso di riferimento, come contrappunto a C-02 | il caso di riferimento (C-01) | `costoMensileCent × 12 = 1.250 × 12 = 15.000 = costoAnnuoCent` **esattamente**: qui il mese ricompone l'anno, perché la divisione è esatta (`15.000/12` non ha resto) | Prova che quando la divisione è esatta il sistema non introduce un errore fittizio — distingue «il mese non ricompone sempre» (proprietà generale, C-02) da «il mese non ricompone mai» (che sarebbe un difetto) |
| C-04 | L'identità del paragone su 100 €, per due valori diversi di `costoAnnuoBp` | `costoAnnuoBp = 150` e `costoAnnuoBp = 230` (gli stessi due casi di sopra) | `costoPerCentoEuroCent === costoAnnuoBp` in entrambi i casi: `150 → 150 cent → 1,50 €` e `230 → 230 cent → 2,30 €`. Il paragone su 100 € non è un secondo calcolo che potrebbe divergere dalla percentuale: è la stessa cifra letta come una banconota | La specifica lo dichiara come proprietà, non come coincidenza: se il paragone e la percentuale mai si scostano per nessun valore ammesso, un'implementazione che li calcola separatamente (invece di riusare `costoAnnuoBp`) non ha modo di romperla per caso — il test deve provarlo su valori diversi, non su uno solo |

## 2. Casi limite e valori di confine

*Zero, negativi, importi molto grandi, campi vuoti, confini dei campi,
decimali oltre il centesimo, separatori italiani.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | `costoAnnuoBp = 0` è **un risultato legittimo**, non un errore | `capitaleCent = 1.000.000` · `costoAnnuoBp = 0` | `costoAnnuoCent = 0` · `costoMensileCent = 0` · `costoPerCentoEuroCent = 0`. A schermo: **«0,00 €»**, con la frase che chiarisce che lo zero riguarda **quella riga di costo** del foglio, non il foglio intero — sul foglio vero le righe di costo sono più di una | La specifica lo scrive esplicitamente («0,00 € è un risultato legittimo e va mostrato»). Rifiutarlo sarebbe un errore quanto rifiutare `risparmiCent = 0` nella `09`: chi legge un foglio con costi a zero ha comunque una risposta vera da ricevere |
| CL-02 | Confine massimo ammesso della percentuale | `costoAnnuoBp = 1000` (da `'10,00'` o da `'10'`, 10,00%) | Accettato: `costoAnnuoCent = round(1.000.000×1000/10.000) = 100.000` (1.000,00 €). Nessun rifiuto | La regola è «fuori da 0…1000»: 1000 è incluso. Se il confronto usasse `>` al posto di `>=`, questo valore verrebbe rifiutato per errore |
| CL-03 | Confine massimo ammesso del capitale — `RISPARMIO_MAX_CENT` | `capitaleCent = 1.000.000.000` (10.000.000,00 €) · `costoAnnuoBp = 150` | Accettato: `costoAnnuoCent = round(1.000.000.000×150/10.000) = 15.000.000` (150.000,00 €) · `costoMensileCent = round(15.000.000/12) = 1.250.000` (12.500,00 €, esatto). Nessun overflow, nessun rifiuto | È il valore esatto della costante condivisa con la `07`. Un confronto `>` invece di `>=` lo respingerebbe in silenzio, e sarebbe anche un'incoerenza fra due schermate dello stesso sito sullo stesso limite dichiarato |
| CL-04 | Confine minimo positivo ammesso del capitale | `capitaleCent = 1` (0,01 €) · `costoAnnuoBp = 150` | Accettato, distinto dal rifiuto di CL-06/E-02: `costoAnnuoCent = round(1×150/10.000) = round(0,015) = 0` (0,00 €). Un capitale minimo produce un costo che arrotonda a zero, ed è corretto mostrarlo così, non come errore | Distingue «il capitale è troppo piccolo per generare un costo visibile» (un risultato, seppure banale) da «il capitale manca» (un rifiuto, CL-06). Sono due cose diverse e un'implementazione pigra potrebbe confonderle trattando ogni risultato a zero come un errore |
| CL-05 | Percentuale con più di due decimali digitata: il terzo decimale **si perde nell'arrotondamento al punto base**, non viene ignorato silenziosamente né rifiutato | testo digitato `'1,506'` nel campo percentuale | `parseNumeroIt('1,506')`: normalizzato `'1.506'`, `n = 1.506`, `Math.round(1.506×100) = Math.round(150.6) = 151` → `costoAnnuoBp = 151` (1,51%), **non** 150. Il valore `150,6` non è un confine di arrotondamento pari-dispari (`.5` esatto), quindi il risultato non dipende dalla rappresentazione IEEE-754 del numero e va sempre a 151 | Il riuso di `parseNumeroIt` per il campo percentuale (non una funzione nuova) è una decisione esplicita della specifica: questo caso prova che la conseguenza — un terzo decimale digitato viene arrotondato al punto base più vicino, non troncato e non rifiutato — è quella che il riuso effettivamente produce, non quella che qualcuno immagina |
| CL-06 | Separatori italiani nel campo importo | testo digitato `'10.000,50'` nel campo importo | `parseNumeroIt('10.000,50')`: il punto delle migliaia viene rimosso, la virgola diventa il separatore decimale → normalizzato `'10000.50'` → `n = 10000,50` → `capitaleCent = round(1.000.050) = 1.000.050` (10.000,50 €) | Il campo importo riusa lo stesso parser degli euro della `07`: un punto delle migliaia letto come separatore decimale (`10.000,50` interpretato come `10,00050`) sarebbe un errore silenzioso di tre ordini di grandezza, il tipo di difetto che nessuno vede finché non confronta con il documento di carta |
| CL-07 | Capitale digitato con solo punto delle migliaia, senza decimali — è la forma in cui la persona scrive «diecimila euro» | testo digitato `'10.000'` nel campo importo | `parseNumeroIt('10.000') = round(10000×100) = 1.000.000` (10.000,00 €) — lo stesso capitale di C-01 | Prova che la forma più comune di scrittura di un importo tondo produce esattamente il capitale del caso di riferimento, non un valore cento volte più piccolo o più grande per una lettura sbagliata del punto |

## 3. Errori attesi

*Cosa succede quando l'input non è valido, e **come lo vede la persona**. Un
errore corretto mostrato male resta un difetto. Qui vanno anche i **quattro
stati obbligatori**: vuoto, in caricamento, errore, dati lunghi.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Capitale mancante o a zero | `capitaleCent = 0` | Motivo `'somma-mancante'`; messaggio in linguaggio umano accanto al campo importo, nessun calcolo tentato, nessun `0,00 €` mostrato come se fosse un risultato | La specifica distingue esplicitamente questo motivo da `'somma-troppo-alta'`: un controllo che verifica solo il limite superiore potrebbe non essere lo stesso codice che protegge questo lato |
| E-02 | Capitale negativo | `capitaleCent = -5.000` | Stesso motivo `'somma-mancante'` (la specifica usa un solo motivo per «minore o uguale a zero»): messaggio in linguaggio umano, nessun calcolo, nessun `NaN` né numero negativo mostrato | Un capitale negativo non ha senso su un foglio di investimento: va rifiutato con lo stesso codice dello zero, non con un motivo diverso che il test non aspetta |
| E-03 | Capitale sopra la soglia massima | `capitaleCent = 1.000.000.001` (10.000.000,01 €), un centesimo sopra `RISPARMIO_MAX_CENT` | Motivo `'somma-troppo-alta'`; messaggio «Controlla questo numero, sembra troppo alto» | Stesso bordo di CL-03, dal lato del rifiuto: se `>=` diventa `>`, questo valore passerebbe per errore |
| E-04 | Percentuale sopra la soglia massima | `costoAnnuoBp = 1001` (10,01%, da `'10,01'`) | Motivo `'costo-fuori-intervallo'`; messaggio «Controlla questa percentuale, sembra troppo alta. Sul foglio è il numero con la virgola scritto nella riga dei costi» — la frase che la specifica cita testualmente | Stesso bordo di CL-02, dal lato del rifiuto. Se la citazione della specifica non compare qui, resta una frase scritta e mai usata |
| E-05 | Percentuale negativa — **il punto che la specifica non decide**, segnalato sopra | testo digitato `'-1,50'` nel campo percentuale | Stesso motivo `'costo-fuori-intervallo'` di E-04, ma il testo «sembra troppo alta» è **fattualmente sbagliato** per un valore negativo. Non indovinato: ci si attende un messaggio distinto o più generico («questa percentuale non sembra corretta»), ma la specifica non lo scrive. Da verificare in fase 2 contro quello che il codice produce davvero, e da riportare come divergenza se il messaggio resta quello di E-04 | Un motivo di rifiuto condiviso fra due estremi opposti dell'intervallo, con un solo testo scritto per un solo estremo, è esattamente il tipo di scollamento che un controllo automatico non vede e una persona sì |
| E-06 | Testo al posto di un numero | `'centocinquanta'` nel campo percentuale | Messaggio in linguaggio umano **legato al campo percentuale** (`aria-describedby`), non un avviso generico in cima alla pagina; nessun calcolo | Con due campi a schermo, un errore che non dice quale dei due riguarda costringe a indovinare, e chi usa uno screen reader non lo sente affatto se non è legato al campo |
| E-07 | I dati digitati non si perdono | percentuale valida `'1,50'` + importo con errore di battitura `'diecimila'`; poi si corregge il campo importo | La percentuale `1,50` resta **ancora nel campo** mentre si corregge l'altro; simmetricamente, correggendo la percentuale l'importo resta | L'accessibilità lo chiede esplicitamente. Chi ha digitato una cifra non deve riscriverla perché l'altro campo aveva un errore di battitura |
| E-08 | Il numero grande non mostra mai una cifra calcolata su un dato rifiutato | percentuale valida seguita da un importo che diventa non valido (es. svuotato o portato sopra soglia) | Il numero grande **torna allo stato vuoto** o resta quello precedente al dato non valido; non mostra mai un importo calcolato a partire dal valore appena rifiutato | La specifica lo scrive testualmente: «Il numero grande non mostra mai una cifra calcolata su un dato rifiutato» |
| E-09 | Nessun rimprovero mentre si sta ancora digitando | `1` → `1,5` → `1,50` nel campo percentuale | Nessun messaggio di errore sui valori intermedi di una digitazione in corso (`'1'` e `'1,5'` sono prefissi legittimi di un numero valido, non un errore da segnalare subito) | Nessun limite di tempo nel progetto: chi digita piano non va corretto mentre sta ancora scrivendo |
| E-10 | **Stato vuoto** — è lo stato normale della pagina, non un incidente | nessun campo ancora compilato | Il facsimile e la legenda sono già visibili; il traduttore è spento: al posto del numero grande, una frase che dice quali due cose servono — la percentuale scritta sul foglio e quanti soldi si stanno mettendo — e dove si trova la prima. **Mai** uno `0,00 €` messo lì come segnaposto | La specifica lo dichiara esplicitamente: uno zero è un risultato (CL-01), e fingerlo nello stato vuoto è dire una cosa falsa prima ancora che la persona abbia scritto qualcosa |
| E-11 | **In caricamento** — non esiste, ma lo spazio sì | dallo stato vuoto al risultato di C-01 | Nessuna rotellina, nessuna attesa: il conto è immediato. Il riquadro del risultato **occupa già il suo spazio da vuoto**, così il blocco rosa dei limiti in fondo non si sposta quando il numero arriva | Uno spinner qui sarebbe un movimento inventato per un'attesa che non esiste, per esplicita dichiarazione della specifica; ma il salto di layout è un difetto reale anche senza spinner |
| E-12 | **Errore**, in linguaggio umano e non solo per colore | qualunque input non valido fra E-01…E-06 | Il messaggio è testo leggibile, corpo ≥ 16px, contrasto ≥ 4,5:1 — non solo un bordo colorato | Il colore da solo esclude chi non lo distingue e sparisce al proiettore |
| E-13 | **Dati lunghi** — il caso che la specifica dichiara testualmente per questo stato | `capitaleCent = 999.999.900` (9.999.999,00 €, sette cifre) · `costoAnnuoBp = 1000` (10,00%) | `costoAnnuoCent = round(999.999.900×1000/10.000) = 99.999.990` (999.999,90 €, sei cifre). Il numero grande resta su una riga sola, dentro il suo riquadro, senza barra di scorrimento orizzontale | È l'esempio che la specifica scrive alla lettera per lo stato «dati lunghi»: se il test non usa proprio questi numeri, non prova ciò che la specifica ha dichiarato |
| E-14 | **Dati lunghi**, seconda forma: l'etichetta più lunga del facsimile va a capo | il riquadro `Per quanto tempo devo detenerlo? Posso ritirare il capitale prematuramente?` (75 caratteri) | Va a capo dentro il proprio riquadro senza rompere la griglia, senza troncamento con ellissi | La specifica lo elenca esplicitamente come secondo caso dello stato 4. Le etichette del facsimile non si riscrivono (sono testo originale): se sono lunghe, deve essere il layout ad adattarsi, non il testo a essere accorciato |

## 4. Conformità

*Richiama la suite dei guardrail, non riscriverla. Qui la posta in gioco è più
alta che in ogni altra funzionalità già coperta: questa pagina esiste perché
una formulazione vicina è stata rifiutata per iscritto, e questi casi provano
che il rifiuto **regge nel codice**, non solo nella specifica.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo generale sulle chiavi nuove | le chiavi di `STRINGHE_FOGLIO` in `src/ui/testiFoglio.ts`, incluse in `STRINGHE_UTENTE` via spread | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico generale | Richiamo alla suite esistente: duplicare qui l'elenco dei termini farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Identificatori del codice | nomi di funzioni, tipi, componenti e file introdotti da questa funzionalità (`costoFoglio.ts`, `PaginaFoglio.tsx`, `RiquadroFoglio`/`RigaDocumento`, `ScalaSetteNumeri.tsx`, `contenutiFoglio.ts`) | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Stesso richiamo. Il vincolo vale anche dove l'utente non legge, perché i nomi sopravvivono più a lungo dei testi |
| CF-03 | Le formulazioni vietate non sopravvivono in un commento o in una citazione a caporale «» | l'intero testo dei file toccati — `src/core/costoFoglio.ts`, `src/ui/PaginaFoglio.tsx`, `src/ui/testiFoglio.ts`, `src/ui/contenutiFoglio.ts`, `src/ui/rotte.ts` — commenti compresi | Zero occorrenze delle radici di CF-04, in **tutto il testo** dei file, non solo nelle stringhe esportate: serve una scansione dell'intero file, sul modello della terza verifica di `tests/lessico-ui.test.ts` | Un test scoped che legge solo l'oggetto delle stringhe non vede un commento che spiega «qui NON diciamo che il rischio è basso» citando la frase fra virgolette per darsi ragione. È già successo, proprio nel file del guardrail (`comparativo-valore`, righe 42-63 di `lessico.ts`, che cita «meglio» per motivare l'esclusione) |
| CF-04 | **Test scoped nuovo, da scrivere**: `tests/lessico-foglio.test.ts`, sul modello di `tests/lessico-simulazione-risparmio.test.ts` e `tests/lessico-fonti.test.ts` | le chiavi di `STRINGHE_FOGLIO` | Zero occorrenze delle radici elencate sotto, raggruppate per ciò che vietano. **Radici che la specifica rende necessarie e che il lessico generale oggi non copre** (verificato in `src/guardrails/lessico.ts`): · giudizio di rischio — `rischio\s(molto\s)?bass\p{L}*`, `rischio\s(molto\s)?alt\p{L}*` (il lessico generale blocca solo `garantit*`, `sicuro al`, `senza/zero rischi`, non «rischio basso/alto») · rendimento come aspettativa — `rendiment\p{L}*\satt\p{L}*` (il lessico generale blocca solo `rendimento garantito`) · quota di portafoglio — `quota\s(molto\s)?piccol\p{L}*`, `portafogli\p{L}*` · idoneità in terza persona — `adatt\p{L}*\sa\s(chi|chiunque)`, `pensat\p{L}*\sper\schi\sha` (distinta da `adatto-a-te`, che nel lessico generale cerca solo «a te» esplicito) · diversificazione fuori perimetro — `diversific\p{L}*` (la formulazione conforme esiste ma appartiene alla `03`, non a questa pagina) | Sono esattamente le quattro violazioni che la sezione d'origine combinava, scritte in terza persona invece che all'imperativo: la specifica lo dimostra con dodici frasi reali che oggi passano il lessico. Senza questo test scoped, nessun controllo automatico se ne accorgerebbe se una di queste formulazioni rientrasse per un'altra strada |
| CF-05 | Nessun prodotto o strumento finanziario nominato | le stesse chiavi di CF-04 | Zero occorrenze di `BOT`, `BTP`, `obbligazion\p{L}*`, `azion[ei]` (finanziarie), `fond[oi]\scomun\p{L}*`, `ETF`, `fond[oi]\spension\p{L}*`, `criptoattiv\p{L}*`, `crowdfunding`, `conto\sdeposito`, `polizz\p{L}*` | La specifica lo elenca alla lettera in «Cosa questa funzionalità NON fa»: «Niente conto deposito, niente BOT, BTP, obbligazioni, azioni, fondi comuni, ETF, fondi pensione, criptoattività, crowdfunding. Nemmeno in un elenco "a titolo di esempio"» |
| CF-06 | Nessuna percentuale di portafoglio | le stesse chiavi | Nessuna occorrenza di una quota espressa come parte del capitale investibile («una parte piccola», «il resto dei risparmi»), oltre alle radici già coperte da CF-04 | Distinto da CF-05: qui il bersaglio non è il nome di un prodotto ma il giudizio di prudenza travestito da percentuale, che la specifica chiama esplicitamente «un giudizio di idoneità travestito da prudenza» |
| CF-07 | Niente su che cosa è adatto a chi | le stesse chiavi | Nessuna domanda sulla situazione di chi legge, nessun profilo, nessun questionario, nessuna frase che leghi il prodotto a un bisogno («per chi ha bisogno di liquidità fra due anni») | La specifica: «La pagina non fa domande sulla situazione di chi legge […]. Non sa chi ha davanti e non deve saperlo» — è concettuale più che lessicale: richiede la rilettura umana di `guardrail-officer`, non solo una regex |
| CF-08 | Nessun rendimento storico presentato come aspettativa futura | tutte le stringhe della pagina e il facsimile | Nessun numero di performance passata, nessuno scenario del KID riportato, nessuna proiezione «quanto avrai» | La specifica: un rendimento passato messo a schermo viene letto come un'attesa qualunque avvertenza gli si scriva accanto, per questo «non esiste un simulatore» qui |
| CF-09 | **Il facsimile non ha numeri evidenziati** — il primo dei tre casi che la specifica rende necessari | il riquadro `Quali sono i rischi e qual è il potenziale rendimento?`, aperto | La riga dei sette numeri è mostrata **per intero, da 1 a 7**: nessuno segnato, nessuno colorato, nessuno in grassetto o ingrandito rispetto agli altri sei. In particolare nessun numero è reso in rosa (`#FF50A0`), verde o rosso | Un «4 su 7» evidenziato verrebbe letto come il valore tipico o come il valore accettabile: è un giudizio su un prodotto che il facsimile, mostrando tutti e sette i numeri uguali, evita per costruzione. Fallisce se un solo numero compare stilisticamente diverso dagli altri sei |
| CF-10 | **Il costo non si moltiplica per gli anni** — il secondo caso che la specifica rende necessario | l'intera schermata, caso di riferimento C-01 e caso con capitale a `RISPARMIO_MAX_CENT` (CL-03) | Nessuna cifra pari a `costoAnnuoCent × N` per un `N` di anni in nessun punto della pagina (né 5, né il numero di anni del riquadro «per quanto tempo»); nessun totale su più anni | La specifica lo vieta per un motivo fattuale, non stilistico: `costoAnnuoCent × 5` presuppone che il capitale resti fermo per cinque anni, cosa falsa per un prodotto di investimento. «Un numero giusto che racconta una cosa che non è vera è il difetto peggiore fra i due» |
| CF-11 | **Il paragone accanto al risultato è quello su 100 €, non la bolletta del telefono** — il terzo caso, per un input diverso da quello dell'esempio | `capitaleCent = 5.000.000` (50.000,00 €) · `costoAnnuoBp = 300` (3,00%) | `costoMensileCent = round(5.000.000×300/10.000/12) = round(150.000/12) = 12.500` (125,00 €). La stringa fissa «quanto una bolletta del telefono» **non compare** accanto a questo risultato calcolato (125,00 € non è il costo di una bolletta del telefono); compare **solo** dentro l'esempio lavorato con i numeri `1,50%`/`10.000 €`, come testo statico invariato. Accanto al risultato calcolato compare invece il paragone su 100 €: «su ogni 100 € che metti, 3,00 € l'anno se ne vanno in costi» | La specifica lo scrive per esteso: un paragone vero solo per un caso e falso per un altro non può essere una stringa fissa accanto al risultato. Questo caso, con un input diverso dall'esempio, è l'unico modo di accorgersi se qualcuno l'ha attaccata lì per abitudine |
| CF-12 | Nessun semaforo o punteggio sullo strumento — deroga dichiarata dalla specifica | il risultato renderizzato con tre valori diversi: `150,00 €` (C-01), `0,00 €` (CL-01), `100.000,00 €` (CL-02) | Stessa struttura, stesso colore, stessa classe per tutti e tre: nessuna variazione legata al valore del costo. Nessun colore di giudizio (verde/giallo/rosso) legato all'ampiezza del costo o alla riga dei sette numeri | `scrittura-e-accessibilita.md` raccomanda il semaforo come forma di default del sito: è facile applicarlo per abitudine proprio qui, dove la specifica lo vieta esplicitamente come deroga dichiarata («è l'unico punto del sito in cui il semaforo […] è vietato») |
| CF-13 | **La pagina non dice se firmare** | l'intera schermata, ogni stato | Nessuna riga, riepilogo o invito che orienti verso o lontano dalla firma; il blocco dei limiti in rosa lo dichiara esplicitamente («non dice se firmare») e nessun altro punto della pagina lo contraddice | La specifica lo chiama «il confine che questa funzionalità rischia di più»: la domanda «e allora, firmo?» arriva mentre la persona ha la penna in mano, il momento di massima pressione di tutto il sito |
| CF-14 | Le etichette dei riquadri non si riscrivono | le sei chiavi `foglioRiquadro*` | Testo identico, carattere per carattere, alle intestazioni di legge citate nella specifica — inclusa `Costi di gestione e altri costi amministrativi o di esercizio`, lunga e ostica | Chi confronta lo schermo con la carta deve ritrovare la riga identica; è l'unico punto della pagina in cui il testo non è dell'autore del sito, e riscriverlo per renderlo più semplice altererebbe il significato dell'informazione originale |
| CF-15 | Nessuna traccia dei dati digitati | si digitano `1,50` e `10000`, poi si guarda dove sono finiti | Niente in `localStorage`, `sessionStorage` o cookie; niente nella query string né nell'hash della rotta (`PERCORSO_FOGLIO`) | La specifica: «Non chiede e non conserva dati personali. Le due cifre digitate restano nella pagina […] e non vengono salvate» — stessa scelta già motivata per la `07` |
| CF-16 | Nessuna chiamata di rete | la schermata usata con il Wi-Fi spento | Funziona per intero: nessun `fetch`, nessuna risorsa remota, nessun caricamento di PDF o riconoscimento del testo (`src/ingest/` resta vuota) | Primo dei tre vincoli non negoziabili. Qui ancora più netto che altrove: la specifica dichiara che questa funzionalità «non ha nessun dato vivo, nessuna riga da aggiornare» |
| CF-17 | Formattazione italiana e unità | tutti i numeri a schermo (percentuale, importi, riga dei sette numeri) | Prodotti da `src/core/formatoIt.ts`, mai da `Intl`. Unità sempre accanto al valore, cifre tabulari, numeri allineati a destra dove in tabella | `Intl` cambia risultato su un runtime con ICU ridotto: il numero della slide deve essere identico su ogni macchina |
| CF-18 | Accessibilità di base | tastiera e lettura della schermata | Corpo ≥ 16px, contrasto ≥ 4,5:1, aree cliccabili ≥ 44px (i tre riquadri apribili), focus sempre visibile, ordine di tabulazione facsimile → percentuale → importo → risultato, nessuna informazione disponibile solo al passaggio del mouse, riga dei sette numeri come testo vero e non come immagine | Hackathon sull'inclusione: un'interfaccia inaccessibile è ciò che chi valuta nota prima di qualunque formula |
| CF-19 | La riga apribile riusa il contratto della `04`, con il tipo corretto | i tre riquadri apribili (`rischi`, `costi`, `tempo`) | `<button>` vero con `aria-expanded` e `aria-controls`, mai solo hover, bersaglio ≥ 44×44 px, nessun gesto obbligatorio, nessun limite di tempo. Il componente è tipizzato su «etichetta e valore **facoltativo**» (`RigaDocumento`), **non** su `VoceDocumento` (che richiede un importo): i riquadri di questa pagina hanno solo etichetta | La specifica lo segnala esplicitamente come decisione da prendere prima di `/implementa`: se il componente della `04` resta tipizzato su `VoceDocumento`, questa pagina non può riusarlo, e un secondo componente divergente è il rischio che la `05` ha già messo per iscritto altrove |
| CF-20 | Nessun contratto di dominio esteso o forzato | i tipi introdotti da questa funzionalità | `IngressoCostoFoglio`, `RisultatoCostoFoglio` e `MotivoRifiutoCosto` restano dentro `src/core/`, non in `types/`; `DocumentoUtente` e `Scenario` **non vengono estesi** e non vengono usati con importi a zero per simulare i riquadri senza numeri | La specifica lo vieta esplicitamente: forzare il facsimile dentro `VoceDocumento` con importi a zero piegherebbe un contratto per farci entrare una cosa che non è quella — lo stesso difetto che la `05` ha rifiutato di commettere sulla tassonomia |
| CF-21 | Navigazione invariata | arrivo alla pagina dall'area «Il futuro» e ritorno | «Torna alla home»/«indietro» nella stessa posizione fissata dalla `01`; la voce nuova non rompe i test sulle altre aree | Una voce nuova nella lista è il punto in cui un conteggio derivato può disallinearsi senza che nessuno se ne accorga finché non rompe un test su un'altra area |

---

## Referto

*Scritto da `tester` in **fase 2**, dopo aver implementato ed **eseguito** i
casi in `tests/accettazione/12-guida-al-foglio-prima-di-firmare.test.ts` e
`tests/lessico-foglio.test.ts`. Finché questa sezione è vuota, la fase 2 non è
stata fatta e la funzionalità non è finita.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
