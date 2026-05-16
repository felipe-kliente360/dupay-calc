import { GrainEntry, HopEntry, EquipProfile } from '@/lib/types';

export interface RecipeBase {
  id: string;
  styleId: string;
  name: string;
  refBatchL: number;
  refEfficiency: number;
  grains: Omit<GrainEntry, 'id'>[];
  hops: Omit<HopEntry, 'id'>[];
  yeastCode: string;
  notes: string;
}

export interface ScaledRecipe {
  grains: GrainEntry[];
  hops: HopEntry[];
  yeastCode: string;
  notes: string;
}

export function scaleRecipe(recipe: RecipeBase, equip: EquipProfile): ScaledRecipe {
  const grainFactor = (equip.batchL * recipe.refEfficiency) / (recipe.refBatchL * equip.efficiency);
  const hopFactor   = equip.batchL / recipe.refBatchL;
  const ts          = Date.now();
  return {
    grains: recipe.grains.map((g, i) => ({
      ...g, id: ts + i,
      kg: Math.round(g.kg * grainFactor * 100) / 100,
    })),
    hops: recipe.hops.map((h, i) => ({
      ...h, id: ts + 1000 + i,
      g: Math.max(1, Math.round(h.g * hopFactor)),
    })),
    yeastCode: recipe.yeastCode,
    notes: recipe.notes,
  };
}

export const RECIPES_DB: RecipeBase[] = [
  // ── ALES AMERICANAS ────────────────────────────────────────────────────────
  { id:"apa-cascade", styleId:"18B", name:"APA Cascata Clássica",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:4.2}, {maltId:12,kg:0.3} ],
    hops:[  {hopId:1,g:25,time:60,aa:5.75}, {hopId:1,g:20,time:15,aa:5.75}, {hopId:1,g:25,time:0,aa:5.75} ],
    yeastCode:"US-05",
    notes:"Mostura a 67°C por 60 min. Fermentar a 18–20°C. Perfil limpo e cítrico." },

  { id:"apa-amarillo", styleId:"18B", name:"APA Floral Amarillo",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:4.0}, {maltId:11,kg:0.3}, {maltId:10,kg:0.2} ],
    hops:[ {hopId:9,g:15,time:60,aa:13.0}, {hopId:8,g:25,time:15,aa:9.5}, {hopId:8,g:30,time:0,aa:9.5} ],
    yeastCode:"US-05",
    notes:"Leve amargor com aroma floral e de tangerina. Mostura a 67°C." },

  { id:"wc-ipa", styleId:"21A", name:"West Coast IPA",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:5.0}, {maltId:11,kg:0.3}, {maltId:10,kg:0.2} ],
    hops:[ {hopId:7,g:20,time:60,aa:15.0}, {hopId:2,g:25,time:15,aa:10.5}, {hopId:1,g:40,time:0,aa:5.75} ],
    yeastCode:"US-05",
    notes:"Mostura a 65°C por 60 min para corpo mais seco. Fermentar a 18–20°C. Dry-hop 3 dias." },

  { id:"hazy-ipa", styleId:"21C", name:"Hazy New England IPA",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:4.5}, {maltId:31,kg:1.2}, {maltId:30,kg:0.8} ],
    hops:[ {hopId:9,g:15,time:60,aa:13.0}, {hopId:4,g:30,time:10,aa:12.5}, {hopId:5,g:40,time:0,aa:12.0}, {hopId:4,g:40,time:0,aa:12.5} ],
    yeastCode:"New England",
    notes:"Mostura a 68°C para corpo cheio. Dry-hop com Citra+Mosaic. Envasar turvo." },

  { id:"dipa-wc", styleId:"22A", name:"West Coast Double IPA",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:6.5}, {maltId:10,kg:0.3} ],
    hops:[ {hopId:7,g:30,time:60,aa:15.0}, {hopId:2,g:30,time:15,aa:10.5}, {hopId:4,g:40,time:5,aa:12.5}, {hopId:5,g:50,time:0,aa:12.0} ],
    yeastCode:"US-05",
    notes:"Mostura a 65°C para atenuação máxima. Dry-hop generoso. Aguardar carbo completo." },

  { id:"amber-ale", styleId:"19A", name:"American Amber Ale",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:3.8}, {maltId:13,kg:0.5}, {maltId:12,kg:0.3}, {maltId:4,kg:0.3} ],
    hops:[ {hopId:2,g:20,time:60,aa:10.5}, {hopId:1,g:20,time:10,aa:5.75} ],
    yeastCode:"US-05",
    notes:"Mostura a 68°C para corpo médio. Equilíbrio malte/lúpulo característico." },

  { id:"blonde-ale", styleId:"18A", name:"American Blonde Ale",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:3.8}, {maltId:11,kg:0.2} ],
    hops:[ {hopId:1,g:15,time:60,aa:5.75}, {hopId:1,g:15,time:10,aa:5.75} ],
    yeastCode:"US-05",
    notes:"Simples e refrescante. Mostura a 67°C. Fermentar frio (16°C) para limpar." },

  // ── ALES ROBUSTAS ───────────────────────────────────────────────────────────
  { id:"irish-stout", styleId:"15B", name:"Irish Dry Stout",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:3.2}, {maltId:24,kg:0.5}, {maltId:33,kg:0.4} ],
    hops:[ {hopId:30,g:30,time:60,aa:5.0}, {hopId:31,g:15,time:20,aa:4.5} ],
    yeastCode:"S-04",
    notes:"Cevada torrada dá o amargor seco. Cevada flocos = espuma cremosa. Servir com nitro." },

  { id:"oatmeal-stout", styleId:"16B", name:"Oatmeal Stout",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:4.0}, {maltId:30,kg:0.6}, {maltId:20,kg:0.4}, {maltId:13,kg:0.3} ],
    hops:[ {hopId:30,g:35,time:60,aa:5.0} ],
    yeastCode:"S-04",
    notes:"Aveia adiciona suavidade e cremosidade. Mostura a 69°C. Notas de café e chocolate." },

  { id:"american-porter", styleId:"20A", name:"American Porter Robusta",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:4.2}, {maltId:20,kg:0.5}, {maltId:13,kg:0.3}, {maltId:4,kg:0.4} ],
    hops:[ {hopId:7,g:20,time:60,aa:15.0}, {hopId:1,g:20,time:10,aa:5.75} ],
    yeastCode:"US-05",
    notes:"Chocolate e café com toque cítrico de Cascade. Mostura a 67°C." },

  { id:"american-stout", styleId:"20B", name:"American Stout",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:4.5}, {maltId:20,kg:0.5}, {maltId:25,kg:0.2}, {maltId:13,kg:0.3} ],
    hops:[ {hopId:7,g:25,time:60,aa:15.0}, {hopId:2,g:20,time:10,aa:10.5} ],
    yeastCode:"US-05",
    notes:"Torrado intenso com amargor firme. Mostura a 66°C para final seco." },

  { id:"imperial-stout", styleId:"20C", name:"Russian Imperial Stout",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:7.0}, {maltId:20,kg:0.7}, {maltId:23,kg:0.3}, {maltId:14,kg:0.5}, {maltId:15,kg:0.3} ],
    hops:[ {hopId:7,g:40,time:90,aa:15.0}, {hopId:7,g:20,time:30,aa:15.0} ],
    yeastCode:"Nottingham",
    notes:"Fervura de 90 min. Mostura 66°C. Maturar por 4+ semanas. Alta tolerância alcoólica." },

  // ── ALES BRITÂNICAS ─────────────────────────────────────────────────────────
  { id:"irish-red", styleId:"15A", name:"Irish Red Ale",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:2,kg:3.4}, {maltId:12,kg:0.3}, {maltId:14,kg:0.1}, {maltId:24,kg:0.05} ],
    hops:[ {hopId:30,g:25,time:60,aa:5.0}, {hopId:31,g:15,time:15,aa:4.5} ],
    yeastCode:"S-04",
    notes:"Cevada torrada em mínima quantidade só para cor rubra. Mostura a 68°C." },

  // ── CERVEJAS DE TRIGO ───────────────────────────────────────────────────────
  { id:"hefeweizen", styleId:"10A", name:"Hefeweizen Bávaro",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:6,kg:3.0}, {maltId:1,kg:2.0} ],
    hops:[ {hopId:21,g:15,time:60,aa:4.5} ],
    yeastCode:"WB-06",
    notes:"60% trigo, 40% pilsen. Mostura escalonada (p/ ferulic rest a 43°C) = mais cravo. Fermentar a 18°C." },

  { id:"weizenbock", styleId:"10C", name:"Weizenbock",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:6,kg:5.0}, {maltId:4,kg:1.5}, {maltId:12,kg:0.3} ],
    hops:[ {hopId:21,g:25,time:90,aa:4.5} ],
    yeastCode:"WB-06",
    notes:"Fervura de 90 min. Mostura a 67°C. Fermentar a 18°C. Maturar 2–4 semanas a frio." },

  // ── ALES BELGAS ─────────────────────────────────────────────────────────────
  { id:"witbier", styleId:"24A", name:"Witbier Belga",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:1,kg:2.5}, {maltId:31,kg:1.8}, {maltId:30,kg:0.4} ],
    hops:[ {hopId:20,g:20,time:60,aa:3.5}, {hopId:20,g:15,time:10,aa:3.5} ],
    yeastCode:"T-58",
    notes:"Adicionar na flameout: 20g coentro moído + 15g casca de laranja amarga. Fermentar a 20°C." },

  { id:"saison", styleId:"25B", name:"Saison Farmhouse",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:1,kg:4.5}, {maltId:6,kg:0.5} ],
    hops:[ {hopId:20,g:25,time:60,aa:3.5}, {hopId:23,g:15,time:30,aa:8.25} ],
    yeastCode:"BE-134",
    notes:"Mostura a 65°C para Saison seca. Deixar temp subir até 30°C na fermentação — mais ésteres." },

  { id:"tripel", styleId:"26C", name:"Belgian Tripel",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:1,kg:7.5} ],
    hops:[ {hopId:20,g:30,time:90,aa:3.5}, {hopId:20,g:20,time:15,aa:3.5}, {hopId:21,g:15,time:0,aa:4.5} ],
    yeastCode:"BE-256",
    notes:"Adicionar 500g dextrose no início da fervura. Mostura a 65°C. Fermentar 20°C → deixar subir para 24°C." },

  { id:"dark-strong", styleId:"26D", name:"Belgian Dark Strong (Quad)",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:1,kg:5.0}, {maltId:4,kg:0.7}, {maltId:15,kg:0.5}, {maltId:14,kg:0.4} ],
    hops:[ {hopId:20,g:30,time:90,aa:3.5}, {hopId:30,g:15,time:20,aa:5.0} ],
    yeastCode:"BE-256",
    notes:"Adicionar 500g candi sugar escuro. Mostura a 66°C. Maturar 4–8 semanas." },

  // ── LAGERS ─────────────────────────────────────────────────────────────────
  { id:"munich-helles", styleId:"04A", name:"Munich Helles",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:1,kg:4.2}, {maltId:4,kg:0.2} ],
    hops:[ {hopId:21,g:20,time:60,aa:4.5}, {hopId:21,g:15,time:15,aa:4.5} ],
    yeastCode:"W-34/70",
    notes:"Mostura escalonada 63–72°C. Fervura 90 min. Lager a 0–2°C por 4+ semanas." },

  { id:"german-pils", styleId:"05D", name:"German Pilsner",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:1,kg:4.5} ],
    hops:[ {hopId:9,g:20,time:60,aa:13.0}, {hopId:20,g:20,time:15,aa:3.5}, {hopId:20,g:20,time:5,aa:3.5} ],
    yeastCode:"W-34/70",
    notes:"100% Pilsen. Fervura 90 min. Lager a 0°C por 3–4 semanas. Final seco e lupulado." },

  { id:"czech-pils", styleId:"03B", name:"Bohemian Pilsner (Czech)",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:1,kg:5.0} ],
    hops:[ {hopId:20,g:40,time:90,aa:3.5}, {hopId:20,g:20,time:30,aa:3.5}, {hopId:20,g:20,time:0,aa:3.5} ],
    yeastCode:"W-34/70",
    notes:"Saaz em 3 adições para amargor suave e aroma intenso. Lager 4+ semanas. Servir com espuma densa." },

  { id:"marzen", styleId:"06A", name:"Märzen / Oktoberfest",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:3,kg:3.5}, {maltId:4,kg:1.8}, {maltId:1,kg:0.5} ],
    hops:[ {hopId:21,g:25,time:60,aa:4.5}, {hopId:22,g:15,time:15,aa:4.5} ],
    yeastCode:"S-23",
    notes:"Vienna + Munich I = base. Mostura a 67°C. Lager a 0°C por 6–8 semanas. Körper redondo." },

  { id:"munich-dunkel", styleId:"08A", name:"Munich Dunkel",
    refBatchL:20, refEfficiency:75,
    grains:[ {maltId:5,kg:3.5}, {maltId:4,kg:1.2}, {maltId:22,kg:0.2}, {maltId:13,kg:0.2} ],
    hops:[ {hopId:21,g:25,time:60,aa:4.5}, {hopId:21,g:10,time:20,aa:4.5} ],
    yeastCode:"W-34/70",
    notes:"Munich II faz a base escura sem torrado. Carafa II descaroçado = sem adstringência. Lager 4 semanas." },
];
