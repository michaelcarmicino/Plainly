# 10 — casi di prova per «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/10-simulatore-rata-mutuo-fisso-variabile.md` e **non dal
> codice**, che in questo momento non esiste ancora.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», cioè il percorso
> nominale da mostrare in demo (i «dieci secondi» della sezione «Come si
> dimostra che ha funzionato» nella stessa spec). Qui si scrive **cosa può
> andare storto**.

## Formula, dalla sezione «Elaborazione» della specifica

```
n = anni × 12
i = tassoAnnuoBp / 120_000
crescita = (1 + i) ** n
rataGrezza = capitaleCent × (i × crescita) / (crescita − 1)
rataCent = Math.round(rataGrezza)          — l'unico arrotondamento
tassoAnnuoBp === 0  ⇒  rataCent = Math.round(capitaleCent / n)   — degenerazione dichiarata
```

Confronto (aritmetica intera sulle rate già arrotondate):

```
differenzaMensileCent    = rataFissaCent − rataVariabileOggiCent
differenzaSu12MesiCent   = differenzaMensileCent × 12
tassoIpotesiBp           = max(0, tassoVariabilePartenzaAnnuoBp + scartoBp)
rataIpotesiCent          = passi 2–6 su tassoIpotesiBp
differenzaMensileVsOggiCent = rataIpotesiCent − rataVariabileOggiCent   (× 12 per l'anno)
```

Valori di prova dichiarati dalla specifica stessa (caso di riferimento, già
verificato a mano lì): `capitaleCent = 15.000.000` (150.000,00 €),
`anni = 25`, `tassoFissoAnnuoBp = 346` (3,46 %),
`tassoVariabilePartenzaAnnuoBp = 280` (2,80 %). Scarti della scala:
`-100, 0, +100, +200` bp. Limiti dei campi: `ANNI_MUTUO_MIN = 1`,
`ANNI_MUTUO_MAX = 40`, `CAPITALE_MUTUO_MAX_CENT = 200.000.000`,
`TASSO_MUTUO_MAX_BP = 2.000`.

Ogni risultato atteso qui sotto è ricalcolato a mano da questi passi, con
l'aritmetica scritta accanto, e poi **ricontrollato con uno script
usa-e-getta** (Node, doppia precisione IEEE-754 — la stessa aritmetica che
girerà in produzione) prima di essere trascritto: lo script non sostituisce
il calcolo a mano richiesto dallo standard di codice, lo controlla. Con
un'esponenziale in mezzo, un errore di trascrizione sul decimo decimale è
concreto quanto quello che questi casi vogliono scovare nel codice.

## Quattro punti su cui la specifica non decide, o su cui l'ingresso
## dichiarato non può raggiungere ciò che il calcolo definisce — segnalati,
## non indovinati

1. **`anni = 0` non è la stessa cosa di `tassoAnnuoBp = 0`, e la specifica
   degenera solo il secondo.** Con `anni = 0`, `n = 0`: `crescita = (1+i)⁰ = 1`
   per qualunque tasso, quindi il denominatore del passo 4
   (`crescita − 1`) è **zero** mentre il numeratore resta diverso da zero (a
   meno che anche il tasso sia zero). Il risultato non è un `NaN` innocuo: è
   `Infinity`, verificato con lo script (`Math.round(Infinity) === Infinity`).
   La specifica scrive un solo ramo di degenerazione — quello sul tasso — e
   non dice nulla su `n = 0`. A differenza della `07`, dove `anni = 0` nel
   core è innocuo (il moltiplicatore diventa 1 e il valore torna identico),
   qui **non lo è**: è un'esponenziale con base diversa da zero elevata a
   zero che azzera il denominatore, non il numeratore. CL-01 costruisce
   questo caso e lo segnala come rischio concreto, non come ipotesi
   accademica: se la funzione pura viene chiamata con `anni = 0` prima che il
   controllo di intervallo (`ANNI_MUTUO_MIN = 1`) sia passato — lo stesso
   ordine che l'E-05 della `08` richiede esplicitamente per le mensilità — il
   risultato è una cifra infinita, non un errore leggibile.
2. **Nessun codice di rifiuto dichiarato per un capitale negativo.** La
   specifica elenca tre codici per il capitale — `capitale-non-leggibile`,
   `capitale-a-zero`, `capitale-troppo-alto` — nessuno dei quali descrive un
   valore negativo. È lo stesso tipo di lacuna già segnalato dalla `08`
   (CL-17, minimo non dichiarato) e dalla `07` (CL-19, decimali oltre il
   centesimo): non è indovinabile quale dei tre codici esistenti si applichi
   a `-50.000` cent, perché nessuno dei tre lo descrive con precisione — non
   è illeggibile, non è zero, e non è troppo alto. CL-13 e E-04 lo mettono
   alla prova da due lati (core puro e campo digitato).
3. **Nessun minimo positivo dichiarato per il capitale.** Stessa lacuna della
   `08` (CL-17, sul lordo mensile): la tabella dei limiti dichiara solo
   `CAPITALE_MUTUO_MAX_CENT`. Un capitale di un centesimo non ricade in nessuno
   dei tre codici di rifiuto e andrebbe quindi accettato — pur non avendo
   alcun senso come prestito. CL-08 lo mette alla prova.
4. **«Durata di un mese» non è raggiungibile, né dal campo né dalla funzione
   pura.** Il mandato di questa lista la cita fra i casi limite, ma
   `n = anni × 12` con `anni` intero: il valore minimo di `n` ottenibile è
   **12** (`anni = 1`), non 1. Non esiste alcun percorso — né il campo
   dichiarato, né una chiamata diretta alla funzione con lo stesso parametro
   `anni` che il test unitario userà — che produca una durata di un solo mese:
   la funzione non accetta un `n` in mesi, accetta `anni` in anni interi. CL-05
   copre il confine minimo realmente raggiungibile (`anni = 1`, 12 rate) e
   segnala qui l'impossibilità di andare oltre, invece di inventare un
   ingresso che il codice non prevede.

## 1. Percorso nominale

*Il caso di riferimento verificato a mano nella specifica stessa, la sua
scala di ipotesi, e i due criteri che tengono insieme il numero e la sua
lettura visiva.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | Il caso di riferimento della specifica: quello che finisce in demo e nello screenshot dichiarato (`10-rata-mutuo.png`) | `capitaleCent = 15.000.000` (150.000,00 €) · `anni = 25` · `tassoFissoAnnuoBp = 346` · `tassoVariabilePartenzaAnnuoBp = 280` | `n = 300` · fermo: `i=0,0028833333…`, `(1+i)^300=2,3720518741`, grezza `74.772,131791` → **74.772** cent, **747,72 €** · che si muove oggi: `i=0,0023333333…`, `(1+i)^300=2,0121113658`, grezza `69.581,174744` → **69.581** cent, **695,81 €** · differenza mensile **5.191** cent (51,91 €) · differenza su 12 mesi **62.292** cent (622,92 €) | È il numero che finisce nello screenshot dichiarato dalla specifica: se cambia, la slide afferma una cifra che nessun test sostiene |
| C-02 | Che la scala delle quattro ipotesi generalizzi, e non sia cucita sul solo scarto a zero | lo stesso caso di C-01, scarti `-100, 0, +100, +200` bp sul tasso che si muove (280 bp di partenza) | `-100→180bp`: `(1+i)^300=1,5677834980`, grezza `62.127,780801` → **62.128** cent (621,28 €, arrotonda **per eccesso**) · `0→280bp`: identica a C-01, **69.581** cent · `+100→380bp`: `(1+i)^300=2,5818314238`, grezza `77.528,484254` → **77.528** cent (775,28 €, arrotonda **per difetto**) · `+200→480bp`: `(1+i)^300=3,3121793309`, grezza `85.949,544310` → **85.950** cent (859,50 €, arrotonda **per eccesso**) | La specifica stessa nota che «due delle cinque rate arrotondano per eccesso e tre per difetto»: un caso compiacente (tutti nella stessa direzione) non si accorgerebbe di un segno invertito nell'arrotondamento |
| C-03 | La quadratura interna: la riga «oggi» della scala coincide **esattamente** con la rata variabile mostrata sopra, e la differenza su 12 mesi è un multiplo esatto di quella mensile | il caso C-01 | La riga a scarto `0` bp nella scala (**69.581** cent) è **lo stesso numero, bit per bit**, della rata «che si muove oggi» mostrata affiancata alla rata fissa — stesso calcolo, due punti dello schermo. E `62.292 = 5.191 × 12` esattamente, nessun residuo di arrotondamento | Chi rifà il conto con la calcolatrice del telefono è esattamente la persona per cui il sito esiste. Due numeri che dovrebbero coincidere e non coincidono, o una moltiplicazione per 12 che non torna, distruggono la fiducia nell'intera schermata |
| C-04 | Le due rate restano leggibili per intero senza il passaggio del mouse, e nella stessa forma | il caso C-01, osservato senza muovere il mouse, su schermo touch e al proiettore | Le due etichette («il tasso fermo», «il tasso che si muove»), le due cifre in euro e la frase «al mese, per 300 mesi» sono scritte **sempre**, mai solo in un tooltip al passaggio del mouse | La specifica lo vieta esplicitamente nelle regole di interazione: nessuna informazione disponibile solo al hover. Con due numeri pensati per essere confrontati, nasconderne uno al tocco vuol dire che metà di chi guarda vede solo un'offerta |

## 2. Casi limite e valori di confine

*Zero, negativi, importi molto grandi, campi vuoti, i confini dei tre campi
numerici, e il punto in cui l'aritmetica pura smette di essere innocua.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | **`anni = 0` a livello di funzione pura — il denominatore va a zero, e non è il ramo che la specifica degenera** | `calcolaRataCent({ capitaleCent: 15.000.000, anni: 0, tassoAnnuoBp: 346 })` | `n = 0` → `crescita = (1+i)^0 = 1` → denominatore `crescita − 1 = 0`, numeratore diverso da zero → **`Infinity`**, verificato con lo script (`Math.round(Infinity) === Infinity`). Non deve mai raggiungere lo schermo: il controllo `ANNI_MUTUO_MIN = 1` deve intercettare `anni = 0` prima di chiamare questa funzione | È il caso più importante di questa lista, per il motivo della nota 1 in apertura: a differenza della `07`, dove `anni = 0` nel core è innocuo, qui il denominatore si azzera indipendentemente dal tasso |
| CL-02 | `tassoAnnuoBp = 0` su un solo binario, non su entrambi insieme | `capitaleCent = 15.000.000` · `anni = 25` (`n = 300`) · `tassoFissoAnnuoBp = 0`, tasso variabile invariato a `280` | Rata fissa = `Math.round(15.000.000 / 300)` = **50.000** cent, esatta. Rata variabile invariata, **69.581** cent. Differenza mensile `50.000 − 69.581 = −19.581` cent | La degenerazione deve funzionare anche quando solo uno dei due tassi è zero, non solo quando lo sono entrambi |
| CL-03 | **L'unico arrotondamento avviene al passo 5, mai prima** — dimostrato arrotondando `crescita` a 4 decimali prima di riusarla (comportamento sbagliato, per contrasto) | il caso C-01, tasso fermo (346 bp) | Corretto: `crescita = 2,37205187411341` → grezza `74.772,131791` → **74.772** cent. Con `crescita` arrotondata a 4 decimali (`2,3721`) prima di essere riusata: numeratore `102.593,325`, denominatore `1,3721`, grezza `74.771,026164` → **74.771** cent — un centesimo in meno, verificato con lo script | La specifica scrive che «nessun importo intermedio viene conservato come float»: qui la differenza fra farlo bene e arrotondare un fattore intermedio è un centesimo reale sul caso di riferimento stesso |
| CL-04 | Il confine minimo del campo anni | `capitaleCent = 15.000.000` · `anni = 1` (`n = 12`) · `tassoAnnuoBp = 346` | `(1+i)^12 = 1,0351540063`, grezza `1.273.550,740831` → **1.273.551** cent (12.735,51 €) | `ANNI_MUTUO_MIN = 1`: se il confronto fosse `>` invece di `>=`, il mutuo più breve possibile verrebbe respinto. È anche il valore minimo di `n` davvero raggiungibile — nota 4 in apertura |
| CL-05 | Il confine massimo del campo anni | `capitaleCent = 15.000.000` · `anni = 40` (`n = 480`) · `tassoAnnuoBp = 346` | `(1+i)^480 = 3,9828934808885`, grezza `57.749,344438` → **57.749** cent (577,49 €) | `ANNI_MUTUO_MAX = 40`: un mutuo a quarant'anni esiste in commercio, e il confronto dev'essere `<=`, non `<` |
| CL-06 | Il confine massimo del capitale, insieme al confine massimo di anni — il caso «dati lunghi» che deve reggere la griglia | `capitaleCent = 200.000.000` (2.000.000,00 €) · `anni = 40` (`n = 480`) · `tassoAnnuoBp = 346` | grezza `769.991,259168` → **769.991** cent (7.699,91 €) | Le due rate affiancate devono restare su una riga sola ciascuna anche con un numero a sette cifre in euro |
| CL-07 | Un capitale a otto cifre in centesimi, sotto il massimo — la fascia «grande ma non estrema» | `capitaleCent = 99.999.999` (999.999,99 €) · `anni = 25` · `tassoFissoAnnuoBp = 346` | grezza `498.480,873622` → **498.481** cent (4.984,81 €) | Un test che copre solo lo zero e il massimo lascia scoperta la fascia intermedia dove capita più spesso un capitale reale |
| CL-08 | Un capitale minimo positivo — un centesimo — a fronte di nessun minimo dichiarato (nota 3 in apertura) | `capitaleCent = 1` · `anni = 25` · `tassoAnnuoBp = 346` | grezza `0,004985` → **0** cent, `0,00 €` | Un prestito di un centesimo non ha senso economico, ma per la lettera della specifica andrebbe accettato: segnalato, non indovinato |
| CL-09 | Capitale a zero, a livello di funzione pura (non del campo, che lo rifiuta con `capitale-a-zero`) | `calcolaRataCent({ capitaleCent: 0, anni: 25, tassoAnnuoBp: 346 })` | grezza `0`, esatta → **0** cent | Come per l'`anni = 0` della `07` (sua CL-01): il campo rifiuta questo valore, ma la funzione pura deve restare definita anche qui |
| CL-10 | Il confine massimo del campo tasso, su entrambi i binari | `capitaleCent = 15.000.000` · `anni = 25` · `tassoAnnuoBp = 2.000` (20,00 %, `TASSO_MUTUO_MAX_BP`) | `(1+i)^300 = 142,4214451159`, grezza `251.767,765842` → **251.768** cent (2.517,68 €) | Un TAN al 20 % è alto ma non impossibile in teoria: il confine deve accettarlo esattamente |
| CL-11 | Un tasso ben oltre il massimo ammesso dal campo, a livello di funzione pura | `calcolaRataCent({ capitaleCent: 15.000.000, anni: 25, tassoAnnuoBp: 5.000 })` (50 %) | `(1+i)^300 = 208.271,616649`, grezza `625.003,000903` → **625.003** cent, nessun `NaN` né `Infinity` | Il campo respinge questo valore, ma la funzione pura deve restare definita e continua anche oltre il limite che l'interfaccia impone |
| CL-12 | Una durata di cinquant'anni, oltre il massimo del campo, a livello di funzione pura — a differenza di CL-01, qui l'aritmetica non si rompe | `calcolaRataCent({ capitaleCent: 15.000.000, anni: 50, tassoAnnuoBp: 346 })` (`n = 600`) | `(1+i)^600 = 5,6266300935`, grezza `52.598,056604` → **52.598** cent, nessun errore aritmetico | Allungare `n` non rompe mai la formula (il denominatore cresce, non si azzera), solo accorciarlo a zero lo fa. È la prova che il rischio reale è su un solo lato del dominio |
| CL-13 | Capitale negativo, a livello di funzione pura — a fronte di nessun codice di rifiuto dichiarato (nota 2 in apertura) | `calcolaRataCent({ capitaleCent: -15.000.000, anni: 25, tassoAnnuoBp: 346 })` | grezza `-74.772,131791` → **-74.772** cent | La funzione moltiplica per un fattore positivo: un capitale negativo produce una rata negativa. La funzione pura non deve fingere che sia un errore — non lo è aritmeticamente — ma il campo deve intercettarlo con un codice che oggi non esiste |
| CL-14 | Il tasso che si muove, oggi, è più alto di quello fermo — la differenza cambia segno | `capitaleCent = 15.000.000` · `anni = 25` · `tassoFissoAnnuoBp = 280` · `tassoVariabilePartenzaAnnuoBp = 346` (lo scambio esatto di C-01) | Rata fissa **69.581** cent, rata variabile **74.772** cent, differenza mensile `69.581 - 74.772 = -5.191` cent | La specifica non prevede alcun ordinamento fra i due tassi digitati: la schermata deve reggere il segno invertito senza cambiare registro o suggerire quale dei due sia il migliore — vedi CF-05 |
| CL-15 | La scala delle ipotesi tagliata a zero — uno scarto negativo porterebbe il tasso sotto zero | `capitaleCent = 15.000.000` · `anni = 25` · `tassoVariabilePartenzaAnnuoBp = 50` (0,50 %), scarti `-100, 0, +100, +200` bp | `-100 → max(0, 50-100) = 0` bp → degenerazione: **50.000** cent · `0 → 50` bp: grezza `53.200,489613` → **53.200** cent · `+100 → 150` bp: grezza `59.990,448935` → **59.990** cent · `+200 → 250` bp: grezza `67.292,510111` → **67.293** cent | Il passo 9 della specifica taglia esplicitamente a zero: con un tasso di partenza basso, questo non è un caso di laboratorio |
| CL-16 | Nessun campo ancora compilato | nessun input | **Stato vuoto**: la schermata dice quali quattro numeri servono e dove sono scritti sul foglio del preventivo, non «nessun risultato». Nessuna delle due rate mostra `0,00 €` | Uno zero al posto del vuoto direbbe «la rata è zero», un'affermazione falsa su un prestito non ancora descritto |
| CL-17 | Un blocco compilato, l'altro no | il blocco «il prestito» (capitale, anni) pieno, il blocco «i due tassi» ancora vuoto — o viceversa | Nessun calcolo parziale, nessun errore sul blocco non ancora toccato: resta l'estensione naturale dello stato vuoto | Con quattro campi in due blocchi, «un blocco pieno uno vuoto» esiste per forza. Trattarlo da errore punirebbe chi sta ancora leggendo il secondo numero dal foglio |
| CL-18 | Un campo si svuota dopo aver digitato | `capitaleCent` scritto come `150.000`, poi cancellato carattere per carattere | Si torna allo stato vuoto: il risultato precedente (747,72 € / 695,81 €) sparisce | Una cifra che sopravvive all'input che l'ha generata resta lì con l'aria di essere ancora vera |
| CL-19 | Decimali oltre il centesimo nel capitale, o oltre il centesimo di punto nel tasso — punto che la specifica non decide | `capitaleCent` digitato come `150.000,555` oppure un tasso digitato come `3,464` | Non indovinato: un comportamento dichiarato e visibile (arrotondamento mostrato, o messaggio in linguaggio umano). Non ammesso: un calcolo silenzioso su una cifra che la persona non ha scritto in quella forma | Stessa lacuna già segnalata dalla `07` (sua CL-19) e dalla `08` (sua CL-16) |
| CL-20 | Separatori italiani nel campo capitale | `150.000,00` oppure `150000` oppure `150 000` oppure `€ 150.000` | Tutte lette come **15.000.000 cent**, stesso risultato di C-01 | È il modo in cui un italiano scrive centocinquantamila. Chi ricopia dal preventivo porta dentro il simbolo dell'euro e gli spazi |

## 3. Errori attesi

*Cosa succede quando l'input non è valido, e come lo vede la persona che usa
il sito. Con quattro campi divisi in due binari di tasso che condividono gli
stessi codici di rifiuto (`tasso-non-leggibile`, `tasso-sotto-zero`,
`tasso-troppo-alto`), il rischio specifico di questa funzionalità è un
messaggio corretto nel codice ma legato al campo sbagliato sullo schermo.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Capitale a zero | `capitaleCent = 0` | Rifiuto `capitale-a-zero`, messaggio in linguaggio umano; nessun calcolo tentato | Un capitale a zero non descrive un prestito: va trattato come dato mancante, non come caso limite da calcolare |
| E-02 | Capitale sopra la soglia massima | `capitaleCent = 200.000.001` (un centesimo sopra `CAPITALE_MUTUO_MAX_CENT`) | Rifiuto `capitale-troppo-alto`, messaggio in linguaggio umano | Stesso bordo di CL-06, dal lato del rifiuto: se `<=` diventasse `<`, questo valore passerebbe per errore |
| E-03 | Testo al posto di un numero nel campo capitale | `centocinquantamila` nel campo capitale | Rifiuto `capitale-non-leggibile`, messaggio legato al campo capitale (`aria-describedby`), non un avviso generico in cima alla pagina | Con quattro campi a schermo, un errore che non dice quale riguarda costringe a indovinare, e chi usa uno screen reader non lo sente se non è legato al campo giusto |
| E-04 | Capitale negativo, digitato nel campo — a fronte di nessun codice dichiarato (nota 2 in apertura) | `capitaleCent = -50.000` | Non indovinato: la specifica non assegna nessuno dei tre codici esistenti a un capitale negativo. Comportamento atteso da dichiarare esplicitamente prima dell'implementazione, non da scoprire nel codice | Un capitale negativo non ha alcun significato su un mutuo, ma trattarlo con il codice sbagliato (per esempio `capitale-a-zero`) produrrebbe un messaggio che non descrive il problema vero |
| E-05 | Anni sotto il minimo | `anni = 0` | Rifiuto `anni-fuori-intervallo` **prima** di qualunque calcolo: nessun tentativo di chiamare la formula con `n = 0`, nessun `Infinity` a schermo | Collegato a CL-01: se questo controllo non blocca `anni = 0` prima della chiamata al core, la formula produce una rata infinita, non un errore |
| E-06 | Anni sopra il massimo | `anni = 41` | Rifiuto `anni-fuori-intervallo`, stesso messaggio, con l'intervallo dichiarato («da 1 a 40 anni») | Stesso bordo di CL-05, dal lato del rifiuto |
| E-07 | Anni non intero | `anni = 25,5` | Rifiuto `anni-non-interi`, messaggio diverso da quello di «fuori intervallo»: qui il problema è la forma, non la grandezza | Un mutuo si conta in anni interi: un messaggio che confonde «fuori intervallo» con «non è un numero intero» invita a correggere nella direzione sbagliata |
| E-08 | Tasso fisso sopra la soglia massima | `tassoFissoAnnuoBp = 2.001` | Rifiuto `tasso-troppo-alto`, messaggio legato **al campo del tasso fermo**, non a quello del tasso che si muove | Verifica che il messaggio si leghi al campo giusto quando è il tasso **fermo** a sbagliare |
| E-09 | Tasso variabile di partenza sopra la soglia massima | `tassoVariabilePartenzaAnnuoBp = 2.001`, tasso fermo valido | Rifiuto `tasso-troppo-alto`, messaggio legato **al campo del tasso che si muove**, distinto da E-08 | Stesso codice di errore di E-08 su un campo diverso: se il messaggio non specifica quale dei due tassi, chi legge non sa quale correggere — ed è il rischio dichiarato in apertura a questa sezione |
| E-10 | Tasso sotto zero, su uno dei due binari | `tassoFissoAnnuoBp = -10` | Rifiuto `tasso-sotto-zero`, messaggio legato al campo del tasso fermo | Un TAN negativo non è un caso limite da calcolare, è un errore di battitura: nessun calcolo tentato |
| E-11 | Testo al posto di un numero, su uno dei due tassi | `tre virgola quarantasei` nel campo del tasso fermo | Rifiuto `tasso-non-leggibile`, messaggio legato al campo del tasso fermo | Stesso schema di E-03, sul terzo e quarto campo della pagina |
| E-12 | I dati digitati non si perdono quando un campo è in errore, con quattro campi in gioco | capitale e anni validi, tasso fermo valido, tasso variabile con un errore di battitura (`due virgola ottanta`); poi si corregge solo quel campo | I tre campi già validi restano **esattamente come erano** mentre si corregge il quarto; nessun altro campo si svuota | Con quattro campi, l'accessibilità richiede che correggere l'ultimo non costringa a riscrivere i primi tre |
| E-13 | L'errore si capisce senza vedere il colore | qualunque input non valido fra E-01…E-11 | Il messaggio è testo leggibile, non solo un bordo rosso: corpo ≥16px, contrasto ≥4,5:1 | Il colore da solo esclude chi non lo distingue e sparisce al proiettore |
| E-14 | Errore e stato vuoto sono distinguibili a colpo d'occhio | schermata vuota (CL-16) a confronto con schermata in errore (E-03) | Due messaggi diversi, riconoscibili senza leggerli per intero | «Non hai ancora scritto» e «quello che hai scritto non va» chiedono due azioni diverse |
| E-15 | Nessun rimprovero mentre si sta ancora digitando | `1` → `15` → `150` → `150.000` nel campo del capitale | Nessun messaggio di errore sui valori intermedi di una digitazione in corso | Nessun limite di tempo è la regola del progetto: chi digita piano non va corretto mentre sta ancora scrivendo |

## 4. Conformità

*Questa è la sezione più importante di questa lista, non una formalità di
chiusura. Il documento d'origine chiedeva «fisso o variabile: quanto
rischio?» — la domanda «quale conviene», vietata dal vincolo di dominio. La
specifica l'ha riscritta come «le due rate affiancate, senza indicarne una»:
i casi qui sotto provano che la riscrittura regge nel codice, non solo nel
testo della spec. Il lessico generale (`src/guardrails/lessico.ts`,
`tests/lessico-ui.test.ts`) non basta da solo: nessuna delle sue radici copre
un condizionale ipotetico travestito da previsione, né una differenza di
stile fra due numeri che dovrebbero essere identici. CF-01 e CF-02
richiamano la suite esistente; da CF-03 in poi ci sono i vincoli specifici
di questa funzionalità.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo generale sulle chiavi nuove | le chiavi `rataMutuo*` in `src/ui/testiRataMutuo.ts`, incluse in `STRINGHE_UTENTE` via spread | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico generale | Richiamo alla suite esistente: duplicare qui l'elenco dei termini farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Identificatori del codice | nomi di funzioni, tipi e componenti introdotti (`rataMutuo.ts`, `confrontoRateMutuo.ts`, `ipotesiTassoVariabile.ts`, `PaginaRataMutuo.tsx`) | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Stesso richiamo. «Scegli» è già vietato e la specifica segnala esplicitamente che i due tassi si chiamano «fermo» e «che si muove», non «fisso» e «variabile», nelle etichette |
| CF-03 | **Le due rate sono identiche nella forma** — stessa dimensione, stesso colore, stesso peso | il markup e il CSS dei due riquadri delle rate, caso C-01 | I due numeri usano la stessa classe (o le stesse proprietà di stile computate): stessa dimensione del carattere, stesso colore, stesso peso tipografico, stesso ordine nel markup che segue l'ordine dei campi digitati, non un giudizio | La specifica lo chiama «il confine più facile da sfondare: basta far diventare una delle due cifre un po' più grande, e la schermata ha dato un parere senza scrivere una parola». È un test sul CSS/markup, non sul lessico: nessuna regex sulle stringhe lo trova |
| CF-04 | **Il rosa `#FF50A0` non compare su nessuna delle due rate** | il foglio di stile della pagina | Il colore rosa è usato **solo** nel blocco «che cosa questa pagina non fa»; le due rate, la loro etichetta e la differenza non lo usano in nessuna forma (testo, bordo, sfondo) | Il rosa significa «ciò che il prodotto non fa»: usarlo su una delle due rate sarebbe il semaforo che questa specifica esiste per non avere |
| CF-05 | **Nessun totale sull'intera durata**, per nessuna delle due rate | l'intera schermata, caso C-01 | Nessun numero uguale a `rataCent × n` (per esempio 74.772 × 300 = 22.431.600 cent) compare a schermo, né per la rata fissa né per quella variabile, in nessuna forma testuale | La specifica lo vieta esplicitamente e per entrambe le rate, non solo per quella variabile: affiancare un totale vero (fisso) a uno inventato (variabile) produrrebbe l'affermazione «questa costa meno» con l'aggravante di sembrare un fatto |
| CF-06 | **Nessun «se pensi che i tassi saliranno…»** — un condizionale che invita a farsi un'aspettativa e agire di conseguenza | le stringhe della scala delle ipotesi (`rataMutuoIpotesi*`) | Test scoped nuovo, `tests/lessico-rata-mutuo.test.ts` (sul modello di `tests/lessico-simulazione-risparmio.test.ts` e `tests/lessico-fonti.test.ts`): zero occorrenze di «se pensi», «se credi», «se sei convinto», «ti aspetti», «aspettati» in un contesto di previsione personale sul tasso | Nessuna radice del lessico generale copre questa forma: «pensi», «credi», «aspetti» non sono termini vietati altrove nel sito, dove sono vocabolario comune. Il rischio è specifico di questa pagina, come «conto»/«fondo» lo era per la `07` |
| CF-07 | **Le quattro righe della scala descrivono il meccanismo, non invitano a decidere** | le stesse stringhe di CF-06 | La frase che accompagna la scala usa la forma «quando quel tasso sale, la rata sale con lui» — un meccanismo — mai una forma che si rivolge a chi legge come a qualcuno che deve scegliere («tu dovresti», «per te conviene») | La specifica lo scrive testualmente: la frase «descrive il meccanismo... senza mai rivolgersi a chi legge come a qualcuno che deve decidere». È distinto da CF-06: lì il rischio è il condizionale ipotetico, qui è l'imperativo travestito da osservazione |
| CF-08 | **«Sono ipotesi, non pronostici» è a schermo, non in una nota** | la schermata al primo caricamento del risultato, caso C-01 | La frase (`rataMutuoIpotesiNonPrevisione`) è visibile **senza scorrere** e **senza passaggio del mouse**, nello stesso corpo del resto del testo (≥16px), accanto alla scala | La specifica lo scrive esplicitamente: «la frase sta a schermo accanto alla scala, non in una nota a piè di pagina». Una proiezione scambiata per previsione altera il significato dell'informazione, non è una sfumatura di tono |
| CF-09 | **Le formulazioni vietate non sopravvivono in un commento o in una citazione fra virgolette a caporale «»** | l'intero testo dei file toccati — `src/core/rataMutuo.ts`, `src/core/confrontoRateMutuo.ts`, `src/core/ipotesiTassoVariabile.ts`, `src/ui/PaginaRataMutuo.tsx`, `src/ui/testiRataMutuo.ts`, `src/ui/rotte.ts` — commenti compresi | Zero occorrenze in **tutto il testo** dei file, non solo nelle stringhe esportate: serve la scansione dell'intero file, come già fa la terza verifica di `tests/lessico-ui.test.ts` | Un test scoped che legge solo l'oggetto delle stringhe non vede un commento che spiega «qui non si dice quale conviene» citando fra virgolette la frase vietata per darsi ragione. È già successo, proprio nel file del guardrail (il commento su «preferibile»/«meglio» in `lessico.ts`) |
| CF-10 | Provenienza della scala di scostamenti, dichiarata o dichiarata mancante | il modulo che tiene `scartiIpotesiBp` e il flag `periodoDichiarato` | Finché `periodoDichiarato` resta `false`, la schermata mostra `rataMutuoIpotesiPeriodoMancante` e **non** presenta la scala come un fatto verificato. Se in futuro il flag diventa `true`, la schermata mostra invece fonte e periodo | Stesso schema già usato per il tasso di inflazione della `07` (sua CF-05): un dato senza provenienza dichiarata non va presentato come un fatto |
| CF-11 | **TAN, non TAEG — il confine dichiarato a schermo** | la schermata del risultato, caso C-01 | La frase (`rataMutuoTanNonTaeg`) è visibile senza scorrere: «quello che hai scritto è il solo interesse; sul contratto ci sono anche istruttoria, perizia e assicurazioni, che qui non entrano» | Tacere questa differenza altererebbe il significato del numero mostrato: la rata vera includerebbe altri costi che questo calcolo non tratta |
| CF-12 | Nessuna chiamata di rete | la schermata usata con il Wi-Fi spento, build di produzione | Funziona per intero: nessun `fetch`, nessuna risorsa remota nel bundle. I due tassi sono digitati dalla persona, la scala degli scarti è una costante dichiarata nel codice | Primo dei tre vincoli non negoziabili. Qui è anche il punto più tentante da violare: un aggiornamento automatico dell'Euribor «perché cambia ogni giorno» è esattamente il tipo di giustificazione che la specifica respinge in anticipo |
| CF-13 | Nessuna traccia dei quattro numeri digitati | si digitano `150.000`, `25`, `3,46`, `2,80`, poi si guarda dove sono finiti | Niente in `localStorage`, `sessionStorage` o cookie; niente nella query string né nell'hash della rotta | La specifica lo promette esplicitamente: «non finiscono nell'indirizzo del browser e non vengono salvate da nessuna parte». Con le rotte a hash, l'hash è il posto in cui un capitale e un tasso finirebbero nella cronologia del browser senza che nessuno l'abbia deciso |
| CF-14 | Formattazione italiana e unità | tutti i numeri a schermo (euro, punti percentuali) | Prodotti da `src/core/formatoIt.ts`, mai da `Intl`. Unità sempre accanto al valore (`747,72 €`, non `747,72` con l'euro nell'intestazione), cifre tabulari, numeri allineati a destra nella scala delle ipotesi | `Intl` cambia risultato su un runtime con ICU ridotto: il numero della slide deve essere identico su ogni macchina, compresa quella del proiettore |
| CF-15 | I quattro stati obbligatori sono tutti raggiungibili | la schermata | Vuoto (CL-16), in caricamento (CF-16), errore (E-03), dati lunghi (CL-06): tutti e quattro raggiungibili | Una schermata che esiste solo nel caso perfetto non è finita |
| CF-16 | Il layout non salta quando il risultato compare | dallo stato vuoto al risultato di C-01 | I due riquadri delle rate e le quattro righe della scala occupano già il loro spazio da vuoti: nessuno spostamento del contenuto, nessuna rotellina che gira | Il calcolo è immediato e locale, per esplicita dichiarazione della specifica: uno spinner qui sarebbe un movimento inventato per un'attesa che non esiste |
| CF-17 | Accessibilità di base | tastiera e lettura della schermata | Corpo ≥16px, contrasto ≥4,5:1, aree cliccabili ≥44px, focus da tastiera sempre visibile, ordine di tabulazione capitale → anni → tasso fermo → tasso che si muove → risultato, nessuna informazione disponibile solo al passaggio del mouse (vedi C-04) | Hackathon sull'inclusione: un'interfaccia inaccessibile è ciò che chi valuta nota prima di qualunque formula |
| CF-18 | La navigazione non cambia posizione | arrivo alla schermata dalla home e ritorno | «Torna alla home»/«indietro» nella stessa posizione fissata dalla `01`, su ogni pagina di questa funzionalità | Menu che si spostano fra una pagina e l'altra sono il punto in cui il target di questo prodotto si perde |

---

## Referto

*Sarà compilato da `tester` in **fase 2**, dopo aver implementato in
`tests/accettazione/10-rata-mutuo.test.ts` ed **eseguito** i casi qui sopra.
Finché questa sezione è vuota, la fase 2 non è stata fatta e la funzionalità
non è finita.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
