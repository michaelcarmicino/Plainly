# 07 — casi di prova per «Quanto valgono davvero i miei soldi fra qualche anno»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/07-valore-dei-risparmi-nel-tempo.md` e **non dal codice**, che
> in questo momento è in scrittura e che non è stato letto.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», cioè il percorso
> nominale da mostrare in demo. Qui si scrive **cosa può andare storto**.
>
> **Formula, dalla specifica.** `moltiplicatore = (1 + inflazioneAnnuaBp / 10_000) ** anni`
> · `valoreRealeCent = Math.round(risparmioCent / moltiplicatore)`
> · `perditaCent = risparmioCent - valoreRealeCent`
> · `poterePerCentoEuroCent = Math.round(10_000 / moltiplicatore)`.
> Ogni risultato atteso qui sotto è ricalcolato a mano da questa formula, con
> l'aritmetica scritta accanto.
>
> **Tre punti su cui la specifica non decide**, segnalati e non indovinati:
> CL-18 (decimali oltre il centesimo), E-03 (la soglia oltre cui un importo è
> «troppo alto») e il conflitto fra «non conserva nulla» e «si torna indietro
> senza perdere i dati», affrontato in E-07.

## 1. Percorso nominale

*Pochi casi: quelli che devono funzionare sempre.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | Il caso verificato a mano nella specifica, quello che finisce nello screenshot | `risparmioCent = 1.000.000` · `inflazioneAnnuaBp = 200` · `anni = 5` | `1,02^5 = 1,1040808032` → `1.000.000 / 1,1040808032 = 905.730,81` → valore **905.731** cent · perdita **94.269** cent · potere **9.057** cent. A schermo: `9.057,31 €` e `90,57 €` | È il numero che va in demo e nella slide. Se cambia, la slide afferma una cifra che nessun test sostiene |
| C-02 | Che l'esponente sia davvero `anni` | `1.000.000` · `200` · `1` | `1,02^1 = 1,02` → `1.000.000 / 1,02 = 980.392,16` → valore **980.392** · perdita **19.608** · potere **9.804** | A un anno il moltiplicatore è il tasso nudo: un esponente sbagliato o fisso si vede qui e solo qui |
| C-03 | Che il paragone su 100 € non dipenda dall'importo della persona | due calcoli: `1.000.000 · 200 · 5` e `250.000 · 200 · 5` | `poterePerCentoEuroCent = 9.057` in entrambi; i valori reali invece differiscono (905.731 e 226.433) | Il paragone è «su ogni 100 €», non una proporzione della somma digitata. Se scala con l'importo, la frase a schermo dice una cosa e il numero un'altra |
| C-04 | Che i tre numeri a schermo tornino fra loro | qualunque terna valida | `valoreRealeCent + perditaCent = risparmioCent` **esattamente**, senza scarti di un centesimo | Chi rifà il conto con la calcolatrice del telefono è esattamente il tipo di persona per cui il sito esiste. Un centesimo che non torna distrugge la fiducia nell'intera schermata |

## 2. Casi limite e valori di confine

*Zero, negativi, importi molto grandi, campi vuoti, confini dell'intervallo,
arrotondamento.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | `anni = 0` resta calcolabile nel core | `1.000.000` · `200` · `0` | `1,02^0 = 1` → valore **1.000.000** (identico) · perdita **0** · potere **10.000** | La specifica lo chiede al core, ma l'ingresso dell'interfaccia è 1–30: è la tensione dichiarata. Se la funzione rifiuta 0, il vincolo dell'interfaccia è entrato nel calcolo e la funzione non è più pura |
| CL-02 | Confine basso ammesso dall'interfaccia | `anni = 1` | Accettato, nessun messaggio di errore, valore **980.392** | Un intervallo si prova dai bordi: `1` è dentro, e un `>` al posto di `>=` lo escluderebbe in silenzio |
| CL-03 | Confine alto ammesso dall'interfaccia | `1.000.000` · `200` · `30` | `1,02^30 = 1,8113615841` → `1.000.000 / 1,8113615841 = 552.070,89` → valore **552.071** · perdita **447.929** · potere **5.521** | È il bordo superiore, ed è l'unico caso della tabella in cui la parte decimale è vicina al mezzo centesimo: un troncamento invece di un arrotondamento darebbe 552.070 |
| CL-04 | `inflazioneAnnuaBp = 0`: nessuna erosione | `1.000.000` · `0` · `5` | Moltiplicatore `1` → valore **1.000.000** · perdita **0** · potere **10.000** | È il caso in cui la schermata non ha niente da raccontare. Se il testo dice comunque che i soldi valgono meno, il testo è scollegato dal numero che lo accompagna |
| CL-05 | Tasso lontano da quello dichiarato | `1.000.000` · `1.000` (10%) · `30` | `1,10^30 = 17,4494022689` → `1.000.000 / 17,4494 = 57.308,55` → valore **57.309** · perdita **942.691** · potere **573** | Il tasso è un parametro e la costante si aggiorna a mano: un giorno sarà diversa da 200. La funzione deve reggere valori lontani senza NaN né Infinity |
| CL-06 | Tasso estremo: il paragone si azzera | `1.000.000` · `5.000` (50%) · `30` | Moltiplicatore `191.751,06` → valore **5** cent · `poterePerCentoEuroCent = 0` → a schermo `0,00 €` su 100 € | Il numero è corretto ma la frase smette di spiegare. Serve sapere che la schermata regge un paragone azzerato invece di stampare `NaN` o una frase monca |
| CL-07 | Zero euro è un numero valido, non un campo vuoto | `risparmioCent = 0` · `200` · `5` | Valore **0** · perdita **0** · potere **9.057** · nessun errore | Zero e «non ho ancora scritto» sono due stati diversi (CL-08). Se coincidono, chi digita 0 vede un messaggio di errore per un numero che ha scritto apposta |
| CL-08 | Campo somma mai toccato | nessun input | **Stato vuoto**: la schermata dice che cosa serve inserire. Nessun messaggio di errore, nessun `0,00 €` a schermo | Chi non ha ancora scritto niente non ha sbagliato niente. Un messaggio di errore su un campo intoccato fa sentire in colpa proprio la persona che il prodotto non deve far sentire ignorante |
| CL-09 | Campo svuotato dopo aver digitato | `10.000` → cancellato carattere per carattere | Si torna allo **stato vuoto**. Il risultato precedente **sparisce**: nessun `9.057,31 €` rimasto a schermo | È il difetto più insidioso della schermata: una cifra che sopravvive all'input che l'ha generata resta lì con l'aria di essere ancora vera |
| CL-10 | **L'arrotondamento avviene una volta sola, alla fine** | `risparmioCent = 10.000` (100 €) · `200` · `20` | `1,02^20 = 1,4859473960` → `10.000 / 1,4859473960 = 6.729,71` → **6.730**. Un calcolo che arrotonda al centesimo a ogni anno arriva invece a **6.728** | Due centesimi di differenza sono la prova che nessun importo intermedio viene conservato come valore arrotondato, come la nota sull'aritmetica della specifica richiede. È il caso più difficile da inventare a posteriori |
| CL-11 | Controllo incrociato fra le due formule | `risparmioCent = 10.000` (100 €) · `200` · `5` | `valoreRealeCent = 9.057` e `poterePerCentoEuroCent = 9.057`: **identici**, perché 100 € sono 10.000 cent | Su 100 € le due formule devono coincidere per costruzione. Se divergono, una delle due ha il `10_000` nel posto sbagliato, ed è un difetto che su ogni altro importo resta invisibile |
| CL-12 | Importo minimo: erosione senza perdita apprezzabile | `risparmioCent = 1` · `200` · `5` | `1 / 1,1040808032 = 0,906` → valore **1** · perdita **0** · potere **9.057** | La perdita è zero pur essendoci erosione. La schermata deve poter dire che non c'è perdita apprezzabile senza affermare che l'inflazione non esiste |
| CL-13 | Che il paragone non sia una proporzione dell'importo | `risparmioCent = 3` · `200` · `5` | valore **3** (perdita 0) ma potere **9.057**, non 10.000 | Se il paragone fosse ricavato dal rapporto fra valore e somma, qui direbbe «restano 100 € su 100 €»: la schermata negherebbe l'inflazione proprio nel caso in cui l'arrotondamento la nasconde |
| CL-14 | Importo a sette cifre in euro | `100.000.000` cent (1.000.000,00 €) · `200` · `30` | valore **55.207.089** cent = `552.070,89 €` · perdita `447.929,11 €` | È il caso che rompe la griglia: `552.070,89 €` è il numero grande più largo che la schermata deve reggere senza mandarlo a capo né restringere il corpo sotto i 16px |
| CL-15 | Importo a otto cifre in euro | `1.000.000.000` cent (10.000.000,00 €) · `200` · `30` | valore **552.070.889** cent = `5.520.708,89 €` · nessun overflow (resta sotto il limite degli interi sicuri) | Nove caratteri di cifre più i separatori: se il layout regge qui, regge ovunque. E conferma che l'aritmetica su interi grandi non perde precisione |
| CL-16 | **Separatori italiani nel campo somma** | `10.000,00` | Letto come **1.000.000 cent** → `9.057,31 €` | È il modo in cui un italiano scrive diecimila. Una lettura all'inglese darebbe 10,00 € e la schermata mostrerebbe `9,06 €`: sbagliato di tre ordini di grandezza, ma abbastanza plausibile da non insospettire nessuno |
| CL-17 | Le altre forme dello stesso numero | `10.000` · `10000` · `10 000` · `€ 10.000` | Tutte lette come **1.000.000 cent**, stesso risultato di CL-16 | Nessuno scrive due volte lo stesso numero nello stesso modo, e chi ricopia dall'estratto conto porta dentro il simbolo e gli spazi |
| CL-18 | La virgola è il separatore decimale | `10,5` | Letto come **1.050 cent** → `1.050 / 1,1040808032 = 951,02` → valore **951** cent (`9,51 €`) | Se la virgola viene ignorata, 10,5 diventa 105 e il risultato decuplica. È lo stesso difetto di CL-16 visto dal lato opposto |
| CL-19 | Decimali oltre il centesimo | `10.000,555` | Un comportamento **dichiarato e visibile**: o un messaggio in linguaggio umano, o un arrotondamento al centesimo mostrato a schermo. **Non ammesso**: un risultato calcolato in silenzio su un numero che la persona non ha scritto | La specifica definisce l'ingresso come intero in centesimi ma non dice che fare del terzo decimale. Qualunque sia la scelta, chi legge deve vederla: un dominio che accetta solo centesimi e un campo che accetta millesimi si incontrano qui |
| CL-20 | **`anni` con decimali** | `5,5` nel campo anni | Nessun calcolo con esponente frazionario: messaggio in linguaggio umano (dettaglio in E-05) | La formula accetterebbe 5,5 senza protestare e restituirebbe un numero credibile (`1,02^5,5 = 1,1150`). È il punto in cui un vincolo scritto solo nella tabella degli input sparisce nel codice |
| CL-21 | Che la schermata descriva un'erosione, non una crescita | stessa somma a `5`, `10`, `30` anni con `200` bp | `905.731 > 820.348 > 552.071`, sempre **minori** di 1.000.000, con `perditaCent` **mai negativa** | Una moltiplicazione al posto di una divisione produce numeri plausibili e crescenti, e ogni caso preso da solo sembrerebbe coerente. Solo il confronto fra due durate lo smaschera |

## 3. Errori attesi

*Cosa succede quando l'input non è valido, e **come lo vede la persona**. Un
errore corretto mostrato male resta un difetto.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Testo al posto di un numero | `diecimila` nel campo somma | Messaggio in linguaggio umano **accanto al campo somma**, con un esempio di che cosa scrivere. Mai «errore di validazione nel campo input». Il messaggio è legato al campo (`aria-describedby`), non un avviso generico in cima alla pagina | Con due campi a schermo, un errore che non dice quale dei due riguarda costringe a indovinare. E chi usa uno screen reader non lo sente affatto se non è legato al campo |
| E-02 | Importo negativo | `-5.000` | Messaggio in linguaggio umano, **nessun risultato**. Mai un «valore reale» negativo né una perdita negativa | La formula su un importo negativo produce una perdita negativa, cioè una schermata che dice a una persona che ha guadagnato. È il difetto più imbarazzante possibile in una funzionalità che parla di erosione |
| E-03 | Importo oltre ogni misura | `1.000.000.000.000` € | La frase della specifica: «Controlla questo numero, sembra troppo alto». **La soglia va dichiarata**: la specifica non la fissa, ma copre importi a sette e otto cifre (CL-14, CL-15), che quindi restano validi | La specifica cita testualmente questo messaggio come modello del tono. Se la schermata non lo usa dove serve, il modello resta una citazione in un documento |
| E-04 | `anni = 0` digitato nel campo | `0` | Messaggio in linguaggio umano sul campo anni; il risultato precedente **non resta** a schermo | È la tensione dichiarata nella specifica: il core calcola `anni = 0` e restituisce la somma identica. Se il vincolo 1–30 vive solo nel core, `0` passa e la schermata dice «fra 0 anni i tuoi soldi valgono quanto oggi»: vero, e inutile |
| E-05 | Fuori dall'intervallo, e non intero | `31` · `-3` · `cinque` · `5,5` | Messaggio che **dice l'intervallo ammesso** («da 1 a 30 anni»), non soltanto che il valore non va bene. Nessun calcolo eseguito | Un errore che non dice qual è l'intervallo buono obbliga a tentare. Su un target che ha poca pazienza, il secondo tentativo spesso non arriva |
| E-06 | Il vincolo 1–30 non vive solo negli attributi del campo | valore fuori intervallo incollato o inserito da tastiera, non con le frecce | Stesso rifiuto di E-05 | `min` e `max` su un campo numerico non fermano ciò che viene incollato. Se il controllo è solo lì, il confine esiste solo per chi usa le frecce |
| E-07 | I dati digitati non si perdono | somma valida `10.000` + anni sbagliato `31`; poi si corregge l'anno | La somma `10.000` è **ancora nel campo**; simmetricamente, correggendo la somma gli anni restano. Nessun campo viene svuotato da un errore sull'altro | L'accessibilità lo chiede esplicitamente, e chi ha digitato sette cifre non le ridigita. Va letto insieme alla promessa «non conserva dati»: qui non si conserva niente fuori dalla pagina, si evita solo di cancellare ciò che la persona sta guardando |
| E-08 | L'errore si capisce senza vedere il colore | qualunque input non valido | Il messaggio è **testo leggibile**, non solo un bordo rosso. Corpo ≥ 16px, contrasto ≥ 4,5:1 | Il colore da solo esclude chi non lo distingue e sparisce al proiettore. Un errore comunicato solo dal bordo è un errore che per qualcuno non c'è |
| E-09 | Errore e stato vuoto sono distinguibili a colpo d'occhio | schermata vuota (CL-08) a confronto con schermata in errore (E-01) | Due messaggi diversi, riconoscibili senza leggerli per intero | «Non hai ancora scritto» e «quello che hai scritto non va» richiedono due azioni diverse. Se si assomigliano, la persona non sa se deve correggere o cominciare |
| E-10 | Nessun rimprovero mentre si sta ancora digitando | `1` → `10` → `10.` → `10.0` → `10.000` | Nessun messaggio di errore compare sui valori intermedi di una digitazione in corso | Un messaggio che appare a metà numero insegna a ignorare i messaggi. E la regola del progetto è che non esiste limite di tempo: chi digita piano non va corretto mentre digita |

## 4. Conformità

*La suite esistente non viene riscritta qui: il lessico vive in
`src/guardrails/lessico.ts` ed è scandito da `tests/lessico-ui.test.ts`.
CF-01 e CF-02 **richiamano** quella copertura; da CF-03 in poi ci sono i casi
che quella suite **non** copre e che questa funzionalità introduce.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo sulle stringhe nuove | le 11 chiavi `simulazioneRisparmio*` in `src/ui/testi.ts` | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico | Richiamo alla suite esistente: duplicare qui l'elenco dei termini farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Identificatori del codice | nomi di funzioni, tipi e componenti introdotti da questa funzionalità | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Stesso richiamo. Il vincolo vale anche dove l'utente non legge, perché i nomi sopravvivono più a lungo dei testi |
| CF-03 | **Il confine dell'«e allora?»: strumenti finanziari** | le 11 stringhe nuove | Nessuna nomina `conto`, `deposito`, `fondo`, `titolo`, `obbligazione`, `azione`, `polizza`, `rendimento`, `alternativa` | La specifica chiama questo «il confine più facile da sfondare». Nessuna di queste parole è nel lessico dei guardrail: qui il controllo **non esiste ancora** e va aggiunto per questa funzionalità, senza toccare il lessico generale |
| CF-04 | **Il confine dell'«e allora?»: azioni sui soldi** | le 11 stringhe nuove | Nessuna frase che indichi cosa fare della somma: né «spostare», né «impiegare», né «muovere», né un «ti costa tenerli fermi». La schermata descrive un'erosione e si ferma | «Tenerli fermi ti costa 942,69 €» passa il lessico parola per parola ed è comunque un giudizio su una scelta. Serve la rilettura umana di `guardrail-officer` prima del merge: è il caso che nessuna regex trova |
| CF-05 | Il tasso è dichiarato, con fonte e periodo | il modulo della costante e la schermata | Il tasso usato compare **accanto al risultato**, con fonte e periodo su cui è calcolato. Se la costante è ancora un segnaposto senza fonte, il numero **non** viene presentato come un fatto | La specifica lo dichiara «blocco da sciogliere, non un dettaglio». Un tasso senza provenienza è esattamente il difetto che questa funzionalità esiste per non commettere |
| CF-06 | «Non è una previsione» sta a schermo | la schermata al primo caricamento del risultato | Visibile senza scorrere fino in fondo e senza passaggio del mouse | La specifica scrive testualmente «sta scritto a schermo, non in una nota a piè di pagina». Una proiezione scambiata per previsione è un'alterazione del significato, non una sfumatura |
| CF-07 | Ogni numero ha il suo paragone | il risultato di C-01 | `9.057,31 €` non compare mai da solo: accanto c'è «su ogni 100 € ne resta il valore di 90,57 €» | È la regola di scrittura che nessun test automatico copre. Una cifra nuda non lascia traccia, e questa schermata esiste per lasciare una traccia |
| CF-08 | Formattazione italiana e unità | tutti i numeri a schermo | Prodotti da `src/core/formatoIt.ts`, mai da `Intl`. Forma `9.057,31 €` con l'unità accanto al valore, cifre tabulari, numeri allineati a destra | `Intl` cambia risultato su un runtime con ICU ridotto: il numero della slide deve essere identico su ogni macchina, compresa quella del proiettore |
| CF-09 | Nessuna chiamata di rete | la schermata usata con il Wi-Fi spento | Funziona per intero. Il tasso arriva da una costante, non da un `fetch`; nessun font o risorsa remota nella pagina. Il controllo sul bundle è quello già esistente, richiamato e non riscritto | È il primo dei tre vincoli non negoziabili, e la demo si fa offline |
| CF-10 | Nessuna traccia della cifra digitata | si digita `10.000` e `5`, poi si guarda dove è finita | Niente in `localStorage`, `sessionStorage` o cookie; **niente nella query string né nell'hash della rotta** | La specifica promette che la cifra non viene salvata da nessuna parte. Con le rotte a hash, l'hash è il posto in cui il dato finirebbe senza che nessuno l'abbia deciso — e resterebbe nella cronologia del browser |
| CF-11 | I quattro stati obbligatori esistono tutti | la schermata | Vuoto (CL-08), spazio del risultato già occupato prima del calcolo, errore (E-01), dati lunghi (CL-14): tutti e quattro raggiungibili | Una schermata che esiste solo nel caso perfetto non è finita, ed è sempre il caso perfetto quello che si prova per primo |
| CF-12 | Il layout non salta quando il numero arriva | dallo stato vuoto al risultato | Il riquadro del risultato occupa già il suo spazio: nessuno spostamento del contenuto sottostante | È lo stato «in caricamento» della specifica, e l'unico che si nota solo se lo si cerca apposta. Un salto di layout sposta ciò che la persona stava per toccare |
| CF-13 | Accessibilità di base della schermata | tastiera e lettura | Corpo ≥ 16px, contrasto ≥ 4,5:1 su ogni testo, aree cliccabili ≥ 44px, focus sempre visibile, ordine di tabulazione somma → anni → risultato, nessuna informazione disponibile solo al passaggio del mouse | Siamo a un hackathon sull'inclusione: un'interfaccia inaccessibile è ciò che chi valuta nota prima di qualunque formula |
| CF-14 | La navigazione non cambia posizione | arrivo alla schermata dalla home e ritorno | «Torna alla home» e «indietro» nella stessa posizione delle altre schermate, fissata da `01` | Menu che si spostano fra una pagina e l'altra sono il punto in cui il target di questo prodotto si perde, e una schermata nuova è esattamente dove succede |

---

## Referto

*Sarà compilato da `tester` in **fase 2**, dopo aver implementato in
`tests/accettazione/07-valore-dei-risparmi.test.ts` ed **eseguito** i casi qui
sopra. Finché questa sezione è vuota, la fase 2 non è stata fatta e la
funzionalità non è finita.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
