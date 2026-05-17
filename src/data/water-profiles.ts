import { WaterSource, WaterTarget } from '@/lib/types';

export const SOURCE_PRESETS: { label: string; short: string; w: WaterSource }[] = [
  { label: 'Destilada / RO', short: 'RO',
    w: { ca:0,  mg:0,   na:0,  hco3:0,  so4:0,  cl:0,  ph:7.0 } },
  { label: 'São Lourenço',   short: 'S.Lou',
    w: { ca:4,  mg:1.5, na:2,  hco3:18, so4:4,  cl:3,  ph:7.2 } },
  { label: 'Lindoya',        short: 'Lind',
    w: { ca:6,  mg:2,   na:3,  hco3:21, so4:3,  cl:4,  ph:7.1 } },
  { label: 'Minalba',        short: 'Minal',
    w: { ca:26, mg:5,   na:8,  hco3:85, so4:12, cl:10, ph:7.5 } },
  { label: 'Petra',          short: 'Petra',
    w: { ca:36, mg:10,  na:12, hco3:140,so4:20, cl:18, ph:7.8 } },
];

export const STYLE_TARGETS: WaterTarget[] = [
  { name: 'Pilsen (muito suave)',
    ca:[5,50],   mg:[0,10], na:[0,10],  hco3:[0,25],   so4:[0,20],   cl:[0,15] },
  { name: 'Munique (lager maltosa)',
    ca:[25,60],  mg:[5,10], na:[5,20],  hco3:[70,140],  so4:[10,30],  cl:[15,30] },
  { name: 'Londres (ales britânicas)',
    ca:[70,130], mg:[5,15], na:[10,30], hco3:[20,60],   so4:[70,150], cl:[50,100] },
  { name: 'Burton (IPA/bitter)',
    ca:[100,160],mg:[5,15], na:[10,30], hco3:[0,40],    so4:[200,350],cl:[50,100] },
  { name: 'NEIPA (Cl-forward)',
    ca:[60,100], mg:[5,15], na:[10,20], hco3:[20,60],   so4:[30,80],  cl:[100,200] },
  { name: 'Dublin (stout/porter)',
    ca:[80,130], mg:[5,15], na:[10,30], hco3:[180,300], so4:[40,80],  cl:[40,80] },
  { name: 'Trigo / Belga',
    ca:[30,60],  mg:[5,15], na:[5,20],  hco3:[50,120],  so4:[15,50],  cl:[30,70] },
  { name: 'Americana balanceada',
    ca:[60,100], mg:[5,15], na:[5,20],  hco3:[20,80],   so4:[50,120], cl:[50,100] },
];

export function styleToTarget(styleId: string, cat: string): WaterTarget {
  const c = cat.toLowerCase();
  const id = styleId.toUpperCase();

  if (c.includes('czech') || c.includes('bohem') || id.startsWith('03'))
    return STYLE_TARGETS[0]; // Pilsen
  if (c.includes('pilsner') || c.includes('pilsen') || id.startsWith('05'))
    return STYLE_TARGETS[0]; // Pilsen
  if (c.includes('helles') || c.includes('märzen') || c.includes('dunkel') || c.includes('lager'))
    return STYLE_TARGETS[1]; // Munique
  if (id === '21C' || c.includes('hazy') || c.includes('neipa'))
    return STYLE_TARGETS[4]; // NEIPA
  if (c.includes('ipa') || id.startsWith('21') || id.startsWith('22'))
    return STYLE_TARGETS[3]; // Burton
  if (c.includes('stout') || c.includes('porter'))
    return STYLE_TARGETS[5]; // Dublin
  if (c.includes('trigo') || c.includes('weizen') || c.includes('wit') || c.includes('belg'))
    return STYLE_TARGETS[6]; // Trigo/Belga
  if (c.includes('pale ale') || c.includes('bitter') || c.includes('esg'))
    return STYLE_TARGETS[2]; // Londres
  return STYLE_TARGETS[7]; // Americana (default)
}
