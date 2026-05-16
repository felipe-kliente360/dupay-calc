'use client';
import { T } from '@/lib/tokens';
import { TabId } from '@/lib/types';
import { useApp } from '@/lib/context';
import { DupayLogo } from '@/components/ui/DupayLogo';

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

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${T.b1}`,
      boxShadow: '0 1px 16px rgba(0,0,0,.06)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: mobile ? '10px 16px' : '0 36px',
        height: mobile ? 'auto' : 64,
        gap: 16,
      }}>

        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <DupayLogo size={mobile ? 36 : 44} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: 2.5, color: T.amber, textTransform: 'uppercase', fontWeight: 500 }}>Cervecería</span>
            <span style={{ fontFamily: T.serif, fontSize: mobile ? 20 : 24, fontWeight: 700, color: T.ink, letterSpacing: -0.5, marginTop: 1 }}>Dupay</span>
          </div>
        </div>

        {/* Nav desktop — pill capsule */}
        {!mobile && (
          <nav style={{ display: 'flex', gap: 2, background: T.bgMuted, borderRadius: 12, padding: 4, border: `1px solid ${T.b1}` }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  background: active ? T.bgCard : 'transparent',
                  border: active ? `1px solid ${T.b1}` : '1px solid transparent',
                  borderRadius: 9,
                  color: active ? T.amber : T.inkMuted,
                  padding: '7px 15px',
                  cursor: 'pointer',
                  fontFamily: T.mono,
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  transition: 'all .18s',
                  boxShadow: active ? '0 1px 6px rgba(0,0,0,.08)' : 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {t.icon} {t.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Equip button desktop */}
        {!mobile && (
          <button onClick={onOpenEquip} style={{
            background: T.bgAmber,
            border: `1px solid ${T.b2}`,
            color: T.amber,
            borderRadius: 10,
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: T.mono,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 0.4,
            display: 'flex', alignItems: 'center', gap: 5,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            ⚙ Equipamento
          </button>
        )}

        {/* Mobile equip button */}
        {mobile && (
          <button onClick={onOpenEquip} style={{
            background: 'none', border: `1px solid ${T.b2}`, color: T.inkMuted,
            borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
            fontFamily: T.mono, fontSize: 10, flexShrink: 0,
          }}>⚙</button>
        )}
      </div>
    </header>
  );
}
