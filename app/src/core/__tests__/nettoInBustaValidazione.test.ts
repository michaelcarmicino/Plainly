import { describe, expect, it } from 'vitest';
import { simulaNettoInBusta } from '../nettoInBustaValidazione.ts';
import { FISCO_DICHIARATO } from '../fiscoDichiarato.ts';

const { scaglioniIrpef, contributi } = FISCO_DICHIARATO;

describe('simulaNettoInBusta — il lordo mensile', () => {
  it('rifiuta un lordo a zero', () => {
    const esito = simulaNettoInBusta({ lordoMensileCent: 0, mensilita: 13 }, scaglioniIrpef, contributi);
    expect(esito).toEqual({ ok: false, errore: 'lordo-a-zero' });
  });

  it('rifiuta un lordo negativo', () => {
    const esito = simulaNettoInBusta({ lordoMensileCent: -50_000, mensilita: 13 }, scaglioniIrpef, contributi);
    expect(esito).toEqual({ ok: false, errore: 'lordo-sotto-zero' });
  });

  it('rifiuta un lordo sopra il tetto del campo', () => {
    const esito = simulaNettoInBusta(
      { lordoMensileCent: 10_000_001, mensilita: 13 },
      scaglioniIrpef,
      contributi,
    );
    expect(esito).toEqual({ ok: false, errore: 'lordo-troppo-alto' });
  });

  it('accetta il tetto esatto del campo, incluso', () => {
    const esito = simulaNettoInBusta(
      { lordoMensileCent: 10_000_000, mensilita: 12 },
      scaglioniIrpef,
      contributi,
    );
    expect(esito.ok).toBe(true);
  });
});

describe('simulaNettoInBusta — le mensilita', () => {
  it('rifiuta mensilita non intere', () => {
    const esito = simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 12.5 }, scaglioniIrpef, contributi);
    expect(esito).toEqual({ ok: false, errore: 'mensilita-non-intere' });
  });

  it("rifiuta mensilita sotto l'intervallo ammesso", () => {
    const esito = simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 11 }, scaglioniIrpef, contributi);
    expect(esito).toEqual({ ok: false, errore: 'mensilita-fuori-intervallo' });
  });

  it("rifiuta mensilita sopra l'intervallo ammesso", () => {
    const esito = simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 15 }, scaglioniIrpef, contributi);
    expect(esito).toEqual({ ok: false, errore: 'mensilita-fuori-intervallo' });
  });

  it('rifiuta mensilita a zero prima di qualunque divisione (nessun Infinity/NaN)', () => {
    const esito = simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 0 }, scaglioniIrpef, contributi);
    expect(esito).toEqual({ ok: false, errore: 'mensilita-fuori-intervallo' });
  });

  it('accetta i due estremi validi, 12 e 14', () => {
    expect(simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 12 }, scaglioniIrpef, contributi).ok).toBe(
      true,
    );
    expect(simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 14 }, scaglioniIrpef, contributi).ok).toBe(
      true,
    );
  });
});

describe('simulaNettoInBusta — il fisco dichiarato male (dato, non input della persona)', () => {
  it('rifiuta scaglioni con soglie non crescenti (il secondo parte più in basso del primo)', () => {
    const scaglioniRotti = [
      { limiteInferioreCent: 2_800_000, limiteSuperioreCent: 5_000_000, aliquotaBp: 3300 },
      { limiteInferioreCent: 0, limiteSuperioreCent: 2_800_000, aliquotaBp: 2300 },
    ];
    const esito = simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 13 }, scaglioniRotti, contributi);
    expect(esito).toEqual({ ok: false, errore: 'scaglioni-non-validi' });
  });

  it('rifiuta un elenco di scaglioni vuoto', () => {
    const esito = simulaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 13 }, [], contributi);
    expect(esito).toEqual({ ok: false, errore: 'scaglioni-non-validi' });
  });

  it("rifiuta un'aliquota contributiva base negativa", () => {
    const contributiRotti = { ...contributi, aliquotaBaseBp: -1 };
    const esito = simulaNettoInBusta(
      { lordoMensileCent: 200_000, mensilita: 13 },
      scaglioniIrpef,
      contributiRotti,
    );
    expect(esito).toEqual({ ok: false, errore: 'aliquote-contributive-non-valide' });
  });

  it('rifiuta una soglia di eccedenza negativa', () => {
    const contributiRotti = { ...contributi, sogliaEccedenzaCent: -1 };
    const esito = simulaNettoInBusta(
      { lordoMensileCent: 200_000, mensilita: 13 },
      scaglioniIrpef,
      contributiRotti,
    );
    expect(esito).toEqual({ ok: false, errore: 'aliquote-contributive-non-valide' });
  });
});
