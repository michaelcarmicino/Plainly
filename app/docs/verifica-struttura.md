# Verifica della struttura — T+0:15 circa

> Verifica eseguita sui file su disco, con i comandi riportati. Nessuna
> affermazione ricostruita a memoria.

**Esito in una riga:** la struttura a due radici **non esiste**. Esiste una
radice sola. Tutto ciò che il product developer dovrebbe usare — `app/.claude/`,
le quattro skill, le rules, `app/CLAUDE.md` — non è sul disco.

---

## 1. CORRETTO

| Cosa | Prima | Dopo |
| --- | --- | --- |
| `.claude/agents/` era **vuota**: nessun subagent era caricato da Claude Code, nessuna delega era mai avvenuta davvero | `ls -la .claude/agents/` → `total 0` | 9 definizioni presenti, generate da `npm --prefix app run agents:sync` |
| `npm test` era **rosso su albero pulito**: il commento in `app/src/ui/stringheUtente.ts` che documentava come rompere la build conteneva l'esempio prescrittivo, e il guardrail scandisce anche i commenti dei sorgenti — quindi si bloccava da solo | `Tests 2 failed \| 23 passed` | `Tests 25 passed \| 9 todo` — l'esempio ora vive solo in `app/tests/lessico-ui.test.ts`, che è escluso dalla scansione |
| `.contracts-frozen` creato per la prova del hook | creato temporaneamente | **rimosso e verificato assente** |

### Nota sui symlink — non è un difetto mio, è il sistema operativo

`ln -s` fallisce su questa macchina:

```
ln: failed to create symbolic link '.claude/agents/00-architect.md': Operation not permitted
```

Windows senza Developer Mode. `agents:sync` è ripiegato sulla **copia**, e lo
dichiara a video (`0 symlink, 9 copie di fallback`).

Questo è esattamente il caso **(b)** che temevi: due copie che possono
divergere. Modifichi `agents/00-architect.md` e Claude Code continua a leggere
`.claude/agents/00-architect.md` finché non rilanci `agents:sync`. Oggi non
c'è modo di ottenere symlink qui; la mitigazione è renderlo impossibile da
dimenticare — vedi «Da decidere», punto 2.

---

## 2. DA DECIDERE

### 2.1 — La riorganizzazione a due radici non è mai stata eseguita

Non è un difetto da diagnosticare: è lavoro che mi hai specificato (blocchi
1–8) e che non ho fatto, perché il ruolo è cambiato due volte prima che
arrivassi a eseguirlo. Lo dico chiaramente invece di presentarlo come una
scoperta.

Stato reale, verificato:

```
$ ls -la app/.claude/
ls: cannot access 'app/.claude/': No such file or directory

$ ls .claude/skills/
nuovo-agente

$ ls app/CLAUDE.md
ls: cannot access 'app/CLAUDE.md': No such file or directory

$ ls app/docs/features
ls: cannot access 'app/docs/features': No such file or directory
```

Manca, in ordine di dipendenza:

1. **Le quattro skill del product developer** — `spec`, `implementa`,
   `verifica`, `evidenza`. Non esistono in nessuna delle due radici. Questo è
   il difetto dominante: **il tuo compagno non ha oggi nessun modo di
   interagire con il progetto.** Il modello «una skill è il verbo che l'umano
   digita» è scritto in `CLAUDE.md` e in `README.md`, ma i verbi non esistono.
   Se apre Claude Code adesso e digita `/spec`, non succede niente.
2. `app/.claude/` — rules, skills, agents, settings.json
3. `app/CLAUDE.md`
4. `.claude/rules/` alla radice
5. `app/docs/features/` con `TEMPLATE.md`, e il tipo `SpecFunzionalita` in
   `app/types/contracts.ts` (`grep -c SpecFunzionalita` → `0`)
6. `npm run verify:roots`

**Decisione che serve da te:** dico «vai» e lo costruisco tutto nell'ordine dei
blocchi 1–8, oppure vuoi prima il rapporto di revisione critica che avevi
chiesto e che si è fermato a metà? Non posso fare entrambe le cose bene nello
stesso giro, e costruire le skill è la cosa che sblocca una persona che in
questo momento è ferma.

### 2.2 — Come impedire la divergenza fra `agents/` e `.claude/agents/`

Il fallback a copia è obbligato. Tre opzioni, scegli tu:

- **(a)** Un hook `PostToolUse` sulla radice che rilancia `agents:sync` quando
  il file modificato sta sotto `agents/`. Costo: 10 minuti. Rende la
  divergenza impossibile.
- **(b)** Un controllo dentro `verify:roots` che confronta i contenuti e
  segnala la divergenza. Costo: 5 minuti. La rende visibile, non impossibile.
- **(c)** Niente, e ci si ricorda di lanciare `agents:sync`. Costo: 0, rischio
  reale — è il caso che fallisce in silenzio.

Non l'ho scelta io perché aggiunge un terzo hook, e il numero di hook è una
decisione tua.

### 2.3 — `presentation/` non ha un proprietario univoco nella mappa

In `app/scripts/mappa-agenti.mjs` il prefisso `presentation/` è assegnato a
`07-deck-builder`, ma `presentation/evidence/` e `presentation/screenshots/`
vanno a `06-evidence-collector` e `presentation/demo-script.md` a
`08-demo-director`. L'ordine dei prefissi fa sì che funzioni, ma significa che
**`07-deck-builder` possiede per difetto qualunque file nuovo** messo in
`presentation/`. Non è rotto; è una zona grigia in una struttura che dichiara
di non averne. Restringo il prefisso a `presentation/build-deck.ts` e
`presentation/deck.html` (come dice la sua definizione), oppure lo lascio?

---

## 3. RESTA COSÌ

- `CLAUDE.md` e `.claude/` alla radice, accanto ai quattro elementi valutati:
  `ls -a` mostra `app agents presentation README.md` più `.claude .git`.
  Nessuna cartella di rumore. Motivo in `app/docs/decisioni.md` D01.
- `.claude/agents/` come copie invece che symlink: imposto dal sistema
  operativo, vedi sopra.
- `agents/trace.md` con tutti zero e `process.json` vuoto: il repository ha
  **0 commit** (`git rev-list --all --count` → `0`). Gli script non falliscono
  e lo dichiarano (`Nessun commit in cronologia: traccia generata vuota, di
  proposito`). Resta così finché non si committa — ma finché non si committa,
  l'evidenza primaria del progetto è vuota.
- 9 `it.todo` nei test: scheletri voluti per core e assessment.
- `evolution:proof` stampa `fatal: ambiguous argument 'HEAD'` su stderr prima
  di scrivere il JSON corretto ed uscire con 0. Rumoroso ma innocuo: il tag
  `freeze` non esiste ancora.

---

## Comandi eseguiti

```
ls -a
ls -la .claude/ .claude/agents/ .claude/skills/ .claude/rules/
ls -la app/.claude/ app/.claude/agents/ app/.claude/skills/ app/.claude/rules/
find . -path ./app/node_modules -prune -o -type l -print     # nessun symlink
npm --prefix app run agents:sync
npm --prefix app run agents:trace                            # exit 0, 0 commit
npm --prefix app run evolution:proof                         # exit 0, senza tag
npm --prefix app run deck                                    # 9 slide
npm --prefix app run deck:short                              # 8 slide
npm --prefix app test                                        # 25 passed, 9 todo
printf '{...}' | node .claude/hooks/contratti-congelati.mjs  # exit 2, blocca
grep -c SpecFunzionalita app/types/contracts.ts              # 0
```

**Prova del hook di congelamento** (payload JSON valido, con
`.contracts-frozen` presente):

```
SCRITTURA BLOCCATA: i contratti sono congelati.
File: app/types/contracts.ts
...
exit:2
```

Fuori da `app/types/`: `exit:0`. Senza sentinella: `exit:0`.
**`.contracts-frozen` è stato rimosso e la rimozione è verificata.**

**Prova del guardrail**: inserita `demoRotta: 'Ti consigliamo di scegliere il
conto migliore.'` → 3 test rossi con termine, motivo e riformulazione.
Rimossa, 25 verdi.
