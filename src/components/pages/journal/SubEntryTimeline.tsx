'use client';

import type { JournalSubEntry, SubEntryType } from '@/lib/types';

const typeConfig: Record<SubEntryType, { color: string; bg: string; label: string }> = {
  decision: { color: 'var(--purple)', bg: 'var(--purple-light)', label: 'Decision' },
  issue: { color: 'var(--error)', bg: 'var(--error-light)', label: 'Issue' },
  action: { color: 'var(--accent)', bg: 'var(--accent-light)', label: 'Action' },
  observation: { color: 'var(--teal)', bg: 'var(--teal-light)', label: 'Observation' },
  note: { color: 'var(--text-tertiary)', bg: 'var(--neutral-subtle)', label: 'Note' },
};

interface SubEntryTimelineProps {
  subEntries: JournalSubEntry[];
}

export default function SubEntryTimeline({ subEntries }: SubEntryTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute top-2 bottom-2"
        style={{ left: 5, width: 2, background: 'var(--divider)', borderRadius: 1 }}
      />

      <div className="flex flex-col gap-4">
        {subEntries.map((sub) => {
          const config = typeConfig[sub.entryType] || typeConfig.note;
          const time = new Date(sub.createdAt);
          const formatted = time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <div key={sub.id} className="relative flex gap-4 pl-0">
              {/* Dot */}
              <div
                className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full"
                style={{
                  background: config.color,
                  boxShadow: `0 0 0 3px var(--bg-secondary)`,
                }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.label}
                  </span>
                  <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-quaternary)' }}>
                    {formatted}
                  </span>
                </div>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {sub.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
