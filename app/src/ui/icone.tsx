/**
 * Icone dell'interfaccia — agente ui-builder.
 *
 * Disegnate qui come SVG in linea: nessun file remoto, nessuna icon font,
 * niente da scaricare quando la pagina si apre da file:// con il Wi-Fi
 * spento. Sono oggetti di tutti i giorni (carrello, busta paga,
 * salvadanaio), mai simboli astratti: chi non ha dimestichezza con la
 * finanza non li leggerebbe.
 *
 * Sono decorative: `aria-hidden` e mai sole, sempre accanto al testo che
 * porta l'informazione. Nessuna variante di classe per area, così le tre
 * card restano identiche sul markup.
 */

import type { ReactElement } from 'react';

export type NomeIcona =
  | 'carrello'
  | 'bustaPaga'
  | 'salvadanaio'
  | 'casa'
  | 'frecciaIndietro';

function disegno(nome: NomeIcona): ReactElement {
  switch (nome) {
    case 'carrello':
      return (
        <>
          <path d="M2.5 4h2.6l2.4 10.4a2 2 0 0 0 2 1.5h7.2a2 2 0 0 0 1.9-1.4L20.8 8H6" />
          <circle cx="10" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
        </>
      );
    case 'bustaPaga':
      return (
        <>
          <path d="M7 10.2V4.2h10v6" />
          <path d="M9.6 6.8h4.8M9.6 9h3" />
          <rect x="2.8" y="9.6" width="18.4" height="10.6" rx="2" />
          <path d="M3.4 10.4 12 15.2l8.6-4.8" />
        </>
      );
    case 'salvadanaio':
      return (
        <>
          <ellipse cx="11" cy="13" rx="7.4" ry="5.6" />
          <ellipse cx="19" cy="13.4" rx="2.4" ry="2" />
          <path d="M10.6 8.8h3.6" />
          <path d="M7.6 8.2 6.4 4.9 10 6.7" />
          <path d="M7 18.2v2.4M15 18.2v2.4" />
          <circle cx="15" cy="11.6" r="0.85" fill="currentColor" stroke="none" />
        </>
      );
    case 'casa':
      return (
        <>
          <path d="M2.8 10.6 12 3.2l9.2 7.4" />
          <path d="M5.4 9.4V20.4h13.2V9.4" />
          <path d="M9.8 20.4v-5.6h4.4v5.6" />
        </>
      );
    case 'frecciaIndietro':
      return (
        <>
          <path d="M15 4.6 8 12l7 7.4" />
        </>
      );
  }
}

export function Icona({ nome }: { nome: NomeIcona }): ReactElement {
  return (
    <svg
      className="icona"
      viewBox="0 0 24 24"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {disegno(nome)}
    </svg>
  );
}
