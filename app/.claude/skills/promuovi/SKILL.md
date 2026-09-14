---
name: promuovi
description: Porta su master quello che è stato integrato in develop, dopo aver ricontrollato che sia tutto verde. Usala quando una o più funzionalità sono pronte per essere consegnate o mostrate. Non promuove mai niente di rosso.
disable-model-invocation: true
---

# /promuovi — da `develop` a `master`

I due branch hanno due ruoli diversi:

- **`develop`** è l'**integrazione**: ci arrivano le funzionalità una alla
  volta, e deve restare verde.
- **`master`** è **ciò che si consegna**: è il branch da cui si genera la
  demo, e da cui qualcun altro clona.

La promozione è **un atto esplicito**. Non deve succedere per inerzia, perché
è il momento in cui un difetto smette di essere un problema interno e diventa
qualcosa che si mostra.

## Uso

```
/promuovi              controlla e unisce in locale
/promuovi pubblica     unisce e pubblica su origin
/promuovi prova        dice solo che cosa farebbe, senza toccare niente
```

Working directory: **`app/`**.

```bash
node scripts/promuovi.mjs            # locale
node scripts/promuovi.mjs --push     # locale + push
node scripts/promuovi.mjs --dry-run  # solo il resoconto
```

## Che cosa fa, in ordine

1. **Rifiuta se ci sono modifiche non committate.** Promuovere con il working
   tree sporco significa consegnare qualcosa che nessuno ha visto.
2. **Rifiuta se `master` ha commit che `develop` non ha.** In quel caso va
   prima riportato master dentro develop: promuovere così perderebbe quel
   lavoro o creerebbe un conflitto nel momento peggiore.
3. **Mostra che cosa verrebbe promosso**: l'elenco dei commit e il `--stat`
   del diff. Leggilo prima di andare avanti.
4. **Rilancia i controlli su `develop`**: `tsc --noEmit`, `npm test` (che
   include la scansione del lessico prescrittivo), `npm run build`.
   Se uno solo è rosso, **si ferma**: su `master` non ci arriva niente di
   rosso, mai.
5. **Unisce con `--no-ff`.** Il commit di merge è il punto a cui tornare, e
   senza di lui la cronologia appiattisce tutto. **Nessun `reset`, nessun
   `--force`**: niente viene riscritto.
6. Se ci sono conflitti, **annulla il merge** e dice di risolverli su
   `develop`, non su `master`.
7. Torna sul branch da cui eri partito.

## Prima di lanciarla

Assicurati che il lavoro sia **già su `develop`**, cioè che i branch di
funzionalità siano stati uniti:

```bash
git switch develop && git merge --no-ff feature/NN-nome
```

`/promuovi` non unisce i feature branch: promuove ciò che è già integrato.

## Che cosa riportare

L'elenco dei commit promossi e l'esito dei tre controlli. Se si è fermata,
**il blocco di errore così com'è**: dice già che cosa non va.

Dopo la promozione, se non hai usato `pubblica`, ricorda il comando che lo
script stampa — finché non pushi, `master` è aggiornato solo sulla tua
macchina.
