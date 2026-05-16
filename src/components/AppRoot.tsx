'use client';
import { T } from '@/lib/tokens';
import { AppProvider, useApp } from '@/lib/context';
import { calcWater, calcSRM, srmHex } from '@/lib/brewing-math';
import { useWidth } from '@/hooks/useWidth';
import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { EquipModal } from '@/components/layout/EquipModal';
import { Calculator } from '@/components/calculator/Calculator';
import { StyleGuide } from '@/components/styles/StyleGuide';
import { Insumos } from '@/components/insumos/Insumos';
import { References } from '@/components/references/References';

function AppInner() {
  const vw = useWidth();
  const mobile = vw < 640;
  const { activeTab, equip, setEquip, grains } = useApp();
  const [equipOpen, setEquipOpen] = useState(false);

  const waterCalcPreview = calcWater(equip, 3);

  const srm = useMemo(() => calcSRM(grains, equip.batchL), [grains, equip.batchL]);
  const dynBg = srm > 0.5 ? srmHex(srm) : T.bg;

  return (
    <div style={{ minHeight: '100vh', background: dynBg, fontFamily: T.body, color: T.ink, paddingBottom: mobile ? 68 : 40, transition: 'background 0.6s ease' }}>
      {equipOpen && (
        <EquipModal
          equip={equip}
          onChange={setEquip}
          onClose={() => setEquipOpen(false)}
          waterCalc={waterCalcPreview}
        />
      )}
      <Header mobile={mobile} onOpenEquip={() => setEquipOpen(true)} />
      <main style={{ padding: mobile ? '16px 14px' : '32px 40px', maxWidth: 1320, margin: '0 auto' }}>
        {activeTab === 'calculator'  && <Calculator onOpenEquip={() => setEquipOpen(true)} />}
        {activeTab === 'references'  && <References />}
        {activeTab === 'styles'      && <StyleGuide />}
        {activeTab === 'insumos'     && <Insumos />}
      </main>
      {mobile && <BottomNav onOpenEquip={() => setEquipOpen(true)} />}
    </div>
  );
}

export function AppRoot() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
