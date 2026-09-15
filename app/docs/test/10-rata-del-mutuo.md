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
