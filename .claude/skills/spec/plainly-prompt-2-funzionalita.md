# Plainly — Prompt 2: Funzionalità

*Questo è il secondo dei due prompt di lavoro per il progetto Plainly. Approfondisce le funzionalità: domande reali mappate, pagine di spiegazione, guide-documento, simulatori con formule, approfondimenti su mutuo e investimenti, fonti dati. Per missione, utente target, principi di design/accessibilità, tono, naming e struttura della landing page, vedi il Prompt 1 — Contesto e Landing Page.*

**Contesto essenziale** (per chi legge solo questo prompt): Plainly è un sito che rende comprensibili economia e finanza personale a un cittadino che parte da zero — bassa alfabetizzazione finanziaria, ansia concreta più che curiosità teorica, poca pazienza per testi lunghi. Ogni funzionalità qui descritta deve seguire i principi di linguaggio del Prompt 1: zero termini tecnici isolati, un concetto per schermata, numeri sempre accompagnati da un paragone concreto, tono da amico che spiega.

## 1. Domande reali da mappare per categoria

Base per le pagine di spiegazione, per la ricerca interna e per le domande di esempio mostrate sulle card della landing page (Prompt 1).

**Il costo della vita**
- "Quanto sono aumentati davvero i prezzi rispetto all'anno scorso?"
- "Come proteggo i miei risparmi dall'inflazione?"
- "Perché la bolletta è così alta questo mese?"
- "Conviene cambiare fornitore o offerta?"
- "Mutuo o affitto, cosa mi conviene?"
- "Il mio stipendio tiene il passo con i prezzi?"

**Il lavoro**
- "Il mio settore è a rischio nei prossimi anni?"
- "Cosa succede economicamente se perdo il lavoro adesso?"
- "Come funziona la NASpI?"
- "Conviene aprire una partita IVA o restare dipendente?"
- "Quanto mi tolgono davvero le tasse sullo stipendio?"
- "Il mio contratto a termine verrà rinnovato? Cosa cambia rispetto a un indeterminato?"

**Il futuro**
- "Quanto sarà la mia pensione? A che età potrò andare in pensione?"
- "Riuscirò a metter via qualcosa ogni mese?"
- "Come costruisco un fondo di emergenza?"
- "Meglio conto deposito, ETF o BTP per i miei risparmi?"
- "Quanto mi costa davvero il mio mutuo/prestito nel tempo?"
- "Come pianifico la successione senza litigi in famiglia?"

Ogni pagina di spiegazione deve nascere da una di queste domande come titolo, non da un termine tecnico.

## 2. Pagine di spiegazione dei concetti

Ogni diramazione delle 3 macrocategorie ha una pagina dedicata, strutturata così:
1. La domanda reale che l'utente si pone (come titolo)
2. La spiegazione con l'immagine mentale concreta (2-3 frasi massimo)
3. Un esempio numerico applicato a una situazione tipica
4. Link diretto al simulatore o alla guida-documento collegata, se esiste

## 3. Guide interattive ai documenti quotidiani

Feature centrale del sito: un facsimile di un documento reale (anonimizzato) con zone cliccabili.

**Meccanica:**
- L'utente vede il documento come lo riceve davvero (bolletta, busta paga, ecc.)
- Toccando una voce, quella zona si illumina e sotto appare una spiegazione breve in linguaggio semplice — non tutto il testo insieme, solo quello richiesto in quel momento
- Si spiegano solo le 3-5 voci che generano più dubbi reali, non l'intero documento: il resto resta visibile ma in secondo piano
- **Riepilogo finale (non un quiz)**: al termine, una card riassume in poche righe le voci appena spiegate, come un promemoria personale da poter rivedere in futuro — nessuna domanda a cui rispondere, nessuna sensazione di essere valutati. L'obiettivo è lasciare qualcosa da consultare, non testare l'utente.
- **Ponte al simulatore**: ogni guida-documento rimanda al simulatore collegato (dalla bolletta al simulatore energia/spese, dalla busta paga al simulatore netto)

**Documenti da coprire, in ordine di priorità (i più comuni durante l'anno):**
1. Busta paga (cedolino)
2. Bolletta luce/gas
3. Dichiarazione dei redditi (730)

**Documenti da aggiungere in una fase successiva:**
4. Piano di ammortamento del mutuo (si aggancia alla sezione approfondimenti sul mutuo, punto 5)
5. CU / Certificazione Unica
6. Contratto di lavoro (tempo indeterminato, determinato, partita IVA)
7. Estratto conto bancario
8. Estratto contributivo INPS ("busta arancione")

## 4. Simulatori

Un simulatore per macrocategoria, con la stessa logica: pochi input, output immediatamente comprensibile con un paragone concreto, nessun gergo nel risultato. Ogni simulatore usa formule reali e dati presi da fonti autoritarie (vedi tabella al punto 7) — nessun numero deve essere inventato o stimato a occhio.

**Disclaimer standard, da mostrare sotto il risultato di ogni simulatore** (piccolo, non invasivo, ma sempre presente):
> "Questo è un calcolo stimato, basato su formule semplificate e dati pubblici aggiornati. Non tiene conto di tutti i dettagli della tua situazione personale e potrebbe non corrispondere esattamente alla realtà."

**Simulatore 1 — "Quanto valgono davvero i tuoi soldi nel tempo"** (Il costo della vita)
- Input: quanto hai risparmiato oggi, per quanti anni lo lasci fermo
- Output: cosa potrai comprarci realmente, con esempio concreto (es. "oggi bastano per la spesa di un mese, in 5 anni basteranno per 3 settimane")
- **Formula**: valore reale futuro = valore nominale ÷ (1 + tasso di inflazione medio annuo) ^ numero di anni
- **Dato da recuperare**: tasso di inflazione — usare una media pluriennale, non solo l'ultimo dato mensile (che oscilla molto)
- **Fonte**: ISTAT, indice NIC (istat.it) — pubblicazione mensile

**Simulatore 2 — "Quanto ti resta davvero in busta"** (Il lavoro)
- Input: stipendio lordo mensile o annuo
- Output: netto stimato + barra visuale che mostra quanto va in tasse/contributi vs quanto resta
- **Formula (lavoratore dipendente privato)**:
  1. Contributi INPS lavoratore = lordo annuo × 9,19% (10,19% sulla quota che eccede 52.190€/anno)
  2. Reddito imponibile IRPEF = lordo annuo − contributi INPS
  3. IRPEF lorda a scaglioni sul reddito imponibile: 23% fino a 28.000€; 33% dai 28.001€ ai 50.000€; 43% oltre 50.000€
  4. Netto stimato ≈ lordo annuo − contributi INPS − IRPEF lorda
  - *Semplificazione dichiarata*: questa formula non include le detrazioni per lavoro dipendente né le addizionali regionali/comunali, che variano da persona a persona — il risultato va presentato come "una stima", non come "il calcolo esatto della tua busta paga".
- **Variante "Dipendente vs Partita IVA forfettario"**:
  - Reddito imponibile forfettario = fatturato × coefficiente di redditività (varia per tipo di attività — va reso selezionabile, non fisso)
  - Imposta sostitutiva = reddito imponibile × 15% (5% per i primi 5 anni di nuove attività, se applicabile)
  - Contributi INPS Gestione Separata = reddito imponibile × 26,07% (24% se il professionista ha già un'altra copertura previdenziale)
- **Fonti**: INPS (circolari aliquote contributive annuali), Agenzia delle Entrate (aliquote IRPEF e regime forfettario) — aggiornamento annuale, legato alla Legge di Bilancio

**Simulatore 3 — "Il mio fondo di emergenza"** (Il futuro)
- Input: spese fisse mensili, risparmi attuali
- **Formula**: mesi coperti = risparmi attuali ÷ spese fisse mensili
- Output: "Con quello che hai da parte, potresti coprire le spese per X mesi senza reddito"
- Nessuna fonte esterna necessaria: unico simulatore che non dipende da dati che cambiano nel tempo

**Simulatore 4 — "Fisso o variabile: quanto rischio?"** (collegato all'approfondimento Mutuo, punto 5)
- Input: importo del mutuo, durata
- **Formula rata (ammortamento alla francese, rata costante)**: rata = C × [i × (1+i)ⁿ] ÷ [(1+i)ⁿ − 1], dove C = capitale finanziato, i = tasso di interesse mensile (tasso annuo ÷ 12), n = numero totale di rate (anni × 12)
- **Scenario fisso**: si usa il TAN medio di mercato più recente
- **Scenario variabile**: il range mostrato non va inventato — si costruisce guardando quanto si è mosso storicamente l'Euribor in periodi di durata comparabile (es. ultimi 5-10 anni), non ipotizzando scenari arbitrari
- **Fonti**: Banca d'Italia / ABI e osservatori di settore per i tassi medi correnti; Euribor storico dall'EMMI (European Money Markets Institute) — aggiornamento mensile per i tassi correnti

## 5. Approfondimento: il Mutuo

Sezione dedicata perché il mutuo è la decisione economica singola più grande che molti cittadini prenderanno mai, ma è anche il tema con più gergo tecnico concentrato. Sotto-argomenti da coprire:

1. **Fisso o variabile: cosa cambia davvero**
   - "Fisso = la rata che paghi oggi è la stessa per sempre; variabile = la rata sale e scende insieme a un indice che non controlli"
   - Esempio concreto attuale: tasso medio fisso intorno al 3,46%, variabile intorno al 2,80% (dati settembre 2026) — eppure oltre il 90% degli italiani scelgono il fisso, non perché costi meno ma per eliminare il rischio di sorprese

2. **TAN e TAEG: il numero sul volantino non è quello vero**
   - "Il TAN è solo l'interesse, il TAEG è quanto costa davvero tutto insieme (istruttoria, perizia, assicurazioni)"
   - Esempio: un TAN del 3,46% può diventare un TAEG del 3,60-3,72%

3. **Come si legge il piano di ammortamento**
   - Concetto contro-intuitivo da rendere visuale: nei primi anni la rata paga soprattutto interessi, non il debito (ammortamento "alla francese")
   - Buon candidato per una spiegazione con due barre che si scambiano proporzione nel tempo
   - Si aggancia alla guida-documento del piano di ammortamento (punto 3)

4. **La surroga: cambiare banca gratis, per legge**
   - "Se un'altra banca offre un tasso migliore, puoi spostare il mutuo lì senza pagare notaio, penali o istruttoria — è un diritto (art. 120-quater del Testo Unico Bancario), non un favore"
   - Rilevante nel contesto attuale di tassi in risalita

5. **Quanto dura il mutuo: 20, 25 o 30 anni?**
   - "Più anni = rata più bassa ogni mese, ma più interessi pagati in totale"
   - Dato reale da usare come esempio: quasi metà dei nuovi mutui in Italia oggi è a 30 anni, proprio per tenere la rata sostenibile

6. **Le spese che nessuno guarda all'inizio**
   - Notaio, imposta sostitutiva, perizia, assicurazione — costi reali aggiuntivi rispetto al numero pubblicizzato

7. **Cosa fare se non riesci più a pagare la rata**
   - Contenuto protettivo: sospensione della rata (Fondo di solidarietà), rinegoziazione
   - Va scritto con massima chiarezza perché è l'informazione richiesta nel momento di massimo stress dell'utente, non in un momento di lettura serena

## 6. Approfondimento: gli Investimenti

Sezione dedicata al dubbio che nasce quasi sempre dopo aver risolto quello sul fondo di emergenza: "e adesso, cosa faccio con il resto dei risparmi?". L'obiettivo non è spingere l'utente a investire, ma fargli capire che esistono strumenti diversi, ciascuno pensato per un'esigenza diversa — e che l'errore più comune non è "lo strumento sbagliato", ma lo strumento giusto usato al momento sbagliato (es. mettere in azioni i soldi che servono tra 6 mesi).

**Principio guida della sezione**: prima il bisogno, poi lo strumento — mai il contrario.

1. **Bisogno: i soldi devono restare disponibili subito (fondo di emergenza)**
   → Conto corrente / conto deposito — nessun rischio di perdita del capitale, rendimento minimo

2. **Bisogno: un obiettivo a 2-5 anni (es. cambiare auto, ristrutturare casa)**
   → Titoli di Stato (BOT, BTP) e obbligazioni — rischio basso (soprattutto sui titoli di Stato), rendimento contenuto

3. **Bisogno: far crescere i risparmi nel lungo periodo (10+ anni), es. per i figli o per integrare la pensione**
   → Azioni, fondi comuni di investimento, ETF — rischio più alto e oscillazioni nel breve periodo, ma rendimento atteso più alto nel tempo per chi resta investito a lungo
   - **La regola d'oro da ripetere sempre**: diversificare — non mettere tutti i risparmi in un solo strumento, un solo settore o un solo paese

4. **Bisogno: integrare la pensione pubblica**
   → Fondi pensione / previdenza complementare — vantaggio aggiuntivo per i lavoratori dipendenti: il contributo versato dal datore di lavoro

**Da trattare con cautela, non da promuovere**
- **Criptoattività**: valore molto instabile, nessuna garanzia statale — adatte al massimo a una quota molto piccola di risparmio che si è disposti a perdere del tutto
- **Crowdfunding**: si investe direttamente in un progetto o una piccola azienda; difficile recuperare i soldi prima della scadenza e rischio di perdita totale elevato

**Uno strumento pratico da mostrare sempre**: il **KID** (Key Information Document), il foglio semplificato che ogni prodotto di investimento complesso deve fornire per legge. Va presentato con un'immagine familiare: "è il bugiardino del farmaco, ma per i soldi".

**Nota di prudenza sul prodotto**: a differenza degli altri simulatori del sito, qui è meglio NON costruire un simulatore che proietta "quanto guadagnerai se investi X" — proiettare rendimenti futuri, anche a scopo educativo, rischia di essere letto come una promessa o una raccomandazione personalizzata. Meglio un contenuto puramente informativo su rischio/orizzonte temporale/liquidità di ciascuno strumento.

**Fonti verificate da usare come riferimento per i contenuti:**
- Banca d'Italia — *L'economia per tutti* (economiapertutti.bancaditalia.it): portale di educazione finanziaria ufficiale, già in linguaggio semplificato, copre azioni, obbligazioni, fondi comuni, ETF, titoli di Stato, criptoattività
- CONSOB — Portale di Educazione Finanziaria (consob.it/web/investor-education): guide su pianificazione finanziaria e comportamenti da adottare prima di investire
- COVIP — *Guida introduttiva alla previdenza complementare* (covip.it): fonte ufficiale su fondi pensione e PIP

## 7. Fonti dati e piano di aggiornamento

Ogni dato numerico "vivo" del sito (tassi, aliquote, soglie) deve venire da una fonte autoritativa specifica e avere una cadenza di aggiornamento dichiarata — mai un numero scritto a mano senza sapere da dove viene o quando andrebbe rivisto.

| Dato | Fonte autoritativa | Aggiornamento |
|---|---|---|
| Inflazione (indice NIC) | ISTAT (istat.it) | Mensile |
| Aliquote IRPEF e soglie | Agenzia delle Entrate / Legge di Bilancio (Gazzetta Ufficiale) | Annuale |
| Aliquote contributive INPS (dipendenti, Gestione Separata, forfettari) | INPS (circolari aliquote contributive) | Annuale |
| Tassi mutuo (TAN/TAEG medi, fisso e variabile) | Banca d'Italia / ABI, osservatori di settore | Mensile |
| Euribor storico (per il range del tasso variabile) | EMMI — European Money Markets Institute | Mensile |
| Contenuti educativi su investimenti | Banca d'Italia ("L'economia per tutti"), CONSOB, COVIP | Verifica periodica (consigliata: semestrale) |

Questa tabella è la fonte di verità unica per tutti i dati "che cambiano nel tempo" citati in questo prompt (mutuo, investimenti, simulatori): se un dato cambia, si aggiorna qui e si riflette ovunque nel sito, non pagina per pagina.

---

*Nota di continuità: questo prompt approfondisce le funzionalità. Per missione, utente target, tono, principi di accessibilità, naming e struttura della landing page, vedi il Prompt 1 — Contesto e Landing Page. Lo stack tecnologico e la sequenza delle fasi di sviluppo sono lasciati alla discrezione dell'agente di implementazione.*
