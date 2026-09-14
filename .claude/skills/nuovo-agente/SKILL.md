---
name: nuovo-agente
description: Crea un nuovo agente del progetto Plainly — file di definizione in agents/, directory posseduta in esclusiva, symlink in .claude/agents/ e riga nella mappa di agents/README.md. Da invocare solo esplicitamente con /nuovo-agente.
disable-model-invocation: true
---

# /nuovo-agente

Questa skill è l'evolvibilità del progetto **in forma eseguibile**: la tesi
non è «la nostra architettura è estendibile», è «guarda, aggiungere un
agente costa un comando e tocca quattro punti noti».

`disable-model-invocation: true` è deliberato: la creazione di un agente è
una decisione di squadra sul perimetro, non qualcosa che il modello decide
da solo mentre sta facendo altro.

## Ingresso

L'invocazione ha la forma:

```
/nuovo-agente <nome-kebab-case> <perimetro in una frase>
```

Esempio: `/nuovo-agente 09-confronto-tariffe calcola la differenza di costo fra due documenti dello stesso tipo`

Se mancano il nome o il perimetro, chiedili — una sola domanda, secca.

## Procedura

Esegui questi passi **nell'ordine**, senza saltarne nessuno.

### 1. Numero progressivo

Leggi `agents/` e prendi il numero più alto fra i file `NN-*.md`, poi somma 1.
Il nome finale del file è `agents/NN-<nome>.md` (due cifre, zero iniziale).

### 2. Directory posseduta in esclusiva

Scegli **una** directory ancora libera, coerente con il perimetro:

- capability di calcolo → `app/src/<nome>/`
- capability di presentazione → `presentation/<nome>/`

Verifica in `app/scripts/mappa-agenti.mjs` che nessun prefisso esistente la
copra già. **Se è occupata, fermati e dillo**: due agenti sulla stessa
directory sono esattamente il fallimento che questa organizzazione evita.

Crea la directory con un `.gitkeep` che contiene una riga: quale agente la
possiede e a che cosa serve.

### 3. File di definizione

Copia `template-agente.md` (nella cartella di questa skill) in
`agents/NN-<nome>.md` e compila **tutti** i segnaposto `«…»`. Nessun
segnaposto deve sopravvivere.

Vincoli sul contenuto, non negoziabili:

- il frontmatter YAML deve avere `name`, `description`, `tools`;
- `tools` è il minimo indispensabile, mai `*`;
- la sezione «Directory che NON deve toccare» elenca **almeno**
  `app/types/` (congelata), la directory di ogni altro agente, e `agents/`;
- la definition of done contiene almeno un test eseguibile;
- nessun identificatore o testo prescrittivo: niente `suggerisci`,
  `consiglia`, `migliore`, `raccomanda`.

### 4. Registrazione nella mappa

Aggiungi in `app/scripts/mappa-agenti.mjs`:

- una voce `{ prefisso: '<directory>/', agente: 'NN-<nome>' }` in
  `MAPPA_AGENTI`, **prima** delle voci più generiche;
- `'NN-<nome>'` in fondo a `AGENTI`.

Senza questo passo l'agente non comparirà in `agents/trace.md` né nelle
slide 3 e 7: sarebbe lavoro invisibile alla giuria.

### 5. Symlink

Esegui `npm --prefix app run agents:sync`. Non creare il symlink a mano:
lo script gestisce anche il fallback a copia su Windows.

### 6. Riga nella mappa della squadra

In `agents/README.md`, nella tabella «Mappa della squadra», aggiungi una
riga: agente · directory posseduta · responsabilità in mezza frase · fascia
oraria. Aggiungi anche il nodo al grafo di concorrenza della fascia giusta.

## Definition of done della skill

- [ ] `agents/NN-<nome>.md` esiste, frontmatter valido, zero segnaposto
- [ ] la directory posseduta esiste con `.gitkeep`
- [ ] `mappa-agenti.mjs` aggiornato (MAPPA_AGENTI + AGENTI)
- [ ] `.claude/agents/NN-<nome>.md` presente dopo `agents:sync`
- [ ] `agents/README.md` aggiorna tabella e grafo
- [ ] `npm --prefix app run agents:trace` gira e mostra il nuovo agente

Alla fine stampa le sei righe della checklist con l'esito, e **il numero di
file toccati**: è la misura di costo che va in slide 8.
