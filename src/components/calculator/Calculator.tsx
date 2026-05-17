'use client';
import { T, card } from '@/lib/tokens';
import { useApp } from '@/lib/context';
import { BJCP_STYLES } from '@/data/bjcp-styles';
import { YEASTS_DB } from '@/data/yeasts';
import { calcOG, calcIBU, calcSRM, calcFG, calcABV, calcWater } from '@/lib/brewing-math';
import { useMemo } from 'react';
import { useWidth } from '@/hooks/useWidth';
import { Pill } from '@/components/ui/Pill';
import { ResultsPanel } from './ResultsPanel';
import { GrainBill } from './GrainBill';
import { HopSchedule } from './HopSchedule';
import { YeastPicker } from './YeastPicker';
import { WaterPanel } from './WaterPanel';
import { WaterChem } from './WaterChem';
import { HitTarget } from './HitTarget';
import { RecipePicker } from './RecipePicker';
import { ScaledRecipe } from '@/data/recipes';
import { PrintRecipe } from '@/components/layout/PrintRecipe';
import { styleToTarget } from '@/data/water-profiles';

interface CalculatorProps {
  onOpenEquip: () => void;
}

export function Calculator({ onOpenEquip }: CalculatorProps) {
  const vw = useWidth();
  const mobile = vw < 900;
  const { styleId, setStyleId, grains, setGrains, hops, setHops, yeastId, setYeastId, customAtten, setCustomAtten, equip, waterSource, setWaterSource, salts, setSalts, recipeName, setRecipeName, nameError } = useApp();

  const style    = BJCP_STYLES.find(s => s.id === styleId);
  const yeast    = YEASTS_DB.find(y => y.id === yeastId);
  const totalKg  = grains.reduce((s, g) => s + g.kg, 0);
  const boilOff  = equip.boiloffLh * (equip.boilMin / 60);
  const postBoil = equip.batchL + equip.trubLoss;
  const preBoil  = postBoil + boilOff;
  const boilOG   = useMemo(() => calcOG(grains, preBoil, equip.efficiency), [grains, preBoil, equip.efficiency]);
  const og       = useMemo(() => calcOG(grains, equip.batchL, equip.efficiency), [grains, equip]);
  const ibu      = useMemo(() => calcIBU(hops, equip.batchL, boilOG), [hops, equip.batchL, boilOG]);
  const srm      = useMemo(() => calcSRM(grains, equip.batchL), [grains, equip.batchL]);
  const ebc      = srm * 1.97;
  const avgAtten = customAtten !== null ? customAtten : (yeast ? (yeast.atten[0] + yeast.atten[1]) / 2 : 75);
  const fg       = calcFG(og, avgAtten);
  const abv      = calcABV(og, fg);
  const waterCalc = calcWater(equip, totalKg);

  const sel = {
    background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 8,
    color: T.ink, padding: '10px 12px', fontSize: 13, fontFamily: T.body,
    width: '100%', outline: 'none', cursor: 'pointer',
  };

  const applyRecipe = (scaled: ScaledRecipe) => {
    setGrains(scaled.grains);
    setHops(scaled.hops);
    const y = YEASTS_DB.find(x => x.code === scaled.yeastCode);
    if (y) { setYeastId(y.id); setCustomAtten(null); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nameInput = (
    <div style={{ ...card }}>
      <div style={{
        fontFamily: T.mono, fontSize: 8, color: nameError ? T.ng : T.inkMuted,
        letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
        transition: 'color .2s',
      }}>
        {nameError ? '⚠ Informe o nome antes de exportar' : 'Nome da Receita'}
      </div>
      <input
        id="recipe-name-input"
        type="text"
        value={recipeName}
        onChange={e => setRecipeName(e.target.value)}
        placeholder="Minha IPA Cítrica..."
        className={nameError ? 'shake' : ''}
        style={{
          fontFamily: T.serif,
          fontSize: mobile ? 22 : 28,
          fontWeight: 700,
          color: T.ink,
          background: 'transparent',
          border: 'none',
          borderBottom: `2.5px solid ${nameError ? T.ng : T.b2}`,
          outline: 'none',
          width: '100%',
          padding: '4px 0 6px',
          letterSpacing: -0.5,
          transition: 'border-color .2s',
          caretColor: T.amber,
        }}
        onFocus={e => { e.currentTarget.style.borderBottomColor = T.amber; }}
        onBlur={e => { e.currentTarget.style.borderBottomColor = nameError ? T.ng : T.b2; }}
      />
    </div>
  );

  const leftPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Estilo alvo */}
      <div style={{ ...card }}>
        <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 12 }}>🍺 Estilo Alvo</div>
        <select value={styleId} onChange={e => setStyleId(e.target.value)} style={sel}>
          {BJCP_STYLES.map(s => <option key={s.id} value={s.id}>{s.id} – {s.name}</option>)}
        </select>
        {style && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>{style.cat}</div>
            <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>{style.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Pill color={T.amber}>OG {style.og[0]}–{style.og[1]}</Pill>
              <Pill color={T.inkMuted}>FG {style.fg[0]}–{style.fg[1]}</Pill>
              <Pill color={T.ok}>IBU {style.ibu[0]}–{style.ibu[1]}</Pill>
              <Pill color={T.special}>SRM {style.srm[0]}–{style.srm[1]}</Pill>
              <Pill color={T.wheat}>ABV {style.abv[0]}–{style.abv[1]}%</Pill>
            </div>
            <RecipePicker styleId={styleId} equip={equip} onApply={applyRecipe} />
          </div>
        )}
      </div>

      <ResultsPanel style={style} og={og} fg={fg} ibu={ibu} abv={abv} srm={srm} ebc={ebc} cat={style?.cat || ''} />

      {/* Equipamento */}
      <div style={{ ...card, background: 'rgba(254,247,232,0.85)', borderColor: `${T.amber}44` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: T.mono, color: T.amber, fontSize: 9, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase' }}>⚙ Equipamento</span>
          <button onClick={onOpenEquip} style={{
            background: 'none', border: `1px solid ${T.amber}55`, color: T.amber,
            borderRadius: 7, padding: '4px 10px', cursor: 'pointer',
            fontFamily: T.mono, fontSize: 10, letterSpacing: .3,
          }}>Editar</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[`${equip.batchL}L final`, `ef. ${equip.efficiency}%`, `fervura ${equip.boilMin}min`, `evap. ${equip.boiloffLh}L/h`, `morto ${equip.deadSpace}L`, `trub ${equip.trubLoss}L`].map((v, i) => (
            <div key={i} style={{ fontFamily: T.mono, color: T.inkMid, fontSize: 11 }}>{v}</div>
          ))}
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.b1}`, fontFamily: T.mono, color: T.inkMid, fontSize: 11 }}>
          Água total: <b style={{ color: T.amber }}>{waterCalc.totalWater.toFixed(1)} L</b>
          <span style={{ margin: '0 8px', color: T.inkDim }}>·</span>
          Pré-fervura: <b style={{ color: T.amber }}>{preBoil.toFixed(1)} L</b>
        </div>
      </div>
    </div>
  );

  const rightPanel = (
    <div>
      <GrainBill grains={grains} setGrains={setGrains} totalKg={totalKg} />
      <HopSchedule hops={hops} setHops={setHops} ibu={ibu} boilOG={boilOG} batchL={equip.batchL} />
      <YeastPicker yeastId={yeastId} setYeastId={setYeastId} customAtten={customAtten} setCustomAtten={setCustomAtten} avgAtten={avgAtten} og={og} />
      <WaterChem
        source={waterSource} setSource={setWaterSource}
        salts={salts} setSalts={setSalts}
        mashL={waterCalc.mashWater}
        styleId={styleId} styleCat={style?.cat || ''}
      />
      {mobile && <WaterPanel waterCalc={waterCalc} totalGrainKg={totalKg} />}
      <HitTarget style={style} og={og} ibu={ibu} avgAtten={avgAtten} grains={grains} setGrains={setGrains} hops={hops} setHops={setHops} />
    </div>
  );

  if (mobile) {
    return (
      <div>
        {nameInput}
        <div style={{ ...card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 700, color: T.ink }}>🍺 Estilo Alvo</div>
            <button onClick={onOpenEquip} style={{
              background: 'none', border: `1px solid ${T.b2}`, color: T.inkMuted,
              borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontFamily: T.mono, fontSize: 10,
            }}>⚙ Equip.</button>
          </div>
          <select value={styleId} onChange={e => setStyleId(e.target.value)} style={sel}>
            {BJCP_STYLES.map(s => <option key={s.id} value={s.id}>{s.id} – {s.name}</option>)}
          </select>
          {style && (
            <>
              <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>{style.desc}</div>
              <RecipePicker styleId={styleId} equip={equip} onApply={applyRecipe} />
            </>
          )}
        </div>
        <ResultsPanel style={style} og={og} fg={fg} ibu={ibu} abv={abv} srm={srm} ebc={ebc} cat={style?.cat || ''} />
        {rightPanel}
        <PrintRecipe style={style} og={og} fg={fg} ibu={ibu} abv={abv} srm={srm} ebc={ebc}
          grains={grains} hops={hops} yeast={yeast} waterCalc={waterCalc} equip={equip}
          totalKg={totalKg} boilOG={boilOG} recipeName={recipeName}
          waterSource={waterSource} salts={salts}
          waterTarget={styleToTarget(styleId, style?.cat || '')} />
      </div>
    );
  }

  return (
    <>
      {nameInput}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 28, alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 88 }}>{leftPanel}</div>
        <div>{rightPanel}<WaterPanel waterCalc={waterCalc} totalGrainKg={totalKg} /></div>
      </div>
      <PrintRecipe style={style} og={og} fg={fg} ibu={ibu} abv={abv} srm={srm} ebc={ebc}
        grains={grains} hops={hops} yeast={yeast} waterCalc={waterCalc} equip={equip}
        totalKg={totalKg} boilOG={boilOG} recipeName={recipeName}
        waterSource={waterSource} salts={salts}
        waterTarget={styleToTarget(styleId, style?.cat || '')} />
    </>
  );
}
