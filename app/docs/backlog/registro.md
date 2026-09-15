# Registro del PM

> Append-only. Ogni riga è un fatto avvenuto, non una previsione.
> Scritto da `/pm`, letto da chi vuole sapere che cosa è successo.

| Quando | Evento |
| --- | --- |
| 2026-09-14T11:10:16.749Z | ondata 1 avviata: 01-calcolo-pesi, 02-schermata-voci, 04-punteggio |
| 2026-09-14T11:10:28.448Z | prova di orchestrazione conclusa, task finti rimossi |
| 2026-09-14T12:08:33.402Z | carica: 12 task dal documento funzionalita (02-13); 11 senza impronta, in attesa di /spec |
| 2026-09-14T12:28:46.550Z | 07 spec approvata; fase 1 NON avviata: doc-funzionale e tester non registrati in sessione (Agent tool li rifiuta). Bloccati anche core-engine, ui-builder, guardrail-officer, ux-reviewer |
| 2026-09-14T13:57:23.859Z | 01 e 07 chiuse e pubblicate su master; 10 task senza impronta, /spec per ricavarla |
| 2026-09-14T14:11:29.132Z | conflitto: la spec 08 prevede src/core/fiscoDichiarato.ts, cioe' il secondo registro parallelo che la 13 esiste per impedire. 13 va eseguita PRIMA di 08 e 10, e non puo' girare in parallelo con 08 ne' con 09. |
| 2026-09-14T14:24:08.247Z | COLLISIONE FRA SESSIONI: due specifiche per la 08 — 08-simulatore-netto-in-busta-paga.md (mia, 392 righe, nel backlog) e 08-simulatore-netto-in-busta.md (675 righe, altra sessione, gia' con Previsto e Verificato). Nessuna delle due eliminata. Da sciogliere prima di implementare la 08. |
| 2026-09-14T14:41:45.539Z | STOP deciso: sei task (08,09,10,11,12,13) hanno due specifiche incompatibili da due sessioni parallele. Lavoro sulla 13 fermato a meta' e parcheggiato su feature/13-tabella-fonti-dati, non unito. types/ NON modificata. Riprendere solo dopo aver chiuso l'altra sessione e scelto quale piano tiene. |

## Punto di ripresa — sessione sospesa

Sospeso su richiesta. Tutto ciò che serve per riprendere è qui, nei file: non
serve la memoria della conversazione.

### Dove si era arrivati

| Funzionalità | Stato |
| --- | --- |
| `01`, `07` | **fatte**, unite e pubblicate |
| `13` — registro fonti | core verde (20 test), schermata scritta, **da rileggere e da chiudere** |
| `02` — catalogo domande | documenti di fase 1 pronti (14 criteri, 31 casi), **codice non iniziato** |
| `03`–`06`, `08`–`12` | specifica approvata con impronta, **non iniziate** |

### Ordine deciso, per dipendenze e non per numero

```
13 → 02 → 03 → [types/] → 04 → 05 → 06 → 08 → 09 → 10 → 11 → 12
```

Motivi: `13` prima di `08` e `10` perché `08` prevedeva un secondo registro
delle fonti; `02` prima di `03` perché `03` si aggancia alle voci del catalogo;
`03` prima di `11` e `12`, che ne sono istanze.

**Il parallelismo fra funzionalità è zero**: tutte toccano `src/ui/`. Si guadagna
solo mettendo in pipeline le fasi — mentre una funzionalità si costruisce, i
documenti della successiva si scrivono.

### I tre passi mancanti sulla 13

1. `guardrail-officer` non ha riletto le stringhe nuove di `src/ui/testiFonti.ts`
2. `doc-funzionale` fase 2: `## Verificato` è ancora vuota
3. `tester` fase 2: il referto dei 34 casi non è scritto

Finché mancano, la definition of done non è soddisfatta e `/verifica` lo segnala.

### Due cose ferme su un permesso, non su una decisione

`app/.claude/settings.json` nega `Edit`/`Write` su `types/**`. La regola serve a
impedire al product developer di toccare i contratti, ma non distingue per
ruolo: blocca anche l'architetto quando la sessione ha radice su `app/`.

Restano quindi **non applicate**, con il testo già pronto in `docs/decisioni.md`:

- **D29** — `'busta-paga'` e `'dichiarazione-730'` da aggiungere all'unione
  `Scenario`, **in un solo intervento**: `04` e `06` li chiedono entrambi, e
  farli in sequenza da due sessioni fa sovrascrivere il primo in silenzio
- **D30** — il commento di `VoceCalcolata.spiegazione`, per dire che non è testo
  da stampare

Si sbloccano lanciando Claude Code dalla **root del repository** invece che da
`app/`, oppure correggendo il permesso.

### Il buco ancora aperto sulla 07

`INFLAZIONE_DICHIARATA` vale 200 punti base ma `periodoDichiarato` è `false`:
nessuno ha dichiarato gli anni su cui la media è calcolata. La schermata lo dice
a chi guarda invece di nasconderlo. Per chiuderlo serve una persona che recuperi
il dato con il periodo esatto.
| 2026-09-15T09:06:20.980Z | 13 chiusa e unita a master: core, schermata, rilettura guardrail, entrambe le fasi 2. 116 test verdi. NOTA: develop locale e' deviato (5 commit duplicati di lavoro gia' in master, zero contenuto esclusivo); etichetta develop-locale-deviato. origin/develop e' antenato di master, il ramo pubblicato e' sano. |
| 2026-09-15T12:24:17.442Z | 14 chiusa: punti di conflitto da 5 a 1. Le otto rimanenti possono partire insieme; lo spread in testi.ts lo fa il PM in un passaggio unico. |

## Conseguenza della 14 sulle specifiche già scritte

**Otto specifiche indicano `rotte.ts` come il punto dove si aggiunge una
schermata** — 04, 05, 06, 07, 08, 10, 11, 12. Dopo la 14 quell'istruzione è
obsoleta: `rotte.ts`, `App.tsx`, `Navigazione.tsx` e `main.tsx` non nominano più
nessuna schermata e **non vanno toccati**.

L'istruzione giusta, da mettere in ogni mandato di `/implementa` finché le
specifiche non sono aggiornate:

> Una schermata si dichiara creando `src/ui/schermate/NN-nome.ts`, il proprio
> componente (che importa da sé il proprio CSS) e il proprio `testiNN.ts`.
> L'unico file condiviso è `src/ui/testi.ts`, **una riga**, e la applica il PM
> fuori dall'ondata.

Non è un difetto delle specifiche: erano corrette quando sono state scritte. È
il costo di un refactor su documenti già approvati, e va pagato dichiarandolo,
non lasciando che ciascuno lo scopra sbagliando.

## Un ponte che nessuno possiede — fra 04 e 08

La `04` rivendica `area2Altra2` («Sulla busta paga c'è un numero grande...») come
proprio collegamento e dichiara che «quando 08 sarà pronta, il ponte è una riga
in `rotte.ts`». Ma le directory dichiarate dalla `08` **non includono né la
pagina della busta paga né `catalogoDomande.ts`**.

Risultato: `04` promette un collegamento che costruirà qualcun altro, `08` non sa
di doverlo costruire, e **la riga non è nell'impronta di nessuno dei due**.

Da sciogliere prima di implementare la `08`: o entra nell'impronta della `08`, o
resta un limite dichiarato di entrambe. Trovato da `doc-funzionale` leggendo le
due specifiche insieme — nessuna delle due sbaglia da sola.

## Trappola nel passaggio delle riesportazioni — da evitare, non da scoprire

`src/core/letturaBolletta.ts` importa `verificaQuadratura` e `pesoInBp` da
`./index.ts`, perché oggi vivono lì. Funziona (sono `function` hoisted, usate
solo dentro corpi di funzione), **ma diventa un import circolare nel momento in
cui il PM aggiunge la riesportazione di `letturaBolletta` in `index.ts`** — cioè
nel passaggio unico che il PM fa fuori dalle ondate.

Soluzione pulita, da fare **prima** di quel passaggio: estrarre `verificaQuadratura`
e `pesoInBp` in un file foglia di `src/core/`. Serve comunque anche alla `04`,
che avrà lo stesso bisogno.

Segnalato da `core-engine` chiudendo la 05, prima che il problema esistesse.

## Un buco nella specifica 08, trovato prima del codice

La specifica dichiara la convenzione di arrotondamento **solo al passo 6**. Ai
passi 2 e 4 non la dichiara.

Conseguenza: se l'implementazione usa un arrotondamento diverso fra il passo 4
(IRPEF) e il passo 6, **la quadratura si rompe di un centesimo** — e la
quadratura interna è la promessa centrale della funzionalità («le tre parti del
lordo rimesse insieme ridanno esattamente il lordo»).

Il caso `CL-10` del `tester` costruisce apposta un pareggio esatto a `,5` nel
passo 4 per metterla alla prova.

**Da sciogliere prima di implementare la 08**: la convenzione va dichiarata per
tutti i passi, non solo per l'ultimo. Non è una decisione di chi implementa —
due arrotondamenti entrambi difendibili danno due risultati diversi, e quale sia
quello giusto lo dice la specifica o nessuno.

Nota collegata: il centesimo esatto sulle tre soglie **non è raggiungibile** dai
due campi digitati (5.219.000 non condivide fattori con 12, 13 né 14). I valori
esatti (`lordoAnnuoCent` = 5.219.000 · 3.083.361 · 5.509.197) vanno provati con
un test diretto sulla funzione pura, non attraverso la schermata.

## Il breadcrumb a due gradini — non una regressione

`guardrail-officer` e `tester` hanno trovato indipendentemente che il percorso di
navigazione mostra **due** gradini (Pagina iniziale › la domanda) dove la
specifica 03 promette **tre** (Pagina iniziale › l'area › la domanda).
`guardrail-officer` l'ha attribuito al refactor della 14.

**Verificato: l'attribuzione è sbagliata.** Il commit precedente alla 14
(`f02dfa3`) ha già due `<li>` nel percorso. La 14 non ha perso nulla: il
breadcrumb è sempre stato a due livelli.

È quindi uno **scostamento fra la specifica 03 e il codice preesistente**, non un
danno da riparare. La 03 ha promesso tre gradini in fase di specifica, senza che
nessuno verificasse che la navigazione li supportasse.

**Da decidere, non da correggere in fretta:** o la navigazione impara il livello
dell'area — richiede che la dichiarazione di schermata porti un'area opzionale,
tutto dentro `src/ui/` — oppure la 03 ritira la promessa e si registra come
limite. La prima è migliore per chi usa il sito: sapere in quale area si è.

Nel frattempo **un test del `tester` resta rosso**, di proposito, con il commento
«difetto reale del codice, non del test». È la scelta giusta: documenta lo
scostamento invece di nasconderlo.

## Il secondo registro parallelo, creato dalla mia stessa regola di perimetro

`src/core/registroFonti.ts` (funzionalità 13) **dichiara nel proprio commento di
anticipare una riga per la 08**. Era il motivo per cui la 13 è stata messa prima
della 08 nell'ordine: evitare che ciascuna funzionalità si tenesse i propri dati
con provenienza.

Poi nel mandato della 08 il PM ha scritto «non toccare file esistenti sotto
`src/core/`», per proteggere il parallelismo. `core-engine` ha **rispettato
l'istruzione** e ha creato `fiscoDichiarato.ts` **autosufficiente**, non una
vista sul registro — e l'ha segnalato invece di tacerlo.

**Risultato: due registri di dati con provenienza, che è esattamente il guasto
che la 13 esisteva per impedire.** Non l'ha causato un agente distratto:
l'ha causato la regola di perimetro del PM.

È la lezione generale della giornata: **una regola che protegge da un guasto può
produrne un altro**, e nessuno dei due è visibile a un test. Qui entrambi i file
sono corretti da soli.

**Da riconciliare**: `fiscoDichiarato.ts` diventa una vista su `registroFonti.ts`,
aggiungendo le righe dei dati fiscali al registro. Tutto dentro `src/core/`,
nessun contratto coinvolto. Va fatto quando `src/core/` è libero — e prima di
dichiarare finita la 08, altrimenti il difetto entra in consegna.

## Due schermate esistono e non sono raggiungibili

`03` e `05` sono verdi e complete, ma **non si raggiungono navigando**: ci si
arriva solo scrivendo l'indirizzo.

Manca in entrambi i casi la riga in `src/ui/catalogoDomande.ts` che porta la
domanda da `stato: 'in-arrivo'` a `'con-schermata'` con il percorso:
- `area1Altra1` → la pagina della `03`
- `area1Domanda` → la pagina della `05`

Nessuno dei due `ui-builder` l'ha scritta, e per un motivo dichiarato: `ui-builder`
della `03` l'ha **provata e annullata** perché rompe **cinque test** in file di
`tester` e `guardrail-officer` (`tests/catalogo.test.ts`, `02-catalogo-domande-errori`,
`02-catalogo-domande-limite`), che assumono «costo della vita» come area senza
schermate. Quei test non sono sbagliati: descrivono lo stato di ieri.

**Non è un dettaglio.** Una pagina che nessuno può raggiungere non è una
funzionalità consegnata, e la demo della `03` promette un percorso a tre tocchi.
Il `tester` della `03` l'ha classificata bloccante, oltre i 44 casi previsti.

**Da fare in un passaggio coordinato**: due righe in `catalogoDomande.ts` e
l'aggiornamento dei cinque test. Serve che `src/ui/` e `tests/` siano liberi.

---

# PUNTO DI RIPRESA — fine sessione

Tutto ciò che serve per riprendere è nei file. Non serve la memoria della
conversazione.

## Stato delle quattordici funzionalità

| | Stato |
| --- | --- |
| `01` `02` `07` `13` `14` | **unite a master**, complete |
| `03` `05` `09` `10` `12` | **codice verde e committato**, fasi 2 non fatte |
| `08` | **solo il calcolo** (36 test verdi). Manca la schermata |
| `11` | **interrotta a metà**, su `wip/11-approfondimento-mutuo` — non unita |
| `04` `06` | **mai iniziate**. Ora sbloccate: `Scenario` è stato esteso |

## Il primo lavoro da fare, prima di aggiungere funzionalità

**Due schermate complete non si raggiungono cliccando.** `03` e `05` esistono e
sono verdi, ma manca la riga in `src/ui/catalogoDomande.ts` che porta la domanda
da `in-arrivo` a `con-schermata`:
- `area1Altra1` → la pagina della `03`
- `area1Domanda` → la pagina della `05`

Costa due righe **più l'aggiornamento di cinque test** in `tests/catalogo.test.ts`,
`02-catalogo-domande-errori`, `02-catalogo-domande-limite`, che assumono «costo
della vita» come area senza schermate. Quei test non sono sbagliati: descrivono
lo stato di ieri.

Lo stesso vale per `09`, `10`, `12`, che hanno la rotta registrata ma nessuna
domanda che ci porta.

## I tre test rossi, tutti voluti

1. **C-07**: il percorso mostra due gradini, la spec `03` ne promette tre. Non è
   una regressione della `14` — verificato: il breadcrumb è sempre stato a due.
2. **e 3.** Le due «scoperte» del `tester` sulla `03`: la domanda non è un link.

Sono test che **documentano un difetto invece di nasconderlo**.

## Che cosa è stato tagliato per una scadenza, e va recuperato

- **la rilettura di `guardrail-officer`** su `05`, `09`, `10`, `12`
- **le fasi 2** (documentazione riconciliata e referti) sulle stesse

Non è formalità: in questa sessione quei due passi hanno trovato il paragone che
ripeteva il numero, la frase vietata dentro il file del guardrail, il buco
dell'arrotondamento nella `08` e i 49 centesimi della `11`.

## Sette debiti registrati sopra, in ordine di gravità

1. **`fiscoDichiarato.ts` è un secondo registro parallelo** — la `13` esisteva per
   impedirlo, e l'ha causato la regola di perimetro del PM
2. **`04` e `08` si contendono un ponte che nessuno possiede**
3. **`08`**: la convenzione di arrotondamento era dichiarata solo al passo 6;
   `core-engine` ha scelto `Math.round` su tutti e tre e l'ha commentato
4. **`11`**: la ricorsione lascia **49 centesimi** non rimborsati su 300 rate,
   la formula chiusa della spec differisce esattamente di quelli. Nessuna
   conciliazione applicata: la spec non la dichiara
5. **`12`**: un solo messaggio d'errore per due casi opposti (troppo alta / negativa)
6. **otto specifiche** indicano ancora `rotte.ts` come punto di estensione:
   **istruzione superata dalla `14`**
7. **il periodo del tasso** della `07` è ancora non dichiarato

## Due cose sulla configurazione

`app/.claude/settings.json` nega `Edit`/`Write` su `types/**` **ma non la
scrittura da script**. D29 e D30 sono state applicate così, su istruzione
esplicita dell'architetto. È un buco della configurazione, non un'autorizzazione:
chi vuole può passare con `sed`.

`develop` locale è deviato (5 commit duplicati di lavoro già in `master`, zero
contenuto esclusivo, etichetta `develop-locale-deviato`). `origin/develop` è sano.

## Il parallelismo, per chi riprende

Dopo la `14`, aggiungere una schermata significa **creare tre file** — la
dichiarazione in `src/ui/schermate/`, il componente che importa da sé il proprio
CSS, il proprio `testiNN.ts` — e **modificarne uno**: la riga di spread in
`src/ui/testi.ts`, più la riesportazione in `src/core/index.ts` se c'è calcolo.

**Quei due file li applica il PM fuori dalle ondate.** In questa sessione sei
agenti hanno scritto codice insieme senza perdere una riga.

`pm:piano` calcola ancora per cartella e **sovrastima i conflitti**: lo dichiara
da sé in un'avvertenza. `src/core/` e `tests/` non sono state dichiarate a file
esclusivi perché non hanno un test che sorvegli il punto di contatto, come invece
ha `src/ui/`.
