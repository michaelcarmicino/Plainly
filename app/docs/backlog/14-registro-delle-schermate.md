id: 14-registro-delle-schermate
stato: fatto
directory: src/ui/, tests/
dipende-da:
note: impronta ricavata da docs/features/14-registro-delle-schermate.md

# Registro delle schermate

## Obiettivo

Aggiungere una schermata significa **aggiungere file, non modificarne**. Una
schermata si dichiara in `src/ui/schermate/NN-nome.ts` — id, percorso,
componente, gradino di navigazione — e un registro le raccoglie da sola con
`import.meta.glob({ eager: true })`, che si risolve a build time.

I punti di conflitto condivisi passano da **cinque a uno**: `src/main.tsx`,
`src/ui/rotte.ts`, `src/ui/App.tsx` e `src/ui/Navigazione.tsx` escono; resta
`src/ui/testi.ts`, una riga per schermata.

## Specifica collegata

`docs/features/14-registro-delle-schermate.md`

## Note

**Task di infrastruttura: non aggiunge una schermata, toglie il motivo per cui
le nove che restano devono andare in fila.** A schermo non deve cambiare
niente, e le due schermate esistenti (07 e 13) sono il banco di prova.

**Va prima delle nove schermate rimaste, non dopo.** È l'unico momento in cui
ha senso: fatto dopo, va applicato retroattivamente a nove schermate già
scritte. Finché questo task non è chiuso, **le schermate restano
serializzate** — ognuna tocca gli stessi cinque file condivisi, e due in
parallelo si sovrascrivono senza che nessuna delle due se ne accorga.

**Mentre è in corso, nessun altro task che tocchi `src/ui/` può girare**: il
task modifica i quattro file che tutte le schermate attraversano. È il
contrario del caso normale — un task che serializza tutto adesso per
parallelizzare tutto dopo.

**Tre affermazioni tecniche sono già state provate** e non vanno riprovate a
mano (dettaglio al passo 1 della specifica): il glob eager funziona sotto
vitest in ambiente `node`; si risolve a build time senza aggiungere una sola
richiesta di rete al bundle; un componente può importare da sé il proprio
`stiliX.css`, il che fa uscire `src/main.tsx` dalla lista **senza bisogno del
registro** — è il guadagno più economico, si può incassare per primo.

**Due trappole, entrambe scritte nella specifica.** `tsc --noEmit` fallisce su
`import.meta.glob` finché il file del registro non porta in testa
`/// <reference types="vite/client" />` (provato: `tsconfig.json` non va
toccato). E **nessun componente deve importare il registro**, altrimenti si
chiude un ciclo di import che non esplode, lascia solo una costante
`undefined`: `App.tsx` è l'unico modulo che lo importa.

Costo noto: quattro punti nei test esistenti asseriscono la forma vecchia di
`Rotta` e vanno aggiornati — da qui `tests/` nell'impronta e il coinvolgimento
di `04-guardrail-officer`. `parseRotta` resta pura e continua a portare alla
home qualunque indirizzo non riconosciuto.
