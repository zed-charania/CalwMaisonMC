'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
} from 'lucide-react';
import Card from '@/components/shared/Card';
import { useActivity } from '@/lib/hooks/useActivity';
import type { ActivityType } from '@/lib/types';

type FilterOption = 'all' | ActivityType;

const filters: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'all' },
  { label: 'Browser', value: 'browser' },
  { label: 'Messages', value: 'message' },
  { label: 'Workflows', value: 'workflow' },
  { label: 'Files', value: 'file' },
  { label: 'Errors', value: 'error' },
];

const typeEmojis: Record<ActivityType, string> = {
  browser: '\u{1F310}',
  message: '\u{1F4AC}',
  workflow: '\u26A1',
  file: '\u{1F4C4}',
  error: '\u{1F6A8}',
  task: '\u2705',
  memory: '\u{1F9E0}',
  integration: '\u{1F50C}',
  pipeline: '\u{1F3AC}',
  schedule: '\u{1F4C5}',
  journal: '\u{1F4D3}',
};

const typeColors: Record<ActivityType, string> = {
  browser: 'var(--accent)',
  message: 'var(--success)',
  workflow: 'var(--purple)',
  file: 'var(--teal)',
  error: 'var(--error)',
  task: 'var(--indigo)',
  memory: 'var(--orange)',
  integration: 'var(--success)',
  pipeline: 'var(--accent)',
  schedule: 'var(--warning)',
  journal: 'var(--purple)',
};

const typeBgs: Record<ActivityType, string> = {
  browser: 'var(--accent-light)',
  message: 'var(--success-light)',
  workflow: 'var(--purple-light)',
  file: 'var(--teal-light)',
  error: 'var(--error-light)',
  task: 'var(--indigo-light)',
  memory: 'var(--orange-light)',
  integration: 'var(--success-light)',
  pipeline: 'var(--accent-light)',
  schedule: 'var(--warning-light)',
  journal: 'var(--purple-light)',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ActivityPage() {
  const { events: activityEvents } = useActivity();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const allEvents = activityEvents ?? [];
  const filteredEvents =
    activeFilter === 'all'
      ? allEvents
      : allEvents.filter((e) => e.type === activeFilter);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Page header */}
      <motion.div variants={item}>
        <h1 className="text-title">Activity</h1>
        <p className="mt-1 text-caption">
          A chronological log of everything OpenClaw has done.
        </p>
      </motion.div>

      {/* Filter bar */}
      <motion.div variants={item}>
        <Card padding="sm">
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: 'var(--text-tertiary)', marginRight: 4 }} />
            {filters.map((f) => {
              const isActive = activeFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all"
                  style={{
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={item}>
        <Card padding="lg">
          {/* Today header */}
          <div className="mb-5 flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              Today
            </span>
            <div
              className="flex-1"
              style={{ height: 1, background: 'var(--divider)' }}
            />
            <span className="text-[12px]" style={{ color: 'var(--text-quaternary)' }}>
              {filteredEvents.length} events
            </span>
          </div>

          {/* Timeline items */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div
              className="absolute top-4 bottom-4"
              style={{
                left: 87,
                width: 1,
                background: 'var(--divider)',
              }}
            />

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              {filteredEvents.map((event) => {
                const emoji = typeEmojis[event.type];
                const color = typeColors[event.type];
                const bg = typeBgs[event.type];

                return (
                  <motion.div
                    key={event.id}
                    variants={item}
                    className="group relative flex gap-4 py-3"
                  >
                    {/* Timestamp column */}
                    <div
                      className="w-[52px] shrink-0 text-right text-[11px] tabular-nums leading-tight"
                      style={{ color: 'var(--text-quaternary)', paddingTop: 10 }}
                    >
                      {event.timestamp}
                    </div>

                    {/* Icon with z-index to overlay the connecting line */}
                    <div
                      className="relative z-10 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl"
                      style={{ background: bg }}
                    >
                      <span className="text-[16px] leading-none">{emoji}</span>
                    </div>

                    {/* Content */}
                    <div
                      className="flex-1 rounded-xl border px-4 py-3 transition-all"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--bg-secondary)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[13px] font-medium"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {event.title}
                          </div>
                          <div
                            className="mt-0.5 text-[12px]"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {event.description}
                          </div>
                        </div>
                        <span
                          className="shrink-0 text-[11px] tabular-nums"
                          style={{ color: 'var(--text-quaternary)' }}
                        >
                          {event.timestamp}
                        </span>
                      </div>

                      {/* Type label */}
                      <div className="mt-2">
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{ background: bg, color }}
                        >
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Empty state */}
            {filteredEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'var(--divider)' }}
                >
                  <Filter size={20} style={{ color: 'var(--text-quaternary)' }} />
                </div>
                <p
                  className="mt-3 text-[14px] font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {allEvents.length === 0 ? '\u{1F4E1} No activity yet. Everything your agent does will be logged here.' : 'No events match this filter.'}
                </p>
                {allEvents.length > 0 && (
                  <p className="mt-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                    Try selecting a different filter.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
