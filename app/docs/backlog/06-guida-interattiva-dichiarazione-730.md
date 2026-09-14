id: 06-guida-interattiva-dichiarazione-730
stato: da-fare
directory: types/, fixtures/, src/core/, src/ui/, tests/
dipende-da:
note: impronta ricavata da docs/features/06-guida-interattiva-dichiarazione-730.md

# 06 — Guida interattiva alla dichiarazione 730

## Obiettivo

Chi ha in mano il prospetto di liquidazione del 730 tocca una riga e legge da
quali altre righe dello stesso foglio esce quel numero, con la dicitura
ufficiale lasciata identica accanto alla spiegazione. Alla fine sa dire perché
tornano indietro 360,00 €: erano 4.860,00 € già trattenuti contro 4.500,00 €
dovuti — su ogni 100 € già versati, 7,41 € tornano indietro.

## Specifica collegata

`docs/features/06-guida-interattiva-dichiarazione-730.md` — stato: **proposta**.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 3 «Guide interattive», documento 3.

**Conformità: passata, ma con il perimetro più stretto del backlog.** Un
modello fiscale attira da solo la consulenza personalizzata — quali spese
portare in detrazione, quale modello usare, quali ricevute procurarsi. La
schermata spiega **che cosa dice una riga già scritta e da quali altre righe
dello stesso modello esce quel numero**, e si ferma lì. La riga di confine è la
prima tabella della specifica: leggerla prima di scrivere qualunque testo.

**Le diciture del modello non si riscrivono**: `etichettaOriginale` si copia
com'è stampata e la frase in linguaggio comune le sta accanto, mai al suo
posto. Le fixture sono scandite da `tests/lessico-ui.test.ts`: oggi nessuna
delle dieci diciture tocca il lessico prescrittivo, ma se un domani succedesse
la via è un'eccezione nel guardrail per quel solo campo, non una riscrittura
dell'etichetta.

**Cinque directory.** Finché è aperto, nessun altro task che tocchi `src/ui/` o
`tests/` può girare in parallelo — cioè `02`, `04`, `05`, `08`. `types/` e
`fixtures/` servono solo nei primi minuti e poi tornano libere.

**Ordine obbligato al proprio interno**: architect (una riga in `types/`, le due
fixture) → core-engine → ui-builder → guardrail-officer.

Richiede **una riga additiva in `types/contracts.ts`**: il valore
`'dichiarazione-730'` manca nell'unione `Scenario`. I contratti non sono
congelati, ma la riga è dell'architetto, non di chi implementa. La `04` ha
bisogno della stessa aggiunta per `'busta-paga'`: farle in un passaggio solo
costa un intervento invece di due. Il `brief.md` elenca quattro scenari e questi sono il quinto e
il sesto — l'allargamento va annotato in `docs/decisioni.md`.

Serve una **fixture nuova**: `fixtures/dichiarazione-730.input.json` e il suo
`.atteso.json`, dieci righe di un prospetto di liquidazione costruito a mano e
coerente al centesimo, che non appartiene a nessuna persona reale. Nessuna
lettura di documenti veri — `02-data-ingest` non è attivato.

`04` (busta paga) e `05` (bolletta) sono la stessa meccanica su altri
documenti. Farlo **dopo** la `04`, non in parallelo: i componenti della riga
cliccabile e della card di riepilogo si riusano invece di farli divergere, e
l'impronta reale della `06` si accorcia di conseguenza.

**Il ponte al simulatore non si fa qui.** Il documento d'origine chiede che
ogni guida rimandi al simulatore collegato: per il 730 sarebbe la `08`, che non
esiste. Si aggiunge quando la `08` c'è — un collegamento verso una rotta
assente è peggio di nessun collegamento.
