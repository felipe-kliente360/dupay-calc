'use client';
import { T } from '@/lib/tokens';
import { inRange } from '@/lib/brewing-math';

interface GaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  dec?: number;
}

export function Gauge({ label, value, min, max, unit = '', dec = 1 }: GaugeProps) {
  const pad = (max - min) * 0.8;
  const lo = min - pad;
  const hi = max + pad;
  const span = hi - lo;
  const toP = (v: number) => Math.max(0, Math.min(100, ((v - lo) / span) * 100));
  const ok = inRange(value, min, max);
  const col = ok ? T.ok : T.ng;
  const fmt = (v: number) => dec === 3 ? v.toFixed(3) : dec === 0 ? String(Math.round(v)) : v.toFixed(dec);
  const minP = toP(min);
  const maxP = toP(max);
  const valP = toP(value);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 }}>
        <span style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 500, flexShrink: 0 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim, background: T.bgMuted, border: `1px solid ${T.b1}`, borderRadius: 4, padding: '1px 6px', whiteSpace: 'nowrap' }}>
            {fmt(min)}–{fmt(max)}{unit}
          </span>
          <span style={{ fontFamily: T.mono, color: col, fontSize: 14, fontWeight: 600, minWidth: 50, textAlign: 'right' }}>
            {fmt(value)}{unit && ` ${unit}`}
          </span>
          <span style={{ fontSize: 11, color: col, fontWeight: 700, width: 12 }}>{ok ? '✓' : '✗'}</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: 10, background: T.bgMuted, borderRadius: 5, border: `1px solid ${T.b1}` }}>
        <div style={{
          position: 'absolute', top: 0, height: '100%',
          background: ok ? `linear-gradient(90deg,${T.ok}25,${T.ok}40)` : `linear-gradient(90deg,${T.amber}20,${T.amber}35)`,
          borderLeft: `2px solid ${ok ? T.ok : T.amber}70`,
          borderRight: `2px solid ${ok ? T.ok : T.amber}70`,
          left: `${minP}%`, width: `${maxP - minP}%`, borderRadius: 3,
        }} />
        <div style={{ position: 'absolute', top: -4, left: `${minP}%`, width: 1.5, height: 18, background: `${ok ? T.ok : T.amber}99`, transform: 'translateX(-50%)', borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: -4, left: `${maxP}%`, width: 1.5, height: 18, background: `${ok ? T.ok : T.amber}99`, transform: 'translateX(-50%)', borderRadius: 1 }} />
        <div style={{
          position: 'absolute', top: -5, width: 5, height: 20, borderRadius: 2.5,
          background: col, left: `calc(${valP}% - 2.5px)`,
          boxShadow: `0 1px 8px ${col}AA`,
          transition: 'left .35s cubic-bezier(.4,0,.2,1)', zIndex: 2,
        }} />
      </div>
      <div style={{ position: 'relative', height: 14, marginTop: 3 }}>
        <span style={{ position: 'absolute', left: `${minP}%`, transform: 'translateX(-50%)', fontFamily: T.mono, color: T.inkDim, fontSize: 8, whiteSpace: 'nowrap' }}>{fmt(min)}</span>
        <span style={{ position: 'absolute', left: `${maxP}%`, transform: 'translateX(-50%)', fontFamily: T.mono, color: T.inkDim, fontSize: 8, whiteSpace: 'nowrap' }}>{fmt(max)}</span>
      </div>
    </div>
  );
}
