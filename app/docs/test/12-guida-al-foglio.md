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

---

*(segue in `docs/test/12-guida-al-foglio.md`: sezioni 3 «Errori attesi», 4
«Conformità» e «Referto» — aggiunte nei passaggi successivi di scrittura)*
