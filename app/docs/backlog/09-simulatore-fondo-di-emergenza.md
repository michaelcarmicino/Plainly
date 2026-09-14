id: 09-simulatore-fondo-di-emergenza
stato: da-fare
directory: src/core/, src/ui/, tests/
dipende-da:
note: impronta ricavata da docs/features/09-mesi-coperti-dai-risparmi.md

# 09 — Per quanti mesi bastano i soldi che ho da parte

## Obiettivo

Chi digita quanto spende in un mese per le spese fisse e quanto ha da parte
ottiene una cifra riferita a sé — «2 mesi e 17 giorni» — insieme alla
scomposizione del conto, così che possa rifarlo su un foglio.

## Specifica collegata

`docs/features/09-mesi-coperti-dai-risparmi.md` — stato: **approvata**.

Lo **slug della spec è diverso dall'id di questo task**, e non è una svista:
`/spec` ha rifiutato la formulazione «fondo di emergenza» e ha scritto la spec
sulla variante conforme, mantenendo il numero `09`. Il branch segue lo slug
della spec: `feature/09-mesi-coperti-dai-risparmi`.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 4, simulatore 3.

**Perché il nome è cambiato.** «Fondo di emergenza» non è il nome di una misura,
è il nome di un obiettivo da raggiungere, e arriva quasi sempre accompagnato da
«dovresti avere da parte tre-sei mesi di spese»: una raccomandazione
personalizzata, e per di più una soglia che nessuna fonte della sezione 7 del
documento d'origine pubblica. Il **calcolo** invece è rimasto identico a quello
del documento d'origine — `risparmi ÷ spese fisse mensili` — con la
scomposizione in mesi e giorni e nessuna soglia, nessun traguardo, nessun
semaforo di giudizio.

Nessun blocco aperto: è l'unico simulatore del documento che **non dipende da
nessun dato esterno**, quindi non ha una costante da recuperare né una fonte da
aggiornare.

Impronta identica a quella della `07`: non può girare in parallelo con nessun
altro task che tocchi `src/core/`, `src/ui/` o `tests/`.
