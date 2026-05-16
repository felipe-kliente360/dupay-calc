'use client';
import { T } from '@/lib/tokens';
import { AppProvider, useApp, DEFAULT_EQUIP } from '@/lib/context';
import { calcWater } from '@/lib/brewing-math';
import { useWidth } from '@/hooks/useWidth';
import { useState } from 'react';
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
  const { activeTab, equip, setEquip } = useApp();
  const [equipOpen, setEquipOpen] = useState(false);

  const waterCalcPreview = calcWater(equip, 3);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.body, color: T.ink, paddingBottom: mobile ? 68 : 40 }}>
      {equipOpen && (
        <EquipModal
          equip={equip}
          onChange={setEquip}
          onClose={() => setEquipOpen(false)}
          waterCalc={waterCalcPreview}
        />
      )}
      <Header mobile={mobile} onOpenEquip={() => setEquipOpen(true)} />
      <main style={{ padding: mobile ? '12px 12px' : '20px 28px', maxWidth: 1280, margin: '0 auto' }}>
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
