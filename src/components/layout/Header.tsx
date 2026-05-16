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

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${T.b1}`,
      boxShadow: '0 1px 16px rgba(0,0,0,.06)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: mobile ? '12px 16px' : '0 36px',
        height: mobile ? 'auto' : 68,
        gap: 16,
      }}>

        {/* Marca */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, lineHeight: 1 }}>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: 3, color: T.amber, textTransform: 'uppercase', fontWeight: 500 }}>Cervecería</span>
          <span style={{ fontFamily: T.serif, fontSize: mobile ? 22 : 28, fontWeight: 700, color: T.ink, letterSpacing: -0.5 }}>Dupay</span>
          <span style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: 1.5, color: T.inkDim, marginTop: 1 }}>Est. 2021</span>
        </div>

        {/* Nav desktop — pill capsule */}
        {!mobile && (
          <div style={{ display: 'flex', gap: 2, background: T.bgMuted, borderRadius: 12, padding: 4, border: `1px solid ${T.b1}` }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  background: active ? T.bgCard : 'transparent',
                  border: active ? `1px solid ${T.b1}` : '1px solid transparent',
                  borderRadius: 9,
                  color: active ? T.amber : T.inkMuted,
                  padding: '7px 16px',
                  cursor: 'pointer',
                  fontFamily: T.mono,
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  transition: 'all .18s',
                  boxShadow: active ? '0 1px 6px rgba(0,0,0,.08)' : 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Botão equip */}
        {!mobile && (
          <button onClick={onOpenEquip} style={{
            background: T.bgAmber,
            border: `1px solid ${T.b2}`,
            color: T.amber,
            borderRadius: 10,
            padding: '9px 18px',
            cursor: 'pointer',
            fontFamily: T.mono,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 0.5,
            display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,.05)',
            transition: 'box-shadow .18s',
          }}>
            ⚙ Equipamento
          </button>
        )}

        {/* Mobile: botão equip compacto */}
        {mobile && (
          <button onClick={onOpenEquip} style={{
            background: 'none',
            border: `1px solid ${T.b2}`,
            color: T.inkMuted,
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            fontFamily: T.mono,
            fontSize: 10,
          }}>
            ⚙
          </button>
        )}
      </div>
    </header>
  );
}
