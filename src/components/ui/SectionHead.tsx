'use client';
import { T } from '@/lib/tokens';
import { ReactNode } from 'react';

interface SectionHeadProps {
  title: string;
  info?: string;
  controls?: ReactNode;
}

export function SectionHead({ title, info, controls }: SectionHeadProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
      <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {title}
        {info && <span style={{ fontFamily: T.mono, fontWeight: 400, fontSize: 11, color: T.inkMuted }}>{info}</span>}
      </div>
      {controls && <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>{controls}</div>}
    </div>
  );
}
