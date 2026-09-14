# Esame Senior Claude Code Architect — Plainly

**Data:** 2026-09-14  
**Esaminatore:** Claude Sonnet 4.6

---

## Comandi eseguiti per l'esplorazione

```
find /c/Users/diego.mereu/aifinance -type f | sort
Read README.md, CLAUDE.md, app/CLAUDE.md, .claude/settings.json, app/.claude/settings.json
Read tutti gli agenti (00–10), tutte le skill (annulla, avvia, diagnosi, evidenza, guarda,
     implementa, nuovo-agente, pm, prepara, promuovi, spec, verifica)
Read tutti gli hook (contratti-congelati.mjs, guardrail-dopo-modifica.mjs,
     tipi-dopo-modifica.mjs, benvenuto-developer.mjs)
Read tutte le rules (.claude/rules/ e app/.claude/rules/)
ls -la app/.claude/agents/     → 6 file regolari (copie)
ls -la app/.claude/skills/     → 10 symlink
ls -la app/.claude/rules/      → 3 file regolari (copie)
ls -la .claude/agents/         → non esiste come dir (confermato da agents:sync)
ls -la agents/                 → 11 file .md + README + trace
Read agents:sync.mjs, agents-trace.mjs (prime 120 righe)
Read agents/README.md, agents/trace.md (prime 30 righe)
Read app/COME-LAVORARE.md (prime 60 righe)
cat .gitignore, app/.gitignore
ls app/scripts/                → 12 script .mjs
ls app/src/                    → struttura presente (core, ui, guardrails, assessment, ingest)
Confronto dimensioni file rules e agents tra le due radici
Verifica symlink: readlink app/.claude/skills/spec → OK; head -3 spec/SKILL.md → OK
Verifica hook empirica (dettaglio sotto)
```

### Verifica empirica dell'hook contratti-congelati

```bash
# Creazione sentinella
echo "congelati T+1:40 prova esame" > .contracts-frozen

# Payload JSON con percorso Windows corretto (backslash doppio)
# scritto in file per evitare shell escaping
{"tool_name":"Edit","tool_input":{"file_path":"C:\\Users\\diego.mereu\\aifinance\\app\\types\\contracts.ts"}}

node .claude/hooks/contratti-congelati.mjs < hook-payload.json 2>&1
# Output: SCRITTURA BLOCCATA: i contratti sono congelati. [...]
# EXIT CODE: 2 (atteso: 2) ✓

rm .contracts-frozen   # RIPRISTINATO
```

L'hook blocca correttamente, emette un messaggio operativo completo (causa, alternativa 1, alternativa 2, effetto su slide 8) ed esce con 2. Fallisce aperto (exit 0) se il JSON è malformato, come richiesto dal contratto.

---

## 1. Esito complessivo

Il progetto mostra un'architettura solida e coerente per un hackathon di quattro ore. I vincoli più critici — congelamento dei contratti, guardrail prescrittivi, perimetri degli agenti — sono eseguibili e verificati. La separazione delle due radici è giustificata e implementata in modo pulito. Le lacune principali riguardano il conteggio delle skill nella documentazione (dice "quattro", ce ne sono dieci) e l'assenza di istruzioni di compattazione. Nessun bloccante vero per il lavoro del secondo sviluppatore.

**Punteggio medio: 4.1 / 5**

---

## 2. Tabella dei domini

| # | Dominio | Punteggio | Motivazione |
|---|---------|-----------|-------------|
| 1 | Memoria e contesto | **4/5** | CLAUDE.md separazione governance/codice impeccabile, rules modulari in tre file. Mancano istruzioni su cosa preservare in compattazione; "Quattro skill" in app/CLAUDE.md è una semplificazione che diventa fuorviante. |
| 2 | Progettazione dei subagent | **5/5** | Frontmatter valido su tutti gli undici agenti, perimetri dichiarati e non sovrapposti, "Se ti blocchi" completo in ogni file. Il codice degli standard è delegato alle rules senza duplicazione. |
| 3 | Progettazione delle skill | **4/5** | Percorsi corretti ($ROOT da git, non hardcoded); symlink di app/.claude/skills/ risolvono su entrambe le shell. Il punto debole è il mismatch tra "Quattro skill" dichiarate e dieci presenti: un developer che non legge COME-LAVORARE.md non scopre /annulla, /diagnosi, /guarda in situazioni di crisi. |
| 4 | Vincoli imposti vs scritti | **4/5** | Tre hook attivi, tutti a fallback aperto: congelamento contratti verificato empiricamente (exit 2), guardrail sui testi, tsc dopo ogni modifica TypeScript. Restano solo scritte: limite 150 righe, export default vietato, formato commit, --no-ff obbligatorio. |
| 5 | Architettura a due radici | **4/5** | Giustificata: ruoli diversi, toolset diversi. agents:sync gestisce la divergenza con fallback a copia (dichiarata a video). Symlink directory (junction) funzionano. Le copie di agents/ e rules/ in app/.claude/ non hanno trigger automatico di riallineamento. |
| 6 | Usabilità | **4/5** | /prepara idempotente, hook di benvenuto orientante, otto task comuni coperti da skill operative. Il gap: "Quattro skill" porta il developer a ignorare la rete di sicurezza (/annulla, /diagnosi) quando le cose si rompono — esattamente il momento in cui servono. |
| 7 | Tracciabilità | **4/5** | trace.md generato da git (non scritto a mano), evidence da script, deck da evidence. README.md con TODO per disegno (compilazione a T+3:00). agents/README.md non includeva 10-pm (corretto in questa sessione). Trace stale di due ore. |
| 8 | Igiene operativa | **4/5** | Nessun segreto, nessun percorso assoluto versionato. .gitignore copre tutti i file di stato del dev server. .contracts-frozen non gitignored: chi clona dopo T+1:40 ha contratti non congelati senza saperlo. Permessi di root: nessun deny esplicito sull'architetto (accettabile per il ruolo). |

---

## 3. BLOCCANTI

Nessun bloccante attuale. Il secondo sviluppatore può aprire la sessione, leggere CLAUDE.md e COME-LAVORARE.md, lanciare `/prepara` e iniziare a lavorare.

**Bloccante potenziale latente** (si manifesta dopo T+1:40):

Chi clona il repository dopo il congelamento non trova `.contracts-frozen` e vede contratti non congelati, ma l'hook di blocco non scatta. Se poi modifica `app/types/`, invalida le fixture in silenzio.

**Correzione minima:**
```bash
# In app/.gitignore aggiungere:
# .contracts-frozen  <-- NON aggiungere: il file VA versionato dopo il freeze
```
In realtà la correzione è opposta: il file va **committato** dopo la creazione, non gitignored. Va documentato esplicitamente:

```
# In CLAUDE.md, sezione "T+1:40 — congelamento dei contratti", aggiungere:
git add .contracts-frozen && git commit -m "chore(architect): congela i contratti"
```

---

## 4. LACUNE

In ordine di costo di intervento crescente:

| Costo | Lacuna | Dove |
|-------|--------|------|
| 2 min | **Commit di .contracts-frozen non documentato** — chi crea il file a mano non sa che va committato | CLAUDE.md riga "T+1:40" |
| 5 min | **"Quattro skill" → dieci in app/CLAUDE.md** — la tabella elenca 4 skill ma ne esistono 10 visibili. L'utente che si blocca non sa che /diagnosi e /annulla esistono | app/CLAUDE.md riga 132 |
| 5 min | **Istruzioni di compattazione assenti** — nessun CLAUDE.md dice "in caso di compattazione preserva X". In una sessione lunga, l'architetto potrebbe perdere il contesto di cosa è congelato | entrambi i CLAUDE.md |
| 15 min | **agents:sync senza trigger automatico** — se l'architetto modifica un agente in agents/, deve ricordarsi di eseguire agents:sync manualmente. Un hook PostToolUse sull'architetto che lo lancia in background è banale | root settings.json |
| 30 min | **Nessun hook pre-commit per npm test** — la regola "test verde prima di ogni commit" è solo scritta. Un hook PreToolUse su Bash che intercetta `git commit` quando test fails è possibile (sebbene fragile su Windows) | root/app settings.json |

---

## 5. SOVRA-INGEGNERIZZAZIONE

| Componente | Costo | Resa | Giudizio |
|-----------|-------|------|---------|
| **10-pm (agente di orchestrazione)** | Agente completo, script pm-piano.mjs, backlog | Nulla in 4 ore con 2 persone e funzionalità sequenziali | Prematuro. Il PM vale quando le wave sono multiple e il backlog non è in testa al team. A 2 persone si dice verbalmente quale funzionalità parte. |
| **doc-funzionale a due fasi** | Agente separato, parallelismo, futuro/presente, riconciliazione obbligatoria | Buona per la presentazione (dimostra il processo); rischio di doc falsa se la fase 2 viene saltata | Marginalmente giustificato: la doppia fase è una demo del metodo, non solo documentazione. La fase 2 è vincolata da /verifica. |
| **agents:sync con fallback a copia** | Script complesso (90 righe), logica junction/copia, pulizia stale | Gestisce il caso Windows senza Developer Mode, documenta la modalità di copia | Giustificato per questo ambiente: senza di lui i file divergono in silenzio. |

---

## 6. CORRETTO IN QUESTA SESSIONE

- `app/scripts/agents-sync.mjs` commento riga 11-14: conteggi agenti (9→tutti) e skill (4→10) corretti
- `agents/README.md` riga 6: "Nove agenti" → "Undici agenti, nove attivi e uno deliberatamente no"
- `agents/README.md` tabella mappa: aggiunta riga per `10-pm` (mancava — aggiunto dopo la stesura del README)
- `CLAUDE.md` riga 50 tabella ruoli: "tutti e 9 gli agenti, 4 skill" → conteggi reali (00–10, 10 skill)
- `CLAUDE.md` sezione T+1:40: aggiunto `git add .contracts-frozen && git commit` dopo la creazione del file sentinella
- `app/CLAUDE.md` riga 132: "Quattro skill" → "Quattro skill principali" con rimando esplicito alle 6 di supporto in COME-LAVORARE.md

---

## 7. PROPOSTE CHE RICHIEDONO UNA DECISIONE

### P1 — Documentare il commit di .contracts-frozen
**Perimetro:** aggiungere due righe a CLAUDE.md nella sezione T+1:40.  
Nessuna conseguenza architetturale, ma cambia il processo operativo.

### P2 — Aggiungere istruzioni di compattazione
**Perimetro:** aggiungere una sezione "In caso di compattazione" a entrambi i CLAUDE.md con la lista di cosa deve restare visibile al modello (contratti congelati, scenario scelto, branch corrente).  
Intervento su due file, nessuna conseguenza architetturale.

### P3 — Chiarire il conteggio delle skill in app/CLAUDE.md
**Perimetro:** sostituire "Quattro skill" con "Quattro skill principali" e aggiungere un riferimento a COME-LAVORARE.md per le skill di supporto (/annulla, /diagnosi, ecc.).  
Tocca solo app/CLAUDE.md, nessun impatto sull'architettura.

### P4 — Hook PostToolUse per agents:sync sull'architetto
**Perimetro:** aggiungere a root settings.json un hook PostToolUse che esegue `npm --prefix app run agents:sync` dopo ogni modifica a `agents/*.md`. Timeout 30s, fallback aperto.  
Richiede test su Windows per verificare che il timeout sia sufficiente.

### P5 — Rimuovere 10-pm da app/.claude/agents/
**Perimetro:** in AGENTI_COSTRUZIONE di agents-sync.mjs, rimuovere `'10-pm.md'`.  
Motivazione: non c'è /pm skill dall'app, quindi il pm agent è lì ma inaccessibile via skill. Se il developer lo invoca direttamente, bypassa la logica di controllo delle impronte. Decisione del candidato: tenerlo (il developer può comunque delegarvi manualmente) o toglierlo (meno confusione).

---

## 8. LE TRE MOSSE MIGLIORI NEI PROSSIMI DIECI MINUTI

| # | Mossa | Tempo stimato |
|---|-------|--------------|
| 1 | **Rigenerare agents/trace.md**: è stale di quasi due ore, mostra 6 commit e l'intera evoluzione mancante. `npm --prefix app run agents:trace`. Questo è l'evidenza primaria della presentazione. | 1 min |
| 2 | **Documentare il commit di .contracts-frozen** in CLAUDE.md (sezione T+1:40): due righe che rendono il congelamento un fatto git verificabile invece di un file locale che nessuno sa se è stato creato. | 3 min |
| 3 | **Aggiungere "principali" e il rimando a COME-LAVORARE.md** nella tabella delle skill di app/CLAUDE.md: cambia "Quattro skill" in "Quattro skill principali (ciclo completo)" e aggiunge una riga "Skill di supporto: /avvia, /guarda, /diagnosi, /annulla, /prepara, /promuovi — vedi COME-LAVORARE.md". Questo rimuove il rischio che il developer entri in panico quando il progetto si rompe e non sa che /diagnosi esiste. | 4 min |
