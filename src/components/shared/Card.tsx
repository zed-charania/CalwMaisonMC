'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

const paddings = {
  sm: '16px',
  md: '20px',
  lg: '24px',
};

export default function Card({ children, className = '', padding = 'md', hoverable = false, onClick }: CardProps) {
  return (
    <div
      className={`card ${hoverable ? 'card-hover cursor-pointer' : ''} ${className}`}
      style={{ padding: paddings[padding] }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action, subtitle }: { title: string; action?: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-subheading">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
