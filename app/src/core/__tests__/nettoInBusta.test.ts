import { describe, expect, it } from 'vitest';
import { calcolaNettoInBusta, scomponiLordoAnnuo } from '../nettoInBusta.ts';
import { FISCO_DICHIARATO } from '../fiscoDichiarato.ts';

const { scaglioniIrpef, contributi } = FISCO_DICHIARATO;

describe('calcolaNettoInBusta — caso A, quello della demo (2.000 € × 13 mensilita)', () => {
  // lordo annuo = 200.000 × 13                       = 2.600.000 cent
  // contributi  = round(2.600.000 × 919 / 10.000)     =   238.940 cent (tutto sotto soglia)
  // imponibile  = 2.600.000 - 238.940                 = 2.361.060 cent
  // IRPEF       = round(2.361.060 × 2300 / 10.000)
  //             = round(543.043,8)                    =   543.044 cent
  // netto annuo = 2.600.000 - 238.940 - 543.044        = 1.818.016 cent
  // netto mese  = round(1.818.016 / 13)
  //             = round(139.847,38..)                  =   139.847 cent
  // su 100 €    = round(1.818.016 × 10.000 / 2.600.000) = round(6.992,37) = 6.992 cent
  // quota contr = round(238.940 × 10.000 / 2.600.000)   = 919 bp
  // quota irpef = round(543.044 × 10.000 / 2.600.000)   = round(2.088,63) = 2.089 bp
  // quota netto = 10.000 - 919 - 2.089                  = 6.992 bp
  const risultato = calcolaNettoInBusta({ lordoMensileCent: 200_000, mensilita: 13 }, scaglioniIrpef, contributi);

  it('calcola il lordo annuo per moltiplicazione esatta', () => {
    expect(risultato.lordoAnnuoCent).toBe(2_600_000);
  });

  it('calcola i contributi con la sola aliquota base, sotto la soglia', () => {
    expect(risultato.contributiCent).toBe(238_940);
  });

  it("calcola l'IRPEF con l'arrotondamento vero (543.043,8 -> 543.044)", () => {
    expect(risultato.irpefCent).toBe(543_044);
  });

  it('calcola il netto mensile, il numero grande', () => {
    expect(risultato.nettoMensileCent).toBe(139_847);
  });

  it('il paragone su 100 € coincide con la quota netta della barra', () => {
    expect(risultato.nettoPerCentoEuroCent).toBe(6_992);
    expect(risultato.quotaNettoBp).toBe(6_992);
  });

  it('quadra: contributi + irpef + netto annuo = lordo annuo, esatto', () => {
    expect(risultato.contributiCent + risultato.irpefCent + risultato.nettoAnnuoCent).toBe(
      risultato.lordoAnnuoCent,
    );
  });
});

describe('calcolaNettoInBusta — caso B, attraversa soglia contributi e i tre scaglioni', () => {
  // lordo annuo = 500.000 × 12                        = 6.000.000 cent
  // quota base contributi = 5.219.000 × 919             = 4.796.261.000
  // quota eccedente        = (6.000.000-5.219.000)=781.000 × 1019 = 795.839.000
  // contributi  = round(5.592.100.000 / 10.000)          =   559.210 cent
  // imponibile  = 6.000.000 - 559.210                     = 5.440.790 cent
  // IRPEF 23 % : 2.800.000 × 2300                         = 6.440.000.000
  // IRPEF 33 % : 2.200.000 × 3300                         = 7.260.000.000
  // IRPEF 43 % :   440.790 × 4300                         = 1.895.397.000
  // IRPEF       = round(15.595.397.000 / 10.000)
  //             = round(1.559.539,7)                       = 1.559.540 cent
  // netto annuo = 6.000.000 - 559.210 - 1.559.540           = 3.881.250 cent
  // netto mese  = round(3.881.250 / 12) = round(323.437,5)  =   323.438 cent (mezzo cent su)
  const risultato = calcolaNettoInBusta({ lordoMensileCent: 500_000, mensilita: 12 }, scaglioniIrpef, contributi);

  it('applica la quota eccedente dei contributi oltre la soglia', () => {
    expect(risultato.contributiCent).toBe(559_210);
  });

  it('somma i tre scaglioni IRPEF prima di dividere una sola volta', () => {
    expect(risultato.irpefCent).toBe(1_559_540);
  });

  it("arrotonda il mezzo centesimo esatto verso l'alto", () => {
    expect(risultato.nettoMensileCent).toBe(323_438);
  });

  it('quadra anche qui, esatto', () => {
    expect(risultato.contributiCent + risultato.irpefCent + risultato.nettoAnnuoCent).toBe(
      risultato.lordoAnnuoCent,
    );
  });
});

describe('scomponiLordoAnnuo — le tre soglie fiscali al centesimo esatto', () => {
  // Non raggiungibili dai due campi digitati (docs/test/08, nota 1): qui si
  // passa lordoAnnuoCent direttamente alla funzione pura.

  it('la soglia dei contributi (52.190,00 €/anno), esatta', () => {
    // contributi = round(5.219.000 × 919 / 10.000) = round(479.626,1) = 479.626
    const r = scomponiLordoAnnuo(5_219_000, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(479_626);
    expect(r.imponibileCent).toBe(4_739_374);
  });

  it('il confine 28.000 € di imponibile fra primo e secondo scaglione, esatto', () => {
    // contributi = round(3.083.361 × 919 / 10.000) = round(283.360,8759) = 283.361
    const r = scomponiLordoAnnuo(3_083_361, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(283_361);
    expect(r.imponibileCent).toBe(2_800_000);
  });

  it('il confine 50.000 € di imponibile fra secondo e terzo scaglione, esatto', () => {
    // contributi = round((5.219.000×919 + 290.197×1019)/10.000) = round(509.197,1743) = 509.197
    const r = scomponiLordoAnnuo(5_509_197, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(509_197);
    expect(r.imponibileCent).toBe(5_000_000);
  });
});

describe('calcolaNettoInBusta — casi semplici', () => {
  it('un lordo che resta interamente nel primo scaglione, lontano da ogni soglia', () => {
    // lordo annuo = 150.000×12 = 1.800.000; contributi = round(1.800.000×919/10.000) = 165.420 (esatto)
    // imponibile = 1.634.580, tutta al 23 %: IRPEF = round(1.634.580×2300/10.000) = round(375.953,4) = 375.953
    const r = calcolaNettoInBusta({ lordoMensileCent: 150_000, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(165_420);
    expect(r.irpefCent).toBe(375_953);
    expect(r.nettoMensileCent).toBe(104_886);
  });

  it('un lordo sopra la soglia dei contributi ma sotto il terzo scaglione IRPEF', () => {
    // lordo annuo = 459.099×12 = 5.509.188, eccedente contributi = 290.188
    // contributi = round((4.796.261.000+290.188×1019)/10.000) = round(509.196,2572) = 509.196
    // imponibile = 4.999.992, sotto i 5.000.000: solo 1°+2° scaglione
    const r = calcolaNettoInBusta({ lordoMensileCent: 459_099, mensilita: 12 }, scaglioniIrpef, contributi);
    expect(r.contributiCent).toBe(509_196);
    expect(r.imponibileCent).toBe(4_999_992);
    expect(r.irpefCent).toBe(1_369_997);
  });
});
