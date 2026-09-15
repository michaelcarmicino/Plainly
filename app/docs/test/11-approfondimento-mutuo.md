# 11 — casi di prova per «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»

> Scritto da `tester` in **fase 1**, dalla sola specifica
> `docs/features/11-approfondimento-sul-mutuo.md` — **non dal codice**, che
> per questa funzionalità non esiste ancora: nessun file sotto `src/` è stato
> letto per derivare un caso (`src/guardrails/lessico.ts` è stato letto solo
> per non duplicarne il contenuto, come richiesto dal mandato del tester).
>
> Confine con `doc-funzionale`: lui scrive «come si prova», il percorso
> nominale già dichiarato in «Come si dimostra che ha funzionato». Qui si
> scrive **cosa può andare storto** — e, per questa funzionalità più che per
> ogni altra finora, che cosa la sembra una buona spiegazione ed è invece un
> consiglio travestito.

## Che cosa NON viene ripetuto, perché già coperto da `03`

La `11` è **un'istanza** della struttura riusabile del task `03` (sette
istanze, non una). `docs/test/03-pagina-di-spiegazione.md` prova già, per il
contenitore in generale:

- l'ordine dei blocchi (immagine prima del nome tecnico, mai il contrario);
- l'indivisibilità esempio/paragone/fonte/avvertenza;
- il percorso a gradini e il divieto di troncare l'ultimo con «…»;
- lo stato «Vuoto» di un'area senza istanze e il meccanismo `statoPlaceholder`;
- il fatto che un numero mostrato deve venire dal core, non da un letterale
  copiato.

Questi principi si **assumono validi** per ognuna delle sette schermate di
concetto di `11` e non vengono ridimostrati uno per uno qui. Quello che segue
prova solo ciò che `11` introduce di nuovo: l'ottava schermata (l'indice, che
non è un'istanza di `PaginaSpiegazione` — vedi nota 3 sotto), le due funzioni
nuove di `quoteRata.ts`, le tre trappole di lessico specifiche del mutuo,
l'assenza di seconda persona imperativa e di prova sociale, e «sette concetti,
non una tabella con sette righe».

## Punti su cui la specifica non decide, segnalati e non indovinati

1. **La forma esatta delle rotte «a due segmenti»** (`src/ui/rotte.ts`,
   percorso dell'indice e dei sette concetti) non è scritta in questa
   specifica. I casi che ne hanno bisogno useranno i percorsi realmente
   esportati dal modulo quando esisteranno, non uno slug inventato qui.
2. **Se le sette istanze di concetto siano tipizzate come `PaginaSpiegazione`
   di `03`** (con l'obbligo a tempo di compilazione di `nonFa` non vuoto) **o
   con un tipo dedicato non ancora dichiarato** non è deciso da questa
   specifica: parla di «struttura riusabile... nei suoi quattro pezzi», non
   di un quinto tipo condiviso. Se in fase 2 risultasse il primo caso, la
   riga di confine (blocco 8) godrebbe della stessa garanzia strutturale già
   provata da `03` CL-01/CL-02/CF-12 e i casi qui sotto sulla riga di confine
   (C-09, CF-07) diventerebbero **[tipo]**, non a runtime. Se risultasse il
   secondo, quella garanzia **non esiste ancora per il mutuo** — è una
   differenza da segnalare, non un difetto: la specifica stessa non la
   richiede esplicitamente come vincolo di tipo.
3. **La schermata indice non è un'istanza di `PaginaSpiegazione`**: non ha i
   quattro pezzi (domanda/immagine/esempio/link), ha un elenco di sette voci
   con stato costruito/placeholder. La sua forma non è vincolata da nessun
   tipo dichiarato in questa specifica: i casi sull'indice (C-03, CL-15,
   CL-16) sono tutti a runtime.
4. **`quoteDellaRata` prende `capitaleResiduoCent`, non un indice di rata.**
   «Rata numero zero» e «rata oltre l'ultima», richiesti come casi limite, non
   corrispondono quindi a una funzione con un parametro `k` che la specifica
   non dichiara: sono stati interpretati come i due valori limite del
   parametro che la specifica usa davvero — `capitaleResiduoCent` pari al
   capitale prestato (nessuna rata ancora pagata) e pari a zero (debito già
   estinto) — non come un indice arbitrario passato a una funzione
   inesistente.
5. **`quoteRata.ts` è descritto come aritmetica pura**, senza un tipo
   `Esito<T>` dichiarato per un fallimento di calcolo. I casi di errore sul
   numero mostrato (E-02) riguardano quindi solo `rataMutuo()` di `10` (che
   nella sua specifica ha stringhe di errore in lingua umana), non
   `quoteRata.ts` stesso.

## 1. Percorso nominale

*Le tre schermate con numeri (1, 3, 4), la navigazione, e l'unico invariante
aritmetico che la specifica chiede esplicitamente di verificare «sulla
somma».*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| C-01 | La rotta dell'indice risolve | il percorso dell'indice del mutuo | Restituisce la schermata indice, non la home | È il punto d'ingresso di tutta la funzionalità |
| C-02 | Tre tap dalla home | home → area «Il futuro» → domanda `area3Altra2` | Si arriva all'indice del mutuo al terzo tap, non al quarto | La specifica lo dichiara come limite: «tre tap, non un tap in più» |
| C-03 | L'indice elenca le sette voci nell'ordine di costruzione | rendering dell'indice a funzionalità completa | Compaiono, in quest'ordine, i titoli dei sette concetti: ammortamento, TAN/TAEG, durata, fisso/variabile, spese iniziali, surroga, rata sospesa | La specifica fissa quest'ordine per un motivo esplicito: «apre la schermata 1, l'unica contro-intuitiva»; se il tempo finisce si legge dal fondo |
| C-04 | Il concetto 1 mostra le due rate agli estremi | mutuo d'esempio: `100.000,00 €`, 3,00%, 300 rate | Compaiono insieme, per la prima rata, interesse **250,00 €** e capitale **224,21 €**; per l'ultima, interesse **1,18 €** e capitale **473,03 €** — tutti e quattro ottenuti chiamando `quoteDellaRata`, non scritti a mano nel testo | È il fatto che la specifica chiama «il fatto contro-intuitivo che chiunque abbia un mutuo ha visto senza capirlo»: se questi quattro numeri fossero letterali, un domani un cambio della formula lascerebbe la pagina con un numero sbagliato senza che nessun test se ne accorga |
| C-05 | **La somma delle quote capitale di tutte le rate torna esattamente il capitale prestato** | si applica `quoteDellaRata` in sequenza per le 300 rate dell'esempio (25 anni, 3%), aggiornando ad ogni passo `capitaleResiduo_{k+1} = capitaleResiduo_k − capitaleCent_k`, a partire da `capitaleResiduo_1 = 10.000.000 cent` | La somma delle 300 `capitaleCent_k` è **esattamente** `10.000.000 cent` (100.000,00 €), e `capitaleResiduo_301 = 0` | È la lettura letterale del mandato: «le quote capitale di tutte le rate rimesse insieme devono ridare esattamente il capitale prestato». **È anche il caso con più probabilità di non tornare**: la specifica calcola l'ultima rata con una formula chiusa indipendente (`round(rataCent / (1+i))`), non con questa stessa ricorsione; se le 298 rate intermedie accumulano anche un solo centesimo di scarto per arrotondamento, la somma non torna esatta, e la specifica non discute come le due vie si concilino |
| C-06 | Il concetto 3 mostra il confronto fra durate | stesso capitale e tasso, 300 rate contro 360 rate | Compaiono **−52,61 €** al mese e **+9.513 €** di interessi in tutto, ottenuti da due chiamate a `rataMutuo()`/`quoteRata.ts`, non da un letterale | «Cosa deve poter fare dopo»: dirlo a voce con questi due numeri esatti |
| C-07 | Il concetto 4 mostra il confronto fra tassi | stessa durata (300 rate), 3,00% contro 4,00% | Compare **+53,63 €** al mese per un punto di tasso in più | Stesso motivo di C-06, sul secondo confronto che la specifica elenca |
| C-08 | Il link al simulatore compare solo dove la specifica lo mette | rendering delle sette schermate di concetto | `mutuoLinkSimulatore` presente in fondo alle schermate 1, 3, 4; **assente** nelle schermate 2, 5, 6, 7 | La specifica lo dice per nome: «il link ce l'ha in fondo alle schermate 1, 3 e 4» — un link ovunque suggerirebbe un simulatore anche dove non c'è nulla da simulare |
| C-09 | Ogni schermata di concetto chiude con la propria riga di confine | rendering delle sette schermate | Le sette chiavi `mutuoAmmortamentoConfine`, `mutuoTanTaegConfine`, `mutuoDurataConfine`, `mutuoFissoVariabileConfine`, `mutuoSpeseInizialiConfine`, `mutuoSurrogaConfine`, `mutuoRataSospesaConfine` compaiono tutte, ciascuna **per ultima** nel proprio rendering | Condizione vincolante 1 della specifica: «ogni schermata chiude con una riga che dichiara il proprio confine». Se la garanzia sia a compilazione o solo a runtime dipende dal punto 2 delle note sopra |
| C-10 | L'ipotesi dell'esempio è dichiarata nella stessa frase dei numeri | i numeri dell'esempio (100.000 €, 25/30 anni, 3%/4%) ovunque compaiano | `mutuoIpotesiEsempio` (o l'equivalente) è nella stessa frase dei numeri, non in una nota separata, in **ognuna** delle schermate 1, 3, 4 | «Un esempio dichiarato non è un dato sbagliato: è un dato che non finge di essere altro» — se la dichiarazione mancasse anche in una sola comparsa, quella cifra sembrerebbe un tasso di mercato vero |

## 2. Casi limite e valori di confine

*Prima i cinque valori limite dell'aritmetica di `quoteRata.ts` esplicitamente
richiesti («rata numero zero, rata oltre l'ultima, durata di una rata sola,
tasso a zero, capitale a otto cifre»), poi i nove termini tecnici che la
specifica elenca — ciascuno verificato dopo la propria immagine concreta, mai
isolato in un'etichetta senza frase intorno — poi i due estremi dello stato
«Vuoto» dell'indice.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CL-01 | «Rata numero zero» — nessuna rata ancora pagata | `totaleRestituitoCent(rataCent = 47.421, n = 0)` | `// 47.421 × 0 = 0 -> totale 0 cent; interessi = 0 − 10.000.000 = −10.000.000 cent = −100.000,00 €` — un risultato negativo e privo di senso nel dominio (nessun mutuo genera interessi negativi) | La specifica non dichiara una guardia per `n = 0`, e le funzioni non restituiscono `Esito<T>`: il caso mostra che il valore prodotto non ha significato pratico, non che il codice debba rifiutarlo — è un'apertura da segnalare, non un comportamento da indovinare |
| CL-02 | «Rata oltre l'ultima» — debito già estinto | `quoteDellaRata(capitaleResiduoCent = 0, tassoAnnuoBp = 300, rataCent = 47.421)` | `// 0 × 300 ÷ 120.000 = 0 -> interesse 0 cent; capitale = 47.421 − 0 = 47.421 cent = 474,21 €` — l'intera rata «abbatte» un debito che non esiste più | Risultato ben definito aritmeticamente ma privo di senso pratico: nessuna schermata lo mostra, il caso prova solo che la funzione non richiede una guardia che la specifica non dichiara |
| CL-03 | Durata di una rata sola (`n = 1`) — prima e ultima coincidono | capitale 100.000,00 €, tasso 3,00%, `n = 1` | `// rata = 10.000.000 × 1,0025 = 10.025.000 cent = 100.250,00 €` (esatto, nessun arrotondamento). `// interesse = 10.000.000 × 300 ÷ 120.000 = 25.000 cent = 250,00 €` su **entrambe** le formule (prima e ultima, perché coincidono); `// capitale = 10.025.000 − 25.000 = 10.000.000 cent = 100.000,00 €` — l'unica rata restituisce l'intero capitale | È il caso degenere in cui le due formule della specifica (prima e ultima) descrivono la stessa rata: se divergessero anche di un centesimo qui, sarebbe esattamente il difetto che il progetto dichiara di voler impedire |
| CL-04 | Tasso annuo a zero — nessun interesse | `quoteDellaRata(capitaleResiduoCent = 1.200.000, tassoAnnuoBp = 0, rataCent = 100.000)`, poi `totaleRestituitoCent(100.000, 12)` | `// interesse = 1.200.000 × 0 ÷ 120.000 = 0`; `// capitale = 100.000 − 0 = 100.000 cent = 1.000,00 €`; `// totale = 100.000 × 12 = 1.200.000 cent`; `// interessi totali = 1.200.000 − 1.200.000 = 0` | Caso esplicitamente richiesto: «tasso a zero (nessun interesse)». Tutta la rata è capitale, senza arrotondamenti fantasma |
| CL-05 | Capitale a otto cifre | 10.000.000,00 € (1.000.000.000.000 cent — *nota: nella notazione in centesimi «otto cifre» si riferisce all'importo in euro, non ai centesimi*), tasso 3,00%, 300 rate | `// per linearità (×100 rispetto all'esempio di riferimento): interesse prima rata = 25.000,00 €; capitale prima rata = 22.421,00 €` — il valore resta allineato a destra, cifre tabulari, nessuna riga spezzata a metà numero | Design.md: «è il caso che rompe le griglie» — l'esempio di riferimento (100.000 €) non lo dimostra da solo. Non corrisponde a un'istanza dichiarata dal contenuto (che fissa 100.000 €): se `ui-builder` non espone un modo di verificarlo a schermo, il caso resta un test diretto su `quoteRata.ts`, lecito perché richiesto esplicitamente per questa sezione |
| CL-06 | «Ammortamento» dopo la propria immagine | concetto 1, testo intero | `indexOf(immagine del blocco 2) < indexOf('ammortamento')`, e il termine compare dentro una frase, non da solo in un titolo | Schema fondamentale: prima l'immagine concreta, poi il nome tecnico |
| CL-07 | «TAN» dopo la propria immagine | concetto 2, testo intero | Stessa verifica di CL-06 sul termine «TAN» | Idem |
| CL-08 | «TAEG» dopo la propria immagine | concetto 2, testo intero | Stessa verifica di CL-06 sul termine «TAEG» | Idem — e distinto da TAN nella stessa frase, perché la domanda del concetto 2 è proprio «uno è il prezzo dei soldi, l'altro mette dentro anche...» |
| CL-09 | «Istruttoria» dopo la propria immagine | concetto 2 (nome tecnico) **e** concetto 5 (elenco spese), ogni comparsa | Stessa verifica di CL-06, ripetuta per **entrambe** le comparse del termine | Il termine ricorre in due schermate diverse: basta che una sola comparsa sia isolata perché il caso fallisca |
| CL-10 | «Perizia» dopo la propria immagine | concetto 2 **e** concetto 5, ogni comparsa | Stessa verifica di CL-06 su entrambe le comparse | Stesso motivo di CL-09: la specifica lo elenca in entrambe le schermate |
| CL-11 | «Ipoteca» dopo la propria immagine, e solo nel concetto 5 | concetto 5, testo intero | Stessa verifica di CL-06; **e** nessuna occorrenza del termine fuori dal concetto 5 | «L'ipoteca sta nella schermata 5 e non in una sua»: la specifica lo dichiara esplicitamente — un secondo posto in cui compare sarebbe la schermata propria che la specifica nega |
| CL-12 | «Imposta sostitutiva» dopo la propria immagine | concetto 5, testo intero | Stessa verifica di CL-06 | La stessa etichetta è anche il caso dichiarato per lo stato «Dati lunghi» (CL-14 sotto): qui si verifica solo l'ordine immagine/termine |
| CL-13 | «Surroga» e «rinegoziazione» dopo la propria immagine | concetto 6 (surroga) e concetto 7 (rinegoziazione) | Stessa verifica di CL-06 su entrambi i termini, ciascuno nella propria schermata | I due termini si assomigliano («spostare il mutuo» / «cambiare le condizioni») ed è facile scambiarli: un test per ciascuno evita che l'uno copra per errore l'altro |
| CL-14 | L'etichetta «imposta sostitutiva» va a capo sotto i 768 px | concetto 5, larghezza di viewport 375 px e 768 px | Il testo va a capo su più righe, larghezza di lettura ≤70 caratteri, nessun `text-overflow: ellipsis`, nessuna barra di scorrimento orizzontale | La specifica lo dichiara per nome nello stato «Dati lunghi»: «è l'etichetta che va a capo per prima» |
| CL-15 | L'indice con un solo concetto costruito | `contenutiMutuo.ts` dichiara solo il concetto 1; gli altri sei restano testo | L'indice mostra comunque sette voci: una cliccabile verso il concetto 1, sei marcate con `statoPlaceholder`, nessun link rotto | La specifica lo dichiara esplicitamente come il modo onesto di gestire il tempo che finisce: «l'indice mostra le voci non ancora costruite come testo semplice» |
| CL-16 | L'indice senza nessun concetto ancora costruito | `contenutiMutuo.ts` vuoto (stato limite del tipo, anche se non realistico a funzionalità finita) | Sette voci, tutte con `statoPlaceholder`, nessuna cliccabile, nessun errore di rendering | Verifica che il meccanismo dell'elenco onesto non presupponga almeno un elemento già costruito — l'altro estremo di CL-15 |

## 3. Errori attesi

*Che cosa succede quando l'indirizzo è storto o il calcolo non è disponibile
— e come lo vede la persona, non solo il compilatore. Non c'è niente da
digitare in questa funzionalità: ogni errore è di percorso o di calcolo, mai
di validazione di un campo.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| E-01 | Un indirizzo scritto a mano verso un concetto inesistente | percorso a due segmenti con un id di concetto che non esiste (es. `#/mutuo/non-esiste`) | Compare `mutuoConcettoNonTrovato` in lingua umana, con la via per **tornare all'indice** — non una pagina bianca | La specifica lo scrive per nome, ed è più specifico del comportamento generico di `03` (che ricade sulla home): qui il ritorno dichiarato è all'indice del mutuo, non alla home del sito |
| E-02 | Il calcolo del core non è disponibile | un ingresso costruito nel test per far restituire `{ ok: false }` a `rataMutuo()` | Il solo riquadro dell'esempio numerico è sostituito da `mutuoEsempioNonCalcolabile`; il resto della schermata (immagine, nome tecnico, riga di confine) resta presente e funzionante | Stesso schema del caso E-03 della `03`: con i valori fissi dichiarati dalla schermata (100.000 €, 3-4%, 25-30 anni) `rataMutuo()` restituisce `ok:true` per costruzione — sono scelti apposta per essere validi. Il caso è quindi **non riproducibile con il contenuto reale**, costruito solo per provare che il ramo esiste |
| E-03 | L'ipoteca non guadagna una schermata propria | conteggio delle schermate realmente dichiarate in `contenutiMutuo.ts` | Esattamente otto schermate (un indice + sette concetti); nessuna nona schermata dedicata all'ipoteca | La specifica lo vieta per nome: «l'ipoteca sta nella schermata 5 e non in una sua». Una nona schermata sarebbe la prima forma di scivolamento di questa funzionalità |
| E-04 | Nessuna domanda duplicata fra le sette schermate di concetto | le sette domande-titolo dichiarate nella tabella dei concetti | Nessuna coppia di concetti condivide la stessa domanda-titolo | Stesso principio del caso E-05 della `03`, applicato alle sette istanze nuove: due concetti con la stessa domanda sarebbero due risposte in competizione |
| E-05 | Un percorso mutuo senza concetto (`#/mutuo/` o `#/mutuo`) | `parseRotta('#/mutuo/')` e `parseRotta('#/mutuo')` | **Segnalato, non deciso dalla specifica**: il testo dice che l'indice ha una propria rotta, ma non dice esplicitamente se un percorso mutuo senza id cada sull'indice o sulla home. Il caso verifica quale dei due accade davvero e lo riporta, non presume quale sia «giusto» | Campo vuoto è uno dei valori di confine che il mandato chiede sempre di controllare; qui coincide con un punto che la specifica non ha deciso |
| E-06 | Il messaggio di errore si legge, non solo si intuisce | `mutuoConcettoNonTrovato` e `mutuoEsempioNonCalcolabile`, resi a schermo | Testo ≥16px, contrasto ≥4,5:1, linguaggio umano («questo calcolo non è disponibile», non un codice tecnico) — non un'icona sola, non un colore sganciato dal testo | Richiamo a `scrittura-e-accessibilita.md`: un errore corretto mostrato male resta un difetto, anche quando la causa è un percorso o un ingresso costruito da chi scrive il contenuto, non digitato da chi legge |

## 4. Conformità

*Questa è la funzionalità in cui il criterio «spiega e calcola, non
consiglia» è il vero cancello, per ammissione della specifica stessa. Il
lessico generale resta in `src/guardrails/lessico.ts` — CF-01 e CF-02 lo
richiamano. Da CF-03 in poi ci sono i vincoli che **questa** funzionalità
introduce, e che il lessico generale non intercetta da solo: sono la parte più
pesante di questa lista, non un'aggiunta di contorno.*

| ID | Cosa si prova | Input | Risultato atteso | Perché conta |
| --- | --- | --- | --- | --- |
| CF-01 | Nessun linguaggio prescrittivo del lessico generale nelle stringhe nuove | tutte le chiavi `mutuo*` in `testiMutuo.ts` e `testiMutuoConcetti.ts` | `tests/lessico-ui.test.ts` verde, senza modifiche al lessico esistente | Richiamo alla suite esistente: ripetere qui i termini vietati farebbe divergere le due copie alla prima aggiunta |
| CF-02 | Nessuna radice vietata negli identificatori nuovi | `PaginaMutuo`, `PaginaConcettoMutuo`, `quoteDellaRata`, `totaleRestituitoCent`, `contenutiMutuo`, `testiMutuo`, `testiMutuoConcetti`, `stiliMutuo` | Nessuna radice di `RADICI_VIETATE_NEGLI_IDENTIFICATORI` | Questi nomi sopravvivranno più a lungo delle stringhe a schermo |
| CF-03 | **Il caso che pesa di più**: le tre trappole del lessico dichiarate dalla specifica | tutte le chiavi `mutuo*` | Nessuna contiene «passa **a** X €» (deve essere «passa **da**... a...» o «diventa»); nessuna contiene «la legge garantisce» (deve essere «la legge prevede»); nessuna contiene «senza rischi» riferito al tasso fisso (deve essere «la cifra della rata non cambia»). Test scoped sul modello di `tests/lessico-simulazione-risparmio.test.ts`, non una riscrittura del lessico generale | La specifica segnala queste tre come «esattamente quelle che verrebbero naturali su questa pagina». **«Allungare» e «durata» non sono radici vietate**: solo un test scoped su queste formulazioni esatte distingue «chi allunga la durata paga una rata più bassa e un totale di interessi più alto» (ammesso) da «conviene allungare la durata» (vietato, ma già intercettato da `convenienza` nel lessico generale) |
| CF-04 | Nessuna frase in seconda persona che indichi un'azione | tutte le chiavi `mutuo*`, in particolare quelle del concetto 3 (durata) e del concetto 6 (surroga) | Nessuna forma imperativa o di secondo verbo alla seconda persona singolare/plurale che indichi un'azione da compiere («allunga», «scegli il fisso», «spostati in un'altra banca», «tratta con la banca», «rinegozia»); ammesse le forme impersonali con «chi» («chi allunga...») | Condizione vincolante 1 della specifica, e il punto in cui il lessico da solo non basta: è una forma grammaticale, non una radice fissa. **Segnalato come limite**: un test scoped su un elenco di verbi coprirà solo i verbi elencati, non ogni imperativo possibile in italiano — non sostituisce la rilettura umana di `guardrail-officer` |
| CF-05 | Nessuna prova sociale | tutte le chiavi `mutuo*` | Nessuna stringa contiene una percentuale o una frazione riferita a quante persone o quanti mutui scelgono un'opzione (pattern tipo «oltre il 90%», «quasi metà», abbinato a «italiani», «persone», «mutui», «sceglie», «scelgono») | Condizione vincolante 2: il documento d'origine riporta «oltre il 90% degli italiani sceglie il fisso» e «quasi metà dei nuovi mutui è a 30 anni» — la specifica li esclude per nome perché «fanno tutti così» è un consiglio travestito da statistica |
| CF-06 | Sette concetti in otto schermate, non una tabella con sette righe | rendering completo della funzionalità | Sette schermate raggiungibili con sette percorsi distinti; **nessun** rendering in cui i sette concetti compaiono come righe di un'unica tabella o di un'unica lista con tutti i dettagli insieme | «Un concetto per schermata» non è un'estetica: è la regola che impedisce di affiancare durata e tasso nella stessa vista, dove il confronto implicito («guarda, il fisso a 25 anni costa meno del variabile a 30») diventerebbe un consiglio per giustapposizione |
| CF-07 | Nessuna riga di confine contiene essa stessa un consiglio mascherato | le sette chiavi `mutuo*Confine` (vedi C-09) | Nessuna contiene seconda persona imperativa o linguaggio comparativo di valore («migliore», «conviene») | Il confine dichiarato dalla specifica deve limitarsi a dire che cosa la schermata non fa, non deve scivolare a sua volta in un suggerimento — sarebbe l'ironia peggiore: il limite che viola se stesso |
| CF-08 | Nessuna chiamata di rete | build di produzione | Nessun `fetch` verso l'esterno nel bundle; i numeri delle tre schermate con esempio sono aritmetica su un ingresso fisso dichiarato nel contenuto | «Nessun dato di mercato, nessuna fixture, nessun documento»: il vincolo di dominio più esplicito di questa specifica |
| CF-09 | La formula della rata non viene riscritta | diff del branch di questa funzionalità | `src/core/rataMutuo.ts` non compare nel diff — solo importato; `quoteRata.ts` lo chiama, non lo duplica | «Due implementazioni della stessa formula divergono di un centesimo, e il centesimo che non torna è il difetto che questo progetto dichiara di voler impedire» |
| CF-10 | Il confronto con i totali non affianca mai il tasso fermo al tasso variabile | tutte le schermate con numeri | Nessuna schermata mostra un totale di interessi a tasso variabile accanto a un totale a tasso fermo; il confronto con i totali esiste **solo** fra due durate a parità di tasso (concetto 3) | Il divieto posto da `10` resta in piedi: un totale su 25 anni di tasso variabile sarebbe una previsione, e due totali affiancati direbbero «questa costa meno» |
| CF-11 | La surroga e il Fondo di solidarietà dichiarano la condizione nella stessa frase del meccanismo | concetto 6 (surroga) e concetto 7 (rata sospesa) | «Si può spostare il mutuo» e «la banca nuova deve accettarlo» sono nella stessa frase, non in una nota separata; «il Fondo di solidarietà esiste» e «vale in alcune situazioni previste dalla legge» idem | Criterio 3 della specifica: «la condizione sta nella stessa frase del meccanismo, mai in una nota» — una condizione separata in una nota a parte è quasi invisibile a chi legge di corsa |
| CF-12 | Nessuna pressione temporale nella schermata 7 | concetto 7 (rata sospesa) | Nessuna delle radici del lessico generale (`urgenza`: affrettati, subito prima che, offerta limitata, imperdibile) compare, **e** nessun'altra formulazione che metta fretta | Condizione vincolante 3: è il testo letto nel momento di massimo stress. **Limite dichiarato**: l'automazione copre solo le radici note; la rilettura umana di `guardrail-officer`, che la specifica rende esplicitamente obbligatoria per questa sola schermata, non è sostituibile da un test |
| CF-13 | Accessibilità di base, solo le parti nuove | le otto schermate | Corpo ≥16px, interlinea ≥1,5, contrasto ≥4,5:1 (richiamo a `03` CF-09, non ripetuto in dettaglio); in più: l'etichetta «imposta sostitutiva» va a capo senza rompere la griglia (CL-14), i sette bersagli dell'indice sono ≥44px con testo accanto, nessuna informazione degli otto stati disponibile solo al passaggio del mouse | Siamo a un hackathon sull'inclusione: questa è la pagina letta da chi ha appena firmato il debito più grande della sua vita, non solo da chi la collauda su uno schermo grande |
| CF-14 | I quattro stati obbligatori esistono tutti | l'insieme dei casi sopra | Vuoto → CL-15, CL-16 (indice con placeholder). In caricamento → nessun I/O, il riquadro dell'esempio occupa già il suo spazio (nessuno stato di attesa da mostrare, il testo è nel bundle). Errore → E-01, E-02. Dati lunghi → CL-05, CL-14 e le sette domande lunghe una riga e mezzo nell'indice | Una schermata che esiste solo nel caso perfetto non è finita — la stessa regola già applicata alla `03` e alla `13` |
| CF-15 | L'ipotesi dell'esempio non è mai presentata come un dato di mercato | ogni comparsa dei numeri fissi (100.000 €, 25/30 anni, 3%/4%) in tutta la funzionalità | Ogni comparsa è accompagnata, nella stessa frase o nel medesimo blocco, dalla dichiarazione che è un esempio (richiamo a C-10, verificato qui su **ogni** comparsa, non solo sulla prima) | «Scriverli a mano senza fonte sarebbe un numero inventato»: se anche una sola comparsa perdesse la dichiarazione, quel numero sembrerebbe un tasso reale |

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
