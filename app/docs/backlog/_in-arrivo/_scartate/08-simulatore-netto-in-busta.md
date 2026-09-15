# 08 — «Quanto mi resta davvero in busta, e dove va il resto»

> Stato: **proposta** · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 4, simulatore 2. Task di backlog: `08`.
>
> **Uno scostamento in più rispetto al documento d'origine, e va letto prima
> del resto**: la formula della sezione 4 omette la **detrazione per lavoro
> dipendente**, e questa specifica la **include**. Il motivo è nella sezione
> qui sotto: l'omissione non è una semplificazione, è un numero diverso.

## Perché la detrazione entra nel calcolo

La formula del documento d'origine si fermerebbe a
`netto = lordo − contributi − IRPEF lorda`. Il vincolo violato non è quello
sul consigliare: è il terzo, **nessuna semplificazione può alterare il
significato dell'informazione originale**.

La detrazione per lavoro dipendente non è un dettaglio di contorno: è una
somma che lo Stato **toglie dall'imposta**, e su un reddito medio pesa
**duemila euro l'anno o più**. Il caso A qui sotto, verificato a mano, lo
misura:

| | Netto mensile |
| --- | --- |
| Con la detrazione, come in questa specifica | **1.576,30 €** |
| Senza, come nella formula d'origine | 1.398,47 € |
| Differenza | **177,83 € al mese**, 2.311,80 € in un anno |

Centosettantasette euro al mese è più di una bolletta. Una schermata
intitolata «quanto ti resta davvero in busta» che li lascia fuori non dà una
stima prudente: dà **un altro numero**, e chi confronta il risultato con il
cedolino che ha in mano trova uno scarto che non sa spiegare — e conclude,
giustamente, che il sito non sa fare il conto.

Le **addizionali regionali e comunali restano fuori**, e per un motivo
diverso: dipendono dal comune di residenza, quindi senza chiedere dove abita
la persona non esistono come numero. Quella omissione va **dichiarata accanto
al risultato**, non in fondo alla pagina: tira nella direzione opposta alla
detrazione, cioè abbassa il netto di qualche decina di euro al mese.

## Per chi

Una persona con la busta paga in mano che legge due numeri molto distanti —
il lordo in alto e quello che le arriva sul conto — e non sa che cosa sia
successo in mezzo. Ha sentito dire «ti tolgono le tasse», ma non sa quanto,
non sa a chi vanno, e non sa se quella differenza sia normale o riguardi solo
lei.

Non è un consulente del lavoro e non è un commercialista: è chi riceve un
documento, vede una sottrazione che non ha fatto, e vorrebbe sapere da dove
viene.

## Quando serve

Nel momento in cui arriva la busta paga e i due numeri non tornano. Oppure nel
momento in cui qualcuno le propone un lordo — un colloquio, un rinnovo, un
passaggio di livello — e lei deve capire che cosa significhi per la spesa di
tutti i mesi: un lordo annuo, da solo, non compra niente, è il netto mensile
che si confronta con l'affitto.

È anche il punto di arrivo dalla guida alla busta paga (task `04`): chi sta
leggendo le voci del documento e vuole rifare il conto sul proprio caso.

## Cosa deve poter fare dopo

Dire due cifre riferite a sé: «con 2.000 € lordi al mese e 13 mensilità me ne
restano 1.576,30 al mese» e «su ogni 100 € che il datore di lavoro scrive come
lordo, 78,82 arrivano sul mio conto».

Osservabile: sa dire **quanto** va in contributi, **quanto** in imposta sul
reddito, **quanto** lo Stato le ridà come detrazione, **quanto** resta — e che
i pezzi rimessi insieme fanno esattamente il lordo di partenza, senza avanzi.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `lordoMensileCent` | intero in centesimi | lo digita la persona |
| `mensilita` | intero, 12–14 | lo digita la persona |
| `contributi` | aliquote in bp e soglia in centesimi | **parametro**, da un modulo dichiarato |
| `scaglioni` | soglie in centesimi e aliquote in bp | **parametro**, da un modulo dichiarato |
| `detrazione` | le quattro fasce, in centesimi e bp | **parametro**, da un modulo dichiarato |

Si chiede il **lordo mensile**, non il lordo annuo, perché il lordo mensile
sta scritto sulla busta che la persona ha in mano mentre il lordo annuo sta
sul contratto, che spesso non ha sottomano. Le mensilità non si possono
dedurre — 12, 13 o 14 cambiano il risultato di parecchio — ma sono un fatto
che la persona conosce: è quante volte l'anno le arriva lo stipendio.

Il lordo annuo non è un terzo campo: si ricava con una moltiplicazione fra
interi, `lordoMensileCent × mensilita`, senza arrotondamenti.

> ### Blocco da sciogliere, non un dettaglio
>
> **Aliquote IRPEF, soglie degli scaglioni, aliquota contributiva INPS con la
> sua soglia di eccedenza, e i cinque numeri della detrazione sono dati che
> nessuno di noi può inventare**, e non possono venire dalla rete: un
> aggiornamento automatico sarebbe una chiamata esterna, che il prodotto non
> fa — né a runtime né in fase di build.
>
> I valori citati nel documento d'origine e quelli della detrazione scritti
> qui sotto sono **una decisione di progetto, non una circolare verificata con
> il suo anno d'imposta**. Finché una persona non recupera la fonte e dichiara
> **l'anno d'imposta a cui si riferiscono**, sono valori di prova: il calcolo
> si può rifare, la loro provenienza non si può ancora controllare.
>
> **L'architettura è studiata perché questo blocco non fermi
> l'implementazione**, esattamente come nella `07`: la funzione del core
> **riceve contributi, scaglioni e detrazione come parametri** e non legge mai
> la costante dichiarata, quindi codice e test si scrivono e passano subito.
> Resta da riempire **un modulo separato**, `src/core/fiscoDichiarato.ts`, che
> tiene i valori insieme alla loro provenienza e a un flag
> `annoImpostaDichiarato` inizialmente `false`. Finché il flag è falso **la
> schermata lo dice**, invece di presentare le aliquote come un fatto
> verificabile. È lo stesso schema di `src/core/inflazioneDichiarata.ts`.

### La detrazione per lavoro dipendente, documentata

Fonte normativa: **TUIR art. 13 comma 1** (D.P.R. 917/1986, testo vigente
dopo la Legge di Bilancio 2022), aliquote e importi pubblicati da **Agenzia
delle Entrate**; aggiornamento **annuale**, legato alla Legge di Bilancio —
la stessa cadenza dichiarata nella tabella della sezione 7 del documento
d'origine.

È una funzione **a scaglioni decrescente** del reddito complessivo `R`. Per un
lavoratore dipendente puro, `R` coincide con l'imponibile IRPEF del passo 3
(lordo annuo meno i contributi obbligatori): non è un'approssimazione, è la
definizione.

| Fascia di `R` | Detrazione annua |
| --- | --- |
| fino a 15.000 € | **1.880 €** fissi |
| oltre 15.000 € e fino a 28.000 € | **1.910 € + 1.190 € × (28.000 − R) / 13.000** |
| oltre 28.000 € e fino a 50.000 € | **1.910 € × (50.000 − R) / 22.000** |
| oltre 50.000 € | **zero** |

Più una regola che non è una fascia: se `R` sta **oltre 25.000 € e fino a
35.000 €**, la detrazione così ottenuta **aumenta di 65 €**.

Due proprietà da conoscere prima di scrivere il codice:

- **la funzione non è continua a 15.000 €** (1.880 € da una parte, 3.100 €
  dall'altra). Non è un errore di trascrizione: è così nel testo di legge.
  Chi implementa non «aggiusti» il salto per renderlo liscio;
- **la detrazione si ferma alla capienza dell'imposta.** Non è un rimborso:
  può solo azzerare l'IRPEF, non renderla negativa. Sui redditi bassi la
  detrazione **eccede** l'imposta e l'eccedenza si perde — il caso D qui sotto
  lo esercita. Quello che nella busta vera recupera parte di quell'eccedenza è
  un altro istituto, fuori da questa schermata e dichiarato nei limiti.

Restano fuori, dichiarati: la detrazione **rapportata al periodo di lavoro**
(qui si assume l'anno intero), la soglia minima per i rapporti a tempo
determinato, e ogni altra detrazione — familiari a carico, spese sanitarie,
interessi del mutuo — che dipende dalla situazione di chi legge e che il
prodotto non chiede.

## Elaborazione

Tutto in `src/core/`, puro e deterministico: nessun I/O, nessun `Date.now()`,
nessun `Math.random()`. Aritmetica **interamente su interi**;
**l'arrotondamento avviene una volta sola per ogni grandezza**, mai su un
valore intermedio già arrotondato.

1. **Lordo annuo.** `lordoAnnuoCent = lordoMensileCent × mensilita`.
   Moltiplicazione fra interi: esatta.

2. **Contributi a carico della persona.** L'aliquota base si applica fino alla
   soglia, quella maggiorata solo alla quota che la supera:

   ```
   quotaBaseCent      = min(lordoAnnuoCent, sogliaEccedenzaCent)
   quotaEccedenteCent = max(0, lordoAnnuoCent - sogliaEccedenzaCent)
   contributiCent     = round(
       (quotaBaseCent × aliquotaBaseBp + quotaEccedenteCent × aliquotaEccedenzaBp)
       / 10_000 )
   ```

   Il numeratore è un prodotto fra interi e la divisione per 10.000 avviene
   una volta sola, alla fine: le due tranche non si arrotondano separatamente.

3. **Imponibile IRPEF, che è anche il reddito di riferimento della
   detrazione.** `imponibileCent = lordoAnnuoCent - contributiCent`.

4. **IRPEF lorda a scaglioni.** Per ogni scaglione si prende **solo la
   porzione di imponibile che ci sta dentro**, non tutto l'imponibile:

   ```
   porzioneCent  = max(0, min(imponibileCent, limiteSuperioreCent) - limiteInferioreCent)
   irpefLordaCent = round( Σ (porzioneCent × aliquotaBp) / 10_000 )
   ```

   Il limite inferiore di uno scaglione è il limite superiore del precedente;
   il primo parte da zero, l'ultimo non ha tetto (`limiteSuperioreCent: null`).
   La somma si accumula come intero e si divide per 10.000 **una volta sola**.

5. **Detrazione per lavoro dipendente**, sulla tabella qui sopra. La parte
   fissa è già un intero esatto in centesimi: l'unico arrotondamento sta sulla
   parte proporzionale, e avviene una volta.

   ```
   R = imponibileCent

   R <=  1_500_000  ->  188_000
   R <=  2_800_000  ->  191_000 + round(119_000 × (2_800_000 - R) / 1_300_000)
   R <=  5_000_000  ->            round(191_000 × (5_000_000 - R) / 2_200_000)
   altrimenti       ->  0

   se 2_500_000 < R <= 3_500_000  ->  + 6_500
   ```

6. **IRPEF netta, con la capienza.**
   `irpefNettaCent = max(0, irpefLordaCent - detrazioneCent)`.
   Il `max(0, …)` non è una precauzione: è la regola. E
   `detrazionePersaCent = max(0, detrazioneCent - irpefLordaCent)` si calcola
   e si conserva, perché quando è diversa da zero la schermata deve poterlo
   dire invece di mostrare una detrazione più grande di quella che ha agito.

7. **Netto annuo.**
   `nettoAnnuoCent = lordoAnnuoCent - contributiCent - irpefNettaCent`.
   Per costruzione i tre pezzi rimessi insieme fanno **esattamente** il lordo:
   non c'è uno scarto da nascondere, ed è la proprietà che il test verifica su
   ogni caso.

8. **Netto mensile.** `nettoMensileCent = round(nettoAnnuoCent / mensilita)`.
   È il numero grande della schermata, e l'unico punto in cui una divisione
   non esatta lascia un resto: arrotondamento al centesimo più vicino, con il
   mezzo centesimo verso l'alto.

9. **Il paragone concreto — quanto resta di ogni 100 € lordi.**
   `nettoPerCentoEuroCent = round(nettoAnnuoCent × 10_000 / lordoAnnuoCent)`.
   Cento euro sono una banconota che tutti hanno avuto in mano: è il paragone
   mostrato accanto al risultato, non un secondo calcolo che potrebbe non
   tornare.

10. **Le tre quote della barra, in punti base.**

    ```
    quotaContributiBp = round(contributiCent × 10_000 / lordoAnnuoCent)
    quotaIrpefBp      = round(irpefNettaCent × 10_000 / lordoAnnuoCent)
    quotaNettoBp      = 10_000 - quotaContributiBp - quotaIrpefBp
    ```

    La terza quota si **ricava per differenza**, non si arrotonda: è l'unico
    modo perché la barra chiuda sempre esattamente al 100% invece di lasciare
    uno o due punti base di buco visibile a schermo. Scelta dichiarata, non
    una svista: gli importi in centesimi restano quelli dei passi 2, 6 e 7, ed
    è su quelli che si verifica la quadratura. **`quotaNettoBp` e
    `nettoPerCentoEuroCent` devono dare lo stesso numero**: se divergono, uno
    dei due passi è sbagliato.

### Verifica a mano, da riportare nel commento del test

Quattro casi, ognuno per una ragione. I valori del fisco sono quelli di prova
descritti sopra: contributi 9,19% con 10,19% oltre 52.190 €/anno; IRPEF
23% fino a 28.000 €, 33% fino a 50.000 €, 43% oltre.

**Caso A — quello della demo.** `lordoMensileCent = 200_000` (2.000,00 €),
`mensilita = 13`. Esercita la seconda fascia della detrazione e il primo
scaglione IRPEF da solo.

```
lordo annuo      = 200.000 × 13                        = 2.600.000 cent (26.000,00 €)
contributi       = 2.600.000 × 919 / 10.000            =   238.940 cent ( 2.389,40 €)
                   (26.000 sotto la soglia 52.190: nessuna quota eccedente)
imponibile = R   = 2.600.000 - 238.940                 = 2.361.060 cent (23.610,60 €)
IRPEF lorda      = 2.361.060 × 2300 / 10.000
                 = 5.430.438.000 / 10.000 = 543.043,8 ->  543.044 cent ( 5.430,44 €)
detrazione       R sta fra 1.500.000 e 2.800.000 -> seconda fascia
  parte fissa    = 191.000
  delta          = 2.800.000 - 2.361.060                =   438.940
  parte propor.  = 119.000 × 438.940 / 1.300.000
                 = 52.233.860.000 / 1.300.000 = 40.179,89 ->  40.180
  (R = 23.610,60 € non supera 25.000: nessun aumento di 65 €)
  detrazione     = 191.000 + 40.180                     =   231.180 cent ( 2.311,80 €)
IRPEF netta      = max(0; 543.044 - 231.180)            =   311.864 cent ( 3.118,64 €)
netto annuo      = 2.600.000 - 238.940 - 311.864        = 2.049.196 cent (20.491,96 €)
netto mensile    = 2.049.196 / 13 = 157.630,46...      ->  157.630 cent ( 1.576,30 €)
su 100 € lordi   = 2.049.196 × 10.000 / 2.600.000 = 7.881,52 -> 7.882 cent (78,82 €)
quota contributi =   238.940 × 10.000 / 2.600.000 =   919,00 ->   919 bp ( 9,19%)
quota IRPEF      =   311.864 × 10.000 / 2.600.000 = 1.199,48 -> 1.199 bp (11,99%)
quota netto      = 10.000 - 919 - 1.199                 =     7.882 bp (78,82%)
quadratura       = 238.940 + 311.864 + 2.049.196 = 2.600.000  ✓ esatto
paragone e quota = 7.882 = 7.882                              ✓ coincidono
```

**Caso B — la terza fascia della detrazione, l'aumento di 65 € e due
scaglioni IRPEF.** `lordoMensileCent = 250_000` (2.500,00 €), `mensilita = 13`.

```
lordo annuo      = 250.000 × 13                        = 3.250.000 cent (32.500,00 €)
contributi       = 3.250.000 × 919 / 10.000 = 2.986.750.000/10.000
                                                       =   298.675 cent ( 2.986,75 €)
imponibile = R   = 3.250.000 - 298.675                 = 2.951.325 cent (29.513,25 €)
IRPEF 23% su 0..28.000      : 2.800.000 × 2300 = 6.440.000.000
IRPEF 33% su 28.000..R      :   151.325 × 3300 =   499.372.500
IRPEF lorda      = 6.939.372.500 / 10.000 = 693.937,25 ->  693.937 cent ( 6.939,37 €)
detrazione       R sta fra 2.800.000 e 5.000.000 -> terza fascia
  delta          = 5.000.000 - 2.951.325                = 2.048.675
  parte propor.  = 191.000 × 2.048.675 / 2.200.000
                 = 391.296.925.000 / 2.200.000 = 177.862,24 -> 177.862
  aumento        R = 29.513,25 € sta fra 25.000 e 35.000 ->  + 6.500
  detrazione     = 177.862 + 6.500                      =   184.362 cent ( 1.843,62 €)
IRPEF netta      = max(0; 693.937 - 184.362)            =   509.575 cent ( 5.095,75 €)
netto annuo      = 3.250.000 - 298.675 - 509.575        = 2.441.750 cent (24.417,50 €)
netto mensile    = 2.441.750 / 13 = 187.826,92...      ->  187.827 cent ( 1.878,27 €)
su 100 € lordi   = 2.441.750 × 10.000 / 3.250.000 = 7.513,08 -> 7.513 cent (75,13 €)
quota contributi =   298.675 × 10.000 / 3.250.000 =   919,00 ->   919 bp ( 9,19%)
quota IRPEF      =   509.575 × 10.000 / 3.250.000 = 1.567,92 -> 1.568 bp (15,68%)
quota netto      = 10.000 - 919 - 1.568                 =     7.513 bp (75,13%)
quadratura       = 298.675 + 509.575 + 2.441.750 = 3.250.000  ✓ esatto
```

**Caso C — tutti e tre gli scaglioni, la soglia dei contributi, e la
detrazione azzerata perché il reddito supera 50.000 €.**
`lordoMensileCent = 500_000` (5.000,00 €), `mensilita = 12`.

```
lordo annuo      = 500.000 × 12                        = 6.000.000 cent (60.000,00 €)
quota base       = min(6.000.000; 5.219.000) = 5.219.000 ×  919 = 4.796.261.000
quota eccedente  = 6.000.000 - 5.219.000 =     781.000  × 1019 =   795.839.000
contributi       = 5.592.100.000 / 10.000              =   559.210 cent ( 5.592,10 €)
imponibile = R   = 6.000.000 - 559.210                 = 5.440.790 cent (54.407,90 €)
IRPEF 23% su 0..28.000      : 2.800.000 × 2300 =  6.440.000.000
IRPEF 33% su 28.000..50.000 : 2.200.000 × 3300 =  7.260.000.000
IRPEF 43% oltre 50.000      :   440.790 × 4300 =  1.895.397.000
IRPEF lorda      = 15.595.397.000 / 10.000 = 1.559.539,7 -> 1.559.540 cent (15.595,40 €)
detrazione       R = 54.407,90 € supera 50.000          ->         0
IRPEF netta      = 1.559.540 - 0                       = 1.559.540 cent (15.595,40 €)
netto annuo      = 6.000.000 - 559.210 - 1.559.540     = 3.881.250 cent (38.812,50 €)
netto mensile    = 3.881.250 / 12 = 323.437,5          ->  323.438 cent ( 3.234,38 €)
su 100 € lordi   = 3.881.250 × 10.000 / 6.000.000 = 6.468,75 -> 6.469 cent (64,69 €)
quota contributi =   559.210 × 10.000 / 6.000.000 =   932,02 ->   932 bp ( 9,32%)
quota IRPEF      = 1.559.540 × 10.000 / 6.000.000 = 2.599,23 -> 2.599 bp (25,99%)
quota netto      = 10.000 - 932 - 2.599                 =     6.469 bp (64,69%)
quadratura       = 559.210 + 1.559.540 + 3.881.250 = 6.000.000  ✓ esatto
```

Il caso C esercita anche il **mezzo centesimo esatto** (`323.437,5 → 323.438`,
verso l'alto).

**Caso D — la capienza: la detrazione è più grande dell'imposta.**
`lordoMensileCent = 70_000` (700,00 €), `mensilita = 12`.

```
lordo annuo      =  70.000 × 12                        =   840.000 cent ( 8.400,00 €)
contributi       =   840.000 × 919 / 10.000            =    77.196 cent (   771,96 €)
imponibile = R   =   840.000 - 77.196                  =   762.804 cent ( 7.628,04 €)
IRPEF lorda      =   762.804 × 2300 / 10.000
                 = 1.754.449.200 / 10.000 = 175.444,92 ->  175.445 cent ( 1.754,45 €)
detrazione       R non supera 1.500.000 -> prima fascia =   188.000 cent ( 1.880,00 €)
IRPEF netta      = max(0; 175.445 - 188.000)           =         0 cent (     0,00 €)
detrazione persa = 188.000 - 175.445                   =    12.555 cent (   125,55 €)
netto annuo      =   840.000 - 77.196 - 0              =   762.804 cent ( 7.628,04 €)
netto mensile    =   762.804 / 12                      =    63.567 cent (   635,67 €)
su 100 € lordi   =   762.804 × 10.000 / 840.000 = 9.081,00 -> 9.081 cent (90,81 €)
quota contributi =    77.196 × 10.000 / 840.000 =   919,00 ->   919 bp ( 9,19%)
quota IRPEF      =         0                            ->       0 bp ( 0,00%)
quota netto      = 10.000 - 919 - 0                     =     9.081 bp (90,81%)
quadratura       = 77.196 + 0 + 762.804 = 840.000             ✓ esatto
```

Senza il `max(0, …)` del passo 6 questo caso darebbe un'IRPEF **negativa** e un
netto **superiore al lordo meno i contributi**: cioè un rimborso che nessuno
riceve. È la ragione per cui il caso D sta nel test.

> **Nota sull'aritmetica.** A differenza della `07`, qui **non compare nessun
> numero a virgola mobile nel dominio**: non ci sono esponenziali, solo
> moltiplicazioni fra interi e divisioni arrotondate una volta sola. Il
> prodotto più grande resta molto sotto `Number.MAX_SAFE_INTEGER`: con il
> tetto del campo (10.000.000 cent al mese × 14 mensilità) il numeratore
> massimo dell'IRPEF sta intorno a 6·10¹¹, quello della detrazione intorno a
> 10¹², contro un intero sicuro di circa 9·10¹⁵.

### I motivi di rifiuto, come codici

Stesso schema della `07`: **codici, non frasi**. Le parole che legge una
persona stanno tutte in `src/ui/`, unico punto in cui il lessico viene
scandito, e un codice non cambia quando il testo viene riscritto.

`lordo-non-leggibile` · `lordo-sotto-zero` · `lordo-a-zero` ·
`lordo-troppo-alto` · `mensilita-non-intere` · `mensilita-fuori-intervallo` ·
`contributi-non-validi` · `scaglioni-non-validi` · `detrazione-non-valida`

Limiti del campo digitato, non dell'aritmetica: `MENSILITA_MIN = 12`,
`MENSILITA_MAX = 14`, `LORDO_MENSILE_MAX_CENT = 10_000_000` (100.000,00 € al
mese: oltre, è quasi sempre un errore di battitura). Gli ultimi tre codici
coprono un fisco dichiarato male — soglie non crescenti, aliquote negative,
fasce della detrazione incomplete — e servono perché quel modulo si riempie a
mano.

## Output

Una schermata sola, un concetto solo: **dove finisce il lordo**.

| Elemento | Forma |
| --- | --- |
| **Il numero grande** | il netto mensile: «1.576,30 €». È il più grande della schermata |
| Il numero di appoggio | il netto annuo, «20.491,96 € in un anno», visibilmente più piccolo |
| Il paragone | «Su ogni 100 € scritti come lordo, 78,82 € arrivano sul tuo conto» |
| **La barra in tre pezzi** | contributi · imposta sul reddito · quello che resta. Ogni pezzo ha **accanto** la sua etichetta, la sua percentuale e il suo importo in euro |
| La riga della detrazione | quanto lo Stato toglie dall'imposta: «2.311,80 € all'anno, cioè 177,83 € al mese che restano a te» |
| Da dove vengono i numeri | aliquote, soglie e detrazione usate, **con la fonte e l'anno d'imposta scritti accanto** |
| Il limite, accanto al risultato | che le addizionali regionali e comunali non sono comprese, **in corpo pieno e accanto alla cifra**, non in fondo alla pagina |

La barra non è decorativa: è il modo in cui una sottrazione diventa una cosa
che si guarda. **Nessuna informazione disponibile solo al passaggio del
mouse**: le tre etichette e i tre importi sono scritti sempre, anche su
telefono e al proiettore. Il **rosa resta riservato ai limiti e alle
esclusioni**, come vuole la regola di design: i tre pezzi della barra non lo
usano, la riga sulle addizionali sì.

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre
tabulari, unità accanto al valore, numeri allineati a destra dove stanno in
colonna.

**Stringhe nuove**: in un file dedicato `src/ui/testiNetto.ts`, incorporato in
`STRINGHE_UTENTE` di `src/ui/testi.ts` con lo spread — è la soluzione già
adottata per `testiSimulazione.ts`: il registro scandito dal guardrail resta
**un oggetto solo** e `testi.ts` non supera le 150 righe. Chiavi, per gruppo:

- intestazione — `nettoBustaOcchiello`, `nettoBustaTitolo`, `nettoBustaIntro`,
  `nettoBustaPasso`
- i due campi — `nettoBustaEtichettaLordo`, `nettoBustaAiutoLordo`,
  `nettoBustaEsempioLordo`, `nettoBustaEtichettaMensilita`,
  `nettoBustaAiutoMensilita`, `nettoBustaEsempioMensilita`
- il risultato — `nettoBustaVuoto`, `nettoBustaInSospeso`,
  `nettoBustaEtichettaValore`, `nettoBustaRisultatoMensile`,
  `nettoBustaRisultatoAnnuo`, `nettoBustaParagone`
- la barra — `nettoBustaBarraTitolo`, `nettoBustaQuotaContributi`,
  `nettoBustaQuotaIrpef`, `nettoBustaQuotaNetto`
- la detrazione — `nettoBustaDetrazione`, `nettoBustaDetrazioneNulla`,
  `nettoBustaDetrazionePersa`
- la provenienza — `nettoBustaAliquote`, `nettoBustaFonte`,
  `nettoBustaAnnoMancante`, `nettoBustaAvvertenza`
- i limiti accanto al risultato — `nettoBustaLimiteAddizionali`,
  `nettoBustaLimiteTredicesima`
- gli errori — `nettoBustaErroreLordo`, `nettoBustaErroreLordoNegativo`,
  `nettoBustaErroreLordoZero`, `nettoBustaErroreLordoAlto`,
  `nettoBustaErroreMensilita`, `nettoBustaErroreMensilitaFuori`,
  `nettoBustaErroreFisco`, `nettoBustaNotaCentesimi`
- il confine — `nettoBustaLimitiTitolo`, `nettoBustaLimiteAzione`,
  `nettoBustaLimiteDati`, `nettoBustaLimiteContratto`

Tre trappole da conoscere **prima** di scrivere queste frasi, non dopo.
`scegli` è vietato sia nei testi sia negli identificatori: il campo delle
mensilità si chiede con «quante buste paga ricevi in un anno», non con un
imperativo. `risparmier*` e `guadagner*` sono bloccati: la riga della
detrazione dice «restano a te», non «ti fa risparmiare». E ogni parola
tecnica va accompagnata **nella stessa frase** dal suo esempio quotidiano:
«contributi» da solo non dice niente, «i soldi che ogni mese vanno all'INPS e
che un giorno diventeranno la tua pensione» sì.

**I quattro stati obbligatori**, non solo quello che funziona:

1. **Vuoto** — nessuna cifra digitata: la schermata dice quali due cose
   servono **e dove si leggono sulla busta**, non «nessun risultato». La barra
   non compare vuota né a zero: al suo posto la frase che spiega che cosa
   mostrerà.
2. **In caricamento** — il calcolo è immediato e locale, quindi lo stato esiste
   ma non lampeggia: il riquadro del risultato e la barra occupano già il loro
   spazio, così il layout non salta quando i numeri arrivano.
3. **Errore** — in linguaggio umano: «Controlla questo numero, sembra troppo
   alto», mai «errore di validazione». Il numero grande non mostra mai una
   cifra calcolata su un dato che non va, e **quello già digitato nell'altro
   campo resta dov'è**.
4. **Dati lunghi o numerosi** — un lordo a sette cifre non deve rompere la
   griglia né mandare a capo il numero grande; le tre etichette della barra
   devono reggere l'andata a capo su schermo stretto senza sovrapporsi ai
   pezzi colorati e senza che l'importo si stacchi dalla sua etichetta.

### Che cosa si riusa della `07`, invece di ricostruirlo

| Pezzo | Come si riusa |
| --- | --- |
| `src/ui/CampoNumerico.tsx` | **così com'è.** È già parametrizzato per chiavi di testo: i due campi di questa schermata sono due istanze, niente da modificare |
| `src/ui/letturaCampi.ts` | **così com'è.** `leggiSomma` per il lordo, `leggiAnni` per le mensilità — è già il lettore di un intero digitato |
| `src/ui/Testo.tsx` e `t()` | **così come sono.** Segnaposto `{nome}` per ogni numero: nessuna cifra scritta a mano |
| `src/core/formatoIt.ts` | **così com'è.** `formattaEuro`, `formattaPercentuale` |
| `src/core/esito.ts` | **così com'è.** `Esito<T, Codice>` per il ramo di rifiuto |
| `src/ui/rotte.ts` | si aggiunge **una rotta**, sullo stile di `PERCORSO_VALORE_RISPARMI`. Nell'indirizzo non finisce mai la cifra digitata |
| CSS di `stiliSimulazione.css` e `stiliRisultato.css` | **classi riusate**: `.simulazione`, `.campi`, `.campo`, `.risultato`, `.risultato-cifra`, `.cifra`, `.nota-tasso`, `.limiti`. Serve **in più** il solo foglio della barra |
| `src/ui/NotaTasso.tsx` | **da generalizzare, non da copiare.** Oggi legge `INFLAZIONE_DICHIARATA` e le chiavi della `07` direttamente: va reso un componente che riceve il valore dichiarato, la sua fonte e il flag «provenienza incompleta» come proprietà. Vale per tutti i simulatori, e tocca un file della `07`: **da dichiarare nel diff, non da nascondere** |
| `src/ui/RisultatoRisparmio.tsx` | **il pattern, non il componente.** È tipizzato su `RisultatoSimulazioneRisparmio`. Si ripete la sua forma — riquadro che occupa sempre lo stesso spazio, cifra grande + paragone accanto, tre momenti — in un componente proprio |
| `src/ui/motiviRisparmio.ts` | **il pattern.** La mappa `Record<MotivoRifiuto, ChiaveStringaUtente>` esaustiva per costruzione, così il giorno in cui il core aggiunge un codice il compilatore lo segnala |

**Sull'avvertenza prescritta dal documento d'origine.** Il testo standard
(«Questo è un calcolo stimato, basato su formule semplificate e dati
pubblici…») **non esiste come stringa riusabile nella `07`**: al suo posto la
`07` ha tre righe più strette e più utili — `simulazioneRisparmioTasso`,
`simulazioneRisparmioFonte`, `simulazioneRisparmioAvvertenza` — rese da
`NotaTasso.tsx` in una posizione fissa sotto il risultato, a corpo pieno.
**Si riusa la posizione e la forma, non le parole**: un'avvertenza generica
che dice «potrebbe non corrispondere esattamente alla realtà» non è
controllabile da nessuno, mentre «le addizionali regionali e comunali non sono
comprese, e abbassano il netto» si può verificare sul proprio cedolino. È uno
scostamento dichiarato dal documento d'origine, nella direzione che le regole
di scrittura chiedono.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/nettoInBusta.test.ts`, con i valori
  attesi dei **quattro casi calcolati a mano qui sopra** scritti nel commento
  accanto all'asserzione. Copre inoltre: la **quadratura** (contributi + IRPEF
  netta + netto = lordo annuo, esatta, in tutti i casi provati); il **doppio
  controllo** fra `quotaNettoBp` e `nettoPerCentoEuroCent`, che devono
  coincidere; la **discontinuità a 15.000 €** della detrazione, verificata sui
  due lati; il rifiuto di scaglioni e fasce dichiarati male.
- **Conformità lessicale scoped** —
  `tests/lessico-netto-in-busta.test.ts`, sul modello di
  `tests/lessico-simulazione-risparmio.test.ts`: scandisce `testiNetto.ts`
  contro i termini che il lessico sitewide non copre e che qui entrerebbero
  facilmente (`aumento`, `chiedere di più`, `inquadramento`, `regime`,
  `partita IVA`), cioè le formulazioni che spostano la schermata dalla
  scomposizione di una sottrazione alla risposta alla domanda «e come faccio
  ad averne di più».
- **Test di accettazione** —
  `tests/accettazione/08-netto-in-busta.test.ts`, scritto dal `tester` dalla
  specifica, non dal codice.
- **In demo, dieci secondi**: si digita 2.000, si digita 13, compare
  **1.576,30 €** come numero grande, e sotto la barra in tre pezzi con
  9,19% ai contributi, 11,99% all'imposta, 78,82% che resta — cioè la riga «su
  ogni 100 € lordi, 78,82 arrivano sul tuo conto».

## Cosa questa funzionalità NON fa

- **Non dice a nessuno che cosa farne.** Niente su quanto chiedere di aumento,
  su come ridurre le trattenute, su quale inquadramento o quale regime. La
  schermata scompone una sottrazione e si ferma lì. È il confine più facile da
  sfondare qui, perché la domanda successiva — «e allora come faccio ad averne
  di più?» — è la ragione stessa per cui la persona è arrivata: la risposta non
  sta in questa schermata.
- **Non confronta «dipendente» e «partita IVA in regime forfettario».** La
  variante del documento d'origine **non è vietata** — due netti affiancati,
  ognuno con le voci che lo compongono, sono due fatti — ma **è una seconda
  funzionalità**: servono tre grandezze dichiarate in più (coefficiente di
  redditività, imposta sostitutiva, aliquota della Gestione Separata), un
  coefficiente **digitato dalla persona** perché varia col tipo di attività, e
  una schermata che regge quattro colonne. Una funzionalità = una spec = un
  branch: **va aperta con una spec propria**, non allargando questa. Quando
  sarà aperta, il confine che la governa è già scritto: la pagina **non
  risponde alla domanda «apro partita IVA?»**, non indica quale dei due numeri
  sia preferibile e non mostra nessuna differenza presentata come un
  vantaggio — solo i due netti e le voci che li compongono.
- **Non è la busta paga vera, e lo dice accanto al risultato.** Il calcolo
  **non include le addizionali regionali e comunali**, che dipendono dal comune
  di residenza e abbassano il netto di qualche decina di euro al mese. Sta
  scritto in corpo leggibile accanto alla cifra, non in una nota a piè di
  pagina: dichiarare un limite in un carattere che nessuno legge equivale a non
  dichiararlo.
- **Non chiede dove abita la persona**, che è l'unico modo per calcolare quelle
  addizionali. Sarebbe un dato personale in più per un numero in più: il
  prodotto preferisce dichiarare il limite.
- **Non applica nessuna detrazione oltre quella da lavoro dipendente.**
  Familiari a carico, spese sanitarie, interessi del mutuo, ristrutturazioni:
  ognuna richiederebbe di chiedere alla persona com'è fatta la sua vita, cioè
  di profilarla.
- **Non rapporta la detrazione ai giorni di lavoro nell'anno** e non applica la
  soglia minima dei rapporti a tempo determinato: assume l'anno intero, ed è
  scritto.
- **Non recupera l'eccedenza della detrazione** quando questa supera l'imposta
  (caso D). Nella busta vera un altro istituto ne restituisce una parte; qui
  l'eccedenza si dichiara e si ferma lì.
- **Non spalma correttamente la tredicesima.** Il netto mensile è il netto
  annuo diviso per le mensilità: nella busta vera il mese della tredicesima è
  tassato a parte e risulta diverso dagli altri. È una media, ed è scritto che
  è una media.
- **Non tratta i casi che non sono «lavoratore dipendente del settore
  privato»**: niente pubblico impiego, niente part-time con orario variabile,
  niente premi, straordinari, fringe benefit, bonus o trattenute personali.
  Ogni caso in più è un'aliquota in più senza fonte.
- **Non prende aliquote, scaglioni, soglie e detrazione dalla rete**, né a
  runtime né in fase di build. Le fonti restano quelle della sezione 7 del
  documento d'origine, ma i valori entrano nel codice come costanti dichiarate
  e si aggiornano a mano.
- **Non chiede e non conserva dati personali.** Le due cifre restano nella
  pagina, **non finiscono nell'indirizzo del browser** e non vengono salvate da
  nessuna parte: uno stipendio nell'hash resterebbe nella cronologia senza che
  nessuno l'abbia deciso.
- **Non legge un documento vero.** La busta paga non si carica: i due numeri si
  digitano. La lettura del cedolino voce per voce è il perimetro del task `04`,
  che da qui è collegato ma non è questo.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->


| | |
| --- | --- |
| **Contratti necessari** | **Nessuna modifica a `types/contracts.ts`.** I tipi dell'ingresso, dell'uscita e del fisco dichiarato nascono **dentro `src/core/`**, di proprietà di core-engine, come già per la `07`. In particolare **non si aggiunge un valore `'busta-paga'` a `Scenario`**: `Scenario` etichetta un `DocumentoUtente`, cioè un documento a voci, e qui non c'è nessun documento — due numeri digitati non producono una `LetturaCalcolata`. Se in corso d'opera servisse comunque un campo in `types/`, **è dell'architetto**: ci si ferma e si chiede, non si scrive |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root del repository, quindi i contratti si possono ancora estendere. Irrilevante qui, perché questa funzionalità non li tocca; ma la regola resta: **estendere `types/` è dell'architetto**, anche da sbloccati |
| **Agente incaricato** | **Due, e va detto**: `01-core-engine` per il calcolo e il modulo delle fonti (`src/core/`), `03-ui-builder` per la schermata, la barra e **tutte le stringhe** (`src/ui/`, con ogni parola in `src/ui/testi.ts` via `testiNetto.ts`). Il test di conformità lessicale scoped è di **`04-guardrail-officer`** (`tests/`). Ordine obbligato: core-engine → ui-builder → guardrail-officer |
| **Directory toccate** | **3.** `src/core/` (`nettoInBusta.ts`, `fiscoDichiarato.ts`, `__tests__/nettoInBusta.test.ts`, una riga di riesportazione in `index.ts`) · `src/ui/` (`PaginaNettoInBusta.tsx`, il componente della barra, `testiNetto.ts`, `testi.ts`, la rotta in `rotte.ts`, il foglio di stile della barra, la generalizzazione di `NotaTasso.tsx`) · `tests/` (`lessico-netto-in-busta.test.ts`, `accettazione/08-netto-in-busta.test.ts`). **`types/`, `fixtures/`, `src/guardrails/`, `src/assessment/` e `src/ingest/` non si toccano** |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/08-simulatore-netto.png` con il caso **2.000 € × 13 mensilità**, cioè lo stesso numero verificato a mano nel caso A: la slide mostra la cifra che il test dimostra. In più `../presentation/evidence/` riceve la serializzazione del caso A con la scomposizione in tre quote, generata da `/evidenza` |

### Dipendenze dichiarate

| Verso | Natura |
| --- | --- |
| `04-guida-interattiva-busta-paga` | **collegamento, non blocco.** La `04` legge il cedolino voce per voce, questa rifà il conto su una cifra digitata: sono la stessa domanda in due forme. La `04` è il punto di arrivo naturale da qui e viceversa, e le due schermate devono usare **le stesse parole** per le stesse voci. Le impronte si sovrappongono su `src/ui/` e `tests/`: **non possono girare in parallelo** |
| `13-tabella-fonti-dati-sorgente-unica` | **a valle, non bloccante.** `fiscoDichiarato.ts` è il **secondo** modulo di provenienza del progetto dopo `inflazioneDichiarata.ts`, e insieme sono ciò che la tabella delle fonti dovrà leggere come sorgente unica. La `13` **non deve esistere perché questa parta**, ma questa deve nascere con la forma che la `13` potrà consumare: valore + fonte + cadenza + flag «provenienza incompleta» |
| `07-valore-dei-risparmi-nel-tempo` | **a monte, già fatta.** Da lì arrivano i componenti riusati e il modello del dato dichiarato. La generalizzazione di `NotaTasso.tsx` tocca un file della `07`: va segnalata, non nascosta nel diff |
| la variante «dipendente / forfettario» | **a valle, da aprire con una spec propria.** Non è dentro questo perimetro |

### Pianificazione, da sapere prima di `/implementa`

L'impronta è **identica a quella della `07`** — `src/core/`, `src/ui/`,
`tests/` — e comprende `src/ui/`, che è anche l'impronta della `01`. Questo
task **non può girare in parallelo** con nessun altro che tocchi `src/ui/` o
`tests/`: in particolare `04`, `09` e `10`. La parte in `src/core/` non ha
conflitti e **può partire per prima**, perché riceve il fisco come parametro e
non attende che il modulo dichiarato sia riempito.

---

## Previsto

*Scritto da `doc-funzionale` in fase 1, dalla sola specifica, mentre il codice
viene costruito. **Tutto al futuro**: nulla qui è ancora verificato.*

### Cosa farà

«Due righe comprensibili a chi non vede il codice.»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si proverà

«I passi esatti per vederla funzionare, dall'avvio in poi:
 1. `/prepara` (solo la prima volta) · 2. `/avvia` · 3. apri … · 4. ti aspetti …

 Questi passi sono anche i CRITERI DI ACCETTAZIONE: `/implementa` li legge e li
 tratta come parte della richiesta.»

### Limiti previsti

«Cosa non farà, e perché.»

---

## Verificato

*Scritto da `doc-funzionale` in fase 2, al termine di `/implementa`, dopo aver
letto codice e test ed **eseguito** i passi qui sopra. **Tutto al presente**:
solo ciò che è stato confermato.*

*Finché questa sezione non esiste, la funzionalità non è riconciliata e
`/verifica` non la accetta come `implementato`.*

### Cosa fa

«…»

### Come si prova

«…»

### Limiti

«…»

### Divergenze fra previsto e realizzato

«Ogni scostamento, con il motivo. Si segnalano, non si appianano: riscrivere la
previsione per farla combaciare con il risultato rende inutile l'esercizio.»
