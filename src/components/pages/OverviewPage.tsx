'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Clock, Activity,
  CheckCircle2, AlertCircle, Play, Search, Workflow, Plus, Timer,
} from 'lucide-react';
import Card, { CardHeader } from '@/components/shared/Card';
import StatusPill from '@/components/shared/StatusPill';
import ProgressBar from '@/components/shared/ProgressBar';
import { useOngoing } from '@/lib/hooks/useOngoing';
import { useActivity } from '@/lib/hooks/useActivity';
import type { ActivityType } from '@/lib/types';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function OverviewPage() {
  const router = useRouter();
  const { tasks: ongoingTasks } = useOngoing();
  const { events: activityEvents } = useActivity();

  const recentActivity = (activityEvents ?? []).slice(0, 5);
  const currentTask = (ongoingTasks ?? []).find((t) => t.state !== 'completed' && t.state !== 'queued');

  const activityEmojis: Record<string, string> = {
    browser: '\u{1F310}', message: '\u{1F4AC}', workflow: '\u26A1',
    file: '\u{1F4C4}', error: '\u{1F6A8}', task: '\u2705',
    memory: '\u{1F9E0}', integration: '\u{1F50C}', pipeline: '\u{1F3AC}',
    schedule: '\u{1F4C5}', journal: '\u{1F4D3}',
  };

  const nav = (path: string) => router.push(path);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-5"
      style={{ gridTemplateColumns: '1fr 1fr 340px' }}
    >
      {/* Row 1: Agent Status */}
      <motion.div variants={item} className="col-span-2">
        <Card padding="lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="breathe flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: 'var(--success-light)' }}
              >
                <span className="text-[22px] leading-none">{'\u26A1'}</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-heading">OpenClaw is Active</h2>
                  <StatusPill variant="online" showDot size="md" />
                </div>
                <p className="mt-1 text-caption">
                  {(ongoingTasks ?? []).length > 0
                    ? `${(ongoingTasks ?? []).length} tasks in progress.`
                    : '\u{1F680} Ready and waiting. Status will appear once your agent starts working.'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-quaternary)' }}>
                Active Tasks
              </div>
              <div className="mt-0.5 text-[22px] font-semibold tabular-nums tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {(ongoingTasks ?? []).filter((t) => t.state !== 'completed' && t.state !== 'queued' && t.state !== 'failed').length}
              </div>
            </div>
          </div>

          {/* Now Doing */}
          {currentTask ? (
            <div
              className="mt-5 rounded-xl border p-4"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[14px] leading-none">{'\u2728'}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  Now Doing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                    {currentTask.title}
                  </div>
                  <div className="mt-1 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    {currentTask.currentStep}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill variant={currentTask.state} showDot />
                  <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                    {currentTask.progress}%
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar progress={currentTask.progress} color="var(--accent)" />
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}>
              <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>{'\u2728'} All clear — no tasks running right now.</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Row 1: Quick Actions */}
      <motion.div variants={item}>
        <Card padding="lg" className="h-full">
          <CardHeader title="Quick Actions" />
          <div className="flex flex-col gap-2">
            {[
              { icon: Plus, label: 'Add to Pipeline', color: 'var(--accent)', bg: 'var(--accent-light)', href: '/pipeline' },
              { icon: Search, label: 'Search Journal', color: 'var(--purple)', bg: 'var(--purple-light)', href: '/journal' },
              { icon: Play, label: 'Run Workflow', color: 'var(--success)', bg: 'var(--success-light)', href: '/workflows' },
              { icon: Activity, label: 'Review Logs', color: 'var(--orange)', bg: 'var(--orange-light)', href: '/activity' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => nav(action.href)}
                className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all hover:shadow-sm"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: action.bg }}
                >
                  <action.icon size={16} style={{ color: action.color }} />
                </div>
                <span className="flex-1 text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  {action.label}
                </span>
                <ArrowUpRight size={14} style={{ color: 'var(--text-quaternary)' }} />
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Row 2: Recent Activity */}
      <motion.div variants={item} className="col-span-3">
        <Card padding="lg">
          <CardHeader
            title="Recent Activity"
            action={
              <button
                onClick={() => nav('/activity')}
                className="text-[12px] font-medium"
                style={{ color: 'var(--accent)' }}
              >
                View all
              </button>
            }
          />
          <div className="flex flex-col">
            {recentActivity.length === 0 ? (
              <p className="py-6 text-center text-[13px]" style={{ color: 'var(--text-tertiary)' }}>{'\u{1F4E1}'} Waiting for first activity. Events will stream here as your agent works.</p>
            ) : (
              recentActivity.map((event, i) => {
                const emoji = activityEmojis[event.type] || '\u26A1';
                const typeColors: Record<string, string> = {
                  browser: 'var(--accent)', message: 'var(--success)',
                  workflow: 'var(--purple)', file: 'var(--teal)',
                  error: 'var(--error)', task: 'var(--indigo)',
                  memory: 'var(--orange)', integration: 'var(--success)',
                  pipeline: 'var(--accent)', schedule: 'var(--warning)',
                  journal: 'var(--purple)',
                };
                const typeBgs: Record<string, string> = {
                  browser: 'var(--accent-light)', message: 'var(--success-light)',
                  workflow: 'var(--purple-light)', file: 'var(--teal-light)',
                  error: 'var(--error-light)', task: 'var(--indigo-light)',
                  memory: 'var(--orange-light)', integration: 'var(--success-light)',
                  pipeline: 'var(--accent-light)', schedule: 'var(--warning-light)',
                  journal: 'var(--purple-light)',
                };
                return (
                  <div key={event.id}>
                    <div className="flex items-start gap-3 py-2.5">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: typeBgs[event.type] }}
                      >
                        <span className="text-[14px] leading-none">{emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                          {event.title}
                        </div>
                        <div className="text-[12px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                          {event.description}
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] tabular-nums" style={{ color: 'var(--text-quaternary)' }}>
                        {event.timestamp}
                      </span>
                    </div>
                    {i < recentActivity.length - 1 && (
                      <div className="ml-10" style={{ borderBottom: '1px solid var(--divider)' }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
