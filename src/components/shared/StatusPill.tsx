'use client';

import type { AgentStatus, TaskStatus, OngoingTaskState, IntegrationStatus } from '@/lib/types';

type PillVariant = AgentStatus | TaskStatus | OngoingTaskState | IntegrationStatus | 'default';

const variantStyles: Record<string, { bg: string; color: string; dot?: string }> = {
  online: { bg: 'var(--success-light)', color: 'var(--success)', dot: 'var(--success)' },
  active: { bg: 'var(--accent-light)', color: 'var(--accent)', dot: 'var(--accent)' },
  idle: { bg: 'var(--warning-light)', color: 'var(--warning)', dot: 'var(--warning)' },
  blocked: { bg: 'var(--error-light)', color: 'var(--error)', dot: 'var(--error)' },
  offline: { bg: 'var(--neutral-subtle)', color: 'var(--text-tertiary)' },
  inbox: { bg: 'var(--neutral-subtle)', color: 'var(--text-secondary)' },
  planned: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  running: { bg: 'var(--purple-light)', color: 'var(--purple)', dot: 'var(--purple)' },
  waiting: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  done: { bg: 'var(--success-light)', color: 'var(--success)' },
  thinking: { bg: 'var(--purple-light)', color: 'var(--purple)', dot: 'var(--purple)' },
  waiting_input: { bg: 'var(--warning-light)', color: 'var(--warning)', dot: 'var(--warning)' },
  browser_running: { bg: 'var(--accent-light)', color: 'var(--accent)', dot: 'var(--accent)' },
  executing: { bg: 'var(--indigo-light)', color: 'var(--indigo)', dot: 'var(--indigo)' },
  completed: { bg: 'var(--success-light)', color: 'var(--success)' },
  failed: { bg: 'var(--error-light)', color: 'var(--error)' },
  queued: { bg: 'var(--neutral-subtle)', color: 'var(--text-tertiary)' },
  connected: { bg: 'var(--success-light)', color: 'var(--success)' },
  disconnected: { bg: 'var(--neutral-subtle)', color: 'var(--text-tertiary)' },
  syncing: { bg: 'var(--accent-light)', color: 'var(--accent)', dot: 'var(--accent)' },
  error: { bg: 'var(--error-light)', color: 'var(--error)' },
  default: { bg: 'var(--neutral-subtle)', color: 'var(--text-secondary)' },
};

const labelMap: Record<string, string> = {
  waiting_input: 'Waiting for Input',
  browser_running: 'Browser Active',
  online: 'Online',
  active: 'Active',
  idle: 'Idle',
  blocked: 'Blocked',
  offline: 'Offline',
  inbox: 'Inbox',
  planned: 'Planned',
  running: 'Running',
  waiting: 'Waiting',
  done: 'Done',
  thinking: 'Thinking',
  executing: 'Executing',
  completed: 'Completed',
  failed: 'Failed',
  queued: 'Queued',
  connected: 'Connected',
  disconnected: 'Disconnected',
  syncing: 'Syncing',
  error: 'Error',
};

interface StatusPillProps {
  variant: PillVariant;
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export default function StatusPill({ variant, label, showDot = false, size = 'sm' }: StatusPillProps) {
  const style = variantStyles[variant] || variantStyles.default;
  const displayLabel = label || labelMap[variant] || variant;
  const isSm = size === 'sm';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-medium"
      style={{
        background: style.bg,
        color: style.color,
        padding: isSm ? '2px 8px' : '3px 10px',
        fontSize: isSm ? '11px' : '12px',
      }}
    >
      {showDot && style.dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${variant === 'online' || variant === 'active' || variant === 'thinking' || variant === 'browser_running' || variant === 'executing' || variant === 'syncing' ? 'pulse-dot' : ''}`}
          style={{ background: style.dot }}
        />
      )}
      {displayLabel}
    </span>
  );
}
