'use client';
import { T } from '@/lib/tokens';
import { TabId } from '@/lib/types';
import { useApp } from '@/lib/context';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'calculator', icon: '⚗️',  label: 'Calculadora' },
  { id: 'references', icon: '🍺',  label: 'Referências' },
  { id: 'styles',     icon: '📖',  label: 'Estilos'     },
  { id: 'insumos',    icon: '🧪',  label: 'Insumos'     },
];

interface HeaderProps {
  mobile: boolean;
  onOpenEquip: () => void;
}

export function Header({ mobile, onOpenEquip }: HeaderProps) {
  const { activeTab, setActiveTab } = useApp();

  const navBtn = (active: boolean) => ({
    background: 'none' as const,
    border: 'none' as const,
    borderBottom: active ? `2px solid ${T.amber}` : '2px solid transparent',
    color: active ? T.amber : T.inkMuted,
    padding: '10px 18px',
    cursor: 'pointer' as const,
    fontFamily: T.mono,
    fontWeight: 500,
    fontSize: 12,
    letterSpacing: .8,
    textTransform: 'uppercase' as const,
    transition: 'color .2s,border-color .2s',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 200, background: `${T.bgCard}F5`, backdropFilter: 'blur(14px)', borderBottom: `1px solid ${T.b1}`, boxShadow: '0 1px 8px rgba(0,0,0,.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: mobile ? '10px 14px' : '10px 28px', borderBottom: `1px solid ${T.b1}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: mobile ? 20 : 26 }}>🍺</span>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: mobile ? 16 : 22, fontWeight: 700, color: T.ink, lineHeight: 1 }}>
              Dupay
              <span style={{ fontWeight: 400, color: T.inkMuted, marginLeft: 5, fontSize: mobile ? 14 : 18 }}>Cervecería</span>
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim, marginTop: 1, letterSpacing: 1.5 }}>Est. 2021 · Santiago, Chile</div>
          </div>
        </div>
        {!mobile && (
          <button onClick={onOpenEquip} style={{ background: T.bgAmber, border: `1px solid ${T.b2}`, color: T.amber, borderRadius: 7, padding: '7px 14px', cursor: 'pointer', fontFamily: T.mono, fontSize: 11, fontWeight: 500, letterSpacing: .5, display: 'flex', alignItems: 'center', gap: 6 }}>
            ⚙ Equipamento
          </button>
        )}
      </div>
      {!mobile && (
        <div style={{ display: 'flex', padding: '0 24px' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={navBtn(activeTab === t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
