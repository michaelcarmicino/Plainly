---
name: annulla
description: Riporta il progetto all'ultimo stato in cui i test passavano, mostrando prima che cosa andrebbe perso. Usala quando una modifica ha rotto qualcosa e i tentativi di aggiustarla stanno peggiorando la situazione. Non riscrive mai la storia già committata.
---

# /annulla — tornare all'ultimo stato verde

Cinque minuti di lavoro che possono salvare una presentazione.

Il momento in cui serve si riconosce così: hai provato due o tre correzioni,
ognuna ha spostato il problema invece di risolverlo, e non sei più sicuro di
quale fosse lo stato funzionante. Da lì in avanti ogni minuto speso a
insistere costa più di quanto costi tornare indietro.

> **Non riscrive mai la storia già committata.** Niente `reset --hard`, niente
> `push --force`. Si torna indietro **aggiungendo** un commit che disfa, non
> cancellando quelli che ci sono: se ci si è sbagliati anche in questo, si può
> disfare pure questo.

## Uso

```
/annulla                  all'ultimo commit con i test verdi
/annulla ultimo           disfa solo l'ultimo commit
```

Working directory: **`app/`**.

## I quattro passi

### 1. Trova l'ultimo stato verde

Prima di tutto, guarda se il problema è nel lavoro **non ancora committato**:

```bash
git status -sb
git stash list
```

Se le modifiche sono solo nel working tree, non serve toccare la storia:
`git stash` le mette da parte e le puoi riprendere. **Proponi questa strada
per prima**: è reversibile al cento per cento.

Se invece il difetto è già committato, cerca l'ultimo commit verde:

```bash
git log --oneline -15
```

Poi verificalo davvero, non fidarti del messaggio:

```bash
git stash
git checkout <commit> -- src/ tests/ && npm test
git checkout HEAD -- src/ tests/ && git stash pop
```

Il commit verde è quello in cui `npm test` passa. Se nessuno dei recenti passa,
dillo: il problema è più vecchio di quanto sembra e `/diagnosi` è lo strumento
giusto, non questo.

### 2. Mostra che cosa andrebbe perso

**Sempre, prima di qualunque cosa.** Deve essere leggibile senza aprire git:

```bash
git diff <commit-verde>..HEAD --stat
git diff <commit-verde>..HEAD
```

Presenta così:

```
Tornando a <hash> «<messaggio>» (<quando>) si perde:

  src/core/calcolo.ts        +48  -3
  src/ui/testi.ts            +6   -0
  tests/core.test.ts         +22  -0

In sostanza: <una frase su che cosa era quel lavoro>

Non si perde: <che cosa resta, se c'è>
```

### 3. Chiedi conferma esplicita

Non basta un «ok» implicito nel flusso del discorso. Chiedi:

> Confermi che vuoi tornare a `<hash>` perdendo quelle modifiche?

E aspetta. Se la risposta è incerta, **non procedere**: proponi invece
`git branch salvataggio-<data>` per mettere il lavoro al sicuro su un ramo
prima di tornare indietro. Costa un comando e toglie ogni rimpianto.

### 4. Ripristina, senza distruggere

Un commit solo da disfare:

```bash
git revert --no-edit <commit>
```

Più commit, dal più recente al più vecchio:

```bash
git revert --no-edit <commit-verde>..HEAD
```

Poi **verifica sempre**:

```bash
npm test
```

Se i test ora passano, dillo con il numero. Se non passano nemmeno adesso, il
difetto non veniva da lì: fermati, non revertire altro a caso, e passa a
`/diagnosi`.

## Perché funziona solo se si committa spesso

`/annulla` può riportarti soltanto a un punto che **esiste**. Se l'ultimo
commit è di due ore fa, l'ultimo stato verde è di due ore fa, e questa skill
non ti salva: ti offre solo di buttare via due ore.

Per questo la regola in `.claude/rules/procedura-sviluppo.md` dice di
committare **a ogni funzionalità completata e verde**. Non è pignoleria: è ciò
che rende possibile tornare indietro.

I checkpoint interni di Claude Code (`Esc Esc`, `/rewind`) **non bastano**:
tracciano solo le modifiche fatte dai suoi strumenti, non quelle dei comandi
eseguiti nel terminale. Git è l'unica rete di sicurezza completa.
