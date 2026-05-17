export interface BJCPStyle {
  id: string;
  name: string;
  cat: string;
  og: [number, number];
  fg: [number, number];
  ibu: [number, number];
  srm: [number, number];
  abv: [number, number];
  desc: string;
}

export interface Malt {
  id: number;
  name: string;
  type: 'base' | 'adjunct' | 'crystal' | 'roasted';
  gu: number;
  ebc: number;
  desc: string;
}

export interface Hop {
  id: number;
  name: string;
  origin: string;
  aa: [number, number];
  flavor: string;
  use: string;
}

export interface Yeast {
  id: number;
  brand: 'fermentis' | 'lallemand';
  code: string;
  name: string;
  type: string;
  atten: [number, number];
  floc: string;
  temp: [number, number];
  desc: string;
}

export interface GrainEntry {
  id: number;
  maltId: number;
  kg: number;
  ebc?: number;
}

export interface HopEntry {
  id: number;
  hopId: number;
  g: number;
  time: number;
  aa: number;
}

export interface EquipProfile {
  batchL: number;
  efficiency: number;
  boilMin: number;
  boiloffLh: number;
  deadSpace: number;
  trubLoss: number;
  absorptionLkg: number;
}

export interface WaterCalc {
  preBoil: number;
  totalWater: number;
  mashWater: number;
  spargeWater: number;
  absorption: number;
  deadSpace: number;
  trubLoss: number;
}

export interface PunkBeer {
  id: number;
  name: string;
  tagline: string;
  description: string;
  image_url: string | null;
  abv: number;
  ibu: number | null;
  target_fg: number;
  target_og: number;
  ebc: number | null;
  srm: number | null;
  attenuation_level: number;
  volume: { value: number; unit: string };
  boil_volume: { value: number; unit: string };
  method: {
    mash_temp: Array<{ temp: { value: number; unit: string }; duration: number }>;
    fermentation: { temp: { value: number; unit: string } };
  };
  ingredients: {
    malt: Array<{ name: string; amount: { value: number; unit: string } }>;
    hops: Array<{ name: string; amount: { value: number; unit: string }; add: string; attribute: string }>;
    yeast: string;
  };
  food_pairing: string[];
  brewers_tips: string;
}

export interface SavedRecipe {
  id: string;
  name: string;
  styleId: string;
  createdAt: number;
  updatedAt: number;
  grains: GrainEntry[];
  hops: HopEntry[];
  yeastId: number;
  customAtten: number | null;
  notes: string;
  equipSnapshot: EquipProfile;
}

export type TabId = 'calculator' | 'references' | 'styles' | 'insumos';

export type GlassType = 'pint' | 'pilsner' | 'weizen' | 'goblet' | 'tulip';

export interface WaterSource {
  ca: number; mg: number; na: number;
  hco3: number; so4: number; cl: number;
  ph: number;
}

export interface SaltAdditions {
  gypsum: number;  // g — CaSO4·2H2O
  cacl2:  number;  // g — CaCl2·2H2O
  epsom:  number;  // g — MgSO4·7H2O
  nacl:   number;  // g — NaCl
  nahco3: number;  // g — NaHCO3
}

export interface WaterTarget {
  name: string;
  ca:   [number, number];
  mg:   [number, number];
  na:   [number, number];
  hco3: [number, number];
  so4:  [number, number];
  cl:   [number, number];
}
