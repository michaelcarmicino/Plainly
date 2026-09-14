# Scrittura e accessibilità

Non è materiale di consultazione: è la parte del progetto che decide se
funziona. Un calcolo giusto spiegato male, su questo target, è un calcolo
inutile.

## Lo schema fondamentale: traduzione, non definizione

**Prima l'immagine mentale concreta, poi il nome tecnico. Mai il contrario.**

Va applicato a **ogni singolo concetto del sito**, prima ancora di pensare al
layout.

### Inflazione

❌ «L'inflazione è l'aumento generalizzato dei prezzi che erode il potere
d'acquisto.»

✅ «Immagina di fare la spesa con lo stesso carrello di un anno fa. Con gli
stessi soldi, oggi ci entrano meno cose. Quella differenza si chiama
inflazione.»

### Lavoro — NASpI

❌ «La NASpI è un'indennità di disoccupazione erogata dall'INPS ai lavoratori
che hanno perso involontariamente l'impiego e possiedono i requisiti
contributivi richiesti.»

✅ «Se perdi il lavoro senza colpa tua e hai lavorato almeno un po' negli
ultimi anni, lo Stato ti dà ogni mese una parte del tuo vecchio stipendio, per
un periodo limitato, mentre cerchi un nuovo lavoro. Si chiama NASpI.»

### Futuro — fondo pensione

❌ «La previdenza complementare consente di integrare la pensione obbligatoria
attraverso versamenti volontari a forme pensionistiche private.»

✅ «La pensione pubblica da sola spesso non basta per vivere come vivi oggi. Il
fondo pensione è come un secondo salvadanaio: ci metti un pezzettino di
stipendio ogni mese e lo usi solo quando vai in pensione — e lo Stato ti aiuta
facendoti pagare meno tasse su quei soldi.»

### Investimenti — diversificazione

❌ «La diversificazione del portafoglio consiste nell'allocare il capitale su
una molteplicità di strumenti finanziari con caratteristiche eterogenee, al
fine di mitigare il rischio idiosincratico.»

✅ «Chi mette tutti i risparmi in una sola azienda, se quella va male, perde
tutto insieme. È come portare tutta la spesa in un unico sacchetto: se si
rompe una manica, non resta niente. Distribuirli su cose diverse si chiama
diversificazione.»

> **Nota sull'ultimo esempio.** La formulazione originale — «Non mettere tutti
> i risparmi in una sola azienda» — è una buona spiegazione **e** un consiglio
> di investimento, che il progetto vieta. La versione qui sopra dice la stessa
> cosa descrivendo il meccanismo invece di dare un ordine. È il modello da
> seguire ogni volta che una spiegazione scivola nell'imperativo: **togli il
> «tu devi», lascia il «chi fa così, ottiene questo».**

## I principi di design, non negoziabili

- **Zero termini tecnici isolati.** Ogni parola difficile è accompagnata,
  **nella stessa frase**, da un esempio quotidiano. Mai una nota a parte, mai
  un glossario separato da consultare.
- **Un concetto per schermata.** Niente tabelle con dieci variabili insieme.
  Se servono tre informazioni, sono tre passaggi.
- **Ogni numero ha un paragone concreto.** Non «inflazione al 3%», ma «con gli
  stessi 100 € della spesa, oggi porti a casa quello che l'anno scorso costava
  97 €». **Mai un numero senza un paragone legato alla vita quotidiana.**
- **Semafori invece di terminologia.** Verde / giallo / rosso comunicano «va
  bene / attenzione / preoccupante» prima ancora del numero.
- **Percorso breve.** Massimo due o tre tap dalla domanda alla risposta
  pratica.
- **Responsive vero.** Il sito funziona altrettanto bene da desktop e da
  smartphone. Nessuno dei due formati ha la priorità.

## Il tono

Da **amico che spiega**, non da banca e non da professore. L'utente non deve
mai sentirsi ignorante.

- Frasi corte, verbi attivi, niente burocratese.
- Ogni pagina risponde a una domanda reale posta in linguaggio umano.
- Messaggi di errore in linguaggio umano: «Controlla questo numero, sembra
  troppo alto», non «Errore di validazione nel campo input».

## Accessibilità digitale — requisiti concreti

Il target comprende persone anziane o poco avvezze alla tecnologia.
«Accessibile» non è solo linguaggio semplice: è che chiunque, con qualunque
dimestichezza digitale, possa usare il sito senza fatica.

| Requisito | Soglia |
| --- | --- |
| Dimensione del testo | **mai sotto 16px**; font semplice e ad alta leggibilità. Il layout non si rompe se l'utente aumenta lo zoom del browser |
| Contrasto | almeno **WCAG AA**, meglio AAA dove possibile |
| Aree cliccabili | bottoni e link **almeno 44×44 px** |
| Gesti | swipe, pinch e drag **mai l'unico modo** per arrivare a un contenuto: deve sempre esistere un tap o un click equivalente |
| Hover | **nessuna interazione solo-hover**: niente che appaia solo al passaggio del mouse |
| Navigazione | menu, «torna alla home» e «indietro» **sempre nella stessa posizione** su ogni pagina |
| Tempo | **nessun limite**: nessun simulatore si interrompe o si resetta se l'utente ci pensa su |
| Icone | **sempre accompagnate da testo**, mai isolate |
| Dati inseriti | si torna indietro **senza perderli** |
| Tecnologie assistive | compatibilità con screen reader e navigazione da tastiera, come requisito di base |

## Come si controlla

Il lessico prescrittivo è verificato in automatico (`/verifica`, hook, test).
**Il resto di questa pagina no**: non esiste un test che accorga che un numero
è stato scritto senza paragone concreto, o che un termine tecnico è comparso
da solo.

Per questo, prima del merge, `guardrail-officer` rilegge le stringhe nuove
anche contro questi principi, non solo contro il lessico. Se hai un dubbio su
una formulazione, chiediglielo **prima** di scriverla: riscrivere un testo
costa più che pensarlo.
