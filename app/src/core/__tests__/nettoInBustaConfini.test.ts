import { describe, expect, it } from 'vitest';
import { calcolaNettoInBusta } from '../nettoInBusta.ts';
import { FISCO_DICHIARATO } from '../fiscoDichiarato.ts';

const { scaglioniIrpef, contributi } = FISCO_DICHIARATO;

describe('CL-01/CL-02 — la soglia dei contributi, un centesimo sotto e uno oltre', () => {
  it('CL-01: un centesimo sotto soglia resta tutto ad aliquota base', () => {
    // lordo annuo = 434.916×12 = 5.218.992, 8 cent sotto 5.219.000
    // contributi  = round(5.218.992×919/10.000) = round(479.625,3648) = 479.625
    const r = calcolaNettoInBusta({ lordoMensileCent: 434_916, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(479_625);
  });

  it('CL-02: la somma delle due tranche si arrotonda una sola volta, non pezzo per pezzo', () => {
    // lordo annuo = 434.917×12 = 5.219.004; quotaBase=5.219.000, quotaEccedente=4
    // contributi  = round((5.219.000×919 + 4×1019)/10.000) = round(479.626,5076) = 479.627
    // Se si arrotondasse pezzo per pezzo (sbagliato, solo per contrasto):
    // round(479.626,1) + round(0,4076) = 479.626 + 0 = 479.626 — un centesimo in meno.
    const r = calcolaNettoInBusta({ lordoMensileCent: 434_917, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(479_627);
    expect(r.contributiCent).not.toBe(479_626);
  });
});

describe('CL-03/CL-04 — il confine fra primo e secondo scaglione IRPEF, per 3 centesimi', () => {
  it('CL-03: un imponibile 8 cent sotto i 28.000 € resta interamente al 23 %', () => {
    // lordo annuo = 256.946×12 = 3.083.352; contributi = round(3.083.352×919/10.000) = round(283.360,0488) = 283.360
    // imponibile = 2.799.992, sotto i 2.800.000: solo primo scaglione
    const r = calcolaNettoInBusta({ lordoMensileCent: 256_946, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(283_360);
    expect(r.imponibileCent).toBe(2_799_992);
    expect(r.irpefCent).toBe(643_998);
  });

  it('CL-04: il secondo scaglione si attiva per soli 3 centesimi di imponibile', () => {
    // lordo annuo = 256.947×12 = 3.083.364; contributi = round(3.083.364×919/10.000) = round(283.361,1516) = 283.361
    // imponibile = 2.800.003, 3 cent sopra soglia
    // IRPEF = round((2.800.000×2300 + 3×3300)/10.000) = round(644.000,99) = 644.001
    const r = calcolaNettoInBusta({ lordoMensileCent: 256_947, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(283_361);
    expect(r.imponibileCent).toBe(2_800_003);
    expect(r.irpefCent).toBe(644_001);
  });
});

describe('CL-05/CL-06 — il confine fra secondo e terzo scaglione IRPEF, per 3 centesimi', () => {
  it('CL-05: un imponibile 8 cent sotto i 50.000 € non attiva ancora il terzo scaglione', () => {
    // lordo annuo = 459.099×12 = 5.509.188 (stesso caso semplice sopra)
    const r = calcolaNettoInBusta({ lordoMensileCent: 459_099, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.imponibileCent).toBe(4_999_992);
    expect(r.irpefCent).toBe(1_369_997);
  });

  it('CL-06: il terzo scaglione (43 %, senza tetto) si attiva per soli 3 centesimi', () => {
    // lordo annuo = 459.100×12 = 5.509.200; contributi = round((4.796.261.000+290.200×1019)/10.000) = round(509.197,48) = 509.197
    // imponibile = 5.000.003, 3 cent sopra soglia
    // IRPEF = round((2.800.000×2300 + 2.200.000×3300 + 3×4300)/10.000) = round(1.370.001,29) = 1.370.001
    const r = calcolaNettoInBusta({ lordoMensileCent: 459_100, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(509_197);
    expect(r.imponibileCent).toBe(5_000_003);
    expect(r.irpefCent).toBe(1_370_001);
  });
});

describe('CL-10 — il pareggio esatto a metà centesimo nel passo 4 (IRPEF), non nel passo 6', () => {
  it('applica la stessa convenzione di arrotondamento (mezzo centesimo su) anche qui', () => {
    // lordo annuo = 9.900.000×14 = 138.600.000
    // contributi  = round((4.796.261.000+133.381.000×1019)/10.000) = 14.071.150 (esatto)
    // imponibile  = 124.528.850
    // IRPEF numeratore = 6.440.000.000+7.260.000.000+119.528.850×4300 = 527.674.055.000
    //                  /10.000 = 52.767.405,5 -> 52.767.406 (mezzo centesimo verso l'alto)
    // netto annuo = 71.761.444; netto mensile = round(71.761.444/14) = 5.125.817
    const r = calcolaNettoInBusta({ lordoMensileCent: 9_900_000, mensilita: 14 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(14_071_150);
    expect(r.irpefCent).toBe(52_767_406);
    expect(r.nettoMensileCent).toBe(5_125_817);
    expect(r.contributiCent + r.irpefCent + r.nettoAnnuoCent).toBe(r.lordoAnnuoCent);
  });
});

describe('CL-09 — il tetto del campo, incluso e senza overflow', () => {
  it('accetta il valore esatto di LORDO_MENSILE_MAX_CENT senza perdere precisione', () => {
    // lordo annuo = 10.000.000×12 = 120.000.000
    // contributi  = round((4.796.261.000+114.781.000×1019)/10.000) = 12.175.810 (esatto)
    // imponibile  = 107.824.190
    // IRPEF = round(455.844.017.000/10.000) = round(45.584.401,7) = 45.584.402
    // netto mensile = round(62.239.788/12) = 5.186.649 (esatto)
    const r = calcolaNettoInBusta({ lordoMensileCent: 10_000_000, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(12_175_810);
    expect(r.irpefCent).toBe(45_584_402);
    expect(r.nettoMensileCent).toBe(5_186_649);
    expect(r.contributiCent + r.irpefCent + r.nettoAnnuoCent).toBe(r.lordoAnnuoCent);
  });
});
