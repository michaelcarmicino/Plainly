# 09 — casi di prova per «Per quanti mesi bastano i soldi che ho da parte»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/09-mesi-coperti-dai-risparmi.md` e **non dal codice**, che in
> questo momento non esiste ancora.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», cioè il percorso
> nominale da mostrare in demo. Qui si scrive **cosa può andare storto**.
>
> **Formula, dalla specifica.** `giorniCoperti = floor(risparmiCent * 30 /
> speseMensiliCent)` · `mesiInteri = floor(giorniCoperti / 30)` ·
> `giorniResidui = giorniCoperti - mesiInteri * 30` ·
> `residuoUltimoMeseCent = risparmiCent - mesiInteri * speseMensiliCent`.
> Convenzione dichiarata: `GIORNI_PER_MESE = 30`. Arrotondamento **sempre per
> difetto** (`floor`, mai `round`). Ogni risultato atteso qui sotto è
> ricalcolato a mano da questi passi, con l'aritmetica scritta accanto, e ogni
> volta viene rifatta anche la controprova `residuoUltimoMeseCent * 30 /
> speseMensiliCent -> floor = giorniResidui` che la specifica chiede come
> proprietà verificabile.
>
> **Due punti su cui la specifica non decide**, segnalati e non indovinati:
> CL-14 (i decimali oltre il centesimo nella cifra digitata: la 09, a
> differenza della 07, non definisce alcuna regola di lettura del campo) ed
> E-10 (il limite inferiore di `risparmiCent`: la tabella dei limiti fissa
> `RISPARMI_MAX_CENT` ma non un minimo esplicito oltre «0 non è un errore»; un
> valore negativo non è discusso da nessuna parte).

## Perché la sezione 4 conta più delle altre, qui

Il task originale — «simulatore del fondo di emergenza» — è stato **rifiutato**
al criterio 1: nome di un obiettivo, non di una misura, con dietro una soglia
«tre-sei mesi» che è insieme una raccomandazione personalizzata e un numero
senza fonte. La specifica che segue è la variante conforme, e i casi di
conformità qui sotto esistono per provare che il rifiuto **regge nel codice**,
non solo nel testo della specifica:

- **«fondo di emergenza» non compare da nessuna parte** — non a schermo, non
  nelle rotte, non negli identificatori, **non nei commenti** (CF-03, CF-05);
- **nessuna soglia**, nessun «abbastanza», «sufficiente», «obiettivo», «almeno
  N mesi» (CF-04);
- **nessun semaforo** verde/giallo/rosso: è una deroga dichiarata dalla
  specifica, non una dimenticanza (CF-06);
- **nessuna indicazione su che cosa fare** di quei soldi (CF-07, CF-08).

Il lessico generale (`src/guardrails/lessico.ts`) **non copre nessuna di
queste radici**: «abbastanza» e «obiettivo» non sono lì e oggi passerebbero
senza un test scoped dedicato, sul modello di
`tests/lessico-simulazione-risparmio.test.ts` e `tests/lessico-fonti.test.ts`.
E le formulazioni vietate sopravvivono nei commenti — l'hook di
`tests/lessico-ui.test.ts` li scandisce, comprese ora le citazioni fra
virgolette a caporale «» — ma **solo per il lessico generale**: un test scoped
che legge esclusivamente `STRINGHE_MESI_COPERTI`, come la specifica descrive,
non guarda dentro ai commenti degli altri file toccati. Questo è già successo
una volta, proprio nel file del guardrail. CF-05 esiste per questo.

## 1. Percorso nominale

*Pochi casi: quelli che devono funzionare sempre.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | Il caso di riferimento della specifica, quello che finisce in demo e nello screenshot | `speseMensiliCent = 120.000` (1.200,00 €) · `risparmiCent = 310.000` (3.100,00 €) | `giorniCoperti = floor(310.000*30/120.000) = floor(9.300.000/120.000) = floor(77,5) = 77` · `mesiInteri = floor(77/30) = 2` · `giorniResidui = 77-60 = 17` · `residuoUltimoMeseCent = 310.000-240.000 = 70.000` (700,00 €). A schermo: **«2 mesi e 17 giorni»**, scomposizione «2 mesi pagati per intero — 2.400,00 € — più 700,00 € che restano, cioè 17 giorni del mese dopo» | È il numero che va in demo e nella slide. Se cambia, la slide afferma una cifra che nessun test sostiene |
| C-02 | Che la formula generalizzi, non sia cucita sul solo caso di riferimento | `speseMensiliCent = 45.000` (450,00 €) · `risparmiCent = 201.000` (2.010,00 €) | `giorniCoperti = floor(201.000*30/45.000) = floor(6.030.000/45.000) = floor(134) = 134` · `mesiInteri = floor(134/30) = 4` · `giorniResidui = 134-120 = 14` · `residuoUltimoMeseCent = 201.000-180.000 = 21.000` (210,00 €); controprova `floor(21.000*30/45.000) = floor(14) = 14` ✓. Risultato: **«4 mesi e 14 giorni»** | Un solo caso di riferimento si può ottenere anche con un numero incollato nel posto giusto. Un secondo caso, con cifre non tonde e diverse in grandezza, è ciò che distingue un calcolo vero da un valore hardcoded |
| C-03 | Che i numeri a schermo tornino fra loro esattamente | il caso di riferimento (C-01) | `mesiInteri × speseMensiliCent + residuoUltimoMeseCent = risparmiCent` **esattamente**: `2×120.000+70.000 = 310.000` ✓. E `residuoUltimoMeseCent` convertito in giorni coincide con `giorniResidui`: `floor(70.000*30/120.000) = floor(17,5) = 17` ✓ | Chi rifà il conto con la calcolatrice del telefono è esattamente il tipo di persona per cui il sito esiste. Un centesimo o un giorno che non tornano distruggono la fiducia nell'intera schermata |

## 2. Casi limite e valori di confine

*Zero, spese superiori ai risparmi, confini dei campi, resto della divisione,
arrotondamento vicino a un confine.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | `risparmiCent = 0` è **un risultato, non un errore** | `speseMensiliCent = 120.000` · `risparmiCent = 0` | `giorniCoperti = 0` · `mesiInteri = 0` · `giorniResidui = 0` · `residuoUltimoMeseCent = 0`. A schermo: **«0 giorni»**, con la frase che spiega il conto e **nessun commento** su quella cifra, nessun messaggio di errore | È la differenza dichiarata rispetto alla 07, dove `somma = 0` è un rifiuto. Qui rifiutarlo sarebbe un giudizio mascherato da controllo: chi non ha nulla da parte ha comunque una risposta vera da ricevere |
| CL-02 | Spese superiori ai risparmi: «meno di un mese» | `speseMensiliCent = 120.000` · `risparmiCent = 50.000` (500,00 €) — caso di confine della specifica stessa | `giorniCoperti = floor(50.000*30/120.000) = floor(1.500.000/120.000) = floor(12,5) = 12` · `mesiInteri = 0` · `giorniResidui = 12` · `residuoUltimoMeseCent = 50.000`. A schermo: **«12 giorni»**, mai «0 mesi e 12 giorni» | La specifica fissa esplicitamente questa regola di resa. Un «0 mesi e 12 giorni» è tecnicamente corretto e comunque sbagliato da leggere |
| CL-03 | Il resto della divisione è esattamente zero | `speseMensiliCent = 100.000` (1.000,00 €) · `risparmiCent = 300.000` (3.000,00 €) | `giorniCoperti = floor(9.000.000/100.000) = 90` · `mesiInteri = 3` · `giorniResidui = 0` · `residuoUltimoMeseCent = 0`. A schermo: **«3 mesi»**, mai «3 mesi e 0 giorni» | Seconda regola di resa esplicita della specifica. Un resto a zero è il caso in cui è più facile lasciare per sbaglio «e 0 giorni» appeso alla frase |
| CL-04 | Un mese solo, al singolare, con un resto | `speseMensiliCent = 100.000` · `risparmiCent = 110.000` (1.100,00 €) | `giorniCoperti = floor(3.300.000/100.000) = 33` · `mesiInteri = 1` · `giorniResidui = 3` · `residuoUltimoMeseCent = 10.000` (100,00 €); controprova `floor(300.000/100.000)=3` ✓. A schermo: **«1 mese e 3 giorni»** | La specifica chiede il singolare per «un mese solo». Un plurale automatico («1 mesi») è il tipo di difetto che nessuno nota finché non lo legge ad alta voce |
| CL-05 | Un giorno solo, al singolare, ed è anche «meno di un mese» | `speseMensiliCent = 300.000` (3.000,00 €) · `risparmiCent = 10.000` (100,00 €) | `giorniCoperti = floor(300.000/300.000) = 1` · `mesiInteri = 0` · `giorniResidui = 1` · `residuoUltimoMeseCent = 10.000`; controprova `floor(300.000/300.000)=1` ✓. A schermo: **«1 giorno»**, non «0 mesi e 1 giorno» né «1 giorni» | Combina le due regole di resa più facili da rompere insieme: singolare e «meno di un mese» nello stesso numero |
| CL-06 | Vicino a un confine di arrotondamento: nessun doppio arrotondamento | `speseMensiliCent = 100.000` · `risparmiCent = 299.999` (2.999,99 €) | `giorniCoperti = floor(299.999*30/100.000) = floor(8.999.970/100.000) = floor(89,9997) = 89` · `mesiInteri = floor(89/30) = 2` (e **non** 3: la scorciatoia diretta `floor(299.999/100.000) = floor(2,99999) = 2` deve coincidere) · `giorniResidui = 29` · `residuoUltimoMeseCent = 99.999` (999,99 €); controprova `floor(99.999*30/100.000)=floor(29,9997)=29` ✓. Risultato: **«2 mesi e 29 giorni»** | `2,99999` arrotondato invece che troncato diventerebbe 3: un `Math.round` al posto di un `Math.floor` in un solo punto del codice produce «3 mesi e -1 giorno» o simili, ed è esattamente il tipo di errore che un solo caso di riferimento tondo non scopre mai |
| CL-07 | Confine massimo dei risparmi dichiarato dai campi | `speseMensiliCent = 120.000` · `risparmiCent = 1.000.000.000` (`RISPARMI_MAX_CENT`, 10.000.000,00 €) | `giorniCoperti = floor(30.000.000.000/120.000) = 250.000` (esatto) · `mesiInteri = floor(250.000/30) = 8.333` · `giorniResidui = 250.000-249.990 = 10` · `residuoUltimoMeseCent = 1.000.000.000-999.960.000 = 40.000` (400,00 €); controprova `floor(1.200.000/120.000)=10` ✓. Risultato: **«8.333 mesi e 10 giorni»**, nessun overflow | La specifica dichiara la soglia di sicurezza a mano (`1.000.000.000 × 30 = 3×10¹⁰` contro `Number.MAX_SAFE_INTEGER ≈ 9×10¹⁵`): è il bordo superiore ammesso dal campo, e va provato esattamente lì, non un ordine di grandezza sotto |
| CL-08 | L'esempio esplicito di «dati lunghi» della specifica | `speseMensiliCent = 50.000` (500,00 €) · `risparmiCent = 99.999.900` (999.999,00 €) | `giorniCoperti = floor(2.999.997.000/50.000) = 59.999` · `mesiInteri = floor(59.999/30) = 1.999` · `giorniResidui = 29` · `residuoUltimoMeseCent = 49.900` (499,00 €); controprova `floor(1.497.000/50.000)=29` ✓. Risultato: **«1.999 mesi e 29 giorni»** | La specifica lo scrive testualmente come il caso che rompe la griglia: «1.999» non si spezza mai da «mesi», e la riga non produce una barra di scorrimento orizzontale |
| CL-09 | Confine basso delle spese dichiarato dal campo | `speseMensiliCent = 1.000` (`SPESE_MENSILI_MIN_CENT`, 10,00 €) · `risparmiCent = 1.234` (12,34 €) | `giorniCoperti = floor(37.020/1.000) = 37` · `mesiInteri = 1` · `giorniResidui = 7` · `residuoUltimoMeseCent = 234` (2,34 €); controprova `floor(7.020/1.000)=7` ✓. Risultato: **«1 mese e 7 giorni»**, accettato senza errore | `1.000` è il valore esatto della soglia: se il confronto usa `>` al posto di `>=`, il valore minimo ammesso viene respinto in silenzio |
| CL-10 | Confine alto delle spese dichiarato dal campo | `speseMensiliCent = 10.000.000` (`SPESE_MENSILI_MAX_CENT`, 100.000,00 €) · `risparmiCent = 10.000.000` (100.000,00 €) | `giorniCoperti = floor(300.000.000/10.000.000) = 30` · `mesiInteri = 1` · `giorniResidui = 0` · `residuoUltimoMeseCent = 0`. Risultato: **«1 mese»**, accettato senza errore | Stesso bordo, dal lato opposto. Un numero tondo qui rende immediato verificare a mano che il confine sia incluso, non escluso |
| CL-11 | Nessun campo ancora toccato | nessun input | **Stato vuoto**: la schermata dice quali due numeri servono e dove scriverli. Nessuno zero, nessun risultato inventato, nessuna frase che anticipi un giudizio su quello che comparirà | Chi non ha ancora scritto niente non ha sbagliato niente. Uno zero al posto del vuoto direbbe «hai zero spese e zero risparmi», che è un dato falso |
| CL-12 | Un solo campo compilato | `speseMensiliCent` digitato · `risparmiCent` non ancora | La schermata resta in uno stato «in sospeso»: nessun calcolo parziale, nessun errore sul campo non ancora toccato. È l'estensione naturale dello stato vuoto descritto dalla specifica per i due campi insieme, non un caso a parte deciso qui | Con due campi il caso «uno pieno, uno vuoto» esiste per forza anche se la specifica descrive solo lo stato «nessuna cifra digitata» nel suo insieme. Trattarlo da errore punirebbe chi sta ancora scrivendo |
| CL-13 | Campo svuotato dopo aver digitato | `risparmiCent` digitato come `3.100`, poi cancellato carattere per carattere | Si torna allo **stato vuoto**. Il risultato precedente **sparisce**, non resta «2 mesi e 17 giorni» a schermo con un campo vuoto sotto | Una cifra che sopravvive all'input che l'ha generata resta lì con l'aria di essere ancora vera |
| CL-14 | Decimali oltre il centesimo nella cifra digitata — **punto che la specifica non decide** | `speseMensiliCent` digitato come `1.200,555` | Non indovinato: un comportamento **dichiarato e visibile** (arrotondamento al centesimo mostrato, oppure messaggio in linguaggio umano). **Non ammesso**: un calcolo silenzioso su un terzo decimale che la persona non ha scritto in quella forma | La specifica definisce l'ingresso come intero in centesimi ma, a differenza della 07 (che lo affronta esplicitamente in CL-19), non dice che fare del terzo decimale per questa funzionalità. Segnalato, non indovinato |

## 3. Errori attesi

*Cosa succede quando l'input non è valido, e **come lo vede la persona**. Un
errore corretto mostrato male resta un difetto.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Spese sotto la soglia minima del campo | `speseMensiliCent = 999` (9,99 €), un centesimo sotto `SPESE_MENSILI_MIN_CENT` | Messaggio in linguaggio umano accanto al campo spese («sembra un errore di battitura», tono della specifica), nessun calcolo eseguito | La specifica motiva questa soglia con l'errore di battitura, non con un limite aritmetico: il messaggio deve dirlo in quei termini, non con «valore non valido» |
| E-02 | Spese esattamente a zero — motivo aritmetico, non solo «sotto soglia» | `speseMensiliCent = 0` | Rifiuto, messaggio in linguaggio umano; nessun `Infinity`, nessun `NaN` a schermo, nessun calcolo tentato | La specifica separa esplicitamente questo caso dal precedente: qui il motivo è che le spese sono il divisore. Va provato da solo perché un controllo che verifica solo «sotto 1.000» potrebbe non essere lo stesso codice che protegge la divisione |
| E-03 | Spese sopra la soglia massima del campo | `speseMensiliCent = 10.000.001` (100.000,01 €), un centesimo sopra `SPESE_MENSILI_MAX_CENT` | Messaggio in linguaggio umano, «sembra troppo alto» — la frase che la specifica cita come modello del tono per l'errore generale | Stesso bordo di CL-10, dal lato del rifiuto: se `>=` diventa `>`, questo valore passerebbe per errore |
| E-04 | Risparmi sopra la soglia massima del campo | `risparmiCent = 1.000.000.001` (10.000.000,01 €), un centesimo sopra `RISPARMI_MAX_CENT` | Messaggio in linguaggio umano, «Controlla questo numero, sembra troppo alto» | Stesso bordo di CL-07, dal lato del rifiuto. La specifica cita questa frase testualmente: se non compare qui, resta una citazione senza uso |
| E-05 | Testo al posto di un numero | `milleduecento` nel campo spese | Messaggio in linguaggio umano **legato al campo spese** (`aria-describedby`), non un avviso generico in cima alla pagina; nessun calcolo | Con due campi a schermo, un errore che non dice quale dei due riguarda costringe a indovinare, e chi usa uno screen reader non lo sente affatto se non è legato al campo |
| E-06 | I dati digitati non si perdono | spese valide `1.200` + risparmi con errore di battitura `tremila`; poi si corregge il campo risparmi | Le spese `1.200` restano **ancora nel campo** mentre si corregge l'altro; simmetricamente, correggendo le spese i risparmi restano | L'accessibilità lo chiede esplicitamente. Chi ha digitato una cifra non deve riscriverla perché l'altro campo aveva un errore di battitura |
| E-07 | L'errore si capisce senza vedere il colore | qualunque input non valido fra E-01…E-05 | Il messaggio è **testo leggibile**, non solo un bordo rosso. Corpo ≥ 16px, contrasto ≥ 4,5:1 | Il colore da solo esclude chi non lo distingue e sparisce al proiettore |
| E-08 | Errore e stato vuoto sono distinguibili a colpo d'occhio | schermata vuota (CL-11) a confronto con schermata in errore (E-05) | Due messaggi diversi, riconoscibili senza leggerli per intero | «Non hai ancora scritto» e «quello che hai scritto non va» chiedono due azioni diverse. Se si assomigliano, la persona non sa se correggere o cominciare |
| E-09 | Nessun rimprovero mentre si sta ancora digitando | `1` → `1.2` → `1.20` → `1.200` nel campo spese | Nessun messaggio di errore sui valori intermedi di una digitazione in corso | La regola del progetto è che non esiste limite di tempo: chi digita piano non va corretto mentre sta ancora scrivendo |
| E-10 | Risparmi negativi — **punto che la specifica non decide** | `risparmiCent = -5.000` | Non indovinato: ci si attende un rifiuto in linguaggio umano, coerente con l'assenza di senso economico di un risparmio negativo, ma la specifica non fissa un limite inferiore esplicito oltre «0 non è un errore» né il testo del messaggio. Segnalato, non indovinato | La tabella dei limiti dichiara solo `RISPARMI_MAX_CENT`. Il caso opposto — un minimo — non è mai discusso, a differenza delle spese dove `SPESE_MENSILI_MIN_CENT` copre già lo zero e il negativo in un colpo solo |

## 4. Conformità

*Richiama la suite dei guardrail, non riscriverla. Qui la posta in gioco è più
alta che altrove: questa funzionalità esiste perché una formulazione vicina è
stata rifiutata, e questi casi provano che il rifiuto **regge nel codice**.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo generale sulle chiavi nuove | le chiavi di `STRINGHE_MESI_COPERTI` in `src/ui/testiMesiCoperti.ts`, incluse in `STRINGHE_UTENTE` via spread | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico generale | Richiamo alla suite esistente: duplicare qui l'elenco dei termini farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Identificatori del codice | nomi di funzioni, tipi, componenti e file introdotti da questa funzionalità | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Stesso richiamo. Il vincolo vale anche dove l'utente non legge, perché i nomi sopravvivono più a lungo dei testi |
| CF-03 | **«fondo di emergenza» assente da testi, rotta e identificatori** | tutte le chiavi di `STRINGHE_MESI_COPERTI`, la costante `PERCORSO_MESI_COPERTI`, e i nomi di funzioni/tipi/componenti di questa funzionalità | Test scoped `tests/lessico-mesi-coperti.test.ts` (sul modello di `tests/lessico-simulazione-risparmio.test.ts`) verde: zero occorrenze della radice «fondo di emergenza» e sue varianti minime («fondo per le emergenze», «fondo emergenze») | È precisamente ciò che il cancello ha rifiutato. Il lessico generale non contiene questa radice (verificato in `src/guardrails/lessico.ts`): senza un test scoped dedicato la frase può ricomparire senza che nessun controllo automatico se ne accorga |
| CF-04 | **Nessuna soglia o obiettivo numerico** | le stesse chiavi di CF-03 | Stesso file di test scoped, zero occorrenze di «abbastanza», «sufficiente», «obiettivo», «traguardo», «soglia», «dovresti avere», «almeno» in un contesto di soglia mensile, e di «tre mesi»/«sei mesi» usati come traguardo anziché come esempio del risultato calcolato | Sono le due violazioni che la formulazione originale combinava in una riga sola. Nessuna di queste radici è oggi nel lessico generale: «abbastanza» e «obiettivo» passerebbero senza questo test |
| CF-05 | **«fondo di emergenza» e le formulazioni di soglia non sopravvivono in un commento o in una citazione a caporale «»** | l'intero testo dei file toccati da questa funzionalità — `src/core/mesiCoperti.ts`, `src/ui/PaginaMesiCoperti.tsx`, `src/ui/testiMesiCoperti.ts`, `src/ui/rotte.ts` — commenti compresi | Zero occorrenze in **tutto il testo** dei file, non solo nelle stringhe esportate: serve una scansione dell'intero file, sul modello della terza verifica di `tests/lessico-ui.test.ts` (che scandisce letterali, JSX e citazioni a caporale), non il solo test scoped su `STRINGHE_MESI_COPERTI` che la specifica descrive | Un test scoped che legge solo l'oggetto delle stringhe non vede un commento che spiega «qui NON si chiama fondo di emergenza» citando la frase fra virgolette per darsi ragione. È già successo, sul file del guardrail stesso |
| CF-06 | **Nessun semaforo di giudizio** — deroga dichiarata dalla specifica | il risultato renderizzato con tre valori diversi: «2 mesi e 17 giorni» (C-01), «12 giorni» (CL-02), «0 giorni» (CL-01) | Stessa struttura, stesso colore, stessa classe per tutti e tre: nessuna variazione legata al valore. In particolare il numero **non** è mai in rosa (`#FF50A0`, riservato a limiti ed esclusioni per `design.md`) né in un rosso/verde estranei alla palette | Il semaforo è il pattern di default del sito (`.claude/rules/scrittura-e-accessibilita.md`): è facile applicarlo per abitudine proprio qui, dove la specifica lo vieta esplicitamente come deroga |
| CF-07 | Nessun prodotto finanziario nominato | le stesse chiavi di CF-03 | Nessuna occorrenza di «conto/conti», «deposito/depositi», «fondo/fondi» (come prodotto, non nella frase rifiutata già coperta da CF-03), «titolo/titoli», «polizza/polizze» | La specifica lo elenca alla lettera nel punto 7 di «cosa non fa». Diverso da CF-03: qui il bersaglio è il vocabolario di prodotto in generale, non la sola frase rifiutata |
| CF-08 | Nessuna indicazione su che cosa fare dei soldi | le stesse chiavi | Nessuna frase che indichi un'azione sulla somma — mettere da parte, versare, accumulare, spostare — né un giudizio implicito («tenerli fermi così» come problema) | La specifica lo scrive nella risposta di rifiuto stessa: «nessuna indicazione su che cosa fare di quei soldi». È un caso concettuale più che lessicale: serve la rilettura umana di `guardrail-officer`, non solo una regex |
| CF-09 | Le due ipotesi sono dichiarate a schermo, non in una nota | la schermata del risultato, caso C-01 | «Se da domani non entrasse più niente sul conto» e la convenzione delle spese ferme sono visibili **senza scorrere** e **senza passaggio del mouse**, accanto al numero | La specifica scrive che questa funzionalità «non è una previsione»: le due ipotesi che la rendono tale devono essere lette insieme al numero, non scoperte dopo |
| CF-10 | Nessuna traccia della cifra digitata | si digitano `1.200` e `3.100`, poi si guarda dove sono finite | Niente in `localStorage`, `sessionStorage` o cookie; niente nella query string né nell'hash della rotta (`PERCORSO_MESI_COPERTI`) | La specifica lo promette esplicitamente al punto 11. Con le rotte a hash, l'hash è il posto in cui il dato finirebbe senza che nessuno l'abbia deciso |
| CF-11 | La convenzione dei 30 giorni è dichiarata, non nascosta | la schermata del risultato | Il testo «un mese contato come 30 giorni» compare a schermo, non solo nel codice | `GIORNI_PER_MESE = 30` è una convenzione, non un dato di fonte. Se resta solo nel codice, il numero sembra più preciso di quanto sia — un'alterazione del significato |
| CF-12 | Nessuna chiamata di rete | la schermata usata con il Wi-Fi spento | Funziona per intero: nessun `fetch`, nessuna risorsa remota. Controllo sul bundle già esistente, richiamato e non riscritto | Primo dei tre vincoli non negoziabili. Qui è anche più facile da rispettare che altrove: questa funzionalità non ha nessun dato esterno da recuperare |
| CF-13 | I quattro stati obbligatori sono tutti raggiungibili | la schermata | Vuoto (CL-11), in caricamento (CF-14), errore (E-05), dati lunghi (CL-08): tutti e quattro raggiungibili | Una schermata che esiste solo nel caso perfetto non è finita |
| CF-14 | Il layout non salta quando il risultato compare | dallo stato vuoto al risultato di C-01 | Il riquadro del risultato occupa già il suo spazio da vuoto: nessuno spostamento del contenuto, nessuna rotellina che gira | Il calcolo è immediato e locale, per esplicita dichiarazione della specifica: uno spinner qui sarebbe un movimento inventato per un'attesa che non esiste |
| CF-15 | Formattazione italiana e unità | tutti i numeri a schermo (mesi, giorni, importi) | Prodotti da `src/core/formatoIt.ts`, mai da `Intl`. Unità sempre accanto al valore, cifre tabulari, numeri allineati a destra dove in tabella | `Intl` cambia risultato su un runtime con ICU ridotto: il numero della slide deve essere identico su ogni macchina |
| CF-16 | Accessibilità di base | tastiera e lettura della schermata | Corpo ≥ 16px, contrasto ≥ 4,5:1, aree cliccabili ≥ 44px, focus sempre visibile, ordine di tabulazione spese → risparmi → risultato, nessuna informazione disponibile solo al passaggio del mouse | Hackathon sull'inclusione: un'interfaccia inaccessibile è ciò che chi valuta nota prima di qualunque formula |
| CF-17 | La navigazione non cambia posizione, e la voce nuova non rompe le altre | arrivo alla schermata dall'area «Il futuro» e ritorno | «Torna alla home»/«indietro» nella stessa posizione fissata dalla `01`; la voce nuova compare in `area3Altra4` con il badge «altre N domande» aggiornato; `tests/home.test.ts` (che asserisce su «lavoro») resta verde | Una voce nuova nella lista è il punto in cui un conteggio derivato può disallinearsi senza che nessuno se ne accorga finché non rompe un test su un'altra area |

---

## Referto

*Sarà compilato da `tester` in **fase 2**, dopo aver implementato in
`tests/accettazione/09-mesi-coperti.test.ts` ed **eseguito** i casi qui sopra.
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
