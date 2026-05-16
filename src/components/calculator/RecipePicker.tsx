'use client';
import { T } from '@/lib/tokens';
import { EquipProfile } from '@/lib/types';
import { RECIPES_DB, ScaledRecipe, scaleRecipe } from '@/data/recipes';
import { MALTS_DB, MALT_TYPE } from '@/data/malts';
import { HOPS_DB } from '@/data/hops';
import { Pill } from '@/components/ui/Pill';
import { useState } from 'react';

interface RecipePickerProps {
  styleId: string;
  equip: EquipProfile;
  onApply: (scaled: ScaledRecipe) => void;
}

export function RecipePicker({ styleId, equip, onApply }: RecipePickerProps) {
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const recipes = RECIPES_DB.filter(r => r.styleId === styleId);
  if (!recipes.length) return null;

  const maltPreview = (r: typeof recipes[0]) => {
    const tot = r.grains.reduce((s, g) => s + g.kg, 0);
    return r.grains.slice(0, 3).map(g => {
      const m = MALTS_DB.find(x => x.id === g.maltId);
      return m ? `${m.name} ${tot > 0 ? Math.round(g.kg / tot * 100) : 0}%` : '';
    }).filter(Boolean).join(' · ');
  };

  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => { setOpen(o => !o); setExpanded(null); }} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: open ? T.bgAmber : 'transparent',
        border: `1px solid ${open ? T.amber : T.b2}`,
        borderRadius: 7, padding: '7px 12px', cursor: 'pointer',
        fontFamily: T.mono, fontSize: 11, fontWeight: 500,
        color: open ? T.amber : T.inkMuted, transition: 'all .2s',
        width: '100%', justifyContent: 'space-between',
      }}>
        <span>📋 Receitas Base</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ background: T.amber, color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{recipes.length}</span>
          <span style={{ fontSize: 10, color: T.inkDim }}>{open ? '▲' : '▼'}</span>
        </span>
      </button>

      {open && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recipes.map(r => {
            const isExp    = expanded === r.id;
            const scaled   = scaleRecipe(r, equip);
            const scaledKg = scaled.grains.reduce((s, g) => s + g.kg, 0);
            return (
              <div key={r.id} style={{ background: isExp ? T.bgAmber : T.bgMuted, borderRadius: 9, border: `1.5px solid ${isExp ? T.amber : T.b1}`, overflow: 'hidden', transition: 'all .2s' }}>
                <div onClick={() => setExpanded(isExp ? null : r.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.serif, fontWeight: 700, color: T.ink, fontSize: 13 }}>{r.name}</div>
                    <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{maltPreview(r)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim, textAlign: 'right' }}>
                      <div>{scaledKg.toFixed(1)} kg</div>
                      <div style={{ color: T.amber }}>{r.yeastCode}</div>
                    </div>
                    <span style={{ color: T.inkDim, fontSize: 10 }}>{isExp ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isExp && (
                  <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${T.b1}` }}>
                    <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', margin: '12px 0 6px' }}>
                      Maltes → escalonados para {equip.batchL}L / {equip.efficiency}%
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                      {scaled.grains.map((g, i) => {
                        const m  = MALTS_DB.find(x => x.id === g.maltId);
                        const tm = m ? MALT_TYPE[m.type] : null;
                        const pct = scaledKg > 0 ? Math.round(g.kg / scaledKg * 100) : 0;
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: tm?.bg || T.bgRow, borderRadius: 6, border: `1px solid ${T.b1}` }}>
                            <div style={{ width: 3, height: 18, borderRadius: 1.5, background: tm?.color || T.b2, flexShrink: 0 }} />
                            <span style={{ fontFamily: T.body, fontSize: 12, color: T.ink, flex: 1 }}>{m?.name}</span>
                            <span style={{ fontFamily: T.mono, fontSize: 11, color: tm?.color || T.amber, fontWeight: 600 }}>{g.kg.toFixed(2)} kg</span>
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim, width: 26, textAlign: 'right' }}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
                      Lúpulos → escalonados para {equip.batchL}L
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                      {scaled.hops.map((h, i) => {
                        const hp = HOPS_DB.find(x => x.id === h.hopId);
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: T.bgHop, borderRadius: 6, border: `1px solid ${T.b1}` }}>
                            <div style={{ width: 3, height: 18, borderRadius: 1.5, background: T.hop, flexShrink: 0 }} />
                            <span style={{ fontFamily: T.body, fontSize: 12, color: T.ink, flex: 1 }}>{hp?.name}</span>
                            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.hop, fontWeight: 600 }}>{h.g}g</span>
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim }}>{h.time > 0 ? h.time + ' min' : 'aroma'}</span>
                            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim }}>{h.aa}%AA</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: r.notes ? 8 : 12 }}>
                      <span style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>Levedura:</span>
                      <Pill color={T.amber}>{r.yeastCode}</Pill>
                    </div>
                    {r.notes && (
                      <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 12, lineHeight: 1.6, padding: '8px 10px', background: T.bgCard, borderRadius: 7, border: `1px solid ${T.b1}`, marginBottom: 12 }}>
                        💡 {r.notes}
                      </div>
                    )}
                    <button onClick={() => { onApply(scaled); setOpen(false); setExpanded(null); }} style={{
                      width: '100%', padding: '11px', borderRadius: 8,
                      background: `linear-gradient(135deg,${T.amber},${T.amberD})`,
                      border: 'none', color: 'white', cursor: 'pointer',
                      fontFamily: T.serif, fontWeight: 700, fontSize: 14, letterSpacing: .3,
                      boxShadow: `0 2px 8px ${T.amber}44`,
                    }}>
                      ⚡ Aplicar — escalonado para {equip.batchL}L / {equip.efficiency}%
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
