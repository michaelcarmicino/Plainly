# 09 — «Per quanti mesi bastano i soldi che ho da parte»

> Stato: **approvata** · 2026-09-14 · pronta per `/implementa`
> Data: 2026-09-14 · Agente incaricato: «01-core-engine», con «03-ui-builder»
> e «04-guardrail-officer»
>
> Fonte della richiesta:
> `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
> sezione 4, simulatore 3. Task di backlog: `09-simulatore-fondo-di-emergenza`.

## La formulazione d'origine è stata rifiutata, il meccanismo no

Il cancello ha respinto **il nome e l'inquadramento**, non il calcolo. Il testo
del rifiuto, per intero:

```
RIFIUTATA — motivo: criterio 1, consiglia o raccomanda una scelta.

Perché: «fondo di emergenza» non è il nome di una misura, è il nome di un
obiettivo da raggiungere, e nella divulgazione finanziaria arriva quasi sempre
accompagnato da «dovresti avere da parte tre-sei mesi di spese». Quella soglia
è una raccomandazione personalizzata, ed è per di più un numero senza fonte:
nella tabella della sezione 7 del documento d'origine non compare, perché
nessuna fonte autoritativa la pubblica. Una schermata intitolata «il mio fondo
di emergenza» pone da sola la domanda «il mio è abbastanza grande?», e a quella
domanda questo prodotto non può rispondere senza consigliare.

Variante conforme più vicina:
  La persona digita quanto spende in un mese per le spese fisse e quanto ha da
  parte. La schermata calcola per quanti mesi e giorni quella cifra copre quelle
  spese se da un certo momento non entrasse più niente, e mostra la scomposizione
  del conto. Nessuna soglia, nessun obiettivo, nessun semaforo di giudizio,
  nessuna indicazione su che cosa fare di quei soldi: una divisione, e il conto
  in chiaro perché chiunque possa rifarlo su un foglio.

Vuoi che apra la spec su questa variante?
```

La variante è quella scritta qui sotto. È lo schema della regola sulla
diversificazione in `.claude/rules/scrittura-e-accessibilita.md`: **tolto il
«tu devi», resta il «chi ha questa cifra e queste spese, copre questi mesi»**.

Due conseguenze pratiche, entrambe volute:

- **il numero del backlog resta `09`**, lo slug no: il file si chiama
  `09-mesi-coperti-dai-risparmi.md`, perché il vecchio slug è precisamente ciò
  che è stato respinto;
- **l'espressione «fondo di emergenza» non compare da nessuna parte** nel
  codice: non a schermo, non nelle rotte, non negli identificatori.

Il calcolo, invece, resta **identico** a quello del documento d'origine —
`mesi coperti = risparmi ÷ spese fisse mensili` — e conserva la sua proprietà
migliore: è l'unico simulatore del sito che **non dipende da nessun dato
esterno**, quindi non ha una fonte da aggiornare né un blocco aperto come la
`07`.

## Cosa questa funzionalità NON fa

Scritta per prima, perché su questa funzionalità è la sezione che decide se il
prodotto regge. Undici confini, tutti espliciti.

1. **Non dice se quei mesi siano pochi o tanti.** Nessuna soglia, nessun
   obiettivo, nessun «tre-sei mesi». Sarebbero due violazioni in una riga sola:
   una raccomandazione personalizzata **e** un numero senza provenienza.
2. **Non usa il semaforo verde/giallo/rosso**, pur essendo un pattern prescritto
   da `.claude/rules/scrittura-e-accessibilita.md`. È una **deroga dichiarata,
   non una dimenticanza**: il semaforo classifica bene un fatto verificabile
   — una somma che quadra o non quadra — ma qui direbbe «va bene / attenzione /
   preoccupante» sulla situazione personale di chi legge, che è esattamente il
   giudizio che il prodotto non dà.
3. **Non si chiama «fondo di emergenza».** Vedi sopra.
4. **Non propone un traguardo e non calcola quanto manca per arrivarci.**
   «Ti mancano 4.500 € per arrivare a sei mesi» è un consiglio travestito da
   sottrazione.
5. **Non fa digitare un traguardo scelto dalla persona.** Sarebbe conforme — lo
   sceglierebbe lei — ma è un **secondo concetto** nella stessa schermata, e la
   regola è uno per schermata. Se servirà, è un'altra spec e un altro branch.
6. **Non chiede perché** le entrate potrebbero fermarsi. Non profila, non
   distingue fra un licenziamento, una malattia e una scelta: la divisione è la
   stessa. E non drammatizza l'ipotesi: la dichiara e basta.
7. **Non nomina prodotti finanziari** — conti, depositi, fondi, titoli, polizze
   — e non dice dove tenere quei soldi. È lo stesso divieto che la `07` rende
   eseguibile in `tests/lessico-simulazione-risparmio.test.ts`.
8. **Non calcola l'inflazione** su quella cifra. Incrociare `07` e `09`
   raddoppierebbe i concetti in una schermata sola.
9. **Non è una previsione.** Presuppone che le spese restino quelle e che non
   entri più niente: due ipotesi dichiarate **a schermo**, non in nota a piè di
   pagina. Non tiene conto di spese che cambiano, di entrate residue né di
   imprevisti.
10. **Non legge nessun documento** e non tocca `src/ingest/`: i due numeri si
    digitano a mano.
11. **Non conserva e non trasmette niente.** Le due cifre restano nello stato
    della pagina e **non finiscono nell'indirizzo**, per la stessa ragione già
    scritta in `src/ui/rotte.ts` per la `07`: un importo nell'hash resterebbe
    nella cronologia del browser senza che nessuno l'abbia deciso.

## Per chi

Una persona con un lavoro che potrebbe non esserci fra sei mesi — un contratto
a termine in scadenza, una partita IVA con un cliente solo, un'azienda che ha
annunciato tagli. Ha qualcosa da parte e non sa dire quanto le durerebbe:
l'ansia è generica — «non so se basterebbe» — e in quella forma non si può né
misurare né posare.

## Quando serve

Nel momento in cui arriva la notizia che il reddito potrebbe fermarsi, o nel
momento tranquillo in cui guarda il conto e la domanda le passa per la testa da
sola. Serve **prima** che succeda qualcosa, perché dopo nessuno apre un sito per
fare una divisione.

## Cosa deve poter fare dopo

Dire una cifra riferita a sé: «con 1.200 € di spese al mese e 3.100 € da parte,
quei soldi coprono le spese per 2 mesi e 17 giorni». Prima aveva «non so se
basterebbe», dopo ha un numero che può rifare su un foglio.

## Input

| Dato | Forma | Da dove arriva |
| --- | --- | --- |
| `speseMensiliCent` | intero in centesimi | lo digita la persona |
| `risparmiCent` | intero in centesimi | lo digita la persona |

**Nessun terzo dato, e nessuna fonte esterna.** È l'unico simulatore del
documento d'origine che non dipende da un valore che cambia nel tempo: niente
costante da recuperare, niente periodo da dichiarare, nessun blocco aperto.

Limiti dei campi — del campo digitato, non dell'aritmetica:

| Costante | Valore | Perché |
| --- | --- | --- |
| `SPESE_MENSILI_MIN_CENT` | `1_000` (10,00 €) | sotto, è un errore di battitura: sono le spese fisse di un mese |
| `SPESE_MENSILI_MAX_CENT` | `10_000_000` (100.000,00 €) | idem, dall'altro lato |
| `RISPARMI_MAX_CENT` | `1_000_000_000` (10.000.000,00 €) | stessa soglia della `07`, per coerenza fra le due schermate |

> **`risparmiCent = 0` non è un errore, è un risultato.** Zero da parte dà zero
> giorni coperti, e per chi si trova in quella situazione è la risposta vera.
> Rifiutarla come «errore di validazione» sarebbe un giudizio mascherato da
> controllo. (Differenza voluta rispetto alla `07`, dove `somma-a-zero` è un
> rifiuto perché su zero euro non c'è nessuna erosione da mostrare.)
>
> `speseMensiliCent = 0` invece è un rifiuto, e per un motivo aritmetico: è il
> divisore.

## Elaborazione

Tutto in `src/core/`, puro e deterministico. **Aritmetica interamente su
interi**: qui, a differenza della `07`, non compare nessun numero a virgola
mobile, perché non c'è nessuna esponenziale.

Convenzione dichiarata, una sola: `GIORNI_PER_MESE = 30`. Non è un dato di
nessuna fonte, è il modo in cui il resto della divisione viene reso leggibile.
Sta scritta a schermo, non solo nel codice.

1. `giorniCoperti = Math.floor((risparmiCent * 30) / speseMensiliCent)`
2. `mesiInteri = Math.floor(giorniCoperti / 30)`
3. `giorniResidui = giorniCoperti - mesiInteri * 30`
4. `residuoUltimoMeseCent = risparmiCent - mesiInteri * speseMensiliCent`

**Arrotondamento sempre per difetto** (`floor`, mai `round`): la cifra mostrata
non dichiara mai una copertura più lunga di quella che la divisione dà. Non è
prudenza consigliata a chi legge, è igiene del numero.

Tre proprietà, verificabili sull'algebra e non solo sull'esempio:

- `mesiInteri` coincide sempre con `Math.floor(risparmiCent / speseMensiliCent)`,
  perché `floor(floor(x)/n) = floor(x/n)` per `n` intero positivo: il passo 2
  non introduce un secondo arrotondamento;
- `giorniResidui` sta sempre fra `0` e `29`;
- `residuoUltimoMeseCent` sta sempre fra `0` e `speseMensiliCent - 1`, ed è la
  cifra che il passo 3 converte in giorni. I due numeri non possono divergere.

Nessun rischio di superare l'intero sicuro: `1_000_000_000 × 30 = 3 × 10¹⁰`,
contro un `Number.MAX_SAFE_INTEGER` di circa `9 × 10¹⁵`.

### Verifica a mano, da riportare nel commento del test

Caso di riferimento — `speseMensiliCent = 120_000` (1.200,00 € al mese),
`risparmiCent = 310_000` (3.100,00 €):

```
giorniCoperti          = floor(310.000 × 30 / 120.000)
                       = floor(9.300.000 / 120.000) = floor(77,5) = 77
mesiInteri             = floor(77 / 30)                           =  2
giorniResidui          = 77 − 2 × 30                              = 17
residuoUltimoMeseCent  = 310.000 − 2 × 120.000 = 70.000 cent  (700,00 €)

controprova del residuo: 70.000 × 30 / 120.000 = 17,5 -> 17 giorni  ✓
```

Risultato: **2 mesi e 17 giorni**.

Due casi di confine, anch'essi calcolati a mano:

```
meno di un mese   spese 120.000, risparmi 50.000 (500,00 €)
                  floor(1.500.000 / 120.000) = floor(12,5) = 12 giorni
                  mesiInteri 0 · giorniResidui 12 · residuo 50.000 cent

niente da parte   spese 120.000, risparmi 0
                  0 giorni · 0 mesi · residuo 0 cent
```

## Output

Una schermata sola, un concetto solo.

| Elemento | Forma |
| --- | --- |
| **Il numero grande** | «2 mesi e 17 giorni». È il più grande della schermata |
| L'ipotesi, accanto e non in nota | «se da domani non entrasse più niente sul conto» |
| La scomposizione, che è il paragone | «2 mesi pagati per intero — 2.400,00 € — più 700,00 € che restano, cioè 17 giorni del mese dopo» |
| La convenzione | «un mese contato come 30 giorni; i conti si fermano sempre al giorno pieno» |
| Da dove viene il numero | «nessun dato preso da fuori: sono solo i due numeri che hai scritto tu, divisi» |
| Avvertenza | il testo standard della sezione 4 del documento d'origine |

La scomposizione **è** il paragone concreto richiesto dalle regole: non aggiunge
un secondo calcolo che potrebbe non tornare, mostra lo stesso conto in una forma
che si rifà a mano in dieci secondi.

Regole di resa dei casi particolari, perché non vengano decise nel JSX:

- **meno di un mese** → «12 giorni», mai «0 mesi e 12 giorni»;
- **giorni residui a zero** → «3 mesi», mai «3 mesi e 0 giorni»;
- **niente da parte** → «0 giorni», con la frase che spiega il conto e nessun
  commento su quella cifra;
- **un mese solo / un giorno solo** → singolare.

Formattazione **solo** con `src/core/formatoIt.ts`, mai `Intl`. Cifre tabulari,
unità accanto al valore, numeri allineati a destra.

**Stringhe nuove**, in un file dedicato `src/ui/testiMesiCoperti.ts` — lo stesso
motivo meccanico della `07`: dentro `testi.ts` si supererebbero le 150 righe.
Entra in `STRINGHE_UTENTE` con lo spread, quindi **il registro che il guardrail
scandisce resta uno solo**.

Intestazione: `mesiCopertiOcchiello`, `mesiCopertiTitolo`, `mesiCopertiIntro`,
`mesiCopertiPasso`.

Campi: `mesiCopertiEtichettaSpese`, `mesiCopertiAiutoSpese`,
`mesiCopertiEsempioSpese`, `mesiCopertiEtichettaRisparmi`,
`mesiCopertiAiutoRisparmi`, `mesiCopertiEsempioRisparmi`.

Risultato: `mesiCopertiVuoto`, `mesiCopertiInSospeso`,
`mesiCopertiEtichettaValore`, `mesiCopertiRisultato`,
`mesiCopertiRisultatoSoloGiorni`, `mesiCopertiRisultatoZero`,
`mesiCopertiRisultatoMeseSingolo`, `mesiCopertiIpotesi`,
`mesiCopertiScomposizione`, `mesiCopertiConvenzioneGiorni`.

Provenienza e confini: `mesiCopertiNessunaFonte`, `mesiCopertiAvvertenza`,
`mesiCopertiLimitiTitolo`, `mesiCopertiLimiteSoglia`, `mesiCopertiLimiteAzione`,
`mesiCopertiLimiteDati`.

Errori: `mesiCopertiErroreSpese`, `mesiCopertiErroreSpeseNegative`,
`mesiCopertiErroreSpeseZero`, `mesiCopertiErroreSpeseBasse`,
`mesiCopertiErroreSpeseAlte`, `mesiCopertiErroreRisparmi`,
`mesiCopertiErroreRisparmiNegativi`, `mesiCopertiErroreRisparmiAlti`,
`mesiCopertiNotaCentesimi`.

Navigazione: `area3Altra4` in `src/ui/testi.ts` — la domanda nuova nella lista
dell'area «Il futuro», collegata alla rotta come già avviene per `area3Altra3`
in `PaginaMacrocategoria.tsx`. Il badge «altre N domande qui dentro» si ricava
dalla lista e si aggiorna da solo; `tests/home.test.ts` asserisce su `lavoro`,
quindi non viene toccato.

Rotta nuova in `src/ui/rotte.ts`, sul modello di `PERCORSO_VALORE_RISPARMI`:
`PERCORSO_MESI_COPERTI = '#/quanti-mesi-bastano'`. Via hash, perché il sito deve
aprirsi anche da `file://`.

### I quattro stati obbligatori

1. **Vuoto** — nessuna cifra digitata: la schermata dice quali due numeri
   servono e dove scriverli. Nessuno zero e nessun numero inventato al posto del
   risultato, e **nessuna frase che anticipi un giudizio** su quello che
   comparirà.
2. **In caricamento** — il calcolo è immediato e locale: il riquadro del
   risultato occupa già il suo spazio da vuoto, così il layout non salta e non
   compare nessuna rotellina che gira per un istante.
3. **Errore** — in linguaggio umano: «Controlla questo numero, sembra troppo
   alto», mai «errore di validazione». Correggere un campo non deve costare
   quello già scritto nell'altro.
4. **Dati lunghi o numerosi** — è il caso che qui rompe davvero la griglia,
   perché il numero grande è **composto**: `1.999 mesi e 29 giorni` (spese 500 €,
   risparmi 999.999 €) deve restare leggibile, su una riga sola dove ci sta, e
   andare a capo in modo pulito dove non ci sta — mai spezzando «1.999» da
   «mesi». Nessuna barra di scorrimento orizzontale.

## Come si dimostra che ha funzionato

- **Test unitario** — `src/core/__tests__/mesiCoperti.test.ts`, con i valori
  attesi calcolati a mano qui sopra scritti nel commento accanto
  all'asserzione. Copre il caso di riferimento, i due casi di confine
  (`risparmi = 0`, meno di un mese), la coerenza fra `giorniResidui` e
  `residuoUltimoMeseCent`, e ogni codice di rifiuto.
- **Test di conformità** — `tests/lessico-mesi-coperti.test.ts`, sul modello di
  `tests/lessico-simulazione-risparmio.test.ts`: scandisce
  `STRINGHE_MESI_COPERTI` e fa fallire la build se compaiono le formulazioni che
  il lessico generale **non** copre — «fondo di emergenza», «abbastanza»,
  «sufficiente», «obiettivo», «traguardo», «soglia», «dovresti avere», «almeno N
  mesi», «tre mesi»/«sei mesi» usati come traguardo. È la forma eseguibile della
  sezione «Cosa NON fa»: senza di essa quella sezione è una buona intenzione.
- **Test di accettazione** — `tests/accettazione/09-mesi-coperti.test.ts`,
  scritto dal `tester` dalla specifica, non dal codice.
- **In demo, dieci secondi**: si digita 1.200, si digita 3.100, compare
  **2 mesi e 17 giorni** con sotto la riga che scompone il conto — 2.400 € di
  due mesi pieni più 700 € che valgono altri 17 giorni.

---

## Dichiarazioni tecniche (compilate da `/spec`)

| | |
| --- | --- |
| **Contratti necessari** | **Nessuno.** `types/contracts.ts` non serve e non viene toccato: qui non c'è un documento a voci, quindi `DocumentoUtente` e `LetturaCalcolata` non entrano. Si è **deciso di non aggiungere** un valore a `Scenario`, che sarebbe l'unica tentazione di scrittura sotto `types/`: nessun modulo lo userebbe. I tipi di ingresso e uscita nascono **dentro `src/core/`**, di proprietà di core-engine, come già per la `07` |
| **Contratti già congelati?** | **No** — `.contracts-frozen` non esiste nella root del repository. Irrilevante comunque: **questa funzionalità non modifica `types/`**, quindi non richiede l'architetto |
| **Agente incaricato** | **`01-core-engine`** (la divisione e i codici di rifiuto), con **`03-ui-builder`** (schermata, testi, rotta, voce nell'area «Il futuro») e **`04-guardrail-officer`** (il test di conformità scoped, che è la forma eseguibile della sezione «Cosa NON fa») |
| **Directory toccate** | **3 — servono tre agenti.** `src/core/` (`mesiCoperti.ts`, `__tests__/mesiCoperti.test.ts`, riesporto da `index.ts`) · `src/ui/` (`PaginaMesiCoperti.tsx` e i suoi riquadri, `testiMesiCoperti.ts`, `testi.ts`, `contenutiHome.ts`, `rotte.ts`, `PaginaMacrocategoria.tsx`, `styles.css`) · `tests/` (`lessico-mesi-coperti.test.ts`, `accettazione/09-mesi-coperti.test.ts`). **Fuori impronta:** `src/guardrails/` **no** — il controllo resta scoped in `tests/`, come per la `07`, perché «fondo», «conto», «obiettivo» sono vocabolario legittimo altrove nel sito e nel lessico sitewide darebbero falsi positivi sistematici; `src/assessment/` **no**; `types/` **no**; `src/ingest/` **no** |
| **Evidenza prodotta per il deck** | screenshot `../presentation/screenshots/09-mesi-coperti.png` con il caso 1.200 € / 3.100 € → «2 mesi e 17 giorni», cioè lo stesso caso verificato a mano nel test: la slide mostra la cifra che il test dimostra |

### Pianificazione, da sapere prima di `/implementa`

`01-landing-page` e `07-valore-dei-risparmi-nel-tempo` sono **entrambi `fatto`**,
quindi `src/ui/` e `tests/` sono liberi e questa funzionalità non dipende da
nessun'altra. L'impronta però è la stessa della `07`: **questo task non può
girare in parallelo con nessun altro che tocchi `src/core/`, `src/ui/` o
`tests/`** — fra i task aperti, almeno `08-simulatore-netto-in-busta-paga` e
`10-simulatore-rata-mutuo-fisso-variabile` ricadranno lì. Il piano lo calcola
`npm run pm:piano` dalle impronte dichiarate, non a intuito.
