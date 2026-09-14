# Funzionalità di Plainly

> **File generato.** Non modificarlo a mano: si rigenera con
> `npm run docs:funzionali` e ogni modifica manuale andrebbe persa.
> Le fonti sono i file in `docs/features/`, scritti dall'agente
> `doc-funzionale`.
>
> Ultima generazione: 2026-09-14T14:32:17.796Z

**Come si legge il tempo verbale.** Ciò che è scritto al **futuro** è previsto
e non ancora verificato; ciò che è al **presente** è stato confermato leggendo
il codice e i test. Non è stile: è il modo per sapere in un secondo che cosa è
reale.

## Indice

| | Stato | Funzionalità |
| --- | --- | --- |
| ◌ | in sviluppo | [01 — «La landing page: tre porte e una navigazione che non cambia mai»](#01-la-landing-page-tre-porte-e-una-navigazione-che-non-cambia-mai) |
| ◌ | in sviluppo | [02 — «Il catalogo delle domande vere, e che cosa il sito sa rispondere»](#02-il-catalogo-delle-domande-vere-e-che-cosa-il-sito-sa-rispondere) |
| ◌ | in sviluppo | [03 — «La pagina che risponde a una domanda: il contenitore, non il contenuto»](#03-la-pagina-che-risponde-a-una-domanda-il-contenitore-non-il-contenuto) |
| ◌ | in sviluppo | [04 — «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»](#04-sulla-busta-paga-c-un-numero-grande-sul-conto-ne-arriva-uno-pi-piccolo-dove-va-la-differenza) |
| ◌ | in sviluppo | [05 — «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»](#05-ho-consumato-poco-e-la-bolletta-alta-che-cosa-sto-pagando) |
| ◌ | in sviluppo | [06 — «Sul 730 c'è scritto che mi tornano 665 €: da dove esce quel numero?»](#06-sul-730-c-scritto-che-mi-tornano-665-da-dove-esce-quel-numero) |
| ◌ | in sviluppo | [07 — «Quanto valgono davvero i miei soldi fra qualche anno»](#07-quanto-valgono-davvero-i-miei-soldi-fra-qualche-anno) |
| ◌ | in sviluppo | [08 — «Quanto mi resta davvero in busta»](#08-quanto-mi-resta-davvero-in-busta) |
| ◌ | in sviluppo | [08 — «Quanto mi resta davvero in busta, e dove va il resto»](#08-quanto-mi-resta-davvero-in-busta-e-dove-va-il-resto) |
| ◌ | in sviluppo | [09 — «Per quanti mesi bastano i soldi che ho da parte»](#09-per-quanti-mesi-bastano-i-soldi-che-ho-da-parte) |
| ◌ | in sviluppo | [09 — «Per quanti mesi bastano i soldi che ho da parte»](#09-per-quanti-mesi-bastano-i-soldi-che-ho-da-parte) |
| ◌ | in sviluppo | [10 — «Quanto pago di rata ogni mese, con un tasso fermo e con uno che si muove»](#10-quanto-pago-di-rata-ogni-mese-con-un-tasso-fermo-e-con-uno-che-si-muove) |
| ◌ | in sviluppo | [10 — «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»](#10-quanto-pago-al-mese-la-rata-con-un-tasso-fermo-e-con-un-tasso-che-si-muove) |
| ◌ | in sviluppo | [11 — «Il mutuo: che cosa vuol dire, parola per parola»](#11-il-mutuo-che-cosa-vuol-dire-parola-per-parola) |
| ◌ | in sviluppo | [11 — «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»](#11-quanto-costa-in-tutto-un-mutuo-oltre-ai-soldi-che-la-banca-presta) |
| ◌ | in sviluppo | [12 — «Questi nomi che sento dire: che cosa sono, in concreto»](#12-questi-nomi-che-sento-dire-che-cosa-sono-in-concreto) |
| ◌ | in sviluppo | [13 — «Da dove vengono i numeri di questo sito»](#13-da-dove-vengono-i-numeri-di-questo-sito) |
| ◌ | in sviluppo | [13 — «Da dove viene questo numero, e quando è stato scritto»](#13-da-dove-viene-questo-numero-e-quando-stato-scritto) |

**Totali** — in sviluppo: 18 · implementate: 0 · verificate: 0

---

## 01 — «La landing page: tre porte e una navigazione che non cambia mai»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/01-landing-page.md`](features/01-landing-page.md)
### Cosa fa

La prima schermata mostra tre porte, una per ciascuna delle tre aree in cui il
sito è diviso — il costo della vita, il lavoro, il futuro — e su ognuna è
stampata per esteso la domanda che quell'area affronta, scritta come la direbbe
una persona: «Perché la bolletta è così alta questo mese?».

Un tocco in un punto qualunque della porta apre l'elenco delle quattro domande
di quell'area. Da ogni schermata i due bottoni per tornare indietro restano
sempre nello stesso punto: misurati sul browser, «Pagina ini

### Per chi

Una persona che apre il sito con un'ansia già precisa — «la bolletta di questo
mese è più alta e non capisco perché» — ma sen

### Come si prova

Sono gli stessi otto passi della fase 1, eseguiti il 2026-09-14 da `app/`.
Accanto a ciascuno c'è ciò che è successo davvero, non ciò che ci si aspettava.

1. **Preparare l'ambiente.** `npm run prepara` risponde «Ambiente pronto» e
   riporta ogni riga come «già a posto»: tipi, dipenden

### Limiti

- **Non c'è la ricerca interna.** Nessun campo in cui scrivere la propria
  domanda: per arrivare a un'area si passa dalle tre card. La ricerca vive in
  una specifica sua, `02-ricerca-domande`.
- **Non ci sono Simulatori né Guide-documento.** L'accesso rapido sotto le card
  apre la schermata di lettura del documento, che ha quattro se

### Divergenze fra previsto e realizzato

Fra ciò che la fase 1 aveva previsto e ciò che è stato costruito. La se

---

## 02 — «Il catalogo delle domande vere, e che cosa il sito sa rispondere»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/02-catalogo-domande-reali-per-macrocategoria.md`](features/02-catalogo-domande-reali-per-macrocategoria.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 03 — «La pagina che risponde a una domanda: il contenitore, non il contenuto»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/03-pagina-di-spiegazione-struttura-riusabile.md`](features/03-pagina-di-spiegazione-struttura-riusabile.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 04 — «Sulla busta paga c'è un numero grande, sul conto ne arriva uno più piccolo: dove va la differenza?»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/04-guida-interattiva-busta-paga.md`](features/04-guida-interattiva-busta-paga.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 05 — «Ho consumato poco e la bolletta è alta: che cosa sto pagando?»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/05-guida-interattiva-bolletta-luce-gas.md`](features/05-guida-interattiva-bolletta-luce-gas.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 06 — «Sul 730 c'è scritto che mi tornano 665 €: da dove esce quel numero?»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/06-guida-interattiva-dichiarazione-730.md`](features/06-guida-interattiva-dichiarazione-730.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 07 — «Quanto valgono davvero i miei soldi fra qualche anno»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/07-valore-dei-risparmi-nel-tempo.md`](features/07-valore-dei-risparmi-nel-tempo.md)
### Cosa fa

Chi scriverà due cose — quanti soldi ha fermi sul conto e per quanti anni li
lascia lì — vedrà comparire una cifra sola, grande: quanto varranno davvero
quei soldi alla fine, cioè quanta roba ci si porterà a casa. Con 10.000 € e
5 anni comparirà **9.057,31 €**, e accanto la riga che lo rende afferrabile:
su ogni 100 € lasciati fermi ne resterà il valore di 90,57 €.

La schermata dirà che cosa succede a quei soldi e si fermerà lì: non dirà a
nessuno che cosa farne.

### Per chi

Una persona che ha una somma ferma sul conto — quel che resta di una
liquida

### Come si prova

Sono i **criteri di accetta

### Limiti

- **Non dirà che cosa farne.** Nessun accenno a spostare quei soldi, a
  impiegarli o a confrontarli con qualcos'altro. La schermata descriverà
  un'erosione e si fermerà lì. È il confine più facile da sfondare proprio qui,
  perché la domanda successiva — «e allora?» — viene da sé: la risposta non sta
  in questa schermata.
- **Non confronterà strumenti** e non nominerà conti, titoli o fondi.
- **Il tasso non arriverà dalla rete**, né mentre il sito gira né mentre viene
  costruito. Resterà una costante scritta nel codice, con fonte e periodo
  dichiarati accanto, e si aggiornerà a mano.
- **Il valore vero del tasso è un blocco ancora aperto.** Deve essere la media
  di più anni dell'indice dei pre

---

## 08 — «Quanto mi resta davvero in busta»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/08-simulatore-netto-in-busta-paga.md`](features/08-simulatore-netto-in-busta-paga.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 08 — «Quanto mi resta davvero in busta, e dove va il resto»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/08-simulatore-netto-in-busta.md`](features/08-simulatore-netto-in-busta.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 09 — «Per quanti mesi bastano i soldi che ho da parte»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/09-fondo-di-emergenza.md`](features/09-fondo-di-emergenza.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 09 — «Per quanti mesi bastano i soldi che ho da parte»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/09-mesi-coperti-dai-risparmi.md`](features/09-mesi-coperti-dai-risparmi.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 10 — «Quanto pago di rata ogni mese, con un tasso fermo e con uno che si muove»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/10-rata-del-mutuo.md`](features/10-rata-del-mutuo.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 10 — «Quanto pago al mese: la rata con un tasso fermo e con un tasso che si muove»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/10-simulatore-rata-mutuo-fisso-variabile.md`](features/10-simulatore-rata-mutuo-fisso-variabile.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 11 — «Il mutuo: che cosa vuol dire, parola per parola»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/11-approfondimento-mutuo.md`](features/11-approfondimento-mutuo.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 11 — «Quanto costa in tutto un mutuo, oltre ai soldi che la banca presta»
**Stato:** ◌ in sviluppo — *non ancora riconciliato con il codice*  
**Origine:** [`docs/features/11-approfondimento-sul-mutuo.md`](features/11-approfondimento-sul-mutuo.md)
### Cosa farà

*non ancora descritto*

### Per chi

*non ancora indicato*

### Come si proverà

*passi non ancora scritti*

### Limiti

*nessun limite dichiarato*

---

## 12 — «Questi nomi che sento dire: che cosa sono, in concreto»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/12-approfondimento-investimenti.md`](features/12-approfondimento-investimenti.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

---

## 13 — «Da dove vengono i numeri di questo sito»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/13-tabella-fonti-dati-sorgente-unica.md`](features/13-tabella-fonti-dati-sorgente-unica.md)
### Cosa fa

Aprendo questa pagina comparirà, per ogni numero che il sito usa, una riga con
tre risposte: chi lo dice, su quale periodo vale, da quando è scritto qui
dentro. Se anche una sola di queste tre cose manca, la pagina lo dichiarerà
apertamente invece di lasciar credere che il numero sia comunque verificabile
— ed è esattamente il caso di oggi: l'unica riga presente, quella
dell'infla

### Per chi

La persona che è arrivata in fondo a una schermata con un numero — per esempio
quella dei risparmi fermi, con «un aumento dei pre

### Come si prova

Sono i **criteri di accetta

### Limiti

- **Non aggiornerà niente da solo.** Nessuna chiamata alla rete, né mentre il
  sito gira né mentre viene costruito: ogni numero entrerà a mano, e la riga
  dichiarerà quando è stato scritto e su quale periodo vale. L'aggiornamento
  resterà un gesto umano — una persona che apre il file, cambia il numero e la
  data, e committa.
- **Non avrà una colonna che promette una caden

---

## 13 — «Da dove viene questo numero, e quando è stato scritto»
**Stato:** ◌ in sviluppo  
**Origine:** [`docs/features/13-tabella-fonti-dati.md`](features/13-tabella-fonti-dati.md)
### Cosa fa

«…»

### Per chi

«La persona, e il momento esatto in cui le serve.»

### Come si prova

«…»

### Limiti

«…»

