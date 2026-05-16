'use client';
import { T } from '@/lib/tokens';
import { GrainEntry, HopEntry } from '@/lib/types';
import { useApp } from '@/lib/context';
import { BJCP_STYLES } from '@/data/bjcp-styles';
import { useBrewdogApi } from './useBrewdogApi';
import { ReferenceCard } from './ReferenceCard';
import { useEffect } from 'react';
import { useWidth } from '@/hooks/useWidth';

export function References() {
  const { styleId, setStyleId, setGrains, setHops, setActiveTab, equip } = useApp();
  const { beers, loading, error, fetchForStyle, reset } = useBrewdogApi();
  const vw = useWidth();
  const mobile = vw < 640;

  const style = BJCP_STYLES.find(s => s.id === styleId);

  useEffect(() => {
    if (style) {
      reset();
      fetchForStyle(style);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleId]);

  const handleLoad = (grains: GrainEntry[], hops: HopEntry[]) => {
    setGrains(grains);
    setHops(hops);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sel = { background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 7, color: T.ink, padding: '9px 12px', fontSize: 13, fontFamily: T.body, width: '100%', outline: 'none', cursor: 'pointer' };

  return (
    <div>
      <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.b1}`, padding: 16, marginBottom: 16 }}>
        <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 10 }}>🍺 Receitas de Referência</div>
        <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
          Busca na Punk API (BrewDog) receitas que se encaixam nos parâmetros BJCP do estilo selecionado. Clique em <b>Carregar</b> para popular a calculadora.
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Estilo BJCP</div>
            <select value={styleId} onChange={e => setStyleId(e.target.value)} style={sel}>
              {BJCP_STYLES.map(s => <option key={s.id} value={s.id}>{s.id} – {s.name}</option>)}
            </select>
          </div>
          <button
            onClick={() => { if (style) { reset(); fetchForStyle(style); } }}
            disabled={loading}
            style={{ background: loading ? T.bgMuted : `linear-gradient(135deg,${T.amber},${T.amberD})`, border: 'none', color: loading ? T.inkDim : 'white', padding: '10px 18px', borderRadius: 8, cursor: loading ? 'default' : 'pointer', fontFamily: T.mono, fontWeight: 500, fontSize: 12, flexShrink: 0 }}
          >
            {loading ? '⏳ Buscando…' : '🔍 Buscar'}
          </button>
        </div>
        {style && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.inkDim }}>Filtrando por:</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.amber }}>IBU {style.ibu[0]}–{style.ibu[1]}</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.ok }}>ABV {style.abv[0]}–{style.abv[1]}%</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.amber }}>OG {style.og[0]}–{style.og[1]}</span>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: `1px solid ${T.ng}40`, borderRadius: 10, padding: '14px 16px', marginBottom: 16, fontFamily: T.body, color: T.ng, fontSize: 13 }}>
          ⚠️ {error} — A Punk API pode estar fora do ar. Tente novamente mais tarde.
        </div>
      )}

      {!loading && !error && beers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: T.body, color: T.inkMuted, fontSize: 14 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🍺</div>
          {style ? 'Nenhuma receita encontrada para este estilo.' : 'Selecione um estilo para buscar receitas.'}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: T.mono, color: T.inkMuted, fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
          Consultando Punk API…
        </div>
      )}

      {beers.length > 0 && (
        <>
          <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 10, letterSpacing: 1, marginBottom: 12 }}>
            {beers.length} receita{beers.length !== 1 ? 's' : ''} encontrada{beers.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill,minmax(${mobile ? 280 : 340}px,1fr))`, gap: 12 }}>
            {beers.map(beer => (
              <ReferenceCard key={beer.id} beer={beer} equip={equip} onLoad={handleLoad} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
