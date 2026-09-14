
## 7. La Landing Page

### 7.1 Struttura generale della home

- Barra di ricerca interna, ben visibile, in alto (dettagli al punto 7.3)
- 3 card grandi, una per macrocategoria (dettagli al punto 7.2)
- Sotto le card: accesso rapido alle Guide-documento e ai Simulatori, per chi sa già cosa cercare senza passare dalle macrocategorie

### 7.2 Le 3 card delle macrocategorie

**Ordine delle card** — non alfabetico, ma per urgenza reale (riflette i dati dei sondaggi al punto 6):
1. Il costo della vita
2. Il lavoro
3. Il futuro

**Peso visivo**: le tre card sono identiche per dimensione e stile — nessuna più grande, colorata o prominente delle altre. Se una sembra più importante, chi ha un'ansia specifica su un altro tema si sente subito fuori posto.

**Contenuto di ogni card**:
- Un'icona semplice e concreta (es. una bolletta o un carrello per "il costo della vita", non un simbolo finanziario astratto come €)
- Il titolo umano ("Il costo della vita", non "Macrocategoria 1")
- Una domanda reale di esempio, presa dalla lista mappata nel Prompt 2 — questo è il dettaglio che fa capire subito "è per me":
  - Il costo della vita → *"Perché la bolletta è così alta questo mese?"*
  - Il lavoro → *"Il mio settore è a rischio nei prossimi anni?"*
  - Il futuro → *"Quanto sarà la mia pensione?"*
- Un'indicazione esplicita che dentro ci sono altre domande (badge con numero — vedi "effetto carte impilate" sotto), non un'icona o una freccia isolata: coerente con "icone sempre accompagnate da testo" del punto 4
- Tutta la card è cliccabile (non solo un bottoncino dentro), area tap grande

**Layout responsive**:
```
Desktop (3 colonne affiancate)
┌────────────┐ ┌────────────┐ ┌────────────┐
│  [icona]   │ │  [icona]   │ │  [icona]   │
│ Il costo   │ │ Il lavoro  │ │ Il futuro  │
│ della vita │ │            │ │            │
│ "Perché la │ │ "Il mio    │ │ "Quanto    │
│ bolletta è │ │ settore è  │ │ sarà la    │
│ così alta?"│ │ a rischio?"│ │ pensione?" │
│      [+5]  │ │      [+5]  │ │      [+5]  │
└────────────┘ └────────────┘ └────────────┘

Mobile (impilate, stesso ordine)
┌──────────────────────┐
│ Il costo della vita   │
└──────────────────────┘
┌──────────────────────┐
│ Il lavoro             │
└──────────────────────┘
┌──────────────────────┐
│ Il futuro             │
└──────────────────────┘
```

**Effetto "carte impilate"** (rinforzo visivo che ci sono altre domande dentro, mai l'unico segnale — il badge col numero resta l'informazione principale):
- Massimo 2 carte "sbirciate" dietro quella principale — di più diventa rumore visivo
- Offset di 6-8px verso il basso-destra su desktop, 4px su mobile
- Nessuna rotazione: carte perfettamente parallele, coerente con l'idea di chiarezza del brand (un'inclinazione dà un effetto "mucchio disordinato")
- Le carte dietro sono rettangoli vuoti, stesso colore ma più chiaro (60-70% di opacità), nessun testo/icona sopra — servono solo a suggerire profondità
- Un badge circolare col numero (es. "+5") va posizionato proprio nell'angolo dove le carte sbirciano: il badge è l'etichetta che spiega il mucchio, non un segnale separato dal testo
- **A riposo**: già tutto visibile e comprensibile, nessun hover richiesto (coerente con "nessuna interazione solo-hover")
- **Su desktop, al passaggio del mouse** (rinforzo opzionale, mai l'unica fonte del segnale): la carta davanti si sposta leggermente in alto, scoprendo un po' più delle carte dietro
- **Al tap/click**: tutta l'area naviga alla macrocategoria; le carte dietro non sono cliccabili separatamente, solo decorative
- **Attenzione al contrasto**: le carte sbirciate restano percepibili anche a chi ha una vista meno acuta — un bordo sottile invece di puro colore chiaro aiuta a mantenerle visibili senza violare gli standard di contrasto del punto 4

### 7.3 Ricerca interna

- Barra di ricerca sempre visibile in testa a ogni pagina, non nascosta in un menu
- Cerca tra le domande reali mappate (Prompt 2) e tra le loro varianti informali (es. "bolletta cara" deve trovare "perché la bolletta è così alta questo mese?")
- Ogni risultato porta direttamente alla pagina di spiegazione pertinente, non a un elenco generico da filtrare
- Se non trova nulla, non è un vicolo cieco: mostra le domande più cercate o la macrocategoria più vicina, invece di un semplice "nessun risultato"

### 7.4 Elementi fissi di navigazione

- Breadcrumb semplice sempre visibile (es. "Home > Il lavoro > NASpI")
- Bottone "Home" e bottone "Indietro" sempre nella stessa posizione, su ogni pagina
- Bottone "torna alla domanda" visibile su ogni pagina Simulatore/Guida-documento, per non perdere il filo

**Percorso tipico**: Home → Macrocategoria (1 tap) → Domanda/Concetto (2 tap) → Simulatore o Guida-documento (3 tap) — rispetta il vincolo del punto 4.
