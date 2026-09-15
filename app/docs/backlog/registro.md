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
