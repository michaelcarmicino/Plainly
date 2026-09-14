/**
 * Formati numerici italiani: 1.234,56 · 5,90%
 * Implementato subito perché è l'unico punto in cui un errore silenzioso
 * è quasi certo, ed è condiviso fra UI, fixture e test.
 * Nessuna dipendenza da Intl con locale remoto: formattazione manuale,
 * così il risultato è identico su ogni macchina, anche offline.
 */

const separaMigliaia = (intero: string): string =>
  intero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** 123456 (centesimi) → "1.234,56 €" */
export function formattaEuro(importoCent: number, conSimbolo = true): string {
  const segno = importoCent < 0 ? '-' : '';
  const abs = Math.abs(Math.round(importoCent));
  const intero = separaMigliaia(String(Math.floor(abs / 100)));
  const decimali = String(abs % 100).padStart(2, '0');
  return `${segno}${intero},${decimali}${conSimbolo ? ' €' : ''}`;
}

/** 590 (punti base) → "5,90%" */
export function formattaPercentuale(bp: number, decimali = 2): string {
  const segno = bp < 0 ? '-' : '';
  const abs = Math.abs(bp);
  const fattore = 10 ** decimali;
  const valore = Math.round((abs / 100) * fattore) / fattore;
  const [i, d = ''] = valore.toFixed(decimali).split('.');
  return `${segno}${separaMigliaia(i)}${decimali > 0 ? `,${d}` : ''}%`;
}

/** "1.234,56" → 123456 (centesimi). Ritorna null se non interpretabile. */
export function parseNumeroIt(testo: string): number | null {
  const pulito = testo.trim().replace(/\s|€/g, '');
  if (!/^-?\d{1,3}(\.\d{3})*(,\d+)?$|^-?\d+(,\d+)?$/.test(pulito)) return null;
  const normalizzato = pulito.replace(/\./g, '').replace(',', '.');
  const n = Number(normalizzato);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
}
