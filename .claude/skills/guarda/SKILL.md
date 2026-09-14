---
name: guarda
description: Apre l'applicazione in un browser vero, cattura uno screenshot da esaminare e riporta gli errori di console. Usala ogni volta che una modifica riguarda ciò che si vede, e per controllare che una schermata regga su mobile stretto e su proiettore.
disable-model-invocation: true
---

# /guarda — vedere l'interfaccia, non immaginarla

Chi scrive il codice qui è un modello, e **un modello non vede l'interfaccia
che sta costruendo**. Senza questo passo «funziona» significa soltanto «i test
passano», che su una schermata è quasi niente: il testo può essere illeggibile,
un elemento fuori dallo schermo, un numero troncato, e ogni test resterebbe
verde.

## Uso

```
/guarda                              la home, a 1440px
/guarda --viewport mobile            390px — lo schermo stretto
/guarda --viewport proiettore        1920px — la sala
/guarda /qualche-percorso            una pagina specifica
```

## Che cosa eseguire

Working directory: **`app/`**.

```bash
node scripts/guarda.mjs                              # home, 1440px
node scripts/guarda.mjs --viewport mobile
node scripts/guarda.mjs --viewport proiettore
node scripts/guarda.mjs /percorso --viewport mobile
```

Lo script:

1. **si assicura che il server sia attivo**, richiamando la stessa logica di
   `/avvia` — non serve lanciarlo prima;
2. apre la pagina con il browser di `@playwright/test`, già presente: nessuna
   dipendenza nuova;
3. salva lo screenshot in `app/.screenshots/` e **stampa il percorso assoluto**;
4. riporta gli errori di console e le eccezioni della pagina;
5. segnala come errore ogni **richiesta verso l'esterno**: il prodotto deve
   funzionare offline, e una chiamata di rete a runtime è una violazione, non
   un dettaglio.

## Passo obbligatorio dopo lo script

**Leggi davvero lo screenshot** con lo strumento di lettura file, sul percorso
assoluto che lo script ha stampato. Lo scopo della skill è guardare: eseguire
il comando e fermarsi al «catturato con successo» non serve a niente.

Poi riporta che cosa hai visto, in concreto:

- il testo è leggibile a quella larghezza, o si spezza;
- qualcosa esce dallo schermo o si sovrappone;
- i numeri hanno accanto il paragone concreto che le regole richiedono;
- ci sono termini tecnici isolati, senza esempio quotidiano nella stessa frase.

## Le due larghezze che contano

| Preset | Larghezza | Perché |
| --- | --- | --- |
| `mobile` | 390px | Molte persone arrivano da lì, e su schermo stretto una tabella a più colonne diventa illeggibile |
| `proiettore` | 1920px | È così che si controlla che una schermata regga in sala **prima** di scoprirlo davanti a un pubblico |

Se una modifica tocca il layout, **guardala a entrambe**. Sono due comandi e
trenta secondi.

## Se il browser non è installato

Lo script lo dice e propone `npx playwright install chromium`, che serve una
volta sola sulla macchina. Non è una dipendenza nuova del progetto: è il
browser di una dipendenza che c'è già.
