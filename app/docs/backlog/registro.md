# Registro del PM

> Append-only. Ogni riga è un fatto avvenuto, non una previsione.
> Scritto da `/pm`, letto da chi vuole sapere che cosa è successo.

| Quando | Evento |
| --- | --- |
| 2026-09-14T11:10:16.749Z | ondata 1 avviata: 01-calcolo-pesi, 02-schermata-voci, 04-punteggio |
| 2026-09-14T11:10:28.448Z | prova di orchestrazione conclusa, task finti rimossi |
| 2026-09-14T12:08:33.402Z | carica: 12 task dal documento funzionalita (02-13); 11 senza impronta, in attesa di /spec |
| 2026-09-14T12:28:46.550Z | 07 spec approvata; fase 1 NON avviata: doc-funzionale e tester non registrati in sessione (Agent tool li rifiuta). Bloccati anche core-engine, ui-builder, guardrail-officer, ux-reviewer |
| 2026-09-14T13:57:23.859Z | 01 e 07 chiuse e pubblicate su master; 10 task senza impronta, /spec per ricavarla |
| 2026-09-14T14:11:29.132Z | conflitto: la spec 08 prevede src/core/fiscoDichiarato.ts, cioe' il secondo registro parallelo che la 13 esiste per impedire. 13 va eseguita PRIMA di 08 e 10, e non puo' girare in parallelo con 08 ne' con 09. |
| 2026-09-14T14:24:08.247Z | COLLISIONE FRA SESSIONI: due specifiche per la 08 — 08-simulatore-netto-in-busta-paga.md (mia, 392 righe, nel backlog) e 08-simulatore-netto-in-busta.md (675 righe, altra sessione, gia' con Previsto e Verificato). Nessuna delle due eliminata. Da sciogliere prima di implementare la 08. |
