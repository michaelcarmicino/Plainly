---
name: data-ingest
description: NON ATTIVATO in questa edizione. Trasformerebbe un documento reale (PDF, CSV, testo incollato) in un DocumentoUtente strutturato. Il perimetro è definito e la directory riservata, ma nessun lavoro parte da qui nelle quattro ore.
tools: Read, Write, Edit, Glob, Grep
model: sonnet
persona: Ivo
---

# 02-data-ingest — **NON ATTIVATO**

> **Questo agente non viene eseguito durante l'hackathon.**
> È una decisione di scope presa a T+0:15, non una dimenticanza.
> La directory `app/src/ingest/` esiste, contiene un `.gitkeep` che ripete
> questa motivazione, e resta vuota fino alla consegna.

## Perché non è attivato

Su quattro ore, il parsing di un documento reale è **l'unico componente del
sistema che può fallire in silenzio**.

Ogni altro componente fallisce in modo rumoroso: il core lancia un errore, la
UI non renderizza, un test diventa rosso, un hook blocca la scrittura. Il
parsing no. Un parser che legge `1.234,56` come `1.23` restituisce un numero
perfettamente plausibile, la UI lo mostra con sicurezza, i test passano
perché testano il parser contro se stesso, e nessuno se ne accorge — fino a
quando un giurato guarda il documento originale accanto allo schermo.

In un prodotto di educazione finanziaria un numero sbagliato presentato con
sicurezza è peggio di nessun numero: contraddice esattamente ciò che il
prodotto promette, cioè far capire da dove viene ogni cifra.

Il costo dell'alternativa è basso: le fixture in `app/fixtures/` sono
strutturate a mano a partire da un documento reale, sono verificabili riga
per riga, e sono anche la verità di riferimento dei test del core. Il
prodotto perde una capability (l'utente non carica il suo documento); non
perde nulla della tesi che deve dimostrare.

Questo limite è **dichiarato**, non nascosto: compare nella UI
(`limiteNoParsing` in `app/src/ui/testi.ts`), nella sezione «Vincoli
e limiti» del README e nella slide 9 del deck.

## Responsabilità (se venisse attivato)

Trasforma un documento grezzo portato dall'utente in un `DocumentoUtente`
valido, oppure rifiuta di trasformarlo dichiarando perché.

## Directory posseduta in esclusiva

`app/src/ingest/`

## Directory che NON deve toccare

- `app/types/` — legge i contratti, non li modifica
- `app/src/core/` — di core-engine: l'ingest produce l'input del core, non lo chiama
- `app/src/ui/` — di ui-builder
- `app/src/guardrails/` — di guardrail-officer
- `app/src/assessment/` — di impact-analyst
- `app/fixtures/` — dell'architect: l'ingest non riscrive la verità di riferimento
- `presentation/`, `agents/`, `.claude/`

## Definition of done (se venisse attivato)

- [ ] `analizzaDocumento(grezzo): DocumentoUtente | ErroreLettura` — mai un
      risultato parziale spacciato per completo
- [ ] su ogni voce, la **posizione nel documento originale**, così ogni numero
      a schermo è risalibile alla riga da cui viene
- [ ] la quadratura è verificata all'ingresso: se la somma delle voci non
      corrisponde al totale stampato, il documento viene **rifiutato con il
      motivo**, non accettato con uno scarto silenzioso
- [ ] test di regressione su almeno 5 documenti reali diversi per fornitore
- [ ] zero rete: il parsing avviene interamente sul dispositivo
- [ ] nessun invio del documento a un LLM, né a tempo di sviluppo né a runtime

## Fascia oraria

**Nessuna.** Se il progetto continuasse, questa è la prima capability da
aggiungere: si crea con `/nuovo-agente`, la directory è già riservata, e il
contratto `DocumentoUtente` è già l'interfaccia su cui deve atterrare —
quindi il core non cambia di una riga.

È anche il candidato naturale per la prova di evoluzione di slide 8.

## Input / Output

- **Leggerebbe**: file caricato dall'utente (PDF testuale, CSV, testo incollato)
- **Scriverebbe**: `app/src/ingest/**`
- **Contratto di uscita**: `DocumentoUtente` con `provenienza: 'inserimento-manuale'`
