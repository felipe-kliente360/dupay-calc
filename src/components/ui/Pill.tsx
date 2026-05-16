'use client';
import { T } from '@/lib/tokens';
import { CSSProperties, ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  color?: string;
  bg?: string;
}

export function Pill({ children, color = T.amber, bg }: PillProps) {
  const style: CSSProperties = {
    background: bg || color + '18',
    color,
    border: `1px solid ${color}40`,
    borderRadius: 20,
    padding: '2px 9px',
    fontSize: 10,
    fontFamily: T.mono,
    fontWeight: 500,
    whiteSpace: 'nowrap',
  };
  return <span style={style}>{children}</span>;
}
