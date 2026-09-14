---
name: «nome-kebab-case»
description: «Responsabilità in una frase, al presente. Deve bastare a capire quando invocarlo e quando no.»
tools: Read, Write, Edit, Glob, Grep
---

# «NN-nome»

## Responsabilità

«Una frase. Se ne servono due, il perimetro è troppo largo: dividilo in due agenti.»

## Directory posseduta in esclusiva

`«percorso/»`

Nessun altro agente scrive qui. Nessun file di questo agente vive altrove.

## Directory che NON deve toccare

- `app/types/` — contratti, congelati a T+1:40, protetti da hook PreToolUse
- `agents/` — perimetri e ruoli: li cambia solo l'architect
- `«directory di un altro agente»` — di «altro-agente»
- `«directory di un altro agente»` — di «altro-agente»
- `.claude/` — configurazione, hook e skill: solo architect

Se il lavoro richiede di toccarne una, **fermati e segnalalo**: è un segnale
che il perimetro va ridisegnato, non un ostacolo da aggirare.

## Vincoli ereditati dal progetto

- **Offline**: nessuna chiamata di rete, nessuna API, nessuna chiave, nessun
  CDN. L'app deve girare con il Wi-Fi spento.
- **Spiega, non consiglia**: nessun testo o identificatore prescrittivo.
  Niente `suggerisci`, `consiglia`, `migliore`, `raccomanda`, `conviene`.
- **Nessuna semplificazione può alterare il significato dell'informazione
  originale.**

## Definition of done

- [ ] «criterio verificabile, non un'intenzione»
- [ ] «test eseguibile: nome del file in app/tests/»
- [ ] `npm --prefix app test` verde
- [ ] i file toccati stanno tutti dentro la directory posseduta
- [ ] almeno un commit, così l'agente compare in `agents/trace.md`

## Fascia oraria

Attivo da **«T+h:mm»** a **«T+h:mm»** («nome della wave»).

## Input / Output

- **Legge**: «file o contratti da cui parte»
- **Scrive**: «file che produce»
- **Evidenza prodotta**: «che cosa finisce in presentation/evidence/ o negli screenshot»
