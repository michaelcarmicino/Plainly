/**
 * BOLLETTA DELLA LUCE — documento grezzo. Agente: ui-builder. Funzionalità 05.
 *
 * PLACEHOLDER da sostituire con l'import di
 * `fixtures/bolletta-luce-bimestrale.input.json` non appena l'architetto lo
 * scrive (docs/features/05-guida-interattiva-bolletta-luce-gas.md, sezione
 * «La fixture, per esteso»): quel file non esiste ancora in questo
 * repository. Fino ad allora il documento è trascritto qui, identico a
 * quello già usato da `src/core/__tests__/letturaBolletta.test.ts`, per
 * restare coerente con la verifica a mano della specifica — non è un dato
 * inventato da questo agente, è la stessa tabella riportata due volte.
 *
 * Nessun calcolo qui dentro: solo la dichiarazione dei valori stampati sulla
 * bolletta. I rapporti fra questi numeri (pesi, quote, costo per kWh,
 * quadratura) restano di `src/core/letturaBolletta.ts`.
 */

import type { DocumentoUtente } from '../../types/contracts.ts';

export const DOCUMENTO_BOLLETTA_LUCE: DocumentoUtente = {
  id: 'bolletta-luce-2026-lug-ago',
  scenario: 'bolletta',
  provenienza: 'fixture',
  periodoInizio: '2026-07-01',
  periodoFine: '2026-08-31',
  totaleDichiaratoCent: 7876,
  voci: [
    {
      id: 'voce-01',
      etichettaOriginale: 'Spesa per la materia energia',
      categoria: 'consumo',
      importoCent: 4000,
      quantita: 160,
      unitaMisura: 'kWh',
    },
    {
      id: 'voce-02',
      etichettaOriginale: 'Spesa per il trasporto e la gestione del contatore',
      categoria: 'canone',
      importoCent: 1800,
      ricorrente: true,
    },
    {
      id: 'voce-03',
      etichettaOriginale: 'Spesa per oneri di sistema',
      categoria: 'altro',
      importoCent: 1000,
    },
    {
      id: 'voce-04',
      etichettaOriginale: 'Accisa (imposta di consumo)',
      categoria: 'imposta',
      importoCent: 360,
    },
    {
      id: 'voce-05',
      etichettaOriginale: 'IVA 10%',
      categoria: 'imposta',
      importoCent: 716,
      aliquotaBp: 1000,
    },
  ],
};
