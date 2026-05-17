'use client';
import { T } from '@/lib/tokens';
import { TabId } from '@/lib/types';
import { useApp } from '@/lib/context';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'calculator', icon: '⚗️', label: 'Calc.' },
  { id: 'references', icon: '🍺', label: 'Ref.'  },
  { id: 'styles',     icon: '📖', label: 'Estilos'},
  { id: 'insumos',    icon: '🧪', label: 'Insumos'},
];

export function BottomNav({ onOpenEquip }: { onOpenEquip: () => void }) {
  const { activeTab, setActiveTab } = useApp();

  const btn = (active: boolean) => ({
    flex: 1,
    background: 'none' as const,
    border: 'none' as const,
    color: active ? T.amber : T.inkMuted,
    padding: '8px 0 6px',
    cursor: 'pointer' as const,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: 3,
    transition: 'color .18s',
  });

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300,
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${T.b1}`,
      display: 'flex',
      boxShadow: '0 -2px 16px rgba(0,0,0,.07)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(t => {
        const active = activeTab === t.id;
        return (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={btn(active)}>
            <div style={{
              background: active ? `${T.amber}18` : 'transparent',
              borderRadius: 8,
              padding: '4px 12px',
              transition: 'background .18s',
            }}>
              <span style={{ fontSize: 16, display: 'block', textAlign: 'center' }}>{t.icon}</span>
            </div>
            <span style={{ fontFamily: T.mono, fontSize: 8, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase' as const }}>{t.label}</span>
          </button>
        );
      })}
      <button onClick={onOpenEquip} style={btn(false)}>
        <div style={{ background: 'transparent', borderRadius: 8, padding: '4px 12px' }}>
          <span style={{ fontSize: 16, display: 'block', textAlign: 'center' }}>⚙️</span>
        </div>
        <span style={{ fontFamily: T.mono, fontSize: 8, fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase' as const }}>Equip.</span>
      </button>
    </nav>
  );
}
