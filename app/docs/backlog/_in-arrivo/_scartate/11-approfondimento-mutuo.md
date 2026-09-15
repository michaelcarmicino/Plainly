# 11 — «Il mutuo: che cosa vuol dire, parola per parola»

> Stato: **proposta** · 2026-09-14 · da approvare prima di `/implementa`
> Data: 2026-09-14 · Agente incaricato: «03-ui-builder», con «01-core-engine»
> e «00-architect»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 5 «Approfondimento: il Mutuo». Task di backlog: `11`.
>
> **Tre sottopunti su sette sono stati riscritti per conformità** — il 1
> (fisso o variabile), il 4 (la surroga) e il 7 (se la rata non si paga più).
> Le riscritture stanno per esteso qui sotto, **accanto al testo d'origine**:
> una riscrittura senza l'originale non è verificabile da nessuno.
> I quattro sottopunti restanti — 2 (TAN e TAEG), 3 (piano di ammortamento),
> 5 (durata), 6 (spese iniziali) — passano come sono: spiegano un meccanismo.
>
> **Un quarto scostamento, sui numeri**: i tassi citati nel documento d'origine
> («fisso intorno al 3,46%, variabile intorno al 2,80%, dati settembre 2026»)
> sono dati vivi. Non entrano scritti a mano nel testo: entrano come righe del
> registro delle fonti del task `13`, con la loro data e il loro ente.

## Per chi

Una persona alla quale la banca ha consegnato un preventivo, o il foglio
informativo di un mutuo, e che si trova davanti sei numeri e quattro sigle. Sa
che sta per firmare l'impegno economico più grande della sua vita — venti o
trent'anni — e le parole con cui quell'impegno è scritto non sono le sue.

Oppure una persona che ha già il mutuo e questo mese ha visto la rata cambiare,
e non sa perché sia cambiata né se cambierà ancora.

Non è un intermediario e non è un avvocato. È chi deve decidere, e per decidere
ha bisogno che le parole vogliano dire qualcosa.

## Quando serve

Nei tre momenti in cui il mutuo smette di essere un discorso generale:

1. **Prima della firma**, con il preventivo in mano: quando qualcuno ha appena
   pronunciato «TAEG» e non si può chiedere che cosa significhi senza sentirsi
   fuori posto.
2. **Alla prima rata che cambia**, per chi ha il tasso che si muove.
3. **Nel momento peggiore**: quando la rata non si riesce più a pagare. È il
   sottopunto 7, ed è il solo pezzo di questa funzionalità che viene letto in
   stato di stress. Per questo è scritto come se chi legge avesse trenta
   secondi e le mani che tremano.

## Cosa deve poter fare dopo

Dire con parole proprie, senza consultare niente:

- che la cifra sul cartello e la cifra che si paga sono due numeri diversi, e
  **quanto** sono diversi in euro al mese sull'esempio della pagina;
- che dentro una rata sempre uguale i due pezzi — interesse e debito — si
  scambiano di posto nel tempo, e **quanto** è il pezzo di interesse della
  prima rata;
- che il tasso fermo e il tasso che si muove non si distinguono per quanto
  costano, ma per **chi si tiene** il rischio che la cifra cambi;
- che esistono due cose scritte nella legge — il trasferimento del mutuo a
  un'altra banca e la sospensione delle rate — **che cosa prevedono e a chi si
  applicano**.

Osservabile: sa indicare, su un foglio della banca, quale numero comprende le
spese e quale no.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `tanMedioFissoBp` | punti base | **riga del registro delle fonti** (task `13`) |
| `tanMedioVariabileBp` | punti base | **riga del registro delle fonti** (task `13`) |
| `taegEsempioBp` | punti base | **riga del registro delle fonti** (task `13`) |
| `capitaleEsempioCent` | intero in centesimi | **costante dell'esempio**, dichiarata nel codice |
| `durataEsempioMesi` | intero | **costante dell'esempio**, dichiarata nel codice |
| composizione della rata | interessi e capitale in centesimi | **`src/core/` del task `10`**, non ricalcolata qui |

**Niente si digita e niente si carica.** Questa pagina non chiede la propria
situazione: né reddito, né debito, né età. È una spiegazione, non un calcolo su
una persona. L'unica pagina del progetto in cui si digitano i numeri del mutuo
è il simulatore della rata, che è il task `10`.

Il capitale e la durata dell'esempio (**120.000 € su 25 anni**) sono una
costante dichiarata, non una media: servono a dare un ordine di grandezza al
numero che la pagina mostra. La pagina lo dice — «su un mutuo di 120.000 €» —
invece di far credere che sia il caso di chi legge.

> ### Blocco da sciogliere, non un dettaglio
>
> **I tre tassi non esistono ancora come dato verificato.** Il documento
> d'origine li riporta con la data («settembre 2026») ma senza il documento da
> cui vengono; la sezione 7 dello stesso documento indica le fonti — Banca
> d'Italia / ABI e osservatori di settore, con aggiornamento mensile — e questo
> è esattamente il caso che il task `13` esiste per governare.
>
> Le righe del registro nascono con `provenienzaVerificata: false`. **Finché il
> flag è falso, la pagina lo dichiara** invece di mostrare il numero: lo stesso
> comportamento già scelto per l'inflazione in `src/core/inflazioneDichiarata.ts`
> e reso visibile da `src/ui/NotaTasso.tsx`, in rosa, che è il colore di ciò che
> il prodotto non fa.
>
> **L'architettura è studiata perché questo blocco non fermi
> l'implementazione**: le spiegazioni dei sette passi non contengono nessun
> numero, e i numeri vivono in due riquadri separati. Senza le righe verificate
> la pagina è completa e leggibile, con due riquadri che dicono che cosa manca.
> Un mutuo spiegato senza cifre resta una spiegazione; un mutuo spiegato con
> cifre di provenienza ignota è peggio del silenzio.

## I sette passi, uno per schermata — e le tre riscritture

Un concetto per schermata, sette schermate, un indice che le elenca. Non una
pagina unica da scorrere: la regola del progetto è «se servono tre
informazioni, sono tre passaggi», e qui le informazioni sono sette.

Ogni passo ha la stessa forma: occhiello dell'area (**Il costo della vita**),
titolo che è una domanda in italiano di tutti i giorni, due o tre frasi con
l'immagine concreta **prima** del nome tecnico, e — dove c'è — un solo numero
con il suo paragone. La navigazione sta nello stesso punto su tutti e sette.

### Passo 1 — «La rata che non cambia e la rata che cambia» · RISCRITTO

**Testo d'origine** (sottopunto 1):

> ❌ «Esempio concreto attuale: tasso medio fisso intorno al 3,46%, variabile
> intorno al 2,80% (dati settembre 2026) — eppure oltre il 90% degli italiani
> scelgono il fisso, non perché costi meno ma per eliminare il rischio di
> sorprese.»

**Perché non passa.** È riprova sociale: un dato vero — quanti scelgono una
cosa — usato come argomento per quella cosa. La frase «non perché costi meno
ma per…» aggiunge il movente, e un dato con il movente attaccato non è più una
descrizione, è una spinta. Il lessico automatico non la intercetta: nessuna
delle radici in `src/guardrails/lessico.ts` compare in quella frase. La ferma
solo questo cancello.

**Riscrittura.** La differenza fra i due tassi si spiega senza dire quanti li
scelgono:

> ✅ «Con il tasso fermo, la cifra che paghi il primo mese è la stessa che
> paghi l'ultimo: oggi sai quanto pagherai fra dieci anni. Con il tasso che si
> muove, la rata segue un indice deciso fuori da te: quando l'indice sale la
> rata sale, quando scende la rata scende. È la differenza fra un abbonamento a
> prezzo bloccato e una bolletta: l'abbonamento lo conosci a gennaio, la
> bolletta la scopri quando arriva. I due modi non si distinguono per quanto
> costano: si distinguono per chi si tiene il rischio che la cifra cambi.»

**Che fine fa il 90%.** Esce dalla spiegazione. Se rientra, rientra come
**descrizione del mercato**: una riga del registro delle fonti, con ente e
data, dentro un riquadro separato intitolato «com'è fatto il mercato oggi», e
senza nessuna proposizione causale attaccata. Oggi quella riga non esiste e il
numero non compare: non abbiamo la fonte, e un numero senza fonte su questa
pagina è il difetto peggiore possibile.

**Lo stesso criterio, applicato al passo 5.** Il sottopunto 5 porta un dato
della stessa natura — «quasi metà dei nuovi mutui in Italia oggi è a 30 anni,
proprio per tenere la rata sostenibile». Il sottopunto è conforme e resta, ma
la coda «proprio per tenere la rata sostenibile» è un movente attribuito, cioè
la stessa costruzione del 90%: cade. Il dato, se rientra, rientra come
descrizione del mercato con la sua riga nel registro.

### Passo 2 — «Il numero sul cartello e il numero che si paga»

Conforme come è. Spiega un meccanismo.

> ✅ «Sul cartello della banca c'è una percentuale: è l'interesse sul debito, e
> si chiama TAN. Poi ci sono le spese che stanno intorno al prestito —
> l'apertura della pratica, la perizia sulla casa, l'assicurazione obbligatoria
> — e la percentuale che le comprende tutte insieme si chiama TAEG. È il prezzo
> del biglietto aereo prima e dopo tasse e bagaglio: lo stesso volo, due
> numeri.»

**Il numero, con il suo paragone**: sui 120.000 € dell'esempio, la differenza
fra la percentuale sul cartello e quella che comprende le spese fa
**168,00 € in un anno, cioè 14,00 € al mese**; su ogni 100 € di debito sono
**14 centesimi in più ogni anno**. Il conto è nella sezione «Elaborazione» e si
rifà a mano in due passaggi.

### Passo 3 — «Perché all'inizio il debito scende così piano»

Conforme come è. È il concetto contro-intuitivo della sezione.

> ✅ «La rata è un secchio della stessa misura ogni mese. Dentro, però, ci sono
> due cose: l'interesse su quello che devi ancora, e un pezzo del debito. Nei
> primi anni devi ancora quasi tutto, quindi l'interesse si mangia la maggior
> parte del secchio e il debito scende piano. Man mano che il debito scende,
> l'interesse costa meno e il pezzo di debito nel secchio diventa più grande.
> Questo modo di dividere la rata si chiama ammortamento alla francese.»

**Due barre che si scambiano proporzione**, la prima rata e l'ultima, con
accanto scritti gli importi e le percentuali: **nessuna informazione disponibile
solo al passaggio del mouse**, perché al proiettore e su un telefono il mouse
non esiste.

**Il numero verificabile a mano**: l'interesse della prima rata sui 120.000 €
dell'esempio è **346,00 €** — e si calcola senza la formula della rata, quindi
esiste anche prima che il task `10` sia pronto. Il pezzo di debito della prima
rata, invece, è la rata meno quei 346,00 €: la rata arriva dal core del `10` e
**non si ricalcola qui**.

### Passo 4 — «La surroga: che cosa dice la legge su chi ha già un mutuo» · RISCRITTO

**Testo d'origine** (sottopunto 4):

> ❌ «La surroga: cambiare banca gratis, per legge. Se un'altra banca offre un
> tasso migliore, puoi spostare il mutuo lì senza pagare notaio, penali o
> istruttoria — è un diritto (art. 120-quater del Testo Unico Bancario), non un
> favore.»

**Perché non passa.** Descrivere un diritto previsto dall'articolo 120-quater
del Testo Unico Bancario **è informazione e va tenuta**. La formulazione no:
«se un'altra banca offre un tasso migliore, puoi spostare il mutuo lì» è un
imperativo travestito da condizionale — dice che cosa fare, non che cosa
esiste. E la parola «migliore» è vietata anche dal lessico automatico
(`comparativo-valore`, gravità `blocco`): questa frase farebbe fallire la build
prima di arrivare a schermo.

**Riscrittura.** Che cosa la legge prevede e a chi si applica:

> ✅ «Chi ha un mutuo sulla propria casa può trasferirlo a un'altra banca
> tenendo l'ipoteca già iscritta: l'operazione si chiama surroga e la prevede
> l'articolo 120-quater del Testo Unico Bancario. La legge stabilisce **chi
> paga**: le spese di quel trasferimento — notaio, perizia, istruttoria, penali
> di chiusura — non possono essere messe a carico di chi ha il mutuo. Resta
> un'operazione che la nuova banca deve accettare: la legge dice che non si
> paga, non che si ottiene. E il debito resta quello: la surroga sposta il
> contratto, non riduce quanto si deve. Il tasso del nuovo contratto è quello
> della nuova banca, che può risultare più alto o più basso di quello attuale:
> su questo la legge non dice niente.»

Tre cose che la riscrittura aggiunge e l'originale non aveva: **chi deve
accettare**, **che cosa non cambia**, e il fatto che il tasso nuovo può andare
in entrambe le direzioni. Il testo è più lungo di sei righe e dice di più: non
è una limatura per conformità, è una descrizione al posto di una spinta.

### Passo 5 — «Venti, venticinque o trent'anni: che cosa cambia»

Conforme come è, meno il movente attribuito (vedi passo 1).

> ✅ «Allungare gli anni abbassa la rata di ogni mese e alza il totale degli
> interessi: lo stesso debito, spalmato su più tempo, costa più tempo di
> interessi. Accorciare gli anni fa l'opposto. Le due cose si muovono sempre in
> direzioni opposte: non esiste una durata che abbassi entrambe.»

Il totale degli interessi per durata arriva dal core del task `10`, non si
ricalcola qui, e viene mostrato **per tutte le durate insieme e senza esito**:
tre righe, nessuna evidenziata.

### Passo 6 — «Le spese che nessuno guarda all'inizio»

Conforme come è.

> ✅ «Oltre alla rata ci sono spese che si pagano una volta sola, all'inizio, e
> che nel numero pubblicizzato non ci sono: il notaio, la perizia che stabilisce
> quanto vale la casa, l'imposta che si paga sul prestito, l'assicurazione
> obbligatoria contro incendio e scoppio. Sono gli stessi costi che la
> percentuale “tutto compreso” del passo 2 comprende: per questo quella
> percentuale è più alta dell'altra.»

**Gli importi non compaiono**, perché variano per zona, per notaio e per
importo, e nessuna riga del registro li dichiara oggi. Compare **l'elenco di
che cosa esiste** e **dove sta scritto sul proprio foglio**: chiudere questo
passo con quattro cifre inventate sarebbe l'errore che la sezione 7 del
documento d'origine esiste per impedire.

### Passo 7 — «Se la rata non si riesce più a pagare: che cosa prevede la legge» · RISCRITTO

**Testo d'origine** (sottopunto 7):

> ❌ «Cosa fare se non riesci più a pagare la rata. Contenuto protettivo:
> sospensione della rata (Fondo di solidarietà), rinegoziazione.»

**Perché non passa come è scritto.** È letteralmente «cosa fare». **Ma è anche
il contenuto più utile della sezione**, richiesto nel momento di massimo stress
di una persona: toglierlo sarebbe l'errore più grave di tutta questa spec. Va
riscritto, non rimosso. Il criterio: **si descrive che cosa esiste, non si dice
quale usare.**

**Riscrittura.**

> ✅ «Quando la rata non si riesce più a pagare, la legge prevede due strade
> diverse. Non sono la stessa cosa e non dipendono dalla stessa persona.
>
> **La sospensione delle rate.** Esiste un fondo pubblico — il Fondo di
> solidarietà per i mutui per l'acquisto della prima casa — che permette di
> fermare il pagamento delle rate per un periodo definito dalla norma. Si
> applica a chi ha un mutuo sulla prima casa entro un importo massimo stabilito
> per legge, e soltanto al verificarsi di situazioni che la norma elenca una per
> una: fra queste la perdita del lavoro dipendente, la morte, una condizione di
> handicap grave. La domanda si presenta alla banca, con il modulo previsto.
> Fermare le rate non cancella il debito: lo sposta più avanti e allunga il
> piano.
>
> **La rinegoziazione.** È un accordo fra chi ha il mutuo e la banca che cambia
> la durata o il tasso del contratto esistente. Non è un diritto: la banca può
> accettare o no.
>
> Dove sta scritto: la norma sul Fondo e il modulo si trovano presso la banca e
> presso l'ente che gestisce il Fondo, per nome. Nessuna delle due strade parte
> da sé: entrambe si chiedono.»

Che cosa la riscrittura tiene dell'originale: **tutto il contenuto**. Che cosa
cambia: nessuna delle due strade è indicata come quella da prendere, i requisiti
ci sono, chi decide è scritto, e l'effetto collaterale della sospensione — il
debito si allunga — è dichiarato invece di essere omesso.

**Il tono di questo passo è diverso dagli altri sei**: frasi più corte, nessuna
immagine metaforica, nessun numero. Chi arriva qui non ha voglia di carrelli
della spesa.

## Elaborazione

Questa pagina calcola **due numeri e due proporzioni**, e nulla più. Tutto in
`src/core/`, puro e deterministico: nessun I/O, nessun `Date.now()`, nessun
`Math.random()`. Aritmetica intera, **un solo arrotondamento per grandezza**.

1. **Lo scarto fra la percentuale sul cartello e quella tutto compreso, in
   euro all'anno.**

   ```
   scartoBp        = taegEsempioBp - tanMedioFissoBp
   scartoAnnuoCent = round(capitaleEsempioCent × scartoBp / 10_000)
   ```

2. **Lo stesso scarto al mese.** `scartoMensileCent = round(scartoAnnuoCent / 12)`.

3. **Lo scarto su 100 €**, che è il paragone mostrato accanto:
   `scartoPerCentoEuroCent = round(10_000 × scartoBp / 10_000)` — cioè, per
   costruzione, **esattamente `scartoBp`**. L'invariante va asserito nel test:
   se i due numeri divergono, uno dei due passi è sbagliato.

4. **L'interesse della prima rata.** Una sola divisione, alla fine:

   ```
   interessiPrimaRataCent = round(capitaleEsempioCent × tanMedioFissoBp / 120_000)
   ```

   `120_000` è `10_000 × 12`: i punti base e i dodici mesi in un'unica
   divisione, così non si arrotonda due volte.

5. **Le due proporzioni della barra**, in punti base, con la seconda ricavata
   per differenza come già nella `08`:

   ```
   quotaInteressiBp = round(interessiPrimaRataCent × 10_000 / rataCent)
   quotaCapitaleBp  = 10_000 - quotaInteressiBp
   ```

   `rataCent` arriva dal core del task `10`. La differenza, invece
   dell'arrotondamento indipendente, è l'unico modo perché la barra chiuda
   esattamente al 100% senza un buco di uno o due punti base visibile a schermo.

**Tutto il resto non si calcola qui**: la rata, il piano completo, il totale
degli interessi per durata e il movimento del tasso variabile sono del task
`10`. Se un numero di quelli non è disponibile, il riquadro che lo conteneva
mostra lo stato vuoto e **la spiegazione resta leggibile**: è il motivo per cui
i numeri stanno in riquadri separati dal testo.

### Verifica a mano, da riportare nel commento del test

Con `capitaleEsempioCent = 12_000_000` (120.000,00 €), `tanMedioFissoBp = 346`
(3,46%), `taegEsempioBp = 360` (3,60%):

```
scarto                 = 360 - 346                       =      14 bp   (0,14%)
scarto annuo           = 12.000.000 × 14 / 10.000
                       = 168.000.000 / 10.000            =  16.800 cent (168,00 €)
scarto mensile         = 16.800 / 12 = 1.400 esatto      =   1.400 cent ( 14,00 €)
scarto su 100 €        = 10.000 × 14 / 10.000            =      14 cent (  0,14 €)
interessi prima rata   = 12.000.000 × 346 / 120.000
                       = 4.152.000.000 / 120.000         =  34.600 cent (346,00 €)
controllo indipendente: 120.000 × 3,46% = 4.152 € l'anno; 4.152 / 12 = 346,00 €  ✓
```

Il controllo indipendente dell'ultima riga è il motivo per cui l'esempio usa
120.000 €: l'interesse del primo mese viene un numero tondo, e chi guarda la
demo può rifarlo a mente.

> **Nota sull'aritmetica.** Come nella `08` e a differenza della `07`, qui **non
> compare nessun numero a virgola mobile**: solo prodotti fra interi e divisioni
> arrotondate una volta. Il prodotto più grande resta intorno a 4·10⁹, molto
> sotto `Number.MAX_SAFE_INTEGER`.

### I motivi di rifiuto, come codici

Nessun campo si digita, quindi non ci sono errori di battitura da gestire. I
codici coprono un **registro delle fonti dichiarato male**, che è l'unico
ingresso che può arrivare rotto:

`fonte-non-dichiarata` · `provenienza-non-verificata` · `tasso-non-valido` ·
`scarto-negativo` · `rata-non-disponibile`

`scarto-negativo` non è un caso di scuola: una percentuale tutto compreso più
bassa di quella sul cartello è impossibile, e se il registro la contenesse la
pagina mostrerebbe un numero negativo spiegandolo come un costo in più. Meglio
un riquadro che dice che il dato non torna.

## Output

Un indice e sette schermate. **Nessuna schermata contiene più di un concetto**,
e nessuna contiene più di un numero grande.

| Elemento | Forma |
| --- | --- |
| **L'indice** | i sette titoli, in ordine, come domande in italiano corrente. Ogni voce è un bersaglio da almeno 44×44 px, con il testo accanto all'icona e non al posto dell'icona |
| **Occhiello** | «Il costo della vita» — l'area di appartenenza, su ogni passo |
| **Titolo** | la domanda reale, non il termine tecnico: «Perché all'inizio il debito scende così piano», non «Ammortamento alla francese» |
| **La spiegazione** | due o tre frasi, immagine concreta **prima** del nome tecnico, larghezza di lettura entro 70 caratteri |
| **Il riquadro del numero** | dove c'è: un numero più grande degli altri, con il suo paragone su 100 € **accanto** e non in fondo |
| **Le due barre** (passo 3) | prima rata e ultima rata, con importi e percentuali **scritti**, mai solo al passaggio del mouse |
| **Da dove viene il numero** | ente, documento e data, a corpo pieno sotto il numero — il componente della `13`, non una nota a piè di pagina |
| **Il ponte al simulatore** | dai passi 1, 3 e 5 un collegamento al simulatore della rata (task `10`), dichiarato come tale: «qui puoi provare con i tuoi numeri» |
| **Navigazione** | «indietro», «indice dei sette passi» e «pagina iniziale» **sempre nello stesso punto** su tutte e sette |

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre tabulari,
unità accanto al valore, numeri allineati a destra dove stanno in colonna. Il
rosa resta riservato ai limiti e alle esclusioni: le barre del passo 3 non lo
usano, il riquadro «fonte non ancora dichiarata» sì.

**Rotte nuove in `src/ui/rotte.ts`** — `#/mutuo` per l'indice e
`#/mutuo/<passo>` per i sette, con l'unione `Rotta` estesa da un caso
`{ tipo: 'approfondimento-mutuo'; passo: IdPassoMutuo | null }`. Via hash come
tutto il resto del sito, perché la build si apre anche da `file://`. **Nessun
numero finisce nell'indirizzo**: qui non ce ne sono da digitare, e la regola
resta scritta dov'è già, in `rotte.ts`.

**Stringhe nuove**: due file affiancati, entrambi incorporati in
`STRINGHE_UTENTE` con lo spread, perché sette passi non stanno in 150 righe e
perché il registro scandito dal guardrail deve restare **un oggetto solo**.

- `src/ui/testiMutuo.ts` — passi 1, 2, 3, 5, 6 e l'indice
- `src/ui/testiMutuoTutele.ts` — passi 4 e 7, cioè **le due riscritture
  protettive tenute insieme**: `guardrail-officer` le rilegge come un blocco,
  non sparse fra le altre

Chiavi, per passo: `mutuoIndiceTitolo`, `mutuoIndiceIntro`, e poi
`mutuoNNOcchiello`, `mutuoNNTitolo`, `mutuoNNSpiegazione`, `mutuoNNEsempio`,
`mutuoNNParagone`, `mutuoNNFonte`, `mutuoNNPonteSimulatore` con `NN` da `01` a
`07`; più `mutuoBarraPrimaRata`, `mutuoBarraUltimaRata`, `mutuoBarraInteressi`,
`mutuoBarraCapitale`, `mutuoFonteNonDichiarata`, `mutuoNumeroNonDisponibile`,
`mutuoDatoDiMercato`, `mutuoLimitiTitolo`, `mutuoLimiteNessunConsulto`,
`mutuoLimiteNessunaOfferta`.

**Tre trappole lessicali da conoscere prima di scrivere queste frasi, non
dopo.** `miglior*` e `convien*` sono radici di blocco e nel testo d'origine
compaiono entrambe: la prima nel passo 4, la seconda nella domanda «mutuo o
affitto, cosa mi conviene» da cui questa pagina non deve nascere. `scegli` è
vietato anche negli identificatori, quindi il passo 1 non può chiamarsi
`sceltaTasso`: si chiama `tassoFermoOMobile`. E `garantit*` è in lessico con
gravità `attenzione`: il passo 4 parla di **ipoteca** e di **garanzia iscritta**
— sostantivi non intercettati — ma «tasso garantito» farebbe suonare l'allarme,
correttamente.

**I quattro stati obbligatori**, non solo quello che funziona:

1. **Vuoto** — il caso vero di oggi: il registro delle fonti non ha ancora
   nessuna riga verificata. I due riquadri dei numeri dicono **quale dato
   manca, da quale ente deve venire e chi lo scrive**, non «nessun risultato» e
   non uno zero. Le sette spiegazioni restano complete: non dipendono da un
   numero.
2. **In caricamento** — tutto è locale e immediato. Il riquadro del numero e le
   due barre **occupano già il loro spazio da vuoti**, così quando i valori
   arrivano il testo sotto non si sposta.
3. **Errore** — registro incompleto o incoerente (percentuale tutto compreso
   più bassa di quella sul cartello, punti base negativi): frase umana — «Di
   questo numero non sappiamo ancora da dove viene» — e il numero non compare.
   Mai una cifra calcolata su un dato che non va.
4. **Dati lunghi o numerosi** — i nomi delle fonti sono lunghi («Banca d'Italia
   / ABI, osservatori di settore»), i titoli dei sette passi vanno a capo su due
   o tre righe a 375 px di larghezza, e i totali degli interessi su trent'anni
   sono importi a sei cifre. L'indice si impila, niente scorrimento
   orizzontale, nessun titolo tagliato.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/scartoTanTaeg.test.ts`, con i valori
  calcolati a mano qui sopra nel commento accanto all'asserzione: 16.800 cent,
  1.400 cent, 34.600 cent, e l'invariante «scarto su 100 € in centesimi =
  scarto in punti base». Copre anche `scartoBp = 0` (i due numeri coincidono:
  nessuno scarto, non un errore) e lo scarto negativo, che deve essere
  **rifiutato** e non mostrato.
- **Test di accettazione** — `tests/accettazione/11-approfondimento-mutuo.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice. Fra i casi, quattro che
  rendono **eseguibili le tre riscritture** invece di lasciarle a una rilettura:
  1. nessuna stringa del registro contiene le formulazioni d'origine —
     `cosa fare se`, `puoi spostare`, `scelgono il fisso`, `tasso migliore`,
     `gratis`;
  2. nessuna stringa dei sette passi contiene una cifra scritta a mano: i
     numeri entrano solo dai segnaposto `{...}`;
  3. i passi 4 e 7 nominano **chi decide** (la nuova banca, la banca) e **il
     limite** (il debito non si riduce, il debito si allunga): due asserzioni
     sulla presenza, non sull'assenza, perché un contenuto protettivo si può
     rompere anche togliendo;
  4. tutti e sette i passi sono raggiungibili dall'indice con un click o un tap,
     senza passaggio del mouse e senza gesti.
- **In demo, dieci secondi**: si apre il passo 2. «Sul cartello c'è 3,46%,
  quello che si paga è 3,60%. Su un mutuo di 120.000 € sono 14 € al mese, cioè
  14 centesimi su ogni 100 € di debito, ogni anno.» Una schermata, un numero, un
  paragone. Poi il passo 4, per far vedere che il diritto è descritto e non
  prescritto.

## Cosa questa funzionalità NON fa

- **Non dice quale tasso, quale durata, quale banca.** Non esiste nessuna
  schermata di questa funzionalità che termini con un'opzione indicata. È il
  confine più facile da sfondare qui, perché chi arriva su una pagina sul mutuo
  ha in testa una sola domanda — «e allora che faccio?» — e la risposta non sta
  in questo prodotto, in nessuna delle sette schermate.
- **Non riporta quante persone scelgono un'opzione come argomento.** Il 90% del
  tasso fermo e il «quasi metà a trent'anni» escono dalle spiegazioni. Se
  rientrano, rientrano in un riquadro separato, come descrizione del mercato,
  con ente e data, e senza nessun movente attaccato. Oggi non rientrano: la
  fonte non c'è.
- **Non calcola la rata e non confronta due offerte.** Il calcolo è del task
  `10`, che riceve i numeri da chi legge; questa pagina mostra un esempio
  dichiarato come esempio. E non affianca mai due preventivi con un esito: due
  cifre e una freccia sono un'indicazione anche se nessuna parola lo dice.
- **Non valuta l'offerta di nessuno.** Non si carica un preventivo, non si
  incolla un TAEG, non si nominano banche, prodotti o intermediari.
- **Non dice quale strada prendere se la rata non si paga più** (passo 7).
  Descrive le due che la legge prevede, con i requisiti, chi può accedervi e chi
  decide. Non compila domande, non contatta nessuno, non stima se una domanda
  verrebbe accolta.
- **Non promette che la surroga venga concessa, e non dice «gratis».** Dice che
  cosa la legge mette a carico di chi, e che la nuova banca deve accettare. La
  differenza fra «è gratis» e «quelle spese non possono essere messe a carico
  tuo» è la differenza fra una promessa e una norma.
- **Non mostra gli importi delle spese iniziali** (passo 6). Variano per zona,
  notaio e importo, e nessuna riga del registro li dichiara. Compare l'elenco di
  che cosa esiste e dove si legge sul proprio foglio.
- **Non prende un solo numero dalla rete**, né a runtime né in fase di build.
  Ogni numero vivo ha la sua riga nel registro delle fonti del task `13`, con
  ente, data e cadenza; finché la riga non è verificata, **la pagina lo dichiara
  invece di mostrare la cifra**.
- **Non è consulenza e non ne fa le veci.** Non guarda la situazione di chi
  legge: non chiede reddito, non chiede quanto debito ha, non chiede l'età. Non
  esiste nessun campo in cui inserire la propria situazione, ed è una scelta di
  costruzione, non una mancanza di tempo.
- **Non chiede e non conserva dati personali.** Non c'è niente da digitare;
  nell'indirizzo non finisce nulla.
- **Non diventa un glossario.** Ogni parola tecnica arriva **dopo** la sua
  immagine concreta e **nella stessa frase**: non esiste una pagina «termini»
  separata da consultare, perché un glossario a parte è esattamente ciò che il
  progetto ha deciso di non fare.
- **Non legge il piano di ammortamento vero.** La guida-documento al piano —
  zone cliccabili su un facsimile — è un'altra famiglia (sezione 3 del documento
  d'origine, insieme a `04`, `05`, `06`) e sarà un'altra specifica. Da qui si
  linkerà, quando esisterà.

---

## Dichiarazioni tecniche (compilate da `/spec`)

<!-- Tutto ciò che sta SOPRA questa riga appartiene a /spec.
     Tutto ciò che sta SOTTO «## Previsto» appartiene a doc-funzionale.
     È il confine che rende sicuro il lavoro in parallelo. -->

| | |
| --- | --- |
| **Contratti necessari** | **Nessuno di nuovo.** Questa funzionalità **legge** `FonteDato` e `RegistroFonti`, i due tipi che la `13` introduce in `types/contracts.ts`; non li definisce e non li estende. I tipi dell'esempio (capitale, durata, composizione della prima rata) nascono **dentro `src/core/`**, di proprietà di `01-core-engine`. Nessun valore nuovo in `Scenario`: qui non c'è nessun `DocumentoUtente`, perché non c'è nessun documento |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root, quindi i contratti si possono ancora estendere. Irrilevante per questa funzionalità, che non scrive in `types/`. E resta vero anche da non congelati: **la modifica di `types/contracts.ts` è dell'architetto**, non dell'agente incaricato — `03-ui-builder` e `01-core-engine` non ci scrivono nemmeno quando l'hook non li fermerebbe |
| **Agente incaricato** | **`03-ui-builder`** — i sette passi, le due riscritture, tutte le parole: qui il lavoro *è* il testo. Con **`01-core-engine`** per le due moltiplicazioni della sezione «Elaborazione» e il loro test, e **`00-architect`** per le righe nuove del registro in `fixtures/` (tassi medi fisso e variabile, percentuale tutto compreso d'esempio, ed eventualmente le due quote di mercato) |
| **Directory toccate** | **4 — servono tre agenti.** `src/ui/` (indice, sette schermate, componente delle due barre, `testiMutuo.ts`, `testiMutuoTutele.ts`, `testi.ts`, rotte in `rotte.ts`, foglio di stile), `src/core/` (`scartoTanTaeg.ts`, `__tests__/scartoTanTaeg.test.ts`, `index.ts`), `tests/` (`accettazione/11-approfondimento-mutuo.test.ts`), `fixtures/` (righe nuove in `fonti-dati.json`, **solo aggiunte**). `src/guardrails/`, `src/assessment/` e `types/` non si toccano |
| **dipende-da** | `03` (pagina di spiegazione, struttura riusabile) — questa funzionalità la riusa, non la reinventa: se la struttura non c'è, la prima schermata la definisce e va poi ricondotta a quella del `03`. `10` (simulatore rata mutuo) — **bloccante per i soli passi 3 e 5**: rata, piano e totale interessi arrivano dal suo core. `13` (registro delle fonti) — **bloccante per i soli numeri**: senza le righe, la pagina esce completa con i due riquadri nello stato vuoto. Nessuna delle tre dipendenze blocca le sette spiegazioni |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/11-mutuo-tan-taeg.png` (passo 2, con i 14 € al mese verificati a mano nel test) e `11-mutuo-ammortamento.png` (passo 3, le due barre che si scambiano proporzione). In più, **le tre riscritture di questa spec sono già evidenza**: `06-evidence-collector` può sollevare le tre coppie ❌/✅ così come sono scritte qui e portarle nella slide sul metodo, senza riscriverle — sono la prova che il cancello ha lavorato su un tema dove il lessico automatico non arriva |

### Pianificazione, da sapere prima di `/implementa`

L'impronta comprende `src/ui/` e `tests/`, cioè le due directory più contese del
progetto: **questo task non può girare in parallelo** con `04`, `08`, `10` o
`12`. La parte in `src/core/` è piccola e senza conflitti: può partire per prima
e in parallelo a qualunque cosa.

`fixtures/` è dell'architetto e la `13` ci scrive: **le righe nuove di questo
task e quelle della `13` non possono entrare insieme nello stesso momento** sullo
stesso file. Ordine sensato: prima la `13` definisce forma e sei righe, poi la
`11` aggiunge le sue.

Ordine complessivo consigliato: `13` → `10` (solo il core) → `11`.

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
