'use client';

import type { PipelineItem, Agent } from '@/lib/types';
import PlatformIcon from '@/components/shared/PlatformIcon';

interface PipelineCardProps {
  item: PipelineItem;
  agent?: Agent;
  index: number;
}

export default function PipelineCard({ item, agent }: PipelineCardProps) {
  const initial = agent?.name?.charAt(0)?.toUpperCase() ?? '';

  return (
    <div
      className="rounded-xl border transition-shadow hover:shadow-sm"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-xs)',
        padding: '12px',
        cursor: 'grab',
      }}
    >
      {/* Title */}
      <div
        className="text-[14px] font-semibold leading-snug"
        style={{ color: 'var(--text-primary)' }}
      >
        {item.title}
      </div>

      {/* Description */}
      {item.description && (
        <div
          className="mt-1 text-[12px] leading-relaxed line-clamp-2"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {item.description}
        </div>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                background: 'var(--neutral-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Platform icon + Agent avatar */}
      <div className="mt-2.5 flex items-center justify-between">
        <PlatformIcon platform={item.platform} size={14} />

        {agent && (
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{
              background: agent.avatarColor,
              color: 'var(--text-on-accent)',
            }}
            title={agent.name}
          >
            {initial}
          </div>
        )}
      </div>
    </div>
  );
}
