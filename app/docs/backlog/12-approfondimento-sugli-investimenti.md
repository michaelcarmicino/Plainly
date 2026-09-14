id: 12-approfondimento-sugli-investimenti
stato: da-fare
directory: 
dipende-da: 
note: RIFIUTATA da /spec il 2026-09-14, criterio 1 — la sezione d'origine indica quale strumento usare per quale bisogno. Nessuna spec scritta, impronta non calcolabile. Variante conforme proposta qui sotto, in attesa di un sì.

# 12 — Approfondimento sugli investimenti

## Obiettivo

Approfondimento sugli investimenti

## Specifica collegata

**Nessuna.** `/spec` ha rifiutato la richiesta: `docs/features/12-*.md` non
esiste e non va creato finché il task non viene riscritto.

Finché `directory` resta vuota il task **non è pianificabile**, e questa volta
è corretto che lo sia: non è un'impronta che manca, è la funzionalità.

## Note

Origine: `docs/backlog/_in-arrivo/_normalizzati/plainly-prompt-2-funzionalita.md`,
sezione 6 «Approfondimento: gli Investimenti».

### Perché è stata rifiutata

Criterio 1 di `/spec`: **consiglia o raccomanda una scelta**.

La sezione d'origine dichiara da sé il proprio impianto — «prima il bisogno,
poi lo strumento» — e lo svolge in quattro punti della forma
`Bisogno → Strumento`. Dire a una persona quale strumento corrisponde al suo
bisogno **è** dirle quale scegliere, comunque sia formulata la frase. Accanto
ci sono, nello stesso testo:

- una regola imperativa da «ripetere sempre» sul non concentrare i risparmi —
  è l'esempio che `.claude/rules/scrittura-e-accessibilita.md` porta come
  formulazione **vietata**;
- un giudizio di idoneità con tanto di quota di portafoglio sulle
  criptoattività («al massimo una quota molto piccola»);
- un livello di rischio per ciascuno strumento («rischio basso», «rischio più
  alto»), cioè un semaforo su un prodotto finanziario;
- un rendimento futuro presentato come attesa.

Togliendo tutto questo non resta una versione ridotta della sezione 6: restano
due frammenti — la spiegazione della diversificazione come meccanismo e il KID.
Il valore che la sezione promette («esistono strumenti diversi, ciascuno per
un'esigenza diversa») **non è raggiungibile dentro il vincolo**, perché quel
valore è la raccomandazione.

### Il dato che ha reso il rifiuto non opinabile

Dodici frasi prese alla lettera dalla sezione 6 sono state passate al lessico
reale di `src/guardrails/lessico.ts`: **nessuna viene bloccata.** Né
«rischio basso», né «rendimento atteso più alto», né «adatte al massimo a una
quota molto piccola», né la regola sul non concentrare i risparmi.

Le radici vietate coprono l'imperativo diretto (`investi`, `compra`, `vendi`,
`dovresti`, `adatto a te`), non la stessa raccomandazione scritta in terza
persona. Su questo task il controllo automatico vale zero: **l'unico cancello
che lo intercetta è `/spec`**, ed è qui che doveva fermarsi.

Nota per `guardrail-officer`: la riformulazione già scritta nella voce
`investimento` del lessico dice «Il prodotto non tratta investimenti. Rimuovere
la frase.» Il lessico però non ha modo di farla rispettare.

### Variante conforme proposta

**«Il foglio che ti danno prima di firmare»** — come si legge il KID.

Una persona a cui hanno messo davanti dei fogli da firmare ne ha in mano uno,
di poche pagine, che per legge accompagna ogni prodotto di investimento
complesso e dice sempre le stesse cose nello stesso ordine. È il bugiardino del
farmaco, ma per i soldi: si chiama KID.

La pagina spiega che cosa vuol dire ogni riquadro di **quel foglio** — che cosa
misura l'indicatore da 1 a 7, che cosa sono i costi elencati, per quanto tempo
il prodotto è pensato per restare fermo — e traduce in euro la percentuale di
costo scritta sul foglio: chi digita `1,50%` e `10.000 €` legge **150 € l'anno,
cioè 12,50 € al mese, quanto una bolletta del telefono**. Il conto si rifà a
mano in due secondi.

Perché passa i quattro criteri:

1. non nomina nessun prodotto, non accosta bisogni a strumenti, non dice se
   firmare: spiega un documento;
2. non serve un solo dato di mercato — la percentuale la legge la persona sul
   proprio foglio, come i 10.000 € della funzionalità 07;
3. non riscrive le etichette del documento, le spiega accanto;
4. non è una chat.

È anche l'unica forma in cui il task rientra nella promessa scritta in
`docs/brief.md`: «far capire il documento che si ha in mano». Di conseguenza
**cambia famiglia**: non è più un approfondimento (sezione 6), è una guida
interattiva a un documento — la stessa forma di `04`, `05`, `06`.

### Che cosa si salva della sezione 6, e dove va

- **La diversificazione**, nella formulazione già scritta in
  `.claude/rules/scrittura-e-accessibilita.md` («chi mette tutti i risparmi in
  una sola azienda, se quella va male, perde tutto insieme»): descrive il
  meccanismo senza l'imperativo, quindi è conforme. Ma è **un paragrafo, non
  una funzionalità**: sta in una pagina di spiegazione costruita su
  `03-pagina-di-spiegazione-struttura-riusabile`, non qui.
- **Il KID**, che diventa la variante qui sopra.
- **La nota di prudenza della sezione stessa** — non costruire un simulatore
  che proietta «quanto avrai se investi X» — che resta valida e vale come
  esclusione già scritta dall'autore del documento d'origine.

Tutto il resto non si salva in nessuna forma.
