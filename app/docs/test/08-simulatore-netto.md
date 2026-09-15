# 08 — casi di prova per «Quanto mi resta davvero in busta»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/08-simulatore-netto-in-busta-paga.md` e **non dal codice**,
> che in questo momento non esiste ancora.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», cioè il percorso
> nominale da mostrare in demo (i passi 1-13 di «Come si proverà» nella stessa
> spec). Qui si scrive **cosa può andare storto**.
>
> **Formula, dalla sezione «Elaborazione» della specifica.**
> `lordoAnnuoCent = lordoMensileCent × mensilita` (esatto, nessun
> arrotondamento) · `contributiCent = round((min(lordoAnnuoCent,
> sogliaEccedenzaCent)×aliquotaBaseBp + max(0, lordoAnnuoCent −
> sogliaEccedenzaCent)×aliquotaEccedenzaBp) / 10.000)` · `imponibileCent =
> lordoAnnuoCent − contributiCent` · `irpefCent = round(Σ porzioneCent ×
> aliquotaBp / 10.000)` per scaglione, con `porzioneCent = max(0,
> min(imponibileCent, limiteSuperioreCent) − limiteInferioreCent)` ·
> `nettoAnnuoCent = lordoAnnuoCent − contributiCent − irpefCent` ·
> `nettoMensileCent = round(nettoAnnuoCent / mensilita)`, mezzo centesimo
> verso l'alto · `nettoPerCentoEuroCent = round(nettoAnnuoCent × 10.000 /
> lordoAnnuoCent)` · le tre quote della barra in bp, con `quotaNettoBp`
> ricavata **per differenza**, mai arrotondata da sola.
>
> Valori di prova dichiarati: `aliquotaBaseBp = 919` (9,19 %),
> `aliquotaEccedenzaBp = 1.019` (10,19 %), `sogliaEccedenzaCent = 5.219.000`
> (52.190,00 €/anno); scaglioni IRPEF 0–2.800.000 cent @2300 bp (23 %),
> 2.800.000–5.000.000 cent @3300 bp (33 %), oltre 5.000.000 cent @4300 bp
> (43 %, senza tetto). Limiti del campo: `MENSILITA_MIN = 12`,
> `MENSILITA_MAX = 14`, `LORDO_MENSILE_MAX_CENT = 10.000.000`.
>
> Ogni risultato atteso qui sotto è ricalcolato a mano da questi passi, con
> l'aritmetica scritta accanto, e poi **ricontrollato con uno script
> usa-e-getta** prima di essere trascritto — lo script non sostituisce il
> calcolo a mano richiesto dallo standard di codice, lo controlla: con sei
> soglie diverse da incrociare a mano (tre fiscali, moltiplicate per sotto/
> sopra) il rischio di un errore di trascrizione è concreto quanto quello che
> questi casi vogliono scovare nel codice.
>
> **Tre punti su cui la specifica non decide, o su cui l'ingresso dichiarato
> non può raggiungere ciò che il calcolo definisce — segnalati, non
> indovinati:**
>
> 1. **Le tre soglie fiscali non sono raggiungibili al centesimo esatto
>    attraverso i due campi dichiarati.** L'ingresso della persona è
>    `lordoMensileCent × mensilita`, con `mensilita` intero fra 12 e 14: il
>    lordo annuo risultante è sempre un multiplo di 12, 13 o 14, e nessuna
>    delle tre soglie lo è — `5.219.000 = 2³×5³×17×307` non condivide fattori
>    con 12, 13 né 14, e lo stesso vale per i due valori di lordo annuo che
>    renderebbero l'imponibile esattamente 2.800.000 o 5.000.000 (rispettivamente
>    3.083.361 e 5.509.197, calcolati risolvendo a mano l'equazione del passo
>    2 per L). È la stessa tensione già scritta in
>    `docs/test/07-valore-dei-risparmi.md`, CL-01: «la specifica lo chiede al
>    core, ma l'ingresso dell'interfaccia è 1–30». Qui vale allo stesso modo:
>    **il centesimo esatto sulla soglia è una proprietà della funzione pura**,
>    verificabile solo passandole `lordoAnnuoCent` (o `imponibileCent`)
>    direttamente, come può fare `core-engine` in
>    `src/core/__tests__/nettoInBusta.test.ts` — non è raggiungibile scrivendo
>    un lordo mensile e un numero di mensilità nei due campi dichiarati.
>    I casi qui sotto usano perciò **il valore più vicino raggiungibile con
>    mensilità intere** (calcolato e verificato a mano, scarto dichiarato in
>    centesimi), e lasciano a `core-engine` i tre valori esatti per un test
>    diretto sulla funzione pura: `lordoAnnuoCent = 5.219.000` per la soglia
>    dei contributi (contributi attesi: 479.626 cent, imponibile 4.739.374
>    cent), `lordoAnnuoCent = 3.083.361` per il confine 28.000 €
>    (imponibile atteso: esattamente 2.800.000 cent), `lordoAnnuoCent =
>    5.509.197` per il confine 50.000 € (imponibile atteso: esattamente
>    5.000.000 cent).
> 2. **Il pareggio esatto a metà centesimo (`,5`) è dichiarato dalla
>    specifica solo per il passo 6** (netto mensile — «il mezzo centesimo
>    verso l'alto»). Per i passi 2 e 4 (contributi, IRPEF) la specifica scrive
>    solo «round(...)», senza fissare la convenzione sul mezzo esatto. Assumo
>    la stessa regola (arrotondamento a metà verso l'alto, equivalente a
>    `Math.round`) per coerenza con l'unico punto in cui la specifica la
>    enuncia — ma è un'assunzione del tester, non un dato scritto. CL-10
>    costruisce di proposito un pareggio esatto **nel passo 4**, non nel
>    passo 6, per dare a questa assunzione un caso che la mette alla prova
>    dove la specifica tace.
> 3. **Nessun minimo esplicito per `lordoMensileCent`** oltre «zero non è
>    valido»: la specifica dichiara `LORDO_MENSILE_MAX_CENT` e i due codici
>    `lordo-a-zero`/`lordo-sotto-zero`, ma non un minimo positivo come invece
>    fa la `09` per le spese mensili (`SPESE_MENSILI_MIN_CENT`, un errore di
>    battitura dichiarato). Segnalato in CL-17, non indovinato.

## 1. Percorso nominale

*I due casi verificati a mano nella specifica stessa, più i due criteri che
la specifica chiama espressamente «il più importante di tutti».*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | Il caso di riferimento della specifica: quello che finisce in demo e nello screenshot dichiarato | `lordoMensileCent = 200.000` (2.000,00 €) · `mensilita = 13` | Lordo annuo 2.600.000 cent (26.000,00 €) · contributi round(2.600.000×919/10.000)=**238.940** cent (2.389,40 €, 9,19 %, tutto sotto soglia eccedenza) · imponibile 2.361.060 · IRPEF round(2.361.060×2300/10.000)=round(543.043,8)=**543.044** cent (5.430,44 €) · netto annuo 1.818.016 (18.180,16 €) · netto mensile round(1.818.016/13)=**139.847** cent, **1.398,47 €** (il numero grande) · paragone su 100 € = 6.992 cent (69,92 €) · barra 919 bp / 2.089 bp / 6.992 bp | È il numero che finisce nello screenshot dichiarato dalla specifica (`08-simulatore-netto.png`): se cambia, la slide afferma una cifra che nessun test sostiene |
| C-02 | Che la formula generalizzi — attraversando insieme la soglia dei contributi e tutti e tre gli scaglioni IRPEF — e non sia cucita sul solo caso di riferimento | `lordoMensileCent = 500.000` (5.000,00 €) · `mensilita = 12` | Lordo annuo 6.000.000 · contributi (quota base 5.219.000×919 + quota eccedente 781.000×1019, sommate **prima** di dividere per 10.000) = **559.210** cent · imponibile 5.440.790 · IRPEF (tre scaglioni: 2.800.000×2300 + 2.200.000×3300 + 440.790×4300, sommati e poi divisi **una sola volta**) = **1.559.540** cent (543.043,8 escluso, qui 1.559.539,7→1.559.540) · netto annuo 3.881.250 · netto mensile round(3.881.250/12)=round(323.437,5)=**323.438** cent, **3.234,38 €** (mezzo centesimo esatto, arrotondato verso l'alto) · paragone 6.469 cent (64,69 €) · barra 932 bp / 2.599 bp / 6.469 bp | Un solo caso di riferimento si potrebbe ottenere anche con un numero incollato nel punto giusto. Questo secondo caso attraversa entrambe le soglie fiscali insieme e il mezzo centesimo esatto: è ciò che distingue un calcolo vero da un valore riscritto a mano nel codice |
| C-03 | **La quadratura e l'aggancio fra paragone e quota netta** — il criterio che la specifica chiama «il più importante di tutti» | il caso C-01 | `contributi + IRPEF + netto annuo = lordo annuo` **esattamente**: 238.940+543.044+1.818.016 = 2.600.000 ✓, nessun centesimo di scarto. E il paragone su 100 € (6.992 cent) coincide **esattamente** con la quota del netto nella barra (10.000−919−2.089 = 6.992 bp): stesso numero da due strade di calcolo diverse | Chi rifà il conto con la calcolatrice del telefono è esattamente la persona per cui il sito esiste. Uno scarto anche di un solo centesimo, o un paragone che non coincide con la barra, distrugge la fiducia nell'intera schermata |
| C-04 | La barra resta leggibile per intero senza il passaggio del mouse | il caso C-01, osservato senza muovere il mouse | Le tre etichette (contributi, imposta sul reddito, quello che resta), le tre percentuali e i tre importi in euro sono scritti **sempre**, anche su schermo touch e al proiettore — non solo in un tooltip al hover | La specifica lo vieta esplicitamente: «nessuna informazione disponibile solo al passaggio del mouse». Una barra che mostra la percentuale solo al hover è un dato dimezzato per chiunque non abbia un mouse |

## 2. Casi limite e valori di confine

*Le tre soglie fiscali (contributi, primo/secondo scaglione, secondo/terzo
scaglione), un caso senza soglie vicine, la genericità dei parametri, i
confini del campo del lordo, le mensilità, e gli stati vuoto/in sospeso. È il
gruppo più importante della lista: un calcolo per scaglioni sbaglia quasi
sempre sul valore esatto di soglia, e qui il rischio si moltiplica per il
numero di scaglioni. Vedi la nota 1 sopra per il motivo per cui «sotto» e
«sopra» qui sono il più vicino raggiungibile, non il centesimo esatto.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | La soglia dei contributi (52.190 €/anno) — il valore più vicino raggiungibile per difetto con mensilità intere | `lordoMensileCent = 434.916` (4.349,16 €) · `mensilita = 12` | Lordo annuo = 434.916×12 = **5.218.992** cent, 8 cent (0,08 €) sotto `sogliaEccedenzaCent = 5.219.000` — il più vicino per difetto, perché 5.219.000 non è multiplo di 12 (nota 1 sopra). Tutto sotto soglia: contributi = round(5.218.992×919/10.000) = round(479.625,3648) = **479.625** cent · imponibile 4.739.367 · IRPEF (primo scaglione pieno più la quota di secondo) = **1.283.991** cent · netto annuo 3.455.376 · netto mensile **287.948** cent (2.879,48 €) · quadratura 479.625+1.283.991+3.455.376 = 5.218.992 ✓ | È il lato «tutto alla base» della soglia: se il confronto fosse `>=` al posto di `>`, un centesimo sotto verrebbe già trattato come eccedente e i contributi risulterebbero più alti di quanto dovuto |
| CL-02 | La stessa soglia, un passo oltre — e la prova che l'arrotondamento va fatto **una sola volta sulla somma**, non pezzo per pezzo | `lordoMensileCent = 434.917` (4.349,17 €) · `mensilita = 12` | Lordo annuo = **5.219.004** cent, 4 cent sopra soglia — il più vicino per eccesso. `quotaBase = 5.219.000`, `quotaEccedente = 4`. Contributi **corretto**: round((5.219.000×919 + 4×1019)/10.000) = round((4.796.261.000+4.076)/10.000) = round(479.626,5076) = **479.627** cent. **Se si arrotondasse ciascun pezzo separatamente** (comportamento sbagliato, qui solo per contrasto): round(479.626,1)+round(0,4076) = 479.626+0 = 479.626 — **un centesimo in meno**. Con il valore corretto: imponibile 4.739.377 · IRPEF 1.283.994 · netto annuo 3.455.383 · netto mensile **287.949** cent · quadratura 479.627+1.283.994+3.455.383 = 5.219.004 ✓ | Il caso più delicato della lista: la specifica scrive esplicitamente «le due tranche non si arrotondano separatamente», e qui la differenza fra farlo bene e farlo pezzo per pezzo è un centesimo reale, dimostrato con lo stesso numero calcolato nei due modi |
| CL-03 | Il confine fra primo e secondo scaglione IRPEF (28.000 € di imponibile) — il più vicino raggiungibile per difetto | `lordoMensileCent = 256.946` (2.569,46 €) · `mensilita = 12` | Lordo annuo 3.083.352 · contributi round(3.083.352×919/10.000) = round(283.360,0488) = **283.360** · imponibile = 3.083.352−283.360 = **2.799.992** cent, 8 cent sotto i 2.800.000 della soglia — interamente nel primo scaglione (23 %). IRPEF round(2.799.992×2300/10.000) = round(643.998,16) = **643.998** · netto annuo 2.155.994 · netto mensile **179.666** cent · quadratura 283.360+643.998+2.155.994 = 3.083.352 ✓ | La soglia qui non è un parametro digitato ma il risultato di due calcoli in cascata (contributi, poi imponibile): un errore nell'ordine dei passi la sposta senza che nessun singolo numero sembri sbagliato da solo |
| CL-04 | Lo stesso confine, un passo oltre: il secondo scaglione si attiva per soli 3 centesimi di imponibile | `lordoMensileCent = 256.947` (2.569,47 €) · `mensilita = 12` | Lordo annuo 3.083.364 · contributi round(3.083.364×919/10.000) = round(283.361,1516) = **283.361** · imponibile = **2.800.003** cent, 3 cent sopra soglia. IRPEF: 2.800.000×2300 (primo scaglione, pieno) + 3×3300 (secondo scaglione, 3 cent) = 6.440.009.900, /10.000 = round(644.000,99) = **644.001** · netto annuo 2.156.002 · netto mensile **179.667** cent · quadratura 283.361+644.001+2.156.002 = 3.083.364 ✓ | Fra CL-03 e CL-04 il lordo mensile cambia di **un solo centesimo** (256.946→256.947): è il punto più stretto in cui ci si accorge se il secondo scaglione si attiva un passo troppo presto o troppo tardi |
| CL-05 | Il confine fra secondo e terzo scaglione IRPEF (50.000 € di imponibile), oltre la soglia dei contributi — il più vicino raggiungibile per difetto | `lordoMensileCent = 459.099` (4.590,99 €) · `mensilita = 12` | Lordo annuo 5.509.188 · sopra soglia contributi: `quotaEccedente = 290.188`, contributi round((4.796.261.000+290.188×1019)/10.000) = round(509.196,2572) = **509.196** · imponibile = **4.999.992** cent, 8 cent sotto i 5.000.000 — nessun terzo scaglione ancora. IRPEF (solo 1°+2° scaglione): 2.800.000×2300+2.199.992×3300 = 13.699.973.600, /10.000 = round(1.369.997,36) = **1.369.997** · netto annuo 3.629.995 · netto mensile **302.500** cent · quadratura 509.196+1.369.997+3.629.995 = 5.509.188 ✓ | Il confine più composto della lista: attraversa insieme la soglia dei contributi (già superata) e quella del terzo scaglione (non ancora) |
| CL-06 | Lo stesso confine, un passo oltre: il terzo scaglione (43 %, senza tetto) si attiva per soli 3 centesimi di imponibile | `lordoMensileCent = 459.100` (4.591,00 €) · `mensilita = 12` | Lordo annuo 5.509.200 · contributi round((4.796.261.000+290.200×1019)/10.000) = round(509.197,48) = **509.197** · imponibile = **5.000.003** cent, 3 cent sopra soglia. IRPEF: 2.800.000×2300 + 2.200.000×3300 (secondo scaglione, ora pieno) + 3×4300 (terzo scaglione, 3 cent) = 13.700.012.900, /10.000 = round(1.370.001,29) = **1.370.001** · netto annuo 3.630.002 · netto mensile **302.500** cent (identico a CL-05: i 7 cent di differenza sul netto annuo sono assorbiti dall'arrotondamento della divisione per 12) · quadratura 509.197+1.370.001+3.630.002 = 5.509.200 ✓ | È il terzo scaglione, quello «senza tetto» della specifica (`limiteSuperioreCent: null`): se il ciclo sugli scaglioni si fermasse al secondo, questo centesimo di imponibile sparirebbe senza errore visibile |
| CL-07 | Un lordo che resta interamente nel primo scaglione, lontano da ogni soglia | `lordoMensileCent = 150.000` (1.500,00 €) · `mensilita = 12` | Lordo annuo 1.800.000 · contributi round(1.800.000×919/10.000) = **165.420** cent (esatto, nessuna ambiguità di arrotondamento) · imponibile **1.634.580**, ben sotto i 2.800.000: tutta IRPEF al 23 %. IRPEF round(1.634.580×2300/10.000) = round(375.953,4) = **375.953** · netto annuo 1.258.627 · netto mensile **104.886** cent (1.048,86 €) · quadratura 165.420+375.953+1.258.627 = 1.800.000 ✓ | Il caso «tranquillo» richiesto esplicitamente: un reddito comune che non sfiora nessuna delle tre soglie, a riprova che la complessità degli scaglioni non introduce rumore nel caso semplice |
| CL-08 | L'aliquota contributiva è un **parametro esterno** ricevuto dalla funzione, non una costante scritta al suo interno | il caso C-01 (`200.000`×`13`) ma con `aliquotaBaseBp = 0` passato come parametro, tutto il resto invariato | Contributi = round(2.600.000×0/10.000) = **0** cent (non più 238.940). Imponibile torna a coincidere col lordo annuo: **2.600.000**. IRPEF invariata, round(2.600.000×2300/10.000) = **598.000** (esatto). Netto annuo 2.002.000 · netto mensile round(2.002.000/13) = **154.000** cent (esatto) · quadratura 0+598.000+2.002.000 = 2.600.000 ✓ | Se una futura modifica leggesse l'aliquota da una costante interna invece che dal parametro ricevuto, questo è l'unico caso che se ne accorge: userebbe ancora 238.940 di contributi anche con l'aliquota azzerata in ingresso |
| CL-09 | Il confine massimo del campo, `LORDO_MENSILE_MAX_CENT` — incluso, non escluso, e un lordo annuo a otto cifre in centesimi | `lordoMensileCent = 10.000.000` (100.000,00 €, il valore esatto della soglia) · `mensilita = 12` | Lordo annuo 120.000.000 · contributi (sopra soglia) round((4.796.261.000+114.781.000×1019)/10.000) = **12.175.810** cent (esatto) · imponibile 107.824.190 · IRPEF (tutti e tre gli scaglioni pieni fino al terzo) round(455.844.017.000/10.000) = round(45.584.401,7) = **45.584.402** · netto annuo 62.239.788 · netto mensile round(62.239.788/12) = **5.186.649** cent (51.866,49 €, esatto) · quadratura 12.175.810+45.584.402+62.239.788 = 120.000.000 ✓, nessun overflow (il numeratore IRPEF resta circa 4,6×10¹¹, molto sotto `Number.MAX_SAFE_INTEGER`, come la specifica stessa dichiara nella «Nota sull'aritmetica») | Il valore esatto della soglia è il punto in cui un confronto `>` al posto di `>=` respinge in silenzio l'ultimo euro ammesso. È anche il caso a sette cifre di euro che deve reggere la griglia senza andare a capo in un punto illeggibile |
| CL-10 | Un lordo appena sotto il massimo, allineato al passo 11 di «Come si proverà» nella spec: dati lunghi **e** un pareggio esatto a metà centesimo nel passo 4 (IRPEF), non nel passo 6 dove la specifica lo dichiara | `lordoMensileCent = 9.900.000` (99.000,00 €) · `mensilita = 14` | Lordo annuo 138.600.000 · contributi round((4.796.261.000+133.381.000×1019)/10.000) = **14.071.150** (esatto) · imponibile 124.528.850 · IRPEF: numeratore 6.440.000.000+7.260.000.000+(119.528.850×4300) = **527.674.055.000**, diviso 10.000 = **52.767.405,5 esatto** → **52.767.406** (mezzo centesimo verso l'alto, per assunzione — nota 2 sopra) · netto annuo 71.761.444 · netto mensile round(71.761.444/14) = **5.125.817** cent (51.258,17 €) · quadratura 14.071.150+52.767.406+71.761.444 = 138.600.000 ✓ | Doc-funzionale userà 99.000 €×14 mensilità nel suo stesso passo 11 di «Come si proverà»: stesso input, controllo incrociato fra le due liste. E il pareggio a `,5` cade qui nell'IRPEF, non nel netto mensile dove la specifica lo dichiara esplicitamente: mette alla prova l'assunzione della nota 2 in un punto in cui la specifica tace |
| CL-11 | Il minimo del campo mensilità, valido | `mensilita = 12`, `lordoMensileCent = 200.000` | Accettato senza errore. Lordo annuo = 200.000×12 = 2.400.000 (non 2.600.000 di C-01, che usa 13 mensilità) | `MENSILITA_MIN = 12`: se il confronto fosse `>` invece di `>=`, il valore più comune — mensilità piene, senza tredicesima — verrebbe respinto |
| CL-12 | Il massimo del campo mensilità, valido | `mensilita = 14`, `lordoMensileCent = 200.000` | Accettato senza errore. Lordo annuo = 2.800.000 | Stesso bordo, dal lato opposto: chi riceve quattordicesima oltre alla tredicesima non deve trovarsi respinto |
| CL-13 | Nessun campo ancora compilato | nessun input | **Stato vuoto**: la schermata dice quali due numeri servono — il lordo mensile e le mensilità — e dove si leggono sulla busta paga, non «nessun risultato». La barra non compare vuota né a zero: al suo posto la frase che spiega che cosa mostrerà | La specifica lo scrive come primo dei quattro stati obbligatori. Uno zero al posto del vuoto direbbe «guadagni zero», che è un dato falso |
| CL-14 | Un solo campo compilato | `lordoMensileCent` digitato, `mensilita` non ancora (o viceversa) | Nessun calcolo parziale, nessun errore sul campo non ancora toccato: resta l'estensione naturale dello stato vuoto | Con due campi, «uno pieno uno vuoto» esiste per forza anche se la specifica descrive lo stato vuoto per i due insieme. Trattarlo da errore punirebbe chi sta ancora scrivendo |
| CL-15 | Il campo si svuota dopo aver digitato | `lordoMensileCent` scritto come `2.000`, poi cancellato carattere per carattere | Si torna allo stato vuoto: il risultato precedente (1.398,47 € con le mensilità ancora a 13) **sparisce**, non resta a schermo con il campo sottostante vuoto | Una cifra che sopravvive all'input che l'ha generata resta lì con l'aria di essere ancora vera |
| CL-16 | Decimali oltre il centesimo nel campo lordo — punto che la specifica non decide | `lordoMensileCent` digitato come `2.000,555` | Non indovinato: un comportamento **dichiarato e visibile** (arrotondamento al centesimo mostrato, o messaggio in linguaggio umano). **Non ammesso**: un calcolo silenzioso su un terzo decimale che la persona non ha scritto in quella forma | La specifica definisce l'ingresso come intero in centesimi ma, come già la `09` (sua CL-14) e a differenza della `07` (che lo decide in CL-19), non dice che fare del terzo decimale qui. Segnalato, non indovinato |
| CL-17 | Un lordo minimo non dichiarato dalla specifica — punto che la specifica non decide | `lordoMensileCent = 1` (0,01 €) | Non indovinato: per la lettera della specifica un valore positivo qualunque non ricade né in `lordo-a-zero` né in `lordo-sotto-zero`, quindi andrebbe accettato — ma un lordo di un centesimo al mese non ha senso economico, ed è il tipo di errore di battitura che la `09` tratta con un minimo esplicito (`SPESE_MENSILI_MIN_CENT`) | La tabella dei limiti dichiara solo il massimo (`LORDO_MENSILE_MAX_CENT`). Il minimo copre solo zero e i negativi: un valore piccolissimo ma positivo resta scoperto, come già in E-10 della `09` per i risparmi |

## 3. Errori attesi

*Che cosa succede quando l'input non è valido, **come lo vede la persona**, e
i due codici che coprono un fisco dichiarato male — non un errore della
persona, ma un rischio dichiarato dalla specifica stessa («il modulo delle
fonti si riempie a mano»).*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Lordo esattamente a zero | `lordoMensileCent = 0` | Rifiuto `lordo-a-zero`, messaggio in linguaggio umano; nessun calcolo tentato, nessun `Infinity`/`NaN`/`0,00 €` mostrato come se fosse un risultato valido | La specifica separa questo codice da quello dei negativi: un lordo a zero non è «troppo basso», è un dato che descrive «nessuno stipendio», e il messaggio deve dirlo in quei termini |
| E-02 | Lordo negativo | `lordoMensileCent = -50.000` | Rifiuto `lordo-sotto-zero`, messaggio in linguaggio umano; nessun calcolo tentato | Un lordo negativo non ha alcun significato su una busta paga: va trattato come un errore di battitura, non come un caso limite da calcolare |
| E-03 | Lordo sopra la soglia massima del campo | `lordoMensileCent = 10.000.001` (100.000,01 €), un centesimo sopra `LORDO_MENSILE_MAX_CENT` | Rifiuto `lordo-troppo-alto`, messaggio in linguaggio umano — «sembra un errore di battitura», il motivo che la specifica dà per questa soglia | Stesso bordo di CL-09, dal lato del rifiuto: se `>=` diventasse `>`, questo valore passerebbe per errore |
| E-04 | Testo al posto di un numero | `duemila` nel campo del lordo | Rifiuto `lordo-non-leggibile`, messaggio in linguaggio umano **legato al campo lordo** (`aria-describedby`), non un avviso generico in cima alla pagina | Con due campi a schermo, un errore che non dice quale dei due riguarda costringe a indovinare, e chi usa uno screen reader non lo sente affatto se non è legato al campo giusto |
| E-05 | Mensilità sotto l'intervallo ammesso | `mensilita = 11` | Rifiuto `mensilita-fuori-intervallo`, messaggio in linguaggio umano; il lordo già digitato nell'altro campo resta dov'è | La specifica ammette solo 12, 13, 14: 11 mensilità non è un caso reale del lavoro dipendente che questa funzionalità tratta |
| E-06 | Mensilità sopra l'intervallo ammesso | `mensilita = 15` | Rifiuto `mensilita-fuori-intervallo`, stesso messaggio | Stesso bordo, dal lato opposto: 15 mensilità non esiste nel lavoro dipendente privato che questa funzionalità copre |
| E-07 | Mensilità non intera | `mensilita = 12,5` | Rifiuto `mensilita-non-intere`, messaggio in linguaggio umano diverso da quello di «fuori intervallo»: qui il problema non è la grandezza ma il fatto che sia un decimale | Le mensilità si contano, non si frazionano: un mezzo mese di stipendio in più non è un errore di grandezza, ma di forma, e merita un messaggio diverso |
| E-08 | Mensilità a zero — motivo aritmetico, non solo «fuori intervallo» | `mensilita = 0` | Rifiuto `mensilita-fuori-intervallo` **prima** di qualunque calcolo: nessun tentativo di dividere per zero al passo del netto mensile, nessun `Infinity` o `NaN` a schermo | Le mensilità sono anche il divisore del passo 6. Un controllo che verificasse «12 ≤ x ≤ 14» *dopo* aver già tentato la divisione lascerebbe una finestra, per quanto piccola, in cui il calcolo gira su un valore che lo spacca |
| E-09 | Gli scaglioni IRPEF dichiarati male — dato di fisco, non input della persona | `scaglioni` con soglie non crescenti (il secondo scaglione parte più in basso del primo) oppure un elenco vuoto | Rifiuto `scaglioni-non-validi`; nessun calcolo prodotto con un fisco inconsistente | La specifica lo dichiara esplicitamente: «il modulo delle fonti si riempie a mano», e questo codice esiste per il giorno in cui qualcuno lo riempie con un refuso. Non è un errore che la persona può causare digitando, ma la funzione deve reggerlo comunque perché riceve gli scaglioni come parametro |
| E-10 | Le aliquote contributive dichiarate male | `contributi` con `aliquotaBaseBp` negativa, oppure `sogliaEccedenzaCent` negativa | Rifiuto `aliquote-contributive-non-valide`; nessun calcolo prodotto | Stesso motivo di E-09, sul secondo blocco di dati dichiarati. Un'aliquota negativa produrrebbe contributi negativi che poi *aumenterebbero* il netto: un difetto silenzioso e nella direzione più pericolosa, quella che sembra una buona notizia |
| E-11 | I dati digitati non si perdono quando l'altro campo è in errore | lordo valido `2.000` + mensilità con errore di battitura `tredici`; poi si corregge il campo mensilità | Il `2.000` resta **ancora nel campo lordo** mentre si corregge l'altro; simmetricamente, correggendo il lordo le mensilità restano | L'accessibilità lo chiede esplicitamente: chi ha digitato una cifra giusta non deve riscriverla perché l'altro campo aveva un errore di battitura |
| E-12 | L'errore si capisce senza vedere il colore | qualunque input non valido fra E-01…E-07 | Il messaggio è **testo leggibile**, non solo un bordo rosso: corpo ≥16px, contrasto ≥4,5:1 | Il colore da solo esclude chi non lo distingue e sparisce al proiettore |
| E-13 | Errore e stato vuoto sono distinguibili a colpo d'occhio | schermata vuota (CL-13) a confronto con schermata in errore (E-04) | Due messaggi diversi, riconoscibili senza leggerli per intero | «Non hai ancora scritto» e «quello che hai scritto non va» chiedono due azioni diverse. Se si assomigliano, la persona non sa se correggere o cominciare |
| E-14 | Nessun rimprovero mentre si sta ancora digitando | `2` → `20` → `200` → `2000` nel campo del lordo | Nessun messaggio di errore sui valori intermedi di una digitazione in corso | Nessun limite di tempo è la regola del progetto: chi digita piano non va corretto mentre sta ancora scrivendo |

## 4. Conformità

*Richiama la suite dei guardrail, non la riscrive: il lessico generale vive in
`src/guardrails/lessico.ts` ed è scandito da `tests/lessico-ui.test.ts`.
CF-01 e CF-02 richiamano quella copertura; da CF-03 in poi ci sono i vincoli
specifici di questa funzionalità, che quella suite non copre.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo generale sulle chiavi nuove | le chiavi `nettoBusta*` in `src/ui/testiNetto.ts`, incluse in `STRINGHE_UTENTE` via spread | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico generale | Richiamo alla suite esistente: duplicare qui l'elenco dei termini farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Identificatori del codice | nomi di funzioni, tipi, componenti e file introdotti da questa funzionalità (`nettoInBusta.ts`, `fiscoDichiarato.ts`, `PaginaNettoInBusta.tsx`, ecc.) | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Stesso richiamo. La specifica segnala esplicitamente che «scegli» è già vietato ed è la trappola più vicina qui, per il campo delle mensilità |
| CF-03 | **Nessun confronto fra «dipendente» e «partita IVA in regime forfettario»** — la variante esplicitamente esclusa | l'intera schermata | Un solo conto (da dipendente), senza un secondo numero affiancato per un regime diverso e senza un rimando che lasci intendere quale dei due sia preferibile | La specifica lo dichiara «a un passo dall'indicarne uno, e il passo lo fa chi legge anche se il testo non lo scrive»: è un vincolo strutturale, non lessicale — nessuna regex trova «due numeri messi vicini», serve la rilettura umana di `guardrail-officer` |
| CF-04 | **Nessuna indicazione su aumenti, trattenute, inquadramento o regime fiscale** — vocabolario di dominio non coperto dal lessico generale | le stesse chiavi di CF-01 | Test scoped `tests/lessico-netto-in-busta.test.ts` (sul modello di `tests/lessico-simulazione-risparmio.test.ts`): zero occorrenze di «forfettario», «regime», «inquadramento», «partita iva» in un contesto di scelta, e di «aumento»/«trattenute» come oggetto di un consiglio («chiedi un aumento», «riduci le trattenute») | Le due frasi che il mandato cita come confine — «quanto dovresti chiedere di aumento», «ti conviene il forfettario» — usano radici (`dovresti`, `convien-`) già bloccate dal lessico generale (verificato in `src/guardrails/lessico.ts`, voci `dovere-personale` e `convenienza`). Il vero buco è nel vocabolario di dominio — regime, inquadramento, forfettario — che nessuna voce copre ancora e che qui non ha alcun uso legittimo |
| CF-05 | **Le formulazioni vietate non sopravvivono in un commento o in una citazione a caporale «»** | l'intero testo dei file toccati da questa funzionalità — `src/core/nettoInBusta.ts`, `src/core/fiscoDichiarato.ts`, `src/ui/PaginaNettoInBusta.tsx`, `src/ui/testiNetto.ts`, `src/ui/rotte.ts` — commenti compresi | Zero occorrenze in **tutto il testo** dei file, non solo nelle stringhe esportate: serve la scansione dell'intero file, sul modello della terza verifica di `tests/lessico-ui.test.ts`, non il solo test scoped su `STRINGHE_NETTO` di CF-04 | Un test scoped che legge solo l'oggetto delle stringhe non vede un commento che spiega «qui non si confronta col forfettario» citando la frase fra virgolette per darsi ragione. È già successo una volta, proprio nel file del guardrail (il commento su «preferibile»/«meglio» in `lessico.ts`) |
| CF-06 | Le aliquote sono dichiarate con fonte, e l'anno d'imposta non confermato è detto apertamente | la schermata del risultato, il modulo `fiscoDichiarato.ts` | Accanto al risultato compaiono le fonti attese — Agenzia delle Entrate/Legge di Bilancio per l'IRPEF, INPS per i contributi — insieme a una dichiarazione esplicita che l'anno d'imposta non è ancora confermato, finché `annoImpostaDichiarato` resta `false`. Le aliquote **non** sono presentate come un fatto già verificato | Stesso schema già usato per il tasso di inflazione della `07` (sua CF-05) e ancora falso oggi. Un'aliquota senza provenienza è esattamente il difetto che questo schema esiste per non commettere |
| CF-07 | L'avvertenza «non è la busta paga vera» è a schermo, in corpo leggibile, non in una nota | la schermata del risultato, caso C-01 | La frase è visibile **senza scorrere** e **senza passaggio del mouse**, nello stesso corpo del resto del testo (≥16px, non un carattere più piccolo da nota a piè di pagina), e dichiara che le detrazioni per lavoro dipendente e le addizionali regionali/comunali sono escluse **e tirano in direzioni opposte** | La specifica scrive testualmente che dichiarare un limite in un carattere che nessuno legge equivale a non dichiararlo. Le due omissioni si compensano solo a parole, se nessuno le legge |
| CF-08 | Nessuna traccia dei due numeri digitati | si digitano `2000` e `13`, poi si guarda dove sono finiti | Niente in `localStorage`, `sessionStorage` o cookie; niente nella query string né nell'hash della rotta | La specifica lo promette esplicitamente: «non finiscono nell'indirizzo del browser e non vengono salvate da nessuna parte». Con le rotte a hash, l'hash è il posto in cui uno stipendio finirebbe nella cronologia del browser senza che nessuno l'abbia deciso |
| CF-09 | Nessuna chiamata di rete | la schermata usata con il Wi-Fi spento, build di produzione | Funziona per intero: nessun `fetch`, nessuna risorsa remota nel bundle. Le aliquote arrivano da `fiscoDichiarato.ts`, non da una richiesta | Primo dei tre vincoli non negoziabili. Qui è anche il punto in cui sarebbe più tentante violarlo: un aggiornamento automatico delle aliquote «perché cambiano ogni anno» è esattamente il tipo di giustificazione che la specifica respinge in anticipo |
| CF-10 | I quattro stati obbligatori sono tutti raggiungibili | la schermata | Vuoto (CL-13), in caricamento (CF-11), errore (E-04), dati lunghi (CL-09/CL-10): tutti e quattro raggiungibili | Una schermata che esiste solo nel caso perfetto non è finita |
| CF-11 | Il layout non salta quando il risultato compare | dallo stato vuoto al risultato di C-01 | Il riquadro del risultato e la barra occupano già il loro spazio da vuoti: nessuno spostamento del contenuto, nessuna rotellina che gira | Il calcolo è immediato e locale, per esplicita dichiarazione della specifica: uno spinner qui sarebbe un movimento inventato per un'attesa che non esiste |
| CF-12 | Formattazione italiana e unità | tutti i numeri a schermo (euro, percentuali) | Prodotti da `src/core/formatoIt.ts`, mai da `Intl`. Unità sempre accanto al valore (`1.398,47 €`, non `1.398,47` con l'euro nell'intestazione), cifre tabulari, numeri allineati a destra dove in tabella o elenco | `Intl` cambia risultato su un runtime con ICU ridotto: il numero della slide deve essere identico su ogni macchina, compresa quella del proiettore |
| CF-13 | Accessibilità di base | tastiera e lettura della schermata | Corpo ≥16px, contrasto ≥4,5:1, aree cliccabili ≥44px, focus da tastiera sempre visibile, ordine di tabulazione lordo → mensilità → risultato, nessuna informazione disponibile solo al passaggio del mouse (in particolare sulla barra, vedi C-04) | Hackathon sull'inclusione: un'interfaccia inaccessibile è ciò che chi valuta nota prima di qualunque formula |
| CF-14 | La navigazione non cambia posizione, e il collegamento dalla guida al cedolino (`04`) è verificabile comunque se manca | arrivo alla schermata dalla guida al cedolino (funzionalità `04`) e ritorno | «Torna alla home»/«indietro» nella stessa posizione fissata dalla `01`, su ogni pagina di questa funzionalità | La specifica avverte esplicitamente che il collegamento dalla `04` non è fra i file che questa spec dichiara di toccare: se manca, è una divergenza da segnalare in fase 2, non un motivo per inventare un altro percorso — ma la posizione della navigazione resta verificabile aprendo comunque la schermata dal suo indirizzo diretto |

---

## Referto

*Sarà compilato da `tester` in **fase 2**, dopo aver implementato in
`tests/accettazione/08-netto-in-busta.test.ts` ed **eseguito** i casi qui
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
