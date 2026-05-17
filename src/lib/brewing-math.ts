import { GrainEntry, HopEntry, EquipProfile, WaterCalc, WaterSource, SaltAdditions, WaterTarget } from './types';
import { MALTS_DB } from '@/data/malts';

export const calcOG = (grains: GrainEntry[], volL: number, eff: number): number => {
  if (!volL || !grains.length) return 1.000;
  const pts = grains.reduce((s, g) => {
    const m = MALTS_DB.find(x => x.id === g.maltId);
    return m ? s + g.kg * m.gu : s;
  }, 0);
  return 1 + (pts * (eff / 100)) / volL / 1000;
};

export const calcUtilization = (time: number, boilOG: number): number =>
  1.65 * Math.pow(0.000125, boilOG - 1) * (1 - Math.exp(-0.04 * time)) / 4.15;

export const calcIBU = (hops: HopEntry[], volL: number, boilOG: number): number => {
  if (!volL) return 0;
  return hops.reduce((s, h) =>
    s + (h.g * h.aa * calcUtilization(h.time, boilOG) * 10) / volL, 0);
};

export const calcSRM = (grains: GrainEntry[], volL: number): number => {
  if (!volL) return 0;
  const mcu = grains.reduce((s, g) => {
    const m = MALTS_DB.find(x => x.id === g.maltId);
    if (!m) return s;
    const ebc = g.ebc ?? m.ebc;
    const lov = (ebc + 1.2) / 2.65;
    return s + g.kg * 2.2046 * lov;
  }, 0) / (volL * 0.2642);
  return mcu > 0 ? 1.4922 * Math.pow(mcu, 0.6859) : 0;
};

export const calcFG  = (og: number, atten: number): number => 1 + (og - 1) * (1 - atten / 100);
export const calcABV = (og: number, fg: number): number => (og - fg) * 131.25;
export const midOf   = (a: number, b: number): number => (a + b) / 2;
export const inRange = (v: number, a: number, b: number): boolean => v >= a && v <= b;

export const calcWater = (equip: EquipProfile, totalGrainKg: number): WaterCalc => {
  const boilOff     = equip.boiloffLh * (equip.boilMin / 60);
  const postBoil    = equip.batchL + equip.trubLoss;
  const preBoil     = postBoil + boilOff;
  const absorption  = totalGrainKg * equip.absorptionLkg;
  const totalWater  = preBoil + absorption + equip.deadSpace;
  const mashWater   = Math.max(0, totalGrainKg * 3 + equip.deadSpace);
  const spargeWater = Math.max(0, totalWater - mashWater);
  return { preBoil, totalWater, mashWater, spargeWater, absorption, deadSpace: equip.deadSpace, trubLoss: equip.trubLoss };
};

// mg of each ion contributed per gram of salt (dissolved in any volume, divide by mashL)
const SALT_MG: Record<keyof SaltAdditions, Partial<Record<keyof Omit<WaterSource,'ph'>, number>>> = {
  gypsum: { ca: 232.8, so4: 557.7 },             // CaSO4·2H2O
  cacl2:  { ca: 272.6, cl:  482.3 },              // CaCl2·2H2O
  epsom:  { mg: 98.6,  so4: 389.8 },              // MgSO4·7H2O
  nacl:   { na: 393.2, cl:  606.8 },              // NaCl
  nahco3: { na: 273.7, hco3: 726.3 },             // NaHCO3
};

export function calcAdjustedWater(
  source: WaterSource,
  salts: SaltAdditions,
  mashL: number,
): WaterSource {
  if (mashL <= 0) return { ...source };
  const r = { ...source };
  (Object.entries(salts) as [keyof SaltAdditions, number][]).forEach(([salt, g]) => {
    const contrib = SALT_MG[salt];
    (Object.entries(contrib) as [keyof Omit<WaterSource,'ph'>, number][]).forEach(([ion, mgPg]) => {
      (r[ion] as number) += (mgPg * g) / mashL;
    });
  });
  return r;
}

export function autoWaterSalts(
  source: WaterSource,
  target: WaterTarget,
  mashL: number,
): SaltAdditions {
  if (mashL <= 0) return { gypsum:0, cacl2:0, epsom:0, nacl:0, nahco3:0 };

  const mid = (t: [number,number]) => (t[0] + t[1]) / 2;
  const dSo4  = Math.max(0, mid(target.so4)  - source.so4);
  const dCl   = Math.max(0, mid(target.cl)   - source.cl);
  const dMg   = Math.max(0, mid(target.mg)   - source.mg);
  const dHco3 = Math.max(0, mid(target.hco3) - source.hco3);
  const dCa   = Math.max(0, mid(target.ca)   - source.ca);

  const gypsum = (dSo4 * mashL) / 557.7;
  const cacl2  = (dCl  * mashL) / 482.3;
  const epsom  = (dMg  * mashL) / 98.6;
  const nahco3 = (dHco3 * mashL) / 726.3;

  // Extra CaCl2 if Ca still short after gypsum + cacl2
  const caFromSalts = (gypsum * 232.8 + cacl2 * 272.6) / mashL;
  const extraCa     = Math.max(0, dCa - caFromSalts);
  const cacl2Total  = cacl2 + (extraCa * mashL) / 272.6;

  const r = (n: number) => parseFloat(Math.max(0, n).toFixed(1));
  return { gypsum: r(gypsum), cacl2: r(cacl2Total), epsom: r(epsom), nacl: 0, nahco3: r(nahco3) };
}

export const srmHex = (srm: number): string => {
  // Above SRM ~40 beer is visually black; background reflects this progression.
  const map: [number, string][] = [
    [1,'#FFE699'],[2,'#FFD878'],[3,'#FFCA5A'],[4,'#FFBF42'],[5,'#FBB123'],
    [6,'#F8A600'],[7,'#F39C00'],[8,'#EA8F00'],[9,'#E58500'],[10,'#DE7C00'],
    [11,'#D77200'],[12,'#CF6900'],[13,'#CB6100'],[14,'#C35900'],[15,'#BB5100'],
    [16,'#B54C00'],[17,'#B04500'],[18,'#A63E00'],[20,'#9B3200'],[24,'#8E2900'],
    [29,'#7C1D00'],[35,'#4A0C00'],[40,'#260500'],[45,'#120100'],[50,'#070000'],
  ];
  const v = Math.min(50, Math.max(1, Math.round(srm)));
  let closest = map[0];
  map.forEach(([k, h]) => { if (Math.abs(k - v) < Math.abs(closest[0] - v)) closest = [k, h]; });
  return closest[1];
};
