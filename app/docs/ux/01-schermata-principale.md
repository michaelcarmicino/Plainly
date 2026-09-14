# 01 — Schermata principale

> Referto di `12-ux-reviewer`. Generato il 2026-09-14.
> Revisione **1 di 2** (il limite è due cicli per schermata).

## Schermate esaminate

| Larghezza | File | Console |
| --- | --- | --- |
| 390px — mobile stretto | `.screenshots/mobile-_.png` | nessun errore |
| 1920px — proiettore | `.screenshots/proiettore-_.png` | nessun errore |

---

## BLOCCANTE

### B1 · Non c'è niente da fare

La schermata **non contiene un solo elemento interattivo**: nessun campo,
nessun bottone, nessun collegamento. Una persona che arriva qui per la prima
volta non ha modo di capire qual è l'azione principale, perché non ce n'è
nessuna.

**Perché conta:** il prodotto promette di far capire un documento di spesa, ma
non offre alcun modo di portarne uno. La promessa del titolo e ciò che si può
fare non coincidono.

**Correzione:** aggiungere l'unica azione che il prodotto sa già fare —
caricare la fixture di riferimento — come bottone primario sotto il
sottotitolo.

### B2 · Tre dei quattro stati obbligatori non esistono

Esiste solo il **vuoto**. Non sono raggiungibili né **in caricamento**, né
**errore**, né **dati lunghi o numerosi**.

**Perché conta:** `design.md` lo dice esplicitamente — «una schermata che
esiste solo nel caso perfetto non è finita». Il caso con dati lunghi è quello
che romperà il layout, e oggi non è mai stato visto.

**Correzione:** realizzare i tre stati mancanti in `src/ui/`, e renderli
raggiungibili almeno da una fixture di prova.

### B3 · Lo stato vuoto parla al team, non a chi legge

Il testo è: *«Contenuto non ancora disponibile: lo scenario di dominio è in
corso di definizione.»* — ripetuto due volte.

**Perché conta:** «scenario di dominio» è vocabolario interno. La persona a cui
il prodotto si rivolge non conosce quel termine, e la frase non dice **che cosa
manca né come ottenerlo**, che è quello che `design.md` richiede allo stato
vuoto. È anche una nota di lavoro nostra finita sotto gli occhi dell'utente.

**Correzione:** riscrivere la chiave `statoPlaceholder` in `src/ui/testi.ts` in
modo che dica che cosa serve e come si ottiene, senza gergo.

---

## DA SISTEMARE

### S1 · Il corsivo a opacità ridotta sparisce in proiezione

`.placeholder` usa `font-style: italic` con `opacity: 0.85`, su tre righe.

Il **contrasto non è il problema**: bianco all'85% su `#0A0014` dà `#DAD9DC`,
cioè **14.6:1**, ben oltre la soglia. Il problema è che `design.md` vieta il
corsivo a bassa opacità perché a cinque metri il tratto si assottiglia e il
testo smette di leggersi, indipendentemente dal rapporto calcolato.

**Correzione:** togliere `font-style: italic` e `opacity`, e differenziare il
testo secondario con la dimensione.

### S2 · A 390px i titoli lasciano una parola orfana

«Che cosa dice, voce per **voce**» e «Verifica di **comprensione**» vanno a capo
con una sola parola sull'ultima riga.

**Perché conta:** su schermo stretto costa una riga in più per titolo e spezza
il ritmo di lettura proprio dove l'occhio si appoggia.

**Correzione:** `text-wrap: balance` su `h2` in `styles.css`.

### S3 · Manca la nota sull'uso dell'intelligenza artificiale

`app/CLAUDE.md` prescrive nel footer: *«Questo sito è stato generato con
l'aiuto dell'intelligenza artificiale e potrebbe contenere errori.»* Nel footer
c'è solo la nota sull'assenza di connessione.

**Perché conta:** è un requisito dichiarato del prodotto, e oggi non è
implementato.

**Correzione:** aggiungere la chiave in `src/ui/testi.ts` e stamparla nel
`<footer>`.

---

## MINORE

### M1 · Il footer non si distingue dal corpo

Stessa famiglia, stesso peso, `1rem` contro `1.125rem`: separato solo da un
bordo sottile. A colpo d'occhio sembra un quinto paragrafo.

**Correzione:** ridurre a `0.95rem` e aumentare lo spazio sopra.

### M2 · Quattro riquadri identici, nessuna gerarchia

Le quattro sezioni hanno lo stesso trattamento visivo, compreso *«Che cosa
questo strumento non fa»*, che per `design.md` dovrebbe usare il **rosa
`#FF50A0`**, riservato a limiti ed esclusioni.

**Correzione:** bordo sinistro rosa su quella sola sezione.

---

## Contrasti calcolati

Sulle combinazioni **effettivamente usate**, non su quelle dichiarate.

| Testo | Fondo | Rapporto | Soglia 4.5:1 |
| --- | --- | --- | --- |
| `#FFFFFF` corpo | `#050008` | **20.5:1** | passa |
| `#FFFFFF` corpo | `#0A0014` riquadri | **20.5:1** | passa |
| `#BE82FF` titoli `h2` | `#0A0014` | **7.7:1** | passa |
| `#FFFFFF` @ 85% → `#DAD9DC` placeholder | `#0A0014` | **14.6:1** | passa |
| `#FFFFFF` @ 90% → `#E6E6E6` footer | `#050008` | **16.7:1** | passa |

Nessuna violazione di contrasto. Il `#A100FF` compare solo come bordo e riga
di separazione, mai come testo: uso corretto.

---

## Verdetto

**Non proiettabile** — non per ragioni visive, ma perché B1 e B2 significano
che la schermata **non è finita**: non ha un'azione e non ha tre dei quattro
stati.

Proiettata così com'è, si vede un titolo, una promessa e due riquadri che
dicono di non avere contenuto. Tipografia, contrasti e palette invece reggono:
sono il lavoro che non va rifatto.

**Prossimo passo:** B1, B2, B3 a `ui-builder`. S1–S3 nello stesso giro, costano
poco. M1 e M2 solo se avanza tempo.
