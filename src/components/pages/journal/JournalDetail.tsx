'use client';

import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { useJournalEntry } from '@/lib/hooks/useJournal';
import SubEntryTimeline from './SubEntryTimeline';
import type { Agent } from '@/lib/types';

interface JournalDetailProps {
  entryId: string;
  agentMap: Map<string, Agent>;
}

export default function JournalDetail({ entryId, agentMap }: JournalDetailProps) {
  const { entry, isLoading } = useJournalEntry(entryId);

  if (isLoading || !entry) {
    return (
      <div
        className="flex h-full items-center justify-center rounded-2xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
      >
        <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>Loading...</span>
      </div>
    );
  }

  const agent = entry.agentId ? agentMap.get(entry.agentId) : undefined;
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      key={entryId}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="flex h-full flex-col rounded-2xl"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div className="border-b px-6 py-5" style={{ borderColor: 'var(--divider)' }}>
        <h2 className="text-heading">{entry.title}</h2>

        <div className="mt-3 flex items-center gap-4 flex-wrap">
          {agent && (
            <div className="flex items-center gap-2">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ background: agent.avatarColor, color: '#fff' }}
              >
                {agent.name.charAt(0)}
              </div>
              <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {agent.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Calendar size={12} style={{ color: 'var(--text-quaternary)' }} />
            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin' }}>
        {/* Summary */}
        {entry.summary && (
          <div
            className="mb-5 rounded-xl border-l-[3px] px-4 py-3"
            style={{
              borderColor: 'var(--accent)',
              background: 'var(--accent-light)',
            }}
          >
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {entry.summary}
            </p>
          </div>
        )}

        {/* Markdown-ish content */}
        {entry.content && (
          <div
            className="text-[14px] leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--text-primary)' }}
          >
            {entry.content}
          </div>
        )}

        {/* Sub-entries timeline */}
        {entry.subEntries && entry.subEntries.length > 0 && (
          <div className="mt-8">
            <div className="mb-4">
              <span className="text-label">Timeline</span>
            </div>
            <SubEntryTimeline subEntries={entry.subEntries} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
