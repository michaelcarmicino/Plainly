id: 02-catalogo-domande-reali-per-macrocategoria
stato: fatto
directory: src/ui/, src/guardrails/, tests/
dipende-da:
note: impronta ricavata da docs/features/02-catalogo-domande-reali-per-macrocategoria.md

# 02 — Le domande vere, e che cosa il sito sa rispondere

## Obiettivo

Entrando in un'area si trova la propria domanda scritta con le parole di tutti
i giorni, e accanto — senza passare il mouse su niente — si legge se la
risposta c'è, se arriverà, o se il sito dichiara di non avere una fonte per
darla. Diciotto domande, tre stati, nessuna sparita in silenzio.

## Specifica collegata

`docs/features/02-catalogo-domande-reali-per-macrocategoria.md` — stato: **proposta**.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 1 «Domande reali da mappare per categoria».

Sette delle diciotto domande d'origine, scritte così come sono, sceglierebbero
per chi legge («conviene…», «meglio…», «come proteggo…»): la specifica le
riscrive una per una con il motivo accanto.

Impronta contesa: `src/ui/` e `tests/` sono le directory più richieste. Finché
questo task è aperto, `03` e i task dei simulatori non possono girare in
parallelo — e `03` si aggancia alle voci del catalogo, quindi va dopo.

Due decisioni da confermare, entrambe scritte in fondo alla specifica: la card
de «Il lavoro» cambia domanda rispetto a `01-landing-page`, già consegnato, e
il lessico dei guardrail si allarga a «meglio» e «preferibile».
