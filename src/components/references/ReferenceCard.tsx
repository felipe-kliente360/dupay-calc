'use client';
import { T } from '@/lib/tokens';
import { PunkBeer, GrainEntry, HopEntry, EquipProfile } from '@/lib/types';
import { BeerGlass } from '@/components/ui/BeerGlass';
import { Pill } from '@/components/ui/Pill';
import { srmHex } from '@/lib/brewing-math';

function fuzzyMatchMalt(name: string): number {
  const n = name.toLowerCase();
  if (n.includes('extra pale') || n.includes('extra light')) return 1;
  if (n.includes('pale')) return 2;
  if (n.includes('crystal') && n.includes('15')) return 11;
  if (n.includes('crystal') && n.includes('40')) return 12;
  if (n.includes('crystal') && n.includes('60')) return 13;
  if (n.includes('crystal') && n.includes('120')) return 14;
  if (n.includes('chocolate')) return 20;
  if (n.includes('wheat')) return 6;
  if (n.includes('oat')) return 30;
  if (n.includes('munich')) return 4;
  if (n.includes('caramalt') || n.includes('carapils') || n.includes('cara')) return 10;
  if (n.includes('vienna')) return 3;
  if (n.includes('roast') || n.includes('black')) return 24;
  if (n.includes('amber')) return 16;
  return 1;
}

function fuzzyMatchHop(name: string): number {
  const n = name.toLowerCase();
  if (n.includes('cascade')) return 1;
  if (n.includes('centennial')) return 2;
  if (n.includes('chinook')) return 3;
  if (n.includes('citra')) return 4;
  if (n.includes('mosaic')) return 5;
  if (n.includes('simcoe')) return 6;
  if (n.includes('amarillo')) return 8;
  if (n.includes('magnum')) return 9;
  if (n.includes('saaz')) return 20;
  if (n.includes('hallertau')) return 21;
  if (n.includes('tettnang')) return 22;
  if (n.includes('fuggles')) return 31;
  if (n.includes('goldings') || n.includes('east kent')) return 30;
  if (n.includes('galaxy')) return 40;
  if (n.includes('nelson')) return 41;
  return 1;
}

export function mapPunkToCalculator(beer: PunkBeer, equip: EquipProfile): { grains: GrainEntry[]; hops: HopEntry[] } {
  const scaleFactor = equip.batchL / (beer.volume.value || 20);
  const ts = Date.now();
  const grains: GrainEntry[] = beer.ingredients.malt.map((m, i) => ({
    id: ts + i,
    maltId: fuzzyMatchMalt(m.name),
    kg: parseFloat((m.amount.value * scaleFactor).toFixed(2)),
  }));
  const hops: HopEntry[] = beer.ingredients.hops.map((h, i) => {
    const time = h.add === 'start' ? 60 : h.add === 'middle' ? 20 : h.add === 'end' ? 5 : 0;
    return { id: ts + 100 + i, hopId: fuzzyMatchHop(h.name), g: parseFloat((h.amount.value * scaleFactor).toFixed(0)), time, aa: 5.5 };
  });
  return { grains, hops };
}

interface ReferenceCardProps {
  beer: PunkBeer;
  equip: EquipProfile;
  onLoad: (grains: GrainEntry[], hops: HopEntry[]) => void;
}

export function ReferenceCard({ beer, equip, onLoad }: ReferenceCardProps) {
  const srm    = beer.srm || 0;
  const ogDisp = beer.target_og > 10 ? (beer.target_og / 1000).toFixed(3) : beer.target_og.toFixed(3);
  const fgDisp = beer.target_fg > 10 ? (beer.target_fg / 1000).toFixed(3) : beer.target_fg.toFixed(3);

  const handleLoad = () => {
    const { grains, hops } = mapPunkToCalculator(beer, equip);
    onLoad(grains, hops);
  };

  return (
    <div style={{ background: T.bgCard, borderRadius: 11, border: `1px solid ${T.b1}`, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.serif, color: T.ink, fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{beer.name}</div>
          <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, marginTop: 3 }}>{beer.tagline}</div>
        </div>
        <BeerGlass srm={srm} size={36} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 12 }}>
        {([['OG', ogDisp, T.amber], ['FG', fgDisp, T.inkMuted], ['ABV', `${beer.abv}%`, T.ok], ['IBU', beer.ibu ? String(Math.round(beer.ibu)) : '—', T.hop]] as [string,string,string][]).map(([l, v, c]) => (
          <div key={l} style={{ background: T.bgMuted, borderRadius: 6, padding: '6px 8px', textAlign: 'center', border: `1px solid ${T.b1}` }}>
            <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 8, letterSpacing: .8 }}>{l}</div>
            <div style={{ fontFamily: T.mono, color: c, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      {beer.ingredients.malt.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 }}>Maltes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {beer.ingredients.malt.map((m, i) => (
              <span key={i} style={{ fontFamily: T.mono, fontSize: 10, color: T.amber, background: T.bgAmber, border: `1px solid ${T.b1}`, borderRadius: 4, padding: '2px 6px' }}>
                {m.name} {m.amount.value}{m.amount.unit === 'kilograms' ? 'kg' : 'g'}
              </span>
            ))}
          </div>
        </div>
      )}

      {beer.ingredients.hops.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 8, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 }}>Lúpulos</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {beer.ingredients.hops.slice(0, 5).map((h, i) => (
              <span key={i} style={{ fontFamily: T.mono, fontSize: 10, color: T.hop, background: T.bgHop, border: `1px solid ${T.b1}`, borderRadius: 4, padding: '2px 6px' }}>
                {h.name} ({h.add})
              </span>
            ))}
            {beer.ingredients.hops.length > 5 && (
              <span style={{ fontFamily: T.mono, fontSize: 10, color: T.inkDim, padding: '2px 4px' }}>+{beer.ingredients.hops.length - 5}</span>
            )}
          </div>
        </div>
      )}

      {beer.brewers_tips && (
        <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, lineHeight: 1.5, marginBottom: 12, padding: '8px 10px', background: T.bgMuted, borderRadius: 6, border: `1px solid ${T.b1}` }}>
          💡 {beer.brewers_tips}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Pill color={T.inkMuted}>{beer.ingredients.yeast}</Pill>
        {srm > 0 && <span style={{ fontFamily: T.mono, fontSize: 9, color: srmHex(srm) }}>■ {srm} SRM</span>}
        <div style={{ flex: 1 }} />
        <button onClick={handleLoad} style={{ background: `linear-gradient(135deg,${T.amber},${T.amberD})`, border: 'none', color: 'white', padding: '8px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: T.mono, fontWeight: 500, fontSize: 11, letterSpacing: .3, boxShadow: `0 2px 6px ${T.amber}33` }}>
          ⚡ Carregar
        </button>
      </div>
    </div>
  );
}
