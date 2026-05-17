'use client';
import { BJCPStyle, GrainEntry, HopEntry, EquipProfile, WaterCalc, Yeast, WaterSource, SaltAdditions, WaterTarget } from '@/lib/types';
import { MALTS_DB } from '@/data/malts';
import { HOPS_DB } from '@/data/hops';
import { calcUtilization, calcAdjustedWater } from '@/lib/brewing-math';
import { DupayLogo } from '@/components/ui/DupayLogo';
import { BeerGlass } from '@/components/ui/BeerGlass';

interface PrintRecipeProps {
  style: BJCPStyle | undefined;
  og: number; fg: number; ibu: number; abv: number; srm: number; ebc: number;
  grains: GrainEntry[];
  hops: HopEntry[];
  yeast: Yeast | undefined;
  waterCalc: WaterCalc;
  equip: EquipProfile;
  totalKg: number;
  boilOG: number;
  recipeName: string;
  waterSource: WaterSource;
  salts: SaltAdditions;
  waterTarget: WaterTarget | undefined;
}

const C = {
  amber:    '#B87210',
  hop:      '#567828',
  water:    '#1A6A9A',
  ok:       '#3A7048',
  ng:       '#B03020',
  wheat:    '#D4A030',
  ink:      '#1C1408',
  inkMid:   '#4A3820',
  inkMuted: '#8A7050',
  inkDim:   '#B8A070',
  b1:       '#E4D9C2',
  b2:       '#D0C0A0',
  bg:       '#FAF8F3',
  bgWater:  'rgba(26,106,154,0.05)',
  bWater:   'rgba(26,106,154,0.18)',
};

// Estilos base compartilhados
const mono = "'DM Mono', monospace";
const serif = "'Playfair Display', Georgia, serif";
const lora  = "'Lora', Georgia, serif";

const CARD: React.CSSProperties = {
  background: C.bg, border: `1px solid ${C.b1}`, borderRadius: 6,
  padding: '7px 9px',
};

const SEC: React.CSSProperties = {
  fontFamily: mono, fontSize: 7, fontWeight: 600,
  letterSpacing: 2, textTransform: 'uppercase',
  color: C.amber, marginBottom: 6,
};

const ROW: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
  fontFamily: mono, fontSize: 8.5, marginBottom: 2.5,
};

const IONS: { key: keyof Omit<WaterSource,'ph'>; label: string }[] = [
  { key:'ca',   label:'Ca'   },
  { key:'mg',   label:'Mg'   },
  { key:'na',   label:'Na'   },
  { key:'hco3', label:'HCO₃' },
  { key:'so4',  label:'SO₄'  },
  { key:'cl',   label:'Cl'   },
];

const SALT_LABELS: [keyof SaltAdditions, string][] = [
  ['gypsum','Gypsum'],['cacl2','CaCl₂'],['epsom','Epsom'],['nacl','NaCl'],['nahco3','NaHCO₃'],
];

function ionOk(v: number, r: [number,number]): boolean { return v >= r[0] && v <= r[1]; }

export function PrintRecipe({
  style, og, fg, ibu, abv, srm, ebc,
  grains, hops, yeast, waterCalc, equip, totalKg, boilOG,
  recipeName, waterSource, salts, waterTarget,
}: PrintRecipeProps) {

  const grainRows = grains.map(g => {
    const m   = MALTS_DB.find(x => x.id === g.maltId);
    const pct = totalKg > 0 ? (g.kg / totalKg * 100) : 0;
    return { name: m?.name || '—', kg: g.kg, pct };
  });

  const hopRows = [...hops].sort((a,b) => b.time - a.time).map(h => {
    const hop    = HOPS_DB.find(x => x.id === h.hopId);
    const hopIBU = h.time > 0 ? (h.g * h.aa * calcUtilization(h.time, boilOG) * 10) / (equip.batchL || 20) : 0;
    return { name: hop?.name || '—', origin: hop?.origin || '', g: h.g, time: h.time, aa: h.aa, ibu: hopIBU, isDry: h.time === 0 };
  });

  const adj        = calcAdjustedWater(waterSource, salts, waterCalc.mashWater);
  const hasSalts   = Object.values(salts).some(v => v > 0);
  const activeSalts = SALT_LABELS.filter(([k]) => salts[k] > 0);

  const steps = [
    { n: 1, t: 'Água de mossagem', v: `${waterCalc.mashWater.toFixed(1)} L → aquecer a ~72 °C (strike)` },
    { n: 2, t: 'Mossagem',         v: `67 °C por 60 min · confirmar conversão (iodo)` },
    { n: 3, t: 'Vorlauf',          v: `Recircular 2–3 L antes de lauterar` },
    { n: 4, t: 'Lavagem',          v: `${waterCalc.spargeWater.toFixed(1)} L a 76 °C · pré-fervura ${waterCalc.preBoil.toFixed(1)} L` },
    { n: 5, t: 'Fervura',          v: `${equip.boilMin} min — adicionar lúpulos conforme tabela` },
    { n: 6, t: 'Resfriamento',     v: `< 25 °C antes do pitch · aeração vigorosa` },
    { n: 7, t: 'Levedura',         v: yeast ? `${yeast.code} · ${yeast.temp[0]}–${yeast.temp[1]} °C` : '—' },
    { n: 8, t: 'Fermentação',      v: `${yeast ? `${yeast.temp[0]}–${yeast.temp[1]} °C` : '18–24 °C'} · 7–14 dias` },
  ];

  return (
    <div id="print-recipe" style={{ display: 'none' }}>
      <div style={{
        width: '100%',
        fontFamily: lora,
        color: C.ink,
        fontSize: 9,
        lineHeight: 1.4,
      }}>

        {/* ══ HEADER ══════════════════════════════════════════════ */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 8, marginBottom: 8, borderBottom: `2px solid ${C.amber}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DupayLogo size={44} />
            <div>
              <div style={{ fontFamily: mono, fontSize: 7, color: C.amber, letterSpacing: 2, textTransform: 'uppercase' }}>
                Cervecería Dupay
              </div>
              <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 800, color: C.ink, lineHeight: 1.1, marginTop: 2 }}>
                {recipeName || 'Receita Personalizada'}
              </div>
              <div style={{ fontFamily: mono, fontSize: 8, color: C.inkMuted, marginTop: 2 }}>
                {style?.id} — {style?.name}
              </div>
              <div style={{ fontFamily: mono, fontSize: 7, color: C.inkDim, marginTop: 1 }}>
                {style?.cat}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <BeerGlass srm={srm} size={46} cat={style?.cat || ''} />
            <div style={{ fontFamily: mono, fontSize: 7, color: C.inkMuted, marginTop: 2 }}>
              {srm.toFixed(1)} SRM · {ebc.toFixed(1)} EBC
            </div>
          </div>
        </div>

        {/* ══ 5 CARDS DE MÉTRICAS ══════════════════════════════════ */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5,
          marginBottom: 7,
        }}>
          {[
            { l:'OG',  v: og.toFixed(3),      c: C.amber },
            { l:'FG',  v: fg.toFixed(3),      c: C.inkMid },
            { l:'ABV', v: `${abv.toFixed(1)}%`, c: C.amber },
            { l:'IBU', v: ibu.toFixed(0),     c: C.hop   },
            { l:'EBC', v: ebc.toFixed(1),     c: C.inkMid },
          ].map((m,i) => (
            <div key={i} style={{ ...CARD, textAlign: 'center', padding: '6px 4px' }}>
              <div style={{ fontFamily: mono, fontSize: 6.5, color: C.inkDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>{m.l}</div>
              <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: m.c, lineHeight: 1 }}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* ══ MALTES + LÚPULOS ════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 7 }}>

          {/* Maltes */}
          <div style={CARD}>
            <div style={{ ...SEC, color: C.amber }}>🌾 Maltes · {totalKg.toFixed(2)} kg</div>
            {grainRows.length === 0
              ? <div style={{ fontFamily: mono, fontSize: 8, color: C.inkDim, fontStyle: 'italic' }}>Nenhum malte</div>
              : grainRows.map((g,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: lora, fontSize: 9.5, fontWeight: 600 }}>{g.name}</div>
                    <div style={{ height: 2.5, background: C.b1, borderRadius: 2, marginTop: 2 }}>
                      <div style={{ width: `${Math.min(100,g.pct)}%`, height: '100%', background: C.amber, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: mono, fontSize: 9.5, fontWeight: 700 }}>{g.kg.toFixed(2)} kg</div>
                    <div style={{ fontFamily: mono, fontSize: 7.5, color: C.inkMuted }}>{g.pct.toFixed(0)}%</div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Lúpulos */}
          <div style={CARD}>
            <div style={{ ...SEC, color: C.hop }}>🌿 Lúpulos · {ibu.toFixed(0)} IBU</div>
            {hopRows.length === 0
              ? <div style={{ fontFamily: mono, fontSize: 8, color: C.inkDim, fontStyle: 'italic' }}>Sem lúpulos</div>
              : hopRows.map((h,i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 4,
                  paddingBottom: 4, borderBottom: i < hopRows.length-1 ? `1px solid ${C.b1}` : 'none',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: lora, fontSize: 9.5, fontWeight: 600 }}>
                      {h.name} <span style={{ fontFamily: mono, color: C.inkMuted, fontSize: 7.5, fontWeight: 400 }}>{h.origin}</span>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: 7.5, color: h.isDry ? C.hop : C.inkMuted, marginTop: 1 }}>
                      {h.isDry ? '🌱 Dry-hop' : `${h.time} min · ${h.ibu.toFixed(1)} IBU`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, fontFamily: mono }}>
                    <div style={{ fontSize: 9.5, fontWeight: 700 }}>{h.g} g</div>
                    <div style={{ fontSize: 7.5, color: C.inkMuted }}>AA {h.aa}%</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* ══ LEVEDURA · ÁGUA · VOLUMES ═══════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: hasSalts && waterTarget ? '1fr 1fr 1fr' : '1fr 1fr',
          gap: 5, marginBottom: 7,
        }}>

          {/* Levedura */}
          <div style={CARD}>
            <div style={{ ...SEC, color: C.amber }}>🧫 Levedura</div>
            {yeast ? (
              <>
                <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, marginBottom: 1 }}>{yeast.code}</div>
                <div style={{ fontFamily: lora, fontSize: 9, color: C.inkMid, marginBottom: 4 }}>{yeast.name}</div>
                <div style={ROW}><span style={{ color: C.inkMuted }}>Temperatura</span><b>{yeast.temp[0]}–{yeast.temp[1]} °C</b></div>
                <div style={ROW}><span style={{ color: C.inkMuted }}>Atenuação</span><b>{yeast.atten[0]}–{yeast.atten[1]}%</b></div>
                <div style={ROW}><span style={{ color: C.inkMuted }}>Floculação</span><b>{yeast.floc}</b></div>
                <div style={{ marginTop: 4, paddingTop: 4, borderTop: `1px solid ${C.b1}`, fontFamily: mono, fontSize: 8 }}>
                  FG <b style={{ color: C.amber }}>{fg.toFixed(3)}</b> · ABV <b style={{ color: C.amber }}>{abv.toFixed(1)}%</b>
                </div>
              </>
            ) : (
              <div style={{ fontFamily: mono, fontSize: 8, color: C.inkDim, fontStyle: 'italic' }}>Não definida</div>
            )}
          </div>

          {/* Ajuste de Água — só aparece se há sais */}
          {hasSalts && waterTarget && (
            <div style={{ ...CARD, background: C.bgWater, borderColor: C.bWater }}>
              <div style={{ ...SEC, color: C.water }}>💧 Água · Mossagem</div>
              {IONS.map(({ key, label }) => {
                const v = adj[key];
                const r = waterTarget[key];
                const ok = ionOk(v, r);
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 2 }}>
                    <span style={{ fontFamily: mono, fontSize: 7.5, color: C.inkDim, width: 24, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontFamily: mono, fontSize: 9, fontWeight: 700, color: ok ? C.ok : C.wheat, minWidth: 22 }}>{v.toFixed(0)}</span>
                    <span style={{ fontFamily: mono, fontSize: 7, color: C.inkDim, flex: 1 }}>[{r[0]}–{r[1]}]</span>
                    <span style={{ fontFamily: mono, fontSize: 8, color: ok ? C.ok : C.wheat }}>{ok ? '✓' : '~'}</span>
                  </div>
                );
              })}
              {activeSalts.length > 0 && (
                <div style={{ marginTop: 4, paddingTop: 4, borderTop: `1px solid ${C.bWater}`, fontFamily: mono, fontSize: 7, color: C.inkMuted, lineHeight: 1.6 }}>
                  {activeSalts.map(([k,l]) => `${l} ${salts[k]}g`).join(' · ')}
                </div>
              )}
              {adj.cl > 0 && (
                <div style={{ fontFamily: mono, fontSize: 7, color: C.water, marginTop: 2 }}>
                  SO₄/Cl {(adj.so4/adj.cl).toFixed(1)} → {adj.so4/adj.cl > 1.5 ? 'amargo' : adj.so4/adj.cl < 0.7 ? 'maltoso' : 'equilibrado'}
                </div>
              )}
            </div>
          )}

          {/* Volumes */}
          <div style={CARD}>
            <div style={{ ...SEC, color: C.water }}>💧 Volumes</div>
            {[
              ['Água mostura', `${waterCalc.mashWater.toFixed(1)} L`],
              ['Água lavagem', `${waterCalc.spargeWater.toFixed(1)} L`],
              ['Total água',   `${waterCalc.totalWater.toFixed(1)} L`],
              ['Pré-fervura',  `${waterCalc.preBoil.toFixed(1)} L`],
              ['Lote final',   `${equip.batchL.toFixed(1)} L`],
            ].map(([l,v]) => (
              <div key={l} style={ROW}><span style={{ color: C.inkMuted }}>{l}</span><b>{v}</b></div>
            ))}
          </div>
        </div>

        {/* ══ ROTEIRO DA BRASSAGEM ════════════════════════════════ */}
        <div style={{ ...CARD, marginBottom: 7 }}>
          <div style={{ ...SEC, color: C.amber }}>📋 Roteiro da Brassagem</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 20px' }}>
            {steps.map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 5, fontFamily: mono, fontSize: 8.5, color: C.inkMid, lineHeight: 1.4 }}>
                <span style={{ color: C.amber, fontWeight: 800, flexShrink: 0, width: 12 }}>{s.n}.</span>
                <span><b style={{ color: C.ink }}>{s.t}:</b> {s.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ NOTAS ══════════════════════════════════════════════ */}
        <div>
          <div style={{ fontFamily: mono, fontSize: 7, color: C.inkDim, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
            📝 Notas do Dia
          </div>
          {[...Array(5)].map((_,i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.b2}`, height: 17, marginBottom: 9 }} />
          ))}
        </div>

        {/* ══ FOOTER ═════════════════════════════════════════════ */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 6, borderTop: `1px solid ${C.b1}`, marginTop: 2,
        }}>
          <div style={{ fontFamily: mono, fontSize: 7, color: C.inkDim }}>
            Cervecería Dupay · dupay-calc.netlify.app
          </div>
          <div style={{ fontFamily: mono, fontSize: 7.5, color: C.inkMuted }}>
            DATA: ______ / ______ / __________
          </div>
        </div>

      </div>
    </div>
  );
}
