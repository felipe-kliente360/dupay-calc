'use client';
import { BJCPStyle, GrainEntry, HopEntry, EquipProfile, WaterCalc, Yeast } from '@/lib/types';
import { MALTS_DB } from '@/data/malts';
import { HOPS_DB } from '@/data/hops';
import { calcUtilization, srmHex } from '@/lib/brewing-math';
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
}

const C = {
  amber:    '#B87210',
  hop:      '#567828',
  ink:      '#1C1408',
  inkMid:   '#4A3820',
  inkMuted: '#8A7050',
  inkDim:   '#B8A070',
  b1:       '#E4D9C2',
  b2:       '#D0C0A0',
  bg:       '#FAF8F3',
};

const LABEL: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 7,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  color: C.inkMuted,
  marginBottom: 1,
};

const SECTION_TITLE: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 7.5,
  fontWeight: 600,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: C.amber,
  borderBottom: `1px solid ${C.b1}`,
  paddingBottom: 5,
  marginBottom: 8,
};

export function PrintRecipe({
  style, og, fg, ibu, abv, srm, ebc,
  grains, hops, yeast, waterCalc, equip, totalKg, boilOG,
}: PrintRecipeProps) {

  const grainRows = grains.map(g => {
    const malt = MALTS_DB.find(x => x.id === g.maltId);
    const pct  = totalKg > 0 ? (g.kg / totalKg * 100) : 0;
    return { name: malt?.name || '—', kg: g.kg, pct };
  });

  const hopRows = [...hops]
    .sort((a, b) => b.time - a.time)
    .map(h => {
      const hop    = HOPS_DB.find(x => x.id === h.hopId);
      const hopIBU = h.time > 0 ? (h.g * h.aa * calcUtilization(h.time, boilOG) * 10) / (equip.batchL || 20) : 0;
      return { name: hop?.name || '—', origin: hop?.origin || '', g: h.g, time: h.time, aa: h.aa, ibu: hopIBU, isDry: h.time === 0 };
    });

  const steps = [
    `Aquecer ${waterCalc.mashWater.toFixed(1)} L até ~${72}°C (strike → 67°C na mossagem)`,
    `Mossar 60 min a 67°C · checar conversão (teste de iodo)`,
    `Vorlauf: recircular 2–3 L · lauterar devagar`,
    `Lavagem: ${waterCalc.spargeWater.toFixed(1)} L a 76°C (pré-fervura ${waterCalc.preBoil.toFixed(1)} L)`,
    `Fervura: ${equip.boilMin} min conforme tabela de lúpulos acima`,
    `Resfriamento até <25°C · aeração vigorosa antes do pitch`,
    `Pitch: ${yeast ? `${yeast.code} (${yeast.name})` : 'levedura selecionada'}`,
    `Fermentação: ${yeast ? `${yeast.temp[0]}–${yeast.temp[1]}°C` : '18–24°C'} por 7–14 dias`,
    `Guardar amostra para medir FG final e calcular ABV real`,
  ];

  return (
    <div id="print-recipe" style={{ display: 'none' }}>
      <div style={{
        width: '186mm',
        margin: '0 auto',
        color: C.ink,
        fontFamily: "'Lora', Georgia, serif",
      }}>

        {/* ─── HEADER ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingBottom: 12, marginBottom: 12,
          borderBottom: `2.5px solid ${C.amber}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <DupayLogo size={52} />
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.amber, letterSpacing: 2, textTransform: 'uppercase' }}>
                Cervecería Dupay
              </div>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 24, fontWeight: 800, color: C.ink, lineHeight: 1.1, marginTop: 3,
              }}>
                {style?.name || 'Receita Personalizada'}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.inkMuted, marginTop: 4 }}>
                {style?.id} &nbsp;·&nbsp; {style?.cat}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <BeerGlass srm={srm} size={56} cat={style?.cat || ''} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: C.inkMuted, marginTop: 3 }}>
              {srm.toFixed(1)} SRM · {ebc.toFixed(1)} EBC
            </div>
          </div>
        </div>

        {/* ─── MÉTRICAS ─────────────────────────────────────────────── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          background: C.bg, border: `1px solid ${C.b1}`,
          borderRadius: 8, overflow: 'hidden', marginBottom: 12,
        }}>
          {[
            { l: 'OG',  v: og.toFixed(3) },
            { l: 'FG',  v: fg.toFixed(3) },
            { l: 'ABV', v: `${abv.toFixed(1)}%` },
            { l: 'IBU', v: ibu.toFixed(0) },
            { l: 'EBC', v: ebc.toFixed(1) },
          ].map((m, i) => (
            <div key={m.l} style={{
              textAlign: 'center', padding: '9px 4px',
              borderLeft: i > 0 ? `1px solid ${C.b1}` : 'none',
            }}>
              <div style={LABEL}>{m.l}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 800, color: C.amber }}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* ─── MALTES + LÚPULOS ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

          {/* Maltes */}
          <div>
            <div style={SECTION_TITLE}>🌾 Maltes · {totalKg.toFixed(2)} kg</div>
            {grainRows.length === 0 && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.inkDim, fontStyle: 'italic' }}>Nenhum malte</div>
            )}
            {grainRows.map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 11, fontWeight: 600 }}>{g.name}</div>
                  <div style={{ height: 3, background: C.b1, borderRadius: 2, marginTop: 3 }}>
                    <div style={{ width: `${Math.min(100, g.pct)}%`, height: '100%', background: C.amber, borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700 }}>{g.kg.toFixed(2)} kg</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: C.inkMuted }}>{g.pct.toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Lúpulos */}
          <div>
            <div style={SECTION_TITLE}>🌿 Lúpulos · {ibu.toFixed(0)} IBU</div>
            {hopRows.length === 0 && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.inkDim, fontStyle: 'italic' }}>Sem lúpulos</div>
            )}
            {hopRows.map((h, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 5,
                paddingBottom: 5, borderBottom: i < hopRows.length - 1 ? `1px solid ${C.b1}` : 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 11, fontWeight: 600 }}>
                    {h.name} <span style={{ fontFamily: "'DM Mono', monospace", color: C.inkMuted, fontWeight: 400, fontSize: 8.5 }}>{h.origin}</span>
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: h.isDry ? C.hop : C.inkMuted, marginTop: 1 }}>
                    {h.isDry ? '🌱 Dry-hop' : `${h.time} min · ${h.ibu.toFixed(1)} IBU`}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{h.g} g</div>
                  <div style={{ fontSize: 8.5, color: C.inkMuted }}>AA {h.aa}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FERMENTAÇÃO + VOLUMES ────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

          {/* Fermentação */}
          <div style={{ background: C.bg, border: `1px solid ${C.b1}`, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ ...SECTION_TITLE, borderBottom: 'none', paddingBottom: 4, marginBottom: 6 }}>🧫 Fermentação</div>
            {yeast ? (
              <>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                  {yeast.code}
                </div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 11, color: C.inkMid, marginBottom: 5 }}>{yeast.name}</div>
                {[
                  ['Temperatura', `${yeast.temp[0]}–${yeast.temp[1]}°C`],
                  ['Atenuação',   `${yeast.atten[0]}–${yeast.atten[1]}%`],
                  ['Floculação',  yeast.floc],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace", fontSize: 9.5, marginBottom: 2 }}>
                    <span style={{ color: C.inkMuted }}>{l}</span>
                    <b style={{ color: C.ink }}>{v}</b>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.inkDim, fontStyle: 'italic' }}>Não definida</div>
            )}
            <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${C.b1}`, fontFamily: "'DM Mono', monospace", fontSize: 9.5 }}>
              FG est. <b style={{ color: C.amber }}>{fg.toFixed(3)}</b>
              &nbsp;·&nbsp; ABV est. <b style={{ color: C.amber }}>{abv.toFixed(1)}%</b>
            </div>
          </div>

          {/* Volumes */}
          <div style={{ background: C.bg, border: `1px solid ${C.b1}`, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ ...SECTION_TITLE, borderBottom: 'none', paddingBottom: 4, marginBottom: 6 }}>💧 Volumes do Dia</div>
            {[
              ['Água de mossagem',  `${waterCalc.mashWater.toFixed(1)} L`],
              ['Água de lavagem',   `${waterCalc.spargeWater.toFixed(1)} L`],
              ['Total de água',     `${waterCalc.totalWater.toFixed(1)} L`],
              ['Pré-fervura',       `${waterCalc.preBoil.toFixed(1)} L`],
              ['Volume final (lote)',`${equip.batchL.toFixed(1)} L`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace", fontSize: 9.5, marginBottom: 3 }}>
                <span style={{ color: C.inkMuted }}>{l}</span>
                <b style={{ color: C.ink }}>{v}</b>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ETAPAS ───────────────────────────────────────────────── */}
        <div style={{ background: C.bg, border: `1px solid ${C.b1}`, borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
          <div style={{ ...SECTION_TITLE, borderBottom: 'none', paddingBottom: 4, marginBottom: 6 }}>📋 Roteiro do Dia</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 20px' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 5, fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.inkMid, lineHeight: 1.45 }}>
                <span style={{ color: C.amber, fontWeight: 800, flexShrink: 0, minWidth: 14 }}>{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ANOTAÇÕES ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 10 }}>
          <div style={SECTION_TITLE}>📝 Anotações do Dia</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${C.b2}`, marginBottom: 13, height: 18 }} />
            ))}
          </div>
        </div>

        {/* ─── RODAPÉ ───────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 8, borderTop: `1px solid ${C.b1}`,
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: C.inkDim }}>
            Cervecería Dupay · dupay-calc.netlify.app
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: C.inkMuted, letterSpacing: 0.5 }}>
            DATA DA BRASSAGEM: _______ / _______ / ____________
          </div>
        </div>

      </div>
    </div>
  );
}
