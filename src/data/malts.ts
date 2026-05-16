import { Malt } from '@/lib/types';

export const MALTS_DB: Malt[] = [
  { id:1,  name:"Pilsen",          type:"base",    gu:300, ebc:3,    desc:"Base neutra. Ideal para lagers e estilos claros." },
  { id:2,  name:"Pale Ale",        type:"base",    gu:295, ebc:6,    desc:"Notas de biscoito suave. Para ales britânicas e americanas." },
  { id:3,  name:"Vienna",          type:"base",    gu:280, ebc:8,    desc:"Biscoito suave e mel. Base do Märzen e Vienna Lager." },
  { id:4,  name:"Munich I",        type:"base",    gu:270, ebc:14,   desc:"Corpo e maltosidade. Notas de biscoito e pão aromático." },
  { id:5,  name:"Munich II",       type:"base",    gu:265, ebc:20,   desc:"Munich mais escuro. Biscoito intenso, mel e caramel." },
  { id:6,  name:"Trigo (Malte)",   type:"base",    gu:290, ebc:4,    desc:"Para Weizen e Witbier. Turbidez, corpo e espuma." },
  { id:10, name:"Carapils",        type:"crystal", gu:260, ebc:3,    desc:"Melhora espuma e corpo sem cor ou doçura. Dextrinoso." },
  { id:11, name:"Caramel 10",      type:"crystal", gu:262, ebc:20,   desc:"Crystal levíssimo. Doçura suave e ligeiro caramel." },
  { id:12, name:"Caramel 40",      type:"crystal", gu:255, ebc:80,   desc:"Caramel médio. Pale Ales e Ambers." },
  { id:13, name:"Caramel 60",      type:"crystal", gu:250, ebc:120,  desc:"Caramel pronunciado e doçura rica. Ambers e Reds." },
  { id:14, name:"Caramel 120",     type:"crystal", gu:240, ebc:240,  desc:"Caramel intenso, passa e uva seca." },
  { id:15, name:"Special B",       type:"crystal", gu:225, ebc:300,  desc:"Belga: ameixa, passa, caramel e notas de vinho do Porto." },
  { id:16, name:"Melanoidin",      type:"crystal", gu:270, ebc:50,   desc:"Simula maltes altamente modificados. Corpo e cor âmbar." },
  { id:20, name:"Chocolate",       type:"roasted", gu:200, ebc:900,  desc:"Chocolate e café. Porters e Stouts americanos." },
  { id:21, name:"Pale Chocolate",  type:"roasted", gu:210, ebc:600,  desc:"Cacau suave, menos amargor, mais elegante." },
  { id:22, name:"Carafa II",       type:"roasted", gu:200, ebc:1100, desc:"Descaroçado: chocolate sem adstringência. Dunkel e Schwarzbier." },
  { id:23, name:"Carafa III",      type:"roasted", gu:195, ebc:1400, desc:"Máximo escuro sem adstringência. Black Lagers elegantes." },
  { id:24, name:"Cevada Torrada",  type:"roasted", gu:180, ebc:1400, desc:"Café seco e torrado. Essencial no Irish Stout." },
  { id:25, name:"Black Patent",    type:"roasted", gu:175, ebc:1400, desc:"Cor máxima preta e amargor intenso. Porters e Imperial Stouts." },
  { id:30, name:"Aveia (Flocos)",  type:"adjunct", gu:255, ebc:3,    desc:"Suavidade e cremosidade. Oatmeal Stout e NEIPA." },
  { id:31, name:"Trigo (Flocos)",  type:"adjunct", gu:260, ebc:3,    desc:"Espuma, corpo e turbidez sem sabor cereal." },
  { id:32, name:"Milho (Flocos)",  type:"adjunct", gu:260, ebc:2,    desc:"Leve e seco. American Lagers — álcool sem corpo extra." },
  { id:33, name:"Cevada (Flocos)", type:"adjunct", gu:250, ebc:3,    desc:"Não malteada. Espuma e corpo. Fundamental no Irish Stout." },
];

export const MALT_TYPE: Record<Malt['type'], { label: string; color: string; bg: string }> = {
  base:    { label:"Base",            color:"#B87210", bg:"#FEF7E8" },
  adjunct: { label:"Adjunto/Flocos",  color:"#567828", bg:"#F2F7EE" },
  crystal: { label:"Crystal/Caramel", color:"#D4A030", bg:"#FEF9EC" },
  roasted: { label:"Torrado",         color:"#A05A28", bg:"#FDF3EA" },
};
