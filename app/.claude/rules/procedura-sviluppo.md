# Procedura di sviluppo

## Il ciclo

```
/spec → conferma → branch → /implementa → test+build → /verifica → commit → merge su develop → /evidenza
```

**Nessuna implementazione senza una spec approvata in `docs/features/`.**
Se qualcuno chiede di scrivere codice e il file della spec non esiste, la
risposta corretta è lanciare `/spec`, non iniziare a scrivere.

Motivo: su quattro ore il costo di buttare via codice sbagliato non è
recuperabile. Trenta secondi di spec valgono venti minuti di implementazione
nella direzione giusta.

## I branch

Tre livelli, e nessuna funzionalità si scrive direttamente su `develop`.

| Branch | A cosa serve | Chi ci scrive |
| --- | --- | --- |
| `master` | **la consegna**. Da qui esce la demo | solo l'architetto, al feature freeze |
| `develop` | **l'integrazione**. Sempre verde | nessuno direttamente: ci si arriva solo per merge |
| `feature/NN-nome` | **una funzionalità, una spec** | il product developer |
| `evolution-proof` | l'esperimento di evoluzione, **mai unito** | l'architetto, dopo T+2:45 |

### Aprire la funzionalità

```bash
git switch develop
git pull --ff-only 2>/dev/null || true
git switch -c feature/NN-nome-kebab
```

`NN-nome` è **lo stesso** della spec in `docs/features/NN-nome.md`. Il numero
lega branch, spec e commit: è ciò che permette a `agents:trace` di ricostruire
chi ha fatto cosa senza che nessuno lo annoti a mano.

Una funzionalità = una spec = un branch. Se a metà lavoro serve una seconda
funzionalità, si apre una seconda spec e un secondo branch: non si allarga
quello aperto.

### Prima del merge — nessuna eccezione

Sul branch della funzionalità, **in quest'ordine**:

```bash
npm test          # verde, con il test della funzionalità nuova
npm run build     # passa
npx tsc --noEmit  # nessun errore
```

Poi `/verifica`, che rifà questi controlli più il lessico prescrittivo,
l'assenza di chiamate di rete nel bundle e il confronto dei contratti con il
tag `freeze`.

**Se `/verifica` non passa, non si fa merge.** Non esiste il merge «tanto lo
sistemo dopo»: `develop` deve restare verde, perché è il branch da cui si
genera la demo.

### Il merge

```bash
git switch develop
git merge --no-ff feature/NN-nome -m "feat(agente): NN descrizione"
npm test          # ricontrollo dopo l'integrazione
```

`--no-ff` è obbligatorio: il commit di merge è il punto in cui la traccia
mostra che la funzionalità è **entrata**, e senza di lui la cronologia
appiattisce tutto in una sequenza indistinguibile.

Dopo il merge, il branch della funzionalità si tiene finché la demo non è
fatta: se qualcosa si rompe in integrazione, è la via di ritorno più veloce.

### La promozione su `master`

`develop` è l'integrazione, **`master` è ciò che si consegna**. Il passaggio
fra i due non avviene da solo: è un atto esplicito.

```
/promuovi            controlla e unisce in locale
/promuovi pubblica   unisce e pubblica su origin
```

Rilancia `tsc --noEmit`, `npm test` e `npm run build` **su develop**, e si
ferma se uno solo è rosso. Unisce con `--no-ff`, mai con `reset` o `--force`.

Si promuove quando una o più funzionalità sono pronte per essere consegnate o
mostrate — non a ogni merge. Il motivo di tenere due branch è proprio questo:
su `develop` un difetto è un problema interno, su `master` è qualcosa che
qualcuno vede.

**Se `master` ha commit che `develop` non ha**, `/promuovi` si rifiuta di
procedere. Va prima riportato indietro:

```bash
git switch develop && git merge master
```

È il caso che si crea quando si committa direttamente su `master` — cosa che
capita all'architetto per la configurazione, e che va riallineata subito.

## Due fasi per ogni intervento non banale

1. **Proposta** — che cosa cambierà, in quali file, quali contratti tocca,
   quale test la dimostra. Si ferma e aspetta.
2. **Codice** — solo dopo un sì esplicito.

«Non banale» = più di un file, oppure qualunque cosa che sfiori `types/`,
`fixtures/` o `src/guardrails/`.

Se la proposta richiede di modificare `types/` e `.contracts-frozen` esiste
nella root del repository: **fermarsi e rivolgersi all'architetto.** L'hook
che blocca non va aggirato, va reso leggibile.

## Commit

Formato: **`tipo(agente): descrizione`**

- `tipo` ∈ `feat` · `fix` · `test` · `docs` · `refactor` · `chore`
- `agente` **deve corrispondere a un file realmente presente in `../agents/`**,
  senza il prefisso numerico: `core-engine`, `ui-builder`,
  `guardrail-officer`, `impact-analyst`, `architect`, `evidence-collector`,
  `deck-builder`, `demo-director`.

```
feat(core-engine): quadratura e pesi in punti base
fix(ui-builder): lo scarto di quadratura non veniva mostrato
```

Motivo: `npm run agents:trace` mappa i commit sugli agenti tramite le
directory toccate, e lo scope del commit è il controllo incrociato. Uno scope
inventato rende la traccia — che è l'evidenza primaria del progetto — non
verificabile.

Più commit piccoli sul branch della funzionalità, non uno solo alla fine: la
traccia diventerebbe una riga.

## Definition of done

Un intervento è finito quando **tutti e cinque** sono veri:

1. `npm test` verde, e il nuovo comportamento ha il suo test.
2. `npm run build` passa, `npx tsc --noEmit` senza errori.
3. `/verifica` verde, e il branch è stato **unito a `develop` con `--no-ff`**.
4. I file toccati stanno **tutti dentro la directory dell'agente incaricato**.
   Se ne è servito uno fuori, va segnalato all'architetto, non nascosto nel
   diff.
5. **La documentazione funzionale è in fase 2.** Il file in `docs/features/`
   ha la sezione `## Verificato` scritta al presente, i passi di «come si
   prova» sono stati **eseguiti**, le divergenze fra previsto e realizzato
   sono elencate con il motivo, lo stato è `implementato` e
   `npm run docs:funzionali` è stato rigenerato.
   Uno stato `implementato` senza fase 2 fa fallire `/verifica`: significa che
   qualcuno ha dichiarato fatto qualcosa che nessuno ha controllato.
