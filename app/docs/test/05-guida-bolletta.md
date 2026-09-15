# 05 — casi di prova per «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/05-guida-interattiva-bolletta-luce-gas.md` — **non dal
> codice**. Verificato prima di scrivere: `src/core/letturaBolletta.ts`,
> `src/ui/*Bolletta*` e le due fixture (`fixtures/bolletta-luce-bimestrale.*`)
> **non esistono ancora** in questo repository. Non è stato letto nemmeno
> `04` (`docs/features/04-guida-interattiva-busta-paga.md`), da cui `05`
> dichiara di ereditare la meccanica: dove `05` non ripete un dettaglio (gli
> stati Vuoto e In caricamento), qui non si inventa, si segnala che è materia
> di `04`.
>
> Confine con `doc-funzionale`: lui scrive «come si prova», il percorso a
> dieci secondi già descritto nella spec («si tocca `Spesa per oneri di
> sistema`... poi si guarda la barra in fondo»). Qui si scrive **cosa può
> andare storto**.
>
> **Tutta l'aritmetica qui sotto è ricalcolata a mano dalla tabella «Verifica
> a mano» della spec**, non dalla fixture JSON (che non esiste ancora): il
> primissimo controllo di fase 2 è che la fixture, una volta scritta
> dall'architetto, riproduca esattamente questi numeri. Se non li riproduce,
> è un difetto della fixture, non di questo elenco.
>
> **Sette punti su cui la specifica non decide la testabilità**, segnalati e
> non indovinati:
> 1. Se `PaginaBolletta.tsx` importi la fixture reale in modo statico (per lo
>    schema ereditato da `04`) o accetti un documento passato dall'esterno.
>    Finché non è deciso, quasi ogni caso che richiede un documento **diverso**
>    da quello reale (la maggior parte dei CL e degli E) è eseguibile solo
>    chiamando `letturaBolletta(documento)` direttamente, non aprendo la
>    pagina con dati diversi.
> 2. Se il tipo `LetturaBolletta` — bespoke, dichiarato **non** derivare da
>    `LetturaCalcolata` — esponga un campo equivalente a `nonClassificate`.
>    CL-13 verifica il comportamento osservabile (la voce non sparisce e non
>    viene riclassificata), non la forma esatta del campo.
> 3. La specifica non esercita mai il calcolo del peso su un importo
>    **negativo**: il valore atteso di CL-05 usa l'arrotondamento matematico
>    ordinario (al più vicino), non confermato da un esempio scritto nella
>    specifica.
> 4. Non è dichiarata la forma esatta con cui «il costo per kWh non si
>    mostra» (un `Esito` con `ok:false`, un campo `null`, la riga assente):
>    CL-06 e CL-07 verificano il comportamento osservabile — nessun
>    `Infinity`, nessun `NaN` a schermo — non la forma del dato che lo evita.
> 5. `src/ui/testiBolletta.ts` non ha nomi di chiave dichiarati dalla
>    specifica, solo bozze in prosa: CF-01 richiama la copertura del lessico
>    sulle chiavi che risulteranno, senza anticiparne i nomi.
> 6. Il passo 5 (`prezzoEnergiaPerKwhCent = energiaCent / quantita`) è scritto
>    nella specifica come una divisione semplice, **non** un `Math.round`:
>    «esatto, nessun resto» è dichiarato come proprietà di *questa* fixture,
>    non come garanzia generale della funzione. CL-02 segnala il caso in cui
>    la divisione non è esatta.
> 7. Il nome della funzione generale richiamata da C-08 (`calcolaLettura`)
>    viene dalla nota scritta dentro `fixtures/estratto-conto-trimestrale.atteso.json`
>    (un file dati, non codice), non da una lettura di `src/core/`: potrebbe
>    non essere il nome esatto esportato dal modulo che la contiene.

## 1. Percorso nominale

*Tutti i casi di questo gruppo usano i cinque importi della fixture dichiarata
dalla spec: `4000` · `1800` · `1000` · `360` · `716` centesimi, totale
dichiarato `7876`, `160 kWh` su `voce-01`.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | La quadratura sulla bolletta reale | i cinque importi + `totaleDichiaratoCent: 7876` | `sommaVociCent = 4000+1800+1000+360+716 = 7876`, uguale al totale dichiarato → `scartoCent = 0`, `quadra = true` | È il presupposto di ogni altro numero della schermata: se la quadratura fosse sbagliata, ogni peso calcolato dopo sarebbe una percentuale di un totale che non corrisponde più al documento |
| C-02 | I cinque pesi in punti base, voce per voce | i cinque importi su totale 7876 | `4000→5079 bp` · `1800→2285 bp` · `1000→1270 bp` · `360→457 bp` · `716→909 bp` (`// 4000*10000/7876=5078,72→5079`; `1800*10000/7876=2285,42→2285`; `1000*10000/7876=1269,68→1270`; `360*10000/7876=457,08→457`; `716*10000/7876=909,09→909`), **somma esattamente 10000** (`5079+2285+1270+457+909=10000`) | È il numero che ogni riga del facsimile mostra accanto all'importo. La somma a 10000 qui è una coincidenza aritmetica di questa fixture, non un obbligo della funzione (vedi E-04): se il codice la «aggiustasse» per farla tornare sempre, questo caso non lo scoprirebbe da solo — E-04 sì |
| C-03 | La quota che dipende dal consumo | `voce-01` (categoria `consumo`) = 4000 | `energiaCent = 4000` (40,00 €) | È il numero di sinistra della barra a due parti: l'unica voce con categoria `consumo` nella fixture reale |
| C-04 | La quota che non dipende dal consumo, per complemento | `totaleCent = 7876`, `energiaCent = 4000` | `nonEnergiaCent = 7876 - 4000 = 3876` (38,76 €) — **complemento**, non una seconda somma indipendente delle altre quattro voci | Se fosse ricalcolata sommando le altre quattro voci (`1800+1000+360+716=3876`) invece che per complemento, un domani una sesta voce imprevista (es. una posta straordinaria) romperebbe la corrispondenza con il totale senza che nessun test lo veda: il complemento invece la garantisce per costruzione |
| C-05 | Le due quote sommano esattamente 10000 bp | `energiaCent=4000→5079bp`, `nonEnergiaCent=3876→4921bp` (`// 3876*10000/7876=4921,28→4921`) | `5079 + 4921 = 10000` esatto | È il controllo incrociato numero 2 dichiarato dalla spec: le due parti della barra devono ricomporre l'intero, non lasciare un residuo che nessuna delle due etichette spiega |
| C-06 | Il prezzo dell'energia contro il costo totale, sugli stessi kWh stampati | `energiaCent=4000`, `totaleCent=7876`, `quantita=160` | `prezzoEnergiaPerKwhCent = 4000/160 = 25` esatto (0,25 €/kWh) · `costoTotalePerKwhCent = Math.round(7876/160) = Math.round(49,225) = 49` (0,49 €/kWh) → rapporto **quasi doppio** (49/25 ≈ 1,96) | È il numero che la persona porta via, per parola della spec. Se uno dei due calcoli sbagliasse anche di un centesimo, la frase «quasi il doppio» smetterebbe di essere vera per gli stessi identici dati che la schermata mostra sopra |
| C-07 | Controllo incrociato con l'aliquota stampata sull'etichetta | base imponibile `4000+1800+1000+360=7160`; aliquota `10%` stampata su `voce-05` (`aliquotaBp: 1000`) | `7160 × 1000 / 10000 = 716`, esattamente l'importo di `voce-05` | È il più utile dei tre controlli incrociati dichiarati: prova che la percentuale scritta sul documento e gli importi scritti sul documento raccontano la stessa storia, non due fatti scollegati |
| C-08 | Le etichette originali e il facsimile, senza riscritture | rendering delle cinque righe nell'ordine della fixture | `etichettaOriginale` compare **carattere per carattere** com'è scritta (`Spesa per la materia energia`, …, `IVA 10%`); importi a destra, cifre tabulari, euro accanto al valore; in cima il totale `78,76 €` — il numero più grande della schermata — con `160 kWh` accanto | È la base su cui poggia tutto il resto del gruppo 3 (Errori attesi): se il facsimile non rispecchia esattamente il documento, chi confronta lo schermo con la carta perde l'unico punto di riferimento che ha |
| C-09 | **Controllo incrociato con una verità già in repository, non con un calcolo di questa funzionalità** | la formula generale di proiezione «somma ricorrenti × 12 / mesi del periodo», applicata alle voci **ricorrenti** di `estratto-conto-trimestrale.input.json` (`voce-01: 1050` + `voce-05: 300` = `1350`), periodo `2026-07-01`→`2026-09-30` = 3 mesi | `1350 × 12 / 3 = 5400`, uguale, cifra per cifra, a `proiezioneAnnuaCent: 5400` già scritto in `fixtures/estratto-conto-trimestrale.atteso.json` | `05` dichiara di **non** usare questa formula proprio perché, applicata al proprio bimestre, sarebbe una moltiplicazione ×6 che il documento non dice. Questo caso non verifica il codice di `05` (che non la calcola): verifica che la premessa su cui la spec fonda quella scelta sia aritmeticamente vera, con un numero già verificato altrove — non richiede una nuova verifica a mano, la eredita |

## 2. Casi limite e valori di confine

*Zero, negativi, importi molto grandi, campi vuoti, liste con un solo
elemento, liste vuote — più i due limiti espliciti della spec: bolletta con
una voce sola, voce a zero, voce negativa, consumo a zero kWh, importi a
sette cifre, etichetta lunghissima, periodo di un mese e di sei, voce non
classificata.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | **L'arrotondamento avviene una volta sola, sul totale — non voce per voce** | costo per kWh sulla fixture reale (`quantita=160`), confrontato con la somma di cinque arrotondamenti separati: `4000/160=25,000→25` · `1800/160=11,25→11` · `1000/160=6,25→6` · `360/160=2,25→2` · `716/160=4,475→4` | Il calcolo corretto (`Math.round(7876/160)=49`) e la somma dei cinque arrotondamenti separati (`25+11+6+2+4=48`) **differiscono di un centesimo**. Il valore che deve comparire a schermo è **49**, mai 48 | È lo stesso tipo di controllo già scritto per la `07` (CL-10): la prova che nessun arrotondamento intermedio per-voce si è insinuato nel calcolo del costo totale per kWh. Un centesimo di differenza è invisibile finché qualcuno non lo cerca apposta, ed è esattamente il tipo di errore che un refactoring «per mostrare il dettaglio per voce» introdurrebbe senza che nessun altro caso se ne accorga |
| CL-02 | **Quando la divisione del passo 5 non è esatta, la specifica non dice che succede** | voce di consumo costruita nel test: `importoCent: 4001`, `quantita: 160` (`4001/160 = 25,00625`, non intero) | **Non deciso dalla specifica** (nota introduttiva, punto 6): la formula è scritta come divisione semplice, non `Math.round`. Il minimo garantito dal resto del progetto (`standard-codice.md`: «nessun float nel dominio») è che il valore mostrato **non sia un centesimo frazionario** — non che sia arrotondato in un verso piuttosto che nell'altro | La fixture reale «torna esatta» per costruzione dichiarata dalla spec stessa: questo caso costruito prova che cosa succede quando un futuro documento reale (non progettato per tornare) non ha questa proprietà. Se la funzione restituisse `25.00625` a schermo, violerebbe il vincolo di dominio più basilare del progetto |
| CL-03 | Bolletta con una sola voce | documento costruito nel test: una sola voce, categoria `consumo`, `importoCent: 1000`, `quantita: 40`, `totaleDichiaratoCent: 1000` | `quadra = true` (`scartoCent=0`); `pesoBp = 1000×10000/1000 = 10000` esatto (100%); `energiaCent=1000`, `nonEnergiaCent=0` → le due quote **100% / 0%**; `prezzoEnergiaPerKwhCent = 1000/40 = 25`, `costoTotalePerKwhCent = 1000/40 = 25`: **stesso valore**, rapporto 1:1, non «quasi il doppio» | La fixture reale è quasi 50/50 e quasi doppio: nessuno dei due è garantito dalla struttura del calcolo, solo dai numeri di quella bolletta. Questo caso prova che con un'unica voce il codice non si aspetta implicitamente uno scarto fra le due cifre né una seconda voce che non esiste |
| CL-04 | Voce a importo zero | fixture reale con `voce-04` (accisa) portata a `importoCent: 0`, `totaleDichiaratoCent` ricalcolato a `7516` | `pesoBp = 0×10000/7516 = 0` esatto; la riga resta **visibile** con `0,00 €` e `0,00%`, non omessa dall'elenco delle cinque voci | La spec vieta esplicitamente di far sparire una componente piccola; zero è il caso limite di «piccola» — se una voce a zero fosse la prima a essere tolta dalla lista, la somma delle righe visibili smetterebbe di corrispondere al totale mostrato |
| CL-05 | Voce negativa (conguaglio a credito) | documento costruito nel test: `voce-A` categoria `canone`, `importoCent: 1000`; `voce-B` categoria `una-tantum`, `importoCent: -200`; `totaleDichiaratoCent: 800` | `quadra = true` (`1000-200=800`); `pesoBp(A) = 1000×10000/800 = 12500` (125%); `pesoBp(B) = -200×10000/800 = -2500` (-25%); somma **esatta** `12500+(-2500)=10000`. Il segno meno **resta**, non `Math.abs()` | Un credito può far pesare una singola voce **più del 100%** del totale: un componente che limitasse la percentuale a 100 (comune in una barra di progresso) la mostrerebbe sbagliata. E se il segno venisse tolto, un credito diventerebbe indistinguibile da un addebito: un'alterazione del significato del documento, non solo un errore di stile |
| CL-06 | Consumo a zero kWh, ma la voce di consumo esiste ed è positiva | fixture reale con `voce-01.quantita: 0` (importo resta 4000) | `prezzoEnergiaPerKwhCent = 4000/0` e `costoTotalePerKwhCent = 7876/0`: in aritmetica JavaScript, `Infinity`. **Nessuno dei due valori compare a schermo**: la spec lo vieta per nome («non si mostra Infinity») | Una divisione per zero non lancia un errore in JavaScript: produce silenziosamente `Infinity`, che un formattatore ingenuo trasformerebbe in una stringa a schermo (`Infinity €` o peggio). È il tipo di guasto che nessuno nota finché non càpita la bolletta sbagliata |
| CL-07 | Consumo assente, non solo zero | fixture reale con `voce-01.quantita` **omesso** (il campo è opzionale nel contratto) | Stesso trattamento di CL-06: nessun costo per kWh mostrato. In JavaScript `4000/undefined = NaN`, non `Infinity`: è un guasto diverso, non lo stesso caso ripetuto | `NaN` e `Infinity` sono due modi distinti di rompere lo stesso calcolo (`undefined` propaga `NaN`, `0` propaga `Infinity`): un controllo scritto per l'uno (`=== Infinity`) lascerebbe passare l'altro indisturbato |
| CL-08 | Nessuna voce di consumo nel documento | documento costruito nel test: solo `canone` (1800), `altro` (1000), `imposta` (360), `imposta` (716); `totaleDichiaratoCent: 3876` | `energiaCent = 0` (nessuna voce `consumo` trovata); `nonEnergiaCent = 3876 - 0 = 3876`; le due quote **0% / 100%**, senza `NaN` | È il «caso del conguaglio a zero consumi» che la spec chiede esplicitamente al test unitario: una bolletta fatta di soli costi fissi, in cui la quota «dipende dal consumo» è legittimamente zero, non un errore |
| CL-09 | Importo a sette cifre in euro | documento costruito nel test: `voce-A` (`consumo`) `importoCent: 190000000`, `voce-B` (`canone`) `importoCent: 10000000`, `totaleDichiaratoCent: 200000000` (2.000.000,00 €) | `pesoBp(A) = 190000000×10000/200000000 = 9500` (95,00%), `pesoBp(B)=500` (5,00%), somma 10000 esatta; **nessun overflow** (ben sotto il limite degli interi sicuri di JavaScript); il valore resta allineato a destra, cifre tabulari, nessuna riga spezzata a metà numero | `design.md`: «è il caso che rompe le griglie». I 78,76 € della fixture reale non lo dimostrano: serve un importo che sposti la colonna |
| CL-10 | Etichetta lunghissima | voce costruita nel test con `etichettaOriginale`: «Spesa per il trasporto, la gestione, la lettura e la manutenzione ordinaria e straordinaria del contatore e della rete di distribuzione» (oltre 100 caratteri) | Il testo va a **capo su più righe**, resta associato al proprio importo sulla stessa riga logica, nessun `text-overflow: ellipsis`, nessuna barra di scorrimento orizzontale | La spec lo dichiara con l'esempio reale («Spesa per il trasporto e la gestione del contatore», 34 caratteri): questo caso lo porta al limite più lungo plausibile su un documento vero, dove il layout deve reggere senza troncare — un troncamento sarebbe un'etichetta diversa, non solo un problema estetico |
| CL-11 | Periodo di un solo mese | stessi importi e la stessa `quantita` della fixture reale, `periodoInizio: '2026-07-01'`, `periodoFine: '2026-07-31'` | Pesi, quote e costo per kWh **identici** a C-01…C-06: nessuno di questi calcoli usa il periodo come input | È la controprova diretta della scelta dichiarata di non usare `LetturaCalcolata`/`proiezioneAnnuaCent`: se il risultato di `05` cambiasse anche di un solo bp al variare del periodo, vorrebbe dire che un fattore di proiezione dipendente dal periodo si è insinuato esattamente dove la spec dice che non deve esserci |
| CL-12 | Periodo di sei mesi | stessi importi, `periodoInizio: '2026-01-01'`, `periodoFine: '2026-06-30'` | Stesso risultato di CL-11, identico a C-01…C-06 | Controprova nel verso opposto: un mese e sei mesi sono i due estremi ragionevoli per una bolletta. Se uno dei due cambiasse il risultato e l'altro no, l'anomalia sarebbe nella direzione del cambiamento, non nella sua assenza |
| CL-13 | Voce con categoria `altro`, non nascosta né riclassificata | `voce-03` della fixture reale, «Spesa per oneri di sistema», categoria `altro`, 1000 cent | La voce compare con categoria **`altro` invariata** (non spostata in `imposta`), il proprio `pesoBp` (1270, da C-02) e la propria spiegazione: non nascosta, non accorpata ad altre voci | La spec lo dichiara una scelta esplicita: mettere gli oneri di sistema in `imposta` sarebbe comodo e sarebbe falso. Un'implementazione che «pulisse» la categoria per farla sembrare più definita altererebbe il significato dell'informazione originale — il divieto più esplicito di tutto il documento |
| CL-14 | Venti righe e un totale a quattro cifre in euro | documento costruito nel test: 20 voci identiche da `importoCent: 10000` (100,00 €) ciascuna, `totaleDichiaratoCent: 200000` (2.000,00 €) | `quadra=true`; ogni voce pesa `500 bp` (5,00%), somma **10000** esatta su 20 voci; le venti righe restano leggibili, nessuna sovrapposizione, nessuna barra di scorrimento orizzontale | È il caso vero dichiarato dalla spec — «la bolletta del gas a conguaglio: venti righe e un totale a quattro cifre» — e il caso di stress che nessuna delle fixture a cinque voci può esercitare |
| CL-15 | Documento senza alcuna voce | documento costruito nel test: `voci: []`, `totaleDichiaratoCent: 500` | `sommaVociCent = 0`, diverso da `500` → `scartoCent = 500`, `quadra = false`; `energiaCent = 0`, `nonEnergiaCent = 0`; nessuna riga nel facsimile | Una lista vuota non è uno stato che il calcolo può ignorare: senza voci la quadratura non torna quasi mai (a meno che anche il totale dichiarato sia zero), ed è il caso che uno stato «Vuoto» scritto per gestire solo l'assenza di dati — non l'assenza totale di quadratura — lascerebbe scoperto |

## 3. Errori attesi

*Che cosa succede quando l'input non è valido, o quando un'implementazione
"migliora" ciò che non deve toccare — e **come lo vede la persona**. Un
errore corretto mostrato male resta un difetto.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | **La quadratura che non torna si segnala, non si corregge** | fixture reale con `totaleDichiaratoCent` alterato di un centesimo: `7877` invece di `7876` | `sommaVociCent = 7876`, `totaleDichiaratoCent = 7877` → `scartoCent = 1`, `quadra = false`. Il totale mostrato a schermo resta **quello stampato sul documento** (7877), non la somma delle voci; compare un messaggio in linguaggio umano che segnala lo scarto, non un codice tecnico | È il comportamento vietato per nome dalla spec: «il core lo confronta con la somma delle righe e segnala lo scarto, non lo corregge». Un'implementazione che sostituisse silenziosamente il totale con la somma delle voci (o viceversa) nasconderebbe a chi legge esattamente il segnale che stava cercando confrontando la bolletta con l'anno scorso |
| E-02 | **Le etichette non vengono «tradotte»** | le cinque `etichettaOriginale` della fixture reale, in particolare `Spesa per oneri di sistema` e `Spesa per il trasporto e la gestione del contatore` | Il testo compare **identico, byte per byte**, nell'output del core e a schermo — non una parafrasi come «Costi di sistema» o «Trasporto energia» | La spec nomina questo rischio per esteso: «altrimenti chi confronta lo schermo con la carta non ritrova la riga». Nessuna regola del lessico blocca una riformulazione "più chiara" del genere (non contiene parole vietate): solo un confronto letterale con la fixture lo scopre |
| E-03 | **Nessuna voce viene omessa o arrotondata via** | l'array delle voci calcolate sulla fixture reale | Lunghezza **esattamente 5**, inclusa `voce-04` (accisa, 360 cent = 3,60 €, la più piccola in valore assoluto), ciascuna con il proprio `pesoBp` | La spec lo vieta per nome in «Cosa questa funzionalità NON fa»: se una riga piccola sparisse, la somma delle righe visibili smetterebbe di corrispondere al totale stampato — è lo stesso scarto silenzioso che questa funzionalità esiste per rendere visibile, non per produrre |
| E-04 | **I pesi non vengono forzati a sommare 10.000 bp** | documento costruito nel test: tre voci da `importoCent: 1` ciascuna, `totaleDichiaratoCent: 3` | Ogni voce pesa `1×10000/3 = 3333,33 → 3333 bp`; la somma dei tre pesi è **9999**, non 10000 — **nessuna correzione** dell'ultimo peso per farlo tornare | Sul documento reale i cinque pesi sommano esattamente 10000 per una coincidenza aritmetica (C-02), non per un meccanismo di correzione. Una tecnica di «resto più grande» che aggiustasse l'ultimo peso per far quadrare la somma altererebbe silenziosamente un numero pur di far tornare un totale — esattamente il tipo di correzione non richiesta che la quadratura (E-01) invece dichiara apertamente |
| E-05 | **Nessun numero annualizzato compare nell'output di `05`** | l'oggetto restituito da `letturaBolletta()` sulla fixture reale | **Nessun campo** di proiezione annua (né `proiezioneAnnuaCent`, né un valore ottenuto moltiplicando una voce ricorrente per `12/mesi`) — verificabile leggendo le chiavi dell'oggetto restituito, o come caso di tipo se `LetturaBolletta` è dichiarato con una forma chiusa (da confermare in fase 2, nota introduttiva) | È il rischio che la spec dichiara esplicitamente evitando `LetturaCalcolata`: «su un bimestre sarebbe una moltiplicazione per sei presentata come un dato annuo». Un riuso di codice "per comodità" che aggiungesse comunque quel campo mostrerebbe un numero che il documento non dice mai |
| E-06 | **Il messaggio di scarto si legge anche senza vedere il colore** | il messaggio di E-01, reso a schermo | Testo leggibile («Controlla questo numero, sembra troppo alto» o equivalente in linguaggio umano), non solo un bordo o uno sfondo colorato: corpo ≥16px, contrasto ≥4,5:1 | Richiama `scrittura-e-accessibilita.md`: un errore corretto mostrato male resta un difetto anche quando la causa è un refuso di chi ha scritto la fixture, non un dato digitato da chi legge |

## 4. Conformità

*Richiama la suite dei guardrail, non la riscrive: il lessico vive in
`src/guardrails/lessico.ts` ed è scandito da `tests/lessico-ui.test.ts`, che
cammina già su tutto `src/`. CF-01 – CF-03 richiamano quella copertura; da
CF-04 in poi ci sono i controlli che questa funzionalità introduce e che la
suite generale non fa da sola.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Lessico prescrittivo sulle stringhe nuove | le chiavi nuove in `src/ui/testiBolletta.ts` (nomi non ancora noti dalla sola specifica — bozze in prosa, non chiavi; nota introduttiva, punto 5) | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico esistente | Richiamo alla suite esistente: elencare di nuovo qui i termini vietati farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Nessuna radice vietata negli identificatori nuovi | `letturaBolletta`, `PaginaBolletta`, `BarraDueQuote`, `testiBolletta`, `stiliBolletta` | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Il vincolo vale anche dove chi legge non guarda, e questi nomi sopravviveranno più a lungo delle stringhe a schermo |
| CF-03 | Le etichette originali non vengono riscritte — richiamo | le cinque `etichettaOriginale` della fixture reale | Già coperto **due volte**: da E-02 sopra (confronto letterale, dedicato) e dalla scansione generale dei letterali di `tests/lessico-ui.test.ts`. Non serve un terzo test, solo la conferma che nessuno le ha «semplificate» | Evita la divergenza fra tre copie dello stesso controllo: questo è un richiamo, non una riscrittura |
| CF-04 | **La prosa del core non viene mai stampata così com'è** | le cinque `VoceCalcolata.spiegazione` prodotte da `letturaBolletta()` sulla fixture reale, confrontate col markup della pagina | **Nessuna** delle cinque stringhe esatte restituite dal core compare, carattere per carattere, nel testo reso a schermo: la schermata usa testi propri (`src/ui/testiBolletta.ts`), composti a partire dai dati strutturati (`pesoBp`, `importoCent`, `categoria`), non la prosa del core incollata | La regola (`standard-codice.md`: «tutte le stringhe rivolte all'utente stanno in `src/ui/testi.ts`») non è verificata da nessun test esistente per questo caso specifico: `voce.spiegazione` è un **dato**, non un letterale nel codice, quindi il lessico non la scandisce. Stampare direttamente la frase già pronta del core è la scorciatoia più naturale per chi costruisce l'interfaccia sotto tempo — ed è esattamente il punto in cui il confine si perde in silenzio |
| CF-05 | **Il confine dell'«e allora?»: nessun fornitore, nessuna tariffa** | le stringhe nuove di `testiBolletta.ts` | Nessuna menzione di `cambia fornitore`, `mercato libero`, `tariffa` in un contesto di scelta, `offerta` | **Gap dichiarato nel lessico attuale, non da correggere qui**: `cambia\sfornitore` (letterale) è già bloccato; ma `passa\sa` **non** blocca «passa al mercato libero» (il controllo di confine dopo la `a` fallisce perché segue la lettera `l` di «al» — verificato a mano sulla regex di `lessico.ts`), e «mercato libero» / «offerta» non sono radici vietate di per sé. Per queste due formulazioni specifiche il controllo automatico **non basta**: resta necessaria la rilettura umana di `guardrail-officer`, come la spec stessa prevede («il lessico prende le parole, non le intenzioni») |
| CF-06 | Nessuna chiamata di rete | build di produzione, con il Wi-Fi spento | Funziona per intero: la fixture è importata come dato statico, non recuperata | Richiamo al controllo esistente sul bundle: il primo dei tre vincoli non negoziabili |
| CF-07 | I quattro stati obbligatori, individuati | la schermata della bolletta | **Vuoto** e **in caricamento**: ereditati da `04` (spec, sezione «I quattro stati obbligatori»), non ridichiarati qui — materia dei casi di `04`, se esistono. **Errore**: E-01 (quadratura che non torna). **Dati lunghi**: CL-09 (importo a sette cifre), CL-10 (etichetta lunghissima), CL-14 (venti righe) | Una schermata che esiste solo nel caso perfetto non è finita. I due stati specifici di `05` sono individuati con un caso ciascuno; i due ereditati non sono materia di questo file, e dirlo evita di duplicarli o di darli per scontati senza verifica |
| CF-08 | Accessibilità della riga apribile | ciascuna delle cinque righe del facsimile | Ogni riga apribile è un `<button>` vero: raggiungibile con `Tab`, si apre con `Invio` **e** con `Spazio`, porta `aria-expanded` che passa a `true` e `aria-controls` collegato alla spiegazione; area cliccabile **minimo 44×44 px** sull'intera riga, non solo sul testo; nessuna informazione (l'evidenziazione, la spiegazione) disponibile solo al passaggio del mouse; focus visibile, mai `outline: none` senza sostituto; il segno di «apribile» ha sempre una parola accanto, mai un'icona sola | È il contratto di accessibilità che la spec **ripete per intero**, non riferisce, proprio perché una guida a zone cliccabili è il punto in cui questi errori si commettono per distrazione. Al proiettore e su un telefono, un dato visibile solo in hover non esiste per metà di chi guarda |
| CF-09 | La navigazione non cambia posizione | arrivo alla pagina della bolletta, confrontato con le altre schermate | «Indietro» nella stessa posizione fissata dalle altre pagine del sito | Richiamo, non ripetizione del percorso di `doc-funzionale`: una pagina nuova è esattamente il punto in cui la coerenza di navigazione si perde per disattenzione |
| CF-10 | Nessuna logica di calcolo nel componente | il componente della pagina (`PaginaBolletta.tsx`, `BarraDueQuote.tsx`) | Pesi, quote, costo per kWh e quadratura sono valori **già calcolati dal core**, letti dall'oggetto restituito da `letturaBolletta()` — nessuna divisione, sottrazione o percentuale scritta dentro il JSX | `standard-codice.md`: un calcolo nel componente non è testabile dal core e non compare nelle fixture. È lo stesso principio già verificato per il numero della `03` (CF-03 di quel file): un numero deve venire da una funzione chiamata, non da un'espressione incollata |

---

## Referto

*Scritto da `tester` in **fase 2**, dopo aver implementato in
`tests/accettazione/` ed **eseguito** i casi qui sopra. Finché questa sezione
è vuota, la fase 2 non è stata fatta e la funzionalità non è finita.*

| ID | Atteso | Ottenuto | Esito | File di test |
| --- | --- | --- | --- | --- |

### Fallimenti

*Che cosa è fallito, **con quale input**, e se è bloccante. Non si corregge il
codice: si riporta.*

### Non coperti

*Ogni caso non implementabile, **con il motivo**. Un buco dichiarato vale più
di un test finto che passa, e alimenta i limiti dichiarati del prodotto.*
