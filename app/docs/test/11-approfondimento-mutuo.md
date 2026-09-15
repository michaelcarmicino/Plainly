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
