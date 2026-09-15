id: NN-nome-kebab
stato: da-fare
directory: src/core/
dipende-da:
note:

# NN — titolo del task

> Modello. Non compilare questo file: copialo con il numero progressivo.
> Il campo `directory` è **l'impronta**: decide con chi questo task può girare
> in parallelo. Ricavala dalla specifica in `docs/features/`, non a intuito.
> Può contenere cartelle (`src/core/`) o file precisi (`src/ui/testi.ts`),
> mescolati: un file preciso è un'impronta più stretta, collide con meno cose.
> Alcune cartelle sono registrate come «a file esclusivi» in
> `scripts/pm-piano.mjs` (`CARTELLE_A_FILE_ESCLUSIVI`): dichiarale per intero
> come sempre, il piano affina da solo il calcolo — vedi `docs/decisioni.md`,
> D31, per il criterio e per quali cartelle non ci sono ancora e perché.
> Stati ammessi: `da-fare` · `in-corso` · `fatto` · `bloccato`.

## Obiettivo

«Una frase. Che cosa deve essere vero quando è finito.»

## Specifica collegata

«`docs/features/NN-nome.md`, oppure "da scrivere con /spec".»

## Note

«Solo ciò che serve a chi lo prenderà in mano. Il resto va nella specifica.»
