'use client';
import { T } from '@/lib/tokens';
import { useState, useEffect, useRef } from 'react';

interface NumInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  small?: boolean;
}

export function NumInput({ value, onChange, min = 0, max, step = 1, unit, small = false }: NumInputProps) {
  const [raw, setRaw] = useState(String(value ?? ''));
  const ref = useRef(value);

  useEffect(() => {
    if (value !== ref.current) {
      ref.current = value;
      setRaw(String(value ?? ''));
    }
  }, [value]);

  const commit = (s: string) => {
    const n = parseFloat(s.replace(',', '.'));
    if (!isNaN(n)) {
      const clamped = max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n);
      ref.current = clamped;
      setRaw(String(clamped));
      onChange(clamped);
    } else {
      setRaw(String(ref.current));
    }
  };

  const fs = small ? 12 : 14;
  const py = small ? '5px' : '8px';

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        inputMode="decimal"
        value={raw}
        onFocus={e => e.target.select()}
        onChange={e => setRaw(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') commit((e.target as HTMLInputElement).value);
          if (e.key === 'ArrowUp') { const n = parseFloat(raw.replace(',', '.')) || 0; commit(String(parseFloat((n + step).toFixed(6)))); }
          if (e.key === 'ArrowDown') { const n = parseFloat(raw.replace(',', '.')) || 0; commit(String(parseFloat((n - step).toFixed(6)))); }
        }}
        style={{
          background: T.bgInput,
          border: `1.5px solid ${T.b1}`,
          borderRadius: 6,
          color: T.ink,
          padding: `${py} ${unit ? '32px' : '10px'} ${py} 10px`,
          fontSize: fs,
          fontFamily: T.mono,
          fontWeight: 500,
          width: '100%',
          outline: 'none',
        }}
      />
      {unit && (
        <span style={{ position: 'absolute', right: 8, color: T.inkDim, fontSize: small ? 9 : 10, fontFamily: T.mono, pointerEvents: 'none' }}>
          {unit}
        </span>
      )}
    </div>
  );
}
