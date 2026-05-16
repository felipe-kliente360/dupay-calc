import { GrainEntry, HopEntry, EquipProfile, WaterCalc } from './types';
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

export const srmHex = (srm: number): string => {
  const map: [number, string][] = [
    [1,'#FFE699'],[2,'#FFD878'],[3,'#FFCA5A'],[4,'#FFBF42'],[5,'#FBB123'],
    [6,'#F8A600'],[7,'#F39C00'],[8,'#EA8F00'],[9,'#E58500'],[10,'#DE7C00'],
    [11,'#D77200'],[12,'#CF6900'],[13,'#CB6100'],[14,'#C35900'],[15,'#BB5100'],
    [16,'#B54C00'],[17,'#B04500'],[18,'#A63E00'],[20,'#9B3200'],[24,'#8E2900'],
    [29,'#7C1D00'],[35,'#6B1100'],[40,'#4E0900'],
  ];
  const v = Math.min(40, Math.max(1, Math.round(srm)));
  let closest = map[0];
  map.forEach(([k, h]) => { if (Math.abs(k - v) < Math.abs(closest[0] - v)) closest = [k, h]; });
  return closest[1];
};
