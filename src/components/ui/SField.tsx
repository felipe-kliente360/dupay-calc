'use client';
import { T } from '@/lib/tokens';
import { ReactNode } from 'react';

export function SField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
