'use client';
import { T } from '@/lib/tokens';
import { TabId } from '@/lib/types';
import { useApp } from '@/lib/context';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'calculator', icon: '⚗️', label: 'Calculadora' },
  { id: 'references', icon: '🍺', label: 'Referências' },
  { id: 'styles',     icon: '📖', label: 'Estilos'     },
  { id: 'insumos',    icon: '🧪', label: 'Insumos'     },
];

export function BottomNav({ onOpenEquip }: { onOpenEquip: () => void }) {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300, background: `${T.bgCard}F8`, backdropFilter: 'blur(12px)', borderTop: `1px solid ${T.b1}`, display: 'flex', boxShadow: '0 -2px 12px rgba(0,0,0,.08)' }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
          flex: 1, background: 'none', border: 'none',
          borderTop: activeTab === t.id ? `2px solid ${T.amber}` : '2px solid transparent',
          color: activeTab === t.id ? T.amber : T.inkMuted,
          padding: '9px 0 7px', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          transition: 'all .2s',
        }}>
          <span style={{ fontSize: 17 }}>{t.icon}</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>{t.label}</span>
        </button>
      ))}
      <button onClick={onOpenEquip} style={{
        flex: .7, background: 'none', border: 'none', borderTop: '2px solid transparent',
        color: T.inkMuted, padding: '9px 0 7px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      }}>
        <span style={{ fontSize: 17 }}>⚙️</span>
        <span style={{ fontFamily: T.mono, fontSize: 8, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Equip.</span>
      </button>
    </nav>
  );
}
